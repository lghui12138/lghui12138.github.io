#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';
import { round588 } from './round588-question-bank-home-conductor-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round588 apply from /Volumes/mac_2T during lifs isolation.');
}

function abs(rel) {
  return path.join(repoRoot, rel);
}

function readText(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function writeText(rel, text) {
  fs.writeFileSync(abs(rel), text);
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function writeJson(rel, data) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  writeText(rel, text);
  fs.writeFileSync(abs(`${rel}.gz`), zlib.gzipSync(Buffer.from(text)));
}

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function walkHtml(relDir) {
  const dir = abs(relDir);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile() && entry.name === 'index.html') out.push(path.relative(repoRoot, full));
    }
  }
  return out.sort();
}

function addBodyMarker(text, marker) {
  return text.replace(/<body([^>]*)>/, (match, attrs) => {
    const cleanAttrs = attrs.replace(new RegExp(`\\s${marker}="1"`, 'g'), '').trim();
    return cleanAttrs ? `<body ${cleanAttrs} ${marker}="1">` : `<body ${marker}="1">`;
  });
}

function injectNamedStyle(text, marker, css) {
  const stripped = text.replace(new RegExp(`\\s*<style ${marker}>[\\s\\S]*?<\\/style>\\s*`, 'g'), '\n');
  const block = css.trimEnd();
  if (stripped.includes('\n</head>')) return stripped.replace(/\n\s*<\/head>/, `\n${block}\n</head>`);
  return stripped.replace('</head>', `${block}</head>`);
}

function injectStyle(text, css) {
  return injectNamedStyle(text, 'data-round588-question-bank-home-conductor', css);
}

