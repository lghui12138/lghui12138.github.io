/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  流体力学学习平台 · 核心 SDK · fm-core.js v1.6              ║
 * ║                                                              ║
 * ║  统一暴露 15 个全局 API：                                      ║
 * ║    window.FMState      - 跨页面响应式状态                     ║
 * ║    window.FMSync       - 数据导出/导入（带签名校验）           ║
 * ║    window.FMSpacedRep  - SuperMemo SM-2 间隔重复算法          ║
 * ║    window.FMLog        - 学习日志时间序列                     ║
 * ║    window.FMRouter     - hash 路由系统                       ║
 * ║    window.FMA11y       - 无障碍工具集 + 全局快捷键             ║
 * ║    window.FMUI         - 统一 UI 组件 (toast/modal/confirm) ║
 * ║    window.FMSearch     - 模糊搜索引擎（多字段评分）            ║
 * ║    window.FMNet        - 网络层（fetch+重试+离线队列+上传）    ║
 * ║    window.FMChart      - SVG 图表（折线/柱状/热力）            ║
 * ║    window.FMTopBar     - 自动渲染统一顶栏组件                 ║
 * ║    window.FMVisuals    - 流体氛围视觉装饰（极光/流线/网格）    ║
 * ║    window.FMAI         - 流式 AI 助手（OpenAI 协议兼容）      ║
 * ║    window.FMTour       - 引导式教程系统                       ║
 * ║    window.FMFluid      - Canvas 流体粒子动画（真实物理）      ║
 * ║                                                              ║
 * ║  接入：                                                       ║
 * ║    <script src="/lib/fm-core.js?v=round547-181103-proof-depth-upgrade-20260627"></script>                  ║
 * ║                                                              ║
 * ║  Codex 友好：所有 API 都做了类型保护和错误捕获                  ║
 * ╚═══════════════════════════════════════════════════════════╝
 */
(function(global){
'use strict';

// ─────────────────────────────────────────────────────────────
// 0. 类型保护的 localStorage 读写
// ─────────────────────────────────────────────────────────────
function _getJSON(k, fallback) {
  try {
    var x = localStorage.getItem(k);
    if (!x) return fallback;
    var v = JSON.parse(x);
    if (Array.isArray(fallback) && !Array.isArray(v)) return fallback;
    if (fallback && typeof fallback === 'object' && !Array.isArray(fallback) &&
        (v === null || typeof v !== 'object' || Array.isArray(v))) return fallback;
    return v;
  } catch (_) { return fallback; }
}

function _setJSON(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
    return true;
  } catch (e) {
    if (e && e.name === 'QuotaExceededError') {
      try {
        ['fm_activity_log', 'fm_sessions', 'fm_log'].forEach(function(key) {
          var a = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(a) && a.length > 100) {
            localStorage.setItem(key, JSON.stringify(a.slice(-100)));
          }
        });
        localStorage.setItem(k, JSON.stringify(v));
        return true;
      } catch (_) { return false; }
    }
    return false;
  }
}

function _getUser() {
  try {
    if (global.FMSecurity && global.FMSecurity.getUser) {
      var u = global.FMSecurity.getUser();
      return u ? (u.username || u.name) : '_anon';
    }
  } catch (_) {}
  return '_anon';
}

// ─────────────────────────────────────────────────────────────
// 1. FMState · 跨页面响应式状态
// ─────────────────────────────────────────────────────────────
var _subs = {};

var FMState = {
  get: function(k, fallback) { return _getJSON(k, fallback); },
  set: function(k, v) {
    var ok = _setJSON(k, v);
    if (ok) {
      (_subs[k] || []).forEach(function(fn) {
        try { fn(v); } catch (_) {}
      });
      try { global.dispatchEvent(new CustomEvent('fm:state', { detail: { key: k, value: v } })); } catch (_) {}
    }
    return ok;
  },
  on: function(k, fn) {
    if (!_subs[k]) _subs[k] = [];
    _subs[k].push(fn);
    return function unsub() {
      _subs[k] = (_subs[k] || []).filter(function(x) { return x !== fn; });
    };
  },
  off: function(k, fn) {
    if (!_subs[k]) return;
    if (fn) _subs[k] = _subs[k].filter(function(x) { return x !== fn; });
    else delete _subs[k];
  },
  // 跨标签页同步
  _initStorage: function() {
    global.addEventListener('storage', function(e) {
      if (!e.key || !/^fm_/.test(e.key)) return;
      try {
        var v = e.newValue ? JSON.parse(e.newValue) : null;
        (_subs[e.key] || []).forEach(function(fn) {
          try { fn(v); } catch (_) {}
        });
      } catch (_) {}
    });
  }
};
FMState._initStorage();

// ─────────────────────────────────────────────────────────────
// 2. FMSync · 数据导出/导入（SHA-256 签名）
// ─────────────────────────────────────────────────────────────
var SYNC_KEYS = [
  'fm_session_v2', 'fluidMechanicsUser', 'fm_sessions', 'fm_scores',
  'fm_learning_data_v2', 'fm_activity_log', 'fm_theme', 'fm_pomo_v2',
  'fm_goals_v1', 'fm_msg_read', 'fm_notes', 'fm_wrong', 'fm_favs',
  'fm_resources', 'fm_video_progress', 'fm_kn_progress', 'fm_log'
];

async function _sha256(text) {
  try {
    var enc = new TextEncoder().encode(text);
    var buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map(function(b) { return b.toString(16).padStart(2, '0'); })
      .join('');
  } catch (_) { return 'no-hash'; }
}

var FMSync = {
  exportData: async function() {
    var data = {};
    SYNC_KEYS.forEach(function(k) {
      try {
        var v = localStorage.getItem(k);
        if (v !== null) data[k] = v;
      } catch (_) {}
    });
    var payload = {
      v: 1,
      exportedAt: new Date().toISOString(),
      app: 'fluid-mechanics-platform',
      data: data
    };
    var json = JSON.stringify(payload);
    var sig = await _sha256(json);
    var out = Object.assign({}, payload, { sig: sig });
    var blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    a.href = url; a.download = 'fm-backup-' + ts + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
    return { count: Object.keys(data).length, sig: sig };
  },
  
  importData: async function(file) {
    var text = await file.text();
    var payload = JSON.parse(text);
    if (!payload || !payload.data || payload.app !== 'fluid-mechanics-platform') {
      throw new Error('不是有效的备份文件');
    }
    if (payload.sig) {
      var sig = payload.sig;
      var rest = Object.assign({}, payload);
      delete rest.sig;
      var calculated = await _sha256(JSON.stringify(rest));
      if (calculated !== sig) {
        if (!confirm('⚠️ 备份文件签名校验失败（可能被篡改）。仍要导入？')) {
          return { count: 0, tampered: true };
        }
      }
    }
    var count = 0;
    Object.entries(payload.data).forEach(function(entry) {
      var k = entry[0], v = entry[1];
      if (SYNC_KEYS.indexOf(k) >= 0) {
        try { localStorage.setItem(k, v); count++; } catch (_) {}
      }
    });
    return { count: count, tampered: false };
  }
};

// 别名（向后兼容）
FMSync.export = FMSync.exportData;
FMSync.import = FMSync.importData;

// ─────────────────────────────────────────────────────────────
// 3. FMSpacedRep · SuperMemo SM-2 间隔重复
// ─────────────────────────────────────────────────────────────
var FMSpacedRep = {
  /**
   * 应用 SM-2 算法计算下次复习
   * @param {Object} item - 包含 { ef, rep, ivl } 的项目
   * @param {number} q - 评级 [0, 5]
   * @returns {Object} 更新后的 item
   */
  apply: function(item, q) {
    if (!item) return null;
    item = Object.assign({ ef: 2.5, rep: 0, ivl: 0 }, item);
    q = Math.max(0, Math.min(5, Number(q) || 0));
    
    if (q < 3) {
      item.rep = 0;
      item.ivl = 1;
    } else {
      item.rep = (item.rep || 0) + 1;
      if (item.rep === 1) item.ivl = 1;
      else if (item.rep === 2) item.ivl = 6;
      else item.ivl = Math.round((item.ivl || 1) * item.ef);
    }
    
    item.ef = Math.max(1.3, (item.ef || 2.5) + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    item.lastReview = Date.now();
    item.due = Date.now() + item.ivl * 86400000;
    item.reviews = (item.reviews || 0) + 1;
    return item;
  },
  
  dueToday: function(userKey) {
    try {
      var u = userKey || _getUser();
      var all = _getJSON('fm_wrong', {}) || {};
      var list = Array.isArray(all[u]) ? all[u] : [];
      var now = Date.now();
      return list.filter(function(it) { return it && (!it.due || it.due <= now); });
    } catch (_) { return []; }
  },
  
  forecast: function(days, userKey) {
    try {
      var u = userKey || _getUser();
      var all = _getJSON('fm_wrong', {}) || {};
      var list = Array.isArray(all[u]) ? all[u] : [];
      var now = Date.now();
      var buckets = new Array(days || 7).fill(0);
      list.forEach(function(it) {
        if (!it || !it.due) return;
        var d = Math.floor((it.due - now) / 86400000);
        if (d >= 0 && d < buckets.length) buckets[d]++;
      });
      return buckets;
    } catch (_) { return []; }
  },
  
  rate: function(itemId, q, userKey) {
    try {
      var u = userKey || _getUser();
      var all = _getJSON('fm_wrong', {}) || {};
      var list = Array.isArray(all[u]) ? all[u] : [];
      var idx = list.findIndex(function(x) { return x && x.id === itemId; });
      if (idx < 0) return false;
      list[idx] = Object.assign({}, list[idx], FMSpacedRep.apply(list[idx], q));
      all[u] = list;
      var ok = _setJSON('fm_wrong', all);
      if (ok) {
        try { global.dispatchEvent(new CustomEvent('fm:activity')); } catch (_) {}
      }
      return ok;
    } catch (_) { return false; }
  }
};

// ─────────────────────────────────────────────────────────────
// 4. FMLog · 学习日志时间序列
// ─────────────────────────────────────────────────────────────
var FMLog = {
  add: function(action, payload) {
    try {
      var u = _getUser();
      var all = _getJSON('fm_log', {}) || {};
      if (!Array.isArray(all[u])) all[u] = [];
      all[u].push(Object.assign({ a: action, t: Date.now() }, payload || {}));
      if (all[u].length > 1000) all[u] = all[u].slice(-1000);
      return _setJSON('fm_log', all);
    } catch (_) { return false; }
  },
  
  recent: function(n, userKey) {
    try {
      var u = userKey || _getUser();
      var all = _getJSON('fm_log', {}) || {};
      var list = Array.isArray(all[u]) ? all[u] : [];
      return list.slice(-(n || 30)).reverse();
    } catch (_) { return []; }
  },
  
  density: function(days, userKey) {
    try {
      var u = userKey || _getUser();
      var all = _getJSON('fm_log', {}) || {};
      var list = Array.isArray(all[u]) ? all[u] : [];
      var now = new Date(); now.setHours(0, 0, 0, 0);
      var buckets = new Array(days || 28).fill(0);
      list.forEach(function(e) {
        if (!e || !e.t) return;
        var dayDiff = Math.floor((now.getTime() - e.t) / 86400000);
        var idx = buckets.length - 1 - dayDiff;
        if (idx >= 0 && idx < buckets.length) buckets[idx]++;
      });
      return buckets;
    } catch (_) { return []; }
  },
  
  /**
   * 计算连续学习天数（streak）
   */
  streak: function(userKey) {
    try {
      var u = userKey || _getUser();
      var all = _getJSON('fm_log', {}) || {};
      var list = Array.isArray(all[u]) ? all[u] : [];
      if (!list.length) return 0;
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var streak = 0;
      var checkDay = today.getTime();
      for (var i = 0; i < 365; i++) {
        var hit = list.some(function(e) {
          if (!e || !e.t) return false;
          var d = new Date(e.t); d.setHours(0, 0, 0, 0);
          return d.getTime() === checkDay;
        });
        if (hit) streak++;
        else if (i > 0) break;
        checkDay -= 86400000;
      }
      return streak;
    } catch (_) { return 0; }
  },
  
  clear: function(userKey) {
    var u = userKey || _getUser();
    var all = _getJSON('fm_log', {}) || {};
    delete all[u];
    return _setJSON('fm_log', all);
  }
};

// ─────────────────────────────────────────────────────────────
// 5. FMRouter · hash 路由（轻量级）
// ─────────────────────────────────────────────────────────────
var _routes = [];

var FMRouter = {
  /**
   * 注册路由
   * @param {string|RegExp} pattern - hash 模式 (e.g., '#/practice' 或 /^#\/quiz\/(\d+)$/)
   * @param {Function} handler - (params) => void
   */
  on: function(pattern, handler) {
    _routes.push({ pattern: pattern, handler: handler });
    return this;
  },
  
  go: function(hash) {
    if (location.hash !== hash) location.hash = hash;
    else FMRouter._handle();
  },
  
  _handle: function() {
    var h = location.hash || '#/';
    for (var i = 0; i < _routes.length; i++) {
      var r = _routes[i];
      var match;
      if (typeof r.pattern === 'string') {
        if (r.pattern === h) { try { r.handler({}); } catch (_) {} return; }
      } else if (r.pattern instanceof RegExp) {
        match = h.match(r.pattern);
        if (match) { try { r.handler(match.slice(1)); } catch (_) {} return; }
      }
    }
  },
  
  init: function() {
    global.addEventListener('hashchange', FMRouter._handle);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', FMRouter._handle, { once: true });
    } else {
      setTimeout(FMRouter._handle, 0);
    }
  }
};

