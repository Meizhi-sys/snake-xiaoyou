const CACHE_NAME = 'snake-xy-v650';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon-180.png',
  './friendship.mp3' // 如果暂时没有也没关系
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(r=> r || fetch(req).then(resp=>{
      const copy = resp.clone();
      caches.open(CACHE_NAME).then(c=> c.put(req, copy)).catch(()=>{});
      return resp;
    }).catch(()=> caches.match('./index.html')))
  );
});
