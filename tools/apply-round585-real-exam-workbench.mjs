#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';
import { round585 } from './round585-real-exam-workbench-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round585 apply from /Volumes/mac_2T during lifs isolation.');
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

const round585Css = `
    /* Round585 real-exam workbench density polish */
    body[data-round585-real-exam-workbench-page="1"] {
      background: linear-gradient(180deg, #f8fbff 0, #ffffff 230px, #f6f8fb 100%);
    }
    body[data-round585-real-exam-workbench-page="1"] .round351-mobile-shortcuts {
      margin-bottom: 10px;
      padding: 10px;
      box-shadow: 0 12px 34px rgba(15, 23, 42, .07);
    }
    body[data-round585-real-exam-workbench-page="1"] .brand {
      min-height: 44px;
    }
    body[data-round585-real-exam-workbench-page="1"] .round351-mobile-shortcuts__grid {
      gap: 7px;
    }
    body[data-round585-real-exam-workbench-page="1"] .round351-mobile-shortcuts a {
      min-height: 46px;
      padding: 8px 9px;
      background: rgba(255, 255, 255, .88);
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench {
      display: grid;
      gap: 8px;
      margin: 0 0 10px;
      padding: 10px;
      border: 1px solid rgba(15, 118, 110, .18);
      border-radius: 8px;
      background: rgba(255, 255, 255, .86);
      box-shadow: 0 12px 34px rgba(15, 23, 42, .07);
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
      color: #536779;
      font-size: 12px;
      font-weight: 780;
      line-height: 1.45;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__head b {
      display: block;
      color: #0f766e;
      font-size: 13px;
      line-height: 1.3;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__head span {
      display: block;
      overflow-wrap: anywhere;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__head a {
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      padding: 0 10px;
      border: 1px solid rgba(15, 118, 110, .18);
      border-radius: 8px;
      background: rgba(236, 253, 245, .86);
      color: #0f766e;
      font-weight: 850;
      text-decoration: none;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 7px;
      margin: 0;
      padding: 0;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics div {
      min-width: 0;
      min-height: 54px;
      display: grid;
      align-content: center;
      gap: 2px;
      padding: 8px;
      border: 1px solid rgba(15, 118, 110, .14);
      border-radius: 8px;
      background: rgba(236, 253, 245, .62);
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics div:nth-child(5) {
      border-color: rgba(126, 34, 206, .16);
      background: rgba(250, 245, 255, .72);
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics div:nth-child(6) {
      border-color: rgba(245, 158, 11, .22);
      background: rgba(255, 251, 235, .78);
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics dt {
      color: #0f766e;
      font-size: 19px;
      font-weight: 900;
      line-height: 1.05;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics div:nth-child(5) dt {
      color: #6d28d9;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics div:nth-child(6) dt {
      color: #92400e;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics dd {
      margin: 0;
      color: #536779;
      font-size: 11px;
      font-weight: 760;
      line-height: 1.35;
      overflow-wrap: anywhere;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__actions {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 7px;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__actions a {
      min-height: 44px;
      display: grid;
      align-content: center;
      padding: 8px 9px;
      border: 1px solid rgba(15, 118, 110, .16);
      border-radius: 8px;
      background: rgba(255, 255, 255, .82);
      color: #0f766e;
      font-size: 12px;
      font-weight: 850;
      line-height: 1.32;
      overflow-wrap: anywhere;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__actions a span {
      display: block;
      margin-top: 2px;
      color: #536779;
      font-size: 11px;
      font-weight: 760;
    }
    body[data-round585-real-exam-workbench-page="1"] .hero {
      grid-template-columns: minmax(0, 1fr) minmax(286px, 318px);
      gap: 10px;
      align-items: start;
      margin-bottom: 10px;
    }
    body[data-round585-real-exam-workbench-page="1"] .lead,
    body[data-round585-real-exam-workbench-page="1"] .panel,
    body[data-round585-real-exam-workbench-page="1"] .card {
      box-shadow: 0 12px 34px rgba(15, 23, 42, .07);
    }
    body[data-round585-real-exam-workbench-page="1"] .lead {
      min-height: 0;
      padding: 16px;
    }
    body[data-round585-real-exam-workbench-page="1"] .lead > div {
      min-width: 0;
    }
    body[data-round585-real-exam-workbench-page="1"] .eyebrow {
      padding: 6px 9px;
    }
    body[data-round585-real-exam-workbench-page="1"] h1 {
      margin: 10px 0 6px;
      font-size: clamp(28px, 3.4vw, 42px);
      line-height: 1.04;
    }
    body[data-round585-real-exam-workbench-page="1"] p {
      line-height: 1.54;
    }
    body[data-round585-real-exam-workbench-page="1"] .current-ledger {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 6px;
      margin-top: 9px;
      font-size: 11px;
      line-height: 1.38;
    }
    body[data-round585-real-exam-workbench-page="1"] .current-ledger span,
    body[data-round585-real-exam-workbench-page="1"] .current-ledger a {
      min-width: 0;
      padding: 6px 7px;
      overflow-wrap: anywhere;
    }
    body[data-round585-real-exam-workbench-page="1"] .current-ledger a {
      min-height: 44px;
      display: inline-flex;
      align-items: center;
    }
    body[data-round585-real-exam-workbench-page="1"] .current-ledger span:first-child {
      grid-column: 1 / -1;
      color: #3f5368;
      background: rgba(248, 250, 252, .92);
      border-color: rgba(15, 118, 110, .12);
    }
    body[data-round585-real-exam-workbench-page="1"] .source-boundary-strip {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 6px;
      margin-top: 8px;
    }
    body[data-round585-real-exam-workbench-page="1"] .source-boundary-strip span {
      padding: 7px;
      font-size: 11px;
      line-height: 1.38;
    }
    body[data-round585-real-exam-workbench-page="1"] .source-boundary-strip b {
      font-size: 15px;
    }
    body[data-round585-real-exam-workbench-page="1"] .round302-audit {
      margin-top: 8px;
      padding: 8px;
      box-shadow: none;
    }
    body[data-round585-real-exam-workbench-page="1"] .round302-audit div > strong,
    body[data-round585-real-exam-workbench-page="1"] .round302-audit-title b {
      font-size: 12px;
    }
    body[data-round585-real-exam-workbench-page="1"] .round302-audit div > span,
    body[data-round585-real-exam-workbench-page="1"] .round302-audit-title span {
      line-height: 1.42;
    }
    body[data-round585-real-exam-workbench-page="1"] .round302-audit ul {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 6px;
      margin: 8px 0 0;
      padding: 0;
      list-style: none;
    }
    body[data-round585-real-exam-workbench-page="1"] .round302-audit li {
      min-width: 0;
      margin: 0;
      padding: 0;
    }
    body[data-round585-real-exam-workbench-page="1"] .round302-audit li span,
    body[data-round585-real-exam-workbench-page="1"] .round302-audit-grid span {
      padding: 7px;
      font-size: 11px;
      line-height: 1.38;
    }
    body[data-round585-real-exam-workbench-page="1"] .round302-audit-flow,
    body[data-round585-real-exam-workbench-page="1"] .audit-links {
      gap: 5px;
      margin-top: 7px;
    }
    body[data-round585-real-exam-workbench-page="1"] .round302-audit-flow a,
    body[data-round585-real-exam-workbench-page="1"] .round302-audit-flow span,
    body[data-round585-real-exam-workbench-page="1"] .audit-links a {
      min-height: 34px;
      display: inline-flex;
      align-items: center;
      padding: 5px 7px;
    }
    body[data-round585-real-exam-workbench-page="1"] .surface-legend,
    body[data-round585-real-exam-workbench-page="1"] .ledger-route {
      gap: 6px;
      margin-top: 8px;
    }
    body[data-round585-real-exam-workbench-page="1"] .surface-legend span,
    body[data-round585-real-exam-workbench-page="1"] .ledger-route a {
      padding: 7px;
      line-height: 1.36;
    }
    body[data-round585-real-exam-workbench-page="1"] .metrics {
      gap: 6px;
      margin-top: 10px;
    }
    body[data-round585-real-exam-workbench-page="1"] .metric {
      min-height: 58px;
      padding: 10px;
    }
    body[data-round585-real-exam-workbench-page="1"] .metric b {
      font-size: 21px;
    }
    body[data-round585-real-exam-workbench-page="1"] .panel {
      align-self: start;
      position: sticky;
      top: 10px;
      padding: 13px;
    }
    body[data-round585-real-exam-workbench-page="1"] .field {
      gap: 5px;
      margin-bottom: 8px;
    }
    body[data-round585-real-exam-workbench-page="1"] .input,
    body[data-round585-real-exam-workbench-page="1"] .select {
      min-height: 42px;
    }
    body[data-round585-real-exam-workbench-page="1"] .topics {
      gap: 6px;
      margin-top: 8px;
    }
    body[data-round585-real-exam-workbench-page="1"] .topic {
      min-height: 44px;
      padding: 0 9px;
    }
    body[data-round585-real-exam-workbench-page="1"] .toolbar,
    body[data-round585-real-exam-workbench-page="1"] .filter-summary,
    body[data-round585-real-exam-workbench-page="1"] .fidelity-note,
    body[data-round585-real-exam-workbench-page="1"] .source-note,
    body[data-round585-real-exam-workbench-page="1"] .chapter-practice,
    body[data-round585-real-exam-workbench-page="1"] .exam-loop {
      margin-bottom: 10px;
    }
    body[data-round585-real-exam-workbench-page="1"] .fidelity-note summary {
      min-height: 44px;
      display: flex;
      align-items: center;
      padding: 6px 0;
      line-height: 1.35;
    }
    body[data-round585-real-exam-workbench-page="1"] .exam-loop > .loop-grid a {
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 10px;
      border: 1px solid rgba(15, 118, 110, .16);
      border-radius: 8px;
      background: rgba(255, 255, 255, .78);
      color: #0f766e;
      font-size: 12px;
      font-weight: 850;
      line-height: 1.3;
      text-align: center;
    }
    body[data-round585-real-exam-workbench-page="1"] .fidelity-meta a,
    body[data-round585-real-exam-workbench-page="1"] .granularity-years a,
    body[data-round585-real-exam-workbench-page="1"] .year-ledger-row a,
    body[data-round585-real-exam-workbench-page="1"] .type-ledger-row a,
    body[data-round585-real-exam-workbench-page="1"] .review-ledger-row a,
    body[data-round585-real-exam-workbench-page="1"] .parent-audit-row a,
    body[data-round585-real-exam-workbench-page="1"] .source-expansion-row a,
    body[data-round585-real-exam-workbench-page="1"] .answer-ledger-row a {
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      padding-top: 7px;
      padding-bottom: 7px;
    }
    body[data-round585-real-exam-workbench-page="1"] .grid {
      gap: 10px;
    }
    body[data-round585-real-exam-workbench-page="1"] .card {
      min-height: 214px;
      padding: 15px;
      gap: 10px;
    }
    body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench a:focus-visible {
      outline: 3px solid rgba(15, 118, 110, .46);
      outline-offset: 3px;
    }
    @media(max-width:1080px){
      body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
    @media(max-width:920px){
      body[data-round585-real-exam-workbench-page="1"] .hero {
        grid-template-columns: 1fr;
      }
      body[data-round585-real-exam-workbench-page="1"] .panel {
        position: static;
      }
      body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__actions,
      body[data-round585-real-exam-workbench-page="1"] .current-ledger,
      body[data-round585-real-exam-workbench-page="1"] .source-boundary-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    @media(max-width:600px){
      body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench,
      body[data-round585-real-exam-workbench-page="1"] .round351-mobile-shortcuts,
      body[data-round585-real-exam-workbench-page="1"] .lead,
      body[data-round585-real-exam-workbench-page="1"] .panel {
        padding: 10px;
      }
      body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__head {
        display: grid;
      }
      body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__head a {
        justify-self: stretch;
      }
      body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics,
      body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__actions,
      body[data-round585-real-exam-workbench-page="1"] .current-ledger,
      body[data-round585-real-exam-workbench-page="1"] .source-boundary-strip,
      body[data-round585-real-exam-workbench-page="1"] .surface-legend {
        grid-template-columns: 1fr 1fr;
      }
      body[data-round585-real-exam-workbench-page="1"] .current-ledger span:first-child {
        grid-column: 1 / -1;
      }
      body[data-round585-real-exam-workbench-page="1"] h1 {
        font-size: 30px;
      }
      body[data-round585-real-exam-workbench-page="1"] .round302-audit ul,
      body[data-round585-real-exam-workbench-page="1"] .round302-audit-grid,
      body[data-round585-real-exam-workbench-page="1"] .ledger-route {
        grid-template-columns: 1fr;
      }
    }
    @media(max-width:360px){
      body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__metrics,
      body[data-round585-real-exam-workbench-page="1"] .round585-real-exam-workbench__actions,
      body[data-round585-real-exam-workbench-page="1"] .source-boundary-strip {
        grid-template-columns: 1fr;
      }
    }
`;

