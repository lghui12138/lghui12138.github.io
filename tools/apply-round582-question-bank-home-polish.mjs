#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';
import { round582 } from './round582-question-bank-home-polish-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round582 apply from /Volumes/mac_2T during lifs isolation.');
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

function normalizeEntryLinks(text) {
  let next = text;
  const focusBare = 'question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList';
  const focusFresh = `question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round582.version}#questionBanksList`;
  next = replaceAll(next, focusBare, focusFresh);
  next = replaceAll(
    next,
    'question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${EDGE_HOME_VERSION}#questionBanksList',
    focusFresh
  );
  next = replaceAll(next, 'real-exams-dynamic.html?from=', `real-exams-dynamic.html?edge_refresh=${round582.version}&from=`);
  next = replaceAll(next, 'real-exams-dynamic.html?chapter=', `real-exams-dynamic.html?edge_refresh=${round582.version}&chapter=`);
  next = replaceAll(next, 'real-exams-dynamic.html?year=', `real-exams-dynamic.html?edge_refresh=${round582.version}&year=`);
  next = replaceAll(next, 'real-exams-dynamic.html?edge_refresh=${EDGE_HOME_VERSION}', `real-exams-dynamic.html?edge_refresh=${round582.version}`);
  next = replaceAll(next, 'question-bank.html?edge_refresh=${EDGE_HOME_VERSION}', `question-bank.html?edge_refresh=${round582.version}`);
  return next;
}

function polishCurrentText(text) {
  let next = text;
  next = replaceAll(next, round582.previousVersion, round582.version);
  next = replaceAll(next, 'round550-181103-proof-depth-upgrade-20260628', round582.version);
  next = replaceAll(next, 'Round581：题库卡片可读性与移动端工作卡优化', 'Round582：题库入口工作台视觉与流畅性升级');
  next = replaceAll(next, 'Round581 账本', 'Round582 账本');
  next = replaceAll(next, 'Round581 卡片优化账本', 'Round582 入口工作台账本');
  next = replaceAll(next, './data/fluid-round581-question-bank-card-polish-ledger.json', './data/fluid-round582-question-bank-home-polish-ledger.json');
  next = replaceAll(next, '/data/fluid-round581-question-bank-card-polish-ledger.json', '/data/fluid-round582-question-bank-home-polish-ledger.json');
  next = replaceAll(next, '<b>Round581</b><span>题库卡片可读性优化</span>', '<b>Round582</b><span>入口工作台视觉升级</span>');
  next = replaceAll(
    next,
    'Round581 继续保留全部题量、答案、证明记录和来源边界，并把 181103 题库卡片压实成更清晰的移动端工作卡',
    'Round582 继续保留全部题量、答案、证明记录和来源边界，并把进题库前的工作台整理成更清晰、更顺滑的文档型入口'
  );
  next = replaceAll(
    next,
    'Round581 继续保留全部题量、答案、证明记录和来源边界，并把 181103 题库卡片压实成更清晰的移动端工作卡：先看 181103、证明深修、真题补答和 strict PDF 边界，再进入题库。',
    'Round582 继续保留全部题量、答案、证明记录和来源边界；入口页改成轻量文档工作台：先看当前证据、181103、证明深修、真题补答和 strict PDF 边界，再进入题库。'
  );
  next = replaceAll(
    next,
    '本轮不减少任何题量、答案、证明记录或来源边界；把 181103 焦点页卡片从旧式大色块和嵌套卡片改成轻量工作卡，答案状态只保留一份可读芯片，精选标签、按钮、通知和焦点定位在移动端更稳。181103 仍为 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答保持 163；strictAnswerPdfProof 仍为 0。',
    '本轮不减少任何题量、答案、证明记录、链接或来源边界；把进题库前的 question-bank-home 工作台改成更清晰的文档型首屏，顶部状态、证据表、181103 主入口、手机快捷入口和更多入口继续全部保留。181103 仍为 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答保持 163；strictAnswerPdfProof 仍为 0。'
  );
  next = replaceAll(next, 'Round581 polishes the 181103 question-bank card into a readable mobile work card, removes duplicate in-card status blocks, and keeps all answer/proof/PDF boundaries unchanged.', 'Round582 polishes the question-bank home workbench into a cleaner document-style entry surface while preserving all routes, counts, answer/proof ledgers, and strict PDF boundaries.');
  next = next.replace(/Round581[^.\n]*\./, 'Round582: polished question-bank home workbench, compact status rail, readable evidence panels, and preserved answer/proof boundaries.');
  return normalizeEntryLinks(next);
}

