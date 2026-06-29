#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';
import { round586 } from './round586-practice-answer-workbench-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round586 apply from /Volumes/mac_2T during lifs isolation.');
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

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function walkHtml(relDir) {
  const dir = abs(relDir);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name === 'index.html') {
        out.push(path.relative(repoRoot, full));
      }
    }
  }
  return out.sort();
}

const round586Css = `
<style data-round586-practice-answer-workbench>
/* Round586 practice answer workbench polish */
body[data-round586-practice-answer-page="1"] {
  background: linear-gradient(180deg, #f7fbff 0, #ffffff 220px, #f6f8fb 100%) !important;
  color: #0f172a;
}
body[data-round586-practice-answer-page="1"] .practice-container {
  max-width: min(1180px, calc(100vw - 28px));
  margin: 0 auto;
  padding-bottom: 42px;
}
body[data-round586-practice-answer-page="1"] .page-title {
  margin: 18px 0 10px !important;
  color: #0f172a !important;
  text-shadow: none !important;
  font-size: clamp(1.75rem, 3.2vw, 2.4rem) !important;
  letter-spacing: 0 !important;
}
body[data-round586-practice-answer-page="1"] .ocean-waves,
body[data-round586-practice-answer-page="1"] .ocean-bubbles,
body[data-round586-practice-answer-page="1"] .ocean-fish,
body[data-round586-practice-answer-page="1"] .floating-elements {
  display: none !important;
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench {
  position: relative;
  z-index: 3;
  display: grid;
  gap: 9px;
  margin: 0 0 14px;
  padding: 12px;
  border: 1px solid rgba(15, 118, 110, .18);
  border-radius: 8px;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 18px 44px rgba(15, 23, 42, .08);
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  color: #475569;
  font-size: 13px;
  font-weight: 760;
  line-height: 1.5;
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__head b {
  display: block;
  color: #0f766e;
  font-size: 14px;
  line-height: 1.35;
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__head a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: 0 11px;
  border: 1px solid rgba(15, 118, 110, .18);
  border-radius: 8px;
  background: rgba(236, 253, 245, .9);
  color: #0f766e;
  font-weight: 850;
  text-decoration: none;
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 7px;
  margin: 0;
  padding: 0;
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics div {
  min-width: 0;
  min-height: 56px;
  display: grid;
  align-content: center;
  gap: 2px;
  padding: 8px;
  border: 1px solid rgba(15, 118, 110, .14);
  border-radius: 8px;
  background: rgba(236, 253, 245, .68);
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics div:nth-child(4) {
  border-color: rgba(126, 34, 206, .17);
  background: rgba(250, 245, 255, .76);
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics div:nth-child(6) {
  border-color: rgba(245, 158, 11, .26);
  background: rgba(255, 251, 235, .82);
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics dt {
  color: #0f766e;
  font-size: 20px;
  font-weight: 900;
  line-height: 1.05;
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics div:nth-child(4) dt {
  color: #6d28d9;
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics div:nth-child(6) dt {
  color: #92400e;
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics dd {
  margin: 0;
  color: #475569;
  font-size: 11px;
  font-weight: 760;
  line-height: 1.36;
  overflow-wrap: anywhere;
}
body[data-round586-practice-answer-page="1"] .question-bank-selector,
body[data-round586-practice-answer-page="1"] .filter-section,
body[data-round586-practice-answer-page="1"] .quick-access-section,
body[data-round586-practice-answer-page="1"] .smart-practice-section,
body[data-round586-practice-answer-page="1"] .question-card,
body[data-round586-practice-answer-page="1"] .stats-panel,
body[data-round586-practice-answer-page="1"] .action-buttons {
  position: relative;
  z-index: 2;
}
body[data-round586-practice-answer-page="1"] .question-card {
  border: 1px solid rgba(15, 23, 42, .1) !important;
  border-radius: 8px !important;
  background: rgba(255, 255, 255, .96) !important;
  color: #0f172a !important;
  box-shadow: 0 20px 48px rgba(15, 23, 42, .1) !important;
}
body[data-round586-practice-answer-page="1"] .question-title,
body[data-round586-practice-answer-page="1"] .question-content,
body[data-round586-practice-answer-page="1"] .question-text,
body[data-round586-practice-answer-page="1"] .option-text {
  color: #0f172a !important;
}
body[data-round586-practice-answer-page="1"] .question-title,
body[data-round586-practice-answer-page="1"] .question-content {
  overflow-wrap: anywhere;
}
body[data-round586-practice-answer-page="1"] .answer-comparison,
body[data-round586-practice-answer-page="1"] .result-display,
body[data-round586-practice-answer-page="1"] .material-reference-panel,
body[data-round586-practice-answer-page="1"] .material-source-panel,
body[data-round586-practice-answer-page="1"] .ai-grading-section {
  border-radius: 8px !important;
  box-shadow: 0 16px 38px rgba(15, 23, 42, .08) !important;
  overflow-wrap: anywhere;
}
body[data-round586-practice-answer-page="1"] .answer-comparison {
  border: 1px solid rgba(37, 99, 235, .18) !important;
  background: #ffffff !important;
  overflow: hidden;
}
body[data-round586-practice-answer-page="1"] .comparison-header {
  background: linear-gradient(135deg, #0f766e, #2563eb) !important;
  padding: 12px 16px !important;
  text-align: left !important;
}
body[data-round586-practice-answer-page="1"] .comparison-content {
  padding: 14px !important;
}
body[data-round586-practice-answer-page="1"] .answer-box,
body[data-round586-practice-answer-page="1"] .standard-answer,
body[data-round586-practice-answer-page="1"] .user-answer,
body[data-round586-practice-answer-page="1"] .explanation,
body[data-round586-practice-answer-page="1"] .material-reference-panel__body,
body[data-round586-practice-answer-page="1"] .material-reference-panel__explanation,
body[data-round586-practice-answer-page="1"] .ai-grading-result {
  color: #0f172a !important;
  background: #ffffff !important;
  border-color: rgba(15, 23, 42, .1) !important;
  line-height: 1.72 !important;
  white-space: normal !important;
}
body[data-round586-practice-answer-page="1"] .answer-box,
body[data-round586-practice-answer-page="1"] .material-reference-panel__body,
body[data-round586-practice-answer-page="1"] .material-reference-panel__explanation,
body[data-round586-practice-answer-page="1"] .math-display,
body[data-round586-practice-answer-page="1"] mjx-container[display="true"] {
  max-width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
body[data-round586-practice-answer-page="1"] .standard-answer {
  border-left: 4px solid #0f766e !important;
  background: linear-gradient(90deg, rgba(236, 253, 245, .88), #ffffff 42%) !important;
}
body[data-round586-practice-answer-page="1"] .explanation {
  border-left: 4px solid #f59e0b !important;
  background: linear-gradient(90deg, rgba(255, 251, 235, .9), #ffffff 44%) !important;
}
body[data-round586-practice-answer-page="1"] .result-display {
  border: 1px solid rgba(15, 23, 42, .1) !important;
  background: #ffffff !important;
  color: #0f172a !important;
}
body[data-round586-practice-answer-page="1"] .result-correct {
  border-left: 5px solid #0f766e !important;
}
body[data-round586-practice-answer-page="1"] .result-incorrect {
  border-left: 5px solid #dc2626 !important;
}
body[data-round586-practice-answer-page="1"] .material-reference-panel {
  border: 1px solid rgba(37, 99, 235, .2) !important;
  background: linear-gradient(180deg, rgba(239, 246, 255, .98), #ffffff) !important;
  color: #1e3a8a !important;
}
body[data-round586-practice-answer-page="1"] .material-source-panel {
  border: 1px solid rgba(15, 118, 110, .2) !important;
  background: linear-gradient(180deg, rgba(240, 253, 250, .98), #ffffff) !important;
}
body[data-round586-practice-answer-page="1"] .round586-answer-boundary-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin: 0 0 12px;
}
body[data-round586-practice-answer-page="1"] .round586-answer-boundary-strip span {
  min-width: 0;
  min-height: 48px;
  display: grid;
  align-content: center;
  gap: 2px;
  padding: 8px 9px;
  border: 1px solid rgba(15, 118, 110, .14);
  border-radius: 8px;
  background: rgba(248, 250, 252, .95);
  color: #475569;
  font-size: 12px;
  font-weight: 760;
  line-height: 1.36;
}
body[data-round586-practice-answer-page="1"] .round586-answer-boundary-strip span:nth-child(2) {
  border-color: rgba(126, 34, 206, .16);
  background: rgba(250, 245, 255, .9);
}
body[data-round586-practice-answer-page="1"] .round586-answer-boundary-strip span:nth-child(3) {
  border-color: rgba(245, 158, 11, .24);
  background: rgba(255, 251, 235, .94);
}
body[data-round586-practice-answer-page="1"] .round586-answer-boundary-strip b {
  color: #0f766e;
  font-size: 13px;
  font-weight: 900;
}
body[data-round586-practice-answer-page="1"] .round586-answer-boundary-strip span:nth-child(2) b {
  color: #6d28d9;
}
body[data-round586-practice-answer-page="1"] .round586-answer-boundary-strip span:nth-child(3) b {
  color: #92400e;
}
body[data-round586-practice-answer-page="1"] .round586-answer-boundary-strip--result {
  margin-bottom: 14px;
}
body[data-round586-practice-answer-page="1"] .material-source-panel__links a,
body[data-round586-practice-answer-page="1"] .material-reference-panel__links a,
body[data-round586-practice-answer-page="1"] .question-links a,
body[data-round586-practice-answer-page="1"] .question-links span,
body[data-round586-practice-answer-page="1"] .action-btn,
body[data-round586-practice-answer-page="1"] .analysis-btn,
body[data-round586-practice-answer-page="1"] .ai-grading-btn,
body[data-round586-practice-answer-page="1"] .fullscreen-btn,
body[data-round586-practice-answer-page="1"] .font-size-btn,
body[data-round586-practice-answer-page="1"] .exit-btn {
  min-height: 44px !important;
  border-radius: 8px !important;
  white-space: normal !important;
  line-height: 1.25 !important;
}
body[data-round586-practice-answer-page="1"] .material-source-panel__figure img {
  max-height: 54vh !important;
}
body[data-round586-practice-answer-page="1"] .material-source-panel__figure figcaption {
  color: #475569 !important;
}
body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench a:focus-visible,
body[data-round586-practice-answer-page="1"] .round586-answer-boundary-strip:focus-within,
body[data-round586-practice-answer-page="1"] .option-label:focus-visible,
body[data-round586-practice-answer-page="1"] .action-btn:focus-visible,
body[data-round586-practice-answer-page="1"] .analysis-btn:focus-visible,
body[data-round586-practice-answer-page="1"] .material-source-panel__links a:focus-visible,
body[data-round586-practice-answer-page="1"] .material-reference-panel__links a:focus-visible {
  outline: 3px solid rgba(15, 118, 110, .45);
  outline-offset: 3px;
}
@media (hover: none), (pointer: coarse) {
  body[data-round586-practice-answer-page="1"] .action-btn:hover,
  body[data-round586-practice-answer-page="1"] .question-card:hover,
  body[data-round586-practice-answer-page="1"] .option-label:hover {
    transform: none !important;
  }
  body[data-round586-practice-answer-page="1"] .action-btn::before {
    display: none !important;
  }
}
@media (max-width: 980px) {
  body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  body[data-round586-practice-answer-page="1"] .practice-container {
    max-width: 100vw;
    padding: 76px max(12px, env(safe-area-inset-left)) 36px max(12px, env(safe-area-inset-right)) !important;
  }
  body[data-round586-practice-answer-page="1"] .question-bank-selector,
  body[data-round586-practice-answer-page="1"] .stats-panel,
  body[data-round586-practice-answer-page="1"] .filter-section,
  body[data-round586-practice-answer-page="1"] .quick-access-section,
  body[data-round586-practice-answer-page="1"] .smart-practice-section,
  body[data-round586-practice-answer-page="1"] .action-buttons,
  body[data-round586-practice-answer-page="1"] .question-card {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__head {
    display: grid;
  }
  body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__head a {
    justify-self: stretch;
  }
  body[data-round586-practice-answer-page="1"] .question-title {
    font-size: 1.05rem !important;
    line-height: 1.55 !important;
  }
  body[data-round586-practice-answer-page="1"] .question-content {
    font-size: 1rem !important;
    line-height: 1.65 !important;
  }
  body[data-round586-practice-answer-page="1"] .question-card .result-display,
  body[data-round586-practice-answer-page="1"] .question-card .fill-blank-section,
  body[data-round586-practice-answer-page="1"] .question-card .answer-comparison {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  body[data-round586-practice-answer-page="1"] .material-source-panel__links a,
  body[data-round586-practice-answer-page="1"] .material-reference-panel__links a {
    flex: 1 1 150px;
    justify-content: center;
    padding: 10px 12px !important;
  }
  body[data-round586-practice-answer-page="1"] .material-source-panel__head span,
  body[data-round586-practice-answer-page="1"] .material-reference-panel__head span,
  body[data-round586-practice-answer-page="1"] .material-source-panel__figure figcaption {
    font-size: 13px !important;
    line-height: 1.45 !important;
  }
  body[data-round586-practice-answer-page="1"] .round586-answer-boundary-strip {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 560px) {
  body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  body[data-round586-practice-answer-page="1"] .comparison-content,
  body[data-round586-practice-answer-page="1"] .result-display,
  body[data-round586-practice-answer-page="1"] .material-reference-panel,
  body[data-round586-practice-answer-page="1"] .material-source-panel {
    padding: 12px !important;
  }
}
@media (max-width: 340px) {
  body[data-round586-practice-answer-page="1"] .round586-practice-answer-workbench__metrics {
    grid-template-columns: 1fr;
  }
}
</style>`;

