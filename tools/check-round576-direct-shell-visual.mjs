#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round576 } from './round576-direct-shell-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round576-direct-shell-visual-proof.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round576 visual QA from /Volumes/mac_2T during lifs isolation.');
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
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2']
]);

function createServer() {
  return http.createServer((req, res) => {
    const requestUrl = new URL(req.url || '/', 'http://127.0.0.1');
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname === '/api/auth/me') {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        ok: true,
        authenticated: true,
        user: { username: 'round576-visual-student', role: 'student', access: 'active', status: 'active' }
      }));
      return;
    }
    if (pathname === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    if (pathname === '/') pathname = '/question-bank-home.html';
    if (!path.extname(pathname)) pathname = `${pathname.replace(/\/$/, '')}/index.html`;
    const target = path.resolve(repoRoot, `.${pathname}`);
    if (!target.startsWith(repoRoot)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(target, (error, body) => {
      if (error) {
        res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('not found');
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

async function evaluateShell(page, meta, viewport) {
  const screenshot = path.join(qaDir, `round576-direct-shell-${meta.name}-${viewport.name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  return page.evaluate(({ version, screenshot, viewport, meta }) => {
    const text = document.body.innerText.replace(/\s+/g, ' ');
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const targetLink = document.querySelector('#targetLink') || document.querySelector('#mainLink');
    const stableLink = document.querySelector('#stableLink');
    return {
      name: meta.name,
      path: meta.path,
      viewport,
      screenshot,
      versionVisible: text.includes(version) || document.documentElement.outerHTML.includes(version),
      currentCountsVisible: text.includes('400') && text.includes('122') && text.includes('422') && text.includes('145'),
      strictBoundaryVisible: /strict\s*0|strictAnswerPdfProof/.test(text) || document.documentElement.outerHTML.includes('strict 0'),
      noOldRound574Runtime: !document.documentElement.outerHTML.includes('edge_refresh=round574-public-shell-freshness-flow-20260629'),
      targetHasRound576: targetLink?.getAttribute('href')?.includes(version) || false,
      stableHasRound576: !stableLink || stableLink.getAttribute('href')?.includes(version),
      horizontalOverflow: scrollWidth > innerWidth + 1
    };
  }, { version: round576.version, screenshot, viewport, meta });
}

async function evaluateQuestionBank(page, viewport) {
  const screenshot = path.join(qaDir, `round576-question-bank-home-${viewport.name}.png`);
  const firstView = path.join(qaDir, `round576-question-bank-home-${viewport.name}-firstview.png`);
  await page.screenshot({ path: firstView, fullPage: false });
  await page.screenshot({ path: screenshot, fullPage: true });
  return page.evaluate(({ version, screenshot, firstView, viewport }) => {
    const text = document.body.innerText.replace(/\s+/g, ' ');
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const primaryCtaRect = document.querySelector('.summary-actions a.primary')?.getBoundingClientRect();
    const touchTargetFailures = Array.from(document.querySelectorAll('.workbench-topline a, .summary-actions a, .round385-181103-main-entry a, summary')).flatMap((node) => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return [];
      if (rect.width >= 44 && rect.height >= 44) return [];
      return [{ tag: node.tagName, text: (node.innerText || '').replace(/\s+/g, ' ').slice(0, 80), width: Math.round(rect.width), height: Math.round(rect.height) }];
    });
    const internalOverflowNodes = Array.from(document.querySelectorAll('.workbench-topline *, .hero *, .round385-181103-main-entry *')).flatMap((node) => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return [];
      const style = getComputedStyle(node);
      if (style.overflowX === 'visible') return [];
      if (node.scrollWidth <= node.clientWidth + 1) return [];
      return [{ tag: node.tagName, text: (node.innerText || '').replace(/\s+/g, ' ').slice(0, 80), scrollWidth: node.scrollWidth, clientWidth: node.clientWidth }];
    }).slice(0, 12);
    return {
      viewport,
      screenshot,
      firstView,
      versionPresent: text.includes(version),
      round576Visible: text.includes('Round576'),
      compactStatus: /181103\s*400\/122/.test(text) && /证\s*422\/6/.test(text) && /真\s*145\s*\/\s*PDF\s*0/.test(text),
      currentLedgerLinked: Boolean(document.querySelector('a[href="./data/fluid-round576-direct-shell-consistency-ledger.json"]')),
      boundaryTextVisible: text.includes('不是官方原卷逐字答案') && text.includes('strictAnswerPdfProof 仍为 0'),
      primaryCtaVisibleInFirstScreen: Boolean(primaryCtaRect && primaryCtaRect.top >= 0 && primaryCtaRect.bottom <= window.innerHeight + 1),
      noOldCurrentCopy: !/当前版本：Round575|当前发布：Round575|381\s*可参考|141\s*源文线索|390 道默认|132 条源文/.test(text),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      internalOverflowNodes,
      touchTargetFailures
    };
  }, { version: round576.version, screenshot, firstView, viewport });
}

const server = createServer();
const port = await listen(server);
const browser = await chromium.launch({ headless: true });
const consoleMessages = [];
const pageErrors = [];
const shellResults = [];
const questionBankResults = [];

try {
  const viewports = [
    { name: 'desktop', width: 1365, height: 900 },
    { name: 'mobile', width: 375, height: 667 },
    { name: 'narrow320', width: 320, height: 667 }
  ];
  const shellPages = [
    { name: 'not-found', path: '/404.html' },
    { name: 'edge-login', path: '/_edge-login/' },
    { name: 'knowledge-alias', path: '/modules/knowledge-detail/' },
    { name: 'teacher-panel-alias', path: '/teacher-panel/' },
    { name: 'wu-reading', path: '/modules/wu-wangyi-fluid-reading.html' }
  ];

  for (const viewport of viewports) {
    for (const shell of shellPages) {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${port}${shell.path}?edge_refresh=${round576.version}`, { waitUntil: 'domcontentloaded' });
      shellResults.push(await evaluateShell(page, shell, viewport));
      await context.close();
    }

    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type())) consoleMessages.push({ viewport: viewport.name, type: message.type(), text: message.text() });
    });
    page.on('pageerror', (error) => pageErrors.push({ viewport: viewport.name, message: error.message }));
    await page.addInitScript(() => {
      const now = Date.now();
      const user = { username: 'round576-visual-student', name: 'Round576 Visual QA', role: 'student' };
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
    });
    await page.goto(`http://127.0.0.1:${port}/question-bank-home.html?edge_refresh=${round576.version}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-round576-direct-shell-consistency="1"]', { state: 'visible', timeout: 10000 });
    await page.evaluate(() => {
      document.documentElement.removeAttribute('data-auth-pending');
      document.querySelector('.auth-boot-fallback')?.remove();
    });
    await page.waitForTimeout(350);
    questionBankResults.push(await evaluateQuestionBank(page, viewport));
    await context.close();
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const ok = shellResults.every((result) => (
  result.versionVisible
  && result.currentCountsVisible
  && result.strictBoundaryVisible
  && result.noOldRound574Runtime
  && result.targetHasRound576
  && result.stableHasRound576
  && !result.horizontalOverflow
)) && questionBankResults.every((result) => (
  result.versionPresent
  && result.round576Visible
  && result.compactStatus
  && result.currentLedgerLinked
  && result.boundaryTextVisible
  && result.primaryCtaVisibleInFirstScreen
  && result.noOldCurrentCopy
  && !result.horizontalOverflow
  && result.internalOverflowNodes.length === 0
  && result.touchTargetFailures.length === 0
)) && consoleMessages.length === 0 && pageErrors.length === 0;

const report = {
  ok,
  version: round576.version,
  generatedAt: new Date().toISOString(),
  shellResults,
  questionBankResults,
  consoleMessages,
  pageErrors
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);
