(() => {
  const LOCAL_MATHJAX_VERSION = 'round291-two-textbook-pdf-181103-source-coverage-20260613';
  const LOCAL_MATHJAX_PATH = '/js/core/local-mathjax.js';
  const LOCAL_MATHJAX_SRC = `${LOCAL_MATHJAX_PATH}?v=${LOCAL_MATHJAX_VERSION}`;
  const MATH_TARGET_SELECTOR = [
    '.formula-main',
    '.formula',
    '.formula-mini',
    '.formula-display',
    '.formula-text',
    '.derivation-step',
    '.physics-meaning',
    '.formula-explanation',
    '.math-inline',
    '.math-display',
    '.math',
    '.eflu-formula',
    '.efu-formula',
    '.mini-math',
    '.inline-formula',
    '.hero-equation',
    '.box',
    '.caption',
    '.question-text',
    '.explanation',
    '.card',
    '.topic-card',
    '.section-card',
    '.state-card',
    '.guide-card',
    '.chapter-panel',
    '.formula-panel',
    '.fcard',
    '.ns-equation-card',
    '.ns-role',
    '.blueprint',
    '.path-step'
  ].join(',');
  const TEX_PATTERN = /(\$\$|\\\(|\\\[|\\(?:frac|dfrac|tfrac|partial|nabla|rho|mu|sigma|tau|sqrt|vec|mathbf|boldsymbol|operatorname|mathrm|mathit|mathcal|overline|underline|bar|hat|dot|ddot|left|right|theta|Theta|pi|nu|varepsilon|epsilon|cdot|times|omega|phi|psi|varphi|alpha|beta|gamma|delta|Delta|Omega|lambda|eta|kappa|int|iint|iiint|oint|sum|prod|lim|max|min|sin|cos|tan|cot|ln|log|exp|infty|therefore|because|pm|mp|le|ge|leq|geq|lt|gt|approx|neq|equiv|sim|simeq|propto|to|rightarrow|leftarrow|Rightarrow|Leftarrow|begin|end)\b)/;
  const MATHJAX_LOAD_TIMEOUT_MS = 7000;
  let mathJaxBridgePromise = null;
  const rawTexRenderPromises = new WeakMap();
  let mutationObserver = null;
  let mutationScanTimer = 0;
  let pendingMathScanRoots = [];

  function countRawTexIn(target) {
    const text = target?.innerText || target?.textContent || '';
    return ((text.match(new RegExp(TEX_PATTERN.source, 'g')) || []).length);
  }

  function countMathErrorsIn(target) {
    return target?.querySelectorAll ? target.querySelectorAll('mjx-merror').length : 0;
  }

  const greek = {
    alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε',
    theta: 'θ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', rho: 'ρ',
    sigma: 'σ', tau: 'τ', phi: 'φ', psi: 'ψ', omega: 'ω', Gamma: 'Γ',
    Delta: 'Δ', Omega: 'Ω', kappa: 'κ', eta: 'η'
  };

  const superscript = {
    0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴',
    5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹',
    '+': '⁺', '-': '⁻'
  };

  const subscript = {
    0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄',
    5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉',
    i: 'ᵢ', j: 'ⱼ', x: 'ₓ', y: 'ᵧ', z: '𝓏'
  };

  function scriptDigits(value, table) {
    return String(value).split('').map(char => table[char] || char).join('');
  }

  function scriptSubscript(value) {
    const text = String(value);
    if (/^[0-9ijxyz+-]+$/.test(text)) {
      return scriptDigits(text, subscript);
    }
    return '_' + text;
  }

  function readGroup(text, start) {
    if (text[start] !== '{') return null;
    let depth = 0;
    for (let i = start; i < text.length; i += 1) {
      if (text[i] === '{') depth += 1;
      if (text[i] === '}') depth -= 1;
      if (depth === 0) {
        return { value: text.slice(start + 1, i), end: i + 1 };
      }
    }
    return null;
  }

  function replaceBalancedFractions(value) {
    const commands = ['\\dfrac', '\\tfrac', '\\frac'];
    const text = String(value);
    let output = '';
    let i = 0;

    while (i < text.length) {
      const command = commands.find(item => text.startsWith(item, i));
      if (!command) {
        output += text[i];
        i += 1;
        continue;
      }

      let cursor = i + command.length;
      while (/\s/.test(text[cursor] || '')) cursor += 1;
      const numerator = readGroup(text, cursor);
      if (!numerator) {
        output += text[i];
        i += 1;
        continue;
      }
      cursor = numerator.end;
      while (/\s/.test(text[cursor] || '')) cursor += 1;
      const denominator = readGroup(text, cursor);
      if (!denominator) {
        output += text[i];
        i += 1;
        continue;
      }

      output += `(${replaceBalancedFractions(numerator.value)})/(${replaceBalancedFractions(denominator.value)})`;
      i = denominator.end;
    }

    return output;
  }

  function stripCommandGroups(value) {
    let text = value;
    let prev = '';
    while (text !== prev) {
      prev = text;
      text = replaceBalancedFractions(text)
        .replace(/\\(?:mathbf|mathrm|boldsymbol|vec|text|operatorname)\{([^{}]+)\}/g, '$1')
        .replace(/\\(?:bar|overline)\{([^{}]+)\}/g, '$1̄')
        .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
    }
    return text;
  }

  function prettifyLatex(value) {
    let text = String(value || '').trim();
    if (!text) return text;

    text = text
      .replace(/\$\$|\$|\\\[|\\\]|\\\(|\\\)/g, '')
      .replace(/\\begin\{cases\}|\\end\{cases\}/g, '')
      .replace(/\\left\.|\\right\./g, '')
      .replace(/\\left|\\right/g, '')
      .replace(/\\(?:quad|qquad|,|;|:|!)/g, ' ')
      .replace(/&/g, ' ')
      .replace(/\\\\/g, ' ');

    text = stripCommandGroups(text);

    Object.entries(greek).forEach(([name, symbol]) => {
      text = text.replace(new RegExp('\\\\' + name + '\\b', 'g'), symbol);
    });

    text = text
      .replace(/\\nabla/g, '∇')
      .replace(/\\partial/g, '∂')
      .replace(/\\cdot/g, '·')
      .replace(/\\times/g, '×')
      .replace(/\\int/g, '∫')
      .replace(/\\oint/g, '∮')
      .replace(/\\sum/g, 'Σ')
      .replace(/\\infty/g, '∞')
      .replace(/\\therefore/g, '∴')
      .replace(/\\because/g, '∵')
      .replace(/\\rightarrow|\\to/g, '→')
      .replace(/\\Rightarrow/g, '⇒')
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\le\b/g, '≤')
      .replace(/\\ge\b/g, '≥')
      .replace(/\\ll/g, '≪')
      .replace(/\\lesssim/g, '≲')
      .replace(/\\gtrsim/g, '≳')
      .replace(/\\neq/g, '≠')
      .replace(/\\approx/g, '≈')
      .replace(/\\sim/g, '∼')
      .replace(/\\[a-zA-Z]+/g, '')
      .replace(/\^\{([^{}]+)\}/g, (_, part) => scriptDigits(part, superscript))
      .replace(/\^([0-9+-])/g, (_, part) => scriptDigits(part, superscript))
      .replace(/_\{([^{}]+)\}/g, (_, part) => scriptSubscript(part))
      .replace(/_([0-9ijxyz])/g, (_, part) => scriptDigits(part, subscript))
      .replace(/[{}]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return text;
  }

  function normalizeRoot(root) {
    if (!root || root === document) return document.body || document.documentElement;
    return root;
  }

  function normalizeScanRoot(root) {
    const target = normalizeRoot(root);
    if (!target) return null;
    if (target.nodeType === Node.TEXT_NODE) {
      return target.parentElement || target.parentNode || document.body || document.documentElement;
    }
    if (target.nodeType === Node.ELEMENT_NODE) {
      return target.closest?.(MATH_TARGET_SELECTOR) || target;
    }
    return target;
  }

  function rootContains(root, node) {
    return root === node || root === document || (root?.contains && node?.nodeType && root.contains(node));
  }

  function compactScanRoots(nodes) {
    const compacted = [];
    nodes.forEach((node) => {
      const target = normalizeScanRoot(node);
      if (!target || (target.nodeType === Node.ELEMENT_NODE && !target.isConnected)) return;
      if (compacted.some((root) => rootContains(root, target))) return;
      for (let i = compacted.length - 1; i >= 0; i -= 1) {
        if (rootContains(target, compacted[i])) compacted.splice(i, 1);
      }
      compacted.push(target);
    });
    return compacted;
  }

  function hasRawTex(root) {
    const target = normalizeRoot(root);
    if (!target) return false;
    if (target.nodeType === Node.TEXT_NODE) return TEX_PATTERN.test(target.textContent || '');
    const text = target.textContent || '';
    if (!TEX_PATTERN.test(text)) return false;
    if (!target.querySelectorAll) return true;
    const formulaNodes = target.matches && target.matches(MATH_TARGET_SELECTOR)
      ? [target]
      : Array.from(target.querySelectorAll(MATH_TARGET_SELECTOR));
    if (!formulaNodes.length) return TEX_PATTERN.test(text);
    return formulaNodes.some(element => TEX_PATTERN.test(element.textContent || ''));
  }

  function scriptPathname(script) {
    const src = script && script.getAttribute ? script.getAttribute('src') : '';
    if (!src) return '';
    try {
      return new URL(src, window.location.href).pathname;
    } catch (error) {
      return src;
    }
  }

  function bridgeReady() {
    return typeof window.FMQueueMath === 'function' || typeof window.FMTypesetMath === 'function';
  }

  function bridgeScriptSrc(forceReload = false) {
    if (!forceReload) return LOCAL_MATHJAX_SRC;
    return `${LOCAL_MATHJAX_SRC}&retry=${Date.now().toString(36)}`;
  }

  function resetBridgeScripts() {
    Array.from(document.scripts || [])
      .filter(script => scriptPathname(script) === LOCAL_MATHJAX_PATH)
      .forEach(script => {
        if (script?.parentNode) script.parentNode.removeChild(script);
      });
    if (!bridgeReady()) {
      try { delete window.FMConfigureMathJax; } catch (_) { window.FMConfigureMathJax = undefined; }
      try { delete window.FMLoadMathJax; } catch (_) { window.FMLoadMathJax = undefined; }
      try { delete window.FMTypesetMath; } catch (_) { window.FMTypesetMath = undefined; }
      try { delete window.FMQueueMath; } catch (_) { window.FMQueueMath = undefined; }
    }
  }

  function assertBridgeReady() {
    if (!bridgeReady()) throw new Error('local MathJax bridge unavailable after load');
    return window.MathJax || null;
  }

  function waitForBridgeScript(script) {
    return new Promise((resolve, reject) => {
      if (bridgeReady()) {
        resolve(window.MathJax || null);
        return;
      }
      const timer = setTimeout(() => {
        if (bridgeReady()) resolve(window.MathJax || null);
        else reject(new Error('local MathJax bridge timeout'));
      }, MATHJAX_LOAD_TIMEOUT_MS);
      script.addEventListener('load', () => {
        clearTimeout(timer);
        resolve(window.MathJax || null);
      }, { once: true });
      script.addEventListener('error', (error) => {
        clearTimeout(timer);
        reject(error);
      }, { once: true });
    }).then(assertBridgeReady);
  }

  function injectBridgeScript(forceReload = false) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = bridgeScriptSrc(forceReload);
      script.defer = true;
      script.dataset.formulaLiteMathjaxBridge = '1';
      script.dataset.formulaLiteMathjaxVersion = LOCAL_MATHJAX_VERSION;
      const timer = setTimeout(() => reject(new Error('local MathJax bridge timeout')), MATHJAX_LOAD_TIMEOUT_MS);
      script.onerror = (error) => {
        clearTimeout(timer);
        reject(error);
      };
      script.onload = () => {
        clearTimeout(timer);
        resolve(window.MathJax || null);
      };
      document.head.appendChild(script);
    }).then(assertBridgeReady);
  }

  function loadLocalMathJax() {
    if (bridgeReady()) {
      return Promise.resolve(window.MathJax || null);
    }
    if (mathJaxBridgePromise) return mathJaxBridgePromise;

    const existing = Array.from(document.scripts || []).find(script => scriptPathname(script) === LOCAL_MATHJAX_PATH);
    mathJaxBridgePromise = (existing ? waitForBridgeScript(existing) : injectBridgeScript(false))
      .catch((firstError) => {
        if (bridgeReady()) return window.MathJax || null;
        resetBridgeScripts();
        console.warn('公式桥首次加载失败，正在使用强制刷新地址重试', firstError);
        return injectBridgeScript(true);
      })
      .catch((error) => {
        mathJaxBridgePromise = null;
        throw error;
      });
    return mathJaxBridgePromise;
  }

  function queueMath(root) {
    const target = normalizeRoot(root);
    if (typeof window.FMQueueMath === 'function') return window.FMQueueMath(target, 80);
    if (typeof window.FMTypesetMath === 'function') return window.FMTypesetMath(target);
    if (window.MathJax?.typesetPromise) return window.MathJax.typesetPromise([target]);
    return null;
  }

  function ensureMathJaxForRawTex(root) {
    const target = normalizeRoot(root);
    if (!hasRawTex(target)) return Promise.resolve(false);
    const existing = rawTexRenderPromises.get(target);
    if (existing) return existing;
    document.documentElement.classList.add('formula-mathjax-pending');
    target.classList?.remove('math-fallback');
    const renderPromise = loadLocalMathJax()
      .then(() => {
        const render = queueMath(target);
        if (!render) throw new Error('local MathJax renderer unavailable');
        return render;
      })
      .then(() => {
        if (document.documentElement.classList.contains('formula-mathjax-failed') || target.classList?.contains('math-fallback')) {
          throw new Error('local MathJax render failed');
        }
        document.documentElement.classList.remove('formula-mathjax-pending', 'formula-mathjax-failed');
        document.documentElement.classList.add('formula-mathjax-ready');
        document.documentElement.classList.add('formula-lite-ready');
        target.classList?.remove('math-fallback');
        window.__FM_MATH_DIAGNOSTICS__ = {
          ...(window.__FM_MATH_DIAGNOSTICS__ || {}),
          state: countMathErrorsIn(target) > 0 ? 'merror' : (countRawTexIn(target) > 0 ? 'raw-tex' : 'ready'),
          lastRoot: target.id || target.className || target.nodeName || 'formula-lite',
          rawTexCount: countRawTexIn(target),
          merrorCount: countMathErrorsIn(target),
          lastError: '',
          updatedAt: new Date().toISOString()
        };
        return true;
      })
      .catch((error) => {
        document.documentElement.classList.remove('formula-mathjax-pending', 'formula-mathjax-ready');
        document.documentElement.classList.add('formula-mathjax-failed');
        target.classList?.add('math-fallback');
        window.__FM_MATH_DIAGNOSTICS__ = {
          ...(window.__FM_MATH_DIAGNOSTICS__ || {}),
          state: 'failed',
          lastRoot: target.id || target.className || target.nodeName || 'formula-lite',
          rawTexCount: countRawTexIn(target),
          merrorCount: countMathErrorsIn(target),
          lastError: error?.message || 'formula-lite render failed',
          updatedAt: new Date().toISOString()
        };
        console.warn('公式 MathJax 加载失败，保留原始 TeX 以免公式被误改写', error);
        return false;
      })
      .finally(() => {
        rawTexRenderPromises.delete(target);
      });
    rawTexRenderPromises.set(target, renderPromise);
    return renderPromise;
  }

  function nodeMayContainTex(node) {
    if (!node) return false;
    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (parent?.closest?.('script,style,noscript,textarea,pre,mjx-container')) return false;
      return TEX_PATTERN.test(node.textContent || '');
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return false;
    if (node.matches?.('script,style,noscript,textarea,pre,mjx-container')) return false;
    if (node.closest?.('mjx-container')) return false;
    const text = node.textContent || '';
    return TEX_PATTERN.test(text);
  }

  function scheduleMathScan(root) {
    const target = normalizeScanRoot(root);
    if (!target) return;
    pendingMathScanRoots.push(target);
    clearTimeout(mutationScanTimer);
    mutationScanTimer = setTimeout(() => {
      mutationScanTimer = 0;
      const roots = compactScanRoots(pendingMathScanRoots);
      pendingMathScanRoots = [];
      roots.forEach((scanRoot) => {
        if (hasRawTex(scanRoot)) ensureMathJaxForRawTex(scanRoot);
      });
    }, 140);
  }

  function installMutationObserver() {
    const root = document.body || document.documentElement;
    if (!root || mutationObserver) return;
    mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData' && nodeMayContainTex(mutation.target)) {
          scheduleMathScan(mutation.target.parentElement || mutation.target.parentNode || root);
          continue;
        }
        for (const node of mutation.addedNodes || []) {
          if (nodeMayContainTex(node)) {
            scheduleMathScan(node);
          }
        }
      }
    });
    mutationObserver.observe(root, { childList: true, subtree: true, characterData: true });
  }

  function beautifyFormulas(root, options = {}) {
    const target = normalizeRoot(root);
    if (!target) return;
    if (!options.forceFallback && hasRawTex(target)) {
      ensureMathJaxForRawTex(target);
      document.documentElement.classList.add('formula-lite-ready');
      return;
    }

    const elements = target.matches && target.matches(MATH_TARGET_SELECTOR)
      ? [target]
      : Array.from(target.querySelectorAll ? target.querySelectorAll(MATH_TARGET_SELECTOR) : []);

    elements.forEach(element => {
      const raw = element.textContent;
      const pretty = prettifyLatex(raw);
      if (pretty && pretty !== raw) {
        element.textContent = pretty;
      }
    });

    document.documentElement.classList.add('formula-lite-ready');
  }

  function injectStyle() {
    if (document.getElementById('formula-lite-style')) return;
    if (!document.querySelector('.ultimate-formula-container, .advanced-formula-container, .knowledge-section')) return;
    const style = document.createElement('style');
    style.id = 'formula-lite-style';
    style.textContent = `
      html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
      body {
        background: linear-gradient(180deg, #fbfcfe 0%, #f4f8fb 48%, #edf7f4 100%) !important;
        background-size: auto !important;
        animation: none !important;
        letter-spacing: 0 !important;
        color: #14202b !important;
      }
      .particles, .particle, i[class^="fa"], i[class*=" fa-"] { display: none !important; }
      .container { width: min(1180px, calc(100% - 32px)); padding: 28px 0 54px !important; }
      .header,
      .topic-card,
      .category-section,
      .advanced-formula-container,
      .knowledge-section,
      .concept-card,
      .ultimate-formula-container,
      .formula-display,
      .formula-derivation,
      .formula-physics,
      .nav-btn,
      .tag,
      .formula-category {
        border-radius: 8px !important;
      }
      .header,
      .topic-card,
      .category-section,
      .advanced-formula-container,
      .knowledge-section,
      .concept-card,
      .ultimate-formula-container {
        border: 1px solid rgba(20, 31, 43, .11) !important;
        box-shadow: 0 10px 28px rgba(17, 31, 45, .07) !important;
        background: rgba(255, 255, 255, .92) !important;
        backdrop-filter: none !important;
        transform: none !important;
        animation: none !important;
        transition: border-color .18s cubic-bezier(.2,.8,.2,1), box-shadow .18s cubic-bezier(.2,.8,.2,1) !important;
        contain: content;
      }
      .header::before,
      .topic-card::before,
      .category-section::before,
      .advanced-formula-container::before,
      .knowledge-section::before,
      .concept-card::before,
      .ultimate-formula-container::before,
      .formula-display::before,
      .formula-derivation::before,
      .formula-physics::before {
        display: none !important;
      }
      .header h1,
      .section-title,
      .category-title,
      .concept-title,
      .topic-card h2,
      .formula-title {
        color: #14202b !important;
        background: none !important;
        -webkit-text-fill-color: currentColor !important;
        text-shadow: none !important;
        letter-spacing: 0 !important;
      }
      .header h1 { font-size: 42px !important; line-height: 1.06 !important; }
      .header p,
      .concept-description,
      .topic-card p {
        color: #667584 !important;
        line-height: 1.7 !important;
      }
      .info-box,
      .application-example {
        background: rgba(255, 255, 255, .72) !important;
        border: 1px solid rgba(20, 31, 43, .1) !important;
        border-left: 3px solid #14b8a6 !important;
        border-radius: 8px !important;
      }
      .info-title,
      .example-title {
        color: #0f766e !important;
      }
      .info-content,
      .application-example,
      .application-example p {
        color: #3d4d5c !important;
      }
      .formulas-grid {
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr)) !important;
        gap: 18px !important;
      }
      .formula-header {
        gap: 14px !important;
        align-items: flex-start !important;
      }
      .formula-category,
      .tag {
        background: rgba(20, 184, 166, .1) !important;
        color: #0f766e !important;
        border: 1px solid rgba(20, 184, 166, .16) !important;
      }
      .formula-display {
        background: linear-gradient(135deg, rgba(255,255,255,.9), rgba(239,248,248,.82)) !important;
        border: 1px solid rgba(20,184,166,.16) !important;
        box-shadow: none !important;
      }
      .formula-main {
        color: #101927 !important;
        font-family: "Times New Roman", Georgia, serif !important;
        font-size: 28px !important;
        line-height: 1.22 !important;
        white-space: normal !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        max-width: 100% !important;
        min-width: 0 !important;
        -webkit-overflow-scrolling: touch;
        scrollbar-gutter: stable both-edges;
        overscroll-behavior-inline: contain;
        text-shadow: none !important;
      }
      .formula,
      .formula-mini,
      .math-display,
      .math-inline {
        max-width: 100% !important;
        min-width: 0 !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        overscroll-behavior-inline: contain;
      }
      .formula-main mjx-container[jax="CHTML"],
      .formula mjx-container[jax="CHTML"],
      .formula-mini mjx-container[jax="CHTML"],
      .math-display mjx-container[jax="CHTML"],
      .math-inline mjx-container[jax="CHTML"] {
        display: inline-block;
        width: max-content;
        min-width: max-content;
        max-width: none;
        overflow: visible;
        padding: 2px 0;
      }
      .derivation-step,
      .physics-meaning,
      .formula-explanation {
        max-width: 100%;
        min-width: 0;
        overflow-wrap: anywhere !important;
      }
      html.formula-mathjax-failed .formula-main,
      html.formula-mathjax-failed .math-display,
      .math-fallback .formula-main,
      .math-fallback .math-display {
        white-space: pre-wrap !important;
        word-break: break-word !important;
      }
      .formula-derivation,
      .derivation-steps,
      .formula-physics {
        background: rgba(255,255,255,.68) !important;
        border: 1px solid rgba(20,31,43,.11) !important;
        box-shadow: none !important;
      }
      .derivation-title,
      .physics-title {
        color: #14202b !important;
      }
      .derivation-step,
      .physics-meaning {
        color: #344253 !important;
      }
      .derivation-step {
        border-bottom-color: rgba(20,31,43,.08) !important;
      }
      .nav-btn,
      .nav-button {
        min-height: 38px !important;
        padding: 10px 14px !important;
        background: linear-gradient(135deg, #0a84ff, #14b8a6) !important;
        box-shadow: 0 10px 22px rgba(10,132,255,.16) !important;
        transform: none !important;
        color: #fff !important;
      }
      @media (hover: hover) and (pointer: fine) {
        .nav-btn:hover,
        .nav-button:hover,
        .advanced-formula-container:hover,
        .knowledge-section:hover,
        .concept-card:hover,
        .ultimate-formula-container:hover,
        .topic-card:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 12px 28px rgba(17,31,45,.1) !important;
        }
      }
      @media (max-width: 768px) {
        .container { width: min(100% - 20px, 1180px); padding-top: 16px !important; }
        .header,
        .topic-card,
        .category-section,
        .advanced-formula-container,
        .knowledge-section,
        .concept-card,
        .ultimate-formula-container { padding: 22px !important; margin: 14px 0 !important; }
        .header h1 { font-size: 31px !important; }
        .formula-main { font-size: 23px !important; }
        .formula-header { flex-direction: column !important; }
      }
      @media (max-width: 430px) {
        .formula-display { padding: 18px 12px !important; }
        .formula-main { font-size: 21px !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    injectStyle();
    if (hasRawTex(document.body || document.documentElement)) {
      ensureMathJaxForRawTex(document.body || document.documentElement);
    } else {
      beautifyFormulas(document.body || document.documentElement, { forceFallback: true });
    }
    installMutationObserver();
  }

  window.FMFormulaLite = {
    refresh: beautifyFormulas,
    prettify: prettifyLatex,
    hasRawTex,
    ensureMathJax: ensureMathJaxForRawTex
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
