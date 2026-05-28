import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const sourceRepoRoot = process.env.FLUID_SOURCE_REPO || path.resolve(repoRoot, '../lghui12138.github.io');
const targetOrigin = 'https://lghui-fluid-learning.pages.dev';
const edgeRefresh = 'round268-auth-redirect-practice-20260526';

const routes = [
  '/knowledge.html',
  '/knowledge',
  '/_edge-login',
  '/_edge-fast-login',
  '/_edge-bridge',
  '/_edge-register',
  '/_edge-reset',
  '/_edge-logout',
  '/_edge-status',
  '/modules/knowledge-upgrade-2026.html',
  '/modules/real-exams-dynamic.html',
  '/modules/knowledge-detail.html',
  '/modules/knowledge-detail',
  '/modules/teacher-panel.html',
  '/modules/teacher-panel',
  '/modules/fluid-intensive-training.html',
  '/modules/wu-wangyi-fluid-reading.html',
  '/modules/wu-wangyi-fluid-reading',
  '/modules/wang-hongwei-fluid-reading.html',
  '/modules/wang-hongwei-fluid-reading',
  '/modules/physical-oceanography-home.html',
  '/modules/physical-oceanography-knowledge.html',
  '/modules/ai-assistant-dynamic.html',
  '/modules/progress-module.html',
  '/modules/question-bank.html',
  '/modules/question-bank-module.html',
  '/modules/practice-dynamic.html',
  '/modules/boundary-layer-dynamic.html',
  '/modules/energy-equation-dynamic.html',
  '/modules/experiment-dimension-dynamic.html',
  '/modules/flow-stability-dynamic.html',
  '/modules/fluid-dynamics-dynamic.html',
  '/modules/fluid-statics-dynamic.html',
  '/modules/free-surface-dynamic.html',
  '/modules/measurement-experiment-dynamic.html',
  '/modules/numerical-methods-dynamic.html',
  '/modules/pipe-flow-dynamic.html',
  '/modules/potential-flow-dynamic.html',
  '/modules/turbulent-flow-dynamic.html',
  '/modules/viscous-flow-dynamic.html',
  '/modules/vorticity-theory-dynamic.html',
  '/resources/fluid-original-animations.html',
  '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html',
  '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt',
  '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html',
  '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt',
  '/ultimate-beautiful-formulas.html',
  '/question-bank.html',
  '/question-bank-home.html',
  '/practice.html',
  '/practice-dynamic.html',
  '/resources.html',
  '/teacher-panel.html',
  '/teacher-panel'
];

const targetRouteOverrides = new Map([
  ['/', '/index-complete?full=1'],
  ['/index.html', '/index-complete?full=1'],
  ['/index-complete', '/index-complete?full=1'],
  ['/index-complete.html', '/index-complete?full=1'],
  ['/404.html', '/index-complete?full=1'],
  ['/offline.html', '/index-complete?full=1'],
  ['/knowledge.html', '/modules/knowledge-detail'],
  ['/knowledge', '/modules/knowledge-detail'],
  ['/modules/knowledge-detail.html', '/modules/knowledge-detail'],
  ['/modules/knowledge-detail', '/modules/knowledge-detail'],
  ['/modules/teacher-panel.html', '/modules/teacher-panel'],
  ['/modules/teacher-panel', '/modules/teacher-panel'],
  ['/modules/wu-wangyi-fluid-reading.html', '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt'],
  ['/modules/wu-wangyi-fluid-reading', '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt'],
  ['/modules/wang-hongwei-fluid-reading.html', '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt'],
  ['/modules/wang-hongwei-fluid-reading', '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt'],
  ['/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html', '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt'],
  ['/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt', '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt'],
  ['/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html', '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt'],
  ['/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt', '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt'],
  ['/practice-dynamic.html', '/modules/practice-dynamic.html'],
  ['/question-bank.html', '/modules/question-bank.html'],
  ['/question-bank-home.html', '/modules/question-bank.html'],
  ['/_edge-login', '/_edge-login'],
  ['/_edge-fast-login', '/_edge-fast-login'],
  ['/_edge-bridge', '/_edge-login'],
  ['/_edge-register', '/_edge-register'],
  ['/_edge-reset', '/_edge-reset'],
  ['/_edge-logout', '/_edge-logout'],
  ['/_edge-status', '/_edge-status'],
  ['/teacher-panel.html', '/modules/teacher-panel'],
  ['/teacher-panel', '/modules/teacher-panel']
]);

