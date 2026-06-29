#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round571, realExamUpgrades, proofDepthRewrites181103 } from './round571-answer-depth-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round571-answer-depth-ninth-pass-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round571 QA from /Volumes/mac_2T during lifs isolation.');
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
    formulaCount: (raw.match(/\\\(|\\\)|\\\[|\\\]|\\frac|\\nabla|\\partial|=|<|>|_|\^|\\rho|\\mu|\\nu|Re|Fr|Kn|\\omega|\\theta|\\int|\\sum|\\Gamma|\\Phi|\\Psi|\\psi|\\delta|\\tau|\\Omega/g) || []).length,
    proofSignalCount: (plain.match(/设|取|由|因为|所以|因此|代入|积分|边界|条件|检查|结论|证明|可得|推出|假设|满足|比较|令|通解|定义|分解|守恒|移到|说明|整理|排除|判据/g) || []).length
  };
}

function yearFromRealExamId(id) {
  const match = id.match(/^ocean-(\d{4})-/);
  return match && match[1];
}

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

const realReport = readJson('data/fluid-round571-real-exam-answer-depth-upgrade.json');
const proofReport = readJson('data/fluid-round571-181103-proof-depth-rewrite.json');
const continuation = readJson('data/fluid-round571-181103-proof-depth-continuation-ledger.json');
const bank181103 = readJson('question-banks/181103-material-extracted.json');
const siteUpdates = readJson('site-updates.json');
const answerChecks = readJson('data/fluid-question-answer-checks.json');
const index = readJson('question-banks/index.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');

check('real report ok and Round571 count frontier', realReport.ok === true
  && realReport.version === round571.version
  && realReport.upgradedRows === round571.realExamRoundUpgradeRows
  && realReport.cumulativeAnswerDepthRows === round571.realExamCumulativeAnswerDepthRows
  && realReport.strictAnswerPdfProofRows === 0
  && realReport.failedIds.length === 0, {
  upgradedRows: realReport.upgradedRows,
  cumulative: realReport.cumulativeAnswerDepthRows,
  failedIds: realReport.failedIds
});

check('181103 proof rewrite report ok and count frontier', proofReport.ok === true
  && proofReport.version === round571.version
  && proofReport.rewrittenRows === 6
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
  && continuation.summary.rewrittenRows === 6
  && continuation.summary.strictAnswerPdfProofRows === 0
  && /strict answer-PDF proof remains separate at 0/.test(continuation.summary.boundary), continuation.summary);

const realRows = realExamUpgrades.map((item) => {
  const year = yearFromRealExamId(item.id);
  const pack = readJson(`question-banks/real-exam-years/${year}.json`);
  const question = (pack.questions || []).find((row) => row.id === item.id);
  const score = scoreAnswer(question?.answer || '');
  return {
    id: item.id,
    exists: Boolean(question),
    round571: question?.round571AnswerDepthUpgrade === true,
    trust: question?.answerTrustState,
    strict: question?.strictAnswerPdfProof,
    score
  };
});

check('all twelve real-exam rows carry Round571 process answers', realRows.every((row) => row.exists
  && row.round571
  && row.strict === false
  && row.trust === 'reference-answer-derived-verified'
  && row.score.chars >= 450
  && row.score.formulaCount >= 2
  && row.score.proofSignalCount >= 5), { rows: realRows });

const answerCheckRows = realExamUpgrades.map((item) => {
  const rows = Object.values(answerChecks.answerChecksById || {}).filter((row) => row.questionId === item.id);
  return {
    id: item.id,
    count: rows.length,
    ok: rows.length >= 1 && rows.some((row) => row.round571AnswerDepthUpgrade === true && stripHtml(row.answer).length >= 450)
  };
});
check('answer-check index mirrors Round571 real-exam answers', answerCheckRows.every((row) => row.ok), { rows: answerCheckRows });

const proofRows = proofDepthRewrites181103.map((item) => {
  const row = bank181103.find((entry) => entry.id === item.id);
  const score = scoreAnswer(row?.answer || '');
  const htmlRel = row?.round372SourceMaterialHtmlPath || row?.sourceRelPath || row?.sourceHtmlUrl;
  const html = htmlRel ? readText(htmlRel) : '';
  return {
    id: item.id,
    exists: Boolean(row),
    round571: row?.round571ProofDepthRewrite === true,
    trust: row?.answerTrustState,
    practice: row?.defaultPracticeEligible === true && row?.practiceEntryEnabled === true,
    strict: row?.strictAnswerPdfProof,
    htmlVisible: html.includes(item.id) && html.includes('参考答案（Round571 proof-depth 重证') && html.includes('data-round420-answer-trust-state="reference-answer-ready"'),
    score
  };
});