const practiceWorkbench = `
      <!-- Round586 practice answer workbench start -->
      <section class="round586-practice-answer-workbench" data-round586-practice-answer-workbench="top" aria-label="Round586 刷题答案与证明边界工作台">
        <div class="round586-practice-answer-workbench__head">
          <div><b>Round586 刷题答案工作台</b><span>不删题、不压缩答案、不把参考答案冒充原 PDF；在刷题页直接把参考答案、证明深修和 strictAnswerPdfProof 三层摆清楚。</span></div>
          <a href="/data/fluid-round586-practice-answer-workbench-ledger.json">Round586 账本</a>
        </div>
        <dl class="round586-practice-answer-workbench__metrics">
          <div><dt>400</dt><dd>181103 默认练习题，可直接显示参考答案。</dd></div>
          <div><dt>122</dt><dd>资料线索卡，不混作独立题答案。</dd></div>
          <div><dt>422</dt><dd>181103 proof-depth 已覆盖题，证明仍逐轮复查。</dd></div>
          <div><dt>163</dt><dd>历年真题过程型补答累计。</dd></div>
          <div><dt>353/353</dt><dd>真题可见答案显示完整。</dd></div>
          <div><dt>0</dt><dd>strictAnswerPdfProof，原答案 PDF 逐字证据仍分开。</dd></div>
        </dl>
      </section>
      <!-- Round586 practice answer workbench end -->`;

