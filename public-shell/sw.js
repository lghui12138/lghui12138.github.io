/*
 * lghui.top public shell kill switch.
 * Removes old offline caches and then unregisters itself.
 * It never navigates clients; visible reloads look like a stuck page.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.allSettled(keys.map((key) => caches.delete(key)));
    } catch (_) {}
    try {
      await self.clients.claim();
    } catch (_) {}
    try {
      await self.registration.unregister();
    } catch (_) {}
  })());
});

self.addEventListener('fetch', () => {});
