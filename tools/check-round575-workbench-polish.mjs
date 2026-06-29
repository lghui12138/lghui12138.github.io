#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round575 } from './round575-workbench-polish-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round575-workbench-polish-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round575 QA from /Volumes/mac_2T during lifs isolation.');
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

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

function gzipMatchesJson(rel) {
  const json = readText(rel);
  const gz = zlib.gunzipSync(fs.readFileSync(abs(`${rel}.gz`))).toString('utf8');
  return json === gz;
}

const ledger = readJson('data/fluid-round575-workbench-entrance-polish-ledger.json');
const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const middleware = readText('functions/_middleware.js');
const home = readText('question-bank-home.html');
const index = readText('index.html');
const indexComplete = readText('index-complete.html');
const indexCompleteDir = readText('index-complete/index.html');
const knowledge = readText('knowledge.html');
const knowledgeUpgrade = readText('modules/knowledge-upgrade-2026.html');
const knowledgeDetail = readText('modules/knowledge-detail.html');
const questionBank = readText('modules/question-bank.html');
const realExam = readText('modules/real-exams-dynamic.html');
const teacherPanel = readText('teacher-panel.html');
const teacherPanelIndex = readText('teacher-panel/index.html');
const modulesTeacherPanel = readText('modules/teacher-panel.html');
const modulesTeacherPanelIndex = readText('modules/teacher-panel/index.html');
const localMathjax = readText('js/core/local-mathjax.js');
const edgeRuntime = readText('js/edge-fluid-learning-upgrade.js');

check('Round575 ledger exists, is non-deleting, and keeps answer/proof content untouched', ledger.ok === true
  && ledger.version === round575.version
  && ledger.previousVersion === round575.previousVersion
  && ledger.round === 575
  && ledger.nonDeletingUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.currentCountCleanup === true
  && ledger.metrics?.materialHtmlPages181103 === 38
  && ledger.metrics?.sourceHtmlCards181103 === 522
  && ledger.metrics?.referencePracticeRows181103 === 400
  && ledger.metrics?.sourceClueOnlyRows181103 === 122
  && ledger.metrics?.proofDepthRows181103 === 422
  && ledger.metrics?.proofDepthRewriteRows181103 === 6
  && ledger.metrics?.realExamAnswerDepthRows === 145
  && ledger.metrics?.strictAnswerPdfProofRows === 0, ledger.metrics || {});

check('ledger/site-updates/roadmap gzip sidecars match the JSON payloads',
  gzipMatchesJson('data/fluid-round575-workbench-entrance-polish-ledger.json')
  && gzipMatchesJson('site-updates.json')
  && gzipMatchesJson('data/fluid-upgrade-roadmap-100.json'), {});

check('site-updates top entry is Round575 with boundary fields', siteUpdates[0]?.version === round575.version
  && siteUpdates[0]?.previousVersion === round575.previousVersion
  && siteUpdates[0]?.metrics?.referencePracticeRows === 400
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === 122
  && siteUpdates[0]?.metrics?.proofDepthRows === 422
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === 145
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0
  && siteUpdates[0]?.boundary?.nonDeletingUpgrade === true
  && siteUpdates[0]?.boundary?.currentCountCleanup === true
  && siteUpdates[0]?.boundary?.authenticatedBrowserRawTelemetrySeparated === true
  && siteUpdates[0]?.boundary?.strictAnswerPdfProof === 'separate', siteUpdates[0] || {});

const gateCommands = roadmap.releaseGate?.commands || [];
check('roadmap and release gate point to Round575', roadmap.version === round575.version
  && roadmap.currentVersion === round575.version
  && roadmap.currentReleaseVersion === round575.version
  && roadmap.previousVersion === round575.previousVersion
  && roadmap.currentRound === 575
  && roadmap.lastIntegratedRound === 575
  && roadmap.releaseGate?.currentVersion === round575.version
  && roadmap.releaseGate?.expectedVersion === round575.version
  && roadmap.releaseGate?.currentRound === 575
  && roadmap.round575WorkbenchEntrancePolish === true
  && roadmap.round575CurrentCountCleanup === true
  && gateCommands.some((command) => command.includes('apply-round575-workbench-polish.mjs'))
  && gateCommands.some((command) => command.includes('check-round575-workbench-polish.mjs'))
  && gateCommands.some((command) => command.includes('check-round575-question-bank-home-visual.mjs'))
  && gateCommands.some((command) => command.includes(`--expected-version ${round575.version}`)), {
  currentRound: roadmap.currentRound,
  commands: gateCommands.slice(0, 8)
});

check('middleware edge versions are Round575', middleware.includes(`const EDGE_HOME_VERSION = '${round575.version}';`)
  && middleware.includes(`const EDGE_RUNTIME_JS_VERSION = '${round575.version}';`)
  && middleware.includes('Round575: compact pre-question-bank workbench entrance'), {});