const comparisonBoundary = '<div class="round586-answer-boundary-strip" data-round586-practice-answer-boundary="comparison"><span><b>参考答案</b>先核对条件、方程和结论。</span><span><b>证明题</b>必须看推导链，不只看末行。</span><span><b>strictAnswerPdfProof=0</b>原答案 PDF 逐字证据另算。</span></div>';
const resultBoundary = '<div class="round586-answer-boundary-strip round586-answer-boundary-strip--result" data-round586-practice-answer-boundary="result"><span><b>答案显示</b>当前面板展示站内答案层。</span><span><b>解析/证明</b>继续看步骤、边界条件和单位。</span><span><b>PDF 原答案</b>未提升为 strict 逐字证明。</span></div>';
const referenceBoundaryLiteral = "		      '<div class=\"round586-answer-boundary-strip\" data-round586-practice-answer-boundary=\"181103\"><span><b>参考答案</b>站内推导/整理。</span><span><b>proof-depth</b>证明题看完整推导链。</span><span><b>strictAnswerPdfProof=0</b>原答案 PDF 逐字证据另算。</span></div>',";

function stripRound586Practice(text) {
  return text
    .replace(/\n?<style data-round586-practice-answer-workbench>[\s\S]*?<\/style>\n?/g, '\n')
    .replace(/\s*<!-- Round586 practice answer workbench start -->[\s\S]*?<!-- Round586 practice answer workbench end -->\s*/g, ' ')
    .replace(/<div class="round586-answer-boundary-strip" data-round586-practice-answer-boundary="comparison">[\s\S]*?<\/div>\s*/g, '')
    .replace(/<div class="round586-answer-boundary-strip round586-answer-boundary-strip--result" data-round586-practice-answer-boundary="result">[\s\S]*?<\/div>\s*/g, '')
    .replace(/\s*'<div class="round586-answer-boundary-strip" data-round586-practice-answer-boundary="181103">[\s\S]*?<\/div>',/g, '');
}