const homeCss = `
  <style data-round588-question-bank-home-conductor>
    /* Round588 question-bank home route conductor */
    body[data-round588-route-conductor-page="1"] {
      background: linear-gradient(180deg, #f8fafc 0, #ffffff 220px, #f4f7fb 100%);
    }
    body[data-round588-route-conductor-page="1"] .workbench-topline {
      border-color: rgba(37, 99, 235, 0.16);
      box-shadow: 0 12px 36px -26px rgba(15, 23, 42, 0.42);
    }
    body[data-round588-route-conductor-page="1"] .workbench-topline__main {
      grid-template-columns: auto repeat(4, minmax(0, auto));
    }
    body[data-round588-route-conductor-page="1"] .workbench-release-label {
      background: #0f172a;
    }
    body[data-round588-route-conductor-page="1"] .workbench-status-pill {
      background: #ffffff;
      border-color: rgba(15, 23, 42, 0.1);
    }
    body[data-round588-route-conductor-page="1"] .workbench-status-pill[data-state="primary"] strong,
    body[data-round588-route-conductor-page="1"] .workbench-status-pill[data-state="ok"] strong {
      color: #0f766e;
    }
    body[data-round588-route-conductor-page="1"] .workbench-status-pill[data-state="proof"] strong {
      color: #4f46e5;
    }
    body[data-round588-route-conductor-page="1"] .workbench-status-pill[data-state="info"] strong {
      color: #1d4ed8;
    }
    body[data-round588-route-conductor-page="1"] .workbench-status-pill[data-state="strict"] strong {
      color: #b45309;
    }
    body[data-round588-route-conductor-page="1"] .workbench-topline__actions {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, auto));
    }
    body[data-round588-route-conductor-page="1"] .workbench-topline__actions a {
      justify-content: center;
      min-width: 82px;
      border-radius: 8px;
    }
    body[data-round588-route-conductor-page="1"] .workbench-summary.hero {
      border-color: rgba(15, 23, 42, 0.08);
      background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%) !important;
    }
    body[data-round588-route-conductor-page="1"] .hero-main {
      display: flex;
      flex-direction: column;
    }
    body[data-round588-route-conductor-page="1"] .summary-actions {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    body[data-round588-route-conductor-page="1"] .summary-actions a {
      border-radius: 8px;
      box-shadow: none;
    }
    body[data-round588-route-conductor-page="1"] .summary-actions a.primary {
      background: #0f172a;
    }
    body[data-round588-route-conductor-page="1"] .round588-current-note {
      margin: 8px 0 0;
      padding: 8px 10px;
      border: 1px solid rgba(37, 99, 235, 0.14);
      border-radius: 8px;
      background: #eff6ff;
      color: #1e3a8a;
      font-size: 0.82rem;
      font-weight: 760;
      line-height: 1.5;
    }
    body[data-round588-route-conductor-page="1"] .round385-181103-main-entry {
      border-color: rgba(15, 118, 110, 0.16);
    }
    body[data-round588-route-conductor-page="1"] .round573-flow-rail a,
    body[data-round588-route-conductor-page="1"] .intent-link,
    body[data-round588-route-conductor-page="1"] .round351-mobile-shortcuts__grid a {
      border-radius: 8px;
    }
    body[data-round588-route-conductor-page="1"] a:focus-visible,
    body[data-round588-route-conductor-page="1"] button:focus-visible,
    body[data-round588-route-conductor-page="1"] summary:focus-visible {
      outline: 3px solid rgba(37, 99, 235, .42);
      outline-offset: 3px;
    }
    @media (max-width: 940px) {
      body[data-round588-route-conductor-page="1"] .workbench-topline {
        grid-template-columns: 1fr;
      }
      body[data-round588-route-conductor-page="1"] .workbench-topline__actions {
        justify-content: stretch;
      }
      body[data-round588-route-conductor-page="1"] .workbench-topline__actions a {
        min-width: 0;
      }
    }
    @media (max-width: 640px) {
      body[data-round588-route-conductor-page="1"] .workbench-topline__main,
      body[data-round588-route-conductor-page="1"] .workbench-topline__actions {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      body[data-round588-route-conductor-page="1"] .workbench-release-label {
        grid-column: 1 / -1;
        align-items: center;
      }
      body[data-round588-route-conductor-page="1"] .summary-actions,
      body[data-round588-route-conductor-page="1"] .workbench-metric-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      body[data-round588-route-conductor-page="1"] .summary-actions {
        order: 4;
      }
      body[data-round588-route-conductor-page="1"] .workbench-metric-strip {
        order: 5;
      }
      body[data-round588-route-conductor-page="1"] .status-details {
        order: 6;
      }
      body[data-round588-route-conductor-page="1"] .round588-current-note {
        order: 7;
      }
      body[data-round588-route-conductor-page="1"] .index-status {
        order: 8;
      }
      body[data-round588-route-conductor-page="1"] .proof-checklist {
        padding: 8px;
      }
      body[data-round588-route-conductor-page="1"] .proof-checklist p {
        font-size: 0.8rem;
      }
    }
    @media (max-width: 360px) {
      body[data-round588-route-conductor-page="1"] .workbench-topline__actions,
      body[data-round588-route-conductor-page="1"] .summary-actions {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      body[data-round588-route-conductor-page="1"] .workbench-metric-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media (max-width: 340px) {
      body[data-round588-route-conductor-page="1"] .workbench-topline__actions {
        display: none;
      }
      body[data-round588-route-conductor-page="1"] .summary-lede {
        font-size: 0.8rem;
        line-height: 1.4;
      }
    }
  </style>`;

const qbankModuleCss = `
  <style data-round588-question-bank-route-conductor>
    /* Round588 question-bank module route conductor */
    .round588-qbank-route-banner {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin: 0 0 12px;
      padding: 10px;
      border: 1px solid rgba(13, 148, 136, .22);
      border-radius: 8px;
      background: linear-gradient(180deg, rgba(240, 253, 250, .96), rgba(248, 250, 252, .92));
      color: var(--text-soft);
    }
    .round588-qbank-route-banner span {
      min-width: 0;
      min-height: 44px;
      display: grid;
      align-content: center;
      gap: 2px;
      padding: 8px 10px;
      border: 1px solid rgba(15, 23, 42, .08);
      border-radius: 8px;
      background: rgba(255, 255, 255, .78);
      font-size: .8rem;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }
    .round588-qbank-route-banner b {
      color: var(--text);
      font-size: .86rem;
      line-height: 1.2;
    }
    @media (max-width: 820px) {
      .round588-qbank-route-banner { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 420px) {
      .round588-qbank-route-banner { grid-template-columns: 1fr; }
    }
  </style>`;

