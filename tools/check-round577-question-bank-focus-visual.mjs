#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round577, proofDepthRewrites181103 } from './round577-proof-depth-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const chromeExecutable = process.env.CHROME_EXECUTABLE || '';
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round577-question-bank-focus-visual-proof.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run visual QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const qaUser = {
  username: 'round577-visual-student',
  name: 'Round577 Visual QA',
  role: 'student',
  access: 'active',
  status: 'active'
};

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

function abs(rel) {
  return path.join(repoRoot, rel.replace(/^\/+/, ''));
}

function readText(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
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
      res.end(JSON.stringify({ ok: true, noMutationRead: true, cumulativeSourceOfTruth: 'server-progress-snapshot', user: qaUser }));
      return;
    }
    if (pathname === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    if (pathname === '/') pathname = '/modules/question-bank.html';
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

function localUrl(port, rel) {
  const normalized = String(rel || '').startsWith('/') ? rel : `/${rel}`;
  return `http://127.0.0.1:${port}${normalized}`;
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

async function evaluateFocusPage(browser, port, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  const consoleMessages = [];
  const pageErrors = [];
  await installAuth(page);
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      const text = message.text();
      if (!/favicon|Failed to load resource.*404/.test(text)) consoleMessages.push({ type: message.type(), text });
    }
  });
  page.on('pageerror', (error) => pageErrors.push({ message: error.message }));

  const href = `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${encodeURIComponent(round577.version)}#questionBanksList`;
  await page.goto(localUrl(port, href), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('[data-bank-id="181103-material-extracted"]', { state: 'visible', timeout: 30000 });
  await page.evaluate(() => {
    document.documentElement.removeAttribute('data-auth-pending');
  });
  await page.waitForTimeout(500);

  const screenshot = path.join(qaDir, `round577-question-bank-focus-${viewport.name}.png`);
  const firstView = path.join(qaDir, `round577-question-bank-focus-${viewport.name}-firstview.png`);
  await page.screenshot({ path: firstView, fullPage: false });
  await page.screenshot({ path: screenshot, fullPage: true });

  const result = await page.evaluate(({ version, viewport, screenshot, firstView }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const card = document.querySelector('[data-bank-id="181103-material-extracted"]');
    const list = document.getElementById('questionBanksList');
    const listSection = list?.closest('section');
    const rect = card?.getBoundingClientRect();
    const listRect = listSection?.getBoundingClientRect();
    const visible = (node) => {
      if (!node) return false;
      const r = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return r.width > 0 && r.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const selectorOf = (node) => {
      const tag = node.tagName.toLowerCase();
      const id = node.id ? `#${node.id}` : '';
      const classes = String(node.className || '').split(/\s+/).filter(Boolean).slice(0, 3).map((name) => `.${name}`).join('');
      return `${tag}${id}${classes}`;
    };
    const overflowNodes = Array.from(document.querySelectorAll('body *')).flatMap((node) => {
      if (node.id === 'curGlow' || node.classList.contains('wave') || node.closest('.ocean-bg')) return [];
      if (!visible(node)) return [];
      const r = node.getBoundingClientRect();
      if (r.left >= -1 && r.right <= innerWidth + 1) return [];
      return [{
        selector: selectorOf(node),
        left: Math.round(r.left),
        right: Math.round(r.right),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 100)
      }];
    }).slice(0, 12);
    const touchFailures = Array.from(document.querySelectorAll('#questionBanksList a, #questionBanksList button, .chapter-entry, .round342-search-hints a')).flatMap((node) => {
      if (!visible(node)) return [];
      const r = node.getBoundingClientRect();
      if (r.width >= 44 && r.height >= 44) return [];
      return [{ selector: selectorOf(node), width: Math.round(r.width), height: Math.round(r.height), text: (node.innerText || '').slice(0, 80) }];
    }).slice(0, 12);
    return {
      viewport,
      screenshot,
      firstView,
      versionPresent: bodyText.includes(version),
      htmlFocusAttribute: document.documentElement.getAttribute('data-round577-focus-entry'),
      focusPriority: listSection?.getAttribute('data-round577-focus-priority'),
      cardVisible: visible(card),
      cardTop: rect ? Math.round(rect.top) : null,
      cardBottom: rect ? Math.round(rect.bottom) : null,
      listSectionTop: listRect ? Math.round(listRect.top) : null,
      cardNearFirstViewport: Boolean(rect && rect.top < window.innerHeight * 0.72 && rect.bottom > 0),
      countsVisible: bodyText.includes('400 可直接参考') && bodyText.includes('122 源文线索') && bodyText.includes('522'),
      proofBoundaryVisible: bodyText.includes('strictAnswerPdfProof') || bodyText.includes('严格答案 PDF 证据仍单独为 0'),
      lowerEvidenceSectionsStillPresent: Boolean(document.getElementById('entry-181103-material-review') && document.querySelector('.enhanced-features')),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      overflowNodes,
      touchFailures,
      noStaleVisibleCounts: !/<b>381<\/b>练习|<b>141<\/b>源文|132 条参考答案页|Round576 直达壳一致、Round576/.test(document.body.innerHTML)
    };
  }, { version: round577.version, viewport, screenshot, firstView });
  await page.close();
  return { ...result, consoleMessages, pageErrors };
}

