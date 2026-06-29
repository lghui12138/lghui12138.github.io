#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576, round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round576 apply from /Volumes/mac_2T during lifs isolation.');
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

function versionCurrentText(text) {
  let next = text;
  next = replaceAll(next, round576.previousVersion, round576.version);
  next = replaceAll(next, round576.previousPublicShellVersion, round576.version);
  next = next.replace(/edge_refresh=round[0-9][^'"&<#\s)]*/g, `edge_refresh=${round576.version}`);
  next = next.replace(/\?round[0-9][^'"&<#\s)]*(&from=)/g, `?edge_refresh=${round576.version}$1`);
  next = next.replace(/target\.searchParams\.set\('edge_refresh',\s*'[^']+'\)/g, `target.searchParams.set('edge_refresh','${round576.version}')`);
  next = next.replace(/params\.set\('edge_refresh',\s*'[^']+'\)/g, `params.set('edge_refresh', '${round576.version}')`);
  next = next.replace(/const EDGE_REFRESH = 'round[0-9][^']*';/g, `const EDGE_REFRESH = '${round576.version}';`);
  next = next.replace(/const BASE_SEARCH = '\?([^']*edge_refresh=)round[0-9][^']*';/g, (_match, prefix) => `const BASE_SEARCH = '?${prefix}${round576.version}';`);
  next = next.replace(/(<meta name="fm-current-release" content=")[^"]+("\s*\/?>)/g, `$1${round576.version}$2`);
  next = next.replace(/data-public-shell-release="[^"]+"/g, `data-public-shell-release="${round576.version}"`);
  next = next.replace(/data-round418-public-shell-current="[^"]+"/g, `data-round418-public-shell-current="${round576.version}"`);
  next = next.replace(/当前公开壳版本为\s*round[0-9][^。<]*/g, `当前公开壳版本为 ${round576.version}`);
  next = next.replace(/当前公开壳版本是 <b>round[0-9][^<]*<\/b>/g, `当前公开壳版本是 <b>${round576.version}</b>`);
  next = next.replace(/(\/js\/core\/local-mathjax\.js\?v=)[^"']+/g, `$1${round576.version}`);
  next = next.replace(/(\/js\/formula-lite\.js\?v=)[^"']+/g, `$1${round576.version}`);
  next = replaceAll(next, 'data-round574-public-shell="1"', 'data-round576-direct-shell="1"');
  next = replaceAll(next, 'data-round574-route=', 'data-round576-route=');
  next = replaceAll(next, 'Round574 公开入口已同步', 'Round576 直达入口已同步');
  next = replaceAll(next, '本轮只刷新公开跳转壳、入口文案和计数可读性', '本轮继续同步公开直达壳、入口文案和计数可读性');
  next = replaceAll(next, 'Round575 题库入口压实', 'Round575 题库入口压实、Round576 直达壳一致');
  next = next.replace(new RegExp(`(/modules/question-bank\\.html\\?focus=181103-material-extracted&answer_status=current&edge_refresh=${round576.version})(?=["'])`, 'g'), '$1#questionBanksList');
  next = next.replace(new RegExp(`(/modules/real-exams-dynamic\\.html\\?edge_refresh=${round576.version})(?=["'])`, 'g'), '$1#sourceGranularityNote');
  return next;
}

function syncQuestionBankHome(text) {
  let next = text;
  next = replaceAll(next, '<b>Round575</b><span>入口压实与审计清晰</span>', '<b>Round576</b><span>直达壳一致与审计清晰</span>');
  next = replaceAll(next, '当前发布 · round575-workbench-entrance-polish-20260629', `当前发布 · ${round576.version}`);
  next = replaceAll(next, 'Round575 账本', 'Round576 账本');
  next = replaceAll(next, 'fluid-round575-workbench-entrance-polish-ledger.json', 'fluid-round576-direct-shell-consistency-ledger.json');
  next = replaceAll(next, 'data-round575-workbench-polish="1"', 'data-round575-workbench-polish="1" data-round576-direct-shell-consistency="1"');
  next = replaceAll(next, 'data-round575-workbench-strip="1"', 'data-round575-workbench-strip="1" data-round576-direct-shell-strip="1"');
  next = replaceAll(next, 'Round575 继续保留全部题量、答案、证明记录和来源边界，把入口第一屏压实成可直接行动的工作台', 'Round576 继续保留全部题量、答案、证明记录和来源边界，并把公开直达壳、别名入口和题库工作台收束到同一当前版本');
  next = replaceAll(next, 'raw pageHealth 不等于未通过项，Round575 后续验收会区分 allowed 与 unallowed 明细', 'raw pageHealth 不等于未通过项；Round576 继续用 allowed / unallowed 分层验收真实账号渲染');
  return next;
}

function syncIndexText(rel, text) {
  let next = text;
  if (rel === 'question-bank-home.html') next = syncQuestionBankHome(next);
  if (rel === 'index.html') next = replaceAll(next, '当前发布：Round575 ·', '当前发布：Round576 ·');
  if (rel === 'modules/real-exams-dynamic.html') next = replaceAll(next, '当前版本：Round575 ·', '当前版本：Round576 ·');
  if (rel === 'functions/_middleware.js') {
    next = replaceAll(
      next,
      'Round575: compact pre-question-bank workbench entrance and current 400/122 count cleanup',
      'Round576: direct public shell and alias-route cache-bust consistency'
    );
    next = next.replace(/const EDGE_HOME_VERSION = '[^']+';/, `const EDGE_HOME_VERSION = '${round576.version}';`);
    next = next.replace(/const EDGE_RUNTIME_JS_VERSION = '[^']+';/, `const EDGE_RUNTIME_JS_VERSION = '${round576.version}';`);
  }
  return next;
}

function syncCurrentFiles() {
  const changed = [];
  for (const rel of Array.from(new Set(round576CurrentSurfaceFiles))) {
    if (!fs.existsSync(abs(rel))) continue;
    const before = readText(rel);
    const after = syncIndexText(rel, versionCurrentText(before));
    if (after !== before) {
      writeText(rel, after);
      changed.push(rel);
    }
  }
  return changed;
}

function writeRound576Ledger(changedFiles) {
  const metrics = {
    materialHtmlPages181103: round576.materialHtmlPages181103,
    sourceHtmlCards181103: round576.sourceHtmlCards181103,
    referencePracticeRows181103: round576.referencePracticeRows181103,
    sourceClueOnlyRows181103: round576.sourceClueOnlyRows181103,
    proofDepthRows181103: round576.proofDepthRows181103,
    proofDepthRewriteRows181103: round576.proofDepthRewriteRows181103,
    realExamAnswerDepthRows: round576.realExamAnswerDepthRows,
    realExamOriginalAtomicRows: round576.realExamOriginalAtomicRows,
    realExamSourceSections: round576.realExamSourceSections,
    groupedRealExamRows: round576.groupedRealExamRows,
    strictAnswerPdfProofRows: round576.strictAnswerPdfProofRows
  };
  writeJson('data/fluid-round576-direct-shell-consistency-ledger.json', {
    ok: true,
    version: round576.version,
    previousVersion: round576.previousVersion,
    previousPublicShellVersion: round576.previousPublicShellVersion,
    round: round576.round,
    generatedAt: now,
    scope: round576.scope,
    nonDeletingUpgrade: true,
    publicShellAndAliasOnly: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    metrics,
    directShellFiles: round576DirectShellFiles,
    changedFiles,
    verificationPlan: [
      'node tools/apply-round576-direct-shell-consistency.mjs',
      'node tools/check-round576-direct-shell-consistency.mjs',
      'node tools/check-round576-direct-shell-visual.mjs',
      `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round576.version}`,
      `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round576.version}`
    ]
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round576.version,
    previousVersion: round576.previousVersion,
    date: round576.date,
    title: 'Round576：公开直达壳与别名入口版本一致',
    summary: '本轮继续不减少任何题量、答案、证明记录或来源边界；把登录辅助、练习、模拟、资源、教材阅读、knowledge 目录别名和 teacher-panel 直达壳统一到 Round576，避免旧 edge_refresh 把用户或真实账号 gate 拉回 Round574。181103 仍为 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答仍为 145；strictAnswerPdfProof 仍为 0。',
    links: [
      { label: 'Round576 直达壳一致账本', href: '/data/fluid-round576-direct-shell-consistency-ledger.json' },
      { label: '题库入口', href: `/question-bank-home.html?edge_refresh=${round576.version}` },
      { label: 'Round575 入口压实账本', href: '/data/fluid-round575-workbench-entrance-polish-ledger.json' }
    ],
    metrics: {
      realExamAnswerDepthRows: round576.realExamAnswerDepthRows,
      proofDepthRows: round576.proofDepthRows181103,
      proofDepthRewriteRows: round576.proofDepthRewriteRows181103,
      referencePracticeRows: round576.referencePracticeRows181103,
      sourceClueOnlyRows: round576.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round576.strictAnswerPdfProofRows
    },
    boundary: {
      publicShellAndAliasOnly: true,
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      contentFrontier: round576.contentFrontierVersion
    }
  };
  const next = updates.filter((item) => item?.version !== round576.version);
  next.unshift(top);
  writeJson('site-updates.json', next);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  roadmap.version = round576.version;
  roadmap.currentVersion = round576.version;
  roadmap.currentReleaseVersion = round576.version;
  roadmap.previousVersion = round576.previousVersion;
  roadmap.currentRound = round576.round;
  roadmap.lastIntegratedRound = round576.round;
  roadmap.lastUpdatedAt = now;
  roadmap.updatedAt = now;
  roadmap.latestRelease = {
    version: round576.version,
    round: round576.round,
    previousVersion: round576.previousVersion,
    summary: 'Round576 keeps Round575 workbench polish and synchronizes direct public shells and alias routes to the same current cache-bust.'
  };
  roadmap.releaseGate ||= {};
  roadmap.releaseGate.currentVersion = round576.version;
  roadmap.releaseGate.expectedVersion = round576.version;
  roadmap.releaseGate.previousVersion = round576.previousVersion;
  roadmap.releaseGate.currentRound = round576.round;
  roadmap.releaseGate.lastUpdated = now;
  const commands = [
    'node tools/apply-round576-direct-shell-consistency.mjs',
    'node tools/check-round576-direct-shell-consistency.mjs',
    'node tools/check-round576-direct-shell-visual.mjs',
    `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round576.version}`,
    `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round576.version}`
  ];
  const previous = (roadmap.releaseGate.commands || [])
    .filter((command) => !/round57[0-5]|check-round57[0-5]|apply-round57[0-5]/.test(String(command)));
  roadmap.releaseGate.commands = Array.from(new Set([...commands, ...previous]));
  roadmap.round576DirectShellConsistency = true;
  roadmap.round576NonDeletingUpgrade = true;
  roadmap.referencePracticeRows181103 = round576.referencePracticeRows181103;
  roadmap.sourceClueOnlyRows181103 = round576.sourceClueOnlyRows181103;
  roadmap.proofDepthRows = round576.proofDepthRows181103;
  roadmap.realExamAnswerDepthRows = round576.realExamAnswerDepthRows;
  roadmap.strictAnswerPdfProof = round576.strictAnswerPdfProofRows;
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

const changedFiles = Array.from(new Set([
  ...syncCurrentFiles(),
  'js/fluid-home-complete.js',
  'modules/question-bank-data.js',
  'modules/wu-wangyi-fluid-reading.html'
]));
writeRound576Ledger(changedFiles);
updateSiteUpdates();
updateRoadmap();

console.log(JSON.stringify({
  ok: true,
  version: round576.version,
  directShellFiles: round576DirectShellFiles.length,
  changedFiles: changedFiles.length,
  generatedAt: now
}, null, 2));
