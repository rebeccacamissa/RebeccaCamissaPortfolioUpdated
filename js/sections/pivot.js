/* 03 · The Pivot — timeline with sticky node rail, scroll-synced active state. */
(function (Site) {
  "use strict";
  const { esc, eyebrow, highlight, pad, slug, sections } = Site;

  sections.pivot = {
    render(site) {
      const p = site.pivot;
      const id = (m) => `milestone-${slug(m.era)}`;

      const railLinks = p.milestones
        .map(
          (m, i) => `
          <li>
            <a href="#${id(m)}" class="tl-link" data-tl-link="${i}">
              <span class="tl-node" aria-hidden="true">${pad(i + 1)}</span>
              <span class="flex flex-col">
                <span class="font-display text-lg font-bold leading-tight">${esc(m.era)}</span>
                <span class="text-xs text-ink-soft">${esc(m.label)}</span>
              </span>
            </a>
          </li>`
        )
        .join("");

      const cards = p.milestones
        .map(
          (m, i) => `
          <li id="${id(m)}" class="tl-item relative" data-tl-item="${i}" data-reveal>
            <span class="tl-dot decor" aria-hidden="true"></span>
            <article class="lift-card p-6 sm:p-8" aria-labelledby="${id(m)}-title">
              <p class="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span class="tl-era">${esc(m.era)}</span>
                <span class="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">${esc(m.label)}</span>
              </p>
              <h3 id="${id(m)}-title" class="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl">${esc(m.title)}</h3>
              <p class="mt-3 max-w-2xl leading-relaxed text-ink-soft">${esc(m.description)}</p>
            </article>
          </li>`
        )
        .join("");

      return `
        <div class="section-shell">
          ${eyebrow(p.eyebrow)}

          <div class="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
            <h2 id="pivot-title" class="font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
              ${highlight(p.headline, p.headlineHighlight)}
            </h2>
            <p class="max-w-xl text-lg leading-relaxed text-ink-soft">${esc(p.subtitle)}</p>
          </div>

          <div class="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[220px_1fr] lg:gap-14">
            <nav aria-label="Timeline milestones" class="decor hidden lg:block">
              <div class="tl-rail sticky top-28">
                <span class="tl-line" aria-hidden="true"><span class="tl-line-fill"></span></span>
                <ol class="relative space-y-2" role="list">${railLinks}</ol>
              </div>
            </nav>

            <ol class="tl-list" role="list">${cards}</ol>
          </div>

          <p class="mt-16 flex justify-center">
            <span class="tag -rotate-1 bg-pink px-5 py-2.5 text-base text-onyx sm:text-lg">${esc(p.banner)}</span>
          </p>
        </div>`;
    },

    init(el) {
      const items = [...el.querySelectorAll("[data-tl-item]")];
      const links = [...el.querySelectorAll("[data-tl-link]")];
      const rail = el.querySelector(".tl-rail");
      let active = -1;

      const setActive = (i) => {
        if (i === active) return;
        active = i;
        items.forEach((it, j) => it.classList.toggle("is-active", j === i));
        links.forEach((l, j) => (j === i ? l.setAttribute("aria-current", "step") : l.removeAttribute("aria-current")));
        rail.style.setProperty("--tl-progress", items.length > 1 ? i / (items.length - 1) : 1);
      };

      links.forEach((l) => l.addEventListener("click", () => setActive(Number(l.dataset.tlLink))));

      if (!("IntersectionObserver" in window)) return setActive(0);

      // Whichever card crosses the band ~40% down the viewport is "current".
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.tlItem)));
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      items.forEach((it) => io.observe(it));
      setActive(0);
    },
  };
})(window.Site);
