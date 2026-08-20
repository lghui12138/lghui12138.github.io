/**
 * Apple Fluid Motion & GitHub Spotlight Micro-Interaction Engine
 * - Zero-latency speculative prefetching & instant navigation
 * - Apple-grade 3D spring tilt & liquid glass specular reflection
 * - GitHub Universe cursor-tracking radial spotlight glow
 * - View Transitions API cross-page cinematic continuity
 */
(function (window, document) {
  'use strict';

  const PRELOAD_DELAY_MS = 45;
  const preloadedUrls = new Set();

  // 1. Speculative Prefetch & Pre-rendering
  function prefetchUrl(url) {
    if (!url || preloadedUrls.has(url)) return;
    try {
      const target = new URL(url, window.location.origin);
      if (target.origin !== window.location.origin && !target.hostname.includes('pages.dev')) return;
      if (target.pathname === window.location.pathname && target.search === window.location.search) return;

      preloadedUrls.add(url);

      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = target.href;
      link.as = 'document';
      document.head.appendChild(link);

      if ('fetch' in window) {
        fetch(target.href, { priority: 'low', credentials: 'same-origin' }).catch(() => {});
      }
    } catch (_) {}
  }

  function initInstantNavigation() {
    let hoverTimer = null;

    document.addEventListener('pointerover', function (e) {
      const link = e.target.closest('a[href], [data-source-path]');
      if (!link) return;
      const href = link.getAttribute('data-source-path') || link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        prefetchUrl(href);
      }, PRELOAD_DELAY_MS);
    }, { passive: true });

    document.addEventListener('pointerdown', function (e) {
      const link = e.target.closest('a[href], [data-source-path]');
      if (!link) return;
      const href = link.getAttribute('data-source-path') || link.getAttribute('href');
      if (href) prefetchUrl(href);
    }, { passive: true });
  }

  // 2. GitHub & Apple Spotlight / Glow Cursor Tracking
  function initSpotlightCards() {
    const selector = '.action, .card, .main-card, .check-card, .panel, .hero, .btn, .route-chip, .gateway-card, [data-apple-spotlight]';

    document.addEventListener('pointermove', function (e) {
      const target = e.target.closest(selector);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
      target.style.setProperty('--spotlight-opacity', '1');
    }, { passive: true });

    document.addEventListener('pointerleave', function (e) {
      const target = e.target.closest(selector);
      if (target) {
        target.style.setProperty('--spotlight-opacity', '0');
      }
    }, { passive: true });
  }

  // 3. Apple Fluid Spring Micro-Tilt
  function initAppleSpringTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window && window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.action, .card, .main-card, .panel');
    cards.forEach((card) => {
      let rafId = null;

      card.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -3.5;
          const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 3.5;

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px) scale(1.008)`;
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = '';
      }, { passive: true });
    });
  }

  // 4. View Transitions API Support for Smooth Cross-Fade
  function initViewTransitions() {
    if (!document.startViewTransition) return;

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]:not([target="_blank"]):not([download])');
      if (!link) return;
      const url = new URL(link.href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      e.preventDefault();
      document.startViewTransition(() => {
        window.location.href = link.href;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initInstantNavigation();
      initSpotlightCards();
      initAppleSpringTilt();
      initViewTransitions();
    });
  } else {
    initInstantNavigation();
    initSpotlightCards();
    initAppleSpringTilt();
    initViewTransitions();
  }

})(window, document);
