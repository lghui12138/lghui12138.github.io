#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const args = new Set(process.argv.slice(2));
const version = 'round313-181103-all-html-content-contract-20260614';
const sourceLedgerRel = 'data/fluid-round310-181103-html-content.json';
const previousQualityRel = 'data/fluid-round312-181103-html-quality-ledger.json';
const ledgerRel = 'data/fluid-round313-181103-all-html-contract.json';
const docRel = 'docs/round313/181103-all-html-contract.md';

function fromRoot(rel) {
  return path.join(repoRoot, rel);
}

function readText(rel) {
  return fs.readFileSync(fromRoot(rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
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

function count(re, text) {
  return (text.match(re) || []).length;
}

function rowContract(item) {
  const html = fs.existsSync(fromRoot(item.htmlPath)) ? readText(item.htmlPath) : '';
  const links = hrefs(html);
  const visibleText = stripVisibleText(html);
  const binaryHrefCount = links.filter((href) => /\.(?:pdf|pptx?|docx?|doc|zip)(?:$|[?#])/i.test(href)).length;
  const forbiddenWrapperTokenCount = count(/\bviewer\b|htmlViewer|viewerUrl|viewerPath|viewerMode|<iframe\b|<embed\b|<object\b|converted-frame/gi, html);
  const hasReaderNav = /data-round313-reader-nav/.test(html);
  const hasStudyBridge = /data-round313-study-bridge/.test(html);
  const hasNoDownloadNotice = /不提供 PDF、PPT、DOC、ZIP 原件下载链接/.test(html);
  const hasRealExamReturn = /325\/68|325 原文小题 \/ 68 组题|325 原文小题/.test(html) && /real-exams-dynamic\.html/.test(html);
  const hasResourcesReturn = /resources\.html#supplemental-181103/.test(html);
  const hasPrevOrFirst = /data-round313-reader-prev/.test(html);
  const hasNextOrLast = /data-round313-reader-next/.test(html);
  const hasHtmlContent = /<section class=["'][^"']*\bhtml-content\b/i.test(html);
  const localPathLeakCount = count(/\/Users\/|\/Volumes\/|file:\/\//gi, html);
  const pass = Boolean(html)
    && visibleText.length >= 300
    && hasHtmlContent
    && hasReaderNav
    && hasStudyBridge
    && hasNoDownloadNotice
    && hasRealExamReturn
    && hasResourcesReturn
    && hasPrevOrFirst
    && hasNextOrLast
    && binaryHrefCount === 0
    && forbiddenWrapperTokenCount === 0
    && localPathLeakCount === 0;
  return {
    id: item.id,
    ordinal: item.ordinal,
    title: item.title,
    kind: item.kind,
    htmlPath: item.htmlPath,
    visibleTextChars: visibleText.length,
    hasHtmlContent,
    hasReaderNav,
    hasStudyBridge,
    hasNoDownloadNotice,
    hasRealExamReturn,
    hasResourcesReturn,
    hasPrevOrFirst,
    hasNextOrLast,
    binaryHrefCount,
    forbiddenWrapperTokenCount,
    localPathLeakCount,
    pass
  };
}

const source = readJson(sourceLedgerRel);
const previous = readJson(previousQualityRel);
const indexHtml = readText('resources/fluid-181103-html/index.html');
const homeHtml = readText('index-complete.html');
const rows = (source.materials || []).map(rowContract);

const checks = [
  {
    id: 'source-ledger-round313-all-html-contract',
    pass: source.version === version
      && source.accounting?.sourceFileCount === 38
      && source.accounting?.htmlContentPageCount === 38
      && source.accounting?.completeHtmlCount === 38
      && source.accounting?.rawDownloadCount === 0,
    detail: { version: source.version, accounting: source.accounting }
  },
  {
    id: 'index-is-study-workbench-not-flat-viewer',
    pass: /data-round313-index-tools/.test(indexHtml)
      && /data-round313-material-list/.test(indexHtml)
      && /38\/38 (?:站内 )?HTML 正文/.test(indexHtml)
      && /30 条路线 \/ 68 复核任务/.test(indexHtml)
      && !/\bviewer\b|<iframe\b|<embed\b|<object\b|converted-frame/i.test(indexHtml),
    detail: 'resources/fluid-181103-html/index.html'
  },
  {
    id: 'all-38-material-pages-are-html-content-pages',
    pass: rows.length === 38 && rows.every((row) => row.pass),
    detail: rows.filter((row) => !row.pass)
  },
  {
    id: 'no-download-or-local-path-or-viewer-wrapper',
    pass: rows.reduce((sum, row) => sum + row.binaryHrefCount + row.forbiddenWrapperTokenCount + row.localPathLeakCount, 0) === 0,
    detail: {
      binaryHrefCount: rows.reduce((sum, row) => sum + row.binaryHrefCount, 0),
      forbiddenWrapperTokenCount: rows.reduce((sum, row) => sum + row.forbiddenWrapperTokenCount, 0),
      localPathLeakCount: rows.reduce((sum, row) => sum + row.localPathLeakCount, 0)
    }
  },
  {
    id: 'round312-quality-still-passing',
    pass: previous.acceptance?.pass === true
      && previous.summary?.qualityPassCount === 38
      && previous.summary?.rawDownloadHrefCount === 0
      && previous.summary?.missingImageCount === 0,
    detail: previous.summary
  },
  {
    id: 'home-181103-aria-current-68-not-61',
    pass: /38 份资料、30 条学习路线和 68 个真题复核任务/.test(homeHtml)
      && !/38 份资料、30 条学习路线和 61 个真题复核任务/.test(homeHtml),
    detail: 'index-complete.html'
  }
];

const failed = checks.filter((check) => !check.pass);
const payload = {
  version,
  generatedAt: new Date().toISOString(),
  sourceLedger: sourceLedgerRel,
  previousQualityLedger: previousQualityRel,
  summary: {
    materialCount: rows.length,
    contractPassCount: rows.filter((row) => row.pass).length,
    readerNavCount: rows.filter((row) => row.hasReaderNav).length,
    studyBridgeCount: rows.filter((row) => row.hasStudyBridge).length,
    htmlContentCount: rows.filter((row) => row.hasHtmlContent).length,
    binaryHrefCount: rows.reduce((sum, row) => sum + row.binaryHrefCount, 0),
    forbiddenWrapperTokenCount: rows.reduce((sum, row) => sum + row.forbiddenWrapperTokenCount, 0),
    localPathLeakCount: rows.reduce((sum, row) => sum + row.localPathLeakCount, 0),
    realExamAtoms: 325,
    groupedSections: 68,
    reviewTasks: 68
  },
  rows,
  checks,
  acceptance: {
    pass: failed.length === 0,
    failedCheckIds: failed.map((check) => check.id),
    meaning: 'All 181103 source materials are published as direct in-site HTML content pages with reader navigation and study bridges, not viewers, embeds, wrappers, or downloads.'
  }
};

if (args.has('--write')) {
  fs.mkdirSync(fromRoot('data'), { recursive: true });
  fs.mkdirSync(fromRoot('docs/round313'), { recursive: true });
  const json = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(fromRoot(ledgerRel), json);
  fs.writeFileSync(fromRoot(`${ledgerRel}.gz`), zlib.gzipSync(json));
  fs.writeFileSync(fromRoot(docRel), renderMarkdown(payload));
}

if (args.has('--json')) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
else {
  console.log(`${payload.acceptance.pass ? 'PASS' : 'FAIL'} ${version}: ${payload.summary.contractPassCount}/38 direct HTML contracts, wrappers ${payload.summary.forbiddenWrapperTokenCount}, downloads ${payload.summary.binaryHrefCount}`);
  failed.forEach((check) => console.log(`- ${check.id}`));
}

process.exitCode = payload.acceptance.pass ? 0 : 1;

function renderMarkdown(payload) {
  return `# Round313 181103 All-HTML Contract

- version: ${payload.version}
- contract pages: ${payload.summary.contractPassCount}/38
- reader navigation: ${payload.summary.readerNavCount}/38
- study bridges: ${payload.summary.studyBridgeCount}/38
- raw binary hrefs: ${payload.summary.binaryHrefCount}
- wrapper/embed/viewer tokens: ${payload.summary.forbiddenWrapperTokenCount}
- local path leaks: ${payload.summary.localPathLeakCount}

## Contract

All 38 files from the 181103 fluid mechanics source folder are published as direct, readable, in-site HTML content pages. A page does not pass if it is only a viewer, iframe, embed, object, wrapper, raw download link, local path leak, or directory shell.

Every material page carries previous/next reading navigation, a learning bridge back to 325/68 real-exam review, the resources workbench return path, and the no-download policy. ZIP rows only link to already generated HTML body pages.

## Gate

\`\`\`bash
node tools/check-round313-181103-all-html-contract.mjs --write --json
\`\`\`
`;
}
