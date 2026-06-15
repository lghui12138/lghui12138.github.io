(() => {
  const TARGET_ORIGIN = 'https://lghui-fluid-learning.pages.dev';
  const EDGE_REFRESH = 'round356-181103-workbook-html-ocr-clean-20260615';
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
})();
