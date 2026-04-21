const VERSION = '1.2.0';
const CACHE = 'facturation-' + VERSION;
const ASSETS = ['./', './index.html', './manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(()=>{ self.clients.matchAll({type:'window'}).then(clients=>clients.forEach(c=>c.postMessage({type:'NEW_VERSION',version:VERSION}))); })); });
self.addEventListener('fetch', e => { if(e.request.method!=='GET') return; e.respondWith(fetch(e.request).then(resp=>{ if(resp&&resp.status===200){const clone=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));} return resp; }).catch(()=>caches.match(e.request))); });