const runtimeCopies = [
  ['site-updates.json', 'site-updates.json'],
  ['js/core/local-mathjax.js', 'js/core/local-mathjax.js'],
  ['js/core/local-mathjax.js', 'local-mathjax.js'],
  ['js/core/local-mathjax.js', 'modules/local-mathjax.js'],
  ['js/core/local-mathjax.js', 'modules/js/core/local-mathjax.js'],
  ['js/formula-lite.js', 'js/formula-lite.js'],
  ['js/formula-lite.js', 'formula-lite.js'],
  ['js/formula-lite.js', 'modules/formula-lite.js'],
  ['js/formula-lite.js', 'modules/js/formula-lite.js'],
  ['js/edge-fluid-performance.js', 'js/edge-fluid-performance.js'],
  ['js/edge-fluid-learning-upgrade.js', 'js/edge-fluid-learning-upgrade.js'],
  ['lib/fm-core.js', 'lib/fm-core.js'],
  ['modules/js/practice-components.js', 'modules/js/practice-components.js'],
  ['modules/js/teacher-main.js', 'modules/js/teacher-main.js'],
  ['styles/edge-fluid-upgrade.css', 'styles/edge-fluid-upgrade.css'],
  ['modules/styles/practice-animations.css', 'modules/styles/practice-animations.css'],
  ['vendor/mathjax/es5/tex-chtml-full.js', 'vendor/mathjax/es5/tex-chtml-full.js'],
  ['vendor/mathjax/es5/output/chtml/fonts/tex.js', 'vendor/mathjax/es5/output/chtml/fonts/tex.js']
];

const authGuardAliases = [
  'js/security/auth-guard.js',
  'auth-guard.js',
  'modules/auth-guard.js',
  'modules/js/security/auth-guard.js'
];

const jsonFallbacks = new Map([
  ['/api/auth/me', {
    ok: false,
    authenticated: false,
    error: 'public_shell_static_origin',
    message: 'lghui.top is a static migration shell. Open the Cloudflare learning origin to sign in.',
    sourceOrigin: targetOrigin,
    edgeRefresh
  }]
]);

function targetRouteFor(route) {
  return targetRouteOverrides.get(route) || route;
}

function targetHrefForRoute(route) {
  const targetRoute = targetRouteFor(route);
  const target = new URL(targetRoute, targetOrigin);
  target.searchParams.set('edge_refresh', edgeRefresh);
  return {
    href: target.toString(),
    pathname: target.pathname,
    search: target.search
  };
}

function htmlFor(route) {
  const targetInfo = targetHrefForRoute(route);
  const target = targetInfo.href;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta http-equiv="cache-control" content="no-store">
  <link rel="canonical" href="${target}">
  <title>正在进入流体力学主站</title>
  <style>
    :root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f7fbff;color:#07111f}
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,#f7fbff,#eef7f8)}
    main{width:min(560px,100%);border:1px solid rgba(7,17,31,.12);border-radius:8px;background:rgba(255,255,255,.88);padding:28px;box-shadow:0 18px 50px rgba(7,17,31,.12)}
    h1{margin:0 0 10px;font-size:28px;letter-spacing:0}
    p{margin:0 0 14px;color:#425466;line-height:1.7}
    a{display:inline-flex;align-items:center;min-height:42px;border-radius:8px;background:#0f766e;color:#fff;padding:0 16px;text-decoration:none;font-weight:800}
    code{word-break:break-all}
  </style>
</head>
<body>
  <main>
    <h1>正在进入主站</h1>
    <p>这个公开路径已迁移到 Cloudflare 源站，正在自动打开完整主站。若浏览器拦截自动跳转，请点击按钮进入。</p>
    <p>当前入口版本是 ${edgeRefresh}。跳转会保留当前路径并把旧 edge_refresh 统一改到 round268，主站会继续显示完整内容、公式和练习。</p>
    <p><code>${route}</code></p>
    <p><a id="targetLink" href="${target}">立即打开</a></p>
  </main>
  <script>
    const TARGET_ORIGIN = '${targetOrigin}';
    const ROUTE = '${targetInfo.pathname}';
    const BASE_SEARCH = '${targetInfo.search}';
    const EDGE_REFRESH = '${edgeRefresh}';
    function timeout(ms){
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async function clearOldPublicState(){
      try{
        if('serviceWorker' in navigator){
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration)=>registration.unregister()));
        }
        if(window.caches){
          const keys = await caches.keys();
          await Promise.all(keys.map((key)=>caches.delete(key)));
        }
      }catch(_){}
    }
    const searchParams = new URLSearchParams(BASE_SEARCH);
    for (const [key, value] of new URLSearchParams(location.search)) searchParams.set(key, value);
    searchParams.delete('go');
    searchParams.set('edge_refresh', EDGE_REFRESH);
    const target = TARGET_ORIGIN + ROUTE + '?' + searchParams.toString() + location.hash;
    document.getElementById('targetLink').href = target;
    let entering = false;
    function enterTarget(){
      if (entering || location.href === target) return;
      entering = true;
      location.replace(target);
    }
    requestAnimationFrame(enterTarget);
    setTimeout(enterTarget, 250);
    Promise.race([clearOldPublicState(), timeout(600)]).finally(enterTarget);
  </script>
</body>
</html>
`;
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyRuntimeAsset(sourceRelative, destRelative) {
  const sourcePath = path.join(sourceRepoRoot, sourceRelative);
  const destPath = path.join(repoRoot, destRelative);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source runtime asset: ${sourcePath}`);
  }
  ensureParent(destPath);
  fs.copyFileSync(sourcePath, destPath);
}

