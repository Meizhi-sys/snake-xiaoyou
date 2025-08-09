const CACHE_NAME = 'snake-pwa-v4';
const ASSETS = ['./','./index.html','./manifest.json','./icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE_NAME && caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    const copy = resp.clone();
    if(e.request.method==='GET' && resp.status===200){ caches.open(CACHE_NAME).then(c => c.put(e.request, copy)); }
    return resp;
  }).catch(_ => caches.match('./index.html'))));
});