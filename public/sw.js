/* Safe Plate service worker: cache-first for the app shell and assets so the
   allergy card works offline. Bump CACHE when shipping a new version. */
const CACHE = 'safeplate-v3'

// On install, cache the page and every hashed JS/CSS file it references, so the
// app works offline after a single online visit.
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE)
    const res = await fetch('./index.html', { cache: 'reload' })
    const html = await res.clone().text()
    await cache.put('./index.html', res)
    const assets = [...html.matchAll(/(?:src|href)="([^"]*\/assets\/[^"]+)"/g)]
      .map((m) => new URL(m[1], self.registration.scope).href)
    await cache.addAll(['./', ...assets])
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  event.respondWith(
    // ignoreVary: precached copies were fetched without an Origin header, while
    // module scripts send one; some servers add "Vary: Origin", which would miss.
    caches.match(req, { ignoreVary: true }).then((hit) => {
      if (hit) return hit
      return fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        })
        .catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
    }),
  )
})
