#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round581 } from './round581-question-bank-card-polish-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round581-question-bank-card-polish-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round581 QA from /Volumes/mac_2T during lifs isolation.');
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

function count(text, snippet) {
  return text.split(snippet).length - 1;
}

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

const ledger = readJson('data/fluid-round581-question-bank-card-polish-ledger.json');
const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const questionBankHtml = readText('modules/question-bank.html');
const questionBankData = readText('modules/question-bank-data.js');
const homeHtml = readText('question-bank-home.html');
const indexHtml = readText('index.html');
const middleware = readText('functions/_middleware.js');

check('Round581 ledger is green, non-deleting, and content-neutral', ledger.ok === true
  && ledger.version === round581.version
  && ledger.previousVersion === round581.previousVersion
  && ledger.nonDeletingUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.boundary?.contentFrontier === 'round579-real-exam-answer-depth-twelfth-pass-20260629', {
  version: ledger.version,
  changedFiles: ledger.changedFiles?.length,
  contentFrontier: ledger.boundary?.contentFrontier
});

check('Round581 JSON gzip sidecars match', [
  'data/fluid-round581-question-bank-card-polish-ledger.json',
  'site-updates.json',
  'data/fluid-upgrade-roadmap-100.json'
].every(gzipMatches), {});

check('site updates and roadmap point to Round581', siteUpdates[0]?.version === round581.version
  && roadmap.version === round581.version
  && roadmap.currentVersion === round581.version
  && roadmap.currentReleaseVersion === round581.version
  && roadmap.currentRound === round581.round
  && roadmap.latestRelease?.version === round581.version
  && roadmap.releaseGate?.expectedVersion === round581.version
  && roadmap.release?.currentVersion === round581.version
  && roadmap.round581QuestionBankCardPolish === true, {
  siteTop: siteUpdates[0]?.version,
  roadmapVersion: roadmap.version,
  releaseCurrent: roadmap.release?.currentVersion
});

check('current edge, home, and question-bank surfaces expose Round581 version', middleware.includes(round581.version)
  && homeHtml.includes(round581.version)
  && questionBankHtml.includes(round581.version)
  && questionBankData.includes(round581.version)
  && indexHtml.includes(round581.version), {
  middleware: middleware.includes(round581.version),
  home: homeHtml.includes(round581.version),
  questionBank: questionBankHtml.includes(round581.version),
  questionBankData: questionBankData.includes(round581.version),
  index: indexHtml.includes(round581.version)
});

check('Round581 card polish is wired, not orphan CSS', [
  '.qb-card--round581',
  '.qb-chip-grid',
  '.qb-ledger-line',
  '[data-round581-card-polish="static-readable-card"]',
  '[data-round581-card-polish="watchdog-readable-card"]'
].every((snippet) => questionBankHtml.includes(snippet))
  && [
    'qb-card qb-card--round581 qb-card--181103',
    'data-round581-card-polish="181103-readable-card"',
    'data-round581-answer-status-card="single-readable"',
    'data-round581-quality-chip-grid="1"',
    'qb-card-title',
    'qb-card-subtitle',
    'qb-card-desc'
  ].every((snippet) => questionBankData.includes(snippet))
  && !questionBankHtml.includes('[class*="-card"]'), {});

check('181103 answer status is unique in dynamic card template', count(questionBankData, 'data-round428-181103-answer-status-card="1"') === 1
  && count(questionBankData, 'data-round581-answer-status-card="single-readable"') === 1
  && count(questionBankData, '${answerStatusSummary}') === 1
  && count(questionBankData, 'data-round428-answer-status-action="current"') === 1
  && questionBankData.includes('edge_refresh=${practiceModuleVersion}'), {
  answerStatusCards: count(questionBankData, 'data-round428-181103-answer-status-card="1"'),
  answerStatusInsertions: count(questionBankData, '${answerStatusSummary}')
});

check('mobile wrapping and touch contract is codified', [
  '#questionBanksList .qb-card--round581{gap:0;padding:0',
  'min-width:0',
  '#questionBanksList .qb-card--round581 .qb-card-actions{grid-template-columns:1fr}',
  '#questionBanksList .qb-card--round581 .qb-chip{min-height:30px;max-width:100%;white-space:normal}',
  'min-height:44px',
  'overflow-wrap:anywhere'
].every((snippet) => questionBankHtml.includes(snippet)), {});

check('notification and focus accessibility hooks are present', questionBankHtml.includes("container.setAttribute('aria-live'")
  && questionBankHtml.includes("n.setAttribute('role'")
  && questionBankData.includes('focusTarget.focus({ preventScroll: true })')
  && questionBankData.includes('aria-current="page" disabled'), {});

check('counts and evidence boundaries remain unchanged', [
  '400 可参考',
  '522 来源 / 122 线索',
  '422 / 二次重证 8',
  'strictAnswerPdfProof=0'
].every((snippet) => questionBankHtml.includes(snippet))
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === round581.realExamAnswerDepthRows
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0
  && ledger.metrics?.proofDepthRows181103 === 422
  && ledger.metrics?.strictAnswerPdfProofRows === 0, {
  realExamAnswerDepthRows: siteUpdates[0]?.metrics?.realExamAnswerDepthRows,
  strictAnswerPdfProof: siteUpdates[0]?.metrics?.strictAnswerPdfProof
});

check('current visible surfaces do not carry stale deep-answer counts', !/(145 深补|153 深补|真题深度补答累计 145 道|381 练习|141 源文|132 条参考答案页)/.test([
  indexHtml,
  homeHtml,
  questionBankHtml
].join('\n')), {});

const payload = {
  ok: checks.every((row) => row.pass),
  version: round581.version,
  previousVersion: round581.previousVersion,
  generatedAt: new Date().toISOString(),
  checks
};

fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify(payload, null, 2));
if (!payload.ok) process.exit(1);
