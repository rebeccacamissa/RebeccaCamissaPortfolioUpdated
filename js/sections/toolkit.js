/* 06 · Toolkit — category tabs, animated skill meters, filterable skill badges. */
(function (Site) {
  "use strict";
  const { esc, eyebrow, slug, motionOK, skillFilter, sections } = Site;

  sections.toolkit = {
    render(site) {
      const t = site.toolkit;

      const tabs = t.categories
        .map(
          (c, i) => `
          <button type="button" role="tab" class="tk-tab" id="tk-tab-${esc(c.id)}"
                  aria-controls="tk-panel-${esc(c.id)}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}"
                  data-tk-tab="${esc(c.id)}">${esc(c.label)}</button>`
        )
        .join("");

      const panels = t.categories
        .map(
          (c, i) => `
          <div role="tabpanel" id="tk-panel-${esc(c.id)}" aria-labelledby="tk-tab-${esc(c.id)}"
               data-tk-panel="${esc(c.id)}" ${i === 0 ? "" : "hidden"}>
            <ul class="grid gap-x-10 gap-y-6 md:grid-cols-2" role="list">
              ${c.skills
                .map(
                  (s) => `
                <li class="bar-row" data-skill="${esc(slug(s.name))}">
                  <div class="flex items-baseline justify-between gap-4">
                    <span class="font-display font-bold leading-snug">${esc(s.name)}</span>
                    <span class="font-display text-sm font-bold tabular-nums text-ink-soft">${Number(s.value)}%</span>
                  </div>
                  <span class="bar-track" aria-hidden="true">
                    <span class="bar-fill" data-pct="${Number(s.value)}"></span>
                  </span>
                </li>`
                )
                .join("")}
            </ul>
          </div>`
        )
        .join("");

      // Badges are strings or { name, note }; notes become numbered footnotes.
      const items = t.badges.map((b) => (typeof b === "string" ? { name: b } : b));
      const noted = items.filter((b) => b.note);

      const badges = items
        .map((b) => {
          const n = noted.indexOf(b) + 1;
          const noteId = n ? `tk-note-${n}` : "";
          return `
          <li>
            <button type="button" class="skill-chip" data-skill-btn data-skill="${esc(slug(b.name))}"
                    data-skill-label="${esc(b.name)}" aria-pressed="false"${noteId ? ` aria-describedby="${noteId}"` : ""}>
              ${esc(b.name)}${n ? `<sup class="ml-0.5 text-accent" aria-hidden="true">*</sup>` : ""}
            </button>
          </li>`;
        })
        .join("");

      const notes = noted.length
        ? `<ul class="mt-5 space-y-1 text-sm text-ink-soft" role="list">
             ${noted
               .map((b, i) => `<li id="tk-note-${i + 1}"><span class="font-bold text-accent" aria-hidden="true">*</span> <strong class="text-ink">${esc(b.name)}:</strong> ${esc(b.note)}</li>`)
               .join("")}
           </ul>`
        : "";

      return `
        <div class="section-shell">
          ${eyebrow(t.eyebrow)}
          <div class="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
            <h2 id="toolkit-title" class="font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">${esc(t.headline)}</h2>
            <p class="max-w-xl text-lg leading-relaxed text-ink-soft">${esc(t.subtitle)}</p>
          </div>

          <div class="mt-12 grid gap-8 lg:grid-cols-[1fr_300px]">
            <div class="lift-card min-w-0 p-6 sm:p-8">
              <div role="tablist" aria-label="Skill categories" class="tk-tablist">${tabs}</div>
              <div class="mt-8">${panels}</div>
            </div>

            <aside class="tk-summary" aria-label="Category summary">
              <p class="font-display text-xs font-bold uppercase tracking-[0.14em]" data-tk-sum="label"></p>
              <p class="mt-4 font-display text-7xl font-bold leading-none tabular-nums"><span data-tk-sum="avg"></span><span class="text-4xl">%</span></p>
              <p class="mt-1 text-sm font-semibold">average across <span data-tk-sum="count"></span> skills</p>
              <hr class="my-6 border-t-2 border-dashed border-current opacity-40" />
              <p class="text-xs font-bold uppercase tracking-[0.14em]">Strongest</p>
              <p class="mt-1 font-display text-lg font-bold leading-snug" data-tk-sum="top"></p>
            </aside>
          </div>

          <div class="mt-14">
            <h3 class="font-display text-xl font-bold">Skill tags</h3>
            <p class="decor mt-1 text-sm text-ink-soft">${esc(t.badgesHelp)}</p>
            <ul class="mt-5 flex flex-wrap gap-3" role="list">${badges}</ul>
            ${notes}
            ${skillFilter.status(`<a href="#work" class="filter-jump">See projects <span aria-hidden="true">↓</span></a>`)}
          </div>
        </div>`;
    },

    init(el, site) {
      const cats = site.toolkit.categories;
      const tabs = [...el.querySelectorAll("[data-tk-tab]")];
      const panels = [...el.querySelectorAll("[data-tk-panel]")];
      const sum = (k) => el.querySelector(`[data-tk-sum="${k}"]`);
      let seen = false;

      el.querySelectorAll(".bar-fill").forEach((f) => f.style.setProperty("--pct", f.dataset.pct / 100));

      const fill = (panel) => {
        const bars = panel.querySelectorAll(".bar-fill");
        bars.forEach((b) => b.classList.remove("is-filled"));
        if (!motionOK()) return bars.forEach((b) => b.classList.add("is-filled"));
        void panel.offsetWidth; // restart the transition
        requestAnimationFrame(() => bars.forEach((b) => b.classList.add("is-filled")));
      };

      function select(id, { focus = false } = {}) {
        tabs.forEach((t) => {
          const on = t.dataset.tkTab === id;
          t.setAttribute("aria-selected", String(on));
          t.tabIndex = on ? 0 : -1;
          if (on && focus) t.focus();
        });
        panels.forEach((p) => (p.hidden = p.dataset.tkPanel !== id));

        const cat = cats.find((c) => c.id === id);
        const avg = Math.round(cat.skills.reduce((a, s) => a + s.value, 0) / cat.skills.length);
        const top = cat.skills.reduce((a, s) => (s.value > a.value ? s : a));
        sum("label").textContent = cat.label;
        sum("avg").textContent = avg;
        sum("count").textContent = cat.skills.length;
        sum("top").textContent = `${top.name} · ${top.value}%`;

        if (seen) fill(panels.find((p) => p.dataset.tkPanel === id));
      }

      tabs.forEach((t, i) => {
        t.addEventListener("click", () => select(t.dataset.tkTab));
        t.addEventListener("keydown", (e) => {
          const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
          if (!(e.key in map)) return;
          e.preventDefault();
          const next = tabs[(map[e.key] + tabs.length) % tabs.length];
          select(next.dataset.tkTab, { focus: true });
        });
      });

      select(cats[0].id);
      // Re-trigger the fill animation each time the meters scroll back into view.
      const card = el.querySelector('[role="tablist"]').parentElement;
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const panel = panels.find((p) => !p.hidden);
            if (entry.isIntersecting) {
              seen = true;
              fill(panel);
            } else if (motionOK()) {
              panel.querySelectorAll(".bar-fill").forEach((b) => b.classList.remove("is-filled"));
            }
          });
        }, { threshold: 0.25 }).observe(card);
      } else {
        seen = true;
        fill(panels.find((p) => !p.hidden));
      }

      // If a highlighted skill lives in the other category, switch to it.
      skillFilter.subscribe((key) => {
        if (!key) return;
        const row = el.querySelector(`.bar-row[data-skill="${key}"]`);
        const panel = row && row.closest("[data-tk-panel]");
        if (panel && panel.hidden) select(panel.dataset.tkPanel);
      });
    },
  };
})(window.Site);
