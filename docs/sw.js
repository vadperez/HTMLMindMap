/* HTML Mind Map — service worker
 *
 * Purpose: keep a copy of the app on the computer so that, after the first
 * visit, starting the app does not download it again from GitHub Pages.
 *
 * Traffic to GitHub per computer:
 *   first visit ........ the files in ASSETS once (about 1 MB before compression)
 *   every later start .. only this file (sw.js, a few KB) is re-checked by Chrome
 *   new release ........ the files in ASSETS once more, after VERSION changes
 *
 * Your maps never go through this worker or GitHub: they are read from and
 * written to your disk by the page itself (File System Access API).
 * Requests to other sites (Crossref) are not touched or cached here.
 *
 * To publish a new release: change VERSION, commit, push.
 */
const VERSION = '1.2.2';
const PREFIX = 'htmlmindmap-';            // namespaced: the origin <user>.github.io may host other sites
const CACHE = PREFIX + VERSION;
const ASSETS = [
  'index.html',
  'tutorial.html',
  'pwa.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png'
];
const SCOPE = new URL('./', self.location).pathname;   // e.g. /HTMLMindMap/

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // 'no-cache' = revalidate with GitHub (ETag): unchanged files answer 304, so a
    // re-install after an unchanged deploy costs headers only, not the files.
    await cache.addAll(ASSETS.map((u) => new Request(u, { cache: 'no-cache' })));
  })());
  // No skipWaiting() here: a new version waits until the page agrees (see pwa.js),
  // so an open map is never switched to new code in the middle of editing.
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(PREFIX) && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  const msg = event.data || {};
  if (msg.type === 'SKIP_WAITING') self.skipWaiting();
  if (msg.type === 'GET_VERSION' && event.source) event.source.postMessage({ type: 'VERSION', version: VERSION, cache: CACHE });
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;     // Crossref and any other site: untouched
  if (!url.pathname.startsWith(SCOPE)) return;         // other sites on the same github.io origin: untouched

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (req.mode === 'navigate') {
      // ./ , ./?new , ./index.html → the cached app; ./tutorial.html → the cached tutorial
      const path = url.pathname.slice(SCOPE.length);
      const key = path === '' || path === 'index.html' ? 'index.html' : path;
      const hit = await cache.match(key);
      if (hit) return hit;
      try { return await fetch(req); } catch (e) { return (await cache.match('index.html')) || Response.error(); }
    }
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    return fetch(req);                                   // not stored: the cache never grows by itself
  })());
});
