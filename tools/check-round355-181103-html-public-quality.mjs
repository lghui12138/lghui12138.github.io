#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const version = 'round357-181103-auth-workflow-proof-20260615';
const jsonRel = 'data/fluid-round355-181103-html-public-quality.json';
const gzipRel = `${jsonRel}.gz`;
const docRel = 'docs/round355/181103-html-public-quality.md';
const htmlRootRel = 'resources/fluid-181103-html';
const materialsRootRel = `${htmlRootRel}/materials`;
const sourceDir = '/Users/kili/Downloads/181103流体力学';
const generatedAt = process.env.FLUID_ROUND355_181103_HTML_PUBLIC_QUALITY_GENERATED_AT
  || readExistingGeneratedAt()
  || '2026-06-15T23:58:00+08:00';

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round355 checks from /Volumes/mac_2T during lifs isolation.');
}

const args = parseArgs(process.argv.slice(2));
const materials = readJson('data/fluid-181103-materials.json').materials || [];
const sourceFiles = sourceDirExists() ? listFiles(sourceDir).filter((file) => !path.basename(file).startsWith('._')) : [];
const indexPath = path.join(repoRoot, htmlRootRel, 'index.html');
const materialRows = materials.map(inspectMaterial);
const indexRow = inspectHtml('181103-index', '181103 HTML 总表', 'resources/fluid-181103-html/index.html', {
  kind: 'index',
  expectedMinText: 1200
});
const failures = [
  ...indexRow.failures.map((failure) => ({ id: indexRow.id, title: indexRow.title, failure })),
  ...materialRows.flatMap((row) => row.failures.map((failure) => ({ id: row.id, title: row.title, failure })))
];
const manifestSourceMissing = materials
  .filter((item) => sourceDirExists() && !fs.existsSync(path.join(sourceDir, item.relativePath || '')))
  .map((item) => ({ id: item.id, relativePath: item.relativePath }));
const sourceOnly = sourceDirExists()
  ? sourceFiles
    .map((file) => path.relative(sourceDir, file))
    .filter((rel) => !materials.some((item) => item.relativePath === rel))
  : [];
if (materials.length !== 38) failures.push({ id: 'manifest', title: '181103 manifest', failure: `material count ${materials.length}/38` });
if (!fs.existsSync(indexPath)) failures.push({ id: '181103-index', title: '181103 HTML 总表', failure: 'index.html missing' });
if (sourceDirExists() && sourceFiles.length !== 38) failures.push({ id: 'source-dir', title: '181103 source directory', failure: `source file count ${sourceFiles.length}/38` });
if (manifestSourceMissing.length) failures.push({ id: 'source-dir', title: '181103 source directory', failure: `manifest source files missing: ${manifestSourceMissing.slice(0, 5).map((row) => row.relativePath).join(', ')}` });
if (sourceOnly.length) failures.push({ id: 'source-dir', title: '181103 source directory', failure: `source files not in manifest: ${sourceOnly.slice(0, 5).join(', ')}` });

const payload = {
  ok: failures.length === 0,
  version,
  generatedAt,
  sourceFiles: {
    manifest: 'data/fluid-181103-materials.json',
    htmlIndex: 'resources/fluid-181103-html/index.html',
    htmlMaterials: materialsRootRel,
    localSourceDirectoryChecked: sourceDirExists() ? sourceDir : null
  },
  summary: {
    sourceFileCount: sourceDirExists() ? sourceFiles.length : null,
    manifestMaterials: materials.length,
    htmlIndexPresent: fs.existsSync(indexPath),
    materialHtmlPages: materialRows.filter((row) => row.htmlExists).length,
    htmlFilesChecked: 1 + materialRows.length,
    pagesWithImages: materialRows.filter((row) => row.imageRefs > 0).length,
    totalImageRefs: materialRows.reduce((sum, row) => sum + row.imageRefs, 0),
    eagerImageRefs: materialRows.reduce((sum, row) => sum + row.eagerImageRefs, 0),
    lazyImageRefs: materialRows.reduce((sum, row) => sum + row.lazyImageRefs, 0),
    largeEagerImageRiskPages: materialRows.filter((row) => row.largeEagerImageRisk).length,
    missingImageRefs: materialRows.reduce((sum, row) => sum + row.missingImages.length, 0),
    emptyOrThinPages: materialRows.filter((row) => row.emptyOrThin).length,
    visibleOldRound315Mentions: indexRow.visibleOldRound315Mentions + materialRows.reduce((sum, row) => sum + row.visibleOldRound315Mentions, 0),
    staleRound315EdgeRefreshLinks: indexRow.staleRound315EdgeRefreshLinks + materialRows.reduce((sum, row) => sum + row.staleRound315EdgeRefreshLinks, 0),
    questionRunPages: materialRows.filter((row) => row.questionRunCount > 0).length + (indexRow.questionRunCount > 0 ? 1 : 0),
    replacementCharPages: materialRows.filter((row) => row.replacementChars > 0).length + (indexRow.replacementChars > 0 ? 1 : 0),
    binaryHrefCount: indexRow.binaryHrefCount + materialRows.reduce((sum, row) => sum + row.binaryHrefCount, 0),
    localPathLeakCount: indexRow.localPathLeakCount + materialRows.reduce((sum, row) => sum + row.localPathLeakCount, 0),
    iframeEmbedObjectCount: indexRow.iframeEmbedObjectCount + materialRows.reduce((sum, row) => sum + row.iframeEmbedObjectCount, 0),
    manifestSourceMissing: manifestSourceMissing.length,
    sourceOnly: sourceOnly.length,
    failCount: failures.length
  },
  indexRow,
  materialRows,
  manifestSourceMissing,
  sourceOnly,
  failures,
  acceptance: {
    pass: failures.length === 0,
    meaning: 'All 38 181103 resources must be visible as direct in-site HTML pages, with non-empty page content, no repeated question-mark garbling, no replacement characters, no stale Round315 current links, no binary download hrefs, no local path leaks, and lazy image loading for large page-image workbooks.'
  },
  artifacts: {
    tool: 'tools/check-round355-181103-html-public-quality.mjs',
    json: jsonRel,
    gzip: gzipRel,
    markdown: docRel
  },
  verificationCommands: [
    'node --check tools/check-round355-181103-html-public-quality.mjs',
    'node tools/check-round355-181103-html-public-quality.mjs --write --json'
  ]
};

