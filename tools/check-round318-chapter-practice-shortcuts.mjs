#!/usr/bin/env node
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = 'round318-chapter-practice-shortcuts-20260614';
const outputPath = 'data/fluid-round318-chapter-practice-shortcuts.json';
const docPath = 'docs/round318/chapter-practice-shortcuts.md';
const expected = {
  realQuestionCount: 325,
  activeYearCount: 24,
  sourceAtomicQuestionCount: 325,
  groupedSectionCount: 68,
  groupedWebQuestionIdCount: 217,
  chapterShortcutCount: 6,
  unlinkedQuestionCount: 0,
  missingPracticeUrlCount: 0,
  missingRealExamUrlCount: 0,
  missingRound317CarryForwardFailures: 0
};

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relPath), 'utf8'));
}

function readExistingGeneratedAt(relPath) {
  try {
    return readJson(relPath).generatedAt || null;
  } catch {
    return null;
  }
}

function writeJson(relPath, value) {
  const absPath = path.join(repoRoot, relPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  const text = `${JSON.stringify(value, null, 2)}\n`;
  fs.writeFileSync(absPath, text);
  fs.writeFileSync(`${absPath}.gz`, zlib.gzipSync(text, { level: 9 }));
}

function writeText(relPath, text) {
  const absPath = path.join(repoRoot, relPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, text.endsWith('\n') ? text : `${text}\n`);
}

function parseArgs(argv) {
  const options = { write: false, json: false };
  for (const raw of argv) {
    if (raw === '--write') options.write = true;
    else if (raw === '--json') options.json = true;
    else throw new Error(`Unknown argument: ${raw}`);
  }
  return options;
}

function uniq(values) {
  return Array.from(new Set(values));
}

function normalizedChapter(value) {
  const chapter = Number.parseInt(value, 10);
  return Number.isFinite(chapter) ? String(chapter) : '';
}

function questionChapters(question) {
  return (Array.isArray(question.relatedChapters) ? question.relatedChapters : [])
    .map((item) => ({
      chapter: normalizedChapter(item?.chapter),
      title: item?.title || '',
      score: Number(item?.score || 0)
    }))
    .filter((item) => item.chapter);
}

function primaryChapter(question) {
  const chapters = questionChapters(question).sort((a, b) => b.score - a.score || Number(a.chapter) - Number(b.chapter));
  return chapters[0] || null;
}

function collectQuestions(index) {
  const out = [];
  const years = (index.years || []).filter((year) => Number(year.year) <= 2024);
  for (const year of years) {
    const yearFile = year.sourceFile || `real-exam-years/${year.year}.json`;
    const pack = readJson(`question-banks/${yearFile}`);
    for (const question of pack.questions || []) {
      out.push({ ...question, year: pack.year || question.year, sourceFile: yearFile });
    }
  }
  return out;
}

function buildLedger() {
  const index = readJson('question-banks/real-exams-index.json');
  const chapterPacks = readJson('data/fluid-chapter-exam-packs.json');
  const round317 = readJson('data/fluid-round317-real-exam-source-cardinality.json');
  const questions = collectQuestions(index);
  const byChapter = new Map();
  const unlinked = [];

  for (const question of questions) {
    const chapters = questionChapters(question);
    const primary = primaryChapter(question);
    if (!chapters.length || !primary) {
      unlinked.push({ id: question.id, year: question.year, title: question.title || question.question || '' });
      continue;
    }
    const chapter = byChapter.get(primary.chapter) || {
      chapter: Number(primary.chapter),
      title: primary.title,
      questionIds: [],
      years: new Set(),
      groupedQuestionIds: [],
      fourFiveLockQuestionIds: [],
      typeCounts: new Map(),
      tagCounts: new Map(),
      topExamples: []
    };
    chapter.questionIds.push(question.id);
    chapter.years.add(Number(question.year));
    if (/-\d\d$/.test(String(question.id || ''))) chapter.groupedQuestionIds.push(question.id);
    if (/简答|简述|概念|名词解释/.test(String(question.type || question.title || '')) && /-\d\d$/.test(String(question.id || ''))) {
      chapter.fourFiveLockQuestionIds.push(question.id);
    }
    const type = question.type || '未标题型';
    chapter.typeCounts.set(type, (chapter.typeCounts.get(type) || 0) + 1);
    for (const tag of (question.tags || []).slice(0, 8)) {
      chapter.tagCounts.set(tag, (chapter.tagCounts.get(tag) || 0) + 1);
    }
    if (chapter.topExamples.length < 5) {
      chapter.topExamples.push({
        id: question.id,
        year: Number(question.year),
        title: String(question.title || question.question || '').slice(0, 96),
        href: `/modules/real-exams-dynamic.html?year=${encodeURIComponent(question.year)}&q=${encodeURIComponent(question.id)}&from=round318-chapter-shortcuts`
      });
    }
    byChapter.set(primary.chapter, chapter);
  }

  const packByChapter = new Map((chapterPacks.chapters || []).map((chapter) => [String(chapter.chapter), chapter]));
  const shortcuts = Array.from(byChapter.values())
    .sort((a, b) => Number(a.chapter) - Number(b.chapter))
    .map((chapter) => {
      const pack = packByChapter.get(String(chapter.chapter)) || {};
      const typeCounts = Array.from(chapter.typeCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8)
        .map(([name, count]) => ({ name, count }));
      const tagCounts = Array.from(chapter.tagCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10)
        .map(([name, count]) => ({ name, count }));
      return {
        chapter: chapter.chapter,
        title: chapter.title || pack.title || `第 ${chapter.chapter} 章`,
        primaryQuestionCount: chapter.questionIds.length,
        yearCount: chapter.years.size,
        years: Array.from(chapter.years).sort((a, b) => a - b),
        groupedPrimaryQuestionCount: chapter.groupedQuestionIds.length,
        shortConceptGroupedQuestionCount: chapter.fourFiveLockQuestionIds.length,
        practiceUrl: pack.practiceUrl || `/modules/practice-dynamic.html?type=real&chapter=${chapter.chapter}&mode=normal`,
        realExamUrl: `/modules/real-exams-dynamic.html?chapter=${chapter.chapter}&from=round318-chapter-shortcuts`,
        knowledgeUrl: `/modules/knowledge-detail.html?chapter=${chapter.chapter}&from=round318-chapter-shortcuts`,
        typeCounts,
        tagCounts,
        topExamples: chapter.topExamples
      };
    });

  const summary = {
    realQuestionCount: questions.length,
    activeYearCount: uniq(questions.map((question) => Number(question.year))).length,
    sourceAtomicQuestionCount: round317.summary?.sourceAtomicQuestionCount || 0,
    webAtomicQuestionCount: round317.summary?.webAtomicQuestionCount || 0,
    groupedSectionCount: round317.summary?.groupedSectionCount || 0,
    groupedWebQuestionIdCount: round317.summary?.groupedWebQuestionIdCount || 0,
    chapterShortcutCount: shortcuts.length,
    shortcutPrimaryQuestionCount: shortcuts.reduce((sum, chapter) => sum + chapter.primaryQuestionCount, 0),
    unlinkedQuestionCount: unlinked.length,
    missingPracticeUrlCount: shortcuts.filter((chapter) => !chapter.practiceUrl).length,
    missingRealExamUrlCount: shortcuts.filter((chapter) => !chapter.realExamUrl).length,
    chaptersWithExamples: shortcuts.filter((chapter) => chapter.topExamples.length > 0).length,
    chapterNumbers: shortcuts.map((chapter) => chapter.chapter)
  };

  const checks = [
    ['realQuestionCount', expected.realQuestionCount, summary.realQuestionCount],
    ['activeYearCount', expected.activeYearCount, summary.activeYearCount],
    ['sourceAtomicQuestionCount', expected.sourceAtomicQuestionCount, summary.sourceAtomicQuestionCount],
    ['groupedSectionCount', expected.groupedSectionCount, summary.groupedSectionCount],
    ['groupedWebQuestionIdCount', expected.groupedWebQuestionIdCount, summary.groupedWebQuestionIdCount],
    ['chapterShortcutCount', expected.chapterShortcutCount, summary.chapterShortcutCount],
    ['shortcutPrimaryQuestionCount', expected.realQuestionCount, summary.shortcutPrimaryQuestionCount],
    ['unlinkedQuestionCount', expected.unlinkedQuestionCount, summary.unlinkedQuestionCount],
    ['missingPracticeUrlCount', expected.missingPracticeUrlCount, summary.missingPracticeUrlCount],
    ['missingRealExamUrlCount', expected.missingRealExamUrlCount, summary.missingRealExamUrlCount]
  ].map(([key, expectedValue, actual]) => ({ key, expected: expectedValue, actual, pass: actual === expectedValue }));

  const failedChecks = checks.filter((check) => !check.pass);
  return {
    version,
    generatedAt: process.env.FLUID_ROUND318_CHAPTER_PRACTICE_SHORTCUTS_GENERATED_AT || readExistingGeneratedAt(outputPath) || new Date().toISOString(),
    source: {
      realExamIndex: 'question-banks/real-exams-index.json',
      yearPacks: 'question-banks/real-exam-years/*.json',
      chapterExamPacks: 'data/fluid-chapter-exam-packs.json',
      round317Cardinality: 'data/fluid-round317-real-exam-source-cardinality.json',
      policy: 'Round318 chapter shortcuts must cover all 325 current real-exam atoms by primary chapter and preserve the Round317 no-merge source-cardinality boundary.'
    },
    expected,
    summary,
    shortcuts,
    unlinkedQuestions: unlinked,
    checks,
    acceptance: {
      pass: failedChecks.length === 0,
      failedCheckIds: failedChecks.map((check) => check.key),
      meaning: 'Six chapter practice shortcuts cover the current 325 real-exam atoms and link each chapter to practice, filtered real exams, and knowledge review without weakening Round317 no-merge counts.'
    }
  };
}

function markdownReport(ledger) {
  const rows = ledger.shortcuts.map((chapter) => (
    `| ${chapter.chapter} | ${chapter.title} | ${chapter.primaryQuestionCount} | ${chapter.yearCount} | ${chapter.groupedPrimaryQuestionCount} | ${chapter.practiceUrl} |`
  )).join('\n');
  const checks = ledger.checks.map((check) => (
    `| ${check.key} | ${check.expected} | ${check.actual} | ${check.pass ? 'PASS' : 'FAIL'} |`
  )).join('\n');
  return `# Round318 章节练习直达账本

版本：\`${ledger.version}\`

Round318 把 Round317 的真题原文题数锁继续往学生练习入口推进：不是只证明 325 道题存在，而是证明这 325 道真题都能按主章节进入章节练习、真题筛选和知识点复核。

## 摘要

- 当前真题原子题：${ledger.summary.realQuestionCount}
- 当前正式年份：${ledger.summary.activeYearCount}
- Round317 原文原子题 / 站内原子题：${ledger.summary.sourceAtomicQuestionCount} / ${ledger.summary.webAtomicQuestionCount}
- Round317 grouped section / grouped 小题：${ledger.summary.groupedSectionCount} / ${ledger.summary.groupedWebQuestionIdCount}
- 章节直达入口：${ledger.summary.chapterShortcutCount}
- 直达覆盖题数：${ledger.summary.shortcutPrimaryQuestionCount}
- 未挂章节题：${ledger.summary.unlinkedQuestionCount}

## 六章直达

| 章 | 标题 | 主章节题数 | 覆盖年份 | grouped 主章节题 | 练习入口 |
|---:|---|---:|---:|---:|---|
${rows}

## 机器检查

| 检查 | 期望 | 实际 | 状态 |
|---|---:|---:|---|
${checks}

## 边界

本账本只证明“章节练习直达”覆盖当前 325 道真题，并继承 Round317 题数防合并边界。它不证明答案 PDF 逐字来源，也不证明私有视频生产恢复。
`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const ledger = buildLedger();
  if (options.write) {
    writeJson(outputPath, ledger);
    writeText(docPath, markdownReport(ledger));
  }
  if (options.json) console.log(JSON.stringify(ledger, null, 2));
  else {
    console.log(`round318 chapter practice shortcuts: ${ledger.acceptance.pass ? 'PASS' : 'FAIL'}`);
    console.log(`questions=${ledger.summary.realQuestionCount}, shortcuts=${ledger.summary.chapterShortcutCount}, unlinked=${ledger.summary.unlinkedQuestionCount}`);
  }
  if (!ledger.acceptance.pass) process.exit(1);
}

main();
