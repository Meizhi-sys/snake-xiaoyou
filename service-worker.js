const CACHE_NAME = 'snake-game-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/bgm.js',
    '/friendship.mp3',
    '/manifest.json'
];

// 安装
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

// 激活
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }))
        )
    );
});

// 请求拦截
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
