#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round586 } from './round586-practice-answer-workbench-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round586-practice-answer-workbench-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round586 QA from /Volumes/mac_2T during lifs isolation.');
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
const ledger = readJson('data/fluid-round586-practice-answer-workbench-ledger.json');
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

check('Round586 ledger is green, UI-only, and content-neutral',
  ledger.ok === true
  && ledger.version === round586.version
  && ledger.previousVersion === round586.previousVersion
  && ledger.uiOnlyUpgrade === true
  && ledger.practiceAnswerWorkbenchUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.changedQuestionBankContent === false
  && ledger.changedRealExamContent === false
  && ledger.noRouteRemoved === true
  && ledger.noCountReduced === true
  && ledger.boundary?.strictAnswerPdfProof === 'separate',
  { version: ledger.version, boundary: ledger.boundary });

check('Round586 JSON gzip sidecars match',
  [
    'data/fluid-round586-practice-answer-workbench-ledger.json',
    'data/fluid-round433-real-exam-answer-coverage.json',
    'data/fluid-round462-ten-round-continuation-ledger.json',
    'data/fluid-upgrade-roadmap-100.json',
    'site-updates.json'
  ].every(gzipMatchesJson));

check('site updates and roadmap current gates point to Round586',
  siteUpdates[0]?.version === round586.version
  && siteUpdates[0]?.previousVersion === round586.previousVersion
  && roadmap.version === round586.version
  && roadmap.currentVersion === round586.version
  && roadmap.currentReleaseVersion === round586.version
  && roadmap.currentRound === round586.round
  && roadmap.latestRelease?.version === round586.version
  && roadmap.releaseGate?.currentVersion === round586.version
  && roadmap.releaseGate?.expectedVersion === round586.version
  && roadmap.releaseGate?.previousVersion === round586.previousVersion
  && roadmap.releaseGate?.currentRound === round586.round
  && roadmap.releaseGate?.lastIntegratedRound === round586.round
  && roadmap.release?.currentVersion === round586.version
  && roadmap.release?.currentRound === round586.round
  && roadmap.release?.expectedVersion === round586.version
  && roadmap.release?.lastIntegratedRound === round586.round
  && roadmap.round586PracticeAnswerWorkbench === true,
  {
    siteTop: siteUpdates[0]?.version,
    roadmapVersion: roadmap.version,
    releaseGate: roadmap.releaseGate,
    release: roadmap.release
  });

check('Round586 content counts remain unchanged',
  ledger.metrics?.materialHtmlPages181103 === round586.materialHtmlPages181103
  && ledger.metrics?.sourceHtmlCards181103 === round586.sourceHtmlCards181103
  && ledger.metrics?.referencePracticeRows181103 === round586.referencePracticeRows181103
  && ledger.metrics?.sourceClueOnlyRows181103 === round586.sourceClueOnlyRows181103
  && ledger.metrics?.trustReferenceReadyRows181103 === round586.trustReferenceReadyRows181103
  && ledger.metrics?.trustSourceClueOnlyRows181103 === round586.trustSourceClueOnlyRows181103
  && ledger.metrics?.proofDepthRows181103 === round586.proofDepthRows181103
  && ledger.metrics?.proofDepthSecondPassRows181103 === round586.proofDepthSecondPassRows181103
  && ledger.metrics?.realExamAnswerDepthRows === round586.realExamAnswerDepthRows
  && ledger.metrics?.realExamOriginalAtomicRows === round586.realExamOriginalAtomicRows
  && ledger.metrics?.realExamSourceSections === round586.realExamSourceSections
  && ledger.metrics?.realExamGroupedSubquestions === round586.realExamGroupedSubquestions
  && ledger.metrics?.realExamDirectoryQuestionCount === round586.realExamDirectoryQuestionCount
  && ledger.metrics?.strictAnswerPdfProofRows === round586.strictAnswerPdfProofRows
  && siteUpdates[0]?.metrics?.referencePracticeRows === round586.referencePracticeRows181103
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === round586.sourceClueOnlyRows181103
  && siteUpdates[0]?.metrics?.proofDepthRows === round586.proofDepthRows181103
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === round586.realExamAnswerDepthRows
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === round586.strictAnswerPdfProofRows
  && bank181103.defaultPracticeQuestionCount === round586.referencePracticeRows181103
  && bank181103.questionCount === round586.sourceHtmlCards181103,
  { ledgerMetrics: ledger.metrics, siteMetrics: siteUpdates[0]?.metrics, bank181103 });

