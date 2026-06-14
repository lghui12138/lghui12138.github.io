#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const args = new Set(process.argv.slice(2));
const version = 'round318-181103-practice-bridge-20260614';
const outputRel = 'data/fluid-round318-181103-practice-bridge.json';
const docRel = 'docs/round318/181103-practice-bridge.md';
const materialsRootRel = 'resources/fluid-181103-html/materials';
const realExamRel = 'modules/real-exams-dynamic.html';
const indexRel = 'resources/fluid-181103-html/index.html';

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
  fs.mkdirSync(path.dirname(fromRoot(relPath)), { recursive: true });
  fs.writeFileSync(fromRoot(relPath), text);
}

function writeJson(relPath, value) {
  const file = fromRoot(relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const text = `${JSON.stringify(value, null, 2)}\n`;
  fs.writeFileSync(file, text);
  fs.writeFileSync(`${file}.gz`, zlib.gzipSync(text, { level: 9 }));
}

function readExistingGeneratedAt(relPath) {
  try {
    return readJson(relPath).generatedAt || null;
  } catch {
    return null;
  }
}

function hrefs(html) {
  return [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
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

function forbiddenHrefRows(relPath, html) {
  return hrefs(html)
    .filter((href) => {
      const normalized = href.toLowerCase();
      return /\.(?:pdf|pptx?|docx?|doc|zip|rar|7z)(?:$|[?#])/i.test(href)
        || /(?:^|\/)(?:viewer|viewers|download|downloads|raw)(?:\/|$|[?#-])/i.test(normalized)
        || /^file:/i.test(href)
        || /\/users\/|\/volumes\//i.test(href);
    })
    .map((href) => ({ relPath, href }));
}

function scanMaterialPage(relPath) {
  const html = readText(relPath);
  const bridgeMatch = /<section\b[^>]*data-round315-study-bridge[\s\S]*?<\/section>/i.exec(html);
  const bridgeHtml = bridgeMatch?.[0] || '';
  const bridgeLinks = hrefs(bridgeHtml);
  const realExamLinks = bridgeLinks.filter((href) => /\/modules\/real-exams-dynamic\.html/i.test(href));
  const resourceReturnLinks = bridgeLinks.filter((href) => /\/resources\.html#supplemental-181103/i.test(href));
  const materialId = /materials\/\d+-([^/]+)\/index\.html/.exec(relPath)?.[1] || relPath;
  return {
    relPath,
    materialId,
    hasStudyBridge: Boolean(bridgeMatch),
    realExamBridgeCount: realExamLinks.length,
    resourceReturnCount: resourceReturnLinks.length,
    bridgeText: stripTags(bridgeHtml),
    forbiddenHrefs: forbiddenHrefRows(relPath, html)
  };
}

function allMaterialIdsFromRoutes(studyRoutes) {
  const ids = new Set();
  for (const familyRows of Object.values(studyRoutes.routes || {})) {
    for (const row of familyRows || []) {
      for (const step of row.reviewRoute || []) {
        for (const id of step.materialIds || []) ids.add(id);
      }
    }
  }
  return ids;
}

const studyRoutes = readJson('data/fluid-181103-study-routes.json');
const round306 = readJson('data/fluid-round306-181103-study-atlas.json');
const round307 = readJson('data/fluid-round307-181103-deep-route-atlas.json');
const round317 = readJson('data/fluid-round317-181103-live-html-depth.json');
const indexHtml = readText(indexRel);
const realExamHtml = readText(realExamRel);
const materialPages = officialMaterialPages();
const pageRows = materialPages.map(scanMaterialPage);
const indexForbiddenHrefs = forbiddenHrefRows(indexRel, indexHtml);
const pageForbiddenHrefs = pageRows.flatMap((row) => row.forbiddenHrefs);
const routeMaterialIds = allMaterialIdsFromRoutes(studyRoutes);
const routeFamilies = studyRoutes.routes || {};
const familyCounts = Object.fromEntries(Object.entries(routeFamilies).map(([key, rows]) => [key, rows.length]));
const chapterNumbers = [...new Set((routeFamilies.byChapter || []).map((row) => Number(row.chapter)).filter(Number.isFinite))].sort((a, b) => a - b);
const practiceHrefEvidence = chapterNumbers.map((chapter) => ({
  chapter,
  href: `/modules/practice-dynamic.html?type=real&chapter=${chapter}&mode=normal`,
  hasBuilderEvidence: /practice-dynamic\.html\?type=real&chapter=\$\{encodeURIComponent\(chapterNumber\)\}&mode=normal/.test(realExamHtml),
  hasRenderedTemplateEvidence: realExamHtml.includes('/modules/practice-dynamic.html?type=real&chapter=${encodeURIComponent(chapter.chapter)}&mode=normal')
}));

const summary = {
  version,
  materialPageCount: materialPages.length,
  materialPagesWithStudyBridge: pageRows.filter((row) => row.hasStudyBridge).length,
  materialPagesWithRealExamBridge: pageRows.filter((row) => row.realExamBridgeCount > 0).length,
  materialPagesWithResourceReturn: pageRows.filter((row) => row.resourceReturnCount > 0).length,
  indexMaterialCards: (indexHtml.match(/<article\b[^>]*data-round315-material-card/g) || []).length,
  sourceMaterialCount: (studyRoutes.materials || []).length,
  routeFamilyCounts: familyCounts,
  routeFamilyTotal: Object.values(familyCounts).reduce((sum, count) => sum + count, 0),
  reviewRouteMaterialCoverage: routeMaterialIds.size,
  round306StudyRouteCount: round306.summary?.studyRouteCount,
  round306QuestionReviewTaskCount: round306.summary?.questionReviewTaskCount,
  round307ReviewTaskCount: round307.summary?.reviewTaskCount,
  round307SourceMaterialsWithoutReviewTasks: round307.summary?.sourceMaterialsWithoutReviewTasks,
  round317PassCount: round317.summary?.passCount,
  chapterPracticeHrefCount: practiceHrefEvidence.filter((row) => row.hasBuilderEvidence || row.hasRenderedTemplateEvidence).length,
  forbiddenHrefCount: indexForbiddenHrefs.length + pageForbiddenHrefs.length
};

const checks = [
  {
    id: 'official-materials-38-with-study-bridge',
    pass: summary.materialPageCount === 38
      && summary.materialPagesWithStudyBridge === 38
      && summary.materialPagesWithRealExamBridge === 38
      && summary.materialPagesWithResourceReturn === 38,
    detail: pageRows.filter((row) => !row.hasStudyBridge || row.realExamBridgeCount === 0 || row.resourceReturnCount === 0).map((row) => row.relPath)
  },
  {
    id: 'route-families-cover-30-routes-and-38-materials',
    pass: summary.routeFamilyTotal === 30
      && summary.sourceMaterialCount === 38
      && summary.reviewRouteMaterialCoverage === 37
      && summary.round306StudyRouteCount === 30
      && summary.round306QuestionReviewTaskCount === 68
      && summary.round307ReviewTaskCount === 68
      && summary.round307SourceMaterialsWithoutReviewTasks === 1,
    detail: {
      routeFamilyCounts: summary.routeFamilyCounts,
      sourceMaterialCount: summary.sourceMaterialCount,
      reviewRouteMaterialCoverage: summary.reviewRouteMaterialCoverage,
      round306StudyRouteCount: summary.round306StudyRouteCount,
      round306QuestionReviewTaskCount: summary.round306QuestionReviewTaskCount,
      round307ReviewTaskCount: summary.round307ReviewTaskCount,
      round307SourceMaterialsWithoutReviewTasks: summary.round307SourceMaterialsWithoutReviewTasks
    }
  },
  {
    id: 'real-exam-page-owns-practice-handoff',
    pass: chapterNumbers.length === 6 && summary.chapterPracticeHrefCount === 6,
    detail: practiceHrefEvidence
  },
  {
    id: 'index-cards-enter-html-not-raw-files',
    pass: summary.indexMaterialCards === 38 && indexForbiddenHrefs.length === 0,
    detail: { indexMaterialCards: summary.indexMaterialCards, forbiddenHrefs: indexForbiddenHrefs }
  },
  {
    id: 'no-viewer-wrapper-download-raw-hrefs',
    pass: summary.forbiddenHrefCount === 0 && summary.round317PassCount === 38,
    detail: {
      forbiddenHrefCount: summary.forbiddenHrefCount,
      sample: [...indexForbiddenHrefs, ...pageForbiddenHrefs].slice(0, 20),
      round317PassCount: summary.round317PassCount
    }
  }
];

const failed = checks.filter((check) => !check.pass);
const payload = {
  version,
  generatedAt: readExistingGeneratedAt(outputRel) || process.env.FLUID_ROUND318_181103_BRIDGE_GENERATED_AT || new Date().toISOString(),
  scope: {
    inspected: [
      indexRel,
      `${materialsRootRel}/*/index.html`,
      realExamRel,
      'data/fluid-181103-study-routes.json',
      'data/fluid-round306-181103-study-atlas.json',
      'data/fluid-round307-181103-deep-route-atlas.json',
      'data/fluid-round317-181103-live-html-depth.json'
    ],
    writes: args.has('--write') ? [outputRel, `${outputRel}.gz`, docRel] : []
  },
  summary,
  checks,
  acceptance: {
    pass: failed.length === 0,
    failedCheckIds: failed.map((check) => check.id),
    meaning: '181103 material pages bridge readers into the real-exam surface, and the real-exam surface owns the chapter practice handoff; the route chain stays inside HTML/site routes without viewer, wrapper, download, raw-file, local-path, or binary href escapes.'
  }
};

if (args.has('--write')) {
  writeJson(outputRel, payload);
  writeText(docRel, renderMarkdown(payload));
}
if (args.has('--json')) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
else {
  console.log(`${payload.acceptance.pass ? 'PASS' : 'FAIL'} ${version}: material bridges ${summary.materialPagesWithRealExamBridge}/38, route families ${summary.routeFamilyTotal}/30, practice chapters ${summary.chapterPracticeHrefCount}/6, forbidden hrefs ${summary.forbiddenHrefCount}`);
  failed.forEach((check) => console.log(`- ${check.id}`));
}

process.exitCode = payload.acceptance.pass ? 0 : 1;

function renderMarkdown(data) {
  const checkRows = data.checks.map((check) => `| ${check.id} | ${check.pass ? 'PASS' : 'FAIL'} |`).join('\n');
  return `# Round318 181103 Route-To-Practice Bridge

- version: ${data.version}
- material HTML pages with study bridge: ${data.summary.materialPagesWithStudyBridge}/38
- material HTML pages with real-exam bridge: ${data.summary.materialPagesWithRealExamBridge}/38
- 181103 route families: ${data.summary.routeFamilyTotal}/30
- source material coverage: ${data.summary.sourceMaterialCount}/38
- review-route material coverage: ${data.summary.reviewRouteMaterialCoverage}/37 with ${data.summary.round307SourceMaterialsWithoutReviewTasks} no-task supplemental material
- question review tasks inherited: ${data.summary.round306QuestionReviewTaskCount}/68
- chapter practice handoff chapters: ${data.summary.chapterPracticeHrefCount}/6
- viewer/wrapper/download/raw hrefs: ${data.summary.forbiddenHrefCount}

## Bridge Reading

The current bridge is a two-hop in-site path: each 181103 material page sends the learner from direct HTML body content to \`/modules/real-exams-dynamic.html\`, and the real-exam page owns the chapter-level practice entry to \`/modules/practice-dynamic.html?type=real&chapter=...\`.

This keeps the 181103 source material side as reading/reference HTML, while practice remains attached to the formal real-exam surface and its 325/68 count locks.

## Checks

| check | status |
| --- | --- |
${checkRows}

## Integration Needs

- If a future worker adds one-click practice from material pages, generate it from chapter metadata and keep \`real-exams-dynamic.html\` as the count-lock owner.
- Keep the hard no-escape rule in release gates: no viewer, wrapper, download, raw-file, binary-file, local-path, or \`file://\` hrefs from the 181103 HTML route.
- Promote this checker into the release-gate list only after the public surface is intentionally advanced to Round318.
`;
}
