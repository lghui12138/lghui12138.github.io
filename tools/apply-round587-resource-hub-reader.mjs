#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';
import { round587 } from './round587-resource-hub-reader-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round587 apply from /Volumes/mac_2T during lifs isolation.');
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

function addBodyMarker(text, marker) {
  return text.replace(/<body([^>]*)>/, (match, attrs) => {
    const cleanAttrs = attrs.replace(new RegExp(`\\s${marker}="1"`, 'g'), '').trim();
    return cleanAttrs ? `<body ${cleanAttrs} ${marker}="1">` : `<body ${marker}="1">`;
  });
}

const resourceCss = `
<style data-round587-resource-hub-reader>
/* Round587 resource hub reader density */
body[data-round587-resource-hub-page="1"] {
  background: linear-gradient(180deg, #f8fafc 0, #ffffff 260px, #f3f6f9 100%) !important;
}
body[data-round587-resource-hub-page="1"] .page-hero {
  padding-top: 18px;
  padding-bottom: 6px;
}
body[data-round587-resource-hub-page="1"] .hero-title {
  margin: 6px 0 6px;
  font-size: clamp(1.56rem, 2.5vw, 2.1rem);
}
body[data-round587-resource-hub-page="1"] .hero-badge {
  background: #eef6ff;
  border-color: rgba(37, 99, 235, .18);
  color: #1d4ed8;
}
body[data-round587-resource-hub-page="1"] .hero-badge::before {
  background: #0f766e;
  animation: none;
}
body[data-round587-resource-hub-page="1"] .hero-desc {
  max-width: 96ch;
  font-size: .9rem;
  line-height: 1.52;
}
body[data-round587-resource-hub-page="1"] .main {
  gap: 12px;
  padding-top: 8px;
}
body[data-round587-resource-hub-page="1"] .cur-glow {
  display: none !important;
}
body[data-round587-resource-hub-page="1"] .top-brand,
body[data-round587-resource-hub-page="1"] .user-pill,
body[data-round587-resource-hub-page="1"] .btn-back,
body[data-round587-resource-hub-page="1"] .vp-close {
  min-height: 44px !important;
}
body[data-round587-resource-hub-page="1"] .vp-close {
  min-width: 44px !important;
}
body[data-round587-resource-hub-page="1"] button.vp-close,
body[data-round587-resource-hub-page="1"] #vpClose {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  min-height: 44px !important;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command,
body[data-round587-resource-hub-page="1"] .round385-181103-main-entry,
body[data-round587-resource-hub-page="1"] .round351-mobile-shortcuts,
body[data-round587-resource-hub-page="1"] .round323-resource-finder,
body[data-round587-resource-hub-page="1"] .supplemental-return-path {
  border-color: rgba(15, 23, 42, .12) !important;
  background: rgba(255, 255, 255, .96) !important;
  box-shadow: 0 16px 42px rgba(15, 23, 42, .07) !important;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command {
  display: grid;
  grid-template-columns: minmax(0, .86fr) minmax(280px, 1.14fr);
  gap: 10px;
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, .12);
  border-radius: 8px;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__head {
  display: grid;
  align-content: start;
  gap: 6px;
  min-width: 0;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__head b,
body[data-round587-resource-hub-page="1"] .round587-resource-command__head strong {
  color: #0f172a;
  font-size: 1rem;
  font-weight: 930;
  line-height: 1.25;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__head span {
  color: #475569;
  font-size: .84rem;
  font-weight: 720;
  line-height: 1.52;
  overflow-wrap: anywhere;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__actions a {
  min-height: 56px;
  display: grid;
  align-content: center;
  gap: 2px;
  padding: 9px 10px;
  border: 1px solid rgba(15, 23, 42, .1);
  border-radius: 8px;
  background: #f8fafc;
  color: #0f172a;
  text-decoration: none;
  font-size: .8rem;
  font-weight: 880;
  line-height: 1.3;
  overflow-wrap: anywhere;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__actions a[data-round587-resource-route="html-first"] {
  border-color: rgba(15, 118, 110, .22);
  background: #ecfdf5;
  color: #0f766e;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__actions a[data-round587-resource-route="bank"] {
  border-color: rgba(37, 99, 235, .2);
  background: #eff6ff;
  color: #1d4ed8;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__actions a[data-round587-resource-route="boundary"] {
  border-color: rgba(217, 119, 6, .24);
  background: #fffbeb;
  color: #92400e;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__actions a small {
  color: #64748b;
  font-size: .7rem;
  font-weight: 760;
  line-height: 1.32;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics,
body[data-round587-resource-hub-page="1"] .round587-resource-boundary-strip {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
  margin: 0;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics {
  grid-column: 1 / -1;
  margin-top: 2px;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics div,
body[data-round587-resource-hub-page="1"] .round587-resource-boundary-strip span {
  min-width: 0;
  min-height: 50px;
  display: grid;
  align-content: center;
  gap: 2px;
  padding: 7px 8px;
  border: 1px solid rgba(15, 118, 110, .14);
  border-radius: 8px;
  background: #f0fdfa;
  color: #475569;
  font-size: .72rem;
  font-weight: 760;
  line-height: 1.32;
  overflow-wrap: anywhere;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics div:nth-child(2),
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics div:nth-child(5),
body[data-round587-resource-hub-page="1"] .round587-resource-boundary-strip span:nth-child(2) {
  border-color: rgba(37, 99, 235, .16);
  background: #eff6ff;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics div:nth-child(4),
body[data-round587-resource-hub-page="1"] .round587-resource-boundary-strip span:nth-child(3) {
  border-color: rgba(217, 119, 6, .22);
  background: #fffbeb;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics dt {
  color: #0f766e;
  font-size: 1.12rem;
  font-weight: 940;
  line-height: 1.05;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics div:nth-child(2) dt,
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics div:nth-child(5) dt {
  color: #1d4ed8;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics div:nth-child(4) dt {
  color: #92400e;
}
body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics dd {
  margin: 0;
}
body[data-round587-resource-hub-page="1"] .round587-resource-boundary-strip {
  margin-top: 9px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
body[data-round587-resource-hub-page="1"] .round587-resource-boundary-strip b {
  color: #0f172a;
  font-size: .78rem;
  font-weight: 930;
}
body[data-round587-resource-hub-page="1"] .round385-181103-main-entry {
  grid-template-columns: minmax(0, 1.2fr) minmax(250px, .8fr);
  gap: 10px;
  padding: 13px;
}
body[data-round587-resource-hub-page="1"] .round385-181103-main-entry__stats {
  gap: 6px;
  margin-top: 9px;
}
body[data-round587-resource-hub-page="1"] .round385-181103-main-entry__actions {
  gap: 7px;
}
body[data-round587-resource-hub-page="1"] .round385-181103-main-entry__actions a,
body[data-round587-resource-hub-page="1"] .round351-mobile-shortcuts a,
body[data-round587-resource-hub-page="1"] .round323-resource-finder__link {
  min-height: 50px;
  border-radius: 8px;
}
body[data-round587-resource-hub-page="1"] a:focus-visible,
body[data-round587-resource-hub-page="1"] button:focus-visible {
  outline: 3px solid rgba(37, 99, 235, .42);
  outline-offset: 3px;
}
@media (max-width: 980px) {
  body[data-round587-resource-hub-page="1"] .round587-resource-command {
    grid-template-columns: 1fr;
  }
  body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 720px) {
  body[data-round587-resource-hub-page="1"] .page-hero {
    padding: 14px 16px 4px;
  }
  body[data-round587-resource-hub-page="1"] .main {
    padding-inline: 12px;
  }
  body[data-round587-resource-hub-page="1"] .round587-resource-command__actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  body[data-round587-resource-hub-page="1"] .round587-resource-boundary-strip {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 420px) {
  body[data-round587-resource-hub-page="1"] .round587-resource-command__actions,
  body[data-round587-resource-hub-page="1"] .round587-resource-command__metrics {
    grid-template-columns: 1fr;
  }
  body[data-round587-resource-hub-page="1"] .round587-resource-command {
    padding: 10px;
  }
}
</style>`;

