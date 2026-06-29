#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round575 } from './round575-workbench-polish-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round575 apply from /Volumes/mac_2T during lifs isolation.');
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

function updateCurrentVersionStrings() {
  const currentFiles = [
    'question-bank-home.html',
    'index.html',
    'index-complete.html',
    'index-complete/index.html',
    'knowledge.html',
    'modules/knowledge-upgrade-2026.html',
    'modules/knowledge-detail.html',
    'modules/question-bank.html',
    'modules/real-exams-dynamic.html',
    'teacher-panel.html',
    'teacher-panel/index.html',
    'modules/teacher-panel.html',
    'modules/teacher-panel/index.html',
    'functions/_middleware.js',
    'js/core/local-mathjax.js',
    'js/edge-fluid-learning-upgrade.js'
  ];
  for (const rel of currentFiles) {
    if (!fs.existsSync(abs(rel))) continue;
    let text = readText(rel);
    text = replaceAll(text, round575.previousVersion, round575.version);
    writeText(rel, text);
  }
}

function updateCurrentCountCopy() {
  const replacements = [
    ['knowledge.html', [
      ['38 HTML · 522 sources · 381 practice · 381+0 answers · 141 leads', '38 HTML · 522 sources · 400 practice · 400+0 answers · 122 leads'],
      ['522 张资料来源卡、381 道默认练习和 381+0 答案状态继续从知识点页回连，不把 141 条线索混入刷题池。', '522 张资料来源卡、400 道默认练习和 400+0 答案状态继续从知识点页回连，不把 122 条线索混入刷题池。']
    ]],
    ['modules/knowledge-upgrade-2026.html', [
      ['522 张来源卡、390 道可直接参考答案、0 道待复核和 132 条源文线索', '522 张来源卡、400 道可直接参考答案、0 道待复核和 122 条源文线索'],
      ['390 道默认练习题可直接看参考答案，0 道待人工源页复核，132 条源文线索只展示。', '400 道默认练习题可直接看参考答案，0 道待人工源页复核，122 条源文线索只展示。'],
      [`/modules/real-exams-dynamic.html?${round575.version}&from=knowledge-upgrade-181103-shortcut`, `/modules/real-exams-dynamic.html?edge_refresh=${round575.version}&from=knowledge-upgrade-181103-shortcut`]
    ]],
    ['index.html', [
      [`当前发布：Round574 · ${round575.version}`, `当前发布：Round575 · ${round575.version}`],
      ['Round574 公开壳同步、参考答案展示', 'Round574 公开壳同步、Round575 题库入口压实、参考答案展示']
    ]],
    ['index-complete.html', [
      ['仍不宣称原卷答案 PDF 逐字证明。', '这是站内参考推导补强，不是官方原卷逐字答案；strictAnswerPdfProof 仍为 0。']
    ]],
    ['index-complete/index.html', [
      ['仍不宣称原卷答案 PDF 逐字证明。', '这是站内参考推导补强，不是官方原卷逐字答案；strictAnswerPdfProof 仍为 0。']
    ]],
    ['modules/real-exams-dynamic.html', [
      [`当前版本：Round574 · ${round575.version}`, `当前版本：Round575 · ${round575.version}`]
    ]],
    ['question-bank-home.html', [
      [`Round574 已同步公开跳转壳`, `Round574 已同步公开跳转壳，Round575 已压实入口第一屏`]
    ]]
  ];
  for (const [rel, pairs] of replacements) {
    if (!fs.existsSync(abs(rel))) continue;
    let text = readText(rel);
    for (const [from, to] of pairs) text = replaceAll(text, from, to);
    writeText(rel, text);
  }
}

