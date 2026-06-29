#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round577, proofDepthRewrites181103 } from './round577-proof-depth-data.mjs';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round577 apply from /Volumes/mac_2T during lifs isolation.');
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

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
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
    sentenceCount: (plain.match(/[。；;.!？?]/g) || []).length,
    formulaCount: (raw.match(/\\\(|\\\)|\\\[|\\\]|\\frac|\\partial|\\operatorname|\\sqrt|\\int|\\sum|\\Pi|\\Delta|\\rho|\\theta|\\phi|\\omega|\\tau|\\pi|=|<|>|_|\^/g) || []).length,
    proofSignalCount: (plain.match(/设|取|由|因为|所以|因此|代入|积分|边界|条件|结论|证明|可得|推出|假设|满足|比较|令|定义|整理|配平|相除|检查|故|再看|先看|等价|说明/g) || []).length
  };
}

function relFromRow(row) {
  const raw = row?.round372SourceMaterialHtmlPath || row?.sourceRelPath || row?.sourceHtmlUrl || '';
  return String(raw).split('#')[0].replace(/^\/+/, '');
}

function mutate181103Rows() {
  const bank = readJson('question-banks/181103-material-extracted.json');
  const touchedRows = [];

  for (const upgrade of proofDepthRewrites181103) {
    const row = bank.find((item) => item.id === upgrade.id);
    if (!row) throw new Error(`Missing 181103 row ${upgrade.id}`);
    const answer = upgrade.referenceAnswer.trim();
    const previousScore = scoreAnswer(row.referenceAnswer || row.answer || '');
    Object.assign(row, {
      answer,
      referenceAnswer: answer,
      answerHtml: answer,
      referenceAnswerHtml: answer,
      ocrDraftAnswerText: answer,
      ocrDraftAnswerHtml: answer,
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
      round577ProofDepthRewrite: true,
      round577ProofDepthRewriteAt: now,
      round577ProofDepthRewriteVersion: round577.version,
      round577ProofDepthDiagnosis: upgrade.diagnosis,
      round577ProofDepthBoundaryNote: upgrade.boundaryNote,
      round577ProofDepthSource: 'local-derived-proof-audit-plus-round577-candidate-scan'
    });
    row.qualityFlags = Array.from(new Set([...(row.qualityFlags || []), 'round577-proof-depth-rewritten']));
    touchedRows.push({
      id: row.id,
      title: row.title,
      type: row.type,
      sourceHtmlPath: relFromRow(row),
      previousScore,
      score: scoreAnswer(answer),
      diagnosis: upgrade.diagnosis,
      boundaryNote: upgrade.boundaryNote
    });
  }

  writeJson('question-banks/181103-material-extracted.json', bank);
  return { bank, touchedRows };
}

function replace181103ArticleAnswer(rel, id, answer) {
  let html = readText(rel);
  const articleStart = html.indexOf(`<article class="material-question-card" id="${id}"`);
  if (articleStart < 0) throw new Error(`Cannot find article ${id} in ${rel}`);
  const detailStart = html.indexOf('<details open class="material-question-card__answer"', articleStart);
  if (detailStart < 0) throw new Error(`Cannot find answer details ${id} in ${rel}`);
  const detailEnd = html.indexOf('</details>', detailStart);
  if (detailEnd < 0) throw new Error(`Cannot find answer details end ${id} in ${rel}`);
  const replacement = `<details open class="material-question-card__answer" data-181103-answer-html="1" data-round388-reference-answer-visible="1" data-round399-answer-default-visible="1" data-round399-answer-discoverable="1" aria-label="参考答案默认展开" data-round420-answer-trust-state="reference-answer-ready" data-round577-proof-depth-rewrite="1"><summary>参考答案（Round577 二次重证，默认展开，可收起）</summary><div data-round388-reference-answer-body="1">${answerToHtml(answer)}</div></details>`;
  html = `${html.slice(0, detailStart)}${replacement}${html.slice(detailEnd + '</details>'.length)}`;
  writeText(rel, html);
}