check('question-bank-home carries the compact Round575 workbench and answer boundary', home.includes('<b>Round575</b>')
  && home.includes(round575.version)
  && home.includes('data-round575-workbench-polish="1"')
  && home.includes('data-round575-workbench-strip="1"')
  && home.includes('data-round575-workbench-rail="1"')
  && home.includes('fluid-round575-workbench-entrance-polish-ledger.json')
  && home.includes('181103 <strong>400/122</strong>')
  && home.includes('证 <strong>422/6</strong>')
  && home.includes('真 <strong>145</strong> / PDF <strong>0</strong>')
  && home.includes('这是站内参考推导补强，不是官方原卷逐字答案；strictAnswerPdfProof 仍为 0。')
  && home.includes('raw pageHealth 不等于未通过项'), {});

const mainEntryIndex = home.indexOf('class="round385-181103-main-entry"');
const flowRailIndex = home.indexOf('class="round573-flow-rail"');
const toolbarIndex = home.indexOf('class="toolbar toolbar-more"');
check('181103 main entry appears before rail and more-links toolbar', mainEntryIndex > 0
  && flowRailIndex > mainEntryIndex
  && toolbarIndex > flowRailIndex, { mainEntryIndex, flowRailIndex, toolbarIndex });

const statusPillCount = (home.match(/class="workbench-status-pill"/g) || []).length;
const topActionCount = (home.match(/<div class="workbench-topline__actions">[\s\S]*?<\/div>/)?.[0].match(/<a\b/g) || []).length;
check('topline is compact enough for mobile', statusPillCount === 3 && topActionCount === 3
  && home.includes('grid-template-columns: auto repeat(3, minmax(0, auto));')
  && home.includes('white-space: nowrap;')
  && home.includes('.proof-checklist dl')
  && home.includes('grid-template-columns: repeat(2, minmax(0, 1fr));'), { statusPillCount, topActionCount });

check('current knowledge entrances no longer show stale 381/141 or 390/132 counts',
  knowledge.includes('38 HTML · 522 sources · 400 practice · 400+0 answers · 122 leads')
  && knowledge.includes('400 道默认练习和 400+0 答案状态')
  && !/381\+0 answers|381 道默认练习|141 leads|141 条线索/.test(knowledge)
  && knowledgeUpgrade.includes('400 道默认练习题可直接看参考答案')
  && knowledgeUpgrade.includes('122 条源文线索只展示')
  && !/390 道默认练习题|132 条源文线索|522 张来源卡、390/.test(knowledgeUpgrade), {});

check('homepage and real-exam visible current labels are Round575', index.includes(`当前发布：Round575 · ${round575.version}`)
  && index.includes('Round575 题库入口压实')
  && indexComplete.includes(`当前发布 · ${round575.version}`)
  && indexCompleteDir.includes(`当前发布 · ${round575.version}`)
  && indexComplete.includes('不是官方原卷逐字答案；strictAnswerPdfProof 仍为 0')
  && indexCompleteDir.includes('不是官方原卷逐字答案；strictAnswerPdfProof 仍为 0')
  && realExam.includes(`当前版本：Round575 · ${round575.version}`), {});

const currentSurfaceFiles = [
  ['question-bank-home.html', home],
  ['index.html', index],
  ['index-complete.html', indexComplete],
  ['index-complete/index.html', indexCompleteDir],
  ['knowledge.html', knowledge],
  ['modules/knowledge-upgrade-2026.html', knowledgeUpgrade],
  ['modules/knowledge-detail.html', knowledgeDetail],
  ['modules/question-bank.html', questionBank],
  ['modules/real-exams-dynamic.html', realExam],
  ['teacher-panel.html', teacherPanel],
  ['teacher-panel/index.html', teacherPanelIndex],
  ['modules/teacher-panel.html', modulesTeacherPanel],
  ['modules/teacher-panel/index.html', modulesTeacherPanelIndex],
  ['functions/_middleware.js', middleware],
  ['js/core/local-mathjax.js', localMathjax],
  ['js/edge-fluid-learning-upgrade.js', edgeRuntime]
];

const surfaceScan = currentSurfaceFiles.map(([rel, text]) => ({
  rel,
  hasRound575: text.includes(round575.version),
  previousVersionHits: text.split(round575.previousVersion).length - 1
}));
check('current workbench surfaces use Round575 cache-bust rather than Round574 as current version',
  surfaceScan.every((row) => row.hasRound575 && row.previousVersionHits === 0), { rows: surfaceScan });

const report = {
  ok: checks.every((row) => row.pass),
  version: round575.version,
  generatedAt: new Date().toISOString(),
  checks
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