const indexCss = `
<style data-round587-181103-index-reader>
/* Round587 181103 HTML index reader density */
body[data-round587-181103-index-page="1"] {
  background: linear-gradient(180deg, #f8fafc 0, #ffffff 240px, #f3f6f9 100%);
}
body[data-round587-181103-index-page="1"] .wrap {
  padding-top: 18px;
}
body[data-round587-181103-index-page="1"] h1 {
  font-size: clamp(1.7rem, 3.2vw, 2.6rem);
}
body[data-round587-181103-index-page="1"] .badges {
  gap: 6px;
  margin-top: 10px;
}
body[data-round587-181103-index-page="1"] .badges span {
  border-radius: 8px;
  padding: 5px 8px;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-command,
body[data-round587-181103-index-page="1"] .round587-181103-index-boundary,
body[data-round587-181103-index-page="1"] .panel,
body[data-round587-181103-index-page="1"] .slide {
  border-color: rgba(15, 23, 42, .12);
  box-shadow: 0 14px 38px rgba(15, 23, 42, .06);
}
body[data-round587-181103-index-page="1"] .round587-181103-index-command {
  display: grid;
  gap: 10px;
  margin-top: 14px;
  padding: 13px;
  border: 1px solid rgba(15, 23, 42, .12);
  border-radius: 8px;
  background: rgba(255, 255, 255, .96);
}
body[data-round587-181103-index-page="1"] .round587-181103-index-command__top {
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(280px, 1.1fr);
  gap: 10px;
  align-items: start;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-command__top b {
  display: block;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 930;
  line-height: 1.25;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-command__top span {
  display: block;
  margin-top: 4px;
  color: #475569;
  font-size: .86rem;
  font-weight: 720;
  line-height: 1.5;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-actions a {
  min-height: 56px;
  display: grid;
  align-content: center;
  gap: 2px;
  padding: 9px 10px;
  border: 1px solid rgba(15, 23, 42, .1);
  border-radius: 8px;
  background: #f8fafc;
  color: #0f172a;
  font-size: .8rem;
  font-weight: 880;
  line-height: 1.3;
  text-decoration: none;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-actions a:first-child {
  border-color: rgba(15, 118, 110, .22);
  background: #ecfdf5;
  color: #0f766e;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-actions a:nth-child(2) {
  border-color: rgba(37, 99, 235, .2);
  background: #eff6ff;
  color: #1d4ed8;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-actions a:nth-child(4) {
  border-color: rgba(217, 119, 6, .22);
  background: #fffbeb;
  color: #92400e;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-actions small {
  color: #64748b;
  font-size: .7rem;
  font-weight: 760;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-metrics,
body[data-round587-181103-index-page="1"] .round587-181103-index-boundary__grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 6px;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-metrics div,
body[data-round587-181103-index-page="1"] .round587-181103-index-boundary__grid span {
  min-width: 0;
  min-height: 50px;
  display: grid;
  align-content: center;
  gap: 2px;
  padding: 7px 8px;
  border: 1px solid rgba(15, 118, 110, .14);
  border-radius: 8px;
  background: #f0fdfa;
  color: #475569;
  font-size: .72rem;
  font-weight: 760;
  line-height: 1.32;
  overflow-wrap: anywhere;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-metrics div:nth-child(2),
body[data-round587-181103-index-page="1"] .round587-181103-index-metrics div:nth-child(5) {
  border-color: rgba(37, 99, 235, .16);
  background: #eff6ff;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-metrics div:nth-child(4),
body[data-round587-181103-index-page="1"] .round587-181103-index-boundary__grid span:nth-child(3) {
  border-color: rgba(217, 119, 6, .22);
  background: #fffbeb;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-metrics dt {
  color: #0f766e;
  font-size: 1.1rem;
  font-weight: 940;
  line-height: 1.05;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-metrics div:nth-child(2) dt,
body[data-round587-181103-index-page="1"] .round587-181103-index-metrics div:nth-child(5) dt {
  color: #1d4ed8;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-metrics div:nth-child(4) dt {
  color: #92400e;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-metrics dd {
  margin: 0;
}
body[data-round587-181103-index-page="1"] .round587-181103-index-boundary {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, .12);
  border-radius: 8px;
  background: rgba(255, 255, 255, .96);
}
body[data-round587-181103-index-page="1"] .round587-181103-index-boundary strong {
  display: block;
  margin-bottom: 8px;
  color: #0f172a;
}
body[data-round587-181103-index-page="1"] .panel {
  margin-top: 12px;
  padding: 13px;
}
body[data-round587-181103-index-page="1"] .index-tools {
  gap: 10px;
}
body[data-round587-181103-index-page="1"] .html-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 10px;
}
body[data-round587-181103-index-page="1"] .slide {
  display: grid;
  align-content: start;
  gap: 8px;
  margin: 0;
  padding: 13px;
}
body[data-round587-181103-index-page="1"] .slide h2 {
  font-size: 1rem;
  line-height: 1.28;
}
body[data-round587-181103-index-page="1"] .slide p[style] {
  margin-top: 4px !important;
}
body[data-round587-181103-index-page="1"] .slide > p a,
body[data-round587-181103-index-page="1"] .index-tools a,
body[data-round587-181103-index-page="1"] .panel a {
  min-height: 44px;
}
body[data-round587-181103-index-page="1"] a:focus-visible,
body[data-round587-181103-index-page="1"] input:focus-visible,
body[data-round587-181103-index-page="1"] summary:focus-visible {
  outline: 3px solid rgba(37, 99, 235, .42);
  outline-offset: 3px;
}
@media (max-width: 920px) {
  body[data-round587-181103-index-page="1"] .round587-181103-index-command__top {
    grid-template-columns: 1fr;
  }
  body[data-round587-181103-index-page="1"] .round587-181103-index-metrics,
  body[data-round587-181103-index-page="1"] .round587-181103-index-boundary__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 680px) {
  body[data-round587-181103-index-page="1"] .wrap {
    padding: 14px 12px 42px;
  }
  body[data-round587-181103-index-page="1"] .round587-181103-index-actions {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  body[data-round587-181103-index-page="1"] .html-content {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 420px) {
  body[data-round587-181103-index-page="1"] .round587-181103-index-actions,
  body[data-round587-181103-index-page="1"] .round587-181103-index-metrics,
  body[data-round587-181103-index-page="1"] .round587-181103-index-boundary__grid {
    grid-template-columns: 1fr;
  }
  body[data-round587-181103-index-page="1"] .round587-181103-index-command,
  body[data-round587-181103-index-page="1"] .round587-181103-index-boundary {
    padding: 10px;
  }
}
@media(prefers-color-scheme:dark) {
  body[data-round587-181103-index-page="1"] .round587-181103-index-command,
  body[data-round587-181103-index-page="1"] .round587-181103-index-boundary {
    background: #101827;
  }
}
</style>`;