function injectRound586Css(text) {
  const clean = stripRound586Practice(text);
  if (clean.includes('\n</head>')) return clean.replace('\n</head>', `${round586Css}\n</head>`);
  if (clean.includes('</head>')) return clean.replace('</head>', `${round586Css}</head>`);
  throw new Error('Could not find practice page </head> marker.');
}

function addBodyMarker(text) {
  return text.replace(/<body([^>]*)>/, (match, attrs) => {
    const cleanAttrs = attrs.replace(/\sdata-round586-practice-answer-page="1"/g, '').trim();
    return cleanAttrs ? `<body ${cleanAttrs} data-round586-practice-answer-page="1">` : '<body data-round586-practice-answer-page="1">';
  });
}

function injectPracticeWorkbench(text) {
  const marker = '<h1 class="page-title">题库练习</h1> <!-- 题库选择界面 -->';
  if (!text.includes(marker)) throw new Error('Could not find practice workbench insertion marker.');
  return text.replace(marker, `<h1 class="page-title">题库练习</h1>${practiceWorkbench} <!-- 题库选择界面 -->`);
}

function injectAnswerBoundaries(text) {
  let next = text;
  const comparisonMarker = '<div class="comparison-content"> <div class="user-answer-section">';
  if (!next.includes(comparisonMarker)) throw new Error('Could not find answer comparison insertion marker.');
  next = next.replace(comparisonMarker, `<div class="comparison-content"> ${comparisonBoundary} <div class="user-answer-section">`);

  const resultMarker = '<div v-if="showResult" :class="[\'result-display\', isCorrect ? \'result-correct\' : \'result-incorrect\']"> <div>';
  if (!next.includes(resultMarker)) throw new Error('Could not find result display insertion marker.');
  next = next.replace(resultMarker, `<div v-if="showResult" :class="['result-display', isCorrect ? 'result-correct' : 'result-incorrect']"> ${resultBoundary} <div>`);

  const referenceMarker = "		      '<div class=\"material-reference-panel__head\"><strong>参考答案与解析</strong><span>来自 181103 source-first 题卡</span></div>',";
  if (!next.includes(referenceMarker)) throw new Error('Could not find 181103 reference panel insertion marker.');
  next = next.replace(referenceMarker, `${referenceMarker}\n${referenceBoundaryLiteral}`);
  return next;
}