check('rewritten 181103 proof-depth rows are ready, default practice, and HTML-visible', proofRows.every((row) => row.exists
  && row.round571
  && row.trust === 'reference-answer-ready'
  && row.practice
  && row.strict === false
  && row.htmlVisible
  && row.score.chars >= 650
  && row.score.formulaCount >= 8
  && row.score.proofSignalCount >= 3), { rows: proofRows });

const counted = {
  total: bank181103.length,
  defaultPractice: bank181103.filter((row) => row.defaultPracticeEligible === true).length,
  proofDepth: bank181103.filter((row) => row.answerTrustState === 'reference-answer-ready').length,
  sourceOnly: bank181103.length - bank181103.filter((row) => row.defaultPracticeEligible === true).length,
  strictPdf: bank181103.filter((row) => row.strictAnswerPdfProof === true).length
};
check('181103 bank counts match Round571 ledgers', counted.defaultPractice === 400
  && counted.proofDepth === 422
  && counted.sourceOnly === 122
  && counted.strictPdf === 0, counted);

const home = readText('question-bank-home.html');
const questionBank = readText('modules/question-bank.html');
const realExamPage = readText('modules/real-exams-dynamic.html');
const resources = readText('resources.html');
const middleware = readText('functions/_middleware.js');
const edgeJs = readText('js/edge-fluid-learning-upgrade.js');

check('current pages carry Round571 version and new counts', [home, questionBank, realExamPage, resources, middleware, edgeJs].every((text) => text.includes(round571.version))
  && home.includes('真题补答 <strong>133</strong>')
  && home.includes('推导深修 <strong>422</strong>')
  && home.includes('重证 <strong>6</strong>')
  && home.includes('strict 0')
  && home.includes('400 默认练习可参考')
  && home.includes('122 条源文线索')
  && questionBank.includes('400 可直接参考')
  && realExamPage.includes('Round571'), {});

const staleCurrentPatterns = [
  'round569-answer-depth-seventh-pass-workbench-proof-sync-20260629',
  'round570-answer-depth-eighth-pass-proof-ui-sync-20260629',
  '真题补答 <strong>110</strong>',
  '真题补答 <strong>122</strong>',
  '<dt>真题补答</dt><dd>110 道</dd>',
  '<dt>真题补答</dt><dd>122 道</dd>',
  '110 深补',
  '122 深补',
  '累计 110 道历年真题',
  '累计 122 道历年真题',
  '本轮新增 6 道',
  '新增证明深修 5 道',
  '110 道已做过程型补答',
  '122 道已做过程型补答',
  '真题补答 122',
  '重证 <strong>5</strong>',
  '381练习',
  '381 练习',
  '381可参考',
  '381 可直接参考',
  '资料线索141',
  '141线索',
  '141 线索',
  '141 条源文线索'
];
const staleHits = staleCurrentPatterns.filter((pattern) => [home, questionBank, realExamPage, resources, middleware, edgeJs].some((text) => text.includes(pattern)));
check('current-page stale Round569/old count phrases removed', staleHits.length === 0, { staleHits });

const runtimeVersionFiles = [
  'js/core/local-mathjax.js',
  'modules/knowledge-detail.html',
  'modules/knowledge-upgrade-2026.html',
  'modules/question-bank-data.js',
  'js/fluid-home-complete.js',
  'modules/simulated-exams-dynamic.html',
  'modules/fluid-intensive-training.html',
  'modules/teacher-panel.html'
];
const runtimeVersionScan = runtimeVersionFiles.map((rel) => {
  const text = readText(rel);
  return {
    rel,
    hasRound571: text.includes(round571.version),
    stalePreviousVersionHits: text.split(round571.previousVersion).length - 1
  };
});
check('runtime cache-bust files use Round571 version only', runtimeVersionScan.every((row) => row.hasRound571 && row.stalePreviousVersionHits === 0), { rows: runtimeVersionScan });

const materialDir = path.join(repoRoot, 'resources/fluid-181103-html/materials');
const materialIndexPages = fs.readdirSync(materialDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => `resources/fluid-181103-html/materials/${entry.name}/index.html`)
  .filter((rel) => fs.existsSync(path.join(repoRoot, rel)))
  .sort();