function writeRound575Ledger() {
  const ledger = {
    ok: true,
    version: round575.version,
    previousVersion: round575.previousVersion,
    round: round575.round,
    generatedAt: now,
    scope: round575.scope,
    nonDeletingUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    currentCountCleanup: true,
    authenticatedBrowserPageHealthBoundary: {
      rawCountsAreNotFailures: true,
      unallowedMustRemainZero: true,
      knownAllowedClasses: [
        'MathJax Package getter pageerror',
        'student teacher-panel 403 block proof'
      ]
    },
    metrics: {
      materialHtmlPages181103: round575.materialHtmlPages181103,
      sourceHtmlCards181103: round575.sourceHtmlCards181103,
      referencePracticeRows181103: round575.referencePracticeRows181103,
      sourceClueOnlyRows181103: round575.sourceClueOnlyRows181103,
      proofDepthRows181103: round575.proofDepthRows181103,
      proofDepthRewriteRows181103: round575.proofDepthRewriteRows181103,
      realExamAnswerDepthRows: round575.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round575.realExamOriginalAtomicRows,
      realExamSourceSections: round575.realExamSourceSections,
      groupedRealExamRows: round575.groupedRealExamRows,
      strictAnswerPdfProofRows: round575.strictAnswerPdfProofRows
    },
    changes: [
      'Question-bank-home first screen now uses a compact Round575 status rail and three top actions instead of repeated ledger buttons.',
      'The hero lede is shorter while the detailed answer/source boundary remains available in a disclosure panel.',
      'Current knowledge entrances no longer show stale 381/141 or 390/132 counts; they now show 400/122.',
      'Release cache-bust strings and middleware edge version are synchronized for current workbench surfaces.',
      'Authenticated browser pageHealth is explicitly documented as raw telemetry; allowed/unallowed split remains the acceptance boundary.'
    ],
    verificationPlan: [
      'node tools/apply-round575-workbench-polish.mjs',
      'node tools/check-round575-workbench-polish.mjs',
      'node tools/check-round575-question-bank-home-visual.mjs',
      `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round575.version}`,
      `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round575.version}`
    ]
  };
  writeJson('data/fluid-round575-workbench-entrance-polish-ledger.json', ledger);
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round575.version,
    previousVersion: round575.previousVersion,
    date: round575.date,
    title: 'Round575：题库入口第一屏压实与当前计数清理',
    summary: '本轮不减少任何题量、答案、证明记录或来源边界；把进入题库前的工作台第一屏改成更紧凑的状态栏、行动入口和证明/答案边界面板，并清理当前知识入口中的 381/141、390/132 陈旧口径。181103 仍保持 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答仍为 145；strictAnswerPdfProof 仍为 0。认证浏览器 pageHealth 继续区分 raw telemetry 与 unallowed failure。',
    links: [
      { label: 'Round575 入口压实账本', href: '/data/fluid-round575-workbench-entrance-polish-ledger.json' },
      { label: '题库入口', href: `/question-bank-home.html?edge_refresh=${round575.version}` },
      { label: 'Round574 公开壳账本', href: '/data/fluid-round574-public-shell-freshness-ledger.json' }
    ],
    metrics: {
      realExamAnswerDepthRows: round575.realExamAnswerDepthRows,
      proofDepthRows: round575.proofDepthRows181103,
      proofDepthRewriteRows: round575.proofDepthRewriteRows181103,
      referencePracticeRows: round575.referencePracticeRows181103,
      sourceClueOnlyRows: round575.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round575.strictAnswerPdfProofRows
    },
    boundary: {
      nonDeletingUpgrade: true,
      currentCountCleanup: true,
      authenticatedBrowserRawTelemetrySeparated: true,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      contentFrontier: round575.contentFrontierVersion
    }
  };
  const nextUpdates = updates.filter((item) => item?.version !== round575.version);
  nextUpdates.unshift(top);
  writeJson('site-updates.json', nextUpdates);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  roadmap.version = round575.version;
  roadmap.currentVersion = round575.version;
  roadmap.currentReleaseVersion = round575.version;
  roadmap.previousVersion = round575.previousVersion;
  roadmap.currentRound = round575.round;
  roadmap.lastIntegratedRound = round575.round;
  roadmap.lastUpdatedAt = now;
  roadmap.updatedAt = now;
  roadmap.latestRelease = {
    version: round575.version,
    round: round575.round,
    previousVersion: round575.previousVersion,
    summary: 'Round575 is a non-deleting entrance polish release: compact question-bank-home first screen, current 400/122 count cleanup, and authenticated pageHealth boundary clarity.'
  };
  roadmap.releaseGate ||= {};
  roadmap.releaseGate.currentVersion = round575.version;
  roadmap.releaseGate.expectedVersion = round575.version;
  roadmap.releaseGate.previousVersion = round575.previousVersion;
  roadmap.releaseGate.currentRound = round575.round;
  roadmap.releaseGate.lastUpdated = now;
  const commands = [
    'node tools/apply-round575-workbench-polish.mjs',
    'node tools/check-round575-workbench-polish.mjs',
    'node tools/check-round575-question-bank-home-visual.mjs',
    `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round575.version}`,
    `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round575.version}`
  ];
  const previousCommands = (roadmap.releaseGate.commands || [])
    .filter((command) => !String(command).includes(round575.previousVersion))
    .filter((command) => !/check-round57[0-4]|apply-round57[0-4]/.test(String(command)));
  roadmap.releaseGate.commands = Array.from(new Set([...commands, ...previousCommands]));
  roadmap.round575WorkbenchEntrancePolish = true;
  roadmap.round575CurrentCountCleanup = true;
  roadmap.round575AuthenticatedBrowserPageHealthBoundary = 'raw telemetry split from unallowed failures';
  roadmap.realExamAnswerDepthRows = round575.realExamAnswerDepthRows;
  roadmap.proofDepthRows = round575.proofDepthRows181103;
  roadmap.referencePracticeRows181103 = round575.referencePracticeRows181103;
  roadmap.sourceClueOnlyRows181103 = round575.sourceClueOnlyRows181103;
  roadmap.strictAnswerPdfProof = round575.strictAnswerPdfProofRows;
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

function updateMiddlewareComment() {
  let text = readText('functions/_middleware.js');
  text = replaceAll(
    text,
    '// Round574: public shell freshness and entrance flow synchronization; Round572 answer/proof counts remain the content frontier and strict PDF proof stays separate.',
    '// Round575: compact pre-question-bank workbench entrance and current 400/122 count cleanup; Round572 answer/proof counts remain the answer frontier and strict PDF proof stays separate.'
  );
  text = replaceAll(text, `const EDGE_HOME_VERSION = '${round575.previousVersion}';`, `const EDGE_HOME_VERSION = '${round575.version}';`);
  text = replaceAll(text, `const EDGE_RUNTIME_JS_VERSION = '${round575.previousVersion}';`, `const EDGE_RUNTIME_JS_VERSION = '${round575.version}';`);
  writeText('functions/_middleware.js', text);
}

updateCurrentVersionStrings();
updateCurrentCountCopy();
writeRound575Ledger();
updateSiteUpdates();
updateRoadmap();
updateMiddlewareComment();

console.log(JSON.stringify({ ok: true, version: round575.version, generatedAt: now }, null, 2));
