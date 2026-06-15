#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const version = 'round355-visible-quality-regression-20260615';
const jsonRel = 'data/fluid-round355-visible-quality-regression.json';
const gzipRel = `${jsonRel}.gz`;
const docRel = 'docs/round355/visible-quality-regression.md';
const generatedAt = process.env.FLUID_ROUND355_VISIBLE_QUALITY_GENERATED_AT
  || readExistingGeneratedAt()
  || '2026-06-15T10:35:00+08:00';

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round355 checks from /Volumes/mac_2T during lifs isolation.');
}

const sourceFiles = {
  siteUpdates: 'site-updates.json',
  middleware: 'functions/_middleware.js',
  sourceIndex: 'index.html',
  home: 'index-complete.html',
  resources: 'resources.html',
  realExams: 'modules/real-exams-dynamic.html',
  questionBank: 'modules/question-bank.html',
  questionBankHome: 'question-bank-home.html',
  html181103Index: 'resources/fluid-181103-html/index.html',
  materialsLedger: 'data/fluid-181103-materials.json'
};

const args = parseArgs(process.argv.slice(2));
const expectedVersion = args.expectedVersion || currentVersion();
const currentRound = roundNumber(expectedVersion);
const legacyCurrentRoundMax = Math.min(349, Math.max(0, currentRound - 1));

const releaseAuthorityFiles = [
  sourceFiles.sourceIndex,
  sourceFiles.home,
  sourceFiles.resources,
  sourceFiles.realExams,
  sourceFiles.questionBankHome
];

const scanTargets = [
  ...Object.entries(sourceFiles)
    .filter(([key]) => !['siteUpdates', 'middleware', 'materialsLedger'].includes(key))
    .map(([key, rel]) => ({ group: key, rel })),
  ...materialHtmlFiles().map((rel) => ({ group: 'html181103Material', rel }))
];

const rows = scanTargets.map(scanTarget);
const issues = rows.flatMap((row) => row.issues.map((issue) => ({ ...issue, rel: row.rel, group: row.group })));
const releaseAuthorityRows = releaseAuthorityFiles.map((rel) => ({
  rel,
  currentVersionVisible: readText(rel).includes(expectedVersion)
}));

const checks = [
  check('site-updates-top-version-current', readJson(sourceFiles.siteUpdates)?.[0]?.version === expectedVersion, {
    expectedVersion,
    actual: readJson(sourceFiles.siteUpdates)?.[0]?.version || ''
  }),
  check('middleware-edge-home-version-current', edgeVersion() === expectedVersion, {
    expectedVersion,
    actual: edgeVersion()
  }),
  check('release-authority-pages-show-current-version', releaseAuthorityRows.every((row) => row.currentVersionVisible), releaseAuthorityRows),
  check('visible-status-placeholders-zero', issueCount('placeholder-current-status') === 0, issueSamples('placeholder-current-status')),
  check('legacy-current-round-leaks-zero', issueCount('legacy-current-round-leak') === 0, issueSamples('legacy-current-round-leak')),
  check('local-path-escapes-zero', issueCount('local-path-escape') === 0, issueSamples('local-path-escape')),
  check('download-viewer-escapes-zero', issueCount('download-viewer-escape') === 0, issueSamples('download-viewer-escape')),
  check('scanned-material-html-count', rows.filter((row) => row.group === 'html181103Material').length === 38, {
    actual: rows.filter((row) => row.group === 'html181103Material').length,
    expected: 38
  })
];

