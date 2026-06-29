#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round587 } from './round587-resource-hub-reader-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round587-resource-hub-reader-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round587 QA from /Volumes/mac_2T during lifs isolation.');
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
const ledger = readJson('data/fluid-round587-resource-hub-reader-ledger.json');
const resourcesHtml = readText('resources.html');
const index181103Html = readText('resources/fluid-181103-html/index.html');
const practiceHtml = readText('modules/practice-dynamic.html');
const realExamHtml = readText('modules/real-exams-dynamic.html');
const qbankHomeHtml = readText('question-bank-home.html');
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

check('Round587 ledger is green, UI-only, and content-neutral',
  ledger.ok === true
  && ledger.version === round587.version
  && ledger.previousVersion === round587.previousVersion
  && ledger.uiOnlyUpgrade === true
  && ledger.resourceHubReaderUpgrade === true
  && ledger.indexReaderDensityUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.changedQuestionBankContent === false
  && ledger.changedRealExamContent === false
  && ledger.noRouteRemoved === true
  && ledger.noCountReduced === true
  && ledger.boundary?.strictAnswerPdfProof === 'separate',
  { version: ledger.version, boundary: ledger.boundary });

check('Round587 JSON gzip sidecars match',
  [
    'data/fluid-round587-resource-hub-reader-ledger.json',
    'data/fluid-round433-real-exam-answer-coverage.json',
    'data/fluid-round462-ten-round-continuation-ledger.json',
    'data/fluid-upgrade-roadmap-100.json',
    'site-updates.json'
  ].every(gzipMatchesJson));

check('site updates and roadmap current gates point to Round587',
  siteUpdates[0]?.version === round587.version
  && siteUpdates[0]?.previousVersion === round587.previousVersion
  && roadmap.version === round587.version
  && roadmap.currentVersion === round587.version
  && roadmap.currentReleaseVersion === round587.version
  && roadmap.currentRound === round587.round
  && roadmap.latestRelease?.version === round587.version
  && roadmap.releaseGate?.currentVersion === round587.version
  && roadmap.releaseGate?.expectedVersion === round587.version
  && roadmap.releaseGate?.previousVersion === round587.previousVersion
  && roadmap.releaseGate?.currentRound === round587.round
  && roadmap.releaseGate?.lastIntegratedRound === round587.round
  && roadmap.release?.currentVersion === round587.version
  && roadmap.release?.currentRound === round587.round
  && roadmap.release?.expectedVersion === round587.version
  && roadmap.release?.lastIntegratedRound === round587.round
  && roadmap.round587ResourceHubReader === true,
  {
    siteTop: siteUpdates[0]?.version,
    roadmapVersion: roadmap.version,
    releaseGate: roadmap.releaseGate,
    release: roadmap.release
  });

check('Round587 content counts remain unchanged',
  ledger.metrics?.materialHtmlPages181103 === round587.materialHtmlPages181103
  && ledger.metrics?.sourceHtmlCards181103 === round587.sourceHtmlCards181103
  && ledger.metrics?.referencePracticeRows181103 === round587.referencePracticeRows181103
  && ledger.metrics?.sourceClueOnlyRows181103 === round587.sourceClueOnlyRows181103
  && ledger.metrics?.trustReferenceReadyRows181103 === round587.trustReferenceReadyRows181103
  && ledger.metrics?.trustSourceClueOnlyRows181103 === round587.trustSourceClueOnlyRows181103
  && ledger.metrics?.proofDepthRows181103 === round587.proofDepthRows181103
  && ledger.metrics?.proofDepthSecondPassRows181103 === round587.proofDepthSecondPassRows181103
  && ledger.metrics?.realExamAnswerDepthRows === round587.realExamAnswerDepthRows
  && ledger.metrics?.realExamOriginalAtomicRows === round587.realExamOriginalAtomicRows
  && ledger.metrics?.realExamSourceSections === round587.realExamSourceSections
  && ledger.metrics?.realExamGroupedSubquestions === round587.realExamGroupedSubquestions
  && ledger.metrics?.realExamDirectoryQuestionCount === round587.realExamDirectoryQuestionCount
  && ledger.metrics?.strictAnswerPdfProofRows === round587.strictAnswerPdfProofRows
  && siteUpdates[0]?.metrics?.referencePracticeRows === round587.referencePracticeRows181103
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === round587.sourceClueOnlyRows181103
  && siteUpdates[0]?.metrics?.proofDepthRows === round587.proofDepthRows181103
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === round587.realExamAnswerDepthRows
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === round587.strictAnswerPdfProofRows
  && bank181103.defaultPracticeQuestionCount === round587.referencePracticeRows181103
  && bank181103.questionCount === round587.sourceHtmlCards181103,
  { ledgerMetrics: ledger.metrics, siteMetrics: siteUpdates[0]?.metrics, bank181103 });

check('resources.html has Round587 route, metrics, and boundary markers',
  round587.resourceSelectors.every((snippet) => resourcesHtml.includes(snippet))
  && resourcesHtml.includes('资料路线先排清楚')
  && resourcesHtml.includes('38/38')
  && resourcesHtml.includes('522')
  && resourcesHtml.includes('400')
  && resourcesHtml.includes('122')
  && resourcesHtml.includes('422')
  && resourcesHtml.includes('strictAnswerPdfProof=0')
  && resourcesHtml.includes('/data/fluid-round587-resource-hub-reader-ledger.json')
  && resourcesHtml.includes(`edge_refresh=${round587.version}`),
  { selectors: round587.resourceSelectors });