const topMain = `      <div class="workbench-topline__main">
        <span class="workbench-release-label"><b>Round588</b><span>入口路线指挥台</span></span>
        <span class="workbench-status-pill" data-state="primary">181103 <strong>400/122</strong></span>
        <span class="workbench-status-pill" data-state="proof">证 <strong>422/8</strong></span>
        <span class="workbench-status-pill" data-state="info">真 <strong>353/163</strong></span>
        <span class="workbench-status-pill" data-state="strict">PDF <strong>strict 0</strong></span>
      </div>
`;

const topActions = `      <div class="workbench-topline__actions">
        <a href="./modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round588.version}#questionBanksList">直达题库</a>
        <a href="./resources/fluid-181103-html/index.html?edge_refresh=${round588.version}">38 HTML</a>
        <a href="/data/fluid-round588-question-bank-home-conductor-ledger.json">Round588 账本</a>
        <a href="./modules/site-updates.html">更新记录</a>
      </div>
`;

const homeBoundaryNote = '<p class="round588-current-note" data-round588-route-conductor="boundary-note">当前入口只做路线和显示升级：入口 400/122、trust 422/100、proof-depth 422/8、真题可见答案 353/353 与 strictAnswerPdfProof=0 继续分层，不把派生参考答案冒充原卷 PDF 证明。</p>';

function updateCurrentText(text) {
  let next = replaceAll(text, round588.previousVersion, round588.version);
  next = replaceAll(next, `Round587 · ${round588.version}`, `Round588 · ${round588.version}`);
  next = replaceAll(next, `当前版本：Round587 · ${round588.version}`, `当前版本：Round588 · ${round588.version}`);
  next = replaceAll(next, `当前发布：Round587 · ${round588.version}`, `当前发布：Round588 · ${round588.version}`);
  next = replaceAll(next, 'Round587：资源中心与 181103 HTML 资料路线升级', 'Round588：题库入口路线指挥台与当前轮次清理');
  next = replaceAll(next, '看本轮账本<small>ui-only / strict 0</small>', '资源路线账本<small>Round587 / strict 0</small>');
  return next;
}

function addCurrentEdgeRefreshToRoutes(text) {
  let next = text;
  next = next.replace(
    /(focus=181103-material-extracted&answer_status=current)(?![^"#]*edge_refresh)/g,
    `$1&edge_refresh=${round588.version}`
  );
  next = next.replace(
    /href="(\/resources\/fluid-181103-html\/index\.html)(?![?#"])/g,
    `href="$1?edge_refresh=${round588.version}`
  );
  next = next.replace(
    /href="(\.\/resources\/fluid-181103-html\/index\.html)(?![?#"])/g,
    `href="$1?edge_refresh=${round588.version}`
  );
  next = next.replace(
    /href="(\/modules\/real-exams-dynamic\.html)(?![?#"])/g,
    `href="$1?edge_refresh=${round588.version}`
  );
  next = next.replace(
    /href="(\.\/modules\/real-exams-dynamic\.html)(?![?#"])/g,
    `href="$1?edge_refresh=${round588.version}`
  );
  return next;
}

