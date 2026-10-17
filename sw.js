const CACHE_NAME = "seborn-shell-20261017g";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./product.html",
  "./styles.css",
  "./vendor/lucide-lite.js",
  "./supabase-config.js",
  "./cloud.js",
  "./data.js",
  "./app.js",
  "./product.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(request, { ignoreSearch: true })) ||
            (await caches.match("./index.html"))
          );
        })
    );
    return;
  }

  event.respondWith(
    (async () => {
      const exact = await caches.match(request);
      if (exact) {
        fetch(request)
          .then((response) => {
            const copy = response.clone();
            return caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(request, copy));
          })
          .catch(() => {});
        return exact;
      }

      try {
        const response = await fetch(request);
        const copy = response.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, copy);
        return response;
      } catch (error) {
        return (
          (await caches.match(new Request(`${url.origin}${url.pathname}`))) ||
          Response.error()
        );
      }
    })()
  );
});
