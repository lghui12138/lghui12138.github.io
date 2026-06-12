(function () {
  'use strict';

  var VERSION = 'round287-source-section-ledger-study-routes-20260613';
  var LEARNING_CONTENT_VERSION = 'round264-formula-condition-checklist-20260522';
  var R247_VERSION = 'round247-real-exam-pdf-fidelity-audit-20260518';
  var R247_AUDIT_URL_PARTS = ['fluid-real-exam-pdf-fidelity-audit', 'json'];
  var R247_SELECTOR = [
    '[data-round247-real-exam-pdf-fidelity-audit]',
    '[data-r247-audit-summary]',
    '[data-r247-evidence-card]',
    '[data-r247-risk-note]',
    '[data-r247-source]',
    '[data-r247-fidelity]',
    '[data-r247-year-audit]',
    '[data-real-exam-source]',
    '[data-real-exam-year]',
    '[data-source-status]',
    '[data-pdf-fidelity]',
    '[data-fidelity-status]',
    '[data-answer-source]'
  ].join(',');
  var PREFETCH = [
    '/modules/real-exams-dynamic.html',
    '/modules/simulated-exams-dynamic.html'
  ];
  var FORMULA_PREFETCH_URLS = [
    '/data/fluid-formula-index.json'
  ];
  var SEARCH_PREFETCH_URLS = [
    '/data/fluid-home-search-index.json'
  ];
  var WARM_FETCH_URLS = [
    '/question-banks/real-exams-index.json'
  ];
  var STATE_KEY = 'efu_perf_v1';
  var DEFERRED_TRACK_KEY = 'efu_perf_deferred_track_v1';
  var warmFetchInflight = {};

  function idle(fn, timeout) {
    if ('requestIdleCallback' in window) return requestIdleCallback(fn, { timeout: timeout || 1200 });
    return setTimeout(fn, Math.min(timeout || 500, 1200));
  }

  function saveMetric(name, value) {
    try {
      var data = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
      data.version = VERSION;
      data.updatedAt = new Date().toISOString();
      data[name] = value;
      localStorage.setItem(STATE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function markRound241() {
    try {
      document.documentElement.setAttribute('data-round241-human-teacher-upgrade', '1');
      document.documentElement.setAttribute('data-edge-human-teacher-version', VERSION);
      document.documentElement.setAttribute('data-current-entry-version', VERSION);
      document.documentElement.setAttribute('data-learning-content-version', LEARNING_CONTENT_VERSION);
    } catch (_) {}
  }

  function hasRound247Target(root) {
    root = root || document;
    try {
      if (root.nodeType === 1 && root.matches && root.matches(R247_SELECTOR)) return true;
      return !!(root.querySelector && root.querySelector(R247_SELECTOR));
    } catch (_) {
      return false;
    }
  }

  function markRound247() {
    if (!hasRound247Target(document)) return false;
    try {
      document.documentElement.setAttribute('data-round247-real-exam-pdf-fidelity-audit', R247_VERSION);
      document.documentElement.setAttribute('data-r247-performance', R247_VERSION);
    } catch (_) {}
    return true;
  }

  function connection() {
    return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;
  }

  function constrainedNetwork() {
    var c = connection();
    if (navigator.onLine === false) return true;
    if (!c) return false;
    if (c.saveData) return true;
    return /^(slow-2g|2g)$/i.test(c.effectiveType || '');
  }

  function saveDeferredTrack(body) {
    try {
      var list = JSON.parse(localStorage.getItem(DEFERRED_TRACK_KEY) || '[]');
      if (!Array.isArray(list)) list = [];
      list.push(JSON.parse(body));
      localStorage.setItem(DEFERRED_TRACK_KEY, JSON.stringify(list.slice(-80)));
    } catch (_) {}
  }

  function cssEscape(value) {
    if (window.CSS && CSS.escape) return CSS.escape(value);
    return String(value).replace(/["\\]/g, '\\$&');
  }

  function track(eventName, payload) {
    var body = JSON.stringify({
      type: eventName,
      source: 'edge-fluid-performance',
      version: VERSION,
      payload: payload || {},
      path: location.pathname,
      at: new Date().toISOString()
    });
    if (constrainedNetwork()) {
      saveDeferredTrack(body);
      return;
    }
    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: 'application/json' });
        if (navigator.sendBeacon('/api/track', blob)) return;
      }
    } catch (_) {}
    fetch('/api/track', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      keepalive: true
    }).catch(function () {});
  }

  function prefetchLink(url, as) {
    if (constrainedNetwork()) return;
    if (!url || document.querySelector('link[data-efu-prefetch="' + cssEscape(url) + '"]')) return;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    if (as) link.as = as;
    link.setAttribute('data-efu-prefetch', url);
    document.head.appendChild(link);
  }

  function fetchWithTimeout(url, options, timeoutMs) {
    options = options || {};
    timeoutMs = timeoutMs || 5000;
    var controller = null;
    var timer = null;
    var request = {
      credentials: options.credentials,
      cache: options.cache,
      headers: options.headers,
      method: options.method,
      body: options.body,
      keepalive: options.keepalive
    };
    if ('AbortController' in window) {
      controller = new AbortController();
      request.signal = controller.signal;
      timer = setTimeout(function () { controller.abort(); }, timeoutMs);
    }
    return fetch(url, request).then(function (response) {
      if (timer) clearTimeout(timer);
      return response;
    }, function (error) {
      if (timer) clearTimeout(timer);
      throw error;
    });
  }

  function warmFetch(url) {
    if (constrainedNetwork()) return Promise.resolve();
    if (warmFetchInflight[url]) return warmFetchInflight[url];
    warmFetchInflight[url] = fetchWithTimeout(url, { credentials: 'same-origin', cache: 'force-cache' }, 4500)
      .catch(function () {})
      .then(function (response) {
        delete warmFetchInflight[url];
        return response;
      });
    return warmFetchInflight[url];
  }

  function warmCritical() {
    if (constrainedNetwork()) {
      saveMetric('warmupSkipped', {
        reason: 'constrained-network',
        at: new Date().toISOString()
      });
      return;
    }
    Promise.all(WARM_FETCH_URLS.map(function (url) { return warmFetch(url); }))
      .then(function () { track('edge_json_warmup', { count: WARM_FETCH_URLS.length }); });
    PREFETCH
      .filter(function (url) { return WARM_FETCH_URLS.indexOf(url) === -1; })
      .forEach(function (url) { prefetchLink(url); });
  }

  function warmRound247Audit() {
    if (!markRound247() || constrainedNetwork()) return;
    var r247AuditUrl = '/data/' + R247_AUDIT_URL_PARTS[0] + '.' + R247_AUDIT_URL_PARTS[1];
    warmFetch(r247AuditUrl).then(function () {
      saveMetric('round247AuditWarmup', {
        version: R247_VERSION,
        url: r247AuditUrl,
        at: new Date().toISOString()
      });
    });
    prefetchLink(r247AuditUrl, 'fetch');
  }

  function warmFormulaAssets() {
    if (constrainedNetwork()) return;
    FORMULA_PREFETCH_URLS.forEach(function (url) { prefetchLink(url, 'fetch'); });
  }

  function warmSearchAssets() {
    if (constrainedNetwork()) return;
    SEARCH_PREFETCH_URLS.forEach(function (url) { prefetchLink(url, 'fetch'); });
  }

  function setupHoverPrefetch() {
    var seen = new Set();
    function warmAnchor(anchor) {
      if (!anchor) return;
      if (constrainedNetwork()) return;
      var href = anchor.getAttribute('href');
      if (!href || href.charAt(0) !== '/' || seen.has(href)) return;
      seen.add(href);
      prefetchLink(href);
      if (/formula|ultimate-beautiful-formulas|fluid-intensive-training|knowledge-detail/i.test(href) || /公式|量纲|边界/.test(anchor.textContent || '')) {
        warmFormulaAssets();
      }
      if (/search|知识点|题库|真题/.test(anchor.textContent || '')) {
        warmSearchAssets();
      }
    }
    ['pointerover', 'focusin', 'touchstart'].forEach(function (eventName) {
      document.addEventListener(eventName, function (event) {
        warmAnchor(event.target.closest && event.target.closest('a[href^="/"]'));
      }, { passive: true });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === '/') warmSearchAssets();
    }, { passive: true });
    ['pointerover', 'focusin', 'touchstart'].forEach(function (eventName) {
      document.addEventListener(eventName, function (event) {
        if (event.target.closest && event.target.closest('#searchT,[role="search"],input[type="search"]')) warmSearchAssets();
      }, { passive: true });
    });
  }

  function setupLazyMathAndMedia() {
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.dataset && el.dataset.src && !el.getAttribute('src')) {
          el.setAttribute('src', el.dataset.src);
        }
        if (el.classList.contains('math') && window.FMQueueMath) {
          window.FMQueueMath(el, 80);
        }
        observer.unobserve(el);
      });
    }, { rootMargin: '220px 0px' });
    document.querySelectorAll('img[data-src],iframe[data-src],.math').forEach(function (el) {
      observer.observe(el);
    });
  }

  function installOfflineNotice() {
    var id = 'efuOfflineNotice';
    function render(online) {
      var node = document.getElementById(id);
      if (online) {
        if (node) node.remove();
        return;
      }
      if (node) return;
      node = document.createElement('div');
      node.id = id;
      node.className = 'efu-offline-notice';
      node.setAttribute('role', 'status');
      node.setAttribute('aria-live', 'polite');
      node.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:auto;padding:12px 14px;border-radius:8px;background:#172033;color:#fff;box-shadow:0 14px 34px rgba(15,23,42,.24);font:700 14px/1.55 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;text-align:left';
      node.textContent = '网络不稳定：本地学习状态已保留，恢复联网后再加载题库与知识点。';
      document.body.appendChild(node);
    }
    window.addEventListener('online', function () { render(true); });
    window.addEventListener('offline', function () { render(false); });
    render(navigator.onLine);
  }

  function markVersion() {
    document.documentElement.setAttribute('data-efu-version', VERSION);
    var target = document.querySelector('[data-edge-version], .fine');
    if (!target || document.getElementById('efuVersionPill')) return;
    var pill = document.createElement('span');
    pill.id = 'efuVersionPill';
    pill.className = 'efu-chip';
    pill.textContent = VERSION;
    if (target.classList && target.classList.contains('fine')) target.appendChild(pill);
    else target.textContent = VERSION;
  }

  function observeVitals() {
    if (!('performance' in window)) return;
    window.addEventListener('load', function () {
      idle(function () {
        var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
        if (nav) {
          saveMetric('navigation', {
            domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
            load: Math.round(nav.loadEventEnd),
            transferSize: nav.transferSize || 0
          });
          track('edge_performance_metrics', {
            domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
            load: Math.round(nav.loadEventEnd),
            transferSize: nav.transferSize || 0
          });
        }
        var paint = performance.getEntriesByType && performance.getEntriesByType('paint');
        if (paint && paint.length) {
          saveMetric('paint', paint.reduce(function (acc, item) {
            acc[item.name] = Math.round(item.startTime);
            return acc;
          }, {}));
        }
      }, 1500);
    }, { once: true });
  }

  function clearOldEdgeHint() {
    var current = new URL(location.href);
    var refresh = current.searchParams.get('edge_refresh');
    if (!refresh) return;
    try {
      localStorage.setItem('efu_last_edge_refresh', refresh);
    } catch (_) {}
  }

  function edgeStatusDebugEnabled() {
    try {
      var params = new URLSearchParams(location.search || '');
      if (params.get('debug') === '1' || params.get('edge_debug') === '1') return true;
    } catch (_) {}
    try {
      return localStorage.getItem('efu_debug') === '1';
    } catch (_) {
      return false;
    }
  }

  function showEdgeStatus() {
    if (!edgeStatusDebugEnabled()) return;
    if (constrainedNetwork()) return;
    fetchWithTimeout('/_edge-status', { credentials: 'same-origin', cache: 'no-cache' }, 4500)
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (status) {
        if (!status || !status.edgeHomeVersion) return;
        var old = localStorage.getItem('efu_seen_edge_version');
        localStorage.setItem('efu_seen_edge_version', status.edgeHomeVersion);
        if (document.getElementById('efuEdgeStatus')) return;
        var box = document.createElement('div');
        box.id = 'efuEdgeStatus';
        box.style.cssText = 'position:fixed;left:16px;bottom:16px;z-index:9998;display:flex;align-items:center;gap:8px;max-width:min(520px,calc(100vw - 32px));padding:9px 11px;border:1px solid rgba(15,118,110,.18);border-radius:999px;background:rgba(255,255,255,.9);color:#0f766e;box-shadow:0 14px 38px rgba(15,23,42,.12);font:800 12px/1.2 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;backdrop-filter:blur(16px)';
        var changed = old && old !== status.edgeHomeVersion;
        box.innerHTML = '<span>Edge ' + status.edgeHomeVersion + '</span>' + (changed ? '<button type="button" style="border:0;border-radius:999px;background:#0f766e;color:#fff;font:inherit;padding:6px 9px;cursor:pointer">刷新</button>' : '');
        document.body.appendChild(box);
        var btn = box.querySelector('button');
        if (btn) btn.addEventListener('click', function () {
          var next = new URL(location.href);
          next.searchParams.set('edge_refresh', status.edgeHomeVersion);
          location.href = next.toString();
        });
      })
      .catch(function () {});
  }

  function boot() {
    markRound241();
    clearOldEdgeHint();
    setupHoverPrefetch();
    installOfflineNotice();
    observeVitals();
    idle(warmCritical, 900);
    idle(setupLazyMathAndMedia, 1100);
    idle(markVersion, 500);
    idle(warmRound247Audit, 700);
    idle(showEdgeStatus, 1300);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.EdgeFluidPerformance = {
    version: VERSION,
    round247Version: R247_VERSION,
    warm: warmCritical,
    warmFormulaAssets: warmFormulaAssets,
    warmSearchAssets: warmSearchAssets,
    warmRound247Audit: warmRound247Audit,
    metrics: function () {
      try { return JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); } catch (_) { return {}; }
    }
  };
})();
