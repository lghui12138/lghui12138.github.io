#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round586 } from './round586-practice-answer-workbench-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round586-practice-answer-workbench-visual-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round586 visual QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const qaUser = {
  username: 'round586-practice-answer-student',
  name: 'Round586 Practice Answer QA',
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
    if (pathname === '/') pathname = '/modules/practice-dynamic.html';
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
      if (!/favicon|Failed to load resource.*404|MathJax|SmartModelSelector/.test(text)) consoleMessages.push({ type: message.type(), text });
    }
  });
  page.on('pageerror', (error) => pageErrors.push({ message: error.message }));
  return { consoleMessages, pageErrors };
}

async function revealAnswer(page, scenario) {
  if (scenario.kind === 'subjective') {
    await page.waitForSelector('.answer-input', { state: 'visible', timeout: 30000 });
    await page.fill('.answer-input', scenario.answer || '先列条件，再写控制方程，最后闭合结论。');
    await page.locator('button').filter({ hasText: '查看答案' }).first().click();
    await page.waitForSelector('.answer-comparison', { state: 'visible', timeout: 30000 });
    await page.waitForSelector('[data-round586-practice-answer-boundary="comparison"]', { state: 'visible', timeout: 30000 });
    if (scenario.expect181103) {
      await page.waitForSelector('[data-round586-practice-answer-boundary="181103"]', { state: 'visible', timeout: 30000 });
    }
    return;
  }
  await page.waitForSelector('.question-card', { state: 'visible', timeout: 30000 });
  const option = page.locator('.option-label').first();
  if (await option.count()) await option.click();
  await page.locator('button').filter({ hasText: '提交答案' }).first().click();
  await page.waitForSelector('.result-display', { state: 'visible', timeout: 30000 });
  await page.waitForSelector('[data-round586-practice-answer-boundary="result"]', { state: 'visible', timeout: 30000 });
}

