#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';
import { round584 } from './round584-question-bank-home-density-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round584 apply from /Volumes/mac_2T during lifs isolation.');
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
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name === 'index.html') {
        out.push(path.relative(repoRoot, full));
      }
    }
  }
  return out.sort();
}

const round584Css = `
    /* Round584 question-bank home density polish */
    body[data-round584-home-density-page="1"] {
      background: linear-gradient(180deg, #f7fbff 0, #ffffff 220px, #f6f8fb 100%);
    }
    body[data-round584-home-density-page="1"] [data-round584-home-density="compact-workbench"] {
      padding-top: 8px;
      padding-bottom: 24px;
    }
    body[data-round584-home-density-page="1"] .workbench-topline {
      margin-bottom: 8px;
      padding: 7px;
    }
    body[data-round584-home-density-page="1"] .workbench-topline__main {
      gap: 5px;
    }
    body[data-round584-home-density-page="1"] .workbench-status-pill,
    body[data-round584-home-density-page="1"] .workbench-release-label {
      min-height: 32px;
    }
    body[data-round584-home-density-page="1"] .workbench-summary.hero {
      grid-template-columns: minmax(0, 1.18fr) minmax(260px, 0.82fr);
      gap: 10px;
      padding: 14px;
      margin-bottom: 8px;
    }
    body[data-round584-home-density-page="1"] .hero h1 {
      margin-bottom: 6px;
      font-size: clamp(1.56rem, 2vw, 2.04rem);
    }
    body[data-round584-home-density-page="1"] .summary-lede {
      margin-bottom: 7px;
      max-width: 760px;
      font-size: 0.9rem;
      line-height: 1.46;
    }
    body[data-round584-home-density-page="1"] .workbench-metric-strip {
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 6px;
      margin: 6px 0 7px;
    }
    body[data-round584-home-density-page="1"] .workbench-metric-strip div {
      min-height: 46px;
      padding: 7px;
    }
    body[data-round584-home-density-page="1"] .summary-actions {
      gap: 7px;
      margin-top: 7px;
    }
    body[data-round584-home-density-page="1"] .summary-actions a {
      min-height: 46px;
      padding: 7px 9px;
    }
    body[data-round584-home-density-page="1"] .proof-checklist {
      gap: 6px;
      padding: 9px;
    }
    body[data-round584-home-density-page="1"] .proof-checklist div {
      min-height: 48px;
      padding: 7px;
    }
    body[data-round584-home-density-page="1"] .proof-checklist p {
      font-size: 0.82rem;
      line-height: 1.44;
    }
    body[data-round584-home-density-page="1"] .status-details {
      margin-top: 6px;
    }
    body[data-round584-home-density-page="1"] .round385-181103-main-entry {
      grid-template-columns: minmax(0, 1.32fr) minmax(230px, 0.68fr);
      gap: 9px;
      margin-bottom: 8px;
      padding: 12px;
    }
    body[data-round584-home-density-page="1"] .round385-181103-main-entry__main {
      gap: 12px;
    }
    body[data-round584-home-density-page="1"] .round385-181103-main-entry p {
      line-height: 1.48;
    }
    body[data-round584-home-density-page="1"] .round399-answer-proof {
      gap: 6px;
      margin-top: 7px;
    }
    body[data-round584-home-density-page="1"] .round399-answer-proof span {
      min-height: 44px;
      padding: 7px 8px;
    }
    body[data-round584-home-density-page="1"] .round385-181103-main-entry__stats {
      gap: 6px;
      margin-top: 8px;
    }
    body[data-round584-home-density-page="1"] .round385-181103-main-entry__stats span {
      padding: 7px 8px;
    }
    body[data-round584-home-density-page="1"] .round385-181103-main-entry__actions {
      gap: 7px;
    }
    body[data-round584-home-density-page="1"] .round385-181103-main-entry__actions a {
      min-height: 50px;
      padding: 8px 10px;
    }
    body[data-round584-home-density-page="1"] .round573-flow-rail {
      gap: 7px;
      margin: 8px 0;
    }
    body[data-round584-home-density-page="1"] .round573-flow-rail a {
      min-height: 58px;
      padding: 9px 10px 11px;
    }
    body[data-round584-home-density-page="1"] .toolbar {
      margin-bottom: 10px;
    }
    body[data-round584-home-density-page="1"] .round351-mobile-shortcuts,
    body[data-round584-home-density-page="1"] .intent-panel {
      margin-bottom: 10px;
      padding: 10px;
    }
    body[data-round584-home-density-page="1"] .intent-panel__head {
      margin-bottom: 8px;
    }
    body[data-round584-home-density-page="1"] .intent-grid {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 7px;
    }
    body[data-round584-home-density-page="1"] .intent-link {
      min-height: 56px;
      padding: 9px;
    }
    body[data-round584-home-density-page="1"] .intent-link[data-round337-intent] {
      min-height: 62px;
    }
    body[data-round584-home-density-page="1"] .grid {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 9px;
      margin-bottom: 10px;
    }
    body[data-round584-home-density-page="1"] .card {
      padding: 13px;
      gap: 7px;
    }
    body[data-round584-home-density-page="1"] .desc {
      line-height: 1.55;
    }
    body[data-round584-home-density-page="1"] .panel {
      padding: 13px;
    }
    body[data-round584-home-density-page="1"] .panel ul {
      line-height: 1.68;
    }
    @media (max-width: 1040px) {
      body[data-round584-home-density-page="1"] .workbench-summary.hero {
        grid-template-columns: 1fr;
      }
      body[data-round584-home-density-page="1"] .proof-checklist dl {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
    @media (max-width: 768px) {
      body[data-round584-home-density-page="1"] .workbench-summary.hero,
      body[data-round584-home-density-page="1"] .round385-181103-main-entry,
      body[data-round584-home-density-page="1"] .round351-mobile-shortcuts,
      body[data-round584-home-density-page="1"] .intent-panel,
      body[data-round584-home-density-page="1"] .panel {
        padding: 10px;
      }
      body[data-round584-home-density-page="1"] .proof-checklist dl {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      body[data-round584-home-density-page="1"] .round573-flow-rail a {
        min-height: 54px;
      }
    }
    @media (max-width: 390px) {
      body[data-round584-home-density-page="1"] .workbench-topline {
        padding: 6px;
      }
      body[data-round584-home-density-page="1"] .round573-flow-rail {
        grid-template-columns: 1fr;
      }
      body[data-round584-home-density-page="1"] .summary-actions,
      body[data-round584-home-density-page="1"] .proof-checklist dl {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      body[data-round584-home-density-page="1"] .summary-lede {
        font-size: 0.84rem;
      }
      body[data-round584-home-density-page="1"] .round399-answer-proof {
        grid-template-columns: 1fr;
      }
    }
`;

