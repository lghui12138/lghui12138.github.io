(function () {
  const SOURCE_ORIGIN = 'https://lghui-fluid-learning.pages.dev';
  const EDGE_REFRESH = 'round792-figure68-ocean-blue-current-20260715';

  const routeMap = new Map([
    ['/knowledge.html', '/modules/knowledge-detail.html'],
    ['/knowledge', '/modules/knowledge-detail'],
    ['/question-bank.html', '/modules/question-bank.html'],
    ['/question-bank', '/modules/question-bank'],
    ['/daily-question.html', '/modules/daily-question.html'],
    ['/daily-question', '/modules/daily-question.html'],
    ['/modules/videos.html', '/modules/videos'],
    ['/modules/videos', '/modules/videos'],
    ['/video.html', '/modules/videos'],
    ['/video', '/modules/videos'],
    ['/videos.html', '/modules/videos'],
    ['/videos', '/modules/videos'],
    ['/course-videos.html', '/modules/videos'],
    ['/course-videos', '/modules/videos'],
    ['/modules/video-dynamic.html', '/modules/videos'],
    ['/modules/video-dynamic', '/modules/videos'],
    ['/modules/video-enhanced-module.html', '/modules/videos'],
    ['/modules/video-enhanced-module', '/modules/videos'],
    ['/modules/video-module.html', '/modules/videos'],
    ['/modules/video-module', '/modules/videos'],
    ['/modules/course-videos.html', '/modules/videos'],
    ['/modules/course-videos', '/modules/videos'],
    ['/real-exams.html', '/modules/real-exams-dynamic.html'],
    ['/real-exams', '/modules/real-exams-dynamic'],
    ['/simulated-exams.html', '/modules/simulated-exams-dynamic.html'],
    ['/simulated-exams', '/modules/simulated-exams-dynamic'],
    ['/practice-dynamic.html', '/modules/practice-dynamic.html'],
    ['/practice-dynamic', '/modules/practice-dynamic.html'],
    ['/resources.html', '/resources.html'],
    ['/resources', '/resources'],
    ['/resources/fluid-original-animations.html', '/resources/fluid-original-animations.html'],
    ['/resources/fluid-original-animations', '/resources/fluid-original-animations.html'],
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
    target.searchParams.set('edge_refresh', EDGE_REFRESH);
    if ((sourcePath === '/_edge-fast-login' || sourcePath === '/_edge-login') && !target.searchParams.has('next')) {
      target.searchParams.set('next', '/index-complete?full=1');
    }
    target.hash = current.hash;
    return target;
  }

  function updateGatewayLink(target) {
    const link = document.querySelector('[data-source-link]');
    if (link) link.href = target.href;
  }

  function wireHomeLinks() {
    document.querySelectorAll('[data-source-path]').forEach((link) => {
      const path = link.getAttribute('data-source-path') || '/_edge-fast-login';
      const target = new URL(path, SOURCE_ORIGIN);
      target.searchParams.set('edge_refresh', EDGE_REFRESH);
      link.href = target.href;
    });
  }

  function warmAuthenticatedSource() {
    const status = new URL('/_edge-status', SOURCE_ORIGIN);
    status.searchParams.set('edge_refresh', EDGE_REFRESH);
    fetch(status.href, {
      mode: 'no-cors',
      credentials: 'omit',
      cache: 'no-store',
      priority: 'high'
    }).catch(() => {});
  }

  warmAuthenticatedSource();
  const target = currentTarget();
  updateGatewayLink(target);
  wireHomeLinks();

  if (document.documentElement.dataset.edgeGateway === '1') {
    window.setTimeout(() => {
      window.location.replace(target.href);
    }, 120);
  }
})();
