#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round583 } from './round583-question-bank-interaction-a11y-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round583-question-bank-interaction-a11y-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round583 QA from /Volumes/mac_2T during lifs isolation.');
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

function walkHtml(relDir) {
  const dir = abs(relDir);
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && entry.name === 'index.html') out.push(path.relative(repoRoot, full));
    }
  }
  return out.sort();
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

const ledger = readJson('data/fluid-round583-question-bank-interaction-a11y-ledger.json');
const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const questionBankHtml = readText('modules/question-bank.html');
const questionBankData = readText('modules/question-bank-data.js');
const questionBankPractice = readText('modules/question-bank-practice.js');
const homeHtml = readText('question-bank-home.html');
const indexHtml = readText('index.html');
const realExamsHtml = readText('modules/real-exams-dynamic.html');
const apiAuthMe = readText('api/auth/me/index.html');
const middleware = readText('functions/_middleware.js');
const materialPages = walkHtml('resources/fluid-181103-html/materials');
const materialTexts = materialPages.map((rel) => readText(rel));
const authGuards = ['auth-guard.js', 'modules/auth-guard.js', 'modules/js/security/auth-guard.js'].map((rel) => readText(rel));
const practiceDialogStart = questionBankData.indexOf('content.innerHTML = `');
const practiceDialogEnd = questionBankData.indexOf('dialog.appendChild(content)', practiceDialogStart);
const practiceDialogTemplate = practiceDialogStart >= 0 && practiceDialogEnd > practiceDialogStart
  ? questionBankData.slice(practiceDialogStart, practiceDialogEnd)
  : '';

check('Round583 ledger is UI-only and content-neutral', ledger.ok === true
  && ledger.version === round583.version
  && ledger.previousVersion === round583.previousVersion
  && ledger.uiOnlyUpgrade === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.changedQuestionBankContent === false
  && ledger.changedQuestionBankStructure === false
  && ledger.noRouteRemoved === true
  && ledger.noCountReduced === true
  && ledger.boundary?.contentFrontier === 'round579-real-exam-answer-depth-twelfth-pass-20260629', {
  version: ledger.version,
  boundary: ledger.boundary
});

check('Round583 JSON gzip sidecars match', [
  'data/fluid-round583-question-bank-interaction-a11y-ledger.json',
  'site-updates.json',
  'data/fluid-upgrade-roadmap-100.json'
].every(gzipMatches), {});

check('site updates and roadmap current gates point to Round583', siteUpdates[0]?.version === round583.version
  && siteUpdates[0]?.boundary?.interactionA11yOnly === true
  && roadmap.version === round583.version
  && roadmap.currentVersion === round583.version
  && roadmap.currentReleaseVersion === round583.version
  && roadmap.currentRound === round583.round
  && roadmap.latestRelease?.version === round583.version
  && roadmap.releaseGate?.expectedVersion === round583.version
  && roadmap.release?.currentVersion === round583.version
  && roadmap.round583QuestionBankInteractionA11y === true
  && (roadmap.releaseGate?.commands || []).slice(0, 4).every((command) => /round583|round579-real-exam/.test(command))
  && !(roadmap.releaseGate?.commands || []).some((command) => /expected-version round5[0-9][0-9]|expected-edge-version round5[0-9][0-9]|round55[0-9]|round56[0-9]/.test(command)), {
  siteTop: siteUpdates[0]?.version,
  roadmapVersion: roadmap.version,
  commands: roadmap.releaseGate?.commands?.slice(0, 8)
});

const metricsOk = ledger.metrics?.materialHtmlPages181103 === 38
  && ledger.metrics?.sourceHtmlCards181103 === 522
  && ledger.metrics?.referencePracticeRows181103 === 400
  && ledger.metrics?.sourceClueOnlyRows181103 === 122
  && ledger.metrics?.proofDepthRows181103 === 422
  && ledger.metrics?.proofDepthSecondPassRows181103 === 8
  && ledger.metrics?.realExamAnswerDepthRows === 163
  && ledger.metrics?.realExamOriginalAtomicRows === 325
  && ledger.metrics?.groupedRealExamRows === 68
  && ledger.metrics?.strictAnswerPdfProofRows === 0
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === 163
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0;
check('Round583 content counts remain unchanged from Round582', metricsOk, {
  ledgerMetrics: ledger.metrics,
  siteMetrics: siteUpdates[0]?.metrics
});

