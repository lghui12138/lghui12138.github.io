#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round588 } from './round588-question-bank-home-conductor-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round588-question-bank-home-conductor-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round588 QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

function readText(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function gzipMatchesJson(rel) {
  const json = Buffer.from(readText(rel));
  const gz = fs.readFileSync(path.join(repoRoot, `${rel}.gz`));
  return zlib.gunzipSync(gz).equals(json);
}

function walkMaterialPages() {
  const dir = path.join(repoRoot, 'resources/fluid-181103-html/materials');
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile() && entry.name === 'index.html') out.push(path.relative(repoRoot, full));
    }
  }
  return out.sort();
}

const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const ledger = readJson('data/fluid-round588-question-bank-home-conductor-ledger.json');
const homeHtml = readText('question-bank-home.html');
const resourcesHtml = readText('resources.html');
const index181103Html = readText('resources/fluid-181103-html/index.html');
const practiceHtml = readText('modules/practice-dynamic.html');
const realExamHtml = readText('modules/real-exams-dynamic.html');
const qbankHtml = readText('modules/question-bank.html');
const qbankData = readText('modules/question-bank-data.js');
const middleware = readText('functions/_middleware.js');
const indexHtml = readText('index.html');
const apiMeShell = readText('api/auth/me/index.html');
const authGuards = [
  readText('auth-guard.js'),
  readText('modules/auth-guard.js'),
  readText('modules/js/security/auth-guard.js')
];
const materialPages = walkMaterialPages();
const answerCoverage = readJson('data/fluid-round433-real-exam-answer-coverage.json');
const answerContinuation = readJson('data/fluid-round462-ten-round-continuation-ledger.json');
const questionBankIndex = readJson('question-banks/index.json');
const bank181103 = questionBankIndex.questionBanks.find((row) => row.id === '181103-material-extracted') || {};

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

check('Round588 ledger is green, UI-only, and content-neutral',
  ledger.ok === true
  && ledger.version === round588.version
  && ledger.previousVersion === round588.previousVersion
  && ledger.uiOnlyUpgrade === true
  && ledger.questionBankHomeRouteConductorUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.changedQuestionBankContent === false
  && ledger.changedRealExamContent === false
  && ledger.noRouteRemoved === true
  && ledger.noCountReduced === true
  && ledger.boundary?.strictAnswerPdfProof === 'separate',
  { version: ledger.version, boundary: ledger.boundary });

check('Round588 JSON gzip sidecars match',
  [
    'data/fluid-round588-question-bank-home-conductor-ledger.json',
    'data/fluid-round433-real-exam-answer-coverage.json',
    'data/fluid-round462-ten-round-continuation-ledger.json',
    'data/fluid-upgrade-roadmap-100.json',
    'site-updates.json'
  ].every(gzipMatchesJson));

check('site updates and roadmap current gates point to Round588',
  siteUpdates[0]?.version === round588.version
  && siteUpdates[0]?.previousVersion === round588.previousVersion
  && roadmap.version === round588.version
  && roadmap.currentVersion === round588.version
  && roadmap.currentReleaseVersion === round588.version
  && roadmap.currentRound === round588.round
  && roadmap.latestRelease?.version === round588.version
  && roadmap.releaseGate?.currentVersion === round588.version
  && roadmap.releaseGate?.expectedVersion === round588.version
  && roadmap.releaseGate?.previousVersion === round588.previousVersion
  && roadmap.releaseGate?.currentRound === round588.round
  && roadmap.releaseGate?.lastIntegratedRound === round588.round
  && roadmap.release?.currentVersion === round588.version
  && roadmap.release?.currentRound === round588.round
  && roadmap.release?.expectedVersion === round588.version
  && roadmap.release?.lastIntegratedRound === round588.round
  && roadmap.round588QuestionBankHomeConductor === true,
  { siteTop: siteUpdates[0]?.version, roadmapVersion: roadmap.version, releaseGate: roadmap.releaseGate });

