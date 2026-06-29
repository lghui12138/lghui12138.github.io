#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round584 } from './round584-question-bank-home-density-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round584-question-bank-home-density-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round584 QA from /Volumes/mac_2T during lifs isolation.');
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
const ledger = readJson('data/fluid-round584-question-bank-home-density-ledger.json');
const homeHtml = readText('question-bank-home.html');
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

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

check('Round584 ledger is green, UI-only, and content-neutral',
  ledger.ok === true
  && ledger.version === round584.version
  && ledger.previousVersion === round584.previousVersion
  && ledger.uiOnlyUpgrade === true
  && ledger.homeDensityUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.changedQuestionBankContent === false
  && ledger.noRouteRemoved === true
  && ledger.noCountReduced === true
  && ledger.boundary?.strictAnswerPdfProof === 'separate',
  { version: ledger.version, boundary: ledger.boundary });

check('Round584 JSON gzip sidecars match',
  [
    'data/fluid-round584-question-bank-home-density-ledger.json',
    'data/fluid-upgrade-roadmap-100.json',
    'site-updates.json'
  ].every(gzipMatchesJson));

check('site updates and roadmap current gates point to Round584',
  siteUpdates[0]?.version === round584.version
  && siteUpdates[0]?.previousVersion === round584.previousVersion
  && roadmap.version === round584.version
  && roadmap.currentVersion === round584.version
  && roadmap.currentReleaseVersion === round584.version
  && roadmap.currentRound === round584.round
  && roadmap.latestRelease?.version === round584.version
  && roadmap.releaseGate?.expectedVersion === round584.version
  && roadmap.release?.currentVersion === round584.version
  && roadmap.round584QuestionBankHomeDensity === true,
  {
    siteTop: siteUpdates[0]?.version,
    roadmapVersion: roadmap.version,
    commands: roadmap.releaseGate?.commands
  });

check('Round584 content counts remain unchanged from Round583',
  ledger.metrics?.materialHtmlPages181103 === round584.materialHtmlPages181103
  && ledger.metrics?.sourceHtmlCards181103 === round584.sourceHtmlCards181103
  && ledger.metrics?.referencePracticeRows181103 === round584.referencePracticeRows181103
  && ledger.metrics?.sourceClueOnlyRows181103 === round584.sourceClueOnlyRows181103
  && ledger.metrics?.proofDepthRows181103 === round584.proofDepthRows181103
  && ledger.metrics?.proofDepthSecondPassRows181103 === round584.proofDepthSecondPassRows181103
  && ledger.metrics?.realExamAnswerDepthRows === round584.realExamAnswerDepthRows
  && ledger.metrics?.realExamOriginalAtomicRows === round584.realExamOriginalAtomicRows
  && ledger.metrics?.groupedRealExamRows === round584.groupedRealExamRows
  && ledger.metrics?.strictAnswerPdfProofRows === round584.strictAnswerPdfProofRows
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === round584.realExamAnswerDepthRows
  && siteUpdates[0]?.metrics?.proofDepthRows === round584.proofDepthRows181103
  && siteUpdates[0]?.metrics?.referencePracticeRows === round584.referencePracticeRows181103
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === round584.sourceClueOnlyRows181103
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === round584.strictAnswerPdfProofRows,
  { ledgerMetrics: ledger.metrics, siteMetrics: siteUpdates[0]?.metrics });

check('question-bank-home has Round584 compact density markers',
  round584.homeDensitySelectors.every((snippet) => homeHtml.includes(snippet))
  && homeHtml.includes('Round584 在 Round583 交互可访问性基础上')
  && homeHtml.includes('入口首页密度升级'),
  { selectors: round584.homeDensitySelectors });

check('current public surfaces expose Round584 version',
  [
    middleware,
    homeHtml,
    qbankHtml,
    qbankData,
    indexHtml,
    apiMeShell,
    ...authGuards
  ].every((text) => text.includes(round584.version)),
  {
    middleware: middleware.includes(round584.version),
    home: homeHtml.includes(round584.version),
    qbank: qbankHtml.includes(round584.version),
    qbankData: qbankData.includes(round584.version),
    index: indexHtml.includes(round584.version),
    apiMeShell: apiMeShell.includes(round584.version),
    authGuards: authGuards.map((text) => text.includes(round584.version))
  });

check('visible content boundary strings remain current',
  [
    '400 可参考',
    '122 条源文线索',
    '422 道',
    'Round577 二次重证 8 道',
    '163 深补',
    'strictAnswerPdfProof 仍为 0',
    'strictAnswerPdfProof=0',
    '不是官方原卷逐字答案'
  ].every((snippet) => [homeHtml, qbankHtml, siteUpdates[0]?.summary || ''].join('\n').includes(snippet))
  && !/(145 深补|153 深补|真题深度补答累计 145|381 练习|141 源文|132 条参考答案页)/.test(homeHtml));

check('38 material pages are synced to Round584',
  materialPages.length === round584.materialHtmlPages181103
  && materialPages.every((rel) => readText(rel).includes(round584.version)),
  { materialPages: materialPages.length, materialSubpagesSynced: ledger.materialSubpagesSynced });

check('Round584 home density does not hide or delete route inventory',
  (homeHtml.match(/class="intent-link"/g) || []).length >= 12
  && (homeHtml.match(/class="card"/g) || []).length >= 6
  && (homeHtml.match(/round573-flow-rail/g) || []).length >= 2
  && (homeHtml.match(/round351-mobile-shortcuts/g) || []).length >= 2
  && (homeHtml.match(/summary-actions/g) || []).length >= 2);

const ok = checks.every((row) => row.pass);
const report = {
  ok,
  version: round584.version,
  previousVersion: round584.previousVersion,
  generatedAt: new Date().toISOString(),
  checks
};
fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);