function applyHomePolish() {
  const rel = 'question-bank-home.html';
  let text = polishCurrentText(readText(rel));

  text = text.replace('<body>', '<body data-round582-home-polish-page="1">');
  text = text.replace(
    '<main class="wrap" id="questionBankHomeMain" tabindex="-1">',
    '<main class="wrap" id="questionBankHomeMain" tabindex="-1" data-round582-home-polish="mintlify-workbench">'
  );
  text = text.replace(
    'data-round575-workbench-polish="1" data-round576-direct-shell-consistency="1" data-round576-direct-shell-consistency="1"',
    'data-round575-workbench-polish="1" data-round576-direct-shell-consistency="1" data-round582-home-polish="reader-workbench"'
  );
  text = text.replace(
    'data-round496-505-181103-route="question-bank-home" aria-labelledby=',
    'data-round496-505-181103-route="question-bank-home" data-round582-primary-entry="181103" aria-labelledby='
  );
  text = text.replace(
    'class="primary" href="./modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList"',
    'class="primary" data-round582-primary-action="181103" href="./modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList"'
  );
  text = text.replace(
    `class="primary" href="./modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round582.version}#questionBanksList"`,
    `class="primary" data-round582-primary-action="181103" href="./modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round582.version}#questionBanksList"`
  );

  if (!text.includes('/* Round582 question-bank home polish */')) {
    text = text.replace(
      '    .round351-mobile-shortcuts,\n    .intent-panel,\n    .grid,\n    .panel {\n      contain: layout paint;\n    }\n\n    @media (max-width: 1040px) {',
      `    .round351-mobile-shortcuts,\n    .intent-panel,\n    .grid,\n    .panel {\n      contain: layout paint;\n    }\n\n    /* Round582 question-bank home polish */\n    body[data-round582-home-polish-page="1"] {\n      background: linear-gradient(180deg, #f7fbff 0, #ffffff 260px, #f6f8fb 100%);\n      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;\n    }\n    [data-round582-home-polish="mintlify-workbench"] {\n      max-width: 1210px;\n      padding-top: 12px;\n    }\n    body[data-round582-home-polish-page="1"] .workbench-topline {\n      border-color: rgba(13, 13, 13, 0.08);\n      background: rgba(255, 255, 255, 0.96);\n      box-shadow: 0 14px 36px -30px rgba(15, 23, 42, 0.58);\n    }\n    body[data-round582-home-polish-page="1"] .workbench-release-label {\n      background: #0d0d0d;\n      border-radius: 8px;\n    }\n    body[data-round582-home-polish-page="1"] .workbench-status-pill {\n      border-color: rgba(13, 13, 13, 0.08);\n      background: #ffffff;\n      color: #333333 !important;\n    }\n    body[data-round582-home-polish-page="1"] .workbench-topline__actions a {\n      border-color: rgba(13, 13, 13, 0.08);\n      background: #ffffff;\n      color: #0f766e;\n    }\n    body[data-round582-home-polish-page="1"] .workbench-topline__actions a:hover,\n    body[data-round582-home-polish-page="1"] .workbench-topline__actions a:focus-visible {\n      background: #f7fffb;\n      border-color: rgba(16, 185, 129, 0.28);\n    }\n    body[data-round582-home-polish-page="1"] .workbench-summary.hero {\n      position: relative;\n      overflow: hidden;\n      padding: 16px;\n      border: 1px solid rgba(13, 13, 13, 0.08);\n      background: #ffffff !important;\n      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 18px 46px -38px rgba(15, 23, 42, 0.55);\n    }\n    body[data-round582-home-polish-page="1"] .workbench-summary.hero::before {\n      content: "" !important;\n      display: block !important;\n      position: absolute;\n      inset: 0 0 auto;\n      height: 4px;\n      background: linear-gradient(90deg, #10b981 0%, #3772cf 52%, #c37d0d 100%);\n      pointer-events: none;\n    }\n    body[data-round582-home-polish-page="1"] .workbench-label,\n    body[data-round582-home-polish-page="1"] .release-chip {\n      border-color: rgba(16, 185, 129, 0.22);\n      background: #f7fffb;\n      color: #0f766e !important;\n    }\n    body[data-round582-home-polish-page="1"] .hero h1 {\n      max-width: 760px;\n      font-size: clamp(1.62rem, 2.2vw, 2.18rem);\n    }\n    body[data-round582-home-polish-page="1"] .summary-lede {\n      max-width: 790px;\n      color: #333333;\n    }\n    body[data-round582-home-polish-page="1"] .workbench-metric-strip {\n      gap: 8px;\n    }\n    body[data-round582-home-polish-page="1"] .workbench-metric-strip div,\n    body[data-round582-home-polish-page="1"] .proof-checklist div,\n    body[data-round582-home-polish-page="1"] .round399-answer-proof span,\n    body[data-round582-home-polish-page="1"] .round385-181103-main-entry__stats span {\n      border-color: rgba(13, 13, 13, 0.07);\n      background: #ffffff;\n      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);\n    }\n    body[data-round582-home-polish-page="1"] .summary-actions a,\n    body[data-round582-home-polish-page="1"] .round385-181103-main-entry__actions a,\n    body[data-round582-home-polish-page="1"] .round573-flow-rail a,\n    body[data-round582-home-polish-page="1"] .intent-link,\n    body[data-round582-home-polish-page="1"] .card {\n      border-color: rgba(13, 13, 13, 0.08);\n      background: #ffffff;\n      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.035);\n    }\n    body[data-round582-home-polish-page="1"] .summary-actions a.primary,\n    body[data-round582-home-polish-page="1"] .round385-181103-main-entry__actions a[data-round385-primary] {\n      background: #0d0d0d;\n      border-color: #0d0d0d;\n      color: #ffffff;\n    }\n    body[data-round582-home-polish-page="1"] .proof-checklist {\n      border-color: rgba(13, 13, 13, 0.08);\n      background: #fafafa;\n      box-shadow: none;\n    }\n    body[data-round582-home-polish-page="1"] .round575-audit-note {\n      border-color: rgba(16, 185, 129, 0.16);\n      background: #f7fffb;\n    }\n    body[data-round582-home-polish-page="1"] .round385-181103-main-entry {\n      padding: 14px;\n      border-color: rgba(13, 13, 13, 0.08);\n      background: #ffffff;\n      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 18px 46px -38px rgba(15, 23, 42, 0.5);\n    }\n    body[data-round582-home-polish-page="1"] .round385-181103-main-entry .icon--round385 {\n      width: auto;\n      height: 40px;\n      min-width: 58px;\n      padding: 0 10px;\n      background: #0f766e;\n      box-shadow: none;\n    }\n    body[data-round582-home-polish-page="1"] .round385-181103-main-entry h2 {\n      max-width: 760px;\n    }\n    body[data-round582-home-polish-page="1"] .round573-flow-rail em {\n      height: 2px;\n    }\n    body[data-round582-home-polish-page="1"] .card:hover,\n    body[data-round582-home-polish-page="1"] .intent-link:hover,\n    body[data-round582-home-polish-page="1"] .round573-flow-rail a:hover,\n    body[data-round582-home-polish-page="1"] .summary-actions a:hover,\n    body[data-round582-home-polish-page="1"] .round385-181103-main-entry__actions a:hover {\n      border-color: rgba(16, 185, 129, 0.24);\n      box-shadow: 0 18px 36px -30px rgba(15, 23, 42, 0.55);\n    }\n    @media (max-width: 768px) {\n      body[data-round582-home-polish-page="1"] .workbench-summary.hero {\n        padding: 14px;\n      }\n      body[data-round582-home-polish-page="1"] .summary-actions,\n      body[data-round582-home-polish-page="1"] .workbench-metric-strip {\n        grid-template-columns: repeat(2, minmax(0, 1fr));\n      }\n    }\n    @media (max-width: 390px) {\n      body[data-round582-home-polish-page="1"] .workbench-metric-strip {\n        display: grid;\n        grid-template-columns: repeat(2, minmax(0, 1fr));\n      }\n      body[data-round582-home-polish-page="1"] .workbench-metric-strip div {\n        min-height: 44px;\n        padding: 7px;\n      }\n      body[data-round582-home-polish-page="1"] .workbench-metric-strip dt { font-size: 0.7rem; }\n      body[data-round582-home-polish-page="1"] .workbench-metric-strip dd { font-size: 0.9rem; }\n    }\n\n    @media (max-width: 1040px) {`
    );
  }

  writeText(rel, text);
}

