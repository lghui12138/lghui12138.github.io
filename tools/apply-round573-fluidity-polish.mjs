#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round573, round573FlowRail } from './round573-fluidity-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round573 apply from /Volumes/mac_2T during lifs isolation.');
}

function abs(rel) {
  return path.join(repoRoot, rel);
}

function readText(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function writeText(rel, text) {
  fs.writeFileSync(abs(rel), text);
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function writeJson(rel, data) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  writeText(rel, text);
  fs.writeFileSync(abs(`${rel}.gz`), zlib.gzipSync(Buffer.from(text)));
}

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function ensureIncludes(text, needle, insertBefore, insertion, label) {
  if (text.includes(needle)) return text;
  const idx = text.indexOf(insertBefore);
  if (idx < 0) throw new Error(`Cannot insert ${label}; missing marker ${insertBefore}`);
  return `${text.slice(0, idx)}${insertion}${text.slice(idx)}`;
}

function list181103MaterialIndexPages() {
  const dir = abs('resources/fluid-181103-html/materials');
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `resources/fluid-181103-html/materials/${entry.name}/index.html`)
    .filter((rel) => fs.existsSync(abs(rel)))
    .sort();
}

function writeRound573Ledger() {
  const ledger = {
    ok: true,
    version: round573.version,
    previousVersion: round573.previousVersion,
    round: round573.round,
    generatedAt: now,
    scope: round573.scope,
    nonDeletingUpgrade: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    metrics: {
      realExamAnswerDepthRows: round573.realExamAnswerDepthRows,
      realExamRoundUpgradeRows: round573.realExamRoundUpgradeRows,
      realExamNewUniqueRows: round573.realExamNewUniqueRows,
      proofDepthRows: round573.proofDepthRows181103,
      proofDepthRewriteRows: round573.proofDepthRewriteRows181103,
      round572ProofDepthRewriteRows: round573.round572ProofDepthRewriteRows181103,
      referencePracticeRows: round573.referencePracticeRows181103,
      sourceClueOnlyRows: round573.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round573.strictAnswerPdfProofRows,
      materialHtmlPages: round573.materialHtmlPages181103,
      sourceHtmlCards: round573.sourceHtmlCards181103
    },
    changes: [
      'Question-bank entrance now has a compact Round573 flow rail for 181103, proof-depth, real-exam, and material routes.',
      'Mobile view keeps hero copy visible instead of hiding paragraphs on narrow screens.',
      'Current release cache-bust strings, middleware edge version, roadmap gate, site-updates top entry, and 181103 index labels are synchronized.',
      'Stale 141 source-clue wording, malformed real-exam discovery URL, and Round531-569/Round531-571 proof-ledger labels are corrected.',
      'Below-the-fold sections use lightweight layout containment so scroll stays smooth without hiding content or leaving blank placeholders.'
    ],
    flowRail: round573FlowRail,
    verificationPlan: [
      'node tools/check-round573-fluidity-polish.mjs',
      'node tools/check-round573-question-bank-home-visual.mjs',
      'public readback for site-updates, question-bank-home, Round573 ledger, and _edge-status',
      'real-account lghui.top auth-chain and authenticated browser gate with expected Round573 version'
    ]
  };
  writeJson('data/fluid-round573-fluidity-polish-ledger.json', ledger);
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round573.version,
    previousVersion: round573.previousVersion,
    date: round573.date,
    title: 'Round573：题库入口流畅美化与非删减式导航升级',
    summary: '本轮不减少任何题量、答案、证明记录或来源边界；在 Round572 内容前沿上继续优化题库入口首屏、手机端可读性、当前版本 cache-bust、搜索发现链接和 proof-depth 总账标签。181103 仍保持 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答保持 145；strictAnswerPdfProof 仍为 0。',
    links: [
      { label: 'Round573 入口流畅账本', href: '/data/fluid-round573-fluidity-polish-ledger.json' },
      { label: '题库入口', href: `/question-bank-home.html?edge_refresh=${round573.version}` },
      { label: 'Round572 证明重证记录', href: '/data/fluid-round572-181103-proof-depth-rewrite.json' }
    ],
    metrics: {
      realExamAnswerDepthRows: round573.realExamAnswerDepthRows,
      realExamRoundUpgradeRows: round573.realExamRoundUpgradeRows,
      realExamNewUniqueRows: round573.realExamNewUniqueRows,
      proofDepthRows: round573.proofDepthRows181103,
      proofDepthRewriteRows: round573.proofDepthRewriteRows181103,
      referencePracticeRows: round573.referencePracticeRows181103,
      sourceClueOnlyRows: round573.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round573.strictAnswerPdfProofRows
    },
    boundary: {
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      contentFrontier: round573.previousVersion
    }
  };
  const nextUpdates = updates.filter((item) => item?.version !== round573.version);
  nextUpdates.unshift(top);
  writeJson('site-updates.json', nextUpdates);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  roadmap.version = round573.version;
  roadmap.currentVersion = round573.version;
  roadmap.currentReleaseVersion = round573.version;
  roadmap.previousVersion = round573.previousVersion;
  roadmap.currentRound = round573.round;
  roadmap.lastIntegratedRound = round573.round;
  roadmap.lastUpdatedAt = now;
  roadmap.updatedAt = now;
  roadmap.lastUpdated = now;
  roadmap.latestRelease = {
    version: round573.version,
    round: round573.round,
    previousVersion: round573.previousVersion,
    summary: 'Round573 is a non-deleting fluidity and visual polish release for the question-bank entrance: flow rail, mobile copy visibility, stale-label cleanup, current cache-bust, and release-gate refresh while preserving Round572 answer/proof counts.'
  };
  roadmap.releaseGate ||= {};
  roadmap.releaseGate.currentVersion = round573.version;
  roadmap.releaseGate.expectedVersion = round573.version;
  roadmap.releaseGate.previousVersion = round573.previousVersion;
  roadmap.releaseGate.currentRound = round573.round;
  roadmap.releaseGate.lastUpdated = now;
  const round573Commands = [
    'node tools/apply-round573-fluidity-polish.mjs',
    'node tools/check-round573-fluidity-polish.mjs',
    'node tools/check-round573-question-bank-home-visual.mjs',
    `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round573.version}`,
    `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round573.version}`
  ];
  const previousCommands = (roadmap.releaseGate.commands || [])
    .filter((command) => !String(command).includes(round573.previousVersion))
    .filter((command) => !/round570-answer-depth|round571-answer-depth|round572-answer-depth|check-round57[0-2]/.test(String(command)));
  roadmap.releaseGate.commands = Array.from(new Set([...round573Commands, ...previousCommands]));
  roadmap.round573FluidityPolish = true;
  roadmap.round573NonDeletingUpgrade = true;
  roadmap.round573FlowRailItems = round573FlowRail.length;
  roadmap.realExamAnswerDepthRows = round573.realExamAnswerDepthRows;
  roadmap.proofDepthRows = round573.proofDepthRows181103;
  roadmap.strictAnswerPdfProof = round573.strictAnswerPdfProofRows;
  roadmap.referencePracticeRows181103 = round573.referencePracticeRows181103;
  roadmap.sourceClueOnlyRows181103 = round573.sourceClueOnlyRows181103;
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

