#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round582 } from './round582-question-bank-home-polish-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round582-question-bank-home-polish-visual-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round582 visual QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const qaUser = {
  username: 'round582-home-polish-student',
  name: 'Round582 Home Polish QA',
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
    if (pathname === '/') pathname = '/question-bank-home.html';
    let target = path.resolve(repoRoot, `.${pathname}`);
    if (!target.startsWith(repoRoot)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
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

function wirePageDiagnostics(page) {
  const consoleMessages = [];
  const pageErrors = [];
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      const text = message.text();
      if (!/favicon|Failed to load resource.*404/.test(text)) consoleMessages.push({ type: message.type(), text });
    }
  });
  page.on('pageerror', (error) => pageErrors.push({ message: error.message }));
  return { consoleMessages, pageErrors };
}

async function evaluateHomePage(browser, port, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await installAuth(page);
  const diagnostics = wirePageDiagnostics(page);
  await page.goto(localUrl(port, `/question-bank-home.html?edge_refresh=${encodeURIComponent(round582.version)}`), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('[data-round582-home-polish="reader-workbench"]', { state: 'visible', timeout: 30000 });
  await page.waitForTimeout(600);

  const screenshot = path.join(qaDir, `round582-question-bank-home-${viewport.name}.png`);
  const firstView = path.join(qaDir, `round582-question-bank-home-${viewport.name}-firstview.png`);
  await page.screenshot({ path: firstView, fullPage: false });
  await page.screenshot({ path: screenshot, fullPage: true });

  const result = await page.evaluate(({ version, viewport, screenshot, firstView }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const bodyHtml = document.body.innerHTML;
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const visible = (node) => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const selectorOf = (node) => {
      const tag = node.tagName.toLowerCase();
      const id = node.id ? `#${node.id}` : '';
      const classes = String(node.className || '').split(/\s+/).filter(Boolean).slice(0, 3).map((name) => `.${name}`).join('');
      return `${tag}${id}${classes}`;
    };
    const overflowNodes = Array.from(document.querySelectorAll('body *')).flatMap((node) => {
      if (!visible(node)) return [];
      const rect = node.getBoundingClientRect();
      if (rect.left >= -1 && rect.right <= innerWidth + 1) return [];
      return [{
        selector: selectorOf(node),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 100)
      }];
    }).slice(0, 16);
    const internalOverflowNodes = Array.from(document.querySelectorAll('.workbench-topline *, .workbench-summary *, .round385-181103-main-entry *')).flatMap((node) => {
      if (!visible(node)) return [];
      const style = getComputedStyle(node);
      if (style.overflowX === 'visible') return [];
      if (node.scrollWidth <= node.clientWidth + 1) return [];
      return [{
        selector: selectorOf(node),
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 100)
      }];
    }).slice(0, 16);
    const touchFailures = Array.from(document.querySelectorAll('a, button, summary')).flatMap((node) => {
      if (!visible(node)) return [];
      const rect = node.getBoundingClientRect();
      if (rect.width >= 44 && rect.height >= 44) return [];
      return [{
        selector: selectorOf(node),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80)
      }];
    }).slice(0, 16);
    const topLine = document.querySelector('.workbench-topline');
    const summary = document.querySelector('[data-round582-home-polish="reader-workbench"]');
    const entry = document.querySelector('[data-round582-primary-entry="181103"]');
    const metricStrip = document.querySelector('.workbench-metric-strip');
    const primaryAction = document.querySelector('[data-round582-primary-action="181103"]');
    const summaryRect = summary?.getBoundingClientRect();
    const entryRect = entry?.getBoundingClientRect();
    const primaryRect = primaryAction?.getBoundingClientRect();
    return {
      viewport,
      screenshot,
      firstView,
      versionPresent: bodyText.includes(version) && bodyHtml.includes(version),
      pageMarker: document.body.getAttribute('data-round582-home-polish-page') === '1',
      topLineVisible: visible(topLine),
      summaryVisible: visible(summary),
      entryVisible: visible(entry),
      metricStripVisible: visible(metricStrip),
      metricStripItems: document.querySelectorAll('.workbench-metric-strip div').length,
      primaryActionVisible: visible(primaryAction),
      primaryActionInEarlyScreen: Boolean(primaryRect && primaryRect.top < window.innerHeight * (viewport.width <= 390 ? 1.25 : 1)),
      summaryHeight: summaryRect ? Math.round(summaryRect.height) : null,
      entryTop: entryRect ? Math.round(entryRect.top) : null,
      entryNearTop: Boolean(entryRect && entryRect.top < window.innerHeight * (viewport.width <= 390 ? 1.8 : 1.25)),
      routeInventory: {
        summaryActions: document.querySelectorAll('.summary-actions a').length,
        entryActions: document.querySelectorAll('.round385-181103-main-entry__actions a').length,
        flowRail: document.querySelectorAll('.round573-flow-rail a').length,
        mobileShortcuts: document.querySelectorAll('.round351-mobile-shortcuts__grid a').length,
        intentLinks: document.querySelectorAll('.intent-link').length,
        cards: document.querySelectorAll('.grid .card').length
      },
      countsVisible: bodyText.includes('400 可参考')
        && bodyText.includes('122 条源文线索')
        && bodyText.includes('422 道')
        && bodyText.includes('163 深补'),
      boundaryVisible: bodyText.includes('strictAnswerPdfProof 仍为 0')
        && bodyText.includes('不是官方原卷逐字答案')
        && bodyText.includes('Round577 二次重证 8 道'),
      noStaleVisibleCounts: !/(145 深补|153 深补|真题深度补答累计 145|381 练习|141 源文|132 条参考答案页|edge_refresh=round581-question-bank-card-polish-20260630)/.test(bodyText),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      overflowNodes,
      internalOverflowNodes,
      touchFailures
    };
  }, { version: round582.version, viewport, screenshot, firstView });

  await page.close();
  return { ...result, ...diagnostics };
}

