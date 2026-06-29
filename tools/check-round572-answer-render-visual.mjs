#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round572, realExamUpgrades, proofDepthRewrites181103 } from './round572-answer-depth-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const chromeExecutable = process.env.CHROME_EXECUTABLE || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round572-answer-render-visual-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run answer-render QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.gz', 'application/gzip']
]);

const qaUser = {
  username: 'round572-answer-render-student',
  name: 'Round572 Answer Render QA',
  role: 'student',
  access: 'active',
  status: 'active'
};

const realExamBrowserSamples = [
  { id: 'ocean-2020-02-01', snippet: '迹线是同一流体质点' },
  { id: 'ocean-2012-05-02', snippet: '虹吸管最高点' },
  { id: 'ocean-2019-03-01', snippet: '正压流体指密度' },
  { id: 'ocean-2021-01-full', snippet: '速度梯度张量分解' }
];

const proofBrowserSnippets = new Map([
  ['181103-material-extracted-0015', '半径平方不变'],
  ['181103-material-extracted-0427', '不变量校验'],
  ['181103-material-extracted-0087', '水平抛射'],
  ['181103-material-extracted-0491', '复对数支路'],
  ['181103-material-extracted-0086', '修正式'],
  ['181103-material-extracted-0009', '矩形双曲线']
]);

function abs(rel) {
  return path.join(repoRoot, rel);
}

function readText(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function stripHtml(value) {
  return String(value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function yearFromRealExamId(id) {
  const match = id.match(/^ocean-(\d{4})-/);
  if (!match) throw new Error(`Cannot parse year from ${id}`);
  return match[1];
}

function localUrl(port, rel) {
  const normalized = String(rel || '').startsWith('/') ? rel : `/${rel}`;
  return `http://127.0.0.1:${port}${normalized}`;
}

function createServer() {
  return http.createServer((req, res) => {
    const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname === '/api/auth/me') {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, authenticated: true, user: qaUser }));
      return;
    }
    if (pathname.startsWith('/api/progress') || pathname.startsWith('/api/study-progress')) {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, progress: null, user: qaUser }));
      return;
    }
    if (pathname === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    const target = path.resolve(repoRoot, `.${pathname}`);
    if (!target.startsWith(repoRoot)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(target, (error, body) => {
      if (error) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        res.end(`not found ${pathname}`);
        return;
      }
      res.writeHead(200, { 'content-type': contentTypes.get(path.extname(target)) || 'application/octet-stream' });
      res.end(body);
    });
  });
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

async function installAuth(page) {
  await page.addInitScript((user) => {
    const now = Date.now();
    const session = {
      version: 2,
      issuedAt: now,
      expiresAt: now + 8 * 60 * 60 * 1000,
      lastActive: now,
      origin: window.location.origin,
      user
    };
    window.localStorage.setItem('fm_session_v2', JSON.stringify(session));
    window.localStorage.setItem('fm_auth_session_v2', JSON.stringify(session));
    window.localStorage.setItem('fluidMechanicsUser', JSON.stringify(user));
    window.localStorage.setItem('currentUser', JSON.stringify(user));
    window.localStorage.setItem('currentUsername', user.username);
  }, qaUser);
}