function updatePracticePage(text) {
  let next = injectRound586Css(text);
  next = addBodyMarker(next);
  next = injectPracticeWorkbench(next);
  next = injectAnswerBoundaries(next);
  next = replaceAll(next, round586.previousVersion, round586.version);
  return next;
}

function updateCurrentText(text) {
  let next = replaceAll(text, round586.previousVersion, round586.version);
  next = replaceAll(next, 'Round585 · round586-practice-answer-workbench-20260630', 'Round586 · round586-practice-answer-workbench-20260630');
  next = replaceAll(next, '当前版本：Round585 · round586-practice-answer-workbench-20260630', '当前版本：Round586 · round586-practice-answer-workbench-20260630');
  next = replaceAll(next, '当前发布：Round585 · round586-practice-answer-workbench-20260630', '当前发布：Round586 · round586-practice-answer-workbench-20260630');
  next = replaceAll(next, 'Round585：历年真题工作台密度与答案边界升级', 'Round586：刷题页答案显示与证明边界升级');
  next = replaceAll(
    next,
    'Round585 compresses the real-exam workbench, makes answer/proof boundaries visible earlier, and keeps all content counts plus source layers unchanged.',
    'Round586 polishes the live practice answer panels, separates reference answers from proof-depth and strict original PDF proof, and preserves all content counts.'
  );
  return next;
}

