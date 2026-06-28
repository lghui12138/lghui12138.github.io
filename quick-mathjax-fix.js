(function () {
  'use strict';

  function scheduleRender(delay) {
    window.setTimeout(() => {
      const render = window.FMRenderMathJaxNow || window.FMTypesetMath;
      if (typeof render !== 'function') return;
      Promise.resolve(render(document.body)).catch((error) => {
        console.warn('Quick MathJax compatibility render failed', error);
      });
    }, delay);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => scheduleRender(600), { once: true });
  } else {
    scheduleRender(600);
  }
  window.addEventListener('load', () => scheduleRender(1200), { once: true });
})();
