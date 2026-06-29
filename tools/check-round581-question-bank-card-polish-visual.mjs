#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round581 } from './round581-question-bank-card-polish-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round581-question-bank-card-polish-visual-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round581 visual QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const qaUser = {
  username: 'round581-card-polish-student',
  name: 'Round581 Card Polish QA',
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

async function trialClick(locator) {
  try {
    await locator.click({ trial: true, timeout: 5000 });
    return true;
  } catch (_) {
    return false;
  }
}

async function evaluateFocusPage(browser, port, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  await installAuth(page);
  const diagnostics = wirePageDiagnostics(page);
  const href = `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${encodeURIComponent(round581.version)}#questionBanksList`;
  await page.goto(localUrl(port, href), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.qb-card--round581[data-bank-id="181103-material-extracted"]', { state: 'visible', timeout: 30000 });
  await page.waitForTimeout(4700);

  const cardLocator = page.locator('.qb-card--round581[data-bank-id="181103-material-extracted"]').first();
  const primaryLocator = cardLocator.locator('.qb-card-actions a, .qb-card-actions button').first();
  const statusLocator = cardLocator.locator('[data-round428-answer-status-action="current"]').first();
  const favoriteLocator = cardLocator.locator('.qb-favorite-btn').first();
  const clickTrials = {
    primary: await trialClick(primaryLocator),
    status: await trialClick(statusLocator),
    favorite: await trialClick(favoriteLocator)
  };

  const screenshot = path.join(qaDir, `round581-question-bank-card-${viewport.name}.png`);
  const firstView = path.join(qaDir, `round581-question-bank-card-${viewport.name}-firstview.png`);
  await page.screenshot({ path: firstView, fullPage: false });
  await page.screenshot({ path: screenshot, fullPage: true });

  const result = await page.evaluate(({ version, viewport, screenshot, firstView }) => {
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const bodyHtml = document.body.innerHTML;
    const card = document.querySelector('.qb-card--round581[data-bank-id="181103-material-extracted"]');
    const cardText = (card?.innerText || '').replace(/\s+/g, ' ').trim();
    const header = card?.querySelector('.qb-card-header');
    const title = card?.querySelector('.qb-card-title');
    const desc = card?.querySelector('.qb-card-desc');
    const chipGrid = card?.querySelector('.qb-chip-grid');
    const actions = card?.querySelector('.qb-card-actions');
    const statusCards = card?.querySelectorAll('[data-round428-181103-answer-status-card="1"]') || [];
    const statusActions = card?.querySelectorAll('[data-round428-answer-status-action="current"]') || [];
    const fallbackCards = Array.from(document.querySelectorAll('[data-qb-initial-fallback="181103-material-extracted"]'))
      .filter((node) => {
        const r = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return r.width > 0 && r.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      });
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
    const cardRect = card?.getBoundingClientRect();
    const headerRect = header?.getBoundingClientRect();
    const cardOverflowNodes = card && cardRect ? Array.from(card.querySelectorAll('*')).flatMap((node) => {
      if (!visible(node)) return [];
      const r = node.getBoundingClientRect();
      if (r.left >= cardRect.left - 1 && r.right <= cardRect.right + 1) return [];
      return [{
        selector: selectorOf(node),
        left: Math.round(r.left - cardRect.left),
        right: Math.round(r.right - cardRect.right),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 100)
      }];
    }).slice(0, 10) : [];
    const cardTouchFailures = card ? Array.from(card.querySelectorAll('a, button')).flatMap((node) => {
      if (!visible(node)) return [];
      const r = node.getBoundingClientRect();
      if (r.width >= 44 && r.height >= 44) return [];
      return [{
        selector: selectorOf(node),
        width: Math.round(r.width),
        height: Math.round(r.height),
        text: (node.innerText || node.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 80)
      }];
    }).slice(0, 10) : [];
    const firstAction = card?.querySelector('.qb-card-actions a, .qb-card-actions button');
    const statusAction = card?.querySelector('[data-round428-answer-status-action="current"]');
    const favoriteButton = card?.querySelector('.qb-favorite-btn');
    const actionCenterHits = [firstAction, statusAction, favoriteButton].map((node) => {
      if (!node || !visible(node)) return false;
      let r = node.getBoundingClientRect();
      try {
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        const top = window.scrollY + r.top - Math.max(0, (window.innerHeight - r.height) / 2);
        window.scrollTo(0, Math.max(0, top));
      } catch (_) {}
      r = node.getBoundingClientRect();
      const target = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return Boolean(target && (target === node || node.contains(target)));
    });
    const styles = {
      titleFontSize: title ? Number.parseFloat(getComputedStyle(title).fontSize) : null,
      descFontSize: desc ? Number.parseFloat(getComputedStyle(desc).fontSize) : null,
      headerHeight: headerRect ? Math.round(headerRect.height) : null,
      cardTop: cardRect ? Math.round(cardRect.top) : null,
      cardHeight: cardRect ? Math.round(cardRect.height) : null
    };
    return {
      viewport,
      screenshot,
      firstView,
      versionPresent: bodyText.includes(version) && bodyHtml.includes(version),
      dynamicRound581CardVisible: visible(card),
      fallbackVisibleCount: fallbackCards.length,
      titleVisible: visible(title),
      descVisible: visible(desc),
      chipGridVisible: visible(chipGrid),
      actionsVisible: visible(actions),
      statusCards: statusCards.length,
      statusActions: statusActions.length,
      cardHasBoundaryText: cardText.includes('181103')
        && cardText.includes('400 可直接参考')
        && cardText.includes('0 道待人工源页复核')
        && cardText.includes('122')
        && cardText.includes('strictAnswerPdfProof=0'),
      headerCompact: styles.headerHeight !== null && styles.headerHeight <= (viewport.width <= 375 ? 82 : 92),
      readableType: styles.titleFontSize >= 15 && styles.descFontSize >= 13,
      noCardHorizontalOverflow: cardOverflowNodes.length === 0,
      cardOverflowNodes,
      cardTouchFailures,
      actionCenterHits,
      noStaleVisibleCounts: !/(145 深补|153 深补|真题深度补答累计 145|381 练习|141 源文|132 条参考答案页|Round572 重证 6 道|edge_refresh=round580-question-bank-focus-polish-20260629)/.test(bodyText),
      styles
    };
  }, { version: round581.version, viewport, screenshot, firstView });

  await page.close();
  return { ...result, clickTrials, ...diagnostics };
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
      { name: 'desktop', width: 1280, height: 900 },
      { name: 'mobile', width: 375, height: 667 },
      { name: 'narrow', width: 320, height: 667 }
    ];
    const focusResults = [];
    for (const viewport of viewports) {
      focusResults.push(await evaluateFocusPage(browser, port, viewport));
    }
    const checks = [];
    const pushCheck = (name, pass, detail = {}) => checks.push({ name, pass: Boolean(pass), detail });
    for (const result of focusResults) {
      pushCheck(`Round581 dynamic card visible ${result.viewport.name}`, result.dynamicRound581CardVisible && result.fallbackVisibleCount === 0, {
        fallbackVisibleCount: result.fallbackVisibleCount
      });
      pushCheck(`Round581 card content readable ${result.viewport.name}`, result.titleVisible
        && result.descVisible
        && result.chipGridVisible
        && result.actionsVisible
        && result.cardHasBoundaryText
        && result.headerCompact
        && result.readableType, {
        styles: result.styles,
        cardHasBoundaryText: result.cardHasBoundaryText
      });
      pushCheck(`Round581 status unique ${result.viewport.name}`, result.statusCards === 1 && result.statusActions === 1, {
        statusCards: result.statusCards,
        statusActions: result.statusActions
      });
      pushCheck(`Round581 card no overflow ${result.viewport.name}`, result.noCardHorizontalOverflow && result.cardTouchFailures.length === 0, {
        overflowNodes: result.cardOverflowNodes,
        touchFailures: result.cardTouchFailures
      });
      pushCheck(`Round581 actions clickable ${result.viewport.name}`, Object.values(result.clickTrials).every(Boolean)
        && result.actionCenterHits.every(Boolean), {
        clickTrials: result.clickTrials,
        actionCenterHits: result.actionCenterHits
      });
      pushCheck(`Round581 version and no stale visible counts ${result.viewport.name}`, result.versionPresent && result.noStaleVisibleCounts, {
        versionPresent: result.versionPresent,
        noStaleVisibleCounts: result.noStaleVisibleCounts
      });
      pushCheck(`Round581 page diagnostics clean ${result.viewport.name}`, result.pageErrors.length === 0, {
        pageErrors: result.pageErrors,
        consoleMessages: result.consoleMessages.slice(0, 8)
      });
    }
    const payload = {
      ok: checks.every((row) => row.pass),
      version: round581.version,
      previousVersion: round581.previousVersion,
      generatedAt: new Date().toISOString(),
      port,
      checks,
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