function syncCurrentVersionFiles() {
  const files = Array.from(new Set([
    ...round576CurrentSurfaceFiles,
    ...round576DirectShellFiles,
    'auth-guard.js',
    'modules/auth-guard.js',
    'modules/js/security/auth-guard.js',
    'resources.html',
    'modules/question-bank.html',
    'modules/question-bank-data.js',
    'modules/question-bank-practice.js',
    'modules/real-exams-dynamic.html',
    'resources/fluid-181103-html/index.html'
  ]));
  const changed = [];
  const synced = [];
  for (const rel of files) {
    if (!fs.existsSync(abs(rel))) continue;
    const before = readText(rel);
    const text = rel === 'question-bank-home.html' ? before : polishCurrentText(before);
    if (text.includes(round582.version)) synced.push(rel);
    if (text !== before) {
      writeText(rel, text);
      changed.push(rel);
    }
  }
  return { changed, synced };
}

function updateMiddleware() {
  const rel = 'functions/_middleware.js';
  let text = polishCurrentText(readText(rel));
  text = text.replace(/const EDGE_HOME_VERSION = '[^']+';/, `const EDGE_HOME_VERSION = '${round582.version}';`);
  text = text.replace(/const EDGE_RUNTIME_JS_VERSION = '[^']+';/, `const EDGE_RUNTIME_JS_VERSION = '${round582.version}';`);
  text = text.replace(/Round58[0-9][^.\n]*\./, 'Round582: polished question-bank home workbench, compact status rail, readable evidence panels, and preserved answer/proof boundaries.');
  writeText(rel, text);
}