function syncCurrentReleaseStrings() {
  const currentFiles = [
    'question-bank-home.html',
    'index.html',
    'index-complete.html',
    'resources.html',
    'modules/question-bank.html',
    'modules/real-exams-dynamic.html',
    'modules/wang-hongwei-fluid-reading.html',
    'modules/wu-wangyi-fluid-reading.html',
    'teacher-panel.html',
    'modules/practice-dynamic.html',
    'functions/_middleware.js',
    'js/edge-fluid-learning-upgrade.js',
    'js/core/local-mathjax.js',
    'modules/knowledge-detail.html',
    'modules/knowledge-upgrade-2026.html',
    'modules/question-bank-data.js',
    'js/fluid-home-complete.js',
    'modules/simulated-exams-dynamic.html',
    'modules/fluid-intensive-training.html',
    'modules/teacher-panel.html',
    'resources/fluid-181103-html/index.html',
    ...list181103MaterialIndexPages()
  ];
  for (const rel of currentFiles) {
    let text = readText(rel);
    text = replaceAll(text, round573.previousVersion, round573.version);
    writeText(rel, text);
  }
}

function updateQuestionBankHome() {
  let text = readText('question-bank-home.html');
  text = replaceAll(text, 'html { overflow-x: hidden; }', 'html { overflow-x: hidden; scroll-behavior: smooth; }');
  text = replaceAll(text, '      --focus: #f59e0b;\n', '      --focus: #f59e0b;\n      --mint: #10b981;\n      --mint-soft: #ecfdf5;\n      --warm-soft: #fff7ed;\n      --hairline: rgba(15, 23, 42, 0.075);\n');
  text = replaceAll(text, '      background: #ffffff;\n      color: #25352e;\n      box-shadow: var(--shadow);\n', '      position: sticky;\n      top: max(8px, env(safe-area-inset-top));\n      z-index: 30;\n      background: rgba(255, 255, 255, 0.94);\n      color: #25352e;\n      box-shadow: 0 8px 28px -24px rgba(15, 23, 42, 0.42);\n      backdrop-filter: blur(18px) saturate(145%);\n      -webkit-backdrop-filter: blur(18px) saturate(145%);\n');
  text = replaceAll(text, '      white-space: nowrap;\n    }\n    .hero {\n', '      white-space: nowrap;\n      transition: transform .16s ease, border-color .16s ease, background .16s ease, box-shadow .16s ease;\n    }\n    .workbench-topline__actions a:hover,\n    .workbench-topline__actions a:focus-visible {\n      transform: translateY(-1px);\n      border-color: rgba(15, 118, 110, 0.34);\n      background: #ecfdf5;\n      box-shadow: 0 8px 22px -18px rgba(15, 118, 110, 0.45);\n    }\n    .hero {\n');
  text = ensureIncludes(text, '.round573-flow-rail', '    @media (max-width: 1040px) {\n', `    .round573-flow-rail {\n      display: grid;\n      grid-template-columns: repeat(4, minmax(0, 1fr));\n      gap: 8px;\n      margin: 10px 0;\n    }\n    .round573-flow-rail a {\n      min-height: 66px;\n      position: relative;\n      display: grid;\n      align-content: center;\n      gap: 3px;\n      overflow: hidden;\n      padding: 10px 12px 13px;\n      border: 1px solid var(--hairline);\n      border-radius: 8px;\n      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);\n      color: #111827;\n      text-decoration: none;\n      box-shadow: var(--shadow);\n      transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease, background .16s ease;\n    }\n    .round573-flow-rail a:hover,\n    .round573-flow-rail a:focus-visible {\n      transform: translateY(-1px);\n      border-color: rgba(10, 114, 239, 0.24);\n      box-shadow: 0 14px 30px -24px rgba(15, 23, 42, 0.5);\n    }\n    .round573-flow-rail b {\n      color: #0f172a;\n      font-size: 1rem;\n      line-height: 1.1;\n    }\n    .round573-flow-rail span {\n      color: #334155;\n      font-size: 0.86rem;\n      font-weight: 820;\n      line-height: 1.25;\n    }\n    .round573-flow-rail small {\n      color: #64748b;\n      font-size: 0.75rem;\n      font-weight: 760;\n      line-height: 1.2;\n    }\n    .round573-flow-rail em {\n      position: absolute;\n      left: 0;\n      right: auto;\n      bottom: 0;\n      height: 3px;\n      background: linear-gradient(90deg, #10b981, #0a72ef 55%, #f59e0b);\n      width: 60%;\n      pointer-events: none;\n    }\n    .round573-flow-rail a[data-level="72"] em { width: 72%; }\n    .round573-flow-rail a[data-level="94"] em { width: 94%; }\n    .round573-flow-rail a[data-level="100"] em { width: 100%; }\n    .summary-actions a,\n    .intent-link,\n    .round351-mobile-shortcuts__grid a,\n    .card,\n    .btn {\n      transition: transform .16s ease, border-color .16s ease, background .16s ease, box-shadow .16s ease;\n    }\n    .summary-actions a:hover,\n    .summary-actions a:focus-visible,\n    .intent-link:hover,\n    .intent-link:focus-visible,\n    .round351-mobile-shortcuts__grid a:hover,\n    .round351-mobile-shortcuts__grid a:focus-visible,\n    .btn:hover,\n    .btn:focus-visible {\n      transform: translateY(-1px);\n      box-shadow: 0 12px 26px -22px rgba(15, 23, 42, 0.48);\n    }\n    .round351-mobile-shortcuts,\n    .intent-panel,\n    .grid,\n    .panel {\n      content-visibility: auto;\n      contain-intrinsic-size: 1px 420px;\n    }\n\n`, 'Round573 flow rail CSS');
  text = replaceAll(text, '      content-visibility: auto;\n      contain-intrinsic-size: 1px 420px;', '      contain: layout paint;');
  text = replaceAll(text, '      .workbench-route-rail { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n', '      .workbench-route-rail,\n      .round573-flow-rail { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n');
  text = replaceAll(text, '      .hero-main > p:not(.workbench-label):not(.release-chip):not(.index-status),\n      .hero-qa-panel p {\n        display: none;\n        line-height: 1.5;\n      }\n', '      .hero-main > p:not(.workbench-label):not(.release-chip):not(.index-status),\n      .hero-qa-panel p {\n        display: block;\n        margin-bottom: 8px;\n        font-size: 0.84rem;\n        line-height: 1.48;\n      }\n');
  text = replaceAll(text, '  <script>const EDGE_REFRESH = \'round573-fluidity-polish-navigation-20260629\';</script>', `  <script>const EDGE_REFRESH = '${round573.version}';</script>`);
  text = replaceAll(text, '<b>Round572</b>', '<b>Round573</b>');
  text = replaceAll(text, '<section class="hero workbench-summary" data-round572-workbench-summary="1">', '<section class="hero workbench-summary" data-round572-workbench-summary="1" data-round573-fluidity-summary="1">');
  text = replaceAll(text, '当前发布 · round573-fluidity-polish-navigation-20260629', `当前发布 · ${round573.version}`);
  text = replaceAll(text, '首屏只保留当前可行动的状态：181103 可参考、证明深修、真题补答、严格 PDF 边界和来源线索。写了结论但没有过程的，继续按 Round572 的 proof-depth 重写门处理。', '首屏保留全部当前可行动状态，并把 181103、证明深修、真题补答、严格 PDF 边界和来源线索排成连续入口。写了结论但没有过程的，继续沿 Round531-572 proof-depth 重写门处理；Round573 只做入口流畅性与读回证据，不删减任何信息。');
  text = replaceAll(text, 'data-release-evidence-strip="round572-auth-live" data-round572-proof-audit-strip="1"', 'data-release-evidence-strip="round573-fluidity-live" data-round572-proof-audit-strip="1" data-round573-fluidity-strip="1"');
  text = replaceAll(text, '<div><dt>Public</dt><dd>待读回</dd></div>', '<div><dt>Public</dt><dd>读回 gate</dd></div>');
  text = replaceAll(text, '<div><dt>Auth</dt><dd>待实账</dd></div>', '<div><dt>Auth</dt><dd>实账 gate</dd></div>');
  text = replaceAll(text, '<div><dt>Round572</dt><dd>重证薄证明 6 道</dd></div>', '<div><dt>内容批次</dt><dd>Round572 重证 6 道</dd></div>');
  text = replaceAll(text, '<h2>证明审查表</h2>', '<h2>证明与入口审查表</h2>');
  text = replaceAll(text, '证明深修截至 Round572 共 422 道', '证明深修截至 Round572 内容批次共 422 道');
  text = replaceAll(text, '验收标准：假设、方程、符号/边界、变形、结论检查都要在答案里看得见。', '验收标准：假设、方程、符号/边界、变形、结论检查都要在答案里看得见；入口层不隐藏这些边界。');
  text = replaceAll(text, '          <div class="round385-181103-main-entry__stats" aria-label="181103 题库入口状态">\n            <span><b>522/522</b>来源 HTML 卡</span>\n          <span><b>400</b>练习 / 可参考</span>\n            <span><b>122</b>源文线索只展示</span>\n            <span><b>422</b>证明深修</span>\n          </div>', '          <div class="round385-181103-main-entry__stats" aria-label="181103 题库入口状态">\n            <span><b>522/522</b>来源 HTML 卡</span>\n            <span><b>400</b>练习 / 可参考</span>\n            <span><b>122</b>源文线索只展示</span>\n            <span><b>422</b>证明深修</span>\n          </div>');
  const railHtml = `\n    <section class="round573-flow-rail" data-round573-fluidity-rail="1" aria-label="Round573 题库入口流线状态">\n${round573FlowRail.map((item) => `      <a href="${item.href.includes('edge_refresh=') || item.href.includes('#') ? item.href.replace('.html#', `.html?edge_refresh=${round573.version}#`) : item.href}" data-round573-flow="${item.id}" data-level="${item.level}"><b>${item.label}</b><span>${item.value}</span><small>${item.meta}</small><em aria-hidden="true"></em></a>`).join('\n')}\n    </section>\n`;
  text = ensureIncludes(text, 'data-round573-fluidity-rail="1"', '    <details class="toolbar toolbar-more">\n', railHtml, 'Round573 flow rail HTML');
  text = replaceAll(text, '<a href="./data/fluid-round572-real-exam-answer-depth-upgrade.json">真题补答记录</a>\n        <a href="./modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList">直达题库</a>', '<a href="./data/fluid-round573-fluidity-polish-ledger.json">入口流畅账本</a>\n        <a href="./data/fluid-round572-real-exam-answer-depth-upgrade.json">真题补答记录</a>\n        <a href="./modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList">直达题库</a>');
  writeText('question-bank-home.html', text);
}

