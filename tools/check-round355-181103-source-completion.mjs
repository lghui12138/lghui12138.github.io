#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const version = 'round355-181103-source-completion-20260615';
const defaultSourceRoot = '/Users/kili/Downloads/181103流体力学';
const sourceRoot = path.resolve(process.env.FLUID_181103_ROOT || defaultSourceRoot);
const jsonRel = 'data/fluid-round355-181103-source-completion.json';
const gzipRel = `${jsonRel}.gz`;
const docRel = 'docs/round355/181103-source-completion.md';
const sourceFiles = {
  materials: 'data/fluid-181103-materials.json',
  questionBank: 'question-banks/181103-material-extracted.json',
  htmlRoot: 'resources/fluid-181103-html/materials'
};
const expected = {
  sourceFiles: 38,
  ledgerRows: 38,
  sourceOnly: 0,
  ledgerOnly: 0,
  htmlFiles: 38,
  pageImages: 1099,
  sourceAnchors: 411,
  forbiddenHits: 0
};

function parseArgs(argv) {
  const out = { write: false, checkOnly: false, json: false };
  for (const arg of argv) {
    if (arg === '--write') out.write = true;
    else if (arg === '--check-only') out.checkOnly = true;
    else if (arg === '--json') out.json = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!out.write && !out.checkOnly) out.checkOnly = true;
  if (out.write && out.checkOnly) throw new Error('Use either --write or --check-only, not both.');
  return out;
}

function fromRoot(relPath) {
  return path.join(repoRoot, relPath);
}

function readText(relPath) {
  return fs.readFileSync(fromRoot(relPath), 'utf8');
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function writeText(relPath, text) {
  const absPath = fromRoot(relPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, text.endsWith('\n') ? text : `${text}\n`);
}

function writeJsonAndGzip(relPath, value) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  writeText(relPath, text);
  fs.writeFileSync(fromRoot(`${relPath}.gz`), zlib.gzipSync(text, { level: 9 }));
}

function readExistingGeneratedAt() {
  try {
    return readJson(jsonRel).generatedAt || null;
  } catch {
    return null;
  }
}

function toPosix(value) {
  return String(value || '').split(path.sep).join('/');
}

function listFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    entries.sort((a, b) => b.name.localeCompare(a.name, 'zh-Hans-CN'));
    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(abs);
      else if (entry.isFile() && !entry.name.startsWith('._')) out.push(abs);
    }
  }
  return out.sort((a, b) => toPosix(path.relative(dir, a)).localeCompare(toPosix(path.relative(dir, b)), 'zh-Hans-CN'));
}

function attrs(html, attr) {
  return [...String(html || '').matchAll(new RegExp(`\\b${attr}=["']([^"']+)["']`, 'gi'))].map((match) => match[1]);
}

