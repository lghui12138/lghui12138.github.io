#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const version = 'round345-181103-bank-depth-20260615';

const rel = {
  questionBank: 'question-banks/181103-material-extracted.json',
  questionBankIndex: 'question-banks/index.json',
  materialsRoot: 'resources/fluid-181103-html/materials'
};

const outputRel = 'data/fluid-round345-181103-bank-depth.json';
const docRel = 'docs/round345-181103-bank-depth.md';
const generatedAt = process.env.FLUID_ROUND345_181103_BANK_DEPTH_GENERATED_AT
  || readExistingGeneratedAt(outputRel)
  || new Date().toISOString();

const expected = {
  questions: 411,
  bankId: '181103-material-extracted',
  materials: 38,
  defaultPracticeQuestions: 119,
  ocrReviewQuestions: 268,
  hiddenReviewQuestions: 24
};

function parseArgs(argv) {
  const args = { write: false, json: false };
  for (const arg of argv) {
    if (arg === '--write') args.write = true;
    else if (arg === '--json') args.json = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function fromRoot(relativePath) {
  return path.join(repoRoot, relativePath);
}

function toPosix(value) {
  return String(value || '').split(path.sep).join('/');
}

function readText(relativePath) {
  return fs.readFileSync(fromRoot(relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function readExistingGeneratedAt(relativePath) {
  try {
    return readJson(relativePath).generatedAt || null;
  } catch {
    return null;
  }
}

function writeText(relativePath, text) {
  const absPath = fromRoot(relativePath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, text);
}

function writeJsonAndGzip(relativePath, value) {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  writeText(relativePath, text);
  fs.writeFileSync(fromRoot(`${relativePath}.gz`), zlib.gzipSync(text, { level: 9 }));
}

function stripVisibleText(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function htmlIds(html) {
  return new Set([...String(html || '').matchAll(/\bid=(["'])([^"']+)\1|\bid=([^\s>]+)/gi)]
    .map((match) => match[2] || match[3])
    .filter(Boolean));
}

function titleFromHtml(html) {
  return stripVisibleText(/<h1[\s\S]*?<\/h1>/i.exec(html)?.[0] || '');
}

function materialPages() {
  return fs.readdirSync(fromRoot(rel.materialsRoot), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${rel.materialsRoot}/${entry.name}/index.html`)
    .filter((relativePath) => fs.existsSync(fromRoot(relativePath)))
    .sort();
}

function materialIdFromPath(relativePath) {
  const match = toPosix(relativePath).match(/fluid-181103-(\d+)/i);
  return match ? `fluid-181103-${match[1].padStart(2, '0')}` : '';
}

function publicHtmlPath(url) {
  return String(url || '').replace(/^\/+/, '').split(/[?#]/)[0];
}

function anchorParts(url) {
  const [href, hash = ''] = String(url || '').split('#');
  return { href, hash, relPath: publicHtmlPath(href) };
}

function isInSiteMaterialAnchor(value) {
  return /^\/resources\/fluid-181103-html\/materials\/[^/]+\/index\.html#[A-Za-z0-9_-]+$/.test(String(value || ''));
}

function materialSlugFromUrl(value) {
  return String(value || '').match(/\/resources\/fluid-181103-html\/materials\/([^/]+)\/index\.html/)?.[1] || '';
}

function charCounts(text) {
  const value = String(text || '');
  return {
    chars: value.length,
    cjk: (value.match(/[\u4e00-\u9fff]/g) || []).length,
    questionCueCount: (value.match(/[?？]|何谓|什么|试|求|证明|说明|计算|画出|写出|判断|比较|讨论|推导|简述|为什么|名词解释|解/g) || []).length
  };
}

function enrichmentReasons(question) {
  const counts = charCounts(question.question);
  const flags = Array.isArray(question.qualityFlags) ? question.qualityFlags : [];
  const reviewReasons = Array.isArray(question.ocrReviewReason) ? question.ocrReviewReason : [];
  const text = [question.question, question.title, question.answer, question.explanation, flags.join(' '), reviewReasons.join(' ')].filter(Boolean).join('\n');
  const reasons = [];
  if (counts.chars < 50) reasons.push('short-question-text');
  if (counts.cjk < 15) reasons.push('low-cjk-density');
  if (counts.questionCueCount === 0) reasons.push('weak-question-cue');
  if (flags.includes('short-fragment')) reasons.push('quality-flag-short-fragment');
  if (flags.includes('low-cjk-density')) reasons.push('quality-flag-low-cjk-density');
  if (flags.includes('weak-question-cue')) reasons.push('quality-flag-weak-question-cue');
  if (flags.includes('round356-default-practice-blocked')) reasons.push('round356-default-practice-blocked');
  if (/EMBED\s+Equation(?:\.[A-Za-z0-9]+)?|DSMT4|embedded-equation-placeholder/i.test(text)) reasons.push('embedded-equation-placeholder');
  if (/high-resolution\s+ja\s+JP|501\s+501\s+\d{4,}|CIDFont|FontName|FontBBox|FontMatrix|font-table-noise/i.test(text)) reasons.push('font-table-noise');
  if (/latin-symbol-noise/i.test(text)) reasons.push('latin-symbol-noise');
  if (['ocr-review', 'hide'].includes(String(question.qualityTier || ''))) reasons.push(`quality-tier-${question.qualityTier}`);
  return [...new Set(reasons)];
}

function questionSample(question, reasons) {
  const counts = charCounts(question.question);
  return {
    id: String(question.id || ''),
    sourceMaterialId: String(question.sourceMaterialId || ''),
    sourceMaterialTitle: String(question.sourceMaterialTitle || ''),
    sourceHtmlUrl: String(question.sourceHtmlUrl || ''),
    sourcePage: question.sourcePage ?? null,
    qualityTier: String(question.qualityTier || ''),
    defaultVisible: question.defaultVisible === true,
    defaultHidden: question.defaultHidden === true,
    reviewStatus: String(question.reviewStatus || ''),
    chars: counts.chars,
    cjk: counts.cjk,
    questionCueCount: counts.questionCueCount,
    reasons,
    questionPreview: String(question.question || '').replace(/\s+/g, ' ').trim().slice(0, 180)
  };
}

function groupCounts(items, keyFn) {
  const counts = new Map();
  for (const item of items) {
    const key = keyFn(item) || 'missing';
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function gate(id, pass, detail = {}) {
  return { id, pass: Boolean(pass), detail };
}

function buildPayload() {
  if (process.cwd().startsWith('/Volumes/mac_2T') || repoRoot.startsWith('/Volumes/mac_2T')) {
    throw new Error('Refusing to run Round345 181103 bank-depth checker from or against /Volumes/mac_2T during lifs panic isolation.');
  }

  const questionsRaw = readJson(rel.questionBank);
  const questions = Array.isArray(questionsRaw) ? questionsRaw : (questionsRaw.questions || []);
  const index = readJson(rel.questionBankIndex);
  const pages = materialPages();
  const bankEntry = (index.questionBanks || []).find((bank) => bank.id === expected.bankId) || {};
  const pageRows = pages.map((relativePath) => {
    const html = readText(relativePath);
    const sitePath = `/${toPosix(relativePath)}`;
    return {
      materialId: materialIdFromPath(relativePath),
      slug: path.basename(path.dirname(relativePath)),
      relativePath,
      sitePath,
      title: titleFromHtml(html),
      ids: htmlIds(html)
    };
  });
  const pageByRelPath = new Map(pageRows.map((row) => [toPosix(row.relativePath), row]));
  const pageBySlug = new Map(pageRows.map((row) => [row.slug, row]));
  const sourceMaterialCounts = groupCounts(questions, (question) => question.sourceMaterialId);
  const sourceUrlCounts = groupCounts(questions, (question) => materialSlugFromUrl(question.sourceHtmlUrl));

  const questionRows = questions.map((question) => {
    const sourceHtmlUrl = String(question.sourceHtmlUrl || '');
    const anchor = anchorParts(sourceHtmlUrl);
    const row = pageByRelPath.get(anchor.relPath);
    const sourceHtmlExists = Boolean(row);
    const sourceAnchorFound = Boolean(row && anchor.hash && row.ids.has(anchor.hash));
    const sourceMaterialId = String(question.sourceMaterialId || '');
    const urlMaterialId = row?.materialId || '';
    const sourceMaterialMatchesUrl = Boolean(sourceMaterialId && urlMaterialId && sourceMaterialId === urlMaterialId);
    const reasons = enrichmentReasons(question);
    return {
      id: String(question.id || ''),
      sourceMaterialId,
      sourceMaterialTitle: String(question.sourceMaterialTitle || ''),
      sourceHtmlUrl,
      sourceHtmlRelPath: anchor.relPath,
      sourceHtmlHash: anchor.hash,
      inSiteMaterialAnchor: isInSiteMaterialAnchor(sourceHtmlUrl),
      sourceHtmlExists,
      sourceAnchorFound,
      sourceMaterialMatchesUrl,
      extractedFromMaterial: question.extractedFromMaterial === true,
      noOriginalAnswerClaim: question.noOriginalAnswerClaim === true,
      chars: charCounts(question.question).chars,
      cjk: charCounts(question.question).cjk,
      qualityTier: String(question.qualityTier || ''),
      enrichmentReasons: reasons,
      needsHumanEnrichment: reasons.length > 0,
      pass: isInSiteMaterialAnchor(sourceHtmlUrl)
        && sourceHtmlExists
        && sourceAnchorFound
        && sourceMaterialMatchesUrl
    };
  });

  const materialRows = pageRows.map((page) => {
    const questionsForMaterial = questions.filter((question) => materialSlugFromUrl(question.sourceHtmlUrl) === page.slug);
    const enrichmentRows = questionsForMaterial
      .map((question) => {
        const reasons = enrichmentReasons(question);
        return reasons.length ? questionSample(question, reasons) : null;
      })
      .filter(Boolean);
    return {
      materialId: page.materialId,
      slug: page.slug,
      title: page.title,
      relativePath: page.relativePath,
      sitePath: page.sitePath,
      sourceMaterialQuestionCount: sourceMaterialCounts.get(page.materialId) || 0,
      sourceHtmlUrlQuestionCount: sourceUrlCounts.get(page.slug) || 0,
      uniqueAnchorCount: new Set(questionsForMaterial.map((question) => String(question.sourceHtmlUrl || '').split('#')[1]).filter(Boolean)).size,
      humanEnrichmentCount: enrichmentRows.length,
      qualityShowCount: questionsForMaterial.filter((question) => question.qualityTier === 'show').length,
      qualityOcrReviewCount: questionsForMaterial.filter((question) => question.qualityTier === 'ocr-review').length,
      qualityHideCount: questionsForMaterial.filter((question) => question.qualityTier === 'hide').length,
      sampleEnrichmentRows: enrichmentRows.slice(0, 8)
    };
  });

  const enrichmentRows = questions
    .map((question) => {
      const reasons = enrichmentReasons(question);
      return reasons.length ? questionSample(question, reasons) : null;
    })
    .filter(Boolean)
    .sort((left, right) => left.chars - right.chars || left.cjk - right.cjk || left.id.localeCompare(right.id));

  const summary = {
    questions: questions.length,
    questionBankIndexFound: bankEntry.id === expected.bankId,
    questionBankIndexQuestionCount: Number(bankEntry.questionCount || bankEntry.count || 0),
    questionBankIndexFilename: String(bankEntry.filename || ''),
    htmlMaterialPages: pageRows.length,
    materialsWithSourceHtmlQuestions: materialRows.filter((row) => row.sourceHtmlUrlQuestionCount > 0).length,
    materialsWithoutSourceHtmlQuestions: materialRows.filter((row) => row.sourceHtmlUrlQuestionCount === 0).length,
    inSiteMaterialAnchors: questionRows.filter((row) => row.inSiteMaterialAnchor).length,
    sourceHtmlExists: questionRows.filter((row) => row.sourceHtmlExists).length,
    sourceAnchorFound: questionRows.filter((row) => row.sourceAnchorFound).length,
    sourceMaterialMatchesUrl: questionRows.filter((row) => row.sourceMaterialMatchesUrl).length,
    humanEnrichmentItems: enrichmentRows.length,
    shortQuestionItems: enrichmentRows.filter((row) => row.reasons.includes('short-question-text')).length,
    lowCjkItems: enrichmentRows.filter((row) => row.reasons.includes('low-cjk-density') || row.reasons.includes('quality-flag-low-cjk-density')).length,
    ocrReviewItems: questions.filter((question) => question.qualityTier === 'ocr-review').length,
    hiddenReviewItems: questions.filter((question) => question.qualityTier === 'hide').length
    ,
    defaultPracticeItems: questions.filter((question) => question.qualityTier === 'show' && question.defaultVisible === true && question.defaultHidden === false).length,
    defaultPracticeGarbleItems: questions.filter((question) => question.qualityTier === 'show' && question.defaultVisible === true && question.defaultHidden === false && enrichmentReasons(question).some((reason) => ['round356-default-practice-blocked', 'embedded-equation-placeholder', 'font-table-noise'].includes(reason))).length,
    round356DefaultPracticeBlockedItems: questions.filter((question) => Array.isArray(question.qualityFlags) && question.qualityFlags.includes('round356-default-practice-blocked')).length
  };

  const checks = [
    gate('safe-internal-apfs-execution', !process.cwd().startsWith('/Volumes/mac_2T') && !repoRoot.startsWith('/Volumes/mac_2T'), {
      cwd: process.cwd(),
      repoRoot
    }),
    gate('question-bank-has-411-questions', questions.length === expected.questions, {
      actual: questions.length,
      expected: expected.questions,
      file: rel.questionBank
    }),
    gate('question-bank-index-registers-411-bank', bankEntry.id === expected.bankId
      && Number(bankEntry.questionCount || bankEntry.count || 0) === expected.questions
      && Number(bankEntry.defaultPracticeQuestionCount || 0) === expected.defaultPracticeQuestions
      && Number(bankEntry.qualityOcrReviewCount || 0) === expected.ocrReviewQuestions
      && Number(bankEntry.qualityHideCount || 0) === expected.hiddenReviewQuestions
      && bankEntry.filename === '181103-material-extracted.json', {
      id: bankEntry.id || null,
      questionCount: bankEntry.questionCount || null,
      defaultPracticeQuestionCount: bankEntry.defaultPracticeQuestionCount || null,
      qualityOcrReviewCount: bankEntry.qualityOcrReviewCount || null,
      qualityHideCount: bankEntry.qualityHideCount || null,
      count: bankEntry.count || null,
      filename: bankEntry.filename || null,
      sourceHtmlIndexUrl: bankEntry.sourceHtmlIndexUrl || null
    }),
    gate('all-sourceHtmlUrl-values-are-site-material-anchors', summary.inSiteMaterialAnchors === expected.questions, {
      actual: summary.inSiteMaterialAnchors,
      expected: expected.questions,
      failingRows: questionRows.filter((row) => !row.inSiteMaterialAnchor).slice(0, 20)
    }),
    gate('all-source-html-pages-exist-under-materials', summary.sourceHtmlExists === expected.questions, {
      actual: summary.sourceHtmlExists,
      expected: expected.questions,
      failingRows: questionRows.filter((row) => !row.sourceHtmlExists).slice(0, 20)
    }),
    gate('all-source-html-anchors-exist', summary.sourceAnchorFound === expected.questions, {
      actual: summary.sourceAnchorFound,
      expected: expected.questions,
      failingRows: questionRows.filter((row) => !row.sourceAnchorFound).slice(0, 20)
    }),
    gate('question-sourceMaterialId-matches-sourceHtmlUrl-material', summary.sourceMaterialMatchesUrl === expected.questions, {
      actual: summary.sourceMaterialMatchesUrl,
      expected: expected.questions,
      failingRows: questionRows.filter((row) => !row.sourceMaterialMatchesUrl).slice(0, 20)
    }),
    gate('material-html-surface-has-38-pages', pageRows.length === expected.materials, {
      actual: pageRows.length,
      expected: expected.materials,
      root: rel.materialsRoot
    }),
    gate('default-practice-excludes-round356-ocr-formula-garble', summary.defaultPracticeItems === expected.defaultPracticeQuestions
      && summary.ocrReviewItems === expected.ocrReviewQuestions
      && summary.hiddenReviewItems === expected.hiddenReviewQuestions
      && summary.defaultPracticeGarbleItems === 0
      && summary.round356DefaultPracticeBlockedItems >= 149, {
      defaultPracticeItems: summary.defaultPracticeItems,
      ocrReviewItems: summary.ocrReviewItems,
      hiddenReviewItems: summary.hiddenReviewItems,
      defaultPracticeGarbleItems: summary.defaultPracticeGarbleItems,
      round356DefaultPracticeBlockedItems: summary.round356DefaultPracticeBlockedItems
    })
  ];

  const failures = checks.filter((check) => !check.pass);
  return {
    ok: failures.length === 0,
    version,
    generatedAt,
    expected,
    sourceFiles: {
      questionBank: rel.questionBank,
      materialsRoot: rel.materialsRoot,
      questionBankIndex: rel.questionBankIndex
    },
    outputFiles: {
      json: outputRel,
      gzip: `${outputRel}.gz`,
      markdown: docRel
    },
    summary,
    checks,
    failures: failures.map((check) => check.id),
    materialStats: materialRows,
    warnings: {
      nonFailingHumanEnrichmentItems: enrichmentRows.length,
      meaning: 'Short, low-CJK-density, weak-cue, ocr-review, and hidden review items are listed for manual enrichment but do not fail this source-anchor gate.',
      items: enrichmentRows.slice(0, 80)
    },
    samples: {
      sourceQuestionRows: questionRows.slice(0, 12),
      zeroQuestionMaterials: materialRows
        .filter((row) => row.sourceHtmlUrlQuestionCount === 0)
        .map((row) => ({
          materialId: row.materialId,
          slug: row.slug,
          title: row.title,
          relativePath: row.relativePath
        }))
    },
    acceptance: {
      pass: failures.length === 0,
      meaning: 'Round345 confirms the 411 extracted 181103 material-bank questions each point to an existing in-site material HTML anchor; human-enrichment candidates are informational only.'
    }
  };
}

function renderMarkdown(data) {
  const checkRows = data.checks
    .map((check) => `| ${check.id} | ${check.pass ? 'PASS' : 'FAIL'} |`)
    .join('\n');
  const materialRows = data.materialStats
    .map((row) => `| ${row.materialId} | ${row.title} | ${row.sourceHtmlUrlQuestionCount} | ${row.uniqueAnchorCount} | ${row.humanEnrichmentCount} | \`${row.sitePath}\` |`)
    .join('\n');
  const enrichmentRows = data.warnings.items.length
    ? data.warnings.items
      .slice(0, 40)
      .map((row) => `| ${row.id} | ${row.sourceMaterialId} | ${row.chars} | ${row.cjk} | ${row.qualityTier || 'n/a'} | ${row.reasons.join(', ')} | \`${row.sourceHtmlUrl}\` |`)
      .join('\n')
    : '| none | none | 0 | 0 | n/a | none | n/a |';
  const zeroRows = data.samples.zeroQuestionMaterials.length
    ? data.samples.zeroQuestionMaterials
      .map((row) => `| ${row.materialId} | ${row.title} | \`${row.relativePath}\` |`)
      .join('\n')
    : '| none | none | n/a |';

  return `# Round345 181103 Bank Depth And Source Anchor Gate

- version: ${data.version}
- question bank: \`${data.sourceFiles.questionBank}\`
- material HTML root: \`${data.sourceFiles.materialsRoot}\`
- question-bank index: \`${data.sourceFiles.questionBankIndex}\`
- questions: ${data.summary.questions}/${data.expected.questions}
- existing material anchors: ${data.summary.sourceAnchorFound}/${data.expected.questions}
- material pages: ${data.summary.htmlMaterialPages}/${data.expected.materials}
- default/OCR/hidden: ${data.summary.defaultPracticeItems}/${data.summary.ocrReviewItems}/${data.summary.hiddenReviewItems}
- default practice OCR/formula garble: ${data.summary.defaultPracticeGarbleItems}
- human enrichment candidates: ${data.summary.humanEnrichmentItems} (non-failing)

## Hard Checks

| check | status |
|---|---|
${checkRows}

## Material Statistics

| material | title | questions | unique anchors | enrichment candidates | site path |
|---|---:|---:|---:|---:|---|
${materialRows}

## Manual Enrichment Queue

These rows are intentionally warnings rather than failures. They are short, low-text-density, weak-cue, OCR-review, or hidden-review items that still have valid source HTML anchors.

| question | material | chars | CJK | tier | reasons | source anchor |
|---|---:|---:|---:|---|---|---|
${enrichmentRows}

## Zero-Question Materials

These material pages exist in the 38-page HTML surface but currently have no extracted material-bank question pointing to them.

| material | title | file |
|---|---|---|
${zeroRows}

## Acceptance

${data.acceptance.pass ? 'PASS' : 'FAIL'}: ${data.acceptance.meaning}
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = buildPayload();
  if (args.write) {
    writeJsonAndGzip(outputRel, payload);
    writeText(docRel, renderMarkdown(payload));
  }
  if (args.json) {
    console.log(JSON.stringify(payload, null, 2));
  } else {
    console.log(`${payload.ok ? 'PASS' : 'FAIL'} ${version}: ${payload.summary.sourceAnchorFound}/${expected.questions} anchors, ${payload.summary.humanEnrichmentItems} enrichment warnings`);
  }
  if (!payload.ok) process.exitCode = 1;
}

main();
