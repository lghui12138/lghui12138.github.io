#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';
import { round581 } from './round581-question-bank-card-polish-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round581 apply from /Volumes/mac_2T during lifs isolation.');
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

function polishCurrentText(text) {
  let next = text;
  next = replaceAll(next, round581.previousVersion, round581.version);
  next = next.replace(/edge_refresh=round580-question-bank-focus-polish-20260629/g, `edge_refresh=${round581.version}`);
  next = next.replace(/(\/js\/core\/local-mathjax\.js\?v=)round580-question-bank-focus-polish-20260629/g, `$1${round581.version}`);
  next = next.replace(/(\/js\/formula-lite\.js\?v=)round580-question-bank-focus-polish-20260629/g, `$1${round581.version}`);
  next = next.replace(/target\.searchParams\.set\('edge_refresh','round580-question-bank-focus-polish-20260629'\)/g, `target.searchParams.set('edge_refresh','${round581.version}')`);
  next = replaceAll(next, '当前发布：Round580 ·', '当前发布：Round581 ·');
  next = replaceAll(next, '当前版本：Round580 ·', '当前版本：Round581 ·');
  next = replaceAll(next, '<b>Round580</b><span>题库焦点页锚定优化</span>', '<b>Round581</b><span>题库卡片可读性优化</span>');
  next = replaceAll(next, 'Round580 账本', 'Round581 账本');
  next = replaceAll(next, './data/fluid-round580-question-bank-focus-polish-ledger.json', './data/fluid-round581-question-bank-card-polish-ledger.json');
  next = replaceAll(next, '/data/fluid-round580-question-bank-focus-polish-ledger.json', '/data/fluid-round581-question-bank-card-polish-ledger.json');
  next = replaceAll(next, 'Round580 继续保留全部题量、答案、证明记录和来源边界，并把题库焦点页锚定到更清晰的 181103 工作区', 'Round581 继续保留全部题量、答案、证明记录和来源边界，并把 181103 题库卡片压实成更清晰的移动端工作卡');
  next = replaceAll(next, '145 道深补 / 325 原文小题', '163 道深补 / 325 原文小题');
  next = replaceAll(next, '145 深补 / 325 原文小题', '163 深补 / 325 原文小题');
  next = replaceAll(next, '145 深补', '163 深补');
  next = replaceAll(next, '真题深度补答累计 145 道', '真题深度补答累计 163 道');
  next = next.replace(/Round579 再补强 10 道历年真题过程答案；Round579 再补强 10 道历年真题过程答案；Round578 再补强 8 道历年真题过程答案，真题深度补答累计 163 道/g, 'Round578/579 合计再补强 18 道历年真题过程答案，真题深度补答累计 163 道');
  next = replaceAll(next, '内容前沿承接 Round573 / Round572：本轮继续同步公开直达壳、入口文案和计数可读性', '内容前沿承接 Round579，页面体验承接 Round580：本轮继续同步公开直达壳、入口文案和计数可读性');
  return next;
}