const payload = {
  ok: checks.every((item) => item.pass),
  version,
  expectedVersion,
  generatedAt,
  scope: {
    mode: 'static visible-quality regression guard',
    scannedHtmlFiles: rows.length,
    releaseAuthorityFiles,
    legacyCurrentRoundMax,
    siteUpdatesHistoricalEntriesAllowed: true,
    networkUsed: false,
    browserUsed: false,
    pythonUsed: false,
    mac2TTouched: false,
    privateVideoStorageTouched: false,
    sourceCompletionFilesTouched: false
  },
  sourceFiles,
  summary: {
    scannedFiles: rows.length,
    coreHtmlFiles: rows.filter((row) => row.group !== 'html181103Material').length,
    materialHtmlFiles: rows.filter((row) => row.group === 'html181103Material').length,
    releaseAuthorityCurrentVersionVisible: releaseAuthorityRows.filter((row) => row.currentVersionVisible).length,
    placeholderCurrentStatusIssues: issueCount('placeholder-current-status'),
    legacyCurrentRoundLeaks: issueCount('legacy-current-round-leak'),
    localPathEscapes: issueCount('local-path-escape'),
    downloadViewerEscapes: issueCount('download-viewer-escape'),
    failCount: checks.filter((item) => !item.pass).length
  },
  checks,
  issueSamples: issues.slice(0, 30),
  rows,
  acceptance: {
    pass: checks.every((item) => item.pass),
    meaning: 'Current learner-facing HTML surfaces keep the Round355 release authority visible while 181103 HTML pages remain free of current-status placeholders, legacy current-round wording, local paths, raw downloads, and viewer escapes. Historical site-updates entries are intentionally out of scope.'
  },
  artifacts: {
    tool: 'tools/check-round355-visible-quality-regression.mjs',
    json: jsonRel,
    gzip: gzipRel,
    markdown: docRel
  },
  verificationCommands: [
    'node --check tools/check-round355-visible-quality-regression.mjs',
    'node tools/check-round355-visible-quality-regression.mjs --write --json'
  ]
};

if (args.write) {
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  writeText(jsonRel, body);
  writeBuffer(gzipRel, zlib.gzipSync(body, { level: 9 }));
  writeText(docRel, renderMarkdown(payload));
}

if (args.json) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
else {
  console.log(`${payload.ok ? 'PASS' : 'FAIL'} ${version}: scanned=${payload.summary.scannedFiles}, issues=${issues.length}, failures=${payload.summary.failCount}`);
  for (const issue of issues.slice(0, 20)) console.log(`- ${issue.rel}:${issue.line} ${issue.type}: ${issue.snippet}`);
}

process.exitCode = payload.ok ? 0 : 1;

function scanTarget(target) {
  const html = readText(target.rel);
  const visibleText = visibleTextOnly(html);
  const targetIssues = [
    ...scanCurrentStatusPlaceholders(target.rel, visibleText),
    ...scanLegacyCurrentRoundLeaks(target.rel, visibleText),
    ...scanLocalPathEscapes(target.rel, html),
    ...scanDownloadViewerEscapes(target.rel, html)
  ];

  return {
    ...target,
    bytes: Buffer.byteLength(html),
    currentVersionVisible: html.includes(expectedVersion),
    issueCount: targetIssues.length,
    issues: targetIssues
  };
}

function scanCurrentStatusPlaceholders(rel, text) {
  const out = [];
  const patterns = [/空白/g, /问号/g, /？？/g, /待同步/g];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const context = contextAround(text, match.index, 72);
      if (statusContext(context) && !placeholderAllowedContext(context)) {
        out.push(issue('placeholder-current-status', rel, text, match.index, context));
      }
    }
  }
  return out;
}

function scanLegacyCurrentRoundLeaks(rel, text) {
  const out = [];
  for (const match of text.matchAll(/\b[Rr]ound(\d{3})(?:-[A-Za-z0-9_-]+)?/g)) {
    const number = Number(match[1]);
    if (!Number.isFinite(number) || number > legacyCurrentRoundMax) continue;
    const context = contextAround(text, match.index, 80);
    if (roundStatusContext(context) && !historicalContext(context)) {
      out.push(issue('legacy-current-round-leak', rel, text, match.index, context));
    }
  }
  return out;
}

