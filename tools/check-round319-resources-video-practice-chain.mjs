#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const args = new Set(process.argv.slice(2));
const version = 'round319-resources-video-practice-chain-20260614';
const outputRel = 'data/fluid-round319-resources-video-practice-chain.json';
const docRel = 'docs/round319/resources-video-practice-chain.md';
const resourcesRel = 'resources.html';
const htmlIndexRel = 'resources/fluid-181103-html/index.html';
const materialsRootRel = 'resources/fluid-181103-html/materials';

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
  fs.writeFileSync(fromRoot(relPath), text.endsWith('\n') ? text : `${text}\n`);
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
  return [...String(html || '').matchAll(/\bhref=["']([^"']+)["']/gi)].map((match) => match[1]);
}

function officialMaterialPages() {
  return fs.readdirSync(fromRoot(materialsRootRel), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${materialsRootRel}/${entry.name}/index.html`)
    .filter((relPath) => fs.existsSync(fromRoot(relPath)))
    .sort();
}

function scanForbiddenHrefs(relPath, html) {
  return hrefs(html)
    .filter((href) => {
      const normalized = String(href || '').toLowerCase();
      return /\.(?:pdf|pptx?|docx?|doc|zip|rar|7z)(?:$|[?#])/i.test(href)
        || /(?:^|\/)(?:viewer|viewers|download|downloads|raw)(?:\/|$|[?#-])/i.test(normalized)
        || /^file:/i.test(href)
        || /\/users\/|\/volumes\//i.test(href);
    })
    .map((href) => ({ relPath, href }));
}

function sectionHtml(text, dataAttr) {
  const pattern = new RegExp(`<[^>]+${dataAttr}[^>]*>[\\s\\S]*?<\\/div>`, 'i');
  return pattern.exec(text)?.[0] || '';
}

function renderMarkdown(payload) {
  const checks = payload.checks.map((check) => `| ${check.id} | ${check.pass ? 'PASS' : 'FAIL'} | ${JSON.stringify(check.detail)} |`).join('\n');
  return `# Round319 资源/视频到练习链路

版本：\`${payload.version}\`

Round319 把资源页收成一个学生可执行链路：181103 资料必须是站内 HTML 内容页，资源/视频看完后回真实真题与章节练习，私有视频只报告管理边界，不冒充生产恢复。

## 摘要

- 181103 HTML 资料页：${payload.summary.materialPageCount}
- 站内 HTML 深度通过：${payload.summary.liveHtmlPassCount}
- Round319 资源页章节练习入口：${payload.summary.round319PracticeLinkCount}
- Round319 真题入口：${payload.summary.round319RealExamLinkCount}
- 真题题数基线：${payload.summary.sourceAtomicQuestionCount}/${payload.summary.groupedSectionCount}/${payload.summary.groupedWebQuestionIdCount}
- 章节练习覆盖：${payload.summary.chapterShortcutCount} 个章节，${payload.summary.shortcutPrimaryQuestionCount} 道原题
- 禁止 href：${payload.summary.forbiddenHrefCount}
- 私有视频生产恢复允许：${payload.summary.productionRecoveryAllowed}

## 机器检查

| 检查 | 状态 | 细节 |
|---|---|---|
${checks}

## 边界

- 这是站内 HTML 阅读与学习链路证明，不是原件下载证明。
- 181103 公开面不得出现 viewer、iframe/embed/object、原始二进制 href、本机路径、download/raw 路由。
- 真实私有视频生产恢复仍要同时具备 FM_PRIVATE_MEDIA R2 binding 和真实教师/学生账号 QA。
`;
}

const resourcesHtml = readText(resourcesRel);
const htmlIndex = readText(htmlIndexRel);
const materialPages = officialMaterialPages();
const materialHtml = materialPages.map((relPath) => ({ relPath, html: readText(relPath) }));
const round317HtmlDepth = readJson('data/fluid-round317-181103-live-html-depth.json');
const round318Shortcuts = readJson('data/fluid-round318-chapter-practice-shortcuts.json');
const round318ChapterPractice = readJson('data/fluid-round318-real-exam-chapter-practice.json');
const round318Bridge = readJson('data/fluid-round318-181103-practice-bridge.json');
const r2HardStop = readJson('data/fluid-round305-r2-binding-hard-stop.json');
const privateBlockers = readJson('data/fluid-round304-private-video-production-blockers.json');
const round319Section = sectionHtml(resourcesHtml, 'data-round319-resources-video-practice-chain');
const resourceRouteSection = sectionHtml(resourcesHtml, 'data-round319-resource-route');
const round319Hrefs = hrefs(`${round319Section}\n${resourceRouteSection}\n${resourcesHtml}`);
const round319PracticeHrefs = round319Hrefs.filter((href) => /\/modules\/practice-dynamic\.html\?type=real&chapter=\d+&mode=normal(?:&|$)/.test(href));
const round319RealExamHrefs = round319Hrefs.filter((href) => /\/modules\/real-exams-dynamic\.html\?(?:[^"']*&)?chapter=\d+(?:&|$)/.test(href)
  || /\/modules\/real-exams-dynamic\.html\?from=round319/.test(href));
const forbiddenHrefs = [
  ...scanForbiddenHrefs(resourcesRel, resourcesHtml),
  ...scanForbiddenHrefs(htmlIndexRel, htmlIndex),
  ...materialHtml.flatMap((row) => scanForbiddenHrefs(row.relPath, row.html))
];
const forbiddenTokens = [
  ...materialHtml.flatMap(({ relPath, html }) => (/<\s*(?:iframe|embed|object)\b|converted-frame|data-round\d+-viewer/i.test(html) ? [relPath] : []))
];
const round319ChapterLiterals = [...resourcesHtml.matchAll(/\{\s*chapter\s*:\s*(\d+)\s*,\s*label\s*:/g)]
  .map((match) => match[1]);
const hasRuntimePracticeTemplate = /practice-dynamic\.html\?type=real&chapter='\+item\.chapter\+'&mode=normal/.test(resourcesHtml);
const hasRuntimeRealExamTemplate = /real-exams-dynamic\.html\?chapter='\+item\.chapter\+'&from=round319-resources-video-practice-chain/.test(resourcesHtml);
const uniquePracticeChapters = new Set(round319PracticeHrefs.map((href) => /chapter=(\d+)/.exec(href)?.[1]).filter(Boolean));
const uniqueRealExamChapters = new Set(round319RealExamHrefs.map((href) => /chapter=(\d+)/.exec(href)?.[1]).filter(Boolean));

const summary = {
  materialPageCount: materialPages.length,
  indexMaterialCards: (htmlIndex.match(/<article\b[^>]*data-round315-material-card/g) || []).length,
  liveHtmlPassCount: round317HtmlDepth.summary?.passCount || 0,
  liveHtmlContentMapCount: round317HtmlDepth.summary?.contentMapCount || 0,
  liveHtmlContentStartIdCount: round317HtmlDepth.summary?.contentStartIdCount || 0,
  sourceAtomicQuestionCount: round318Shortcuts.summary?.sourceAtomicQuestionCount || 0,
  groupedSectionCount: round318Shortcuts.summary?.groupedSectionCount || 0,
  groupedWebQuestionIdCount: round318Shortcuts.summary?.groupedWebQuestionIdCount || 0,
  chapterShortcutCount: round318Shortcuts.summary?.chapterShortcutCount || 0,
  shortcutPrimaryQuestionCount: round318Shortcuts.summary?.shortcutPrimaryQuestionCount || 0,
  chapterPracticeQuestionCount: round318ChapterPractice.summary?.chapterPracticeQuestionCount || 0,
  bridgeMaterialPagesWithRealExamBridge: round318Bridge.summary?.materialPagesWithRealExamBridge || 0,
  bridgeRouteFamilyTotal: round318Bridge.summary?.routeFamilyTotal || 0,
  round319PracticeLinkCount: round319PracticeHrefs.length,
  round319PracticeChapterCount: Math.max(uniquePracticeChapters.size, hasRuntimePracticeTemplate ? new Set(round319ChapterLiterals).size : 0),
  round319RealExamLinkCount: round319RealExamHrefs.length,
  round319RealExamChapterCount: Math.max(uniqueRealExamChapters.size, hasRuntimeRealExamTemplate ? new Set(round319ChapterLiterals).size : 0),
  round319RuntimeChapterCount: new Set(round319ChapterLiterals).size,
  round319HasRuntimePracticeTemplate: hasRuntimePracticeTemplate,
  round319HasRuntimeRealExamTemplate: hasRuntimeRealExamTemplate,
  forbiddenHrefCount: forbiddenHrefs.length,
  forbiddenWrapperTokenCount: forbiddenTokens.length,
  productionRecoveryAllowed: r2HardStop.hardStop?.productionPrivateVideoRecovery === true
    && privateBlockers.productionRecoveryEligible === true
};

const checks = [
  {
    id: '181103-all-materials-are-in-site-html',
    pass: summary.materialPageCount === 38
      && summary.indexMaterialCards === 38
      && summary.liveHtmlPassCount === 38
      && summary.liveHtmlContentMapCount === 38
      && summary.liveHtmlContentStartIdCount === 38,
    detail: {
      materialPageCount: summary.materialPageCount,
      indexMaterialCards: summary.indexMaterialCards,
      liveHtmlPassCount: summary.liveHtmlPassCount,
      liveHtmlContentMapCount: summary.liveHtmlContentMapCount,
      liveHtmlContentStartIdCount: summary.liveHtmlContentStartIdCount
    }
  },
  {
    id: 'round319-visible-practice-chain',
    pass: /data-round319-resources-video-practice-chain/.test(resourcesHtml)
      && (summary.round319PracticeLinkCount >= 6 || summary.round319HasRuntimePracticeTemplate)
      && summary.round319PracticeChapterCount === 6
      && (summary.round319RealExamLinkCount >= 6 || summary.round319HasRuntimeRealExamTemplate)
      && summary.round319RealExamChapterCount === 6,
    detail: {
      practiceHrefs: round319PracticeHrefs,
      realExamHrefs: round319RealExamHrefs,
      runtimeChapterCount: summary.round319RuntimeChapterCount,
      hasRuntimePracticeTemplate: summary.round319HasRuntimePracticeTemplate,
      hasRuntimeRealExamTemplate: summary.round319HasRuntimeRealExamTemplate
    }
  },
  {
    id: 'real-exam-no-merge-counts-preserved',
    pass: summary.sourceAtomicQuestionCount === 325
      && summary.groupedSectionCount === 68
      && summary.groupedWebQuestionIdCount === 217
      && summary.chapterShortcutCount === 6
      && summary.shortcutPrimaryQuestionCount === 325
      && round318Shortcuts.acceptance?.pass === true
      && round318ChapterPractice.acceptance?.pass === true,
    detail: {
      sourceAtomicQuestionCount: summary.sourceAtomicQuestionCount,
      groupedSectionCount: summary.groupedSectionCount,
      groupedWebQuestionIdCount: summary.groupedWebQuestionIdCount,
      chapterShortcutCount: summary.chapterShortcutCount,
      shortcutPrimaryQuestionCount: summary.shortcutPrimaryQuestionCount,
      chapterPracticeQuestionCount: summary.chapterPracticeQuestionCount
    }
  },
  {
    id: '181103-bridge-still-reaches-real-exam',
    pass: summary.bridgeMaterialPagesWithRealExamBridge === 38
      && summary.bridgeRouteFamilyTotal === 30
      && round318Bridge.summary?.chapterPracticeHrefCount === 6
      && round318Bridge.acceptance?.pass === true,
    detail: {
      bridgeMaterialPagesWithRealExamBridge: summary.bridgeMaterialPagesWithRealExamBridge,
      bridgeRouteFamilyTotal: summary.bridgeRouteFamilyTotal,
      bridgeChapterPracticeHrefCount: round318Bridge.summary?.chapterPracticeHrefCount || 0
    }
  },
  {
    id: 'no-viewer-download-raw-binary-hrefs',
    pass: summary.forbiddenHrefCount === 0
      && summary.forbiddenWrapperTokenCount === 0
      && round317HtmlDepth.summary?.viewerDownloadHrefCount === 0
      && round317HtmlDepth.summary?.iframeEmbedObjectCount === 0
      && round317HtmlDepth.summary?.localPathLeakCount === 0,
    detail: {
      forbiddenHrefCount: summary.forbiddenHrefCount,
      forbiddenWrapperTokenCount: summary.forbiddenWrapperTokenCount,
      sample: forbiddenHrefs.slice(0, 20),
      tokenSample: forbiddenTokens.slice(0, 20)
    }
  },
  {
    id: 'private-video-production-recovery-not-overclaimed',
    pass: summary.productionRecoveryAllowed === false
      && r2HardStop.hardStop?.productionPrivateVideoRecovery === false
      && privateBlockers.productionRecoveryEligible === false
      && /视频存储|专属课视频存储|待验收/.test(resourcesHtml)
      && /真实教师\/学生账号验收/.test(resourcesHtml),
    detail: {
      productionRecoveryAllowed: summary.productionRecoveryAllowed,
      r2ProductionRecovery: r2HardStop.hardStop?.productionPrivateVideoRecovery,
      productionRecoveryEligible: privateBlockers.productionRecoveryEligible
    }
  }
];

const failed = checks.filter((check) => !check.pass);
const payload = {
  version,
  generatedAt: readExistingGeneratedAt(outputRel) || process.env.FLUID_ROUND319_RESOURCES_VIDEO_PRACTICE_CHAIN_GENERATED_AT || '2026-06-14T23:20:00.000+08:00',
  scope: {
    inspected: [
      resourcesRel,
      htmlIndexRel,
      `${materialsRootRel}/*/index.html`,
      'data/fluid-round317-181103-live-html-depth.json',
      'data/fluid-round318-chapter-practice-shortcuts.json',
      'data/fluid-round318-real-exam-chapter-practice.json',
      'data/fluid-round318-181103-practice-bridge.json',
      'data/fluid-round305-r2-binding-hard-stop.json',
      'data/fluid-round304-private-video-production-blockers.json'
    ],
    writes: args.has('--write') ? [outputRel, `${outputRel}.gz`, docRel] : []
  },
  summary,
  checks,
  acceptance: {
    pass: failed.length === 0,
    failedCheckIds: failed.map((check) => check.id),
    meaning: 'Round319 proves resource/video study entry points lead back to in-site 181103 HTML, real-exam review, and chapter practice without viewer/download/raw escapes, while private-video production recovery remains blocked without real QA and FM_PRIVATE_MEDIA R2.'
  }
};

if (args.has('--write')) {
  writeJson(outputRel, payload);
  writeText(docRel, renderMarkdown(payload));
}

if (args.has('--json')) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
} else {
  console.log(`${payload.acceptance.pass ? 'PASS' : 'FAIL'} ${version}: html=${summary.materialPageCount}/38 practice=${summary.round319PracticeLinkCount} realExam=${summary.round319RealExamLinkCount} forbidden=${summary.forbiddenHrefCount} productionRecovery=${summary.productionRecoveryAllowed}`);
  failed.forEach((check) => console.log(`- ${check.id}`));
}

process.exitCode = payload.acceptance.pass ? 0 : 1;
