#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round580 } from './round580-question-bank-focus-polish-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const chromeExecutable = process.env.CHROME_EXECUTABLE || '';
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round580-question-bank-home-focus-visual-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round580 visual QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const qaUser = {
  username: 'round580-home-focus-student',
  name: 'Round580 Home Focus QA',
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
      res.end(JSON.stringify({ ok: true, noMutationRead: true, cumulativeSourceOfTruth: 'server-progress-snapshot', user: qaUser }));
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
  const href = `/question-bank-home.html?edge_refresh=${encodeURIComponent(round580.version)}`;
  await page.goto(localUrl(port, href), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('[data-round385-181103-main-entry="question-bank-home"]', { state: 'visible', timeout: 30000 });
  await page.waitForTimeout(500);

  const screenshot = path.join(qaDir, `round580-question-bank-home-${viewport.name}.png`);
  const firstView = path.join(qaDir, `round580-question-bank-home-${viewport.name}-firstview.png`);
  await page.screenshot({ path: firstView, fullPage: false });
  await page.screenshot({ path: screenshot, fullPage: true });

  const result = await page.evaluate(({ version, viewport, screenshot, firstView }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const bodyHtml = document.body.innerHTML;
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const entry = document.querySelector('[data-round385-181103-main-entry="question-bank-home"]');
    const proofStrip = document.querySelector('[data-round399-181103-home-answer-proof="1"]');
    const proofItems = Array.from(proofStrip?.querySelectorAll('span') || []);
    const primaryAction = document.querySelector('.round385-181103-main-entry__actions a[data-round385-primary]');
    const summary = document.querySelector('.workbench-summary.hero');
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
    const touchFailures = Array.from(document.querySelectorAll('a, button, summary')).flatMap((node) => {
      if (!visible(node)) return [];
      const r = node.getBoundingClientRect();
      if (r.width >= 44 && r.height >= 44) return [];
      return [{
        selector: selectorOf(node),
        width: Math.round(r.width),
        height: Math.round(r.height),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80)
      }];
    }).slice(0, 12);
    const entryRect = entry?.getBoundingClientRect();
    const summaryRect = summary?.getBoundingClientRect();
    const entryLimit = viewport.name === 'desktop' ? window.innerHeight * 1.18 : window.innerHeight * 2.15;
    return {
      viewport,
      screenshot,
      firstView,
      versionPresent: bodyText.includes(version),
      round580LedgerLinkPresent: bodyHtml.includes('data/fluid-round580-question-bank-focus-polish-ledger.json'),
      summaryVisible: visible(summary),
      summaryHeight: summaryRect ? Math.round(summaryRect.height) : null,
      entryVisible: visible(entry),
      entryTop: entryRect ? Math.round(entryRect.top) : null,
      entryBottom: entryRect ? Math.round(entryRect.bottom) : null,
      entryNearTop: Boolean(entryRect && entryRect.top < entryLimit && entryRect.bottom > 0),
      proofStripVisible: visible(proofStrip),
      proofStripItems: proofItems.length,
      proofStripHasCurrentBoundary: bodyText.includes('答案口径')
        && bodyText.includes('来源线索')
        && bodyText.includes('PDF 边界')
        && bodyText.includes('strictAnswerPdfProof 仍为 0'),
      proofBatchCurrent: bodyText.includes('Round577 二次重证 8 道') && !bodyText.includes('Round572 重证 6 道'),
      realExamDepthVisible: bodyText.includes('163 深补') || bodyText.includes('163 道已做过程型补答'),
      countsVisible: bodyText.includes('522/522')
        && bodyText.includes('400 道练习')
        && bodyText.includes('122 条源文线索')
        && bodyText.includes('422 道'),
      primaryActionVisible: visible(primaryAction),
      primaryActionText: (primaryAction?.innerText || '').replace(/\s+/g, ' ').trim(),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      overflowNodes,
      touchFailures,
      noStaleVisibleCounts: !/(145 深补|153 深补|381 练习|141 源文|132 条参考答案页|edge_refresh=round578-real-exam-answer-depth-eleventh-pass-20260629|edge_refresh=round577-181103-proof-depth-second-pass-20260629)/.test(bodyHtml)
    };
  }, { version: round580.version, viewport, screenshot, firstView });
  await page.close();
  return { ...result, ...diagnostics };
}