check('Round588 content counts remain unchanged',
  ledger.metrics?.materialHtmlPages181103 === round588.materialHtmlPages181103
  && ledger.metrics?.sourceHtmlCards181103 === round588.sourceHtmlCards181103
  && ledger.metrics?.referencePracticeRows181103 === round588.referencePracticeRows181103
  && ledger.metrics?.sourceClueOnlyRows181103 === round588.sourceClueOnlyRows181103
  && ledger.metrics?.trustReferenceReadyRows181103 === round588.trustReferenceReadyRows181103
  && ledger.metrics?.trustSourceClueOnlyRows181103 === round588.trustSourceClueOnlyRows181103
  && ledger.metrics?.proofDepthRows181103 === round588.proofDepthRows181103
  && ledger.metrics?.proofDepthSecondPassRows181103 === round588.proofDepthSecondPassRows181103
  && ledger.metrics?.realExamAnswerDepthRows === round588.realExamAnswerDepthRows
  && ledger.metrics?.realExamOriginalAtomicRows === round588.realExamOriginalAtomicRows
  && ledger.metrics?.realExamDirectoryQuestionCount === round588.realExamDirectoryQuestionCount
  && ledger.metrics?.strictAnswerPdfProofRows === round588.strictAnswerPdfProofRows
  && siteUpdates[0]?.metrics?.referencePracticeRows === round588.referencePracticeRows181103
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === round588.sourceClueOnlyRows181103
  && siteUpdates[0]?.metrics?.proofDepthRows === round588.proofDepthRows181103
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === round588.realExamAnswerDepthRows
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === round588.strictAnswerPdfProofRows
  && bank181103.defaultPracticeQuestionCount === round588.referencePracticeRows181103
  && bank181103.questionCount === round588.sourceHtmlCards181103,
  { ledgerMetrics: ledger.metrics, siteMetrics: siteUpdates[0]?.metrics, bank181103 });

check('question-bank-home has Round588 route conductor markers',
  round588.homeSelectors.every((snippet) => homeHtml.includes(snippet))
  && homeHtml.includes('Round588')
  && homeHtml.includes('入口路线指挥台')
  && homeHtml.includes('当前入口只做路线和显示升级')
  && homeHtml.includes('/data/fluid-round588-question-bank-home-conductor-ledger.json')
  && homeHtml.includes(`edge_refresh=${round588.version}`)
  && !homeHtml.includes('<b>Round584</b><span>入口首页密度升级</span>')
  && !homeHtml.includes('Round584 在 Round583'),
  { selectors: round588.homeSelectors });

check('visible content boundary strings remain current',
  [
    '400/122',
    '422/8',
    '353/163',
    'strict 0',
    '400 可参考',
    '122 条源文线索',
    '422 道',
    'Round577 二次重证 8 道',
    '163 深补',
    'strictAnswerPdfProof 仍为 0',
    'strictAnswerPdfProof=0',
    '不是官方原卷逐字答案'
  ].every((snippet) => homeHtml.includes(snippet))
  && !/(145 深补|153 深补|真题深度补答累计 145|381 练习|141 源文|132 条参考答案页)/.test(homeHtml));

check('Round588 keeps entrance, trust, proof-depth, and strict PDF layers separate',
  siteUpdates[0]?.summary?.includes('入口 400/122')
  && siteUpdates[0]?.summary?.includes('trust 422/100')
  && siteUpdates[0]?.summary?.includes('proof-depth 422/8')
  && !siteUpdates[0]?.summary?.includes('proof-depth 422/100')
  && homeHtml.includes('入口 400/122、trust 422/100、proof-depth 422/8')
  && qbankHtml.includes('data-round588-route-conductor="module-entry"')
  && qbankHtml.includes('trust 422/100')
  && qbankHtml.includes('proof-depth 422/8')
  && qbankHtml.includes('strictAnswerPdfProof=0'),
  { summary: siteUpdates[0]?.summary });

