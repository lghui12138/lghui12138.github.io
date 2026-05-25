/*
 * Public-shell service worker kill switch.
 * Keeps lghui.top from serving stale cached HTML/JS after the Cloudflare origin migration.
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
      if (self.clients?.claim) await self.clients.claim();
    } catch (_) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        try { client.navigate(client.url); } catch (_) {}
      }
    } catch (_) {}
    try {
      await self.registration.unregister();
    } catch (_) {}
  })());
});

self.addEventListener('fetch', () => {});
