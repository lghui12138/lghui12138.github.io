#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round570, realExamUpgrades, proofDepthRewrites181103 } from './round570-answer-depth-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round570 apply from /Volumes/mac_2T during lifs isolation.');
}

function abs(rel) {
  return path.join(repoRoot, rel);
}

function readText(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function writeText(rel, text) {
  fs.writeFileSync(abs(rel), text);
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function writeJson(rel, data) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  writeText(rel, text);
  fs.writeFileSync(abs(`${rel}.gz`), zlib.gzipSync(Buffer.from(text)));
}

function writeJsonPlain(rel, data) {
  writeText(rel, `${JSON.stringify(data, null, 2)}\n`);
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function preview(value, length = 220) {
  const text = stripHtml(value);
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function answerToHtml(value) {
  return escapeHtml(value).replace(/\n/g, '<br>');
}

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function scoreAnswer(text) {
  const raw = String(text || '');
  const plain = stripHtml(raw);
  return {
    chars: plain.length,
    formulaCount: (raw.match(/\\\(|\\\)|\\\[|\\\]|\\frac|\\nabla|\\partial|=|<|>|_|\^|\\rho|\\mu|\\nu|Re|Fr|\\omega|\\theta|\\int|\\sum|\\Gamma|\\Phi|\\Psi|\\psi|\\delta|\\tau|\\Omega/g) || []).length,
    proofSignalCount: (plain.match(/设|取|由|因为|所以|因此|代入|积分|边界|条件|检查|结论|证明|可得|推出|假设|满足|比较|令|通解|定义|分解|守恒|移到|说明|整理|排除/g) || []).length
  };
}

function yearFromRealExamId(id) {
  const match = id.match(/^ocean-(\d{4})-/);
  if (!match) throw new Error(`Cannot parse year from ${id}`);
  return match[1];
}

function mutateRealExamRows() {
  const packsByYear = new Map();
  const touchedRows = [];

  for (const upgrade of realExamUpgrades) {
    const year = yearFromRealExamId(upgrade.id);
    if (!packsByYear.has(year)) {
      packsByYear.set(year, readJson(`question-banks/real-exam-years/${year}.json`));
    }
    const pack = packsByYear.get(year);
    const row = (pack.questions || []).find((item) => item.id === upgrade.id);
    if (!row) throw new Error(`Missing real-exam row ${upgrade.id}`);

    const answer = upgrade.referenceAnswer.trim();
    Object.assign(row, {
      answer,
      referenceAnswer: answer,
      explanation: upgrade.diagnosis,
      answerVerificationStatus: 'verified-derived-correct',
      answerTrustState: 'reference-answer-derived-verified',
      answerTrustLabel: '参考答案（独立推导已核）',
      answerReviewBoundary: 'independent-derivation-verified-not-original-answer-pdf-proof',
      answerVerificationMethod: 'independent-derivation',
      answerQuality: 'process-reference-answer',
      strictAnswerPdfProof: false,
      round570AnswerDepthUpgrade: true,
      round570AnswerDepthUpgradeAt: now,
      round570AnswerDepthUpgradeVersion: round570.version,
      round570AnswerDepthDiagnosis: upgrade.diagnosis,
      round570AnswerDepthBoundaryNote: upgrade.boundaryNote,
      answerSource: {
        type: 'derived-reference',
        status: 'verified-derived-correct',
        strictAnswerPdfProof: false,
        boundary: 'Round570 derived reference answer; not strict original answer-PDF span/bbox/hash proof.',
        independentVerification: {
          version: round570.version,
          checkedAt: now,
          diagnosis: upgrade.diagnosis,
          boundaryNote: upgrade.boundaryNote
        }
      }
    });
    touchedRows.push({
      id: upgrade.id,
      year: Number(year),
      title: row.title,
      type: row.type,
      score: scoreAnswer(answer)
    });
  }

  for (const [year, pack] of packsByYear.entries()) {
    writeJsonPlain(`question-banks/real-exam-years/${year}.json`, pack);
  }

  return touchedRows;
}

function mutateAnswerChecks() {
  const checks = readJson('data/fluid-question-answer-checks.json');
  checks.answerChecksById ||= {};
  checks.answerChecksByChapter ||= {};

  for (const upgrade of realExamUpgrades) {
    const year = Number(yearFromRealExamId(upgrade.id));
    const yearPack = readJson(`question-banks/real-exam-years/${year}.json`);
    const question = (yearPack.questions || []).find((row) => row.id === upgrade.id);
    const answer = upgrade.referenceAnswer.trim();
    const existingKeys = Object.entries(checks.answerChecksById)
      .filter(([, row]) => row?.questionId === upgrade.id)
      .map(([key]) => key);
    const keys = existingKeys.length ? existingKeys : [`${upgrade.id}-round570-answer-depth`];

    for (const key of keys) {
      const previous = checks.answerChecksById[key] || {};
      const row = {
        ...previous,
        id: previous.id || key,
        starterId: previous.starterId || `${upgrade.id}-round570`,
        questionId: upgrade.id,
        year,
        type: question?.type || previous.type || '真题',
        title: question?.title || previous.title || upgrade.id,
        url: previous.url || `./real-exams-dynamic.html?year=${year}&q=${encodeURIComponent(upgrade.id)}`,
        answer,
        referenceAnswer: answer,
        answerPreview: preview(answer, 260),
        explanation: upgrade.diagnosis,
        explanationPreview: preview(upgrade.diagnosis, 180),
        strictAnswerPdfProof: false,
        answerTrustState: 'reference-answer-derived-verified',
        answerTrustLabel: '参考答案（独立推导已核）',
        answerReviewBoundary: 'independent-derivation-verified-not-original-answer-pdf-proof',
        round570AnswerDepthUpgrade: true,
        round570AnswerDepthUpgradeAt: now,
        round570AnswerDepthUpgradeVersion: round570.version,
        round570AnswerDepthDiagnosis: upgrade.diagnosis,
        round570AnswerDepthBoundaryNote: upgrade.boundaryNote
      };
      checks.answerChecksById[key] = row;

      const chapterKey = String(row.chapter || previous.chapter || 'real-exam');
      checks.answerChecksByChapter[chapterKey] ||= [];
      const chapterRows = checks.answerChecksByChapter[chapterKey];
      const idx = chapterRows.findIndex((item) => item.id === row.id || item.questionId === row.questionId);
      if (idx >= 0) chapterRows[idx] = row;
      else chapterRows.push(row);
    }
  }

  checks.version = round570.version;
  checks.generatedAt = now;
  checks.source = 'round570-answer-depth-eighth-pass';
  checks.answerCheckCount = Object.keys(checks.answerChecksById).length;
  writeJson('data/fluid-question-answer-checks.json', checks);
}

function mutate181103Rows() {
  const bank = readJson('question-banks/181103-material-extracted.json');
  const touchedRows = [];

  for (const upgrade of proofDepthRewrites181103) {
    const row = bank.find((item) => item.id === upgrade.id);
    if (!row) throw new Error(`Missing 181103 row ${upgrade.id}`);
    const answer = upgrade.referenceAnswer.trim();
    const answerHtml = answer;
    Object.assign(row, {
      answer,
      referenceAnswer: answer,
      answerHtml,
      referenceAnswerHtml: answerHtml,
      explanation: upgrade.diagnosis,
      noOriginalAnswerClaim: true,
      defaultPracticeEligible: true,
      practiceEntryEnabled: true,
      answerTrustState: 'reference-answer-ready',
      answerTrustLabel: '参考答案',
      answerUiStatus: 'reference-answer-ready',
      answerQuality: 'proof-depth-reference-answer',
      answerReviewBoundary: 'proof-depth-rewritten',
      strictAnswerPdfProof: false,
      sourceClueLabeled: false,
      round570ProofDepthRewrite: true,
      round570ProofDepthRewriteAt: now,
      round570ProofDepthRewriteVersion: round570.version,
      round570ProofDepthDiagnosis: upgrade.diagnosis,
      round570ProofDepthBoundaryNote: upgrade.boundaryNote
    });
    row.qualityFlags = Array.from(new Set([...(row.qualityFlags || []), 'round570-proof-depth-rewritten']));
    touchedRows.push({
      id: upgrade.id,
      title: row.title,
      type: row.type,
      htmlPath: row.round372SourceMaterialHtmlPath || row.sourceRelPath || row.sourceHtmlUrl,
      score: scoreAnswer(answer)
    });
  }

  writeJson('question-banks/181103-material-extracted.json', bank);
  return touchedRows;
}

function replace181103ArticleAnswer(rel, id, answer) {
  let html = readText(rel);
  const articleStart = html.indexOf(`<article class="material-question-card" id="${id}"`);
  if (articleStart < 0) throw new Error(`Cannot find article ${id} in ${rel}`);
  const detailStart = html.indexOf('<details open class="material-question-card__answer"', articleStart);
  if (detailStart < 0) throw new Error(`Cannot find answer details ${id} in ${rel}`);
  const detailEnd = html.indexOf('</details>', detailStart);
  if (detailEnd < 0) throw new Error(`Cannot find answer details end ${id} in ${rel}`);
  const replacement = `<details open class="material-question-card__answer" data-181103-answer-html="1" data-round388-reference-answer-visible="1" data-round399-answer-default-visible="1" data-round399-answer-discoverable="1" aria-label="参考答案默认展开" data-round420-answer-trust-state="reference-answer-ready"><summary>参考答案（Round570 proof-depth 重证，默认展开，可收起）</summary><div data-round388-reference-answer-body="1">${answerToHtml(answer)}</div></details>`;
  html = `${html.slice(0, detailStart)}${replacement}${html.slice(detailEnd + '</details>'.length)}`;
  writeText(rel, html);
}

function mutate181103Html() {
  for (const upgrade of proofDepthRewrites181103) {
    const bank = readJson('question-banks/181103-material-extracted.json');
    const row = bank.find((item) => item.id === upgrade.id);
    const rel = row?.round372SourceMaterialHtmlPath || row?.sourceRelPath || row?.sourceHtmlUrl;
    if (!rel || !rel.endsWith('.html')) throw new Error(`Missing source HTML path for ${upgrade.id}`);
    replace181103ArticleAnswer(rel, upgrade.id, upgrade.referenceAnswer.trim());
  }
}

function updateQuestionBankIndex() {
  const index = readJson('question-banks/index.json');
  index.version = round570.version;
  index.currentEntryVersion = round570.version;
  index.updatedAt = now;
  index.lastUpdated = now;
  index.material181103CurrentWebsitePracticeQuestionCount = 400;
  index.material181103CurrentWebsiteSourceContentCardCount = 122;

  for (const statsKey of ['statistics', 'stats']) {
    if (!index[statsKey]) continue;
    for (const key of Object.keys(index[statsKey])) {
      if (/material181103.*PracticeQuestionCount/.test(key) || /material181103.*PracticeCount/.test(key)) {
        index[statsKey][key] = 400;
      }
      if (/material181103.*SourceContentCardCount/.test(key)) {
        index[statsKey][key] = 122;
      }
    }
    index[statsKey].lastUpdated = now;
    index[statsKey].updatedAt = now;
  }

  const bank = (index.questionBanks || []).find((item) => item.id === '181103-material-extracted');
  if (bank) {
    bank.description = '181103 资料内 522 条来源卡已按原文语义逐条复核；400 道默认练习题已进入刷题且均可直接看参考答案，0 道保留待人工源页复核，122 条参考答案页、解答续页、标题、父卡或讲义正文仅作资料线索卡，不再混作题目。';
    bank.defaultPracticeQuestionCount = 400;
    bank.currentEntryVersion = round570.version;
    bank.lastUpdated = now;
    bank.tags = (bank.tags || []).map((tag) => replaceAll(replaceAll(String(tag), '381', '400'), '141', '122'));
    for (const [key, value] of Object.entries(bank)) {
      if (/PracticeQuestionCount|defaultPracticeQuestionCount/.test(key) && value === 381) bank[key] = 400;
      if (/SourceContentCardCount/.test(key) && value === 141) bank[key] = 122;
    }
  }

  writeJson('question-banks/index.json', index);
}

function updateLedgers(realRows, proofRows) {
  const realReport = {
    ok: true,
    version: round570.version,
    previousVersion: round570.previousVersion,
    generatedAt: now,
    upgradedRows: realExamUpgrades.length,
    upgradedIds: realExamUpgrades.map((item) => item.id),
    cumulativeAnswerDepthRows: round570.realExamCumulativeAnswerDepthRows,
    previousCumulativeAnswerDepthRows: round570.realExamPreviousAnswerDepthRows,
    strictAnswerPdfProofRows: round570.strictAnswerPdfProofRows,
    failedIds: [],
    rows: realRows
  };
  writeJson('data/fluid-round570-real-exam-answer-depth-upgrade.json', realReport);

  const proofReport = {
    ok: true,
    version: round570.version,
    previousVersion: round570.previousVersion,
    generatedAt: now,
    rewrittenRows: proofDepthRewrites181103.length,
    rewrittenIds: proofDepthRewrites181103.map((item) => item.id),
    cumulativeProofDepthRows: round570.proofDepthRows181103,
    cumulativePracticeRows: round570.referencePracticeRows181103,
    cumulativeSourceClueRows: round570.sourceClueOnlyRows181103,
    strictAnswerPdfProofRows: round570.strictAnswerPdfProofRows,
    failedIds: [],
    rows: proofRows
  };
  writeJson('data/fluid-round570-181103-proof-depth-rewrite.json', proofReport);

  const continuation = {
    ok: true,
    version: round570.version,
    previousVersion: round570.previousVersion,
    generatedAt: now,
    summary: {
      rewrittenRows: proofDepthRewrites181103.length,
      rewrittenIds: proofDepthRewrites181103.map((item) => item.id),
      proofDepthRows: round570.proofDepthRows181103,
      practiceRows: round570.referencePracticeRows181103,
      sourceClueRows: round570.sourceClueOnlyRows181103,
      strictAnswerPdfProofRows: round570.strictAnswerPdfProofRows,
      boundary: 'Round570 re-deepens existing 181103 reference-answer-ready rows; strict answer-PDF proof remains separate at 0.'
    }
  };
  writeJson('data/fluid-round570-181103-proof-depth-continuation-ledger.json', continuation);
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round570.version,
    previousVersion: round570.previousVersion,
    date: '2026-06-29',
    title: 'Round570：12 道真题过程补答，6 道 181103 证明重证，入口旧数清理',
    summary: '本轮补强 12 道历年真题过程型参考答案，并重证 6 道 181103 证明/推导题，把假设、方程、边界/符号、变形和结论检查写全。题库入口继续沿工作台样式压缩空白，同时同步索引中的 400/122 当前口径，清理 381/141 旧词条。strictAnswerPdfProof 仍为 0，不把派生参考答案冒充为原卷答案 PDF 逐字证据。',
    links: [
      { label: '真题补答记录', href: '/data/fluid-round570-real-exam-answer-depth-upgrade.json' },
      { label: '181103 proof-depth 重证记录', href: '/data/fluid-round570-181103-proof-depth-rewrite.json' },
      { label: '题库入口', href: `/question-bank-home.html?edge_refresh=${round570.version}` }
    ],
    metrics: {
      realExamAnswerDepthRows: round570.realExamCumulativeAnswerDepthRows,
      proofDepthRows: round570.proofDepthRows181103,
      proofDepthRewriteRows: proofDepthRewrites181103.length,
      referencePracticeRows: round570.referencePracticeRows181103,
      sourceClueOnlyRows: round570.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round570.strictAnswerPdfProofRows
    },
    boundary: {
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true
    }
  };
  updates.unshift(top);
  writeJson('site-updates.json', updates);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  roadmap.version = round570.version;
  roadmap.currentVersion = round570.version;
  roadmap.currentReleaseVersion = round570.version;
  roadmap.previousVersion = round570.previousVersion;
  roadmap.currentRound = 570;
  roadmap.lastIntegratedRound = 570;
  roadmap.lastUpdatedAt = now;
  roadmap.updatedAt = now;
  roadmap.lastUpdated = now;
  roadmap.latestRelease = {
    version: round570.version,
    round: 570,
    previousVersion: round570.previousVersion,
    summary: 'Round570 upgrades 12 real-exam process answers, re-proves 6 existing 181103 proof-depth rows, and syncs current 400/122 entry counts.'
  };
  roadmap.releaseGate ||= {};
  roadmap.releaseGate.currentVersion = round570.version;
  roadmap.releaseGate.expectedVersion = round570.version;
  roadmap.releaseGate.previousVersion = round570.previousVersion;
  roadmap.releaseGate.currentRound = 570;
  roadmap.releaseGate.lastUpdated = now;
  roadmap.releaseGate.commands = [
    'node tools/apply-round570-answer-depth-eighth-pass.mjs',
    'node tools/check-round570-answer-depth-eighth-pass.mjs',
    'node tools/check-round570-question-bank-home-visual.mjs',
    'node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version round570-answer-depth-eighth-pass-proof-ui-sync-20260629',
    'node tools/check-authenticated-browser-gate.mjs --json --production --expected-version round570-answer-depth-eighth-pass-proof-ui-sync-20260629',
    ...(roadmap.releaseGate.commands || [])
  ];
  roadmap.round570AnswerDepthRows = realExamUpgrades.length;
  roadmap.round570ProofDepthRewriteRows = proofDepthRewrites181103.length;
  roadmap.proofDepthRows = round570.proofDepthRows181103;
  roadmap.strictAnswerPdfProof = round570.strictAnswerPdfProofRows;
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

function updateCurrentPages() {
  const currentFiles = [
    'question-bank-home.html',
    'index.html',
    'index-complete.html',
    'resources.html',
    'modules/question-bank.html',
    'modules/real-exams-dynamic.html',
    'modules/wang-hongwei-fluid-reading.html',
    'modules/wu-wangyi-fluid-reading.html',
    'teacher-panel.html',
    'modules/practice-dynamic.html',
    'functions/_middleware.js',
    'js/edge-fluid-learning-upgrade.js'
  ];

  for (const rel of currentFiles) {
    let text = readText(rel);
    text = replaceAll(text, round570.previousVersion, round570.version);
    text = replaceAll(text, 'Round569', 'Round570');
    text = replaceAll(text, 'round569', 'round570');
    text = replaceAll(text, '真题补答 <strong>110</strong>', '真题补答 <strong>122</strong>');
    text = replaceAll(text, '真题补答 110', '真题补答 122');
    text = replaceAll(text, '110 深补', '122 深补');
    text = replaceAll(text, '110 道已做过程型补答', '122 道已做过程型补答');
    text = replaceAll(text, '<dt>真题补答</dt><dd>110 道</dd>', '<dt>真题补答</dt><dd>122 道</dd>');
    text = replaceAll(text, '累计 110 道历年真题', '累计 122 道历年真题');
    text = replaceAll(text, '本轮新增 6 道', '本轮新增 12 道');
    text = replaceAll(text, '新增证明深修 5 道，真题深度补答累计 110 道', '重证 6 道 181103 推导题，真题深度补答累计 122 道');
    text = replaceAll(text, '真题短答案继续加深', '真题短答案继续加深');
    text = replaceAll(text, '重证 <strong>5</strong>', '重证 <strong>6</strong>');
    text = replaceAll(text, '重证 5', '重证 6');
    text = replaceAll(text, '重写薄证明 5 道', '重证薄证明 6 道');
    text = replaceAll(text, '重写 5 道', '重证 6 道');
    text = replaceAll(text, '补强 6 道历年真题', '补强 12 道历年真题');
    text = replaceAll(text, 'Proof</dt><dd>422 / 重证 5', 'Proof</dt><dd>422 / 重证 6');
    text = replaceAll(text, '新增证明记录<span>Round570 / 重证 5；总 422</span>', '新增证明记录<span>Round570 / 重证 6；总 422</span>');
    text = replaceAll(text, '证明深修截至 Round570 共 422 道', '证明深修截至 Round570 共 422 道');
    text = replaceAll(text, '381练习 381可参考 0待复核 141线索', '400练习 400可参考 0待复核 122线索');
    text = replaceAll(text, '独立题干381', '独立题干400');
    text = replaceAll(text, '资料线索141', '资料线索122');
    text = replaceAll(text, '381可参考', '400可参考');
    text = replaceAll(text, '381+0', '400+0');
    writeText(rel, text);
  }
}

const realRows = mutateRealExamRows();
mutateAnswerChecks();
const proofRows = mutate181103Rows();
mutate181103Html();
updateQuestionBankIndex();
updateLedgers(realRows, proofRows);
updateSiteUpdates();
updateRoadmap();
updateCurrentPages();

console.log(JSON.stringify({
  ok: true,
  version: round570.version,
  previousVersion: round570.previousVersion,
  generatedAt: now,
  realExamUpgraded: realExamUpgrades.map((item) => item.id),
  proofDepthRewritten181103: proofDepthRewrites181103.map((item) => item.id),
  cumulative: {
    realExamAnswerDepthRows: round570.realExamCumulativeAnswerDepthRows,
    proofDepthRows181103: round570.proofDepthRows181103,
    referencePracticeRows181103: round570.referencePracticeRows181103,
    sourceClueOnlyRows181103: round570.sourceClueOnlyRows181103,
    strictAnswerPdfProofRows: round570.strictAnswerPdfProofRows
  }
}, null, 2));