check('current public surfaces expose Round588 version',
  [
    middleware,
    homeHtml,
    resourcesHtml,
    index181103Html,
    practiceHtml,
    realExamHtml,
    qbankHtml,
    qbankData,
    indexHtml,
    apiMeShell,
    ...authGuards
  ].every((text) => text.includes(round588.version)),
  {
    middleware: middleware.includes(round588.version),
    home: homeHtml.includes(round588.version),
    resources: resourcesHtml.includes(round588.version),
    htmlIndex181103: index181103Html.includes(round588.version),
    practice: practiceHtml.includes(round588.version),
    realExams: realExamHtml.includes(round588.version),
    qbank: qbankHtml.includes(round588.version),
    qbankData: qbankData.includes(round588.version),
    index: indexHtml.includes(round588.version),
    apiMeShell: apiMeShell.includes(round588.version),
    authGuards: authGuards.map((text) => text.includes(round588.version))
  });

check('real-exam answer support ledgers remain separated from strict PDF proof',
  answerCoverage.ok === true
  && answerCoverage.refreshedBy === round588.version
  && answerCoverage.summary?.withAnswer === round588.realExamDirectoryQuestionCount
  && answerCoverage.summary?.activeWithAnswer === round588.realExamOriginalAtomicRows
  && answerCoverage.summary?.withStrictAnswerPdfProof === 0
  && answerCoverage.acceptance?.visibleAnswerCoverageComplete === true
  && answerCoverage.acceptance?.userObjectiveComplete === false
  && answerContinuation.ok === true
  && answerContinuation.refreshedBy === round588.version
  && answerContinuation.summary?.answerBoundary?.strictAnswerPdfProof === 0,
  { coverageSummary: answerCoverage.summary, continuationBoundary: answerContinuation.summary?.answerBoundary });

check('question-banks index carries Round588 route conductor without changing counts',
  questionBankIndex.currentEntryVersion === round588.version
  && questionBankIndex.round588RouteConductorVersion === round588.version
  && questionBankIndex.summary?.round588RouteConductorVersion === round588.version
  && questionBankIndex.summary?.material181103DefaultPracticeQuestionCount === round588.referencePracticeRows181103
  && questionBankIndex.summary?.material181103SourceContentCardCount === round588.sourceClueOnlyRows181103
  && bank181103.currentEntryVersion === round588.version
  && bank181103.round588RouteConductorVersion === round588.version
  && bank181103.readyReferenceRows === round588.referencePracticeRows181103
  && bank181103.sourceClueRows === round588.sourceClueOnlyRows181103
  && bank181103.strictAnswerPdfProofRows === round588.strictAnswerPdfProofRows,
  { indexVersion: questionBankIndex.currentEntryVersion, bank181103 });

check('home route inventory was not deleted',
  (homeHtml.match(/class="summary-actions"/g) || []).length >= 1
  && (homeHtml.match(/class="intent-link"/g) || []).length >= 12
  && (homeHtml.match(/class="card"/g) || []).length >= 6
  && (homeHtml.match(/round573-flow-rail/g) || []).length >= 2
  && (homeHtml.match(/round351-mobile-shortcuts/g) || []).length >= 2
  && (homeHtml.match(/round385-181103-main-entry__actions/g) || []).length >= 1);

check('38 material pages are synced to Round588',
  materialPages.length === round588.materialHtmlPages181103
  && materialPages.every((rel) => readText(rel).includes(round588.version)),
  { materialPages: materialPages.length, materialSubpagesSynced: ledger.materialSubpagesSynced });

check('no stale current-version mismatch after Round588 sync',
  !/Round587\s*·\s*round588-question-bank-home-conductor-20260630/.test([
    homeHtml,
    resourcesHtml,
    index181103Html,
    practiceHtml,
    realExamHtml,
    qbankHtml,
    qbankData,
    middleware
  ].join('\n')));

const ok = checks.every((row) => row.pass);
const report = {
  ok,
  version: round588.version,
  previousVersion: round588.previousVersion,
  generatedAt: new Date().toISOString(),
  checks
};
fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);
