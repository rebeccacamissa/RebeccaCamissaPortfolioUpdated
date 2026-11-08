/* Offline support.
   Strategy: network first, cache as fallback — visitors always get the latest
   version when they're online, and the last copy they saw when they're not.
   Nothing is pre-listed here: after the first visit, the page sends the worker
   the list of files it actually loaded (see "Offline" in js/main.js).
   Bump VERSION to drop old caches after big changes. */
const VERSION = "v1";
const CACHE = `rebecca-portfolio-${VERSION}`;

// Never cache these: form submissions and live data.
const SKIP = [/formspree\.io/, /api\.github\.com/];
const FONT_HOSTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("rebecca-portfolio-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const cacheable = (url) => {
  if (SKIP.some((re) => re.test(url))) return false;
  return url.startsWith(self.location.origin) || FONT_HOSTS.test(url);
};

self.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "cache-urls") return;
  const urls = [...new Set(event.data.urls || [])].filter(cacheable);
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        urls.map((url) =>
          cache.match(url).then((hit) => hit || fetch(url).then((res) => res.ok && cache.put(url, res)).catch(() => {}))
        )
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || !cacheable(request.url)) return;

  // Fonts never change at a given URL: serve from cache when we have them.
  if (FONT_HOSTS.test(request.url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) caches.open(CACHE).then((c) => c.put(request, res.clone()));
            return res;
          })
      )
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: request.mode === "navigate" }).then(
          (hit) => hit || (request.mode === "navigate" ? caches.match("./index.html").then((h) => h || caches.match("./")) : undefined)
        )
      )
  );
});
