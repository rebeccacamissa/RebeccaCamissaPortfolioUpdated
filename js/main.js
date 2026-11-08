/**
 * Entry point: mounts each section from window.SITE_CONTENT into its
 * placeholder element and wires up page-wide interactions.
 */
(function () {
  "use strict";

  const site = window.SITE_CONTENT;
  const Site = window.Site;
  if (!site || !Site) return;

  const { icon, announce, store, motionOK, wait, sections } = Site;
  const root = document.documentElement;

  /* ------------------------------ Mount ------------------------------- */
  // element id → section module
  const MOUNTS = {
    "site-header": sections.header,
    hero: sections.hero,
    story: sections.story,
    pivot: sections.pivot,
    voices: sections.voices,
    toolkit: sections.toolkit,
    work: sections.work,
    certificates: sections.certificates,
    contact: sections.contact,
    "site-footer": sections.footer,
    marquee: sections.marquee,
    adam: sections.adam,
    a11y: sections.a11y,
    fun: sections.fun,
  };

  Object.entries(MOUNTS).forEach(([id, section]) => {
    const el = document.getElementById(id);
    if (!el || !section) return;
    el.innerHTML = section.render(site);
    if (section.init) {
      try {
        section.init(el, site);
      } catch (err) {
        console.error(`[${id}] init failed`, err); // content still renders
      }
    }
  });

  /* ------------------------- Theme / plain view ------------------------ */
  function syncThemeButton() {
    const dark = root.dataset.theme === "dark";
    document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? "#18181b" : "#f9f6ee";
  }

  function syncViewButton() {
    const plain = root.dataset.view === "plain";
    const c = site.hero.ctas.plainText;
    document.querySelectorAll('[data-action="toggle-view"]').forEach((btn) => {
      btn.setAttribute("aria-pressed", String(plain));
      btn.querySelector("[data-view-label]").textContent = plain ? c.activeLabel : c.label;
      btn.querySelector("[data-view-icon]").innerHTML = plain ? icon.palette : icon.text;
    });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    if (btn.dataset.action === "toggle-theme") {
      const dark = root.dataset.theme !== "dark";
      dark ? (root.dataset.theme = "dark") : delete root.dataset.theme;
      store("theme", dark ? "dark" : null);
      syncThemeButton();
      announce(dark ? "Dark theme on" : "Light theme on");
    }

    if (btn.dataset.action === "toggle-view") {
      const plain = root.dataset.view !== "plain";
      plain ? (root.dataset.view = "plain") : delete root.dataset.view;
      store("view", plain ? "plain" : null);
      syncViewButton();
      announce(plain ? "Plain-text version on" : "Styled version on");
    }
  });

  /* --------------------------- CV download ---------------------------- */
  // Over http(s) we check the file exists first so a missing PDF gives
  // friendly feedback instead of a broken download. From file:// we can't
  // check, so we just start the download.
  async function cvAvailable(url) {
    if (!/^https?:$/.test(location.protocol)) return true;
    try {
      const res = await fetch(url, { method: "HEAD", cache: "no-store" });
      return res.ok;
    } catch (_) {
      return false;
    }
  }

  document.addEventListener("click", async (e) => {
    const link = e.target.closest("a[data-cv]");
    if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (link.dataset.state) return;

    const iconEl = link.querySelector("[data-cv-icon]");
    const labelEl = link.querySelector("[data-cv-label]");
    const original = { icon: iconEl.innerHTML, label: labelEl && labelEl.textContent };

    const set = (state, ic, label) => {
      link.dataset.state = state;
      iconEl.innerHTML = ic;
      if (labelEl && label) labelEl.textContent = label;
    };

    link.style.minWidth = `${link.offsetWidth}px`; // no layout jump while label changes
    link.setAttribute("aria-busy", "true");
    set("loading", icon.spinner, "Preparing…");
    announce("Preparing CV download");

    const [ok] = await Promise.all([cvAvailable(link.href), wait(700)]);
    link.removeAttribute("aria-busy");

    if (ok) {
      const a = document.createElement("a");
      a.href = link.href;
      a.download = link.getAttribute("download") || "";
      document.body.appendChild(a);
      a.click();
      a.remove();
      set("done", icon.check, "Download started");
      announce("CV download started");
    } else {
      set("error", icon.alert, "CV coming soon");
      announce("The CV file isn't available yet. Please check back soon.");
    }

    await wait(2400);
    iconEl.innerHTML = original.icon;
    if (labelEl) labelEl.textContent = original.label;
    delete link.dataset.state;
    link.style.minWidth = "";
  });

  /* ------------------------- Scroll reveal ---------------------------- */
  // Only hide [data-reveal] elements once we know we can reveal them again.
  // Section headings get a kinetic wipe; everything else fades up with a spring.
  document.querySelectorAll('main section h2[id$="-title"]').forEach((h) => {
    if (!h.hasAttribute("data-reveal")) h.setAttribute("data-reveal", "title");
  });

  if (motionOK() && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        // Stagger items that arrive together (e.g. a row of cards), in DOM order.
        entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target)
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
          .forEach((el, i) => {
            el.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 80}ms`);
            el.classList.add("is-visible");
            io.unobserve(el);
          });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    root.classList.add("reveal-ready");
  }

  /* --------------------- In-page anchor focus ------------------------- */
  // Move focus to in-page targets so keyboard + screen reader users land there too.
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
  });

  syncThemeButton();
  syncViewButton();

  /* ---------------------- Offline (service worker) ---------------------- */
  // Only over http(s) — service workers don't run from file://.
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("sw.js")
        .then(() => navigator.serviceWorker.ready)
        .then((reg) => {
          // Hand the worker everything this page already loaded, so the
          // first visit is enough to work offline afterwards.
          const urls = [location.href.split("#")[0], ...performance.getEntriesByType("resource").map((r) => r.name)];
          if (reg.active) reg.active.postMessage({ type: "cache-urls", urls });
        })
        .catch(() => { /* offline support is a bonus — ignore failures */ });
    });
  }

  // Sections are rendered by JS, so the browser's initial jump to #hash
  // happened before they had height. Re-apply it now that they exist.
  if (location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant", block: "start" }));
  }
})();
