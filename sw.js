// Service Worker for GitHub Pages HTTP Headers
// This adds security headers that GitHub Pages doesn't support natively

const CACHE_NAME = 'fluid-dynamics-v1';
const STATIC_CACHE_TIME = 31536000; // 1 year in seconds

// Security headers to add
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY', 
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin'
};

// Cache control rules
const CACHE_RULES = {
  html: 'no-cache, no-store, must-revalidate',
  static: `public, max-age=${STATIC_CACHE_TIME}, immutable`,
  font: `public, max-age=${STATIC_CACHE_TIME}, immutable`
};

// File type patterns
const STATIC_FILES = /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp|mp4|pdf)$/i;
const FONT_FILES = /\.(woff|woff2|ttf|eot)$/i;
const HTML_FILES = /\.html$/i;

self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('✅ Service Worker activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    handleRequest(event.request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Try to get from cache first for static files
    if (STATIC_FILES.test(pathname) || FONT_FILES.test(pathname)) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return addSecurityHeaders(cachedResponse, pathname);
      }
    }

    // Fetch from network
    const response = await fetch(request);
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    // Clone response to modify headers
    const modifiedResponse = addSecurityHeaders(response.clone(), pathname);
    
    // Cache static files
    if (STATIC_FILES.test(pathname) || FONT_FILES.test(pathname)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return modifiedResponse;
    
  } catch (error) {
    console.error('🚨 Service Worker fetch error:', error);
    
    // Try to serve from cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return addSecurityHeaders(cachedResponse, pathname);
    }
    
    // Return original response if available
    try {
      const fallbackResponse = await fetch(request);
      return addSecurityHeaders(fallbackResponse, pathname);
    } catch (fallbackError) {
      console.error('🚨 Fallback fetch also failed:', fallbackError);
      return new Response('Service temporarily unavailable', { 
        status: 503,
        headers: SECURITY_HEADERS 
      });
    }
  }
}

function addSecurityHeaders(response, pathname) {
  const headers = new Headers(response.headers);
  
  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  // Add appropriate cache control
  if (HTML_FILES.test(pathname) || pathname.endsWith('/') || !pathname.includes('.')) {
    headers.set('Cache-Control', CACHE_RULES.html);
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');
  } else if (FONT_FILES.test(pathname)) {
    headers.set('Cache-Control', CACHE_RULES.font);
    headers.set('Content-Type', getFontContentType(pathname));
  } else if (STATIC_FILES.test(pathname)) {
    headers.set('Cache-Control', CACHE_RULES.static);
  }
  
  // Remove charset from font files
  if (FONT_FILES.test(pathname)) {
    const contentType = headers.get('Content-Type');
    if (contentType && contentType.includes('charset')) {
      headers.set('Content-Type', contentType.split(';')[0]);
    }
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

function getFontContentType(pathname) {
  if (pathname.endsWith('.woff2')) return 'font/woff2';
  if (pathname.endsWith('.woff')) return 'font/woff';
  if (pathname.endsWith('.ttf')) return 'font/ttf';
  if (pathname.endsWith('.eot')) return 'application/vnd.ms-fontobject';
  return 'font/woff2'; // default
}

// Handle messages from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🚀 Service Worker script loaded');