# Portfolio Project Guidelines

## Core Tech & Frameworks
- Stack: HTML5 / Tailwind CSS (or Framer Motion / React if applicable)
- Styling: Custom neo-brutalist / paper-texture aesthetic, warm high-contrast colors, Google Fonts (e.g., Space Grotesk / Inter). No plain generic dark mode.

## Code Standards
- Keep components modular and accessible (WCAG compliant).
- Use semantic HTML tags.
- Avoid inline styles where utility classes or dedicated CSS exist.

## Project Structure
- No framework: `index.html` + classic deferred scripts (must keep working from `file://`, so no ES modules or `fetch` of JSON).
- Data: `js/content.js` (copy), `js/projects.js`, `js/certificates.js`.
- `js/core.js` = shared helpers (`window.Site`: esc, icons, eyebrow, cvLink, skillFilter…).
- One file per section in `js/sections/`, each registering `Site.sections.<name> = { render(site), init?(el, site) }`; mount it in `MOUNTS` in `js/main.js` and add an empty `<section id>` in `index.html`.
- Contact form posts to Formspree (`contact.formEndpoint` in `js/content.js`); Selected Work card with `feed` pulls the public GitHub API (no token, cached in sessionStorage).
- Adam (cat guide, `js/sections/adam.js`): rule-based answers built from the data files — no AI service. His lines live in `content.adam`.
- Accessibility (`js/sections/a11y.js`): settings on `<html>` as `data-text-size`, `data-font`, `data-contrast="high"`, `data-motion="reduce"` (re-applied pre-paint in index.html). Use `Site.motionOK()` for any animation; new components need high-contrast and `@media print` checks. Single-key shortcuts must stay switchable off.
- Fun extras (`js/sections/fun.js`): scroll progress, back-to-top, Explorer badge, "meow" easter egg, doodles. Adam exposes `Site.adam.{say, party, startTour, open}`.
- Offline: `sw.js` (network-first, caches what the page loaded). Bump `VERSION` there after big changes.
- Link previews: `assets/og-image.jpg` (1200×630). Once deployed, make `og:image`/`twitter:image` absolute https URLs.
- Editing on Windows: don't round-trip UTF-8 files through PowerShell 5 `Get-Content`/`Set-Content` — it double-encodes emoji and dashes. Use Node or the editor.
- Styles: `src/input.css` (Tailwind v4 tokens + components) → `npm run build` → `dist/styles.css` (commit the build). Theme via `[data-theme="dark"]`, plain-text view via `[data-view="plain"]` — new components need plain-view overrides.

## Data Structure
- Keep project and certificate details separated in dedicated data files (e.g., `projects.json` or `content.js`) so UI stays decoupled from content.
