#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const version = 'round317-real-exam-source-cardinality-20260614';

const rel = {
  granularity: 'data/fluid-real-exam-source-granularity-audit.json',
  sourceLock: 'data/fluid-round307-real-exam-source-row-year-count-lock.json',
  fixedCandidate: 'question-banks/真题_中国海洋大学_2000-2024_fixed.json',
  realExamIndex: 'question-banks/real-exams-index.json',
  module: 'modules/real-exams-dynamic.html',
  output: 'data/fluid-round317-real-exam-source-cardinality.json',
  doc: 'docs/round317/real-exam-cardinality.md'
};

const expected = {
  sourceSectionCount: 176,
  sourceAtomicQuestionCount: 325,
  webAtomicQuestionCount: 325,
  groupedSectionCount: 68,
  groupedWebQuestionIdCount: 217,
  fourFiveQuestionLockCount: 18,
  highCardinalitySectionCount: 21,
  highCardinalityQuestionCount: 107,
  shortConceptFourFiveLockCount: 16,
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

function clean(value, max = 180) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function compact(value) {
  return String(value || '')
    .replace(/第\s*\d+\s*小题[：:（(A-D）)]*/g, ' ')
    .replace(/[（）()【】\[\]{}《》“”"'‘’`·,，.。;；:：!?！？、/\\|_—\-\s]+/g, '')
    .toLowerCase();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function sectionKey(row) {
  return `${Number(row.year)}-${String(Number(row.sectionNumber)).padStart(2, '0')}`;
}

function questionRowsForYear(year) {
  const file = fromRoot(`question-banks/real-exam-years/${year}.json`);
  if (!fs.existsSync(file)) return [];
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(data) ? data : asArray(data.questions || data.data);
}

function candidateQuestionRows() {
  const file = fromRoot(rel.fixedCandidate);
  if (!fs.existsSync(file)) return [];
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  return Array.isArray(data) ? data : asArray(data.questions || data.data);
}

function groupedMap(sourceLock) {
  const map = new Map();
  for (const row of asArray(sourceLock.sourceRows)) {
    map.set(sectionKey(row), row);
  }
  return map;
}

function isShortConcept(row) {
  const text = `${row.title || ''} ${row.sourceExcerpt || ''} ${asArray(row.questionSamples).map((sample) => sample.type).join(' ')}`;
  return /简答|简述|概念|名词解释|论述/.test(text);
}

function childNeedle(question) {
  const text = clean(question?.question || question?.title || '', 220)
    .replace(/^.*?第\s*\d+\s*小题[：:）)]?\s*/g, '')
    .replace(/^(?:[A-D]|[（(][A-D][）)])[:：、]?\s*/i, '');
  const normalized = compact(text);
  return normalized.length >= 8 ? normalized.slice(0, 36) : '';
}

function fixedCandidateEvidence(row, questions, fixedRows) {
  const questionIds = asArray(row.questionIds).map(String);
  const expected = Number(row.expectedAtomicCount);
  const fixedById = new Set(fixedRows.map((question) => String(question.id || '')));
  const sameYearFixed = fixedRows.filter((question) => Number(question.year) === Number(row.year));
  const parentIds = [...new Set(questionIds.map((id) => id.replace(/-\d{2}$/, '')))]
    .filter((id) => id && fixedById.has(id));
  const exactChildIds = questionIds.filter((id) => fixedById.has(id));
  const needles = questions.map(childNeedle).filter(Boolean);
  const textMatches = sameYearFixed
    .map((question) => {
      const haystack = compact(`${question.title || ''} ${question.question || ''}`);
      const matchedNeedles = needles.filter((needle) => haystack.includes(needle));
      return {
        id: String(question.id || ''),
        type: String(question.type || ''),
        matchedItemCount: matchedNeedles.length,
        title: clean(question.title || question.question, 120)
      };
    })
    .filter((entry) => entry.matchedItemCount > 0)
    .sort((a, b) => b.matchedItemCount - a.matchedItemCount || a.id.localeCompare(b.id));
  const multiItemRows = textMatches.filter((entry) => entry.matchedItemCount >= 2);
  const singleItemLikeCount = textMatches.filter((entry) => entry.matchedItemCount === 1).length;

  let status = 'candidate-unresolved-watch';
  if (exactChildIds.length === expected) status = 'candidate-current-child-ids-locked';
  else if (singleItemLikeCount >= expected && multiItemRows.length === 0) status = 'candidate-legacy-child-like';
  else if (parentIds.length || multiItemRows.length) status = 'candidate-parent-merged-watch';

  return {
    fixedCandidateFile: rel.fixedCandidate,
    fixedExactCurrentChildIdCount: exactChildIds.length,
    fixedExactCurrentChildIds: exactChildIds,
    fixedParentIds: parentIds,
    fixedTextMatchedRowCount: textMatches.length,
    fixedTextSingleItemLikeCount: singleItemLikeCount,
    fixedTextMultiItemRows: multiItemRows.slice(0, 6),
    fixedCandidateStatus: status,
    fixedCandidateBoundary: 'diagnostic-only: current site loads question-banks/real-exam-years/*.json through real-exams-index; fixed.json is a candidate/legacy fallback source and may use old ids or parent rows.'
  };
}

function moduleLoaderEvidence() {
  const file = fromRoot(rel.module);
  if (!fs.existsSync(file)) {
    return { module: rel.module, status: 'missing-module' };
  }
  const text = fs.readFileSync(file, 'utf8');
  return {
    module: rel.module,
    loadsRealExamIndex: text.includes('/question-banks/real-exams-index.json'),
    loadsYearPacks: /real-exam-years\/\$\{yearNumber\}\.json|real-exam-years\/\$\{year\}\.json|entry\?\.sourceFile/.test(text),
    declaresLegacyFallback: text.includes('真题_中国海洋大学_2000-2024_fixed.json'),
    status: text.includes('/question-banks/real-exams-index.json') && text.includes('real-exam-years/')
      ? 'current-site-primary-loader-is-year-packs'
      : 'loader-evidence-incomplete'
  };
}

function isCurrentQuestionId(questionIds, id) {
  return questionIds.includes(String(id || ''));
}

function makeRows(granularity, sourceLock) {
  const lockMap = groupedMap(sourceLock);
  const fixedRows = candidateQuestionRows();
  const byYearQuestions = new Map();
  const getYearQuestions = (year) => {
    if (!byYearQuestions.has(year)) byYearQuestions.set(year, questionRowsForYear(year));
    return byYearQuestions.get(year);
  };

  return asArray(granularity.sourceSections)
    .filter((row) => Number(row.expectedAtomicCount) > 1)
    .map((row) => {
      const key = sectionKey(row);
      const questionIds = asArray(row.questionIds).map(String);
      const questions = getYearQuestions(Number(row.year)).filter((question) => isCurrentQuestionId(questionIds, question.id));
      const itemNumbers = questions
        .map((question) => Number(question.atomicSource?.itemNumber))
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b);
      const expectedItemNumbers = Array.from({ length: Number(row.expectedAtomicCount) }, (_, index) => index + 1);
      const missingItemNumbers = expectedItemNumbers.filter((number) => !itemNumbers.includes(number));
      const duplicateItemNumbers = itemNumbers.filter((number, index) => itemNumbers.indexOf(number) !== index);
      const sourceLockRow = lockMap.get(key);
      const reasons = [];

      if (Number(row.actualAtomicCount) !== Number(row.expectedAtomicCount)) reasons.push('granularity-actual-count-mismatch');
      if (questionIds.length !== Number(row.expectedAtomicCount)) reasons.push('question-id-count-mismatch');
      if (questions.length !== Number(row.expectedAtomicCount)) reasons.push('year-pack-question-count-mismatch');
      if (missingItemNumbers.length) reasons.push('missing-atomic-item-number');
      if (duplicateItemNumbers.length) reasons.push('duplicate-atomic-item-number');
      if (row.status !== 'split') reasons.push('source-section-not-split');
      if (!sourceLockRow) reasons.push('missing-round307-source-lock-row');
      if (sourceLockRow && Number(sourceLockRow.expectedAtomicCount) !== Number(row.expectedAtomicCount)) reasons.push('round307-expected-count-mismatch');
      if (sourceLockRow && Number(sourceLockRow.webAtomicQuestionCount) !== Number(row.actualAtomicCount)) reasons.push('round307-web-count-mismatch');

      const fixedEvidence = fixedCandidateEvidence(row, questions, fixedRows);
      return {
        key,
        year: Number(row.year),
        sectionNumber: Number(row.sectionNumber),
        title: row.title,
        expectedAtomicCount: Number(row.expectedAtomicCount),
        actualAtomicCount: Number(row.actualAtomicCount),
        questionIdCount: questionIds.length,
        yearPackQuestionCount: questions.length,
        expectedItemNumbers,
        yearPackItemNumbers: itemNumbers,
        questionIds,
        firstQuestionId: row.firstQuestionId || questionIds[0] || null,
        lastQuestionId: row.lastQuestionId || questionIds[questionIds.length - 1] || null,
        evidenceStyles: asArray(row.evidenceStyles),
        riskFamily: Number(row.expectedAtomicCount) >= 4 ? 'high-cardinality' : 'multi-part',
        shortConceptFamily: isShortConcept(row),
        sourceExcerpt: clean(row.sourceExcerpt, 280),
        fixedCandidate: fixedEvidence,
        status: reasons.length ? 'failed' : 'locked',
        reasons
      };
    })
    .sort((a, b) => a.key.localeCompare(b.key));
}

function buildDoc(payload) {
  const lines = [];
  lines.push('# Round317 真题原文题数防合并账本');
  lines.push('');
  lines.push(`版本：\`${payload.version}\``);
  lines.push('');
  lines.push('这一轮只做一件很硬的事：把原文父题的小问基数做成当前门禁。凡原文父题含连续小问，站内必须保留等量题卡；特别是 4 题、5 题和 10 题这类高风险父题，不能被合并成一条综合题。');
  lines.push('');
  lines.push('## 摘要');
  lines.push('');
  lines.push(`- 原文父题：${payload.summary.sourceSectionCount}`);
  lines.push(`- 原文原子题 / 站内原子题：${payload.summary.sourceAtomicQuestionCount} / ${payload.summary.webAtomicQuestionCount}`);
  lines.push(`- 多小问父题：${payload.summary.groupedSectionCount}`);
  lines.push(`- 多小问站内题卡：${payload.summary.groupedWebQuestionIdCount}`);
  lines.push(`- 4/5 小问题数锁：${payload.summary.fourFiveQuestionLockCount}`);
  lines.push(`- 4 题及以上高风险父题：${payload.summary.highCardinalitySectionCount}`);
  lines.push(`- 简答/简述/概念/名词解释 4/5 小问锁：${payload.summary.shortConceptFourFiveLockCount}`);
  lines.push(`- 失败项：${payload.summary.failedCount}`);
  lines.push(`- fixed 候选源题数：${payload.summary.fixedCandidateQuestionCount}`);
  lines.push(`- fixed 候选源父题/多小问诊断 watch：${payload.summary.fixedCandidateWatchCount}`);
  lines.push('');
  lines.push('## 当前站内加载路径');
  lines.push('');
  lines.push(`- 模块：\`${payload.source.currentSiteLoader.module}\``);
  lines.push(`- 状态：\`${payload.source.currentSiteLoader.status}\``);
  lines.push(`- 结论边界：站内主路径读取 \`real-exams-index.json\` 与 \`real-exam-years/*.json\`；\`fixed.json\` 仅作候选/legacy fallback 诊断，不作为当前站内合并判定。`);
  lines.push('');
  lines.push('## 重点锁定的简答/概念/名词解释父题');
  lines.push('');
  lines.push('| 年份 | 父题 | 期望小问 | 站内题卡 | 题号范围 | fixed 候选诊断 | 状态 |');
  lines.push('|---:|---|---:|---:|---|---|---|');
  for (const row of payload.shortConceptFourFiveLocks) {
    lines.push(`| ${row.year} | ${clean(row.title, 80)} | ${row.expectedAtomicCount} | ${row.yearPackQuestionCount} | ${row.firstQuestionId} -> ${row.lastQuestionId} | ${row.fixedCandidate.fixedCandidateStatus} | ${row.status} |`);
  }
  lines.push('');
  lines.push('## fixed 候选源 watch');
  lines.push('');
  lines.push('| 年份 | 父题 | 期望小问 | fixed 诊断 | 证据 |');
  lines.push('|---:|---|---:|---|---|');
  for (const row of payload.fixedCandidateWatchRows) {
    const evidence = [
      row.fixedCandidate.fixedParentIds.length ? `parent=${row.fixedCandidate.fixedParentIds.join(',')}` : '',
      row.fixedCandidate.fixedTextMultiItemRows.length ? `multi=${row.fixedCandidate.fixedTextMultiItemRows.map((entry) => `${entry.id}:${entry.matchedItemCount}`).join(',')}` : '',
      row.fixedCandidate.fixedTextMatchedRowCount ? `textRows=${row.fixedCandidate.fixedTextMatchedRowCount}` : 'no-text-match'
    ].filter(Boolean).join('; ');
    lines.push(`| ${row.year} | ${clean(row.title, 80)} | ${row.expectedAtomicCount} | ${row.fixedCandidate.fixedCandidateStatus} | ${clean(evidence, 120)} |`);
  }
  lines.push('');
  lines.push('## 全部 4 题及以上父题');
  lines.push('');
  lines.push('| 年份 | 父题 | 小问数 | 题号范围 | 证据 | 状态 |');
  lines.push('|---:|---|---:|---|---|---|');
  for (const row of payload.highCardinalityRows) {
    lines.push(`| ${row.year} | ${clean(row.title, 80)} | ${row.expectedAtomicCount} | ${row.firstQuestionId} -> ${row.lastQuestionId} | ${row.evidenceStyles.join(', ')} | ${row.status} |`);
  }
  lines.push('');
  lines.push('## 机器判定');
  lines.push('');
  lines.push(payload.acceptance.pass ? '通过。当前站内题库没有发现多小问父题被合并。' : '失败。见 `failedRows`。');
  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const granularity = readJson(rel.granularity);
  const sourceLock = readJson(rel.sourceLock);
  const rows = makeRows(granularity, sourceLock);
  const fixedRows = candidateQuestionRows();
  const failedRows = rows.filter((row) => row.status !== 'locked');
  const highCardinalityRows = rows.filter((row) => row.expectedAtomicCount >= 4);
  const shortConceptFourFiveLocks = rows.filter((row) => row.shortConceptFamily && [4, 5].includes(row.expectedAtomicCount));
  const fixedCandidateWatchRows = rows
    .filter((row) => row.shortConceptFamily && row.expectedAtomicCount >= 4)
    .filter((row) => !['candidate-current-child-ids-locked', 'candidate-legacy-child-like'].includes(row.fixedCandidate.fixedCandidateStatus));
  const summary = {
    sourceSectionCount: Number(granularity.summary?.sourceSectionCount || 0),
    sourceAtomicQuestionCount: Number(granularity.summary?.expectedAtomicQuestionCount || 0),
    webAtomicQuestionCount: Number(granularity.summary?.webQuestionCount || 0),
    groupedSectionCount: rows.length,
    groupedWebQuestionIdCount: rows.reduce((sum, row) => sum + row.questionIdCount, 0),
    fourFiveQuestionLockCount: rows.filter((row) => [4, 5].includes(row.expectedAtomicCount)).length,
    highCardinalitySectionCount: highCardinalityRows.length,
    highCardinalityQuestionCount: highCardinalityRows.reduce((sum, row) => sum + row.expectedAtomicCount, 0),
    shortConceptFourFiveLockCount: shortConceptFourFiveLocks.length,
    failedCount: failedRows.length,
    fixedCandidateQuestionCount: fixedRows.length,
    fixedCandidateWatchCount: fixedCandidateWatchRows.length
  };
  const checks = Object.entries(expected).map(([key, value]) => ({
    key,
    expected: value,
    actual: summary[key],
    pass: summary[key] === value
  }));
  const payload = {
    version,
    generatedAt: process.env.FLUID_ROUND317_GENERATED_AT || readExistingGeneratedAt(rel.output) || new Date().toISOString(),
    source: {
      granularityAudit: rel.granularity,
      sourceRowLock: rel.sourceLock,
      fixedCandidate: rel.fixedCandidate,
      realExamIndex: rel.realExamIndex,
      yearPacks: 'question-banks/real-exam-years/*.json',
      currentSiteLoader: moduleLoaderEvidence(),
      policy: 'All source sections with multiple original subquestions must keep matching visible web question IDs. Four/five-question short-answer, concept, definition, and discussion parents are release-blocking locks.'
    },
    expected,
    summary,
    highCardinalityRows,
    shortConceptFourFiveLocks,
    fixedCandidateWatchRows,
    groupedRows: rows,
    failedRows,
    checks,
    acceptance: {
      pass: failedRows.length === 0 && checks.every((check) => check.pass),
      blocker: failedRows.length ? 'source-cardinality-regression' : null
    }
  };

  if (args.write) {
    writeJson(rel.output, payload);
    writeText(rel.doc, buildDoc(payload));
  }

  if (args.json) console.log(JSON.stringify({
    version,
    output: rel.output,
    doc: rel.doc,
    summary,
    checks,
    failedRows: failedRows.slice(0, 20),
    acceptance: payload.acceptance
  }, null, 2));
  else console.log(`${version}: ${payload.acceptance.pass ? 'PASS' : 'FAIL'} (${summary.failedCount} failed rows)`);

  if (!payload.acceptance.pass) process.exitCode = 1;
}

main();
