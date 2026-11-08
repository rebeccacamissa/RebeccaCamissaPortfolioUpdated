/* 02 · Profile / Story — metric counters, proof-point highlighting, quote card. */
(function (Site) {
  "use strict";
  const { esc, eyebrow, highlight, cvLink, announce, motionOK, onceVisible, sections } = Site;

  const COUNT_MS = 1200;

  sections.story = {
    render(site) {
      const s = site.story;

      const metrics = s.metrics
        .map(
          (m) => `
          <li class="metric-wrap relative" data-metric-wrap="${esc(m.id)}" data-reveal>
            <button type="button" class="metric" data-metric="${esc(m.id)}"
                    aria-pressed="false" aria-describedby="metric-tip-${esc(m.id)}">
              <span class="block font-display text-6xl font-bold leading-none tabular-nums sm:text-7xl" aria-hidden="true"
                    data-count-to="${Number(m.value)}">${Number(m.value)}</span>
              <span class="mt-3 block font-display text-sm font-bold uppercase tracking-[0.12em]" aria-hidden="true">${esc(m.label)}</span>
              <span class="sr-only">${Number(m.value)} ${esc(m.label)}</span>
            </button>
            <span role="tooltip" id="metric-tip-${esc(m.id)}" class="metric-tip">${esc(m.hint)}</span>
          </li>`
        )
        .join("");

      const paragraphs = s.paragraphs
        .map((p) => `<p class="proof" data-proof="${esc((p.proof || []).join(" "))}">${esc(p.text)}</p>`)
        .join("");

      return `
        <div class="section-shell">
          ${eyebrow(s.eyebrow)}

          <!-- Quick metrics -->
          <ul class="mt-10 grid gap-5 sm:grid-cols-3" role="list" aria-label="Quick metrics">
            ${metrics}
          </ul>
          <p class="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <strong class="font-display text-lg font-bold">${esc(s.metricsNote)}</strong>
            <span class="decor text-sm text-ink-soft">${esc(s.metricsHelp)}</span>
          </p>

          <!-- Split editorial -->
          <div class="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <h2 id="story-title"
                class="font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:sticky lg:top-28 lg:self-start lg:text-[3.35rem]">
              ${highlight(s.headline, s.headlineHighlight)}
            </h2>
            <div class="min-w-0 space-y-5 text-lg leading-relaxed text-ink-soft">
              ${paragraphs}
              <div class="pt-4">
                ${cvLink({ label: s.cta.label, cls: "btn btn-primary" })}
              </div>
            </div>
          </div>

          <!-- Quote banner -->
          <figure class="quote-card mt-20 lg:mt-28">
            <span class="decor quote-mark" aria-hidden="true">${esc(s.quote.mark)}</span>
            <blockquote>
              <p class="max-w-4xl font-display text-2xl font-bold leading-snug sm:text-4xl">${esc(s.quote.text)}</p>
            </blockquote>
            <figcaption class="mt-7">
              <span class="sr-only">— </span><span class="quote-attr">${esc(s.quote.attribution)}</span>
            </figcaption>
          </figure>
        </div>`;
    },

    init(el) {
      initCounters(el);
      initProofLinks(el);
    },
  };

  /* Count up when the metrics scroll into view. Final values are in the
     markup already, so no-JS / reduced-motion users just see the numbers. */
  function initCounters(el) {
    if (!motionOK() || !("IntersectionObserver" in window)) return;
    const nums = [...el.querySelectorAll("[data-count-to]")];
    nums.forEach((n) => (n.textContent = "0"));

    onceVisible(nums[0].closest("ul"), () => {
      let start = null;
      const tick = (now) => {
        if (start === null) start = now; // use the frame clock for both ends
        const t = Math.max(0, Math.min(1, (now - start) / COUNT_MS));
        const eased = 1 - Math.pow(1 - t, 3);
        nums.forEach((n) => (n.textContent = String(Math.round(eased * Number(n.dataset.countTo)))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  /* Hover / focus previews proof points; click / tap pins them. Proof targets
     are any [data-proof~="<id>"] on the page, so later sections can opt in. */
  function initProofLinks(el) {
    let pinned = null;
    let transient = null;

    const apply = () => {
      const key = pinned || transient;
      el.querySelectorAll("[data-metric-wrap]").forEach((w) => {
        w.toggleAttribute("data-active", w.dataset.metricWrap === key);
        w.querySelector("[data-metric]").setAttribute("aria-pressed", String(w.dataset.metricWrap === pinned));
      });
      document.querySelectorAll("[data-proof]").forEach((p) => {
        const match = !!key && p.dataset.proof.split(" ").includes(key);
        p.classList.toggle("is-proof", match);
        p.classList.toggle("is-dimmed", !!key && !match);
      });
    };

    el.querySelectorAll("[data-metric-wrap]").forEach((w) => {
      const key = w.dataset.metricWrap;
      const btn = w.querySelector("[data-metric]");

      w.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { transient = key; apply(); } });
      w.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse" && transient === key) { transient = null; apply(); } });
      btn.addEventListener("focus", () => { transient = key; apply(); });
      btn.addEventListener("blur", () => { if (transient === key) { transient = null; apply(); } });

      btn.addEventListener("click", () => {
        pinned = pinned === key ? null : key;
        if (!pinned) transient = null;
        apply();
        const label = btn.querySelector(".sr-only").textContent;
        announce(pinned ? `Highlighting proof points for ${label}` : "Highlight cleared");
      });
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && (pinned || transient)) {
        pinned = transient = null;
        apply();
      }
    });
  }
})(window.Site);