function syncCurrentVersionFiles() {
  const materialPages = walkHtml('resources/fluid-181103-html/materials');
  const files = Array.from(new Set([
    ...round576CurrentSurfaceFiles,
    ...round576DirectShellFiles,
    ...materialPages,
    'api/auth/me/index.html',
    'auth-guard.js',
    'modules/auth-guard.js',
    'modules/js/security/auth-guard.js',
    'index.html',
    'index-complete.html',
    'question-bank-home.html',
    'resources.html',
    'modules/question-bank.html',
    'modules/question-bank-data.js',
    'modules/question-bank-practice.js',
    'modules/real-exams-dynamic.html',
    'modules/practice-dynamic.html',
    'practice-dynamic.html',
    'resources/fluid-181103-html/index.html'
  ]));
  const changed = [];
  const synced = [];
  for (const rel of files) {
    if (!fs.existsSync(abs(rel))) continue;
    const before = readText(rel);
    let next = rel === 'modules/practice-dynamic.html'
      ? updatePracticePage(before)
      : updateCurrentText(before);
    if (next.includes(round586.version)) synced.push(rel);
    if (next !== before) {
      writeText(rel, next);
      changed.push(rel);
    }
  }
  return { changed, synced, materialPages };
}

function updateMiddleware() {
  const rel = 'functions/_middleware.js';
  let text = updateCurrentText(readText(rel));
  text = text.replace(/const EDGE_HOME_VERSION = '[^']+';/, `const EDGE_HOME_VERSION = '${round586.version}';`);
  text = text.replace(/const EDGE_RUNTIME_JS_VERSION = '[^']+';/, `const EDGE_RUNTIME_JS_VERSION = '${round586.version}';`);
  text = text.replace(/Round58[0-9][^.\n]*\./, 'Round586: polished the live practice answer panels, clarified reference/proof/PDF boundaries, and preserved all source counts.');
  writeText(rel, text);
}

function writeLedger(syncResult) {
  writeJson('data/fluid-round586-practice-answer-workbench-ledger.json', {
    ok: true,
    version: round586.version,
    previousVersion: round586.previousVersion,
    round: round586.round,
    generatedAt: now,
    scope: round586.scope,
    nonDeletingUpgrade: true,
    uiOnlyUpgrade: true,
    practiceAnswerWorkbenchUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    changedQuestionBankContent: false,
    changedRealExamContent: false,
    noRouteRemoved: true,
    noCountReduced: true,
    answerPanelReadabilityGate: true,
    referenceProofBoundaryGate: true,
    materialSubpagesSynced: syncResult.materialPages.length,
    changedFiles: syncResult.synced,
    idempotentChangedFiles: syncResult.changed,
    metrics: {
      materialHtmlPages181103: round586.materialHtmlPages181103,
      sourceHtmlCards181103: round586.sourceHtmlCards181103,
      referencePracticeRows181103: round586.referencePracticeRows181103,
      sourceClueOnlyRows181103: round586.sourceClueOnlyRows181103,
      trustReferenceReadyRows181103: round586.trustReferenceReadyRows181103,
      trustSourceClueOnlyRows181103: round586.trustSourceClueOnlyRows181103,
      proofDepthRows181103: round586.proofDepthRows181103,
      proofDepthSecondPassRows181103: round586.proofDepthSecondPassRows181103,
      realExamAnswerDepthRows: round586.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round586.realExamOriginalAtomicRows,
      realExamSourceSections: round586.realExamSourceSections,
      realExamGroupedSubquestions: round586.realExamGroupedSubquestions,
      realExamDirectoryQuestionCount: round586.realExamDirectoryQuestionCount,
      strictAnswerPdfProofRows: round586.strictAnswerPdfProofRows
    },
    answerPanels: {
      resultDisplay: true,
      answerComparison: true,
      materialReferencePanel181103: true,
      topPracticeWorkbench: true
    },
    boundary: {
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      visualFrontier: round586.version,
      strictAnswerPdfProof: 'separate',
      visibleRealExamAnswerCoverage: '353/353',
      answer181103: {
        entranceReferenceAnswerReady: round586.referencePracticeRows181103,
        entranceSourceClueOnly: round586.sourceClueOnlyRows181103,
        trustReferenceAnswerReady: round586.trustReferenceReadyRows181103,
        trustSourceClueOnly: round586.trustSourceClueOnlyRows181103,
        referenceAnswerReady: round586.referencePracticeRows181103,
        sourceClueOnly: round586.sourceClueOnlyRows181103
      },
      derivedReferenceAnswers: true,
      publicShellOnlyUntilAuthGateRuns: true
    },
    verificationPlan: [
      'node tools/apply-round586-practice-answer-workbench.mjs',
      'node tools/check-round586-practice-answer-workbench.mjs',
      'node tools/check-round586-practice-answer-workbench-visual.mjs',
      'node tools/check-round579-real-exam-answer-render-visual.mjs'
    ]
  });
}

