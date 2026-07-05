(function () {
  const SOURCE_ORIGIN = 'https://lghui-fluid-learning.pages.dev';
  const SOURCE_REFRESH = 'round755-progressive-home-current-20260705';
  const CACHE_CLEAN_KEY = 'lghui-public-shell-cache-clean-round762-edge-rum-connect-current-20260705';

  const routeMap = new Map([
    ['/knowledge.html', '/modules/knowledge-detail.html'],
    ['/knowledge', '/modules/knowledge-detail'],
    ['/question-bank.html', '/modules/question-bank.html'],
    ['/question-bank', '/modules/question-bank'],
    ['/real-exams.html', '/modules/real-exams-dynamic.html'],
    ['/real-exams', '/modules/real-exams-dynamic'],
    ['/simulated-exams.html', '/modules/simulated-exams-dynamic.html'],
    ['/simulated-exams', '/modules/simulated-exams-dynamic'],
    ['/practice-dynamic.html', '/modules/practice-dynamic.html'],
    ['/practice-dynamic', '/modules/practice-dynamic.html'],
    ['/resources.html', '/resources.html'],
    ['/resources', '/resources'],
    ['/_edge-login', '/_edge-login'],
    ['/_edge-fast-login', '/_edge-fast-login'],
    ['/_edge-register', '/_edge-register'],
    ['/_edge-forgot-password', '/_edge-forgot-password'],
    ['/_edge-reset', '/_edge-reset'],
    ['/_edge-logout', '/_edge-logout'],
    ['/_edge-status', '/_edge-status']
  ]);

  function normalizedPath() {
    const path = window.location.pathname || '/';
    return path.length > 1 ? path.replace(/\/+$/, '') : path;
  }

  function sourcePathFor(pathname) {
    if (routeMap.has(pathname)) return routeMap.get(pathname);
    if (pathname === '/' || pathname === '/index.html' || pathname === '/index-complete.html' || pathname === '/index-complete') {
      return '/_edge-fast-login';
    }
    if (pathname.startsWith('/modules/') || pathname.startsWith('/resources/')) {
      return pathname;
    }
    return '/_edge-fast-login';
  }

  function currentTarget() {
    const sourcePath = sourcePathFor(normalizedPath());
    const target = new URL(sourcePath, SOURCE_ORIGIN);
    const current = new URL(window.location.href);

    for (const [key, value] of current.searchParams.entries()) {
      if (key !== 'edge_refresh') target.searchParams.append(key, value);
    }
    target.searchParams.set('edge_refresh', SOURCE_REFRESH);
    if ((sourcePath === '/_edge-fast-login' || sourcePath === '/_edge-login') && !target.searchParams.has('next')) {
      target.searchParams.set('next', '/index-complete?full=1');
    }
    target.hash = current.hash;
    return target;
  }

  async function clearPublicShellCaches() {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.allSettled(registrations.map((registration) => registration.unregister()));
      }
    } catch (_) {}

    try {
      if (window.caches && caches.keys) {
        const keys = await caches.keys();
        await Promise.allSettled(keys.map((key) => caches.delete(key)));
      }
    } catch (_) {}
  }

  function schedulePublicShellCacheCleanup() {
    try {
      if (window.localStorage.getItem(CACHE_CLEAN_KEY) === '1') return;
    } catch (_) {}

    const run = () => {
      clearPublicShellCaches().finally(() => {
        try {
          window.localStorage.setItem(CACHE_CLEAN_KEY, '1');
        } catch (_) {}
      });
    };

    const schedule = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(run, { timeout: 1800 });
      } else {
        window.setTimeout(run, 1800);
      }
    };

    window.setTimeout(schedule, 700);
  }

  function updateGatewayLink(target) {
    const link = document.querySelector('[data-source-link]');
    if (link) link.href = target.href;
  }

  function wireHomeLinks() {
    document.querySelectorAll('[data-source-path]').forEach((link) => {
      const path = link.getAttribute('data-source-path') || '/_edge-fast-login';
      const target = new URL(path, SOURCE_ORIGIN);
      target.searchParams.set('edge_refresh', SOURCE_REFRESH);
      link.href = target.href;
    });
  }

  const target = currentTarget();
  schedulePublicShellCacheCleanup();
  updateGatewayLink(target);
  wireHomeLinks();

  if (document.documentElement.dataset.edgeGateway === '1') {
    window.setTimeout(() => {
      window.location.replace(target.href);
    }, 120);
  }
})();