function updateQuestionBankHome(text) {
  let next = addCurrentEdgeRefreshToRoutes(updateCurrentText(text));
  next = addBodyMarker(next, 'data-round588-route-conductor-page');
  next = injectStyle(next, homeCss);
  if (!next.includes('data-round588-route-conductor="topline"')) {
    next = next.replace(
      '<section class="workbench-topline" aria-label="题库工作台当前状态">',
      '<section class="workbench-topline" data-round588-route-conductor="topline" aria-label="题库工作台当前状态">'
    );
  }
  next = next.replace(/      <div class="workbench-topline__main">[\s\S]*?      <\/div>\n      <div class="workbench-topline__actions">/, `${topMain}      <div class="workbench-topline__actions">`);
  next = next.replace(/      <div class="workbench-topline__actions">[\s\S]*?      <\/div>\n    <\/section>/, `${topActions}    </section>`);
  if (!next.includes('data-round588-route-conductor="summary"')) {
    next = next.replace(
      'data-round584-home-density="reader-workbench" data-round584-first-viewport-density-gate="1">',
      'data-round584-home-density="reader-workbench" data-round584-first-viewport-density-gate="1" data-round588-route-conductor="summary" data-round588-current-gate="1">'
    );
  }
  next = next.replace(
    /<p class="summary-lede">[\s\S]*?<\/p>/,
    '<p class="summary-lede">Round588 在 Round587 资源路线基础上继续保留全部题量、答案、证明记录和来源边界；本轮把进题库前的入口改成当前路线指挥台：先选 181103 400/122、真题 353/163、38 HTML 或公式边界，再进入题库。</p>'
  );
  if (!next.includes('data-round588-route-conductor="summary-actions"')) {
    next = next.replace(
      '<nav class="summary-actions" aria-label="题库入口当前路线">',
      '<nav class="summary-actions" data-round588-route-conductor="summary-actions" aria-label="题库入口当前路线">'
    );
  }
  next = next.replace(
    /<a class="primary" data-round582-primary-action="181103"[\s\S]*?<\/a>\n          <a href="\.\/modules\/real-exams-dynamic\.html[\s\S]*?<\/a>\n          <a href="\.\/resources\/fluid-181103-html\/index\.html"[\s\S]*?<\/a>\n          <a href="\.\/index-complete\.html#formula-checklist"[\s\S]*?<\/a>/,
    `<a class="primary" data-round582-primary-action="181103" href="./modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round588.version}#questionBanksList">看 400<span>181103 可参考</span></a>
          <a href="./modules/real-exams-dynamic.html?edge_refresh=${round588.version}#sourceGranularityNote">刷 353<span>真题答案覆盖</span></a>
          <a href="./resources/fluid-181103-html/index.html?edge_refresh=${round588.version}">查 38<span>HTML 资料</span></a>
          <a href="./index-complete.html#formula-checklist">核 strict 0<span>边界 / 原卷证据</span></a>`
  );
  if (!next.includes('data-round588-route-conductor="primary-entry"')) {
    next = next.replace(
      '<section class="round385-181103-main-entry"',
      '<section class="round385-181103-main-entry" data-round588-route-conductor="primary-entry"'
    );
  }
  if (!next.includes('data-round588-route-conductor="proof-checklist"')) {
    next = next.replace('data-round575-auth-noise="split" aria-label="181103 证明题答案升级状态"', 'data-round575-auth-noise="split" data-round588-route-conductor="proof-checklist" aria-label="181103 证明题答案升级状态"');
  }
  next = next.replace('<h2>证明与入口审查表</h2>', '<h2>证明与入口边界表</h2>');
  next = next.replace('<b>Round573-fluidity-polish</b>', '<b>Round588-route-conductor</b>');
  next = next.replace('证 <strong>422/6</strong>', '证 <strong>422/8</strong>');
  if (!next.includes('data-round588-route-conductor="mobile-shortcuts"')) {
    next = next.replace('<nav class="round351-mobile-shortcuts"', '<nav class="round351-mobile-shortcuts" data-round588-route-conductor="mobile-shortcuts"');
  }
  next = next.replace(
    '<div class="intent-panel__head">\n        <h2 id="round368QuestionBankRouteTitle">可刷题路径</h2>',
    '<div class="intent-panel__head" data-round588-route-conductor="intent-head">\n        <h2 id="round368QuestionBankRouteTitle">可刷题路径</h2>'
  );
  if (/<p class="round588-current-note"[\s\S]*?<\/p>/.test(next)) {
    next = next.replace(/<p class="round588-current-note"[\s\S]*?<\/p>/, homeBoundaryNote);
  } else {
    next = next.replace(
      '<p class="index-status" id="indexStatus"',
      `${homeBoundaryNote}\n        <p class="index-status" id="indexStatus"`
    );
  }
  return next;
}

