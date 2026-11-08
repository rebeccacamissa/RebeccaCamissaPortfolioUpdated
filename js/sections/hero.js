/* 01 · Hero / Welcome */
(function (Site) {
  "use strict";
  const { esc, icon, cvLink, socialLinks, sections } = Site;

  // Visual placement for floating tags (UI concern, so it lives here, not in content).
  const TAG_LAYOUT = [
    { pos: "lg:top-[9%] lg:left-[5%]", style: "bg-highlight text-onyx -rotate-3 [animation-delay:0s]" },
    { pos: "lg:top-[36%] lg:right-[3%]", style: "bg-paper text-ink rotate-2 [animation-delay:-1.8s]" },
    { pos: "lg:bottom-[25%] lg:left-[3%]", style: "bg-accent text-on-accent -rotate-1 [animation-delay:-3.6s]" },
    { pos: "lg:bottom-[8%] lg:right-[7%]", style: "bg-pink text-onyx rotate-3 [animation-delay:-5.2s]" },
  ];

  /* Kinetic marquee band under the hero — decorative, built from hero data. */
  sections.marquee = {
    render(site) {
      const h = site.hero;
      const items = [...h.tags, h.location, h.availability];
      const run = items
        .map((t, i) => `<span class="marquee-item">${esc(t)}</span><span class="marquee-star marquee-star-${i % 3}">✦</span>`)
        .join("");
      return `<div class="marquee-track">${run}${run}</div>`;
    },
  };

  sections.hero = {
    render(site) {
      const h = site.hero;
      const c = h.ctas;

      const tags = h.tags
        .map((t, i) => {
          const l = TAG_LAYOUT[i % TAG_LAYOUT.length];
          return `
          <li class="sticker relative z-10 lg:absolute ${l.pos}" data-sticker>
            <span class="tag motion-safe:lg:animate-float ${l.style}">${esc(t)}</span>
          </li>`;
        })
        .join("");

      return `
        <div class="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-28 lg:pt-16 plain:block">

          <!-- Copy column -->
          <div class="min-w-0">
            <p class="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 border-2 border-ink bg-paper px-3 py-1.5 text-sm font-semibold shadow-brutal-sm">
              <span class="decor relative size-2.5 rounded-full bg-emerald-500 motion-safe:animate-pulse-dot" aria-hidden="true"></span>
              <span class="inline-flex items-center gap-1">${icon.pin}${esc(h.location)}</span>
              <span aria-hidden="true" class="text-ink-soft">•</span>
              <span>${esc(h.availability)}</span>
            </p>

            <h1 id="hero-title" class="mt-7 font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.25rem]">
              <span class="block">${esc(h.greeting)}</span>
              <span class="sr-only"> – </span>
              <span class="marker">${esc(h.role)}</span>
            </h1>

            <p class="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              ${esc(h.subtitle)}
            </p>

            <div class="mt-9 flex flex-wrap items-center gap-4">
              <a href="${esc(c.primary.href)}" class="btn btn-primary">
                ${esc(c.primary.label)}${icon.arrow}
              </a>
              ${cvLink({ label: c.resume.label })}
              <button type="button" data-action="toggle-view" aria-pressed="false" class="btn btn-ghost">
                <span data-view-icon>${icon.text}</span><span data-view-label>${esc(c.plainText.label)}</span>
              </button>
            </div>

            <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href="${esc(c.story.href)}"
                 class="group inline-flex items-center gap-1.5 font-display font-bold text-accent underline decoration-2 underline-offset-4 hover:decoration-wavy">
                ${esc(c.story.label)}
                <span aria-hidden="true" class="inline-block transition-[translate] duration-200 group-hover:translate-x-1">→</span>
              </a>
              <span class="flex items-center gap-2.5">${socialLinks()}</span>
            </div>

            <p class="mt-10 flex max-w-md items-start gap-3 border-l-4 border-pink bg-paper-deep px-4 py-3 text-sm text-ink-soft">
              <span class="decor mt-0.5 font-display font-bold text-ink" aria-hidden="true">↳</span>
              <span>${esc(h.program.lead)} <strong class="font-display font-bold text-ink">${esc(h.program.name)}</strong> (${esc(h.program.detail)})</span>
            </p>
          </div>

          <!-- Visual column -->
          <div class="plain-reset relative mt-2 min-w-0 border-2 border-ink bg-paper-deep p-6 shadow-brutal-lg paper-grid sm:p-8 lg:mt-0 lg:min-h-[540px] lg:p-0 plain:mt-8" data-sticker-board>
            <p class="sticker-hint decor" aria-hidden="true">${esc((site.fun && site.fun.stickerHint) || "drag the stickers")} ↗</p>
            ${
              h.photo
                ? `<figure class="hero-photo">
                     <img src="${esc(h.photo.src)}" alt="${esc(h.photo.alt)}" width="${Number(h.photo.width)}" height="${Number(h.photo.height)}"
                          fetchpriority="high" decoding="async" />
                     <figcaption class="hero-photo-caption">${esc(h.photo.caption)}</figcaption>
                     <span class="hero-photo-sticker decor" aria-hidden="true">${esc(h.codeTag)}</span>
                   </figure>`
                : `<div class="decor mx-auto mb-6 grid size-28 place-items-center border-2 border-ink bg-onyx font-display text-4xl font-bold shadow-brutal
                               motion-safe:animate-float lg:absolute lg:inset-0 lg:m-auto lg:size-40 lg:-rotate-6 lg:text-6xl" aria-hidden="true">
                     <span class="text-pink">${esc(h.codeTag)}</span>
                   </div>`
            }

            <h2 class="sr-only plain:not-sr-only plain:mb-2 plain:font-bold">Highlights</h2>
            <ul class="plain-reset plain-list flex flex-wrap justify-center gap-4 lg:absolute lg:inset-0 lg:block" role="list">
              ${tags}
            </ul>
          </div>
        </div>`;
    },

    // Decorative: the floating tags can be dragged around like stickers
    // (mouse/pen only, so touch scrolling is never hijacked). Double-click resets.
    init(el) {
      if (!window.matchMedia("(pointer: fine)").matches) return;
      const board = el.querySelector("[data-sticker-board]");
      el.querySelectorAll("[data-sticker]").forEach((li) => {
        let drag = null;
        const num = (prop) => parseFloat(li.style.getPropertyValue(prop)) || 0;

        li.addEventListener("pointerdown", (e) => {
          if (e.button !== 0 || document.documentElement.dataset.view === "plain") return;
          e.preventDefault();
          li.setPointerCapture(e.pointerId);
          const dx = num("--dx");
          const dy = num("--dy");
          const r = li.getBoundingClientRect();
          const b = board.getBoundingClientRect();
          // Keep the sticker inside the board.
          drag = {
            sx: e.clientX - dx,
            sy: e.clientY - dy,
            minX: b.left - (r.left - dx) + 6,
            maxX: b.right - (r.right - dx) - 6,
            minY: b.top - (r.top - dy) + 6,
            maxY: b.bottom - (r.bottom - dy) - 6,
          };
          li.classList.add("is-dragging");
        });
        li.addEventListener("pointermove", (e) => {
          if (!drag) return;
          const x = Math.max(drag.minX, Math.min(drag.maxX, e.clientX - drag.sx));
          const y = Math.max(drag.minY, Math.min(drag.maxY, e.clientY - drag.sy));
          li.style.setProperty("--dx", `${x}px`);
          li.style.setProperty("--dy", `${y}px`);
        });
        const end = () => {
          drag = null;
          li.classList.remove("is-dragging");
        };
        li.addEventListener("pointerup", end);
        li.addEventListener("pointercancel", end);
        li.addEventListener("dblclick", () => {
          li.style.removeProperty("--dx");
          li.style.removeProperty("--dy");
        });
      });
    },
  };
})(window.Site);