function injectRound584Css(text) {
  if (text.includes('/* Round584 question-bank home density polish */')) return text;
  const marker = '\n    @media (max-width: 1040px) {';
  if (!text.includes(marker)) throw new Error('Could not find Round584 CSS insertion marker');
  return text.replace(marker, `${round584Css}${marker}`);
}

function updateQuestionBankHome(text) {
  let next = text;
  next = injectRound584Css(next);
  next = next.replace(/\s+data-round584-home-density-strip="1"/g, '');
  next = next.replace(/\s+data-round584-primary-entry="181103"/g, '');
  next = replaceAll(next, '<body data-round582-home-polish-page="1">', '<body data-round582-home-polish-page="1" data-round584-home-density-page="1">');
  next = replaceAll(
    next,
    '<main class="wrap" id="questionBankHomeMain" tabindex="-1" data-round582-home-polish="mintlify-workbench">',
    '<main class="wrap" id="questionBankHomeMain" tabindex="-1" data-round582-home-polish="mintlify-workbench" data-round584-home-density="compact-workbench">'
  );
  next = replaceAll(
    next,
    'data-round582-home-polish="reader-workbench">',
    'data-round582-home-polish="reader-workbench" data-round584-home-density="reader-workbench" data-round584-first-viewport-density-gate="1">'
  );
  next = replaceAll(next, '<b>Round583</b><span>题库交互可访问性升级</span>', '<b>Round584</b><span>入口首页密度升级</span>');
  next = replaceAll(next, 'Round583 账本', 'Round584 账本');
  next = replaceAll(next, 'fluid-round583-question-bank-interaction-a11y-ledger.json', 'fluid-round584-question-bank-home-density-ledger.json');
  next = replaceAll(
    next,
    'Round583 继续保留全部题量、答案、证明记录和来源边界，并把题库搜索、收藏、练习弹窗、键盘焦点和减弱动画做成更稳的交互层：先看 181103、证明深修、真题补答和 strict PDF 边界，再进入题库。',
    'Round584 在 Round583 交互可访问性基础上继续保留全部题量、答案、证明记录和来源边界；本轮把进题库前的工作台压实为更紧凑的首屏路线：先确认 181103、证明深修、真题补答和 strict PDF 边界，再进入题库。'
  );
  next = replaceAll(
    next,
    'data-round583-interaction-a11y-strip="1"',
    'data-round583-interaction-a11y-strip="1" data-round584-home-density-strip="1"'
  );
  next = replaceAll(
    next,
    'data-round582-primary-entry="181103"',
    'data-round582-primary-entry="181103" data-round584-primary-entry="181103"'
  );
  return next;
}