async function evaluateFocusPage(browser, port, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await installAuth(page);
  const diagnostics = wirePageDiagnostics(page);
  const href = `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${encodeURIComponent(round580.version)}#questionBanksList`;
  await page.goto(localUrl(port, href), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('[data-bank-id="181103-material-extracted"]', { state: 'visible', timeout: 30000 });
  await page.evaluate(() => {
    document.documentElement.removeAttribute('data-auth-pending');
  });
  await page.waitForTimeout(1200);

  const screenshot = path.join(qaDir, `round580-question-bank-focus-${viewport.name}.png`);
  const firstView = path.join(qaDir, `round580-question-bank-focus-${viewport.name}-firstview.png`);
  await page.screenshot({ path: firstView, fullPage: false });
  await page.screenshot({ path: screenshot, fullPage: true });

  const result = await page.evaluate(({ version, viewport, screenshot, firstView }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const bodyHtml = document.body.innerHTML;
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const card = document.querySelector('[data-bank-id="181103-material-extracted"]');
    const list = document.getElementById('questionBanksList');
    const listSection = list?.closest('section');
    const focusLanding = document.querySelector('[data-round580-focus-polish="question-bank-list"]');
    const rect = card?.getBoundingClientRect();
    const listRect = listSection?.getBoundingClientRect();
    const landingRect = focusLanding?.getBoundingClientRect();
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
      return [{
        selector: selectorOf(node),
        width: Math.round(r.width),
        height: Math.round(r.height),
        text: (node.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80)
      }];
    }).slice(0, 12);
    return {
      viewport,
      screenshot,
      firstView,
      versionPresent: bodyText.includes(version),
      htmlFocusAttribute: document.documentElement.getAttribute('data-round577-focus-entry'),
      focusPriority: listSection?.getAttribute('data-round577-focus-priority'),
      focusPolish: listSection?.getAttribute('data-round580-focus-polish'),
      focusLandingVisible: visible(focusLanding),
      focusLandingTop: landingRect ? Math.round(landingRect.top) : null,
      focusLandingComfortable: Boolean(landingRect && landingRect.top >= 72 && landingRect.top < window.innerHeight * 0.46),
      focusLandingText: (focusLanding?.innerText || '').replace(/\s+/g, ' ').trim(),
      cardVisible: visible(card),
      cardTop: rect ? Math.round(rect.top) : null,
      cardBottom: rect ? Math.round(rect.bottom) : null,
      listSectionTop: listRect ? Math.round(listRect.top) : null,
      cardNearFirstViewport: Boolean(rect && rect.top >= 72 && rect.top < window.innerHeight * 0.76 && rect.bottom > rect.top + 120),
      countsVisible: bodyText.includes('400 可直接参考')
        && bodyText.includes('122 源文线索')
        && bodyText.includes('522'),
      proofBoundaryVisible: bodyText.includes('Round577')
        && bodyText.includes('strictAnswerPdfProof=0')
        && bodyText.includes(version),
      lowerEvidenceSectionsStillPresent: Boolean(document.getElementById('entry-181103-material-review') && document.querySelector('.enhanced-features')),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      overflowNodes,
      touchFailures,
      noStaleVisibleCounts: !/(381 练习|141 源文|132 条参考答案页|145 深补|153 深补|edge_refresh=round578-real-exam-answer-depth-eleventh-pass-20260629|edge_refresh=round577-181103-proof-depth-second-pass-20260629)/.test(bodyHtml)
    };
  }, { version: round580.version, viewport, screenshot, firstView });
  await page.close();
  return { ...result, ...diagnostics };
}

const server = createServer();
const port = await listen(server);
let browser;
const homeResults = [];
const focusResults = [];

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
    homeResults.push(await evaluateHomePage(browser, port, viewport));
    focusResults.push(await evaluateFocusPage(browser, port, viewport));
  }
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const homeOk = homeResults.every((result) => result.versionPresent
  && result.round580LedgerLinkPresent
  && result.summaryVisible
  && result.entryVisible
  && result.entryNearTop
  && result.proofStripVisible
  && result.proofStripItems >= 3
  && result.proofStripHasCurrentBoundary
  && result.proofBatchCurrent
  && result.realExamDepthVisible
  && result.countsVisible
  && result.primaryActionVisible
  && /400 可参考/.test(result.primaryActionText)
  && result.noStaleVisibleCounts
  && !result.horizontalOverflow
  && result.overflowNodes.length === 0
  && result.touchFailures.length === 0
  && result.pageErrors.length === 0);

const focusOk = focusResults.every((result) => result.versionPresent
  && result.htmlFocusAttribute === '181103-material-extracted'
  && result.focusPriority === '1'
  && result.focusPolish === 'anchored-list'
  && result.focusLandingVisible
  && result.focusLandingComfortable
  && /181103 焦点/.test(result.focusLandingText)
  && /strictAnswerPdfProof=0/.test(result.focusLandingText)
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

const report = {
  ok: homeOk && focusOk,
  version: round580.version,
  generatedAt: new Date().toISOString(),
  homeResults,
  focusResults
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