function updateHomeAndRuntimeLabels() {
  const replacementsByFile = new Map([
    ['index.html', [
      ['当前发布：Round572 · round573-fluidity-polish-navigation-20260629', `当前发布：Round573 · ${round573.version}`],
      ['Round572 证明深修 422 道、参考答案展示', 'Round572 内容批次证明深修 422 道、Round573 入口流畅升级、参考答案展示'],
      ['证明深修截至 Round572 共 422 道', '证明深修截至 Round572 内容批次共 422 道'],
      ['181103 证明深修截至 Round572 共 422 道', '181103 证明深修截至 Round572 内容批次共 422 道']
    ]],
    ['index-complete.html', [
      ['Round531-569 共 422 道证明、推导和说明题已补全过程推导', 'Round531-572 共 422 道证明、推导和说明题已补全过程推导'],
      ['Round531-569 / 422 / PDF 0', 'Round531-572 / 422 / PDF 0'],
      ['打开 Round555 181103 证明题参考答案深度修复总账 JSON', '打开 Round572 181103 证明题参考答案深度修复总账 JSON'],
      ['证明深修截至 Round572 共 422 道', '证明深修截至 Round572 内容批次共 422 道']
    ]],
    ['modules/real-exams-dynamic.html', [
      [`当前版本：Round572 · ${round573.version}`, `当前版本：Round573 · ${round573.version}`],
      ['当前校对：Round572 已把累计 145 道历年真题短答案补成含定义、方程、选项排除和结论检查的派生参考答案，本轮新增 12 道；', '当前校对：Round572 内容批次已把累计 145 道历年真题短答案补成含定义、方程、选项排除和结论检查的派生参考答案；Round573 保持该答案边界并更新入口流畅性；'],
      ['.card{content-visibility:auto;contain-intrinsic-size:230px}', '.card{contain:layout paint}']
    ]],
    ['resources/fluid-181103-html/index.html', [
      ['Round531-571 当前 422 道证明/推导题深修', 'Round531-572 当前 422 道证明/推导题深修'],
      ['Round531-571 当前总账已到 422 道', 'Round531-572 当前总账已到 422 道'],
      ['Round571 本轮重证 6 道', 'Round572 本轮重证 6 道'],
      ['Round571 重证记录已发布', 'Round572 重证记录已发布']
    ]],
    ['js/edge-fluid-learning-upgrade.js', [
      ['141 条线索只展示', '122 条线索只展示'],
      [`/modules/real-exams-dynamic.html?${round573.version}&from=round342-edge-search`, `/modules/real-exams-dynamic.html?edge_refresh=${round573.version}&from=round342-edge-search`]
    ]],
    ['functions/_middleware.js', [
      ['// Round572: continue real-exam answer-depth, rewrite thin 181103 proof-depth answers, and keep real-account gates separate from strict PDF proof.', '// Round573: non-deleting question-bank entrance fluidity polish; Round572 answer/proof counts remain the content frontier and strict PDF proof stays separate.']
    ]]
  ]);

  for (const [rel, pairs] of replacementsByFile.entries()) {
    let text = readText(rel);
    for (const [from, to] of pairs) text = replaceAll(text, from, to);
    writeText(rel, text);
  }
}

writeRound573Ledger();
updateSiteUpdates();
updateRoadmap();
syncCurrentReleaseStrings();
updateQuestionBankHome();
updateHomeAndRuntimeLabels();

console.log(JSON.stringify({
  ok: true,
  version: round573.version,
  previousVersion: round573.previousVersion,
  generatedAt: now,
  metrics: {
    realExamAnswerDepthRows: round573.realExamAnswerDepthRows,
    proofDepthRows181103: round573.proofDepthRows181103,
    referencePracticeRows181103: round573.referencePracticeRows181103,
    sourceClueOnlyRows181103: round573.sourceClueOnlyRows181103,
    strictAnswerPdfProofRows: round573.strictAnswerPdfProofRows
  },
  flowRailItems: round573FlowRail.length
}, null, 2));
