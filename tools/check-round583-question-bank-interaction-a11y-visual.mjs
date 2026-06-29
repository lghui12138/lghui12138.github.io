#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { round583 } from './round583-question-bank-interaction-a11y-data.mjs';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledNodeModules = '/Users/kili/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const { chromium } = require(require.resolve('playwright', { paths: [process.env.NODE_PATH || bundledNodeModules] }));

const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round583-question-bank-interaction-a11y-visual-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round583 visual QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

const qaUser = {
  username: 'round583-question-bank-a11y-student',
  name: 'Round583 Question Bank QA',
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
    window.localStorage.setItem('favoriteBanks', JSON.stringify(['181103-material-extracted']));
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

async function evaluateQuestionBank(browser, port, viewport, reducedMotion = false) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
  if (reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' });
  await installAuth(page);
  const diagnostics = wirePageDiagnostics(page);
  await page.goto(localUrl(port, `/modules/question-bank.html?focus=181103-material-extracted&answer_status=current&edge_refresh=${encodeURIComponent(round583.version)}#questionBanksList`), { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.qb-card--181103[data-bank-id="181103-material-extracted"]', { state: 'visible', timeout: 30000 });
  await page.waitForTimeout(900);

  const screenshot = path.join(qaDir, `round583-question-bank-${viewport.name}${reducedMotion ? '-reduced' : ''}.png`);
  await page.screenshot({ path: screenshot, fullPage: false });

  const interaction = await page.evaluate(async ({ version }) => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
    const bodyText = document.body.innerText.replace(/\s+/g, ' ').trim();
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0);
    const overflowNodes = Array.from(document.querySelectorAll('body *')).flatMap((node) => {
      if (!visible(node)) return [];
      if (node.closest('[aria-hidden="true"]') || getComputedStyle(node).pointerEvents === 'none') return [];
      const rect = node.getBoundingClientRect();
      if (rect.left >= -1 && rect.right <= window.innerWidth + 1) return [];
      return [{ selector: selectorOf(node), left: Math.round(rect.left), right: Math.round(rect.right), text: (node.innerText || '').replace(/\s+/g, ' ').slice(0, 100) }];
    }).slice(0, 12);

    const smartButton = document.querySelector('[aria-controls="smartSearchArea"]');
    smartButton.click();
    await wait(180);
    const smartExpanded = smartButton.getAttribute('aria-expanded') === 'true'
      && visible(document.getElementById('smartSearchArea'));
    const smartInput = document.getElementById('smartSearchInput');
    const mainInput = document.getElementById('questionBankSearch');
    let filterCalls = 0;
    const originalApply = window.QuestionBankData.applyFilters;
    window.QuestionBankData.applyFilters = function(...args) {
      filterCalls += 1;
      return originalApply.apply(this, args);
    };
    smartInput.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
    smartInput.value = '18';
    smartInput.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: '18', isComposing: true }));
    await wait(180);
    const callsDuringComposition = filterCalls;
    smartInput.value = '181103';
    smartInput.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: '181103' }));
    await wait(220);
    const callsAfterComposition = filterCalls;
    const searchSynced = mainInput.value === '181103' && smartInput.value === '181103';
    window.QuestionBankData.applyFilters = originalApply;

    window.showNotification('Round583 A', 'info', 1200);
    window.showNotification('Round583 B', 'info', 1200);
    window.showNotification('Round583 C', 'info', 1200);
    window.showNotification('Round583 D', 'info', 1200);
    window.showNotification('Round583 D', 'info', 1200);
    const notificationCount = document.querySelectorAll('.notification').length;
    const notificationRepeated = Boolean(document.querySelector('.notification[data-round583-repeated="1"]'));

    document.getElementById('manageFavorites').click();
    await wait(180);
    const favoriteModal = document.getElementById('favoriteManagerModal');
    const favoritePanel = favoriteModal?.querySelector('.favorite-manager-panel');
    const favoriteModalVisible = visible(favoriteModal)
      && visible(favoritePanel)
      && favoriteModal.textContent.includes('181103')
      && favoriteModal.querySelectorAll('[data-favorite-action]').length >= 2;
    const favoriteOverflow = favoritePanel ? favoritePanel.scrollWidth > favoritePanel.clientWidth + 1 : true;
    window.QuestionBankData.closeFavoriteManager();
    await wait(80);

    await window.QuestionBankData.startPractice('181103-material-extracted');
    await wait(1400);
    const practiceDialog = document.querySelector('.practice-dialog');
    const currentBankData = window.currentBankData || {};
    const questions = Array.isArray(currentBankData.questions) ? currentBankData.questions : [];
    const defaults = Array.isArray(currentBankData.defaultPracticeQuestions) ? currentBankData.defaultPracticeQuestions : [];
    const cardKind = (q) => String((q && (q.sourceSemanticQuestionCardKind || q.round373QuestionCardKind || q.round372QuestionCardKind)) || '');
    const isCurrentPractice = (q) => {
      if (!q || typeof q !== 'object') return false;
      if (!(q.questionHtml || q.promptHtml)) return false;
      if (q.defaultPracticeEligible === false || q.practiceEntryEnabled === false || q.defaultHidden === true) return false;
      if (cardKind(q) === 'source-content-card') {
        return q.defaultPracticeEligible === true && q.practiceEntryEnabled === true && q.defaultHidden === false;
      }
      return q.sourceSemanticPracticeEligible !== false;
    };
    const sourceClues = questions.filter((q) => cardKind(q) === 'source-content-card' && !isCurrentPractice(q)).length;
    const defaultHasSourceClue = defaults.some((q) => cardKind(q) === 'source-content-card' && !isCurrentPractice(q));
    const practiceDialogVisible = Boolean(visible(practiceDialog)
      && practiceDialog.textContent.includes('522')
      && practiceDialog.textContent.includes('400')
      && practiceDialog.textContent.includes('122')
      && practiceDialog.querySelector('[data-round583-practice-row="random"]'));
    const randomInput = practiceDialog?.querySelector('#randomCount');
    const randomMax = randomInput ? Number(randomInput.getAttribute('max')) : null;
    if (randomInput) randomInput.focus();
    await wait(80);
    const focusOutline = randomInput ? getComputedStyle(randomInput).outlineStyle !== 'none' && getComputedStyle(randomInput).outlineWidth !== '0px' : false;
    await window.QuestionBankData.startAllMaterialPractice('181103-material-extracted');
    await wait(1400);
    const toolbarButtons = Array.from(document.querySelectorAll('.practice-fullscreen .control-panel button')).filter(visible);
    const smallToolbarButtons = toolbarButtons.flatMap((button) => {
      const rect = button.getBoundingClientRect();
      if (rect.width >= 44 && rect.height >= 44) return [];
      return [{
        id: button.id || '',
        title: button.getAttribute('title') || '',
        width: Math.round(rect.width * 10) / 10,
        height: Math.round(rect.height * 10) / 10
      }];
    });
    const practiceFullscreenVisible = visible(document.querySelector('.practice-fullscreen'))
      && toolbarButtons.length >= 10
      && smallToolbarButtons.length === 0;

    const reducedMotionAuto = getComputedStyle(document.documentElement).scrollBehavior === 'auto'
      || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      versionPresent: bodyText.includes(version) && document.body.innerHTML.includes(version),
      countsVisible: bodyText.includes('400 可直接参考') && bodyText.includes('122 源文线索') && bodyText.includes('strictAnswerPdfProof=0'),
      noStaleCounts: !/(145 深补|153 深补|381 练习|141 源文|132 条参考答案页|Round581 · round583)/.test(bodyText),
      horizontalOverflow: scrollWidth > window.innerWidth + 1,
      overflowNodes,
      smartExpanded,
      callsDuringComposition,
      callsAfterComposition,
      searchSynced,
      notificationCount,
      notificationRepeated,
      favoriteModalVisible,
      favoriteOverflow,
      practiceDialogVisible,
      practiceCounts: { total: questions.length, defaults: defaults.length, sourceClues, defaultHasSourceClue, randomMax },
      focusOutline,
      practiceFullscreenVisible,
      toolbarButtonCount: toolbarButtons.length,
      smallToolbarButtons,
      reducedMotionAuto
    };
  }, { version: round583.version });

  await page.close();
  return { viewport, reducedMotion, screenshot, ...interaction, ...diagnostics };
}

