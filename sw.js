// Service Worker for Fluid Dynamics Learning Platform
const CACHE_NAME = 'fluid-dynamics-v2.1.0';
const STATIC_CACHE = 'static-v2.1.0';
const DYNAMIC_CACHE = 'dynamic-v2.1.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/simple-login.html',
    '/test-login.html',
    '/fluid_dynamic_2.html',
    '/manifest.json',
    '/_headers'
];

// 需要缓存的第三方资源
const EXTERNAL_ASSETS = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://vjs.zencdn.net/8.7.0/video.min.js',
    'https://vjs.zencdn.net/8.7.0/video-js.css',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/sortable/1.15.0/Sortable.min.js'
];

// 安装事件
self.addEventListener('install', event => {
    console.log('🚀 Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            // 缓存静态资源
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            }),
            
            // 缓存外部资源
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('🌐 Caching external assets...');
                return Promise.all(
                    EXTERNAL_ASSETS.map(url => 
                        fetch(url).then(response => {
                            if (response.ok) {
                                return cache.put(url, response);
                            }
                        }).catch(err => {
                            console.warn('⚠️ Failed to cache external asset:', url, err);
                        })
                    )
                );
            })
        ]).then(() => {
            console.log('✅ Service Worker installed successfully');
            return self.skipWaiting();
        })
    );
});

// 激活事件
self.addEventListener('activate', event => {
    console.log('🔄 Service Worker activating...');
    
    event.waitUntil(
        Promise.all([
            // 清理旧缓存
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // 立即控制客户端
            self.clients.claim()
        ]).then(() => {
            console.log('✅ Service Worker activated successfully');
        })
    );
});

// 获取事件
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // 跳过非GET请求
    if (event.request.method !== 'GET') {
        return;
    }
    
    // 跳过非HTTP(S)请求
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // 处理静态资源
    if (STATIC_ASSETS.includes(url.pathname) || url.pathname === '/') {
        event.respondWith(handleStaticRequest(event.request));
        return;
    }
    
    // 处理外部资源
    if (EXTERNAL_ASSETS.includes(event.request.url)) {
        event.respondWith(handleExternalRequest(event.request));
        return;
    }
    
    // 处理其他请求
    event.respondWith(handleDynamicRequest(event.request));
});

// 处理静态资源请求
async function handleStaticRequest(request) {
    try {
        // 首先尝试从缓存获取
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // 如果缓存中没有，从网络获取
        const networkResponse = await fetch(request);
        
        // 如果网络请求成功，缓存响应
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Static request failed:', error);
        return new Response('Network error', { status: 503 });
    }
}

// 处理外部资源请求
async function handleExternalRequest(request) {
    try {
        // 首先尝试从缓存获取
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // 如果缓存中没有，从网络获取
        const networkResponse = await fetch(request);
        
        // 如果网络请求成功，缓存响应
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ External request failed:', error);
        return new Response('Network error', { status: 503 });
    }
}

// 处理动态请求
async function handleDynamicRequest(request) {
    try {
        // 优先从网络获取
        const networkResponse = await fetch(request);
        
        // 如果网络请求成功，缓存响应
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Dynamic request failed:', error);
        
        // 如果网络失败，尝试从缓存获取
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response('Network error', { status: 503 });
    }
}

// 消息处理
self.addEventListener('message', event => {
    console.log('📨 Service Worker received message:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLAIM_CLIENTS') {
        self.clients.claim();
    }
});

// 错误处理
self.addEventListener('error', event => {
    console.error('💥 Service Worker error:', event.error);
});

// 未处理的Promise拒绝
self.addEventListener('unhandledrejection', event => {
    console.error('💥 Service Worker unhandled rejection:', event.reason);
});

console.log('📜 Service Worker script loaded');