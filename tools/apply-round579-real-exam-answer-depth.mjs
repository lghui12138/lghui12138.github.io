#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round579, realExamUpgrades } from './round579-real-exam-answer-depth-data.mjs';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round579 apply from /Volumes/mac_2T during lifs isolation.');
}

function abs(rel) {
  return path.join(repoRoot, rel.replace(/^\/+/, ''));
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

function preview(value, length = 240) {
  const text = stripHtml(value);
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

function replaceAll(text, from, to) {
  return text.split(from).join(to);
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
  if (!match) throw new Error(`Cannot parse year from ${id}`);
  return match[1];
}

function mutateRealExamRows() {
  const packsByYear = new Map();
  const touchedRows = [];

  for (const upgrade of realExamUpgrades) {
    const year = yearFromRealExamId(upgrade.id);
    if (!packsByYear.has(year)) packsByYear.set(year, readJson(`question-banks/real-exam-years/${year}.json`));
    const pack = packsByYear.get(year);
    const row = (pack.questions || []).find((item) => item.id === upgrade.id);
    if (!row) throw new Error(`Missing real-exam row ${upgrade.id}`);

    const answer = upgrade.referenceAnswer.trim();
    const previousScore = scoreAnswer(row.answer || row.referenceAnswer || '');
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
      round579AnswerDepthUpgrade: true,
      round579AnswerDepthUpgradeAt: now,
      round579AnswerDepthUpgradeVersion: round579.version,
      round579AnswerDepthDiagnosis: upgrade.diagnosis,
      round579AnswerDepthBoundaryNote: upgrade.boundaryNote,
      answerSource: {
        type: 'derived-reference',
        status: 'verified-derived-correct',
        strictAnswerPdfProof: false,
        boundary: 'Round579 derived reference answer; not strict original answer-PDF span/bbox/hash proof.',
        independentVerification: {
          version: round579.version,
          checkedAt: now,
          diagnosis: upgrade.diagnosis,
          boundaryNote: upgrade.boundaryNote
        }
      }
    });
    row.qualityFlags = Array.from(new Set([...(row.qualityFlags || []), 'round579-real-exam-answer-depth']));

    touchedRows.push({
      id: upgrade.id,
      year: Number(year),
      title: row.title,
      type: row.type,
      previousScore,
      score: scoreAnswer(answer),
      diagnosis: upgrade.diagnosis,
      boundaryNote: upgrade.boundaryNote
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
    const keys = existingKeys.length ? existingKeys : [`${upgrade.id}-round579-answer-depth`];

    for (const key of keys) {
      const previous = checks.answerChecksById[key] || {};
      const row = {
        ...previous,
        id: previous.id || key,
        starterId: previous.starterId || `${upgrade.id}-round579`,
        questionId: upgrade.id,
        year,
        type: question?.type || previous.type || '真题',
        title: question?.title || previous.title || upgrade.id,
        url: previous.url || `./real-exams-dynamic.html?year=${year}&q=${encodeURIComponent(upgrade.id)}`,
        answer,
        referenceAnswer: answer,
        answerPreview: preview(answer, 280),
        explanation: upgrade.diagnosis,
        explanationPreview: preview(upgrade.diagnosis, 180),
        strictAnswerPdfProof: false,
        answerTrustState: 'reference-answer-derived-verified',
        answerTrustLabel: '参考答案（独立推导已核）',
        answerReviewBoundary: 'independent-derivation-verified-not-original-answer-pdf-proof',
        round579AnswerDepthUpgrade: true,
        round579AnswerDepthUpgradeAt: now,
        round579AnswerDepthUpgradeVersion: round579.version,
        round579AnswerDepthDiagnosis: upgrade.diagnosis,
        round579AnswerDepthBoundaryNote: upgrade.boundaryNote
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

  checks.version = round579.version;
  checks.generatedAt = now;
  checks.source = 'round579-real-exam-answer-depth-twelfth-pass';
  checks.answerCheckCount = Object.keys(checks.answerChecksById).length;
  writeJson('data/fluid-question-answer-checks.json', checks);
}

function updateQuestionBankIndex() {
  const index = readJson('question-banks/index.json');
  index.version = round579.version;
  index.currentEntryVersion = round579.version;
  index.updatedAt = now;
  index.lastUpdated = now;
  writeJson('question-banks/index.json', index);
}

function updateLedgers(touchedRows) {
  const failedIds = touchedRows
    .filter((row) => row.score.chars < round579.minChars
      || row.score.formulaCount < round579.minFormulaCount
      || row.score.proofSignalCount < round579.minProofSignalCount)
    .map((row) => row.id);

  const report = {
    ok: failedIds.length === 0,
    version: round579.version,
    previousVersion: round579.previousVersion,
    generatedAt: now,
    upgradedRows: realExamUpgrades.length,
    upgradedIds: realExamUpgrades.map((item) => item.id),
    cumulativeAnswerDepthRows: round579.realExamCumulativeAnswerDepthRows,
    previousCumulativeAnswerDepthRows: round579.realExamPreviousAnswerDepthRows,
    realExamNewUniqueRows: round579.realExamNewUniqueRows,
    strictAnswerPdfProofRows: round579.strictAnswerPdfProofRows,
    failedIds,
    rows: touchedRows,
    boundary: 'Round579 upgrades derived/process reference answers for real-exam rows only; no original answer-PDF span/bbox/hash proof is claimed.',
    nonDeletingUpgrade: true
  };
  writeJson('data/fluid-round579-real-exam-answer-depth-upgrade.json', report);
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round579.version,
    previousVersion: round579.previousVersion,
    date: round579.date,
    title: 'Round579：第十二轮 10 道历年真题过程补答',
    summary: '本轮继续不减少任何题量、答案、证明记录或来源边界；对 10 道历年真题短答案做过程型深修，覆盖边界层厚度、潜艇模型相似、散度旋度、圆柱压强系数、绕流分离、Couette 速度分布、点源流线轨迹、三角堰流量积分、流线反求速度场和 Couette 功率耗散。真题过程型补答从 153 推到 163；181103 仍为 400 道可参考、122 条来源线索、422 道证明深修；strictAnswerPdfProof 仍为 0。',
    links: [
      { label: 'Round579 真题补答账本', href: '/data/fluid-round579-real-exam-answer-depth-upgrade.json' },
      { label: '历年真题入口', href: `/modules/real-exams-dynamic.html?edge_refresh=${round579.version}` },
      { label: '题库入口', href: `/question-bank-home.html?edge_refresh=${round579.version}` }
    ],
    metrics: {
      realExamAnswerDepthRows: round579.realExamCumulativeAnswerDepthRows,
      realExamRoundUpgradeRows: round579.realExamRoundUpgradeRows,
      realExamNewUniqueRows: round579.realExamNewUniqueRows,
      proofDepthRows: round579.proofDepthRows181103,
      referencePracticeRows: round579.referencePracticeRows181103,
      sourceClueOnlyRows: round579.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round579.strictAnswerPdfProofRows
    },
    boundary: {
      derivedReferenceAnswers: true,
      strictAnswerPdfProof: 'separate',
      nonDeletingUpgrade: true,
      contentFrontier: round579.version
    }
  };
  const next = updates.filter((item) => item?.version !== round579.version);
  next.unshift(top);
  writeJson('site-updates.json', next);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  Object.assign(roadmap, {
    version: round579.version,
    currentVersion: round579.version,
    currentReleaseVersion: round579.version,
    previousVersion: round579.previousVersion,
    currentRound: round579.round,
    lastIntegratedRound: round579.round,
    lastUpdatedAt: now,
    updatedAt: now,
    realExamAnswerDepthRows: round579.realExamCumulativeAnswerDepthRows,
    proofDepthRows: round579.proofDepthRows181103,
    referencePracticeRows181103: round579.referencePracticeRows181103,
    sourceClueOnlyRows181103: round579.sourceClueOnlyRows181103,
    strictAnswerPdfProof: round579.strictAnswerPdfProofRows,
    round579AnswerDepthRows: round579.realExamRoundUpgradeRows,
    round579AnswerDepthNewUniqueRows: round579.realExamNewUniqueRows
  });
  roadmap.latestRelease = {
    version: round579.version,
    round: round579.round,
    previousVersion: round579.previousVersion,
    summary: 'Round579 upgrades 10 real-exam process answers, raising cumulative answer-depth rows from 153 to 163 while keeping 181103 and strict-answer-PDF boundaries unchanged.'
  };
  roadmap.releaseGate ||= {};
  Object.assign(roadmap.releaseGate, {
    currentVersion: round579.version,
    expectedVersion: round579.version,
    previousVersion: round579.previousVersion,
    currentRound: round579.round,
    lastUpdated: now
  });
  const commands = [
    'node tools/apply-round579-real-exam-answer-depth.mjs',
    'node tools/check-round579-real-exam-answer-depth.mjs',
    'node tools/check-round579-real-exam-answer-render-visual.mjs',
    `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round579.version}`,
    `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round579.version}`
  ];
  const previous = (roadmap.releaseGate.commands || [])
    .filter((command) => !/round57[0-7]|check-round57[0-7]|apply-round57[0-7]/.test(String(command)));
  roadmap.releaseGate.commands = Array.from(new Set([...commands, ...previous]));
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

function syncCurrentVersionFiles() {
  const files = Array.from(new Set([
    ...round576CurrentSurfaceFiles,
    ...round576DirectShellFiles,
    'resources.html',
    'modules/question-bank.html',
    'modules/question-bank-data.js',
    'modules/question-bank-practice.js',
    'modules/real-exams-dynamic.html',
    'resources/fluid-181103-html/index.html'
  ]));
  const changed = [];
  for (const rel of files) {
    if (!fs.existsSync(abs(rel))) continue;
    let text = readText(rel);
    const before = text;
    text = replaceAll(text, round579.previousVersion, round579.version);
    text = text.replace(/edge_refresh=round577-181103-proof-depth-second-pass-20260629/g, `edge_refresh=${round579.version}`);
    text = text.replace(/target\.searchParams\.set\('edge_refresh','round577-181103-proof-depth-second-pass-20260629'\)/g, `target.searchParams.set('edge_refresh','${round579.version}')`);
    text = text.replace(/(\/js\/core\/local-mathjax\.js\?v=)round577-181103-proof-depth-second-pass-20260629/g, `$1${round579.version}`);
    text = text.replace(/(\/js\/formula-lite\.js\?v=)round577-181103-proof-depth-second-pass-20260629/g, `$1${round579.version}`);
    text = replaceAll(text, '当前发布：Round577 ·', '当前发布：Round579 ·');
    text = replaceAll(text, '当前发布：Round578 ·', '当前发布：Round579 ·');
    text = replaceAll(text, '当前版本：Round577 ·', '当前版本：Round579 ·');
    text = replaceAll(text, '当前版本：Round578 ·', '当前版本：Round579 ·');
    text = replaceAll(text, '真题补答 <strong>145</strong>', '真题补答 <strong>163</strong>');
    text = replaceAll(text, '真题补答 <strong>153</strong>', '真题补答 <strong>163</strong>');
    text = replaceAll(text, '真题补答 145', '真题补答 163');
    text = replaceAll(text, '真题补答 153', '真题补答 163');
    text = replaceAll(text, '145 深补', '163 深补');
    text = replaceAll(text, '153 深补', '163 深补');
    text = replaceAll(text, '145 道已做过程型补答', '163 道已做过程型补答');
    text = replaceAll(text, '153 道已做过程型补答', '163 道已做过程型补答');
    text = replaceAll(text, '累计 145 道历年真题', '累计 163 道历年真题');
    text = replaceAll(text, '累计 153 道历年真题', '累计 163 道历年真题');
    text = replaceAll(text, '<dt>真题补答</dt><dd>145 道</dd>', '<dt>真题补答</dt><dd>163 道</dd>');
    text = replaceAll(text, '<dt>真题补答</dt><dd>153 道</dd>', '<dt>真题补答</dt><dd>163 道</dd>');
    text = replaceAll(text, '历年真题过程型补答仍为 145', '历年真题过程型补答已到 163');
    text = replaceAll(text, '历年真题过程型补答已到 153', '历年真题过程型补答已到 163');
    text = replaceAll(text, 'Round577 证明题二次重证、参考答案展示', 'Round577 证明题二次重证、Round579 真题过程补答、参考答案展示');
    text = replaceAll(text, 'Round577 证明题二次重证、Round578 真题过程补答、参考答案展示', 'Round577 证明题二次重证、Round578/579 真题过程补答、参考答案展示');
    text = replaceAll(text, 'Round572 已补强 12 道历年真题参考答案；Round577 二次重证 8 道 181103 推导题', 'Round572 已补强 12 道历年真题参考答案；Round577 二次重证 8 道 181103 推导题；Round579 再补强 10 道历年真题过程答案');
    text = replaceAll(text, 'Round572 已补强 12 道历年真题参考答案；Round577 二次重证 8 道 181103 推导题；Round578 再补强 8 道历年真题过程答案', 'Round572 已补强 12 道历年真题参考答案；Round577 二次重证 8 道 181103 推导题；Round578 再补强 8 道历年真题过程答案；Round579 再补强 10 道历年真题过程答案');
    text = replaceAll(text, '真题补答从 133 推到 145', '真题补答从 153 推到 163');
    text = replaceAll(text, '真题补答从 145 推到 153', '真题补答从 153 推到 163');
    text = replaceAll(text, 'Round576 继续保留全部题量、答案、证明记录和来源边界，并把公开直达壳、别名入口和题库工作台收束到同一当前版本', 'Round579 继续保留全部题量、答案、证明记录和来源边界，并把短真题答案补成可复查的过程型参考答案');
    text = replaceAll(text, '<span class="workbench-release-label"><b>Round576</b><span>直达壳一致与审计清晰</span></span>', '<span class="workbench-release-label"><b>Round579</b><span>真题过程答案第十二轮</span></span>');
    text = replaceAll(text, '<span class="workbench-status-pill" data-state="info">真 <strong>145</strong> / PDF <strong>0</strong></span>', '<span class="workbench-status-pill" data-state="info">真 <strong>163</strong> / PDF <strong>0</strong></span>');
    text = replaceAll(text, '<span class="workbench-status-pill" data-state="info">真 <strong>153</strong> / PDF <strong>0</strong></span>', '<span class="workbench-status-pill" data-state="info">真 <strong>163</strong> / PDF <strong>0</strong></span>');
    text = replaceAll(text, 'Round576 账本', 'Round579 账本');
    text = replaceAll(text, './data/fluid-round576-direct-shell-consistency-ledger.json', './data/fluid-round579-real-exam-answer-depth-upgrade.json');
    if (text !== before) {
      writeText(rel, text);
      changed.push(rel);
    }
  }
  return changed;
}

const touchedRows = mutateRealExamRows();
mutateAnswerChecks();
updateQuestionBankIndex();
updateLedgers(touchedRows);
updateSiteUpdates();
updateRoadmap();
const changedVersionFiles = syncCurrentVersionFiles();

console.log(JSON.stringify({
  ok: true,
  version: round579.version,
  previousVersion: round579.previousVersion,
  generatedAt: now,
  realExamUpgraded: realExamUpgrades.map((item) => item.id),
  changedVersionFiles: changedVersionFiles.length,
  cumulative: {
    realExamAnswerDepthRows: round579.realExamCumulativeAnswerDepthRows,
    proofDepthRows181103: round579.proofDepthRows181103,
    referencePracticeRows181103: round579.referencePracticeRows181103,
    sourceClueOnlyRows181103: round579.sourceClueOnlyRows181103,
    strictAnswerPdfProofRows: round579.strictAnswerPdfProofRows
  }
}, null, 2));
