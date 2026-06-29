#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { round573 } from './round573-fluidity-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round573-fluidity-polish-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round573 QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

function readText(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

const ledger = readJson('data/fluid-round573-fluidity-polish-ledger.json');
const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const home = readText('question-bank-home.html');
const index = readText('index.html');
const indexComplete = readText('index-complete.html');
const resources = readText('resources.html');
const questionBank = readText('modules/question-bank.html');
const realExam = readText('modules/real-exams-dynamic.html');
const middleware = readText('functions/_middleware.js');
const edgeJs = readText('js/edge-fluid-learning-upgrade.js');
const materialIndex = readText('resources/fluid-181103-html/index.html');

check('Round573 ledger preserves Round572 content counts without deleting content', ledger.ok === true
  && ledger.version === round573.version
  && ledger.previousVersion === round573.previousVersion
  && ledger.nonDeletingUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.metrics.realExamAnswerDepthRows === 145
  && ledger.metrics.proofDepthRows === 422
  && ledger.metrics.referencePracticeRows === 400
  && ledger.metrics.sourceClueOnlyRows === 122
  && ledger.metrics.strictAnswerPdfProof === 0
  && Array.isArray(ledger.flowRail)
  && ledger.flowRail.length === 4, ledger.metrics || {});

check('site-updates top entry is Round573 non-deleting polish release', Array.isArray(siteUpdates)
  && siteUpdates[0]?.version === round573.version
  && siteUpdates[0]?.previousVersion === round573.previousVersion
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === 145
  && siteUpdates[0]?.metrics?.realExamRoundUpgradeRows === 0
  && siteUpdates[0]?.metrics?.proofDepthRows === 422
  && siteUpdates[0]?.metrics?.proofDepthRewriteRows === 0
  && siteUpdates[0]?.metrics?.referencePracticeRows === 400
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === 122
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0
  && siteUpdates[0]?.boundary?.nonDeletingUpgrade === true, siteUpdates[0] || {});

const gateCommands = roadmap.releaseGate?.commands || [];
check('roadmap and release gate point to Round573', roadmap.version === round573.version
  && roadmap.currentVersion === round573.version
  && roadmap.currentReleaseVersion === round573.version
  && roadmap.currentRound === 573
  && roadmap.lastIntegratedRound === 573
  && roadmap.releaseGate?.currentVersion === round573.version
  && roadmap.releaseGate?.expectedVersion === round573.version
  && roadmap.round573FluidityPolish === true
  && roadmap.round573NonDeletingUpgrade === true
  && gateCommands.some((command) => command.includes('check-round573-fluidity-polish.mjs'))
  && gateCommands.some((command) => command.includes('check-round573-question-bank-home-visual.mjs'))
  && gateCommands.some((command) => command.includes(`--expected-version ${round573.version}`)), {
  currentRound: roadmap.currentRound,
  commands: gateCommands.slice(0, 8)
});

const currentFiles = [
  ['question-bank-home.html', home],
  ['index.html', index],
  ['index-complete.html', indexComplete],
  ['resources.html', resources],
  ['modules/question-bank.html', questionBank],
  ['modules/real-exams-dynamic.html', realExam],
  ['functions/_middleware.js', middleware],
  ['js/edge-fluid-learning-upgrade.js', edgeJs],
  ['resources/fluid-181103-html/index.html', materialIndex]
];

const versionScan = currentFiles.map(([rel, text]) => ({
  rel,
  hasRound573: text.includes(round573.version),
  previousVersionHits: text.split(round573.previousVersion).length - 1
}));
check('current surfaces carry Round573 cache-bust and drop previous current version string', versionScan.every((row) => row.hasRound573 && row.previousVersionHits === 0), { rows: versionScan });

check('question-bank home has Round573 flow rail and keeps all critical counts visible', home.includes('<b>Round573</b>')
  && home.includes('data-round573-fluidity-summary="1"')
  && home.includes('data-round573-fluidity-rail="1"')
  && home.includes('data-round573-fluidity-strip="1"')
  && home.includes('181103 <strong>400</strong> 可参考')
  && home.includes('推导深修 <strong>422</strong>')
  && home.includes('真题补答 <strong>145</strong>')
  && home.includes('源文线索 <strong>122</strong>')
  && home.includes('strict 0')
  && home.includes('Round573 只做入口流畅性与读回证据，不删减任何信息'), {});

check('mobile CSS no longer hides hero copy on narrow screens', !/hero-main\s*>\s*p:not\([^}]+display:\s*none/.test(home)
  && home.includes('font-size: 0.84rem')
  && !home.includes('content-visibility: auto')
  && home.includes('contain: layout paint')
  && home.includes('scroll-behavior: smooth'), {});

check('current entrance and real-exam cards avoid blank placeholder rendering', !home.includes('content-visibility: auto')
  && !/content-visibility\s*:\s*auto/.test(realExam)
  && realExam.includes('.card{contain:layout paint}'), {});

const flowItemCount = (home.match(/data-round573-flow=/g) || []).length;
check('flow rail contains four stable route tiles', flowItemCount === 4
  && home.includes('400 可参考')
  && home.includes('422 深修')
  && home.includes('145 深补')
  && home.includes('38 HTML'), { flowItemCount });

check('stale proof-ledger and discovery labels are corrected', indexComplete.includes('Round531-572 / 422 / PDF 0')
  && !indexComplete.includes('Round531-569 / 422 / PDF 0')
  && materialIndex.includes('Round531-572 当前 422 道证明/推导题深修')
  && materialIndex.includes('Round572 本轮重证 6 道')
  && !materialIndex.includes('Round531-571 当前 422')
  && !materialIndex.includes('Round571 本轮重证 6 道')
  && !edgeJs.includes('141 条线索只展示')
  && !edgeJs.includes(`?${round573.version}&from=round342-edge-search`)
  && edgeJs.includes(`?edge_refresh=${round573.version}&from=round342-edge-search`), {});

check('middleware edge version and runtime version are Round573', middleware.includes(`const EDGE_HOME_VERSION = '${round573.version}';`)
  && middleware.includes(`const EDGE_RUNTIME_JS_VERSION = '${round573.version}';`)
  && middleware.includes('Round573: non-deleting question-bank entrance fluidity polish'), {});

check('current release labels distinguish Round573 UI from Round572 answer/proof frontier', index.includes(`当前发布：Round573 · ${round573.version}`)
  && realExam.includes(`当前版本：Round573 · ${round573.version}`)
  && realExam.includes('Round572 内容批次已把累计 145 道历年真题短答案补成')
  && home.includes('继续沿 Round531-572 proof-depth 重写门处理'), {});

const report = {
  ok: checks.every((row) => row.pass),
  version: round573.version,
  generatedAt: new Date().toISOString(),
  checks
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
