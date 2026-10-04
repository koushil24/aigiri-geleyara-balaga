// =====================================================
// AIGIRI GELEYARA BALAGA - Service worker (offline support)
//
// Strategy: "network first".
//  - Online  -> always load the newest file from the website
//               (so your updates show up immediately)
//  - Offline -> use the last copy saved on the phone
//
// IMPORTANT: when you change this list, also change the
// version number below (agb-v2 -> agb-v3 ...) so phones
// throw away their old saved copy.
// =====================================================

const CACHE_NAME = "agb-v4";

// Files saved on the phone for offline use
const urlsToCache = [
    "./",
    "./index.html",
    "./birthday.html",
    "./member.html",
    "./verify.html",
    "./css/style.css",
    "./js/script.js",
    "./js/member.js",
    "./js/member-config.js",
    "./js/qr.js",
    "./js/card.js",
    "./js/verify.js",
    "./manifest.json",
    "./images/logo.png"
];


// ===== Install: save the files =====
// Each file is saved on its own, so one missing file cannot break everything.
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.all(urlsToCache.map((url) => cache.add(url).catch(() => {})))
        )
    );
    self.skipWaiting();   // start using this new version right away
});


// ===== Activate: remove old saved copies =====
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
        ).then(() => self.clients.claim())
    );
});


// ===== Fetch: network first, saved copy as backup =====
self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Only handle normal page/file requests from our own website
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
            .catch(() =>
                caches.match(request).then((saved) => saved || caches.match("./index.html"))
            )
    );
});
