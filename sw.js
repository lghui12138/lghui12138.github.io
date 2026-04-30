const T='https://lghui-fluid-learning.pages.dev/_edge-fast-login?next=%2Findex-complete';
self.oninstall=e=>e.waitUntil(self.skipWaiting());
self.onactivate=e=>e.waitUntil(self.clients.claim());
self.onfetch=e=>{const r=e.request;if(r.mode!=='navigate')return;const u=new URL(r.url);if(u.origin!==self.location.origin||u.searchParams.has('stay')||!['/','/index.html'].includes(u.pathname))return;e.respondWith(new Response(null,{status:302,headers:{Location:T,'Cache-Control':'no-store'}}))};
