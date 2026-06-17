import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const expectedVersion = process.env.FLUID_EXPECTED_EDGE_VERSION || 'round380-server-progress-persistence-20260617';
const previous181103Base = 'round379-181103-full-website-question-validation-20260617';

const shellFiles = [
  {
    id: 'homepage',
    file: 'index.html',
    required: ['181103 首页直达入口', '181103 522 全题核对 / 381 练习', '181103 38 份 HTML 正文', '资源中心 181103 工作台']
  },
  {
    id: 'stable-homepage',
    file: 'index-complete.html',
    required: ['181103 首页直达入口', '181103 522 全题核对 / 381 练习', '181103 38 份 HTML 正文', '资源中心 181103 工作台']
  },
  {
    id: 'question-bank-root',
    file: 'question-bank.html',
    required: ['181103 题库直达入口', '181103 资料内题目全集', '181103 真题复核边界', '181103 HTML 来源总表']
  },
  {
    id: 'question-bank-home',
    file: 'question-bank-home.html',
    required: ['181103 题库直达入口', '181103 资料内题目全集', '181103 真题复核边界', '181103 HTML 来源总表']
  },
  {
    id: 'question-bank-module',
    file: 'modules/question-bank.html',
    required: ['181103 题库直达入口', '181103 资料内题目全集', '181103 真题复核边界', '181103 HTML 来源总表']
  },
  {
    id: 'resources',
    file: 'resources.html',
    required: ['181103 资料直达入口', '181103 全资料 HTML 总表', '181103 资料内题目全集', '181103 真题复核题']
  }
];

const requiredCommonTerms = [
  expectedVersion,
  'Current · Round380',
  '181103 content base · Round379',
  '38 HTML · 522 sources · 381 practice · 141 leads',
  '522',
  '381',
  '141',
  '公开壳不提供原始文件下载'
];

const failures = [];
const checked = [];

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function addFailure(id, message) {
  failures.push(`${id}: ${message}`);
}

function hrefsFrom(html) {
  return [...html.matchAll(/\bhref=(["'])(.*?)\1/gi)].map((match) => match[2]);
}

function assertNoDirectDownloadPromise(id, html) {
  if (/<a\b[^>]*\bdownload(?:\s|=|>)/i.test(html)) {
    addFailure(id, 'contains an anchor download attribute');
  }
  const badHrefs = hrefsFrom(html).filter((href) => {
    const normalized = href.trim();
    return /\.(?:pdf|pptx?|docx?|zip)(?:[?#]|$)/i.test(normalized)
      || /(?:^|\/)(?:download|downloads|raw|viewer|viewers)(?:\/|$|[?#-])/i.test(normalized)
      || /^file:/i.test(normalized)
      || /^\/Volumes\//i.test(normalized)
      || /^\/Users\//i.test(normalized);
  });
  if (badHrefs.length) {
    addFailure(id, `contains direct-download/viewer/local hrefs: ${badHrefs.join(', ')}`);
  }
}

function assertCurrentLabel(id, html) {
  const staleCurrentLabels = [...html.matchAll(/当前入口版本是\s+(round\d+[-\w]+)/gi)]
    .map((match) => match[1])
    .filter((version) => version !== expectedVersion);
  if (staleCurrentLabels.length) {
    addFailure(id, `stale current labels: ${staleCurrentLabels.join(', ')}`);
  }
  if (/round264/i.test(html)) {
    addFailure(id, 'contains round264 on a live shell surface');
  }
  if (!html.includes(`edge_refresh=${expectedVersion}`)) {
    addFailure(id, `does not route with edge_refresh=${expectedVersion}`);
  }
}

for (const entry of shellFiles) {
  const html = readText(entry.file);
  for (const term of [...requiredCommonTerms, ...entry.required]) {
    if (!html.includes(term)) addFailure(entry.id, `missing visible term: ${term}`);
  }
  assertCurrentLabel(entry.id, html);
  assertNoDirectDownloadPromise(entry.id, html);
  checked.push(entry.file);
}

const generator = readText('tools/generate-public-redirects.mjs');
for (const term of ['routeSpecificMarkupFor', '181103 首页直达入口', '181103 题库直达入口', '181103 资料直达入口']) {
  if (!generator.includes(term)) addFailure('generator', `missing generator term: ${term}`);
}
if (!generator.includes("'/index-complete'")) {
  addFailure('generator', 'does not treat /index-complete as a styled fallback');
}
checked.push('tools/generate-public-redirects.mjs');

const siteUpdates = JSON.parse(readText('site-updates.json'));
const current = siteUpdates[0] || {};
if (current.version !== expectedVersion) addFailure('site-updates', `top version is ${current.version || '(missing)'}`);
if (current.previousVersion !== previous181103Base) addFailure('site-updates', `previousVersion is ${current.previousVersion || '(missing)'}`);
if (current.tag !== 'Round380') addFailure('site-updates', `tag is ${current.tag || '(missing)'}`);
if (current.evidence?.currentRound !== 380) addFailure('site-updates', `currentRound is ${current.evidence?.currentRound ?? '(missing)'}`);
for (const term of ['181103 522 全题网站验收', '381 默认练习', '141 线索', 'no-download']) {
  if (!String(current.evidence?.requiredTerms || '').includes(term)) {
    addFailure('site-updates', `requiredTerms missing ${term}`);
  }
}
checked.push('site-updates.json');

const payload = {
  pass: failures.length === 0,
  expectedVersion,
  previous181103Base,
  checked,
  failures
};

console.log(JSON.stringify(payload, null, 2));
if (failures.length) process.exit(1);
