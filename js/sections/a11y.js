/* Accessibility: settings panel, single-key shortcuts (+ "?" help), read-aloud.
   Settings live on <html> as data attributes so CSS can respond:
     data-text-size="large|larger"  data-font="readable"
     data-contrast="high"           data-motion="reduce"
   They're saved in localStorage("a11y") and re-applied before paint by the
   inline script in index.html. */
(function (Site) {
  "use strict";
  const { esc, icon, announce, store, sections } = Site;

  const root = document.documentElement;
  const KEY = "a11y";
  const READABLE_FONT = "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap";
  const osReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Shortcut order matches the page: 1 = hero … 8 = contact.
  const SECTION_KEYS = [
    ["1", "hero", "Welcome"],
    ["2", "story", "Profile"],
    ["3", "pivot", "The pivot"],
    ["4", "voices", "What people say"],
    ["5", "toolkit", "Toolkit"],
    ["6", "work", "Selected work"],
    ["7", "certificates", "Certificates"],
    ["8", "contact", "Contact"],
  ];

  const ACTION_KEYS = [
    ["?", "Show this list of shortcuts"],
    ["S", "Open accessibility settings"],
    ["T", "Switch light / dark theme"],
    ["P", "Switch plain-text / styled version"],
    ["L", "Listen to the section you're on (press again to stop)"],
    ["A", "Chat with Adam"],
    ["G", "Start Adam's guided tour"],
    ["Esc", "Close a dialog, chat or tour"],
  ];

  /* ---------------------------- Settings ---------------------------- */
  function load() {
    try {
      return Object.assign({ size: "default", font: false, contrast: false, motion: false, keys: true }, JSON.parse(localStorage.getItem(KEY) || "{}"));
    } catch (_) {
      return { size: "default", font: false, contrast: false, motion: false, keys: true };
    }
  }
  let settings = load();

  function ensureReadableFont() {
    if (document.querySelector("link[data-readable-font]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = READABLE_FONT;
    link.dataset.readableFont = "";
    document.head.appendChild(link);
  }

  function apply() {
    const set = (name, on, value) => (on ? (root.dataset[name] = value) : delete root.dataset[name]);
    set("textSize", settings.size !== "default", settings.size);
    set("font", settings.font, "readable");
    set("contrast", settings.contrast, "high");
    set("motion", settings.motion, "reduce");
    if (settings.font) ensureReadableFont();
  }

  function save() {
    const isDefault = settings.size === "default" && !settings.font && !settings.contrast && !settings.motion && settings.keys;
    store(KEY, isDefault ? null : JSON.stringify(settings));
    apply();
  }

  /* ------------------------------ Markup ----------------------------- */
  const sw = (id, label, hint) => `
    <div class="a11y-row">
      <label class="a11y-switch" for="${id}">
        <span class="min-w-0">
          <span class="block font-display font-bold">${esc(label)}</span>
          <span class="block text-sm text-ink-soft" id="${id}-hint">${esc(hint)}</span>
        </span>
        <input type="checkbox" role="switch" id="${id}" aria-describedby="${id}-hint" />
        <span class="a11y-switch-track" aria-hidden="true"><span></span></span>
      </label>
    </div>`;

  sections.a11y = {
    render() {
      const sizes = [
        ["default", "A", "Default text size"],
        ["large", "A+", "Large text"],
        ["larger", "A++", "Larger text"],
      ];
      return `
        <dialog class="a11y-dialog" id="a11y-dialog" aria-labelledby="a11y-title">
          <div class="a11y-head">
            <h2 id="a11y-title" class="flex items-center gap-2 font-display text-xl font-bold">${icon.access} Accessibility settings</h2>
            <form method="dialog"><button class="adam-icon-btn" aria-label="Close accessibility settings">${Site.svg('<path d="M6 6l12 12M18 6 6 18"/>')}</button></form>
          </div>

          <div class="a11y-body">
            <fieldset class="a11y-row">
              <legend class="font-display font-bold">Text size</legend>
              <div class="a11y-sizes">
                ${sizes
                  .map(
                    ([v, short, long]) => `
                  <label class="a11y-size">
                    <input type="radio" name="a11y-size" value="${v}" />
                    <span aria-hidden="true" class="a11y-size-${v}">${short}</span>
                    <span class="sr-only">${long}</span>
                  </label>`
                  )
                  .join("")}
              </div>
            </fieldset>

            ${sw("a11y-font", "Readable font", "Swaps to Atkinson Hyperlegible, designed for low vision, with wider letter spacing.")}
            ${sw("a11y-contrast", "High contrast", "Pure black and white, no textures, underlined links.")}
            ${sw("a11y-motion", "Reduce motion", "Stops animations, confetti and the scrolling band.")}
            ${sw("a11y-keys", "Keyboard shortcuts", "Single-key shortcuts like 1–8 and T. Turn off if they get in your way.")}

            <p class="a11y-row flex items-start gap-2 text-sm text-ink-soft">
              <span class="mt-0.5 text-ink">${icon.speaker}</span>
              <span>Look for the <strong class="text-ink">Listen</strong> button at the top of each section to have it read aloud.</span>
            </p>

            <div class="flex flex-wrap gap-2.5 pt-1">
              <button type="button" class="btn btn-sm btn-secondary" data-open-shortcuts>${icon.keyboard} Shortcuts</button>
              <button type="button" class="btn btn-sm btn-secondary" data-print>${icon.printer} Print / save as PDF</button>
              <button type="button" class="btn btn-sm btn-ghost" data-a11y-reset>Reset to defaults</button>
            </div>
          </div>
        </dialog>

        <dialog class="a11y-dialog" id="keys-dialog" aria-labelledby="keys-title">
          <div class="a11y-head">
            <h2 id="keys-title" class="flex items-center gap-2 font-display text-xl font-bold">${icon.keyboard} Keyboard shortcuts</h2>
            <form method="dialog"><button class="adam-icon-btn" aria-label="Close keyboard shortcuts">${Site.svg('<path d="M6 6l12 12M18 6 6 18"/>')}</button></form>
          </div>
          <div class="a11y-body">
            <p class="text-sm text-ink-soft" data-keys-status></p>
            <h3 class="font-display font-bold">Jump to a section</h3>
            <dl class="keys-list">
              ${SECTION_KEYS.map(([k, , label]) => `<div><dt><kbd>${k}</kbd></dt><dd>${esc(label)}</dd></div>`).join("")}
            </dl>
            <h3 class="font-display font-bold">Actions</h3>
            <dl class="keys-list">
              ${ACTION_KEYS.map(([k, label]) => `<div><dt><kbd>${esc(k)}</kbd></dt><dd>${esc(label)}</dd></div>`).join("")}
            </dl>
            <p class="text-sm text-ink-soft">Shortcuts never fire while you're typing in a field.</p>
          </div>
        </dialog>`;
    },

    init(el) {
      const dlg = el.querySelector("#a11y-dialog");
      const keysDlg = el.querySelector("#keys-dialog");
      const $ = (id) => el.querySelector(id);
      const fontSw = $("#a11y-font");
      const contrastSw = $("#a11y-contrast");
      const motionSw = $("#a11y-motion");
      const keysSw = $("#a11y-keys");

      function syncControls() {
        el.querySelectorAll('input[name="a11y-size"]').forEach((r) => (r.checked = r.value === settings.size));
        fontSw.checked = settings.font;
        contrastSw.checked = settings.contrast;
        keysSw.checked = settings.keys;
        if (osReducedMotion()) {
          motionSw.checked = true;
          motionSw.disabled = true;
          $("#a11y-motion-hint").textContent = "Already on — your device asks for reduced motion.";
        } else {
          motionSw.checked = settings.motion;
        }
        $("[data-keys-status]").textContent = settings.keys
          ? "Shortcuts are on."
          : "Shortcuts are off. Turn them on in Accessibility settings.";
      }

      const change = (key, value, msg) => {
        settings[key] = value;
        save();
        announce(msg);
      };

      el.querySelectorAll('input[name="a11y-size"]').forEach((r) =>
        r.addEventListener("change", () => change("size", r.value, `Text size: ${r.nextElementSibling.nextElementSibling.textContent}`))
      );
      fontSw.addEventListener("change", () => change("font", fontSw.checked, `Readable font ${fontSw.checked ? "on" : "off"}`));
      contrastSw.addEventListener("change", () => change("contrast", contrastSw.checked, `High contrast ${contrastSw.checked ? "on" : "off"}`));
      motionSw.addEventListener("change", () => change("motion", motionSw.checked, `Reduced motion ${motionSw.checked ? "on" : "off"}`));
      keysSw.addEventListener("change", () => {
        change("keys", keysSw.checked, `Keyboard shortcuts ${keysSw.checked ? "on" : "off"}`);
        syncControls();
      });

      el.querySelector("[data-a11y-reset]").addEventListener("click", () => {
        settings = { size: "default", font: false, contrast: false, motion: false, keys: true };
        save();
        syncControls();
        announce("Accessibility settings reset");
      });
      el.querySelector("[data-print]").addEventListener("click", () => {
        dlg.close();
        setTimeout(() => window.print(), 100);
      });

      const openSettings = () => {
        syncControls();
        if (!dlg.open) dlg.showModal();
      };
      const openKeys = () => {
        syncControls();
        if (dlg.open) dlg.close();
        if (!keysDlg.open) keysDlg.showModal();
      };
      el.querySelector("[data-open-shortcuts]").addEventListener("click", openKeys);

      // Click on the backdrop closes the dialog.
      [dlg, keysDlg].forEach((d) =>
        d.addEventListener("click", (e) => {
          if (e.target === d) d.close();
        })
      );

      document.addEventListener("click", (e) => {
        if (e.target.closest('[data-action="open-a11y"]')) openSettings();
        if (e.target.closest('[data-action="open-shortcuts"]')) openKeys();
      });

      apply();
      syncControls();

      /* ---------------------------- Read aloud ---------------------------- */
      const speech = "speechSynthesis" in window ? window.speechSynthesis : null;
      let reading = null; // { section, btn }

      function chunksFor(section) {
        const sel = "h1, h2, h3, h4, p, dt, dd, li, blockquote, figcaption";
        const skip = (n) =>
          n.closest('[aria-hidden="true"], .decor, [hidden], button, form, .listen-btn, .adam, nav') ||
          n.querySelector(sel);
        return [...section.querySelectorAll(sel)]
          .filter((n) => !skip(n))
          .map((n) => ({ el: n, text: n.textContent.replace(/\s+/g, " ").trim() }))
          .filter((c) => c.text);
      }

      function pickVoice() {
        const voices = speech.getVoices();
        return (
          voices.find((v) => /en-ZA/i.test(v.lang)) ||
          voices.find((v) => /en-GB/i.test(v.lang)) ||
          voices.find((v) => /^en/i.test(v.lang)) ||
          null
        );
      }

      function stopReading(silent = false) {
        if (!speech) return;
        speech.cancel();
        document.querySelectorAll(".is-reading").forEach((n) => n.classList.remove("is-reading"));
        if (reading) {
          reading.btn.setAttribute("aria-pressed", "false");
          reading.btn.querySelector("[data-listen-icon]").innerHTML = icon.speaker;
          reading.btn.querySelector("[data-listen-label]").textContent = "Listen";
          if (!silent) announce("Stopped reading");
        }
        reading = null;
      }

      function read(section, btn) {
        stopReading(true);
        const chunks = chunksFor(section);
        if (!chunks.length) return;
        reading = { section, btn };
        btn.setAttribute("aria-pressed", "true");
        btn.querySelector("[data-listen-icon]").innerHTML = icon.stop;
        btn.querySelector("[data-listen-label]").textContent = "Stop";
        const voice = pickVoice();
        chunks.forEach((c, i) => {
          const u = new SpeechSynthesisUtterance(c.text);
          if (voice) u.voice = voice;
          u.lang = voice ? voice.lang : "en-ZA";
          u.rate = 1;
          u.onstart = () => {
            document.querySelectorAll(".is-reading").forEach((n) => n.classList.remove("is-reading"));
            c.el.classList.add("is-reading");
          };
          if (i === chunks.length - 1) u.onend = () => reading && reading.btn === btn && stopReading(true);
          speech.speak(u);
        });
      }

      if (speech) {
        document.querySelectorAll("main > section[id]").forEach((section) => {
          const anchor = section.querySelector(".eyebrow") || section.querySelector("h1")?.previousElementSibling;
          if (!anchor) return;
          const name = (section.querySelector("h1, h2")?.textContent || "this section").replace(/\s+/g, " ").trim();
          anchor.insertAdjacentHTML(
            "afterend",
            `<button type="button" class="listen-btn" data-listen aria-pressed="false" aria-label="Listen: read “${esc(name)}” aloud">
               <span data-listen-icon class="inline-flex">${icon.speaker}</span><span data-listen-label>Listen</span>
             </button>`
          );
          const btn = anchor.nextElementSibling;
          btn.addEventListener("click", () => (reading && reading.btn === btn ? stopReading() : read(section, btn)));
        });
        window.addEventListener("pagehide", () => stopReading(true));
      }

      function currentSection() {
        const mid = window.innerHeight * 0.35;
        return [...document.querySelectorAll("main > section[id]")].find((s) => {
          const r = s.getBoundingClientRect();
          return r.top <= mid && r.bottom > mid;
        });
      }

      /* ------------------------- Keyboard shortcuts ------------------------- */
      const typing = (t) => t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

      function jump(id) {
        const target = document.getElementById(id);
        if (!target) return;
        target.scrollIntoView({ behavior: Site.motionOK() ? "smooth" : "auto", block: "start" });
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }

      document.addEventListener("keydown", (e) => {
        if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || typing(e.target)) return;
        if (document.querySelector("dialog[open]")) return;
        if (e.key === "?") {
          e.preventDefault();
          return openKeys();
        }
        if (!settings.keys || e.shiftKey) return;

        const key = e.key.toLowerCase();
        const section = SECTION_KEYS.find(([k]) => k === key);
        if (section) return jump(section[1]);

        const click = (sel) => document.querySelector(sel)?.click();
        switch (key) {
          case "s": e.preventDefault(); return openSettings();
          case "t": return click('[data-action="toggle-theme"]');
          case "p": return click('[data-action="toggle-view"]');
          case "a": e.preventDefault(); return Site.adam && Site.adam.open();
          case "g": return Site.adam && Site.adam.startTour();
          case "l": {
            if (!speech) return announce("Read-aloud isn't supported in this browser.");
            if (reading) return stopReading();
            const s = currentSection();
            const btn = s && s.querySelector("[data-listen]");
            return btn && read(s, btn);
          }
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && reading) stopReading();
      });
    },
  };
})(window.Site);