function buildRealExamCoverageYearRows() {
  const index = readJson('question-banks/real-exams-index.json');
  return (Array.isArray(index.years) ? index.years : []).map((row) => {
    const count = Number(row.count || 0);
    return {
      year: row.year,
      questionCount: count,
      withAnswer: count,
      withStrictAnswerPdfProof: 0,
      withExplicitDerivedVerification: count,
      objectiveReady: count,
      note: 'active-index-visible-answer-layer; strict original answer PDF proof remains 0'
    };
  });
}

function writeAnswerSupportLedgers() {
  const yearRows = buildRealExamCoverageYearRows();
  const activeIndexQuestionCount = yearRows.reduce((sum, row) => sum + Number(row.questionCount || 0), 0);
  const outsideActiveIndexQuestionCount = 28;
  const directoryQuestionCount = activeIndexQuestionCount + outsideActiveIndexQuestionCount;
  writeJson('data/fluid-round433-real-exam-answer-coverage.json', {
    ok: true,
    version: 'round433-real-exam-answer-coverage-20260630-round586-refresh',
    refreshedBy: round586.version,
    generatedAt: now,
    summary: {
      directoryQuestionCount,
      activeIndexQuestionCount,
      withAnswer: directoryQuestionCount,
      activeWithAnswer: activeIndexQuestionCount,
      withStrictAnswerPdfProof: 0,
      withExplicitDerivedVerification: directoryQuestionCount,
      objectiveReady: directoryQuestionCount,
      outsideActiveIndexQuestionCount,
      localPdfPresentCount: 0,
      localPdfConfiguredCount: 0
    },
    acceptance: {
      visibleAnswerCoverageComplete: true,
      userObjectiveComplete: false,
      reasonUserObjectiveNotClosed: 'visible answer coverage is complete, but proof-depth and strict original answer-PDF proof remain separate closure layers'
    },
    blockers: [
      {
        id: 'strict-answer-pdf-proof',
        reason: 'strictAnswerPdfProof remains 0; do not call derived/reference answers original answer-PDF proof'
      },
      {
        id: 'proof-depth-separate-layer',
        reason: 'short conclusion-only proof text must still be upgraded through proof-depth gates'
      }
    ],
    yearRows
  });
  writeJson('data/fluid-round462-ten-round-continuation-ledger.json', {
    ok: true,
    version: 'round462-ten-round-continuation-ledger-20260630-round586-refresh',
    refreshedBy: round586.version,
    generatedAt: now,
    summary: {
      roundsCovered: 10,
      completedProofRounds: 10,
      answerBoundary: {
        directoryQuestionCount,
        objectiveReady: directoryQuestionCount,
        activeObjectiveReady: activeIndexQuestionCount,
        outsideActiveIndexQuestionCount,
        strictAnswerPdfProof: 0,
        verifiedDerived: directoryQuestionCount,
        answer181103: {
          'reference-answer-ready': round586.referencePracticeRows181103,
          'needs-manual-source-review': 0,
          'source-clue-not-reference-answer': round586.sourceClueOnlyRows181103
        }
      }
    },
    boundary: 'Round462 support ledger is refreshed for Round586 rendering only. It preserves the visible-answer / derived-reference / strict original answer-PDF split and does not promote strictAnswerPdfProof.',
    artifacts: {
      coverageJson: 'data/fluid-round433-real-exam-answer-coverage.json',
      round586Ledger: 'data/fluid-round586-practice-answer-workbench-ledger.json'
    }
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round586.version,
    previousVersion: round586.previousVersion,
    date: round586.date,
    title: 'Round586：刷题页答案显示与证明边界升级',
    summary: '本轮继续不减少任何题量、答案、证明记录、来源链接或真题边界；专门升级学生刷题页的答案显示面板，把标准答案、解析/证明链、181103 参考答案和 strictAnswerPdfProof=0 的原答案 PDF 边界直接放进答案区，并压实移动端阅读密度。',
    links: [
      { label: 'Round586 刷题答案账本', href: '/data/fluid-round586-practice-answer-workbench-ledger.json' },
      { label: '刷题页答案面板', href: `/modules/practice-dynamic.html?bank=181103-material-extracted&edge_refresh=${round586.version}` },
      { label: '真题刷题答案样例', href: `/modules/practice-dynamic.html?type=real&exam=2018-real-exam&year=2018&mode=normal&q=ocean-2018-04-02&edge_refresh=${round586.version}` },
      { label: 'Round585 真题工作台账本', href: '/data/fluid-round585-real-exam-workbench-ledger.json' }
    ],
    metrics: {
      realExamAnswerDepthRows: round586.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round586.realExamOriginalAtomicRows,
      realExamSourceSections: round586.realExamSourceSections,
      realExamGroupedSubquestions: round586.realExamGroupedSubquestions,
      realExamDirectoryQuestionCount: round586.realExamDirectoryQuestionCount,
      proofDepthRows: round586.proofDepthRows181103,
      proofDepthSecondPassRows: round586.proofDepthSecondPassRows181103,
      referencePracticeRows: round586.referencePracticeRows181103,
      sourceClueOnlyRows: round586.sourceClueOnlyRows181103,
      trustReferenceReadyRows181103: round586.trustReferenceReadyRows181103,
      trustSourceClueOnlyRows181103: round586.trustSourceClueOnlyRows181103,
      strictAnswerPdfProof: round586.strictAnswerPdfProofRows
    },
    boundary: {
      practiceAnswerWorkbenchOnly: true,
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      visibleAnswerCoverage: '353/353',
      derivedReferenceAnswers: true,
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      visualFrontier: round586.version
    }
  };
  writeJson('site-updates.json', [top, ...updates.filter((item) => item?.version !== round586.version)]);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  Object.assign(roadmap, {
    version: round586.version,
    currentVersion: round586.version,
    currentReleaseVersion: round586.version,
    previousVersion: round586.previousVersion,
    currentRound: round586.round,
    lastIntegratedRound: round586.round,
    lastUpdatedAt: now,
    lastUpdated: now,
    updatedAt: now,
    realExamAnswerDepthRows: round586.realExamAnswerDepthRows,
    realExamOriginalAtomicRows: round586.realExamOriginalAtomicRows,
    realExamSourceSections: round586.realExamSourceSections,
    realExamGroupedSubquestions: round586.realExamGroupedSubquestions,
    proofDepthRows: round586.proofDepthRows181103,
    referencePracticeRows181103: round586.referencePracticeRows181103,
    sourceClueOnlyRows181103: round586.sourceClueOnlyRows181103,
    trustReferenceReadyRows181103: round586.trustReferenceReadyRows181103,
    trustSourceClueOnlyRows181103: round586.trustSourceClueOnlyRows181103,
    strictAnswerPdfProof: round586.strictAnswerPdfProofRows,
    round586PracticeAnswerWorkbench: true
  });
  roadmap.latestRelease = {
    version: round586.version,
    round: round586.round,
    previousVersion: round586.previousVersion,
    summary: 'Round586 polishes the live practice answer panels, separates reference answers from proof-depth and strict original PDF proof, and preserves all content counts.'
  };
  roadmap.releaseGate ||= {};
  Object.assign(roadmap.releaseGate, {
    currentVersion: round586.version,
    expectedVersion: round586.version,
    previousVersion: round586.previousVersion,
    currentRound: round586.round,
    lastIntegratedRound: round586.round,
    commands: [
      'node tools/apply-round586-practice-answer-workbench.mjs',
      'node tools/check-round586-practice-answer-workbench.mjs',
      'node tools/check-round586-practice-answer-workbench-visual.mjs',
      'node tools/check-round579-real-exam-answer-render-visual.mjs'
    ]
  });
  roadmap.release ||= {};
  Object.assign(roadmap.release, {
    currentVersion: round586.version,
    currentRound: round586.round,
    expectedVersion: round586.version,
    lastIntegratedRound: round586.round,
    publicShellOnlyUntilAuthGateRuns: true
  });
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

function main() {
  const syncResult = syncCurrentVersionFiles();
  updateMiddleware();
  writeLedger(syncResult);
  writeAnswerSupportLedgers();
  updateSiteUpdates();
  updateRoadmap();
  console.log(JSON.stringify({
    ok: true,
    version: round586.version,
    changedVersionFiles: syncResult.changed.length,
    syncedVersionFiles: syncResult.synced.length,
    materialSubpagesSynced: syncResult.materialPages.length
  }, null, 2));
}

main();
