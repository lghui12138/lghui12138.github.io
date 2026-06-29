#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round585 } from './round585-real-exam-workbench-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round585-real-exam-workbench-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round585 QA from /Volumes/mac_2T during lifs isolation.');
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
const ledger = readJson('data/fluid-round585-real-exam-workbench-ledger.json');
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

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

check('Round585 ledger is green, UI-only, and content-neutral',
  ledger.ok === true
  && ledger.version === round585.version
  && ledger.previousVersion === round585.previousVersion
  && ledger.uiOnlyUpgrade === true
  && ledger.realExamWorkbenchDensityUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.changedQuestionBankContent === false
  && ledger.noRouteRemoved === true
  && ledger.noCountReduced === true
  && ledger.boundary?.strictAnswerPdfProof === 'separate',
  { version: ledger.version, boundary: ledger.boundary });

check('Round585 JSON gzip sidecars match',
  [
    'data/fluid-round585-real-exam-workbench-ledger.json',
    'data/fluid-round433-real-exam-answer-coverage.json',
    'data/fluid-round462-ten-round-continuation-ledger.json',
    'data/fluid-upgrade-roadmap-100.json',
    'site-updates.json'
  ].every(gzipMatchesJson));

check('site updates and roadmap current gates point to Round585',
  siteUpdates[0]?.version === round585.version
  && siteUpdates[0]?.previousVersion === round585.previousVersion
  && roadmap.version === round585.version
  && roadmap.currentVersion === round585.version
  && roadmap.currentReleaseVersion === round585.version
  && roadmap.currentRound === round585.round
  && roadmap.latestRelease?.version === round585.version
  && roadmap.releaseGate?.expectedVersion === round585.version
  && roadmap.release?.currentVersion === round585.version
  && roadmap.round585RealExamWorkbenchDensity === true,
  {
    siteTop: siteUpdates[0]?.version,
    roadmapVersion: roadmap.version,
    commands: roadmap.releaseGate?.commands
  });

check('Round585 content counts remain unchanged from Round584',
  ledger.metrics?.materialHtmlPages181103 === round585.materialHtmlPages181103
  && ledger.metrics?.sourceHtmlCards181103 === round585.sourceHtmlCards181103
  && ledger.metrics?.referencePracticeRows181103 === round585.referencePracticeRows181103
  && ledger.metrics?.sourceClueOnlyRows181103 === round585.sourceClueOnlyRows181103
  && ledger.metrics?.proofDepthRows181103 === round585.proofDepthRows181103
  && ledger.metrics?.proofDepthSecondPassRows181103 === round585.proofDepthSecondPassRows181103
  && ledger.metrics?.realExamAnswerDepthRows === round585.realExamAnswerDepthRows
  && ledger.metrics?.realExamOriginalAtomicRows === round585.realExamOriginalAtomicRows
  && ledger.metrics?.realExamSourceSections === round585.realExamSourceSections
  && ledger.metrics?.realExamGroupedSubquestions === round585.realExamGroupedSubquestions
  && ledger.metrics?.strictAnswerPdfProofRows === round585.strictAnswerPdfProofRows
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === round585.realExamAnswerDepthRows
  && siteUpdates[0]?.metrics?.realExamOriginalAtomicRows === round585.realExamOriginalAtomicRows
  && siteUpdates[0]?.metrics?.realExamSourceSections === round585.realExamSourceSections
  && siteUpdates[0]?.metrics?.realExamGroupedSubquestions === round585.realExamGroupedSubquestions
  && siteUpdates[0]?.metrics?.proofDepthRows === round585.proofDepthRows181103
  && siteUpdates[0]?.metrics?.referencePracticeRows === round585.referencePracticeRows181103
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === round585.sourceClueOnlyRows181103
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === round585.strictAnswerPdfProofRows,
  { ledgerMetrics: ledger.metrics, siteMetrics: siteUpdates[0]?.metrics });