async function evaluateMaterialAnswer(browser, port) {
  const bank = readJson('question-banks/181103-material-extracted.json');
  const sample = proofDepthRewrites181103.find((item) => item.id === '181103-material-extracted-0201') || proofDepthRewrites181103[0];
  const row = bank.find((entry) => entry.id === sample.id);
  const rel = String(row?.round372SourceMaterialHtmlPath || row?.sourceRelPath || row?.sourceHtmlUrl || '').split('#')[0].replace(/^\/+/, '');
  const page = await browser.newPage({ viewport: { width: 1024, height: 820 } });
  await page.goto(`${localUrl(port, rel)}#${sample.id}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const article = page.locator(`[id="${sample.id}"]`);
  await article.waitFor({ state: 'attached', timeout: 15000 });
  await article.scrollIntoViewIfNeeded();
  await page.waitForSelector(`[id="${sample.id}"] [data-round577-proof-depth-rewrite="1"]`, { state: 'visible', timeout: 15000 });
  await page.waitForTimeout(250);
  const screenshot = path.join(qaDir, `round577-material-answer-${sample.id}.png`);
  await article.screenshot({ path: screenshot });
  const result = await article.evaluate((node, { id, screenshot }) => {
    const answer = node.querySelector('[data-round388-reference-answer-body="1"]');
    const details = node.querySelector('.material-question-card__answer');
    const rect = node.getBoundingClientRect();
    const answerText = answer?.innerText || '';
    const answerHtml = answer?.innerHTML || '';
    return {
      id,
      screenshot,
      articleVisible: rect.width > 0 && rect.height > 0,
      round577Summary: /Round577 二次重证/.test(details?.querySelector('summary')?.innerText || ''),
      answerVisible: Boolean(answer && answer.offsetParent),
      answerSnippetVisible: answerText.includes('c_g<c') || answerText.includes('割线斜率') || answerHtml.includes('c_g&lt;c'),
      noArticleOverflow: node.scrollWidth <= node.clientWidth + 1,
      answerLength: answerText.replace(/\s+/g, ' ').trim().length
    };
  }, { id: sample.id, screenshot });
  await page.close();
  return result;
}

const server = createServer();
const port = await listen(server);
let browser;
const focusResults = [];
let materialAnswerResult = null;

try {
  browser = await chromium.launch({
    headless: true,
    ...(chromeExecutable ? { executablePath: chromeExecutable } : {})
  });
  for (const viewport of [
    { name: 'desktop', width: 1365, height: 900 },
    { name: 'mobile', width: 375, height: 667 },
    { name: 'narrow320', width: 320, height: 667 }
  ]) {
    focusResults.push(await evaluateFocusPage(browser, port, viewport));
  }
  materialAnswerResult = await evaluateMaterialAnswer(browser, port);
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const focusOk = focusResults.every((result) => result.versionPresent
  && result.htmlFocusAttribute === '181103-material-extracted'
  && result.focusPriority === '1'
  && result.cardVisible
  && result.cardNearFirstViewport
  && result.countsVisible
  && result.proofBoundaryVisible
  && result.lowerEvidenceSectionsStillPresent
  && result.noStaleVisibleCounts
  && !result.horizontalOverflow
  && result.overflowNodes.length === 0
  && result.touchFailures.length === 0
  && result.pageErrors.length === 0);

const materialOk = Boolean(materialAnswerResult
  && materialAnswerResult.articleVisible
  && materialAnswerResult.round577Summary
  && materialAnswerResult.answerVisible
  && materialAnswerResult.answerSnippetVisible
  && materialAnswerResult.noArticleOverflow
  && materialAnswerResult.answerLength > 800);

const report = {
  ok: focusOk && materialOk,
  version: round577.version,
  generatedAt: new Date().toISOString(),
  focusResults,
  materialAnswerResult
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
