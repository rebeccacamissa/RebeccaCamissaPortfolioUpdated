/* Fun extras: scroll progress, back-to-top, Explorer badge, "meow" easter egg,
   and hand-drawn doodles that draw themselves in and can be booped. */
(function (Site) {
  "use strict";
  const { icon, announce, confetti, store, sections } = Site;

  /* --------------------------- Doodle artwork --------------------------- */
  // 56×56 hand-drawn shapes. `closed` shapes fill pink when booped.
  const DOODLES = {
    star: { closed: true, d: '<path d="M28 5 L34 21 L51 22 L38 33 L43 50 L28 40 L13 50 L18 33 L5 22 L22 21 Z"/>' },
    heart: { closed: true, d: '<path d="M28 47 C11 36 5 26 9 16 C13 7 24 8 28 17 C32 8 43 7 47 16 C51 26 45 36 28 47 Z"/>' },
    sparkle: { closed: true, d: '<path d="M28 4 C30 20 36 26 52 28 C36 30 30 36 28 52 C26 36 20 30 4 28 C20 26 26 20 28 4 Z"/>' },
    paw: {
      closed: true,
      d: '<path d="M18 40 C18 31 38 31 38 40 C38 47 18 47 18 40 Z"/><circle cx="14" cy="26" r="4.5"/><circle cx="23" cy="18" r="4.5"/><circle cx="33" cy="18" r="4.5"/><circle cx="42" cy="26" r="4.5"/>',
    },
    flower: {
      closed: true,
      d: '<circle cx="28" cy="28" r="6"/><path d="M28 22 C20 8 36 8 28 22 Z M34 28 C48 20 48 36 34 28 Z M28 34 C36 48 20 48 28 34 Z M22 28 C8 36 8 20 22 28 Z"/>',
    },
    squiggle: { closed: false, d: '<path d="M4 30 C12 10 20 50 28 30 S44 10 52 30"/>' },
    spiral: { closed: false, d: '<path d="M28 28 c3 0 4 3 2 5 c-3 3 -9 1 -9 -4 c0 -7 9 -10 15 -6 c7 5 5 16 -3 19 c-10 4 -20 -3 -20 -13 c0 -12 13 -19 24 -14"/>' },
    arrow: { closed: false, d: '<path d="M8 46 C16 24 32 14 48 12"/><path d="M38 6 L48 12 L41 21"/>' },
    zigzag: { closed: false, d: '<path d="M4 34 L13 22 L22 34 L31 22 L40 34 L50 24"/>' },
    loop: { closed: false, d: '<path d="M44 18 C38 6 14 8 8 22 C2 38 20 50 34 46 C48 42 52 26 40 16 C32 10 22 12 18 16"/>' },
  };

  // Two gutter doodles per section (wide screens) + one small one beside the heading.
  const PLACEMENT = {
    story: [["left", "14%", "star", -8], ["right", "58%", "squiggle", 6], "sparkle"],
    pivot: [["left", "52%", "arrow", 4], ["right", "16%", "heart", 10], "star"],
    voices: [["left", "20%", "loop", -4], ["right", "60%", "paw", -12], "heart"],
    toolkit: [["left", "60%", "flower", 8], ["right", "18%", "zigzag", -6], "sparkle"],
    work: [["left", "16%", "spiral", 0], ["right", "54%", "star", 14], "paw"],
    certificates: [["left", "56%", "sparkle", -10], ["right", "20%", "arrow", -4], "flower"],
    contact: [["left", "22%", "heart", -6], ["right", "50%", "loop", 8], "heart"],
  };

  const svg = (type) => {
    const t = DOODLES[type];
    // pathLength="1" lets CSS draw every stroke in with a single dash offset.
    const shapes = t.d.replace(/<(path|circle)/g, '<$1 pathLength="1"');
    return `<svg viewBox="0 0 56 56" class="${t.closed ? "is-closed" : ""}" aria-hidden="true" focusable="false">${shapes}</svg>`;
  };

  sections.fun = {
    render(site) {
      return `
        <div class="scroll-progress" aria-hidden="true"><span></span></div>
        <a href="#top" class="to-top" data-to-top hidden aria-label="Back to top">${icon.up}</a>`;
    },

    init(el, site) {
      const f = site.fun || {};
      const T = (site.adam && site.adam.text) || {};
      const html = document.documentElement;

      /* ---------------- Scroll progress + back-to-top ---------------- */
      const bar = el.querySelector(".scroll-progress span");
      const toTop = el.querySelector("[data-to-top]");
      let raf = 0;
      const onScroll = () => {
        raf = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.setProperty("--p", max > 0 ? Math.min(1, window.scrollY / max) : 0);
        toTop.hidden = window.scrollY < window.innerHeight * 1.5;
      };
      window.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(onScroll); }, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();

      /* ---------------- Explorer badge ---------------- */
      const tracked = [...document.querySelectorAll("main > section[id]")];
      const status = document.querySelector("[data-explorer-status]");
      let seen = new Set();
      try { seen = new Set(JSON.parse(sessionStorage.getItem("explored") || "[]")); } catch (_) { /* ignore */ }
      let earned = false;
      try { earned = localStorage.getItem("explorer-badge") === "1"; } catch (_) { /* ignore */ }

      const renderStatus = () => {
        if (!status) return;
        status.textContent = earned
          ? `🏅 ${f.explorerDone || "Explorer badge earned!"}`
          : `🧭 ${f.explorerLabel || "Sections explored"}: ${Math.min(seen.size, tracked.length)} / ${tracked.length}`;
        status.classList.toggle("is-earned", earned);
      };

      function award() {
        earned = true;
        store("explorer-badge", "1");
        renderStatus();
        confetti(window.innerWidth / 2, window.innerHeight * 0.25, 60);
        const msg = T.explorer || "You explored every section!";
        if (!(Site.adam && Site.adam.say(msg, { ms: 6000 }))) announce(msg);
      }

      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((en) => {
              const enough = en.intersectionRatio >= 0.35 || en.intersectionRect.height >= window.innerHeight * 0.5;
              if (!enough || seen.has(en.target.id)) return;
              seen.add(en.target.id);
              try { sessionStorage.setItem("explored", JSON.stringify([...seen])); } catch (_) { /* ignore */ }
              renderStatus();
              if (!earned && tracked.every((s) => seen.has(s.id))) setTimeout(award, 800);
            });
          },
          { threshold: [0, 0.35, 0.6] }
        );
        tracked.forEach((s) => io.observe(s));
      }
      renderStatus();

      /* ---------------- Easter egg: type "meow" ---------------- */
      let buffer = "";
      document.addEventListener("keydown", (e) => {
        const t = e.target;
        if (e.ctrlKey || e.metaKey || e.altKey || (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))) return;
        if (e.key.length !== 1) return;
        buffer = (buffer + e.key.toLowerCase()).slice(-4);
        if (buffer === "meow") {
          buffer = "";
          if (Site.adam) Site.adam.party();
          else confetti();
        }
      });

      /* ---------------- Doodles ---------------- */
      if (html.dataset.view === "plain") return; // added again on next load if styled
      const doodles = [];
      Object.entries(PLACEMENT).forEach(([id, [left, right, inline]]) => {
        const section = document.getElementById(id);
        if (!section) return;
        [left, right].forEach(([side, top, type, rot]) => {
          const d = document.createElement("span");
          d.className = `doodle doodle-${side}`;
          d.setAttribute("aria-hidden", "true");
          d.style.setProperty("--top", top);
          d.style.setProperty("--rot", `${rot}deg`);
          d.innerHTML = svg(type);
          section.appendChild(d);
          doodles.push(d);
        });
        const eyebrow = section.querySelector(".eyebrow");
        if (eyebrow) {
          const d = document.createElement("span");
          d.className = "doodle doodle-inline";
          d.setAttribute("aria-hidden", "true");
          d.innerHTML = svg(inline);
          (eyebrow.nextElementSibling && eyebrow.nextElementSibling.matches(".listen-btn") ? eyebrow.nextElementSibling : eyebrow).after(d);
          doodles.push(d);
        }
      });

      if ("IntersectionObserver" in window) {
        const dio = new IntersectionObserver(
          (entries) => entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("is-drawn");
              dio.unobserve(en.target);
            }
          }),
          { threshold: 0.6 }
        );
        doodles.forEach((d) => dio.observe(d));
      } else {
        doodles.forEach((d) => d.classList.add("is-drawn"));
      }

      const booped = new Set();
      let praised = false;
      doodles.forEach((d, i) =>
        d.addEventListener("click", (e) => {
          d.classList.toggle("is-booped");
          d.classList.remove("is-spinning");
          void d.offsetWidth;
          d.classList.add("is-spinning");
          confetti(e.clientX, e.clientY, 8);
          booped.add(i);
          if (!praised && booped.size >= 4) {
            praised = true;
            if (Site.adam) Site.adam.say(T.doodles || "You found the doodles!", { ms: 4500, announceIt: false });
          }
        })
      );
    },
  };
})(window.Site);
