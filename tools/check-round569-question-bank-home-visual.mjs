#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const version = 'round569-answer-depth-seventh-pass-workbench-proof-sync-20260629';
const chromeExecutable = process.env.CHROME_EXECUTABLE || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round569-question-bank-home-visual-proof.json');

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
        user: { username: 'round569-visual-student', role: 'student', access: 'active', status: 'active' }
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
  const screenshot = path.join(qaDir, `round569-question-bank-home-${viewport.name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  return page.evaluate(({ version, viewport, screenshot }) => {
    const topLine = document.querySelector('.workbench-topline__main')?.innerText.replace(/\s+/g, ' ').trim() || '';
    const bodyText = document.body.innerText.replace(/\s+/g, ' ');
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
        width: Math.round(rect.width),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 120)
      }];
    }).slice(0, 12);
    const evidenceStrip = document.querySelector('[data-release-evidence-strip="round569-auth-live"]');
    const proofStrip = document.querySelector('[data-round569-proof-audit-strip="1"]');
    const proofText = proofStrip?.innerText.replace(/\s+/g, ' ').trim() || '';
    return {
      viewport,
      screenshot,
      versionPresent: bodyText.includes(version),
      topLine,
      round569Visible: topLine.includes('Round569'),
      answerDepth110: /真题补答\s*110/.test(topLine),
      proofDepth422: /推导深修\s*422/.test(topLine),
      proofRewrite5: /重证\s*5/.test(topLine),
      reference400: /181103\s*400\s*可参考/.test(topLine),
      source122: /源文线索\s*122/.test(topLine),
      strictPdfZero: /严格 PDF\s*0/.test(topLine),
      proofStripVisible: Boolean(proofStrip?.offsetParent),
      proofStripCounts: /422/.test(proofText) && /5/.test(proofText) && /strict\s*0/i.test(proofText),
      evidenceStripVisible: Boolean(evidenceStrip?.offsetParent),
      noOldCurrentCounts: !/真题补答\s*98|推导深修\s*417|390\s*可参考|141\s*源文线索|381\s*可直接参考/.test(bodyText),
      horizontalOverflow: scrollWidth > innerWidth + 1,
      overflowNodes,
      statusPillCount: document.querySelectorAll('.workbench-status-pill').length,
      proofChecklistVisible: Boolean(document.querySelector('.proof-checklist')?.offsetParent),
      releaseChipVisible: Boolean(document.querySelector('.release-chip')?.offsetParent)
    };
  }, { version, viewport, screenshot });
}

const server = createServer();
const port = await listen(server);
const consoleMessages = [];
const pageErrors = [];
const results = [];
let browser;

try {
  browser = await chromium.launch({ headless: true, executablePath: chromeExecutable });
  const viewports = [
    { name: 'desktop', width: 1365, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 667 }
  ];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    await page.addInitScript(() => {
      const now = Date.now();
      const user = { username: 'round569-visual-student', name: 'Round569 Visual QA', role: 'student' };
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
    await page.waitForSelector('.workbench-topline__main', { state: 'visible', timeout: 10000 });
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
  && result.round569Visible
  && result.answerDepth110
  && result.proofDepth422
  && result.proofRewrite5
  && result.reference400
  && result.source122
  && result.strictPdfZero
  && result.proofStripVisible
  && result.proofStripCounts
  && result.evidenceStripVisible
  && result.noOldCurrentCounts
  && !result.horizontalOverflow
  && result.overflowNodes.length === 0
  && result.statusPillCount >= 6
  && result.proofChecklistVisible
  && result.releaseChipVisible
)) && consoleMessages.length === 0 && pageErrors.length === 0;

const report = {
  ok,
  version,
  generatedAt: new Date().toISOString(),
  chromeExecutable,
  results,
  consoleMessages,
  pageErrors
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);