// ─────────────────────────────────────────────────────────────
// 6. FMA11y · 无障碍/快捷键工具集
// ─────────────────────────────────────────────────────────────
var _shortcuts = [];

var FMA11y = {
  /**
   * 注册快捷键
   * @param {string|string[]} keys - 单键或组合（如 'k', 'ctrl+k', '?'）
   * @param {Function} handler
   * @param {Object} opts - { description, scope }
   */
  shortcut: function(keys, handler, opts) {
    if (typeof keys === 'string') keys = [keys];
    keys.forEach(function(k) {
      _shortcuts.push({
        key: k.toLowerCase(),
        handler: handler,
        description: (opts && opts.description) || '',
        scope: (opts && opts.scope) || 'global'
      });
    });
    return this;
  },
  
  list: function() {
    return _shortcuts.slice();
  },
  
  /**
   * 朗读公告（配合 SR 屏幕阅读器）
   */
  announce: function(message, priority) {
    var el = document.getElementById('fm-a11y-live');
    if (!el) {
      el = document.createElement('div');
      el.id = 'fm-a11y-live';
      el.setAttribute('aria-live', priority || 'polite');
      el.setAttribute('aria-atomic', 'true');
      el.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
      document.body.appendChild(el);
    }
    el.textContent = '';
    setTimeout(function() { el.textContent = message; }, 50);
  }
};

// 初始化全局快捷键监听
function _matchShortcut(e, key) {
  var parts = key.split('+');
  var k = parts[parts.length - 1];
  var needCtrl = parts.indexOf('ctrl') >= 0 || parts.indexOf('cmd') >= 0;
  var needShift = parts.indexOf('shift') >= 0;
  var needAlt = parts.indexOf('alt') >= 0;
  if (needCtrl !== (e.ctrlKey || e.metaKey)) return false;
  if (needShift !== e.shiftKey) return false;
  if (needAlt !== e.altKey) return false;
  return e.key.toLowerCase() === k;
}

document.addEventListener('keydown', function(e) {
  // 在输入框里禁用大部分快捷键（除 ctrl/cmd 组合）
  var target = e.target;
  var tag = (target.tagName || '').toLowerCase();
  var isInput = (tag === 'input' || tag === 'textarea' || target.isContentEditable);
  
  for (var i = 0; i < _shortcuts.length; i++) {
    var s = _shortcuts[i];
    if (_matchShortcut(e, s.key)) {
      var hasMod = /ctrl|cmd|shift|alt/.test(s.key);
      if (isInput && !hasMod) continue;
      try {
        var result = s.handler(e);
        if (result !== false) {
          e.preventDefault();
        }
      } catch (_) {}
      return;
    }
  }
});

// ─────────────────────────────────────────────────────────────
// 7. 暴露到 window
// ─────────────────────────────────────────────────────────────
global.FMState = FMState;
global.FMSync = FMSync;
global.FMSpacedRep = FMSpacedRep;
global.FMLog = FMLog;
global.FMRouter = FMRouter;
global.FMA11y = FMA11y;

// 标志：核心 SDK 已加载
global.FM_CORE_VERSION = '1.0';
global.FM_CORE_LOADED = true;

// ─────────────────────────────────────────────────────────────
// 8. 自动行为：登录后记录浏览
// ─────────────────────────────────────────────────────────────
function _autoLog() {
  try {
    if (global.FMSecurity && global.FMSecurity.isAuthenticated && global.FMSecurity.isAuthenticated()) {
      FMLog.add('view', { path: location.pathname, title: document.title });
    }
  } catch (_) {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { setTimeout(_autoLog, 800); });
} else {
  setTimeout(_autoLog, 800);
}

// ─────────────────────────────────────────────────────────────
// 7. FMUI · 统一 UI 组件（toast / modal / drawer / dialog）
// ─────────────────────────────────────────────────────────────
var FMUI = {
  /**
   * Toast 通知
   * @param {string} msg
   * @param {string} type - 'info'|'ok'|'warn'|'err'
   * @param {number} duration
   */
  toast: function(msg, type, duration) {
    type = type || 'info';
    duration = duration == null ? 2800 : duration;
    var box = document.getElementById('fm-toast-box');
    if (!box) {
      box = document.createElement('div');
      box.id = 'fm-toast-box';
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      box.style.cssText = 'position:fixed;top:24px;right:24px;z-index:9000;display:flex;flex-direction:column;gap:10px;pointer-events:none;max-width:340px';
      document.body.appendChild(box);
    }
    var n = document.createElement('div');
    n.className = 'fm-toast fm-toast-' + type;
    var ic = type === 'ok' ? '✓' : type === 'warn' ? '⚠' : type === 'err' ? '✗' : 'ℹ';
    n.innerHTML = '<span class="fm-toast-i">' + ic + '</span><span class="fm-toast-t"></span>';
    n.querySelector('.fm-toast-t').textContent = String(msg == null ? '' : msg);
    n.style.cssText = 'pointer-events:auto;padding:12px 16px;background:color-mix(in srgb,var(--surface,#fff) 92%,transparent);backdrop-filter:blur(20px) saturate(1.4);-webkit-backdrop-filter:blur(20px) saturate(1.4);border:1px solid var(--border,#e5e7eb);border-left:3px solid var(--toast-c,#14b8a6);border-radius:14px;box-shadow:0 16px 40px rgba(4,17,31,.18);font-family:var(--fb,system-ui);font-size:.9rem;color:var(--text,#0c1b27);display:flex;align-items:center;gap:10px;animation:fmToastIn .42s cubic-bezier(.16,1,.3,1)';
    var color = type === 'ok' ? '#10b981' : type === 'warn' ? '#f59e0b' : type === 'err' ? '#ef4444' : '#3b82f6';
    n.style.setProperty('--toast-c', color);
    var icEl = n.querySelector('.fm-toast-i');
    icEl.style.cssText = 'font-weight:700;color:' + color + ';font-size:1.1em;flex-shrink:0';
    box.appendChild(n);
    setTimeout(function() {
      n.style.animation = 'fmToastOut .3s ease forwards';
      setTimeout(function() { if (n.parentNode) n.parentNode.removeChild(n); }, 320);
    }, duration);
    return n;
  },
  
  ok:   function(m, d) { return FMUI.toast(m, 'ok', d); },
  info: function(m, d) { return FMUI.toast(m, 'info', d); },
  warn: function(m, d) { return FMUI.toast(m, 'warn', d); },
  err:  function(m, d) { return FMUI.toast(m, 'err', d); },
  
  /**
   * 模态对话框
   * @param {Object} opts - { title, body, actions: [{label, kind, onClick}] }
   * @returns {Promise} resolve when closed
   */
  modal: function(opts) {
    return new Promise(function(resolve) {
      var overlay = document.createElement('div');
      overlay.className = 'fm-modal-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9500;background:rgba(4,17,31,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:grid;place-items:center;padding:24px;opacity:0;transition:opacity .32s';
      
      var box = document.createElement('div');
      box.className = 'fm-modal-box';
      box.style.cssText = 'width:min(440px,100%);background:var(--surface,#fff);border:1px solid var(--border,#e5e7eb);border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.3);transform:translateY(20px) scale(.96);opacity:0;transition:all .42s cubic-bezier(.34,1.56,.64,1);overflow:hidden';
      
      var html = '';
      if (opts.title) {
        html += '<div style="padding:22px 26px 14px;font-family:var(--fd,Georgia);font-size:1.15rem;font-weight:600;letter-spacing:-.02em;color:var(--text)">' +
          String(opts.title) + '</div>';
      }
      if (opts.body) {
        html += '<div style="padding:0 26px 18px;font-size:.94rem;line-height:1.6;color:var(--text-soft,#666)">' +
          (typeof opts.body === 'string' ? opts.body : opts.body.outerHTML || '') + '</div>';
      }
      var actions = opts.actions || [{ label: '确定', kind: 'primary' }];
      html += '<div style="padding:14px 22px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px;background:var(--bg-soft,#f8fafc)">';
      actions.forEach(function(a, i) {
        var bg = a.kind === 'primary'
          ? 'linear-gradient(135deg,var(--tide-500,#14b8a6),var(--tide-600,#0d9488))'
          : a.kind === 'danger'
          ? 'linear-gradient(135deg,#ef4444,#dc2626)'
          : 'var(--surface,#fff)';
        var color = (a.kind === 'primary' || a.kind === 'danger') ? '#fff' : 'var(--text,#0c1b27)';
        var border = (a.kind === 'primary' || a.kind === 'danger') ? 'none' : '1px solid var(--border-strong,#cbd5e1)';
        html += '<button data-fm-act="' + i + '" style="padding:10px 18px;border-radius:10px;background:' + bg +
          ';color:' + color + ';border:' + border + ';font-size:.9rem;font-weight:600;cursor:pointer;font-family:inherit;transition:transform .2s">' +
          String(a.label || '') + '</button>';
      });
      html += '</div>';
      box.innerHTML = html;
      overlay.appendChild(box);
      document.body.appendChild(overlay);
      
      function close(value) {
        overlay.style.opacity = '0';
        box.style.transform = 'translateY(20px) scale(.96)';
        box.style.opacity = '0';
        setTimeout(function() {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          resolve(value);
        }, 320);
      }
      
      box.addEventListener('click', function(e) {
        var btn = e.target.closest('[data-fm-act]');
        if (!btn) return;
        var idx = parseInt(btn.dataset.fmAct, 10);
        var a = actions[idx];
        var result = a.value !== undefined ? a.value : (a.kind === 'primary');
        if (typeof a.onClick === 'function') {
          var r = a.onClick();
          if (r === false) return; // 阻止关闭
        }
        close(result);
      });
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) close(false);
      });
      
      // ESC 关闭
      var escHandler = function(e) {
        if (e.key === 'Escape') {
          document.removeEventListener('keydown', escHandler);
          close(false);
        }
      };
      document.addEventListener('keydown', escHandler);
      
      // 入场动画
      requestAnimationFrame(function() {
        overlay.style.opacity = '1';
        box.style.transform = 'translateY(0) scale(1)';
        box.style.opacity = '1';
      });
    });
  },
  
  /**
   * 确认对话框
   */
  confirm: function(message, opts) {
    opts = opts || {};
    return FMUI.modal({
      title: opts.title || '确认操作',
      body: message,
      actions: [
        { label: opts.cancel || '取消', kind: 'normal', value: false },
        { label: opts.ok || '确定', kind: opts.danger ? 'danger' : 'primary', value: true }
      ]
    });
  }
};