function syncCurrentVersionFiles() {
  const files = Array.from(new Set([
    ...round576CurrentSurfaceFiles,
    ...round576DirectShellFiles,
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
    const text = polishCurrentText(before);
    if (text.includes(round581.version)) synced.push(rel);
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
  text = text.replace(/const EDGE_HOME_VERSION = '[^']+';/, `const EDGE_HOME_VERSION = '${round581.version}';`);
  text = text.replace(/const EDGE_RUNTIME_JS_VERSION = '[^']+';/, `const EDGE_RUNTIME_JS_VERSION = '${round581.version}';`);
  text = text.replace(/Round580[^.\n]*\./, 'Round581: readable question-bank cards, single 181103 status card, focus handoff, and live notifications.');
  writeText(rel, text);
}

function writeRound581Ledger(syncResult) {
  writeJson('data/fluid-round581-question-bank-card-polish-ledger.json', {
    ok: true,
    version: round581.version,
    previousVersion: round581.previousVersion,
    round: round581.round,
    generatedAt: now,
    scope: round581.scope,
    nonDeletingUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    cardReadabilityPolish: true,
    cardSelectorScoped: true,
    duplicateAnswerStatusRemoved: true,
    mobileFallbackCardCompressed: true,
    notificationLiveRegion: true,
    focusAfterScroll: true,
    paginationAriaCurrent: true,
    changedFiles: syncResult.synced,
    idempotentChangedFiles: syncResult.changed,
    metrics: {
      materialHtmlPages181103: round581.materialHtmlPages181103,
      sourceHtmlCards181103: round581.sourceHtmlCards181103,
      referencePracticeRows181103: round581.referencePracticeRows181103,
      sourceClueOnlyRows181103: round581.sourceClueOnlyRows181103,
      proofDepthRows181103: round581.proofDepthRows181103,
      proofDepthSecondPassRows181103: round581.proofDepthSecondPassRows181103,
      realExamAnswerDepthRows: round581.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round581.realExamOriginalAtomicRows,
      groupedRealExamRows: round581.groupedRealExamRows,
      strictAnswerPdfProofRows: round581.strictAnswerPdfProofRows
    },
    boundary: {
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      uiOnlyUpgrade: true
    },
    verificationPlan: [
      'node tools/apply-round581-question-bank-card-polish.mjs',
      'node tools/check-round581-question-bank-card-polish.mjs',
      'node tools/check-round581-question-bank-card-polish-visual.mjs',
      `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round581.version}`,
      `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round581.version}`
    ]
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round581.version,
    previousVersion: round581.previousVersion,
    date: round581.date,
    title: 'Round581：题库卡片可读性与移动端工作卡优化',
    summary: '本轮不减少任何题量、答案、证明记录或来源边界；把 181103 焦点页卡片从旧式大色块和嵌套卡片改成轻量工作卡，答案状态只保留一份可读芯片，精选标签、按钮、通知和焦点定位在移动端更稳。181103 仍为 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答保持 163；strictAnswerPdfProof 仍为 0。',
    links: [
      { label: 'Round581 卡片优化账本', href: '/data/fluid-round581-question-bank-card-polish-ledger.json' },
      { label: '题库入口', href: `/question-bank-home.html?edge_refresh=${round581.version}` },
      { label: '181103 焦点题库页', href: `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round581.version}#questionBanksList` },
      { label: 'Round579 真题补答账本', href: '/data/fluid-round579-real-exam-answer-depth-upgrade.json' }
    ],
    metrics: {
      realExamAnswerDepthRows: round581.realExamAnswerDepthRows,
      proofDepthRows: round581.proofDepthRows181103,
      proofDepthSecondPassRows: round581.proofDepthSecondPassRows181103,
      referencePracticeRows: round581.referencePracticeRows181103,
      sourceClueOnlyRows: round581.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round581.strictAnswerPdfProofRows
    },
    boundary: {
      cardPolishOnly: true,
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629'
    }
  };
  const next = updates.filter((item) => item?.version !== round581.version);
  next.unshift(top);
  writeJson('site-updates.json', next);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  Object.assign(roadmap, {
    version: round581.version,
    currentVersion: round581.version,
    currentReleaseVersion: round581.version,
    previousVersion: round581.previousVersion,
    currentRound: round581.round,
    lastIntegratedRound: round581.round,
    lastUpdatedAt: now,
    lastUpdated: now,
    updatedAt: now,
    realExamAnswerDepthRows: round581.realExamAnswerDepthRows,
    proofDepthRows: round581.proofDepthRows181103,
    referencePracticeRows181103: round581.referencePracticeRows181103,
    sourceClueOnlyRows181103: round581.sourceClueOnlyRows181103,
    strictAnswerPdfProof: round581.strictAnswerPdfProofRows,
    round581QuestionBankCardPolish: true
  });
  roadmap.latestRelease = {
    version: round581.version,
    round: round581.round,
    previousVersion: round581.previousVersion,
    summary: 'Round581 polishes the 181103 question-bank card into a readable mobile work card, removes duplicate in-card status blocks, and keeps all answer/proof/PDF boundaries unchanged.'
  };
  roadmap.releaseGate ||= {};
  Object.assign(roadmap.releaseGate, {
    currentVersion: round581.version,
    expectedVersion: round581.version,
    previousVersion: round581.previousVersion,
    currentRound: round581.round,
    lastIntegratedRound: round581.round,
    lastIntegratedAt: now,
    lastUpdated: now,
    updatedAt: now
  });
  roadmap.release ||= {};
  Object.assign(roadmap.release, {
    version: round581.version,
    currentVersion: round581.version,
    currentRound: round581.round,
    lastIntegratedRound: round581.round,
    expectedVersion: round581.version,
    previousVersion: round581.previousVersion,
    runtimeVersion: round581.version,
    lastUpdated: now,
    updatedAt: now
  });
  const commands = [
    'node tools/apply-round581-question-bank-card-polish.mjs',
    'node tools/check-round581-question-bank-card-polish.mjs',
    'node tools/check-round581-question-bank-card-polish-visual.mjs',
    `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round581.version}`,
    `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round581.version}`
  ];
  const previous = (roadmap.releaseGate.commands || [])
    .filter((command) => !/round58[0-9]|check-round58[0-9]|apply-round58[0-9]/.test(String(command)));
  roadmap.releaseGate.commands = Array.from(new Set([...commands, ...previous]));
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

const syncResult = syncCurrentVersionFiles();
updateMiddleware();
writeRound581Ledger(syncResult);
updateSiteUpdates();
updateRoadmap();

console.log(JSON.stringify({
  ok: true,
  version: round581.version,
  previousVersion: round581.previousVersion,
  changedVersionFiles: syncResult.changed.length,
  syncedVersionFiles: syncResult.synced.length,
  generatedAt: now
}, null, 2));