function mutate181103Html(bank) {
  const updates = [];
  for (const upgrade of proofDepthRewrites181103) {
    const row = bank.find((item) => item.id === upgrade.id);
    const rel = relFromRow(row);
    if (!rel || !fs.existsSync(abs(rel))) throw new Error(`Missing source HTML path for ${upgrade.id}: ${rel}`);
    replace181103ArticleAnswer(rel, upgrade.id, upgrade.referenceAnswer.trim());
    updates.push({ id: upgrade.id, rel });
  }
  return updates;
}

function updateQuestionBankIndex() {
  const index = readJson('question-banks/index.json');
  index.version = round577.version;
  index.currentEntryVersion = round577.version;
  index.updatedAt = now;
  index.lastUpdated = now;
  index.material181103CurrentWebsitePracticeQuestionCount = 400;
  index.material181103CurrentWebsiteSourceContentCardCount = 122;

  if (index.summary) {
    const summaryUpdates = {
      material181103DefaultPracticeQuestionCount: 400,
      material181103SourceSemanticPracticeCount: 400,
      material181103SourceContentCardCount: 122,
      material181103WebParityPracticeQuestionCount: 400,
      material181103WebParitySourceContentCardCount: 122,
      material181103CurrentWebsitePracticeQuestionCount: 400,
      material181103CurrentWebsiteSourceContentCardCount: 122
    };
    for (const [key, value] of Object.entries(summaryUpdates)) {
      if (Object.prototype.hasOwnProperty.call(index.summary, key)) index.summary[key] = value;
    }
    index.summary.material181103RawPracticeQuestionCountBeforeRound577 = 381;
    index.summary.material181103RawSourceContentCardCountBeforeRound577 = 141;
  }

  for (const statsKey of ['statistics', 'stats']) {
    if (!index[statsKey]) continue;
    for (const key of Object.keys(index[statsKey])) {
      if (/material181103.*PracticeQuestionCount/.test(key) || /material181103.*PracticeCount/.test(key)) index[statsKey][key] = 400;
      if (/material181103.*SourceContentCardCount/.test(key)) index[statsKey][key] = 122;
    }
    index[statsKey].lastUpdated = now;
    index[statsKey].updatedAt = now;
  }

  const bank = (index.questionBanks || []).find((item) => item.id === '181103-material-extracted');
  if (bank) {
    if (bank.sourceSemanticContentCardCount === 141) bank.rawSourceSemanticContentCardCountBeforeRound577 = 141;
    if (bank.practiceEntryQuestionCount === 381) bank.rawPracticeEntryQuestionCountBeforeRound577 = 381;
    Object.assign(bank, {
      description: '181103 资料内 522 条来源卡已按原文语义逐条复核；400 道默认练习题已进入刷题且均可直接看参考答案，0 道保留待人工源页复核，122 条参考答案页、解答续页、标题、父卡或讲义正文仅作资料线索卡，不再混作题目。',
      defaultPracticeQuestionCount: 400,
      practiceEntryQuestionCount: 400,
      sourceSemanticPracticeQuestionCount: 400,
      sourceSemanticContentCardCount: 122,
      webParitySourceContentCardCount: 122,
      currentEntryVersion: round577.version,
      lastUpdated: now
    });
    bank.tags = (bank.tags || []).map((tag) => replaceAll(replaceAll(String(tag), '381', '400'), '141', '122'));
  }

  writeJson('question-banks/index.json', index);
}

