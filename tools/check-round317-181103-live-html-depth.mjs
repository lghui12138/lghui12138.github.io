#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const args = new Set(process.argv.slice(2));
const version = 'round317-181103-live-html-depth-20260614';
const previousVersion = 'round316-181103-reader-polish-20260614';
const materialsRootRel = 'resources/fluid-181103-html/materials';
const sourceRoot = '/Users/kili/Downloads/181103流体力学';
const ledgerRel = 'data/fluid-round317-181103-live-html-depth.json';
const docRel = 'docs/round317/181103-html-depth.md';

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

function readExistingGeneratedAt(relPath) {
  try {
    return JSON.parse(fs.readFileSync(fromRoot(relPath), 'utf8')).generatedAt || null;
  } catch {
    return null;
  }
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
    .replace(/&#10;|&#x0a;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function officialMaterialPages() {
  return fs.readdirSync(fromRoot(materialsRootRel), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${materialsRootRel}/${entry.name}/index.html`)
    .filter((relPath) => fs.existsSync(fromRoot(relPath)))
    .sort();
}

function htmlContent(html) {
  const start = html.search(/<section\b[^>]*class=["'][^"']*html-content[^"']*["'][^>]*>/i);
  if (start < 0) return '';
  const end = html.search(/<\/main>/i);
  return html.slice(start, end > start ? end : html.length);
}

function pageNumber(id) {
  return String(id).padStart(3, '0');
}

function anchorsFor(row) {
  const anchors = [{ href: '#round317-html-content-start', label: '进入正文' }];
  if (row.pdfPageCount > 0) {
    const picks = new Set([1, Math.ceil(row.pdfPageCount / 2), row.pdfPageCount]);
    return [...picks]
      .sort((left, right) => left - right)
      .map((page) => ({ href: `#page-${pageNumber(page)}`, label: `第 ${page} 页` }));
  }
  if (row.htmlSlidePageCount > 0) {
    const picks = new Set([1, Math.ceil(row.htmlSlidePageCount / 2), row.htmlSlidePageCount]);
    return [...picks]
      .sort((left, right) => left - right)
      .map((page) => ({ href: `#page${page}`, label: `第 ${page} 屏` }));
  }
  return anchors;
}

function formLabel(row) {
  if (row.pdfPageCount > 0) return 'PDF 页图 HTML';
  if (row.htmlSlidePageCount > 0) return 'PPT 转写 HTML';
  if (/DOCX HTML/.test(row.contentAria)) return 'DOCX 文本 HTML';
  if (/DOC HTML/.test(row.contentAria)) return 'DOC 文本 HTML';
  if (row.visibleTextChars > 0) return '文本 HTML';
  return '待复核 HTML';
}

function sizeLabel(row) {
  const parts = [];
  if (row.pdfPageCount > 0) parts.push(`${row.pdfPageCount} 页图`);
  if (row.htmlSlidePageCount > 0) parts.push(`${row.htmlSlidePageCount} 屏`);
  if (row.imageCount > 0 && row.pdfPageCount === 0) parts.push(`${row.imageCount} 图`);
  if (row.visibleTextChars > 0) parts.push(`${row.visibleTextChars} 字符`);
  if (parts.length === 0) parts.push('无可见正文');
  return parts.join(' / ');
}

function topicSnippet(row) {
  const text = row.contentText
    .replace(/\b(?:EMBED Equation|Object_\d+|high-resolution|Times New Roman|MathType|System)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const candidates = [
    ...text.matchAll(/(?:习题[一二三四五六七八九十]+|第\s*\d+\s*章|§\s*[\d.-]+[^。；，,]{0,20}|湍流[^。；，,]{0,20}|雷诺[^。；，,]{0,20}|流体[^。；，,]{0,20})/g)
  ].map((match) => match[0].replace(/\s+/g, ' ').trim());
  const unique = [...new Set(candidates.filter((item) => item.length >= 2))].slice(0, 4);
  if (unique.length) return unique.join('、');
  if (row.title) return row.title;
  return '站内页图与正文';
}

function renderContentMap(row) {
  const links = anchorsFor(row)
    .map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`)
    .join('');
  return `<section class="panel round317-content-map" data-round317-content-map aria-label="181103 HTML 正文结构导航">
<strong>站内正文结构</strong>
<div class="bridge-grid">
<div><b>正文形式</b><span>${escapeHtml(formLabel(row))}</span></div>
<div><b>站内内容量</b><span>${escapeHtml(sizeLabel(row))}</span></div>
<div><b>内容线索</b><span>${escapeHtml(topicSnippet(row))}</span></div>
<div><b>抽查判定</b><span>无预览壳、无原件下载链接、无本地路径 href</span></div>
</div>
<nav class="reader-tools" data-round317-depth-nav aria-label="本页正文快捷入口"><div>${links}</div></nav>
<p class="source-note">Round317 深度抽查补充：本页必须直接呈现站内 HTML 正文、页图或转写文本；导航只指向本页锚点和站内入口，不指向 PDF、PPT、DOC、ZIP 原件。</p>
</section>`;
}

function ensureContentStartId(html) {
  if (/id=["']round317-html-content-start["']/i.test(html)) return html;
  return html.replace(
    /<section\b([^>]*class=["'][^"']*html-content[^"']*["'][^>]*)>/i,
    '<section id="round317-html-content-start"$1>'
  );
}

function removeExistingContentMap(html) {
  return html.replace(
    /<section class="panel round317-content-map" data-round317-content-map[\s\S]*?<\/section>\s*/g,
    ''
  );
}

function insertContentMap(html, row) {
  const map = renderContentMap(row);
  return html.replace(
    /<section\b[^>]*class=["'][^"']*html-content[^"']*["'][^>]*>/i,
    `${map}$&`
  );
}

function readSourceInventory() {
  if (!fs.existsSync(sourceRoot)) {
    return { exists: false, fileCount: 0, sampleBasenames: [] };
  }
  const stack = [sourceRoot];
  const files = [];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(abs);
      else if (entry.isFile()) files.push(abs);
    }
  }
  return {
    exists: true,
    fileCount: files.length,
    sampleBasenames: files.sort().slice(0, 12).map((file) => path.basename(file))
  };
}

function scanPage(relPath) {
  const html = readText(relPath);
  const content = htmlContent(html);
  const links = hrefs(html);
  const contentText = stripVisibleText(content);
  const contentAria = /<section\b[^>]*class=["'][^"']*html-content[^"']*["'][^>]*aria-label=["']([^"']+)["']/i.exec(html)?.[1] || '';
  const row = {
    relPath,
    title: stripVisibleText(/<h1[\s\S]*?<\/h1>/i.exec(html)?.[0] || ''),
    visibleTextChars: contentText.length,
    imageCount: (content.match(/<img\b/gi) || []).length,
    pdfPageCount: (content.match(/class=["'][^"']*pdf-page[^"']*["']/gi) || []).length,
    htmlSlidePageCount: (content.match(/class=["'][^"']*page-dp3[^"']*["']/gi) || []).length,
    headingCount: (content.match(/<h[2-4]\b/gi) || []).length,
    hasRound317ContentMap: /data-round317-content-map/.test(html),
    hasRound317ContentStart: /id=["']round317-html-content-start["']/i.test(html),
    hasRound316Continuity: html.includes(previousVersion) || html.includes('Round316') || html.includes('data-round316-page-jump'),
    binaryHrefCount: links.filter((href) => /\.(?:pdf|pptx?|docx?|doc|zip|rar|7z|mp4)(?:$|[?#])/i.test(href)).length,
    localPathLeakCount: (html.match(/\/Users\/|\/Volumes\/|file:\/\//gi) || []).length,
    viewerDownloadHrefCount: links.filter((href) => /(?:viewer|download|\/viewers\/)/i.test(href)).length,
    iframeEmbedObjectCount: (html.match(/<iframe\b|<embed\b|<object\b/gi) || []).length,
    emptyContentRisk: contentText.length < 50 && (content.match(/<img\b|class=["'][^"']*page-dp3/i) || []).length === 0,
    imageOnlyNoStructureRisk: (content.match(/<img\b/gi) || []).length > 0
      && (content.match(/<h[2-4]\b/gi) || []).length === 0
      && !/data-round317-content-map/.test(html),
    contentAria,
    contentText
  };
  row.pass = row.hasRound317ContentMap
    && row.hasRound317ContentStart
    && !row.emptyContentRisk
    && row.binaryHrefCount === 0
    && row.localPathLeakCount === 0
    && row.viewerDownloadHrefCount === 0
    && row.iframeEmbedObjectCount === 0;
  return row;
}

function writePage(relPath) {
  const original = readText(relPath);
  const preRow = scanPage(relPath);
  let next = removeExistingContentMap(original);
  next = ensureContentStartId(next);
  const rowForMap = { ...preRow, hasRound317ContentMap: false };
  next = insertContentMap(next, rowForMap);
  if (next !== original) writeText(relPath, next);
}

if (args.has('--write')) {
  for (const relPath of officialMaterialPages()) writePage(relPath);
}

const rowsFull = officialMaterialPages().map(scanPage);
const rows = rowsFull.map(({ contentText, ...row }) => ({
  ...row,
  contentSample: contentText.slice(0, 180)
}));
const sourceInventory = readSourceInventory();
const summary = {
  officialMaterialPageCount: rows.length,
  passCount: rows.filter((row) => row.pass).length,
  contentMapCount: rows.filter((row) => row.hasRound317ContentMap).length,
  contentStartIdCount: rows.filter((row) => row.hasRound317ContentStart).length,
  emptyContentRiskCount: rows.filter((row) => row.emptyContentRisk).length,
  imageOnlyNoStructureRiskCount: rows.filter((row) => row.imageOnlyNoStructureRisk).length,
  binaryHrefCount: rows.reduce((sum, row) => sum + row.binaryHrefCount, 0),
  localPathLeakCount: rows.reduce((sum, row) => sum + row.localPathLeakCount, 0),
  viewerDownloadHrefCount: rows.reduce((sum, row) => sum + row.viewerDownloadHrefCount, 0),
  iframeEmbedObjectCount: rows.reduce((sum, row) => sum + row.iframeEmbedObjectCount, 0),
  pdfPageMaterialCount: rows.filter((row) => row.pdfPageCount > 0).length,
  totalPdfPages: rows.reduce((sum, row) => sum + row.pdfPageCount, 0),
  htmlSlideMaterialCount: rows.filter((row) => row.htmlSlidePageCount > 0).length,
  totalHtmlSlidePages: rows.reduce((sum, row) => sum + row.htmlSlidePageCount, 0),
  docTextMaterialCount: rows.filter((row) => row.pdfPageCount === 0 && row.htmlSlidePageCount === 0 && row.visibleTextChars >= 300).length,
  sourceInventoryFileCount: sourceInventory.fileCount
};

const checks = [
  { id: 'official-38-materials', pass: summary.officialMaterialPageCount === 38, detail: summary.officialMaterialPageCount },
  { id: 'all-pages-have-round317-structure-map', pass: summary.contentMapCount === 38 && summary.contentStartIdCount === 38, detail: { contentMapCount: summary.contentMapCount, contentStartIdCount: summary.contentStartIdCount } },
  { id: 'no-empty-content-pages', pass: summary.emptyContentRiskCount === 0, detail: rows.filter((row) => row.emptyContentRisk).map((row) => row.relPath) },
  { id: 'no-image-only-pages-without-structure', pass: summary.imageOnlyNoStructureRiskCount === 0, detail: rows.filter((row) => row.imageOnlyNoStructureRisk).map((row) => row.relPath) },
  { id: 'no-viewer-download-binary-local-path-hrefs', pass: summary.binaryHrefCount === 0 && summary.localPathLeakCount === 0 && summary.viewerDownloadHrefCount === 0 && summary.iframeEmbedObjectCount === 0, detail: {
    binaryHrefCount: summary.binaryHrefCount,
    localPathLeakCount: summary.localPathLeakCount,
    viewerDownloadHrefCount: summary.viewerDownloadHrefCount,
    iframeEmbedObjectCount: summary.iframeEmbedObjectCount
  } },
  { id: 'source-directory-readonly-inventory-seen', pass: sourceInventory.exists && sourceInventory.fileCount >= 30, detail: sourceInventory }
];

const failed = checks.filter((check) => !check.pass);
const payload = {
  version,
  generatedAt: process.env.FLUID_ROUND317_181103_HTML_DEPTH_GENERATED_AT || readExistingGeneratedAt(ledgerRel) || new Date().toISOString(),
  scope: {
    materialsRoot: materialsRootRel,
    sourceRoot,
    previousContract: 'data/fluid-round316-181103-reader-polish.json',
    restrictedSurfaces: ['site-updates.json', 'data/fluid-upgrade-roadmap-100.json', 'tools/verify-fluid-release-gate.mjs']
  },
  summary,
  sourceInventory,
  rows,
  checks,
  acceptance: {
    pass: failed.length === 0,
    failedCheckIds: failed.map((check) => check.id),
    meaning: 'Round317 keeps every 181103 material as an in-site readable HTML page, adds per-page structure navigation/depth cues, and confirms no empty page, preview-shell/download route, raw binary href, iframe/embed/object, or local path leak on the 38 official material pages.'
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
  console.log(`${payload.acceptance.pass ? 'PASS' : 'FAIL'} ${version}: ${summary.passCount}/38 pages, maps ${summary.contentMapCount}/38, empty ${summary.emptyContentRiskCount}, image-no-structure ${summary.imageOnlyNoStructureRiskCount}, risky hrefs ${summary.binaryHrefCount + summary.localPathLeakCount + summary.viewerDownloadHrefCount}`);
  failed.forEach((check) => console.log(`- ${check.id}`));
}

process.exitCode = payload.acceptance.pass ? 0 : 1;

function renderMarkdown(data) {
  const checkRows = data.checks.map((check) => `| ${check.id} | ${check.pass ? 'PASS' : 'FAIL'} |`).join('\n');
  const thinRows = data.rows
    .filter((row) => row.pdfPageCount > 0 && row.headingCount === 0)
    .slice(0, 12)
    .map((row) => `| ${row.relPath} | ${row.pdfPageCount} | ${row.visibleTextChars} | ${row.hasRound317ContentMap ? 'added' : 'missing'} |`)
    .join('\n');
  return `# Round317 181103 HTML Depth Check

- version: ${data.version}
- official material pages: ${data.summary.passCount}/38
- Round317 structure maps: ${data.summary.contentMapCount}/38
- empty content risks: ${data.summary.emptyContentRiskCount}
- image-only pages without structure: ${data.summary.imageOnlyNoStructureRiskCount}
- binary/viewer/download/local-path/embed risks: ${data.summary.binaryHrefCount + data.summary.viewerDownloadHrefCount + data.summary.localPathLeakCount + data.summary.iframeEmbedObjectCount}
- source inventory checked read-only: ${data.sourceInventory.exists ? 'yes' : 'no'} (${data.sourceInventory.fileCount} files)

## Checks

| Check | Result |
|---|---|
${checkRows}

## What Changed

Each official material page under \`${data.scope.materialsRoot}\` now has a \`data-round317-content-map\` panel before the body. The panel summarizes the in-site body type, page/text depth, topic cue, and local anchors. It does not link to raw PDF/PPT/DOC/ZIP files.

## Image-Heavy Pages Sample

| Page | Page Images | Visible Text Chars | Round317 Map |
|---|---:|---:|---|
${thinRows || '| none | 0 | 0 | n/a |'}

## Boundary

No site-updates, roadmap, or release-gate files were edited in this worker round. The check is local/static and focused on the 38 material \`index.html\` pages plus this ledger.
`;
}