// 注入 toast 动画 CSS
(function injectToastCSS() {
  if (document.getElementById('fm-toast-css')) return;
  var style = document.createElement('style');
  style.id = 'fm-toast-css';
  style.textContent = '@keyframes fmToastIn{from{opacity:0;transform:translateX(20px) scale(.96);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}@keyframes fmToastOut{to{opacity:0;transform:translateX(20px) scale(.96);filter:blur(4px)}}';
  if (document.head) document.head.appendChild(style);
  else if (document.body) document.body.appendChild(style);
})();

// ─────────────────────────────────────────────────────────────
// 8. FMSearch · 全站搜索引擎（模糊匹配 + 多字段评分）
// ─────────────────────────────────────────────────────────────
/**
 * Fuse 风格的模糊搜索
 * 评分维度：
 *   - 完全匹配（高分）
 *   - 词首字母匹配
 *   - 字段权重（title > desc > tags）
 *   - 子串匹配
 */
function _fuzzyScore(query, text) {
  if (!text) return 0;
  query = query.toLowerCase();
  text = text.toLowerCase();
  
  // 完全匹配
  if (text === query) return 1.0;
  
  // 子串匹配
  var idx = text.indexOf(query);
  if (idx === 0) return 0.9;  // 前缀匹配
  if (idx > 0) return 0.7 - idx * 0.005;
  
  // 模糊匹配：所有字符按顺序出现
  var qi = 0, ti = 0, hits = 0, lastHit = -1, gaps = 0;
  while (qi < query.length && ti < text.length) {
    if (query[qi] === text[ti]) {
      if (lastHit >= 0) gaps += ti - lastHit - 1;
      lastHit = ti;
      hits++;
      qi++;
    }
    ti++;
  }
  if (qi < query.length) return 0;
  
  var coverage = hits / query.length;
  var density = 1 - Math.min(1, gaps / Math.max(1, text.length));
  return 0.4 * coverage + 0.2 * density;
}

var FMSearch = {
  /**
   * 在数据集中搜索
   * @param {Array} items - 包含 {n, d, k, t, u, ...} 的数组
   * @param {string} query
   * @param {Object} opts - { limit, fields: {n: 1.0, d: 0.6, k: 0.4, t: 0.3} }
   * @returns {Array} [{item, score}, ...]
   */
  search: function(items, query, opts) {
    if (!Array.isArray(items)) return [];
    if (!query || !query.trim()) return items.slice(0, opts && opts.limit || 50).map(function(i) { return { item: i, score: 0 }; });
    query = query.trim();
    opts = opts || {};
    var fields = opts.fields || { n: 1.0, d: 0.6, k: 0.4, t: 0.3 };
    var limit = opts.limit || 50;
    var threshold = opts.threshold || 0.25;
    
    var results = items.map(function(item) {
      var score = 0;
      Object.keys(fields).forEach(function(f) {
        var weight = fields[f];
        var s = _fuzzyScore(query, item[f] || '');
        if (s > 0) score = Math.max(score, s * weight);
      });
      return { item: item, score: score };
    }).filter(function(r) { return r.score >= threshold; });
    
    results.sort(function(a, b) { return b.score - a.score; });
    return results.slice(0, limit);
  },
  
  /**
   * 高亮搜索关键字
   */
  highlight: function(text, query) {
    if (!text || !query) return text || '';
    var re = new RegExp('(' + query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'gi');
    return String(text).replace(re, '<mark class="fm-search-hl">$1</mark>');
  }
};

global.FMUI = FMUI;
global.FMSearch = FMSearch;

// ─────────────────────────────────────────────────────────────
// 9. FMNet · 网络层（fetch 封装 + 重试 + 离线队列 + 进度）
// ─────────────────────────────────────────────────────────────
var _offlineQueue = _getJSON('fm_net_queue', []) || [];
var _flushing = false;

var FMNet = {
  /**
   * 带重试的 fetch
   * @param {string} url
   * @param {Object} opts - { method, headers, body, retry, timeout, onProgress, signal }
   */
  fetch: function(url, opts) {
    opts = opts || {};
    var retries = opts.retry == null ? 2 : opts.retry;
    var timeout = opts.timeout || 30000;
    var attempt = 0;
    
    function tryOnce() {
      var controller = new AbortController();
      var timeoutId = setTimeout(function() { controller.abort(); }, timeout);
      var signal = opts.signal ? _mergeSignals(opts.signal, controller.signal) : controller.signal;
      
      return fetch(url, {
        method: opts.method || 'GET',
        headers: opts.headers,
        body: opts.body,
        signal: signal,
        credentials: opts.credentials || 'same-origin'
      }).then(function(r) {
        clearTimeout(timeoutId);
        if (!r.ok && r.status >= 500 && attempt < retries) {
          attempt++;
          var delay = Math.min(1000 * Math.pow(2, attempt), 8000);
          return new Promise(function(rs) { setTimeout(rs, delay); }).then(tryOnce);
        }
        return r;
      }).catch(function(err) {
        clearTimeout(timeoutId);
        if (attempt < retries && err.name !== 'AbortError') {
          attempt++;
          var delay = Math.min(1000 * Math.pow(2, attempt), 8000);
          return new Promise(function(rs) { setTimeout(rs, delay); }).then(tryOnce);
        }
        throw err;
      });
    }
    return tryOnce();
  },
  
  /**
   * JSON 简化调用
   */
  json: function(url, opts) {
    opts = opts || {};
    opts.headers = Object.assign({ 'Accept': 'application/json' }, opts.headers || {});
    if (opts.body && typeof opts.body !== 'string') {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
    return FMNet.fetch(url, opts).then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + r.statusText);
      return r.json();
    });
  },
  
  /**
   * 带进度回调的上传（XMLHttpRequest）
   */
  upload: function(url, file, opts) {
    opts = opts || {};
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(opts.method || 'POST', url + (opts.params ? '?' + new URLSearchParams(opts.params).toString() : ''), true);
      Object.entries(opts.headers || {}).forEach(function(entry) {
        xhr.setRequestHeader(entry[0], entry[1]);
      });
      if (opts.timeout) xhr.timeout = opts.timeout;
      
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable && opts.onProgress) {
          opts.onProgress({ loaded: e.loaded, total: e.total, pct: e.total > 0 ? e.loaded / e.total : 0 });
        }
      };
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          var result;
          try { result = JSON.parse(xhr.responseText); }
          catch (_) { result = { responseText: xhr.responseText }; }
          resolve(result);
        } else {
          reject(new Error('HTTP ' + xhr.status + ' · ' + (xhr.statusText || 'Upload failed')));
        }
      };
      xhr.onerror = function() { reject(new Error('Network error')); };
      xhr.ontimeout = function() { reject(new Error('Upload timeout')); };
      
      if (opts.signal) {
        opts.signal.addEventListener('abort', function() {
          xhr.abort();
          reject(new Error('Aborted'));
        });
      }
      
      xhr.send(file);
    });
  },
  
  /**
   * 离线队列：网络恢复后自动重发
   */
  enqueue: function(req) {
    _offlineQueue.push(Object.assign({ id: 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), ts: Date.now() }, req));
    _setJSON('fm_net_queue', _offlineQueue);
    if (navigator.onLine) FMNet.flush();
    return req;
  },
  
  flush: function() {
    if (_flushing || !_offlineQueue.length || !navigator.onLine) return Promise.resolve(0);
    _flushing = true;
    var processed = 0;
    var queue = _offlineQueue.slice();
    
    function next() {
      if (!queue.length) {
        _flushing = false;
        return processed;
      }
      var req = queue.shift();
      return FMNet.fetch(req.url, req.opts).then(function(r) {
        if (r.ok) {
          processed++;
          _offlineQueue = _offlineQueue.filter(function(x) { return x.id !== req.id; });
          _setJSON('fm_net_queue', _offlineQueue);
        }
        return next();
      }).catch(function() {
        // 失败保留在队列
        return next();
      });
    }
    return next();
  },
  
  queueSize: function() { return _offlineQueue.length; },
  clearQueue: function() { _offlineQueue = []; _setJSON('fm_net_queue', []); }
};

function _mergeSignals(s1, s2) {
  if (typeof AbortController === 'undefined') return s1 || s2;
  var ctrl = new AbortController();
  function abort() { ctrl.abort(); }
  if (s1) { if (s1.aborted) abort(); else s1.addEventListener('abort', abort); }
  if (s2) { if (s2.aborted) abort(); else s2.addEventListener('abort', abort); }
  return ctrl.signal;
}

// 网络恢复时自动 flush
global.addEventListener('online', function() { setTimeout(function() { FMNet.flush(); }, 1000); });

global.FMNet = FMNet;

// ─────────────────────────────────────────────────────────────
// 10. FMChart · 轻量 SVG 图表组件
// ─────────────────────────────────────────────────────────────
function _esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function _smoothPath(points) {
  if (!points || points.length < 2) return '';
  if (points.length === 2) return 'M' + points[0][0] + ',' + points[0][1] + 'L' + points[1][0] + ',' + points[1][1];
  var d = 'M' + points[0][0] + ',' + points[0][1];
  for (var i = 0; i < points.length - 1; i++) {
    var p0 = points[i - 1] || points[0];
    var p1 = points[i];
    var p2 = points[i + 1];
    var p3 = points[i + 2] || p2;
    var t = 0.18;
    var c1x = p1[0] + (p2[0] - p0[0]) * t;
    var c1y = p1[1] + (p2[1] - p0[1]) * t;
    var c2x = p2[0] - (p3[0] - p1[0]) * t;
    var c2y = p2[1] - (p3[1] - p1[1]) * t;
    d += ' C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) + ' ' + p2[0] + ',' + p2[1];
  }
  return d;
}

