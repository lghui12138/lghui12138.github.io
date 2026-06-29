#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round574, round574RouteCards } from './round574-public-shell-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const now = new Date().toISOString();

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round574 apply from /Volumes/mac_2T during lifs isolation.');
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

function writeJson(rel, data, gzip = true) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  writeText(rel, text);
  if (gzip) fs.writeFileSync(abs(`${rel}.gz`), zlib.gzipSync(Buffer.from(text)));
}

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function walkHtml(dir = repoRoot, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'output', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(path.relative(repoRoot, full));
    }
  }
  return out;
}

function discoverPublicShells() {
  return walkHtml()
    .filter((rel) => {
      const text = readText(rel);
      return text.includes('<title>正在进入流体力学主站</title>')
        && text.includes('const TARGET_ORIGIN')
        && text.includes('const ROUTE');
    })
    .sort();
}

function getConst(text, name, fallback = '') {
  const match = text.match(new RegExp(`const\\s+${name}\\s*=\\s*'([^']*)'`));
  return match?.[1] || fallback;
}

function normalizeSearch(baseSearch) {
  const params = new URLSearchParams(String(baseSearch || '?edge_refresh=x').replace(/^\?/, ''));
  params.delete('go');
  params.set('edge_refresh', round574.version);
  return `?${params.toString()}`;
}

function withFreshHref(href) {
  const [pathAndSearch, hash = ''] = href.split('#');
  const url = new URL(pathAndSearch, 'https://lghui.top');
  url.searchParams.set('edge_refresh', round574.version);
  return `${url.pathname}${url.search}${hash ? `#${hash}` : ''}`;
}

