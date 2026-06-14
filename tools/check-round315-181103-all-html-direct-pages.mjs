#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const args = new Set(process.argv.slice(2));
const version = 'round315-181103-all-html-direct-pages-20260614';
const successorVersion = 'round316-181103-reader-polish-20260614';
const ledgerRel = 'data/fluid-round315-181103-all-html-direct-pages.json';
const docRel = 'docs/round315/181103-all-html-direct-pages.md';

function fromRoot(relPath) {
  return path.join(repoRoot, relPath);
}

function readText(relPath) {
  return fs.readFileSync(fromRoot(relPath), 'utf8');
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
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

function walkHtml(dirRel) {
  const out = [];
  const stack = [fromRoot(dirRel)];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(abs);
      else if (entry.isFile() && entry.name.endsWith('.html')) {
        out.push(path.relative(repoRoot, abs).split(path.sep).join('/'));
      }
    }
  }
  return out.sort();
}

function officialMaterialPages() {
  const materialsRoot = fromRoot('resources/fluid-181103-html/materials');
  return fs.readdirSync(materialsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `resources/fluid-181103-html/materials/${entry.name}/index.html`)
    .filter((relPath) => fs.existsSync(fromRoot(relPath)))
    .sort();
}

function scanCommon(relPath, html) {
  const links = hrefs(html);
  return {
    relPath,
    binaryHrefCount: links.filter((href) => /\.(?:pdf|pptx?|docx?|doc|zip)(?:$|[?#])/i.test(href)).length,
    localPathLeakCount: (/\/Users\/|\/Volumes\/|file:\/\//gi).test(html) ? (html.match(/\/Users\/|\/Volumes\/|file:\/\//gi) || []).length : 0,
    iframeEmbedObjectCount: (html.match(/<iframe\b|<embed\b|<object\b/gi) || []).length,
    legacyViewerTokenCount: (html.match(/\bviewer\b|htmlViewer|viewerUrl|viewerPath|viewerMode|converted-frame/gi) || []).length,
    oldRound313LinkCount: (html.match(/edge_refresh=round313-|data-round313-|round313-181103-all-html-content-contract/gi) || []).length
  };
}

function scanOfficialPage(relPath) {
  const html = readText(relPath);
  const common = scanCommon(relPath, html);
  const text = stripVisibleText(html);
  const hasCurrentVersion = html.includes(version);
  const hasDirectHtmlBadge = /HTML 正文页/.test(html);
  const hasReaderNav = /data-round315-reader-nav/.test(html);
  const hasStudyBridge = /data-round315-study-bridge/.test(html);
  const hasRealExamReturn = /real-exams-dynamic\.html\?edge_refresh=round315-181103-all-html-direct-pages-20260614/.test(html);
  const hasNoDownloadNotice = /不提供 PDF、PPT、DOC、ZIP 原件下载链接/.test(html);
  const legacyConversionBadgeCount = (html.match(/(?:PDF|PPTX?|DOCX?|DOC|ZIP) 转 HTML/gi) || []).length;
  const pass = Boolean(html)
    && text.length >= 300
    && hasCurrentVersion
    && hasDirectHtmlBadge
    && hasReaderNav
    && hasStudyBridge
    && hasRealExamReturn
    && hasNoDownloadNotice
    && legacyConversionBadgeCount === 0
    && common.binaryHrefCount === 0
    && common.localPathLeakCount === 0
    && common.iframeEmbedObjectCount === 0
    && common.legacyViewerTokenCount === 0
    && common.oldRound313LinkCount === 0;
  return {
    ...common,
    visibleTextChars: text.length,
    hasCurrentVersion,
    hasDirectHtmlBadge,
    hasReaderNav,
    hasStudyBridge,
    hasRealExamReturn,
    hasNoDownloadNotice,
    legacyConversionBadgeCount,
    pass
  };
}

function gate(id, pass, detail) {
  return { id, pass: Boolean(pass), detail };
}

const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const siteUpdates = readJson('site-updates.json');
const allHtmlContract = readJson('data/fluid-round313-181103-all-html-contract.json');
const answerLayering = readJson('data/fluid-round314-answer-source-layering.json');
const indexHtml = readText('resources/fluid-181103-html/index.html');
const realExamsHtml = readText('modules/real-exams-dynamic.html');
const middleware = readText('functions/_middleware.js');
const searchBuilder = readText('tools/build-fluid-home-search-index.mjs');
const searchIndex = readJson('data/fluid-home-search-index.json');
const officialPages = officialMaterialPages();
const officialRows = officialPages.map(scanOfficialPage);
const allHtmlFiles = walkHtml('resources/fluid-181103-html');
const allTreeRows = allHtmlFiles.map((relPath) => scanCommon(relPath, readText(relPath)));

const summary = {
  officialMaterialPageCount: officialPages.length,
  officialPassCount: officialRows.filter((row) => row.pass).length,
  fullHtmlFileCount: allHtmlFiles.length,
  fullTreeBinaryHrefCount: allTreeRows.reduce((sum, row) => sum + row.binaryHrefCount, 0),
  fullTreeLocalPathLeakCount: allTreeRows.reduce((sum, row) => sum + row.localPathLeakCount, 0),
  fullTreeIframeEmbedObjectCount: allTreeRows.reduce((sum, row) => sum + row.iframeEmbedObjectCount, 0),
  officialViewerTokenCount: officialRows.reduce((sum, row) => sum + row.legacyViewerTokenCount, 0),
  officialOldRound313LinkCount: officialRows.reduce((sum, row) => sum + row.oldRound313LinkCount, 0),
  officialLegacyConversionBadgeCount: officialRows.reduce((sum, row) => sum + row.legacyConversionBadgeCount, 0),
  inheritedRound313PassCount: allHtmlContract.summary?.contractPassCount,
  inheritedRound314AnswerPdfProvableCount: answerLayering.summary?.answerPdfProvableCount,
  realExamAtoms: answerLayering.summary?.realExamAtoms,
  groupedSections: answerLayering.summary?.groupedSections,
  groupedSubquestions: answerLayering.summary?.groupedSubquestions
};

const checks = [
  gate('current-or-successor-release-preserves-round315', [version, successorVersion].includes(siteUpdates[0]?.version)
    && [version, successorVersion].includes(roadmap.version)
    && Number(roadmap.currentRound) >= 315
    && [version, successorVersion].includes(roadmap.releaseGate?.currentVersion)
    && new RegExp(`EDGE_HOME_VERSION\\s*=\\s*['"](?:${version}|${successorVersion})['"]`).test(middleware)
    && siteUpdates.some((row) => row?.version === version), {
      siteUpdates: siteUpdates[0]?.version,
      roadmap: roadmap.version,
      currentRound: roadmap.currentRound,
      edgeHomeVersion: /EDGE_HOME_VERSION\s*=\s*['"]([^'"]+)['"]/.exec(middleware)?.[1]
    }),
  gate('roadmap-round315-active', (roadmap.rounds || []).find((round) => round.round === 314)?.status === 'done'
    && ['active', 'done'].includes((roadmap.rounds || []).find((round) => round.round === 315)?.status)
    && /check-round315-181103-all-html-direct-pages\.mjs/.test(JSON.stringify(roadmap.releaseGate?.requiredLocalChecks || [])), 'data/fluid-upgrade-roadmap-100.json'),
  gate('official-38-material-pages-direct-html', officialRows.length === 38 && officialRows.every((row) => row.pass), officialRows.filter((row) => !row.pass)),
  gate('full-181103-tree-has-no-binary-hrefs-or-embeds', summary.fullHtmlFileCount >= 38
    && summary.fullTreeBinaryHrefCount === 0
    && summary.fullTreeLocalPathLeakCount === 0
    && summary.fullTreeIframeEmbedObjectCount === 0, {
      fullHtmlFileCount: summary.fullHtmlFileCount,
      binaryHrefCount: summary.fullTreeBinaryHrefCount,
      localPathLeakCount: summary.fullTreeLocalPathLeakCount,
      iframeEmbedObjectCount: summary.fullTreeIframeEmbedObjectCount
    }),
  gate('index-has-real-html-filters-not-fake-kind-anchors', /id="html-material-list"/.test(indexHtml)
    && /data-filter-kind="all"/.test(indexHtml)
    && /data-filter-kind="pdf"/.test(indexHtml)
    && /data-filter-kind="ppt,pptx"/.test(indexHtml)
    && !/#kind-(?:pdf|pptx|doc|zip)/.test(indexHtml)
    && !/\bviewer\b|<iframe\b|<embed\b|<object\b|converted-frame/i.test(indexHtml), 'resources/fluid-181103-html/index.html'),
  gate('real-exam-surface-round315-and-count-locks', (/当前版本：Round315 181103 全资料独立 HTML 正文页/.test(realExamsHtml)
      || /当前版本：Round316 181103 全资料 HTML 正文阅读修复/.test(realExamsHtml))
    && (/data-round315-direct-html-all-html/.test(realExamsHtml) || /data-round316-reader-polish/.test(realExamsHtml))
    && /325\/325 原文小题/.test(realExamsHtml)
    && /68\/68 组题已拆/.test(realExamsHtml)
    && /217 grouped 小题不合并/.test(realExamsHtml)
    && /答案 PDF 逐字证据：0/.test(realExamsHtml)
    && !/当前版本：round264|当前版本：Round264|当前版本：round314-answer-source-layering/.test(realExamsHtml), 'modules/real-exams-dynamic.html'),
  gate('search-builder-and-index-current-version', [version, successorVersion].some((candidate) => searchBuilder.includes(`currentEntryVersion: '${candidate}'`))
    && [version, successorVersion].includes(searchIndex.currentEntryVersion), {
      builder: 'tools/build-fluid-home-search-index.mjs',
      indexVersion: searchIndex.currentEntryVersion
    }),
  gate('private-video-production-boundary-preserved', /FM_PRIVATE_MEDIA/.test(JSON.stringify(roadmap.rounds?.find((round) => round.round === 315) || {}))
    && /真实教师\/学生账号 QA/.test(JSON.stringify(roadmap.rounds?.find((round) => round.round === 315) || {})), 'Round315 keeps private-video production blocker wording')
];

const failed = checks.filter((check) => !check.pass);
const payload = {
  version,
  generatedAt: new Date().toISOString(),
  sourceLedgers: {
    inheritedAllHtmlContract: 'data/fluid-round313-181103-all-html-contract.json',
    inheritedAnswerLayering: 'data/fluid-round314-answer-source-layering.json'
  },
  summary,
  officialRows,
  checks,
  acceptance: {
    pass: failed.length === 0,
    failedCheckIds: failed.map((check) => check.id),
    meaning: 'Round315 proves the 181103 source folder is surfaced as independent in-site HTML content pages, with no preview wrapper, iframe/embed/object, raw-file href, local path, stale round313 return link, or legacy conversion badge on the 38 official material entry pages.'
  }
};

if (args.has('--write')) {
  fs.mkdirSync(fromRoot('data'), { recursive: true });
  fs.mkdirSync(fromRoot('docs/round315'), { recursive: true });
  const json = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(fromRoot(ledgerRel), json);
  fs.writeFileSync(fromRoot(`${ledgerRel}.gz`), zlib.gzipSync(json));
  fs.writeFileSync(fromRoot(docRel), renderMarkdown(payload));
}

if (args.has('--json')) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
else {
  console.log(`${payload.acceptance.pass ? 'PASS' : 'FAIL'} ${version}: ${summary.officialPassCount}/38 official HTML pages, full-tree binary hrefs ${summary.fullTreeBinaryHrefCount}, embeds ${summary.fullTreeIframeEmbedObjectCount}`);
  failed.forEach((check) => console.log(`- ${check.id}`));
}

process.exitCode = payload.acceptance.pass ? 0 : 1;

function renderMarkdown(data) {
  const checkRows = data.checks.map((check) => `| ${check.id} | ${check.pass ? 'PASS' : 'FAIL'} |`).join('\n');
  return `# Round315 181103 Direct HTML No-Viewer Contract

- version: ${data.version}
- official material pages: ${data.summary.officialPassCount}/38
- full HTML files scanned: ${data.summary.fullHtmlFileCount}
- raw binary hrefs: ${data.summary.fullTreeBinaryHrefCount}
- iframe/embed/object tags: ${data.summary.fullTreeIframeEmbedObjectCount}
- official-page preview-wrapper tokens: ${data.summary.officialViewerTokenCount}
- official-page old round313 links: ${data.summary.officialOldRound313LinkCount}
- official-page legacy conversion badges: ${data.summary.officialLegacyConversionBadgeCount}
- real-exam count lock: ${data.summary.realExamAtoms}/325 atoms, ${data.summary.groupedSections}/68 grouped sections, ${data.summary.groupedSubquestions}/217 grouped subquestions

## Contract

The 181103 source folder is not published as a viewer or download area. The 38 official material entries are independent in-site HTML content pages, each with reader navigation, a learning bridge, the resources return path, and a current Round315 real-exam return link.

ZIP-derived subpages remain HTML-only assets: the full tree is scanned for raw PDF/PPT/DOC/ZIP hrefs, local paths, iframe, embed, and object tags.

## Checks

| check | status |
| --- | --- |
${checkRows}

## Gate

\`\`\`bash
node tools/check-round315-181103-all-html-direct-pages.mjs --write --json
\`\`\`
`;
}