const round585Workbench = `
      <!-- Round585 real-exam workbench start -->
      <section class="round585-real-exam-workbench" data-round585-real-exam-workbench="answer-proof-strip" data-round585-answer-boundary-strip="1" aria-label="Round585 历年真题答案与证明边界工作台">
        <div class="round585-real-exam-workbench__head">
          <div><b>Round585 真题工作台</b><span>不减少题量、答案、证明记录或来源链接；先把真题页首屏压实，把答案显示、派生参考答案和 strict 原答案 PDF 证据三层分开。</span></div>
          <a href="/data/fluid-round585-real-exam-workbench-ledger.json">Round585 账本</a>
        </div>
        <dl class="round585-real-exam-workbench__metrics">
          <div><dt>325</dt><dd>原文小题，学生实际练习口径。</dd></div>
          <div><dt>68</dt><dd>组题 section，继续拆成子题。</dd></div>
          <div><dt>217</dt><dd>grouped 小问，不合并成父题。</dd></div>
          <div><dt>163</dt><dd>真题过程型补答累计，保留推导层。</dd></div>
          <div><dt>353/353</dt><dd>答案显示完整，不等于官方逐字答案。</dd></div>
          <div><dt>0</dt><dd>strictAnswerPdfProof，原答案 PDF 逐字证据仍单独为 0。</dd></div>
        </dl>
        <div class="round585-real-exam-workbench__actions" aria-label="Round585 真题学习入口">
          <a href="#cards">开始刷真题<span>先圈条件再看解析</span></a>
          <a href="#answerEvidenceBoundaryNote">答案边界<span>显示 / 派生 / strict 分层</span></a>
          <a href="#sourceGranularityNote">题数账本<span>325 / 68 / 217</span></a>
          <a href="/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=round585-real-exam-workbench-density-20260630#questionBanksList">181103 推导<span>400 可参考 / 422 proof-depth</span></a>
        </div>
      </section>
      <!-- Round585 real-exam workbench end -->
`;