var FMChart = {
  /**
   * 折线图（支持平滑曲线 + 渐变填充）
   * @param {Array<number>} data
   * @param {Object} opts - { width, height, smooth, fill, color, dots, labels, ariaLabel }
   * @returns {string} SVG HTML
   */
  line: function(data, opts) {
    opts = opts || {};
    var w = opts.width || 360, h = opts.height || 80;
    var pad = opts.padding || { t: 8, r: 8, b: 16, l: 8 };
    if (!Array.isArray(data) || data.length === 0) {
      return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '"></svg>';
    }
    var max = Math.max.apply(null, data);
    var min = Math.min.apply(null, data);
    if (max === min) max = min + 1;
    var iw = w - pad.l - pad.r;
    var ih = h - pad.t - pad.b;
    var pts = data.map(function(v, i) {
      var x = pad.l + (data.length === 1 ? iw / 2 : i / (data.length - 1) * iw);
      var y = pad.t + ih - (v - min) / (max - min) * ih;
      return [x, y];
    });
    var color = opts.color || '#14b8a6';
    var color2 = opts.color2 || '#f97316';
    var gradId = 'fmcg_' + Math.random().toString(36).slice(2, 8);
    var path = opts.smooth !== false ? _smoothPath(pts) : pts.map(function(p, i) { return (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('');
    var area = path + 'L' + pts[pts.length - 1][0] + ',' + (h - pad.b) + 'L' + pts[0][0] + ',' + (h - pad.b) + 'Z';
    var aria = opts.ariaLabel ? ' role="img" aria-label="' + _esc(opts.ariaLabel) + '"' : '';
    var html = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" preserveAspectRatio="none"' + aria + '>';
    html += '<defs><linearGradient id="' + gradId + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + color + '" stop-opacity=".35"/>' +
      '<stop offset="100%" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs>';
    if (opts.fill !== false) html += '<path d="' + area + '" fill="url(#' + gradId + ')"/>';
    html += '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="' + (opts.strokeWidth || 1.8) + '" stroke-linecap="round" stroke-linejoin="round"/>';
    if (opts.dots) {
      pts.forEach(function(p, i) {
        var c = i === pts.length - 1 ? color2 : color;
        html += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.4" fill="' + c + '" stroke="#fff" stroke-width="1.2"/>';
      });
    }
    html += '</svg>';
    return html;
  },
  
  /**
   * 柱状图
   */
  bar: function(data, opts) {
    opts = opts || {};
    var w = opts.width || 360, h = opts.height || 80;
    var pad = opts.padding || { t: 6, r: 4, b: 18, l: 4 };
    if (!Array.isArray(data) || data.length === 0) {
      return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '"></svg>';
    }
    var max = Math.max.apply(null, data);
    if (max === 0) max = 1;
    var iw = w - pad.l - pad.r;
    var ih = h - pad.t - pad.b;
    var gap = Math.max(1, iw / data.length * 0.18);
    var bw = (iw - gap * (data.length - 1)) / data.length;
    var color = opts.color || '#14b8a6';
    var color2 = opts.color2 || '#f97316';
    var hl = opts.highlight; // 高亮的索引（如今天）
    var aria = opts.ariaLabel ? ' role="img" aria-label="' + _esc(opts.ariaLabel) + '"' : '';
    var html = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '"' + aria + '>';
    var gradId = 'fmcb_' + Math.random().toString(36).slice(2, 8);
    var gradId2 = gradId + '_hl';
    html += '<defs>' +
      '<linearGradient id="' + gradId + '" x1="0" y1="1" x2="0" y2="0">' +
        '<stop offset="0%" stop-color="' + color + '" stop-opacity=".55"/>' +
        '<stop offset="100%" stop-color="' + color + '"/></linearGradient>' +
      '<linearGradient id="' + gradId2 + '" x1="0" y1="1" x2="0" y2="0">' +
        '<stop offset="0%" stop-color="' + color2 + '" stop-opacity=".55"/>' +
        '<stop offset="100%" stop-color="' + color2 + '"/></linearGradient>' +
      '</defs>';
    data.forEach(function(v, i) {
      var x = pad.l + i * (bw + gap);
      var bh = (v / max) * ih;
      var y = pad.t + ih - bh;
      var f = (hl === i) ? 'url(#' + gradId2 + ')' : 'url(#' + gradId + ')';
      html += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(2, bh).toFixed(1) + '" rx="2" fill="' + f + '">';
      if (opts.labels && opts.labels[i]) html += '<title>' + _esc(opts.labels[i]) + '</title>';
      html += '</rect>';
    });
    html += '</svg>';
    return html;
  },
  
  /**
   * 环形进度图
   */
  ring: function(percent, opts) {
    opts = opts || {};
    var size = opts.size || 96;
    var sw = opts.strokeWidth || 8;
    var r = (size - sw) / 2;
    var c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(1, percent / 100)));
    var color = opts.color || '#14b8a6';
    var color2 = opts.color2 || '#f97316';
    var bg = opts.bg || '#e5e7eb';
    var label = opts.label != null ? opts.label : Math.round(percent) + '%';
    var sub = opts.sub || '';
    var gradId = 'fmcr_' + Math.random().toString(36).slice(2, 8);
    var aria = opts.ariaLabel ? ' role="img" aria-label="' + _esc(opts.ariaLabel) + '"' : '';
    var html = '<div style="position:relative;width:' + size + 'px;height:' + size + 'px;display:inline-block">';
    html += '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '"' + aria + ' style="transform:rotate(-90deg)">';
    html += '<defs><linearGradient id="' + gradId + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="' + color + '"/>' +
      '<stop offset="100%" stop-color="' + color2 + '"/></linearGradient></defs>';
    html += '<circle cx="' + size/2 + '" cy="' + size/2 + '" r="' + r + '" fill="none" stroke="' + bg + '" stroke-width="' + sw + '"/>';
    html += '<circle cx="' + size/2 + '" cy="' + size/2 + '" r="' + r + '" fill="none" stroke="url(#' + gradId + ')" stroke-width="' + sw + '" stroke-linecap="round" stroke-dasharray="' + c.toFixed(2) + '" stroke-dashoffset="' + off.toFixed(2) + '" style="transition:stroke-dashoffset 1400ms cubic-bezier(.16,1,.3,1)"/>';
    html += '</svg>';
    html += '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;line-height:1.1;pointer-events:none">';
    html += '<div style="font-family:var(--fd,Georgia);font-size:' + (size * 0.22) + 'px;font-weight:600;letter-spacing:-.025em;color:var(--text,#0c1b27)">' + _esc(label) + '</div>';
    if (sub) html += '<div style="font-size:' + (size * 0.085) + 'px;color:var(--text-muted,#666);font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-top:2px">' + _esc(sub) + '</div>';
    html += '</div></div>';
    return html;
  },
  
  /**
   * 迷你 sparkline（折线图的简化版）
   */
  sparkline: function(data, opts) {
    opts = opts || {};
    return FMChart.line(data, Object.assign({
      width: 64, height: 20,
      padding: { t: 2, r: 2, b: 2, l: 2 },
      smooth: true, fill: true, dots: false,
      strokeWidth: 1.4
    }, opts));
  },
  
  /**
   * 热力网格（GitHub 贡献风）
   */
  heatmap: function(data, opts) {
    opts = opts || {};
    if (!Array.isArray(data)) return '';
    var max = Math.max(1, Math.max.apply(null, data));
    var color = opts.color || '#14b8a6';
    var size = opts.cellSize || 12;
    var gap = opts.gap || 3;
    var levels = opts.levels || 5;
    var cols = opts.cols || data.length;
    var rows = Math.ceil(data.length / cols);
    var w = cols * size + (cols - 1) * gap;
    var h = rows * size + (rows - 1) * gap;
    var html = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '">';
    data.forEach(function(v, i) {
      var col = i % cols, row = Math.floor(i / cols);
      var x = col * (size + gap), y = row * (size + gap);
      var lvl = v === 0 ? 0 : Math.min(levels - 1, Math.ceil(v / max * (levels - 1)));
      var op = v === 0 ? 0.06 : 0.2 + lvl * (0.8 / (levels - 1));
      html += '<rect x="' + x + '" y="' + y + '" width="' + size + '" height="' + size + '" rx="2" fill="' + color + '" opacity="' + op.toFixed(2) + '">';
      if (opts.labels && opts.labels[i]) html += '<title>' + _esc(opts.labels[i]) + '</title>';
      html += '</rect>';
    });
    html += '</svg>';
    return html;
  }
};

global.FMChart = FMChart;

// ─────────────────────────────────────────────────────────────
// 11. FMTopBar · 自动渲染统一顶栏组件
// ─────────────────────────────────────────────────────────────
/**
 * 用法：
 *   <div data-fm-topbar="知识点 · 第 3 章"></div>
 *   <div data-fm-topbar data-back="/index-complete.html"></div>
 * 
 * 自动渲染：
 *   - Logo + 流体微动效
 *   - 标题（取自 data-fm-topbar attr）
 *   - 用户头像 pill（已登录显示）
 *   - 主题切换按钮
 *   - 返回主页按钮
 */
var FMTopBar = {
  /**
   * 渲染单个顶栏到目标元素
   */
  render: function(el) {
    if (!el) return;
    var title = el.getAttribute('data-fm-topbar') || '';
    var backHref = el.getAttribute('data-back') || '/index-complete.html';
    var showBack = el.getAttribute('data-no-back') !== 'true';
    
    var user = null;
    try {
      if (global.FMSecurity && global.FMSecurity.getUser) {
        user = global.FMSecurity.getUser();
      }
    } catch (_) {}
    var userName = user ? (user.name || user.username || '') : '';
    var ini = userName ? userName.slice(0, 1).toUpperCase() : '?';
    
    el.classList.add('fm-topbar');
    el.innerHTML =
      '<a href="/index-complete.html" class="fm-tb-brand" aria-label="返回主页">' +
        '<span class="fm-tb-mark">流</span>' +
        (title ? '<span class="fm-tb-title">' + _esc(title) + '</span>' : '<span class="fm-tb-title">流体力学</span>') +
      '</a>' +
      '<div class="fm-tb-spacer"></div>' +
      (user ? (
        '<button class="fm-tb-user" type="button" aria-label="用户菜单">' +
          '<span class="fm-tb-name">' + _esc(userName) + '</span>' +
          '<span class="fm-tb-ava">' + _esc(ini) + '</span>' +
        '</button>'
      ) : '') +
      '<button class="fm-tb-ibtn" type="button" data-fm-tb-action="theme" aria-label="切换主题">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>' +
      '</button>' +
      (showBack ? (
        '<a href="' + _esc(backHref) + '" class="fm-tb-back">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>' +
          '<span>主页</span>' +
        '</a>'
      ) : '');
    
    // 主题切换
    var themeBtn = el.querySelector('[data-fm-tb-action="theme"]');
    if (themeBtn) {
      themeBtn.addEventListener('click', function() {
        var cur = document.documentElement.getAttribute('data-theme');
        var pd = window.matchMedia && matchMedia('(prefers-color-scheme:dark)').matches;
        var nxt = (cur === 'dark' || (!cur && pd)) ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nxt);
        try { localStorage.setItem('fm_theme', nxt); } catch (_) {}
      });
    }
  },
  
  /**
   * 自动扫描页面所有 [data-fm-topbar] 元素并渲染
   */
  autoMount: function() {
    var els = document.querySelectorAll('[data-fm-topbar]');
    Array.prototype.forEach.call(els, function(el) {
      // 已渲染过的跳过（避免重复）
      if (el.classList.contains('fm-topbar')) return;
      FMTopBar.render(el);
    });
    // 自动注入 CSS
    FMTopBar._injectCSS();
  },
  
  _injectCSS: function() {
    if (document.getElementById('fm-tb-css')) return;
    var style = document.createElement('style');
    style.id = 'fm-tb-css';
    style.textContent = [
      '.fm-topbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;gap:10px;padding:10px 18px;background:color-mix(in srgb,var(--surface,#fff) 78%,transparent);backdrop-filter:blur(20px) saturate(1.4);-webkit-backdrop-filter:blur(20px) saturate(1.4);border-bottom:1px solid var(--border,#e5e7eb)}',
      '.fm-tb-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text,#0c1b27);font-weight:600;font-size:.96rem}',
      '.fm-tb-mark{width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,#14b8a6,#f97316);display:grid;place-items:center;color:#fff;font-family:var(--fd,Georgia);font-weight:700;font-size:.9rem;position:relative;overflow:hidden;box-shadow:0 4px 14px rgba(20,184,166,.4);flex-shrink:0}',
      '.fm-tb-mark::after{content:"";position:absolute;inset:-2px;background:conic-gradient(from 0deg,transparent 0%,rgba(20,184,166,.4) 25%,transparent 50%,rgba(249,115,22,.4) 75%,transparent 100%);border-radius:inherit;animation:fmTbSpin 6s linear infinite;opacity:0;transition:opacity 480ms}',
      '.fm-tb-brand:hover .fm-tb-mark::after{opacity:1}',
      '@keyframes fmTbSpin{to{transform:rotate(360deg)}}',
      '.fm-tb-title{font-family:var(--fd,Georgia);letter-spacing:-.01em}',
      '.fm-tb-spacer{flex:1}',
      '.fm-tb-user{display:inline-flex;align-items:center;gap:10px;padding:5px 8px 5px 14px;background:color-mix(in srgb,var(--surface,#fff) 80%,transparent);border:1px solid var(--border,#e5e7eb);border-radius:999px;cursor:pointer;transition:all 280ms cubic-bezier(.34,1.56,.64,1);font-family:var(--fb,system-ui);font-size:.86rem;font-weight:600;color:var(--text,#0c1b27)}',
      '.fm-tb-user:hover{border-color:#14b8a6;background:var(--surface,#fff);box-shadow:0 8px 24px rgba(20,184,166,.18);transform:translateY(-1px)}',
      '.fm-tb-name{max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:1.2}',
      '.fm-tb-ava{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#14b8a6,#f97316);color:#fff;display:grid;place-items:center;font-family:var(--fd,Georgia);font-weight:700;font-size:.84rem;text-transform:uppercase;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.3),0 4px 10px rgba(20,184,166,.3);flex-shrink:0}',
      '.fm-tb-ibtn{width:36px;height:36px;border-radius:999px;background:color-mix(in srgb,var(--surface,#fff) 70%,transparent);border:1px solid var(--border,#e5e7eb);color:var(--text-soft,#475569);cursor:pointer;display:grid;place-items:center;transition:all 220ms cubic-bezier(.34,1.56,.64,1)}',
      '.fm-tb-ibtn:hover{border-color:#14b8a6;color:#14b8a6;transform:translateY(-1px) scale(1.04);box-shadow:0 4px 14px rgba(20,184,166,.2)}',
      '.fm-tb-back{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;text-decoration:none;color:var(--text-soft,#475569);font-size:.84rem;font-weight:600;border:1px solid var(--border,#e5e7eb);background:var(--surface,#fff);transition:all 220ms cubic-bezier(.34,1.56,.64,1)}',
      '.fm-tb-back:hover{border-color:#14b8a6;color:#14b8a6;transform:translateY(-1px)}',
      '@media (max-width:640px){.fm-topbar{padding:8px 12px;gap:6px}.fm-tb-name{display:none}.fm-tb-back span{display:none}.fm-tb-back{width:36px;height:36px;padding:0;justify-content:center}}',
      '@media (prefers-reduced-motion:reduce){.fm-tb-mark::after{animation:none!important}}'
    ].join('');
    if (document.head) document.head.appendChild(style);
    else if (document.body) document.body.appendChild(style);
  }
};

