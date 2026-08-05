const CACHE_NAME = "agb-v1";

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./js/script.js",
  "./manifest.json",
  "./images/logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