function ids(html) {
  return new Set([...String(html || '').matchAll(/\bid=(["'])([^"']+)\1|\bid=([^\s>]+)/gi)]
    .map((match) => match[2] || match[3])
    .filter(Boolean));
}

function anchorParts(sourceHtmlUrl) {
  const raw = String(sourceHtmlUrl || '');
  const [href, hash = ''] = raw.split('#');
  return {
    raw,
    href,
    hash,
    relPath: href.replace(/^\/+/, '').split(/[?#]/)[0]
  };
}

function htmlHasId(html, id) {
  if (!id) return false;
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\bid=(["'])${escaped}\\1|\\bid=${escaped}(?=[\\s>])`).test(html);
}

function textWithoutCode(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
}

function htmlWithoutRepairBoundary(html) {
  return String(html || '').replace(/<section\b[^>]*data-round354-office-rendered-boundary[\s\S]*?<\/section>/gi, ' ');
}

function countRawDownloadViewerHrefHits(html) {
  return attrs(html, 'href')
    .filter((href) => /(?:^|\/)(?:download|downloads|raw|viewer|viewers)(?:\/|$|[?#-])/i.test(href)
      || /\.(?:pdf|pptx?|docx?|doc|zip|rar|7z)(?:$|[?#])/i.test(href))
    .length;
}

function countLocalPathHits(html) {
  return (String(html || '').match(/\/Users\/|\/Volumes\/|file:\/\/|[A-Za-z]:\\/gi) || []).length;
}

function countViewerShellHits(html) {
  return (String(html || '').match(/<iframe\b|<embed\b|<object\b|viewer-shell|pdf-viewer|data-viewer|viewerUrl|viewerPath|viewerMode/gi) || []).length;
}

function countDownloadAttributeHits(html) {
  return (String(html || '').match(/<a\b[^>]*\bdownload(?:\s|=|>)/gi) || []).length;
}

function countFallbackPlaceholderHits(html) {
  const visible = textWithoutCode(htmlWithoutRepairBoundary(html));
  return (visible.match(/待精修|未能抽取|转换失败|TODO|FIXME|placeholder|fallback content|render fallback|manual-refine/gi) || []).length;
}

function countQuestionMarkPlaceholderHits(html) {
  return (htmlWithoutRepairBoundary(html).match(/alt=["']\s*[?？]\s*["']|>\s*[?？]\s*<\/(?:span|div|p|figcaption|strong|em|b)>|src=["']data:;|EMBED Equation/gi) || []).length;
}

function scanHtml(material) {
  const htmlPath = material.htmlPath || '';
  const abs = fromRoot(htmlPath);
  const htmlExists = Boolean(htmlPath && fs.existsSync(abs));
  const html = htmlExists ? fs.readFileSync(abs, 'utf8') : '';
  const dir = htmlExists ? path.dirname(abs) : '';
  const imageSrcs = attrs(html, 'src').filter((src) => !/^https?:/i.test(src) && !/^data:/i.test(src));
  const missingImageRefs = imageSrcs.filter((src) => !fs.existsSync(path.join(dir, src.split(/[?#]/)[0])));
  return {
    materialId: material.id,
    htmlPath,
    htmlExists,
    pageImages: imageSrcs.length,
    sourceAnchorIds: ids(html).size,
    missingImageRefs,
    rawDownloadViewerHrefHits: countRawDownloadViewerHrefHits(html),
    localPathHits: countLocalPathHits(html),
    viewerShellHits: countViewerShellHits(html),
    downloadAttributeHits: countDownloadAttributeHits(html),
    fallbackPlaceholderHits: countFallbackPlaceholderHits(html),
    questionMarkPlaceholderHits: countQuestionMarkPlaceholderHits(html)
  };
}

function buildPayload() {
  if (process.cwd().startsWith('/Volumes/mac_2T') || repoRoot.startsWith('/Volumes/mac_2T')) {
    throw new Error('Refusing to run Round355 181103 completion gate from or against /Volumes/mac_2T during lifs isolation.');
  }
  if (!fs.existsSync(sourceRoot)) {
    throw new Error(`181103 source folder not found: ${sourceRoot}`);
  }

  const materialsPayload = readJson(sourceFiles.materials);
  const materials = Array.isArray(materialsPayload.materials) ? materialsPayload.materials : [];
  const questions = readJson(sourceFiles.questionBank);
  const sourceRelativePaths = listFiles(sourceRoot).map((file) => toPosix(path.relative(sourceRoot, file)));
  const ledgerRelativePaths = materials.map((row) => row.relativePath).filter(Boolean).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'));
  const sourceSet = new Set(sourceRelativePaths);
  const ledgerSet = new Set(ledgerRelativePaths);
  const sourceOnly = sourceRelativePaths.filter((item) => !ledgerSet.has(item));
  const ledgerOnly = ledgerRelativePaths.filter((item) => !sourceSet.has(item));
  const htmlRows = materials.map(scanHtml);
  const anchorRows = questions.map((question) => {
    const parts = anchorParts(question.sourceHtmlUrl);
    const inSiteHtml = /^\/resources\/fluid-181103-html\/materials\/[^/]+\/index\.html#[A-Za-z0-9_-]+$/.test(parts.raw);
    const sourceHtmlExists = Boolean(parts.relPath && fs.existsSync(fromRoot(parts.relPath)));
    const html = sourceHtmlExists ? readText(parts.relPath) : '';
    return {
      id: question.id,
      sourceMaterialId: question.sourceMaterialId || '',
      sourceHtmlUrl: parts.raw,
      sourceHtmlExists,
      sourceAnchorFound: sourceHtmlExists && htmlHasId(html, parts.hash),
      inSiteHtml,
      boundaryHit: /(?:^|\/)(?:download|downloads|raw|viewer|viewers)(?:\/|$|[?#-])|\/Users\/|\/Volumes\/|file:\/\//i.test(parts.raw)
    };
  });
  const forbidden = {
    rawDownloadViewerHrefHits: htmlRows.reduce((sum, row) => sum + row.rawDownloadViewerHrefHits, 0),
    localPathHits: htmlRows.reduce((sum, row) => sum + row.localPathHits, 0),
    viewerShellHits: htmlRows.reduce((sum, row) => sum + row.viewerShellHits, 0),
    downloadAttributeHits: htmlRows.reduce((sum, row) => sum + row.downloadAttributeHits, 0),
    fallbackPlaceholderHits: htmlRows.reduce((sum, row) => sum + row.fallbackPlaceholderHits, 0),
    questionMarkPlaceholderHits: htmlRows.reduce((sum, row) => sum + row.questionMarkPlaceholderHits, 0),
    missingImageRefs: htmlRows.reduce((sum, row) => sum + row.missingImageRefs.length, 0),
    sourceAnchorBoundaryHits: anchorRows.filter((row) => row.boundaryHit || !row.inSiteHtml).length
  };
  const summary = {
    sourceFileCount: sourceRelativePaths.length,
    ledgerRowCount: materials.length,
    sourceOnlyCount: sourceOnly.length,
    ledgerOnlyCount: ledgerOnly.length,
    htmlFileCount: htmlRows.filter((row) => row.htmlExists).length,
    pageImageCount: htmlRows.reduce((sum, row) => sum + row.pageImages, 0),
    sourceAnchorCount: anchorRows.length,
    sourceAnchorFoundCount: anchorRows.filter((row) => row.sourceAnchorFound).length,
    forbiddenHitCount: Object.values(forbidden).reduce((sum, value) => sum + value, 0)
  };
  const checks = [
    {
      id: 'source-folder-has-38-files',
      pass: summary.sourceFileCount === expected.sourceFiles,
      detail: { sourceFileCount: summary.sourceFileCount }
    },
    {
      id: 'materials-ledger-has-38-rows',
      pass: summary.ledgerRowCount === expected.ledgerRows && materialsPayload.fileCount === expected.ledgerRows,
      detail: { ledgerRowCount: summary.ledgerRowCount, fileCount: materialsPayload.fileCount }
    },
    {
      id: 'source-ledger-diff-is-empty',
      pass: summary.sourceOnlyCount === expected.sourceOnly && summary.ledgerOnlyCount === expected.ledgerOnly,
      detail: { sourceOnly, ledgerOnly }
    },
    {
      id: 'all-38-materials-have-standalone-html',
      pass: summary.htmlFileCount === expected.htmlFiles && htmlRows.every((row) => row.htmlPath.startsWith(sourceFiles.htmlRoot)),
      detail: { htmlFileCount: summary.htmlFileCount }
    },
    {
      id: 'html-pages-contain-1099-page-images',
      pass: summary.pageImageCount === expected.pageImages,
      detail: { pageImageCount: summary.pageImageCount }
    },
    {
      id: 'all-411-source-anchors-resolve',
      pass: summary.sourceAnchorCount === expected.sourceAnchors
        && summary.sourceAnchorFoundCount === expected.sourceAnchors,
      detail: {
        sourceAnchorCount: summary.sourceAnchorCount,
        sourceAnchorFoundCount: summary.sourceAnchorFoundCount,
        failingAnchors: anchorRows.filter((row) => !row.sourceAnchorFound || !row.inSiteHtml || row.boundaryHit).slice(0, 20)
      }
    },
    {
      id: 'zero-raw-download-viewer-local-fallback-question-mark-hits',
      pass: summary.forbiddenHitCount === expected.forbiddenHits,
      detail: forbidden
    }
  ];

  const payload = {
    ok: checks.every((check) => check.pass),
    version,
    generatedAt: process.env.FLUID_ROUND355_181103_SOURCE_COMPLETION_GENERATED_AT
      || readExistingGeneratedAt()
      || '2026-06-15T23:58:00+08:00',
    sourceRootLabel: path.basename(sourceRoot),
    sourceFiles,
    expected,
    summary,
    forbidden,
    checks,
    failures: checks.filter((check) => !check.pass).map((check) => check.id),
    sourceOnly,
    ledgerOnly,
    rows: materials.map((material) => {
      const html = htmlRows.find((row) => row.materialId === material.id) || {};
      return {
        id: material.id,
        title: material.title,
        kind: material.kind,
        relativePath: material.relativePath,
        htmlPath: material.htmlPath,
        htmlExists: html.htmlExists === true,
        pageImages: html.pageImages || 0,
        sourceAnchors: anchorRows.filter((row) => row.sourceMaterialId === material.id).length
      };
    }),
    verificationCommands: [
      'node --check tools/check-round355-181103-source-completion.mjs',
      'node tools/check-round355-181103-source-completion.mjs --write --json',
      'node tools/check-round355-181103-source-completion.mjs --check-only --json'
    ]
  };
  return payload;
}

function renderMarkdown(payload) {
  const checks = payload.checks.map((check) => `| ${check.id} | ${check.pass ? 'PASS' : 'FAIL'} |`).join('\n');
  const rows = payload.rows.map((row) => `| ${row.id} | ${row.kind} | ${row.pageImages} | ${row.sourceAnchors} | ${row.htmlExists ? 'PASS' : 'FAIL'} | ${row.relativePath} |`).join('\n');
  return `# Round355 181103 Source Completion Gate

- version: ${payload.version}
- ok: ${payload.ok}
- source files: ${payload.summary.sourceFileCount}/38
- ledger rows: ${payload.summary.ledgerRowCount}/38
- source-only / ledger-only: ${payload.summary.sourceOnlyCount}/${payload.summary.ledgerOnlyCount}
- standalone HTML files: ${payload.summary.htmlFileCount}/38
- page images: ${payload.summary.pageImageCount}/1099
- source anchors: ${payload.summary.sourceAnchorFoundCount}/411
- forbidden/raw/download/viewer/local/fallback/question-mark hits: ${payload.summary.forbiddenHitCount}

## Boundary

This gate compares the local 181103 source folder, \`data/fluid-181103-materials.json\`, the 38 in-site HTML material pages, and the extracted 181103 material-question source anchors. It does not publish raw PDF/PPT/DOC/ZIP files and it does not treat viewer or download wrappers as completion.

## Checks

| check | status |
| --- | --- |
${checks}

## Material Rows

| id | kind | page images | source anchors | HTML | source-relative path |
| --- | --- | ---: | ---: | --- | --- |
${rows}

## Verify

\`\`\`bash
node --check tools/check-round355-181103-source-completion.mjs
node tools/check-round355-181103-source-completion.mjs --write --json
node tools/check-round355-181103-source-completion.mjs --check-only --json
\`\`\`
`;
}

function artifactMatches(relPath, expectedText) {
  try {
    return readText(relPath) === expectedText;
  } catch {
    return false;
  }
}

const args = parseArgs(process.argv.slice(2));
const payload = buildPayload();
const markdown = renderMarkdown(payload);

if (args.write) {
  writeJsonAndGzip(jsonRel, payload);
  writeText(docRel, markdown);
}

if (args.checkOnly) {
  const expectedJson = `${JSON.stringify(payload, null, 2)}\n`;
  const currentJsonMatches = artifactMatches(jsonRel, expectedJson);
  const currentDocMatches = artifactMatches(docRel, markdown);
  let gzipMatches = false;
  try {
    gzipMatches = zlib.gunzipSync(fs.readFileSync(fromRoot(gzipRel))).toString('utf8') === expectedJson;
  } catch {
    gzipMatches = false;
  }
  payload.checks.push({ id: 'round355-json-artifact-is-current', pass: currentJsonMatches, detail: { file: jsonRel } });
  payload.checks.push({ id: 'round355-gzip-artifact-is-current', pass: gzipMatches, detail: { file: gzipRel } });
  payload.checks.push({ id: 'round355-doc-artifact-is-current', pass: currentDocMatches, detail: { file: docRel } });
  payload.ok = payload.checks.every((check) => check.pass);
  payload.failures = payload.checks.filter((check) => !check.pass).map((check) => check.id);
}

if (args.json) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
} else if (!payload.ok) {
  console.error(`Round355 181103 source completion failed: ${payload.failures.join(', ')}`);
}

process.exit(payload.ok ? 0 : 1);
