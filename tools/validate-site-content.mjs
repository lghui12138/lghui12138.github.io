import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const badPattern = /待完善|暂无|需完善|TODO|待补|未提供|内容不完整|标题待补/;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function questionArray(file) {
  const parsed = readJson(file);
  return Array.isArray(parsed) ? parsed : (parsed.questions || parsed.data || []);
}

function isBad(q) {
  return !String(q.question || q.title || q.stem || q.content || '').trim()
    || !String(q.answer || '').trim()
    || !String(q.explanation || '').trim()
    || badPattern.test(JSON.stringify(q));
}

const knowledge = readJson(path.join(repoRoot, 'data/fluid-knowledge-points.json'));
const examArchive = readJson(path.join(repoRoot, 'data/real-exam-source-index.json'));
const index = readJson(path.join(repoRoot, 'question-banks/index.json'));
const fixedPath = path.join(repoRoot, 'question-banks/真题_中国海洋大学_2000-2024_fixed.json');
const fixed = questionArray(fixedPath);
const fixedBad = fixed.filter(isBad);

const years = fixed.reduce((acc, q) => {
  const year = Number(q.year);
  if (Number.isFinite(year)) acc[year] = (acc[year] || 0) + 1;
  return acc;
}, {});

const recommended = (index.questionBanks || []).filter(bank => bank.category === '真题' && bank.recommended);
const result = {
  knowledgePages: knowledge.totalPages,
  knowledgeCategories: knowledge.categories?.length || 0,
  examArchiveYears: examArchive.yearCount,
  fixedQuestions: fixed.length,
  fixedBad: fixedBad.length,
  fixedYears: years,
  recommendedRealExamFiles: recommended.map(bank => bank.filename),
  legacyIndex: {
    real: index.real?.length || 0,
    chapter: index.chapter?.length || 0,
    wrong: index.wrong?.length || 0
  }
};

console.log(JSON.stringify(result, null, 2));

const failures = [];
if (knowledge.totalPages < 120) failures.push('知识点页数少于 120');
if (!knowledge.points?.some(point => /边界层/.test(point.title + point.markdown))) failures.push('知识点缺少边界层内容');
if (!knowledge.points?.some(point => /复势|速度势|流函数/.test(point.title + point.markdown))) failures.push('知识点缺少势流/复势内容');
if (fixed.length < 289) failures.push('精修真题主库题量少于 289');
if (fixedBad.length) failures.push(`精修真题主库仍有 ${fixedBad.length} 条占位/缺解析`);
if (!years[2008]) failures.push('精修真题主库缺少 2008 年');
if (recommended.length !== 1 || recommended[0].filename !== '真题_中国海洋大学_2000-2024_fixed.json') failures.push('推荐真题主库不唯一或不是 fixed.json');
if (!index.real?.length || index.real[0].file !== '真题_中国海洋大学_2000-2024_fixed.json') failures.push('legacy real 索引未指向 fixed.json');

if (failures.length) {
  console.error(`校验失败：\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
