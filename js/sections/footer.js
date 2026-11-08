/* Site footer: name, profile links, CV, back to top. */
(function (Site) {
  "use strict";
  const { esc, cvLink, socialLinks, sections } = Site;

  sections.footer = {
    render(site) {
      const year = new Date().getFullYear();
      const ff = site.funFact;
      const funFact = ff
        ? `
          <aside class="fun-fact" aria-labelledby="fun-fact-title">
            <span class="fun-fact-badge" aria-hidden="true">⚡</span>
            <div class="min-w-0">
              <p class="font-display text-xs font-bold uppercase tracking-[0.16em]">${esc(ff.label)}</p>
              <h2 id="fun-fact-title" class="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">${esc(ff.headline)}</h2>
              <p class="mt-2 max-w-2xl leading-relaxed">${esc(ff.text)}</p>
              <p class="mt-2 text-sm opacity-80">${esc(ff.how)}</p>
            </div>
          </aside>`
        : "";
      return `
        <div class="mx-auto max-w-6xl px-5 pt-12 sm:px-8">${funFact}</div>
        <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-10 sm:px-8">
          <div>
            <p class="font-display text-lg font-bold">${esc(site.name)}</p>
            <p class="text-sm text-ink-soft">${esc(site.hero.role)} · ${esc(site.hero.location)}</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            ${socialLinks()}
            ${cvLink({ label: "CV", cls: "btn btn-sm btn-secondary" })}
            <a href="#top" class="btn btn-sm btn-ghost">Back to top <span aria-hidden="true">↑</span></a>
          </div>
          <p class="w-full text-xs text-ink-soft">© ${year} ${esc(site.name)}</p>
        </div>`;
    },
  };
})(window.Site);
