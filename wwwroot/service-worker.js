const CACHE = 'techforce-cache-v2';
const OFFLINE_URL = '/offline.html';
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll([
    '/',
    OFFLINE_URL,
    '/css/site.css',
    '/js/site.js',
    '/js/chat.js',
    '/js/data/chatbot-knowledge.js'
  ])));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||caches.match(OFFLINE_URL)))
  );
});
