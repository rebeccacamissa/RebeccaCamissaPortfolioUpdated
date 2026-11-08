/* 04 · Mentorship & Growth — testimonial carousel.
   Native scroll-snap gives touch swipe for free (no gesture library);
   JS only adds prev/next, autoplay and the position counter. */
(function (Site) {
  "use strict";
  const { esc, icon, eyebrow, announce, motionOK, pad, sections } = Site;

  const AVATAR = [
    "bg-highlight text-onyx",
    "bg-accent text-on-accent",
    "bg-coral text-onyx",
    "bg-onyx text-highlight",
  ];

  const initials = (name) =>
    name.replace(/[^\p{L}\s]/gu, "").split(/\s+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const safeUrl = (url) => (/^https:\/\//i.test(url || "") ? url : "");

  sections.voices = {
    render(site) {
      const v = site.voices;
      const n = v.testimonials.length;

      const slides = v.testimonials
        .map((t, i) => {
          const li = safeUrl(t.linkedin);
          return `
          <li class="carousel-slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${n}">
            <article class="lift-card flex h-full flex-col p-6 sm:p-8">
              <span class="decor font-display text-6xl leading-[0.6] text-accent" aria-hidden="true">“</span>
              <h3 class="mt-5 font-display text-2xl font-bold leading-tight">${esc(t.headline)}</h3>
              <blockquote class="mt-4 flex-1 text-lg leading-relaxed text-ink-soft">
                <p>${esc(t.quote)}</p>
              </blockquote>
              <footer class="mt-7 flex items-center gap-3 border-t-2 border-dashed border-ink/25 pt-5">
                <span class="decor grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink font-display text-sm font-bold ${AVATAR[i % AVATAR.length]}"
                      aria-hidden="true">${esc(initials(t.name))}</span>
                <span class="min-w-0 flex-1">
                  <span class="block font-display font-bold">${esc(t.name)}</span>
                  <span class="block text-sm text-ink-soft">${esc(t.role)}</span>
                </span>
                ${
                  li
                    ? `<a href="${esc(li)}" target="_blank" rel="noopener noreferrer"
                          class="btn btn-sm btn-secondary size-10 !p-0"
                          aria-label="${esc(t.name)} on LinkedIn (opens in a new tab)">${icon.linkedin}</a>`
                    : ""
                }
              </footer>
            </article>
          </li>`;
        })
        .join("");

      return `
        <div class="section-shell">
          <div class="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div class="max-w-2xl">
              ${eyebrow(v.eyebrow)}
              <p class="mt-8 font-display text-sm font-bold uppercase tracking-[0.14em] text-accent">${esc(v.label)}</p>
              <h2 id="voices-title" class="mt-2 font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">${esc(v.headline)}</h2>
              <p class="mt-5 text-lg leading-relaxed text-ink-soft">${esc(v.subtitle)}</p>
            </div>

            <div class="decor flex flex-wrap items-center gap-3" role="group" aria-label="Carousel controls">
              <button type="button" class="btn btn-sm btn-secondary uppercase" data-carousel="prev" aria-controls="voices-track">
                ${icon.chevronLeft}${esc(v.controls.previous)}
              </button>
              <button type="button" class="btn btn-sm btn-secondary uppercase" data-carousel="next" aria-controls="voices-track">
                ${esc(v.controls.next)}${icon.chevronRight}
              </button>
              <button type="button" class="btn btn-sm btn-primary uppercase" data-carousel="play" aria-controls="voices-track" aria-pressed="false">
                <span data-play-icon class="inline-flex">${icon.play}</span><span data-play-label>${esc(v.controls.play)}</span>
              </button>
            </div>
          </div>

          <div class="mt-10" role="region" aria-roledescription="carousel" aria-label="Colleague reflections">
            <ul id="voices-track" class="carousel-track" role="list" tabindex="0"
                aria-label="Testimonials — scroll or swipe sideways">
              ${slides}
            </ul>

            <div class="decor mt-4 flex items-center gap-4" aria-hidden="true">
              <span class="font-display text-sm font-bold tabular-nums"><span data-carousel-pos>01</span> / ${pad(n)}</span>
              <span class="relative h-[3px] flex-1 bg-ink/15">
                <span class="carousel-progress"></span>
              </span>
            </div>
          </div>
        </div>`;
    },

    init(el, site) {
      const v = site.voices;
      const track = el.querySelector(".carousel-track");
      const slides = [...track.children];
      const region = el.querySelector('[aria-roledescription="carousel"]');
      const playBtn = el.querySelector('[data-carousel="play"]');
      const posEl = el.querySelector("[data-carousel-pos]");
      const bar = el.querySelector(".carousel-progress");
      if (slides.length < 2) return;

      const step = () => slides[1].offsetLeft - slides[0].offsetLeft;
      const visible = () => Math.max(1, Math.round((track.clientWidth + 1) / step()));
      const maxIndex = () => Math.max(0, slides.length - visible());
      const current = () => Math.min(maxIndex(), Math.round(track.scrollLeft / step()));

      function go(i, { announceIt = false } = {}) {
        const max = maxIndex();
        const target = i > max ? 0 : i < 0 ? max : i;
        track.scrollTo({ left: slides[target].offsetLeft - slides[0].offsetLeft, behavior: motionOK() ? "smooth" : "auto" });
        if (announceIt) {
          const shown = visible();
          announce(shown > 1
            ? `Showing testimonials ${target + 1} to ${Math.min(slides.length, target + shown)} of ${slides.length}`
            : `Testimonial ${target + 1} of ${slides.length}`);
        }
      }

      // Position counter + progress bar, throttled to one update per frame.
      let raf = 0;
      function sync() {
        raf = 0;
        const i = current();
        const shown = visible();
        const last = Math.min(slides.length, i + shown);
        posEl.textContent = shown > 1 ? `${pad(i + 1)}–${pad(last)}` : pad(i + 1);
        bar.style.setProperty("--carousel-progress", last / slides.length);
      }
      track.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(sync); }, { passive: true });
      window.addEventListener("resize", sync);
      sync();

      // Autoplay — off by default; pauses while hovered, while the cards have
      // focus, and while the tab is hidden. Manual nav restarts the timer.
      let playing = false;
      let hold = false;
      let timer = 0;

      const restart = () => {
        clearInterval(timer);
        if (playing) timer = setInterval(() => { if (!hold && !document.hidden) go(current() + 1); }, v.autoplayMs);
      };

      function setPlaying(on) {
        playing = on;
        playBtn.setAttribute("aria-pressed", String(on));
        playBtn.querySelector("[data-play-label]").textContent = on ? v.controls.pause : v.controls.play;
        playBtn.querySelector("[data-play-icon]").innerHTML = on ? icon.pause : icon.play;
        restart();
        announce(on ? "Autoplay on" : "Autoplay paused");
      }

      el.querySelector('[data-carousel="prev"]').addEventListener("click", () => { go(current() - 1, { announceIt: true }); restart(); });
      el.querySelector('[data-carousel="next"]').addEventListener("click", () => { go(current() + 1, { announceIt: true }); restart(); });
      playBtn.addEventListener("click", () => setPlaying(!playing));

      region.addEventListener("mouseenter", () => (hold = true));
      region.addEventListener("mouseleave", () => (hold = false));
      track.addEventListener("focusin", () => (hold = true));
      track.addEventListener("focusout", () => (hold = false));
      track.addEventListener("pointerdown", restart, { passive: true });

      // Arrow keys when the track itself is focused.
      track.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(current() + 1, { announceIt: true }); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(current() - 1, { announceIt: true }); }
      });
    },
  };
})(window.Site);