check('practice page has Round586 workbench markers and answer boundary strips',
  round586.practiceAnswerSelectors.every((snippet) => practiceHtml.includes(snippet))
  && practiceHtml.includes('Round586 刷题答案工作台')
  && practiceHtml.includes('参考答案</b>先核对条件、方程和结论')
  && practiceHtml.includes('证明题</b>必须看推导链')
  && practiceHtml.includes('strictAnswerPdfProof=0')
  && practiceHtml.includes('data-round586-practice-answer-boundary="181103"')
  && practiceHtml.includes('material-reference-panel')
  && practiceHtml.includes('question.answerHtml || question.answer ||'),
  { selectors: round586.practiceAnswerSelectors });

check('practice page preserves existing answer/reference anchors',
  [
    '.question-card',
    '.answer-comparison',
    '.result-display',
    '.material-reference-panel',
    'data-181103-reference-panel',
    'data-181103-reference-answer-html',
    'data-181103-reference-explanation',
    'data-181103-reference-source-evidence',
    "card.querySelector('.answer-comparison') || card.querySelector('.result-display')",
    "new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true })"
  ].every((snippet) => practiceHtml.includes(snippet)));

check('current public surfaces expose Round586 version',
  [
    middleware,
    practiceHtml,
    realExamHtml,
    qbankHomeHtml,
    qbankHtml,
    qbankData,
    indexHtml,
    apiMeShell,
    ...authGuards
  ].every((text) => text.includes(round586.version)),
  {
    middleware: middleware.includes(round586.version),
    practice: practiceHtml.includes(round586.version),
    realExams: realExamHtml.includes(round586.version),
    home: qbankHomeHtml.includes(round586.version),
    qbank: qbankHtml.includes(round586.version),
    qbankData: qbankData.includes(round586.version),
    index: indexHtml.includes(round586.version),
    apiMeShell: apiMeShell.includes(round586.version),
    authGuards: authGuards.map((text) => text.includes(round586.version))
  });

check('real-exam answer support ledgers remain separated from strict PDF proof',
  answerCoverage.ok === true
  && answerCoverage.refreshedBy === round586.version
  && answerCoverage.summary?.withAnswer === round586.realExamDirectoryQuestionCount
  && answerCoverage.summary?.activeWithAnswer === round586.realExamOriginalAtomicRows
  && answerCoverage.summary?.withStrictAnswerPdfProof === 0
  && answerCoverage.acceptance?.visibleAnswerCoverageComplete === true
  && answerCoverage.acceptance?.userObjectiveComplete === false
  && answerContinuation.ok === true
  && answerContinuation.refreshedBy === round586.version
  && answerContinuation.summary?.answerBoundary?.strictAnswerPdfProof === 0
  && answerContinuation.summary?.answerBoundary?.answer181103?.['reference-answer-ready'] === round586.referencePracticeRows181103
  && answerContinuation.summary?.answerBoundary?.answer181103?.['source-clue-not-reference-answer'] === round586.sourceClueOnlyRows181103,
  {
    coverageSummary: answerCoverage.summary,
    continuationBoundary: answerContinuation.summary?.answerBoundary
  });

check('real-exam page still exposes Round585 answer/source boundary content under Round586 version sync',
  realExamHtml.includes(round586.version)
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
  ].every((snippet) => realExamHtml.includes(snippet)));

check('38 material pages are synced to Round586',
  materialPages.length === round586.materialHtmlPages181103
  && materialPages.every((rel) => readText(rel).includes(round586.version)),
  { materialPages: materialPages.length, materialSubpagesSynced: ledger.materialSubpagesSynced });

check('no stale current-version mismatch after Round586 sync',
  !/Round585\s*·\s*round586-practice-answer-workbench-20260630/.test([
    practiceHtml,
    realExamHtml,
    qbankHomeHtml,
    qbankHtml,
    middleware
  ].join('\n'))
  && !/edge_refresh=round585-real-exam-workbench-density-20260630/.test([
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
  version: round586.version,
  previousVersion: round586.previousVersion,
  generatedAt: new Date().toISOString(),
  checks
};
fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);