check('181103 HTML index has Round587 route, metrics, and boundary markers',
  round587.indexSelectors.every((snippet) => index181103Html.includes(snippet))
  && index181103Html.includes('181103 HTML 资料路线')
  && index181103Html.includes('38/38')
  && index181103Html.includes('522/522')
  && index181103Html.includes('400')
  && index181103Html.includes('122')
  && index181103Html.includes('422')
  && index181103Html.includes('strictAnswerPdfProof=0')
  && index181103Html.includes('/data/fluid-round587-resource-hub-reader-ledger.json')
  && index181103Html.includes(`edge_refresh=${round587.version}`),
  { selectors: round587.indexSelectors });

check('current public surfaces expose Round587 version',
  [
    middleware,
    resourcesHtml,
    index181103Html,
    practiceHtml,
    realExamHtml,
    qbankHomeHtml,
    qbankHtml,
    qbankData,
    indexHtml,
    apiMeShell,
    ...authGuards
  ].every((text) => text.includes(round587.version)),
  {
    middleware: middleware.includes(round587.version),
    resources: resourcesHtml.includes(round587.version),
    htmlIndex181103: index181103Html.includes(round587.version),
    practice: practiceHtml.includes(round587.version),
    realExams: realExamHtml.includes(round587.version),
    home: qbankHomeHtml.includes(round587.version),
    qbank: qbankHtml.includes(round587.version),
    qbankData: qbankData.includes(round587.version),
    index: indexHtml.includes(round587.version),
    apiMeShell: apiMeShell.includes(round587.version),
    authGuards: authGuards.map((text) => text.includes(round587.version))
  });

check('real-exam answer support ledgers remain separated from strict PDF proof',
  answerCoverage.ok === true
  && answerCoverage.refreshedBy === round587.version
  && answerCoverage.summary?.withAnswer === round587.realExamDirectoryQuestionCount
  && answerCoverage.summary?.activeWithAnswer === round587.realExamOriginalAtomicRows
  && answerCoverage.summary?.withStrictAnswerPdfProof === 0
  && answerCoverage.acceptance?.visibleAnswerCoverageComplete === true
  && answerCoverage.acceptance?.userObjectiveComplete === false
  && answerContinuation.ok === true
  && answerContinuation.refreshedBy === round587.version
  && answerContinuation.summary?.answerBoundary?.strictAnswerPdfProof === 0
  && answerContinuation.summary?.answerBoundary?.answer181103?.['reference-answer-ready'] === round587.referencePracticeRows181103
  && answerContinuation.summary?.answerBoundary?.answer181103?.['source-clue-not-reference-answer'] === round587.sourceClueOnlyRows181103,
  {
    coverageSummary: answerCoverage.summary,
    continuationBoundary: answerContinuation.summary?.answerBoundary
  });

check('real-exam and practice answer boundaries remain visible after Round587 sync',
  realExamHtml.includes(round587.version)
  && practiceHtml.includes(round587.version)
  && [
    '325/325 原文小题',
    '68/68 组题已拆',
    '217 grouped 小题不合并',
    '163 道历年真题短答案',
    '答案显示：353/353',
    '答案 PDF 逐字证据：0/353',
    'strictAnswerPdfProof',
    '派生参考答案',
    '不等于官方逐字答案'
  ].every((snippet) => realExamHtml.includes(snippet))
  && [
    'data-round586-practice-answer-workbench="top"',
    'data-round586-practice-answer-boundary="comparison"',
    'data-round586-practice-answer-boundary="result"',
    'strictAnswerPdfProof=0'
  ].every((snippet) => practiceHtml.includes(snippet)));

check('38 material pages are synced to Round587',
  materialPages.length === round587.materialHtmlPages181103
  && materialPages.every((rel) => readText(rel).includes(round587.version)),
  { materialPages: materialPages.length, materialSubpagesSynced: ledger.materialSubpagesSynced });

check('resource route inventory was not deleted',
  (resourcesHtml.match(/round351-mobile-shortcuts/g) || []).length >= 2
  && (resourcesHtml.match(/round323-resource-finder__link/g) || []).length >= 5
  && (resourcesHtml.match(/round385-181103-main-entry__actions/g) || []).length >= 1
  && (index181103Html.match(/<article class="slide" data-round315-material-card/g) || []).length === round587.materialHtmlPages181103
  && index181103Html.includes('id="materialSearch"')
  && index181103Html.includes('data-filter-kind="all"'));

check('no stale current-version mismatch after Round587 sync',
  !/Round586\s*·\s*round587-resource-hub-reader-density-20260630/.test([
    resourcesHtml,
    index181103Html,
    practiceHtml,
    realExamHtml,
    qbankHomeHtml,
    qbankHtml,
    middleware
  ].join('\n'))
  && !/edge_refresh=round586-practice-answer-workbench-20260630/.test([
    resourcesHtml,
    index181103Html,
    practiceHtml,
    realExamHtml,
    qbankHomeHtml,
    qbankHtml,
    middleware,
    JSON.stringify(siteUpdates[0] || {})
  ].join('\n')));

const ok = checks.every((row) => row.pass);
const report = {
  ok,
  version: round587.version,
  previousVersion: round587.previousVersion,
  generatedAt: new Date().toISOString(),
  checks
};
fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);
