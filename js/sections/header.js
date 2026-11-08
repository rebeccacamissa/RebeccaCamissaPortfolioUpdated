/* Site header: brand, primary nav, CV download, theme toggle. */
(function (Site) {
  "use strict";
  const { esc, icon, cvLink, sections } = Site;

  sections.header = {
    render(site) {
      const navLinks = site.nav
        .map(
          (l) => `
          <li>
            <a href="${esc(l.href)}"
               class="relative block px-2 py-1 font-display font-semibold text-ink
                      after:absolute after:inset-x-2 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200
                      hover:after:scale-x-100">${esc(l.label)}</a>
          </li>`
        )
        .join("");

      return `
        <nav aria-label="Primary"
             class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 sm:gap-x-6 py-3 sm:px-8">
          <a href="#top" class="group flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-ink">
            <span aria-hidden="true"
                  class="decor grid size-9 place-items-center border-2 border-ink bg-pink text-sm text-onyx shadow-brutal-sm transition-[rotate] duration-200 group-hover:-rotate-6">RA</span>
            ${esc(site.name)}
          </a>

          <ul class="order-3 flex w-full gap-2 sm:order-none sm:w-auto sm:gap-4" role="list">
            ${navLinks}
          </ul>

          <div class="flex items-center gap-2.5">
            ${cvLink({ cls: "btn btn-sm btn-secondary", compact: true })}
            <button type="button" data-action="open-a11y" aria-haspopup="dialog"
                    class="btn btn-sm btn-secondary size-10 !p-0" aria-label="Accessibility settings">
              ${icon.access}
            </button>
            <button type="button" data-action="toggle-theme"
                    class="btn btn-sm btn-secondary decor size-10 !p-0"
                    aria-pressed="false" aria-label="Switch to dark theme">
              <span class="dark:hidden">${icon.moon}</span>
              <span class="hidden dark:inline">${icon.sun}</span>
            </button>
          </div>
        </nav>`;
    },
  };
})(window.Site);
