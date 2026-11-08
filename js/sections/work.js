/* 07 · Selected Work — project cards from js/projects.js with cross-portfolio tag filtering. */
(function (Site) {
  "use strict";
  const { esc, icon, eyebrow, highlight, pad, slug, skillFilter, onceVisible, sections } = Site;

  const BAND = ["bg-pink text-onyx", "bg-accent text-on-accent", "bg-ink text-paper"];
  const safeUrl = (url) => (/^https:\/\//i.test(url || "") ? url : "");

  function link(href, label, ariaLabel, ic) {
    return `
      <a href="${esc(href)}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="${esc(ariaLabel)}">
        ${ic}<span>${esc(label)}</span><span class="project-link-arrow">${icon.external}</span>
      </a>`;
  }

  function card(p, i) {
    const id = `project-${slug(p.title)}`;
    const keys = [...new Set([...p.tags, ...(p.skills || [])].map(slug))].join(" ");
    const gh = safeUrl(p.links && p.links.github);
    const live = safeUrl(p.links && p.links.live);

    const links = [
      gh && (p.feed
        ? link(gh, "GitHub profile", `${window.SITE_CONTENT.name} on GitHub (opens in a new tab)`, icon.github)
        : link(gh, "GitHub", `${p.title} source code on GitHub (opens in a new tab)`, icon.github)),
      live && link(live, "Live demo", `${p.title} live demo (opens in a new tab)`, icon.arrow),
    ].filter(Boolean);

    return `
      <li class="min-w-0" data-reveal>
        <article class="project-card lift-card flex h-full flex-col" data-skills="${esc(keys)}" aria-labelledby="${id}">
          <div class="band-grid flex items-center justify-between border-b-2 border-ink px-6 py-4 ${BAND[i % BAND.length]}">
            <span class="font-display text-4xl font-bold leading-none tabular-nums" aria-hidden="true">${pad(i + 1)}</span>
            <span class="font-display text-xs font-bold uppercase tracking-[0.16em]">${esc(p.kind || "Project")}</span>
          </div>

          <div class="flex flex-1 flex-col p-6">
            <p class="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">${esc(p.category)}</p>
            <h3 id="${id}" class="mt-1 font-display text-2xl font-bold leading-tight">${esc(p.title)}</h3>

            <dl class="mt-5 space-y-4 text-[0.95rem] leading-relaxed">
              <div><dt class="project-dt">Problem</dt><dd class="text-ink-soft">${esc(p.problem)}</dd></div>
              <div><dt class="project-dt">Solution</dt><dd class="text-ink-soft">${esc(p.solution)}</dd></div>
              <div><dt class="project-dt">Result</dt><dd class="text-ink-soft">${esc(p.result)}</dd></div>
            </dl>
            ${p.feed ? feedShell(p.feed) : ""}

            <ul class="mb-6 mt-6 flex flex-wrap gap-2" role="list" aria-label="${esc(p.title)} tags">
              ${p.tags
                .map(
                  (t) => `<li><button type="button" class="skill-chip skill-chip-sm" data-skill-btn data-skill="${esc(slug(t))}" aria-pressed="false">${esc(t)}</button></li>`
                )
                .join("")}
            </ul>

            <div class="mt-auto flex flex-wrap items-center gap-3 border-t-2 border-dashed border-ink/25 pt-5">
              ${links.length ? links.join("") : `<span class="text-sm italic text-ink-soft">Links coming soon</span>`}
            </div>
          </div>
        </article>
      </li>`;
  }

  /* ------------------------- Live GitHub feed ------------------------- */
  // Public GitHub REST API, no token: 60 requests/hour per visitor IP, so
  // results are cached in sessionStorage and only fetched once on screen.
  const FEED_TTL_MS = 10 * 60 * 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  function ago(iso) {
    const secs = (new Date(iso).getTime() - Date.now()) / 1000;
    const steps = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [unit, size] of steps) if (Math.abs(secs) >= size) return rtf.format(Math.round(secs / size), unit);
    return "just now";
  }

  const ghUrl = (u) => (String(u || "").startsWith("https://github.com/") ? u : "");

  function feedShell(user) {
    return `
      <div class="gh-feed mt-6" data-gh-feed="${esc(user)}">
        <p class="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.16em]">
          <span class="decor size-2 rounded-full bg-emerald-500 motion-safe:animate-pulse-dot" aria-hidden="true"></span>
          Live from GitHub
        </p>
        <div class="mt-3 text-sm" data-gh-body aria-live="polite">
          <p class="text-ink-soft">Loading latest activity…</p>
        </div>
      </div>`;
  }

  async function loadFeed(user) {
    const key = `gh-feed:v2:${user}`;
    try {
      const cached = JSON.parse(sessionStorage.getItem(key) || "null");
      if (cached && Date.now() - cached.t < FEED_TTL_MS) return cached.data;
    } catch (_) { /* ignore */ }

    const api = (path) =>
      fetch(`https://api.github.com${path}`, { headers: { Accept: "application/vnd.github+json" } }).then((r) => {
        if (!r.ok) throw new Error(`GitHub ${r.status}`);
        return r.json();
      });

    // Most recently pushed repos, then the latest commits on the newest one.
    const repos = (await api(`/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=6`)).filter((r) => !r.fork);
    const latest = repos[0];
    const commits = latest
      ? (await api(`/repos/${encodeURIComponent(user)}/${encodeURIComponent(latest.name)}/commits?per_page=3`).catch(() => [])).map((cm) => ({
          msg: String((cm.commit && cm.commit.message) || "").split(String.fromCharCode(10))[0].trim(),
          repo: latest.full_name,
          url: cm.html_url,
          at: (cm.commit && cm.commit.author && cm.commit.author.date) || latest.pushed_at,
        }))
      : [];

    const data = {
      repos: repos.slice(0, 3).map((r) => ({
        name: r.name, url: r.html_url, lang: r.language, desc: r.description, at: r.pushed_at,
      })),
      commits,
    };
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), data })); } catch (_) { /* ignore */ }
    return data;
  }

  function feedHTML(user, data) {
    const commits = data.commits.length
      ? `<h4 class="project-dt">Recent commits</h4>
         <ul class="mt-2 space-y-2" role="list">
           ${data.commits.map((c) => {
             const href = ghUrl(c.url) || ghUrl(`https://github.com/${c.repo}`);
             const label = c.msg || `Pushed to ${c.repo.split("/")[1]}`;
             return `<li class="border-l-2 border-ink/30 pl-3">
                 <a href="${esc(href)}" target="_blank" rel="noopener noreferrer" class="font-semibold text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-accent">${esc(label.length > 72 ? label.slice(0, 71) + "…" : label)}</a>
                 <span class="block text-xs text-ink-soft">${esc(c.repo.split("/")[1])} · ${esc(ago(c.at))}</span>
               </li>`;
           }).join("")}
         </ul>`
      : "";

    const repos = data.repos.length
      ? `<h4 class="project-dt ${commits ? "mt-5" : ""}">Active repositories</h4>
         <ul class="mt-2 space-y-2" role="list">
           ${data.repos.map((r) => `<li class="flex flex-wrap items-baseline justify-between gap-x-3">
               <a href="${esc(ghUrl(r.url))}" target="_blank" rel="noopener noreferrer" class="font-display font-bold text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-accent">${esc(r.name)}</a>
               <span class="text-xs text-ink-soft">${r.lang ? esc(r.lang) + " · " : ""}updated ${esc(ago(r.at))}</span>
             </li>`).join("")}
         </ul>`
      : "";

    return commits || repos
      ? commits + repos
      : `<p class="text-ink-soft">No public activity yet — <a class="underline" href="https://github.com/${esc(user)}" target="_blank" rel="noopener noreferrer">see the profile</a>.</p>`;
  }

  function initFeeds(el) {
    el.querySelectorAll("[data-gh-feed]").forEach((box) => {
      const user = box.dataset.ghFeed;
      const body = box.querySelector("[data-gh-body]");
      onceVisible(box, async () => {
        try {
          body.innerHTML = feedHTML(user, await loadFeed(user));
        } catch (_) {
          body.innerHTML = `<p class="text-ink-soft">The live feed couldn't load right now. <a class="font-semibold text-ink underline" href="https://github.com/${esc(user)}" target="_blank" rel="noopener noreferrer">View activity on GitHub</a>.</p>`;
        }
      }, { threshold: 0.1 });
    });
  }

  sections.work = {
    render(site) {
      const w = site.work;
      const projects = window.SITE_PROJECTS || [];

      return `
        <div class="section-shell">
          ${eyebrow(w.eyebrow)}
          <div class="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-16">
            <h2 id="work-title" class="font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-6xl">
              ${highlight(w.headline, w.headlineHighlight)}
            </h2>
            <p class="max-w-xl text-lg leading-relaxed text-ink-soft">${esc(w.subtitle)}</p>
          </div>

          <div class="mt-8">${skillFilter.status()}</div>

          <ul class="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3" role="list">
            ${projects.map(card).join("")}
          </ul>
        </div>`;
    },

    init(el) {
      initFeeds(el);
    },
  };
})(window.Site);