async function checkRealExamAnswer(browser, port, sample, index) {
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  await installAuth(page);
  const consoleMessages = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on('pageerror', (error) => pageErrors.push({ message: error.message }));

  const year = yearFromRealExamId(sample.id);
  const href = `/modules/practice-dynamic.html?type=real&exam=${year}-real-exam&year=${year}&q=${encodeURIComponent(sample.id)}&edge_refresh=${encodeURIComponent(round572.version)}`;
  await page.goto(localUrl(port, href), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.question-card', { state: 'visible', timeout: 30000 });
  await page.getByText('查看答案').last().click();
  await page.waitForFunction((snippet) => document.body.innerText.includes(snippet), sample.snippet, { timeout: 15000 });
  await page.waitForTimeout(450);

  const screenshot = index === 0 ? path.join(qaDir, `round572-real-answer-render-${sample.id}.png`) : '';
  if (screenshot) await page.screenshot({ path: screenshot, fullPage: true });

  const result = await page.evaluate(({ id, snippet, version, screenshot }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    return {
      id,
      screenshot,
      url: window.location.href,
      hasQuestionCard: Boolean(document.querySelector('.question-card')),
      hasResultPanel: Boolean(document.querySelector('.result-display,.answer-comparison')),
      versionPresent: bodyText.includes(version) || window.location.href.includes(version),
      answerSnippetVisible: bodyText.includes(snippet),
      strictBoundaryVisible: /标准答案|答案对比/.test(bodyText),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      textPreview: bodyText.slice(0, 320)
    };
  }, { id: sample.id, snippet: sample.snippet, version: round572.version, screenshot });
  await page.close();
  return { ...result, consoleMessages, pageErrors };
}

async function check181103ProofAnswer(browser, port, item, index) {
  const bank = readJson('question-banks/181103-material-extracted.json');
  const row = bank.find((entry) => entry.id === item.id);
  const rel = row?.round372SourceMaterialHtmlPath || row?.sourceRelPath || row?.sourceHtmlUrl;
  const snippet = proofBrowserSnippets.get(item.id);
  if (!rel || !snippet) {
    return { id: item.id, ok: false, reason: 'missing_rel_or_snippet' };
  }

  const page = await browser.newPage({ viewport: { width: 1024, height: 820 } });
  const consoleMessages = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text() });
    }
  });
  page.on('pageerror', (error) => pageErrors.push({ message: error.message }));

  await page.goto(`${localUrl(port, rel)}#${item.id}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const article = page.locator(`[id="${item.id}"]`);
  await article.waitFor({ state: 'attached', timeout: 15000 });
  await article.scrollIntoViewIfNeeded();
  await page.waitForFunction(({ id, snippet }) => {
    const node = document.getElementById(id);
    return Boolean(node && node.innerText.includes(snippet));
  }, { id: item.id, snippet }, { timeout: 15000 });
  await page.waitForTimeout(250);

  const screenshot = index === 0 ? path.join(qaDir, `round572-181103-answer-render-${item.id}.png`) : '';
  if (screenshot) await article.screenshot({ path: screenshot });

  const result = await article.evaluate((node, { id, snippet, version, screenshot }) => {
    const details = node.querySelector('.material-question-card__answer');
    const answer = node.querySelector('[data-round388-reference-answer-body="1"]');
    const rect = node.getBoundingClientRect();
    return {
      id,
      screenshot,
      sourceUrl: window.location.href,
      articleVisible: rect.width > 0 && rect.height > 0,
      answerOpen: Boolean(details?.open),
      answerBodyVisible: Boolean(answer && answer.offsetParent),
      round572Summary: /Round572 proof-depth/.test(details?.querySelector('summary')?.innerText || ''),
      answerSnippetVisible: (answer?.innerText || '').includes(snippet),
      answerLength: (answer?.innerText || '').replace(/\s+/g, ' ').trim().length,
      versionPresent: document.body.innerText.includes(version),
      sourceLedger400: document.body.innerText.includes('400 默认练习') && document.body.innerText.includes('122 源文线索'),
      articleOverflow: node.scrollWidth > node.clientWidth + 1
    };
  }, { id: item.id, snippet, version: round572.version, screenshot });
  await page.close();
  return { ...result, consoleMessages, pageErrors };
}

const realDataRows = realExamUpgrades.map((item) => {
  const year = yearFromRealExamId(item.id);
  const pack = readJson(`question-banks/real-exam-years/${year}.json`);
  const row = (pack.questions || []).find((question) => question.id === item.id);
  return {
    id: item.id,
    exists: Boolean(row),
    round572: row?.round572AnswerDepthUpgrade === true,
    answerVisibleDataReady: stripHtml(row?.answer || '').length >= 450,
    trust: row?.answerTrustState,
    strict: row?.strictAnswerPdfProof
  };
});

const server = createServer();
const port = await listen(server);
let browser;
let realBrowserRows = [];
let proofBrowserRows = [];

try {
  browser = await chromium.launch({ headless: true, executablePath: chromeExecutable });
  for (let i = 0; i < realExamBrowserSamples.length; i += 1) {
    realBrowserRows.push(await checkRealExamAnswer(browser, port, realExamBrowserSamples[i], i));
  }
  for (let i = 0; i < proofDepthRewrites181103.length; i += 1) {
    proofBrowserRows.push(await check181103ProofAnswer(browser, port, proofDepthRewrites181103[i], i));
  }
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const ok = realDataRows.every((row) => row.exists && row.round572 && row.answerVisibleDataReady && row.trust === 'reference-answer-derived-verified' && row.strict === false)
  && realBrowserRows.every((row) => row.hasQuestionCard && row.hasResultPanel && row.versionPresent && row.answerSnippetVisible && row.strictBoundaryVisible && !row.horizontalOverflow && row.pageErrors.length === 0)
  && proofBrowserRows.every((row) => row.articleVisible && row.answerOpen && row.answerBodyVisible && row.round572Summary && row.answerSnippetVisible && row.answerLength >= 650 && row.versionPresent && row.sourceLedger400 && !row.articleOverflow && row.pageErrors.length === 0);

const report = {
  ok,
  version: round572.version,
  generatedAt: new Date().toISOString(),
  chromeExecutable,
  summary: {
    realExamDataRows: realDataRows.length,
    realExamBrowserSamples: realBrowserRows.length,
    proofBrowserRows: proofBrowserRows.length
  },
  realDataRows,
  realBrowserRows,
  proofBrowserRows
};

const text = `${JSON.stringify(report, null, 2)}\n`;
fs.writeFileSync(outJson, text);
fs.writeFileSync(`${outJson}.gz`, zlib.gzipSync(Buffer.from(text)));
console.log(text);
if (!ok) process.exit(1);