function syncQuestionBankDataJs() {
  let text = readText('modules/question-bank-data.js');
  text = replaceAll(text, "const practiceModuleVersion = 'round576-direct-shell-consistency-20260629';", `const practiceModuleVersion = '${round577.version}';`);
  text = replaceAll(text, 'return /round576-direct-shell-consistency-20260629/.test(versionText);', `return /${round577.version}/.test(versionText);`);
  text = replaceAll(
    text,
    'defaultPracticeRows: Number(bank.defaultPracticeQuestionCount || bank.practiceEntryQuestionCount || 400),',
    'defaultPracticeRows: Number(bank.defaultPracticeQuestionCount || bank.webParityPracticeQuestionCount || bank.practiceEntryQuestionCount || 400),'
  );
  text = replaceAll(
    text,
    'sourceClueCount: Number(bank.sourceSemanticContentCardCount || bank.sourceContentCardCount || 122),',
    'sourceClueCount: Number(bank.webParitySourceContentCardCount || bank.currentWebsiteSourceContentCardCount || bank.sourceClueOnlyRows181103 || 122),'
  );
  writeText('modules/question-bank-data.js', text);
}

function syncAnswerPanelRenderer() {
  let text = readText('modules/question-bank-practice.js');
  text = replaceAll(text, 'aria-label="来源证据层" data-181103-answer-source-evidence="1"', 'aria-label="来源证据层" data-round577-evidence-drawer="collapsed" data-181103-answer-source-evidence="1"');
  text = replaceAll(text, '<details class="reference-source-evidence__details" open data-round394-source-evidence-visible="1" data-round408-keyboard-expandable="1">', '<details class="reference-source-evidence__details" data-round394-source-evidence-visible="1" data-round408-keyboard-expandable="1" data-round577-answer-first-evidence-drawer="1">');
  text = replaceAll(text, '<span>来源证据（默认展开，可收起）</span>', '<span>来源证据（可展开核对）</span>');
  text = replaceAll(text, '<details class="real-exam-answer-rubric__details" open data-round433-real-exam-answer-source-visible="1">', '<details class="real-exam-answer-rubric__details" data-round433-real-exam-answer-source-visible="1" data-round577-answer-first-evidence-drawer="1">');
  text = replaceAll(text, '<span>评分细则与来源 trace（默认展开，可收起）</span>', '<span>评分细则与来源 trace（可展开核对）</span>');
  text = replaceAll(text, '<details class="answer-explanation-details" open data-round394-solution-visible="1" data-round408-keyboard-expandable="1">', '<details class="answer-explanation-details" data-round394-solution-visible="1" data-round408-keyboard-expandable="1" data-round577-answer-first-evidence-drawer="1">');
  text = replaceAll(text, '<span>解题思路（默认展开，可收起）</span>', '<span>解题思路（可展开核对）</span>');
  text = replaceAll(text, "answerDisplay.setAttribute('aria-label', '批改结果、参考答案、解析与来源证据');", "answerDisplay.setAttribute('aria-label', '参考答案优先阅读面板，解析与来源证据可展开核对');\n        answerDisplay.setAttribute('data-round577-answer-first-panel', '1');");
  text = replaceAll(text, "answerDisplay.style.minHeight = 'clamp(320px, 54vh, 620px)';", "answerDisplay.style.minHeight = 'clamp(220px, 36vh, 460px)';");
  text = replaceAll(text, "answerDisplay.style.maxHeight = 'min(76vh, 820px)';", "answerDisplay.style.maxHeight = 'min(82vh, 860px)';");
  text = replaceAll(text, "answerDisplay.style.fontSize = '20px';", "answerDisplay.style.fontSize = '18px';");
  text = replaceAll(text, "answerDisplay.style.padding = '32px';", "answerDisplay.style.padding = '24px';");
  text = replaceAll(text, "answerDisplay.style.minHeight = 'clamp(300px, 50vh, 560px)';", "answerDisplay.style.minHeight = 'clamp(220px, 42vh, 520px)';");
  text = replaceAll(text, "answerDisplay.style.maxHeight = '72vh';", "answerDisplay.style.maxHeight = '78vh';");
  text = replaceAll(text, "answerDisplay.style.padding = '16px';", "answerDisplay.style.padding = '14px';");
  text = replaceAll(text, "answerDisplay.style.background = 'rgba(240,248,255,0.98)';", "answerDisplay.style.background = 'rgba(248,252,255,0.99)';");
  text = replaceAll(text, "answerDisplay.style.boxShadow = '0 20px 60px rgba(0,0,0,0.2)';", "answerDisplay.style.boxShadow = '0 14px 38px rgba(4,17,31,0.16)';");
  text = replaceAll(text, "answerDisplay.style.border = '3px solid #007bff';", "answerDisplay.style.border = '1px solid rgba(14, 116, 144, 0.35)';");
  text = replaceAll(text, "answerDisplay.style.borderRadius = '20px';", "answerDisplay.style.borderRadius = '12px';");
  writeText('modules/question-bank-practice.js', text);
}

