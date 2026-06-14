#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const version = 'round318-real-exam-chapter-practice-20260614';

const rel = {
  realExamIndex: 'question-banks/real-exams-index.json',
  questionChapterMap: 'data/fluid-question-chapter-map.json',
  chapterExamPacks: 'data/fluid-chapter-exam-packs.json',
  round317: 'data/fluid-round317-real-exam-source-cardinality.json',
  practiceModule: 'modules/practice-dynamic.html',
  output: 'data/fluid-round318-real-exam-chapter-practice.json',
  doc: 'docs/round318/real-exam-chapter-practice-shortcuts.md'
};

const expected = {
  verifiedOriginalQuestionCount: 325,
  mappedOriginalQuestionCount: 325,
  originalYearCount: 24,
  chapterCount: 6,
  shortcutCount: 6,
  failedCount: 0
};

function parseArgs(argv) {
  const args = { write: false, json: false };
  for (const arg of argv) {
    if (arg === '--write') args.write = true;
    else if (arg === '--json') args.json = true;
    else if (arg === '--no-write') args.write = false;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function fromRoot(relativePath) {
  return path.join(repoRoot, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(fromRoot(relativePath), 'utf8'));
}

function readExistingGeneratedAt(relativePath) {
  try {
    return readJson(relativePath).generatedAt || null;
  } catch {
    return null;
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function countBy(rows, keyFn) {
  const counts = new Map();
  for (const row of rows) {
    const key = keyFn(row) || 'unlabeled';
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN')));
}

function writeJson(relativePath, payload) {
  const file = fromRoot(relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const text = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(file, text);
  fs.writeFileSync(`${file}.gz`, zlib.gzipSync(text, { level: 9 }));
}

function writeText(relativePath, text) {
  const file = fromRoot(relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function makeCheck(name, passed, evidence = {}) {
  return { name, passed: Boolean(passed), evidence };
}

function moduleEvidence(moduleText, chapters) {
  const hrefs = chapters.map((chapter) => `./practice-dynamic.html?type=real&chapter=${chapter}`);
  const presentHrefs = hrefs.filter((href) => moduleText.includes(href));
  return {
    module: rel.practiceModule,
    handlesChapterRoute: moduleText.includes('handleChapterPractice') && moduleText.includes("urlParams.get('chapter')"),
    hasChapterMatcher: moduleText.includes('questionMatchesRealExamChapter') && moduleText.includes('filterRealExamQuestionsByChapter'),
    presentShortcutHrefs: presentHrefs,
    missingShortcutHrefs: hrefs.filter((href) => !presentHrefs.includes(href))
  };
}

function makeChapterRows(chapterPacks, moduleText) {
  return asArray(chapterPacks.chapters).map((chapter) => {
    const chapterNo = Number(chapter.chapter);
    const questions = asArray(chapter.practiceQuestions);
    const ids = questions.map((question) => String(question.id || '')).filter(Boolean);
    const uniqueIds = [...new Set(ids)];
    const shortcutUrl = `/modules/practice-dynamic.html?type=real&chapter=${chapterNo}&mode=normal`;
    const selectorHref = `./practice-dynamic.html?type=real&chapter=${chapterNo}`;
    const questionUrlPrefix = `./practice-dynamic.html?type=real&chapter=${chapterNo}`;
    const badQuestionUrls = questions
      .map((question) => String(question.url || ''))
      .filter((url) => url && !url.startsWith(questionUrlPrefix));
    const sourceStatusCounts = countBy(questions, (question) => question.sourceStatus || 'verified-original-pdf-index');
    const needsReviewCount = questions.filter((question) => question.needsReview).length;

    return {
      chapter: chapterNo,
      title: chapter.title,
      shortcutUrl,
      selectorHref,
      selectorHrefPresent: moduleText.includes(selectorHref),
      practiceQuestionCount: Number(chapter.practiceQuestionCount || 0),
      packedQuestionCount: Number(chapter.questionCount || 0),
      uniqueQuestionIdCount: uniqueIds.length,
      duplicateQuestionIdCount: ids.length - uniqueIds.length,
      yearCount: Number(chapter.yearCount || 0),
      years: asArray(chapter.years),
      typeCounts: asArray(chapter.typeCounts),
      warmupCount: asArray(chapter.warmups).length,
      coreDrillCount: asArray(chapter.coreDrills).length,
      challengeDrillCount: asArray(chapter.challengeDrills).length,
      mistakeLoopCount: asArray(chapter.mistakeLoops).length,
      formulaFocusCount: asArray(chapter.formulaFocus).length,
      sourceStatusCounts,
      needsReviewCount,
      sampleQuestionIds: uniqueIds.slice(0, 8),
      badQuestionUrls: badQuestionUrls.slice(0, 8),
      status: (
        Number(chapter.practiceQuestionCount || 0) > 0
        && Number(chapter.practiceQuestionCount || 0) === questions.length
        && Number(chapter.questionCount || 0) === questions.length
        && uniqueIds.length === questions.length
        && moduleText.includes(selectorHref)
        && String(chapter.practiceUrl || '') === shortcutUrl
        && badQuestionUrls.length === 0
      ) ? 'locked' : 'risk'
    };
  }).sort((a, b) => a.chapter - b.chapter);
}

function buildPayload() {
  const realExamIndex = readJson(rel.realExamIndex);
  const questionChapterMap = readJson(rel.questionChapterMap);
  const chapterPacks = readJson(rel.chapterExamPacks);
  const round317 = readJson(rel.round317);
  const moduleText = fs.readFileSync(fromRoot(rel.practiceModule), 'utf8');
  const chapterRows = makeChapterRows(chapterPacks, moduleText);
  const chapterNos = chapterRows.map((row) => row.chapter);
  const module = moduleEvidence(moduleText, chapterNos);

  const failedRows = chapterRows.filter((row) => row.status !== 'locked');
  const checks = [
    makeCheck('real-exam-index-original-count-locked', Number(realExamIndex.statistics?.questionCount) === expected.verifiedOriginalQuestionCount, realExamIndex.statistics),
    makeCheck('real-exam-index-original-year-count-locked', Number(realExamIndex.statistics?.yearCount) === expected.originalYearCount, { yearCount: realExamIndex.statistics?.yearCount }),
    makeCheck('question-chapter-map-complete', Number(questionChapterMap.questionCount) === expected.verifiedOriginalQuestionCount && Number(questionChapterMap.mappedQuestionCount) === expected.mappedOriginalQuestionCount && asArray(questionChapterMap.missingInYearPacks).length === 0, {
      questionCount: questionChapterMap.questionCount,
      mappedQuestionCount: questionChapterMap.mappedQuestionCount,
      missingInYearPacks: asArray(questionChapterMap.missingInYearPacks).length
    }),
    makeCheck('chapter-pack-six-shortcuts-built', Number(chapterPacks.chapterCount) === expected.chapterCount && chapterRows.length === expected.shortcutCount, {
      chapterCount: chapterPacks.chapterCount,
      rows: chapterRows.length
    }),
    makeCheck('practice-module-routes-chapter-shortcuts', module.handlesChapterRoute && module.hasChapterMatcher && module.missingShortcutHrefs.length === 0, module),
    makeCheck('round317-source-cardinality-still-clean', asArray(round317.failedRows).length === 0 && round317.acceptance?.pass !== false, {
      failedRows: asArray(round317.failedRows).length,
      acceptance: round317.acceptance
    }),
    makeCheck('chapter-shortcut-rows-locked', failedRows.length === expected.failedCount, { failedRows: failedRows.length })
  ];

  const pass = checks.every((check) => check.passed);
  const sourceStatusCounts = {};
  for (const row of chapterRows) {
    for (const [status, count] of Object.entries(row.sourceStatusCounts)) {
      sourceStatusCounts[status] = (sourceStatusCounts[status] || 0) + count;
    }
  }

  return {
    version,
    generatedAt: readExistingGeneratedAt(rel.output) || new Date().toISOString(),
    source: {
      realExamIndex: rel.realExamIndex,
      questionChapterMap: rel.questionChapterMap,
      chapterExamPacks: rel.chapterExamPacks,
      round317SourceCardinality: rel.round317,
      practiceModule: rel.practiceModule,
      policy: 'Round318 is a data/check ledger for existing chapter-practice shortcuts only. It does not edit shared pages, question banks, auth, deploy state, or release proof.'
    },
    expected,
    summary: {
      verifiedOriginalQuestionCount: Number(realExamIndex.statistics?.questionCount || 0),
      mappedOriginalQuestionCount: Number(questionChapterMap.mappedQuestionCount || 0),
      originalYearCount: Number(realExamIndex.statistics?.yearCount || 0),
      chapterCount: chapterRows.length,
      shortcutCount: chapterRows.filter((row) => row.selectorHrefPresent).length,
      chapterPracticeQuestionCount: chapterRows.reduce((sum, row) => sum + row.practiceQuestionCount, 0),
      warmupCount: chapterRows.reduce((sum, row) => sum + row.warmupCount, 0),
      coreDrillCount: chapterRows.reduce((sum, row) => sum + row.coreDrillCount, 0),
      challengeDrillCount: chapterRows.reduce((sum, row) => sum + row.challengeDrillCount, 0),
      mistakeLoopCount: chapterRows.reduce((sum, row) => sum + row.mistakeLoopCount, 0),
      formulaFocusCount: chapterRows.reduce((sum, row) => sum + row.formulaFocusCount, 0),
      needsReviewCount: chapterRows.reduce((sum, row) => sum + row.needsReviewCount, 0),
      sourceStatusCounts,
      failedCount: failedRows.length,
      pass
    },
    chapterRows,
    failedRows,
    checks,
    acceptance: {
      pass,
      integrationNeeded: pass
        ? 'Optional only: shared pages may read data/fluid-round318-real-exam-chapter-practice.json to render a visible ledger, but existing chapter shortcut hrefs already route through practice-dynamic.'
        : 'Do not integrate until failedRows/checks are resolved.'
    }
  };
}

function renderDoc(payload) {
  const table = payload.chapterRows.map((row) => (
    `| ${row.chapter} | ${row.title} | ${row.practiceQuestionCount} | ${row.yearCount} | ${row.warmupCount}/${row.coreDrillCount}/${row.challengeDrillCount} | ${row.needsReviewCount} | ${row.status} | ${row.shortcutUrl} |`
  )).join('\n');
  const failed = payload.failedRows.length
    ? payload.failedRows.map((row) => `- chapter ${row.chapter}: ${row.status}`).join('\n')
    : '- none';

  return `# Round318 Real-Exam Chapter-Practice Shortcut Ledger

- version: ${payload.version}
- generatedAt: ${payload.generatedAt}
- scope: data/check ledger only; no shared page edits

## Result

- pass: ${payload.acceptance.pass}
- original verified questions: ${payload.summary.verifiedOriginalQuestionCount}
- mapped original questions: ${payload.summary.mappedOriginalQuestionCount}
- chapter shortcuts locked: ${payload.summary.shortcutCount}/${payload.expected.shortcutCount}
- chapter-practice cards: ${payload.summary.chapterPracticeQuestionCount}
- needs-review/candidate cards inside chapter packs: ${payload.summary.needsReviewCount}
- failed rows: ${payload.summary.failedCount}

## Source Boundary

Round318 reads the existing real-exam index, question-chapter map, chapter exam packs, Round317 cardinality ledger, and practice module. It does not rewrite question banks or shared pages.

## Chapter Shortcuts

| chapter | title | practice cards | years | warm/core/challenge | needsReview | status | shortcut |
|---:|---|---:|---:|---:|---:|---|---|
${table}

## Failed Rows

${failed}

## Verification

\`\`\`bash
node tools/check-round318-real-exam-chapter-practice.mjs --write --json
\`\`\`

## Integration Need

${payload.acceptance.integrationNeeded}
`;
}

const args = parseArgs(process.argv.slice(2));
const payload = buildPayload();

if (args.write) {
  writeJson(rel.output, payload);
  writeText(rel.doc, renderDoc(payload));
}

const result = {
  ok: payload.acceptance.pass,
  version: payload.version,
  output: rel.output,
  doc: rel.doc,
  summary: payload.summary,
  failedRows: payload.failedRows
};

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`${result.ok ? 'PASS' : 'FAIL'} ${version}`);
  console.log(JSON.stringify(result.summary, null, 2));
}

if (!payload.acceptance.pass) process.exitCode = 1;