function updateCurrentText(text) {
  let next = replaceAll(text, round584.previousVersion, round584.version);
  next = replaceAll(next, 'Round583 · round584-question-bank-home-density-20260630', 'Round584 · round584-question-bank-home-density-20260630');
  next = replaceAll(next, '当前版本：Round583 · round584-question-bank-home-density-20260630', '当前版本：Round584 · round584-question-bank-home-density-20260630');
  next = replaceAll(next, '当前发布：Round583 · round584-question-bank-home-density-20260630', '当前发布：Round584 · round584-question-bank-home-density-20260630');
  next = replaceAll(next, 'Round583：题库交互、安全渲染与可访问性升级', 'Round584：题库入口首页密度与视觉节奏升级');
  next = replaceAll(
    next,
    'Round583 hardens question-bank interactions, safe rendering, focus states, modal wrapping, search input, and reduced-motion behavior while preserving all content counts and answer/proof boundaries.',
    'Round584 compresses the question-bank home workbench, improves first-viewport route density, and keeps all content counts plus answer/proof boundaries unchanged.'
  );
  return next;
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
    'question-bank-home.html',
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
    let next = updateCurrentText(before);
    if (rel === 'question-bank-home.html') next = updateQuestionBankHome(next);
    if (next.includes(round584.version)) synced.push(rel);
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
  text = text.replace(/const EDGE_HOME_VERSION = '[^']+';/, `const EDGE_HOME_VERSION = '${round584.version}';`);
  text = text.replace(/const EDGE_RUNTIME_JS_VERSION = '[^']+';/, `const EDGE_RUNTIME_JS_VERSION = '${round584.version}';`);
  text = text.replace(/Round58[0-9][^.\n]*\./, 'Round584: compressed the question-bank home workbench and improved first-viewport route density without changing content boundaries.');
  writeText(rel, text);
}