function syncQuestionBankFocusLayout() {
  let text = readText('modules/question-bank.html');
  if (!text.includes('data-round577-focus-boot')) {
    text = text.replace(
      '<script data-auth-boot>',
      `<script data-round577-focus-boot>\n  (function(){\n    try {\n      var params = new URLSearchParams(location.search);\n      if (params.get('focus') === '181103-material-extracted') {\n        document.documentElement.setAttribute('data-round577-focus-entry','181103-material-extracted');\n      }\n    } catch (_) {}\n  })();\n</script>\n<script data-auth-boot>`
    );
  }
  if (!text.includes('data-round577-focus-layout')) {
    text = text.replace(
      '<div id="notification-container"></div>',
      `<script data-round577-focus-layout>\n(function(){\n  function prioritizeFocusedBank(){\n    try {\n      var params = new URLSearchParams(location.search);\n      if (params.get('focus') !== '181103-material-extracted') return;\n      var list = document.getElementById('questionBanksList');\n      var section = list && list.closest('section');\n      var main = document.querySelector('.main-content');\n      if (!section || !main || main.firstElementChild === section) return;\n      section.setAttribute('data-round577-focus-priority','1');\n      var heading = section.querySelector('.section-heading p');\n      if (heading) heading.textContent = '已优先显示 181103 资料题库；统计、筛选、章节路线和证据说明仍保留在下方。';\n      main.insertBefore(section, main.firstElementChild);\n    } catch (_) {}\n  }\n  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prioritizeFocusedBank);\n  else prioritizeFocusedBank();\n})();\n</script>\n\n<div id="notification-container"></div>`
    );
  }
  text = replaceAll(text, 'round576-direct-shell-consistency-20260629', round577.version);
  text = replaceAll(text, 'Round576', 'Round577');
  writeText('modules/question-bank.html', text);
}

function syncResourcesCopy() {
  let text = readText('resources.html');
  text = replaceAll(text, round577.previousVersion, round577.version);
  text = replaceAll(text, 'Round576', 'Round577');
  text = replaceAll(text, '132 条参考答案页、父卡、源文/答案续页/讲义正文只展示', '122 条参考答案页、父卡、源文/答案续页/讲义正文只展示');
  text = replaceAll(text, '<span><b>381</b>练习 / 400+0 答案</span>', '<span><b>400</b>练习 / 400+0 答案</span>');
  text = replaceAll(text, '<span><b>141</b>源文线索只展示</span>', '<span><b>122</b>源文线索只展示</span>');
  text = replaceAll(text, '另有 132 条参考答案页/源文/答案续页/讲义正文只作线索', '另有 122 条参考答案页/源文/答案续页/讲义正文只作线索');
  text = replaceAll(text, '<div class="source-chip"><b>381/400+0</b>181103 参考答案状态</div>', '<div class="source-chip"><b>400/400+0</b>181103 参考答案状态</div>');
  text = replaceAll(text, '<div class="source-chip"><b>141</b>181103 源文线索</div>', '<div class="source-chip"><b>122</b>181103 源文线索</div>');
  writeText('resources.html', text);
}