// 自动挂载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { setTimeout(function() { FMTopBar.autoMount(); }, 60); });
} else {
  setTimeout(function() { FMTopBar.autoMount(); }, 60);
}

global.FMTopBar = FMTopBar;

// ─────────────────────────────────────────────────────────────
// 12. FMVisuals · 流体氛围视觉装饰生成器
// ─────────────────────────────────────────────────────────────
/**
 * 用法：
 *   <div data-fm-visual="aurora"></div>     // 极光底纹
 *   <div data-fm-visual="streamlines"></div> // 流线背景
 *   <div data-fm-visual="grid"></div>        // 流体网格
 * 
 * 默认填充父容器，z-index: -1，pointer-events: none
 */
var FMVisuals = {
  /**
   * 极光底纹（teal + coral 双径向缓动）
   */
  aurora: function(el) {
    if (!el) return;
    el.classList.add('fm-vis', 'fm-vis-aurora');
    el.innerHTML = ''; // 纯 CSS 实现
  },
  
  /**
   * 流线背景（多条动态贝塞尔曲线）
   */
  streamlines: function(el, opts) {
    if (!el) return;
    opts = opts || {};
    var n = opts.lines || 6;
    var w = opts.width || 1200;
    var h = opts.height || 600;
    el.classList.add('fm-vis', 'fm-vis-streamlines');
    
    var paths = '';
    for (var i = 0; i < n; i++) {
      var y = h * (0.15 + (i / n) * 0.7);
      var amp = 30 + Math.random() * 20;
      var phase = Math.random() * 100;
      var color = i % 2 === 0 ? 'rgba(20,184,166,.4)' : 'rgba(249,115,22,.3)';
      // 平滑流线
      var d = 'M0,' + y;
      for (var x = 0; x <= w; x += 60) {
        var yy = y + Math.sin((x + phase) / 80) * amp;
        d += ' L' + x + ',' + yy.toFixed(1);
      }
      paths += '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.2" stroke-linecap="round">' +
        '<animate attributeName="stroke-dashoffset" from="0" to="' + (i % 2 === 0 ? '-200' : '200') + '" dur="' + (12 + i * 2) + 's" repeatCount="indefinite"/>' +
        '</path>';
    }
    
    el.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + paths + '</svg>';
  },
  
  /**
   * 流体网格（细线网格 + 鼠标跟随光晕）
   */
  grid: function(el, opts) {
    if (!el) return;
    opts = opts || {};
    el.classList.add('fm-vis', 'fm-vis-grid');
    el.innerHTML = '';
  },
  
  /**
   * 自动扫描挂载
   */
  autoMount: function() {
    var els = document.querySelectorAll('[data-fm-visual]');
    Array.prototype.forEach.call(els, function(el) {
      if (el.classList.contains('fm-vis')) return;
      var type = el.getAttribute('data-fm-visual');
      if (type && typeof FMVisuals[type] === 'function') {
        FMVisuals[type](el);
      }
    });
    FMVisuals._injectCSS();
  },
  
  _injectCSS: function() {
    if (document.getElementById('fm-vis-css')) return;
    var style = document.createElement('style');
    style.id = 'fm-vis-css';
    style.textContent = [
      '.fm-vis{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden}',
      '.fm-vis svg{width:100%;height:100%;display:block}',
      // 极光
      '.fm-vis-aurora{background:radial-gradient(ellipse 80% 50% at 20% 0%,rgba(20,184,166,.12),transparent 50%),radial-gradient(ellipse 70% 50% at 80% 100%,rgba(249,115,22,.10),transparent 50%);animation:fmVisAurora 24s ease-in-out infinite alternate}',
      '@keyframes fmVisAurora{0%{transform:translate(0,0)}100%{transform:translate(2%,-1%)}}',
      '[data-theme="dark"] .fm-vis-aurora{background:radial-gradient(ellipse 80% 50% at 20% 0%,rgba(45,212,191,.10),transparent 50%),radial-gradient(ellipse 70% 50% at 80% 100%,rgba(251,146,60,.08),transparent 50%)}',
      // 流线
      '.fm-vis-streamlines svg{opacity:.5}',
      '[data-theme="dark"] .fm-vis-streamlines svg{opacity:.7}',
      // 网格
      '.fm-vis-grid{background-image:linear-gradient(to right,rgba(20,184,166,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(20,184,166,.06) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,#000 30%,transparent 80%);-webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,#000 30%,transparent 80%)}',
      '[data-theme="dark"] .fm-vis-grid{background-image:linear-gradient(to right,rgba(45,212,191,.08) 1px,transparent 1px),linear-gradient(to bottom,rgba(45,212,191,.08) 1px,transparent 1px)}',
      '@media (prefers-reduced-motion:reduce){.fm-vis-aurora{animation:none!important}}'
    ].join('');
    if (document.head) document.head.appendChild(style);
    else if (document.body) document.body.appendChild(style);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { setTimeout(function() { FMVisuals.autoMount(); }, 60); });
} else {
  setTimeout(function() { FMVisuals.autoMount(); }, 60);
}

global.FMVisuals = FMVisuals;

// ─────────────────────────────────────────────────────────────
// 13. FMAI · 流式 AI 助手集成（OpenAI 协议兼容 + 流式 + KaTeX）
// ─────────────────────────────────────────────────────────────
/**
 * 用法：
 *   1. 配置 endpoint + key（一次）：
 *      FMAI.configure({
 *        endpoint: 'https://api.openai.com/v1/chat/completions',
 *        apiKey: 'sk-...',
 *        model: 'gpt-4o-mini',
 *        systemPrompt: '你是流体力学助教...'
 *      });
 *   
 *   2. 一行调用：
 *      await FMAI.ask('解释伯努利方程', { onChunk: text => render(text) });
 *   
 *   3. 一行打开浮窗 UI：
 *      FMAI.openPanel();   // 学生端 AI 对话浮窗
 */