function injectRound585Css(text) {
  const marker = '\n    @media(max-width:1080px){.chapter-practice-grid';
  let next = text;
  const start = next.indexOf('\n    /* Round585 real-exam workbench density polish */');
  if (start >= 0) {
    const originalMarkerIndex = next.indexOf(marker, start);
    if (originalMarkerIndex < 0) throw new Error('Could not find Round585 CSS replacement marker');
    const prefix = next.slice(0, start).replace(/\n{2,}$/g, '\n');
    next = prefix + next.slice(originalMarkerIndex);
  }
  if (!next.includes(marker)) throw new Error('Could not find Round585 CSS insertion marker');
  return next.replace(marker, `${round585Css}${marker}`);
}

function injectRound585Workbench(text) {
  let next = text.replace(/\n\s*<!-- Round585 real-exam workbench start -->[\s\S]*?<!-- Round585 real-exam workbench end -->\n/g, '\n');
  const marker = '      </nav>\n\n      <section class="exam-loop"';
  if (!next.includes(marker)) throw new Error('Could not find Round585 workbench insertion marker');
  return next.replace(marker, `      </nav>\n${round585Workbench}\n      <section class="exam-loop"`);
}

function addBodyMarker(text) {
  return text.replace(/<body([^>]*)>/, (match, attrs) => {
    const cleanAttrs = attrs.replace(/\sdata-round585-real-exam-workbench-page="1"/g, '').trim();
    return cleanAttrs ? `<body ${cleanAttrs} data-round585-real-exam-workbench-page="1">` : '<body data-round585-real-exam-workbench-page="1">';
  });
}

