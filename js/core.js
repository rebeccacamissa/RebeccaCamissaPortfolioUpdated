/**
 * Shared helpers for all sections. Exposed as window.Site.
 * Each file in js/sections/ registers Site.sections.<name> = { render(), init?(el) }.
 */
window.Site = (function () {
  "use strict";

  const esc = (value) =>
    String(value).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );

  // Inline SVG icons (decorative — always paired with visible text or an aria-label).
  const svg = (paths, cls = "size-4") =>
    `<svg class="${cls} shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;

  const icon = {
    download: svg('<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>'),
    arrow: svg('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
    pin: svg('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>', "size-3.5"),
    text: svg('<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/>'),
    palette: svg('<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>'),
    moon: svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>', "size-5"),
    sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>', "size-5"),
    spinner: svg('<path d="M12 3a9 9 0 1 0 9 9" />', "size-4 animate-spin"),
    check: svg('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
    alert: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>'),
    chevronLeft: svg('<path d="m15 5-7 7 7 7"/>'),
    chevronRight: svg('<path d="m9 5 7 7-7 7"/>'),
    play: svg('<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>', "size-3.5"),
    pause: svg('<path d="M8 5v14M16 5v14"/>', "size-3.5"),
    external: svg('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>', "size-3.5"),
    github: `<svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>`,
    linkedin: `<svg class="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.84-2.05 3.8-2.05C20.6 8.65 21 11.2 21 14.5V21h-4v-5.8c0-1.4 0-3.2-1.95-3.2s-2.25 1.5-2.25 3.1V21H9z"/></svg>`,
  };

  /** "02 — THE PIVOT / …" → numbered chip + label. */
  function eyebrow(text) {
    const [num, ...rest] = String(text).split(" — ");
    if (!rest.length) {
      return `<p class="eyebrow"><span class="eyebrow-label">${esc(text)}</span></p>`;
    }
    return `
      <p class="eyebrow">
        <span class="eyebrow-num">${esc(num)}</span><span class="sr-only"> — </span><span class="eyebrow-label">${esc(rest.join(" — "))}</span>
      </p>`;
  }

  /** Wrap the first occurrence of `phrase` in the highlighter marker. */
  function highlight(text, phrase) {
    const safe = esc(text);
    if (!phrase || !text.includes(phrase)) return safe;
    return safe.replace(esc(phrase), `<span class="marker">${esc(phrase)}</span>`);
  }

  function announce(msg) {
    const live = document.getElementById("live-region");
    if (!live) return;
    live.textContent = "";
    requestAnimationFrame(() => (live.textContent = msg));
  }

  function store(key, value) {
    try {
      value == null ? localStorage.removeItem(key) : localStorage.setItem(key, value);
    } catch (_) { /* storage blocked — toggles still work for this visit */ }
  }

  const motionOK = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const pad = (n) => String(n).padStart(2, "0");
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /** Run `cb` once when `el` enters the viewport (immediately if IO is unsupported). */
  function onceVisible(el, cb, options = { threshold: 0.35 }) {
    if (!("IntersectionObserver" in window)) return cb();
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        cb();
      }
    }, options);
    io.observe(el);
  }

  /**
   * CV download link. Real href + download attr so it works without JS;
   * main.js intercepts clicks to show loading/feedback states.
   * `label` = visible text that gets swapped for status; `compact` = short label on mobile.
   */
  function cvLink({ label, cls = "btn btn-secondary", compact = false }) {
    const cv = window.SITE_CONTENT.cv;
    const text = compact
      ? `<span><span class="sr-only sm:not-sr-only">Download </span>CV</span>`
      : `<span data-cv-label>${esc(label)}</span>`;
    return `
      <a href="${esc(cv.href)}" download="${esc(cv.fileName)}" data-cv class="${cls}">
        <span data-cv-icon class="inline-flex">${icon.download}</span>${text}<span class="sr-only"> (PDF)</span>
      </a>`;
  }

  /**
   * Page-wide skill filter shared by Toolkit and Selected Work.
   *   [data-skill-btn][data-skill="x"]  → toggles filter "x" on click (aria-pressed synced)
   *   [data-skill="x"]                  → gets .is-match when "x" is active
   *   [data-skills="x y z"]             → project cards: .is-match / .is-dimmed
   *   [data-filter-status]              → status chip (label, count, clear button)
   */
  const skillFilter = (() => {
    let active = null;
    let activeLabel = "";
    const subscribers = [];

    function apply() {
      document.querySelectorAll("[data-skill]").forEach((el) => {
        const on = el.dataset.skill === active;
        el.classList.toggle("is-match", on);
        if (el.hasAttribute("data-skill-btn")) el.setAttribute("aria-pressed", String(on));
      });

      let count = 0;
      document.querySelectorAll("[data-skills]").forEach((el) => {
        const on = !!active && el.dataset.skills.split(" ").includes(active);
        if (on) count++;
        el.classList.toggle("is-match", on);
        el.classList.toggle("is-dimmed", !!active && !on);
      });

      const countText = count ? `${count} matching project${count === 1 ? "" : "s"}` : "No projects tagged yet";
      document.querySelectorAll("[data-filter-status]").forEach((el) => {
        el.hidden = !active;
        el.querySelector("[data-filter-label]").textContent = activeLabel;
        el.querySelector("[data-filter-count]").textContent = countText;
      });

      subscribers.forEach((fn) => fn(active));
      announce(active ? `Highlighting ${activeLabel}: ${countText.toLowerCase()}` : "Skill highlight cleared");
    }

    function toggle(key, label) {
      active = active === key ? null : key;
      activeLabel = active ? label : "";
      apply();
    }

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-skill-btn]");
      if (btn) return toggle(btn.dataset.skill, btn.dataset.skillLabel || btn.textContent.trim());
      if (e.target.closest("[data-filter-clear]")) toggle(null, "");
    });

    const status = (extra = "") => `
      <p data-filter-status hidden class="filter-status">
        <span>Highlighting <strong data-filter-label></strong></span>
        <span aria-hidden="true">·</span>
        <span data-filter-count></span>
        ${extra}
        <button type="button" data-filter-clear class="filter-clear">Clear <span aria-hidden="true">✕</span></button>
      </p>`;

    return { toggle, status, subscribe: (fn) => subscribers.push(fn), get active() { return active; } };
  })();

  /** Rebecca's own profile links (GitHub, LinkedIn) as icon buttons. */
  function socialLinks(cls = "btn btn-sm btn-secondary size-10 !p-0") {
    const s = window.SITE_CONTENT.social || {};
    const name = window.SITE_CONTENT.name;
    const items = [
      s.github && { href: s.github, label: `${name} on GitHub (opens in a new tab)`, ic: icon.github },
      s.linkedin && { href: s.linkedin, label: `${name} on LinkedIn (opens in a new tab)`, ic: icon.linkedin },
    ].filter((x) => x && /^https:\/\//i.test(x.href));
    return items
      .map((x) => `<a href="${esc(x.href)}" target="_blank" rel="noopener noreferrer" class="${cls}" aria-label="${esc(x.label)}">${x.ic}</a>`)
      .join("");
  }

  return { esc, svg, icon, eyebrow, highlight, announce, store, motionOK, wait, pad, slug, onceVisible, cvLink, socialLinks, skillFilter, sections: {} };
})();
