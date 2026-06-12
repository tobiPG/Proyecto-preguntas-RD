const CACHE_NAME = 'rdquiz-v6';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/questions.js',
  './js/definitions.js',
  './js/storage.js',
  './js/sounds.js',
  './js/app.js',
  './manifest.json',
  './img/mapa-rd.svg',
  './img/mapa-rd-nombres.jpg',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-192.png',
  './icons/icon-256.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-512.svg'
];

const NETWORK_FIRST = ['app.js', 'storage.js', 'styles.css', 'questions.js', 'sounds.js', 'definitions.js', 'index.html'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isNetworkFirst = url.pathname.endsWith('/') || NETWORK_FIRST.some(f => url.pathname.endsWith(f));

  if (isNetworkFirst) {
    event.respondWith(
      fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match(event.request, { ignoreSearch: true }))
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(cached => {
        const fetchPromise = fetch(event.request).then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