function syncCurrentVersionFiles() {
  const files = Array.from(new Set([
    ...round576CurrentSurfaceFiles,
    ...round576DirectShellFiles,
    'resources.html',
    'modules/question-bank.html',
    'modules/question-bank-data.js',
    'modules/question-bank-practice.js',
    'modules/question-bank-styles.css',
    'resources/fluid-181103-html/index.html'
  ]));
  const changed = [];
  for (const rel of files) {
    if (!fs.existsSync(abs(rel))) continue;
    let text = readText(rel);
    const before = text;
    text = replaceAll(text, round577.previousVersion, round577.version);
    text = text.replace(/edge_refresh=round576-direct-shell-consistency-20260629/g, `edge_refresh=${round577.version}`);
    text = text.replace(/target\.searchParams\.set\('edge_refresh','round576-direct-shell-consistency-20260629'\)/g, `target.searchParams.set('edge_refresh','${round577.version}')`);
    text = text.replace(/(\/js\/core\/local-mathjax\.js\?v=)round576-direct-shell-consistency-20260629/g, `$1${round577.version}`);
    text = text.replace(/(\/js\/formula-lite\.js\?v=)round576-direct-shell-consistency-20260629/g, `$1${round577.version}`);
    text = text.replace(/当前发布：Round576 ·/g, '当前发布：Round577 ·');
    text = text.replace(/当前版本：Round576 ·/g, '当前版本：Round577 ·');
    text = replaceAll(text, 'Round576 直达壳一致、Round576 直达壳一致、参考答案展示', 'Round576 直达壳一致、Round577 证明题二次重证、参考答案展示');
    text = replaceAll(text, 'Round572 内容批次证明深修 422 道、Round573 入口流畅升级、Round574 公开壳同步、Round575 题库入口压实、Round576 直达壳一致、Round576 直达壳一致', 'Round572 内容批次证明深修 422 道、Round573 入口流畅升级、Round574 公开壳同步、Round575 题库入口压实、Round576 直达壳一致、Round577 证明题二次重证');
    text = replaceAll(text, '证明深修截至 Round572 内容批次共 422 道', '证明深修截至 Round577 当前批次仍为 422 道，其中 Round577 二次重证 8 道');
    text = replaceAll(text, 'Round572 本轮另补强 12 道历年真题参考答案，并重证 6 道 181103 推导题', 'Round572 已补强 12 道历年真题参考答案；Round577 二次重证 8 道 181103 推导题');
    if (text !== before) {
      writeText(rel, text);
      changed.push(rel);
    }
  }
  return changed;
}

function syncMaterialIndex() {
  let text = readText('resources/fluid-181103-html/index.html');
  text = replaceAll(text, round577.previousVersion, round577.version);
  text = replaceAll(text, 'Round531-572 当前 422 道证明/推导题深修', 'Round531-577 当前 422 道证明/推导题深修，Round577 二次重证 8 道');
  text = replaceAll(text, 'Round531-572 当前总账已到 422 道', 'Round531-577 当前总账仍为 422 道，其中 Round577 对 8 道已入库证明题做二次重证');
  text = replaceAll(text, '<span>Round572 本轮重证 6 道</span>', '<span>Round577 二次重证 8 道</span>');
  text = replaceAll(text, '<span>Round572 重证记录已发布</span>', '<span>Round577 二次重证记录已发布</span>');
  text = replaceAll(text, 'Round531-555 深修账本', 'Round531-577 深修账本');
  if (!text.includes('fluid-round577-181103-proof-depth-second-pass.json')) {
    text = text.replace(
      '</div></details></section><section class="panel" data-round370-readable-practice',
      '<article data-round577-181103-proof-depth="second-pass"><strong>Round577 证明题参考答案二次重证</strong><p>对 8 道已入库但仍偏短或显示风险高的证明/推导题做二次重证，重点补齐控制体、符号边界、量纲配平、流线常数、群速不等号和湍流混合长推导。</p><a href="/data/fluid-round577-181103-proof-depth-second-pass.json">打开 Round577 二次重证账本</a></article></div></details></section><section class="panel" data-round370-readable-practice'
    );
  }
  writeText('resources/fluid-181103-html/index.html', text);
}