function scanLocalPathEscapes(rel, html) {
  const out = [];
  for (const match of html.matchAll(/(?:file:\/\/|\/Users\/|\/Volumes\/|[A-Za-z]:\\)/g)) {
    out.push(issue('local-path-escape', rel, html, match.index, contextAround(html, match.index, 100)));
  }
  return out;
}

function scanDownloadViewerEscapes(rel, html) {
  const out = [];
  const attrPattern = /\b(href|action)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(attrPattern)) {
    const value = match[2];
    if (allowedLink(value)) continue;
    if (forbiddenLink(value)) {
      out.push(issue('download-viewer-escape', rel, html, match.index, `${match[1]}="${value}"`));
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*\sdownload(?:[\s=>]|$)/gi)) {
    out.push(issue('download-viewer-escape', rel, html, match.index, contextAround(html, match.index, 120)));
  }
  return out;
}

function forbiddenLink(value) {
  const clean = String(value || '').trim();
  return /(?:^|\/)(?:download|downloads|viewer|raw|original)(?:[/?#._-]|$)/i.test(clean)
    || /[?&#](?:download|viewer|raw|original)=/i.test(clean)
    || /\.(?:pdf|ppt|pptx|doc|docx|zip)(?:[?#]|$)/i.test(clean)
    || /^https?:\/\/[^\s"']+\/(?:download|downloads|viewer|raw|original)(?:[/?#._-]|$)/i.test(clean);
}

function allowedLink(value) {
  const clean = String(value || '').trim();
  return clean.startsWith('#')
    || clean.startsWith('mailto:')
    || clean.startsWith('tel:')
    || /^https:\/\/player\.bilibili\.com\//i.test(clean)
    || /^\/?resources\/fluid-181103-html\/materials\/[^?#]+\/index\.html(?:[?#].*)?$/i.test(clean)
    || /^\/?resources\/fluid-181103-html\/index\.html(?:[?#].*)?$/i.test(clean)
    || /^\/?modules\/(?:real-exams-dynamic|question-bank|practice-dynamic|knowledge-detail)\.html(?:[?#].*)?$/i.test(clean)
    || /^\/?resources\.html(?:[?#].*)?$/i.test(clean)
    || /^\/?index-complete\.html(?:[?#].*)?$/i.test(clean)
    || /^\.\/(?:index-complete|resources|modules\/(?:real-exams-dynamic|question-bank))\.html(?:[?#].*)?$/i.test(clean);
}

function statusContext(context) {
  return /(当前|最新|上线|已在线|已上线|主入口|主库|主显示|正式入口|当前入口|公开给学生|状态|status|current|latest|live|release)/i.test(context);
}

function roundStatusContext(context) {
  return /(当前入口|当前版本|当前发布|最新版本|最新发布|已上线版本|已在线版本|上线版本|主显示版本|主入口版本|release version|current version|latest version)/i.test(context);
}

function placeholderAllowedContext(context) {
  return /(空白或图表页|图片页|文字层|OCR|待补强|暂无题库锚点|没有题目锚点|复核风险|不是\s*OCR\s*完整度承诺)/i.test(context);
}

function historicalContext(context) {
  return /(历史|保留|旧版|早期|不再|不是当前|不是.*主|回放|归档|契约|来源分层|规则继续|继续保留|直达 HTML 规则|继续继承|题数基线|覆盖|校对|证据表|机器证据|直达)/i.test(context);
}

function issue(type, rel, source, index, context) {
  return {
    type,
    line: lineNumber(source, index),
    snippet: compact(context).slice(0, 220)
  };
}

function issueCount(type) {
  return issues.filter((item) => item.type === type).length;
}

function issueSamples(type) {
  return issues.filter((item) => item.type === type).slice(0, 8);
}

function check(id, pass, detail) {
  return { id, pass: Boolean(pass), detail };
}

function currentVersion() {
  const siteUpdates = readJson(sourceFiles.siteUpdates);
  const fromUpdates = Array.isArray(siteUpdates) ? siteUpdates[0]?.version : '';
  return fromUpdates || edgeVersion();
}

function edgeVersion() {
  const match = readText(sourceFiles.middleware).match(/const\s+EDGE_HOME_VERSION\s*=\s*['"]([^'"]+)['"]/);
  if (!match) throw new Error('Unable to infer EDGE_HOME_VERSION from functions/_middleware.js');
  return match[1];
}

function roundNumber(value) {
  const match = String(value || '').match(/round(\d{3})/i);
  return match ? Number(match[1]) : 0;
}

function materialHtmlFiles() {
  const ledger = readJson(sourceFiles.materialsLedger);
  const fromLedger = (Array.isArray(ledger.materials) ? ledger.materials : [])
    .map((row) => row.htmlPath)
    .filter(Boolean)
    .filter((rel) => rel.startsWith('resources/fluid-181103-html/materials/'));
  if (fromLedger.length) return [...new Set(fromLedger)].sort();
  return walkHtml('resources/fluid-181103-html/materials').sort();
}

function walkHtml(startRel) {
  const start = fromRoot(startRel);
  if (!fs.existsSync(start)) return [];
  const out = [];
  const stack = [start];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => b.name.localeCompare(a.name));
    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(abs);
      else if (entry.isFile() && entry.name.endsWith('.html')) out.push(path.relative(repoRoot, abs).split(path.sep).join('/'));
    }
  }
  return out;
}

function visibleTextOnly(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function contextAround(text, index, radius) {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + radius);
  return text.slice(start, end);
}

function lineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

function compact(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function parseArgs(argv) {
  const parsed = { write: false, json: false, expectedVersion: '' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--write') parsed.write = true;
    else if (arg === '--json') parsed.json = true;
    else if (arg === '--expected-version') parsed.expectedVersion = argv[++index] || '';
    else if (arg.startsWith('--expected-version=')) parsed.expectedVersion = arg.slice('--expected-version='.length);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return parsed;
}

function fromRoot(rel) {
  return path.join(repoRoot, rel);
}

function readText(rel) {
  return fs.readFileSync(fromRoot(rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function writeText(rel, text) {
  const file = fromRoot(rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text.endsWith('\n') ? text : `${text}\n`);
}

function writeBuffer(rel, buffer) {
  const file = fromRoot(rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buffer);
}

function readExistingGeneratedAt() {
  try {
    return JSON.parse(readText(jsonRel)).generatedAt || null;
  } catch {
    return null;
  }
}

function renderMarkdown(report) {
  const checkRows = report.checks
    .map((row) => `| ${row.id} | ${row.pass ? 'PASS' : 'FAIL'} |`)
    .join('\n');
  const issueRows = report.issueSamples.length
    ? report.issueSamples.map((row) => `| ${row.rel} | ${row.line} | ${row.type} | ${row.snippet.replace(/\|/g, '/')} |`).join('\n')
    : '| none | - | - | - |';

  return `# Round355 Visible Quality Regression

Version: \`${report.version}\`

Expected current version: \`${report.expectedVersion}\`

## Summary

- scanned HTML files: ${report.summary.scannedFiles}
- material HTML files: ${report.summary.materialHtmlFiles}/38
- release authority pages with current version: ${report.summary.releaseAuthorityCurrentVersionVisible}/${report.scope.releaseAuthorityFiles.length}
- current-status placeholder issues: ${report.summary.placeholderCurrentStatusIssues}
- legacy current-round leaks: ${report.summary.legacyCurrentRoundLeaks}
- local path escapes: ${report.summary.localPathEscapes}
- download/viewer escapes: ${report.summary.downloadViewerEscapes}
- failed checks: ${report.summary.failCount}

## Checks

| check | status |
|---|---|
${checkRows}

## Issue Samples

| file | line | type | snippet |
|---|---:|---|---|
${issueRows}

## Boundary

This is a static HTML confidence gate. It does not edit 181103 source-completion files, private-video storage files, or historical \`site-updates.json\` entries.
`;
}
