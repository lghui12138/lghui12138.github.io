#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';
import { round580 } from './round580-question-bank-focus-polish-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round580 apply from /Volumes/mac_2T during lifs isolation.');
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
  for (const rel of files) {
    if (!fs.existsSync(abs(rel))) continue;
    const before = readText(rel);
    let text = before;
    text = replaceAll(text, round580.previousVersion, round580.version);
    text = text.replace(/edge_refresh=round579-real-exam-answer-depth-twelfth-pass-20260629/g, `edge_refresh=${round580.version}`);
    text = text.replace(/(\/js\/core\/local-mathjax\.js\?v=)round579-real-exam-answer-depth-twelfth-pass-20260629/g, `$1${round580.version}`);
    text = text.replace(/(\/js\/formula-lite\.js\?v=)round579-real-exam-answer-depth-twelfth-pass-20260629/g, `$1${round580.version}`);
    text = text.replace(/target\.searchParams\.set\('edge_refresh','round579-real-exam-answer-depth-twelfth-pass-20260629'\)/g, `target.searchParams.set('edge_refresh','${round580.version}')`);
    text = replaceAll(text, '当前发布：Round579 ·', '当前发布：Round580 ·');
    text = replaceAll(text, '当前版本：Round579 ·', '当前版本：Round580 ·');
    text = replaceAll(text, '<b>Round579</b><span>真题过程答案第十二轮</span>', '<b>Round580</b><span>题库焦点页锚定优化</span>');
    text = replaceAll(text, 'Round579 账本', 'Round580 账本');
    text = replaceAll(text, './data/fluid-round579-real-exam-answer-depth-upgrade.json', './data/fluid-round580-question-bank-focus-polish-ledger.json');
    text = replaceAll(text, 'Round579 继续保留全部题量、答案、证明记录和来源边界，并把短真题答案补成可复查的过程型参考答案', 'Round580 继续保留全部题量、答案、证明记录和来源边界，并把题库焦点页锚定到更清晰的 181103 工作区');
    if (text !== before) {
      writeText(rel, text);
      changed.push(rel);
    }
  }
  return changed;
}

function updateMiddleware() {
  const rel = 'functions/_middleware.js';
  let text = readText(rel);
  text = text.replace(/const EDGE_HOME_VERSION = '[^']+';/, `const EDGE_HOME_VERSION = '${round580.version}';`);
  text = text.replace(/const EDGE_RUNTIME_JS_VERSION = '[^']+';/, `const EDGE_RUNTIME_JS_VERSION = '${round580.version}';`);
  text = text.replace(/Round579[^.\n]*\./, 'Round580: question-bank focus landing and anchored 181103 list polish.');
  writeText(rel, text);
}

