#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const args = new Set(process.argv.slice(2));
const version = 'round314-answer-source-layering-20260614';
const currentVersion = 'round315-181103-all-html-direct-pages-20260614';
const ledgerRel = 'data/fluid-round314-answer-source-layering.json';
const docRel = 'docs/round314/answer-source-layering.md';

function fromRoot(relPath) {
  return path.join(repoRoot, relPath);
}

function readText(relPath) {
  return fs.readFileSync(fromRoot(relPath), 'utf8');
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function countFiles(dirRel, name = 'index.html') {
  const root = fromRoot(dirRel);
  let count = 0;
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(abs);
      else if (entry.isFile() && entry.name === name) count += 1;
    }
  }
  return count;
}

function gate(id, pass, detail) {
  return { id, pass: Boolean(pass), detail };
}

const evidenceMatrix = readJson('data/fluid-evidence-matrix-audit.json');
const answerBoundary = readJson('data/fluid-real-exam-answer-evidence-boundary.json');
const textbookLedger = readJson('data/fluid-round291-two-textbook-pdf-coverage-ledger.json');
const allHtmlLedger = readJson('data/fluid-round313-181103-all-html-contract.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const siteUpdates = readJson('site-updates.json');
const realExamsHtml = readText('modules/real-exams-dynamic.html');
const resourcesIndexHtml = readText('resources/fluid-181103-html/index.html');

const summary = {
  alignedQuestionCount: answerBoundary.summary?.alignedQuestionCount || evidenceMatrix.summary?.alignedQuestionCount,
  originalQuestionPdfProvableCount: answerBoundary.summary?.originalQuestionPdfProvableCount,
  answerPdfProvableCount: answerBoundary.summary?.answerPdfProvableCount,
  strictAnswerEvidenceOnAligned: evidenceMatrix.summary?.withStrictAnswerEvidenceOnAligned,
  derivedOrUnprovenAnswerCount: answerBoundary.summary?.textbookOrNotesDerivedCount,
  pendingReviewReferenceAnswerCount: answerBoundary.summary?.pendingReviewReferenceAnswerCount,
  improperOriginalAnswerClaimCount: answerBoundary.summary?.improperOriginalAnswerClaimCount,
  wuBookLinksOnAligned: evidenceMatrix.summary?.withWuBookLinksOnAligned,
  wangBookLinksOnAligned: evidenceMatrix.summary?.withWangBookLinksOnAligned,
  bothBookLinksOnAligned: evidenceMatrix.summary?.withBothBookLinksOnAligned,
  strongTwoBookSupportOnAligned: evidenceMatrix.summary?.withBothBookLinksStrongOnAligned,
  textbookExpectedPdfPages: textbookLedger.summary?.expectedPdfPages,
  textbookOcrPagesPresent: textbookLedger.summary?.ocrPagesPresent,
  textbookSections: textbookLedger.summary?.totalSections,
  realExamAtoms: textbookLedger.summary?.sourceAtomicExpectedCount,
  groupedSections: textbookLedger.summary?.groupedSectionCount,
  groupedSubquestions: textbookLedger.summary?.webQuestionIdCount,
  collapseLossIfMerged: 149,
  allHtmlMaterialCount: allHtmlLedger.summary?.materialCount,
  allHtmlContractPassCount: allHtmlLedger.summary?.contractPassCount,
  allHtmlBinaryHrefCount: allHtmlLedger.summary?.binaryHrefCount,
  allHtmlWrapperTokenCount: allHtmlLedger.summary?.forbiddenWrapperTokenCount,
  allHtmlLocalPathLeakCount: allHtmlLedger.summary?.localPathLeakCount,
  allHtmlMobileTouchTargetCssCount: allHtmlLedger.summary?.mobileTouchTargetCssCount,
  materialPageCount: countFiles('resources/fluid-181103-html/materials')
};

const checks = [
  gate('current-release-version-round314', siteUpdates[0]?.version === currentVersion && roadmap.version === currentVersion && roadmap.releaseGate?.currentVersion === currentVersion, {
    siteUpdates: siteUpdates[0]?.version,
    roadmap: roadmap.version,
    releaseGate: roadmap.releaseGate?.currentVersion
  }),
  gate('roadmap-round314-active', roadmap.currentRound === 315 && (roadmap.rounds || []).find((round) => round.round === 314)?.status === 'done' && (roadmap.rounds || []).find((round) => round.round === 315)?.status === 'active', {
    currentRound: roadmap.currentRound
  }),
  gate('question-source-counts-not-merged', summary.realExamAtoms === 325 && summary.groupedSections === 68 && summary.groupedSubquestions === 217 && summary.collapseLossIfMerged === 149, {
    atoms: summary.realExamAtoms,
    groupedSections: summary.groupedSections,
    groupedSubquestions: summary.groupedSubquestions
  }),
  gate('strict-original-answer-pdf-proof-zero', summary.answerPdfProvableCount === 0 && summary.strictAnswerEvidenceOnAligned === 0 && summary.improperOriginalAnswerClaimCount === 0, {
    answerPdfProvableCount: summary.answerPdfProvableCount,
    strictAnswerEvidenceOnAligned: summary.strictAnswerEvidenceOnAligned,
    improperOriginalAnswerClaimCount: summary.improperOriginalAnswerClaimCount
  }),
  gate('derived-reference-answer-layer-visible', summary.derivedOrUnprovenAnswerCount === 325 && summary.pendingReviewReferenceAnswerCount === 325, {
    derivedOrUnprovenAnswerCount: summary.derivedOrUnprovenAnswerCount,
    pendingReviewReferenceAnswerCount: summary.pendingReviewReferenceAnswerCount
  }),
  gate('two-textbook-support-layer-visible', summary.wuBookLinksOnAligned === 325 && summary.wangBookLinksOnAligned >= 287 && summary.strongTwoBookSupportOnAligned >= 276 && summary.textbookOcrPagesPresent === 916 && summary.textbookSections === 232, {
    wu: summary.wuBookLinksOnAligned,
    wang: summary.wangBookLinksOnAligned,
    strongBoth: summary.strongTwoBookSupportOnAligned,
    ocrPages: summary.textbookOcrPagesPresent,
    sections: summary.textbookSections
  }),
  gate('181103-all-html-still-direct-content', summary.allHtmlMaterialCount === 38 && summary.allHtmlContractPassCount === 38 && summary.materialPageCount === 38 && summary.allHtmlMobileTouchTargetCssCount === 38 && summary.allHtmlBinaryHrefCount === 0 && summary.allHtmlWrapperTokenCount === 0 && summary.allHtmlLocalPathLeakCount === 0, {
    allHtmlMaterialCount: summary.allHtmlMaterialCount,
    materialPageCount: summary.materialPageCount,
    mobileTouchTargetCssCount: summary.allHtmlMobileTouchTargetCssCount,
    binaryHrefCount: summary.allHtmlBinaryHrefCount,
    wrapperTokenCount: summary.allHtmlWrapperTokenCount,
    localPathLeakCount: summary.allHtmlLocalPathLeakCount
  }),
  gate('real-exam-page-round314-source-layer-panel', /Round314 答案来源分层/.test(realExamsHtml)
    && /答案 PDF 逐字证据：0/.test(realExamsHtml)
    && /325\/68\/217/.test(realExamsHtml)
    && /181103 全资料 HTML 正文/.test(realExamsHtml)
    && /fluid-round314-answer-source-layering\.json/.test(realExamsHtml), 'modules/real-exams-dynamic.html'),
  gate('181103-index-round314-source-layer-panel', /Round314 答案来源分层/.test(resourcesIndexHtml)
    && /38\/38 站内 HTML 正文/.test(resourcesIndexHtml)
    && /答案 PDF 逐字证据仍为 0/.test(resourcesIndexHtml)
    && !/\bviewer\b|<iframe\b|<embed\b|<object\b|converted-frame/i.test(resourcesIndexHtml), 'resources/fluid-181103-html/index.html')
];

const failed = checks.filter((check) => !check.pass);
const payload = {
  version,
  generatedAt: new Date().toISOString(),
  sourceLedgers: {
    evidenceMatrix: 'data/fluid-evidence-matrix-audit.json',
    answerBoundary: 'data/fluid-real-exam-answer-evidence-boundary.json',
    twoTextbookCoverage: 'data/fluid-round291-two-textbook-pdf-coverage-ledger.json',
    allHtmlContract: 'data/fluid-round313-181103-all-html-contract.json'
  },
  summary,
  layers: [
    { id: 'question-pdf', label: '题面原 PDF', count: summary.originalQuestionPdfProvableCount, rule: '只证明题干/题面来源，不证明答案逐字来源。' },
    { id: 'reference-answer', label: '参考解析/推导答案', count: summary.pendingReviewReferenceAnswerCount, rule: '用于学习和订正，必须保持 derived/unproven 标记。' },
    { id: 'strict-answer-pdf', label: '原答案 PDF 逐字证据', count: summary.answerPdfProvableCount, rule: '当前为 0；没有逐字证据时不得写成原卷答案。' },
    { id: 'two-textbooks', label: '两本教材支撑', count: summary.strongTwoBookSupportOnAligned, rule: '用于公式、章节和推导支撑，不替代原答案 PDF。' },
    { id: 'supplemental-181103-html', label: '181103 全 HTML 正文资料', count: summary.allHtmlContractPassCount, rule: '只发布站内 HTML 正文，0 viewer、0 原件下载、0 本机路径。' }
  ],
  checks,
  acceptance: {
    pass: failed.length === 0,
    failedCheckIds: failed.map((check) => check.id),
    meaning: 'Round314 keeps real-exam question counts, answer provenance layers, two-textbook support, and 181103 direct HTML content as separate visible evidence layers.'
  }
};

if (args.has('--write')) {
  fs.mkdirSync(fromRoot('data'), { recursive: true });
  fs.mkdirSync(fromRoot('docs/round314'), { recursive: true });
  const json = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(fromRoot(ledgerRel), json);
  fs.writeFileSync(fromRoot(`${ledgerRel}.gz`), zlib.gzipSync(json));
  fs.writeFileSync(fromRoot(docRel), renderMarkdown(payload));
}

if (args.has('--json')) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
else {
  console.log(`${payload.acceptance.pass ? 'PASS' : 'FAIL'} ${version}: answers strict PDF ${summary.answerPdfProvableCount}, derived ${summary.derivedOrUnprovenAnswerCount}, 181103 HTML ${summary.allHtmlContractPassCount}/38`);
  failed.forEach((check) => console.log(`- ${check.id}`));
}

process.exitCode = payload.acceptance.pass ? 0 : 1;

function renderMarkdown(data) {
  const layerRows = data.layers.map((layer) => `| ${layer.id} | ${layer.label} | ${layer.count} | ${layer.rule} |`).join('\n');
  const checkRows = data.checks.map((check) => `| ${check.id} | ${check.pass ? 'PASS' : 'FAIL'} |`).join('\n');
  return `# Round314 Answer Source Layering

- version: ${data.version}
- real exam counts: ${data.summary.realExamAtoms}/325 atoms, ${data.summary.groupedSections}/68 grouped sections, ${data.summary.groupedSubquestions}/217 grouped subquestions
- strict original-answer PDF proof: ${data.summary.answerPdfProvableCount}
- derived/reference answer layer: ${data.summary.derivedOrUnprovenAnswerCount}
- strong two-textbook support: ${data.summary.strongTwoBookSupportOnAligned}
- 181103 direct HTML pages: ${data.summary.allHtmlContractPassCount}/38
- raw downloads / wrappers / local paths: ${data.summary.allHtmlBinaryHrefCount} / ${data.summary.allHtmlWrapperTokenCount} / ${data.summary.allHtmlLocalPathLeakCount}

## Layers

| id | label | count | rule |
| --- | --- | ---: | --- |
${layerRows}

## Checks

| check | status |
| --- | --- |
${checkRows}

## Gate

\`\`\`bash
node tools/check-round314-answer-source-layering.mjs --write --json
\`\`\`
`;
}
