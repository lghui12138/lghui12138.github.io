(() => {
  'use strict';

  const ua = navigator.userAgent || '';
  const isSafari = /Safari/i.test(ua) && !/(Chrome|Chromium|CriOS|FxiOS|Edg|OPR)/i.test(ua);
  const isIos = /iPad|iPhone|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  document.documentElement.classList.toggle('is-safari', isSafari);
  document.documentElement.classList.toggle('is-ios-webkit', isIos);

  if (isIos) {
    document.addEventListener('touchstart', () => {}, { passive: true });
  }
})();
