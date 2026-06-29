#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round578 } from './round578-real-exam-answer-depth-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const chromeExecutable = process.env.CHROME_EXECUTABLE || '';
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round578-real-exam-answer-render-visual-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round578 visual QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const qaUser = {
  username: 'round578-answer-render-student',
  name: 'Round578 Answer Render QA',
  role: 'student',
  access: 'active',
  status: 'active'
};

const samples = [
  { id: 'ocean-2010-01-08', year: '2010', snippet: 'Stokes 阻力', screenshot: true },
  { id: 'ocean-2013-04', year: '2013', snippet: '涡管强度守恒', screenshot: true }
];

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

function localUrl(port, rel) {
  const normalized = String(rel || '').startsWith('/') ? rel : `/${rel}`;
  return `http://127.0.0.1:${port}${normalized}`;
}

function createServer() {
  return http.createServer((req, res) => {
    const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname === '/api/auth/me') {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, authenticated: true, user: qaUser }));
      return;
    }
    if (pathname.startsWith('/api/progress') || pathname.startsWith('/api/stats') || pathname.startsWith('/api/study-progress')) {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, noMutationRead: true, user: qaUser }));
      return;
    }
    if (pathname === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    if (pathname === '/') pathname = '/index.html';
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

async function evaluateSample(browser, port, sample) {
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  await installAuth(page);
  const consoleMessages = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      const text = message.text();
      if (!/favicon|Failed to load resource.*404/.test(text)) consoleMessages.push({ type: message.type(), text });
    }
  });
  page.on('pageerror', (error) => pageErrors.push({ message: error.message }));

  const href = `/modules/practice-dynamic.html?type=real&exam=${sample.year}-real-exam&year=${sample.year}&q=${encodeURIComponent(sample.id)}&edge_refresh=${encodeURIComponent(round578.version)}`;
  await page.goto(localUrl(port, href), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.question-card', { state: 'visible', timeout: 30000 });
  await page.getByText('查看答案').last().click();
  await page.waitForFunction((snippet) => document.body.innerText.includes(snippet), sample.snippet, { timeout: 20000 });
  await page.waitForTimeout(350);

  const screenshot = sample.screenshot ? path.join(qaDir, `round578-real-answer-render-${sample.id}.png`) : '';
  if (screenshot) await page.screenshot({ path: screenshot, fullPage: true });

  const result = await page.evaluate(({ id, snippet, version, screenshot }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const answerPanel = document.querySelector('#answerDisplay,.answer-comparison,.result-display');
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    return {
      id,
      screenshot,
      url: window.location.href,
      hasQuestionCard: Boolean(document.querySelector('.question-card')),
      hasAnswerPanel: Boolean(answerPanel),
      versionPresent: bodyText.includes(version) || window.location.href.includes(version),
      answerSnippetVisible: bodyText.includes(snippet),
      strictBoundaryVisible: /参考答案|答案对比|strict|PDF/.test(bodyText),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      textPreview: bodyText.slice(0, 260)
    };
  }, { id: sample.id, snippet: sample.snippet, version: round578.version, screenshot });
  await page.close();
  return { ...result, consoleMessages, pageErrors };
}

const server = createServer();
const port = await listen(server);
let browser;
let results = [];
try {
  browser = await chromium.launch({
    headless: true,
    ...(chromeExecutable ? { executablePath: chromeExecutable } : {})
  });
  for (const sample of samples) results.push(await evaluateSample(browser, port, sample));
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const report = {
  ok: results.every((row) => row.hasQuestionCard
    && row.hasAnswerPanel
    && row.versionPresent
    && row.answerSnippetVisible
    && row.strictBoundaryVisible
    && !row.horizontalOverflow
    && row.pageErrors.length === 0),
  version: round578.version,
  generatedAt: new Date().toISOString(),
  results
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