function writeRound582Ledger(syncResult) {
  writeJson('data/fluid-round582-question-bank-home-polish-ledger.json', {
    ok: true,
    version: round582.version,
    previousVersion: round582.previousVersion,
    round: round582.round,
    generatedAt: now,
    scope: round582.scope,
    nonDeletingUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    changedQuestionBankContent: false,
    homeWorkbenchPolish: true,
    noRouteRemoved: true,
    noCountReduced: true,
    mobileMetricStripKeptVisible: true,
    changedFiles: syncResult.synced,
    idempotentChangedFiles: syncResult.changed,
    metrics: {
      materialHtmlPages181103: round582.materialHtmlPages181103,
      sourceHtmlCards181103: round582.sourceHtmlCards181103,
      referencePracticeRows181103: round582.referencePracticeRows181103,
      sourceClueOnlyRows181103: round582.sourceClueOnlyRows181103,
      proofDepthRows181103: round582.proofDepthRows181103,
      proofDepthSecondPassRows181103: round582.proofDepthSecondPassRows181103,
      realExamAnswerDepthRows: round582.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round582.realExamOriginalAtomicRows,
      groupedRealExamRows: round582.groupedRealExamRows,
      strictAnswerPdfProofRows: round582.strictAnswerPdfProofRows
    },
    boundary: {
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      cardFrontier: 'round581-question-bank-card-polish-20260630',
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      uiOnlyUpgrade: true
    },
    verificationPlan: [
      'node tools/apply-round582-question-bank-home-polish.mjs',
      'node tools/check-round582-question-bank-home-polish.mjs',
      'node tools/check-round582-question-bank-home-polish-visual.mjs',
      'node tools/check-round581-question-bank-card-polish-visual.mjs'
    ]
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round582.version,
    previousVersion: round582.previousVersion,
    date: round582.date,
    title: 'Round582：题库入口工作台视觉与流畅性升级',
    summary: '本轮不减少任何题量、答案、证明记录、链接或来源边界；把进题库前的 question-bank-home 工作台改成更清晰的文档型首屏，顶部状态、证据表、181103 主入口、手机快捷入口和更多入口继续全部保留。181103 仍为 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答保持 163；strictAnswerPdfProof 仍为 0。',
    links: [
      { label: 'Round582 入口工作台账本', href: '/data/fluid-round582-question-bank-home-polish-ledger.json' },
      { label: '题库入口工作台', href: `/question-bank-home.html?edge_refresh=${round582.version}` },
      { label: '181103 焦点题库页', href: `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round582.version}#questionBanksList` },
      { label: 'Round581 卡片优化账本', href: '/data/fluid-round581-question-bank-card-polish-ledger.json' }
    ],
    metrics: {
      realExamAnswerDepthRows: round582.realExamAnswerDepthRows,
      proofDepthRows: round582.proofDepthRows181103,
      proofDepthSecondPassRows: round582.proofDepthSecondPassRows181103,
      referencePracticeRows: round582.referencePracticeRows181103,
      sourceClueOnlyRows: round582.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round582.strictAnswerPdfProofRows
    },
    boundary: {
      homePolishOnly: true,
      nonDeletingUpgrade: true,
      noRouteRemoved: true,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629'
    }
  };
  const next = updates.filter((item) => item?.version !== round582.version);
  next.unshift(top);
  writeJson('site-updates.json', next);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  Object.assign(roadmap, {
    version: round582.version,
    currentVersion: round582.version,
    currentReleaseVersion: round582.version,
    previousVersion: round582.previousVersion,
    currentRound: round582.round,
    lastIntegratedRound: round582.round,
    lastUpdatedAt: now,
    lastUpdated: now,
    updatedAt: now,
    realExamAnswerDepthRows: round582.realExamAnswerDepthRows,
    proofDepthRows: round582.proofDepthRows181103,
    referencePracticeRows181103: round582.referencePracticeRows181103,
    sourceClueOnlyRows181103: round582.sourceClueOnlyRows181103,
    strictAnswerPdfProof: round582.strictAnswerPdfProofRows,
    round582QuestionBankHomePolish: true
  });
  roadmap.latestRelease = {
    version: round582.version,
    round: round582.round,
    previousVersion: round582.previousVersion,
    summary: 'Round582 polishes the question-bank home workbench into a cleaner document-style entry surface while preserving all routes, counts, answer/proof ledgers, and strict PDF boundaries.'
  };
  roadmap.releaseGate ||= {};
  Object.assign(roadmap.releaseGate, {
    currentVersion: round582.version,
    expectedVersion: round582.version,
    previousVersion: round582.previousVersion,
    currentRound: round582.round,
    lastIntegratedRound: round582.round,
    lastIntegratedAt: now,
    lastUpdated: now,
    updatedAt: now
  });
  roadmap.release ||= {};
  Object.assign(roadmap.release, {
    version: round582.version,
    currentVersion: round582.version,
    currentRound: round582.round,
    lastIntegratedRound: round582.round,
    expectedVersion: round582.version,
    previousVersion: round582.previousVersion,
    runtimeVersion: round582.version,
    lastUpdated: now,
    updatedAt: now
  });
  const commands = [
    'node tools/apply-round582-question-bank-home-polish.mjs',
    'node tools/check-round582-question-bank-home-polish.mjs',
    'node tools/check-round582-question-bank-home-polish-visual.mjs',
    'node tools/check-round581-question-bank-card-polish-visual.mjs'
  ];
  const previous = (roadmap.releaseGate.commands || [])
    .filter((command) => !/round58[0-9]|check-round58[0-9]|apply-round58[0-9]/.test(String(command)));
  roadmap.releaseGate.commands = Array.from(new Set([...commands, ...previous]));
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

applyHomePolish();
const syncResult = syncCurrentVersionFiles();
updateMiddleware();
writeRound582Ledger(syncResult);
updateSiteUpdates();
updateRoadmap();

console.log(JSON.stringify({
  ok: true,
  version: round582.version,
  previousVersion: round582.previousVersion,
  changedVersionFiles: syncResult.changed.length,
  syncedVersionFiles: syncResult.synced.length,
  generatedAt: now
}, null, 2));
