// =====================================================
// AIGIRI GELEYARA BALAGA - Service worker (offline support)
// Online  -> always the newest files.  Offline -> last saved copy.
// Change the number in CACHE_NAME when you change the list.
// =====================================================

const CACHE_NAME = "agb-v5";

const urlsToCache = [
    "./",
    "./index.html",
    "./about.html",
    "./events.html",
    "./gallery.html",
    "./team.html",
    "./news.html",
    "./support.html",
    "./contact.html",
    "./birthday.html",
    "./member.html",
    "./verify.html",
    "./css/style.css",
    "./js/script.js",
    "./js/news-data.js",
    "./js/member.js",
    "./js/member-config.js",
    "./js/card.js",
    "./js/qr.js",
    "./js/verify.js",
    "./manifest.json",
    "./images/logo.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.all(urlsToCache.map((url) => cache.add(url).catch(() => {})))
        )
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") return;
    if (new URL(request.url).origin !== self.location.origin) return;

    event.respondWith(
        fetch(request, { cache: "no-cache" })
            .then((response) => {
                if (response.ok) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                }
                return response;
            })
            .catch(() => caches.match(request).then((saved) => saved || caches.match("./index.html")))
    );
});