async function evaluateFocusPage(browser, port, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await installAuth(page);
  const diagnostics = wirePageDiagnostics(page);
  await page.goto(localUrl(port, `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${encodeURIComponent(round582.version)}#questionBanksList`), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.qb-card--round581[data-bank-id="181103-material-extracted"]', { state: 'visible', timeout: 30000 });
  await page.waitForTimeout(1500);
  const result = await page.evaluate(({ version, viewport }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const bodyHtml = document.body.innerHTML;
    const card = document.querySelector('.qb-card--round581[data-bank-id="181103-material-extracted"]');
    const visible = (node) => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const innerWidth = window.innerWidth;
    return {
      viewport,
      versionPresent: bodyText.includes(version) && bodyHtml.includes(version),
      cardVisible: visible(card),
      cardBoundary: (card?.innerText || '').includes('400 可直接参考')
        && (card?.innerText || '').includes('strictAnswerPdfProof=0'),
      noStaleVisibleCounts: !/(145 深补|153 深补|381 练习|141 源文|132 条参考答案页|edge_refresh=round581-question-bank-card-polish-20260630)/.test(bodyText),
      horizontalOverflow: scrollWidth > innerWidth + 1
    };
  }, { version: round582.version, viewport });
  await page.close();
  return { ...result, ...diagnostics };
}

async function main() {
  const server = createServer();
  const port = await listen(server);
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_EXECUTABLE || undefined
  });
  try {
    const viewports = [
      { name: 'desktop', width: 1365, height: 900 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 375, height: 667 },
      { name: 'narrow320', width: 320, height: 667 }
    ];
    const homeResults = [];
    for (const viewport of viewports) {
      homeResults.push(await evaluateHomePage(browser, port, viewport));
    }
    const focusResults = [];
    for (const viewport of [
      { name: 'desktop', width: 1280, height: 900 },
      { name: 'mobile', width: 375, height: 667 },
      { name: 'narrow320', width: 320, height: 667 }
    ]) {
      focusResults.push(await evaluateFocusPage(browser, port, viewport));
    }

    const checks = [];
    const pushCheck = (name, pass, detail = {}) => checks.push({ name, pass: Boolean(pass), detail });
    for (const result of homeResults) {
      pushCheck(`Round582 home markers visible ${result.viewport.name}`, result.versionPresent
        && result.pageMarker
        && result.topLineVisible
        && result.summaryVisible
        && result.entryVisible
        && result.metricStripVisible
        && result.metricStripItems === 6
        && result.primaryActionVisible
        && result.primaryActionInEarlyScreen, {
        summaryHeight: result.summaryHeight,
        entryTop: result.entryTop,
        metricStripItems: result.metricStripItems
      });
      pushCheck(`Round582 route inventory preserved ${result.viewport.name}`, result.routeInventory.summaryActions === 4
        && result.routeInventory.entryActions === 3
        && result.routeInventory.flowRail === 4
        && result.routeInventory.mobileShortcuts === 6
        && result.routeInventory.intentLinks >= 12
        && result.routeInventory.cards >= 6, result.routeInventory);
      pushCheck(`Round582 counts and boundary visible ${result.viewport.name}`, result.countsVisible
        && result.boundaryVisible
        && result.noStaleVisibleCounts, {
        countsVisible: result.countsVisible,
        boundaryVisible: result.boundaryVisible,
        noStaleVisibleCounts: result.noStaleVisibleCounts
      });
      pushCheck(`Round582 home no overflow ${result.viewport.name}`, !result.horizontalOverflow
        && result.overflowNodes.length === 0
        && result.internalOverflowNodes.length === 0
        && result.touchFailures.length === 0, {
        overflowNodes: result.overflowNodes,
        internalOverflowNodes: result.internalOverflowNodes,
        touchFailures: result.touchFailures
      });
      pushCheck(`Round582 home diagnostics clean ${result.viewport.name}`, result.pageErrors.length === 0, {
        pageErrors: result.pageErrors,
        consoleMessages: result.consoleMessages.slice(0, 8)
      });
    }
    for (const result of focusResults) {
      pushCheck(`Round582 keeps Round581 card usable ${result.viewport.name}`, result.versionPresent
        && result.cardVisible
        && result.cardBoundary
        && result.noStaleVisibleCounts
        && !result.horizontalOverflow
        && result.pageErrors.length === 0, result);
    }
    const payload = {
      ok: checks.every((row) => row.pass),
      version: round582.version,
      previousVersion: round582.previousVersion,
      generatedAt: new Date().toISOString(),
      port,
      checks,
      homeResults,
      focusResults
    };
    fs.writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`);
    console.log(JSON.stringify(payload, null, 2));
    if (!payload.ok) process.exit(1);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