function updateRealExamsPage(text) {
  let next = injectRound585Css(text);
  next = injectRound585Workbench(next);
  next = addBodyMarker(next);
  next = replaceAll(
    next,
    '<nav class="round351-mobile-shortcuts" data-round351-mobile-shortcuts="real-exams"',
    '<nav class="round351-mobile-shortcuts" data-round351-mobile-shortcuts="real-exams" data-round585-real-exam-workbench="shortcuts"'
  );
  next = next.replace(/data-round585-real-exam-workbench="shortcuts"\s+data-round585-real-exam-workbench="shortcuts"/g, 'data-round585-real-exam-workbench="shortcuts"');
  next = replaceAll(next, '<b>Round396 真题直达</b>', '<b>Round585 真题直达</b>');
  next = replaceAll(
    next,
    '<section class="hero">',
    '<section class="hero" data-round585-real-exam-workbench="hero">'
  );
  next = next.replace(/data-round585-real-exam-workbench="hero"\s+data-round585-real-exam-workbench="hero"/g, 'data-round585-real-exam-workbench="hero"');
  next = replaceAll(
    next,
    '<div class="source-boundary-strip" aria-label="原始来源计数边界">',
    '<div class="source-boundary-strip" data-round585-answer-boundary-strip="1" aria-label="原始来源计数边界">'
  );
  next = next.replace(/data-round585-answer-boundary-strip="1"\s+data-round585-answer-boundary-strip="1"/g, 'data-round585-answer-boundary-strip="1"');
  next = replaceAll(
    next,
    '今天先做真实真题，不先刷目录。题面、答案证据、181103 依据和专属课状态分开核对；公开壳可见不等于真实账号已通过。',
    'Round585 先做真实真题，不先刷目录；题面、答案显示、派生参考推导、181103 依据和 strict 原答案 PDF 证据分层核对，公开壳可见仍不等于真实账号已通过。'
  );
  return next;
}

