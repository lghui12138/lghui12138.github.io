#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round574 } from './round574-public-shell-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round574-public-shell-visual-proof.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round574 visual QA from /Volumes/mac_2T during lifs isolation.');
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
        user: { username: 'round574-visual-student', role: 'student', access: 'active', status: 'active' }
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
  const screenshot = path.join(qaDir, `round574-public-shell-${meta.name}-${viewport.name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  return page.evaluate(({ version, screenshot, viewport, meta }) => {
    const text = document.body.innerText.replace(/\s+/g, ' ');
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const targetLink = document.querySelector('#targetLink');
    return {
      name: meta.name,
      path: meta.path,
      viewport,
      screenshot,
      hasRound574ShellMarker: Boolean(document.querySelector('[data-round574-public-shell="1"]')),
      versionVisible: text.includes(version),
      currentCountsVisible: text.includes('400') && text.includes('122') && text.includes('422') && text.includes('145') && text.includes('strict 0'),
      noOldCurrentCopy: !/round55[0-9]-|round56[0-9]-|round57[0-3]-|381 道独立题进入刷题|141 条参考答案页|385 道已完成证明深修|380\+1/.test(text),
      compactRadius: getComputedStyle(document.querySelector('main')).borderRadius === '8px',
      targetHasRound574: targetLink?.getAttribute('href')?.includes(version) || false,
      routeChips: document.querySelectorAll('[data-round574-route]').length,
      horizontalOverflow: scrollWidth > innerWidth + 1
    };
  }, { version: round574.version, screenshot, viewport, meta });
}

async function evaluateQuestionBank(page, viewport) {
  const screenshot = path.join(qaDir, `round574-question-bank-home-${viewport.name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  return page.evaluate(({ version, screenshot, viewport }) => {
    const text = document.body.innerText.replace(/\s+/g, ' ');
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const overflowNodes = Array.from(document.querySelectorAll('body *')).flatMap((node) => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return [];
      if (rect.right <= innerWidth + 1 && rect.left >= -1) return [];
      return [{
        selector: `${node.tagName.toLowerCase()}${node.id ? `#${node.id}` : ''}`,
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').slice(0, 100)
      }];
    }).slice(0, 10);
    const offscreenSections = Array.from(document.querySelectorAll('.round351-mobile-shortcuts, .intent-panel, .grid, .panel'));
    return {
      viewport,
      screenshot,
      versionPresent: text.includes(version),
      round574Visible: text.includes('Round574'),
      publicShellSummary: Boolean(document.querySelector('[data-round574-public-shell-summary="1"]')),
      publicShellStrip: Boolean(document.querySelector('[data-round574-public-shell-strip="1"]')),
      countsVisible: /181103\s*400\s*可参考/.test(text)
        && /源文线索\s*122/.test(text)
        && /推导深修\s*422/.test(text)
        && /真题补答\s*145/.test(text)
        && /严格 PDF\s*0/.test(text),
      ledgerLinked: Boolean(document.querySelector('a[href="./data/fluid-round574-public-shell-freshness-ledger.json"]')),
      noContentVisibilityAuto: offscreenSections.every((node) => getComputedStyle(node).contentVisibility !== 'auto'),
      noOldCurrentCopy: !/真题补答\s*(110|122|133)|381\s*可参考|141\s*源文线索|381练习|141线索/.test(text),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      overflowNodes
    };
  }, { version: round574.version, screenshot, viewport });
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
    { name: 'mobile', width: 375, height: 667 }
  ];
  const shellPages = [
    { name: 'edge-login', path: '/_edge-login/' },
    { name: 'knowledge', path: '/knowledge/' },
    { name: 'real-exams', path: '/real-exams.html' },
    { name: 'not-found', path: '/404.html' }
  ];
  for (const viewport of viewports) {
    for (const shell of shellPages) {
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:${port}${shell.path}?edge_refresh=${round574.version}`, { waitUntil: 'domcontentloaded' });
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
      const user = { username: 'round574-visual-student', name: 'Round574 Visual QA', role: 'student' };
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
    await page.goto(`http://127.0.0.1:${port}/question-bank-home.html?edge_refresh=${round574.version}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.workbench-topline__main', { state: 'visible', timeout: 10000 });
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
  result.hasRound574ShellMarker
  && result.versionVisible
  && result.currentCountsVisible
  && result.noOldCurrentCopy
  && result.compactRadius
  && result.targetHasRound574
  && result.routeChips === 4
  && !result.horizontalOverflow
)) && questionBankResults.every((result) => (
  result.versionPresent
  && result.round574Visible
  && result.publicShellSummary
  && result.publicShellStrip
  && result.countsVisible
  && result.ledgerLinked
  && result.noContentVisibilityAuto
  && result.noOldCurrentCopy
  && !result.horizontalOverflow
  && result.overflowNodes.length === 0
)) && consoleMessages.length === 0 && pageErrors.length === 0;

const report = {
  ok,
  version: round574.version,
  generatedAt: new Date().toISOString(),
  shellResults,
  questionBankResults,
  consoleMessages,
  pageErrors
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);