const resourceCommand = `
  <!-- Round587 resource hub reader start -->
  <section class="round587-resource-command" data-round587-resource-hub-reader="command-strip" aria-label="Round587 资源学习路线">
    <div class="round587-resource-command__head">
      <b>资料路线先排清楚</b>
      <span>先看 38 份 HTML 资料，再进 522 来源卡题库；默认练习、源文线索、proof-depth 和 strictAnswerPdfProof 分层显示，避免把来源线索或派生参考答案写成原卷逐字答案。</span>
    </div>
    <nav class="round587-resource-command__actions" aria-label="181103 资源直达">
      <a data-round587-resource-route="html-first" href="/resources/fluid-181103-html/index.html">看 HTML 总表<small>38/38 资料页</small></a>
      <a data-round587-resource-route="bank" href="/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=round587-resource-hub-reader-density-20260630#questionBanksList">进 522 题库<small>400 练习 / 122 线索</small></a>
      <a data-round587-resource-route="real-exams" href="/modules/real-exams-dynamic.html?edge_refresh=round587-resource-hub-reader-density-20260630">做历年真题<small>325 / 68 / 217</small></a>
      <a data-round587-resource-route="boundary" href="/data/fluid-round587-resource-hub-reader-ledger.json">看本轮账本<small>ui-only / strict 0</small></a>
    </nav>
    <dl class="round587-resource-command__metrics">
      <div><dt>38/38</dt><dd>181103 HTML 资料页站内阅读。</dd></div>
      <div><dt>522</dt><dd>来源 HTML 卡与网页答案块已验收。</dd></div>
      <div><dt>400</dt><dd>默认练习题，可直接显示参考答案。</dd></div>
      <div><dt>122</dt><dd>源文/答案续页线索只展示。</dd></div>
      <div><dt>422</dt><dd>proof-depth 参考答案层。</dd></div>
      <div><dt>0</dt><dd>strictAnswerPdfProof 原答案逐字证据。</dd></div>
    </dl>
  </section>
  <!-- Round587 resource hub reader end -->`;