var FMAI = {
  _config: _getJSON('fm_ai_cfg', {
    endpoint: '',
    apiKey: '',
    model: 'gpt-4o-mini',
    systemPrompt: '你是中国海洋大学流体力学课程的智能助教。回答时数学公式用 LaTeX 写在 $...$ 或 $$...$$ 中。语言简洁、严谨、有教学性。',
    temperature: 0.7,
    maxTokens: 2048
  }) || {},
  
  configure: function(cfg) {
    FMAI._config = Object.assign({}, FMAI._config, cfg);
    _setJSON('fm_ai_cfg', FMAI._config);
    return FMAI._config;
  },
  
  config: function() { return Object.assign({}, FMAI._config); },
  
  isConfigured: function() {
    return !!(FMAI._config.endpoint && FMAI._config.apiKey);
  },
  
  /**
   * 提问（支持流式 + 历史）
   * @param {string|Array} prompt - 字符串或消息数组
   * @param {Object} opts - { onChunk(text), onDone(full), signal, history, system }
   * @returns {Promise<string>} 完整回答
   */
  ask: async function(prompt, opts) {
    opts = opts || {};
    var cfg = FMAI._config;
    if (!cfg.endpoint || !cfg.apiKey) {
      throw new Error('AI 未配置：请先调用 FMAI.configure({ endpoint, apiKey })');
    }
    
    var messages = [];
    if (cfg.systemPrompt || opts.system) {
      messages.push({ role: 'system', content: opts.system || cfg.systemPrompt });
    }
    if (Array.isArray(opts.history)) {
      messages = messages.concat(opts.history);
    }
    if (typeof prompt === 'string') {
      messages.push({ role: 'user', content: prompt });
    } else if (Array.isArray(prompt)) {
      messages = messages.concat(prompt);
    }
    
    var body = {
      model: cfg.model,
      messages: messages,
      temperature: cfg.temperature,
      max_tokens: cfg.maxTokens,
      stream: !!opts.onChunk
    };
    
    var response = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cfg.apiKey
      },
      body: JSON.stringify(body),
      signal: opts.signal
    });
    
    if (!response.ok) {
      var errText = '';
      try { errText = await response.text(); } catch (_) {}
      throw new Error('AI 请求失败 ' + response.status + ': ' + errText.slice(0, 200));
    }
    
    if (!opts.onChunk) {
      // 非流式
      var data = await response.json();
      var text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
      if (opts.onDone) opts.onDone(text);
      return text;
    }
    
    // 流式：解析 SSE
    var reader = response.body.getReader();
    var decoder = new TextDecoder();
    var buffer = '';
    var fullText = '';
    
    while (true) {
      var chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });
      var lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line || line.startsWith(':')) continue;
        if (line.startsWith('data: ')) {
          var dataStr = line.slice(6);
          if (dataStr === '[DONE]') break;
          try {
            var json = JSON.parse(dataStr);
            var delta = json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content;
            if (delta) {
              fullText += delta;
              try { opts.onChunk(delta, fullText); } catch (_) {}
            }
          } catch (_) {}
        }
      }
    }
    if (opts.onDone) opts.onDone(fullText);
    return fullText;
  },
  
  /**
   * 简易 Markdown → HTML（仅支持代码块、粗斜体、列表、链接、公式占位）
   */
  renderMarkdown: function(md) {
    if (!md) return '';
    var s = String(md);
    // 转义 HTML
    s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // 代码块（先处理避免被其他规则破坏）
    s = s.replace(/```(\w*)\n([\s\S]*?)```/g, function(_, lang, code) {
      return '<pre><code class="lang-' + lang + '">' + code.replace(/\n$/, '') + '</code></pre>';
    });
    // 行内代码
    s = s.replace(/`([^`\n]+)`/g, '<code>$1</code>');
    // 粗体 / 斜体
    s = s.replace(/\*\*([^\*\n]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(?<!\*)\*([^\*\n]+)\*(?!\*)/g, '<em>$1</em>');
    // 标题 ### / ## / #
    s = s.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    s = s.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    s = s.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    // 无序列表
    s = s.replace(/^\- (.+)$/gm, '<li>$1</li>');
    s = s.replace(/(<li>[\s\S]*?<\/li>(\n|$))+/g, function(m) {
      return '<ul>' + m.replace(/\n$/, '') + '</ul>';
    });
    // 段落
    s = s.split(/\n\n+/).map(function(p) {
      if (/^\s*<(h[1-6]|ul|ol|pre|blockquote)/.test(p)) return p;
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');
    return s;
  },
  
  /**
   * 渲染 KaTeX 公式（如可用）
   */
  renderMath: function(el) {
    if (!el || typeof window === 'undefined') return;
    if (window.MathJax && window.MathJax.typesetPromise) {
      try { window.MathJax.typesetPromise([el]); } catch (_) {}
    } else if (window.katex && window.renderMathInElement) {
      try {
        window.renderMathInElement(el, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      } catch (_) {}
    }
  },
  
  /**
   * 历史对话管理
   */
  history: {
    get: function(sessionId) {
      sessionId = sessionId || 'default';
      var all = _getJSON('fm_ai_history', {}) || {};
      return Array.isArray(all[sessionId]) ? all[sessionId] : [];
    },
    push: function(message, sessionId) {
      sessionId = sessionId || 'default';
      var all = _getJSON('fm_ai_history', {}) || {};
      if (!Array.isArray(all[sessionId])) all[sessionId] = [];
      all[sessionId].push(message);
      // 最多保留 40 条（约 20 轮对话）
      if (all[sessionId].length > 40) all[sessionId] = all[sessionId].slice(-40);
      _setJSON('fm_ai_history', all);
    },
    clear: function(sessionId) {
      sessionId = sessionId || 'default';
      var all = _getJSON('fm_ai_history', {}) || {};
      delete all[sessionId];
      _setJSON('fm_ai_history', all);
    },
    sessions: function() {
      var all = _getJSON('fm_ai_history', {}) || {};
      return Object.keys(all);
    }
  },
  
  /**
   * 打开 AI 对话浮窗（学生端）
   */
  openPanel: function() {
    if (!FMAI.isConfigured()) {
      if (global.FMUI) {
        FMUI.modal({
          title: 'AI 助手未配置',
          body: '请先在「设置」中配置 API 端点和密钥。可使用 OpenAI、通义千问、智谱 GLM 或任何兼容 OpenAI 协议的服务。',
          actions: [
            { label: '稍后', kind: 'normal', value: false },
            { label: '去配置', kind: 'primary', value: true, onClick: function() { FMAI.openConfig(); } }
          ]
        });
      } else {
        alert('AI 助手未配置');
      }
      return;
    }
    FMAI._renderPanel();
  },
  
  openConfig: function() {
    if (!global.FMUI) {
      var endpoint = prompt('API 端点 URL', FMAI._config.endpoint || 'https://api.openai.com/v1/chat/completions');
      if (endpoint === null) return;
      var apiKey = prompt('API Key', FMAI._config.apiKey || '');
      if (apiKey === null) return;
      var model = prompt('模型名', FMAI._config.model || 'gpt-4o-mini');
      if (model === null) return;
      FMAI.configure({ endpoint: endpoint, apiKey: apiKey, model: model });
      return;
    }
    
    var html = '<div style="display:flex;flex-direction:column;gap:12px;text-align:left">' +
      '<label style="display:flex;flex-direction:column;gap:4px"><span style="font-size:.78rem;font-weight:600;color:var(--text-muted)">API 端点 URL</span>' +
        '<input id="fm-ai-cfg-ep" type="text" value="' + _esc(FMAI._config.endpoint || '') + '" placeholder="https://api.openai.com/v1/chat/completions" style="padding:10px 12px;border:1px solid var(--border-strong);border-radius:10px;font-family:var(--fm,monospace);font-size:.84rem;background:var(--surface,#fff);color:var(--text)">' +
      '</label>' +
      '<label style="display:flex;flex-direction:column;gap:4px"><span style="font-size:.78rem;font-weight:600;color:var(--text-muted)">API Key</span>' +
        '<input id="fm-ai-cfg-k" type="password" value="' + _esc(FMAI._config.apiKey || '') + '" placeholder="sk-..." style="padding:10px 12px;border:1px solid var(--border-strong);border-radius:10px;font-family:var(--fm,monospace);font-size:.84rem;background:var(--surface,#fff);color:var(--text)">' +
      '</label>' +
      '<label style="display:flex;flex-direction:column;gap:4px"><span style="font-size:.78rem;font-weight:600;color:var(--text-muted)">模型名</span>' +
        '<input id="fm-ai-cfg-m" type="text" value="' + _esc(FMAI._config.model || 'gpt-4o-mini') + '" placeholder="gpt-4o-mini / qwen-turbo / glm-4-flash" style="padding:10px 12px;border:1px solid var(--border-strong);border-radius:10px;font-family:var(--fm,monospace);font-size:.84rem;background:var(--surface,#fff);color:var(--text)">' +
      '</label>' +
      '<p style="font-size:.78rem;color:var(--text-muted);line-height:1.5;margin-top:4px">⚠️ Key 仅存储在本地浏览器。支持任何兼容 OpenAI 协议的服务。</p>' +
      '</div>';
    
    var div = document.createElement('div');
    div.innerHTML = html;
    
    FMUI.modal({
      title: 'AI 助手设置',
      body: div,
      actions: [
        { label: '取消', kind: 'normal', value: false },
        {
          label: '保存',
          kind: 'primary',
          value: true,
          onClick: function() {
            var ep = document.getElementById('fm-ai-cfg-ep').value.trim();
            var k = document.getElementById('fm-ai-cfg-k').value.trim();
            var m = document.getElementById('fm-ai-cfg-m').value.trim();
            FMAI.configure({ endpoint: ep, apiKey: k, model: m });
            if (FMUI) FMUI.ok('AI 配置已保存');
          }
        }
      ]
    });
  },
  
  _renderPanel: function() {
    var existing = document.getElementById('fm-ai-panel');
    if (existing) {
      existing.classList.add('on');
      return;
    }
    var pnl = document.createElement('div');
    pnl.id = 'fm-ai-panel';
    pnl.className = 'fm-ai-pnl';
    pnl.innerHTML =
      '<div class="fm-ai-hd">' +
        '<div class="fm-ai-tt">' +
          '<span class="fm-ai-dot"></span>' +
          '<strong>AI 流体力学助教</strong>' +
        '</div>' +
        '<div class="fm-ai-acts">' +
          '<button class="fm-ai-mini" data-fm-ai-act="cfg" title="设置">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' +
          '</button>' +
          '<button class="fm-ai-mini" data-fm-ai-act="clear" title="清空对话">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>' +
          '</button>' +
          '<button class="fm-ai-mini" data-fm-ai-act="close" title="关闭">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="fm-ai-body" id="fm-ai-body"></div>' +
      '<form class="fm-ai-input" id="fm-ai-form">' +
        '<textarea id="fm-ai-q" rows="1" placeholder="向 AI 助教提问（Shift+Enter 换行 · Enter 发送）" required></textarea>' +
        '<button type="submit" class="fm-ai-send" id="fm-ai-send" aria-label="发送">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</form>';
    document.body.appendChild(pnl);
    FMAI._injectCSS();
    
    setTimeout(function() { pnl.classList.add('on'); }, 10);
    
    // 渲染历史
    FMAI._renderHistory();
    
    // 事件绑定
    pnl.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-fm-ai-act]');
      if (!btn) return;
      var act = btn.dataset.fmAiAct;
      if (act === 'close') { pnl.classList.remove('on'); }
      else if (act === 'clear') {
        if (!global.FMUI) {
          if (!confirm('清空当前对话历史？')) return;
        }
        var doClear = function() {
          FMAI.history.clear();
          var body = document.getElementById('fm-ai-body');
          if (body) body.innerHTML = '<div class="fm-ai-empty"><strong>👋 你好，我是 AI 流体力学助教</strong><p>试着问我："解释伯努利方程" / "Re 数为什么以 ρuL/μ 定义" / "推导 N-S 方程"</p></div>';
        };
        if (global.FMUI) {
          FMUI.confirm('清空当前对话历史？', { ok: '清空', danger: true }).then(function(ok) { if (ok) doClear(); });
        } else doClear();
      }
      else if (act === 'cfg') { FMAI.openConfig(); }
    });
    
    var form = document.getElementById('fm-ai-form');
    var ta = document.getElementById('fm-ai-q');
    
    // 自适应高度
    ta.addEventListener('input', function() {
      ta.style.height = 'auto';
      ta.style.height = Math.min(120, ta.scrollHeight) + 'px';
    });
    // Enter 发送 / Shift+Enter 换行
    ta.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
      }
    });
    
    var aiAborter = null;
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      if (aiAborter) { aiAborter.abort(); aiAborter = null; }
      var q = ta.value.trim();
      if (!q) return;
      ta.value = '';
      ta.style.height = 'auto';
      
      var body = document.getElementById('fm-ai-body');
      // 用户气泡
      var userMsg = document.createElement('div');
      userMsg.className = 'fm-ai-msg fm-ai-user';
      userMsg.innerHTML = '<div class="fm-ai-bubble">' + _esc(q) + '</div>';
      body.appendChild(userMsg);
      // AI 气泡（流式追加）
      var aiMsg = document.createElement('div');
      aiMsg.className = 'fm-ai-msg fm-ai-bot';
      aiMsg.innerHTML = '<div class="fm-ai-bubble"><span class="fm-ai-typing"><span></span><span></span><span></span></span></div>';
      body.appendChild(aiMsg);
      body.scrollTop = body.scrollHeight;
      
      var bubble = aiMsg.querySelector('.fm-ai-bubble');
      var rawText = '';
      
      // 历史
      var history = FMAI.history.get();
      FMAI.history.push({ role: 'user', content: q });
      
      try {
        aiAborter = new AbortController();
        await FMAI.ask(q, {
          history: history,
          signal: aiAborter.signal,
          onChunk: function(_, full) {
            rawText = full;
            bubble.innerHTML = FMAI.renderMarkdown(rawText);
            body.scrollTop = body.scrollHeight;
          },
          onDone: function(full) {
            rawText = full;
            bubble.innerHTML = FMAI.renderMarkdown(rawText);
            FMAI.renderMath(bubble);
            body.scrollTop = body.scrollHeight;
            FMAI.history.push({ role: 'assistant', content: full });
            if (global.FMLog) FMLog.add('ai', { q: q.slice(0, 80) });
          }
        });
      } catch (err) {
        bubble.innerHTML = '<span style="color:var(--err,#ef4444)">⚠ ' + _esc(err.message) + '</span>';
      }
      aiAborter = null;
    });
    
    // ESC 关闭
    var escHandler = function(e) {
      if (e.key === 'Escape' && pnl.classList.contains('on')) {
        pnl.classList.remove('on');
      }
    };
    document.addEventListener('keydown', escHandler);
  },
  
  _renderHistory: function() {
    var body = document.getElementById('fm-ai-body');
    if (!body) return;
    var history = FMAI.history.get();
    if (!history.length) {
      body.innerHTML = '<div class="fm-ai-empty"><strong>👋 你好，我是 AI 流体力学助教</strong><p>试着问我："解释伯努利方程" / "Re 数为什么以 ρuL/μ 定义" / "推导 N-S 方程"</p></div>';
      return;
    }
    body.innerHTML = history.map(function(m) {
      if (m.role === 'system') return '';
      var cls = m.role === 'user' ? 'fm-ai-user' : 'fm-ai-bot';
      var html = m.role === 'assistant' ? FMAI.renderMarkdown(m.content || '') : _esc(m.content || '');
      return '<div class="fm-ai-msg ' + cls + '"><div class="fm-ai-bubble">' + html + '</div></div>';
    }).join('');
    setTimeout(function() {
      FMAI.renderMath(body);
      body.scrollTop = body.scrollHeight;
    }, 100);
  },
  
  _injectCSS: function() {
    if (document.getElementById('fm-ai-css')) return;
    var s = document.createElement('style');
    s.id = 'fm-ai-css';
    s.textContent = [
      '.fm-ai-pnl{position:fixed;bottom:24px;right:24px;width:min(420px,calc(100vw - 48px));height:min(620px,calc(100vh - 48px));background:color-mix(in srgb,var(--surface,#fff) 92%,transparent);backdrop-filter:blur(28px) saturate(1.4);-webkit-backdrop-filter:blur(28px) saturate(1.4);border:1px solid var(--border,#e5e7eb);border-radius:22px;box-shadow:0 30px 80px rgba(4,17,31,.22),0 1px 0 rgba(255,255,255,.4) inset;z-index:9000;display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(20px) scale(.96);pointer-events:none;transition:all 420ms cubic-bezier(.34,1.56,.64,1);transform-origin:bottom right}',
      '[data-theme="dark"] .fm-ai-pnl{box-shadow:0 30px 80px rgba(0,0,0,.5),0 1px 0 rgba(255,255,255,.06) inset}',
      '.fm-ai-pnl.on{opacity:1;transform:none;pointer-events:auto}',
      '.fm-ai-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px dashed var(--border,#e5e7eb);background:linear-gradient(135deg,color-mix(in srgb,#14b8a6 8%,transparent),color-mix(in srgb,#f97316 4%,transparent))}',
      '.fm-ai-tt{display:flex;align-items:center;gap:10px;font-family:var(--fd,Georgia);font-size:.95rem;font-weight:600;color:var(--text)}',
      '.fm-ai-dot{width:10px;height:10px;border-radius:50%;background:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.25);animation:fmAiPulse 2s ease-in-out infinite}',
      '@keyframes fmAiPulse{0%,100%{box-shadow:0 0 0 3px rgba(16,185,129,.25)}50%{box-shadow:0 0 0 6px rgba(16,185,129,.05)}}',
      '.fm-ai-acts{display:flex;gap:4px}',
      '.fm-ai-mini{width:30px;height:30px;border-radius:8px;background:transparent;border:none;color:var(--text-muted);cursor:pointer;display:grid;place-items:center;transition:all 200ms}',
      '.fm-ai-mini:hover{background:var(--bg-soft,#f1f5f9);color:var(--text)}',
      '.fm-ai-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}',
      '.fm-ai-empty{margin:auto;text-align:center;color:var(--text-muted);padding:0 24px}',
      '.fm-ai-empty strong{display:block;font-family:var(--fd,Georgia);font-size:1.05rem;font-weight:600;color:var(--text);margin-bottom:8px}',
      '.fm-ai-empty p{font-size:.86rem;line-height:1.6}',
      '.fm-ai-msg{display:flex;animation:fmAiSlide .42s cubic-bezier(.16,1,.3,1)}',
      '@keyframes fmAiSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
      '.fm-ai-user{justify-content:flex-end}',
      '.fm-ai-bot{justify-content:flex-start}',
      '.fm-ai-bubble{max-width:84%;padding:10px 14px;border-radius:14px;font-size:.92rem;line-height:1.6;word-wrap:break-word}',
      '.fm-ai-user .fm-ai-bubble{background:linear-gradient(135deg,#14b8a6,#0d9488);color:#fff;border-bottom-right-radius:4px;box-shadow:0 4px 12px rgba(20,184,166,.3)}',
      '.fm-ai-bot .fm-ai-bubble{background:var(--bg-soft,#f8fafc);color:var(--text,#0c1b27);border:1px solid var(--border,#e5e7eb);border-bottom-left-radius:4px}',
      '.fm-ai-bubble p{margin:0 0 8px 0}',
      '.fm-ai-bubble p:last-child{margin-bottom:0}',
      '.fm-ai-bubble code{background:rgba(20,184,166,.1);padding:1px 5px;border-radius:4px;font-family:var(--fm,monospace);font-size:.86em;color:#0d9488}',
      '.fm-ai-user .fm-ai-bubble code{background:rgba(255,255,255,.2);color:#fff}',
      '.fm-ai-bubble pre{background:rgba(4,17,31,.06);padding:10px 12px;border-radius:8px;overflow-x:auto;margin:8px 0;border:1px solid rgba(20,184,166,.15)}',
      '.fm-ai-bubble pre code{background:none;padding:0;color:var(--text);font-size:.84em}',
      '.fm-ai-typing{display:inline-flex;gap:4px;padding:4px 0}',
      '.fm-ai-typing span{width:6px;height:6px;border-radius:50%;background:#14b8a6;animation:fmAiBlink 1.4s ease-in-out infinite}',
      '.fm-ai-typing span:nth-child(2){animation-delay:.2s}',
      '.fm-ai-typing span:nth-child(3){animation-delay:.4s}',
      '@keyframes fmAiBlink{0%,80%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}',
      '.fm-ai-input{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--border,#e5e7eb);background:color-mix(in srgb,var(--surface,#fff) 95%,transparent);align-items:flex-end}',
      '.fm-ai-input textarea{flex:1;padding:10px 12px;border:1px solid var(--border-strong,#cbd5e1);border-radius:12px;font-family:var(--fb,system-ui);font-size:.92rem;line-height:1.5;background:var(--surface,#fff);color:var(--text);resize:none;outline:none;max-height:120px;transition:border-color 200ms,box-shadow 240ms}',
      '.fm-ai-input textarea:focus{border-color:#14b8a6;box-shadow:0 0 0 3px rgba(20,184,166,.15)}',
      '.fm-ai-send{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#14b8a6,#0d9488);color:#fff;border:none;cursor:pointer;display:grid;place-items:center;flex-shrink:0;transition:all 220ms cubic-bezier(.34,1.56,.64,1);box-shadow:0 6px 16px rgba(20,184,166,.35)}',
      '.fm-ai-send:hover{transform:translateY(-1px) scale(1.05);box-shadow:0 10px 22px rgba(20,184,166,.45)}',
      '.fm-ai-send:active{transform:scale(.95)}',
      '@media (max-width:480px){.fm-ai-pnl{bottom:0;right:0;left:0;width:100%;height:80vh;border-radius:22px 22px 0 0}}',
      '@media (prefers-reduced-motion:reduce){.fm-ai-dot,.fm-ai-typing span,.fm-ai-msg{animation:none!important}}'
    ].join('');
    if (document.head) document.head.appendChild(s);
    else if (document.body) document.body.appendChild(s);
  }
};

global.FMAI = FMAI;

// ─────────────────────────────────────────────────────────────
// 14. FMTour · 引导教程系统
// ─────────────────────────────────────────────────────────────
/**
 * 用法：
 *   FMTour.start([
 *     { selector: '#userPill', title: '账户菜单', desc: '点击查看你的统计与设置' },
 *     { selector: '.hub-card', title: '学习中心', desc: '4 大入口快速开始' },
 *     { selector: '#fmAiFab', title: 'AI 助教', desc: '随时提问，流式回答' }
 *   ]);
 *   
 *   // 仅首次访问触发
 *   if (!FMTour.completed('main-tour')) {
 *     FMTour.start([...], { id: 'main-tour' });
 *   }
 */
var FMTour = {
  _state: { steps: [], idx: 0, opts: {} },
  
  start: function(steps, opts) {
    if (!Array.isArray(steps) || !steps.length) return;
    opts = opts || {};
    if (opts.id && FMTour.completed(opts.id)) return;
    FMTour._state = { steps: steps, idx: 0, opts: opts };
    FMTour._injectCSS();
    FMTour._renderStep();
  },
  
  next: function() {
    var s = FMTour._state;
    s.idx++;
    if (s.idx >= s.steps.length) return FMTour.finish();
    FMTour._renderStep();
  },
  
  prev: function() {
    var s = FMTour._state;
    s.idx = Math.max(0, s.idx - 1);
    FMTour._renderStep();
  },
  
  finish: function() {
    var s = FMTour._state;
    if (s.opts.id) {
      var done = _getJSON('fm_tour_done', {}) || {};
      done[s.opts.id] = Date.now();
      _setJSON('fm_tour_done', done);
    }
    FMTour._cleanup();
    if (s.opts.onFinish) try { s.opts.onFinish(); } catch (_) {}
  },
  
  skip: function() {
    var s = FMTour._state;
    if (s.opts.id) {
      var done = _getJSON('fm_tour_done', {}) || {};
      done[s.opts.id] = Date.now();
      _setJSON('fm_tour_done', done);
    }
    FMTour._cleanup();
    if (s.opts.onSkip) try { s.opts.onSkip(); } catch (_) {}
  },
  
  completed: function(id) {
    var done = _getJSON('fm_tour_done', {}) || {};
    return !!done[id];
  },
  
  reset: function(id) {
    var done = _getJSON('fm_tour_done', {}) || {};
    if (id) delete done[id]; else done = {};
    _setJSON('fm_tour_done', done);
  },
  
  _renderStep: function() {
    var s = FMTour._state;
    var step = s.steps[s.idx];
    if (!step) return;
    
    FMTour._cleanup(true); // 保留 backdrop
    
    var target = step.selector ? document.querySelector(step.selector) : null;
    
    // 高亮目标
    var spotlight = document.getElementById('fm-tour-spot');
    if (!spotlight) {
      spotlight = document.createElement('div');
      spotlight.id = 'fm-tour-spot';
      spotlight.className = 'fm-tour-spot';
      document.body.appendChild(spotlight);
    }
    
    if (target) {
      var rect = target.getBoundingClientRect();
      var pad = step.padding || 8;
      spotlight.style.cssText =
        'top:' + (rect.top - pad) + 'px;' +
        'left:' + (rect.left - pad) + 'px;' +
        'width:' + (rect.width + pad * 2) + 'px;' +
        'height:' + (rect.height + pad * 2) + 'px;';
      spotlight.classList.add('on');
      // 滚动到目标
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      spotlight.classList.remove('on');
    }
    
    // 卡片
    var card = document.createElement('div');
    card.className = 'fm-tour-card';
    card.id = 'fm-tour-card';
    card.innerHTML =
      '<div class="fm-tour-prog">' +
        Array.from({ length: s.steps.length }, function(_, i) {
          return '<span class="' + (i === s.idx ? 'on' : i < s.idx ? 'done' : '') + '"></span>';
        }).join('') +
      '</div>' +
      '<h3>' + _esc(step.title || '') + '</h3>' +
      '<p>' + _esc(step.desc || '') + '</p>' +
      '<div class="fm-tour-acts">' +
        '<button class="fm-tour-skip" data-fm-tour="skip">跳过</button>' +
        '<div class="fm-tour-nav">' +
          (s.idx > 0 ? '<button class="fm-tour-btn fm-tour-prev" data-fm-tour="prev">上一步</button>' : '') +
          '<button class="fm-tour-btn fm-tour-next" data-fm-tour="next">' +
            (s.idx === s.steps.length - 1 ? '完成 ✓' : '下一步 →') +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(card);
    
    // 定位卡片
    setTimeout(function() {
      if (!target) {
        // 居中
        card.style.cssText += 'top:50%;left:50%;transform:translate(-50%,-50%) scale(1);opacity:1;';
      } else {
        var tr = target.getBoundingClientRect();
        var cr = card.getBoundingClientRect();
        var spaceBelow = window.innerHeight - tr.bottom;
        var top, left;
        if (spaceBelow > cr.height + 32) {
          top = tr.bottom + 16;
        } else {
          top = Math.max(20, tr.top - cr.height - 16);
        }
        left = Math.max(20, Math.min(window.innerWidth - cr.width - 20, tr.left + tr.width / 2 - cr.width / 2));
        card.style.cssText += 'top:' + top + 'px;left:' + left + 'px;transform:scale(1);opacity:1;';
      }
    }, 30);
    
    // 事件
    card.addEventListener('click', function(e) {
      var btn = e.target.closest('[data-fm-tour]');
      if (!btn) return;
      var act = btn.dataset.fmTour;
      if (act === 'next') FMTour.next();
      else if (act === 'prev') FMTour.prev();
      else if (act === 'skip') FMTour.skip();
    });
    
    // backdrop（仅一次）
    if (!document.getElementById('fm-tour-backdrop')) {
      var bd = document.createElement('div');
      bd.id = 'fm-tour-backdrop';
      bd.className = 'fm-tour-backdrop';
      document.body.appendChild(bd);
      setTimeout(function() { bd.classList.add('on'); }, 10);
    }
  },
  
  _cleanup: function(keepBackdrop) {
    var card = document.getElementById('fm-tour-card');
    if (card) card.remove();
    var spot = document.getElementById('fm-tour-spot');
    if (spot && !keepBackdrop) spot.remove();
    if (!keepBackdrop) {
      var bd = document.getElementById('fm-tour-backdrop');
      if (bd) {
        bd.classList.remove('on');
        setTimeout(function() { if (bd.parentNode) bd.remove(); }, 320);
      }
    }
  },
  
  _injectCSS: function() {
    if (document.getElementById('fm-tour-css')) return;
    var s = document.createElement('style');
    s.id = 'fm-tour-css';
    s.textContent = [
      '.fm-tour-backdrop{position:fixed;inset:0;z-index:9700;background:rgba(4,17,31,.5);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;transition:opacity 320ms;pointer-events:none}',
      '.fm-tour-backdrop.on{opacity:1;pointer-events:auto}',
      '.fm-tour-spot{position:fixed;z-index:9750;border-radius:14px;pointer-events:none;box-shadow:0 0 0 9999px rgba(4,17,31,.6),0 0 0 3px rgba(20,184,166,.6),0 0 30px rgba(20,184,166,.4);transition:all 480ms cubic-bezier(.16,1,.3,1);opacity:0}',
      '.fm-tour-spot.on{opacity:1}',
      '.fm-tour-card{position:fixed;z-index:9800;width:min(360px,calc(100vw - 40px));padding:20px 22px;background:var(--surface,#fff);border:1px solid var(--border,#e5e7eb);border-radius:18px;box-shadow:0 24px 60px rgba(0,0,0,.3);opacity:0;transform:scale(.92);transition:all 380ms cubic-bezier(.34,1.56,.64,1);pointer-events:auto}',
      '[data-theme="dark"] .fm-tour-card{box-shadow:0 24px 60px rgba(0,0,0,.6)}',
      '.fm-tour-prog{display:flex;gap:6px;margin-bottom:14px}',
      '.fm-tour-prog span{flex:1;height:3px;border-radius:2px;background:var(--border-strong,#cbd5e1);transition:background 320ms}',
      '.fm-tour-prog span.done{background:#14b8a6}',
      '.fm-tour-prog span.on{background:linear-gradient(90deg,#14b8a6,#f97316)}',
      '.fm-tour-card h3{font-family:var(--fd,Georgia);font-size:1.1rem;font-weight:600;letter-spacing:-.02em;margin:0 0 6px;color:var(--text)}',
      '.fm-tour-card p{font-size:.9rem;line-height:1.6;color:var(--text-soft,#475569);margin:0 0 16px}',
      '.fm-tour-acts{display:flex;justify-content:space-between;align-items:center;gap:8px}',
      '.fm-tour-skip{background:none;border:none;color:var(--text-muted,#94a3b8);font-size:.84rem;cursor:pointer;padding:6px 8px;font-family:inherit;transition:color 200ms}',
      '.fm-tour-skip:hover{color:var(--text)}',
      '.fm-tour-nav{display:flex;gap:6px}',
      '.fm-tour-btn{padding:8px 14px;border-radius:10px;font-size:.86rem;font-weight:600;cursor:pointer;border:none;font-family:inherit;transition:all 220ms cubic-bezier(.34,1.56,.64,1)}',
      '.fm-tour-prev{background:var(--bg-soft,#f1f5f9);color:var(--text)}',
      '.fm-tour-prev:hover{background:var(--border-strong,#cbd5e1)}',
      '.fm-tour-next{background:linear-gradient(135deg,#14b8a6,#0d9488);color:#fff;box-shadow:0 4px 12px rgba(20,184,166,.35)}',
      '.fm-tour-next:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(20,184,166,.45)}',
      '@media (prefers-reduced-motion:reduce){.fm-tour-spot,.fm-tour-card{transition:none!important}}'
    ].join('');
    if (document.head) document.head.appendChild(s);
    else if (document.body) document.body.appendChild(s);
  }
};

global.FMTour = FMTour;

// ─────────────────────────────────────────────────────────────
// 15. FMFluid · Canvas 流体粒子动画（真实物理感）
// ─────────────────────────────────────────────────────────────
/**
 * 用法：
 *   <canvas id="bg-fluid"></canvas>
 *   <script>FMFluid.attach('#bg-fluid', { particles: 80, hue: 'tide' });</script>
 * 
 * 算法：
 *   - Perlin-like 矢量场（快速近似）
 *   - 200-400 粒子在场中移动
 *   - 粒子轨迹叠加形成流线
 *   - 速度由噪声场决定（模拟流体）
 */
var FMFluid = {
  _instances: [],
  
  attach: function(target, opts) {
    var canvas = typeof target === 'string' ? document.querySelector(target) : target;
    if (!canvas || canvas.tagName !== 'CANVAS') return null;
    opts = opts || {};
    
    // 检查 reduced motion
    if (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) return null;
    
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    var inst = {
      canvas: canvas,
      ctx: ctx,
      particles: [],
      raf: null,
      running: false,
      opts: Object.assign({
        particleCount: 80,
        hue: 'tide',  // 'tide' | 'coral' | 'mixed'
        speed: 1,
        trail: 0.05,  // 0 = 无轨迹（粒子点）, 0.05 = 长轨迹
        particleSize: 1.2
      }, opts),
      width: 0,
      height: 0,
      time: 0
    };
    
    function resize() {
      var dpr = window.devicePixelRatio || 1;
      var rect = canvas.getBoundingClientRect();
      inst.width = rect.width;
      inst.height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();
    
    // 监听容器尺寸
    var ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(resize);
      ro.observe(canvas.parentElement || canvas);
    }
    window.addEventListener('resize', resize, { passive: true });
    
    // 初始化粒子
    function spawnParticle() {
      return {
        x: Math.random() * inst.width,
        y: Math.random() * inst.height,
        vx: 0,
        vy: 0,
        life: Math.random() * 200 + 100,
        age: 0,
        hue: inst.opts.hue === 'mixed'
          ? (Math.random() < 0.6 ? 'tide' : 'coral')
          : inst.opts.hue
      };
    }
    
    for (var i = 0; i < inst.opts.particleCount; i++) {
      inst.particles.push(spawnParticle());
    }
    
    // 简化的矢量场（基于时间和位置的伪 noise）
    function field(x, y, t) {
      var nx = x * 0.003;
      var ny = y * 0.003;
      var angle =
        Math.sin(nx + t * 0.0003) * Math.PI +
        Math.cos(ny + t * 0.0004) * Math.PI +
        Math.sin((nx + ny) * 1.3 + t * 0.0002) * Math.PI;
      return {
        vx: Math.cos(angle) * inst.opts.speed,
        vy: Math.sin(angle) * inst.opts.speed * 0.7
      };
    }
    
    function tick() {
      if (!inst.running) return;
      inst.time++;
      
      // 半透明覆盖（轨迹效果）
      ctx.fillStyle = 'rgba(0,0,0,' + inst.opts.trail + ')';
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillRect(0, 0, inst.width, inst.height);
      ctx.globalCompositeOperation = 'source-over';
      
      // 更新粒子
      for (var i = 0; i < inst.particles.length; i++) {
        var p = inst.particles[i];
        var f = field(p.x, p.y, inst.time);
        p.vx = p.vx * 0.92 + f.vx * 0.08;
        p.vy = p.vy * 0.92 + f.vy * 0.08;
        p.x += p.vx;
        p.y += p.vy;
        p.age++;
        
        // 边界 / 死亡 → 重生
        if (p.x < -10 || p.x > inst.width + 10 || p.y < -10 || p.y > inst.height + 10 || p.age > p.life) {
          inst.particles[i] = spawnParticle();
          continue;
        }
        
        // 绘制粒子（带渐变光晕）
        var fade = Math.min(1, Math.min(p.age / 30, (p.life - p.age) / 30));
        var color = p.hue === 'coral'
          ? 'rgba(249,115,22,' + (0.6 * fade) + ')'
          : 'rgba(45,212,191,' + (0.55 * fade) + ')';
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, inst.opts.particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      inst.raf = requestAnimationFrame(tick);
    }
    
    inst.start = function() {
      if (inst.running) return;
      inst.running = true;
      tick();
    };
    inst.stop = function() {
      inst.running = false;
      if (inst.raf) cancelAnimationFrame(inst.raf);
    };
    inst.destroy = function() {
      inst.stop();
      if (ro) try { ro.disconnect(); } catch (_) {}
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, inst.width, inst.height);
      var i = FMFluid._instances.indexOf(inst);
      if (i >= 0) FMFluid._instances.splice(i, 1);
    };
    
    inst.start();
    FMFluid._instances.push(inst);
    
    // 页面隐藏时暂停
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) inst.stop();
      else if (inst.running === false) inst.start();
    });
    
    return inst;
  },
  
  destroyAll: function() {
    FMFluid._instances.slice().forEach(function(i) { i.destroy(); });
  }
};

global.FMFluid = FMFluid;

console.log('[FM Core] v1.6 loaded · 15 APIs ready (+FMTour +FMFluid)');

})(typeof window !== 'undefined' ? window : globalThis);
