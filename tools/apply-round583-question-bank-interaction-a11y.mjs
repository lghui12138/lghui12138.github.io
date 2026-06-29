#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';
import { round583 } from './round583-question-bank-interaction-a11y-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round583 apply from /Volumes/mac_2T during lifs isolation.');
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

function updateCurrentText(text) {
  let next = text;
  next = replaceAll(next, round583.previousVersion, round583.version);
  next = replaceAll(next, round583.materialLegacyVersion, round583.version);
  next = replaceAll(next, 'round555-181103-proof-depth-upgrade-20260628', round583.version);
  next = replaceAll(next, 'Round581 · round583-question-bank-interaction-a11y-20260630', 'Round583 · round583-question-bank-interaction-a11y-20260630');
  next = replaceAll(next, '当前版本：Round581 · round583-question-bank-interaction-a11y-20260630', '当前版本：Round583 · round583-question-bank-interaction-a11y-20260630');
  next = replaceAll(next, '当前发布：Round581 · round583-question-bank-interaction-a11y-20260630', '当前发布：Round583 · round583-question-bank-interaction-a11y-20260630');
  next = replaceAll(next, 'Round582：题库入口工作台视觉与流畅性升级', 'Round583：题库交互、安全渲染与可访问性升级');
  next = replaceAll(next, 'Round582 账本', 'Round583 账本');
  next = replaceAll(next, 'Round582 入口工作台账本', 'Round583 交互可访问性账本');
  next = replaceAll(next, 'fluid-round582-question-bank-home-polish-ledger.json', 'fluid-round583-question-bank-interaction-a11y-ledger.json');
  next = replaceAll(next, '<b>Round582</b><span>入口工作台视觉升级</span>', '<b>Round583</b><span>题库交互可访问性升级</span>');
  next = replaceAll(
    next,
    'Round582 继续保留全部题量、答案、证明记录和来源边界，并把进题库前的工作台整理成更清晰、更顺滑的文档型入口',
    'Round583 继续保留全部题量、答案、证明记录和来源边界，并把题库搜索、收藏、练习弹窗、键盘焦点和减弱动画做成更稳的交互层'
  );
  next = replaceAll(
    next,
    'Round582 继续保留全部题量、答案、证明记录和来源边界；入口页改成轻量文档工作台：先看当前证据、181103、证明深修、真题补答和 strict PDF 边界，再进入题库。',
    'Round583 继续保留全部题量、答案、证明记录和来源边界；本轮只升级题库交互、安全渲染、键盘焦点、移动端弹窗、中文输入和减弱动画，不改变答案内容。'
  );
  next = replaceAll(
    next,
    'Round582 polishes the question-bank home workbench into a cleaner document-style entry surface while preserving all routes, counts, answer/proof ledgers, and strict PDF boundaries.',
    'Round583 hardens question-bank interactions, safe rendering, focus states, modal wrapping, search input, and reduced-motion behavior while preserving all content counts and answer/proof boundaries.'
  );
  next = replaceAll(
    next,
    'data-release-evidence-strip="round575-workbench-live" data-round572-proof-audit-strip="1" data-round573-fluidity-strip="1" data-round574-public-shell-strip="1" data-round575-workbench-strip="1" data-round576-direct-shell-strip="1" data-round576-direct-shell-strip="1"',
    `data-release-evidence-strip="${round583.version}" data-round572-proof-audit-strip="1" data-round573-fluidity-strip="1" data-round574-public-shell-strip="1" data-round575-workbench-strip="1" data-round576-direct-shell-strip="1" data-round583-interaction-a11y-strip="1"`
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
    const next = updateCurrentText(before);
    if (next.includes(round583.version)) synced.push(rel);
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
  text = text.replace(/const EDGE_HOME_VERSION = '[^']+';/, `const EDGE_HOME_VERSION = '${round583.version}';`);
  text = text.replace(/const EDGE_RUNTIME_JS_VERSION = '[^']+';/, `const EDGE_RUNTIME_JS_VERSION = '${round583.version}';`);
  text = text.replace(/Round58[0-9][^.\n]*\./, 'Round583: hardened question-bank interactions, safe rendering, focus states, modal wrapping, search input, and reduced-motion behavior while preserving content boundaries.');
  writeText(rel, text);
}

function writeLedger(syncResult) {
  writeJson('data/fluid-round583-question-bank-interaction-a11y-ledger.json', {
    ok: true,
    version: round583.version,
    previousVersion: round583.previousVersion,
    round: round583.round,
    generatedAt: now,
    scope: round583.scope,
    nonDeletingUpgrade: true,
    uiOnlyUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    changedQuestionBankContent: false,
    changedQuestionBankStructure: false,
    noRouteRemoved: true,
    noCountReduced: true,
    interactionA11yUpgrade: true,
    safeRenderingUpgrade: true,
    reducedMotionRespected: true,
    imeSearchGuard: true,
    notificationCap: 3,
    materialSubpagesSynced: syncResult.materialPages.length,
    changedFiles: syncResult.synced,
    idempotentChangedFiles: syncResult.changed,
    metrics: {
      materialHtmlPages181103: round583.materialHtmlPages181103,
      sourceHtmlCards181103: round583.sourceHtmlCards181103,
      referencePracticeRows181103: round583.referencePracticeRows181103,
      sourceClueOnlyRows181103: round583.sourceClueOnlyRows181103,
      proofDepthRows181103: round583.proofDepthRows181103,
      proofDepthSecondPassRows181103: round583.proofDepthSecondPassRows181103,
      realExamAnswerDepthRows: round583.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round583.realExamOriginalAtomicRows,
      groupedRealExamRows: round583.groupedRealExamRows,
      strictAnswerPdfProofRows: round583.strictAnswerPdfProofRows
    },
    practiceBoundary: {
      materialSourceCards: 522,
      defaultPracticeRows: 400,
      sourceClueOnlyRows: 122,
      randomAndFullPracticeUseDefaultPracticeRowsOnly: true
    },
    boundary: {
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      homeFrontier: round583.previousVersion,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      publicShellOnlyUntilAuthGateRuns: true
    },
    verificationPlan: [
      'node tools/apply-round583-question-bank-interaction-a11y.mjs',
      'node tools/check-round583-question-bank-interaction-a11y.mjs',
      'node tools/check-round583-question-bank-interaction-a11y-visual.mjs',
      'node tools/check-round579-real-exam-answer-render-visual.mjs'
    ]
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round583.version,
    previousVersion: round583.previousVersion,
    date: round583.date,
    title: 'Round583：题库交互、安全渲染与可访问性升级',
    summary: '本轮不减少任何题量、答案、证明记录、链接或来源边界；专门升级题库页搜索、收藏管理、练习模式弹窗、键盘焦点、移动端换行、通知堆叠、中文输入和减弱动画。181103 仍为 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答保持 163；strictAnswerPdfProof 仍为 0。',
    links: [
      { label: 'Round583 交互可访问性账本', href: '/data/fluid-round583-question-bank-interaction-a11y-ledger.json' },
      { label: '题库交互页', href: `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round583.version}#questionBanksList` },
      { label: '题库入口工作台', href: `/question-bank-home.html?edge_refresh=${round583.version}` },
      { label: 'Round582 入口工作台账本', href: '/data/fluid-round582-question-bank-home-polish-ledger.json' }
    ],
    metrics: {
      realExamAnswerDepthRows: round583.realExamAnswerDepthRows,
      proofDepthRows: round583.proofDepthRows181103,
      proofDepthSecondPassRows: round583.proofDepthSecondPassRows181103,
      referencePracticeRows: round583.referencePracticeRows181103,
      sourceClueOnlyRows: round583.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round583.strictAnswerPdfProofRows
    },
    boundary: {
      interactionA11yOnly: true,
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629'
    }
  };
  writeJson('site-updates.json', [top, ...updates.filter((item) => item?.version !== round583.version)]);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  Object.assign(roadmap, {
    version: round583.version,
    currentVersion: round583.version,
    currentReleaseVersion: round583.version,
    previousVersion: round583.previousVersion,
    currentRound: round583.round,
    lastIntegratedRound: round583.round,
    lastUpdatedAt: now,
    lastUpdated: now,
    updatedAt: now,
    realExamAnswerDepthRows: round583.realExamAnswerDepthRows,
    proofDepthRows: round583.proofDepthRows181103,
    referencePracticeRows181103: round583.referencePracticeRows181103,
    sourceClueOnlyRows181103: round583.sourceClueOnlyRows181103,
    strictAnswerPdfProof: round583.strictAnswerPdfProofRows,
    round583QuestionBankInteractionA11y: true
  });
  roadmap.latestRelease = {
    version: round583.version,
    round: round583.round,
    previousVersion: round583.previousVersion,
    summary: 'Round583 hardens question-bank interactions, safe rendering, focus states, modal wrapping, search input, and reduced-motion behavior while preserving all content counts and answer/proof boundaries.'
  };
  roadmap.releaseGate ||= {};
  Object.assign(roadmap.releaseGate, {
    currentVersion: round583.version,
    expectedVersion: round583.version,
    previousVersion: round583.previousVersion,
    currentRound: round583.round,
    lastIntegratedRound: round583.round,
    lastIntegratedAt: now,
    lastUpdated: now,
    updatedAt: now
  });
  roadmap.release ||= {};
  Object.assign(roadmap.release, {
    version: round583.version,
    currentVersion: round583.version,
    currentRound: round583.round,
    lastIntegratedRound: round583.round,
    expectedVersion: round583.version,
    previousVersion: round583.previousVersion,
    runtimeVersion: round583.version,
    lastUpdated: now,
    updatedAt: now
  });
  const commands = [
    'node tools/apply-round583-question-bank-interaction-a11y.mjs',
    'node tools/check-round583-question-bank-interaction-a11y.mjs',
    'node tools/check-round583-question-bank-interaction-a11y-visual.mjs',
    'node tools/check-round579-real-exam-answer-render-visual.mjs'
  ];
  const previous = (roadmap.releaseGate.commands || [])
    .filter((command) => !/round55[0-9]|round56[0-9]|round57[0-9]|round58[0-9]|expected-version round5[0-9][0-9]|expected-edge-version round5[0-9][0-9]/.test(String(command)));
  roadmap.releaseGate.commands = Array.from(new Set([...commands, ...previous]));
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

const syncResult = syncCurrentVersionFiles();
updateMiddleware();
writeLedger(syncResult);
updateSiteUpdates();
updateRoadmap();

console.log(JSON.stringify({
  ok: true,
  version: round583.version,
  previousVersion: round583.previousVersion,
  changedVersionFiles: syncResult.changed.length,
  syncedVersionFiles: syncResult.synced.length,
  materialSubpagesSynced: syncResult.materialPages.length,
  generatedAt: now
}, null, 2));
