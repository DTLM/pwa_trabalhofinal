const CACHE_NAME = "despesas-viagem";
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/node_modules/bootstrap/dist/css/bootstrap.css",
  "/node_modules/select2/dist/css/select2.css",
  "/node_modules/jquery/dist/jquery.js",
  "/node_modules/select2/dist/js/select2.js",
  "/node_modules/bootstrap/dist/js/bootstrap.js",
  "/js/index.js"
];

self.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});