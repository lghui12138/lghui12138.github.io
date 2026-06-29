#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round580 } from './round580-question-bank-focus-polish-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round580-question-bank-focus-polish-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round580 QA from /Volumes/mac_2T during lifs isolation.');
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

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

const ledger = readJson('data/fluid-round580-question-bank-focus-polish-ledger.json');
const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const questionBankHtml = readText('modules/question-bank.html');
const questionBankData = readText('modules/question-bank-data.js');
const homeHtml = readText('question-bank-home.html');
const middleware = readText('functions/_middleware.js');

check('Round580 ledger is green and non-deleting', ledger.ok === true
  && ledger.version === round580.version
  && ledger.previousVersion === round580.previousVersion
  && ledger.nonDeletingUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false, {
  version: ledger.version,
  changedFiles: ledger.changedFiles?.length
});

check('Round580 JSON gzip sidecars match', [
  'data/fluid-round580-question-bank-focus-polish-ledger.json',
  'site-updates.json',
  'data/fluid-upgrade-roadmap-100.json'
].every(gzipMatches), {});

check('site updates and roadmap point to Round580', siteUpdates[0]?.version === round580.version
  && roadmap.version === round580.version
  && roadmap.currentRound === round580.round
  && roadmap.round580QuestionBankFocusPolish === true, {
  siteTop: siteUpdates[0]?.version,
  roadmapVersion: roadmap.version,
  currentRound: roadmap.currentRound
});

check('current edge and home surfaces expose Round580 version', middleware.includes(round580.version)
  && homeHtml.includes(round580.version)
  && questionBankHtml.includes(round580.version)
  && questionBankData.includes(round580.version), {
  middleware: middleware.includes(round580.version),
  home: homeHtml.includes(round580.version),
  questionBank: questionBankHtml.includes(round580.version),
  questionBankData: questionBankData.includes(round580.version)
});

check('question-bank focus polish selectors and anchored scroll are present', [
  'data-round580-focus-polish="question-bank-list"',
  "data-round580-focus-polish','anchored-list'",
  "data-round580-focus-list','1'"
].every((snippet) => questionBankHtml.includes(snippet))
  && questionBankHtml.includes('focusLandingComfortable') === false
  && questionBankHtml.includes("section.scrollIntoView({ behavior: 'auto', block: 'start' })")
  && questionBankData.includes("const focusSection = focusId === '181103-material-extracted'")
  && questionBankData.includes("focusSection || bankCard"), {
  selectors: round580.focusPolishSelectors,
  anchoredHtml: questionBankHtml.includes("section.scrollIntoView({ behavior: 'auto', block: 'start' })"),
  anchoredData: questionBankData.includes("focusSection || bankCard")
});

check('counts and evidence boundaries remain unchanged', questionBankHtml.includes('400 可参考')
  && questionBankHtml.includes('522 来源 / 122 线索')
  && questionBankHtml.includes('422 / 二次重证 8')
  && questionBankHtml.includes('strictAnswerPdfProof=0')
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === round580.realExamAnswerDepthRows
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0, {
  realExamAnswerDepthRows: siteUpdates[0]?.metrics?.realExamAnswerDepthRows,
  strictAnswerPdfProof: siteUpdates[0]?.metrics?.strictAnswerPdfProof
});

check('mobile notification no longer overlays top focus content', /@media \(max-width:640px\)\{\s*#notification-container\{top:auto;/.test(questionBankHtml)
  && questionBankHtml.includes('bottom:calc(env(safe-area-inset-bottom) + 12px)'), {});

const payload = {
  ok: checks.every((row) => row.pass),
  version: round580.version,
  previousVersion: round580.previousVersion,
  generatedAt: new Date().toISOString(),
  checks
};

fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify(payload, null, 2));
if (!payload.ok) process.exit(1);
