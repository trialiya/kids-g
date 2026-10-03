// Service worker: кэширует файлы игры, чтобы она открывалась без интернета.
// Список файлов и версия подставляются при сборке (vite.config.js).
const CACHE = "kids-clock-__VERSION__";
const FILES = __PRECACHE__;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Сначала сеть (чтобы получать обновления), при отсутствии сети — кэш.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy));
    return res;
  }).catch(() => caches.match(e.request).then(r => r || caches.match("./"))));
});
