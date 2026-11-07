/* Site footer: name, profile links, CV, back to top. */
(function (Site) {
  "use strict";
  const { esc, cvLink, socialLinks, sections } = Site;

  sections.footer = {
    render(site) {
      const year = new Date().getFullYear();
      return `
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