function buildShell({ rel, route, baseSearch }) {
  const search = normalizeSearch(baseSearch);
  const targetHref = `https://lghui-fluid-learning.pages.dev${route}${search}`;
  const stableHref = `https://lghui.top/index-complete.html?full=1&edge_refresh=${round574.version}`;
  const routeCards = round574RouteCards.map((card) => {
    const href = withFreshHref(card.href);
    return `<a class="route-chip" data-round574-route="${card.id}" href="${href}"><b>${escapeHtml(card.label)}</b><span>${escapeHtml(card.value)}</span></a>`;
  }).join('\n        ');
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta http-equiv="cache-control" content="no-store">
  <link rel="canonical" href="${targetHref}">
  <title>正在进入流体力学主站</title>
  <style>
    :root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f6f8fb;color:#111827;--line:rgba(15,23,42,.1);--muted:#64748b;--ink:#0f172a;--mint:#0f766e;--blue:#155eef;--amber:#b45309}
    *{box-sizing:border-box}html{-webkit-text-size-adjust:100%;text-rendering:optimizeLegibility}body{margin:0;min-height:100vh;min-height:100dvh;padding:max(20px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) max(20px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));display:grid;place-items:center;background:linear-gradient(180deg,#ffffff 0%,#f6f8fb 58%,#eef7f4 100%);-webkit-font-smoothing:antialiased}
    main{width:min(780px,100%);border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.94);box-shadow:0 24px 70px rgba(15,23,42,.12);padding:clamp(20px,4vw,34px)}
    .eyebrow{display:inline-flex;gap:8px;align-items:center;min-height:30px;padding:0 10px;border:1px solid rgba(15,118,110,.18);border-radius:999px;background:#ecfdf5;color:#0f766e;font-size:13px;font-weight:820}.eyebrow i{width:8px;height:8px;border-radius:99px;background:#10b981;box-shadow:0 0 0 5px rgba(16,185,129,.13)}
    h1{margin:14px 0 8px;font-size:clamp(27px,4.2vw,42px);line-height:1.08;letter-spacing:0;color:var(--ink)}p{margin:0 0 12px;color:var(--muted);line-height:1.68}.lede{max-width:68ch;color:#334155}.status-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:18px 0}.metric{min-height:70px;border:1px solid var(--line);border-radius:8px;background:#fff;padding:10px 12px}.metric b{display:block;color:#0f172a;font-size:20px;line-height:1.15}.metric span{display:block;margin-top:3px;color:#64748b;font-size:12px;font-weight:760;line-height:1.3}.metric[data-tone="warn"]{background:#fffbeb;border-color:rgba(180,83,9,.24)}.metric[data-tone="source"]{background:#eff6ff;border-color:rgba(21,94,239,.18)}
    .route-rail{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:16px 0}.route-chip{min-height:58px;display:grid;align-content:center;gap:3px;border:1px solid var(--line);border-radius:8px;background:#fff;color:#0f172a;text-decoration:none;padding:10px 12px;transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease}.route-chip:hover,.route-chip:focus-visible{transform:translateY(-1px);border-color:rgba(15,118,110,.35);box-shadow:0 14px 30px -24px rgba(15,23,42,.5)}.route-chip b{font-size:15px;line-height:1.2}.route-chip span{color:#64748b;font-size:13px;line-height:1.3}
    .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}.btn{min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;padding:0 15px;font-weight:850;text-decoration:none}.btn.primary{background:#111827;color:#fff}.btn.secondary{background:#eef2ff;color:#1d4ed8;border:1px solid rgba(29,78,216,.15)}code{word-break:break-all;color:#334155}.fine{margin-top:14px;color:#7a8799;font-size:13px}
    @media(max-width:680px){main{padding:20px}.status-grid,.route-rail{grid-template-columns:1fr 1fr}.metric{min-height:64px}.actions{display:grid}.btn{width:100%}}@media(max-width:440px){.status-grid,.route-rail{grid-template-columns:1fr}h1{font-size:28px}}
    @media(prefers-color-scheme:dark){:root{background:#07111f;color:#f8fafc;--line:rgba(255,255,255,.13);--muted:#aab6c8;--ink:#f8fafc}body{background:linear-gradient(180deg,#07111f,#0f172a 72%,#10231f)}main,.metric,.route-chip{background:rgba(15,23,42,.88)}.metric[data-tone="warn"]{background:rgba(180,83,9,.15)}.metric[data-tone="source"]{background:rgba(21,94,239,.14)}.route-chip b,.metric b{color:#f8fafc}.btn.primary{background:#f8fafc;color:#111827}}
  </style>
</head>
<body>
  <main data-round574-public-shell="1">
    <div class="eyebrow"><i aria-hidden="true"></i><span>Round574 公开入口已同步</span></div>
    <h1>正在进入主站</h1>
    <p class="lede">这个公开路径会自动打开 Cloudflare 源站，并把旧 edge_refresh 收束到当前入口版本。若浏览器拦截自动跳转，请点击下面的按钮进入。</p>
    <p>当前公开壳版本是 <b>${round574.version}</b>；内容前沿承接 Round573 / Round572：本轮只刷新公开跳转壳、入口文案和计数可读性，不删减题量、答案、证明记录或来源边界。</p>
    <div class="status-grid" aria-label="当前题库与答案边界">
      <div class="metric"><b>400</b><span>181103 可参考练习</span></div>
      <div class="metric"><b>122</b><span>来源线索分层展示</span></div>
      <div class="metric"><b>422</b><span>证明/推导深修</span></div>
      <div class="metric"><b>145</b><span>历年真题过程补答</span></div>
      <div class="metric" data-tone="source"><b>38</b><span>181103 HTML 资料</span></div>
      <div class="metric" data-tone="source"><b>522</b><span>资料来源卡</span></div>
      <div class="metric" data-tone="source"><b>325</b><span>真题原文小题</span></div>
      <div class="metric" data-tone="warn"><b>strict 0</b><span>严格答案 PDF 逐字证据另算</span></div>
    </div>
    <div class="route-rail" aria-label="常用入口">
        ${routeCards}
    </div>
    <p>lghui.top 只做公开入口，不冒充认证源；真实学习内容仍以 pages.dev 源站、真实账号渲染和 source/auth gate 为准。</p>
    <p><code>${escapeHtml(rel)}</code> → <code>${escapeHtml(route)}</code></p>
    <div class="actions">
      <a id="targetLink" class="btn primary" href="${targetHref}">立即打开当前入口</a>
      <a id="stableLink" class="btn secondary" href="${stableHref}">返回完整首页</a>
    </div>
    <p class="fine">发布边界：公开壳新鲜度、题库入口流畅性、版本 cache-bust 与计数说明同步；不把派生参考答案说成原卷 PDF 逐字答案。</p>
  </main>
  <script>
    const TARGET_ORIGIN = 'https://lghui-fluid-learning.pages.dev';
    const ROUTE = '${route}';
    const BASE_SEARCH = '${search}';
    const EDGE_REFRESH = '${round574.version}';
    function timeout(ms){ return new Promise((resolve) => setTimeout(resolve, ms)); }
    async function clearOldPublicState(){
      try{
        if('serviceWorker' in navigator){
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration)=>registration.unregister()));
        }
        if(window.caches){
          const keys = await caches.keys();
          await Promise.all(keys.map((key)=>caches.delete(key)));
        }
      }catch(_){}
    }
    function normalizeParamValue(value){
      const text = String(value || '');
      return text.replace(/edge_refresh=[^&#]*/g, 'edge_refresh=' + EDGE_REFRESH);
    }
    const searchParams = new URLSearchParams(BASE_SEARCH);
    for (const [key, value] of new URLSearchParams(location.search)) searchParams.set(key, normalizeParamValue(value));
    for (const [key, value] of Array.from(searchParams.entries())) searchParams.set(key, normalizeParamValue(value));
    searchParams.delete('go');
    searchParams.set('edge_refresh', EDGE_REFRESH);
    const target = TARGET_ORIGIN + ROUTE + '?' + searchParams.toString() + location.hash;
    document.getElementById('targetLink').href = target;
    const stableUrl = new URL('${stableHref}');
    stableUrl.hash = location.hash;
    document.getElementById('stableLink').href = stableUrl.toString();
    let entering = false;
    function enterTarget(){
      if (entering || location.href === target) return;
      entering = true;
      location.replace(target);
    }
    requestAnimationFrame(enterTarget);
    setTimeout(enterTarget, 420);
    Promise.race([clearOldPublicState(), timeout(700)]).finally(enterTarget);
  </script>
</body>
</html>
`;
}

function writeLedger(shellFiles, legacyDirectFiles = []) {
  writeJson('data/fluid-round574-public-shell-freshness-ledger.json', {
    ok: true,
    version: round574.version,
    previousVersion: round574.previousVersion,
    contentFrontierVersion: round574.contentFrontierVersion,
    answerContentFrontierVersion: round574.answerContentFrontierVersion,
    round: round574.round,
    generatedAt: now,
    scope: round574.scope,
    publicShellOnly: true,
    changedAnswerContent: false,
    changedProofDepthContent: false,
    nonDeletingUpgrade: true,
    metrics: {
      materialHtmlPages181103: round574.materialHtmlPages181103,
      sourceHtmlCards181103: round574.sourceHtmlCards181103,
      referencePracticeRows181103: round574.referencePracticeRows181103,
      sourceClueOnlyRows181103: round574.sourceClueOnlyRows181103,
      proofDepthRows181103: round574.proofDepthRows181103,
      realExamAnswerDepthRows: round574.realExamAnswerDepthRows,
      realExamOriginalAtomicRows: round574.realExamOriginalAtomicRows,
      realExamSourceSections: round574.realExamSourceSections,
      groupedRealExamRows: round574.groupedRealExamRows,
      strictAnswerPdfProofRows: round574.strictAnswerPdfProofRows
    },
    shellFiles,
    legacyDirectFiles,
    checks: [
      'all generated public shell HTML pages carry Round574 edge_refresh',
      'legacy direct public shells use Round574 visible current marker and edge_refresh target',
      'visible current-count copy uses 400/122/422/145 and strictAnswerPdfProof=0',
      'public shell text keeps lghui.top and authenticated pages.dev source separate',
      'site-updates, roadmap, middleware versions, and current entrance cache-bust strings point to Round574'
    ]
  });
}

function updateSiteUpdates() {
  const updates = readJson('site-updates.json');
  const top = {
    version: round574.version,
    previousVersion: round574.previousVersion,
    date: round574.date,
    title: 'Round574：公开跳转壳新鲜度与题库入口流线同步',
    summary: '本轮把 lghui.top 多个公开跳转壳从 Round550/Round563/Round555 旧文案同步到 Round574，统一 edge_refresh、当前计数和入口视觉密度。内容前沿不缩水：181103 仍为 400 道可参考、122 条来源线索、422 道证明深修；历年真题过程型补答仍为 145；strictAnswerPdfProof 仍为 0，继续把公开壳、认证源和真实账号证据分层。',
    links: [
      { label: 'Round574 公开壳账本', href: '/data/fluid-round574-public-shell-freshness-ledger.json' },
      { label: '题库入口', href: `/question-bank-home.html?edge_refresh=${round574.version}` },
      { label: '公开登录壳', href: `/_edge-login/?edge_refresh=${round574.version}` }
    ],
    metrics: {
      realExamAnswerDepthRows: round574.realExamAnswerDepthRows,
      proofDepthRows: round574.proofDepthRows181103,
      referencePracticeRows: round574.referencePracticeRows181103,
      sourceClueOnlyRows: round574.sourceClueOnlyRows181103,
      strictAnswerPdfProof: round574.strictAnswerPdfProofRows
    },
    boundary: {
      publicShellOnly: true,
      nonDeletingUpgrade: true,
      strictAnswerPdfProof: 'separate',
      derivedReferenceAnswers: true,
      contentFrontier: round574.contentFrontierVersion
    }
  };
  writeJson('site-updates.json', [top, ...updates.filter((item) => item?.version !== round574.version)]);
}

function updateRoadmap() {
  const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
  roadmap.version = round574.version;
  roadmap.currentVersion = round574.version;
  roadmap.currentReleaseVersion = round574.version;
  roadmap.previousVersion = round574.previousVersion;
  roadmap.currentRound = round574.round;
  roadmap.lastIntegratedRound = round574.round;
  roadmap.lastUpdatedAt = now;
  roadmap.updatedAt = now;
  roadmap.lastUpdated = now;
  roadmap.latestRelease = {
    version: round574.version,
    round: round574.round,
    previousVersion: round574.previousVersion,
    summary: 'Round574 refreshes public redirect shells and entrance copy while preserving Round573/Round572 answer and proof-depth content counts.'
  };
  roadmap.releaseGate ||= {};
  roadmap.releaseGate.currentVersion = round574.version;
  roadmap.releaseGate.expectedVersion = round574.version;
  roadmap.releaseGate.previousVersion = round574.previousVersion;
  roadmap.releaseGate.currentRound = round574.round;
  roadmap.releaseGate.lastUpdated = now;
  const commands = [
    'node tools/apply-round574-public-shell-freshness.mjs',
    'node tools/check-round574-public-shell-freshness.mjs',
    'node tools/check-round574-public-shell-visual.mjs',
    `node tools/check-lghui-top-auth-chain.mjs --json --production --expected-version ${round574.version}`,
    `node tools/check-authenticated-browser-gate.mjs --json --production --expected-version ${round574.version}`
  ];
  const previous = (roadmap.releaseGate.commands || [])
    .filter((command) => !/round57[0-3]|check-round57[0-3]/.test(String(command)));
  roadmap.releaseGate.commands = Array.from(new Set([...commands, ...previous]));
  roadmap.round574PublicShellFreshness = true;
  roadmap.round574NonDeletingUpgrade = true;
  roadmap.referencePracticeRows181103 = round574.referencePracticeRows181103;
  roadmap.sourceClueOnlyRows181103 = round574.sourceClueOnlyRows181103;
  roadmap.proofDepthRows = round574.proofDepthRows181103;
  roadmap.realExamAnswerDepthRows = round574.realExamAnswerDepthRows;
  roadmap.strictAnswerPdfProof = round574.strictAnswerPdfProofRows;
  writeJson('data/fluid-upgrade-roadmap-100.json', roadmap);
}

function syncCurrentStrings(shellFiles) {
  const files = [
    'question-bank-home.html',
    'index.html',
    'index-complete.html',
    'index-complete/index.html',
    'knowledge.html',
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
    'sw.js',
    'sw-simple.js',
    ...shellFiles
  ];
  for (const rel of Array.from(new Set(files))) {
    if (!fs.existsSync(abs(rel))) continue;
    let text = readText(rel);
    text = replaceAll(text, round574.previousVersion, round574.version);
    text = replaceAll(text, '381 道默认练习题可直接看参考答案', '400 道默认练习题可直接看参考答案');
    text = replaceAll(text, '381 道默认练习、381 道可直接参考', '400 道默认练习、400 道可直接参考');
    text = replaceAll(text, '381 可直接参考答案', '400 可直接参考答案');
    text = replaceAll(text, '381 可直接参考', '400 可直接参考');
    text = replaceAll(text, '141 条源文线索', '122 条源文线索');
    text = replaceAll(text, '141源文线索', '122源文线索');
    if (rel === 'question-bank-home.html') {
      text = replaceAll(text, '<b>Round573</b>', '<b>Round574</b>');
      text = replaceAll(text, '当前发布 · round574-public-shell-freshness-flow-20260629', `当前发布 · ${round574.version}`);
      text = replaceAll(text, 'data-round573-fluidity-summary="1"', 'data-round573-fluidity-summary="1" data-round574-public-shell-summary="1"');
      text = replaceAll(text, 'data-release-evidence-strip="round573-fluidity-live"', 'data-release-evidence-strip="round574-public-shell-live"');
      text = replaceAll(text, 'data-round573-fluidity-strip="1"', 'data-round573-fluidity-strip="1" data-round574-public-shell-strip="1"');
      text = replaceAll(text, 'Round573 只做入口流畅性与读回证据，不删减任何信息', 'Round574 已同步公开跳转壳与当前 cache-bust；Round573 入口流畅性证据继续保留，不删减任何信息');
      if (!text.includes('fluid-round574-public-shell-freshness-ledger.json')) {
        text = replaceAll(text, '<a href="./data/fluid-round573-fluidity-polish-ledger.json">入口流畅账本</a>', '<a href="./data/fluid-round574-public-shell-freshness-ledger.json">公开壳账本</a>\n        <a href="./data/fluid-round573-fluidity-polish-ledger.json">入口流畅账本</a>');
      }
    }
    if (rel === 'index.html') {
      text = replaceAll(text, '当前发布：Round573 ·', '当前发布：Round574 ·');
      text = replaceAll(text, 'Round572 内容批次证明深修 422 道、Round573 入口流畅升级、参考答案展示', 'Round572 内容批次证明深修 422 道、Round573 入口流畅升级、Round574 公开壳同步、参考答案展示');
    }
    if (rel === 'modules/real-exams-dynamic.html') {
      text = replaceAll(text, '当前版本：Round573 ·', '当前版本：Round574 ·');
    }
    if (rel === 'functions/_middleware.js') {
      text = replaceAll(text, 'Round573: non-deleting question-bank entrance fluidity polish', 'Round574: public shell freshness and entrance flow synchronization');
    }
    writeText(rel, text);
  }
}

function syncLegacyDirectPublicShells() {
  const legacyFiles = walkHtml()
    .filter((rel) => {
      const text = readText(rel);
      return text.includes('data-round418-public-shell-current')
        || text.includes('data-round398-simulated-public-route-signal')
        || text.includes('当前公开壳版本为 ');
    })
    .sort();
  for (const rel of legacyFiles) {
    let text = readText(rel);
    text = text.replace(/data-public-shell-release="[^"]+"/g, `data-public-shell-release="${round574.version}"`);
    text = text.replace(/<meta name="fm-current-release" content="[^"]+"\s*\/?>/g, `<meta name="fm-current-release" content="${round574.version}" />`);
    text = text.replace(/data-round418-public-shell-current="[^"]+"/g, `data-round418-public-shell-current="${round574.version}"`);
    text = replaceAll(text, '381 默认练习', '400 默认练习');
    text = replaceAll(text, '381 ready 参考答案', '400 ready 参考答案');
    text = replaceAll(text, '141 源文线索', '122 源文线索');
    text = replaceAll(text, '381 道独立题进入刷题', '400 道可参考练习进入刷题');
    text = replaceAll(text, '141 条参考答案页', '122 条来源线索');
    text = text.replace(/当前公开壳版本为\s*round[0-9][^。<]*/g, `当前公开壳版本为 ${round574.version}`);
    text = text.replace(/edge_refresh=round[0-9][^'"&<\s)]*/g, `edge_refresh=${round574.version}`);
    text = text.replace(/target\.searchParams\.set\('edge_refresh',\s*'[^']+'\)/g, `target.searchParams.set('edge_refresh','${round574.version}')`);
    text = text.replace(/params\.set\('edge_refresh',\s*'[^']+'\)/g, `params.set('edge_refresh', '${round574.version}')`);
    writeText(rel, text);
  }
  return legacyFiles;
}

function syncExtraPublicEntrances() {
  const changed = [];
  if (fs.existsSync(abs('index-complete.html')) && fs.existsSync(abs('index-complete/index.html'))) {
    writeText('index-complete/index.html', readText('index-complete.html'));
    changed.push('index-complete/index.html');
  }
  if (fs.existsSync(abs('knowledge.html'))) {
    let text = readText('knowledge.html');
    text = text.replace(/edge_refresh=round[0-9][^'"&<\s)]*/g, `edge_refresh=${round574.version}`);
    text = text.replace(/target\.searchParams\.set\('edge_refresh',\s*'[^']+'\)/g, `target.searchParams.set('edge_refresh','${round574.version}')`);
    text = replaceAll(text, '381 道默认练习、381 道可直接参考、0 道待人工源页复核、141 条展示线索', '400 道默认练习、400 道可直接参考、0 道待人工源页复核、122 条展示线索');
    text = replaceAll(text, '381 道默认练习、381 道可直接参考答案、0 道待人工源页复核，141 条源文线索', '400 道默认练习、400 道可直接参考答案、0 道待人工源页复核，122 条源文线索');
    text = replaceAll(text, '381 默认练习', '400 默认练习');
    text = replaceAll(text, '381 ready 参考答案', '400 ready 参考答案');
    text = replaceAll(text, '141 源文线索', '122 源文线索');
    text = replaceAll(text, '381 可直接参考', '400 可直接参考');
    text = replaceAll(text, '141 条源文线索', '122 条源文线索');
    text = replaceAll(text, '141 条展示线索', '122 条展示线索');
    writeText('knowledge.html', text);
    changed.push('knowledge.html');
  }
  return changed;
}

const shellFiles = discoverPublicShells();
for (const rel of shellFiles) {
  const old = readText(rel);
  const route = getConst(old, 'ROUTE', '/index-complete');
  const baseSearch = getConst(old, 'BASE_SEARCH', '?edge_refresh=x');
  writeText(rel, buildShell({ rel, route, baseSearch }));
}
syncCurrentStrings(shellFiles);
const legacyDirectFiles = syncLegacyDirectPublicShells();
const extraEntranceFiles = syncExtraPublicEntrances();
writeLedger(shellFiles, legacyDirectFiles.concat(extraEntranceFiles));
updateSiteUpdates();
updateRoadmap();

console.log(JSON.stringify({
  ok: true,
  version: round574.version,
  shellFiles: shellFiles.length,
  legacyDirectFiles: legacyDirectFiles.length,
  extraEntranceFiles: extraEntranceFiles.length,
  generatedAt: now
}, null, 2));