function copyRuntimeTree(sourceRelative, destRelative) {
  const sourcePath = path.join(sourceRepoRoot, sourceRelative);
  const destPath = path.join(repoRoot, destRelative);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source runtime directory: ${sourcePath}`);
  }
  fs.mkdirSync(destPath, { recursive: true });
  for (const entry of fs.readdirSync(sourcePath, { withFileTypes: true })) {
    if (entry.name.startsWith('._') || entry.name === '.DS_Store') continue;
    const sourceChild = path.join(sourceRelative, entry.name);
    const destChild = path.join(destRelative, entry.name);
    if (entry.isDirectory()) {
      copyRuntimeTree(sourceChild, destChild);
    } else if (entry.isFile()) {
      copyRuntimeAsset(sourceChild, destChild);
    }
  }
}

function authGuardShim() {
  return `(() => {
  const TARGET_ORIGIN = '${targetOrigin}';
  const EDGE_REFRESH = '${edgeRefresh}';
  const SESSION_KEYS = ['fm_session_v2', 'fm_auth_session_v2', 'fluidMechanicsUser', 'currentUser'];

  function sourceUrl(pathname = location.pathname) {
    const route = pathname && pathname !== '/' ? pathname : '/index-complete';
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('go');
    searchParams.set('edge_refresh', EDGE_REFRESH);
    return TARGET_ORIGIN + route + '?' + searchParams.toString() + location.hash;
  }

  function clearPending() {
    try { document.documentElement.removeAttribute('data-auth-pending'); } catch (_) {}
  }

  function clearSession() {
    try { SESSION_KEYS.forEach((key) => localStorage.removeItem(key)); } catch (_) {}
  }

  function goSource(pathname) {
    clearPending();
    const target = sourceUrl(pathname);
    if (location.href !== target) location.replace(target);
    return false;
  }

  window.__FM_PUBLIC_SHELL_AUTH_GUARD__ = true;
  window.FMSecurity = {
    AUTH_SESSION_KEY: 'fm_auth_session_v2',
    clearSession,
    getCurrentUser() { return null; },
    async guardPage(options = {}) {
      clearPending();
      if (options.teacherOnly || /teacher-panel/i.test(location.pathname)) return goSource(location.pathname);
      return false;
    },
    logout() { location.href = TARGET_ORIGIN + '/_edge-logout'; }
  };

  clearPending();
  const pendingGuard = window.__FM_AUTH_GUARD__;
  if (pendingGuard?.teacherOnly || /teacher-panel/i.test(location.pathname)) {
    goSource(location.pathname);
  }
})();\n`;
}

function serviceWorkerKillSwitch() {
  return `/*
 * Public-shell service worker kill switch.
 * Keeps lghui.top from serving stale cached HTML/JS after the Cloudflare origin migration.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.allSettled(keys.map((key) => caches.delete(key)));
    } catch (_) {}
    try {
      if (self.clients?.claim) await self.clients.claim();
    } catch (_) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        try { client.navigate(client.url); } catch (_) {}
      }
    } catch (_) {}
    try {
      await self.registration.unregister();
    } catch (_) {}
  })());
});

self.addEventListener('fetch', () => {});\n`;
}

function writeRuntimeAssets() {
  for (const [sourceRelative, destRelative] of runtimeCopies) {
    copyRuntimeAsset(sourceRelative, destRelative);
  }
  copyRuntimeTree('vendor/mathjax/es5/output/chtml/fonts/woff-v2', 'vendor/mathjax/es5/output/chtml/fonts/woff-v2');
  for (const destRelative of authGuardAliases) {
    const destPath = path.join(repoRoot, destRelative);
    ensureParent(destPath);
    fs.writeFileSync(destPath, authGuardShim());
  }
  for (const name of ['sw.js', 'sw-simple.js']) {
    fs.writeFileSync(path.join(repoRoot, name), serviceWorkerKillSwitch());
  }
}

function removeGeneratedAppleDoubleFiles(dir = repoRoot) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name.startsWith('._')) {
      fs.rmSync(fullPath, { force: true, recursive: true });
    } else if (entry.isDirectory()) {
      removeGeneratedAppleDoubleFiles(fullPath);
    }
  }
}

function writeJsonFallbacks() {
  for (const [route, payload] of jsonFallbacks) {
    const filePath = path.join(repoRoot, route.replace(/^\//, ''), 'index.html');
    ensureParent(filePath);
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
  }
}

function updateManifestEntry() {
  const filePath = path.join(repoRoot, 'manifest.json');
  if (!fs.existsSync(filePath)) return;
  const manifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  manifest.start_url = '/index-complete.html?full=1';
  for (const handler of manifest.protocol_handlers || []) {
    if (handler && handler.url === '/index-complete.html?action=%s') {
      handler.url = '/index-complete.html?full=1&action=%s';
    }
  }
  fs.writeFileSync(filePath, `${JSON.stringify(manifest, null, 2)}\n`);
}

for (const route of routes) {
  const routePath = route.replace(/^\//, '');
  const routeLeaf = path.basename(routePath);
  const routeIsExtensionless = !routeLeaf.includes('.');
  const staleExtensionlessFilePath = path.join(repoRoot, routePath);
  const filePath = routeIsExtensionless
    ? path.join(repoRoot, routePath, 'index.html')
    : staleExtensionlessFilePath;
  if (routeIsExtensionless && fs.existsSync(staleExtensionlessFilePath) && fs.statSync(staleExtensionlessFilePath).isFile()) {
    fs.unlinkSync(staleExtensionlessFilePath);
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, htmlFor(route));
}

for (const fileName of ['index.html', 'index-complete.html', 'offline.html', '404.html']) {
  fs.writeFileSync(path.join(repoRoot, fileName), htmlFor('/index-complete'));
}
fs.writeFileSync(path.join(repoRoot, '.nojekyll'), '');
updateManifestEntry();
writeRuntimeAssets();
writeJsonFallbacks();
removeGeneratedAppleDoubleFiles(repoRoot);
fs.writeFileSync(path.join(repoRoot, '_headers'), `/*.html
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/*
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/sw.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
  Clear-Site-Data: "cache", "storage"

/sw-simple.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
  Clear-Site-Data: "cache", "storage"

/js/formula-lite.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/js/core/local-mathjax.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/formula-lite.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/local-mathjax.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/vendor/mathjax/es5/tex-chtml-full.js
  Cache-Control: no-cache, must-revalidate
  Content-Type: application/javascript; charset=utf-8

/api/auth/me/*
  Content-Type: application/json; charset=utf-8
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/api/auth/me
  Content-Type: application/json; charset=utf-8
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/vendor/mathjax/es5/output/chtml/fonts/*.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: no-cache, must-revalidate

/vendor/mathjax/es5/output/chtml/fonts/woff-v2/*.woff
  Content-Type: font/woff
  X-Content-Type-Options: nosniff
  Cache-Control: public, max-age=31536000, immutable
`);
removeGeneratedAppleDoubleFiles(repoRoot);

console.log(JSON.stringify({
  generated: routes.length,
  runtimeAssets: runtimeCopies.length + authGuardAliases.length + 1,
  jsonFallbacks: jsonFallbacks.size,
  edgeRefresh
}, null, 2));