if (args.write) {
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  writeText(jsonRel, body);
  writeBuffer(gzipRel, zlib.gzipSync(body, { level: 9 }));
  writeText(docRel, renderMarkdown(payload));
}

if (args.json) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
else {
  console.log(`${payload.ok ? 'PASS' : 'FAIL'} ${version}: html=${payload.summary.materialHtmlPages}/38, images=${payload.summary.totalImageRefs}, lazy=${payload.summary.lazyImageRefs}, oldRound315=${payload.summary.visibleOldRound315Mentions}, questionRunPages=${payload.summary.questionRunPages}, failures=${payload.summary.failCount}`);
  for (const failure of failures.slice(0, 30)) console.log(`- ${failure.id}: ${failure.failure}`);
}
process.exitCode = payload.ok ? 0 : 1;

function inspectMaterial(material) {
  return inspectHtml(material.id, material.title, material.htmlPath, {
    kind: material.kind,
    sourceRelativePath: material.relativePath,
    expectedMinText: material.kind === 'zip' ? 500 : 700
  });
}

function inspectHtml(id, title, rel, options = {}) {
  const abs = rel ? path.join(repoRoot, rel) : '';
  const htmlExists = !!rel && fs.existsSync(abs);
  const html = htmlExists ? readText(rel) : '';
  const text = visibleText(html);
  const dir = htmlExists ? path.dirname(abs) : '';
  const hrefs = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const imageRows = imageTags
    .map((tag) => {
      const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] || '';
      return { tag, src };
    })
    .filter((row) => row.src && !/^https?:/i.test(row.src) && !/^data:/i.test(row.src));
  const localImageRefs = imageRows.map((row) => row.src);
  const eagerImageRefs = imageRows.filter((row) => /\bloading=["']eager["']/i.test(row.tag)).length;
  const lazyImageRefs = imageRows.filter((row) => /\bloading=["']lazy["']/i.test(row.tag)).length;
  const missingLoadingRefs = imageRows.length - eagerImageRefs - lazyImageRefs;
  const largeEagerImageRisk = imageRows.length >= 80 && eagerImageRefs > 6;
  const missingImages = localImageRefs.filter((src) => !fs.existsSync(path.join(dir, src.split(/[?#]/)[0])));
  const binaryHrefs = hrefs.filter((href) => /\.(?:pdf|docx?|pptx?|zip)(?:[?#]|$)/i.test(href));
  const localPathLeaks = [...html.matchAll(/(?:\/Users\/|\/Volumes\/|file:\/\/)/g)].length;
  const questionRuns = [...text.matchAll(/\?{2,}/g)].map((match) => match[0].length);
  const replacementChars = (text.match(/[�□■]/g) || []).length;
  const visibleOldRound315Mentions = (text.match(/round315-181103-all-html-direct-pages-20260614/g) || []).length
    + (text.match(/\bRound315\b/g) || []).length;
  const staleRound315EdgeRefreshLinks = (html.match(/edge_refresh=round315-181103-all-html-direct-pages-20260614/g) || []).length;
  const iframeEmbedObjectCount = (html.match(/<(?:iframe|embed|object)\b/gi) || []).length;
  const emptyOrThin = text.length < (options.expectedMinText || 700) && localImageRefs.length === 0;
  const failures = [];

  if (!htmlExists) failures.push('html file missing');
  if (emptyOrThin) failures.push(`html content too thin: text=${text.length}, images=${localImageRefs.length}`);
  if (questionRuns.length) failures.push(`visible repeated question marks: maxRun=${Math.max(...questionRuns)}`);
  if (replacementChars) failures.push(`visible replacement or box characters: ${replacementChars}`);
  if (visibleOldRound315Mentions) failures.push(`visible old Round315 current-version text: ${visibleOldRound315Mentions}`);
  if (staleRound315EdgeRefreshLinks) failures.push(`stale round315 edge_refresh links: ${staleRound315EdgeRefreshLinks}`);
  if (binaryHrefs.length) failures.push(`binary download hrefs exposed: ${binaryHrefs.slice(0, 3).join(', ')}`);
  if (localPathLeaks) failures.push(`local path leaks: ${localPathLeaks}`);
  if (iframeEmbedObjectCount) failures.push(`viewer/embed shell elements: ${iframeEmbedObjectCount}`);
  if (missingImages.length) failures.push(`missing image refs: ${missingImages.slice(0, 3).join(', ')}`);
  if (missingLoadingRefs) failures.push(`image loading attrs missing: ${missingLoadingRefs}`);
  if (largeEagerImageRisk) failures.push(`large workbook eager image risk: images=${imageRows.length}, eager=${eagerImageRefs}, lazy=${lazyImageRefs}`);

  return {
    id,
    title,
    kind: options.kind || 'html',
    sourceRelativePath: options.sourceRelativePath || null,
    htmlPath: rel,
    htmlExists,
    textLength: text.length,
    cjkChars: (text.match(/[\u4e00-\u9fff]/g) || []).length,
    imageRefs: localImageRefs.length,
    eagerImageRefs,
    lazyImageRefs,
    missingLoadingRefs,
    largeEagerImageRisk,
    missingImages,
    binaryHrefCount: binaryHrefs.length,
    localPathLeakCount: localPathLeaks,
    iframeEmbedObjectCount,
    visibleOldRound315Mentions,
    staleRound315EdgeRefreshLinks,
    questionRunCount: questionRuns.length,
    maxQuestionRun: questionRuns.length ? Math.max(...questionRuns) : 0,
    replacementChars,
    emptyOrThin,
    pass: failures.length === 0,
    failures,
    sample: text.slice(0, 180)
  };
}

function visibleText(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(file));
    else if (entry.isFile()) out.push(file);
  }
  return out;
}

function sourceDirExists() {
  return fs.existsSync(sourceDir) && fs.statSync(sourceDir).isDirectory();
}

function parseArgs(argv) {
  const out = { write: false, json: false };
  for (const arg of argv) {
    if (arg === '--write') out.write = true;
    else if (arg === '--json') out.json = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return out;
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function readText(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

function writeText(rel, text) {
  const file = path.join(repoRoot, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`);
}

function writeBuffer(rel, buffer) {
  const file = path.join(repoRoot, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buffer);
}

function readExistingGeneratedAt() {
  try {
    return JSON.parse(readText(jsonRel)).generatedAt;
  } catch {
    return null;
  }
}

function renderMarkdown(report) {
  const badRows = report.failures.length
    ? report.failures.map((row) => `| ${row.id} | ${row.title} | ${row.failure} |`).join('\n')
    : '| none | none | none |';
  const rows = report.materialRows.map((row) => `| ${row.id} | ${row.kind} | ${row.pass ? 'PASS' : 'FAIL'} | ${row.textLength} | ${row.imageRefs} | ${row.eagerImageRefs} | ${row.lazyImageRefs} | ${row.maxQuestionRun} | ${row.visibleOldRound315Mentions} |`).join('\n');
  return `# Round355 181103 HTML Public Quality

Version: \`${report.version}\`

## Summary

- Source files: ${report.summary.sourceFileCount == null ? 'not checked' : `${report.summary.sourceFileCount}/38`}
- Manifest materials: ${report.summary.manifestMaterials}/38
- Material HTML pages: ${report.summary.materialHtmlPages}/38
- Image refs: ${report.summary.totalImageRefs}
- Image loading eager/lazy: ${report.summary.eagerImageRefs}/${report.summary.lazyImageRefs}
- Large eager-image risk pages: ${report.summary.largeEagerImageRiskPages}
- Missing images: ${report.summary.missingImageRefs}
- Empty/thin pages: ${report.summary.emptyOrThinPages}
- Visible old Round315 mentions: ${report.summary.visibleOldRound315Mentions}
- Stale Round315 edge_refresh links: ${report.summary.staleRound315EdgeRefreshLinks}
- Repeated-question-mark pages: ${report.summary.questionRunPages}
- Replacement-character pages: ${report.summary.replacementCharPages}
- Binary hrefs/local path leaks/viewer shells: ${report.summary.binaryHrefCount}/${report.summary.localPathLeakCount}/${report.summary.iframeEmbedObjectCount}
- Failures: ${report.summary.failCount}

## Failures

| id | title | failure |
|---|---|---|
${badRows}

## Material Rows

| id | kind | status | text | images | eager | lazy | max ? run | visible old Round315 |
|---|---|---|---:|---:|---:|---:|---:|---:|
${rows}
`;
}