async function evaluateScenario(browser, port, viewport, scenario) {
  const contextOptions = { viewport: { width: viewport.width, height: viewport.height } };
  if (viewport.reducedMotion) contextOptions.reducedMotion = 'reduce';
  const page = await browser.newPage(contextOptions);
  await installAuth(page);
  const diagnostics = wirePageDiagnostics(page);
  const url = localUrl(port, `${scenario.path}${scenario.path.includes('?') ? '&' : '?'}edge_refresh=${encodeURIComponent(round586.version)}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('[data-round586-practice-answer-workbench="top"]', { state: 'visible', timeout: 30000 });
  await page.waitForSelector('.question-card', { state: 'visible', timeout: 30000 });
  await revealAnswer(page, scenario);
  await page.waitForTimeout(900);

  const screenshot = path.join(qaDir, `round586-practice-answer-${scenario.name}-${viewport.name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });

  const result = await page.evaluate(({ version, viewport, scenario, screenshot }) => {
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
    const workbench = document.querySelector('[data-round586-practice-answer-workbench="top"]');
    const questionCard = document.querySelector('.question-card');
    const comparison = document.querySelector('.answer-comparison');
    const resultPanel = document.querySelector('.result-display');
    const materialReference = document.querySelector('[data-181103-reference-panel="1"]');
    const comparisonBoundary = document.querySelector('[data-round586-practice-answer-boundary="comparison"]');
    const resultBoundary = document.querySelector('[data-round586-practice-answer-boundary="result"]');
    const materialBoundary = document.querySelector('[data-round586-practice-answer-boundary="181103"]');
    const majorSelectors = [
      '.page-title',
      '.round586-practice-answer-workbench',
      '.question-card',
      '.answer-comparison',
      '.result-display',
      '.material-reference-panel'
    ];
    const majorRects = majorSelectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)).map((node) => {
      const rect = node.getBoundingClientRect();
      return { selector, top: rect.top, bottom: rect.bottom, height: rect.height };
    }).filter((rect) => rect.bottom > -1 && rect.top < innerHeight * 1.4)).sort((a, b) => a.top - b.top);
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
      if (rect.top > innerHeight * 1.6) return [];
      if (rect.left >= -1 && rect.right <= innerWidth + 1) return [];
      return [{
        selector: selectorOf(node),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 100)
      }];
    }).slice(0, 18);
    const touchFailures = Array.from(document.querySelectorAll('a, button, summary, .option-label')).flatMap((node) => {
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
    return {
      viewport,
      scenario: scenario.name,
      screenshot,
      url: window.location.href,
      versionPresent: bodyText.includes(version) || bodyHtml.includes(version) || window.location.href.includes(version),
      pageMarker: document.body.getAttribute('data-round586-practice-answer-page') === '1',
      workbenchPresent: Boolean(workbench),
      workbenchVisible: visible(workbench),
      questionCardVisible: visible(questionCard),
      answerComparisonVisible: visible(comparison),
      resultPanelVisible: visible(resultPanel),
      materialReferenceVisible: visible(materialReference),
      comparisonBoundaryVisible: visible(comparisonBoundary),
      resultBoundaryVisible: visible(resultBoundary),
      materialBoundaryVisible: visible(materialBoundary),
      boundaryTextVisible: bodyText.includes('strictAnswerPdfProof=0')
        && bodyText.includes('参考答案')
        && bodyText.includes('证明题'),
      countTextVisible: bodyText.includes('400')
        && bodyText.includes('122')
        && bodyText.includes('422')
        && bodyText.includes('163')
        && bodyText.includes('353/353'),
      noStaleVisibleCounts: !/(381 道独立题进入刷题|141 条参考答案页|edge_refresh=round585-real-exam-workbench-density-20260630)/.test(bodyHtml),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      maxMajorGap: majorGaps.length ? Math.max(...majorGaps) : 0,
      majorGaps,
      overflowNodes,
      touchFailures
    };
  }, { version: round586.version, viewport, scenario, screenshot });

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
        name: 'real-subjective',
        kind: 'subjective',
        path: '/modules/practice-dynamic.html?type=real&exam=2018-real-exam&year=2018&mode=normal&q=ocean-2018-04-02',
        answer: '由连续方程和边界条件列式，再与参考答案逐项核对。'
      },
      {
        name: 'material-181103',
        kind: 'subjective',
        path: '/modules/practice-dynamic.html?bank=181103-material-extracted',
        answer: '流点是连续介质假设下的流体微团，空间点是固定几何位置。',
        expect181103: true
      }
    ];

    const results = [];
    for (const scenario of scenarios) {
      for (const viewport of viewports) {
        results.push(await evaluateScenario(browser, port, viewport, scenario));
      }
    }

    const checks = [];
    const pushCheck = (name, pass, detail = {}) => checks.push({ name, pass: Boolean(pass), detail });
    for (const result of results) {
      const gapTarget = result.viewport.width <= 390 ? 42 : 58;
      pushCheck(`Round586 page and answer markers visible ${result.scenario} ${result.viewport.name}`,
        result.versionPresent
        && result.pageMarker
        && result.workbenchPresent
        && result.questionCardVisible
        && (result.answerComparisonVisible || result.resultPanelVisible || result.materialReferenceVisible)
        && (result.comparisonBoundaryVisible || result.resultBoundaryVisible || result.materialBoundaryVisible)
        && (!result.scenario.includes('181103') || (result.materialReferenceVisible && result.materialBoundaryVisible)),
        {
          versionPresent: result.versionPresent,
          pageMarker: result.pageMarker,
          workbenchPresent: result.workbenchPresent,
          workbenchVisible: result.workbenchVisible,
          answerComparisonVisible: result.answerComparisonVisible,
          resultPanelVisible: result.resultPanelVisible,
          materialReferenceVisible: result.materialReferenceVisible,
          materialBoundaryVisible: result.materialBoundaryVisible
        });
      pushCheck(`Round586 counts and boundaries visible ${result.scenario} ${result.viewport.name}`,
        result.boundaryTextVisible
        && result.countTextVisible
        && result.noStaleVisibleCounts,
        {
          boundaryTextVisible: result.boundaryTextVisible,
          countTextVisible: result.countTextVisible,
          noStaleVisibleCounts: result.noStaleVisibleCounts
        });
      pushCheck(`Round586 density overflow touch ${result.scenario} ${result.viewport.name}`,
        !result.horizontalOverflow
        && result.overflowNodes.length === 0
        && result.touchFailures.length === 0
        && result.maxMajorGap <= gapTarget,
        {
          horizontalOverflow: result.horizontalOverflow,
          overflowNodes: result.overflowNodes,
          touchFailures: result.touchFailures,
          maxMajorGap: result.maxMajorGap,
          gapTarget: gapTarget
        });
      pushCheck(`Round586 diagnostics clean ${result.scenario} ${result.viewport.name}`,
        result.pageErrors.length === 0 && result.consoleMessages.length === 0,
        { pageErrors: result.pageErrors, consoleMessages: result.consoleMessages });
    }

    const ok = checks.every((row) => row.pass);
    const report = {
      ok,
      version: round586.version,
      previousVersion: round586.previousVersion,
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