const materialPageRows = materialIndexPages.map((rel) => {
  const text = readText(rel);
  return {
    rel,
    hasRound571: text.includes(round571.version),
    practice400: text.includes('data-181103-practice="400"') && text.includes('400 默认练习'),
    reference400: text.includes('data-181103-ready-reference="400"') && text.includes('400 可直接参考'),
    source122: text.includes('data-181103-source="122"') && text.includes('122 源文线索'),
    staleCurrentCounts: /data-181103-practice="381"|data-181103-ready-reference="381"|data-181103-source="141"|381 默认练习|381 可直接参考|141 源文线索/.test(text)
  };
});
check('181103 material HTML pages carry Round571 400/122 current ledger', materialPageRows.length === 38
  && materialPageRows.every((row) => row.hasRound571 && row.practice400 && row.reference400 && row.source122 && !row.staleCurrentCounts), {
  count: materialPageRows.length,
  failed: materialPageRows.filter((row) => !(row.hasRound571 && row.practice400 && row.reference400 && row.source122 && !row.staleCurrentCounts)).slice(0, 8)
});

const materialIndex = readText('resources/fluid-181103-html/index.html');
check('181103 material index carries Round571 400/122/422 current ledger', materialIndex.includes(round571.version)
  && materialIndex.includes('400 默认练习')
  && materialIndex.includes('400 可参考')
  && materialIndex.includes('122 线索')
  && materialIndex.includes('422 道已深修')
  && !/381 默认练习|381 可直接参考|381 可参考|141 源文线索|141 线索|360 道已深修/.test(materialIndex), {});

check('site updates top entry is Round571', Array.isArray(siteUpdates)
  && siteUpdates[0]?.version === round571.version
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === round571.realExamCumulativeAnswerDepthRows
  && siteUpdates[0]?.metrics?.realExamRoundUpgradeRows === round571.realExamRoundUpgradeRows
  && siteUpdates[0]?.metrics?.realExamNewUniqueRows === round571.realExamNewUniqueRows
  && siteUpdates[0]?.metrics?.proofDepthRows === 422
  && siteUpdates[0]?.metrics?.proofDepthRewriteRows === 6
  && siteUpdates[0]?.metrics?.referencePracticeRows === 400
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === 122
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0, siteUpdates[0]?.metrics || {});

const indexBank = (index.questionBanks || []).find((row) => row.id === '181103-material-extracted') || {};
check('question-bank index syncs 400/122 current truth', index.currentEntryVersion === round571.version
  && index.material181103CurrentWebsitePracticeQuestionCount === 400
  && index.material181103CurrentWebsiteSourceContentCardCount === 122
  && indexBank.defaultPracticeQuestionCount === 400
  && !String(indexBank.description || '').includes('381')
  && !String(indexBank.description || '').includes('141')
  && String(indexBank.description || '').includes('400')
  && String(indexBank.description || '').includes('122'), {
  currentEntryVersion: index.currentEntryVersion,
  practice: index.material181103CurrentWebsitePracticeQuestionCount,
  sourceOnly: index.material181103CurrentWebsiteSourceContentCardCount,
  bankDescription: indexBank.description
});

check('current metadata fields are Round571', roadmap.version === round571.version
  && roadmap.currentRound === 571
  && roadmap.releaseGate?.currentVersion === round571.version
  && roadmap.releaseGate?.expectedVersion === round571.version
  && Array.isArray(roadmap.releaseGate?.commands)
  && roadmap.releaseGate.commands.some((command) => String(command).includes('check-round571-answer-render-visual.mjs'))
  && roadmap.releaseGate.commands.every((command) => !/answer-depth-eighth-pass|round570-answer-depth/.test(String(command)))
  && roadmap.round571AnswerDepthNewUniqueRows === round571.realExamNewUniqueRows
  && roadmap.realExamAnswerDepthRows === round571.realExamCumulativeAnswerDepthRows
  && edgeJs.includes(`var VERSION = '${round571.version}-eflu-workbench';`)
  && edgeJs.includes(`var ROADMAP100_VERSION = '${round571.version}';`), {
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
  version: round571.version,
  previousVersion: round571.previousVersion,
  generatedAt: new Date().toISOString(),
  checks,
  summary: {
    realExamAnswerDepthRows: round571.realExamCumulativeAnswerDepthRows,
    realExamUpgradedRows: round571.realExamRoundUpgradeRows,
    realExamNewUniqueRows: round571.realExamNewUniqueRows,
    proofDepthRows181103: 422,
    proofDepthRewriteRows181103: 6,
    practiceRows181103: 400,
    sourceClueOnlyRows181103: 122,
    strictAnswerPdfProofRows: 0
  }
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(`${outJson}.gz`, zlib.gzipSync(Buffer.from(`${JSON.stringify(report, null, 2)}\n`)));
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);