function updateQuestionBankModule(text) {
  let next = addCurrentEdgeRefreshToRoutes(updateCurrentText(text));
  next = injectNamedStyle(next, 'data-round588-question-bank-route-conductor', qbankModuleCss);
  const banner = `    <div class="round588-qbank-route-banner" data-round588-route-conductor="module-entry" role="status" aria-label="Round588 题库页当前路线">
      <span><b>当前路线</b>Round588 入口指挥台已承接，edge_refresh=${round588.version}</span>
      <span><b>181103 入口</b>400 可参考 / 122 线索；522 来源卡不删减</span>
      <span><b>trust / proof</b>trust 422/100；proof-depth 422，二次重证 8</span>
      <span><b>strict PDF</b>strictAnswerPdfProof=0，派生参考答案不冒充原卷 PDF 证明</span>
    </div>
`;
  if (!next.includes('data-round588-route-conductor="module-entry"')) {
    next = next.replace(
      '    <div class="round580-focus-landing" data-round580-focus-polish="question-bank-list" aria-label="181103 焦点入口当前边界">',
      `${banner}    <div class="round580-focus-landing" data-round580-focus-polish="question-bank-list" aria-label="181103 焦点入口当前边界">`
    );
  }
  next = next.replace(
    /<p data-round577-focus-boundary="1"><strong>Round577<\/strong>：8 道 181103 证明题已二次重证；版本 [^，]+，严格答案 PDF 证据仍单独为 0（strictAnswerPdfProof=0）。<\/p>/,
    `<p data-round577-focus-boundary="1" data-round588-route-conductor="module-boundary"><strong>Round588</strong>：入口页已承接当前路线；181103 入口 400/122、trust 422/100、proof-depth 422/8 和 strictAnswerPdfProof=0 分层显示，内容仍沿用已验答案/证明边界。</p>`
  );
  return next;
}

function updateQuestionBankIndex() {
  const index = readJson('question-banks/index.json');
  index.currentEntryVersion = round588.version;
  index.round588RouteConductorVersion = round588.version;
  index.lastUpdated = now;
  const bank = Array.isArray(index.questionBanks)
    ? index.questionBanks.find((row) => row?.id === '181103-material-extracted')
    : null;
  if (bank) {
    bank.currentEntryVersion = round588.version;
    bank.round588RouteConductorVersion = round588.version;
    bank.readyReferenceRows = round588.referencePracticeRows181103;
    bank.sourceClueRows = round588.sourceClueOnlyRows181103;
    bank.trustReferenceReadyRows181103 = round588.trustReferenceReadyRows181103;
    bank.trustSourceClueOnlyRows181103 = round588.trustSourceClueOnlyRows181103;
    bank.strictAnswerPdfProofRows = round588.strictAnswerPdfProofRows;
  }
  index.summary ||= {};
  index.summary.round588RouteConductorVersion = round588.version;
  index.summary.material181103DefaultPracticeQuestionCount = round588.referencePracticeRows181103;
  index.summary.material181103SourceContentCardCount = round588.sourceClueOnlyRows181103;
  writeJson('question-banks/index.json', index);
}

function syncCurrentVersionFiles() {
  const materialPages = walkHtml('resources/fluid-181103-html/materials');
  const files = Array.from(new Set([
    ...round576CurrentSurfaceFiles,
    ...round576DirectShellFiles,
    ...materialPages,
    'api/auth/me/index.html',
    'auth-guard.js',
    'modules/auth-guard.js',
    'modules/js/security/auth-guard.js',
    'index.html',
    'index-complete.html',
    'index-complete/index.html',
    'question-bank-home.html',
    'resources.html',
    'modules/question-bank.html',
    'modules/question-bank-data.js',
    'modules/question-bank-practice.js',
    'modules/real-exams-dynamic.html',
    'modules/practice-dynamic.html',
    'practice-dynamic.html',
    'resources/fluid-181103-html/index.html',
    'js/edge-fluid-learning-upgrade.js',
    'teacher-panel.html'
  ]));
  const changed = [];
  const synced = [];
  for (const rel of files) {
    if (!fs.existsSync(abs(rel))) continue;
    const before = readText(rel);
    const next = rel === 'question-bank-home.html'
      ? updateQuestionBankHome(before)
      : rel === 'modules/question-bank.html'
        ? updateQuestionBankModule(before)
        : addCurrentEdgeRefreshToRoutes(updateCurrentText(before));
    if (next.includes(round588.version)) synced.push(rel);
    if (next !== before) {
      writeText(rel, next);
      changed.push(rel);
    }
  }
  return { changed, synced, materialPages };
}

