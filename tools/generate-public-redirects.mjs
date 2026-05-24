import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const targetOrigin = 'https://lghui-fluid-learning.pages.dev';
const edgeRefresh = 'round265-redirect-loop-recovery-20260524';

const routes = [
  '/modules/knowledge-upgrade-2026.html',
  '/modules/real-exams-dynamic.html',
  '/modules/knowledge-detail.html',
  '/modules/fluid-intensive-training.html',
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
  '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html',
  '/ultimate-beautiful-formulas.html',
  '/question-bank.html',
  '/question-bank-home.html',
  '/practice.html',
  '/practice-dynamic.html',
  '/resources.html',
  '/teacher-panel.html'
];

const targetRouteOverrides = new Map([
  ['/practice-dynamic.html', '/modules/practice-dynamic.html'],
  ['/question-bank-home.html', '/modules/question-bank.html']
]);

function targetRouteFor(route) {
  return targetRouteOverrides.get(route) || route;
}

function htmlFor(route) {
  const targetRoute = targetRouteFor(route);
  const target = `${targetOrigin}${targetRoute}?edge_refresh=${encodeURIComponent(edgeRefresh)}`;
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
    <p>这个公开路径已迁移到 Cloudflare 源站。为避免旧浏览器状态触发循环，页面不再自动跳转，请点击按钮进入。</p>
    <p>当前入口版本是 ${edgeRefresh}。按钮会保留当前路径并把旧 edge_refresh 统一改到 round265，主站会继续显示公式适用条件、边界条件、单位方向和错因回查内容。</p>
    <p><code>${route}</code></p>
    <p><a id="targetLink" href="${target}">立即打开</a></p>
  </main>
  <script>
    const TARGET_ORIGIN = '${targetOrigin}';
    const ROUTE = '${targetRoute}';
    const EDGE_REFRESH = '${edgeRefresh}';
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
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('go');
    searchParams.set('edge_refresh', EDGE_REFRESH);
    const target = TARGET_ORIGIN + ROUTE + '?' + searchParams.toString() + location.hash;
    document.getElementById('targetLink').href = target;
    clearOldPublicState();
  </script>
</body>
</html>
`;
}

for (const route of routes) {
  const filePath = path.join(repoRoot, route.replace(/^\//, ''));
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, htmlFor(route));
}

console.log(JSON.stringify({ generated: routes.length, edgeRefresh }, null, 2));
