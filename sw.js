/* Offline support. Keeps a copy of the app so it opens with a weak or missing connection.
   The page and the programme data are always fetched fresh when online (revalidated, never from a stale
   HTTP cache), so new announcements and programme changes show up quickly. The copy is only used offline.
   Paths are relative to where this file lives, so the app works in any folder or on any domain.
   Change CACHE when you want every phone to drop its old copy. */
const CACHE = "conference-app-v1";
const BASE = self.registration.scope;
const FILES = ["./", "conference.js", "manifest.webmanifest", "favicon.svg", "icon-192.png", "icon-512.png", "apple-touch-icon.png"].map(f => new URL(f, BASE).href);
const FRESH = /\/(conference\.js|conference\.json|live\.json|abstracts\.json)$/;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  // Only our own files. Never touch the worker (assistant, board, sync) or any other site.
  if (req.method !== "GET" || url.origin !== location.origin || !url.href.startsWith(BASE)) return;
  const home = new URL("./", BASE).href;
  const fresh = req.mode === "navigate" || FRESH.test(url.pathname);
  if (fresh) {
    // Online: always the current version. Offline: the last copy, and the app itself for any page of the app.
    e.respondWith(fetch(req.url, { cache: "no-cache", credentials: "same-origin" })
      .then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req.url, copy)); } return r; })
      .catch(() => caches.match(req.url).then(hit => hit || (req.mode === "navigate" ? caches.match(home) : undefined)).then(hit => hit || new Response("Offline", { status: 503 }))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; })));
});
