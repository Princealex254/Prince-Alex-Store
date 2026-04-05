const CACHE_NAME = 'pa-rider-v1';
const ASSETS_TO_CACHE = [
  'rider.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install SW and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch strategy: Network First, falling back to Cache
// This ensures riders see latest data when online, but can still see the app shell and cached data when offline.
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests like Firebase API calls which are handled by Firebase's own persistence
  if (!event.request.url.startsWith(self.location.origin) && !ASSETS_TO_CACHE.includes(event.request.url)) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});