async function main() {
  const server = createServer();
  const port = await listen(server);
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_EXECUTABLE || undefined
  });
  try {
    const results = [];
    for (const viewport of [
      { name: 'desktop', width: 1365, height: 900 },
      { name: 'mobile', width: 375, height: 667 },
      { name: 'narrow320', width: 320, height: 667 }
    ]) {
      results.push(await evaluateQuestionBank(browser, port, viewport));
    }
    results.push(await evaluateQuestionBank(browser, port, { name: 'reduced320', width: 320, height: 667 }, true));

    const checks = [];
    const check = (name, pass, detail = {}) => checks.push({ name, pass: Boolean(pass), detail });
    for (const result of results) {
      check(`Round583 no overflow and diagnostics clean ${result.viewport.name}`, result.versionPresent
        && result.countsVisible
        && result.noStaleCounts
        && !result.horizontalOverflow
        && result.overflowNodes.length === 0
        && result.pageErrors.length === 0, {
        overflowNodes: result.overflowNodes,
        pageErrors: result.pageErrors,
        consoleMessages: result.consoleMessages.slice(0, 8)
      });
      check(`Round583 feature aria and IME search ${result.viewport.name}`, result.smartExpanded
        && result.callsDuringComposition === 0
        && result.callsAfterComposition >= 1
        && result.searchSynced, {
        callsDuringComposition: result.callsDuringComposition,
        callsAfterComposition: result.callsAfterComposition,
        searchSynced: result.searchSynced
      });
      check(`Round583 notification and favorite modal ${result.viewport.name}`, result.notificationCount <= 3
        && result.notificationRepeated
        && result.favoriteModalVisible
        && !result.favoriteOverflow, {
        notificationCount: result.notificationCount,
        notificationRepeated: result.notificationRepeated,
        favoriteModalVisible: result.favoriteModalVisible,
        favoriteOverflow: result.favoriteOverflow
      });
      check(`Round583 181103 practice boundary ${result.viewport.name}`, result.practiceDialogVisible
        && result.practiceCounts.total === 522
        && result.practiceCounts.defaults === 400
        && result.practiceCounts.sourceClues === 122
        && result.practiceCounts.defaultHasSourceClue === false
        && result.practiceCounts.randomMax === 400
        && result.focusOutline
        && result.practiceFullscreenVisible
        && result.reducedMotionAuto, {
        ...result.practiceCounts,
        toolbarButtonCount: result.toolbarButtonCount,
        smallToolbarButtons: result.smallToolbarButtons,
        practiceFullscreenVisible: result.practiceFullscreenVisible
      });
    }

    const payload = {
      ok: checks.every((row) => row.pass),
      version: round583.version,
      previousVersion: round583.previousVersion,
      generatedAt: new Date().toISOString(),
      port,
      checks,
      results
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