function writeRound580Ledger(changedFiles) {
  writeJson('data/fluid-round580-question-bank-focus-polish-ledger.json', {
    ok: true,
    version: round580.version,
    previousVersion: round580.previousVersion,
    round: round580.round,
    generatedAt: now,
    scope: round580.scope,
    nonDeletingUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    focusLandingPolish: true,
    mobileNotificationRepositioned: true,
    anchoredFocusScroll: true,
    changedFiles,
    metrics: {
      materialHtmlPages181103: round580.materialHtmlPages181103,
      sourceHtmlCards181103: round580.sourceHtmlCards181103,
      referencePracticeRows181103: round580.referencePracticeRows181103,
      sourceClueOnlyRows181103: round580.sourceClueOnlyRows181103,
      proofDepthRows181103: round580.proofDepthRows181103,
      proofDepthSecondPassRows181103: round580.proofDepthSecondPassRows181103,
      realExamAnswerDepthRows: round580.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round580.realExamOriginalAtomicRows,
      groupedRealExamRows: round580.groupedRealExamRows,
      strictAnswerPdfProofRows: round580.strictAnswerPdfProofRows
    },
    verificationPlan: [
      'node tools/apply-round580-question-bank-focus-polish.mjs',
      'node tools/check-round580-question-bank-focus-polish.mjs',
      'node tools/check-round580-question-bank-focus-polish-visual.mjs',
      `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round580.version}`,
      `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round580.version}`
    ]
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round580.version,
    previousVersion: round580.previousVersion,
    date: round580.date,
    title: 'Round580：题库焦点页锚定与移动端通知优化',
    summary: '本轮不减少任何题量、答案、证明记录或来源边界；把进入 181103 题库后的焦点落点从生硬卡片滚动改成题库列表工作区锚定，新增 181103/来源/证明/PDF 四项状态条，并把移动端通知移到底部安全区，避免遮挡标题和状态。181103 仍为 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答保持 163；strictAnswerPdfProof 仍为 0。',
    links: [
      { label: 'Round580 焦点页优化账本', href: '/data/fluid-round580-question-bank-focus-polish-ledger.json' },
      { label: '题库入口', href: `/question-bank-home.html?edge_refresh=${round580.version}` },
      { label: '181103 焦点题库页', href: `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round580.version}#questionBanksList` },
      { label: 'Round579 真题补答账本', href: '/data/fluid-round579-real-exam-answer-depth-upgrade.json' }
    ],
    metrics: {
      realExamAnswerDepthRows: round580.realExamAnswerDepthRows,
      proofDepthRows: round580.proofDepthRows181103,
      proofDepthSecondPassRows: round580.proofDepthSecondPassRows181103,
      referencePracticeRows: round580.referencePracticeRows181103,
      sourceClueOnlyRows: round580.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round580.strictAnswerPdfProofRows
    },
    boundary: {
      focusPolishOnly: true,
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      contentFrontier: round580.previousVersion
    }
  };
  const next = updates.filter((item) => item?.version !== round580.version);
  next.unshift(top);
  writeJson('site-updates.json', next);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  Object.assign(roadmap, {
    version: round580.version,
    currentVersion: round580.version,
    currentReleaseVersion: round580.version,
    previousVersion: round580.previousVersion,
    currentRound: round580.round,
    lastIntegratedRound: round580.round,
    lastUpdatedAt: now,
    updatedAt: now,
    realExamAnswerDepthRows: round580.realExamAnswerDepthRows,
    proofDepthRows: round580.proofDepthRows181103,
    referencePracticeRows181103: round580.referencePracticeRows181103,
    sourceClueOnlyRows181103: round580.sourceClueOnlyRows181103,
    strictAnswerPdfProof: round580.strictAnswerPdfProofRows,
    round580QuestionBankFocusPolish: true
  });
  roadmap.latestRelease = {
    version: round580.version,
    round: round580.round,
    previousVersion: round580.previousVersion,
    summary: 'Round580 polishes the 181103 question-bank focus landing, anchored scroll behavior, compact focus status strip, and mobile notification placement without changing counts or answer content.'
  };
  roadmap.releaseGate ||= {};
  Object.assign(roadmap.releaseGate, {
    currentVersion: round580.version,
    expectedVersion: round580.version,
    previousVersion: round580.previousVersion,
    currentRound: round580.round,
    lastUpdated: now
  });
  const commands = [
    'node tools/apply-round580-question-bank-focus-polish.mjs',
    'node tools/check-round580-question-bank-focus-polish.mjs',
    'node tools/check-round580-question-bank-focus-polish-visual.mjs',
    `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round580.version}`,
    `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round580.version}`
  ];
  const previous = (roadmap.releaseGate.commands || [])
    .filter((command) => !/round57[0-9]|check-round57[0-9]|apply-round57[0-9]/.test(String(command)));
  roadmap.releaseGate.commands = Array.from(new Set([...commands, ...previous]));
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

const changedVersionFiles = syncCurrentVersionFiles();
updateMiddleware();
writeRound580Ledger(changedVersionFiles);
updateSiteUpdates();
updateRoadmap();

console.log(JSON.stringify({
  ok: true,
  version: round580.version,
  previousVersion: round580.previousVersion,
  changedVersionFiles: changedVersionFiles.length,
  generatedAt: now
}, null, 2));
