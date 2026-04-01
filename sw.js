// Service Worker для кэширования и offline-режима
const CACHE_NAME = 'japan-trip-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/osaka.html',
  '/fuji.html',
  '/tokyo.html',
  '/shanghai.html',
  '/budget.html',
  '/toilet-map.html',
  '/visa.html',
  '/CSS/style.css',
  '/js/currency.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache addAll error:', err))
  );
  self.skipWaiting();
});

// Очистка старых кэшей при активации
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Стратегия: сначала сеть, при ошибке — кэш
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Клонируем ответ, чтобы сохранить в кэш
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