function updateCurrentText(text) {
  let next = replaceAll(text, round585.previousVersion, round585.version);
  next = replaceAll(next, 'Round584 · round585-real-exam-workbench-density-20260630', 'Round585 · round585-real-exam-workbench-density-20260630');
  next = replaceAll(next, '当前版本：Round584 · round585-real-exam-workbench-density-20260630', '当前版本：Round585 · round585-real-exam-workbench-density-20260630');
  next = replaceAll(next, '当前发布：Round584 · round585-real-exam-workbench-density-20260630', '当前发布：Round585 · round585-real-exam-workbench-density-20260630');
  next = replaceAll(next, 'Round584：题库入口首页密度与视觉节奏升级', 'Round585：历年真题工作台密度与答案边界升级');
  next = replaceAll(
    next,
    'Round584 compresses the question-bank home workbench, improves first-viewport route density, and keeps all content counts plus answer/proof boundaries unchanged.',
    'Round585 compresses the real-exam workbench, makes answer/proof boundaries visible earlier, and keeps all content counts plus source layers unchanged.'
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
    'resources/fluid-181103-html/index.html'
  ]));
  const changed = [];
  const synced = [];
  for (const rel of files) {
    if (!fs.existsSync(abs(rel))) continue;
    const before = readText(rel);
    let next = updateCurrentText(before);
    if (rel === 'modules/real-exams-dynamic.html') next = updateRealExamsPage(next);
    if (next.includes(round585.version)) synced.push(rel);
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
  text = text.replace(/const EDGE_HOME_VERSION = '[^']+';/, `const EDGE_HOME_VERSION = '${round585.version}';`);
  text = text.replace(/const EDGE_RUNTIME_JS_VERSION = '[^']+';/, `const EDGE_RUNTIME_JS_VERSION = '${round585.version}';`);
  text = text.replace(/Round58[0-9][^.\n]*\./, 'Round585: compressed the real-exam workbench, made answer boundaries visible earlier, and preserved all source/proof counts.');
  writeText(rel, text);
}