const resourceBoundary = `
        <div class="round587-resource-boundary-strip" data-round587-resource-boundary="181103" aria-label="181103 答案来源分层边界">
          <span><b>400 默认练习</b>刷题页直接看参考答案。</span>
          <span><b>422 proof-depth</b>证明题看完整推导链。</span>
          <span><b>strictAnswerPdfProof=0</b>原答案 PDF 逐字证据仍分开。</span>
        </div>`;

const indexCommand = `
<section class="round587-181103-index-command" data-round587-181103-index="route" aria-label="181103 HTML 资料路线">
  <div class="round587-181103-index-command__top">
    <div><b>181103 HTML 资料路线</b><span>资料页、题库、证明深修和真题入口放在同一屏；所有资料仍只走站内 HTML，不提供原件下载。</span></div>
    <nav class="round587-181103-index-actions" data-round587-181103-index="reader-actions" aria-label="181103 HTML 索引直达">
      <a href="#html-material-list">看 38 份资料<small>站内 HTML</small></a>
      <a href="/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=round587-resource-hub-reader-density-20260630#questionBanksList">进 522 题库<small>400 练习 / 122 线索</small></a>
      <a href="/resources.html?edge_refresh=round587-resource-hub-reader-density-20260630#resourceMain">回资源中心<small>路线和视频状态</small></a>
      <a href="/data/fluid-round587-resource-hub-reader-ledger.json">Round587 账本<small>ui-only / strict 0</small></a>
    </nav>
  </div>
  <dl class="round587-181103-index-metrics">
    <div><dt>38/38</dt><dd>HTML 正文页。</dd></div>
    <div><dt>522/522</dt><dd>来源卡与网页答案块。</dd></div>
    <div><dt>400</dt><dd>默认练习参考答案入口。</dd></div>
    <div><dt>122</dt><dd>源文线索只展示。</dd></div>
    <div><dt>422</dt><dd>证明/推导深修层。</dd></div>
    <div><dt>0</dt><dd>strictAnswerPdfProof。</dd></div>
  </dl>
</section>
<section class="round587-181103-index-boundary" data-round587-181103-index="boundary" aria-label="181103 答案边界">
  <strong>答案来源分层</strong>
  <div class="round587-181103-index-boundary__grid">
    <span>参考答案来自站内推导与整理，继续按 proof-depth 复查。</span>
    <span>源文线索只帮助回查资料，不替代独立题答案。</span>
    <span>strictAnswerPdfProof=0，不能写成原卷答案 PDF 逐字证明。</span>
  </div>
</section>`;