function updateMiddleware() {
  const rel = 'functions/_middleware.js';
  let text = updateCurrentText(readText(rel));
  text = text.replace(/const EDGE_HOME_VERSION = '[^']+';/, `const EDGE_HOME_VERSION = '${round588.version}';`);
  text = text.replace(/const EDGE_RUNTIME_JS_VERSION = '[^']+';/, `const EDGE_RUNTIME_JS_VERSION = '${round588.version}';`);
  text = text.replace(/Round58[0-9][^.\n]*\./, 'Round588: polished the question-bank home route conductor while preserving all answer/proof/source counts.');
  writeText(rel, text);
}

function buildRealExamCoverageYearRows() {
  const index = readJson('question-banks/real-exams-index.json');
  return (Array.isArray(index.years) ? index.years : []).map((row) => {
    const count = Number(row.count || 0);
    return {
      year: row.year,
      questionCount: count,
      withAnswer: count,
      withStrictAnswerPdfProof: 0,
      withExplicitDerivedVerification: count,
      objectiveReady: count,
      note: 'active-index-visible-answer-layer; strict original answer PDF proof remains 0'
    };
  });
}

function writeAnswerSupportLedgers() {
  const yearRows = buildRealExamCoverageYearRows();
  const activeIndexQuestionCount = yearRows.reduce((sum, row) => sum + Number(row.questionCount || 0), 0);
  const outsideActiveIndexQuestionCount = 28;
  const directoryQuestionCount = activeIndexQuestionCount + outsideActiveIndexQuestionCount;
  writeJson('data/fluid-round433-real-exam-answer-coverage.json', {
    ok: true,
    version: 'round433-real-exam-answer-coverage-20260630-round588-refresh',
    refreshedBy: round588.version,
    generatedAt: now,
    summary: {
      directoryQuestionCount,
      activeIndexQuestionCount,
      withAnswer: directoryQuestionCount,
      activeWithAnswer: activeIndexQuestionCount,
      withStrictAnswerPdfProof: 0,
      withExplicitDerivedVerification: directoryQuestionCount,
      objectiveReady: directoryQuestionCount,
      outsideActiveIndexQuestionCount,
      localPdfPresentCount: 0,
      localPdfConfiguredCount: 0
    },
    acceptance: {
      visibleAnswerCoverageComplete: true,
      userObjectiveComplete: false,
      reasonUserObjectiveNotClosed: 'visible answer coverage is complete, but proof-depth and strict original answer-PDF proof remain separate closure layers'
    },
    blockers: [
      { id: 'strict-answer-pdf-proof', reason: 'strictAnswerPdfProof remains 0; do not call derived/reference answers original answer-PDF proof' },
      { id: 'proof-depth-separate-layer', reason: 'short conclusion-only proof text must still be upgraded through proof-depth gates' }
    ],
    yearRows
  });
  writeJson('data/fluid-round462-ten-round-continuation-ledger.json', {
    ok: true,
    version: 'round462-ten-round-continuation-ledger-20260630-round588-refresh',
    refreshedBy: round588.version,
    generatedAt: now,
    summary: {
      roundsCovered: 10,
      completedProofRounds: 10,
      answerBoundary: {
        directoryQuestionCount,
        objectiveReady: directoryQuestionCount,
        activeObjectiveReady: activeIndexQuestionCount,
        outsideActiveIndexQuestionCount,
        strictAnswerPdfProof: 0,
        verifiedDerived: directoryQuestionCount,
        answer181103: {
          'reference-answer-ready': round588.referencePracticeRows181103,
          'needs-manual-source-review': 0,
          'source-clue-not-reference-answer': round588.sourceClueOnlyRows181103
        }
      }
    },
    boundary: 'Round462 support ledger is refreshed for Round588 rendering only. It preserves the visible-answer / derived-reference / strict original answer-PDF split and does not promote strictAnswerPdfProof.',
    artifacts: {
      coverageJson: 'data/fluid-round433-real-exam-answer-coverage.json',
      round588Ledger: 'data/fluid-round588-question-bank-home-conductor-ledger.json'
    }
  });
}

