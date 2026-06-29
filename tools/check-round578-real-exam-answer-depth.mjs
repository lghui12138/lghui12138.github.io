#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round578, realExamUpgrades } from './round578-real-exam-answer-depth-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round578-real-exam-answer-depth-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round578 QA from /Volumes/mac_2T during lifs isolation.');
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

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function scoreAnswer(text) {
  const raw = String(text || '');
  const plain = stripHtml(raw);
  return {
    chars: plain.length,
    formulaCount: (raw.match(/\\\(|\\\)|\\\[|\\\]|\\frac|\\partial|\\nabla|\\int|\\sum|\\pi|\\rho|\\mu|\\nu|\\omega|\\theta|\\psi|\\Gamma|Re|St|Kn|=|<|>|_|\^/g) || []).length,
    proofSignalCount: (plain.match(/设|取|由|因为|所以|因此|代入|积分|边界|条件|检查|结论|证明|可得|推出|假设|满足|比较|令|定义|整理|分解|守恒|适用|物理意义|前提/g) || []).length
  };
}

function yearFromRealExamId(id) {
  const match = String(id).match(/^ocean-(\d{4})-/);
  return match && match[1];
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

const report = readJson('data/fluid-round578-real-exam-answer-depth-upgrade.json');
const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const answerChecks = readJson('data/fluid-question-answer-checks.json');
const index = readJson('question-banks/index.json');
const bank181103 = readJson('question-banks/181103-material-extracted.json');

check('Round578 real-exam report is green', report.ok === true
  && report.version === round578.version
  && report.upgradedRows === round578.realExamRoundUpgradeRows
  && report.cumulativeAnswerDepthRows === round578.realExamCumulativeAnswerDepthRows
  && report.strictAnswerPdfProofRows === 0
  && Array.isArray(report.failedIds)
  && report.failedIds.length === 0, {
  reportVersion: report.version,
  upgradedRows: report.upgradedRows,
  cumulative: report.cumulativeAnswerDepthRows,
  failedIds: report.failedIds
});

check('JSON gzip sidecars match for Round578 touched ledgers', [
  'data/fluid-round578-real-exam-answer-depth-upgrade.json',
  'data/fluid-question-answer-checks.json',
  'question-banks/index.json',
  'site-updates.json',
  'data/fluid-upgrade-roadmap-100.json'
].every(gzipMatches), {});

const rowResults = realExamUpgrades.map((item) => {
  const year = yearFromRealExamId(item.id);
  const pack = readJson(`question-banks/real-exam-years/${year}.json`);
  const row = (pack.questions || []).find((entry) => entry.id === item.id);
  const score = scoreAnswer(row?.answer || row?.referenceAnswer || '');
  return {
    id: item.id,
    year,
    exists: Boolean(row),
    round578: row?.round578AnswerDepthUpgrade === true,
    trust: row?.answerTrustState,
    strict: row?.strictAnswerPdfProof,
    hasBoundary: /not-original-answer-pdf-proof/.test(String(row?.answerReviewBoundary || ''))
      && /Round578/.test(String(row?.answerSource?.boundary || '')),
    answerMatchesData: stripHtml(row?.answer || '').includes(stripHtml(item.referenceAnswer).slice(0, 80)),
    score
  };
});

check('all eight real-exam rows carry dense Round578 process answers', rowResults.every((row) => row.exists
  && row.round578
  && row.trust === 'reference-answer-derived-verified'
  && row.strict === false
  && row.hasBoundary
  && row.answerMatchesData
  && row.score.chars >= round578.minChars
  && row.score.formulaCount >= round578.minFormulaCount
  && row.score.proofSignalCount >= round578.minProofSignalCount), { rows: rowResults });

const answerCheckRows = realExamUpgrades.map((item) => {
  const rows = Object.values(answerChecks.answerChecksById || {}).filter((row) => row.questionId === item.id);
  return {
    id: item.id,
    count: rows.length,
    ok: rows.length >= 1
      && rows.some((row) => row.round578AnswerDepthUpgrade === true
        && row.answerTrustState === 'reference-answer-derived-verified'
        && row.strictAnswerPdfProof === false
        && scoreAnswer(row.answer || '').chars >= round578.minChars)
  };
});

check('answer-check index mirrors Round578 real-exam answers', answerCheckRows.every((row) => row.ok), { rows: answerCheckRows });

const counted181103 = {
  total: bank181103.length,
  defaultPractice: bank181103.filter((row) => row.defaultPracticeEligible === true).length,
  proofDepth: bank181103.filter((row) => row.answerTrustState === 'reference-answer-ready').length,
  sourceOnly: bank181103.length - bank181103.filter((row) => row.defaultPracticeEligible === true).length,
  strictPdf: bank181103.filter((row) => row.strictAnswerPdfProof === true).length
};
check('181103 count frontier remains unchanged at 522/400/122/422/strict0', counted181103.total === 522
  && counted181103.defaultPractice === 400
  && counted181103.sourceOnly === 122
  && counted181103.proofDepth === 422
  && counted181103.strictPdf === 0, counted181103);

check('site updates, roadmap, and question-bank index point to Round578', siteUpdates[0]?.version === round578.version
  && roadmap.version === round578.version
  && roadmap.currentRound === round578.round
  && roadmap.realExamAnswerDepthRows === round578.realExamCumulativeAnswerDepthRows
  && index.version === round578.version, {
  siteTop: siteUpdates[0]?.version,
  roadmapVersion: roadmap.version,
  currentRound: roadmap.currentRound,
  indexVersion: index.version
});

const currentFiles = [
  'question-bank-home.html',
  'index.html',
  'index-complete.html',
  'modules/question-bank.html',
  'modules/real-exams-dynamic.html',
  'resources.html',
  'functions/_middleware.js',
  'js/edge-fluid-learning-upgrade.js',
  'modules/question-bank-data.js',
  'js/core/local-mathjax.js'
];
const staleHits = currentFiles.flatMap((rel) => {
  const text = readText(rel);
  const hits = [];
  if (!text.includes(round578.version)) hits.push('missing-round578-version');
  if (/真题补答 <strong>145<\/strong>|145 深补|145 道已做过程型补答|历年真题过程型补答仍为 145/.test(text)) hits.push('stale-145-visible-copy');
  if (/edge_refresh=round577-181103-proof-depth-second-pass-20260629/.test(text)) hits.push('stale-round577-edge-refresh');
  return hits.map((hit) => ({ file: rel, hit }));
});
check('current visible/version surfaces have Round578 and no stale Round577/145 copy', staleHits.length === 0, { staleHits });

const payload = {
  ok: checks.every((row) => row.pass),
  version: round578.version,
  previousVersion: round578.previousVersion,
  generatedAt: new Date().toISOString(),
  checks,
  summary: {
    realExamUpgradedRows: realExamUpgrades.length,
    realExamAnswerDepthRows: round578.realExamCumulativeAnswerDepthRows,
    proofDepthRows181103: round578.proofDepthRows181103,
    referencePracticeRows181103: round578.referencePracticeRows181103,
    sourceClueOnlyRows181103: round578.sourceClueOnlyRows181103,
    strictAnswerPdfProofRows: round578.strictAnswerPdfProofRows
  }
};

fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify(payload, null, 2));
if (!payload.ok) process.exit(1);