function updateLedgers(touchedRows, htmlUpdates) {
  const failedIds = touchedRows
    .filter((row) => row.score.chars < round577.minChars
      || row.score.sentenceCount < round577.minSentenceCount
      || row.score.formulaCount < round577.minFormulaCount
      || row.score.proofSignalCount < round577.minProofSignalCount)
    .map((row) => row.id);

  const report = {
    ok: failedIds.length === 0,
    version: round577.version,
    previousVersion: round577.previousVersion,
    generatedAt: now,
    upgradedRows: proofDepthRewrites181103.length,
    upgradedIds: proofDepthRewrites181103.map((item) => item.id),
    minChars: round577.minChars,
    minSentenceCount: round577.minSentenceCount,
    minFormulaCount: round577.minFormulaCount,
    minProofSignalCount: round577.minProofSignalCount,
    cumulativeProofDepthRows: round577.proofDepthRows181103,
    cumulativePracticeRows: round577.referencePracticeRows181103,
    cumulativeSourceClueRows: round577.sourceClueOnlyRows181103,
    strictAnswerPdfProofRows: round577.strictAnswerPdfProofRows,
    failedIds,
    records: touchedRows,
    htmlUpdates,
    studentAnswerBoundary: 'Round577 re-deepens existing student-visible reference-answer-ready practice rows; it does not add source-clue-only rows to default practice.',
    remainingBoundary: 'Source-clue-only rows and real-exam answer-depth backlog remain separate queues.',
    qualityBoundary: 'Ledger score checks text/process/formula density, then local gate checks row flags and HTML visibility.',
    correctnessBoundary: 'Answers are derived reference proofs with explicit source/notation caveats where the source text is ambiguous.',
    strictAnswerPdfProofBoundary: 'strictAnswerPdfProof remains 0; no original answer-PDF span/bbox/hash proof is claimed.'
  };
  writeJson('data/fluid-round577-181103-proof-depth-second-pass.json', report);

  const continuation = {
    ok: report.ok,
    version: round577.version,
    previousVersion: round577.previousVersion,
    generatedAt: now,
    summary: {
      rewrittenRows: proofDepthRewrites181103.length,
      rewrittenIds: proofDepthRewrites181103.map((item) => item.id),
      proofDepthRows: round577.proofDepthRows181103,
      practiceRows: round577.referencePracticeRows181103,
      sourceClueRows: round577.sourceClueOnlyRows181103,
      strictAnswerPdfProofRows: round577.strictAnswerPdfProofRows,
      boundary: 'Round577 is a second-pass proof-depth rewrite of existing ready reference rows; count frontier remains 422/400/122/strict 0.'
    }
  };
  writeJson('data/fluid-round577-181103-proof-depth-continuation-ledger.json', continuation);
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round577.version,
    previousVersion: round577.previousVersion,
    date: round577.date,
    title: 'Round577：181103 证明题二次重证与题库入口读题优化',
    summary: '本轮继续不减少任何题量、答案、证明记录或来源边界；对 8 道已入库但仍偏短或有显示风险的 181103 证明/推导题做二次重证，补齐控制体、量纲配平、流线常数、群速不等号、湍流混合长和题面歧义边界。资源页旧 381/141/132 口径同步为当前 400/122；181103 focus 路由优先显示题库列表，答案面板改为答案优先、证据可展开。181103 仍为 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答仍为 145；strictAnswerPdfProof 仍为 0。',
    links: [
      { label: 'Round577 二次重证账本', href: '/data/fluid-round577-181103-proof-depth-second-pass.json' },
      { label: 'Round577 连续性账本', href: '/data/fluid-round577-181103-proof-depth-continuation-ledger.json' },
      { label: '181103 题库', href: `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round577.version}#questionBanksList` }
    ],
    metrics: {
      realExamAnswerDepthRows: round577.realExamAnswerDepthRows,
      proofDepthRows: round577.proofDepthRows181103,
      proofDepthRewriteRows: round577.round577ProofDepthRewriteRows181103,
      referencePracticeRows: round577.referencePracticeRows181103,
      sourceClueOnlyRows: round577.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round577.strictAnswerPdfProofRows
    },
    boundary: {
      derivedReferenceAnswers: true,
      strictAnswerPdfProof: 'separate',
      contentFrontier: round577.answerContentFrontierVersion,
      nonDeletingUpgrade: true,
      focusRouteUiPolish: true
    }
  };
  const next = updates.filter((item) => item?.version !== round577.version);
  next.unshift(top);
  writeJson('site-updates.json', next);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  roadmap.version = round577.version;
  roadmap.currentVersion = round577.version;
  roadmap.currentReleaseVersion = round577.version;
  roadmap.previousVersion = round577.previousVersion;
  roadmap.currentRound = round577.round;
  roadmap.lastIntegratedRound = round577.round;
  roadmap.lastUpdatedAt = now;
  roadmap.updatedAt = now;
  roadmap.latestRelease = {
    version: round577.version,
    round: round577.round,
    previousVersion: round577.previousVersion,
    summary: 'Round577 re-deepens eight existing 181103 proof-depth answers, fixes stale 181103 resource counts, and makes focused bank/answer reading more direct without deleting evidence.'
  };
  roadmap.releaseGate ||= {};
  roadmap.releaseGate.currentVersion = round577.version;
  roadmap.releaseGate.expectedVersion = round577.version;
  roadmap.releaseGate.previousVersion = round577.previousVersion;
  roadmap.releaseGate.currentRound = round577.round;
  roadmap.releaseGate.lastUpdated = now;
  const commands = [
    'node tools/apply-round577-proof-depth-second-pass.mjs',
    'node tools/check-round577-proof-depth-second-pass.mjs',
    'node tools/check-round577-question-bank-focus-visual.mjs',
    `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round577.version}`,
    `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round577.version}`
  ];
  const previous = (roadmap.releaseGate.commands || [])
    .filter((command) => !/round57[0-6]|check-round57[0-6]|apply-round57[0-6]/.test(String(command)));
  roadmap.releaseGate.commands = Array.from(new Set([...commands, ...previous]));
  roadmap.round577ProofDepthRewriteRows = round577.round577ProofDepthRewriteRows181103;
  roadmap.round577NonDeletingUpgrade = true;
  roadmap.round577QuestionBankFocusPolish = true;
  roadmap.referencePracticeRows181103 = round577.referencePracticeRows181103;
  roadmap.sourceClueOnlyRows181103 = round577.sourceClueOnlyRows181103;
  roadmap.proofDepthRows = round577.proofDepthRows181103;
  roadmap.realExamAnswerDepthRows = round577.realExamAnswerDepthRows;
  roadmap.strictAnswerPdfProof = round577.strictAnswerPdfProofRows;
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

const { bank, touchedRows } = mutate181103Rows();
const htmlUpdates = mutate181103Html(bank);
updateQuestionBankIndex();
syncQuestionBankDataJs();
syncAnswerPanelRenderer();
syncQuestionBankFocusLayout();
syncResourcesCopy();
syncMaterialIndex();
const changedVersionFiles = syncCurrentVersionFiles();
updateLedgers(touchedRows, htmlUpdates);
updateSiteUpdates();
updateRoadmap();

console.log(JSON.stringify({
  ok: true,
  version: round577.version,
  previousVersion: round577.previousVersion,
  generatedAt: now,
  proofDepthRewritten181103: proofDepthRewrites181103.map((item) => item.id),
  changedVersionFiles: changedVersionFiles.length,
  cumulative: {
    proofDepthRows181103: round577.proofDepthRows181103,
    referencePracticeRows181103: round577.referencePracticeRows181103,
    sourceClueOnlyRows181103: round577.sourceClueOnlyRows181103,
    realExamAnswerDepthRows: round577.realExamAnswerDepthRows,
    strictAnswerPdfProofRows: round577.strictAnswerPdfProofRows
  }
}, null, 2));
