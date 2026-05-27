/*
 * Content-Security-Policy is now set via _headers file
 * This fallback meta tag provides defense-in-depth for the HTML file itself
 */

const CACHE_NAME='fm-v4.1.0';
const AUTH_TARGET='https://lghui-fluid-learning.pages.dev/_edge-fast-login?next=%2Findex-complete';
const OFFLINE_FALLBACK='/offline.html';
const STATIC_CACHE='fm-static-v4.1.0';

const PRECACHE_URLS=['/','/index.html','/offline.html','/manifest.json','/favicon.ico'];

self.oninstall=e=>{e.waitUntil(caches.open(STATIC_CACHE).then(c=>c.addAll(PRECACHE_URLS).catch(()=>{})).then(()=>self.skipWaiting()))};

self.onactivate=e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==STATIC_CACHE&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))};

self.onfetch=e=>{const r=e.request,url=new URL(r.url),origin=self.location.origin;

if(r.mode==='navigate'){if(url.origin!==origin||url.searchParams.has('stay'))return;if(['/','/index.html'].includes(url.pathname)){e.respondWith(fetch(r).catch(()=>caches.match('/index-complete.html')).catch(()=>caches.match(OFFLINE_FALLBACK)));return}e.respondWith(fetch(r).catch(()=>caches.match(OFFLINE_FALLBACK)));return}

if(r.method!=='GET')return;

if(url.origin===origin){const stratImgFont=url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i)?'cache-first':'stale-while-revalidate';
if(stratImgFont==='cache-first'){e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{if(res.ok){const rc=res.clone();caches.open(STATIC_CACHE).then(cache=>cache.put(r,rc))}return res}).catch(()=>new Response('Offline',{status:503}))))}else{e.respondWith(caches.match(r).then(c=>{const f=fetch(r).then(res=>{if(res.ok){const rc=res.clone();caches.open(STATIC_CACHE).then(cache=>cache.put(r,rc))}return res}).catch(()=>null);return c||f||new Response('Offline',{status:503})}))}return}

if(url.origin==='https://cdn.jsdelivr.net'||url.origin==='https://fonts.googleapis.com'||url.origin==='https://fonts.gstatic.com'){e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{if(res.ok){const rc=res.clone();caches.open(STATIC_CACHE).then(cache=>cache.put(r,rc))}return res}).catch(()=>new Response('Offline',{status:503}))));return}
};