#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = 'round569-answer-depth-seventh-pass-workbench-proof-sync-20260629';
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round569-answer-depth-seventh-pass-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round569 QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

function readText(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function stripHtml(text) {
  return String(text || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function scoreAnswer(text) {
  const raw = String(text || '');
  const plain = stripHtml(raw);
  return {
    chars: plain.length,
    formulaCount: (raw.match(/\\\(|\\\)|\\\[|\\\]|\\frac|\\nabla|\\partial|=|<|>|_|\^|\\rho|\\mu|\\nu|Re|Fr|\\omega|\\theta|\\int|\\sum|\\Gamma|\\Phi|\\psi/g) || []).length,
    proofSignalCount: (plain.match(/设|取|由|因为|所以|因此|代入|积分|边界|条件|检查|结论|证明|可得|推出|假设|满足|比较|令|通解|定义|分解|守恒|移到|说明/g) || []).length
  };
}

function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

const checks = [];
const realReport = readJson('data/fluid-round569-real-exam-answer-depth-upgrade.json');
const proofReport = readJson('data/fluid-round569-181103-proof-depth-rewrite.json');
const continuation = readJson('data/fluid-round569-181103-proof-depth-continuation-ledger.json');
const bank181103 = readJson('question-banks/181103-material-extracted.json');
const siteUpdates = readJson('site-updates.json');
const answerChecks = readJson('data/fluid-question-answer-checks.json');
const index = readJson('question-banks/index.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');

check('real report ok and count frontier', realReport.ok === true
  && realReport.version === version
  && realReport.upgradedRows === 6
  && realReport.cumulativeAnswerDepthRows === 110
  && realReport.failedIds.length === 0, {
  upgradedRows: realReport.upgradedRows,
  cumulative: realReport.cumulativeAnswerDepthRows,
  failedIds: realReport.failedIds
});

check('181103 proof rewrite report ok and count frontier', proofReport.ok === true
  && proofReport.version === version
  && proofReport.rewrittenRows === 5
  && proofReport.cumulativeProofDepthRows === 422
  && proofReport.cumulativePracticeRows === 400
  && proofReport.cumulativeSourceClueRows === 122
  && proofReport.strictAnswerPdfProofRows === 0
  && proofReport.failedIds.length === 0, {
  rewrittenRows: proofReport.rewrittenRows,
  proofDepth: proofReport.cumulativeProofDepthRows,
  practice: proofReport.cumulativePracticeRows,
  sourceOnly: proofReport.cumulativeSourceClueRows,
  failedIds: proofReport.failedIds
});

check('continuation ledger keeps strict PDF boundary', continuation.ok === true
  && continuation.summary.rewrittenRows === 5
  && continuation.summary.strictAnswerPdfProofRows === 0, continuation.summary);

const realRowsOk = realReport.upgradedIds.every((id) => {
  const year = id.match(/^ocean-(\d{4})-/)?.[1];
  const pack = readJson(`question-banks/real-exam-years/${year}.json`);
  const question = (pack.questions || []).find((row) => row.id === id);
  const score = scoreAnswer(question?.answer || '');
  return question
    && question.round569AnswerDepthUpgrade === true
    && question.strictAnswerPdfProof === false
    && question.answerTrustState === 'reference-answer-derived-verified'
    && score.chars >= 600
    && score.formulaCount >= 8
    && score.proofSignalCount >= 8;
});
check('all six real-exam rows carry Round569 process answers', realRowsOk, { ids: realReport.upgradedIds });

const answerChecksOk = realReport.upgradedIds.every((id) => {
  const rows = Object.values(answerChecks.answerChecksById || {}).filter((row) => row.questionId === id);
  return rows.length >= 1 && rows.every((row) => row.round569AnswerDepthUpgrade === true && stripHtml(row.answer).length >= 600);
});
check('answer-check index mirrors Round569 real-exam answers', answerChecksOk, { ids: realReport.upgradedIds });

const proofRowsOk = proofReport.rewrittenIds.every((id) => {
  const row = bank181103.find((item) => item.id === id);
  const score = scoreAnswer(row?.answer || '');
  const html = row ? readText(row.round372SourceMaterialHtmlPath || row.sourceRelPath) : '';
  return row
    && row.round569ProofDepthRewrite === true
    && row.answerTrustState === 'reference-answer-ready'
    && row.defaultPracticeEligible === true
    && row.practiceEntryEnabled === true
    && score.chars >= 850
    && score.formulaCount >= 14
    && score.proofSignalCount >= 12
    && html.includes(id)
    && html.includes('参考答案（Round569 proof-depth 重写')
    && html.includes('data-round420-answer-trust-state="reference-answer-ready"');
});
check('rewritten 181103 proof-depth rows are ready, default practice, and HTML-visible', proofRowsOk, { ids: proofReport.rewrittenIds });

const counted = {
  total: bank181103.length,
  defaultPractice: bank181103.filter((row) => row.defaultPracticeEligible === true).length,
  proofDepth: bank181103.filter((row) => row.answerTrustState === 'reference-answer-ready').length,
  sourceOnly: bank181103.length - bank181103.filter((row) => row.defaultPracticeEligible === true).length
};
check('181103 bank counts match Round569 ledgers', counted.defaultPractice === 400
  && counted.proofDepth === 422
  && counted.sourceOnly === 122, counted);

const home = readText('question-bank-home.html');
const questionBank = readText('modules/question-bank.html');
const realExamPage = readText('modules/real-exams-dynamic.html');
const resources = readText('resources.html');
const middleware = readText('functions/_middleware.js');
const edgeJs = readText('js/edge-fluid-learning-upgrade.js');

check('current pages carry Round569 version and new counts', [home, questionBank, realExamPage, resources, middleware, edgeJs].every((text) => text.includes(version))
  && home.includes('真题补答 <strong>110</strong>')
  && home.includes('推导深修 <strong>422</strong>')
  && home.includes('重证 <strong>5</strong>')
  && home.includes('strict 0')
  && questionBank.includes('400 可直接参考')
  && realExamPage.includes('Round569'), {});

const staleCurrentPatterns = [
  'round568-answer-depth-sixth-pass-proof-ui-sync-20260629',
  '真题补答 <strong>104</strong>',
  '98 题答案已深补',
  '推导深修 <strong>417</strong>',
  '390 可参考',
  '381 可直接参考',
  '381 练习',
  '141 源文线索',
  '141 条源文线索',
  '132 条源文线索',
  '源文线索 141',
  'proof-depth 升至 417'
];
const staleHits = staleCurrentPatterns.filter((pattern) => [home, questionBank, realExamPage, resources, middleware, edgeJs].some((text) => text.includes(pattern)));
check('current-page stale Round568/Round567 count phrases removed', staleHits.length === 0, { staleHits });

check('site updates top entry is Round569', Array.isArray(siteUpdates)
  && siteUpdates[0]?.version === version
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === 110
  && siteUpdates[0]?.metrics?.proofDepthRows === 422
  && siteUpdates[0]?.metrics?.proofDepthRewriteRows === 5
  && siteUpdates[0]?.metrics?.referencePracticeRows === 400
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === 122
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0, siteUpdates[0]?.metrics || {});

check('current metadata fields are Round569', index.currentEntryVersion === version
  && (index.questionBanks || []).find((row) => row.id === '181103-material-extracted')?.currentEntryVersion === version
  && roadmap.version === version
  && roadmap.currentRound === 569
  && roadmap.releaseGate?.currentVersion === version
  && roadmap.releaseGate?.expectedVersion === version
  && edgeJs.includes(`var VERSION = '${version}-eflu-workbench';`)
  && edgeJs.includes(`var ROADMAP100_VERSION = '${version}';`), {
  indexCurrent: index.currentEntryVersion,
  roadmapVersion: roadmap.version,
  roadmapRound: roadmap.currentRound,
  releaseGate: roadmap.releaseGate && {
    currentVersion: roadmap.releaseGate.currentVersion,
    expectedVersion: roadmap.releaseGate.expectedVersion
  }
});

const ok = checks.every((item) => item.pass);
const report = {
  ok,
  version,
  generatedAt: new Date().toISOString(),
  checks,
  summary: {
    realExamAnswerDepthRows: 110,
    proofDepthRows181103: 422,
    proofDepthRewriteRows181103: 5,
    practiceRows181103: 400,
    sourceClueOnlyRows181103: 122,
    strictAnswerPdfProofRows: 0
  }
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(`${outJson}.gz`, zlib.gzipSync(Buffer.from(`${JSON.stringify(report, null, 2)}\n`)));
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);
