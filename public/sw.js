const CACHE_NAME = 'schiena-pwa-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/icon.jpg',
  '/manifest.json',
  '/spine-icon.svg',
  '/back-exercise-guide.jpg',
  '/back-exercise-guide-2.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request).then((networkResponse) => {
        const clonedResponse = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse));
        return networkResponse;
      });
    })
  );
});
