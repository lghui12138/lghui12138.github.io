#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round575 } from './round575-workbench-polish-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const version = round575.version;
const chromeExecutable = process.env.CHROME_EXECUTABLE || '';
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round575-question-bank-home-visual-proof.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run visual QA from /Volumes/mac_2T during lifs isolation.');
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
  ['.gz', 'application/gzip']
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
        user: { username: 'round575-visual-student', role: 'student', access: 'active', status: 'active' }
      }));
      return;
    }
    if (pathname === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }
    if (pathname === '/') pathname = '/question-bank-home.html';
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

async function evaluatePage(page, viewport) {
  const screenshot = path.join(qaDir, `round575-question-bank-home-${viewport.name}.png`);
  const firstView = path.join(qaDir, `round575-question-bank-home-${viewport.name}-firstview.png`);
  await page.screenshot({ path: firstView, fullPage: false });
  await page.screenshot({ path: screenshot, fullPage: true });

  return page.evaluate(({ version, viewport, screenshot, firstView }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ');
    const innerWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const selectorOf = (node) => {
      const tag = node.tagName.toLowerCase();
      const id = node.id ? `#${node.id}` : '';
      const className = String(node.className || '').trim().split(/\s+/).filter(Boolean).slice(0, 3).map((name) => `.${name}`).join('');
      return `${tag}${id}${className}`;
    };
    const isVisible = (node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const overflowNodes = Array.from(document.querySelectorAll('body *')).flatMap((node) => {
      if (!isVisible(node)) return [];
      const rect = node.getBoundingClientRect();
      if (rect.right <= innerWidth + 1 && rect.left >= -1) return [];
      return [{
        selector: selectorOf(node),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 120)
      }];
    }).slice(0, 16);
    const internalOverflowNodes = Array.from(document.querySelectorAll('.workbench-topline *, .hero *, .round385-181103-main-entry *')).flatMap((node) => {
      if (!isVisible(node)) return [];
      const style = getComputedStyle(node);
      if (style.overflowX === 'visible') return [];
      if (node.scrollWidth <= node.clientWidth + 1) return [];
      return [{
        selector: selectorOf(node),
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 120)
      }];
    }).slice(0, 16);
    const touchTargetFailures = Array.from(document.querySelectorAll(
      '.workbench-topline a, .summary-actions a, .round385-181103-main-entry a, .toolbar-more summary, .status-details summary, .answer-boundary-details summary'
    )).flatMap((node) => {
      if (!isVisible(node)) return [];
      const rect = node.getBoundingClientRect();
      if (rect.width >= 44 && rect.height >= 44) return [];
      return [{
        selector: selectorOf(node),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80)
      }];
    });
    const topLine = document.querySelector('.workbench-topline')?.innerText.replace(/\s+/g, ' ').trim() || '';
    const topLineRect = document.querySelector('.workbench-topline')?.getBoundingClientRect();
    const primaryCtaRect = document.querySelector('.summary-actions a.primary')?.getBoundingClientRect();
    const mainEntry = document.querySelector('.round385-181103-main-entry');
    const flowRail = document.querySelector('.round573-flow-rail');
    const toolbar = document.querySelector('.toolbar-more');
    const proofChecklist = document.querySelector('.proof-checklist');
    const proofChecklistGrid = proofChecklist ? getComputedStyle(proofChecklist.querySelector('dl')).gridTemplateColumns : '';
    const mainBeforeFlow = Boolean(mainEntry && flowRail && (mainEntry.compareDocumentPosition(flowRail) & Node.DOCUMENT_POSITION_FOLLOWING));
    const flowBeforeToolbar = Boolean(flowRail && toolbar && (flowRail.compareDocumentPosition(toolbar) & Node.DOCUMENT_POSITION_FOLLOWING));
    return {
      viewport,
      screenshot,
      firstView,
      versionPresent: bodyText.includes(version),
      topLine,
      round575Visible: topLine.includes('Round575'),
      statusPillCount: document.querySelectorAll('.workbench-status-pill').length,
      topActionCount: document.querySelectorAll('.workbench-topline__actions a').length,
      reference400And122: /181103\s*400\/122/.test(topLine),
      proof422And6: /证\s*422\/6/.test(topLine),
      realExam145: /真\s*145/.test(topLine),
      strictPdfZero: /真\s*145\s*\/\s*PDF\s*0/.test(topLine),
      boundaryTextVisible: bodyText.includes('不是官方原卷逐字答案') && bodyText.includes('strictAnswerPdfProof 仍为 0'),
      rawPageHealthBoundaryVisible: bodyText.includes('raw pageHealth 不等于未通过项'),
      mainEntryVisible: Boolean(mainEntry?.offsetParent),
      mainBeforeFlow,
      flowBeforeToolbar,
      proofChecklistVisible: Boolean(proofChecklist?.offsetParent),
      proofChecklistTwoColumns: proofChecklistGrid.split(' ').length >= 2,
      primaryCtaVisibleInFirstScreen: Boolean(primaryCtaRect && primaryCtaRect.top >= 0 && primaryCtaRect.bottom <= window.innerHeight + 1),
      topLineHeight: topLineRect ? Math.round(topLineRect.height) : null,
      noOldCurrentCounts: !/381\s*可参考|141\s*源文线索|390 道默认|132 条源文|当前版本：Round574|当前发布：Round574/.test(bodyText),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      overflowNodes,
      internalOverflowNodes,
      touchTargetFailures
    };
  }, { version, viewport, screenshot, firstView });
}

