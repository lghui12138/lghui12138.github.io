#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round585 } from './round585-real-exam-workbench-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round585-real-exam-workbench-visual-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round585 visual QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const qaUser = {
  username: 'round585-real-exam-workbench-student',
  name: 'Round585 Real Exam Workbench QA',
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
    if (pathname === '/') pathname = '/modules/real-exams-dynamic.html';
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
      if (!/favicon|Failed to load resource.*404|MathJax/.test(text)) consoleMessages.push({ type: message.type(), text });
    }
  });
  page.on('pageerror', (error) => pageErrors.push({ message: error.message }));
  return { consoleMessages, pageErrors };
}

async function evaluateRealExamPage(browser, port, viewport) {
  const contextOptions = { viewport: { width: viewport.width, height: viewport.height } };
  if (viewport.reducedMotion) contextOptions.reducedMotion = 'reduce';
  const page = await browser.newPage(contextOptions);
  await installAuth(page);
  const diagnostics = wirePageDiagnostics(page);
  await page.goto(localUrl(port, `/modules/real-exams-dynamic.html?edge_refresh=${encodeURIComponent(round585.version)}`), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('[data-round585-real-exam-workbench="answer-proof-strip"]', { state: 'visible', timeout: 30000 });
  await page.waitForSelector('#cards', { state: 'visible', timeout: 30000 });
  await page.waitForFunction(() => {
    const cards = document.querySelector('#cards');
    return cards && (cards.querySelector('.card') || /没有找到|读取真题索引|加载/.test(cards.textContent || ''));
  }, null, { timeout: 30000 });
  await page.waitForTimeout(900);

  const screenshot = path.join(qaDir, `round585-real-exam-workbench-${viewport.name}.png`);
  const firstView = path.join(qaDir, `round585-real-exam-workbench-${viewport.name}-firstview.png`);
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
    const workbench = document.querySelector('[data-round585-real-exam-workbench="answer-proof-strip"]');
    const hero = document.querySelector('[data-round585-real-exam-workbench="hero"]');
    const panel = document.querySelector('.hero .panel');
    const cards = document.querySelector('#cards');
    const boundaryNote = document.querySelector('#answerEvidenceBoundaryNote');
    const sourceNote = document.querySelector('#sourceGranularityNote');
    const workbenchRect = workbench?.getBoundingClientRect();
    const heroRect = hero?.getBoundingClientRect();
    const panelRect = panel?.getBoundingClientRect();
    const sourceRect = sourceNote?.getBoundingClientRect();
    const boundaryRect = boundaryNote?.getBoundingClientRect();
    const majorSelectors = [
      '.top',
      '.round351-mobile-shortcuts',
      '.round585-real-exam-workbench',
      '.exam-loop',
      '.hero',
      '.toolbar',
      '.fidelity-note',
      '#cards'
    ];
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
    const maxMajorGap = majorGaps.length ? Math.max(...majorGaps) : 0;
    const overflowNodes = Array.from(document.querySelectorAll('body *')).flatMap((node) => {
      if (!visible(node)) return [];
      const rect = node.getBoundingClientRect();
      if (rect.top > innerHeight * 1.4) return [];
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
    const interactiveEarlyCount = Array.from(document.querySelectorAll('a, button, summary, input, select')).filter((node) => {
      if (!visible(node)) return false;
      const rect = node.getBoundingClientRect();
      return rect.top >= -1 && rect.top < innerHeight && rect.width >= 24 && rect.height >= 24;
    }).length;
    return {
      viewport,
      screenshot,
      firstView,
      versionPresent: bodyText.includes(version) && bodyHtml.includes(version),
      pageMarker: document.body.getAttribute('data-round585-real-exam-workbench-page') === '1',
      workbenchVisible: visible(workbench),
      workbenchBeforeHero: Boolean(workbenchRect && heroRect && workbenchRect.bottom <= heroRect.top + 2),
      heroVisible: visible(hero),
      panelVisible: visible(panel),
      panelNaturalHeight: panelRect ? Math.round(panelRect.height) : null,
      heroTop: heroRect ? Math.round(heroRect.top) : null,
      heroHeight: heroRect ? Math.round(heroRect.height) : null,
      sourceNoteVisible: visible(sourceNote),
      sourceNoteTop: sourceRect ? Math.round(sourceRect.top) : null,
      boundaryNotePresent: Boolean(boundaryNote),
      boundaryNoteTop: boundaryRect ? Math.round(boundaryRect.top) : null,
      cardsPresent: Boolean(cards),
      cardsCount: document.querySelectorAll('#cards .card').length,
      interactiveEarlyCount,
      maxMajorGap,
      majorGaps,
      routeInventory: {
        shortcuts: document.querySelectorAll('.round351-mobile-shortcuts__grid a').length,
        workbenchActions: document.querySelectorAll('.round585-real-exam-workbench__actions a').length,
        workbenchMetrics: document.querySelectorAll('.round585-real-exam-workbench__metrics div').length,
        sourceLinks: document.querySelectorAll('a[href="#sourceGranularityNote"]').length,
        answerBoundaryLinks: document.querySelectorAll('a[href="#answerEvidenceBoundaryNote"]').length,
        cardLinks: document.querySelectorAll('a[href="#cards"]').length
      },
      countsVisible: bodyText.includes('325')
        && bodyText.includes('68')
        && bodyText.includes('217')
        && bodyText.includes('163')
        && bodyText.includes('353/353'),
      boundaryVisible: bodyText.includes('strictAnswerPdfProof')
        && bodyText.includes('答案 PDF 逐字证据：0/353')
        && bodyText.includes('派生参考答案')
        && bodyText.includes('不等于官方逐字答案'),
      noStaleVisibleCounts: !/(145 深补|153 深补|真题深度补答累计 145|381 练习|141 源文|132 条参考答案页|edge_refresh=round584-question-bank-home-density-20260630)/.test(bodyHtml),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      overflowNodes,
      touchFailures
    };
  }, { version: round585.version, viewport, screenshot, firstView });

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
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 390, height: 844 },
      { name: 'narrow320', width: 320, height: 740 },
      { name: 'reduced320', width: 320, height: 740, reducedMotion: true }
    ];
    const results = [];
    for (const viewport of viewports) {
      results.push(await evaluateRealExamPage(browser, port, viewport));
    }

    const checks = [];
    const pushCheck = (name, pass, detail = {}) => checks.push({ name, pass: Boolean(pass), detail });
    for (const result of results) {
      const earlyTarget = result.viewport.width <= 390 ? 5 : 9;
      const gapTarget = result.viewport.width <= 390 ? 28 : 38;
      pushCheck(`Round585 real-exam markers visible ${result.viewport.name}`,
        result.versionPresent
        && result.pageMarker
        && result.workbenchVisible
        && result.workbenchBeforeHero
        && result.heroVisible
        && result.panelVisible,
        {
          versionPresent: result.versionPresent,
          pageMarker: result.pageMarker,
          workbenchBeforeHero: result.workbenchBeforeHero,
          heroTop: result.heroTop,
          panelNaturalHeight: result.panelNaturalHeight
        });
      pushCheck(`Round585 first viewport density ${result.viewport.name}`,
        result.interactiveEarlyCount >= earlyTarget
        && result.maxMajorGap <= gapTarget,
        {
          interactiveEarlyCount: result.interactiveEarlyCount,
          earlyTarget,
          maxMajorGap: result.maxMajorGap,
          gapTarget,
          majorGaps: result.majorGaps
        });
      pushCheck(`Round585 route inventory preserved ${result.viewport.name}`,
        result.routeInventory.shortcuts === 4
        && result.routeInventory.workbenchActions === 4
        && result.routeInventory.workbenchMetrics === 6
        && result.routeInventory.sourceLinks >= 5
        && result.routeInventory.answerBoundaryLinks >= 2
        && result.routeInventory.cardLinks >= 3,
        result.routeInventory);
      pushCheck(`Round585 counts and boundaries visible ${result.viewport.name}`,
        result.countsVisible
        && result.boundaryVisible
        && result.noStaleVisibleCounts
        && result.sourceNoteVisible
        && result.boundaryNotePresent,
        {
          countsVisible: result.countsVisible,
          boundaryVisible: result.boundaryVisible,
          noStaleVisibleCounts: result.noStaleVisibleCounts,
          sourceNoteTop: result.sourceNoteTop,
          boundaryNoteTop: result.boundaryNoteTop
        });
      pushCheck(`Round585 no overflow and touch targets ${result.viewport.name}`,
        !result.horizontalOverflow
        && result.overflowNodes.length === 0
        && result.touchFailures.length === 0,
        {
          horizontalOverflow: result.horizontalOverflow,
          overflowNodes: result.overflowNodes,
          touchFailures: result.touchFailures
        });
      pushCheck(`Round585 diagnostics clean ${result.viewport.name}`,
        result.pageErrors.length === 0 && result.consoleMessages.length === 0,
        { pageErrors: result.pageErrors, consoleMessages: result.consoleMessages });
    }

    const ok = checks.every((row) => row.pass);
    const report = {
      ok,
      version: round585.version,
      previousVersion: round585.previousVersion,
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
