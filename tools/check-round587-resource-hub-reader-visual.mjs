#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round587 } from './round587-resource-hub-reader-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round587-resource-hub-reader-visual-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round587 visual QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const qaUser = {
  username: 'round587-resource-hub-student',
  name: 'Round587 Resource Hub QA',
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
    if (pathname === '/') pathname = '/resources.html';
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
      if (!/favicon|Failed to load resource.*404|MathJax|SmartModelSelector|ResizeObserver/.test(text)) {
        consoleMessages.push({ type: message.type(), text });
      }
    }
  });
  page.on('pageerror', (error) => pageErrors.push({ message: error.message }));
  return { consoleMessages, pageErrors };
}

async function evaluatePage(browser, port, viewport, scenario) {
  const contextOptions = { viewport: { width: viewport.width, height: viewport.height } };
  if (viewport.reducedMotion) contextOptions.reducedMotion = 'reduce';
  const page = await browser.newPage(contextOptions);
  await installAuth(page);
  const diagnostics = wirePageDiagnostics(page);
  const url = localUrl(port, `${scenario.path}${scenario.path.includes('?') ? '&' : '?'}edge_refresh=${encodeURIComponent(round587.version)}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector(scenario.readySelector, { state: 'visible', timeout: 30000 });
  if (scenario.extraSelector) await page.waitForSelector(scenario.extraSelector, { state: 'visible', timeout: 30000 });
  await page.waitForTimeout(900);

  const screenshot = path.join(qaDir, `round587-resource-hub-${scenario.name}-${viewport.name}.png`);
  const firstView = path.join(qaDir, `round587-resource-hub-${scenario.name}-${viewport.name}-firstview.png`);
  await page.screenshot({ path: firstView, fullPage: false });
  await page.screenshot({ path: screenshot, fullPage: true });

  const result = await page.evaluate(({ version, viewport, scenario, screenshot, firstView }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const bodyHtml = document.body.innerHTML;
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const visible = (node) => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0 || rect.bottom <= 0 || rect.right <= 0) return false;
      for (let current = node; current && current.nodeType === 1; current = current.parentElement) {
        const style = getComputedStyle(current);
        const opacity = Number.parseFloat(style.opacity);
        if (style.display === 'none' || style.visibility === 'hidden' || opacity < 0.01) return false;
      }
      return true;
    };
    const selectorOf = (node) => {
      const tag = node.tagName.toLowerCase();
      const id = node.id ? `#${node.id}` : '';
      const classes = String(node.className || '').split(/\s+/).filter(Boolean).slice(0, 3).map((name) => `.${name}`).join('');
      return `${tag}${id}${classes}`;
    };
    const markerPresent = scenario.bodyMarker
      ? document.body.getAttribute(scenario.bodyMarker) === '1'
      : true;
    const command = document.querySelector(scenario.commandSelector);
    const boundary = document.querySelector(scenario.boundarySelector);
    const majorSelectors = scenario.majorSelectors;
    const majorRects = majorSelectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)).map((node) => {
      const rect = node.getBoundingClientRect();
      return { selector, top: rect.top, bottom: rect.bottom, height: rect.height };
    }).filter((rect) => rect.bottom > -1 && rect.top < innerHeight * 1.35)).sort((a, b) => a.top - b.top);
    const majorGaps = [];
    let cursor = 0;
    for (const rect of majorRects) {
      const top = Math.max(0, rect.top);
      if (top > cursor) majorGaps.push(Math.round(top - cursor));
      cursor = Math.max(cursor, rect.bottom);
    }
    const overflowNodes = Array.from(document.querySelectorAll('body *')).flatMap((node) => {
      if (!visible(node)) return [];
      const rect = node.getBoundingClientRect();
      if (rect.top > innerHeight * 1.45) return [];
      if (rect.left >= -1 && rect.right <= innerWidth + 1) return [];
      return [{
        selector: selectorOf(node),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 100)
      }];
    }).slice(0, 18);
    const touchFailures = Array.from(document.querySelectorAll('a, button, summary, input, select')).flatMap((node) => {
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
    }).slice(0, 18);
    const firstViewportText = Array.from(document.querySelectorAll('body *')).filter((node) => {
      if (!visible(node)) return false;
      const rect = node.getBoundingClientRect();
      return rect.top >= -1 && rect.top < innerHeight;
    }).map((node) => node.innerText || node.getAttribute('aria-label') || '').join(' ');
    return {
      viewport,
      scenario: scenario.name,
      screenshot,
      firstView,
      url: window.location.href,
      versionPresent: bodyText.includes(version) || bodyHtml.includes(version) || window.location.href.includes(version),
      markerPresent,
      commandVisible: visible(command),
      boundaryVisible: Boolean(boundary),
      countsVisible: ['38', '522', '400', '122', '422'].every((snippet) => bodyText.includes(snippet))
        && bodyText.includes('strictAnswerPdfProof')
        && bodyText.includes('0'),
      firstViewportUseful: ['38', '522', '400'].every((snippet) => firstViewportText.includes(snippet)),
      routeCount: document.querySelectorAll(scenario.routeSelector).length,
      materialCardCount: document.querySelectorAll('[data-round315-material-card]').length,
      searchVisible: visible(document.querySelector('#materialSearch')),
      noStaleVisibleCounts: !/(381 道独立题进入刷题|141 条参考答案页|edge_refresh=round586-practice-answer-workbench-20260630)/.test(bodyHtml),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      maxMajorGap: majorGaps.length ? Math.max(...majorGaps) : 0,
      majorGaps,
      overflowNodes,
      touchFailures
    };
  }, { version: round587.version, viewport, scenario, screenshot, firstView });

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
      { name: 'mobile390', width: 390, height: 844 },
      { name: 'mobile360', width: 360, height: 740 },
      { name: 'narrow320', width: 320, height: 568 },
      { name: 'reduced320', width: 320, height: 568, reducedMotion: true }
    ];
    const scenarios = [
      {
        name: 'resources',
        path: '/resources.html',
        readySelector: '[data-round587-resource-hub-reader="command-strip"]',
        extraSelector: '[data-round587-resource-boundary="181103"]',
        bodyMarker: 'data-round587-resource-hub-page',
        commandSelector: '[data-round587-resource-hub-reader="command-strip"]',
        boundarySelector: '[data-round587-resource-boundary="181103"]',
        routeSelector: '.round587-resource-command__actions a',
        majorSelectors: [
          '.top-bar',
          '.page-hero',
          '.round587-resource-command',
          '.round385-181103-main-entry',
          '.round351-mobile-shortcuts',
          '.round323-resource-finder'
        ]
      },
      {
        name: '181103-index',
        path: '/resources/fluid-181103-html/index.html',
        readySelector: '[data-round587-181103-index="route"]',
        extraSelector: '[data-round587-181103-index="boundary"]',
        bodyMarker: 'data-round587-181103-index-page',
        commandSelector: '[data-round587-181103-index="route"]',
        boundarySelector: '[data-round587-181103-index="boundary"]',
        routeSelector: '.round587-181103-index-actions a',
        majorSelectors: [
          '.top',
          'h1',
          '.sub',
          '.badges',
          '.round587-181103-index-command',
          '.round587-181103-index-boundary',
          '.panel',
          '.panel.index-tools',
          '.html-content'
        ]
      }
    ];

    const results = [];
    for (const scenario of scenarios) {
      for (const viewport of viewports) {
        results.push(await evaluatePage(browser, port, viewport, scenario));
      }
    }

    const checks = [];
    const pushCheck = (name, pass, detail = {}) => checks.push({ name, pass: Boolean(pass), detail });
    for (const result of results) {
      const gapTarget = result.viewport.width <= 390 ? 72 : 96;
      pushCheck(`Round587 markers visible ${result.scenario} ${result.viewport.name}`,
        result.versionPresent
        && result.markerPresent
        && result.commandVisible
        && result.boundaryVisible
        && result.routeCount >= 4,
        {
          versionPresent: result.versionPresent,
          markerPresent: result.markerPresent,
          commandVisible: result.commandVisible,
          boundaryVisible: result.boundaryVisible,
          routeCount: result.routeCount
        });
      pushCheck(`Round587 counts and first viewport useful ${result.scenario} ${result.viewport.name}`,
        result.countsVisible
        && result.firstViewportUseful
        && result.noStaleVisibleCounts,
        {
          countsVisible: result.countsVisible,
          firstViewportUseful: result.firstViewportUseful,
          noStaleVisibleCounts: result.noStaleVisibleCounts
        });
      pushCheck(`Round587 density overflow touch ${result.scenario} ${result.viewport.name}`,
        !result.horizontalOverflow
        && result.overflowNodes.length === 0
        && result.touchFailures.length === 0
        && result.maxMajorGap <= gapTarget,
        {
          horizontalOverflow: result.horizontalOverflow,
          overflowNodes: result.overflowNodes,
          touchFailures: result.touchFailures,
          maxMajorGap: result.maxMajorGap,
          gapTarget
        });
      pushCheck(`Round587 181103 index inventory ${result.scenario} ${result.viewport.name}`,
        result.scenario !== '181103-index'
        || (result.materialCardCount === round587.materialHtmlPages181103 && result.searchVisible),
        {
          materialCardCount: result.materialCardCount,
          searchVisible: result.searchVisible
        });
      pushCheck(`Round587 diagnostics clean ${result.scenario} ${result.viewport.name}`,
        result.pageErrors.length === 0 && result.consoleMessages.length === 0,
        { pageErrors: result.pageErrors, consoleMessages: result.consoleMessages });
    }

    const ok = checks.every((row) => row.pass);
    const report = {
      ok,
      version: round587.version,
      previousVersion: round587.previousVersion,
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
