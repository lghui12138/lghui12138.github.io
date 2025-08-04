// 简化的Service Worker - 专门解决fetch错误问题
const CACHE_NAME = 'fluid-dynamics-simple-v1';

// 安全头
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY', 
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

self.addEventListener('install', event => {
  console.log('🔧 Simple Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('✅ Simple Service Worker activated');
  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  // 对于HTML文件，直接通过网络获取，不缓存
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/') || !url.pathname.includes('.')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return addHeaders(response);
        })
        .catch(error => {
          console.error('Fetch error:', error);
          // 返回简单的错误页面
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Page Unavailable</title>
              <meta charset="UTF-8">
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 50px; 
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: 0;
                }
                .container {
                  background: rgba(255,255,255,0.1);
                  padding: 40px;
                  border-radius: 20px;
                  backdrop-filter: blur(10px);
                }
                .error { margin: 20px 0; }
                button { 
                  padding: 12px 24px; 
                  background: #2196f3; 
                  color: white; 
                  border: none; 
                  border-radius: 8px; 
                  cursor: pointer;
                  font-size: 16px;
                  transition: background 0.3s;
                }
                button:hover { background: #1976d2; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>⚠️ Page Temporarily Unavailable</h1>
                <div class="error">The page is currently unavailable. This might be due to network issues or server maintenance.</div>
                <button onclick="window.location.reload()">🔄 Retry Now</button>
                <br><br>
                <button onclick="window.location.href='/'">🏠 Go Home</button>
              </div>
            </body>
            </html>
          `, { 
            status: 503,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              ...SECURITY_HEADERS
            }
          });
        })
    );
    return;
  }

  // 对于静态文件，使用缓存策略
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return addHeaders(cachedResponse);
        }
        
        return fetch(event.request)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            
            // 缓存静态文件
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return addHeaders(response);
          })
          .catch(error => {
            console.error('Fetch error for static file:', error);
            // 对于静态文件，返回简单的错误信息
            return new Response('File not available', { 
              status: 404,
              headers: SECURITY_HEADERS 
            });
          });
      })
  );
});

function addHeaders(response) {
  const headers = new Headers(response.headers);
  
  // 添加安全头
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  // 为HTML文件设置不缓存
  if (response.url && (response.url.endsWith('.html') || response.url.endsWith('/'))) {
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

console.log('🚀 Simple Service Worker loaded'); 