function writeLedger(syncResult) {
  writeJson('data/fluid-round584-question-bank-home-density-ledger.json', {
    ok: true,
    version: round584.version,
    previousVersion: round584.previousVersion,
    round: round584.round,
    generatedAt: now,
    scope: round584.scope,
    nonDeletingUpgrade: true,
    uiOnlyUpgrade: true,
    homeDensityUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    changedQuestionBankContent: false,
    noRouteRemoved: true,
    noCountReduced: true,
    firstViewportDensityGate: true,
    materialSubpagesSynced: syncResult.materialPages.length,
    changedFiles: syncResult.synced,
    idempotentChangedFiles: syncResult.changed,
    metrics: {
      materialHtmlPages181103: round584.materialHtmlPages181103,
      sourceHtmlCards181103: round584.sourceHtmlCards181103,
      referencePracticeRows181103: round584.referencePracticeRows181103,
      sourceClueOnlyRows181103: round584.sourceClueOnlyRows181103,
      proofDepthRows181103: round584.proofDepthRows181103,
      proofDepthSecondPassRows181103: round584.proofDepthSecondPassRows181103,
      realExamAnswerDepthRows: round584.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round584.realExamOriginalAtomicRows,
      groupedRealExamRows: round584.groupedRealExamRows,
      strictAnswerPdfProofRows: round584.strictAnswerPdfProofRows
    },
    densityTargets: {
      desktopInteractiveLinksInFirstViewport: '>= 8',
      mobileInteractiveLinksInFirstViewport: '>= 4',
      maxMajorVerticalGapPx: '<= 36 desktop, <= 24 mobile',
      noHorizontalOverflow: true,
      noSmallVisibleTouchTargets: true
    },
    boundary: {
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      interactionFrontier: round584.previousVersion,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      publicShellOnlyUntilAuthGateRuns: true
    },
    verificationPlan: [
      'node tools/apply-round584-question-bank-home-density.mjs',
      'node tools/check-round584-question-bank-home-density.mjs',
      'node tools/check-round584-question-bank-home-density-visual.mjs',
      'node tools/check-round579-real-exam-answer-render-visual.mjs'
    ]
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round584.version,
    previousVersion: round584.previousVersion,
    date: round584.date,
    title: 'Round584：题库入口首页密度与视觉节奏升级',
    summary: '本轮不减少任何题量、答案、证明记录、链接或来源边界；专门把进题库前的工作台压实，降低重复区块空白，提升首屏可交互入口密度，并继续保持 181103 400 可参考、122 来源线索、422 证明深修、真题 163 深补、strictAnswerPdfProof=0 的边界。',
    links: [
      { label: 'Round584 首页密度账本', href: '/data/fluid-round584-question-bank-home-density-ledger.json' },
      { label: '题库入口工作台', href: `/question-bank-home.html?edge_refresh=${round584.version}` },
      { label: '题库交互页', href: `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round584.version}#questionBanksList` },
      { label: 'Round583 交互可访问性账本', href: '/data/fluid-round583-question-bank-interaction-a11y-ledger.json' }
    ],
    metrics: {
      realExamAnswerDepthRows: round584.realExamAnswerDepthRows,
      proofDepthRows: round584.proofDepthRows181103,
      proofDepthSecondPassRows: round584.proofDepthSecondPassRows181103,
      referencePracticeRows: round584.referencePracticeRows181103,
      sourceClueOnlyRows: round584.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round584.strictAnswerPdfProofRows
    },
    boundary: {
      homeDensityOnly: true,
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      interactionFrontier: round584.previousVersion
    }
  };
  writeJson('site-updates.json', [top, ...updates.filter((item) => item?.version !== round584.version)]);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  Object.assign(roadmap, {
    version: round584.version,
    currentVersion: round584.version,
    currentReleaseVersion: round584.version,
    previousVersion: round584.previousVersion,
    currentRound: round584.round,
    lastIntegratedRound: round584.round,
    lastUpdatedAt: now,
    lastUpdated: now,
    updatedAt: now,
    realExamAnswerDepthRows: round584.realExamAnswerDepthRows,
    proofDepthRows: round584.proofDepthRows181103,
    referencePracticeRows181103: round584.referencePracticeRows181103,
    sourceClueOnlyRows181103: round584.sourceClueOnlyRows181103,
    strictAnswerPdfProof: round584.strictAnswerPdfProofRows,
    round584QuestionBankHomeDensity: true
  });
  roadmap.latestRelease = {
    version: round584.version,
    round: round584.round,
    previousVersion: round584.previousVersion,
    summary: 'Round584 compresses the question-bank home workbench, improves first-viewport route density, and keeps all content counts plus answer/proof boundaries unchanged.'
  };
  roadmap.releaseGate ||= {};
  Object.assign(roadmap.releaseGate, {
    currentVersion: round584.version,
    expectedVersion: round584.version,
    commands: [
      'node tools/apply-round584-question-bank-home-density.mjs',
      'node tools/check-round584-question-bank-home-density.mjs',
      'node tools/check-round584-question-bank-home-density-visual.mjs',
      'node tools/check-round579-real-exam-answer-render-visual.mjs'
    ]
  });
  roadmap.release ||= {};
  Object.assign(roadmap.release, {
    currentVersion: round584.version,
    currentRound: round584.round,
    publicShellOnlyUntilAuthGateRuns: true
  });
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

function main() {
  const syncResult = syncCurrentVersionFiles();
  updateMiddleware();
  writeLedger(syncResult);
  updateSiteUpdates();
  updateRoadmap();
  console.log(JSON.stringify({
    ok: true,
    version: round584.version,
    changedVersionFiles: syncResult.changed.length,
    syncedVersionFiles: syncResult.synced.length,
    materialSubpagesSynced: syncResult.materialPages.length
  }, null, 2));
}

main();
