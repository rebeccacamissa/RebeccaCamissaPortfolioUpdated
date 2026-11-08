/* Adam — animated cat site guide + rule-based chat about Rebecca's portfolio.
   No AI service: answers are composed from the site's own data files
   (content.js, projects.js, certificates.js), so they always match the page.

   States (data-state on #adam):
     idle     → ambles along the bottom-right corner
     playful  → cursor nearby: eyes follow, leans toward it, pounces when close
     happy    → just tapped: bounce, hearts, purr
     helping  → chat open: sits attentively beside the speech bubble
     sleeping → after inactivity: curled down, Zzz                                  */
(function (Site) {
  "use strict";
  const { esc, icon, store, motionOK, cvLink, slug, announce, confetti, sections } = Site;

  const INK = "#18181B";

  /* ------------------------------ Artwork ------------------------------ */
  // Original illustration. All parts are classed so CSS can animate states.
  const CAT_SVG = `
    <svg class="adam-svg" viewBox="0 0 120 112" aria-hidden="true" focusable="false">
      <g class="cat-zzz" fill="${INK}" font-family="Space Grotesk, sans-serif" font-weight="700">
        <text class="cat-z1" x="86" y="26" font-size="12">z</text>
        <text class="cat-z2" x="96" y="14" font-size="16">Z</text>
      </g>
      <g class="cat-hearts" fill="#F472B6" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round">
        <path class="cat-heart1" d="M94 20c-1.6-3.6-7.2-2.8-7.2 1.2 0 3.6 7.2 7.6 7.2 7.6s7.2-4 7.2-7.6c0-4-5.6-4.8-7.2-1.2z"/>
        <path class="cat-heart2" d="M22 26c-1.2-2.7-5.4-2.1-5.4.9 0 2.7 5.4 5.7 5.4 5.7s5.4-3 5.4-5.7c0-3-4.2-3.6-5.4-.9z"/>
      </g>
      <text class="cat-purr" x="2" y="52" font-size="10" font-weight="700" font-family="Space Grotesk, sans-serif" fill="${INK}">prrr~</text>

      <g class="cat-figure">
        <g class="cat-tail">
          <path d="M84 94 C106 94 113 72 101 58" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/>
          <path d="M84 94 C106 94 113 72 101 58" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>
        </g>
        <ellipse class="cat-body" cx="60" cy="87" rx="30" ry="21" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
        <path d="M49 76 l4 6 3-6 3 6 3-6 3 6 4-6" fill="none" stroke="#E7E2D6" stroke-width="2" stroke-linejoin="round"/>
        <g class="cat-paws" fill="#fff" stroke="${INK}" stroke-width="2.5">
          <ellipse class="cat-paw-l" cx="47" cy="104" rx="9.5" ry="5.5"/>
          <ellipse class="cat-paw-r" cx="73" cy="104" rx="9.5" ry="5.5"/>
        </g>

        <g class="cat-head">
          <g class="cat-ears" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round">
            <path class="cat-ear-l" d="M37 40 L40 13 L58 31 Z" fill="#fff"/>
            <path class="cat-ear-r" d="M83 40 L80 13 L62 31 Z" fill="#fff"/>
            <path d="M41.5 33 L43 20 L51.5 29.5 Z" fill="#F9A8D4" stroke="none"/>
            <path d="M78.5 33 L77 20 L68.5 29.5 Z" fill="#F9A8D4" stroke="none"/>
          </g>
          <path d="M34 51 C34 33 46 27 60 27 C74 27 86 33 86 51 C86 67 74 75 60 75 C46 75 34 67 34 51 Z"
                fill="#fff" stroke="${INK}" stroke-width="2.5"/>
          <!-- fluffy tufts -->
          <path d="M35 55 l-5 2.5 5 2.5 M85 55 l5 2.5 -5 2.5 M55 29 l2.5 -5 2.5 5 2.5 -5 2.5 5"
                fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
          <ellipse cx="43" cy="60" rx="5" ry="3" fill="#F9A8D4" opacity=".75"/>
          <ellipse cx="77" cy="60" rx="5" ry="3" fill="#F9A8D4" opacity=".75"/>

          <g class="cat-eyes-open">
            <g class="cat-pupils">
              <ellipse cx="49" cy="50" rx="4.4" ry="5.4" fill="${INK}"/>
              <ellipse cx="71" cy="50" rx="4.4" ry="5.4" fill="${INK}"/>
              <circle cx="50.6" cy="48" r="1.5" fill="#fff"/>
              <circle cx="72.6" cy="48" r="1.5" fill="#fff"/>
            </g>
          </g>
          <g class="cat-eyes-closed" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round">
            <path d="M44 50 Q49 54.5 54 50"/><path d="M66 50 Q71 54.5 76 50"/>
          </g>
          <g class="cat-eyes-happy" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round">
            <path d="M44 52 Q49 45 54 52"/><path d="M66 52 Q71 45 76 52"/>
          </g>

          <path d="M57 57 L63 57 L60 60.5 Z" fill="#F472B6" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M55 62 Q57.5 65 60 62 Q62.5 65 65 62" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <g stroke="${INK}" stroke-width="1.6" stroke-linecap="round">
            <path d="M33 58 L21 56"/><path d="M33 62 L21 63.5"/>
            <path d="M87 58 L99 56"/><path d="M87 62 L99 63.5"/>
          </g>
        </g>

        <g class="cat-bowtie" stroke="${INK}" stroke-width="2" stroke-linejoin="round">
          <path d="M60 76 L47.5 69.5 L47.5 82.5 Z" fill="#EC4899"/>
          <path d="M60 76 L72.5 69.5 L72.5 82.5 Z" fill="#EC4899"/>
          <circle cx="60" cy="76" r="3.6" fill="#DB2777"/>
        </g>
      </g>
    </svg>`;

  /* --------------------------- Intent matching ------------------------- */
  // "=word" means whole-word match; otherwise prefix match ("certif" → certificate).
  const INTENTS = [
    { id: "tour", words: ["tour", "show me around", "guide me", "walk me through", "look around"] },
    { id: "meow", words: ["=meow", "=purr", "=party"] },
    { id: "data", words: ["data usage", "use data", "much data", "low data", "low-data", "data-light", "data friendly", "lightweight", "fun fact", "page size", "how big", "how heavy", "bandwidth", "sips"] },
    { id: "cv", words: ["=cv", "resume", "résumé", "curriculum"] },
    { id: "contact", words: ["contact", "email", "e-mail", "reach", "hire", "hiring", "message", "linkedin", "get in touch", "talk to", "interview", "connect with"] },
    { id: "hubspot", words: ["hubspot", "=crm"] },
    { id: "projects", words: ["project", "work", "portfolio", "built", "build", "made", "case stud", "repo", "code", "app"] },
    { id: "skills", words: ["skill", "good at", "strength", "strong", "tool", "tech", "stack", "excel", "microsoft", "google workspace", "teamwork", "abilit"] },
    { id: "certificates", words: ["certif", "course", "coursera", "credential", "qualif", "studied", "learning record"] },
    { id: "capaciti", words: ["capaciti", "programme", "program", "learnership", "bootcamp", "training"] },
    { id: "background", words: ["background", "story", "journey", "experience", "history", "=job", "career", "claims", "hollard", "=exl", "shift", "espresso", "school", "matric", "before", "pivot", "about her", "who is rebecca"] },
    { id: "testimonials", words: ["testimonial", "colleague", "reference", "recommend", "review", "people say", "feedback"] },
    { id: "location", words: ["where", "location", "based", "cape town", "available", "availab", "relocat", "remote", "open to"] },
    { id: "who", words: ["who are you", "your name", "are you a bot", "are you real", "=adam", "=cat"] },
    { id: "thanks", words: ["thank", "cheers", "appreciate"] },
    { id: "hello", words: ["=hi", "=hello", "=hey", "=howzit", "good morning", "good afternoon", "=yo"] },
  ];

  const reEscape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const hit = (text, w) =>
    w.startsWith("=") ? new RegExp(`\\b${reEscape(w.slice(1))}\\b`).test(text) : w.includes(" ") ? text.includes(w) : new RegExp(`\\b${reEscape(w)}`).test(text);

  /* ------------------------------ Section ------------------------------ */
  sections.adam = {
    render(site) {
      const a = site.adam;
      return `
        <div class="adam-stage" data-adam-stage>
          <div class="adam-walker">
            <button type="button" class="adam-cat" data-adam-cat aria-expanded="false" aria-controls="adam-panel"
                    aria-label="Chat with ${esc(a.name)}, ${esc(a.role.toLowerCase())}">
              ${CAT_SVG}
            </button>
          </div>
        </div>

        <section id="adam-panel" class="adam-panel" role="dialog" aria-labelledby="adam-title" hidden>
          <header class="adam-head">
            <p id="adam-title" class="leading-tight">
              <span class="font-display text-base font-bold">${esc(a.name)} <span aria-hidden="true">🐾</span></span>
              <span class="block text-xs font-semibold">${esc(a.role)}</span>
            </p>
            <div class="flex items-center gap-1.5">
              <button type="button" class="adam-icon-btn" data-adam-min aria-label="Minimise chat">
                ${Site.svg('<path d="M5 12h14"/>')}
              </button>
              <button type="button" class="adam-icon-btn" data-adam-hide aria-label="Hide ${esc(a.name)} from the page">
                ${Site.svg('<path d="M6 6l12 12M18 6 6 18"/>')}
              </button>
            </div>
          </header>
          <div class="adam-log" data-adam-log role="log" aria-live="polite" aria-label="Conversation with ${esc(a.name)}" tabindex="0"></div>
          <div class="adam-chips" data-adam-chips role="group" aria-label="Suggested questions"></div>
          <form class="adam-form" data-adam-form>
            <label for="adam-input" class="sr-only">Ask ${esc(a.name)} a question</label>
            <input id="adam-input" class="adam-input" type="text" autocomplete="off" maxlength="200" placeholder="${esc(a.placeholder)}" />
            <button type="submit" class="adam-send" aria-label="Send question">${icon.arrow}</button>
          </form>
        </section>

        <div class="adam-nudge" data-adam-nudge hidden>
          <button type="button" class="adam-nudge-text" data-adam-nudge-open aria-controls="adam-panel">
            <span data-adam-nudge-msg></span>
          </button>
          <button type="button" class="adam-nudge-close" data-adam-nudge-close aria-label="Dismiss Adam's message">
            ${Site.svg('<path d="M6 6l12 12M18 6 6 18"/>', "size-3.5")}
          </button>
        </div>

        <div class="adam-tour" data-adam-tour role="dialog" aria-labelledby="adam-tour-title" hidden>
          <p class="adam-tour-step">
            <span id="adam-tour-title">Tour with ${esc(a.name)}</span>
            <span aria-hidden="true">·</span>
            <span data-tour-count></span>
          </p>
          <p class="adam-tour-text" data-tour-text aria-live="polite"></p>
          <div class="adam-tour-nav">
            <button type="button" class="adam-action" data-tour-back>Back</button>
            <button type="button" class="adam-action adam-action-primary" data-tour-next>Next</button>
            <button type="button" class="adam-tour-end" data-tour-end>End tour</button>
          </div>
        </div>

        <button type="button" class="adam-yarn" data-adam-yarn aria-label="Roll the yarn ball for ${esc(a.name)}">
          <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false">
            <circle cx="20" cy="20" r="16" fill="#F472B6" stroke="#18181B" stroke-width="2.5"/>
            <path d="M8 14c8 2 16 10 18 22M6 22c8 0 16 6 18 14M14 6c4 6 6 14 4 28M26 6c-2 8 2 16 8 20M33 14c-8 0-14 4-20 12"
                  fill="none" stroke="#18181B" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M34 28c4 2 5 6 3 9" fill="none" stroke="#18181B" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <button type="button" class="adam-restore" data-adam-restore hidden aria-label="Show ${esc(a.name)}, ${esc(a.role.toLowerCase())}">
          <span aria-hidden="true">🐾</span> ${esc(a.name)}
        </button>`;
    },

    init(root, site) {
      const a = site.adam;
      const T = a.text;
      const projects = window.SITE_PROJECTS || [];
      const certs = window.SITE_CERTIFICATES || [];

      const stage = root.querySelector("[data-adam-stage]");
      const cat = root.querySelector("[data-adam-cat]");
      const panel = root.querySelector("#adam-panel");
      const log = root.querySelector("[data-adam-log]");
      const chips = root.querySelector("[data-adam-chips]");
      const form = root.querySelector("[data-adam-form]");
      const input = root.querySelector("#adam-input");
      const restore = root.querySelector("[data-adam-restore]");

      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const narrow = () => window.matchMedia("(max-width: 639px)").matches;

      let state = "idle";
      let open = false;
      let greeted = false;
      let lockUntil = 0; // keep "happy" visible briefly
      let sleepTimer = 0;

      function setState(s) {
        if (s === state) return;
        state = s;
        root.dataset.state = s;
      }
      root.dataset.state = state;

      let touring = false;
      const restState = () => (open || touring ? "helping" : "idle");

      /* ---------------- Sleep after inactivity ---------------- */
      function wake() {
        if (state === "sleeping") setState(restState());
        clearTimeout(sleepTimer);
        sleepTimer = setTimeout(() => {
          if (!open && !root.hidden) setState("sleeping");
        }, a.sleepAfterMs || 18000);
      }
      ["keydown", "scroll", "touchstart", "wheel"].forEach((ev) => window.addEventListener(ev, wake, { passive: true }));
      wake();

      /* ---------------- Cursor chase (fine pointers) ---------------- */
      let raf = 0;
      let lastPounce = 0;
      let pointer = null;

      function track() {
        raf = 0;
        if (!pointer || root.classList.contains("is-hidden")) return;
        const r = cat.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.45;
        const dx = pointer.x - cx;
        const dy = pointer.y - cy;
        const dist = Math.hypot(dx, dy);
        const now = performance.now();

        // Eyes always follow while awake.
        const k = Math.min(1, dist / 120);
        cat.style.setProperty("--px", `${((dx / (dist || 1)) * 2.6 * k).toFixed(2)}px`);
        cat.style.setProperty("--py", `${((dy / (dist || 1)) * 2.2 * k).toFixed(2)}px`);

        if (open || now < lockUntil || state === "sleeping") return;

        if (dist < 220) {
          setState("playful");
          cat.style.setProperty("--chase-x", `${Math.max(-26, Math.min(26, dx * 0.18)).toFixed(1)}px`);
          if (dist < 80 && now - lastPounce > 1600 && motionOK()) {
            lastPounce = now;
            cat.classList.remove("is-pouncing");
            void cat.offsetWidth;
            cat.classList.add("is-pouncing");
          }
        } else if (state === "playful") {
          setState("idle");
          cat.style.setProperty("--chase-x", "0px");
        }
      }

      window.addEventListener(
        "pointermove",
        (e) => {
          wake();
          if (!finePointer || e.pointerType !== "mouse") return;
          pointer = { x: e.clientX, y: e.clientY };
          if (!raf) raf = requestAnimationFrame(track);
        },
        { passive: true }
      );
      cat.addEventListener("animationend", (e) => {
        if (e.animationName === "adam-pounce") cat.classList.remove("is-pouncing");
      });

      /* ---------------- Happy tap + open/close ---------------- */
      function happy(ms = 1100) {
        lockUntil = performance.now() + ms;
        cat.style.setProperty("--chase-x", "0px");
        setState("happy");
        setTimeout(() => {
          if (performance.now() >= lockUntil) setState(restState());
        }, ms);
      }

      function openPanel() {
        hideNudge();
        open = true;
        panel.hidden = false;
        cat.setAttribute("aria-expanded", "true");
        root.classList.add("is-open");
        if (!greeted) {
          greeted = true;
          renderChips();
          botSay({ html: `<p>${esc(T.greeting)}</p>` });
        }
        requestAnimationFrame(() => input.focus({ preventScroll: true }));
      }

      function closePanel({ focusCat = true } = {}) {
        open = false;
        panel.hidden = true;
        cat.setAttribute("aria-expanded", "false");
        root.classList.remove("is-open");
        if (state === "helping") setState("idle");
        if (focusCat) cat.focus({ preventScroll: true });
        wake();
      }

      cat.addEventListener("click", () => {
        wake();
        happy();
        open ? closePanel({ focusCat: false }) : openPanel();
      });

      root.querySelector("[data-adam-min]").addEventListener("click", () => closePanel());

      function setHidden(hidden) {
        root.classList.toggle("is-hidden", hidden);
        stage.hidden = hidden;
        restore.hidden = !hidden;
        if (hidden) {
          hideNudge();
          open && closePanel({ focusCat: false });
          clearTimeout(sleepTimer);
        } else {
          wake();
        }
        store("adam", hidden ? "hidden" : null);
      }
      root.querySelector("[data-adam-hide]").addEventListener("click", () => {
        setHidden(true);
        restore.focus();
      });
      restore.addEventListener("click", () => {
        setHidden(false);
        happy();
        cat.focus({ preventScroll: true });
      });
      try {
        if (localStorage.getItem("adam") === "hidden") setHidden(true);
      } catch (_) { /* ignore */ }

      /* ---------------- Welcome nudge (once per visit) ---------------- */
      const nudge = root.querySelector("[data-adam-nudge]");
      const nudgeMsg = root.querySelector("[data-adam-nudge-msg]");
      let nudgeTimer = 0;

      function hideNudge() {
        clearTimeout(nudgeTimer);
        nudge.hidden = true;
      }

      const isAway = () =>
        root.classList.contains("is-hidden") || document.documentElement.dataset.view === "plain";

      /** Show a short speech bubble above Adam. Returns false if he can't talk right now. */
      function say(text, { ms = 6000, announceIt = true, force = false } = {}) {
        if (isAway() || touring || (open && !force)) return false;
        clearTimeout(nudgeTimer);
        nudge.hidden = false;
        nudgeMsg.textContent = text;
        if (announceIt) announce(text);
        nudgeTimer = setTimeout(hideNudge, ms);
        return true;
      }

      function showNudge() {
        if (open || isAway()) return;
        try { sessionStorage.setItem("adam:greeted", "1"); } catch (_) { /* ignore */ }
        if (say(T.nudge, { ms: a.nudgeDurationMs || 10000 })) happy(1400); // a little wave hello
      }

      let greetedThisVisit = false;
      try { greetedThisVisit = sessionStorage.getItem("adam:greeted") === "1"; } catch (_) { /* ignore */ }
      if (!greetedThisVisit) setTimeout(showNudge, a.nudgeDelayMs || 2500);

      root.querySelector("[data-adam-nudge-open]").addEventListener("click", () => {
        hideNudge();
        happy();
        openPanel();
      });
      root.querySelector("[data-adam-nudge-close]").addEventListener("click", () => {
        hideNudge();
        cat.focus({ preventScroll: true });
      });

      root.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && touring) {
          endTour();
          return;
        }
        if (e.key === "Escape" && !nudge.hidden) {
          hideNudge();
          return;
        }
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          closePanel();
        }
      });

      const fill = (t) => String(t).replace("{certs}", certs.length).replace("{projects}", projects.length);

      /* ---------------- Party (easter egg) ---------------- */
      function party(msg = T.party) {
        if (root.classList.contains("is-hidden")) setHidden(false);
        hideNudge();
        happy(2600);
        root.classList.add("is-party");
        setTimeout(() => root.classList.remove("is-party"), 2600);
        const r = cat.getBoundingClientRect();
        confetti(r.left + r.width / 2, r.top + 10, 44);
        if (!say(msg, { ms: 5000 })) announce(msg);
      }

      /* ---------------- Petting: stroke the mouse back and forth ---------------- */
      let petDir = 0;
      let lastPetX = null;
      let petFlips = [];
      let purrTimer = 0;
      let pettedOnce = false;

      function purr() {
        lockUntil = performance.now() + 1800;
        cat.style.setProperty("--chase-x", "0px");
        setState("purring");
        clearTimeout(purrTimer);
        purrTimer = setTimeout(() => {
          if (state === "purring") setState(restState());
        }, 1800);
        if (!pettedOnce) {
          pettedOnce = true;
          say(T.petted, { ms: 3500, announceIt: false });
        }
      }

      cat.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse" || open) return;
        if (lastPetX !== null) {
          const d = Math.sign(e.clientX - lastPetX);
          if (d && d !== petDir) {
            if (petDir) petFlips.push(performance.now());
            petDir = d;
          }
        }
        lastPetX = e.clientX;
        const now = performance.now();
        petFlips = petFlips.filter((t) => now - t < 1000);
        if (petFlips.length >= 3) purr();
      });
      cat.addEventListener("pointerleave", () => {
        lastPetX = null;
        petDir = 0;
      });

      /* ---------------- Yarn ball ---------------- */
      const yarn = root.querySelector("[data-adam-yarn]");
      let chasing = false;
      let yarnAnnounced = false;

      yarn.addEventListener("click", () => {
        if (chasing) return;
        chasing = true;
        wake();
        hideNudge();
        const moving = motionOK();
        const max = Math.max(160, Math.min(window.innerWidth - 220, 380));
        const d = Math.round(140 + Math.random() * (max - 140));
        root.classList.add("is-chasing");
        root.style.setProperty("--yarn-x", `-${d}px`);
        root.style.setProperty("--yarn-rot", `-${d * 2}deg`);
        lockUntil = performance.now() + 4200;
        setState("playful");
        setTimeout(() => root.style.setProperty("--adam-x", `-${Math.max(0, d - 34)}px`), moving ? 250 : 0);
        setTimeout(() => happy(900), moving ? 1500 : 100);
        setTimeout(() => {
          root.style.setProperty("--yarn-x", "0px");
          root.style.setProperty("--yarn-rot", "0deg");
          root.style.setProperty("--adam-x", "0px");
        }, moving ? 2600 : 900);
        setTimeout(() => {
          root.classList.remove("is-chasing");
          chasing = false;
          setState(restState());
        }, moving ? 3900 : 1000);
        if (!yarnAnnounced) {
          yarnAnnounced = true;
          announce(T.yarn);
        }
      });

      /* ---------------- Guided tour ---------------- */
      const steps = (a.tour || []).filter((st) => document.getElementById(st.target));
      const tourEl = root.querySelector("[data-adam-tour]");
      const tourText = root.querySelector("[data-tour-text]");
      const tourCount = root.querySelector("[data-tour-count]");
      const tourBack = root.querySelector("[data-tour-back]");
      const tourNext = root.querySelector("[data-tour-next]");
      let step = 0;

      const clearTourFocus = () => document.querySelectorAll(".tour-focus").forEach((el) => el.classList.remove("tour-focus"));

      function showStep(i) {
        step = i;
        const st = steps[i];
        const target = document.getElementById(st.target);
        clearTourFocus();
        target.classList.add("tour-focus");
        target.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto", block: "start" });
        tourCount.textContent = `${i + 1} of ${steps.length}`;
        tourText.textContent = fill(st.text);
        tourBack.disabled = i === 0;
        tourNext.textContent = i === steps.length - 1 ? "Finish" : "Next";
        happy(700);
      }

      function startTour() {
        if (!steps.length) return;
        if (root.classList.contains("is-hidden")) setHidden(false);
        hideNudge();
        if (open) closePanel({ focusCat: false });
        touring = true;
        tourEl.hidden = false;
        root.classList.add("is-touring");
        showStep(0);
        requestAnimationFrame(() => tourNext.focus({ preventScroll: true }));
      }

      function endTour(finished = false) {
        if (!touring) return;
        touring = false;
        tourEl.hidden = true;
        root.classList.remove("is-touring");
        clearTourFocus();
        setState(restState());
        cat.focus({ preventScroll: true });
        if (finished) party(T.tourDone);
        else announce("Tour ended");
      }

      tourBack.addEventListener("click", () => step > 0 && showStep(step - 1));
      tourNext.addEventListener("click", () => (step < steps.length - 1 ? showStep(step + 1) : endTour(true)));
      root.querySelector("[data-tour-end]").addEventListener("click", () => endTour());

      /* ---------------- Section reactions (once each per visit) ---------------- */
      const reactions = a.reactions || {};
      let reacted = [];
      try { reacted = JSON.parse(sessionStorage.getItem("adam:reacted") || "[]"); } catch (_) { /* ignore */ }
      let lastReaction = -Infinity; // the 9 s gap only applies between reactions
      const dwell = new Map();

      if ("IntersectionObserver" in window) {
        const rio = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              const id = en.target.id;
              const enough = en.intersectionRatio >= 0.3 || en.intersectionRect.height >= window.innerHeight * 0.5;
              clearTimeout(dwell.get(id));
              if (!enough || reacted.includes(id)) return;
              dwell.set(id, setTimeout(() => {
                const busy = touring || open || !nudge.hidden || performance.now() - lastReaction < 9000;
                if (busy || reacted.includes(id)) return;
                if (say(fill(reactions[id]), { ms: 4500, announceIt: false })) {
                  reacted.push(id);
                  lastReaction = performance.now();
                  try { sessionStorage.setItem("adam:reacted", JSON.stringify(reacted)); } catch (_) { /* ignore */ }
                }
              }, 1200));
            });
          },
          { threshold: [0, 0.3, 0.6] }
        );
        Object.keys(reactions).forEach((id) => {
          const el = document.getElementById(id);
          if (el) rio.observe(el);
        });
      }

      // Public API for other modules (explorer badge, shortcuts, easter egg).
      Site.adam = {
        say,
        party,
        startTour,
        open: () => {
          if (root.classList.contains("is-hidden")) setHidden(false);
          if (!open) openPanel();
        },
      };

      /* ---------------- Chat rendering ---------------- */
      function renderChips() {
        chips.innerHTML = a.quickReplies
          .map((q) => `<button type="button" class="adam-chip" data-adam-intent="${esc(q.intent)}">${esc(q.label)}</button>`)
          .join("");
      }

      function actionHTML(act) {
        if (act.type === "cv") return cvLink({ label: act.label || "Download CV", cls: "adam-action" });
        if (act.type === "ask")
          return `<button type="button" class="adam-action" data-adam-ask="${esc(act.ask)}">${esc(act.label)}</button>`;
        const ext = /^https?:/.test(act.href);
        return `<a class="adam-action" href="${esc(act.href)}" ${ext ? 'target="_blank" rel="noopener noreferrer"' : "data-adam-nav"}
                  ${act.aria ? `aria-label="${esc(act.aria)}"` : ""}>${esc(act.label)}${ext ? icon.external : ""}</a>`;
      }

      function addMsg(who, html) {
        const el = document.createElement("div");
        el.className = `adam-msg adam-msg-${who}`;
        el.innerHTML = html;
        log.appendChild(el);
        log.scrollTop = log.scrollHeight;
        return el;
      }

      function botSay(reply) {
        const typing = addMsg("bot", `<span class="adam-typing" aria-label="${esc(a.name)} is typing"><i></i><i></i><i></i></span>`);
        typing.setAttribute("aria-hidden", "true");
        setTimeout(() => {
          typing.remove();
          const acts = reply.actions && reply.actions.length ? `<div class="adam-actions">${reply.actions.map(actionHTML).join("")}</div>` : "";
          addMsg("bot", reply.html + acts);
        }, motionOK() ? 520 : 0);
      }

      function ask(text, intent) {
        const clean = String(text).trim().slice(0, 200);
        if (!clean) return;
        wake();
        addMsg("user", `<p>${esc(clean)}</p>`);
        botSay(answer(intent || classify(clean.toLowerCase()), clean.toLowerCase()));
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        ask(input.value);
        input.value = "";
      });

      root.addEventListener("click", (e) => {
        const chip = e.target.closest("[data-adam-intent]");
        if (chip && chip.dataset.adamIntent === "tour") return startTour();
        if (chip) return ask(chip.textContent, chip.dataset.adamIntent);
        const follow = e.target.closest("[data-adam-ask]");
        if (follow) return ask(follow.dataset.adamAsk);
        // On phones, jumping to a section should reveal it, not hide it under the bubble.
        if (e.target.closest("[data-adam-nav]") && narrow()) closePanel({ focusCat: false });
      });

      /* ---------------- Answers (built from site data) ---------------- */
      const projectKeywords = projects.map((p) => {
        const words = p.title.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !["public", "projects", "connect"].includes(w));
        return { p, words };
      });

      function findProject(text) {
        let best = null;
        let score = 0;
        projectKeywords.forEach(({ p, words }) => {
          const s = words.filter((w) => text.includes(w)).length;
          if (s > score) { best = p; score = s; }
        });
        return best;
      }

      function classify(text) {
        const project = findProject(text);
        let best = null;
        let bestScore = 0;
        INTENTS.forEach((it) => {
          const s = it.words.filter((w) => hit(text, w)).length;
          if (s > bestScore) { best = it.id; bestScore = s; }
        });
        // A named project beats generic "projects"/"work" matches.
        if (project && (!best || best === "projects" || bestScore <= 1)) return `project:${project.title}`;
        return best || "fallback";
      }

      const sentence = (s) => String(s).split(/(?<=[.!?])\s/)[0];
      const fmtList = (items) => `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;

      function answer(intent) {
        if (intent.startsWith("project:")) {
          const p = projects.find((x) => `project:${x.title}` === intent);
          if (p) return projectAnswer(p);
        }

        switch (intent) {
          case "projects":
            return {
              html: `<p>${esc(T.projectsIntro)}</p>` +
                fmtList(projects.map((p) => `<strong>${esc(p.title)}</strong> — ${esc(p.category)}`)),
              actions: [
                { type: "link", href: "#work", label: "See Selected Work" },
                ...projects.slice(0, 2).map((p) => ({ type: "ask", label: `${T.projectAsk} ${p.title}`, ask: `${T.projectAsk} ${p.title}` })),
              ],
            };

          case "skills": {
            const cats = site.toolkit.categories.map((c) => {
              const top = c.skills.slice().sort((x, y) => y.value - x.value).slice(0, 3);
              return `<strong>${esc(c.label)}:</strong> ${top.map((s) => esc(s.name)).join(", ")}`;
            });
            return {
              html: `<p>${esc(T.skillsIntro)}</p>${fmtList(cats)}`,
              actions: [{ type: "link", href: "#toolkit", label: "Open the Toolkit" }],
            };
          }

          case "hubspot": {
            const b = site.toolkit.badges.find((x) => typeof x === "object" && /hubspot/i.test(x.name));
            return {
              html: `<p>${esc(b ? b.note : "HubSpot CRM is one of Rebecca's self-taught skills.")}</p>`,
              actions: [{ type: "link", href: "#toolkit", label: "Open the Toolkit" }],
            };
          }

          case "contact": {
            const acts = [];
            if (site.email) acts.push({ type: "link", href: `mailto:${site.email}`, label: "Email Rebecca" });
            if (site.social && site.social.linkedin)
              acts.push({ type: "link", href: site.social.linkedin, label: "LinkedIn", aria: "Rebecca on LinkedIn (opens in a new tab)" });
            acts.push({ type: "link", href: "#contact", label: "Use the message form" });
            return {
              html: `<p>${esc(T.contactIntro)}</p>${site.email ? `<p class="mt-1 break-all font-semibold">${esc(site.email)}</p>` : ""}`,
              actions: acts,
            };
          }

          case "cv":
            return { html: `<p>${esc(T.cvIntro)}</p>`, actions: [{ type: "cv", label: "Download CV" }] };

          case "certificates": {
            const filters = site.certificates.filters.filter((f) => f.id !== "all");
            const lines = filters
              .map((f) => ({ f, n: certs.filter((c) => c.category === f.id).length }))
              .filter((x) => x.n)
              .map((x) => `${esc(x.f.long || x.f.label)}: <strong>${x.n}</strong>`);
            return {
              html: `<p>${esc(T.certsIntro)} <strong>${certs.length}</strong> certificates:</p>${fmtList(lines)}`,
              actions: [{ type: "link", href: "#certificates", label: "Browse certificates" }],
            };
          }

          case "capaciti": {
            const now = site.pivot.milestones[site.pivot.milestones.length - 1];
            return {
              html: `<p>${esc(T.capacitiIntro)} ${esc(site.hero.program.detail)}.</p><p class="mt-1">In her words: <em>“${esc(now.description)}”</em></p>`,
              actions: [{ type: "link", href: "#pivot", label: "See her timeline" }],
            };
          }

          case "background":
            return {
              html: `<p>${esc(T.backgroundIntro)}</p>` +
                fmtList(site.pivot.milestones.map((m) => `<strong>${esc(m.era)}</strong> — ${esc(m.title)}`)),
              actions: [
                { type: "link", href: "#story", label: "Read her story" },
                { type: "link", href: "#pivot", label: "See the timeline" },
              ],
            };

          case "testimonials":
            return {
              html: `<p>${esc(T.testimonialsIntro)}</p>` +
                fmtList(site.voices.testimonials.map((t) => `<strong>${esc(t.name)}</strong>: “${esc(t.headline)}”`)),
              actions: [{ type: "link", href: "#voices", label: "Read the reflections" }],
            };

          case "location":
            return {
              html: `<p>${esc(T.locationIntro)} <strong>${esc(site.hero.location)}</strong> — ${esc(site.hero.availability.toLowerCase())}.</p>`,
              actions: [{ type: "link", href: "#contact", label: "Get in touch" }],
            };

          case "data": {
            const ff = site.funFact;
            return ff
              ? { html: `<p><strong>${esc(ff.headline)}</strong></p><p class="mt-1">${esc(ff.text)}</p><p class="mt-1">${esc(ff.how)}</p>` }
              : { html: `<p>${esc(T.fallback)}</p>` };
          }

          case "tour":
            setTimeout(startTour, motionOK() ? 900 : 50);
            return { html: `<p>${esc(T.tourOffer)}</p>` };

          case "meow":
            setTimeout(() => party(), motionOK() ? 700 : 50);
            return { html: `<p>${esc(T.party)}</p>` };

          case "who":
            return { html: `<p>${esc(T.who)}</p>` };
          case "thanks":
            return { html: `<p>${esc(T.thanks)}</p>` };
          case "hello":
            return { html: `<p>${esc(T.hello)}</p>` };
          default:
            return {
              html: `<p>${esc(T.fallback)}</p>`,
              actions: [{ type: "link", href: "#contact", label: "Message Rebecca" }],
            };
        }
      }

      function projectAnswer(p) {
        const gh = /^https:\/\//.test((p.links && p.links.github) || "") ? p.links.github : "";
        const live = /^https:\/\//.test((p.links && p.links.live) || "") ? p.links.live : "";
        const acts = [{ type: "link", href: `#project-${slug(p.title)}`, label: "View the card" }];
        if (gh) acts.push({ type: "link", href: gh, label: "GitHub", aria: `${p.title} on GitHub (opens in a new tab)` });
        if (live) acts.push({ type: "link", href: live, label: "Live demo", aria: `${p.title} live demo (opens in a new tab)` });
        return {
          html: `<p><strong>${esc(p.title)}</strong> · ${esc(p.category)}</p>` +
            fmtList([
              `<strong>Problem:</strong> ${esc(sentence(p.problem))}`,
              `<strong>Solution:</strong> ${esc(sentence(p.solution))}`,
              `<strong>Result:</strong> ${esc(sentence(p.result))}`,
            ]),
          actions: acts,
        };
      }
    },
  };
})(window.Site);
