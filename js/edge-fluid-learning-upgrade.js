/**
 * Edge Fluid Learning Upgrade
 * round342-learning-discovery-routes-20260615: student discovery routes for 181103, real exams, formulas, wrongbook, and private courses
 * learning interaction and knowledge navigation enhancement.
 *
 * No framework, no HTML edits required. The script mounts into
 * #edge-fluid-upgrade-root when it is a script-owned mount, otherwise it creates a root in the
 * authenticated home container or the nearest main/container element.
 */
(function(global, document) {
  'use strict';

  var VERSION = 'round342-learning-discovery-routes-20260615-eflu-discovery';
  var R247_VERSION = 'round247-real-exam-pdf-fidelity-audit-20260518';
  var R247_AUDIT_URL_PARTS = ['fluid-real-exam-pdf-fidelity-audit', 'json'];
  var R263_VERSION = 'round263-fluid-exam-route-map-20260522';
  var R263_ROUTE_URL = '/data/fluid-round263-exam-route-map.json';
  var R264_VERSION = 'round264-formula-condition-checklist-20260522';
  var LEARNING_CONTENT_VERSION = R264_VERSION;
  var R264_FORMULA_CHECKLIST_URL = '/data/fluid-round264-formula-condition-checklist.json';
  var ROADMAP100_VERSION = 'round380-server-progress-persistence-20260617';
  var ROADMAP100_URL = '/data/fluid-upgrade-roadmap-100.json';
  var R278_VERSION = 'round279-real-exam-source-granularity-20260612';
  var R278_YEAR_COMPARE_URL = '/data/fluid-round278-pdf-web-year-compare.json';
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
  var ROOT_ID = 'edge-fluid-upgrade-root';
  var STYLE_ID = 'edge-fluid-learning-upgrade-style';
  var STATE_KEY = 'edge_fluid_learning_upgrade_state_v1';
  var EVENT_KEY = 'edge_fluid_learning_upgrade_events_v1';
  var LAST_LINK_KEY = 'edge_fluid_learning_last_link_v1';
  var MAX_EVENTS = 400;
  var MAX_REVIEWS = 240;
  var TAB_HASHES = {
    dashboard: '#dashboard',
    path: '#path',
    'exam-route': '#exam-route',
    formulas: '#formulas',
    'formula-checklist': '#formula-checklist',
    search: '#search',
    review: '#review'
  };
  var TAB_ORDER = ['dashboard', 'path', 'exam-route', 'formulas', 'formula-checklist', 'search', 'review'];
  var round247AuditPromise = null;
  var round247Observer = null;

  var DATA_URLS = {
    knowledge: '/data/fluid-knowledge-points.json',
    search: '/data/fluid-home-search-index.json',
    formulas: '/data/fluid-formula-index.json',
    reviewPlan: '/data/fluid-review-plan.json',
    remediation: '/data/fluid-knowledge-remediation.json',
    examRouteMap: R263_ROUTE_URL,
    formulaConditionChecklist: R264_FORMULA_CHECKLIST_URL
  };

  var UPGRADE_URLS = [
    '/data/fluid-knowledge-upgrade-2026.json',
    '/data/fluid-knowledge-upgrade.json',
    '/data/fluid-learning-upgrade.json',
    '/data/fluid-knowledge-points-upgrade.json'
  ];

  var DISCOVERY_LINKS = [
    {
      id: 'round342-181103',
      type: '入口',
      title: '181103 资料题库与 HTML 总表',
      desc: '522 道资料内题、68 个真题复核任务、38/38 份站内 HTML 资料正文。',
      keywords: '181103 181103资料 资料题库 522资料内题 68真题复核 38/38 HTML 站内阅读',
      url: '/modules/question-bank.html?focus=181103-material-extracted#questionBanksList'
    },
    {
      id: 'round342-real-exam',
      type: '入口',
      title: '历年真题新版',
      desc: '2000-2024 历年真题，325 原文小题和 68 个已拆组题 section。',
      keywords: '历年真题 真题新版 325原文小题 68组题 803流体力学',
      url: '/modules/real-exams-dynamic.html?edge_refresh=round380-server-progress-persistence-20260617&from=round342-edge-search'
    },
    {
      id: 'round342-formula',
      type: '入口',
      title: '公式回查与适用条件',
      desc: '先核适用条件、边界条件、单位方向和常见错因，再重做同类真题。',
      keywords: '公式 公式回查 适用条件 边界条件 单位方向 常见错因',
      url: '/index-complete.html#formula-checklist'
    },
    {
      id: 'round342-wrongbook',
      type: '入口',
      title: '错题订正与错因复盘',
      desc: '进入错题本、收藏和笔记；按错因订正后重做同类题。',
      keywords: '错题 错题本 错题订正 错因复盘 复习错题 收藏 笔记',
      url: '/index-complete.html#tabsW'
    },
    {
      id: 'round342-private-course',
      type: '入口',
      title: '私有课程 / 专属课状态',
      desc: '查看账号课程状态；生产私有视频恢复仍以 FM_PRIVATE_MEDIA R2 binding 为边界。',
      keywords: '私有课程 专属课 私有视频 账号状态 FM_PRIVATE_MEDIA R2 blocker',
      url: '/resources.html?from=round342-edge-search-private-course#sourceStatus'
    }
  ];

  var FALLBACK_FORMULAS = [
    {
      id: 'fallback-navier-stokes',
      title: 'Navier-Stokes 方程',
      formula: '\\rho\\left(\\frac{\\partial \\mathbf{u}}{\\partial t}+\\mathbf{u}\\cdot\\nabla\\mathbf{u}\\right)=-\\nabla p+\\mu\\nabla^2\\mathbf{u}+\\rho\\mathbf{f}',
      category: '控制方程与理想流体',
      pointTitle: '动量守恒主线',
      keywords: ['N-S', '动量方程', '黏性项']
    },
    {
      id: 'fallback-continuity',
      title: '连续方程',
      formula: '\\frac{\\partial \\rho}{\\partial t}+\\nabla\\cdot(\\rho\\mathbf{u})=0',
      category: '基础运动学',
      pointTitle: '质量守恒',
      keywords: ['连续方程', '不可压', '散度']
    },
    {
      id: 'fallback-bernoulli',
      title: 'Bernoulli 方程',
      formula: 'p+\\frac{1}{2}\\rho v^2+\\rho gh=\\mathrm{const}',
      category: '控制方程与理想流体',
      pointTitle: '理想流体能量积分',
      keywords: ['Bernoulli', '能量', '势流']
    },
    {
      id: 'fallback-vorticity',
      title: '涡量定义',
      formula: '\\boldsymbol{\\omega}=\\nabla\\times\\mathbf{u}',
      category: '基础运动学',
      pointTitle: '局部旋转强度',
      keywords: ['涡量', '旋度', '环量']
    },
    {
      id: 'fallback-reynolds',
      title: 'Reynolds 数',
      formula: 'Re=\\frac{\\rho U L}{\\mu}=\\frac{UL}{\\nu}',
      category: '量纲相似与实验',
      pointTitle: '惯性力与黏性力比值',
      keywords: ['Re', '相似', '边界层']
    }
  ];

  var FALLBACK_FORMULA_CHECKLIST = [
    {
      id: 'checklist-continuity',
      formulaId: 'fallback-continuity',
      title: '连续方程',
      formula: '\\frac{\\partial \\rho}{\\partial t}+\\nabla\\cdot(\\rho\\mathbf{u})=0',
      category: '质量守恒',
      applyConditions: ['题目在问流量、速度、截面或密度随时间变化时，先从质量守恒落笔。', '不可压流体可以把密度约掉，但这一步要写出题干依据。'],
      boundaryConditions: ['入口、出口和控制面的外法向要先定好。', '稳态管流常把同一截面速度看成平均速度，点速度题不能直接这样做。'],
      unitDirections: ['质量流量单位是 kg/s，体积流量单位是 m^3/s。', '通量符号跟外法向有关，流入项和流出项不要混在一个方向里。'],
      commonMistakes: ['把质量流量和体积流量混用。', '看到“不可压”就忘了检查截面平均速度的定义。'],
      remedialTraining: ['画一个两进一出的控制体，逐项标出 rho、A、v 和外法向。', '做 2 道截面变化题，只练单位换算和方向符号。'],
      teacherNote: '连续方程不是背式子，是先把“进来多少、出去多少、里面变多少”说清楚。'
    },
    {
      id: 'checklist-bernoulli',
      formulaId: 'fallback-bernoulli',
      title: 'Bernoulli 方程',
      formula: 'p+\\frac{1}{2}\\rho v^2+\\rho gh=\\mathrm{const}',
      category: '能量方程',
      applyConditions: ['同一条流线或满足可作整体能量方程处理的管路。', '无明显黏性损失时用基本式；有管路损失、泵或水轮机时必须补项。'],
      boundaryConditions: ['两个断面、基准面和压强零点要先写。', '自由面能不能取大气压、速度能不能忽略，都要看题干尺度。'],
      unitDirections: ['压强式单位是 Pa，水头式单位是 m，两者相差 rho g。', '高度项正负由基准面决定，不要凭图形高低随手改号。'],
      commonMistakes: ['漏掉沿程损失或局部损失。', '把表压、绝压和大气压混在同一行。'],
      remedialTraining: ['每题先画能量线和基准线，再代数。', '把同一道题分别写成压强式和水头式，专门核对单位。'],
      teacherNote: '伯努利题先问“哪两个断面、有没有损失”，再谈代公式。'
    },
    {
      id: 'checklist-reynolds',
      formulaId: 'fallback-reynolds',
      title: 'Reynolds 数',
      formula: 'Re=\\frac{\\rho U L}{\\mu}=\\frac{UL}{\\nu}',
      category: '量纲相似',
      applyConditions: ['判断惯性力和黏性力谁占主导，或做模型相似时使用。', '特征速度 U 和特征长度 L 必须和题目对象对应。'],
      boundaryConditions: ['管流常取管径，绕流常取物体特征尺度；不要把不同题型的 L 套用。', '温度改变时，黏度和运动黏度可能跟着变。'],
      unitDirections: ['mu 用 Pa·s，nu 用 m^2/s，二者不能同放一个式子里。', 'Re 没有单位；算出有单位，说明量纲没有约干净。'],
      commonMistakes: ['把动力黏度和运动黏度混用。', '缩尺实验只保 Re，却忘了速度比例会被迫改变。'],
      remedialTraining: ['列 3 个场景，分别写 U 和 L 取什么。', '做一组模型/原型换算，只检查无量纲数是否一致。'],
      teacherNote: 'Re 数先定尺度，再代数；尺度选错，后面算得再工整也会偏。'
    }
  ];

  var ICONS = {
    dashboard: '<path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z"/>',
    route: '<path d="M6 3v6a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v4"/><circle cx="6" cy="3" r="2"/><circle cx="18" cy="21" r="2"/>',
    sigma: '<path d="M18 7V4H6l6 8-6 8h12v-3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
    review: '<path d="M4 4h16v12H7l-3 3V4Z"/><path d="M8 8h8M8 12h5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="m18 6-12 12M6 6l12 12"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    external: '<path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
    bookmark: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z"/>',
    alert: '<path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    refresh: '<path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 21v-5h5"/><path d="M3 12A9 9 0 0 1 18.3 5.6L21 8"/><path d="M21 3v5h-5"/>',
    chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-3"/>',
    note: '<path d="M5 3h10l4 4v14H5V3Z"/><path d="M15 3v5h5"/><path d="M8 13h8M8 17h6"/>'
  };

  var DATA = {
    loaded: false,
    loadErrors: [],
    visibilityIssues: [],
    routeMapStatus: 'pending',
    upgradeStatus: 'pending',
    upgrade: null,
    roadmap100: null,
    roadmapStatus: 'pending',
    round278PdfWebYearCompare: null,
    round278Status: 'pending',
    knowledge: [],
    categories: [],
    searchEntries: [],
    searchStatus: 'pending',
    formulas: [],
    formulaStatus: 'pending',
    formulaConditionChecklist: null,
    formulaChecklist: [],
    formulaChecklistStatus: 'pending',
    reviewPlan: null,
    remediation: null,
    reviewSupportStatus: 'pending',
    examRouteMap: null,
    examRoutes: [],
    paths: [],
    generatedAt: ''
  };

  var VIEW = {
    tab: 'dashboard',
    pathCategory: 'all',
    pathId: '',
    formulaCategory: 'all',
    siteQuery: '',
    formulaQuery: '',
    formulaChecklistQuery: '',
    formulaChecklistCategory: 'all',
    selectedFormulaChecklist: '',
    examClue: '控制体 弯管 受力',
    selectedExamRoute: '',
    listLimit: 18
  };

  var mountNode = null;
  var initialized = false;
  var loadPromise = null;
  var supplementalPromises = {};
  var fetchJSONInflight = {};
  var memoryState = defaultState();

  function icon(name, label) {
    var path = ICONS[name] || ICONS.dashboard;
    var aria = label ? ' aria-label="' + esc(label) + '"' : ' aria-hidden="true"';
    return '<svg class="eflu-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"' + aria + '>' + path + '</svg>';
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
    });
  }

  function attr(value) {
    return esc(value).replace(/`/g, '&#96;');
  }

  var TEX_FORMULA_PATTERN = /(?:\$\$|\\\(|\\\[|\\(?:frac|dfrac|tfrac|partial|nabla|rho|mu|sigma|tau|sqrt|vec|mathbf|boldsymbol|operatorname|mathrm|mathit|mathcal|overline|underline|bar|hat|dot|ddot|left|right|theta|Theta|pi|nu|varepsilon|epsilon|cdot|times|omega|phi|psi|varphi|alpha|beta|gamma|delta|Delta|Omega|lambda|eta|kappa|int|iint|iiint|oint|sum|prod|lim|max|min|sin|cos|tan|cot|ln|log|exp|infty|therefore|because|pm|mp|le|ge|leq|geq|lt|gt|approx|neq|equiv|sim|simeq|propto|to|rightarrow|leftarrow|Rightarrow|Leftarrow|begin|end)\b)/;
  var WRAPPED_MATH_PATTERN = /^\s*(?:\$\$[\s\S]*\$\$|\\\[[\s\S]*\\\]|\\\([\s\S]*\\\)|\$[^$]+\$)\s*$/;

  function shouldRenderFormulaMath(value) {
    var text = String(value == null ? '' : value).trim();
    if (!text) return false;
    if (TEX_FORMULA_PATTERN.test(text) || WRAPPED_MATH_PATTERN.test(text)) return true;
    return /[∂∇ρμνφψθωΓΩ_^{}\\]/.test(text) && /[=+\-*/∂∇_^\\]/.test(text);
  }

  function normalizeFormulaTex(value) {
    var text = String(value == null ? '' : value).trim();
    if (!text || !shouldRenderFormulaMath(text) || WRAPPED_MATH_PATTERN.test(text)) return text;
    return '\\[' + text + '\\]';
  }

  function renderFormulaBlock(value) {
    var raw = String(value == null ? '' : value).trim();
    if (!raw) return '';
    var classes = shouldRenderFormulaMath(raw) ? 'eflu-formula math-display tex2jax_process' : 'eflu-formula';
    return '<div class="' + classes + '">' + esc(normalizeFormulaTex(raw)) + '</div>';
  }

  function clamp(num, min, max) {
    num = Number(num) || 0;
    return Math.max(min, Math.min(max, num));
  }

  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function listFrom(value) {
    if (Array.isArray(value)) return value;
    if (value == null) return [];
    if (typeof value === 'string' || typeof value === 'number') return [value];
    return [];
  }

  function unique(list) {
    var seen = Object.create(null);
    return toArray(list).filter(function(item) {
      var key = String(item || '').trim();
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function normalizeText(value) {
    return String(value == null ? '' : value)
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function chapterNumber(value) {
    var match = String(value == null ? '' : value).match(/\d+/);
    return match ? match[0] : '';
  }

  function chapterPracticeUrl(chapter) {
    return '/modules/practice-dynamic.html?type=real&chapter=' + encodeURIComponent(chapter) + '&mode=normal&from=edge-learning-workbench';
  }

  function chapterRealExamUrl(chapter) {
    return '/modules/real-exams-dynamic.html?chapter=' + encodeURIComponent(chapter) + '&from=edge-learning-workbench';
  }

  function chapterKnowledgeUrl(chapter) {
    return '/modules/knowledge-detail.html?chapter=' + encodeURIComponent(chapter);
  }

  function normalizeTab(tab) {
    tab = String(tab || '').replace(/^#/, '').toLowerCase();
    if (tab === 'route' || tab === 'knowledge-path') return 'path';
    if (tab === 'formula' || tab === 'formula-search') return 'formulas';
    if (tab === 'round264formulachecklist' || tab === 'round264-formula-checklist' || tab === 'formula-conditions' || tab === 'formula-condition' || tab === 'formula-condition-checklist' || tab === 'condition-checklist' || tab === 'checklist') return 'formula-checklist';
    if (tab === 'exam' || tab === 'exam-route-map' || tab === 'fluid-exam-route-map' || tab === 'round263routemap' || tab === 'round263-route-map' || tab === 'round263-route' || tab === 'topic-route') return 'exam-route';
    return TAB_HASHES[tab] ? tab : 'dashboard';
  }

  function tabFromHash(hash) {
    var tab = normalizeTab(String(hash || '').replace(/^#/, ''));
    return tab === 'dashboard' && hash && !/^#?dashboard$/i.test(String(hash)) ? '' : tab;
  }

  function updateTabHash(tab) {
    var hash = TAB_HASHES[normalizeTab(tab)];
    if (!hash || !global.location || global.location.hash === hash) return;
    try {
      if (global.history && typeof global.history.replaceState === 'function') {
        global.history.replaceState(null, '', global.location.pathname + global.location.search + hash);
      } else {
        global.location.hash = hash;
      }
    } catch (_) {}
  }

  function tabPanelId(tab) {
    return 'eflu-panel-' + normalizeTab(tab);
  }

  function setActiveTab(tab, syncHash) {
    VIEW.tab = normalizeTab(tab);
    if (syncHash !== false) updateTabHash(VIEW.tab);
    ensureTabData(VIEW.tab);
  }

  function focusTabButton(tab) {
    if (!mountNode) return;
    var target = mountNode.querySelector('.eflu-tab[role="tab"][data-tab="' + normalizeTab(tab) + '"]');
    if (!target || typeof target.focus !== 'function') return;
    try {
      target.focus({ preventScroll: true });
    } catch (_) {
      target.focus();
    }
    try {
      if (typeof target.scrollIntoView === 'function') target.scrollIntoView({ block: 'nearest', inline: 'center' });
    } catch (_) {}
  }

  function syncTabFromLocation() {
    var tab = tabFromHash(global.location && global.location.hash);
    if (!tab) return false;
    VIEW.tab = tab;
    return true;
  }

  function now() {
    return Date.now();
  }

  function daysFromNow(timestamp) {
    if (!timestamp) return 0;
    return Math.ceil((timestamp - now()) / 86400000);
  }

  function markRound241() {
    try {
      document.documentElement.setAttribute('data-round241-human-teacher-upgrade', '1');
      document.documentElement.setAttribute('data-edge-human-teacher-version', VERSION);
      document.documentElement.setAttribute('data-current-entry-version', VERSION);
      document.documentElement.setAttribute('data-learning-content-version', LEARNING_CONTENT_VERSION);
    } catch (_) {}
  }

  function formatDate(timestamp) {
    try {
      var d = new Date(timestamp);
      if (!Number.isFinite(d.getTime())) return '未安排';
      return String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    } catch (_) {
      return '未安排';
    }
  }

  function readJSON(key, fallback) {
    try {
      var raw = global.localStorage && global.localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      if (fallback && typeof fallback === 'object' && !Array.isArray(fallback) &&
          (parsed == null || typeof parsed !== 'object' || Array.isArray(parsed))) return fallback;
      return parsed;
    } catch (_) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      global.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      try {
        var events = readJSON(EVENT_KEY, []);
        if (Array.isArray(events) && events.length > 60) {
          global.localStorage.setItem(EVENT_KEY, JSON.stringify(events.slice(-60)));
        }
        global.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (_) {
        memoryState = value && value.users ? value : memoryState;
        return false;
      }
    }
  }

  function defaultState() {
    return {
      version: 1,
      updatedAt: 0,
      users: {}
    };
  }

  function currentUserKey() {
    try {
      if (global.FMSecurity && typeof global.FMSecurity.getUser === 'function') {
        var user = global.FMSecurity.getUser();
        if (user && (user.username || user.name)) return String(user.username || user.name);
      }
    } catch (_) {}
    try {
      var local = readJSON('fluidMechanicsUser', null);
      if (local && (local.username || local.name)) return String(local.username || local.name);
    } catch (_) {}
    return '_anon';
  }

  function userLabel() {
    try {
      if (global.FMSecurity && typeof global.FMSecurity.getUser === 'function') {
        var user = global.FMSecurity.getUser();
        if (user && (user.name || user.username)) return String(user.name || user.username);
      }
    } catch (_) {}
    return '同学';
  }

  function loadLocalState() {
    var state = readJSON(STATE_KEY, null);
    if (!state || !state.users) state = memoryState || defaultState();
    if (!state.users) state.users = {};
    return state;
  }

  function saveLocalState(state) {
    state.updatedAt = now();
    memoryState = state;
    writeJSON(STATE_KEY, state);
    try {
      if (global.FMState && typeof global.FMState.set === 'function') {
        global.FMState.set(STATE_KEY, state);
      }
    } catch (_) {}
  }

  function getUserState() {
    var state = loadLocalState();
    var key = currentUserKey();
    if (!state.users[key]) {
      state.users[key] = {
        createdAt: now(),
        progress: {},
        review: [],
        notes: {},
        prefs: {}
      };
      saveLocalState(state);
    }
    if (!state.users[key].progress) state.users[key].progress = {};
    if (!Array.isArray(state.users[key].review)) state.users[key].review = [];
    if (!state.users[key].notes) state.users[key].notes = {};
    if (!state.users[key].prefs) state.users[key].prefs = {};
    return state.users[key];
  }

  function updateUserState(mutator) {
    var state = loadLocalState();
    var key = currentUserKey();
    if (!state.users[key]) state.users[key] = { createdAt: now(), progress: {}, review: [], notes: {}, prefs: {} };
    mutator(state.users[key]);
    if (Array.isArray(state.users[key].review) && state.users[key].review.length > MAX_REVIEWS) {
      state.users[key].review = state.users[key].review.slice(-MAX_REVIEWS);
    }
    saveLocalState(state);
    return state.users[key];
  }

  function track(action, payload) {
    var event = {
      v: VERSION,
      action: String(action || 'event'),
      user: currentUserKey(),
      ts: now(),
      payload: payload || {}
    };
    var events = readJSON(EVENT_KEY, []);
    if (!Array.isArray(events)) events = [];
    events.push(event);
    if (events.length > MAX_EVENTS) events = events.slice(-MAX_EVENTS);
    writeJSON(EVENT_KEY, events);
    try {
      if (global.FMLog && typeof global.FMLog.add === 'function') {
        global.FMLog.add('edge_learning_' + event.action, event.payload);
      }
    } catch (_) {}
    try {
      global.dispatchEvent(new CustomEvent('edge-fluid-learning:event', { detail: event }));
    } catch (_) {}
    return event;
  }

  function wait(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms); });
  }

  function shouldRetryJSON(error) {
    if (!error || !error.status) return true;
    return error.status === 408 || error.status === 429 || error.status >= 500;
  }

  function fetchJSONOnce(url, options) {
    options = options || {};
    var timeoutMs = options.timeoutMs || 6500;
    var controller = null;
    var timer = null;
    var request = {
      cache: options.cache || 'default',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' }
    };
    if (global.AbortController) {
      controller = new global.AbortController();
      request.signal = controller.signal;
      timer = setTimeout(function() { controller.abort(); }, timeoutMs);
    }
    return fetch(url, request).then(function(response) {
      if (timer) clearTimeout(timer);
      if (!response.ok) {
        var error = new Error('HTTP ' + response.status);
        error.status = response.status;
        throw error;
      }
      return response.json();
    }, function(error) {
      if (timer) clearTimeout(timer);
      throw error;
    });
  }

  function fetchJSONAttempt(url, options, attempt) {
    return fetchJSONOnce(url, options).catch(function(error) {
      var retries = options.retries == null ? 1 : options.retries;
      if (attempt < retries && shouldRetryJSON(error)) {
        return wait(160 * (attempt + 1)).then(function() {
          return fetchJSONAttempt(url, options, attempt + 1);
        });
      }
      throw error;
    });
  }

  function fetchJSON(url, optional, options) {
    options = options || {};
    var key = [url, options.cache || 'default', optional ? 'optional' : 'required'].join('|');
    if (fetchJSONInflight[key]) return fetchJSONInflight[key];
    fetchJSONInflight[key] = fetchJSONAttempt(url, options, 0).catch(function(error) {
      if (!optional) DATA.loadErrors.push({ url: url, message: error && error.message ? error.message : 'fetch_failed' });
      return null;
    }).then(function(payload) {
      delete fetchJSONInflight[key];
      return payload;
    }).catch(function(error) {
      delete fetchJSONInflight[key];
      if (!optional) DATA.loadErrors.push({ url: url, message: error && error.message ? error.message : 'fetch_failed' });
      return null;
    });
    return fetchJSONInflight[key];
  }

  function markRound247() {
    try {
      document.documentElement.setAttribute('data-round247-real-exam-pdf-fidelity-audit', R247_VERSION);
      document.documentElement.setAttribute('data-r247-version', R247_VERSION);
    } catch (_) {}
  }

  function round247Matches(node) {
    try {
      return !!(node && node.nodeType === 1 && node.matches && node.matches(R247_SELECTOR));
    } catch (_) {
      return false;
    }
  }

  function round247Targets(root) {
    var found = [];
    root = root || document;
    if (round247Matches(root)) found.push(root);
    try {
      if (root.querySelectorAll) {
        Array.prototype.forEach.call(root.querySelectorAll(R247_SELECTOR), function(node) {
          found.push(node);
        });
      }
    } catch (_) {}
    return found;
  }

  function loadRound247Audit() {
    if (round247AuditPromise) return round247AuditPromise;
    round247AuditPromise = fetchJSON('/data/' + R247_AUDIT_URL_PARTS[0] + '.' + R247_AUDIT_URL_PARTS[1], true).then(function(payload) {
      return payload && typeof payload === 'object' ? payload : null;
    });
    return round247AuditPromise;
  }

  function round247StatusValue(node) {
    if (!node || !node.getAttribute) return '';
    return String(
      node.getAttribute('data-r247-status') ||
      node.getAttribute('data-r247-source') ||
      node.getAttribute('data-r247-fidelity') ||
      node.getAttribute('data-source-status') ||
      node.getAttribute('data-pdf-fidelity') ||
      node.getAttribute('data-fidelity-status') ||
      node.getAttribute('data-answer-source') ||
      node.getAttribute('data-real-exam-source') ||
      ''
    ).trim();
  }

  function round247CanonicalStatus(status) {
    var raw = String(status || '');
    if (/源索引缺失|缺题|题库为空/.test(raw)) return 'source-missing';
    if (/不在.*原题册|派生|索引外/.test(raw)) return 'outside-source-index';
    if (/精确|包含|贴合/.test(raw)) return 'exact-stem';
    if (/模糊|复核/.test(raw)) return 'fuzzy-aligned';
    if (/答案|待核|推导|笔记/.test(raw)) return 'answer-risk';
    if (/可用|存在|已定位/.test(raw)) return 'available';
    var key = normalizeText(status).replace(/[_\s]+/g, '-');
    if (!key) return '';
    if (/source-missing|missing|empty-year|empty/.test(key)) return 'source-missing';
    if (/outside|out-of-index|2025|derived-year/.test(key)) return 'outside-source-index';
    if (/exactstem|exact-stem|exact|contained|ocr-exact|stem-contained/.test(key)) return 'exact-stem';
    if (/fuzzyaligned|fuzzy-aligned|fuzzy|manual-check|needs-review/.test(key)) return 'fuzzy-aligned';
    if (/derivedorunproven|derived|unproven|answersnotpdfexact|nooriginalanswerproof|answer-note/.test(key)) return 'answer-risk';
    if (/available|ready|source-ok|pdf-index/.test(key)) return 'available';
    return key.slice(0, 48);
  }

  function round247StatusLabel(status) {
    var canonical = round247CanonicalStatus(status);
    var labels = {
      'available': '源索引可用',
      'source-missing': '源索引缺失',
      'outside-source-index': '不在原题册索引',
      'exact-stem': '题面贴合 OCR',
      'fuzzy-aligned': '题面需复核',
      'answer-risk': '答案待核'
    };
    return labels[canonical] || String(status || '来源待核');
  }

  function round247ReadYear(node) {
    var cursor = node;
    while (cursor && cursor !== document && cursor.getAttribute) {
      var value = cursor.getAttribute('data-r247-year') ||
        cursor.getAttribute('data-r247-year-audit') ||
        cursor.getAttribute('data-real-exam-year') ||
        cursor.getAttribute('data-year');
      if (value && /^\d{4}$/.test(String(value))) return Number(value);
      cursor = cursor.parentNode;
    }
    try {
      var param = new URL(location.href).searchParams.get('year');
      if (param && /^\d{4}$/.test(param)) return Number(param);
    } catch (_) {}
    return 0;
  }

  function round247FindYear(audit, year) {
    if (!audit || !year) return null;
    return toArray(audit.years).find(function(item) {
      return Number(item && item.year) === Number(year);
    }) || null;
  }

  function round247SourceText(audit) {
    var evidence = audit && audit.sourceEvidence ? audit.sourceEvidence : {};
    var main = evidence.mainQuestionPdf && evidence.mainQuestionPdf.exists ? '主源题册 PDF 存在' : '主源题册 PDF 待确认';
    var archive = evidence.ocrRebuiltArchive || 'OCR 重建文本';
    return main + '；对照 ' + archive;
  }

  function round247IssueText(yearAudit) {
    var issues = toArray(yearAudit && yearAudit.yearIssues);
    if (!issues.length) return '年份未标出额外问题';
    return issues.map(function(issue) {
      if (issue === 'answersNotPdfExact') return '答案非原 PDF 逐字证据';
      if (issue === 'sourceIndexMissing') return '源索引缺失';
      if (issue === 'emptyYearQuestions') return '题库为空';
      if (issue === 'outsideOriginal2000To2024PdfIndex') return '不在 2000-2024 原题册索引';
      return issue;
    }).join('；');
  }

  function round247EnsureChip(target, status) {
    if (!target || !target.insertBefore || target.querySelector('.r247-source-chip[data-r247-auto="1"]')) return;
    if (/^(INPUT|SELECT|TEXTAREA|BUTTON|AUDIO|VIDEO|IMG|CANVAS)$/.test(target.tagName || '')) return;
    var canonical = round247CanonicalStatus(status);
    var chip = document.createElement('span');
    chip.className = 'r247-source-chip';
    chip.setAttribute('data-status', canonical || 'pending');
    chip.setAttribute('data-r247-auto', '1');
    chip.textContent = round247StatusLabel(status);
    target.classList.add('r247-source-row');
    target.insertBefore(chip, target.firstChild);
  }

  function round247RenderYearStatus(target, audit) {
    var year = round247ReadYear(target);
    if (!year || !target || target.querySelector('.r247-year-status[data-r247-auto="1"]')) return false;
    var yearAudit = round247FindYear(audit, year);
    if (!yearAudit) return false;
    var sourceStatus = yearAudit.sourceStatus || 'available';
    var node = document.createElement('div');
    node.className = 'r247-year-status';
    node.setAttribute('data-status', round247CanonicalStatus(sourceStatus) || 'available');
    node.setAttribute('data-r247-auto', '1');
    node.innerHTML = [
      '<b>' + esc(year) + ' 年</b>',
      '<span>' + esc(round247StatusLabel(sourceStatus)) + '</span>',
      '<span>题面 ' + esc(yearAudit.exactOrContainedQuestionStems || 0) + ' 精确 / ' + esc(yearAudit.fuzzyAlignedQuestionStems || 0) + ' 模糊</span>',
      '<span>答案待核 ' + esc(yearAudit.derivedOrUnprovenAnswers || 0) + '</span>'
    ].join('');
    target.classList.add('r247-year-host');
    target.appendChild(node);
    if (yearAudit.issueCount || toArray(yearAudit.yearIssues).length) {
      var risk = document.createElement('div');
      risk.className = 'r247-risk-note';
      risk.setAttribute('data-risk', sourceStatus === 'available' ? 'medium' : 'high');
      risk.textContent = round247IssueText(yearAudit);
      target.appendChild(risk);
    }
    return true;
  }

  function round247RenderSummary(target, audit) {
    if (!target || !audit || target.getAttribute('data-r247-summary-rendered') === R247_VERSION) return false;
    target.classList.add('r247-audit-board');
    target.setAttribute('data-r247-summary-rendered', R247_VERSION);
    if (String(target.textContent || '').trim()) return true;
    var summary = audit.summary || {};
    target.innerHTML = [
      '<div class="r247-audit-head">',
      '<div><span class="r247-kicker">真题来源批注</span><h3>PDF 保真度审计</h3><p>' + esc(round247SourceText(audit)) + '</p></div>',
      '<span class="r247-source-chip" data-status="answer-risk">' + esc(R247_VERSION) + '</span>',
      '</div>',
      '<div class="r247-evidence-grid">',
      '<div class="r247-evidence-item"><b>' + esc(summary.auditedYearSpan || '2000-2025') + '</b><span>审计年份</span></div>',
      '<div class="r247-evidence-item"><b>' + esc(summary.activeQuestionCount || 0) + '</b><span>活跃题目</span></div>',
      '<div class="r247-evidence-item"><b>' + esc(summary.exactOrContainedQuestionStems || 0) + '</b><span>题面精确/包含</span></div>',
      '<div class="r247-evidence-item"><b>' + esc(summary.derivedOrUnprovenAnswers || 0) + '</b><span>答案待核</span></div>',
      '</div>',
      '<div class="r247-risk-note" data-risk="medium">答案没有原答案 PDF 或人工逐页核验时，只标为推导/笔记来源。</div>'
    ].join('');
    return true;
  }

  function round247EnhanceTarget(target, audit) {
    if (!target || !target.classList) return false;
    target.classList.add('r247-enhanced');
    target.setAttribute('data-r247-version', R247_VERSION);
    var status = round247StatusValue(target);
    if (status) round247EnsureChip(target, status);
    if (target.hasAttribute('data-r247-risk-note')) {
      target.classList.add('r247-risk-note');
      if (!target.getAttribute('data-risk')) target.setAttribute('data-risk', round247CanonicalStatus(status) === 'source-missing' ? 'high' : 'medium');
    }
    if (target.hasAttribute('data-r247-evidence-card')) target.classList.add('r247-evidence-card');
    if (target.hasAttribute('data-r247-audit-summary')) round247RenderSummary(target, audit);
    if (audit && (target.hasAttribute('data-real-exam-year') || target.hasAttribute('data-r247-year-audit'))) {
      round247RenderYearStatus(target, audit);
    }
    return true;
  }

  function enhanceRound247SourceFidelity(root) {
    var targets = round247Targets(root || document);
    if (!targets.length) return false;
    markRound247();
    var needsAudit = targets.some(function(target) {
      return target.hasAttribute && (
        target.hasAttribute('data-r247-audit-summary') ||
        target.hasAttribute('data-r247-year-audit') ||
        target.hasAttribute('data-real-exam-year')
      );
    });
    targets.forEach(function(target) { round247EnhanceTarget(target, null); });
    if (needsAudit) {
      loadRound247Audit().then(function(audit) {
        if (!audit) return;
        round247Targets(root || document).forEach(function(target) {
          round247EnhanceTarget(target, audit);
        });
      });
    }
    return true;
  }

  function watchRound247Targets() {
    if (round247Observer || !('MutationObserver' in global)) return;
    var host = document.documentElement || document.body;
    if (!host) return;
    var doneTimer;
    round247Observer = new MutationObserver(function(records) {
      var found = false;
      records.forEach(function(record) {
        if (found) return;
        if (round247Matches(record.target)) found = true;
        Array.prototype.forEach.call(record.addedNodes || [], function(node) {
          if (found) return;
          if (round247Matches(node) || round247Targets(node).length) found = true;
        });
      });
      if (found) enhanceRound247SourceFidelity(document);
    });
    try {
      round247Observer.observe(host, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [
          'data-round247-real-exam-pdf-fidelity-audit',
          'data-r247-audit-summary',
          'data-r247-evidence-card',
          'data-r247-risk-note',
          'data-r247-source',
          'data-r247-fidelity',
          'data-r247-year-audit',
          'data-real-exam-source',
          'data-real-exam-year',
          'data-source-status',
          'data-pdf-fidelity',
          'data-fidelity-status',
          'data-answer-source'
        ]
      });
      doneTimer = setTimeout(function() {
        if (round247Observer) round247Observer.disconnect();
        round247Observer = null;
      }, 9000);
      if (doneTimer && doneTimer.unref) doneTimer.unref();
    } catch (_) {
      round247Observer = null;
    }
  }

  function loadFirstJSON(urls) {
    var index = 0;
    function next() {
      if (index >= urls.length) return Promise.resolve(null);
      var url = urls[index++];
      return fetchJSON(url, true).then(function(payload) {
        if (payload) {
          DATA.upgradeStatus = 'loaded:' + url;
          return payload;
        }
        return next();
      });
    }
    return next();
  }

  function loadData() {
    if (loadPromise) return loadPromise;
    supplementalPromises = {};
    DATA.loaded = false;
    DATA.loadErrors = [];
    DATA.visibilityIssues = [];
    DATA.upgradeStatus = 'pending';
    DATA.routeMapStatus = 'pending';
    DATA.searchStatus = 'pending';
    DATA.formulaStatus = 'pending';
    DATA.roadmapStatus = 'pending';
    DATA.round278Status = 'pending';
    DATA.reviewSupportStatus = 'pending';
    DATA.searchEntries = [];
    DATA.formulas = FALLBACK_FORMULAS.slice();
    loadPromise = Promise.all([
      fetchJSON(DATA_URLS.knowledge, false),
      loadFirstJSON(UPGRADE_URLS),
      fetchJSON(DATA_URLS.examRouteMap, true),
      fetchJSON(DATA_URLS.formulaConditionChecklist, true),
      fetchJSON(ROADMAP100_URL, true),
      fetchJSON(R278_YEAR_COMPARE_URL, true)
    ]).then(function(results) {
      DATA.knowledge = normalizeKnowledge(results[0]);
      DATA.categories = normalizeCategories(results[0], DATA.knowledge);
      DATA.searchEntries = [];
      DATA.searchStatus = 'lazy';
      DATA.formulas = FALLBACK_FORMULAS.slice();
      DATA.formulaStatus = 'fallback';
      DATA.reviewPlan = null;
      DATA.remediation = null;
      DATA.reviewSupportStatus = 'lazy';
      DATA.upgrade = results[1] || null;
      DATA.examRouteMap = results[2] || null;
      DATA.formulaConditionChecklist = results[3] || null;
      DATA.roadmap100 = normalizeRoadmap100(results[4]);
      DATA.round278PdfWebYearCompare = normalizeRound278PdfWebYearCompare(results[5]);
      DATA.routeMapStatus = DATA.examRouteMap ? 'loaded' : 'fallback';
      DATA.formulaChecklistStatus = DATA.formulaConditionChecklist ? 'loaded' : 'fallback';
      DATA.roadmapStatus = DATA.roadmap100 ? 'loaded' : 'fallback';
      DATA.round278Status = DATA.round278PdfWebYearCompare ? 'loaded' : 'fallback';
      if (!DATA.upgrade) DATA.upgradeStatus = 'fallback';
      applyUpgrade(DATA.upgrade);
      DATA.paths = derivePaths(DATA.upgrade);
      DATA.examRoutes = deriveExamRoutes(DATA.upgrade, DATA.examRouteMap);
      DATA.formulaChecklist = deriveFormulaChecklist(DATA.formulaConditionChecklist, DATA.upgrade);
      DATA.loaded = true;
      DATA.generatedAt = results[0] && results[0].generatedAt ? results[0].generatedAt : '';
      return DATA;
    }).catch(function(error) {
      DATA.loadErrors.push({ url: 'bootstrap', message: error && error.message ? error.message : 'unknown' });
      DATA.knowledge = [];
      DATA.categories = [];
      DATA.searchEntries = [];
      DATA.searchStatus = 'fallback';
      DATA.formulas = FALLBACK_FORMULAS.slice();
      DATA.formulaStatus = 'fallback';
      DATA.paths = derivePaths(null);
      DATA.examRouteMap = null;
      DATA.routeMapStatus = 'fallback';
      DATA.examRoutes = deriveExamRoutes(null, null);
      DATA.formulaConditionChecklist = null;
      DATA.formulaChecklistStatus = 'fallback';
      DATA.formulaChecklist = deriveFormulaChecklist(null, null);
      DATA.roadmap100 = null;
      DATA.roadmapStatus = 'fallback';
      DATA.upgradeStatus = 'fallback';
      DATA.reviewPlan = null;
      DATA.remediation = null;
      DATA.reviewSupportStatus = 'fallback';
      DATA.loaded = true;
      return DATA;
    });
    return loadPromise;
  }

  function rerenderIfTab(tabNames) {
    tabNames = toArray(tabNames);
    if (!mountNode || !tabNames.length) return;
    if (tabNames.indexOf(VIEW.tab) >= 0 || tabNames.indexOf('dashboard') >= 0 && VIEW.tab === 'dashboard') {
      render();
    }
  }

  function loadFormulaIndex() {
    if (supplementalPromises.formulas) return supplementalPromises.formulas;
    DATA.formulaStatus = 'loading';
    rerenderIfTab(['dashboard', 'formulas', 'formula-checklist', 'search']);
    supplementalPromises.formulas = fetchJSON(DATA_URLS.formulas, true, { cache: 'force-cache' }).then(function(payload) {
      var formulas = normalizeFormulas(payload, DATA.knowledge);
      DATA.formulas = formulas.length ? formulas : FALLBACK_FORMULAS.slice();
      DATA.formulaStatus = formulas.length ? 'loaded' : 'fallback';
      applyUpgrade(DATA.upgrade);
      DATA.formulaChecklist = deriveFormulaChecklist(DATA.formulaConditionChecklist, DATA.upgrade);
      rerenderIfTab(['dashboard', 'formulas', 'formula-checklist', 'search']);
      return DATA.formulas;
    }).catch(function(error) {
      DATA.formulaStatus = 'fallback';
      DATA.loadErrors.push({ url: DATA_URLS.formulas, message: error && error.message ? error.message : 'formula_load_failed' });
      rerenderIfTab(['formulas', 'search']);
      return DATA.formulas;
    });
    return supplementalPromises.formulas;
  }

  function loadSearchEntries() {
    if (supplementalPromises.search) return supplementalPromises.search;
    DATA.searchStatus = 'loading';
    rerenderIfTab(['dashboard', 'search']);
    supplementalPromises.search = fetchJSON(DATA_URLS.search, true, { cache: 'force-cache' }).then(function(payload) {
      DATA.searchEntries = normalizeSearch(payload);
      DATA.searchStatus = DATA.searchEntries.length ? 'loaded' : 'fallback';
      rerenderIfTab(['dashboard', 'search']);
      return DATA.searchEntries;
    }).catch(function(error) {
      DATA.searchStatus = 'fallback';
      DATA.loadErrors.push({ url: DATA_URLS.search, message: error && error.message ? error.message : 'search_load_failed' });
      rerenderIfTab(['search']);
      return DATA.searchEntries;
    });
    return supplementalPromises.search;
  }

  function loadReviewSupport() {
    if (supplementalPromises.reviewSupport) return supplementalPromises.reviewSupport;
    DATA.reviewSupportStatus = 'loading';
    rerenderIfTab(['review']);
    supplementalPromises.reviewSupport = Promise.all([
      fetchJSON(DATA_URLS.reviewPlan, true, { cache: 'force-cache' }),
      fetchJSON(DATA_URLS.remediation, true, { cache: 'force-cache' })
    ]).then(function(results) {
      DATA.reviewPlan = results[0] || null;
      DATA.remediation = results[1] || null;
      DATA.reviewSupportStatus = DATA.reviewPlan || DATA.remediation ? 'loaded' : 'fallback';
      rerenderIfTab(['review']);
      return { reviewPlan: DATA.reviewPlan, remediation: DATA.remediation };
    }).catch(function(error) {
      DATA.reviewSupportStatus = 'fallback';
      DATA.loadErrors.push({ url: 'review-support', message: error && error.message ? error.message : 'review_support_load_failed' });
      rerenderIfTab(['review']);
      return { reviewPlan: DATA.reviewPlan, remediation: DATA.remediation };
    });
    return supplementalPromises.reviewSupport;
  }

  function ensureTabData(tab) {
    tab = normalizeTab(tab || VIEW.tab);
    if (!DATA.loaded) return Promise.resolve(DATA);
    if (tab === 'formulas') return loadFormulaIndex();
    if (tab === 'search') return Promise.all([loadSearchEntries(), loadFormulaIndex()]);
    if (tab === 'review') return loadReviewSupport();
    return Promise.resolve(DATA);
  }

  function normalizeKnowledge(payload) {
    var points = toArray(payload && payload.points).map(function(point, index) {
      var id = point.id || 'point-' + String(index + 1).padStart(3, '0');
      var title = point.title || point.n || ('知识点 ' + (index + 1));
      var markdown = point.markdown || point.content || point.k || '';
      return {
        id: String(id),
        page: Number(point.page) || index + 1,
        title: String(title),
        category: String(point.category || point.chapterTitle || '综合学习'),
        headings: toArray(point.headings).map(String),
        keywords: unique(toArray(point.keywords).map(String)),
        markdown: String(markdown),
        url: point.url || point.u || ('/modules/knowledge-detail.html?query=' + encodeURIComponent(title))
      };
    });
    return points;
  }

  function normalizeCategories(payload, points) {
    var categories = toArray(payload && payload.categories).map(function(cat) {
      return {
        name: String(cat.name || cat.category || '综合学习'),
        count: Number(cat.count) || 0
      };
    });
    if (!categories.length) {
      var map = Object.create(null);
      points.forEach(function(point) {
        map[point.category] = (map[point.category] || 0) + 1;
      });
      categories = Object.keys(map).map(function(name) {
        return { name: name, count: map[name] };
      });
    }
    return categories.filter(function(cat) { return cat.name; });
  }

  function normalizeRoadmap100(payload) {
    if (!payload || typeof payload !== 'object') return null;
    var rounds = toArray(payload.rounds).filter(function(item) {
      return item && Number(item.round) >= 275 && item.id && item.lane && item.title;
    }).map(function(item) {
      return {
        round: Number(item.round),
        id: String(item.id),
        lane: String(item.lane),
        title: String(item.title),
        focus: String(item.focus || ''),
        status: String(item.status || 'queued'),
        acceptance: toArray(item.acceptance).map(String)
      };
    });
    if (payload.version !== ROADMAP100_VERSION || rounds.length !== 100) return null;
    var lanes = toArray(payload.lanes).map(function(lane) {
      return {
        id: String(lane.id || ''),
        title: String(lane.title || lane.id || ''),
        summary: String(lane.summary || '')
      };
    }).filter(function(lane) { return lane.id && lane.title; });
    return {
      version: String(payload.version),
      goal: String(payload.goal || '至少 100 大轮持续升级'),
      currentRound: Number(payload.currentRound) || 275,
      lanes: lanes,
      rounds: rounds,
      releaseGate: payload.releaseGate || {}
    };
  }

  function normalizeRound278PdfWebYearCompare(payload) {
    if (!payload || typeof payload !== 'object') return null;
    if (payload.version !== R278_VERSION) return null;
    var summary = payload.summary || {};
    var years = toArray(payload.years).filter(function(item) {
      return item && Number(item.year) >= 2000 && Number(item.year) <= 2025;
    }).map(function(item) {
      return {
        year: Number(item.year),
        status: String(item.status || 'needs-source-review'),
        sourceStatus: String(item.sourceStatus || ''),
        questionCount: Number(item.questionCount) || 0,
        exactOrContainedQuestionStems: Number(item.exactOrContainedQuestionStems) || 0,
        fuzzyAlignedQuestionStems: Number(item.fuzzyAlignedQuestionStems) || 0,
        sourceComparableQuestionStems: Number(item.sourceComparableQuestionStems) || 0,
        comparableRate: Number(item.comparableRate) || 0,
        derivedOrUnprovenAnswers: Number(item.derivedOrUnprovenAnswers) || 0,
        issues: toArray(item.issues).map(String)
      };
    });
    if (!years.length) return null;
    return {
      version: String(payload.version),
      generatedAt: String(payload.generatedAt || ''),
      summary: {
        auditedYearSpan: String(summary.auditedYearSpan || '2000-2025'),
        originalQuestionPdfYearSpan: String(summary.originalQuestionPdfYearSpan || '2000-2024'),
        activeQuestionCount: Number(summary.activeQuestionCount) || 0,
        sourceComparableQuestionStems: Number(summary.sourceComparableQuestionStems) || 0,
        exactOrContainedQuestionStems: Number(summary.exactOrContainedQuestionStems) || 0,
        fuzzyAlignedQuestionStems: Number(summary.fuzzyAlignedQuestionStems) || 0,
        noComparableSourceQuestionStems: Number(summary.noComparableSourceQuestionStems) || 0,
        derivedOrUnprovenAnswers: Number(summary.derivedOrUnprovenAnswers) || 0,
        missingAnswers: Number(summary.missingAnswers) || 0,
        answerPdfVerbatimProofStatus: String(summary.answerPdfVerbatimProofStatus || 'not-established'),
        evidenceAlignedQuestionCount: Number(summary.evidenceAlignedQuestionCount) || 0,
        strictOriginalAnswerEvidenceCount: Number(summary.strictOriginalAnswerEvidenceCount) || 0,
        expectedAtomicQuestionCount: Number(summary.expectedAtomicQuestionCount) || 0,
        webAtomicQuestionCount: Number(summary.webAtomicQuestionCount) || 0,
        groupedSectionCount: Number(summary.groupedSectionCount) || 0,
        splitGroupedSectionCount: Number(summary.splitGroupedSectionCount) || 0,
        incompleteGroupedSections: Number(summary.incompleteGroupedSections) || 0,
        highlightYears: summary.highlightYears || {}
      },
      boundaryNotes: toArray(payload.boundaryNotes).map(String),
      quickLinks: toArray(payload.quickLinks).filter(function(link) {
        return link && link.href && link.label;
      }).map(function(link) {
        return { label: String(link.label), href: String(link.href) };
      }),
      years: years
    };
  }

  function normalizeSearch(payload) {
    return toArray(payload && payload.entries).map(function(item, index) {
      return {
        id: 'search-' + index,
        type: String(item.t || item.type || '站内'),
        title: String(item.n || item.title || '未命名条目'),
        url: item.u || item.url || '#',
        desc: String(item.d || item.desc || ''),
        keywords: String(item.k || item.keywords || '')
      };
    });
  }

  function normalizeFormulas(payload, knowledge) {
    var formulas = toArray(payload && payload.formulas).map(function(item, index) {
      return {
        id: String(item.id || 'formula-' + index),
        title: String(item.title || item.context || item.pointTitle || '公式'),
        formula: String(item.formula || item.mathText || item.tex || ''),
        category: String(item.category || item.chapterTitle || '公式速查'),
        pointId: item.pointId || '',
        pointTitle: String(item.pointTitle || item.title || ''),
        page: Number(item.page) || 0,
        keywords: unique(toArray(item.keywords).map(String)),
        relatedQuestions: toArray(item.relatedQuestions),
        url: item.pointId ? '/modules/knowledge-detail.html?query=' + encodeURIComponent(item.pointTitle || item.title || item.pointId) : (item.url || '')
      };
    }).filter(function(item) {
      return item.formula && item.formula.length <= 360;
    });

    if (!formulas.length) {
      knowledge.slice(0, 80).forEach(function(point) {
        extractFormulaBlocks(point.markdown).slice(0, 3).forEach(function(formula, formulaIndex) {
          formulas.push({
            id: point.id + '-formula-' + formulaIndex,
            title: point.title,
            formula: formula,
            category: point.category,
            pointId: point.id,
            pointTitle: point.title,
            page: point.page,
            keywords: point.keywords,
            relatedQuestions: [],
            url: point.url
          });
        });
      });
    }
    if (!formulas.length) formulas = FALLBACK_FORMULAS.slice();
    return formulas;
  }

  function extractFormulaBlocks(markdown) {
    var out = [];
    var text = String(markdown || '');
    var blockRe = /\$\$([\s\S]*?)\$\$/g;
    var match;
    while ((match = blockRe.exec(text))) {
      var formula = String(match[1] || '').replace(/\s+/g, ' ').trim();
      if (formula) out.push(formula);
    }
    return out;
  }

  function applyUpgrade(payload) {
    if (!payload || typeof payload !== 'object') return;
    var byId = Object.create(null);
    toArray(payload.points || payload.knowledge || payload.items).forEach(function(item) {
      if (item && item.id) byId[String(item.id)] = item;
    });
    if (Object.keys(byId).length) {
      DATA.knowledge = DATA.knowledge.map(function(point) {
        var upgrade = byId[point.id];
        if (!upgrade) return point;
        return Object.assign({}, point, {
          upgrade: upgrade,
          priority: upgrade.priority || point.priority,
          level: upgrade.level || point.level,
          examHint: upgrade.examHint || upgrade.exam || point.examHint,
          pathGroup: upgrade.pathGroup || point.pathGroup
        });
      });
    }
    toArray(payload.chapterUpgradeMap).forEach(function(chapter) {
      var source = chapter && chapter.existingSource ? chapter.existingSource : {};
      var pages = toArray(source.knowledgePages).map(String);
      var conceptNames = toArray(chapter && chapter.coreConcepts).map(function(item) { return item && item.name; }).filter(Boolean);
      pages.forEach(function(pageId) {
        byId[pageId] = Object.assign({}, byId[pageId] || {}, {
          id: pageId,
          priority: chapter.examPriority || '',
          level: chapter.examPriority === 'A' ? 'core' : 'support',
          examHint: conceptNames.slice(0, 3).join(' / '),
          pathGroup: chapter.title || source.sourceTitle || '',
          chapterUpgrade: chapter
        });
      });
    });
    if (Object.keys(byId).length) {
      DATA.knowledge = DATA.knowledge.map(function(point) {
        var upgrade = byId[point.id];
        if (!upgrade) return point;
        return Object.assign({}, point, {
          upgrade: Object.assign({}, point.upgrade || {}, upgrade),
          priority: upgrade.priority || point.priority,
          level: upgrade.level || point.level,
          examHint: upgrade.examHint || upgrade.exam || point.examHint,
          pathGroup: upgrade.pathGroup || point.pathGroup,
          keywords: unique((point.keywords || []).concat(upgrade.pathGroup || '', upgrade.examHint || ''))
        });
      });
    }
    var formulaBoost = Object.create(null);
    toArray(payload.formulas || payload.formulaHighlights).forEach(function(item) {
      if (item && item.id) formulaBoost[String(item.id)] = item;
    });
    toArray(payload.chapterUpgradeMap).forEach(function(chapter) {
      toArray(chapter && chapter.formulaSpine).forEach(function(item) {
        if (!item || !item.formulaId) return;
        formulaBoost[String(item.formulaId)] = Object.assign({}, item, {
          id: item.formulaId,
          chapterTitle: chapter.title,
          category: chapter.title,
          examPriority: chapter.examPriority
        });
      });
    });
    if (Object.keys(formulaBoost).length) {
      DATA.formulas = DATA.formulas.map(function(formula) {
        return formulaBoost[formula.id] ? Object.assign({}, formula, { upgrade: formulaBoost[formula.id] }) : formula;
      });
      Object.keys(formulaBoost).forEach(function(id) {
        var exists = DATA.formulas.some(function(formula) { return formula.id === id; });
        var boosted = formulaBoost[id];
        if (!exists && boosted && boosted.expression) {
          DATA.formulas.push({
            id: id,
            title: boosted.title || '升级公式',
            formula: boosted.expression,
            category: boosted.category || boosted.chapterTitle || '知识升级',
            pointId: '',
            pointTitle: boosted.useWhen || boosted.chapterTitle || '',
            page: 0,
            keywords: unique([boosted.useWhen, boosted.derivationRoute].concat(boosted.checks || [])),
            relatedQuestions: [],
            url: '',
            upgrade: boosted
          });
        }
      });
    }
  }

  function derivePaths(payload) {
    var explicit = toArray(payload && (payload.paths || payload.learningPaths)).map(function(path, index) {
      return {
        id: String(path.id || 'path-' + index),
        title: String(path.title || path.name || ('路径 ' + (index + 1))),
        desc: String(path.desc || path.description || ''),
        points: toArray(path.points || path.pointIds || path.items).map(String),
        tone: path.tone || 'teal'
      };
    }).filter(function(path) { return path.points.length; });
    if (explicit.length) return explicit;

    var chapters = toArray(payload && payload.chapterUpgradeMap);
    if (payload && Array.isArray(payload.crossChapterLearningPath) && payload.crossChapterLearningPath.length && chapters.length) {
      var chapterByNumber = Object.create(null);
      chapters.forEach(function(chapter) {
        chapterByNumber[String(chapter.chapter)] = chapter;
      });
      var staged = payload.crossChapterLearningPath.map(function(stage, index) {
        var points = [];
        toArray(stage.chapters).forEach(function(chapterNumber) {
          var chapter = chapterByNumber[String(chapterNumber)];
          var source = chapter && chapter.existingSource ? chapter.existingSource : {};
          points = points.concat(toArray(source.knowledgePages).map(String));
        });
        return {
          id: 'upgrade-stage-' + (stage.stage || index + 1),
          title: stage.title || ('阶段 ' + (index + 1)),
          desc: (stage.durationDays ? stage.durationDays + ' 天 · ' : '') + toArray(stage.goals).slice(0, 2).join(' / '),
          points: unique(points),
          tone: index % 3 === 0 ? 'teal' : (index % 3 === 1 ? 'coral' : 'indigo'),
          upgradeStage: stage
        };
      }).filter(function(path) { return path.points.length; });
      if (staged.length) return staged;
    }

    if (chapters.length) {
      var chapterPaths = chapters.map(function(chapter, index) {
        var source = chapter.existingSource || {};
        var chapterNo = String(chapter.chapter || '');
        return {
          id: 'upgrade-chapter-' + (chapter.chapter || index + 1),
          title: chapter.title || source.sourceTitle || ('升级章节 ' + (index + 1)),
          desc: (chapter.examPriority ? '优先级 ' + chapter.examPriority + ' · ' : '') + toArray(chapter.commonPitfalls).slice(0, 1).join(''),
          points: toArray(source.knowledgePages).map(String),
          tone: index % 3 === 0 ? 'teal' : (index % 3 === 1 ? 'coral' : 'indigo'),
          practiceUrl: chapterNo ? '/modules/practice-dynamic.html?type=real&chapter=' + encodeURIComponent(chapterNo) + '&mode=normal&from=edge-learning-path' : '/modules/real-exams-dynamic.html?from=edge-learning-path',
          realExamUrl: chapterNo ? chapterRealExamUrl(chapterNo) : '/modules/real-exams-dynamic.html?from=edge-learning-path',
          knowledgeUrl: chapterNo ? chapterKnowledgeUrl(chapterNo) : '/modules/knowledge-detail.html',
          chapterUpgrade: chapter
        };
      }).filter(function(path) { return path.points.length; });
      if (chapterPaths.length) return chapterPaths;
    }

    return DATA.categories.map(function(category, index) {
      var points = DATA.knowledge.filter(function(point) { return point.category === category.name; });
      return {
        id: 'category-' + index,
        title: category.name,
        desc: category.count + ' 个知识点',
        points: points.map(function(point) { return point.id; }),
        tone: index % 3 === 0 ? 'teal' : (index % 3 === 1 ? 'coral' : 'indigo')
      };
    });
  }

  function markRound263() {
    try {
      document.documentElement.setAttribute('data-round263-fluid-exam-route-map', R263_VERSION);
      document.documentElement.setAttribute('data-r263-version', R263_VERSION);
    } catch (_) {}
  }

  function markRound264() {
    try {
      document.documentElement.setAttribute('data-round264-formula-condition-checklist', R264_VERSION);
      document.documentElement.setAttribute('data-r264-version', R264_VERSION);
    } catch (_) {}
  }

  function normalizeRouteItems(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      var routeKeys = [
        'routes',
        'items',
        'questionRoutes',
        'examRoutes',
        'examRouteMap',
        'routeMap',
        'topicRoutes',
        'clueRoutes',
        'questionRouteMap',
        'answerRoutes',
        'clues'
      ];
      for (var i = 0; i < routeKeys.length; i++) {
        if (Array.isArray(value[routeKeys[i]])) return value[routeKeys[i]];
        if (value[routeKeys[i]] && typeof value[routeKeys[i]] === 'object') {
          var nested = objectRouteValues(value[routeKeys[i]]);
          if (nested.length) return nested;
        }
      }
      return objectRouteValues(value);
    }
    return [];
  }

  function objectRouteValues(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
    return Object.keys(value).map(function(key) {
      return value[key];
    }).filter(function(item) {
      return item && typeof item === 'object' && (
        item.id || item.title || item.name || item.routeText || item.answerEntry ||
        item.triggers || item.trigger || item.formulas || item.firstFormulas
      );
    });
  }

  function normalizeRouteTextList(value) {
    if (Array.isArray(value)) {
      return value.map(function(item) {
        if (item && typeof item === 'object') {
          return item.title || item.name || item.text || item.desc || item.description || item.note || item.step || item.label || item.value || item.check || item.reason || item.action || '';
        }
        return item;
      }).map(String).map(function(item) { return item.trim(); }).filter(Boolean);
    }
    if (value && typeof value === 'object') {
      var objectKeys = ['items', 'list', 'checks', 'steps', 'rules', 'questions', 'points', 'mistakes', 'drills'];
      for (var i = 0; i < objectKeys.length; i++) {
        if (Array.isArray(value[objectKeys[i]])) return normalizeRouteTextList(value[objectKeys[i]]);
      }
      return [value.title || value.name || value.text || value.desc || value.description || value.note || value.step || value.label || value.value || value.check || value.reason || value.action || ''].map(String).map(function(item) { return item.trim(); }).filter(Boolean);
    }
    return listFrom(value).map(String).map(function(item) { return item.trim(); }).filter(Boolean);
  }

  function routeFormulaItems(raw, index) {
    var items = normalizeRouteItems(raw.formulas || raw.firstFormulas || raw.formulaRoute || raw.formulaSpine || raw.formulaIds || raw.coreFormulas);
    if (items.length) return items;
    return listFrom(raw.formula || raw.formulaId || raw.expression || raw.mathText).map(function(value, offset) {
      return {
        id: raw.formulaId || ('route-formula-' + index + '-' + offset),
        title: raw.formulaTitle || raw.formulaName || raw.formulaId || '公式',
        formula: value,
        note: raw.formulaNote || raw.useWhen || raw.condition || ''
      };
    });
  }

  function findFormulaById(id) {
    id = String(id || '');
    if (!id) return null;
    return DATA.formulas.find(function(item) { return item.id === id; }) || null;
  }

  function chapterTitleByNumber(number) {
    var chapters = toArray(DATA.upgrade && DATA.upgrade.chapterUpgradeMap);
    var chapter = chapters.find(function(item) { return String(item && item.chapter) === String(number); });
    return String((chapter && (chapter.title || (chapter.existingSource && chapter.existingSource.sourceTitle))) || ('第 ' + number + ' 章'));
  }

  function pickRouteList(primary, fallback) {
    var list = normalizeRouteItems(primary);
    if (list.length) return list;
    return normalizeRouteItems(fallback);
  }

  function buildFallbackExamRoutes(upgrade) {
    var teacher = upgrade && upgrade.teacherBoard ? upgrade.teacherBoard : {};
    var conditionChecklist = toArray(upgrade && upgrade.examCorrectionStudio && upgrade.examCorrectionStudio.formulaConditionChecklist);
    var boundaryAudit = toArray(upgrade && upgrade.examCorrectionStudio && upgrade.examCorrectionStudio.boundaryConditionAudit);
    var misconceptionClinic = toArray(upgrade && upgrade.examCorrectionStudio && upgrade.examCorrectionStudio.misconceptionClinic);
    return toArray(upgrade && upgrade.questionRoutingRules).map(function(rule, index) {
      var formulas = toArray(rule.firstFormulas).map(function(id) {
        var formula = findFormulaById(id);
        return formula ? {
          id: formula.id,
          title: formula.title || formula.pointTitle || id,
          formula: formula.formula,
          note: formula.pointTitle || formula.category || ''
        } : { id: id, title: id, formula: '', note: '' };
      });
      return {
        id: 'upgrade-route-' + index,
        title: toArray(rule.trigger).slice(0, 3).join(' / ') || ('题型路线 ' + (index + 1)),
        triggers: toArray(rule.trigger).map(String),
        chapters: toArray(rule.routeToChapters).map(function(chapter) {
          return chapterTitleByNumber(chapter);
        }),
        routeText: rule.answerEntry || '',
        formulas: formulas,
        boundaryReminders: unique(
          toArray(teacher.boundaryConditionGuide).slice(0, 4)
            .concat(boundaryAudit.map(function(item) {
              return (item.scene ? item.scene + '：' : '') + toArray(item.mustWrite).join('，');
            }).slice(0, 2))
        ),
        mistakeChecks: unique(
          conditionChecklist.map(function(item) {
            return (item.formulaFamily ? item.formulaFamily + '：' : '') + toArray(item.mustAskBeforeUse).slice(0, 2).join('；');
          }).slice(0, 3).concat(misconceptionClinic.map(function(item) {
            return item.teacherCheck || item.wrongPattern || '';
          }).slice(0, 2))
        ),
        reviewOrder: unique(toArray(teacher.studyOrder).slice(0, 5)),
        source: 'upgrade'
      };
    });
  }

  function coreFallbackExamRoutes() {
    return [
      {
        id: 'core-route-flow-rate',
        title: '流量、速度和截面变化',
        triggers: ['流量', '速度', '连续方程', '截面'],
        chapters: ['连续方程', '控制体'],
        routeText: '先画进出口截面，写清面积、平均速度、密度和方向；不可压时再把 rho 约掉。',
        formulas: [
          { id: 'fallback-continuity', title: '连续方程', formula: '', note: '求流量、速度或截面变化时先看质量守恒。' }
        ],
        boundaryReminders: ['入口出口外法向要统一', '不可压不是默认条件，要从题干判断', '面积单位先换成平方米'],
        mistakeChecks: ['不要把体积流量和质量流量混用', '平均速度和点速度要分清'],
        reviewOrder: ['连续方程', '控制体进出口', '单位检查'],
        source: 'core'
      },
      {
        id: 'core-route-energy-head',
        title: '压强、水头和管路损失',
        triggers: ['Bernoulli', '伯努利', '压强', '水头', '损失'],
        chapters: ['能量方程', '管流损失'],
        routeText: '先选两个断面，画基准线和能量线；再判断有没有泵功、沿程损失或局部损失。',
        formulas: [
          { id: 'fallback-bernoulli', title: 'Bernoulli 方程', formula: '', note: '先写适用条件，再补损失项。' }
        ],
        boundaryReminders: ['自由面常取大气压，但要看题干是否允许忽略速度', '长管摩擦段不能直接用无损伯努利', '压强帕和水头米之间要乘 rho g'],
        mistakeChecks: ['不要漏局部损失', '基准面高度符号要统一'],
        reviewOrder: ['伯努利条件', '水头损失', '单位换算'],
        source: 'core'
      },
      {
        id: 'core-route-momentum-force',
        title: '弯管、喷流和结构受力',
        triggers: ['控制体', '弯管', '喷流', '受力', '反力'],
        chapters: ['动量方程', '控制体受力'],
        routeText: '先画控制体和坐标正方向，列压力、重力、壁面或支座反力，再写进出口动量通量。',
        formulas: [
          { id: 'fallback-navier-stokes', title: '动量守恒主线', formula: '', note: '整体受力题优先用积分式动量方程。' }
        ],
        boundaryReminders: ['压力作用面和外法向要配套', '入口动量通量按 v 点乘 n 的符号进入', '题目问水对结构的力时最后要取反向'],
        mistakeChecks: ['不要把壁面对水和水对壁的力混成一个方向', '弯管题先分 x/y 分量'],
        reviewOrder: ['控制体', '外法向', '动量通量', '反力方向'],
        source: 'core'
      },
      {
        id: 'core-route-similarity',
        title: '量纲分析和模型相似',
        triggers: ['量纲', 'Buckingham', 'π', 'Re', 'Fr', '相似', '模型'],
        chapters: ['量纲分析', '相似准则'],
        routeText: '先列变量和基本量纲，选重复变量组成 π 群，再判断这题主要保 Re、Fr、Eu、Ma 还是 St。',
        formulas: [
          { id: 'fallback-reynolds', title: 'Reynolds 数', formula: '', note: '黏性占主导时优先检查 Re 相似。' }
        ],
        boundaryReminders: ['模型和原型的几何比例先写清', '不是所有无量纲数都能同时保持', '最后检查速度、力和时间比例的单位'],
        mistakeChecks: ['不要一上来全保相似准则', '重复变量必须覆盖基本量纲且彼此独立'],
        reviewOrder: ['变量表', 'π 群', '主控相似准则', '缩尺换算'],
        source: 'core'
      }
    ];
  }

  function normalizeExamRoute(raw, index) {
    raw = raw || {};
    var formulas = routeFormulaItems(raw, index).map(function(item, formulaIndex) {
      if (typeof item === 'string' || typeof item === 'number') {
        var formulaKey = String(item);
        var found = findFormulaById(formulaKey);
        return found ? {
          id: found.id,
          title: found.title || found.pointTitle || formulaKey,
          formula: found.formula,
          note: found.pointTitle || found.category || ''
        } : { id: formulaKey, title: formulaKey, formula: '', note: '' };
      }
      item = item || {};
      var formulaId = item.id || item.formulaId || item.pointId || ('route-formula-' + index + '-' + formulaIndex);
      return {
        id: String(formulaId),
        title: String(item.title || item.name || item.formulaTitle || item.formulaName || item.formulaId || '公式'),
        formula: String(item.formula || item.expression || item.mathText || ''),
        note: String(item.note || item.useWhen || item.condition || item.desc || item.route || '')
      };
    });
    return {
      id: String(raw.id || raw.routeId || raw.clueId || 'exam-route-' + index),
      title: String(raw.title || raw.name || raw.questionType || raw.routeTitle || raw.clue || ('题型路线 ' + (index + 1))),
      triggers: unique(normalizeRouteTextList(raw.triggers || raw.trigger || raw.keywords || raw.clues || raw.questionClues || raw.signals || raw.examSignals)),
      chapters: unique(normalizeRouteTextList(raw.chapters || raw.routeToChapters || raw.chapterRoute || raw.knowledgeRoute || raw.knowledgePath || raw.relatedChapters)),
      routeText: String(raw.routeText || raw.answerEntry || raw.firstStep || raw.teacherNote || raw.desc || raw.summary || raw.route || raw.path || ''),
      formulas: formulas,
      boundaryReminders: unique(normalizeRouteTextList(raw.boundaryReminders || raw.boundaryConditions || raw.boundaryChecks || raw.boundaryRoute || raw.conditions)),
      mistakeChecks: unique(normalizeRouteTextList(raw.mistakeChecks || raw.wrongCauseChecks || raw.commonPitfalls || raw.checklist || raw.pitfalls)),
      reviewOrder: unique(normalizeRouteTextList(raw.reviewOrder || raw.reviewSequence || raw.studyOrder || raw.nextReview || raw.steps)),
      source: raw.source || 'round263'
    };
  }

  function deriveExamRoutes(upgrade, routeMap) {
    var routeItems = normalizeRouteItems(routeMap);
    if (!routeItems.length) {
      routeItems = normalizeRouteItems(upgrade && (upgrade.examRouteMap || upgrade.routeMap || upgrade.topicRoutes || upgrade.questionRouteMap));
    }
    var explicit = routeItems.map(normalizeExamRoute).filter(function(route) {
      return route.title || route.triggers.length || route.routeText;
    });
    var fallback = buildFallbackExamRoutes(upgrade).concat(coreFallbackExamRoutes());
    var byId = Object.create(null);
    explicit.concat(fallback).forEach(function(route, index) {
      if (!route) return;
      var id = route.id || ('exam-route-' + index);
      if (!byId[id]) byId[id] = route;
    });
    return Object.keys(byId).map(function(id) { return byId[id]; }).slice(0, 24);
  }

  function normalizeChecklistItems(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      var keys = [
        'items',
        'formulas',
        'checklist',
        'formulaChecklist',
        'formulaConditionChecklist',
        'conditionChecklist',
        'formulaConditionCards',
        'conditionCards',
        'formulaCards',
        'cards',
        'entries',
        'records',
        'data',
        'rules'
      ];
      for (var i = 0; i < keys.length; i++) {
        if (Array.isArray(value[keys[i]])) return value[keys[i]];
      }
      return Object.keys(value).map(function(key) {
        var item = value[key];
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          return Object.assign({ id: item.id || key }, item);
        }
        return null;
      }).filter(function(item) {
        return item && (
          item.title || item.name || item.formula || item.expression ||
          item.applyConditions || item.conditions || item.commonMistakes || item.wrongCauses
        );
      });
    }
    return [];
  }

  function normalizeChecklistList(value, fallback) {
    var list = normalizeRouteTextList(value);
    if (!list.length && fallback) list = normalizeRouteTextList(fallback);
    return unique(list);
  }

  function normalizeChecklistRouteLinks(value) {
    return toArray(value).map(function(item) {
      if (!item) return null;
      if (typeof item === 'string') {
        return { label: item, href: '', use: '' };
      }
      if (typeof item !== 'object') return null;
      var label = firstText(item.label, item.title, item.name, item.entry, item.text, item.href);
      var href = firstText(item.href, item.url, item.link, item.path);
      var use = firstText(item.use, item.note, item.desc, item.description, item.cue, item.trainingUse);
      if (!label && !href && !use) return null;
      return { label: label || href || '相关入口', href: href, use: use };
    }).filter(Boolean).slice(0, 6);
  }

  function firstText() {
    for (var i = 0; i < arguments.length; i++) {
      var value = arguments[i];
      if (value == null) continue;
      if (Array.isArray(value)) {
        var nested = firstText.apply(null, value);
        if (nested) return nested;
      } else if (typeof value === 'object') {
        var objectText = value.title || value.name || value.text || value.desc || value.note || value.summary;
        if (objectText) return String(objectText);
      } else {
        var text = String(value).trim();
        if (text) return text;
      }
    }
    return '';
  }

  function normalizeFormulaChecklistItem(raw, index, source) {
    raw = raw || {};
    var formulaId = String(raw.formulaId || raw.formula_id || raw.idRef || raw.relatedFormulaId || raw.relatedId || raw.pointId || raw.knowledgeId || '');
    var formula = formulaId ? findFormulaById(formulaId) : null;
    var title = firstText(raw.title, raw.name, raw.label, raw.formulaTitle, raw.formulaName, raw.formulaFamily, formula && (formula.title || formula.pointTitle), '公式条件卡 ' + (index + 1));
    var expression = firstText(raw.formula, raw.expression, raw.mathText, raw.tex, raw.latex, raw.math, formula && formula.formula);
    var category = firstText(raw.category, raw.chapterTitle, raw.chapter, raw.family, raw.formulaFamily, raw.group, raw.topic, formula && formula.category, '公式条件');
    var keywords = unique(
      toArray(raw.keywords || raw.tags || raw.triggers)
        .concat(title, category, formulaId, formula && formula.pointTitle, formula && formula.keywords, raw.aliases, raw.formulaForms, raw.errorTypes, raw.invalidWhen, raw.notEnoughConditions, raw.routeLinks, raw.examEntry)
        .map(function(item) { return Array.isArray(item) ? item.join(' ') : item; })
    );
    return {
      id: String(raw.id || raw.checklistId || raw.key || formulaId || ('formula-checklist-' + index)),
      formulaId: formulaId || (formula && formula.id) || '',
      title: title,
      formula: expression,
      category: category,
      applyConditions: normalizeChecklistList(raw.applyConditions || raw.applicableConditions || raw.conditions || raw.conditionChecks || raw.useWhen || raw.whenToUse || raw.assumptions || raw.scope || raw.mustAskBeforeUse, raw.whenToUse),
      notEnoughConditions: normalizeChecklistList(raw.notEnoughConditions || raw.missingConditions || raw.notEnough || raw.notEnoughChecks || raw.needMoreConditions || raw.conditionGaps),
      invalidWhen: normalizeChecklistList(raw.invalidWhen || raw.notUseWhen || raw.failureCases || raw.invalidCases || raw.outOfScope || raw.cannotUseWhen),
      boundaryConditions: normalizeChecklistList(raw.boundaryConditions || raw.boundaryReminders || raw.boundaryChecks || raw.boundaries || raw.limits || raw.limitations || raw.edgeConditions || raw.validRange),
      unitDirections: normalizeChecklistList(raw.unitDirections || raw.units || raw.unitChecks || raw.directionChecks || raw.direction || raw.signChecks || raw.signConvention || raw.orientationChecks || raw.dimensionChecks),
      commonMistakes: normalizeChecklistList(raw.commonMistakes || raw.commonPitfalls || raw.wrongCauses || raw.errorCauses || raw.mistakeReasons || raw.mistakes || raw.errorChecks || raw.pitfalls),
      remedialTraining: normalizeChecklistList(raw.remedialTraining || raw.training || raw.fixTraining || raw.correctionTraining || raw.remedies || raw.repairPractice || raw.practice || raw.drills || raw.reviewOrder),
      aliases: normalizeChecklistList(raw.aliases || raw.alias || raw.entryAliases || raw.aliasAndEntryMap),
      formulaForms: normalizeChecklistList(raw.formulaForms || raw.forms || raw.formulaVariants || raw.formulaTexts || raw.formulaList),
      routeLinks: normalizeChecklistRouteLinks(raw.routeLinks || raw.links || raw.problemEntryLinks || raw.examLinks),
      examEntry: firstText(raw.examEntry, raw.entry, raw.problemEntry, raw.questionEntry),
      answerSkeleton: normalizeChecklistList(raw.answerSkeleton || raw.solutionSkeleton || raw.steps || raw.solveSteps),
      mistakeTags: normalizeChecklistList(raw.mistakeTags || raw.errorTags || raw.mistakeTypes),
      reviewOrder: normalizeChecklistList(raw.reviewOrder || raw.order || raw.checkOrder),
      teacherNote: firstText(raw.teacherNote, raw.note, raw.hint, raw.summary),
      source: source || raw.source || '公式条件历史包',
      keywords: keywords,
      url: raw.url || (formula && formula.url) || ''
    };
  }

  function ensureFormulaChecklistVisibility(item) {
    item = Object.assign({}, item || {});
    var title = item.title || item.entry || '公式条件卡';
    var fill = function(key, values) {
      if (!toArray(item[key]).length) {
        item[key] = toArray(values);
        DATA.visibilityIssues.push({ type: 'formula-checklist-fill', id: item.id || title, field: key });
      }
    };
    fill('applyConditions', ['先确认题干信号、模型假设和公式适用范围，再写公式。']);
    fill('boundaryConditions', ['先写入口、出口、固壁、自由面、远场或控制体外法向，再代入公式。']);
    fill('unitDirections', ['算完核对单位、正方向和数量级；压强、水头、通量和力不要混单位。']);
    fill('commonMistakes', ['只背公式但没有写适用条件、边界条件或单位方向。']);
    fill('remedialTraining', ['重做一道同类真题，只写条件表和边界单位，不急着算数值。']);
    if (!toArray(item.routeLinks).length) {
      item.routeLinks = [{ label: '知识升级入口：公式条件表', href: '/modules/knowledge-upgrade-2026.html#formula-condition-checklist', use: '回到历史条件表核对适用条件、边界和单位方向。' }];
      DATA.visibilityIssues.push({ type: 'formula-checklist-fill', id: item.id || title, field: 'routeLinks' });
    }
    if (!item.teacherNote) item.teacherNote = '公式能不能用，先看条件、边界和单位方向。';
    return item;
  }

  function checklistFromUpgrade(upgrade) {
    var studio = upgrade && upgrade.examCorrectionStudio ? upgrade.examCorrectionStudio : {};
    var items = toArray(studio.formulaConditionChecklist).map(function(item, index) {
      item = item || {};
      return normalizeFormulaChecklistItem({
        id: item.id || ('upgrade-formula-condition-' + index),
        title: item.formulaFamily || item.title,
        category: item.formulaFamily || '公式条件',
        applyConditions: item.mustAskBeforeUse,
        boundaryConditions: item.boundaryConditions || item.boundaryChecks,
        unitDirections: item.unitDirections || item.unitChecks,
        commonMistakes: item.commonMistakes || item.wrongPattern || item.pitfalls,
        remedialTraining: item.remedialTraining || item.training || item.teacherCheck,
        teacherNote: item.teacherCheck || item.note,
        keywords: [item.formulaFamily].concat(item.mustAskBeforeUse || [])
      }, index, '讲义规则');
    });
    var r264 = upgrade && upgrade.formulaConditionChecklist ? upgrade.formulaConditionChecklist : null;
    if (r264 && typeof r264 === 'object') {
      var mistakeNotes = toArray(r264.mistakeTaxonomy).map(function(item) {
        return firstText(item.type, item.check, item.examples);
      }).filter(Boolean);
      var trainingNotes = toArray(r264.examTrainingPlan).map(function(item) {
        return firstText(item.focus, item.trainingUse);
      }).filter(Boolean);
      var linkNotes = toArray(r264.problemEntryLinks).map(function(item) {
        return firstText(item.entry, item.cue, item.href);
      }).filter(Boolean);
      var entries = toArray(r264.aliasAndEntryMap);
      entries.forEach(function(entry, index) {
        entry = entry || {};
        items.push(normalizeFormulaChecklistItem({
          id: entry.id || ('upgrade-r264-entry-' + index),
          title: entry.entry || entry.title,
          category: r264.entryLabel || '公式适用条件',
          applyConditions: entry.triggerWords || r264.teacherUse || r264.searchKeywords,
          boundaryConditions: [
            '先写固壁、自由面、入口出口、控制体外法向和损失项，再代公式。',
            firstText(r264.densityUpgrade && r264.densityUpgrade.teacherReadingRule)
          ],
          unitDirections: [
            '算完回查单位、方向和数量级；水头米和压强帕之间要乘 rho g。',
            firstText(r264.densityUpgrade && r264.densityUpgrade.studentOutput)
          ],
          commonMistakes: mistakeNotes,
          remedialTraining: trainingNotes.concat(linkNotes),
          teacherNote: r264.teacherUse || r264.siteUpdateNote,
          keywords: [entry.entry, entry.aliases, entry.triggerWords, entry.routeLabels, r264.searchKeywords]
        }, index, '公式条件历史包'));
      });
    }
    return items;
  }

  function deriveFormulaChecklist(payload, upgrade) {
    var explicit = normalizeChecklistItems(payload).map(function(item, index) {
      return normalizeFormulaChecklistItem(item, index, '公式条件历史包');
    }).filter(function(item) {
      return item.title || item.formula || item.applyConditions.length || item.commonMistakes.length;
    });
    var fallback = checklistFromUpgrade(upgrade).concat(FALLBACK_FORMULA_CHECKLIST.map(function(item, index) {
      return normalizeFormulaChecklistItem(item, index, '讲义兜底');
    }));
    var byId = Object.create(null);
    explicit.concat(fallback).map(ensureFormulaChecklistVisibility).forEach(function(item, index) {
      if (!item) return;
      var id = item.id || ('formula-checklist-' + index);
      if (!byId[id]) byId[id] = Object.assign({}, item, { id: id });
    });
    return Object.keys(byId).map(function(id) { return byId[id]; }).slice(0, 80);
  }

  function scoreFormulaChecklist(item, query) {
    var q = normalizeText(query);
    if (!q) return 0;
    var tokens = q.split(' ').filter(Boolean);
    var hay = normalizeText([
      item.title,
      item.formula,
      item.category,
      item.formulaId,
      toArray(item.keywords).join(' '),
      toArray(item.applyConditions).join(' '),
      toArray(item.notEnoughConditions).join(' '),
      toArray(item.invalidWhen).join(' '),
      toArray(item.boundaryConditions).join(' '),
      toArray(item.unitDirections).join(' '),
      toArray(item.commonMistakes).join(' '),
      toArray(item.remedialTraining).join(' '),
      toArray(item.aliases).join(' '),
      toArray(item.formulaForms).join(' '),
      toArray(item.answerSkeleton).join(' '),
      toArray(item.mistakeTags).join(' '),
      toArray(item.reviewOrder).join(' '),
      toArray(item.routeLinks).map(function(link) { return [link.label, link.href, link.use].join(' '); }).join(' '),
      item.examEntry
    ].join(' '));
    var score = hay.indexOf(q) >= 0 ? 70 : 0;
    if (normalizeText(item.title).indexOf(q) >= 0) score += 40;
    tokens.forEach(function(token) {
      if (hay.indexOf(token) >= 0) score += 9;
    });
    return score;
  }

  function formulaChecklistResults() {
    var q = VIEW.formulaChecklistQuery;
    var cat = VIEW.formulaChecklistCategory;
    var list = toArray(DATA.formulaChecklist).filter(function(item) {
      if (cat !== 'all' && item.category !== cat) return false;
      if (!normalizeText(q)) return true;
      return scoreFormulaChecklist(item, q) > 0;
    }).sort(function(a, b) {
      var scoreDelta = scoreFormulaChecklist(b, q) - scoreFormulaChecklist(a, q);
      if (scoreDelta) return scoreDelta;
      return String(a.title).localeCompare(String(b.title), 'zh-Hans-CN');
    });
    return list.slice(0, VIEW.listLimit);
  }

  function findChecklistForFormula(formula) {
    if (!formula) return null;
    var formulaId = String(formula.id || '');
    var title = normalizeText([formula.title, formula.pointTitle].join(' '));
    var expression = normalizeText(formula.formula);
    return toArray(DATA.formulaChecklist).find(function(item) {
      if (formulaId && item.formulaId === formulaId) return true;
      var itemTitle = normalizeText(item.title);
      if (title && itemTitle && (title.indexOf(itemTitle) >= 0 || itemTitle.indexOf(title) >= 0)) return true;
      var itemFormula = normalizeText(item.formula);
      return expression && itemFormula && (expression.indexOf(itemFormula) >= 0 || itemFormula.indexOf(expression) >= 0);
    }) || null;
  }

  function selectedFormulaChecklist() {
    var list = formulaChecklistResults();
    var selected = toArray(DATA.formulaChecklist).find(function(item) { return item.id === VIEW.selectedFormulaChecklist; });
    if (selected && (VIEW.formulaChecklistCategory === 'all' || selected.category === VIEW.formulaChecklistCategory)) {
      if (!normalizeText(VIEW.formulaChecklistQuery) || scoreFormulaChecklist(selected, VIEW.formulaChecklistQuery) > 0) return selected;
    }
    return list[0] || toArray(DATA.formulaChecklist)[0] || null;
  }

  function scoreExamRoute(route, clue) {
    var q = normalizeText(clue);
    if (!q) return 0;
    var tokens = q.split(' ').filter(Boolean);
    var hay = normalizeText([
      route.title,
      route.routeText,
      toArray(route.triggers).join(' '),
      toArray(route.chapters).join(' '),
      toArray(route.formulas).map(function(item) {
        return [item.title, item.note, item.formula].join(' ');
      }).join(' '),
      toArray(route.boundaryReminders).join(' '),
      toArray(route.mistakeChecks).join(' '),
      toArray(route.reviewOrder).join(' ')
    ].join(' '));
    var score = hay.indexOf(q) >= 0 ? 60 : 0;
    toArray(route.triggers).forEach(function(trigger) {
      var t = normalizeText(trigger);
      if (t && q.indexOf(t) >= 0) score += 35;
      else if (t && hay.indexOf(t) >= 0 && tokens.some(function(token) { return t.indexOf(token) >= 0 || token.indexOf(t) >= 0; })) score += 12;
    });
    tokens.forEach(function(token) {
      if (hay.indexOf(token) >= 0) score += 8;
    });
    return score;
  }

  function routeSourceRank(route) {
    if (!route) return 0;
    if (route.source === 'round263') return 70;
    if (route.source === 'upgrade') return 15;
    if (route.source === 'core') return 4;
    return 8;
  }

  function routeEffectiveScore(item) {
    return (item.score || 0) + (item.score > 0 ? routeSourceRank(item.route) : 0);
  }

  function selectedExamRoute() {
    var routes = DATA.examRoutes || [];
    if (!routes.length) return null;
    var selected = routes.find(function(route) { return route.id === VIEW.selectedExamRoute; });
    if (selected) return selected;
    var clue = VIEW.examClue || '';
    if (!normalizeText(clue)) return null;
    var ranked = routes.map(function(route) {
      return { route: route, score: scoreExamRoute(route, clue) };
    }).sort(function(a, b) {
      var effectiveDelta = routeEffectiveScore(b) - routeEffectiveScore(a);
      if (effectiveDelta) return effectiveDelta;
      return b.score - a.score;
    });
    return (ranked[0] && ranked[0].score > 0 ? ranked[0].route : routes[0]) || null;
  }

  function examRouteSuggestions() {
    var clue = VIEW.examClue || '';
    return (DATA.examRoutes || []).map(function(route, index) {
      return { route: route, score: scoreExamRoute(route, clue), index: index };
    }).sort(function(a, b) {
      var effectiveDelta = routeEffectiveScore(b) - routeEffectiveScore(a);
      if (effectiveDelta) return effectiveDelta;
      if (b.score !== a.score) return b.score - a.score;
      var sourceDelta = routeSourceRank(b.route) - routeSourceRank(a.route);
      if (sourceDelta) return sourceDelta;
      return a.index - b.index;
    }).slice(0, 6);
  }

  function progressSummary() {
    var user = getUserState();
    var total = DATA.knowledge.length || 0;
    var done = 0;
    var learning = 0;
    var weak = 0;
    Object.keys(user.progress || {}).forEach(function(id) {
      var item = user.progress[id];
      if (item && item.status === 'done') done++;
      else if (item && item.status === 'learning') learning++;
      else if (item && item.status === 'weak') weak++;
    });
    var review = collectReviews();
    var due = review.filter(function(item) { return !item.due || item.due <= now(); }).length;
    return {
      total: total,
      done: done,
      learning: learning,
      weak: weak,
      pct: total ? Math.round(done / total * 100) : 0,
      reviewTotal: review.length,
      due: due
    };
  }

  function masteryByCategory() {
    var user = getUserState();
    return DATA.categories.map(function(category) {
      var points = DATA.knowledge.filter(function(point) { return point.category === category.name; });
      var done = points.filter(function(point) {
        return user.progress[point.id] && user.progress[point.id].status === 'done';
      }).length;
      var weak = points.filter(function(point) {
        return user.progress[point.id] && user.progress[point.id].status === 'weak';
      }).length;
      return {
        name: category.name,
        count: points.length || category.count,
        done: done,
        weak: weak,
        pct: points.length ? Math.round(done / points.length * 100) : 0
      };
    });
  }

  function pathProgress(path) {
    var user = getUserState();
    var ids = unique(toArray(path && path.points));
    var done = ids.filter(function(id) {
      return user.progress[id] && user.progress[id].status === 'done';
    }).length;
    var weak = ids.filter(function(id) {
      return user.progress[id] && user.progress[id].status === 'weak';
    }).length;
    return {
      count: ids.length,
      done: done,
      weak: weak,
      pct: ids.length ? Math.round(done / ids.length * 100) : 0
    };
  }

  function suggestedPoints(limit) {
    var user = getUserState();
    var ranked = DATA.knowledge.slice().sort(function(a, b) {
      var ap = user.progress[a.id] || {};
      var bp = user.progress[b.id] || {};
      var as = ap.status === 'weak' ? -4 : (ap.status === 'learning' ? -2 : (ap.status === 'done' ? 4 : 0));
      var bs = bp.status === 'weak' ? -4 : (bp.status === 'learning' ? -2 : (bp.status === 'done' ? 4 : 0));
      if (as !== bs) return as - bs;
      return (a.page || 0) - (b.page || 0);
    });
    return ranked.slice(0, limit || 8);
  }

  function collectReviews() {
    var user = getUserState();
    var local = toArray(user.review).map(function(item) {
      return Object.assign({ source: 'edge' }, item);
    });
    var existing = readExistingWrong();
    var byId = Object.create(null);
    local.concat(existing).forEach(function(item) {
      if (!item || !item.id) return;
      byId[item.id] = item;
    });
    return Object.keys(byId).map(function(id) { return byId[id]; }).sort(function(a, b) {
      return (a.due || 0) - (b.due || 0);
    });
  }

  function readExistingWrong() {
    var all = readJSON('fm_wrong', {});
    var user = currentUserKey();
    var list = Array.isArray(all && all[user]) ? all[user] : [];
    return list.map(function(item, index) {
      var rawId = item.id || ('fm-wrong-' + index);
      return {
        id: 'fmwrong:' + rawId,
        rawId: rawId,
        source: 'fm_wrong',
        sourceType: item.type || '错题',
        title: item.title || item.question || item.name || '历史错题',
        detail: item.detail || item.explanation || item.note || '',
        url: item.url || '',
        category: item.category || item.module || '错题本',
        due: item.due || 0,
        ef: item.ef,
        rep: item.rep,
        ivl: item.ivl,
        reviews: item.reviews || 0,
        createdAt: item.createdAt || item.t || now()
      };
    });
  }

  function statusLabel(status) {
    if (status === 'done') return '已掌握';
    if (status === 'learning') return '学习中';
    if (status === 'weak') return '薄弱点';
    return '未开始';
  }

  function pointStatus(pointId) {
    var user = getUserState();
    return (user.progress[pointId] && user.progress[pointId].status) || 'todo';
  }

  function setPointStatus(pointId, status) {
    var point = DATA.knowledge.find(function(item) { return item.id === pointId; });
    if (!point) return false;
    updateUserState(function(user) {
      user.progress[pointId] = Object.assign({}, user.progress[pointId] || {}, {
        status: status,
        updatedAt: now(),
        title: point.title,
        category: point.category,
        page: point.page,
        visits: ((user.progress[pointId] && user.progress[pointId].visits) || 0) + 1
      });
    });
    track('point_status', { id: pointId, status: status, title: point.title });
    render({ focusRole: null });
    return true;
  }

  function addReviewItem(input) {
    var title = String(input && input.title || '').trim();
    if (!title) return false;
    var sourceId = String(input.sourceId || input.id || slug(title));
    var sourceType = String(input.sourceType || '复习');
    var reviewId = 'edge:' + sourceType + ':' + sourceId;
    updateUserState(function(user) {
      var list = toArray(user.review);
      var existing = list.find(function(item) { return item.id === reviewId; });
      var base = {
        id: reviewId,
        source: 'edge',
        sourceId: sourceId,
        sourceType: sourceType,
        title: title,
        detail: String(input.detail || ''),
        formula: String(input.formula || ''),
        url: input.url || '',
        category: String(input.category || '复习本'),
        tags: unique(input.tags || []),
        createdAt: now(),
        due: now(),
        ef: 2.5,
        rep: 0,
        ivl: 0,
        reviews: 0
      };
      if (existing) {
        Object.assign(existing, base, {
          createdAt: existing.createdAt || base.createdAt,
          due: existing.due || base.due,
          ef: existing.ef || base.ef,
          rep: existing.rep || 0,
          ivl: existing.ivl || 0,
          reviews: existing.reviews || 0
        });
      } else {
        list.unshift(base);
      }
      user.review = list;
    });
    track('review_add', { id: reviewId, title: title, type: sourceType });
    toast('已加入复习本');
    render({ focusRole: null });
    return true;
  }

  function removeReviewItem(id) {
    updateUserState(function(user) {
      user.review = toArray(user.review).filter(function(item) { return item.id !== id; });
    });
    track('review_remove', { id: id });
    render({ focusRole: null });
  }

  function rateReviewItem(id, quality) {
    quality = clamp(quality, 0, 5);
    if (String(id).indexOf('fmwrong:') === 0) {
      try {
        if (global.FMSpacedRep && typeof global.FMSpacedRep.rate === 'function') {
          global.FMSpacedRep.rate(String(id).slice(8), quality);
        }
      } catch (_) {}
      track('review_rate_fm_wrong', { id: id, quality: quality });
      render({ focusRole: null });
      return true;
    }
    updateUserState(function(user) {
      user.review = toArray(user.review).map(function(item) {
        if (item.id !== id) return item;
        var next = Object.assign({}, item);
        if (global.FMSpacedRep && typeof global.FMSpacedRep.apply === 'function') {
          next = Object.assign(next, global.FMSpacedRep.apply(next, quality));
        } else {
          next = applySM2(next, quality);
        }
        next.lastQuality = quality;
        return next;
      });
    });
    track('review_rate', { id: id, quality: quality });
    render({ focusRole: null });
    return true;
  }

  function applySM2(item, quality) {
    var next = Object.assign({ ef: 2.5, rep: 0, ivl: 0 }, item);
    if (quality < 3) {
      next.rep = 0;
      next.ivl = 1;
    } else {
      next.rep = (next.rep || 0) + 1;
      if (next.rep === 1) next.ivl = 1;
      else if (next.rep === 2) next.ivl = 6;
      else next.ivl = Math.round((next.ivl || 1) * (next.ef || 2.5));
    }
    next.ef = Math.max(1.3, (next.ef || 2.5) + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    next.lastReview = now();
    next.due = now() + next.ivl * 86400000;
    next.reviews = (next.reviews || 0) + 1;
    return next;
  }

  function slug(value) {
    return normalizeText(value).replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-|-$/g, '').slice(0, 64) || String(now());
  }

  function search(query, opts) {
    opts = opts || {};
    var limit = opts.limit || 24;
    var q = normalizeText(query);
    var index = buildSearchIndex();
    if (!q) return index.slice(0, limit).map(function(item) { return { item: item, score: 0 }; });
    var tokens = q.split(' ').filter(Boolean);
    var results = index.map(function(item) {
      var hay = normalizeText([item.title, item.desc, item.keywords, item.type, item.category].join(' '));
      var score = 0;
      if (normalizeText(item.title) === q) score += 100;
      if (normalizeText(item.title).indexOf(q) >= 0) score += 70;
      if (hay.indexOf(q) >= 0) score += 42;
      tokens.forEach(function(token) {
        if (normalizeText(item.title).indexOf(token) >= 0) score += 18;
        else if (hay.indexOf(token) >= 0) score += 8;
      });
      if (item.type === '知识') score += 4;
      if (item.type === '公式') score += 3;
      return { item: item, score: score };
    }).filter(function(result) {
      return result.score > 0;
    }).sort(function(a, b) {
      return b.score - a.score;
    });
    return results.slice(0, limit);
  }

  function buildSearchIndex() {
    var out = [];
    var seen = Object.create(null);
    function add(item) {
      if (!item || !item.title) return;
      var key = [item.type, item.title, item.url].join('|');
      if (seen[key]) return;
      seen[key] = true;
      out.push(item);
    }
    DATA.searchEntries.forEach(function(item) {
      add({
        id: item.id,
        type: item.type,
        title: item.title,
        desc: item.desc,
        keywords: item.keywords,
        url: item.url,
        category: item.type
      });
    });
    DISCOVERY_LINKS.forEach(function(item) {
      add({
        id: item.id,
        type: item.type,
        title: item.title,
        desc: item.desc,
        keywords: item.keywords,
        url: item.url,
        category: 'Round342 发现入口'
      });
    });
    DATA.knowledge.forEach(function(point) {
      add({
        id: point.id,
        type: '知识',
        title: 'P' + point.page + ' ' + point.title,
        desc: point.category + ' · ' + markdownPreview(point.markdown, 90),
        keywords: point.keywords.concat(point.headings).join(' '),
        url: point.url,
        category: point.category,
        sourcePoint: point
      });
    });
    DATA.formulas.slice(0, 900).forEach(function(formula) {
      add({
        id: formula.id,
        type: '公式',
        title: formula.title,
        desc: formula.pointTitle || formula.category,
        keywords: [formula.formula, formula.category].concat(formula.keywords || []).join(' '),
        url: formula.url || (formula.pointTitle ? '/modules/knowledge-detail.html?query=' + encodeURIComponent(formula.pointTitle) : ''),
        category: formula.category,
        sourceFormula: formula
      });
    });
    return out;
  }

  function markdownPreview(markdown, limit) {
    return String(markdown || '')
      .replace(/\$\$[\s\S]*?\$\$/g, ' ')
      .replace(/^#+\s*/gm, '')
      .replace(/[-*_`>#]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, limit || 120);
  }

  function formulaResults() {
    var q = normalizeText(VIEW.formulaQuery);
    var cat = VIEW.formulaCategory;
    var list = DATA.formulas.filter(function(formula) {
      if (cat !== 'all' && formula.category !== cat) return false;
      if (!q) return true;
      var hay = normalizeText([formula.title, formula.formula, formula.pointTitle, formula.category, toArray(formula.keywords).join(' ')].join(' '));
      return hay.indexOf(q) >= 0 || q.split(' ').every(function(part) { return hay.indexOf(part) >= 0; });
    });
    list.sort(function(a, b) {
      var aq = (a.relatedQuestions || []).length + (a.upgrade ? 10 : 0);
      var bq = (b.relatedQuestions || []).length + (b.upgrade ? 10 : 0);
      return bq - aq;
    });
    return list.slice(0, VIEW.listLimit);
  }

  function safeUrl(url) {
    var value = String(url || '').trim();
    if (!value) return '';
    if (/^(javascript|data):/i.test(value)) return '';
    return value;
  }

  function teacherUrl(url, sourceId) {
    var value = safeUrl(url);
    if (!value || value.charAt(0) === '#') return value;
    try {
      var parsed = new URL(value, global.location.origin);
      if (parsed.origin !== global.location.origin) return value;
      if (/\/modules\/knowledge(?:-detail|-upgrade-2026)?\.html$/.test(parsed.pathname)) {
        parsed.searchParams.set('from', 'teacher-workbench');
        if (sourceId) parsed.searchParams.set('focus', String(sourceId).slice(0, 80));
      }
      return parsed.pathname + parsed.search + parsed.hash;
    } catch (_) {
      return value;
    }
  }

  function rememberLearningLink(anchor) {
    try {
      if (!anchor || !anchor.getAttribute) return;
      var href = safeUrl(anchor.getAttribute('href'));
      if (!href || href.charAt(0) === '#') return;
      if (!/(knowledge|real-exams|practice|resources|fluid-intensive-training)/.test(href)) return;
      var label = normalizeText(anchor.textContent || anchor.getAttribute('aria-label') || href).slice(0, 42);
      writeJSON(LAST_LINK_KEY, {
        href: href,
        label: label || href,
        at: now()
      });
    } catch (_) {}
  }

  function readLastLearningLink() {
    var item = readJSON(LAST_LINK_KEY, null);
    if (!item || !item.href) return null;
    return item;
  }

  function statusClass(status) {
    status = String(status || 'todo').replace(/[^a-z]/g, '') || 'todo';
    return 'is-' + status;
  }

  function toast(message) {
    try {
      if (global.FMUI && typeof global.FMUI.ok === 'function') {
        global.FMUI.ok(message, 1800);
        return;
      }
    } catch (_) {}
    if (!mountNode) return;
    var note = document.createElement('div');
    note.className = 'eflu-toast';
    note.setAttribute('role', 'status');
    note.setAttribute('aria-live', 'polite');
    note.textContent = message;
    mountNode.appendChild(note);
    setTimeout(function() {
      note.classList.add('is-out');
      setTimeout(function() { if (note.parentNode) note.parentNode.removeChild(note); }, 240);
    }, 1600);
  }

  function ensureMount() {
    var node = document.querySelector('[data-edge-fluid-upgrade-root]');
    if (!node) {
      node = document.getElementById(ROOT_ID);
      if (node && node.classList && node.classList.contains('round263-fluid-exam-route-map')) {
        var child = node.querySelector('[data-edge-fluid-learning-root]');
        if (!child) {
          child = document.createElement('section');
          child.setAttribute('data-edge-fluid-learning-root', '');
          child.setAttribute('aria-label', '学习交互升级');
          node.appendChild(child);
        }
        node = child;
      }
    }
    if (node) return node;

    node = document.createElement('section');
    node.id = ROOT_ID;
    node.setAttribute('aria-label', '学习交互升级');

    var authed = document.getElementById('vAuthed');
    if (authed) {
      var hub = authed.querySelector('.hub');
      if (hub && hub.parentNode) hub.parentNode.insertBefore(node, hub.nextSibling);
      else authed.insertBefore(node, authed.firstChild);
      return node;
    }

    var host = document.querySelector('main') || document.querySelector('.container') || document.querySelector('.wrap') || document.body;
    host.appendChild(node);
    return node;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.eflu{--eflu-ink:#0a1628;--eflu-soft:#526173;--eflu-muted:#7b8da6;--eflu-line:rgba(15,34,56,.12);--eflu-bg:#f7fafc;--eflu-surface:#ffffff;--eflu-surface-2:#f1f6f8;--eflu-teal:#0f9f8d;--eflu-teal-2:#14b8a6;--eflu-coral:#f97316;--eflu-indigo:#4658b8;--eflu-ok:#10b981;--eflu-warn:#f59e0b;--eflu-err:#ef4444;--eflu-shadow:0 16px 40px rgba(15,34,56,.10);color:var(--eflu-ink);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Noto Sans SC","Segoe UI",sans-serif;letter-spacing:0;margin:28px 0 34px;}',
      '[data-theme="dark"] .eflu,.eflu[data-dark="1"]{--eflu-ink:#e7eef8;--eflu-soft:#b5c4d6;--eflu-muted:#8295aa;--eflu-line:rgba(190,205,225,.16);--eflu-bg:#071521;--eflu-surface:#102438;--eflu-surface-2:#0b1c2d;--eflu-shadow:0 20px 50px rgba(0,0,0,.36);}',
      '.eflu *{box-sizing:border-box;letter-spacing:0;}',
      '.eflu a{color:inherit;text-decoration:none;}',
      '.eflu button,.eflu input,.eflu textarea{font:inherit;}',
      '.eflu button{cursor:pointer;}',
      '.eflu-hero{position:relative;overflow:hidden;border:1px solid var(--eflu-line);background:linear-gradient(135deg,color-mix(in srgb,var(--eflu-surface) 94%,#14b8a6 6%),var(--eflu-surface));box-shadow:var(--eflu-shadow);padding:22px;border-radius:8px;}',
      '.eflu-hero:before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,rgba(20,184,166,.13),transparent 42%,rgba(249,115,22,.11));pointer-events:none;}',
      '.eflu-hero-in{position:relative;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:20px;align-items:center;}',
      '.eflu-kicker{display:inline-flex;align-items:center;gap:8px;color:var(--eflu-teal);font-weight:750;font-size:.82rem;text-transform:uppercase;}',
      '.eflu-dot{width:7px;height:7px;border-radius:999px;background:var(--eflu-teal-2);box-shadow:0 0 0 5px rgba(20,184,166,.15);}',
      '.eflu h2{margin:6px 0 8px;font-size:1.75rem;line-height:1.18;color:var(--eflu-ink);font-weight:800;}',
      '.eflu p{margin:0;color:var(--eflu-soft);line-height:1.65;}',
      '.eflu-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;}',
      '.eflu-chip,.eflu-tab,.eflu-seg{border:1px solid var(--eflu-line);background:color-mix(in srgb,var(--eflu-surface) 82%,transparent);color:var(--eflu-soft);min-height:34px;border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;gap:7px;font-weight:700;font-size:.86rem;}',
      '.eflu-chip strong{color:var(--eflu-ink);font-weight:800;}',
      '.eflu-review-rail{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:14px 0 2px;}',
      '.eflu-review-step{min-width:0;min-height:74px;border:1px solid var(--eflu-line);background:color-mix(in srgb,var(--eflu-surface) 86%,transparent);border-radius:8px;padding:10px;display:grid;align-content:start;gap:4px;overflow-wrap:anywhere;}',
      '.eflu-review-step small{font-size:.68rem;font-weight:900;letter-spacing:.07em;color:var(--eflu-coral);}',
      '.eflu-review-step b{font-size:.88rem;line-height:1.25;color:var(--eflu-ink);}',
      '.eflu-review-step span{font-size:.76rem;line-height:1.42;color:var(--eflu-muted);}',
      '.eflu-hero-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}',
      '.eflu-stat{min-height:82px;border:1px solid var(--eflu-line);background:rgba(255,255,255,.58);border-radius:8px;padding:14px;display:grid;align-content:center;gap:4px;}',
      '[data-theme="dark"] .eflu-stat,.eflu[data-dark="1"] .eflu-stat{background:rgba(255,255,255,.04);}',
      '.eflu-stat b{font-size:1.55rem;line-height:1;color:var(--eflu-ink);}',
      '.eflu-stat span{color:var(--eflu-muted);font-size:.82rem;font-weight:700;}',
      '.eflu-tabs{margin:16px 0 18px;display:flex;gap:8px;overflow:auto;padding:2px 2px 8px;}',
      '.eflu-tabs,.eflu-segs,.eflu-anchor-strip{scrollbar-width:thin;scroll-snap-type:x proximity;}',
      '.eflu-tab,.eflu-seg,.eflu-anchor{scroll-snap-align:start;}',
      '.eflu-tab{background:var(--eflu-surface);white-space:nowrap;min-height:40px;}',
      '.eflu-tab.is-active{color:#fff;border-color:transparent;background:linear-gradient(135deg,var(--eflu-teal),var(--eflu-indigo));box-shadow:0 10px 24px rgba(20,184,166,.22);}',
      '.eflu-tab:focus-visible,.eflu-btn:focus-visible,.eflu-icon-btn:focus-visible,.eflu-anchor:focus-visible,.eflu-seg:focus-visible,.eflu-clue-chip:focus-visible,.eflu-input:focus-visible,.eflu-textarea:focus-visible,.eflu-tabpanel:focus-visible{outline:3px solid color-mix(in srgb,var(--eflu-teal) 72%,#fff);outline-offset:3px;box-shadow:0 0 0 6px color-mix(in srgb,var(--eflu-teal) 18%,transparent);}',
      '.eflu-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start;}',
      '.eflu-panel{background:transparent;border:0;padding:0;margin:0;}',
      '.eflu-panel-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin:0 0 10px;}',
      '.eflu-panel-head h3{margin:0;color:var(--eflu-ink);font-size:1.08rem;}',
      '.eflu-panel-head p{font-size:.9rem;}',
      '.eflu-tiles{display:grid;gap:10px;}',
      '.eflu-tile{border:1px solid var(--eflu-line);background:var(--eflu-surface);border-radius:8px;padding:14px;min-width:0;box-shadow:0 8px 24px rgba(15,34,56,.06);}',
      '[data-theme="dark"] .eflu-tile,.eflu[data-dark="1"] .eflu-tile{box-shadow:none;}',
      '.eflu-tile-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}',
      '.eflu-title{font-weight:800;color:var(--eflu-ink);line-height:1.4;word-break:break-word;}',
      '.eflu-desc{font-size:.9rem;color:var(--eflu-soft);margin-top:5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}',
      '.eflu-tagrow{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}',
      '.eflu-tag{display:inline-flex;align-items:center;min-height:24px;border-radius:999px;padding:0 8px;background:var(--eflu-surface-2);color:var(--eflu-muted);font-size:.76rem;font-weight:750;line-height:1.35;max-width:100%;overflow-wrap:anywhere;word-break:break-word;white-space:normal;}',
      '.eflu-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}',
      '.eflu-path-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;}',
      '.eflu-btn,.eflu-icon-btn{border:1px solid var(--eflu-line);background:var(--eflu-surface);color:var(--eflu-ink);min-height:36px;border-radius:999px;padding:0 12px;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-weight:800;font-size:.86rem;line-height:1.35;max-width:100%;white-space:normal;text-align:center;transition:transform .16s ease,border-color .16s ease,background .16s ease;}',
      '.eflu-icon-btn{width:36px;padding:0;}',
      '.eflu-btn:hover,.eflu-icon-btn:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--eflu-teal) 60%,var(--eflu-line));}',
      '.eflu-btn[data-tone="primary"]{border-color:transparent;color:#fff;background:linear-gradient(135deg,var(--eflu-teal),var(--eflu-teal-2));}',
      '.eflu-btn[data-tone="coral"]{border-color:transparent;color:#fff;background:linear-gradient(135deg,var(--eflu-coral),#ea580c);}',
      '.eflu-btn[data-tone="danger"]{border-color:rgba(239,68,68,.25);color:var(--eflu-err);}',
      '.eflu-ico{width:16px;height:16px;flex:0 0 16px;}',
      '.eflu-progress{height:9px;border-radius:999px;background:var(--eflu-surface-2);overflow:hidden;border:1px solid var(--eflu-line);}',
      '.eflu-progress i{display:block;height:100%;width:var(--p,0%);border-radius:999px;background:linear-gradient(90deg,var(--eflu-teal),var(--eflu-coral));}',
      '.eflu-path-list{display:grid;gap:8px;}',
      '.eflu-path-row{display:grid;grid-template-columns:minmax(120px,.5fr) minmax(140px,1fr) auto;gap:10px;align-items:center;border:1px solid var(--eflu-line);background:var(--eflu-surface);border-radius:8px;padding:12px;}',
      '.eflu-path-row b{font-size:.92rem;color:var(--eflu-ink);}',
      '.eflu-path-row span{font-size:.8rem;color:var(--eflu-muted);font-weight:700;}',
      '.eflu-segs{display:flex;gap:8px;overflow:auto;padding-bottom:8px;margin-bottom:12px;}',
      '.eflu-seg.is-active{border-color:transparent;background:var(--eflu-ink);color:var(--eflu-surface);}',
      '.eflu-inputbar{display:flex;gap:10px;margin:0 0 14px;}',
      '.eflu-inputbar label{position:relative;flex:1;min-width:0;}',
      '.eflu-inputbar label>.eflu-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--eflu-muted);}',
      '.eflu-input,.eflu-textarea{width:100%;border:1px solid var(--eflu-line);background:var(--eflu-surface);color:var(--eflu-ink);border-radius:8px;padding:11px 12px;outline:0;min-height:42px;}',
      '.eflu-input{padding-left:38px;}',
      '.eflu-input:focus,.eflu-textarea:focus{border-color:var(--eflu-teal);box-shadow:0 0 0 4px rgba(20,184,166,.12);}',
      '.eflu-textarea{resize:vertical;min-height:84px;line-height:1.55;}',
      '.eflu-formula{font-family:"SF Mono","JetBrains Mono","Consolas",monospace;font-size:.88rem;line-height:1.62;padding:12px;border-radius:8px;background:var(--eflu-surface-2);border:1px solid var(--eflu-line);overflow:auto;white-space:pre-wrap;word-break:break-word;color:var(--eflu-ink);}',
      '.eflu-empty{border:1px dashed var(--eflu-line);border-radius:8px;padding:20px;text-align:center;color:var(--eflu-muted);background:color-mix(in srgb,var(--eflu-surface) 68%,transparent);line-height:1.58;}',
      '.eflu-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:16px;}',
      '.eflu-kpi{border:1px solid var(--eflu-line);background:var(--eflu-surface);border-radius:8px;padding:14px;min-height:86px;}',
      '.eflu-kpi b{display:block;font-size:1.45rem;line-height:1.15;color:var(--eflu-ink);}',
      '.eflu-kpi span{display:block;margin-top:4px;color:var(--eflu-muted);font-size:.8rem;font-weight:750;}',
      '.eflu-review-due{display:inline-flex;align-items:center;gap:6px;color:var(--eflu-warn);font-weight:800;}',
      '.eflu-review-ok{display:inline-flex;align-items:center;gap:6px;color:var(--eflu-ok);font-weight:800;}',
      '.eflu-split-form{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;}',
      '.eflu-route-board{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:16px;align-items:start;}',
      '.eflu-clue-chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 14px;}',
      '.eflu-clue-chip{border:1px solid var(--eflu-line);background:var(--eflu-surface);color:var(--eflu-soft);border-radius:999px;min-height:32px;padding:6px 10px;font-size:.8rem;font-weight:800;line-height:1.35;max-width:100%;overflow-wrap:anywhere;word-break:break-word;white-space:normal;text-align:left;}',
      '.eflu-clue-chip.is-active{border-color:var(--eflu-teal);background:color-mix(in srgb,var(--eflu-surface) 82%,var(--eflu-teal) 18%);color:var(--eflu-ink);}',
      '.eflu-route-note{border-left:4px solid var(--eflu-coral);background:var(--eflu-surface);border-radius:8px;padding:12px 13px;color:var(--eflu-soft);line-height:1.62;}',
      '.eflu-route-note b{display:block;color:var(--eflu-ink);margin-bottom:3px;}',
      '.eflu-step-list{counter-reset:eflu-step;display:grid;gap:8px;margin:10px 0 0;padding:0;list-style:none;}',
      '.eflu-step{position:relative;border:1px solid var(--eflu-line);background:var(--eflu-surface);border-radius:8px;padding:11px 12px 11px 42px;color:var(--eflu-soft);line-height:1.55;min-width:0;overflow-wrap:anywhere;word-break:break-word;}',
      '.eflu-step:before{counter-increment:eflu-step;content:counter(eflu-step);position:absolute;left:12px;top:12px;width:20px;height:20px;border-radius:999px;display:grid;place-items:center;background:var(--eflu-teal);color:#fff;font-size:.75rem;font-weight:900;}',
      '.eflu-route-empty{border:1px dashed var(--eflu-line);border-radius:8px;padding:14px;color:var(--eflu-muted);line-height:1.62;}',
      '.eflu-teacher-hint{display:flex;align-items:flex-start;gap:10px;margin:14px 0;padding:13px 14px;border:1px solid var(--eflu-line);border-left:4px solid var(--eflu-teal);border-radius:8px;background:color-mix(in srgb,var(--eflu-surface) 90%,var(--eflu-surface-2));color:var(--eflu-soft);line-height:1.6;}',
      '.eflu-teacher-hint strong{display:block;color:var(--eflu-ink);font-size:.9rem;margin-bottom:2px;}',
      '.eflu-teacher-hint span{display:block;font-size:.88rem;}',
      '.eflu-anchor-strip{display:flex;gap:8px;overflow:auto;padding:2px 2px 10px;margin:0 0 8px;scrollbar-width:thin;}',
      '.eflu-anchor{border:1px solid var(--eflu-line);background:var(--eflu-surface);color:var(--eflu-soft);min-height:38px;border-radius:8px;padding:7px 10px;display:inline-grid;gap:1px;align-content:center;white-space:nowrap;text-align:left;font-weight:760;}',
      '.eflu-anchor small{font-size:.72rem;color:var(--eflu-muted);font-weight:700;}',
      '.eflu-anchor.is-active{border-color:var(--eflu-teal);background:color-mix(in srgb,var(--eflu-surface) 84%,var(--eflu-teal) 16%);color:var(--eflu-ink);}',
      '.eflu-tile.is-done{border-left:4px solid var(--eflu-ok);}',
      '.eflu-tile.is-learning{border-left:4px solid var(--eflu-teal);}',
      '.eflu-tile.is-weak{border-left:4px solid var(--eflu-warn);}',
      '.eflu-tile.is-todo{border-left:4px solid var(--eflu-line);}',
      '.eflu-btn[aria-pressed="true"]{border-color:var(--eflu-teal);background:color-mix(in srgb,var(--eflu-surface) 82%,var(--eflu-teal) 18%);}',
      '.eflu-quick-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}',
      '.eflu-quick-actions .eflu-btn{min-height:38px;}',
      '.eflu-tabpanel{min-width:0;}',
      '.eflu-r264-guide{border:1px solid var(--eflu-line);border-radius:8px;background:color-mix(in srgb,var(--eflu-surface) 92%,var(--eflu-surface-2));padding:13px;margin:0 0 14px;}',
      '.eflu-r264-head{align-items:flex-start;margin-bottom:10px;}',
      '.eflu-r264-flow{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;list-style:none;}',
      '.eflu-r264-step{flex:1 1 154px;min-width:0;border:1px solid var(--eflu-line);border-left:4px solid var(--eflu-teal);border-radius:8px;background:var(--eflu-surface);padding:10px 11px;color:var(--eflu-soft);}',
      '.eflu-r264-step b{display:block;color:var(--eflu-ink);font-size:.88rem;line-height:1.28;}',
      '.eflu-r264-step span{display:block;margin-top:3px;font-size:.8rem;line-height:1.42;overflow-wrap:anywhere;}',
      '.eflu-r277-sprint{border:1px solid var(--eflu-line);border-left:4px solid var(--eflu-teal);border-radius:8px;background:color-mix(in srgb,var(--eflu-surface) 92%,var(--eflu-teal) 8%);padding:14px;margin:0 0 14px;}',
      '.eflu-r277-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;}',
      '.eflu-r277-card{min-width:0;border:1px solid var(--eflu-line);border-radius:8px;background:var(--eflu-surface);padding:12px;display:grid;gap:9px;}',
      '.eflu-r277-card h4{margin:0;color:var(--eflu-ink);font-size:.92rem;line-height:1.35;}',
      '.eflu-r277-card dl{display:grid;gap:7px;margin:0;}',
      '.eflu-r277-card div{min-width:0;}',
      '.eflu-r277-card dt{font-size:.74rem;font-weight:900;color:var(--eflu-muted);margin:0 0 2px;}',
      '.eflu-r277-card dd{margin:0;color:var(--eflu-soft);font-size:.82rem;line-height:1.45;overflow-wrap:anywhere;}',
      '.eflu-r277-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px;}',
      '.eflu-r278-compare{border:1px solid var(--eflu-line);border-left:4px solid var(--eflu-indigo);border-radius:8px;background:color-mix(in srgb,var(--eflu-surface) 92%,var(--eflu-indigo) 8%);padding:14px;margin:0 0 14px;}',
      '.eflu-r278-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:10px;}',
      '.eflu-r278-metrics .eflu-kpi{min-height:74px;padding:10px;}',
      '.eflu-r278-metrics .eflu-kpi b{font-size:1.2rem;}',
      '.eflu-r278-highlights{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px;}',
      '.eflu-r278-highlights span{display:inline-grid;gap:2px;min-width:104px;border:1px solid var(--eflu-line);border-radius:8px;background:var(--eflu-surface);padding:8px 10px;}',
      '.eflu-r278-highlights b{font-size:.74rem;color:var(--eflu-muted);}',
      '.eflu-r278-highlights em{font-style:normal;color:var(--eflu-ink);font-weight:900;line-height:1.3;}',
      '.eflu-r278-years{display:grid;grid-template-columns:repeat(13,minmax(0,1fr));gap:6px;margin:0 0 10px;}',
      '.eflu-r278-year{min-width:0;border:1px solid var(--eflu-line);border-radius:8px;background:var(--eflu-surface);padding:7px 6px;display:grid;gap:2px;text-align:center;}',
      '.eflu-r278-year b{font-size:.82rem;color:var(--eflu-ink);line-height:1.1;}',
      '.eflu-r278-year small{color:var(--eflu-soft);font-size:.68rem;font-weight:850;line-height:1.2;overflow-wrap:anywhere;}',
      '.eflu-r278-year em{font-style:normal;color:var(--eflu-muted);font-size:.66rem;line-height:1.2;}',
      '.eflu-r278-year[data-r278-year-status="pdf-web-comparable"]{border-color:color-mix(in srgb,var(--eflu-teal) 45%,var(--eflu-line));}',
      '.eflu-r278-year[data-r278-year-status="partial-compare"]{border-color:color-mix(in srgb,var(--eflu-warn) 48%,var(--eflu-line));}',
      '.eflu-r278-year[data-r278-year-status="empty-or-source-missing"]{border-color:color-mix(in srgb,var(--eflu-err) 45%,var(--eflu-line));background:color-mix(in srgb,var(--eflu-surface) 86%,var(--eflu-err) 14%);}',
      '.eflu-r278-year[data-r278-year-status="outside-original-pdf-index"]{border-color:color-mix(in srgb,var(--eflu-indigo) 52%,var(--eflu-line));background:color-mix(in srgb,var(--eflu-surface) 86%,var(--eflu-indigo) 14%);}',
      '.eflu-r278-notes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:0 0 12px;}',
      '.eflu-r278-notes span{display:flex;align-items:flex-start;gap:7px;border:1px solid var(--eflu-line);border-radius:8px;background:var(--eflu-surface);padding:9px 10px;color:var(--eflu-soft);font-size:.8rem;line-height:1.42;}',
      '.eflu-roadmap{border:1px solid var(--eflu-line);border-left:4px solid var(--eflu-coral);border-radius:8px;background:color-mix(in srgb,var(--eflu-surface) 94%,var(--eflu-coral) 6%);padding:14px;margin:0 0 14px;}',
      '.eflu-roadmap-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px;}',
      '.eflu-roadmap-head h3{margin:0;color:var(--eflu-ink);font-size:1rem;line-height:1.3;}',
      '.eflu-roadmap-head p{margin:4px 0 0;color:var(--eflu-soft);font-size:.86rem;line-height:1.45;}',
      '.eflu-roadmap-badge{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;border:1px solid color-mix(in srgb,var(--eflu-coral) 48%,var(--eflu-line));border-radius:999px;padding:6px 10px;background:var(--eflu-surface);font-weight:800;color:var(--eflu-ink);}',
      '.eflu-roadmap-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;}',
      '.eflu-roadmap-lane{min-width:0;border:1px solid var(--eflu-line);border-radius:8px;background:var(--eflu-surface);padding:9px 10px;}',
      '.eflu-roadmap-lane b{display:block;color:var(--eflu-ink);font-size:.84rem;line-height:1.25;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      '.eflu-roadmap-lane span{display:block;margin-top:3px;color:var(--eflu-soft);font-size:.78rem;line-height:1.35;}',
      '.eflu-roadmap-next{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}',
      '.eflu-toast{position:fixed;right:18px;bottom:18px;z-index:99999;background:var(--eflu-ink);color:var(--eflu-surface);border-radius:8px;padding:10px 14px;box-shadow:var(--eflu-shadow);transition:opacity .22s ease,transform .22s ease;}',
      '.eflu-toast.is-out{opacity:0;transform:translateY(8px);}',
      '@media (max-width:900px){.eflu-hero-in,.eflu-grid,.eflu-split-form,.eflu-route-board,.eflu-r277-grid,.eflu-r278-notes{grid-template-columns:1fr;}.eflu-review-rail{grid-template-columns:repeat(2,minmax(0,1fr));}.eflu-kpis,.eflu-r278-metrics{grid-template-columns:repeat(2,minmax(0,1fr));}.eflu-path-row{grid-template-columns:1fr;}.eflu-hero-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.eflu-roadmap-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.eflu-r278-years{grid-template-columns:repeat(4,minmax(0,1fr));}}',
      '@media (pointer:coarse){.eflu-tab,.eflu-seg,.eflu-anchor,.eflu-btn,.eflu-icon-btn,.eflu-clue-chip,.eflu-input{min-height:44px;}.eflu-icon-btn{min-width:44px;}}',
      '@media (max-width:560px){.eflu{margin:18px 0 26px;}.eflu-hero{padding:16px;}.eflu h2{font-size:1.35rem;}.eflu-kpis,.eflu-hero-grid,.eflu-roadmap-grid,.eflu-r278-metrics{grid-template-columns:1fr;}.eflu-r278-years{grid-template-columns:repeat(2,minmax(0,1fr));}.eflu-roadmap-head{display:grid;}.eflu-roadmap-badge{justify-content:center;white-space:normal;}.eflu-review-rail{grid-auto-flow:column;grid-auto-columns:minmax(210px,84%);grid-template-columns:none;overflow-x:auto;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity;padding-bottom:4px;}.eflu-review-step{scroll-snap-align:start;min-height:84px;}.eflu-inputbar{display:grid;}.eflu-inputbar .eflu-btn{width:100%;}.eflu-actions .eflu-btn{flex:1 1 150px;}.eflu-anchor{min-width:138px;}.eflu-tab,.eflu-seg,.eflu-anchor,.eflu-btn,.eflu-icon-btn,.eflu-clue-chip,.eflu-input{min-height:44px;}.eflu-icon-btn{min-width:44px;}.eflu-tile-top{display:grid;}.eflu-clue-chip{flex:1 1 132px;justify-content:center;text-align:center;}.eflu-route-note,.eflu-route-empty{text-align:left;}.eflu-step{padding-left:38px;}.eflu-quick-actions .eflu-btn,.eflu-r264-step{flex:1 1 100%;}}',
      '@media print{.eflu-tabs,.eflu-anchor-strip,.eflu-actions,.eflu-inputbar{display:none!important}.eflu,.eflu-hero,.eflu-tile,.eflu-kpi{box-shadow:none!important;background:#fff!important;color:#111!important}.eflu-grid{grid-template-columns:1fr!important}.eflu-desc{display:block!important;overflow:visible!important}}',
      '@media (prefers-reduced-motion:reduce){.eflu *{transition:none!important;animation:none!important;}}'
    ].join('\n');
    document.head.appendChild(style);
  }

  function render(options) {
    options = options || {};
    if (!mountNode) return;
    mountNode.innerHTML = renderShell();
    refreshMath();
    if (options.focusTab) {
      setTimeout(function() { focusTabButton(VIEW.tab); }, 0);
    }
    if (options.focusRole) {
      var node = mountNode.querySelector('[data-eflu-role="' + options.focusRole + '"]');
      if (node && typeof node.focus === 'function') {
        setTimeout(function() {
          node.focus();
          if (node.setSelectionRange) {
            var len = node.value.length;
            node.setSelectionRange(len, len);
          }
        }, 0);
      }
    }
  }

  function renderShell() {
    var summary = progressSummary();
    return [
      '<div class="eflu" data-version="' + attr(VERSION) + '">',
      renderHero(summary),
      renderTeacherHint(summary),
      renderAnchorStrip(summary),
      renderTabs(),
      DATA.loaded ? renderActiveTab(summary) : renderLoadingTabPanel(),
      '</div>'
    ].join('');
  }

  function renderLoadingTabPanel() {
    return [
      '<div class="eflu-tabpanel" role="tabpanel" id="' + attr(tabPanelId(VIEW.tab)) + '" aria-labelledby="eflu-tab-' + attr(VIEW.tab) + '" tabindex="0">',
      '<div class="eflu-empty" role="status" aria-live="polite">正在加载学习数据；加载完成后会自动出现学习建议。</div>',
      '</div>'
    ].join('');
  }

  function renderHero(summary) {
    var statusText = DATA.upgradeStatus === 'fallback' ? '使用现有资料' : (DATA.upgradeStatus.indexOf('loaded:') === 0 ? '讲义资料已接入' : '资料加载中');
    var checklistStatus = DATA.formulaChecklistStatus === 'loaded' ? '公式条件包已接入' : '条件表兜底中';
    var last = readLastLearningLink();
    return [
      '<header class="eflu-hero">',
      '<div class="eflu-hero-in">',
      '<div>',
      '<span class="eflu-kicker"><span class="eflu-dot"></span>老师讲义工作台</span>',
      '<h2>round292 真题题数锁定，公式条件随后回查</h2>',
      '<p>这里合并知识点、题目路线、公式条件、站内检索和本地复习本。历年真题入口以 round292 题数防合并与来源覆盖账本为准，公式条件包只用于复核适用条件、边界和单位方向。</p>',
      '<div class="eflu-meta">',
      '<span class="eflu-chip">' + icon('target') + '<strong>' + summary.total + '</strong> 知识点</span>',
      '<span class="eflu-chip">' + icon('sigma') + '<strong>' + DATA.formulas.length + '</strong> 公式</span>',
      '<span class="eflu-chip">' + icon('check') + '<strong>' + DATA.formulaChecklist.length + '</strong> 条件卡</span>',
      '<span class="eflu-chip">' + icon('search') + '<strong>' + buildSearchIndex().length + '</strong> 索引</span>',
      '<span class="eflu-chip">' + icon('refresh') + esc(statusText) + '</span>',
      '<span class="eflu-chip">' + icon('note') + esc(checklistStatus) + '</span>',
      last ? '<a class="eflu-chip" href="' + attr(teacherUrl(last.href)) + '">' + icon('clock') + '上次：' + esc(last.label) + '</a>' : '',
      '</div>',
      '<div class="eflu-quick-actions" role="group" aria-label="首页学习入口快捷操作">',
      '<button class="eflu-btn" type="button" data-tone="primary" data-eflu-action="tab" data-tab="formula-checklist" aria-controls="' + attr(tabPanelId('formula-checklist')) + '" aria-label="打开公式条件回查标签">' + icon('check') + '条件回查</button>',
      '<button class="eflu-btn" type="button" data-eflu-action="tab" data-tab="exam-route" aria-controls="' + attr(tabPanelId('exam-route')) + '" aria-label="打开题目路线标签">' + icon('target') + '题目路线</button>',
      '<a class="eflu-btn" data-tone="coral" href="/modules/real-exams-dynamic.html?from=student-workbench-practice" aria-label="进入历年真题和题库练习">' + icon('play') + '真题练习</a>',
      '<a class="eflu-btn" href="/modules/question-bank.html?from=student-workbench-chapters" aria-label="进入题库页，查看六章章节练习入口">' + icon('chart') + '六章题库</a>',
      '<a class="eflu-btn" data-round342-discovery-entry="181103" href="/modules/question-bank.html?focus=181103-material-extracted#questionBanksList" aria-label="进入 181103 资料题库，522 道资料内题和 38 份 HTML 资料可检索">' + icon('external') + '181103 资料</a>',
      '<a class="eflu-btn" data-round342-discovery-entry="wrongbook" href="/index-complete.html#tabsW" aria-label="进入错题本和错因订正入口">' + icon('alert') + '错题订正</a>',
      '<a class="eflu-btn" data-round342-discovery-entry="private-course" href="/resources.html?from=round342-edge-quick#sourceStatus" aria-label="查看私有课程和专属课账号状态，生产恢复仍受 FM_PRIVATE_MEDIA R2 边界约束">' + icon('note') + '私有课程</a>',
      '<button class="eflu-btn" type="button" data-eflu-action="tab" data-tab="formulas" aria-controls="' + attr(tabPanelId('formulas')) + '" aria-label="打开公式速查标签">' + icon('sigma') + '公式速查</button>',
      '<button class="eflu-btn" type="button" data-eflu-action="tab" data-tab="review" aria-controls="' + attr(tabPanelId('review')) + '" aria-label="打开复习本标签">' + icon('bookmark') + '复习本</button>',
      '</div>',
      renderRound274WorkbenchLoop(summary),
      '</div>',
      '<div class="eflu-hero-grid">',
      statBox(summary.pct + '%', '知识掌握率'),
      statBox(summary.due, '今日到期复习'),
      statBox(summary.learning, '学习中'),
      statBox(summary.weak, '薄弱标记'),
      '</div>',
      '</div>',
      '</header>'
    ].join('');
  }

  function teacherTip(summary) {
    if (!DATA.loaded) return '先等资料加载完成，再看今天的建议；弱网时可以直接打开知识全库。';
    if (summary.due > 0) return '先处理到期复习，再开始新内容。到期项做完后，再挑一个薄弱点回到知识页核对定义和条件。';
    if (summary.weak > 0) return '今天先看薄弱标记。每个薄弱点只做三件事：写定义、写适用条件、找一道对应题。';
    if (summary.learning > 0) return '继续收口学习中的知识点。先把正在学的条目改成“掌握”或“薄弱”，再开新章节。';
    if (summary.done === 0) return '从 N-S 主线或第 1 章开始。不要急着刷题，先把变量、假设和边界条件说清楚。';
    return '今天可以从公式抽样里选两条，分别写出来源、适用条件和失效情形。';
  }

  function renderRound274WorkbenchLoop(summary) {
    var steps = [
      ['01', '题干条件', summary.total ? summary.done + '/' + summary.total + ' 知识点已收口' : '先读一个知识点'],
      ['02', '边界条件', summary.weak > 0 ? summary.weak + ' 个薄弱点待核' : '先核定常和壁面条件'],
      ['03', '单位方向', DATA.formulaChecklist.length ? DATA.formulaChecklist.length + ' 张条件卡可查' : '先查公式条件表'],
      ['04', '真题重做', DATA.examRoutes.length ? DATA.examRoutes.length + ' 类题目路线' : '先做本章真题'],
      ['05', '错因订正', summary.due > 0 ? summary.due + ' 项今天到期' : '写清错在条件还是单位']
    ];
    return '<div class="eflu-review-rail" data-round274-workbench-loop="round380-server-progress-persistence-20260617" aria-label="round274 老师复习顺序">' + steps.map(function(step) {
      return '<div class="eflu-review-step"><small>' + esc(step[0]) + '</small><b>' + esc(step[1]) + '</b><span>' + esc(step[2]) + '</span></div>';
    }).join('') + '</div>';
  }

  function renderTeacherHint(summary) {
    return '<aside class="eflu-teacher-hint" aria-label="学习提示">' + icon('note') + '<div><strong>今天先做什么</strong><span>' + esc(teacherTip(summary)) + '</span></div></aside>';
  }

  function renderAnchorStrip(summary) {
    var anchors = [
      ['dashboard', '建议', summary.done + '/' + summary.total + ' 已掌握'],
      ['path', '路径', summary.learning + ' 学习中'],
      ['exam-route', '题目路线', DATA.examRoutes.length + ' 类线索'],
      ['formulas', '公式', DATA.formulas.length + ' 条'],
      ['formula-checklist', '条件表', DATA.formulaChecklist.length + ' 张卡'],
      ['review', '复习', summary.due + ' 到期']
    ];
    return '<nav class="eflu-anchor-strip" aria-label="学习进度锚点">' + anchors.map(function(anchor) {
      var active = VIEW.tab === anchor[0] ? ' is-active' : '';
      return '<button class="eflu-anchor' + active + '" type="button" data-eflu-action="tab" data-tab="' + attr(anchor[0]) + '" aria-controls="' + attr(tabPanelId(anchor[0])) + '" aria-current="' + (active ? 'page' : 'false') + '" aria-pressed="' + (active ? 'true' : 'false') + '" aria-label="' + attr(anchor[1] + '，' + anchor[2]) + '"><span>' + esc(anchor[1]) + '</span><small>' + esc(anchor[2]) + '</small></button>';
    }).join('') + '</nav>';
  }

  function statBox(value, label) {
    return '<div class="eflu-stat"><b>' + esc(value) + '</b><span>' + esc(label) + '</span></div>';
  }

  function renderTabs() {
    var tabs = [
      ['dashboard', 'dashboard', '仪表盘'],
      ['path', 'route', '知识路径'],
      ['exam-route', 'target', '题目路线'],
      ['formulas', 'sigma', '公式速查'],
      ['formula-checklist', 'check', '条件回查'],
      ['search', 'search', '站内搜索'],
      ['review', 'review', '复习状态']
    ];
    return '<nav class="eflu-tabs" role="tablist" aria-label="学习工作台导航" aria-orientation="horizontal">' + tabs.map(function(tab) {
      var active = VIEW.tab === tab[0] ? ' is-active' : '';
      return '<button class="eflu-tab' + active + '" type="button" role="tab" id="eflu-tab-' + attr(tab[0]) + '" aria-selected="' + (active ? 'true' : 'false') + '" aria-controls="' + attr(tabPanelId(tab[0])) + '" tabindex="' + (active ? '0' : '-1') + '" data-eflu-action="tab" data-tab="' + attr(tab[0]) + '" aria-label="' + attr(tab[2] + (active ? '，当前标签' : '')) + '">' + icon(tab[1]) + esc(tab[2]) + '</button>';
    }).join('') + '</nav>';
  }

  function renderActiveTab(summary) {
    var body;
    if (VIEW.tab === 'path') body = renderPathTab();
    else if (VIEW.tab === 'exam-route') body = renderExamRouteTab();
    else if (VIEW.tab === 'formulas') body = renderFormulaTab();
    else if (VIEW.tab === 'formula-checklist') body = renderFormulaChecklistTab();
    else if (VIEW.tab === 'search') body = renderSearchTab();
    else if (VIEW.tab === 'review') body = renderReviewTab();
    else body = renderDashboardTab(summary);
    return '<div class="eflu-tabpanel" role="tabpanel" id="' + attr(tabPanelId(VIEW.tab)) + '" aria-labelledby="eflu-tab-' + attr(VIEW.tab) + '" tabindex="0">' + body + '</div>';
  }

  function renderDashboardTab(summary) {
    var paths = DATA.paths.slice(0, 8);
    var points = suggestedPoints(5);
    var reviews = collectReviews().filter(function(item) { return !item.due || item.due <= now(); }).slice(0, 4);
    return [
      '<div class="eflu-kpis">',
      kpi(summary.done + '/' + summary.total, '已掌握知识点'),
      kpi(summary.reviewTotal, '复习本项目'),
      kpi(DATA.categories.length, '知识板块'),
      kpi(DATA.searchEntries.length, '站内可搜条目'),
      '</div>',
      renderUpgradeRoadmapRadar(),
      renderRound277FormulaConditionSprint(),
      renderRound278PdfWebYearCompare(),
      '<div class="eflu-grid">',
      '<section class="eflu-panel">',
      panelHead('知识路径概览', '按主线板块聚合，优先显示薄弱与学习中内容'),
      '<div class="eflu-path-list">',
      paths.map(renderLearningPathRow).join('') || masteryByCategory().slice(0, 8).map(renderCategoryRow).join('') || empty('暂无知识路径数据'),
      '</div>',
      '</section>',
      '<section class="eflu-panel">',
      panelHead('下一步建议', '根据本地标记和章节顺序生成'),
      '<div class="eflu-tiles">',
      points.map(renderPointTile).join('') || empty('暂无建议'),
      '</div>',
      '</section>',
      '<section class="eflu-panel">',
      panelHead('今日复习', '到期项目来自本脚本复习本，并兼容现有 fm_wrong'),
      '<div class="eflu-tiles">',
      reviews.map(renderReviewTile).join('') || empty('今天没有到期项目'),
      '</div>',
      '</section>',
      '<section class="eflu-panel">',
      panelHead('公式抽样', '高频公式与关联题优先'),
      '<div class="eflu-tiles">',
      DATA.formulas.slice(0, 4).map(renderFormulaTile).join('') || empty('暂无公式索引'),
      '</div>',
      '</section>',
      '</div>'
    ].join('');
  }

  function renderUpgradeRoadmapRadar() {
    var roadmap = DATA.roadmap100;
    if (!roadmap) {
      return '<section class="eflu-roadmap" data-upgrade-roadmap100-status="' + attr(DATA.roadmapStatus) + '" aria-label="百轮升级路线"><div class="eflu-roadmap-head"><div><h3>百轮升级路线正在读取</h3><p>读取失败时不影响知识点、题库和公式使用；发布门禁会继续检查路线账本。</p></div><span class="eflu-roadmap-badge">' + icon('clock') + '等待数据</span></div></section>';
    }
    var laneCounts = Object.create(null);
    roadmap.rounds.forEach(function(item) {
      laneCounts[item.lane] = (laneCounts[item.lane] || 0) + 1;
    });
    var active = roadmap.rounds.find(function(item) { return item.status === 'active'; }) || roadmap.rounds[0];
    var next = roadmap.rounds.filter(function(item) { return item.round > roadmap.currentRound; }).slice(0, 3);
    var lanes = roadmap.lanes.slice(0, 10);
    return [
      '<section class="eflu-roadmap" data-upgrade-roadmap100="' + attr(roadmap.version) + '" aria-label="百轮升级路线">',
      '<div class="eflu-roadmap-head">',
      '<div><h3>百轮升级路线与质量雷达</h3><p>' + esc(roadmap.goal) + '；从 round275 起持续推进，当前重点由路线账本标记，把认证、公式、真题、资源、性能、可访问性和发布验证分开收口。</p></div>',
      '<span class="eflu-roadmap-badge">' + icon('chart') + '当前：round' + esc(roadmap.currentRound) + '</span>',
      '</div>',
      '<div class="eflu-roadmap-grid">',
      lanes.map(function(lane) {
        return '<div class="eflu-roadmap-lane"><b>' + esc(lane.title) + '</b><span>' + esc((laneCounts[lane.id] || 0) + ' 轮 · ' + lane.summary) + '</span></div>';
      }).join(''),
      '</div>',
      '<div class="eflu-roadmap-next" role="list" aria-label="近期升级轮次">',
      renderRoadmapChip(active, '本轮'),
      next.map(function(item) { return renderRoadmapChip(item, '下一轮'); }).join(''),
      '<a class="eflu-btn" href="/data/fluid-upgrade-roadmap-100.json" aria-label="打开完整百轮升级路线数据">' + icon('external') + '完整路线</a>',
      '</div>',
      '</section>'
    ].join('');
  }

  function renderRoadmapChip(item, prefix) {
    if (!item) return '';
    return '<span class="eflu-chip" role="listitem">' + icon(item.status === 'active' ? 'target' : 'check') + esc(prefix + ' round' + item.round + ' · ' + item.focus) + '</span>';
  }

  function firstChecklistText(items, fallback) {
    var text = firstText(toArray(items).slice(0, 2));
    return text || fallback || '先回到题干补齐条件。';
  }

  function round277SprintCards() {
    var preferred = ['连续', '伯努利', '动量'];
    var picked = [];
    preferred.forEach(function(keyword) {
      var found = DATA.formulaChecklist.find(function(item) {
        return normalizeText(item.title + ' ' + toArray(item.aliases).join(' ')).indexOf(normalizeText(keyword)) >= 0;
      });
      if (found && picked.indexOf(found) < 0) picked.push(found);
    });
    DATA.formulaChecklist.forEach(function(item) {
      if (picked.length < 3 && picked.indexOf(item) < 0) picked.push(item);
    });
    return picked.slice(0, 3);
  }

  function renderRound277FormulaConditionSprint() {
    var cards = round277SprintCards();
    if (!cards.length) {
      return '<section class="eflu-r277-sprint" data-round277-formula-sprint="fallback" aria-label="round277 公式条件速核"><div class="eflu-roadmap-head"><div><h3>公式条件速核正在读取</h3><p>条件表暂未取到时，仍可进入完整条件回查标签和知识整理页。</p></div><button class="eflu-btn" type="button" data-eflu-action="tab" data-tab="formula-checklist">' + icon('check') + '条件回查</button></div></section>';
    }
    return [
      '<section class="eflu-r277-sprint" data-round277-formula-sprint="' + attr(VERSION) + '" aria-labelledby="eflu-r277-title" aria-describedby="eflu-r277-desc">',
      '<div class="eflu-roadmap-head">',
      '<div><h3 id="eflu-r277-title">round277 公式条件速核</h3><p id="eflu-r277-desc">先核适用条件、缺条件、单位方向和真题入口；能不能用，比先把式子写出来更重要。</p></div>',
      '<span class="eflu-roadmap-badge">' + icon('check') + esc(cards.length + ' 张速核卡') + '</span>',
      '</div>',
      '<div class="eflu-r277-grid" role="list" aria-label="首页公式条件速核卡">',
      cards.map(renderRound277SprintCard).join(''),
      '</div>',
      '<div class="eflu-r277-actions" role="group" aria-label="round277 公式条件操作">',
      '<button class="eflu-btn" type="button" data-tone="primary" data-eflu-action="tab" data-tab="formula-checklist" aria-controls="' + attr(tabPanelId('formula-checklist')) + '">' + icon('check') + '完整条件回查</button>',
      '<a class="eflu-btn" href="/modules/knowledge-upgrade-2026.html#formula-condition-checklist">' + icon('external') + '知识整理页</a>',
      '<a class="eflu-btn" href="/modules/real-exams-dynamic.html?from=round277-formula-condition-sprint">' + icon('play') + '真题重做</a>',
      '</div>',
      '</section>'
    ].join('');
  }

  function renderRound277SprintCard(item) {
    var route = toArray(item.routeLinks).find(function(link) { return link && link.href; }) || null;
    var routeHref = route && route.href ? route.href : '/modules/knowledge-upgrade-2026.html#formula-condition-checklist';
    return [
      '<article class="eflu-r277-card" role="listitem" aria-label="公式条件速核：' + attr(item.title) + '">',
      '<h4>' + esc(item.title) + '</h4>',
      '<dl>',
      '<div><dt>适用条件</dt><dd>' + esc(firstChecklistText(item.applyConditions, '先确认题干信号和模型假设。')) + '</dd></div>',
      '<div><dt>不能直接用</dt><dd>' + esc(firstChecklistText(toArray(item.notEnoughConditions).concat(item.invalidWhen || []), '条件不全时先补控制体、损失项或密度关系。')) + '</dd></div>',
      '<div><dt>单位方向</dt><dd>' + esc(firstChecklistText(item.unitDirections, '最后核单位、正方向和数量级。')) + '</dd></div>',
      '<div><dt>真题入口</dt><dd>' + esc(route && route.label ? route.label : (item.examEntry || '回到同类真题重做')) + '</dd></div>',
      '</dl>',
      '<div class="eflu-r277-actions">',
      '<button class="eflu-btn" type="button" data-eflu-action="formula-checklist-select" data-checklist-id="' + attr(item.id) + '">' + icon('check') + '查这条</button>',
      '<a class="eflu-btn" href="' + attr(routeHref) + '">' + icon('external') + '入口</a>',
      '</div>',
      '</article>'
    ].join('');
  }

  function round278StatusLabel(status) {
    var labels = {
      'pdf-web-comparable': '题面可对照',
      'partial-compare': '部分可对照',
      'empty-or-source-missing': '缺源/空年',
      'outside-original-pdf-index': '索引外训练',
      'needs-source-review': '来源待复核'
    };
    return labels[status] || '来源待复核';
  }

  function round278HighlightYears(compare) {
    var highlights = compare && compare.summary && compare.summary.highlightYears ? compare.summary.highlightYears : {};
    return [
      { label: '空年', value: toArray(highlights.emptyYears).join('、') || '无' },
      { label: '源缺失', value: toArray(highlights.sourceMissingYears).join('、') || '无' },
      { label: '索引外', value: toArray(highlights.outsideOriginalPdfIndexYears).join('、') || '无' }
    ];
  }

  function renderRound278YearCell(row) {
    var exact = row.exactOrContainedQuestionStems;
    var fuzzy = row.fuzzyAlignedQuestionStems;
    var label = round278StatusLabel(row.status);
    return [
      '<span class="eflu-r278-year" data-r278-year-status="' + attr(row.status) + '" role="listitem" aria-label="' + attr(row.year + ' 年：' + label + '，' + row.questionCount + ' 题') + '">',
      '<b>' + esc(row.year) + '</b>',
      '<small>' + esc(label) + '</small>',
      '<em>' + esc(row.questionCount + '题 · E' + exact + '/F' + fuzzy) + '</em>',
      '</span>'
    ].join('');
  }

  function renderRound278PdfWebYearCompare() {
    var compare = DATA.round278PdfWebYearCompare;
    if (!compare) {
      return [
        '<section class="eflu-r278-compare" data-round278-pdf-web-year-compare="fallback" aria-label="round293 181103 全资料核验账本">',
        '<div class="eflu-roadmap-head">',
        '<div><h3>round293 181103 全资料核验账本正在读取</h3><p>小型汇总数据暂未取到时，资源页仍保留 181103 全资料核验，真题页仍保留 PDF 保真审计、原文颗粒度审计和 release gate 对照脚本；答案仍按待核验参考处理。</p></div>',
        '<a class="eflu-btn" href="/modules/real-exams-dynamic.html?from=round278-pdf-web-year-compare">' + icon('external') + '真题训练</a>',
        '</div>',
        '</section>'
      ].join('');
    }
    var summary = compare.summary;
    var comparableRate = summary.activeQuestionCount ? Math.round(summary.sourceComparableQuestionStems / summary.activeQuestionCount * 100) : 0;
    var highlights = round278HighlightYears(compare);
    var notes = compare.boundaryNotes.slice(0, 4);
    return [
      '<section class="eflu-r278-compare" data-round278-pdf-web-year-compare="' + attr(compare.version) + '" aria-labelledby="eflu-r278-title" aria-describedby="eflu-r278-desc">',
      '<div class="eflu-roadmap-head">',
      '<div><h3 id="eflu-r278-title">round293 181103 全资料核验账本</h3><p id="eflu-r278-desc">先看 181103 资料是否全量进索引，再看原文组题是否按每小题拆开、年份是否在原题册索引内、题面是否可与 OCR/源索引对照；答案仍按待核验参考处理。</p></div>',
      '<span class="eflu-roadmap-badge">' + icon('target') + esc(summary.auditedYearSpan + ' · ' + comparableRate + '% 可比对 · ' + summary.splitGroupedSectionCount + '/' + summary.groupedSectionCount + ' 组题已拆') + '</span>',
      '</div>',
      '<div class="eflu-r278-metrics" aria-label="PDF Web 对照汇总">',
      kpi(summary.activeQuestionCount, '真题/训练题'),
      kpi(summary.webAtomicQuestionCount || summary.sourceComparableQuestionStems, '原文原子题'),
      kpi(summary.splitGroupedSectionCount + '/' + summary.groupedSectionCount, '组题已拆'),
      kpi(summary.strictOriginalAnswerEvidenceCount, '原答案 PDF 严格证据'),
      '</div>',
      '<div class="eflu-r278-highlights" role="list" aria-label="关键年份边界">',
      highlights.map(function(item) {
        return '<span role="listitem"><b>' + esc(item.label) + '</b><em>' + esc(item.value) + '</em></span>';
      }).join(''),
      '<span role="listitem"><b>原题册</b><em>' + esc(summary.originalQuestionPdfYearSpan) + '</em></span>',
      '</div>',
      '<div class="eflu-r278-years" role="list" aria-label="2000 到 2025 年 PDF Web 年份状态">',
      compare.years.map(renderRound278YearCell).join(''),
      '</div>',
      '<div class="eflu-r278-notes" role="list" aria-label="PDF Web 证据边界">',
      notes.map(function(note) { return '<span role="listitem">' + icon('alert') + esc(note) + '</span>'; }).join(''),
      '</div>',
      '<div class="eflu-r277-actions" role="group" aria-label="round278 PDF Web 对照入口">',
      compare.quickLinks.map(function(link) {
        return '<a class="eflu-btn" href="' + attr(link.href) + '">' + icon(link.href.indexOf('/data/') >= 0 ? 'note' : 'external') + esc(link.label) + '</a>';
      }).join(''),
      '</div>',
      '</section>'
    ].join('');
  }

  function kpi(value, label) {
    return '<div class="eflu-kpi"><b>' + esc(value) + '</b><span>' + esc(label) + '</span></div>';
  }

  function panelHead(title, desc) {
    return '<div class="eflu-panel-head"><div><h3>' + esc(title) + '</h3><p>' + esc(desc) + '</p></div></div>';
  }

  function renderCategoryRow(category) {
    return [
      '<div class="eflu-path-row">',
      '<div><b>' + esc(category.name) + '</b><br><span>' + category.done + '/' + category.count + ' 已掌握</span></div>',
      '<div class="eflu-progress" role="progressbar" aria-label="' + attr(category.name) + '进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + clamp(category.pct, 0, 100) + '"><i style="--p:' + clamp(category.pct, 0, 100) + '%"></i></div>',
      '<button class="eflu-btn" type="button" data-eflu-action="category" data-category="' + attr(category.name) + '" aria-label="进入知识板块：' + attr(category.name) + '">' + icon('route') + '进入</button>',
      '</div>'
    ].join('');
  }

  function renderLearningPathRow(path) {
    var progress = pathProgress(path);
    var practiceUrl = path.practiceUrl || '';
    var realExamUrl = path.realExamUrl || '';
    var knowledgeUrl = path.knowledgeUrl || '';
    return [
      '<div class="eflu-path-row">',
      '<div><b>' + esc(path.title) + '</b><br><span>' + esc(path.desc || (progress.count + ' 个知识点')) + '</span></div>',
      '<div class="eflu-progress" role="progressbar" aria-label="' + attr(path.title) + '进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + clamp(progress.pct, 0, 100) + '"><i style="--p:' + clamp(progress.pct, 0, 100) + '%"></i></div>',
      '<div class="eflu-path-actions"><button class="eflu-btn" type="button" data-eflu-action="path-select" data-path-id="' + attr(path.id) + '" aria-label="查看学习路径：' + attr(path.title) + '，已掌握 ' + progress.done + '/' + progress.count + '">' + icon('route') + progress.done + '/' + progress.count + '</button>' + (practiceUrl ? '<a class="eflu-btn" href="' + attr(practiceUrl) + '" aria-label="进入全部真题练习：' + attr(path.title) + '">' + icon('play') + '全部真题练习</a>' : '') + (realExamUrl ? '<a class="eflu-btn" href="' + attr(realExamUrl) + '" aria-label="查看真题包：' + attr(path.title) + '">' + icon('external') + '真题包</a>' : '') + (knowledgeUrl ? '<a class="eflu-btn" href="' + attr(knowledgeUrl) + '" aria-label="打开知识点：' + attr(path.title) + '">' + icon('note') + '知识点</a>' : '') + '</div>',
      '</div>'
    ].join('');
  }

  function renderPointTile(point) {
    var status = pointStatus(point.id);
    var route = teacherUrl(point.url, point.id);
    var keywords = unique((point.keywords || []).concat(point.headings || []).slice(0, 4));
    return [
      '<article class="eflu-tile ' + statusClass(status) + '" data-point-id="' + attr(point.id) + '" data-status="' + attr(status) + '">',
      '<div class="eflu-tile-top">',
      '<div><div class="eflu-title">P' + esc(point.page) + ' ' + esc(point.title) + '</div>',
      '<div class="eflu-desc">' + esc(point.category + ' · ' + markdownPreview(point.markdown, 96)) + '</div></div>',
      '<span class="eflu-tag">' + esc(statusLabel(status)) + '</span>',
      '</div>',
      '<div class="eflu-tagrow">' + keywords.map(function(tag) { return '<span class="eflu-tag">' + esc(tag) + '</span>'; }).join('') + '</div>',
      '<div class="eflu-actions">',
      '<button class="eflu-btn" type="button" aria-pressed="' + (status === 'learning') + '" aria-label="标记为学习中：' + attr(point.title) + '" data-eflu-action="mark-point" data-id="' + attr(point.id) + '" data-status="learning">' + icon('play') + '学习中</button>',
      '<button class="eflu-btn" type="button" aria-pressed="' + (status === 'done') + '" aria-label="标记为掌握：' + attr(point.title) + '" data-tone="primary" data-eflu-action="mark-point" data-id="' + attr(point.id) + '" data-status="done">' + icon('check') + '掌握</button>',
      '<button class="eflu-btn" type="button" aria-pressed="' + (status === 'weak') + '" aria-label="标记为薄弱：' + attr(point.title) + '" data-eflu-action="mark-point" data-id="' + attr(point.id) + '" data-status="weak">' + icon('alert') + '薄弱</button>',
      '<button class="eflu-icon-btn" type="button" title="加入复习本" aria-label="加入复习本：' + attr(point.title) + '" data-eflu-action="review-point" data-id="' + attr(point.id) + '">' + icon('bookmark', '加入复习本') + '</button>',
      route ? '<a class="eflu-icon-btn" title="打开知识页" aria-label="打开知识页：' + attr(point.title) + '" href="' + attr(route) + '">' + icon('external', '打开知识页') + '</a>' : '',
      '</div>',
      '</article>'
    ].join('');
  }

  function renderPathTab() {
    var cats = ['all'].concat(DATA.categories.map(function(cat) { return cat.name; }));
    var selectedPath = DATA.paths.find(function(path) { return path.id === VIEW.pathId; });
    var points = DATA.knowledge.filter(function(point) {
      if (selectedPath) return selectedPath.points.indexOf(point.id) >= 0;
      return VIEW.pathCategory === 'all' || point.category === VIEW.pathCategory;
    }).slice(0, VIEW.listLimit);
    var activeTitle = selectedPath ? selectedPath.title : (VIEW.pathCategory === 'all' ? '推荐知识点' : VIEW.pathCategory);
    return [
      '<div class="eflu-segs" role="group" aria-label="知识板块筛选">',
      cats.map(function(cat) {
        var label = cat === 'all' ? '全部' : cat;
        var active = VIEW.pathCategory === cat ? ' is-active' : '';
        return '<button class="eflu-seg' + active + '" type="button" aria-pressed="' + (active ? 'true' : 'false') + '" data-eflu-action="category" data-category="' + attr(cat) + '">' + esc(label) + '</button>';
      }).join(''),
      '</div>',
      '<div class="eflu-grid">',
      '<section class="eflu-panel">',
      panelHead('路径结构', '升级 JSON 存在时按备考阶段显示，否则按知识分类显示'),
      '<div class="eflu-path-list">',
      DATA.paths.map(renderLearningPathRow).join('') || masteryByCategory().map(renderCategoryRow).join('') || empty('暂无路径结构'),
      '</div>',
      '</section>',
      '<section class="eflu-panel">',
      panelHead(activeTitle, '可直接标记学习状态或加入复习本'),
      '<div class="eflu-tiles">',
      points.map(renderPointTile).join('') || empty('该板块暂无知识点'),
      '</div>',
      VIEW.listLimit < DATA.knowledge.length ? '<div class="eflu-actions"><button class="eflu-btn" type="button" data-eflu-action="more">' + icon('plus') + '加载更多</button></div>' : '',
      '</section>',
      '</div>'
    ].join('');
  }

  function renderExamRouteTab() {
    var route = selectedExamRoute();
    var suggestions = examRouteSuggestions();
    var sourceText = DATA.examRouteMap ? '已接入 round263 题目路线数据' : '题目路线数据未取到，正在用讲义规则';
    return [
      '<div class="eflu-route-board">',
      '<section class="eflu-panel">',
      panelHead('题目线索选择', '先写题干关键词，再看该从哪条公式路线下手'),
      '<div class="eflu-tile">',
      '<div class="eflu-inputbar" role="search" aria-label="题目线索搜索">',
      '<label>' + icon('search') + '<input class="eflu-input" data-eflu-role="exam-clue" value="' + attr(VIEW.examClue) + '" aria-label="输入题目线索" placeholder="输入题目线索，例如 弯管 受力、Bernoulli 水头、Re 相似"></label>',
      '<button class="eflu-btn" type="button" data-eflu-action="clear-exam-clue" aria-label="清空题目线索">' + icon('x') + '清空</button>',
      '</div>',
      '<div class="eflu-clue-chips" role="group" aria-label="题型线索快捷选择">',
      suggestions.map(function(item) {
        var itemRoute = item.route;
        var active = route && itemRoute.id === route.id ? ' is-active' : '';
        var label = itemRoute.triggers.length ? itemRoute.triggers.slice(0, 2).join(' / ') : itemRoute.title;
        return '<button class="eflu-clue-chip' + active + '" type="button" data-eflu-action="exam-route-select" data-route-id="' + attr(itemRoute.id) + '" aria-pressed="' + (active ? 'true' : 'false') + '" aria-label="选择题目路线：' + attr(itemRoute.title || label) + '">' + esc(label) + '</button>';
      }).join('') || '<span class="eflu-tag" role="status">暂无题型规则</span>',
      '</div>',
      '<div class="eflu-route-note"><b>老师提醒</b><span>' + esc(sourceText) + '。题目先找条件，不先背答案；路线只是草稿纸顺序，最后还要回到原题题面和边界条件。</span></div>',
      '</div>',
      '</section>',
      '<section class="eflu-panel">',
      panelHead(route ? route.title : '路线待选择', '公式路线、边界条件、错因检查放在同一张草稿纸上'),
      route ? renderExamRouteDetail(route) : empty('先输入题目线索，或点一个题型标签'),
      '</section>',
      '</div>'
    ].join('');
  }

  function renderExamRouteDetail(route) {
    var chapters = toArray(route.chapters).slice(0, 5);
    var formulas = toArray(route.formulas).slice(0, 5);
    var boundary = toArray(route.boundaryReminders).slice(0, 5);
    var mistakes = toArray(route.mistakeChecks).slice(0, 5);
    var reviewOrder = toArray(route.reviewOrder).slice(0, 6);
    return [
      '<div class="eflu-tiles">',
      '<article class="eflu-tile">',
      '<div class="eflu-tile-top"><div><div class="eflu-title">第一步怎么落笔</div>',
      '<div class="eflu-desc">' + esc(route.routeText || '先圈定题干条件，再选择控制体、公式和边界条件。') + '</div></div>',
      '<span class="eflu-tag">' + esc(route.source === 'round263' ? 'round263' : '讲义规则') + '</span></div>',
      chapters.length ? '<div class="eflu-tagrow">' + chapters.map(function(item) {
        var no = chapterNumber(item);
        return no ? '<a class="eflu-tag" href="' + attr(chapterPracticeUrl(no)) + '" aria-label="进入第 ' + attr(no) + ' 章章节练习">第 ' + esc(no) + ' 章练习</a>' : '<span class="eflu-tag">' + esc(item) + '</span>';
      }).join('') + '</div>' : '',
      '</article>',
      '<article class="eflu-tile">',
      '<div class="eflu-title">公式路线</div>',
      formulas.length ? formulas.map(renderExamFormulaStep).join('') : '<div class="eflu-route-empty">这类题先写条件和控制体；公式索引没有给出明确 ID 时，回到“公式速查”按关键词找。</div>',
      '</article>',
      '<article class="eflu-tile">',
      '<div class="eflu-title">边界条件提醒</div>',
      renderStepList(boundary.length ? boundary : teacherBoundaryFallback()),
      '</article>',
      '<article class="eflu-tile">',
      '<div class="eflu-title">错因检查</div>',
      renderStepList(mistakes.length ? mistakes : teacherMistakeFallback()),
      '</article>',
      '<article class="eflu-tile">',
      '<div class="eflu-title">复习顺序推荐</div>',
      renderStepList(reviewOrder.length ? reviewOrder : teacherReviewFallback()),
      '<div class="eflu-actions">',
      '<button class="eflu-btn" type="button" data-tone="primary" data-eflu-action="review-exam-route" data-route-id="' + attr(route.id) + '" aria-label="把当前题目路线加入复习本">' + icon('bookmark') + '加入复习本</button>',
      '<button class="eflu-btn" type="button" data-eflu-action="tab" data-tab="formulas" aria-label="切换到公式速查">' + icon('sigma') + '查公式</button>',
      '<a class="eflu-btn" href="/modules/real-exams-dynamic.html?from=exam-route" aria-label="打开历年真题训练">' + icon('external') + '去真题训练</a>',
      '</div>',
      '</article>',
      '</div>'
    ].join('');
  }

  function renderExamFormulaStep(item) {
    var formula = item.formula || (findFormulaById(item.id) && findFormulaById(item.id).formula) || '';
    var title = item.title || item.id || '公式';
    return [
      '<div class="eflu-step">',
      '<b>' + esc(title) + '</b>',
      item.note ? '<div class="eflu-desc">' + esc(item.note) + '</div>' : '',
      formula ? renderFormulaBlock(formula) : '<div class="eflu-desc">先按题干条件确认能不能用，再到公式速查补完整写法。</div>',
      '</div>'
    ].join('');
  }

  function renderStepList(items) {
    items = unique(toArray(items)).filter(Boolean).slice(0, 6);
    if (!items.length) return '<div class="eflu-route-empty">暂无明确提醒，先写题干条件、边界和量纲检查。</div>';
    return '<ol class="eflu-step-list" aria-label="步骤清单">' + items.map(function(item) {
      return '<li class="eflu-step">' + esc(item) + '</li>';
    }).join('') + '</ol>';
  }

  function teacherBoundaryFallback() {
    return toArray(DATA.upgrade && DATA.upgrade.teacherBoard && DATA.upgrade.teacherBoard.boundaryConditionGuide).slice(0, 5);
  }

  function teacherMistakeFallback() {
    return toArray(DATA.upgrade && DATA.upgrade.qualityGates).map(function(gate) {
      if (typeof gate === 'string') return gate;
      if (!gate || typeof gate !== 'object') return '';
      return [gate.name || gate.title, gate.check || gate.desc || gate.note].filter(Boolean).join('：');
    }).filter(Boolean).slice(0, 5);
  }

  function teacherReviewFallback() {
    return toArray(DATA.upgrade && DATA.upgrade.teacherBoard && DATA.upgrade.teacherBoard.studyOrder).slice(0, 6);
  }

  function renderFormulaTab() {
    var cats = ['all'].concat(unique(DATA.formulas.map(function(item) { return item.category; })).slice(0, 18));
    var formulas = formulaResults();
    var status = DATA.formulaStatus === 'loaded'
      ? ''
      : '<div class="eflu-route-note" role="status"><b>按需加载</b><span>公式全集正在按需加载；弱网时先显示高频兜底公式，不阻塞页面。</span></div>';
    return [
      status,
      '<div class="eflu-inputbar" role="search" aria-label="公式速查搜索">',
      '<label>' + icon('search') + '<input class="eflu-input" data-eflu-role="formula-query" value="' + attr(VIEW.formulaQuery) + '" aria-label="搜索公式、关键词或章节" placeholder="搜索公式、关键词、章节，例如 Re 或 边界层"></label>',
      '<button class="eflu-btn" type="button" data-eflu-action="clear-formula" aria-label="清空公式搜索">' + icon('x') + '清空</button>',
      '</div>',
      '<div class="eflu-segs" role="group" aria-label="公式分类筛选">',
      cats.map(function(cat) {
        var active = VIEW.formulaCategory === cat ? ' is-active' : '';
        return '<button class="eflu-seg' + active + '" type="button" aria-pressed="' + (active ? 'true' : 'false') + '" data-eflu-action="formula-category" data-category="' + attr(cat) + '">' + esc(cat === 'all' ? '全部' : cat) + '</button>';
      }).join(''),
      '</div>',
      '<section class="eflu-panel">',
      panelHead('公式速查', '公式索引优先；索引缺失时从知识点正文抽取'),
      '<div class="eflu-tiles">',
      formulas.map(renderFormulaTile).join('') || empty('没有匹配的公式'),
      '</div>',
      VIEW.listLimit < DATA.formulas.length ? '<div class="eflu-actions"><button class="eflu-btn" type="button" data-eflu-action="more">' + icon('plus') + '加载更多</button></div>' : '',
      '</section>'
    ].join('');
  }

  function renderFormulaTile(formula) {
    var tags = unique([formula.category].concat(formula.keywords || []).slice(0, 4));
    var related = toArray(formula.relatedQuestions).length;
    var route = teacherUrl(formula.url, formula.id);
    var checklist = findChecklistForFormula(formula);
    return [
      '<article class="eflu-tile" data-formula-id="' + attr(formula.id) + '">',
      '<div class="eflu-tile-top"><div><div class="eflu-title">' + esc(formula.title || formula.pointTitle || '公式') + '</div>',
      '<div class="eflu-desc">' + esc((formula.pointTitle || formula.category || '') + (related ? ' · 关联真题 ' + related + ' 道' : '')) + '</div></div>',
      '<span class="eflu-tag">' + esc(formula.page ? 'P' + formula.page : '公式') + '</span></div>',
      renderFormulaBlock(formula.formula),
      '<div class="eflu-tagrow">' + tags.map(function(tag) { return '<span class="eflu-tag">' + esc(tag) + '</span>'; }).join('') + '</div>',
      '<div class="eflu-actions">',
      '<button class="eflu-btn" type="button" data-tone="primary" data-eflu-action="review-formula" data-id="' + attr(formula.id) + '" aria-label="把公式加入复习本：' + attr(formula.title || formula.pointTitle || '公式') + '">' + icon('bookmark') + '加入复习</button>',
      checklist ? '<button class="eflu-btn" type="button" data-eflu-action="formula-checklist-from-formula" data-checklist-id="' + attr(checklist.id) + '" aria-label="查看适用条件：' + attr(formula.title || formula.pointTitle || '公式') + '">' + icon('check') + '查条件</button>' : '',
      route ? '<a class="eflu-btn" href="' + attr(route) + '" aria-label="打开知识页：' + attr(formula.title || formula.pointTitle || '公式') + '">' + icon('external') + '知识页</a>' : '',
      '</div>',
      '</article>'
    ].join('');
  }

  function renderFormulaChecklistTab() {
    var cats = ['all'].concat(unique(toArray(DATA.formulaChecklist).map(function(item) { return item.category; })).slice(0, 18));
    var results = formulaChecklistResults();
    var selected = selectedFormulaChecklist();
    var sourceText = DATA.formulaChecklistStatus === 'loaded' ? '已接入公式条件历史包' : '条件表文件暂未取到，先用讲义里已有的公式规则兜底';
    var fillText = DATA.visibilityIssues.length ? '<div class="eflu-route-note" role="status"><b>字段可见性</b><span>已自动补齐 ' + esc(DATA.visibilityIssues.length) + ' 个条件卡可见字段，确保适用条件、边界条件、单位方向、错因和补救训练都有入口。</span></div>' : '';
    return [
      renderRound264Flow(),
      '<div class="eflu-route-board">',
      '<section class="eflu-panel">',
      panelHead('公式先问条件', '搜索或点选一条公式，先看能不能用，再看怎么算'),
      '<div class="eflu-tile">',
      '<div class="eflu-inputbar" role="search" aria-label="公式条件搜索">',
      '<label>' + icon('search') + '<input class="eflu-input" data-eflu-role="formula-checklist-query" value="' + attr(VIEW.formulaChecklistQuery) + '" aria-label="搜索公式条件、边界或常见错因" placeholder="输入公式或错因，例如 伯努利 损失、Re 黏度、连续方程 方向"></label>',
      '<button class="eflu-btn" type="button" data-eflu-action="clear-formula-checklist" aria-label="清空公式条件搜索">' + icon('x') + '清空</button>',
      '</div>',
      '<div class="eflu-segs" role="group" aria-label="公式条件分类筛选">',
      cats.map(function(cat) {
        var active = VIEW.formulaChecklistCategory === cat ? ' is-active' : '';
        return '<button class="eflu-seg' + active + '" type="button" aria-pressed="' + (active ? 'true' : 'false') + '" data-eflu-action="formula-checklist-category" data-category="' + attr(cat) + '">' + esc(cat === 'all' ? '全部' : cat) + '</button>';
      }).join(''),
      '</div>',
      '<div class="eflu-clue-chips" role="group" aria-label="公式条件卡快捷选择">',
      results.slice(0, 10).map(function(item) {
        var active = selected && item.id === selected.id ? ' is-active' : '';
        return '<button class="eflu-clue-chip' + active + '" type="button" data-eflu-action="formula-checklist-select" data-checklist-id="' + attr(item.id) + '" aria-pressed="' + (active ? 'true' : 'false') + '" aria-label="选择公式条件卡：' + attr(item.title) + '">' + esc(item.title) + '</button>';
      }).join('') || '<span class="eflu-tag" role="status">暂无匹配公式</span>',
      '</div>',
      '<div class="eflu-route-note"><b>老师提醒</b><span>' + esc(sourceText) + '。考试里公式写错，多半不是公式不会背，而是适用条件、边界或单位方向没核对。</span></div>',
      fillText,
      '</div>',
      '</section>',
      '<section class="eflu-panel">',
      panelHead(selected ? selected.title : '先选一条公式', '适用条件、边界条件、单位方向、常见错因和补救训练放在一起回查'),
      selected ? renderFormulaChecklistDetail(selected) : empty('先输入关键词，或点一个公式标签'),
      '</section>',
      '</div>'
    ].join('');
  }

  function renderRound264Flow() {
    var steps = [
      ['读题选式', '先圈题干条件、要求量和公式入口。'],
      ['公式条件', '确认定常、可压、黏性和控制体。'],
      ['边界控制体', '写清入口、出口、自由面、固壁和外法向。'],
      ['单位方向', '代入前统一单位、压强基准和正方向。'],
      ['错因补救', '做完把错因和补救训练写进复习本。']
    ];
    return [
      '<section class="eflu-r264-guide" aria-labelledby="eflu-r264-guide-title" aria-describedby="eflu-r264-guide-desc">',
      '<div class="eflu-panel-head eflu-r264-head"><div><h3 id="eflu-r264-guide-title">五步公式回查</h3><p id="eflu-r264-guide-desc">选公式前先过这 5 步，减少适用条件、边界和单位方向类失分。</p></div><span class="eflu-tag">5 步</span></div>',
      '<ol class="eflu-r264-flow" aria-label="五步公式回查顺序">',
      steps.map(function(step, index) {
        return '<li class="eflu-r264-step"><b>' + esc(String(index + 1).padStart(2, '0') + ' ' + step[0]) + '</b><span>' + esc(step[1]) + '</span></li>';
      }).join(''),
      '</ol>',
      '</section>'
    ].join('');
  }

  function renderFormulaChecklistDetail(item) {
    var related = item.formulaId ? findFormulaById(item.formulaId) : null;
    var route = teacherUrl(item.url || (related && related.url), item.formulaId || item.id);
    var formulaText = item.formula || (related && related.formula) || '';
    return [
      '<div class="eflu-tiles">',
      '<article class="eflu-tile" aria-label="' + attr(item.title || '公式条件卡') + '">',
      '<div class="eflu-tile-top"><div><div class="eflu-title">' + esc(item.title) + '</div>',
      '<div class="eflu-desc">' + esc(item.teacherNote || '先把条件问完，再决定公式能不能上草稿纸。') + '</div></div>',
      '<span class="eflu-tag">' + esc(item.source === 'round264' ? '公式条件历史包' : (item.source || '公式条件历史包')) + '</span></div>',
      formulaText ? renderFormulaBlock(formulaText) : '',
      '<div class="eflu-tagrow"><span class="eflu-tag">' + esc(item.category || '公式条件') + '</span>' + toArray(item.keywords).slice(0, 3).map(function(tag) { return '<span class="eflu-tag">' + esc(tag) + '</span>'; }).join('') + '</div>',
      '</article>',
      renderChecklistBlock('适用条件', item.applyConditions, '先问题干给没给这些条件。没给，就不能直接套简化式。'),
      renderChecklistBlock('不能直接用 / 缺条件', toArray(item.notEnoughConditions).concat(item.invalidWhen || []), '缺少密度关系、控制体边界或能量损失信息时，先补条件再选式。'),
      renderChecklistBlock('别名归一', item.aliases, '把题干里的俗称、缩写和公式族先归到同一个入口。'),
      renderChecklistBlock('公式形态', item.formulaForms, '先选一般式，再在条件满足时化成一维、不可压或定常简式。'),
      renderChecklistBlock('边界条件', item.boundaryConditions, '边界写错，后面代数再对也会偏。'),
      renderChecklistBlock('单位方向', item.unitDirections, '单位和正方向是最后一道保险，尤其是压强、水头、通量和力。'),
      renderChecklistBlock('常见错因', item.commonMistakes, '看到这些苗头，先停笔回到题面。'),
      renderChecklistBlock('答题骨架', item.answerSkeleton, '按骨架写步骤，避免只代数不交代条件。'),
      renderChecklistBlock('真题入口', [item.examEntry].concat(item.mistakeTags || []), '先从同类真题重做，错因标签用于订正。'),
      renderRouteLinksBlock(item.routeLinks),
      '<article class="eflu-tile" aria-label="补救训练检查项">',
      '<div class="eflu-title">补救训练</div>',
      renderStepList(item.remedialTraining.length ? item.remedialTraining : ['重做一道同类题，只写条件表，不急着算数值。', '把用到的每个量标出单位和正方向。']),
      '<div class="eflu-actions">',
      '<button class="eflu-btn" type="button" data-tone="primary" data-eflu-action="review-formula-checklist" data-checklist-id="' + attr(item.id) + '" aria-label="把条件回查卡加入复习本：' + attr(item.title) + '">' + icon('bookmark') + '加入复习本</button>',
      formulaText ? '<button class="eflu-btn" type="button" data-eflu-action="tab" data-tab="formulas" aria-label="返回公式速查">' + icon('sigma') + '回公式速查</button>' : '',
      route ? '<a class="eflu-btn" href="' + attr(route) + '" aria-label="打开知识页：' + attr(item.title) + '">' + icon('external') + '知识页</a>' : '',
      '</div>',
      '</article>',
      '</div>'
    ].join('');
  }

  function renderRouteLinksBlock(links) {
    links = normalizeChecklistRouteLinks(links);
    if (!links.length) return '';
    function resolveHref(href) {
      var value = String(href || '').trim();
      if (!value) return '';
      if (value.charAt(0) === '#') {
        var id = '';
        try {
          id = decodeURIComponent(value.slice(1));
        } catch (_) {
          id = value.slice(1);
        }
        if (id && typeof document !== 'undefined' && document.getElementById(id)) return value;
        return '/modules/knowledge-upgrade-2026.html' + value;
      }
      return value;
    }
    return [
      '<article class="eflu-tile" aria-label="题目与动画入口">',
      '<div class="eflu-title">题目与动画入口</div>',
      '<div class="eflu-actions">',
      links.map(function(link) {
        var label = link.label || link.href || '相关入口';
        var use = link.use ? '<span class="eflu-desc">' + esc(link.use) + '</span>' : '';
        var href = resolveHref(link.href);
        if (href) {
          return '<a class="eflu-btn" href="' + attr(href) + '" aria-label="' + attr(label) + '">' + icon('external') + esc(label) + '</a>' + use;
        }
        return '<span class="eflu-tag">' + esc(label) + '</span>' + use;
      }).join(''),
      '</div>',
      '</article>'
    ].join('');
  }

  function renderChecklistBlock(title, items, fallback) {
    return [
      '<article class="eflu-tile" aria-label="' + attr(title) + '检查项">',
      '<div class="eflu-title">' + esc(title) + '</div>',
      renderStepList(toArray(items).length ? items : [fallback]),
      '</article>'
    ].join('');
  }

  function renderSearchTab() {
    var results = search(VIEW.siteQuery, { limit: VIEW.listLimit });
    var status = DATA.searchStatus === 'loaded'
      ? ''
      : '<div class="eflu-route-note" role="status"><b>按需加载</b><span>站内搜索索引正在按需加载；当前先用知识点和高频公式兜底搜索。</span></div>';
    return [
      status,
      '<div class="eflu-inputbar" role="search" aria-label="站内搜索">',
      '<label>' + icon('search') + '<input class="eflu-input" data-eflu-role="site-query" value="' + attr(VIEW.siteQuery) + '" aria-label="搜索知识点、真题、公式或资源" placeholder="搜索知识点、真题、公式、资源"></label>',
      '<button class="eflu-btn" type="button" data-eflu-action="clear-search" aria-label="清空站内搜索">' + icon('x') + '清空</button>',
      '</div>',
      '<section class="eflu-panel">',
      panelHead('站内搜索', '合并首页索引、知识点与公式索引'),
      '<div class="eflu-tiles">',
      results.map(renderSearchResult).join('') || empty('没有匹配结果'),
      '</div>',
      VIEW.listLimit < buildSearchIndex().length ? '<div class="eflu-actions"><button class="eflu-btn" type="button" data-eflu-action="more">' + icon('plus') + '加载更多</button></div>' : '',
      '</section>'
    ].join('');
  }

  function renderSearchResult(result) {
    var item = result.item || result;
    return [
      '<article class="eflu-tile">',
      '<div class="eflu-tile-top">',
      '<div><div class="eflu-title">' + esc(item.title) + '</div>',
      '<div class="eflu-desc">' + esc(item.desc || item.keywords || '') + '</div></div>',
      '<span class="eflu-tag">' + esc(item.type || '结果') + '</span>',
      '</div>',
      '<div class="eflu-actions">',
      item.url ? '<a class="eflu-btn" data-eflu-track-link="1" href="' + attr(safeUrl(item.url)) + '" aria-label="打开搜索结果：' + attr(item.title) + '">' + icon('external') + '打开</a>' : '',
      item.sourcePoint ? '<button class="eflu-btn" type="button" data-eflu-action="review-point" data-id="' + attr(item.sourcePoint.id) + '" aria-label="把搜索结果加入复习本：' + attr(item.title) + '">' + icon('bookmark') + '复习</button>' : '',
      item.sourceFormula ? '<button class="eflu-btn" type="button" data-eflu-action="review-formula" data-id="' + attr(item.sourceFormula.id) + '" aria-label="把公式搜索结果加入复习本：' + attr(item.title) + '">' + icon('bookmark') + '复习</button>' : '',
      '</div>',
      '</article>'
    ].join('');
  }

  function renderReviewTab() {
    var reviews = collectReviews();
    var due = reviews.filter(function(item) { return !item.due || item.due <= now(); });
    return [
      '<div class="eflu-kpis">',
      kpi(reviews.length, '复习本总数'),
      kpi(due.length, '今日到期'),
      kpi(reviews.filter(function(item) { return item.source === 'fm_wrong'; }).length, '兼容错题'),
      kpi(readJSON(EVENT_KEY, []).length || 0, '本地埋点'),
      '</div>',
      '<div class="eflu-grid">',
      '<section class="eflu-panel">',
      panelHead('快速记录', '把临时错题、公式或提醒加入本地复习状态'),
      renderCustomReviewForm(),
      '</section>',
      '<section class="eflu-panel">',
      panelHead('到期复习', '按 SM-2 间隔重复更新下次复习时间'),
      '<div class="eflu-tiles">',
      (due.length ? due : reviews.slice(0, 8)).map(renderReviewTile).join('') || empty('复习本为空'),
      '</div>',
      '</section>',
      '</div>'
    ].join('');
  }

  function renderCustomReviewForm() {
    return [
      '<div class="eflu-tile">',
      '<div class="eflu-split-form">',
      '<input class="eflu-input" style="padding-left:12px" data-eflu-role="custom-title" aria-label="错题或复习标题" placeholder="错题或复习标题">',
      '<input class="eflu-input" style="padding-left:12px" data-eflu-role="custom-category" aria-label="复习来源或章节" placeholder="来源/章节">',
      '</div>',
      '<textarea class="eflu-textarea" data-eflu-role="custom-detail" aria-label="记录易错点、公式条件或复习提示" placeholder="记录易错点、公式条件或复习提示"></textarea>',
      '<div class="eflu-actions">',
      '<button class="eflu-btn" data-tone="primary" type="button" data-eflu-action="add-custom-review" aria-label="把这条自定义记录加入复习本">' + icon('plus') + '加入复习本</button>',
      '</div>',
      '</div>'
    ].join('');
  }

  function renderReviewTile(item) {
    var due = !item.due || item.due <= now();
    var dueText = due ? '<span class="eflu-review-due">' + icon('clock') + '今天</span>' : '<span class="eflu-review-ok">' + icon('clock') + formatDate(item.due) + '</span>';
    var detail = item.formula || item.detail || item.category || '';
    return [
      '<article class="eflu-tile" data-review-id="' + attr(item.id) + '">',
      '<div class="eflu-tile-top">',
      '<div><div class="eflu-title">' + esc(item.title) + '</div>',
      '<div class="eflu-desc">' + esc(detail) + '</div></div>',
      dueText,
      '</div>',
      '<div class="eflu-tagrow">',
      '<span class="eflu-tag">' + esc(item.sourceType || item.category || '复习') + '</span>',
      '<span class="eflu-tag">复习 ' + esc(item.reviews || 0) + ' 次</span>',
      '<span class="eflu-tag">间隔 ' + esc(item.ivl || 0) + ' 天</span>',
      item.due && item.due > now() ? '<span class="eflu-tag">' + esc(daysFromNow(item.due)) + ' 天后</span>' : '',
      '</div>',
      '<div class="eflu-actions">',
      [2, 3, 4, 5].map(function(q) {
        return '<button class="eflu-btn" type="button" data-eflu-action="rate-review" data-id="' + attr(item.id) + '" data-quality="' + q + '" aria-label="给复习项目评分 ' + q + '：' + attr(item.title) + '">' + q + '</button>';
      }).join(''),
      item.url ? '<a class="eflu-icon-btn" title="打开来源" aria-label="打开复习来源：' + attr(item.title) + '" href="' + attr(safeUrl(item.url)) + '">' + icon('external', '打开来源') + '</a>' : '',
      item.source === 'edge' ? '<button class="eflu-icon-btn" type="button" title="移除" aria-label="移除复习项目：' + attr(item.title) + '" data-eflu-action="remove-review" data-id="' + attr(item.id) + '">' + icon('x', '移除') + '</button>' : '',
      '</div>',
      '</article>'
    ].join('');
  }

  function empty(message) {
    return '<div class="eflu-empty" role="status" aria-live="polite">' + esc(message) + '</div>';
  }

  function refreshMath() {
    setTimeout(function() {
      try {
        if (global.FMFormulaLite && typeof global.FMFormulaLite.refresh === 'function') global.FMFormulaLite.refresh(mountNode);
        if (global.FMQueueMath) global.FMQueueMath(mountNode, 300);
        else if (global.MathJax && global.MathJax.typesetPromise) global.MathJax.typesetPromise([mountNode]).catch(function() {});
      } catch (_) {}
    }, 0);
  }

  function handleClick(event) {
    var anyLink = event.target && event.target.closest && event.target.closest('a[href]');
    if (anyLink) rememberLearningLink(anyLink);
    var actionNode = event.target && event.target.closest && event.target.closest('[data-eflu-action]');
    if (!actionNode || !mountNode || !mountNode.contains(actionNode)) {
      var link = event.target && event.target.closest && event.target.closest('[data-eflu-track-link]');
      if (link) track('search_open', { href: link.getAttribute('href') || '' });
      return;
    }
    var action = actionNode.getAttribute('data-eflu-action');
    if (action !== 'rate-review') event.preventDefault();
    if (action === 'tab') {
      setActiveTab(actionNode.getAttribute('data-tab') || 'dashboard');
      VIEW.listLimit = 18;
      track('tab', { tab: VIEW.tab });
      render({ focusTab: true });
      return;
    }
    if (action === 'category') {
      setActiveTab('path');
      VIEW.pathCategory = actionNode.getAttribute('data-category') || 'all';
      VIEW.pathId = '';
      VIEW.listLimit = 18;
      track('path_category', { category: VIEW.pathCategory });
      render();
      return;
    }
    if (action === 'path-select') {
      setActiveTab('path');
      VIEW.pathId = actionNode.getAttribute('data-path-id') || '';
      VIEW.pathCategory = 'all';
      VIEW.listLimit = 18;
      track('path_select', { pathId: VIEW.pathId });
      render();
      return;
    }
    if (action === 'exam-route-select') {
      setActiveTab('exam-route');
      VIEW.selectedExamRoute = actionNode.getAttribute('data-route-id') || '';
      var route = DATA.examRoutes.find(function(item) { return item.id === VIEW.selectedExamRoute; });
      if (route && route.triggers && route.triggers.length) VIEW.examClue = route.triggers.slice(0, 3).join(' ');
      track('exam_route_select', { routeId: VIEW.selectedExamRoute });
      render({ focusRole: 'exam-clue' });
      return;
    }
    if (action === 'formula-category') {
      VIEW.formulaCategory = actionNode.getAttribute('data-category') || 'all';
      VIEW.listLimit = 18;
      track('formula_category', { category: VIEW.formulaCategory });
      render({ focusRole: 'formula-query' });
      return;
    }
    if (action === 'formula-checklist-category') {
      setActiveTab('formula-checklist');
      VIEW.formulaChecklistCategory = actionNode.getAttribute('data-category') || 'all';
      VIEW.selectedFormulaChecklist = '';
      VIEW.listLimit = 18;
      track('formula_checklist_category', { category: VIEW.formulaChecklistCategory });
      render({ focusRole: 'formula-checklist-query' });
      return;
    }
    if (action === 'formula-checklist-select') {
      setActiveTab('formula-checklist');
      VIEW.selectedFormulaChecklist = actionNode.getAttribute('data-checklist-id') || '';
      track('formula_checklist_select', { checklistId: VIEW.selectedFormulaChecklist });
      render({ focusRole: 'formula-checklist-query' });
      return;
    }
    if (action === 'formula-checklist-from-formula') {
      setActiveTab('formula-checklist');
      VIEW.formulaChecklistQuery = '';
      VIEW.formulaChecklistCategory = 'all';
      VIEW.selectedFormulaChecklist = actionNode.getAttribute('data-checklist-id') || '';
      track('formula_checklist_from_formula', { checklistId: VIEW.selectedFormulaChecklist });
      render();
      return;
    }
    if (action === 'mark-point') {
      setPointStatus(actionNode.getAttribute('data-id'), actionNode.getAttribute('data-status') || 'learning');
      return;
    }
    if (action === 'review-point') {
      var point = DATA.knowledge.find(function(item) { return item.id === actionNode.getAttribute('data-id'); });
      if (point) addReviewItem({
        sourceId: point.id,
        sourceType: '知识点',
        title: 'P' + point.page + ' ' + point.title,
        detail: markdownPreview(point.markdown, 140),
        url: point.url,
        category: point.category,
        tags: point.keywords
      });
      return;
    }
    if (action === 'review-formula') {
      var formula = DATA.formulas.find(function(item) { return item.id === actionNode.getAttribute('data-id'); });
      if (formula) addReviewItem({
        sourceId: formula.id,
        sourceType: '公式',
        title: formula.title || formula.pointTitle || '公式复习',
        detail: formula.pointTitle || formula.category,
        formula: formula.formula,
        url: formula.url,
        category: formula.category,
        tags: formula.keywords
      });
      return;
    }
    if (action === 'review-exam-route') {
      var routeItem = DATA.examRoutes.find(function(item) { return item.id === actionNode.getAttribute('data-route-id'); });
      if (routeItem) addReviewItem({
        sourceId: routeItem.id,
        sourceType: '题目路线',
        title: routeItem.title || '题目路线复习',
        detail: routeItem.routeText || toArray(routeItem.triggers).join(' / '),
        category: '题目路线',
        tags: routeItem.triggers
      });
      return;
    }
    if (action === 'review-formula-checklist') {
      var checklistItem = DATA.formulaChecklist.find(function(item) { return item.id === actionNode.getAttribute('data-checklist-id'); });
      if (checklistItem) addReviewItem({
        sourceId: checklistItem.id,
        sourceType: '公式条件',
        title: checklistItem.title || '公式条件回查',
        detail: [
          '适用条件：' + toArray(checklistItem.applyConditions).slice(0, 2).join('；'),
          '常见错因：' + toArray(checklistItem.commonMistakes).slice(0, 2).join('；')
        ].filter(function(text) { return text.replace(/^[^：]+：$/, ''); }).join('。'),
        formula: checklistItem.formula,
        url: checklistItem.url,
        category: checklistItem.category || '公式条件',
        tags: checklistItem.keywords
      });
      return;
    }
    if (action === 'rate-review') {
      rateReviewItem(actionNode.getAttribute('data-id'), actionNode.getAttribute('data-quality'));
      return;
    }
    if (action === 'remove-review') {
      removeReviewItem(actionNode.getAttribute('data-id'));
      return;
    }
    if (action === 'add-custom-review') {
      var titleNode = mountNode.querySelector('[data-eflu-role="custom-title"]');
      var categoryNode = mountNode.querySelector('[data-eflu-role="custom-category"]');
      var detailNode = mountNode.querySelector('[data-eflu-role="custom-detail"]');
      var title = titleNode && titleNode.value;
      if (!String(title || '').trim()) {
        toast('先写一个标题');
        return;
      }
      addReviewItem({
        sourceId: 'custom-' + now(),
        sourceType: '错题',
        title: title,
        detail: detailNode && detailNode.value,
        category: categoryNode && categoryNode.value || '手动记录'
      });
      return;
    }
    if (action === 'clear-search') {
      VIEW.siteQuery = '';
      VIEW.listLimit = 18;
      render({ focusRole: 'site-query' });
      return;
    }
    if (action === 'clear-formula') {
      VIEW.formulaQuery = '';
      VIEW.listLimit = 18;
      render({ focusRole: 'formula-query' });
      return;
    }
    if (action === 'clear-formula-checklist') {
      VIEW.formulaChecklistQuery = '';
      VIEW.selectedFormulaChecklist = '';
      VIEW.listLimit = 18;
      render({ focusRole: 'formula-checklist-query' });
      return;
    }
    if (action === 'clear-exam-clue') {
      VIEW.examClue = '';
      VIEW.selectedExamRoute = '';
      render({ focusRole: 'exam-clue' });
      return;
    }
    if (action === 'more') {
      VIEW.listLimit += 18;
      render();
    }
  }

  function handleKeydown(event) {
    var node = event.target;
    if (!node || !mountNode || !mountNode.contains(node)) return;
    var tabNode = node.closest && node.closest('.eflu-tab[role="tab"]');
    if (!tabNode || !mountNode.contains(tabNode)) return;
    var key = event.key;
    if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Home' && key !== 'End') return;
    event.preventDefault();
    var current = normalizeTab(tabNode.getAttribute('data-tab') || VIEW.tab);
    var index = TAB_ORDER.indexOf(current);
    if (index < 0) index = TAB_ORDER.indexOf(VIEW.tab);
    if (key === 'Home') index = 0;
    else if (key === 'End') index = TAB_ORDER.length - 1;
    else index = (index + (key === 'ArrowRight' ? 1 : -1) + TAB_ORDER.length) % TAB_ORDER.length;
    setActiveTab(TAB_ORDER[index]);
    VIEW.listLimit = 18;
    track('tab_keyboard', { tab: VIEW.tab, key: key });
    render({ focusTab: true });
  }

  var examClueRenderTimer = null;
  var formulaRenderTimer = null;
  var formulaChecklistRenderTimer = null;

  function queueExamClueRender() {
    if (examClueRenderTimer) clearTimeout(examClueRenderTimer);
    examClueRenderTimer = setTimeout(function() {
      examClueRenderTimer = null;
      render({ focusRole: 'exam-clue' });
    }, 160);
  }

  function queueFormulaRender() {
    if (formulaRenderTimer) clearTimeout(formulaRenderTimer);
    formulaRenderTimer = setTimeout(function() {
      formulaRenderTimer = null;
      render({ focusRole: 'formula-query' });
    }, 160);
  }

  function queueFormulaChecklistRender() {
    if (formulaChecklistRenderTimer) clearTimeout(formulaChecklistRenderTimer);
    formulaChecklistRenderTimer = setTimeout(function() {
      formulaChecklistRenderTimer = null;
      render({ focusRole: 'formula-checklist-query' });
    }, 180);
  }

  function handleInput(event) {
    var node = event.target;
    if (!node || !mountNode || !mountNode.contains(node)) return;
    var role = node.getAttribute('data-eflu-role');
    if (role === 'site-query') {
      VIEW.siteQuery = node.value;
      VIEW.listLimit = 18;
      track('search_type', { len: VIEW.siteQuery.length });
      render({ focusRole: 'site-query' });
    } else if (role === 'formula-query') {
      VIEW.formulaQuery = node.value;
      VIEW.listLimit = 18;
      track('formula_search_type', { len: VIEW.formulaQuery.length });
      if (event && event.isComposing) return;
      queueFormulaRender();
    } else if (role === 'formula-checklist-query') {
      VIEW.formulaChecklistQuery = node.value;
      VIEW.selectedFormulaChecklist = '';
      VIEW.listLimit = 18;
      track('formula_checklist_type', { len: VIEW.formulaChecklistQuery.length });
      if (event && event.isComposing) return;
      queueFormulaChecklistRender();
    } else if (role === 'exam-clue') {
      VIEW.examClue = node.value;
      VIEW.selectedExamRoute = '';
      track('exam_clue_type', { len: VIEW.examClue.length });
      if (event && event.isComposing) return;
      queueExamClueRender();
    }
  }

  function handleCompositionEnd(event) {
    var node = event.target;
    if (!node || !mountNode || !mountNode.contains(node)) return;
    var role = node.getAttribute('data-eflu-role');
    if (role === 'formula-query') {
      VIEW.formulaQuery = node.value;
      VIEW.listLimit = 18;
      queueFormulaRender();
    } else if (role === 'formula-checklist-query') {
      VIEW.formulaChecklistQuery = node.value;
      VIEW.selectedFormulaChecklist = '';
      VIEW.listLimit = 18;
      queueFormulaChecklistRender();
    } else if (role === 'exam-clue') {
      VIEW.examClue = node.value;
      VIEW.selectedExamRoute = '';
      queueExamClueRender();
    }
  }

  function bindEvents() {
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('input', handleInput, true);
    document.addEventListener('compositionend', handleCompositionEnd, true);
    global.addEventListener('hashchange', handleHashChange);
    global.addEventListener('storage', handleStorage);
  }

  function unbindEvents() {
    document.removeEventListener('click', handleClick, true);
    document.removeEventListener('keydown', handleKeydown, true);
    document.removeEventListener('input', handleInput, true);
    document.removeEventListener('compositionend', handleCompositionEnd, true);
    global.removeEventListener('hashchange', handleHashChange);
    global.removeEventListener('storage', handleStorage);
  }

  function handleHashChange() {
    if (syncTabFromLocation()) {
      VIEW.listLimit = 18;
      render();
      ensureTabData(VIEW.tab);
    }
  }

  function handleStorage(event) {
    if (!event || (event.key !== STATE_KEY && event.key !== 'fm_wrong')) return;
    if (mountNode) render();
  }

  function init(options) {
    options = options || {};
    markRound241();
    markRound263();
    markRound264();
    syncTabFromLocation();
    if (options.root) mountNode = typeof options.root === 'string' ? document.querySelector(options.root) : options.root;
    if (!mountNode) mountNode = ensureMount();
    injectStyles();
    if (!initialized) {
      initialized = true;
      bindEvents();
    }
    render();
    enhanceRound247SourceFidelity(document);
    loadData().then(function() {
      track('init', { upgradeStatus: DATA.upgradeStatus, points: DATA.knowledge.length, formulas: DATA.formulas.length });
      render();
      ensureTabData(VIEW.tab);
      enhanceRound247SourceFidelity(document);
    });
    return api;
  }

  function refresh() {
    loadPromise = null;
    supplementalPromises = {};
    DATA.loaded = false;
    render();
    return loadData().then(function() {
      track('refresh', { upgradeStatus: DATA.upgradeStatus });
      render();
      ensureTabData(VIEW.tab);
      return DATA;
    });
  }

  function destroy(keepRoot) {
    unbindEvents();
    initialized = false;
    if (!keepRoot && mountNode) mountNode.innerHTML = '';
  }

  function exportState() {
    return {
      version: VERSION,
      state: loadLocalState(),
      events: readJSON(EVENT_KEY, []),
      data: {
        loaded: DATA.loaded,
        upgradeStatus: DATA.upgradeStatus,
        knowledge: DATA.knowledge.length,
        formulas: DATA.formulas.length,
        searchEntries: DATA.searchEntries.length,
        examRoutes: DATA.examRoutes.length,
        routeMapStatus: DATA.routeMapStatus,
        formulaChecklist: DATA.formulaChecklist.length,
        formulaChecklistStatus: DATA.formulaChecklistStatus
      }
    };
  }

  function resetLocalState(userOnly) {
    if (userOnly) {
      var state = loadLocalState();
      delete state.users[currentUserKey()];
      saveLocalState(state);
    } else {
      writeJSON(STATE_KEY, defaultState());
      writeJSON(EVENT_KEY, []);
      memoryState = defaultState();
    }
    track('reset', { userOnly: !!userOnly });
    render();
  }

  if (global.EdgeFluidLearningUpgrade && typeof global.EdgeFluidLearningUpgrade.destroy === 'function') {
    try { global.EdgeFluidLearningUpgrade.destroy(false); } catch (_) {}
  }

  var api = {
    version: VERSION,
    currentEntryVersion: VERSION,
    learningContentVersion: LEARNING_CONTENT_VERSION,
    init: init,
    refresh: refresh,
    destroy: destroy,
    search: search,
    markPoint: setPointStatus,
    addReview: addReviewItem,
    rateReview: rateReviewItem,
    removeReview: removeReviewItem,
    getState: exportState,
    resetLocalState: resetLocalState,
    track: track,
    round247: {
      version: R247_VERSION,
      enhance: enhanceRound247SourceFidelity
    },
    round263: {
      version: R263_VERSION,
      routeUrl: R263_ROUTE_URL,
      routes: function() { return DATA.examRoutes; }
    },
    round264: {
      version: R264_VERSION,
      checklistUrl: R264_FORMULA_CHECKLIST_URL,
      checklist: function() { return DATA.formulaChecklist; }
    },
    data: function() { return DATA; },
    config: {
      rootId: ROOT_ID,
      stateKey: STATE_KEY,
      eventKey: EVENT_KEY,
      dataUrls: DATA_URLS,
      upgradeUrls: UPGRADE_URLS
    }
  };

  global.EdgeFluidLearningUpgrade = api;
  global.EFLU = api;

  function boot() {
    try { init(); } catch (error) {
      DATA.loadErrors.push({ url: 'boot', message: error && error.message ? error.message : 'boot_failed' });
      try { console.warn('[EdgeFluidLearningUpgrade] boot failed', error); } catch (_) {}
    }
    try {
      enhanceRound247SourceFidelity(document);
      watchRound247Targets();
    } catch (_) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})(window, document);
