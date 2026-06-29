#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round584 } from './round584-question-bank-home-density-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round584-question-bank-home-density-visual-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round584 visual QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const qaUser = {
  username: 'round584-home-density-student',
  name: 'Round584 Home Density QA',
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
  const contextOptions = { viewport: { width: viewport.width, height: viewport.height } };
  if (viewport.reducedMotion) contextOptions.reducedMotion = 'reduce';
  const page = await browser.newPage(contextOptions);
  await installAuth(page);
  const diagnostics = wirePageDiagnostics(page);
  await page.goto(localUrl(port, `/question-bank-home.html?edge_refresh=${encodeURIComponent(round584.version)}`), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('[data-round584-home-density="reader-workbench"]', { state: 'visible', timeout: 30000 });
  await page.waitForTimeout(600);

  const screenshot = path.join(qaDir, `round584-question-bank-home-${viewport.name}.png`);
  const firstView = path.join(qaDir, `round584-question-bank-home-${viewport.name}-firstview.png`);
  await page.screenshot({ path: firstView, fullPage: false });
  await page.screenshot({ path: screenshot, fullPage: true });

  const result = await page.evaluate(({ version, viewport, screenshot, firstView }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const bodyHtml = document.body.innerHTML;
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const visible = (node) => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden' && rect.bottom > 0 && rect.right > 0;
    };
    const selectorOf = (node) => {
      const tag = node.tagName.toLowerCase();
      const id = node.id ? `#${node.id}` : '';
      const classes = String(node.className || '').split(/\s+/).filter(Boolean).slice(0, 3).map((name) => `.${name}`).join('');
      return `${tag}${id}${classes}`;
    };
    const majorSelectors = [
      '.workbench-topline',
      '.workbench-summary',
      '.round385-181103-main-entry',
      '.round573-flow-rail',
      '.toolbar-more',
      '.round351-mobile-shortcuts',
      '.intent-panel',
      '.section-title',
      '.grid',
      '.panel'
    ];
    const majorRects = majorSelectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)).map((node) => {
      const rect = node.getBoundingClientRect();
      return { selector, top: rect.top, bottom: rect.bottom, height: rect.height };
    }).filter((rect) => rect.bottom > -1 && rect.top < innerHeight * 2.2)).sort((a, b) => a.top - b.top);
    const majorGaps = [];
    let cursor = 0;
    for (const rect of majorRects) {
      const top = Math.max(0, rect.top);
      if (top > cursor) majorGaps.push(Math.round(top - cursor));
      cursor = Math.max(cursor, rect.bottom);
    }
    const maxMajorGap = majorGaps.length ? Math.max(...majorGaps) : 0;
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
    const touchFailures = Array.from(document.querySelectorAll('a, button, summary')).flatMap((node) => {
      if (!visible(node)) return [];
      const rect = node.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return [];
      if (rect.width >= 44 && rect.height >= 44) return [];
      return [{
        selector: selectorOf(node),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80)
      }];
    }).slice(0, 16);
    const interactiveEarlyCount = Array.from(document.querySelectorAll('a, button, summary')).filter((node) => {
      if (!visible(node)) return false;
      const rect = node.getBoundingClientRect();
      return rect.top >= -1 && rect.top < innerHeight && rect.width >= 24 && rect.height >= 24;
    }).length;
    const summary = document.querySelector('[data-round584-home-density="reader-workbench"]');
    const entry = document.querySelector('[data-round584-primary-entry="181103"]');
    const primaryAction = document.querySelector('[data-round582-primary-action="181103"]');
    const summaryRect = summary?.getBoundingClientRect();
    const entryRect = entry?.getBoundingClientRect();
    const primaryRect = primaryAction?.getBoundingClientRect();
    return {
      viewport,
      screenshot,
      firstView,
      versionPresent: bodyText.includes(version) && bodyHtml.includes(version),
      pageMarker: document.body.getAttribute('data-round584-home-density-page') === '1',
      summaryVisible: visible(summary),
      entryVisible: visible(entry),
      primaryActionVisible: visible(primaryAction),
      primaryActionInFirstViewport: Boolean(primaryRect && primaryRect.top < innerHeight),
      summaryHeight: summaryRect ? Math.round(summaryRect.height) : null,
      entryTop: entryRect ? Math.round(entryRect.top) : null,
      entryNearTop: Boolean(entryRect && entryRect.top < innerHeight * (viewport.width <= 390 ? 1.7 : 1.15)),
      interactiveEarlyCount,
      maxMajorGap,
      majorGaps,
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
      noStaleVisibleCounts: !/(145 深补|153 深补|真题深度补答累计 145|381 练习|141 源文|132 条参考答案页|edge_refresh=round583-question-bank-interaction-a11y-20260630)/.test(bodyText),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      overflowNodes,
      touchFailures
    };
  }, { version: round584.version, viewport, screenshot, firstView });

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
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'mobile', width: 390, height: 844 },
      { name: 'narrow320', width: 320, height: 740 },
      { name: 'reduced320', width: 320, height: 740, reducedMotion: true }
    ];
    const results = [];
    for (const viewport of viewports) {
      results.push(await evaluateHomePage(browser, port, viewport));
    }

    const checks = [];
    const pushCheck = (name, pass, detail = {}) => checks.push({ name, pass: Boolean(pass), detail });
    for (const result of results) {
      const earlyTarget = result.viewport.width <= 390 ? 4 : 8;
      const gapTarget = result.viewport.width <= 390 ? 24 : 36;
      pushCheck(`Round584 home markers visible ${result.viewport.name}`,
        result.versionPresent
        && result.pageMarker
        && result.summaryVisible
        && result.entryVisible
        && result.primaryActionVisible,
        {
          versionPresent: result.versionPresent,
          pageMarker: result.pageMarker,
          summaryHeight: result.summaryHeight,
          entryTop: result.entryTop
        });
      pushCheck(`Round584 first viewport density ${result.viewport.name}`,
        result.primaryActionInFirstViewport
        && result.entryNearTop
        && result.interactiveEarlyCount >= earlyTarget
        && result.maxMajorGap <= gapTarget,
        {
          primaryActionInFirstViewport: result.primaryActionInFirstViewport,
          entryNearTop: result.entryNearTop,
          interactiveEarlyCount: result.interactiveEarlyCount,
          earlyTarget,
          gapTarget,
          maxMajorGap: result.maxMajorGap,
          majorGaps: result.majorGaps
        });
      pushCheck(`Round584 route inventory preserved ${result.viewport.name}`,
        result.routeInventory.summaryActions === 4
        && result.routeInventory.entryActions === 3
        && result.routeInventory.flowRail === 4
        && result.routeInventory.mobileShortcuts === 6
        && result.routeInventory.intentLinks >= 12
        && result.routeInventory.cards >= 6,
        result.routeInventory);
      pushCheck(`Round584 counts and boundary visible ${result.viewport.name}`,
        result.countsVisible && result.boundaryVisible && result.noStaleVisibleCounts,
        {
          countsVisible: result.countsVisible,
          boundaryVisible: result.boundaryVisible,
          noStaleVisibleCounts: result.noStaleVisibleCounts
        });
      pushCheck(`Round584 home no overflow and touch targets ${result.viewport.name}`,
        !result.horizontalOverflow
        && result.overflowNodes.length === 0
        && result.touchFailures.length === 0,
        {
          horizontalOverflow: result.horizontalOverflow,
          overflowNodes: result.overflowNodes,
          touchFailures: result.touchFailures
        });
      pushCheck(`Round584 home diagnostics clean ${result.viewport.name}`,
        result.pageErrors.length === 0 && result.consoleMessages.length === 0,
        { pageErrors: result.pageErrors, consoleMessages: result.consoleMessages });
    }

    const ok = checks.every((row) => row.pass);
    const report = {
      ok,
      version: round584.version,
      previousVersion: round584.previousVersion,
      generatedAt: new Date().toISOString(),
      results,
      checks
    };
    fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    if (!ok) process.exit(1);
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