function writeLedger(syncResult) {
  writeJson('data/fluid-round585-real-exam-workbench-ledger.json', {
    ok: true,
    version: round585.version,
    previousVersion: round585.previousVersion,
    round: round585.round,
    generatedAt: now,
    scope: round585.scope,
    nonDeletingUpgrade: true,
    uiOnlyUpgrade: true,
    realExamWorkbenchDensityUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    changedQuestionBankContent: false,
    noRouteRemoved: true,
    noCountReduced: true,
    firstViewportAnswerBoundaryGate: true,
    materialSubpagesSynced: syncResult.materialPages.length,
    changedFiles: syncResult.synced,
    idempotentChangedFiles: syncResult.changed,
    metrics: {
      materialHtmlPages181103: round585.materialHtmlPages181103,
      sourceHtmlCards181103: round585.sourceHtmlCards181103,
      referencePracticeRows181103: round585.referencePracticeRows181103,
      sourceClueOnlyRows181103: round585.sourceClueOnlyRows181103,
      proofDepthRows181103: round585.proofDepthRows181103,
      proofDepthSecondPassRows181103: round585.proofDepthSecondPassRows181103,
      realExamAnswerDepthRows: round585.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round585.realExamOriginalAtomicRows,
      realExamSourceSections: round585.realExamSourceSections,
      realExamGroupedSubquestions: round585.realExamGroupedSubquestions,
      strictAnswerPdfProofRows: round585.strictAnswerPdfProofRows
    },
    densityTargets: {
      desktopInteractiveLinksInFirstViewport: '>= 8',
      mobileInteractiveLinksInFirstViewport: '>= 5',
      answerBoundaryStripVisibleBeforeHero: true,
      noHorizontalOverflow: true,
      noSmallVisibleTouchTargets: true
    },
    boundary: {
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      homeDensityFrontier: round585.previousVersion,
      strictAnswerPdfProof: 'separate',
      visibleAnswerCoverage: '353/353',
      derivedReferenceAnswers: true,
      publicShellOnlyUntilAuthGateRuns: true
    },
    verificationPlan: [
      'node tools/apply-round585-real-exam-workbench.mjs',
      'node tools/check-round585-real-exam-workbench.mjs',
      'node tools/check-round585-real-exam-workbench-visual.mjs',
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
    version: 'round433-real-exam-answer-coverage-20260630-round585-refresh',
    refreshedBy: round585.version,
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
    version: 'round462-ten-round-continuation-ledger-20260630-round585-refresh',
    refreshedBy: round585.version,
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
          'reference-answer-ready': round585.referencePracticeRows181103,
          'needs-manual-source-review': 0,
          'source-clue-not-reference-answer': round585.sourceClueOnlyRows181103
        }
      }
    },
    boundary: 'Round462 support ledger is refreshed for Round585 rendering only. It preserves the visible-answer / derived-reference / strict original answer-PDF split and does not promote strictAnswerPdfProof.',
    artifacts: {
      coverageJson: 'data/fluid-round433-real-exam-answer-coverage.json',
      round585Ledger: 'data/fluid-round585-real-exam-workbench-ledger.json'
    }
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round585.version,
    previousVersion: round585.previousVersion,
    date: round585.date,
    title: 'Round585：历年真题工作台密度与答案边界升级',
    summary: '本轮继续不减少任何题量、答案、证明记录、链接或来源边界；专门压实历年真题动态页首屏，把筛选面板从大空白拉伸中解出来，并新增答案边界工作台，明确 325 原文小题、68 组题、217 grouped 小问、163 真题过程型补答、353/353 答案显示和 strictAnswerPdfProof=0 六层边界。',
    links: [
      { label: 'Round585 真题工作台账本', href: '/data/fluid-round585-real-exam-workbench-ledger.json' },
      { label: '历年真题动态页', href: `/modules/real-exams-dynamic.html?edge_refresh=${round585.version}#cards` },
      { label: '真题答案边界', href: `/modules/real-exams-dynamic.html?edge_refresh=${round585.version}#answerEvidenceBoundaryNote` },
      { label: 'Round584 入口首页密度账本', href: '/data/fluid-round584-question-bank-home-density-ledger.json' }
    ],
    metrics: {
      realExamAnswerDepthRows: round585.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round585.realExamOriginalAtomicRows,
      realExamSourceSections: round585.realExamSourceSections,
      realExamGroupedSubquestions: round585.realExamGroupedSubquestions,
      proofDepthRows: round585.proofDepthRows181103,
      proofDepthSecondPassRows: round585.proofDepthSecondPassRows181103,
      referencePracticeRows: round585.referencePracticeRows181103,
      sourceClueOnlyRows: round585.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round585.strictAnswerPdfProofRows
    },
    boundary: {
      realExamWorkbenchOnly: true,
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      visibleAnswerCoverage: '353/353',
      derivedReferenceAnswers: true,
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      homeDensityFrontier: round585.previousVersion
    }
  };
  writeJson('site-updates.json', [top, ...updates.filter((item) => item?.version !== round585.version)]);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  Object.assign(roadmap, {
    version: round585.version,
    currentVersion: round585.version,
    currentReleaseVersion: round585.version,
    previousVersion: round585.previousVersion,
    currentRound: round585.round,
    lastIntegratedRound: round585.round,
    lastUpdatedAt: now,
    lastUpdated: now,
    updatedAt: now,
    realExamAnswerDepthRows: round585.realExamAnswerDepthRows,
    realExamOriginalAtomicRows: round585.realExamOriginalAtomicRows,
    realExamSourceSections: round585.realExamSourceSections,
    realExamGroupedSubquestions: round585.realExamGroupedSubquestions,
    proofDepthRows: round585.proofDepthRows181103,
    referencePracticeRows181103: round585.referencePracticeRows181103,
    sourceClueOnlyRows181103: round585.sourceClueOnlyRows181103,
    strictAnswerPdfProof: round585.strictAnswerPdfProofRows,
    round585RealExamWorkbenchDensity: true
  });
  roadmap.latestRelease = {
    version: round585.version,
    round: round585.round,
    previousVersion: round585.previousVersion,
    summary: 'Round585 compresses the real-exam workbench, makes answer/proof boundaries visible earlier, and keeps all content counts plus source layers unchanged.'
  };
  roadmap.releaseGate ||= {};
  Object.assign(roadmap.releaseGate, {
    currentVersion: round585.version,
    expectedVersion: round585.version,
    commands: [
      'node tools/apply-round585-real-exam-workbench.mjs',
      'node tools/check-round585-real-exam-workbench.mjs',
      'node tools/check-round585-real-exam-workbench-visual.mjs',
      'node tools/check-round579-real-exam-answer-render-visual.mjs'
    ]
  });
  roadmap.release ||= {};
  Object.assign(roadmap.release, {
    currentVersion: round585.version,
    currentRound: round585.round,
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
    version: round585.version,
    changedVersionFiles: syncResult.changed.length,
    syncedVersionFiles: syncResult.synced.length,
    materialSubpagesSynced: syncResult.materialPages.length
  }, null, 2));
}

main();
