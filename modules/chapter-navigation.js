(function() {
  var chapterInfo = {
    'boundary-layer':       { icon: 'fa-layer-group',        name: '边界层理论',     file: 'boundary-layer-dynamic.html' },
    'energy-equation':      { icon: 'fa-bolt',                name: '能量方程',       file: 'energy-equation-dynamic.html' },
    'error-prone':          { icon: 'fa-exclamation-triangle', name: '易错题集',       file: 'error-prone-dynamic.html' },
    'exam-dynamic':         { icon: 'fa-clipboard-check',    name: '考试模拟',       file: 'exam-dynamic.html' },
    'experiment-dimension': { icon: 'fa-flask',              name: '实验与量纲分析', file: 'experiment-dimension-dynamic.html' },
    'flow-stability':       { icon: 'fa-balance-scale',      name: '流动稳定性',     file: 'flow-stability-dynamic.html' },
    'fluid-dynamics':       { icon: 'fa-water',              name: '流体动力学',     file: 'fluid-dynamics-dynamic.html' },
    'fluid-statics':        { icon: 'fa-balance-scale',      name: '流体静力学',     file: 'fluid-statics-dynamic.html' },
    'free-surface':         { icon: 'fa-water',               name: '自由面流动',     file: 'free-surface-dynamic.html' },
    'measurement-experiment':{ icon: 'fa-tachometer-alt',    name: '实验与测量',     file: 'measurement-experiment-dynamic.html' },
    'numerical-methods':    { icon: 'fa-calculator',          name: '数值方法',       file: 'numerical-methods-dynamic.html' },
    'pipe-flow':            { icon: 'fa-water',               name: '管道流动',       file: 'pipe-flow-dynamic.html' },
    'potential-flow':       { icon: 'fa-stream',              name: '势流理论',       file: 'potential-flow-dynamic.html' },
    'practice-dynamic':     { icon: 'fa-brain',              name: '题库练习',       file: 'practice-dynamic.html' },
    'question-bank':        { icon: 'fa-book',                name: '题库',           file: 'question-bank.html' },
    'real-exams':           { icon: 'fa-medal',               name: '历年真题',       file: 'real-exams-dynamic.html' },
    'simulation-dynamic':   { icon: 'fa-flask',              name: '仿真实验',       file: 'simulation-dynamic.html' },
    'turbulent-flow':       { icon: 'fa-wind',                name: '湍流理论',       file: 'turbulent-flow-dynamic.html' },
    'viscous-flow':         { icon: 'fa-tint',                name: '粘性流动',       file: 'viscous-flow-dynamic.html' },
    'vorticity-theory':     { icon: 'fa-vortex',              name: '涡量理论',       file: 'vorticity-theory-dynamic.html' }
  };

  var relationships = {
    'boundary-layer':       ['fluid-dynamics', 'viscous-flow', 'turbulent-flow', 'energy-equation', 'flow-stability'],
    'energy-equation':      ['fluid-dynamics', 'boundary-layer', 'pipe-flow', 'fluid-statics'],
    'error-prone':          ['practice-dynamic', 'question-bank', 'real-exams'],
    'exam-dynamic':         ['practice-dynamic', 'question-bank', 'real-exams', 'error-prone'],
    'experiment-dimension': ['fluid-dynamics', 'measurement-experiment', 'numerical-methods'],
    'flow-stability':       ['fluid-dynamics', 'boundary-layer', 'turbulent-flow', 'viscous-flow'],
    'fluid-dynamics':       ['fluid-statics', 'viscous-flow', 'energy-equation', 'boundary-layer', 'potential-flow', 'vorticity-theory'],
    'fluid-statics':        ['fluid-dynamics', 'free-surface', 'pipe-flow'],
    'free-surface':         ['fluid-statics', 'fluid-dynamics', 'boundary-layer'],
    'measurement-experiment':['experiment-dimension', 'fluid-dynamics', 'pipe-flow'],
    'numerical-methods':    ['simulation-dynamic', 'fluid-dynamics', 'experiment-dimension'],
    'pipe-flow':            ['fluid-dynamics', 'viscous-flow', 'energy-equation', 'measurement-experiment'],
    'potential-flow':       ['fluid-dynamics', 'vorticity-theory', 'boundary-layer'],
    'practice-dynamic':     ['question-bank', 'error-prone', 'exam-dynamic', 'real-exams'],
    'real-exams':           ['question-bank', 'practice-dynamic', 'exam-dynamic', 'error-prone'],
    'simulation-dynamic':   ['numerical-methods', 'fluid-dynamics'],
    'turbulent-flow':       ['fluid-dynamics', 'boundary-layer', 'flow-stability', 'viscous-flow'],
    'viscous-flow':         ['fluid-dynamics', 'pipe-flow', 'boundary-layer', 'turbulent-flow'],
    'vorticity-theory':     ['fluid-dynamics', 'potential-flow', 'flow-stability']
  };

  function getCurrentPageKey() {
    var path = window.location.pathname;
    var filename = path.split('/').pop().replace('.html', '');
    if (chapterInfo[filename]) return filename;
    for (var key in chapterInfo) {
      if (chapterInfo[key].file === path.split('/').pop()) return key;
    }
    return null;
  }

  function injectNavigation() {
    var pageKey = getCurrentPageKey();
    if (!pageKey || !relationships[pageKey]) return;

    var related = relationships[pageKey];
    var navDiv = document.createElement('div');
    navDiv.className = 'nav-buttons';
    navDiv.style.cssText = 'display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin:20px 0;padding:15px 0;';

    var homeLink = document.createElement('a');
    homeLink.href = '../index-complete.html';
    homeLink.className = 'nav-btn';
    homeLink.innerHTML = '<i class="fas fa-home"></i> 返回首页';
    homeLink.style.cssText = 'background:linear-gradient(135deg,#4CAF50,#8BC34A);color:white;padding:15px 30px;border-radius:25px;text-decoration:none;font-weight:bold;transition:all 0.3s ease;box-shadow:0 10px 30px rgba(76,175,80,0.3);border:2px solid rgba(255,255,255,0.3);display:inline-flex;align-items:center;gap:10px;';
    navDiv.appendChild(homeLink);

    related.forEach(function(chKey) {
      var ch = chapterInfo[chKey];
      if (!ch) return;
      var link = document.createElement('a');
      link.href = ch.file;
      link.className = 'nav-btn';
      link.innerHTML = '<i class="fas ' + ch.icon + '"></i> ' + ch.name;
      link.style.cssText = 'background:linear-gradient(135deg,#4CAF50,#8BC34A);color:white;padding:15px 30px;border-radius:25px;text-decoration:none;font-weight:bold;transition:all 0.3s ease;box-shadow:0 10px 30px rgba(76,175,80,0.3);border:2px solid rgba(255,255,255,0.3);display:inline-flex;align-items:center;gap:10px;';
      navDiv.appendChild(link);
    });

    var container = document.querySelector('.container');
    var header = document.querySelector('header');
    if (header && header.parentNode === container) {
      container.insertBefore(navDiv, header.nextSibling);
    } else if (container) {
      container.insertBefore(navDiv, container.firstChild.nextSibling);
    } else {
      document.body.insertBefore(navDiv, document.body.firstChild);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavigation);
  } else {
    injectNavigation();
  }
})();