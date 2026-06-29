#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round582 } from './round582-question-bank-home-polish-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round582-question-bank-home-polish-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round582 QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

function abs(rel) {
  return path.join(repoRoot, rel.replace(/^\/+/, ''));
}

function readText(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function gzipMatches(rel) {
  const text = readText(rel);
  const gz = zlib.gunzipSync(fs.readFileSync(abs(`${rel}.gz`))).toString('utf8');
  return text === gz;
}

function count(text, pattern) {
  if (typeof pattern === 'string') return text.split(pattern).length - 1;
  const match = text.match(pattern);
  return match ? match.length : 0;
}

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

const ledger = readJson('data/fluid-round582-question-bank-home-polish-ledger.json');
const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const homeHtml = readText('question-bank-home.html');
const questionBankHtml = readText('modules/question-bank.html');
const questionBankData = readText('modules/question-bank-data.js');
const indexHtml = readText('index.html');
const resourcesHtml = readText('resources.html');
const realExamsHtml = readText('modules/real-exams-dynamic.html');
const middleware = readText('functions/_middleware.js');
const legacyAuthGuards = [
  'auth-guard.js',
  'modules/auth-guard.js',
  'modules/js/security/auth-guard.js'
].map((rel) => readText(rel));

check('Round582 ledger is green, non-deleting, and content-neutral', ledger.ok === true
  && ledger.version === round582.version
  && ledger.previousVersion === round582.previousVersion
  && ledger.nonDeletingUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.changedQuestionBankContent === false
  && ledger.noRouteRemoved === true
  && ledger.noCountReduced === true
  && ledger.boundary?.cardFrontier === round582.previousVersion, {
  version: ledger.version,
  changedFiles: ledger.changedFiles?.length,
  idempotentChangedFiles: ledger.idempotentChangedFiles?.length,
  boundary: ledger.boundary
});

check('Round582 JSON gzip sidecars match', [
  'data/fluid-round582-question-bank-home-polish-ledger.json',
  'site-updates.json',
  'data/fluid-upgrade-roadmap-100.json'
].every(gzipMatches), {});

check('site updates and roadmap point to Round582', siteUpdates[0]?.version === round582.version
  && siteUpdates[0]?.boundary?.homePolishOnly === true
  && roadmap.version === round582.version
  && roadmap.currentVersion === round582.version
  && roadmap.currentReleaseVersion === round582.version
  && roadmap.currentRound === round582.round
  && roadmap.latestRelease?.version === round582.version
  && roadmap.releaseGate?.expectedVersion === round582.version
  && roadmap.release?.currentVersion === round582.version
  && roadmap.round582QuestionBankHomePolish === true, {
  siteTop: siteUpdates[0]?.version,
  roadmapVersion: roadmap.version,
  releaseCurrent: roadmap.release?.currentVersion
});

check('current edge, home, and question-bank surfaces expose Round582 version', middleware.includes(round582.version)
  && homeHtml.includes(round582.version)
  && questionBankHtml.includes(round582.version)
  && questionBankData.includes(round582.version)
  && indexHtml.includes(round582.version), {
  middleware: middleware.includes(round582.version),
  home: homeHtml.includes(round582.version),
  questionBank: questionBankHtml.includes(round582.version),
  questionBankData: questionBankData.includes(round582.version),
  index: indexHtml.includes(round582.version)
});

check('Round582 home polish is wired, not orphan CSS', round582.homePolishSelectors.every((snippet) => homeHtml.includes(snippet))
  && [
    '/* Round582 question-bank home polish */',
    'body[data-round582-home-polish-page="1"]',
    'workbench-summary.hero::before',
    'mobileMetricStripKeptVisible',
    'data-round582-primary-action="181103"'
  ].every((snippet) => homeHtml.includes(snippet) || JSON.stringify(ledger).includes(snippet)), {
  selectors: round582.homePolishSelectors
});

check('Round582 keeps entry content and route inventory intact', count(homeHtml, 'class="intent-link"') >= 12
  && count(homeHtml, 'class="card"') >= 6
  && count(homeHtml, '<div class="round351-mobile-shortcuts__grid">') === 1
  && count(homeHtml, '<div class="round385-181103-main-entry__actions"') === 1
  && homeHtml.includes('更多入口与更新')
  && homeHtml.includes('主入口分组：181103、历年真题、视频状态'), {
  intentLinks: count(homeHtml, 'class="intent-link"'),
  cards: count(homeHtml, 'class="card"')
});

check('legacy auth guards and current entry links use Round582 cache-bust', legacyAuthGuards.every((text) => text.includes(`const EDGE_REFRESH = '${round582.version}';`))
  && ![
    homeHtml,
    questionBankHtml,
    resourcesHtml,
    realExamsHtml,
    indexHtml,
    middleware
  ].join('\n').includes('round550-181103-proof-depth-upgrade-20260628')
  && ![
    homeHtml,
    questionBankHtml,
    resourcesHtml,
    realExamsHtml,
    indexHtml,
    middleware
  ].join('\n').includes('edge_refresh=round581-question-bank-card-polish-20260630')
  && [
    '/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=',
    './modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh='
  ].some((snippet) => [
    homeHtml,
    questionBankHtml,
    resourcesHtml,
    realExamsHtml,
    indexHtml,
    middleware
  ].join('\n').includes(`${snippet}${round582.version}`)), {});

check('counts and evidence boundaries remain unchanged', [
  '400 可参考',
  '122 条源文线索',
  '422 道',
  'Round577 二次重证 8 道',
  '163 深补',
  'strictAnswerPdfProof 仍为 0',
  'strictAnswerPdfProof=0'
].every((snippet) => homeHtml.includes(snippet) || questionBankHtml.includes(snippet))
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === round582.realExamAnswerDepthRows
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0
  && ledger.metrics?.proofDepthRows181103 === 422
  && ledger.metrics?.strictAnswerPdfProofRows === 0, {
  realExamAnswerDepthRows: siteUpdates[0]?.metrics?.realExamAnswerDepthRows,
  strictAnswerPdfProof: siteUpdates[0]?.metrics?.strictAnswerPdfProof
});

check('Round581 card polish remains present for the in-bank card', [
  '.qb-card--round581',
  'data-round581-card-polish="181103-readable-card"',
  'data-round581-answer-status-card="single-readable"',
  'data-round581-quality-chip-grid="1"'
].every((snippet) => questionBankHtml.includes(snippet) || questionBankData.includes(snippet)), {});

check('current visible surfaces do not carry stale deep-answer counts', !/(145 深补|153 深补|真题深度补答累计 145 道|381 练习|141 源文|132 条参考答案页|edge_refresh=round581-question-bank-card-polish-20260630)/.test([
  indexHtml,
  homeHtml,
  questionBankHtml,
  resourcesHtml,
  realExamsHtml
].join('\n')), {});

const payload = {
  ok: checks.every((row) => row.pass),
  version: round582.version,
  previousVersion: round582.previousVersion,
  generatedAt: new Date().toISOString(),
  checks
};

fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify(payload, null, 2));
if (!payload.ok) process.exit(1);
