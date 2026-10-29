// v1.2 two-region - Network-first documents prevent stale installed PWA shells.
const CACHE='time-garden-v1-2-4';
const ASSETS=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./bgm.mp3','./bgm-snow.mp3'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>(key.startsWith('hungno-pwa-')||key.startsWith('time-garden-'))&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const req=event.request, url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==location.origin)return;
 if(req.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('/manifest.webmanifest')){
  event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
 }else{
  event.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return res})));
 }
});
