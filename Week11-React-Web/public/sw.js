const CACHE_NAME = "careconnect-v1"
const APP_SHELL = [
  "./",
  "./asset-manifest.json",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.addAll(APP_SHELL)
      const response = await cache.match("./asset-manifest.json")
      const manifest = await response.json()
      const buildAssets = new Set()

      Object.values(manifest).forEach((entry) => {
        if (entry.file) buildAssets.add(entry.file)
        entry.css?.forEach((file) => buildAssets.add(file))
        entry.assets?.forEach((file) => buildAssets.add(file))
      })

      await cache.addAll(
        [...buildAssets].map(
          (file) => new URL(file, self.registration.scope).href,
        ),
      )
    }),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put("./", copy))
          return response
        })
        .catch(() => caches.match("./")),
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then(
      (cached) =>
        cached ??
        fetch(event.request).then((response) => {
          if (response.ok && new URL(event.request.url).origin === self.location.origin) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          }
          return response
        }),
    ),
  )
})
