self.addEventListener('install',function(){self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil((async function(){for(const k of await caches.keys()){await caches.delete(k)}await self.registration.unregister();const cs=await self.clients.matchAll({type:'window'});cs.forEach(function(c){c.navigate(c.url)})})())});
