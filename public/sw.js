const CACHE_ASSETS = 'pdf-viewer-assets-v1';
const CACHE_PDF = 'pdf-viewer-pdf-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/favicon.ico',
  '/placeholder.svg',
];

const PDF_ASSETS = ['/sample.pdf'];

// Install event: cache assets and PDF on first load
self.addEventListener('install', (event) => {
  console.log('Service Worker: installing...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_ASSETS).then((cache) => {
        console.log('Caching assets...');
        return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
          console.warn('Failed to cache some assets:', err);
          // Don't fail install if some assets are missing
          return Promise.resolve();
        });
      }),
      caches.open(CACHE_PDF).then((cache) => {
        console.log('Caching PDF...');
        return cache.addAll(PDF_ASSETS).catch((err) => {
          console.warn('Failed to cache PDF:', err);
          return Promise.resolve();
        });
      }),
    ]).then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_ASSETS && cacheName !== CACHE_PDF) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: network-first for HTML/CSS/JS, cache-first for PDF
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // PDF files: cache-first (large files, rarely change)
  if (url.pathname.endsWith('.pdf')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          console.log('PDF served from cache:', url.pathname);
          return cached;
        }
        return fetch(event.request)
          .then((response) => {
            // Cache successful PDF responses
            if (response && response.status === 200 && response.type !== 'error') {
              const clonedResponse = response.clone();
              caches.open(CACHE_PDF).then((cache) => {
                cache.put(event.request, clonedResponse);
              });
            }
            return response;
          })
          .catch(() => {
            // Return offline fallback if available
            return caches.match(event.request);
          });
      })
    );
    return;
  }

  // Assets: network-first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200 && response.type !== 'error') {
          const clonedResponse = response.clone();
          caches.open(CACHE_ASSETS).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cached version
        return caches.match(event.request);
      })
  );
});