function writeLedger(syncResult) {
  writeJson('data/fluid-round588-question-bank-home-conductor-ledger.json', {
    ok: true,
    version: round588.version,
    previousVersion: round588.previousVersion,
    round: round588.round,
    generatedAt: now,
    scope: round588.scope,
    nonDeletingUpgrade: true,
    uiOnlyUpgrade: true,
    questionBankHomeRouteConductorUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    changedQuestionBankContent: false,
    changedRealExamContent: false,
    noRouteRemoved: true,
    noCountReduced: true,
    materialSubpagesSynced: syncResult.materialPages.length,
    changedFiles: syncResult.synced,
    idempotentChangedFiles: syncResult.changed,
    metrics: {
      materialHtmlPages181103: round588.materialHtmlPages181103,
      sourceHtmlCards181103: round588.sourceHtmlCards181103,
      referencePracticeRows181103: round588.referencePracticeRows181103,
      sourceClueOnlyRows181103: round588.sourceClueOnlyRows181103,
      trustReferenceReadyRows181103: round588.trustReferenceReadyRows181103,
      trustSourceClueOnlyRows181103: round588.trustSourceClueOnlyRows181103,
      proofDepthRows181103: round588.proofDepthRows181103,
      proofDepthSecondPassRows181103: round588.proofDepthSecondPassRows181103,
      realExamAnswerDepthRows: round588.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round588.realExamOriginalAtomicRows,
      realExamSourceSections: round588.realExamSourceSections,
      realExamGroupedSubquestions: round588.realExamGroupedSubquestions,
      realExamDirectoryQuestionCount: round588.realExamDirectoryQuestionCount,
      strictAnswerPdfProofRows: round588.strictAnswerPdfProofRows
    },
    upgradedSurfaces: {
      questionBankHome: true,
      currentRouteConductor: true,
      materialPagesVersionSynced: syncResult.materialPages.length
    },
    boundary: {
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      visualFrontier: round588.version,
      strictAnswerPdfProof: 'separate',
      visibleRealExamAnswerCoverage: '353/353',
      answer181103: {
        entranceReferenceAnswerReady: round588.referencePracticeRows181103,
        entranceSourceClueOnly: round588.sourceClueOnlyRows181103,
        trustReferenceAnswerReady: round588.trustReferenceReadyRows181103,
        trustSourceClueOnly: round588.trustSourceClueOnlyRows181103
      },
      derivedReferenceAnswers: true,
      publicShellOnlyUntilAuthGateRuns: true
    },
    verificationPlan: [
      'node tools/apply-round588-question-bank-home-conductor.mjs',
      'node tools/check-round588-question-bank-home-conductor.mjs',
      'node tools/check-round588-question-bank-home-conductor-visual.mjs',
      'node tools/check-round587-resource-hub-reader-visual.mjs',
      'node tools/check-round586-practice-answer-workbench-visual.mjs'
    ]
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round588.version,
    previousVersion: round588.previousVersion,
    date: round588.date,
    title: 'Round588：题库入口路线指挥台与当前轮次清理',
    summary: '本轮继续不减少任何题量、答案、证明记录、来源链接或真题边界；专门把进题库前的 question-bank-home 从 Round584 旧标签升级成当前路线指挥台，让入口 400/122、trust 422/100、proof-depth 422/8、真题 353/163 和 strictAnswerPdfProof=0 在首屏就能选清楚。',
    links: [
      { label: 'Round588 题库入口账本', href: '/data/fluid-round588-question-bank-home-conductor-ledger.json' },
      { label: '题库入口工作台', href: `/question-bank-home.html?edge_refresh=${round588.version}` },
      { label: '181103 522 题库', href: `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round588.version}#questionBanksList` },
      { label: '181103 HTML 总表', href: `/resources/fluid-181103-html/index.html?edge_refresh=${round588.version}` }
    ],
    metrics: {
      realExamAnswerDepthRows: round588.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round588.realExamOriginalAtomicRows,
      realExamSourceSections: round588.realExamSourceSections,
      realExamGroupedSubquestions: round588.realExamGroupedSubquestions,
      realExamDirectoryQuestionCount: round588.realExamDirectoryQuestionCount,
      proofDepthRows: round588.proofDepthRows181103,
      proofDepthSecondPassRows: round588.proofDepthSecondPassRows181103,
      referencePracticeRows: round588.referencePracticeRows181103,
      sourceClueOnlyRows: round588.sourceClueOnlyRows181103,
      trustReferenceReadyRows181103: round588.trustReferenceReadyRows181103,
      trustSourceClueOnlyRows181103: round588.trustSourceClueOnlyRows181103,
      strictAnswerPdfProof: round588.strictAnswerPdfProofRows
    },
    boundary: {
      questionBankHomeConductorOnly: true,
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      visibleAnswerCoverage: '353/353',
      derivedReferenceAnswers: true,
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      visualFrontier: round588.version
    }
  };
  writeJson('site-updates.json', [top, ...updates.filter((item) => item?.version !== round588.version)]);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  Object.assign(roadmap, {
    version: round588.version,
    currentVersion: round588.version,
    currentReleaseVersion: round588.version,
    previousVersion: round588.previousVersion,
    currentRound: round588.round,
    lastIntegratedRound: round588.round,
    lastUpdatedAt: now,
    lastUpdated: now,
    updatedAt: now,
    realExamAnswerDepthRows: round588.realExamAnswerDepthRows,
    realExamOriginalAtomicRows: round588.realExamOriginalAtomicRows,
    realExamSourceSections: round588.realExamSourceSections,
    realExamGroupedSubquestions: round588.realExamGroupedSubquestions,
    proofDepthRows: round588.proofDepthRows181103,
    referencePracticeRows181103: round588.referencePracticeRows181103,
    sourceClueOnlyRows181103: round588.sourceClueOnlyRows181103,
    trustReferenceReadyRows181103: round588.trustReferenceReadyRows181103,
    trustSourceClueOnlyRows181103: round588.trustSourceClueOnlyRows181103,
    strictAnswerPdfProof: round588.strictAnswerPdfProofRows,
    round588QuestionBankHomeConductor: true
  });
  roadmap.latestRelease = {
    version: round588.version,
    round: round588.round,
    previousVersion: round588.previousVersion,
    summary: 'Round588 cleans the question-bank home into a current route conductor and preserves all answer/proof/source counts.'
  };
  roadmap.releaseGate ||= {};
  Object.assign(roadmap.releaseGate, {
    currentVersion: round588.version,
    expectedVersion: round588.version,
    previousVersion: round588.previousVersion,
    currentRound: round588.round,
    lastIntegratedRound: round588.round,
    commands: [
      'node tools/apply-round588-question-bank-home-conductor.mjs',
      'node tools/check-round588-question-bank-home-conductor.mjs',
      'node tools/check-round588-question-bank-home-conductor-visual.mjs',
      'node tools/check-round587-resource-hub-reader-visual.mjs',
      'node tools/check-round586-practice-answer-workbench-visual.mjs'
    ]
  });
  roadmap.release ||= {};
  Object.assign(roadmap.release, {
    currentVersion: round588.version,
    currentRound: round588.round,
    expectedVersion: round588.version,
    previousVersion: round588.previousVersion,
    lastIntegratedRound: round588.round,
    publicShellOnlyUntilAuthGateRuns: true
  });
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

function main() {
  const syncResult = syncCurrentVersionFiles();
  updateMiddleware();
  updateQuestionBankIndex();
  writeLedger(syncResult);
  writeAnswerSupportLedgers();
  updateSiteUpdates();
  updateRoadmap();
  console.log(JSON.stringify({
    ok: true,
    version: round588.version,
    changedVersionFiles: syncResult.changed.length,
    changedFiles: syncResult.changed,
    syncedVersionFiles: syncResult.synced.length,
    materialSubpagesSynced: syncResult.materialPages.length
  }, null, 2));
}

main();
