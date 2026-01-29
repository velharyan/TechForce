const CACHE = 'nxc-cache-v1';
const OFFLINE_URL = '/offline.html';
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/', OFFLINE_URL, '/css/site.css'])));
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(
    fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||caches.match(OFFLINE_URL)))
  );
});