function stripRound587Resources(text) {
  return text
    .replace(/\n?<style data-round587-resource-hub-reader>[\s\S]*?<\/style>\n?/g, '\n')
    .replace(/\s*<!-- Round587 resource hub reader start -->[\s\S]*?<!-- Round587 resource hub reader end -->\s*/g, '\n');
}

function stripRound587Index(text) {
  return text
    .replace(/\n*<style data-round587-181103-index-reader>[\s\S]*?<\/style>\n*/g, '\n')
    .replace(/\n*<section class="round587-181103-index-command"[\s\S]*?<section class="round587-181103-index-boundary"[\s\S]*?<\/section>\n*/g, '\n');
}

function injectStyle(text, css) {
  if (text.includes('\n</head>')) return text.replace('\n</head>', `${css}\n</head>`);
  if (text.includes('</head>')) return text.replace('</head>', `${css}</head>`);
  throw new Error('Could not find </head> marker.');
}

function updateResourcesPage(text) {
  let next = stripRound587Resources(text);
  next = replaceAll(next, round587.previousVersion, round587.version);
  next = addBodyMarker(next, 'data-round587-resource-hub-page');
  next = injectStyle(next, resourceCss);
  next = next
    .replace('资源 · 依据 · 专属课状态', '资源 · 路线 · 答案边界')
    .replace('<h1 class="hero-title">先找 <em>学习依据</em></h1>', '<h1 class="hero-title">资料路线 <em>先清楚</em></h1>')
    .replace(
      '首屏直接给 181103、历年真题、专属课状态和学习进度入口。真题保持 325 原文小题 / 68 组题；181103 为 38/38 HTML、522 来源卡和网页答案块、400 默认练习与参考答案、0 待人工源页复核、122 源文线索；公开索引固定 522 资料内题目和 68 个真题复核题，专属课仍以老师分配和资源开放为准。',
      '首屏直接给 181103 资料路线、522 来源卡题库、历年真题、专属课状态和学习进度入口。181103 仍为 38/38 HTML、522 来源卡和网页答案块、400 默认练习与参考答案、122 源文线索；真题保持 325 原文小题 / 68 组题 / 217 grouped 小题，strictAnswerPdfProof 仍为 0。'
    );
  const mainMarker = '<main class="main" id="resourceMain" tabindex="-1">\n';
  if (!next.includes(mainMarker)) throw new Error('Could not find resources main marker.');
  next = next.replace(mainMarker, `${mainMarker}${resourceCommand}\n`);
  if (!next.includes('data-round587-resource-boundary="181103"')) {
    const statsCloseMarker = '        </div>\n      </div>\n    </div>\n    <div class="round385-181103-main-entry__actions"';
    if (!next.includes(statsCloseMarker)) throw new Error('Could not find resources 181103 stats insertion marker.');
    next = next.replace(statsCloseMarker, `${resourceBoundary}\n      </div>\n    </div>\n    <div class="round385-181103-main-entry__actions"`);
  }
  return next;
}