check('real-exams page has Round585 workbench markers',
  round585.realExamSelectors.every((snippet) => realExamHtml.includes(snippet))
  && realExamHtml.includes('Round585 真题工作台')
  && realExamHtml.includes('Round585 先做真实真题')
  && realExamHtml.includes('Round585 真题直达'),
  { selectors: round585.realExamSelectors });

check('current public surfaces expose Round585 version',
  [
    middleware,
    realExamHtml,
    qbankHomeHtml,
    qbankHtml,
    qbankData,
    indexHtml,
    apiMeShell,
    ...authGuards
  ].every((text) => text.includes(round585.version)),
  {
    middleware: middleware.includes(round585.version),
    realExams: realExamHtml.includes(round585.version),
    home: qbankHomeHtml.includes(round585.version),
    qbank: qbankHtml.includes(round585.version),
    qbankData: qbankData.includes(round585.version),
    index: indexHtml.includes(round585.version),
    apiMeShell: apiMeShell.includes(round585.version),
    authGuards: authGuards.map((text) => text.includes(round585.version))
  });

check('real-exam answer and proof boundaries remain visible and separated',
  [
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
  && !/(145 深补|153 深补|真题深度补答累计 145|381 练习|141 源文|132 条参考答案页)/.test(realExamHtml));

check('Round585 support ledgers make real-exam answer panels load without overclaiming strict proof',
  answerCoverage.ok === true
  && answerCoverage.refreshedBy === round585.version
  && answerCoverage.summary?.withAnswer === 353
  && answerCoverage.summary?.activeWithAnswer === 325
  && answerCoverage.summary?.withStrictAnswerPdfProof === 0
  && answerCoverage.acceptance?.visibleAnswerCoverageComplete === true
  && answerCoverage.acceptance?.userObjectiveComplete === false
  && answerContinuation.ok === true
  && answerContinuation.refreshedBy === round585.version
  && answerContinuation.summary?.answerBoundary?.strictAnswerPdfProof === 0
  && answerContinuation.summary?.answerBoundary?.answer181103?.['reference-answer-ready'] === 400
  && answerContinuation.summary?.answerBoundary?.answer181103?.['source-clue-not-reference-answer'] === 122,
  {
    coverageSummary: answerCoverage.summary,
    continuationBoundary: answerContinuation.summary?.answerBoundary
  });

check('Round585 real-exam route inventory preserved',
  (realExamHtml.match(/round585-real-exam-workbench__actions/g) || []).length >= 1
  && (realExamHtml.match(/class="round302-audit/g) || []).length >= 6
  && (realExamHtml.match(/class="fidelity-note/g) || []).length >= 3
  && (realExamHtml.match(/href="#cards"/g) || []).length >= 3
  && (realExamHtml.match(/href="#sourceGranularityNote"/g) || []).length >= 5
  && (realExamHtml.match(/href="#answerEvidenceBoundaryNote"/g) || []).length >= 2,
  {
    workbenchActions: (realExamHtml.match(/round585-real-exam-workbench__actions/g) || []).length,
    auditBlocks: (realExamHtml.match(/class="round302-audit/g) || []).length,
    fidelityNotes: (realExamHtml.match(/class="fidelity-note/g) || []).length
  });

check('38 material pages are synced to Round585',
  materialPages.length === round585.materialHtmlPages181103
  && materialPages.every((rel) => readText(rel).includes(round585.version)),
  { materialPages: materialPages.length, materialSubpagesSynced: ledger.materialSubpagesSynced });

check('no stale current-version mismatch after Round585 sync',
  !/Round584\s*·\s*round585-real-exam-workbench-density-20260630/.test([
    realExamHtml,
    qbankHomeHtml,
    qbankHtml,
    middleware
  ].join('\n'))
  && !/edge_refresh=round584-question-bank-home-density-20260630/.test([
    realExamHtml,
    qbankHomeHtml,
    qbankHtml,
    middleware
  ].join('\n')));

const ok = checks.every((row) => row.pass);
const report = {
  ok,
  version: round585.version,
  previousVersion: round585.previousVersion,
  generatedAt: new Date().toISOString(),
  checks
};
fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);
