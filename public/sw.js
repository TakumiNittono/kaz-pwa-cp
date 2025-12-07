// PWA Service Worker
// 基本的なキャッシュ機能を提供

const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
];

// インストール時の処理
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// フェッチ時の処理
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあれば返す、なければネットワークから取得
        return response || fetch(event.request);
      })
  );
});

// OneSignal SDKを読み込む（後で有効化）
// importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js');

