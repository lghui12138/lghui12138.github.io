#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { round574 } from './round574-public-shell-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round574-public-shell-freshness-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round574 QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

function abs(rel) {
  return path.join(repoRoot, rel);
}

function readText(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function walkHtml(dir = repoRoot, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'output', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(path.relative(repoRoot, full));
  }
  return out;
}

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

const ledger = readJson('data/fluid-round574-public-shell-freshness-ledger.json');
const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const middleware = readText('functions/_middleware.js');
const home = readText('question-bank-home.html');
const index = readText('index.html');
const realExam = readText('modules/real-exams-dynamic.html');

check('Round574 ledger preserves content counts and declares public shell only', ledger.ok === true
  && ledger.version === round574.version
  && ledger.previousVersion === round574.previousVersion
  && ledger.publicShellOnly === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.nonDeletingUpgrade === true
  && ledger.metrics.referencePracticeRows181103 === 400
  && ledger.metrics.sourceClueOnlyRows181103 === 122
  && ledger.metrics.proofDepthRows181103 === 422
  && ledger.metrics.realExamAnswerDepthRows === 145
  && ledger.metrics.strictAnswerPdfProofRows === 0
  && Array.isArray(ledger.shellFiles)
  && ledger.shellFiles.length >= 20
  && Array.isArray(ledger.legacyDirectFiles)
  && ledger.legacyDirectFiles.length >= 3, ledger.metrics || {});

check('site-updates top entry is Round574 with boundary separation', siteUpdates[0]?.version === round574.version
  && siteUpdates[0]?.previousVersion === round574.previousVersion
  && siteUpdates[0]?.metrics?.referencePracticeRows === 400
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === 122
  && siteUpdates[0]?.metrics?.proofDepthRows === 422
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === 145
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0
  && siteUpdates[0]?.boundary?.publicShellOnly === true
  && siteUpdates[0]?.boundary?.strictAnswerPdfProof === 'separate', siteUpdates[0] || {});

const gateCommands = roadmap.releaseGate?.commands || [];
check('roadmap and release gate point to Round574', roadmap.version === round574.version
  && roadmap.currentVersion === round574.version
  && roadmap.currentReleaseVersion === round574.version
  && roadmap.currentRound === 574
  && roadmap.lastIntegratedRound === 574
  && roadmap.releaseGate?.currentVersion === round574.version
  && roadmap.releaseGate?.expectedVersion === round574.version
  && roadmap.round574PublicShellFreshness === true
  && gateCommands.some((command) => command.includes('check-round574-public-shell-freshness.mjs'))
  && gateCommands.some((command) => command.includes(`--expected-version ${round574.version}`)), {
  currentRound: roadmap.currentRound,
  commands: gateCommands.slice(0, 8)
});

const shellFiles = walkHtml().filter((rel) => readText(rel).includes('data-round574-public-shell="1"')).sort();
const staleShells = shellFiles.flatMap((rel) => {
  const text = readText(rel);
  const stale = [];
  if (/round55[0-9]-|round56[0-9]-|round57[0-3]-/.test(text)) stale.push('old-current-version');
  if (/381 道独立题进入刷题|141 条参考答案页|385 道已完成证明深修|380\+1/.test(text)) stale.push('old-count-copy');
  if (!text.includes(round574.version)) stale.push('missing-round574');
  if (!text.includes('400') || !text.includes('122') || !text.includes('422') || !text.includes('145') || !text.includes('strict 0')) stale.push('missing-current-counts');
  if (!text.includes('lghui.top 只做公开入口') || !text.includes('pages.dev 源站')) stale.push('missing-surface-boundary');
  if (!text.includes('border-radius:8px')) stale.push('missing-compact-radius');
  return stale.length ? [{ rel, stale }] : [];
});
check('generated public shells are fresh and keep current counts visible', shellFiles.length >= 20 && staleShells.length === 0, {
  shellFiles: shellFiles.length,
  staleShells
});

const legacyDirectFiles = walkHtml().filter((rel) => {
  const text = readText(rel);
  return text.includes('data-round418-public-shell-current')
    || text.includes('data-round398-simulated-public-route-signal')
    || text.includes('当前公开壳版本为 ');
}).sort();
const staleLegacyDirect = legacyDirectFiles.flatMap((rel) => {
  const text = readText(rel);
  const stale = [];
  if (/data-round418-public-shell-current="(?!round574-public-shell-freshness-flow-20260629)/.test(text)) stale.push('old-current-marker');
  if (/当前公开壳版本为\s*round(?!574-public-shell-freshness-flow-20260629)/.test(text)) stale.push('old-visible-current-version');
  if (/target\.searchParams\.set\('edge_refresh',\s*'round(?!574-public-shell-freshness-flow-20260629)/.test(text)) stale.push('old-target-edge-refresh');
  if (/params\.set\('edge_refresh',\s*'round(?!574-public-shell-freshness-flow-20260629)/.test(text)) stale.push('old-params-edge-refresh');
  if (/381 默认练习|381 ready 参考答案|141 源文线索|381 道独立题进入刷题|141 条参考答案页/.test(text)) stale.push('old-current-count-copy');
  return stale.length ? [{ rel, stale }] : [];
});
check('legacy direct public shells use Round574 current markers and current counts', legacyDirectFiles.length >= 3 && staleLegacyDirect.length === 0, {
  legacyDirectFiles: legacyDirectFiles.length,
  staleLegacyDirect
});

check('middleware versions and runtime cache-bust are Round574', middleware.includes(`const EDGE_HOME_VERSION = '${round574.version}';`)
  && middleware.includes(`const EDGE_RUNTIME_JS_VERSION = '${round574.version}';`)
  && middleware.includes('Round574: public shell freshness and entrance flow synchronization'), {});

check('main entrances visibly carry Round574 while preserving Round572/Round573 content frontier', home.includes('<b>Round574</b>')
  && home.includes(round574.version)
  && home.includes('data-round574-public-shell-summary="1"')
  && home.includes('data-round574-public-shell-strip="1"')
  && home.includes('fluid-round574-public-shell-freshness-ledger.json')
  && home.includes('Round574 已同步公开跳转壳')
  && index.includes(`当前发布：Round574 · ${round574.version}`)
  && realExam.includes(`当前版本：Round574 · ${round574.version}`)
  && home.includes('181103 <strong>400</strong> 可参考')
  && home.includes('源文线索 <strong>122</strong>')
  && home.includes('推导深修 <strong>422</strong>')
  && home.includes('真题补答 <strong>145</strong>'), {});

const currentSurfaceFiles = [
  'question-bank-home.html',
  'index.html',
  'index-complete.html',
  'index-complete/index.html',
  'knowledge.html',
  'resources.html',
  'modules/question-bank.html',
  'modules/real-exams-dynamic.html',
  'functions/_middleware.js',
  'js/edge-fluid-learning-upgrade.js',
  'modules/knowledge-detail.html',
  'modules/knowledge-upgrade-2026.html'
];
const surfaceScan = currentSurfaceFiles.map((rel) => {
  const text = readText(rel);
  return { rel, hasRound574: text.includes(round574.version), prevHits: text.split(round574.previousVersion).length - 1 };
});
check('current surfaces use Round574 cache-bust instead of Round573 current version', surfaceScan.every((row) => row.hasRound574 && row.prevHits === 0), {
  rows: surfaceScan
});

const report = {
  ok: checks.every((row) => row.pass),
  version: round574.version,
  generatedAt: new Date().toISOString(),
  checks
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
