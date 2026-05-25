(() => {
  const SCRIPT_ID = 'MathJax-script';
  const SCRIPT_VERSION = 'round268-auth-redirect-practice-20260526';
  const SCRIPT_SRC = `/vendor/mathjax/es5/tex-chtml-full.js?v=${SCRIPT_VERSION}`;
  const FONT_URL = '/vendor/mathjax/es5/output/chtml/fonts/woff-v2';
  const LOAD_TIMEOUT_MS = 7000;
  let loadingPromise = null;
  let renderPromise = Promise.resolve();
  let queueHandle = 0;
  let queuedRoots = [];
  let queuedResolvers = [];
  let inflightRenders = [];

  function injectMathJaxQualityStyle() {
    if (document.getElementById('fm-mathjax-quality-style')) return;
    const style = document.createElement('style');
    style.id = 'fm-mathjax-quality-style';
    style.textContent = `
      mjx-container[jax="CHTML"] {
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        line-height: normal;
        vertical-align: middle;
        padding: 1px 2px;
        box-sizing: border-box;
        scrollbar-width: thin;
      }
      mjx-container[display="true"] {
        display: block;
        margin: .7rem 0;
        padding: .55rem .7rem;
        border: 1px solid rgba(20, 184, 166, .14);
        border-radius: 8px;
        background: linear-gradient(135deg, rgba(255,255,255,.9), rgba(236,253,245,.58));
        text-align: left;
      }
      mjx-container[display="true"] mjx-math {
        min-width: max-content;
      }
      .formula-main mjx-container[display="true"],
      .math-display mjx-container[display="true"] {
        margin: .45rem 0;
      }
      .formula-mathjax-pending .math-inline,
      .formula-mathjax-pending .math-display {
        color: #0f766e;
      }
      .formula-mathjax-failed .math-inline,
      .formula-mathjax-failed .math-display {
        white-space: normal;
        word-break: break-word;
      }
      @media (max-width: 680px) {
        mjx-container[display="true"] {
          font-size: 92%;
          padding: .5rem .55rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function markMathJaxState(state, error) {
    const root = document.documentElement;
    if (!root) return;
    root.classList.remove('formula-mathjax-pending', 'formula-mathjax-ready', 'formula-mathjax-failed');
    root.classList.add(state);
    if (state === 'formula-mathjax-failed') {
      root.dataset.mathjaxError = error?.message || 'load failed';
    } else {
      delete root.dataset.mathjaxError;
    }
  }

  function withTimeout(promise, ms, message) {
    let timer = 0;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  function mathJaxReady() {
    return !!window.MathJax?.typesetPromise;
  }

  function mathJaxScriptSrc(forceReload = false) {
    if (!forceReload) return SCRIPT_SRC;
    return `${SCRIPT_SRC}&retry=${Date.now().toString(36)}`;
  }

  function resetPartialMathJax(script) {
    if (script?.parentNode) script.parentNode.removeChild(script);
    if (!mathJaxReady()) {
      try {
        delete window.MathJax;
      } catch (_) {
        window.MathJax = undefined;
      }
    }
  }

  function configureMathJax() {
    injectMathJaxQualityStyle();
    if (mathJaxReady()) return window.MathJax;
    window.MathJax = {
      ...(window.MathJax || {}),
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true,
        packages: { '[+]': ['ams', 'boldsymbol', 'mathtools', 'physics', 'noerrors', 'noundefined'] }
      },
      chtml: {
        fontURL: FONT_URL
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
        ignoreHtmlClass: 'tex2jax_ignore',
        processHtmlClass: 'tex2jax_process',
        enableMenu: false
      },
      startup: {
        typeset: false
      }
    };
    return window.MathJax;
  }

  function loadMathJax() {
    injectMathJaxQualityStyle();
    if (mathJaxReady()) {
      markMathJaxState('formula-mathjax-ready');
      return Promise.resolve(window.MathJax);
    }
    if (loadingPromise) return loadingPromise;

    function assertLoaded(mj) {
      if (!mj?.typesetPromise) throw new Error('MathJax typesetPromise unavailable');
      markMathJaxState('formula-mathjax-ready');
      return mj;
    }

    function loadOnce(forceReload = false) {
      markMathJaxState('formula-mathjax-pending');
      configureMathJax();
      const existing = document.getElementById(SCRIPT_ID);
      if (existing && !forceReload) {
        return withTimeout(new Promise((resolve, reject) => {
          if (mathJaxReady()) {
            resolve(window.MathJax);
            return;
          }
          existing.addEventListener('load', () => resolve(window.MathJax), { once: true });
          existing.addEventListener('error', reject, { once: true });
        }), LOAD_TIMEOUT_MS, 'MathJax load timeout').then(assertLoaded);
      }

      if (forceReload && existing) resetPartialMathJax(existing);
      configureMathJax();
      return withTimeout(new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = mathJaxScriptSrc(forceReload);
        script.defer = true;
        script.dataset.fmMathjaxVersion = SCRIPT_VERSION;
        script.onload = () => resolve(window.MathJax);
        script.onerror = reject;
        document.head.appendChild(script);
      }), LOAD_TIMEOUT_MS, 'MathJax load timeout').then(assertLoaded);
    }

    markMathJaxState('formula-mathjax-pending');
    loadingPromise = loadOnce(false)
      .catch((firstError) => {
        if (mathJaxReady()) return window.MathJax;
        const existing = document.getElementById(SCRIPT_ID);
        resetPartialMathJax(existing);
        console.warn('MathJax 首次加载失败，正在使用强制刷新地址重试', firstError);
        return loadOnce(true);
      })
      .catch((error) => {
        markMathJaxState('formula-mathjax-failed', error);
        loadingPromise = null;
        throw error;
      });
    return loadingPromise;
  }

  function normalizeRoot(root) {
    if (!root || root === document) return document.body || document.documentElement;
    if (Array.isArray(root)) return root;
    return root;
  }

  function normalizeNodes(root) {
    const target = normalizeRoot(root);
    const nodes = Array.isArray(target) ? target : [target];
    return nodes.filter(Boolean).map((node) => (node === document ? document.body || document.documentElement : node));
  }

  function rootContains(root, node) {
    return root === node || root === document || (root?.contains && node?.nodeType && root.contains(node));
  }

  function rootsOverlap(a, b) {
    return rootContains(a, b) || rootContains(b, a);
  }

  function compactRoots(nodes) {
    const compacted = [];
    nodes.forEach((node) => {
      if (!node || (node.nodeType === Node.ELEMENT_NODE && !node.isConnected)) return;
      if (compacted.some((root) => rootContains(root, node))) return;
      for (let i = compacted.length - 1; i >= 0; i -= 1) {
        if (rootContains(node, compacted[i])) compacted.splice(i, 1);
      }
      compacted.push(node);
    });
    return compacted;
  }

  function inFlightFor(nodes) {
    const jobs = new Set();
    nodes.forEach((node) => {
      inflightRenders.forEach((entry) => {
        if (entry.nodes.some((root) => rootsOverlap(root, node))) jobs.add(entry.promise);
      });
    });
    return Array.from(jobs);
  }

  function markFallback(nodes) {
    nodes.forEach((node) => {
      if (node?.classList) node.classList.add('math-fallback');
    });
  }

  function typesetMath(root) {
    injectMathJaxQualityStyle();
    const nodes = compactRoots(normalizeNodes(root));
    if (!nodes.length) return Promise.resolve(null);

    const existingJobs = inFlightFor(nodes);
    const renderNodes = nodes.filter((node) => !inflightRenders.some((entry) => entry.nodes.some((root) => rootsOverlap(root, node))));
    if (!renderNodes.length) {
      return Promise.all(existingJobs)
        .then(() => typesetMath(nodes));
    }

    renderNodes.forEach((node) => node?.classList?.remove('math-fallback'));
    const job = renderPromise
      .catch(() => {})
      .then(() => loadMathJax())
      .then((mj) => {
        if (!mj?.typesetPromise) return null;
        if (mj.typesetClear) mj.typesetClear(renderNodes);
        return mj.typesetPromise(renderNodes);
      })
      .catch((error) => {
        markMathJaxState('formula-mathjax-failed', error);
        markFallback(renderNodes);
        console.warn('本地公式渲染失败', error);
      })
      .finally(() => {
        inflightRenders = inflightRenders.filter((entry) => entry.promise !== job);
      });

    inflightRenders.push({ nodes: renderNodes, promise: job });
    renderPromise = job;
    return existingJobs.length ? Promise.all([...existingJobs, job]).then(() => null) : job;
  }

  function queueMath(root, timeout = 180) {
    const nodes = normalizeNodes(root);
    if (!nodes.length) return Promise.resolve(null);
    queuedRoots.push(...nodes);
    const schedule = window.requestIdleCallback || ((fn, opts) => setTimeout(fn, opts?.timeout || timeout));
    return new Promise((resolve) => {
      queuedResolvers.push(resolve);
      if (queueHandle) return;
      queueHandle = schedule(() => {
        queueHandle = 0;
        const roots = compactRoots(queuedRoots);
        const resolvers = queuedResolvers;
        queuedRoots = [];
        queuedResolvers = [];
        const render = typesetMath(roots);
        resolvers.forEach((done) => done(render));
      }, { timeout });
    });
  }

  window.FMConfigureMathJax = configureMathJax;
  window.FMLoadMathJax = loadMathJax;
  window.FMTypesetMath = typesetMath;
  window.FMQueueMath = queueMath;
})();