function update181103IndexPage(text) {
  let next = stripRound587Index(text);
  next = replaceAll(next, round587.previousVersion, round587.version);
  next = addBodyMarker(next, 'data-round587-181103-index-page');
  next = injectStyle(next, indexCss);
  const badges = next.match(/<div class="badges">[\s\S]*?<\/div>\n/);
  if (!badges) throw new Error('Could not find 181103 index badges marker.');
  next = next.replace(badges[0], `${badges[0]}${indexCommand}\n`);
  return next;
}

function updateCurrentText(text) {
  let next = replaceAll(text, round587.previousVersion, round587.version);
  next = replaceAll(next, 'Round586 · round587-resource-hub-reader-density-20260630', 'Round587 · round587-resource-hub-reader-density-20260630');
  next = replaceAll(next, '当前版本：Round586 · round587-resource-hub-reader-density-20260630', '当前版本：Round587 · round587-resource-hub-reader-density-20260630');
  next = replaceAll(next, '当前发布：Round586 · round587-resource-hub-reader-density-20260630', '当前发布：Round587 · round587-resource-hub-reader-density-20260630');
  next = replaceAll(next, 'Round586：刷题页答案显示与证明边界升级', 'Round587：资源中心与 181103 HTML 资料路线升级');
  next = replaceAll(
    next,
    'Round586 polishes the live practice answer panels, separates reference answers from proof-depth and strict original PDF proof, and preserves all content counts.',
    'Round587 polishes the resource hub and 181103 HTML index, keeps all answer/proof counts unchanged, and makes source/reference/strict PDF layers visible before entering the bank.'
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
    let next;
    if (rel === 'resources.html') {
      next = updateResourcesPage(before);
    } else if (rel === 'resources/fluid-181103-html/index.html') {
      next = update181103IndexPage(before);
    } else {
      next = updateCurrentText(before);
    }
    if (next.includes(round587.version)) synced.push(rel);
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
  text = text.replace(/const EDGE_HOME_VERSION = '[^']+';/, `const EDGE_HOME_VERSION = '${round587.version}';`);
  text = text.replace(/const EDGE_RUNTIME_JS_VERSION = '[^']+';/, `const EDGE_RUNTIME_JS_VERSION = '${round587.version}';`);
  text = text.replace(/Round58[0-9][^.\n]*\./, 'Round587: polished the resource hub and 181103 HTML reader path while preserving all answer/proof/source counts.');
  writeText(rel, text);
}

function writeLedger(syncResult) {
  writeJson('data/fluid-round587-resource-hub-reader-ledger.json', {
    ok: true,
    version: round587.version,
    previousVersion: round587.previousVersion,
    round: round587.round,
    generatedAt: now,
    scope: round587.scope,
    nonDeletingUpgrade: true,
    uiOnlyUpgrade: true,
    resourceHubReaderUpgrade: true,
    indexReaderDensityUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    changedQuestionBankContent: false,
    changedRealExamContent: false,
    noRouteRemoved: true,
    noCountReduced: true,
    materialSubpagesSynced: syncResult.materialPages.length,
    changedFiles: syncResult.synced,
    idempotentChangedFiles: syncResult.changed,
    metrics: {
      materialHtmlPages181103: round587.materialHtmlPages181103,
      sourceHtmlCards181103: round587.sourceHtmlCards181103,
      referencePracticeRows181103: round587.referencePracticeRows181103,
      sourceClueOnlyRows181103: round587.sourceClueOnlyRows181103,
      trustReferenceReadyRows181103: round587.trustReferenceReadyRows181103,
      trustSourceClueOnlyRows181103: round587.trustSourceClueOnlyRows181103,
      proofDepthRows181103: round587.proofDepthRows181103,
      proofDepthSecondPassRows181103: round587.proofDepthSecondPassRows181103,
      realExamAnswerDepthRows: round587.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round587.realExamOriginalAtomicRows,
      realExamSourceSections: round587.realExamSourceSections,
      realExamGroupedSubquestions: round587.realExamGroupedSubquestions,
      realExamDirectoryQuestionCount: round587.realExamDirectoryQuestionCount,
      strictAnswerPdfProofRows: round587.strictAnswerPdfProofRows
    },
    upgradedSurfaces: {
      resourcesHtml: true,
      htmlIndex181103: true,
      materialPagesVersionSynced: syncResult.materialPages.length
    },
    boundary: {
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      visualFrontier: round587.version,
      strictAnswerPdfProof: 'separate',
      visibleRealExamAnswerCoverage: '353/353',
      answer181103: {
        entranceReferenceAnswerReady: round587.referencePracticeRows181103,
        entranceSourceClueOnly: round587.sourceClueOnlyRows181103,
        trustReferenceAnswerReady: round587.trustReferenceReadyRows181103,
        trustSourceClueOnly: round587.trustSourceClueOnlyRows181103
      },
      derivedReferenceAnswers: true,
      publicShellOnlyUntilAuthGateRuns: true
    },
    verificationPlan: [
      'node tools/apply-round587-resource-hub-reader.mjs',
      'node tools/check-round587-resource-hub-reader.mjs',
      'node tools/check-round587-resource-hub-reader-visual.mjs',
      'node tools/check-round586-practice-answer-workbench-visual.mjs'
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
    version: 'round433-real-exam-answer-coverage-20260630-round587-refresh',
    refreshedBy: round587.version,
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
    version: 'round462-ten-round-continuation-ledger-20260630-round587-refresh',
    refreshedBy: round587.version,
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
          'reference-answer-ready': round587.referencePracticeRows181103,
          'needs-manual-source-review': 0,
          'source-clue-not-reference-answer': round587.sourceClueOnlyRows181103
        }
      }
    },
    boundary: 'Round462 support ledger is refreshed for Round587 rendering only. It preserves the visible-answer / derived-reference / strict original answer-PDF split and does not promote strictAnswerPdfProof.',
    artifacts: {
      coverageJson: 'data/fluid-round433-real-exam-answer-coverage.json',
      round587Ledger: 'data/fluid-round587-resource-hub-reader-ledger.json'
    }
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round587.version,
    previousVersion: round587.previousVersion,
    date: round587.date,
    title: 'Round587：资源中心与 181103 HTML 资料路线升级',
    summary: '本轮继续不减少任何题量、答案、证明记录、来源链接或真题边界；专门升级资源中心和 181103 HTML 总表，把 38 份 HTML、522 来源卡、400 默认练习、122 源文线索、422 proof-depth 和 strictAnswerPdfProof=0 放到进题库前就能看懂的位置。',
    links: [
      { label: 'Round587 资源路线账本', href: '/data/fluid-round587-resource-hub-reader-ledger.json' },
      { label: '资源中心', href: `/resources.html?edge_refresh=${round587.version}#resourceMain` },
      { label: '181103 HTML 总表', href: `/resources/fluid-181103-html/index.html?edge_refresh=${round587.version}` },
      { label: '181103 522 题库', href: `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${round587.version}#questionBanksList` }
    ],
    metrics: {
      realExamAnswerDepthRows: round587.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round587.realExamOriginalAtomicRows,
      realExamSourceSections: round587.realExamSourceSections,
      realExamGroupedSubquestions: round587.realExamGroupedSubquestions,
      realExamDirectoryQuestionCount: round587.realExamDirectoryQuestionCount,
      proofDepthRows: round587.proofDepthRows181103,
      proofDepthSecondPassRows: round587.proofDepthSecondPassRows181103,
      referencePracticeRows: round587.referencePracticeRows181103,
      sourceClueOnlyRows: round587.sourceClueOnlyRows181103,
      trustReferenceReadyRows181103: round587.trustReferenceReadyRows181103,
      trustSourceClueOnlyRows181103: round587.trustSourceClueOnlyRows181103,
      strictAnswerPdfProof: round587.strictAnswerPdfProofRows
    },
    boundary: {
      resourceHubReaderOnly: true,
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      visibleAnswerCoverage: '353/353',
      derivedReferenceAnswers: true,
      contentFrontier: 'round579-real-exam-answer-depth-twelfth-pass-20260629',
      visualFrontier: round587.version
    }
  };
  writeJson('site-updates.json', [top, ...updates.filter((item) => item?.version !== round587.version)]);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  Object.assign(roadmap, {
    version: round587.version,
    currentVersion: round587.version,
    currentReleaseVersion: round587.version,
    previousVersion: round587.previousVersion,
    currentRound: round587.round,
    lastIntegratedRound: round587.round,
    lastUpdatedAt: now,
    lastUpdated: now,
    updatedAt: now,
    realExamAnswerDepthRows: round587.realExamAnswerDepthRows,
    realExamOriginalAtomicRows: round587.realExamOriginalAtomicRows,
    realExamSourceSections: round587.realExamSourceSections,
    realExamGroupedSubquestions: round587.realExamGroupedSubquestions,
    proofDepthRows: round587.proofDepthRows181103,
    referencePracticeRows181103: round587.referencePracticeRows181103,
    sourceClueOnlyRows181103: round587.sourceClueOnlyRows181103,
    trustReferenceReadyRows181103: round587.trustReferenceReadyRows181103,
    trustSourceClueOnlyRows181103: round587.trustSourceClueOnlyRows181103,
    strictAnswerPdfProof: round587.strictAnswerPdfProofRows,
    round587ResourceHubReader: true
  });
  roadmap.latestRelease = {
    version: round587.version,
    round: round587.round,
    previousVersion: round587.previousVersion,
    summary: 'Round587 polishes the resource hub and 181103 HTML index, keeps all answer/proof counts unchanged, and makes source/reference/strict PDF layers visible before entering the bank.'
  };
  roadmap.releaseGate ||= {};
  Object.assign(roadmap.releaseGate, {
    currentVersion: round587.version,
    expectedVersion: round587.version,
    previousVersion: round587.previousVersion,
    currentRound: round587.round,
    lastIntegratedRound: round587.round,
    commands: [
      'node tools/apply-round587-resource-hub-reader.mjs',
      'node tools/check-round587-resource-hub-reader.mjs',
      'node tools/check-round587-resource-hub-reader-visual.mjs',
      'node tools/check-round586-practice-answer-workbench-visual.mjs'
    ]
  });
  roadmap.release ||= {};
  Object.assign(roadmap.release, {
    currentVersion: round587.version,
    currentRound: round587.round,
    expectedVersion: round587.version,
    previousVersion: round587.previousVersion,
    lastIntegratedRound: round587.round,
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
    version: round587.version,
    changedVersionFiles: syncResult.changed.length,
    changedFiles: syncResult.changed,
    syncedVersionFiles: syncResult.synced.length,
    materialSubpagesSynced: syncResult.materialPages.length
  }, null, 2));
}

main();
