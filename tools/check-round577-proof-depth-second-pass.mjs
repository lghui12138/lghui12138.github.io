#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round577, proofDepthRewrites181103 } from './round577-proof-depth-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round577-proof-depth-second-pass-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round577 QA from /Volumes/mac_2T during lifs isolation.');
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

function gzipMatchesJson(rel) {
  const json = readText(rel);
  const gz = zlib.gunzipSync(fs.readFileSync(abs(`${rel}.gz`))).toString('utf8');
  return json === gz;
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function scoreAnswer(text) {
  const raw = String(text || '');
  const plain = stripHtml(raw);
  return {
    chars: plain.length,
    sentenceCount: (plain.match(/[。；;.!？?]/g) || []).length,
    formulaCount: (raw.match(/\\\(|\\\)|\\\[|\\\]|\\frac|\\partial|\\operatorname|\\sqrt|\\int|\\sum|\\Pi|\\Delta|\\rho|\\theta|\\phi|\\omega|\\tau|\\pi|=|<|>|_|\^/g) || []).length,
    proofSignalCount: (plain.match(/设|取|由|因为|所以|因此|代入|积分|边界|条件|结论|证明|可得|推出|假设|满足|比较|令|定义|整理|配平|相除|检查|故|再看|先看|等价|说明/g) || []).length
  };
}

function relFromRow(row) {
  return String(row?.round372SourceMaterialHtmlPath || row?.sourceRelPath || row?.sourceHtmlUrl || '').split('#')[0].replace(/^\/+/, '');
}

function norm(value) {
  return String(value || '')
    .replace(/\\,/g, '')
    .replace(/\s+/g, '')
    .replace(/[，。；;：:]/g, '');
}

function containsSnippet(answer, snippet) {
  return norm(answer).includes(norm(snippet));
}

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

const report = readJson('data/fluid-round577-181103-proof-depth-second-pass.json');
const continuation = readJson('data/fluid-round577-181103-proof-depth-continuation-ledger.json');
const bank181103 = readJson('question-banks/181103-material-extracted.json');
const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const index = readJson('question-banks/index.json');

check('Round577 proof report and continuation ledger are green', report.ok === true
  && report.version === round577.version
  && report.previousVersion === round577.previousVersion
  && report.upgradedRows === proofDepthRewrites181103.length
  && report.cumulativeProofDepthRows === round577.proofDepthRows181103
  && report.cumulativePracticeRows === round577.referencePracticeRows181103
  && report.cumulativeSourceClueRows === round577.sourceClueOnlyRows181103
  && report.strictAnswerPdfProofRows === 0
  && Array.isArray(report.failedIds)
  && report.failedIds.length === 0
  && continuation.ok === true
  && continuation.summary?.rewrittenRows === proofDepthRewrites181103.length
  && continuation.summary?.strictAnswerPdfProofRows === 0, {
  report: {
    upgradedRows: report.upgradedRows,
    failedIds: report.failedIds
  },
  continuation: continuation.summary
});

check('Round577 JSON sidecars match gzip', [
  'data/fluid-round577-181103-proof-depth-second-pass.json',
  'data/fluid-round577-181103-proof-depth-continuation-ledger.json',
  'question-banks/181103-material-extracted.json',
  'question-banks/index.json',
  'site-updates.json',
  'data/fluid-upgrade-roadmap-100.json'
].every(gzipMatchesJson), {});

const counted = {
  total: bank181103.length,
  defaultPractice: bank181103.filter((row) => row.defaultPracticeEligible === true && row.practiceEntryEnabled !== false && row.defaultHidden !== true).length,
  sourceOnly: bank181103.filter((row) => !(row.defaultPracticeEligible === true && row.practiceEntryEnabled !== false && row.defaultHidden !== true)).length,
  proofDepthReady: bank181103.filter((row) => row.answerTrustState === 'reference-answer-ready').length,
  strictPdf: bank181103.filter((row) => row.strictAnswerPdfProof === true).length
};
check('181103 count frontier remains 522/400/122/422/strict0', counted.total === 522
  && counted.defaultPractice === 400
  && counted.sourceOnly === 122
  && counted.proofDepthReady === 422
  && counted.strictPdf === 0, counted);

const rowChecks = proofDepthRewrites181103.map((item) => {
  const row = bank181103.find((entry) => entry.id === item.id);
  const answer = row?.referenceAnswer || row?.answer || '';
  const score = scoreAnswer(answer);
  const htmlRel = row && relFromRow(row);
  const html = htmlRel ? readText(htmlRel) : '';
  const snippets = (item.requiredSnippets || []).map((snippet) => ({
    snippet,
    pass: containsSnippet(answer, snippet) || containsSnippet(html, snippet)
  }));
  return {
    id: item.id,
    exists: Boolean(row),
    round577: row?.round577ProofDepthRewrite === true,
    trust: row?.answerTrustState,
    review: row?.answerReviewBoundary,
    strict: row?.strictAnswerPdfProof,
    flag: Array.isArray(row?.qualityFlags) && row.qualityFlags.includes('round577-proof-depth-rewritten'),
    score,
    snippets,
    htmlVisible: Boolean(htmlRel)
      && html.includes(item.id)
      && html.includes('Round577 二次重证')
      && html.includes('data-round577-proof-depth-rewrite="1"')
      && item.requiredSnippets.some((snippet) => containsSnippet(html, snippet))
  };
});

check('all eight 181103 rows carry Round577 proof-depth fields and dense proofs', rowChecks.every((row) => row.exists
  && row.round577
  && row.trust === 'reference-answer-ready'
  && row.review === 'proof-depth-rewritten'
  && row.strict === false
  && row.flag
  && row.score.chars >= round577.minChars
  && row.score.sentenceCount >= round577.minSentenceCount
  && row.score.formulaCount >= round577.minFormulaCount
  && row.score.proofSignalCount >= round577.minProofSignalCount
  && row.snippets.every((snippet) => snippet.pass)
  && row.htmlVisible), {
  rows: rowChecks
});

const indexBank = (index.questionBanks || []).find((row) => row.id === '181103-material-extracted') || {};
check('question-bank index exposes current 400/122 while retaining raw provenance separately', index.version === round577.version
  && index.currentEntryVersion === round577.version
  && index.material181103CurrentWebsitePracticeQuestionCount === 400
  && index.material181103CurrentWebsiteSourceContentCardCount === 122
  && index.summary?.material181103DefaultPracticeQuestionCount === 400
  && index.summary?.material181103SourceSemanticPracticeCount === 400
  && index.summary?.material181103SourceContentCardCount === 122
  && index.summary?.material181103WebParityPracticeQuestionCount === 400
  && index.summary?.material181103WebParitySourceContentCardCount === 122
  && index.summary?.material181103CurrentWebsitePracticeQuestionCount === 400
  && index.summary?.material181103CurrentWebsiteSourceContentCardCount === 122
  && index.summary?.material181103RawPracticeQuestionCountBeforeRound577 === 381
  && index.summary?.material181103RawSourceContentCardCountBeforeRound577 === 141
  && indexBank.defaultPracticeQuestionCount === 400
  && indexBank.practiceEntryQuestionCount === 400
  && indexBank.sourceSemanticContentCardCount === 122
  && indexBank.webParitySourceContentCardCount === 122
  && indexBank.rawPracticeEntryQuestionCountBeforeRound577 === 381
  && indexBank.rawSourceSemanticContentCardCountBeforeRound577 === 141, {
  summary: index.summary,
  bank: {
    defaultPracticeQuestionCount: indexBank.defaultPracticeQuestionCount,
    practiceEntryQuestionCount: indexBank.practiceEntryQuestionCount,
    sourceSemanticContentCardCount: indexBank.sourceSemanticContentCardCount,
    rawPracticeEntryQuestionCountBeforeRound577: indexBank.rawPracticeEntryQuestionCountBeforeRound577,
    rawSourceSemanticContentCardCountBeforeRound577: indexBank.rawSourceSemanticContentCardCountBeforeRound577
  }
});

const resources = readText('resources.html');
const questionBankPage = readText('modules/question-bank.html');
const questionBankData = readText('modules/question-bank-data.js');
const questionBankPractice = readText('modules/question-bank-practice.js');
const materialIndex = readText('resources/fluid-181103-html/index.html');
const indexHome = readText('index.html');
const middleware = readText('functions/_middleware.js');
const edgeJs = readText('js/edge-fluid-learning-upgrade.js');

const staleVisibleCountPatterns = [
  '<b>381</b>练习',
  '<b>141</b>源文',
  '132 条参考答案页',
  'Round576 直达壳一致、Round576',
  'sourceSemanticContentCardCount": 141',
  'CurrentWebsitePracticeQuestionCount": 381',
  'CurrentWebsiteSourceContentCardCount": 141'
];
const staleVisibleHits = staleVisibleCountPatterns.filter((pattern) => [
  resources,
  questionBankPage,
  questionBankData,
  indexHome,
  JSON.stringify(index.summary)
].some((text) => String(text).includes(pattern)));

check('current visible resources/question-bank copy has no stale 381/141/132 current counts', staleVisibleHits.length === 0
  && resources.includes('<b>400</b>练习 / 400+0 答案')
  && resources.includes('<b>122</b>源文线索只展示')
  && questionBankData.includes('webParitySourceContentCardCount')
  && questionBankData.includes(round577.version), {
  staleVisibleHits
});

check('answer panel is answer-first with evidence drawers preserved but collapsed', questionBankPractice.includes("data-round577-answer-first-panel', '1'")
  && questionBankPractice.includes('data-round577-answer-first-evidence-drawer="1"')
  && questionBankPractice.includes('来源证据（可展开核对）')
  && questionBankPractice.includes('评分细则与来源 trace（可展开核对）')
  && questionBankPractice.includes('解题思路（可展开核对）')
  && !questionBankPractice.includes('<details class="reference-source-evidence__details" open')
  && !questionBankPractice.includes('<details class="real-exam-answer-rubric__details" open')
  && !questionBankPractice.includes('<details class="answer-explanation-details" open'), {});

check('181103 focus route prioritizes bank list without deleting lower evidence sections', questionBankPage.includes('data-round577-focus-boot')
  && questionBankPage.includes('data-round577-focus-layout')
  && questionBankPage.includes("params.get('focus') === '181103-material-extracted'")
  && questionBankPage.includes("main.insertBefore(section, main.firstElementChild)")
  && questionBankPage.includes('已优先显示 181103 资料题库')
  && questionBankPage.includes('id="entry-181103-material-review"')
  && questionBankPage.includes('class="enhanced-features page-section"'), {});

check('site updates and roadmap top release are Round577', Array.isArray(siteUpdates)
  && siteUpdates[0]?.version === round577.version
  && siteUpdates[0]?.previousVersion === round577.previousVersion
  && siteUpdates[0]?.metrics?.proofDepthRows === round577.proofDepthRows181103
  && siteUpdates[0]?.metrics?.proofDepthRewriteRows === proofDepthRewrites181103.length
  && siteUpdates[0]?.metrics?.referencePracticeRows === 400
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === 122
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0
  && roadmap.version === round577.version
  && roadmap.currentRound === 577
  && roadmap.releaseGate?.expectedVersion === round577.version
  && (roadmap.releaseGate?.commands || []).some((command) => String(command).includes('check-round577-proof-depth-second-pass.mjs')), {
  siteTop: siteUpdates[0],
  roadmap: {
    version: roadmap.version,
    currentRound: roadmap.currentRound,
    commands: roadmap.releaseGate?.commands?.slice(0, 6)
  }
});

check('current runtime/version surfaces point to Round577', middleware.includes(`const EDGE_HOME_VERSION = '${round577.version}';`)
  && middleware.includes(`const EDGE_RUNTIME_JS_VERSION = '${round577.version}';`)
  && edgeJs.includes(round577.version)
  && questionBankPage.includes(round577.version)
  && resources.includes(round577.version)
  && materialIndex.includes(round577.version)
  && indexHome.includes(`当前发布：Round577 · ${round577.version}`)
  && indexHome.includes('Round577 证明题二次重证'), {});

const reportOut = {
  ok: checks.every((row) => row.pass),
  version: round577.version,
  previousVersion: round577.previousVersion,
  generatedAt: new Date().toISOString(),
  checks,
  summary: {
    upgradedRows: proofDepthRewrites181103.length,
    proofDepthRows181103: round577.proofDepthRows181103,
    referencePracticeRows181103: round577.referencePracticeRows181103,
    sourceClueOnlyRows181103: round577.sourceClueOnlyRows181103,
    realExamAnswerDepthRows: round577.realExamAnswerDepthRows,
    strictAnswerPdfProofRows: round577.strictAnswerPdfProofRows
  }
};

fs.writeFileSync(outJson, `${JSON.stringify(reportOut, null, 2)}\n`);
console.log(JSON.stringify(reportOut, null, 2));
if (!reportOut.ok) process.exit(1);