check('current public surfaces expose Round583 and not stale visible labels', [
  questionBankHtml,
  questionBankData,
  homeHtml,
  indexHtml,
  realExamsHtml,
  apiAuthMe,
  middleware,
  ...authGuards
].every((text) => text.includes(round583.version))
  && ![
    indexHtml,
    realExamsHtml,
    homeHtml,
    apiAuthMe,
    questionBankHtml,
    questionBankData,
    middleware
  ].join('\n').includes('Round581 · round583')
  && !apiAuthMe.includes('round555-181103-proof-depth-upgrade-20260628'), {});

check('question-bank interaction and a11y markers are wired', round583.selectors.every((snippet) => questionBankHtml.includes(snippet) || questionBankData.includes(snippet) || questionBankPractice.includes(snippet))
  && [
    'function prefersReducedMotion()',
    'function safeScrollIntoView',
    'function escapeInlineJsonArg',
    'function cancelPendingSearchFilter',
    'let searchFilterGeneration = 0',
    'const smartSearchInput = document.getElementById',
    'favorite-manager-actions',
    '.practice-fullscreen .control-panel button[onclick*="changeFontSize"]',
    'min-width: 44px !important',
    'white-space:pre-line',
    'while(container.children.length>=3)',
    "html{scroll-behavior:auto!important}",
    "aria-expanded=\"false\""
  ].every((snippet) => questionBankHtml.includes(snippet) || questionBankData.includes(snippet) || questionBankPractice.includes(snippet)), {});

check('unsafe favorite/practice interpolation and raw smooth scroll are removed', !/QuestionBankData\.[A-Za-z0-9_]+\('\$\{bank\.id\}'\)/.test(questionBankData)
  && !practiceDialogTemplate.includes('题库: ${bank.name}')
  && !/window\.event/.test(questionBankHtml)
  && !/behavior:\s*['"]smooth['"]/.test(questionBankHtml + questionBankData)
  && !/data-bank-id="\$\{targetBank\.id\}"/.test(questionBankData), {});

check('181103 practice entry still excludes source clue cards', /function is181103CurrentPracticeQuestion[\s\S]*kind === 'source-content-card'[\s\S]*defaultPracticeEligible === true[\s\S]*practiceEntryEnabled === true[\s\S]*defaultHidden === false/.test(questionBankData)
  && /function is181103SourceClueOnly[\s\S]*get181103CardKind\(question\) === 'source-content-card'[\s\S]*!is181103CurrentPracticeQuestion\(question\)/.test(questionBankData)
  && /getDefaultPracticeQuestions[\s\S]*return questions\.filter\(is181103CurrentPracticeQuestion\)/.test(questionBankData)
  && /startFullPractice[\s\S]*defaultPracticeQuestions[\s\S]*已阻止退回全量来源卡或旧真题入口/.test(questionBankData)
  && /startAllMaterialPractice[\s\S]*const practiceQuestions = bankData\.defaultPracticeQuestions[\s\S]*sourceSemanticVerified/.test(questionBankData)
  && /startRandomPractice[\s\S]*const pool = bankData\.defaultPracticeQuestions[\s\S]*\? bankData\.defaultPracticeQuestions/.test(questionBankData)
  && ledger.practiceBoundary?.randomAndFullPracticeUseDefaultPracticeRowsOnly === true, {
  practiceBoundary: ledger.practiceBoundary
});

check('visible content boundary strings remain current', [
  '400 可参考',
  '122 条源文线索',
  '422 道',
  'Round577 二次重证 8 道',
  '163 深补',
  'strictAnswerPdfProof 仍为 0',
  'strictAnswerPdfProof=0',
  '不是官方原卷逐字答案'
].every((snippet) => [
  homeHtml,
  questionBankHtml,
  indexHtml,
  realExamsHtml
].join('\n').includes(snippet))
  && !/(145 深补|153 深补|真题深度补答累计 145|381 练习|141 源文|132 条参考答案页)/.test([
    homeHtml,
    questionBankHtml,
    indexHtml,
    realExamsHtml
  ].join('\n')), {});

check('38 material pages are synced to Round583', materialPages.length === 38
  && materialTexts.every((text) => text.includes(round583.version))
  && materialTexts.every((text) => !text.includes(round583.materialLegacyVersion))
  && ledger.materialSubpagesSynced === 38, {
  materialPages: materialPages.length,
  materialSubpagesSynced: ledger.materialSubpagesSynced
});

const payload = {
  ok: checks.every((row) => row.pass),
  version: round583.version,
  previousVersion: round583.previousVersion,
  generatedAt: new Date().toISOString(),
  checks
};

fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`);
console.log(JSON.stringify(payload, null, 2));
if (!payload.ok) process.exit(1);
