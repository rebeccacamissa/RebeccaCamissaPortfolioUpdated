/* 08 · Certificates — filterable evidence library with an on-page document viewer.
   PDFs load only when a certificate is selected (and the section is on screen). */
(function (Site) {
  "use strict";
  const { esc, icon, eyebrow, highlight, announce, onceVisible, sections } = Site;

  const CHIP = ["bg-highlight text-onyx", "bg-accent text-on-accent", "bg-onyx text-highlight", "bg-paper-deep text-ink"];

  const safeHttps = (url) => (/^https:\/\//i.test(url || "") ? url : "");
  // Local relative paths (assets/…) or https only — no javascript:/data: URLs.
  const safeDoc = (url) => (/^(https:\/\/|[\w./-]+\.pdf$)/i.test(url || "") ? url : "");

  const initials = (s) =>
    String(s).replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  // "2026-09-01" → "1 Sep 2026" (fixed format; locale output varies, e.g. "01 Sept").
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtDate = (iso) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    return m ? `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}` : "";
  };

  const provider = (c) => c.issuer || c.platform || "Certificate";

  // Stable colour per provider so the same issuer always gets the same chip.
  const chipClass = (c) => {
    const key = provider(c);
    let h = 0;
    for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return CHIP[h % CHIP.length];
  };

  const meta = (c) => [c.issuer, c.platform, fmtDate(c.date)].filter(Boolean).join(" • ");

  sections.certificates = {
    render(site) {
      const cfg = site.certificates;
      const certs = window.SITE_CERTIFICATES || [];

      const filters = cfg.filters
        .map(
          (f, i) => `
          <button type="button" class="cert-filter" data-cert-filter="${esc(f.id)}" aria-pressed="${i === 0}">
            ${esc(f.label)}
          </button>`
        )
        .join("");

      const cards = certs
        .map(
          (c, i) => `
          <li data-cert-cat="${esc(c.category)}">
            <button type="button" class="cert-card" data-cert="${i}" aria-pressed="false" aria-controls="cert-viewer">
              <span class="cert-chip ${chipClass(c)}" aria-hidden="true">${esc(initials(provider(c)))}</span>
              <span class="min-w-0 flex-1">
                <span class="block font-display font-bold leading-snug">${esc(c.title)}</span>
                <span class="mt-0.5 block text-sm text-ink-soft">${esc(meta(c))}</span>
              </span>
              <span class="cert-badge">Viewing</span>
            </button>
          </li>`
        )
        .join("");

      return `
        <div class="section-shell">
          ${eyebrow(cfg.eyebrow)}
          <div class="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p class="font-display text-sm font-bold uppercase tracking-[0.14em] text-accent">${esc(cfg.kicker)}</p>
              <h2 id="certificates-title" class="mt-2 font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
                ${highlight(cfg.headline, cfg.headlineHighlight)}
              </h2>
            </div>
            <p class="max-w-xl text-lg leading-relaxed text-ink-soft">${esc(cfg.subtitle)}</p>
          </div>

          <div class="mt-12 flex flex-wrap items-center justify-between gap-4">
            <div class="flex flex-wrap gap-2" role="group" aria-label="Filter certificates by category">${filters}</div>
            <p class="cert-counter" aria-live="polite">
              <span data-cert-shown>${certs.length}</span> of ${certs.length} certificates
            </p>
          </div>

          <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <ul class="cert-list" role="list" aria-label="Certificates">${cards}</ul>
            <div id="cert-viewer" class="cert-viewer" aria-labelledby="cert-viewer-title" role="region"></div>
          </div>
        </div>`;
    },

    init(el, site) {
      const cfg = site.certificates;
      const certs = window.SITE_CERTIFICATES || [];
      if (!certs.length) return;

      const viewer = el.querySelector("#cert-viewer");
      const cards = [...el.querySelectorAll("[data-cert]")];
      const filterBtns = [...el.querySelectorAll("[data-cert-filter]")];
      const shownEl = el.querySelector("[data-cert-shown]");
      const catLabel = (id) => (cfg.filters.find((f) => f.id === id) || {}).long || "";

      let selected = -1;
      let loadDocs = false; // don't fetch any PDF until the section is on screen

      function viewerHTML(c) {
        const pdf = safeDoc(c.pdf);
        const source = safeHttps(c.source);
        const date = fmtDate(c.date);

        const action = (href, label, ic, aria) =>
          href
            ? `<a href="${esc(href)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary" aria-label="${esc(aria)}">${ic}${esc(label)}</a>`
            : `<span class="btn btn-sm btn-secondary cert-action-off" aria-disabled="true">${ic}${esc(label)}<span class="sr-only"> (not available yet)</span></span>`;

        const doc = pdf && loadDocs
          ? `<iframe src="${esc(pdf)}#view=FitH" title="Certificate document: ${esc(c.title)}" class="size-full bg-white" loading="lazy"></iframe>`
          : `<div class="grid size-full place-items-center p-6 text-center">
               <div>
                 <span class="decor mx-auto grid size-14 place-items-center border-2 border-ink bg-paper font-display text-xl font-bold shadow-brutal-sm" aria-hidden="true">PDF</span>
                 <p class="mt-4 font-display font-bold">${pdf ? "Loading document…" : "Document coming soon"}</p>
                 <p class="mt-1 text-sm text-ink-soft">${pdf ? "" : "The source file for this certificate is being added."}</p>
               </div>
             </div>`;

        return `
          <div class="flex items-start gap-4 border-b-2 border-ink p-5 sm:p-6">
            <span class="cert-chip cert-chip-lg ${chipClass(c)}" aria-hidden="true">${esc(initials(provider(c)))}</span>
            <div class="min-w-0">
              <p class="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">${esc(catLabel(c.category))}</p>
              <h3 id="cert-viewer-title" class="mt-1 font-display text-xl font-bold leading-snug sm:text-2xl">${esc(c.title)}</h3>
            </div>
          </div>

          <dl class="grid grid-cols-3 border-b-2 border-ink text-sm">
            <div class="border-r-2 border-ink p-4"><dt class="cert-dt">Issuer</dt><dd class="font-semibold">${esc(c.issuer || "—")}</dd></div>
            <div class="border-r-2 border-ink p-4"><dt class="cert-dt">Platform</dt><dd class="font-semibold">${esc(c.platform || "—")}</dd></div>
            <div class="p-4"><dt class="cert-dt">Completed</dt><dd class="font-semibold">${esc(date || "—")}</dd></div>
          </dl>

          <div class="p-5 sm:p-6">
            <div class="cert-doc paper-grid">${doc}</div>
            <div class="mt-5 flex flex-wrap gap-3">
              ${action(pdf, "View PDF", icon.external, `View ${c.title} certificate PDF (opens in a new tab)`)}
              ${action(source, "Open Source", icon.external, `Verify ${c.title} at source (opens in a new tab)`)}
            </div>
          </div>`;
      }

      function select(i, { fromUser = false } = {}) {
        selected = i;
        cards.forEach((b) => b.setAttribute("aria-pressed", String(Number(b.dataset.cert) === i)));
        viewer.innerHTML = viewerHTML(certs[i]);
        if (fromUser) {
          announce(`Showing ${certs[i].title}`);
          // On single-column layouts the viewer sits below the list — bring it into view.
          if (!window.matchMedia("(min-width: 64rem)").matches) viewer.scrollIntoView({ block: "start" });
        }
      }

      function filter(id) {
        filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.certFilter === id)));
        let shown = 0;
        let firstVisible = -1;
        cards.forEach((b) => {
          const li = b.parentElement;
          const on = id === "all" || li.dataset.certCat === id;
          li.hidden = !on;
          if (on) {
            shown++;
            if (firstVisible < 0) firstVisible = Number(b.dataset.cert);
          }
        });
        shownEl.textContent = shown;
        if (firstVisible >= 0 && cards[selected] && cards[selected].parentElement.hidden) select(firstVisible);
      }

      cards.forEach((b) => b.addEventListener("click", () => select(Number(b.dataset.cert), { fromUser: true })));
      filterBtns.forEach((b) => b.addEventListener("click", () => filter(b.dataset.certFilter)));

      select(0);
      onceVisible(el, () => {
        loadDocs = true;
        select(selected);
      }, { threshold: 0.1 });
    },
  };
})(window.Site);
