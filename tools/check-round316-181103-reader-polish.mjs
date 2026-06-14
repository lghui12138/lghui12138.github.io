#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const args = new Set(process.argv.slice(2));
const version = 'round316-181103-reader-polish-20260614';
const previousVersion = 'round315-181103-all-html-direct-pages-20260614';
const ledgerRel = 'data/fluid-round316-181103-reader-polish.json';
const docRel = 'docs/round316/181103-reader-polish.md';
const materialsRootRel = 'resources/fluid-181103-html/materials';

function fromRoot(relPath) {
  return path.join(repoRoot, relPath);
}

function readText(relPath) {
  return fs.readFileSync(fromRoot(relPath), 'utf8');
}

function writeText(relPath, text) {
  fs.mkdirSync(path.dirname(fromRoot(relPath)), { recursive: true });
  fs.writeFileSync(fromRoot(relPath), text);
}

function hrefs(html) {
  return [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);
}

function stripVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function officialMaterialPages() {
  return fs.readdirSync(fromRoot(materialsRootRel), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${materialsRootRel}/${entry.name}/index.html`)
    .filter((relPath) => fs.existsSync(fromRoot(relPath)))
    .sort();
}

function pageNumberFromFigure(figureHtml, fallback) {
  const caption = /<figcaption>\s*第\s*(\d+)\s*页\s*<\/figcaption>/i.exec(figureHtml)?.[1];
  return Number(caption || fallback);
}

function pageId(number) {
  return `page-${String(number).padStart(3, '0')}`;
}

function jumpTargets(pageCount) {
  if (pageCount <= 0) return [];
  const targets = new Set([1, pageCount]);
  for (let page = 25; page < pageCount; page += 25) targets.add(page);
  if (pageCount > 12) targets.add(Math.ceil(pageCount / 2));
  return [...targets].sort((left, right) => left - right);
}

function renderJumpNav(pageCount) {
  if (pageCount <= 0) return '';
  const links = jumpTargets(pageCount)
    .map((page) => `<a href="#${pageId(page)}">第 ${page} 页</a>`)
    .join('');
  return `<nav class="panel reader-tools" data-round316-page-jump aria-label="页图资料快速跳页"><strong>页图跳转</strong><span>${pageCount} 页</span><div>${links}</div><a href="#top">回到页首</a></nav>`;
}

function ensureReaderToolsCss(html) {
  if (/\.reader-tools\{/.test(html)) return html;
  const css = '.reader-tools{display:grid;gap:10px}.reader-tools div{display:flex;flex-wrap:wrap;gap:8px}.reader-tools a,.reader-tools span{min-height:44px;display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:8px;background:var(--card);padding:9px 11px;color:var(--accent);font-weight:820;text-decoration:none}.reader-tools span{color:var(--muted)}';
  return html.replace(/\.no-download\{[^}]+\}/, (match) => `${match}${css}`);
}

function fixIntroMarkup(html) {
  return html.replace(/<本资料已整理为站内 HTML 正文页；本站只展示 HTML、图片和样式，不提供原件。<\/p>/g, '<p class="sub">本资料已整理为站内 HTML 正文页；本站只展示 HTML、图片和样式，不提供原件。</p>');
}

function polishPdfFigures(html) {
  let index = 0;
  return html.replace(/<figure class="pdf-page">([\s\S]*?)<\/figure>/g, (figure, inner) => {
    index += 1;
    const number = pageNumberFromFigure(figure, index);
    let next = `<figure id="${pageId(number)}" class="pdf-page" data-round316-page="${number}">${inner}</figure>`;
    next = next.replace(/<img\b(?![^>]*\bloading=)([^>]*)>/i, '<img loading="lazy"$1>');
    next = next.replace(/<img\b(?![^>]*\bdecoding=)([^>]*)>/i, '<img decoding="async"$1>');
    return next;
  });
}

function ensureJumpNav(html, pageCount) {
  if (pageCount <= 0 || /data-round316-page-jump/.test(html)) return html;
  return html.replace(/<section class="html-content"/, `${renderJumpNav(pageCount)}<section class="html-content"`);
}

function ensureTopId(html) {
  return html.replace(/<body>/, '<body id="top">');
}

function writePolishedPage(relPath) {
  const original = readText(relPath);
  const pageCount = (original.match(/class="pdf-page"/g) || []).length;
  let html = original;
  html = ensureTopId(html);
  html = fixIntroMarkup(html);
  html = ensureReaderToolsCss(html);
  html = polishPdfFigures(html);
  html = ensureJumpNav(html, pageCount);
  if (html !== original) writeText(relPath, html);
}

function scanPage(relPath) {
  const html = readText(relPath);
  const links = hrefs(html);
  const pageCount = (html.match(/class="pdf-page"/g) || []).length;
  const anchoredPageCount = (html.match(/data-round316-page="/g) || []).length;
  const lazyImageCount = (html.match(/<img\b(?=[^>]*\bloading="lazy")(?=[^>]*\bdecoding="async")/g) || []).length;
  const row = {
    relPath,
    visibleTextChars: stripVisibleText(html).length,
    malformedIntroCount: (html.match(/<本资料已整理为站内 HTML 正文页/g) || []).length,
    pageCount,
    hasPageJump: pageCount > 0 ? /data-round316-page-jump/.test(html) : true,
    anchoredPageCount,
    lazyImageCount,
    binaryHrefCount: links.filter((href) => /\.(?:pdf|pptx?|docx?|doc|zip|rar|7z|mp4)(?:$|[?#])/i.test(href)).length,
    localPathLeakCount: (html.match(/\/Users\/|\/Volumes\/|file:\/\//gi) || []).length,
    iframeEmbedObjectCount: (html.match(/<iframe\b|<embed\b|<object\b/gi) || []).length,
    viewerTokenCount: (html.match(/\bviewer\b|htmlViewer|viewerUrl|viewerPath|viewerMode|converted-frame/gi) || []).length,
    hasRound315Continuity: html.includes(previousVersion) || html.includes('Round315')
  };
  row.pass = row.visibleTextChars >= 300
    && row.malformedIntroCount === 0
    && row.binaryHrefCount === 0
    && row.localPathLeakCount === 0
    && row.iframeEmbedObjectCount === 0
    && row.viewerTokenCount === 0
    && row.hasRound315Continuity
    && (row.pageCount === 0 || (row.hasPageJump && row.anchoredPageCount === row.pageCount && row.lazyImageCount === row.pageCount));
  return row;
}

if (args.has('--write')) {
  for (const relPath of officialMaterialPages()) writePolishedPage(relPath);
}

const rows = officialMaterialPages().map(scanPage);
const summary = {
  officialMaterialPageCount: rows.length,
  passCount: rows.filter((row) => row.pass).length,
  pdfPageMaterialCount: rows.filter((row) => row.pageCount > 0).length,
  totalPdfPages: rows.reduce((sum, row) => sum + row.pageCount, 0),
  pageJumpMaterialCount: rows.filter((row) => row.pageCount > 0 && row.hasPageJump).length,
  anchoredPdfPageCount: rows.reduce((sum, row) => sum + row.anchoredPageCount, 0),
  lazyPdfImageCount: rows.reduce((sum, row) => sum + row.lazyImageCount, 0),
  malformedIntroCount: rows.reduce((sum, row) => sum + row.malformedIntroCount, 0),
  binaryHrefCount: rows.reduce((sum, row) => sum + row.binaryHrefCount, 0),
  localPathLeakCount: rows.reduce((sum, row) => sum + row.localPathLeakCount, 0),
  iframeEmbedObjectCount: rows.reduce((sum, row) => sum + row.iframeEmbedObjectCount, 0),
  viewerTokenCount: rows.reduce((sum, row) => sum + row.viewerTokenCount, 0)
};

const checks = [
  { id: 'official-38-materials', pass: summary.officialMaterialPageCount === 38, detail: summary.officialMaterialPageCount },
  { id: 'all-pages-pass-reader-polish', pass: summary.passCount === 38, detail: rows.filter((row) => !row.pass).slice(0, 12) },
  { id: 'all-pdf-pages-anchored-and-lazy', pass: summary.totalPdfPages > 0 && summary.anchoredPdfPageCount === summary.totalPdfPages && summary.lazyPdfImageCount === summary.totalPdfPages, detail: { totalPdfPages: summary.totalPdfPages, anchoredPdfPageCount: summary.anchoredPdfPageCount, lazyPdfImageCount: summary.lazyPdfImageCount } },
  { id: 'all-pdf-materials-have-page-jump', pass: summary.pdfPageMaterialCount === 27 && summary.pageJumpMaterialCount === 27, detail: { pdfPageMaterialCount: summary.pdfPageMaterialCount, pageJumpMaterialCount: summary.pageJumpMaterialCount } },
  { id: 'no-malformed-intro-or-wrapper-downloads', pass: summary.malformedIntroCount === 0 && summary.binaryHrefCount === 0 && summary.localPathLeakCount === 0 && summary.iframeEmbedObjectCount === 0 && summary.viewerTokenCount === 0, detail: summary }
];

const failed = checks.filter((check) => !check.pass);
const payload = {
  version,
  generatedAt: new Date().toISOString(),
  source: {
    materialsRoot: materialsRootRel,
    previousContract: 'data/fluid-round315-181103-all-html-direct-pages.json'
  },
  summary,
  rows,
  checks,
  acceptance: {
    pass: failed.length === 0,
    failedCheckIds: failed.map((check) => check.id),
    meaning: 'Round316 keeps the 181103 materials as in-site HTML body pages and adds reader polish: valid intro markup, quick page jumps, per-page anchors, lazy/async page images, and no viewer/download/embed/local-path regression.'
  }
};

if (args.has('--write')) {
  const json = `${JSON.stringify(payload, null, 2)}\n`;
  writeText(ledgerRel, json);
  fs.writeFileSync(fromRoot(`${ledgerRel}.gz`), zlib.gzipSync(json));
  writeText(docRel, renderMarkdown(payload));
}

if (args.has('--json')) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
else {
  console.log(`${payload.acceptance.pass ? 'PASS' : 'FAIL'} ${version}: ${summary.passCount}/38 pages, ${summary.pageJumpMaterialCount}/27 pdf readers, malformed intro ${summary.malformedIntroCount}`);
  failed.forEach((check) => console.log(`- ${check.id}`));
}

process.exitCode = payload.acceptance.pass ? 0 : 1;

function renderMarkdown(data) {
  const checkRows = data.checks.map((check) => `| ${check.id} | ${check.pass ? 'PASS' : 'FAIL'} |`).join('\n');
  return `# Round316 181103 Reader Polish

- version: ${data.version}
- official material pages: ${data.summary.passCount}/38
- PDF/page-image materials with jump tools: ${data.summary.pageJumpMaterialCount}/27
- anchored PDF pages: ${data.summary.anchoredPdfPageCount}/${data.summary.totalPdfPages}
- lazy/async page images: ${data.summary.lazyPdfImageCount}/${data.summary.totalPdfPages}
- malformed intro tags: ${data.summary.malformedIntroCount}
- raw binary hrefs: ${data.summary.binaryHrefCount}
- iframe/embed/object tags: ${data.summary.iframeEmbedObjectCount}
- preview-wrapper tokens: ${data.summary.viewerTokenCount}

## Contract

Round316 does not loosen the Round315 all-HTML rule. It improves the same 38 in-site HTML body pages so long page-image documents have page anchors, quick jump controls, lazy loading, and valid intro markup.

## Checks

| check | status |
| --- | --- |
${checkRows}

## Gate

\`\`\`bash
node tools/check-round316-181103-reader-polish.mjs --write --json
\`\`\`
`;
}