const server = createServer();
const port = await listen(server);
const consoleMessages = [];
const pageErrors = [];
const results = [];
let browser;

try {
  browser = await chromium.launch({
    headless: true,
    ...(chromeExecutable ? { executablePath: chromeExecutable } : {})
  });
  const viewports = [
    { name: 'desktop', width: 1365, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 },
    { name: 'narrow320', width: 320, height: 667 },
    { name: 'narrow360', width: 360, height: 667 },
    { name: 'narrow390', width: 390, height: 844 }
  ];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    await page.addInitScript(() => {
      const now = Date.now();
      const user = { username: 'round575-visual-student', name: 'Round575 Visual QA', role: 'student' };
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
    page.on('console', (message) => {
      if (['error', 'warning'].includes(message.type())) {
        consoleMessages.push({ viewport: viewport.name, type: message.type(), text: message.text() });
      }
    });
    page.on('pageerror', (error) => pageErrors.push({ viewport: viewport.name, message: error.message }));
    await page.goto(`http://127.0.0.1:${port}/question-bank-home.html?edge_refresh=${version}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-round575-workbench-polish="1"]', { state: 'visible', timeout: 10000 });
    await page.evaluate(() => {
      document.documentElement.removeAttribute('data-auth-pending');
      document.querySelector('.auth-boot-fallback')?.remove();
    });
    await page.waitForTimeout(350);
    results.push(await evaluatePage(page, viewport));
    await page.close();
  }
} finally {
  if (browser) await browser.close();
  await new Promise((resolve) => server.close(resolve));
}

const ok = results.every((result) => (
  result.versionPresent
  && result.round575Visible
  && result.statusPillCount === 3
  && result.topActionCount === 3
  && result.reference400And122
  && result.proof422And6
  && result.realExam145
  && result.strictPdfZero
  && result.boundaryTextVisible
  && result.rawPageHealthBoundaryVisible
  && result.mainEntryVisible
  && result.mainBeforeFlow
  && result.flowBeforeToolbar
  && result.proofChecklistVisible
  && result.proofChecklistTwoColumns
  && result.primaryCtaVisibleInFirstScreen
  && result.topLineHeight <= (result.viewport.width <= 768 ? 170 : 92)
  && result.noOldCurrentCounts
  && !result.horizontalOverflow
  && result.overflowNodes.length === 0
  && result.internalOverflowNodes.length === 0
  && result.touchTargetFailures.length === 0
)) && consoleMessages.length === 0 && pageErrors.length === 0;

const report = {
  ok,
  version,
  generatedAt: new Date().toISOString(),
  results,
  consoleMessages,
  pageErrors
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
