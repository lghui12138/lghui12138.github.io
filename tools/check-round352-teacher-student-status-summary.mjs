#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const version = 'round352-teacher-student-status-summary-20260615';
const jsonRel = 'data/fluid-round352-teacher-student-status-summary.json';
const gzipRel = `${jsonRel}.gz`;
const docRel = 'docs/round352-teacher-student-status-summary.md';
const generatedAt = process.env.FLUID_ROUND352_TEACHER_STATUS_GENERATED_AT
  || readExistingGeneratedAt()
  || '2026-06-15T22:40:00+08:00';

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round352 checks from /Volumes/mac_2T during lifs isolation.');
}

const args = parseArgs(process.argv.slice(2));
const files = {
  rootTeacherPanel: 'teacher-panel.html',
  moduleTeacherPanel: 'modules/teacher-panel.html',
  resources: 'resources.html',
  middleware: 'functions/_middleware.js',
  sourceSearch: 'data/fluid-source-search-index.json',
  homeSearch: 'data/fluid-home-search-index.json',
  roadmap: 'data/fluid-upgrade-roadmap-100.json',
  siteUpdates: 'site-updates.json',
  realExamBrowser: 'tools/check-real-exam-integrity-browser.mjs'
};

const text = {
  rootTeacherPanel: readText(files.rootTeacherPanel),
  moduleTeacherPanel: readText(files.moduleTeacherPanel),
  resources: readText(files.resources),
  middleware: readText(files.middleware),
  realExamBrowser: readText(files.realExamBrowser)
};
const json = {
  sourceSearch: readJson(files.sourceSearch),
  homeSearch: readJson(files.homeSearch),
  roadmap: readJson(files.roadmap),
  siteUpdates: readJson(files.siteUpdates)
};

const source181103Rows = (json.sourceSearch.entries || []).filter(row => row.sourceCollection === 'fluid-181103-materials');
const source181103DirectRows = source181103Rows.filter(row => /^\/resources\/fluid-181103-html\/materials\/.+\/index\.html$/.test(row.url || '') && row.sourceUrl === row.url);
const homeReviewRows = (json.homeSearch.entries || []).filter(row => /181103-material-review/.test(row.u || '') || /68真题复核|资料题不冒充真题/.test(`${row.n || ''} ${row.d || ''} ${row.k || ''}`));
const round351 = (json.roadmap.rounds || []).find(row => Number(row.round) === 351) || {};
const round352 = (json.roadmap.rounds || []).find(row => Number(row.round) === 352) || {};

const payload = {
  ok: false,
  version,
  generatedAt,
  scope: {
    mode: 'teacher student status summary, 181103 source-search HTML routing, real-exam five-item browser lock, and private-video R2 boundary',
    networkUsed: false,
    browserUsed: false,
    pythonUsed: false,
    mac2TTouched: false,
    productionRecoveryClaimed: false
  },
  sourceFiles: files,
  summary: {
    siteUpdatesVersion: json.siteUpdates[0]?.version || null,
    roadmapVersion: json.roadmap.releaseGate?.currentVersion || json.roadmap.version || null,
    edgeHomeVersion: edgeVersion(text.middleware),
    currentRound: json.roadmap.currentRound,
    source181103Rows: source181103Rows.length,
    source181103DirectRows: source181103DirectRows.length,
    homeReviewIntentRows: homeReviewRows.length,
    round351Status: round351.status || null,
    round352Status: round352.status || null
  },
  checks: []
};

payload.checks = buildChecks();
payload.ok = payload.checks.every(item => item.pass);
payload.acceptance = {
  pass: payload.ok,
  meaning: 'Round352 makes the teacher-facing student status summary visible on both teacher surfaces while preserving 181103 HTML/source-search discovery, real-exam no-merge locks, and private-video R2 blocker honesty.'
};
payload.artifacts = {
  tool: 'tools/check-round352-teacher-student-status-summary.mjs',
  json: jsonRel,
  gzip: gzipRel,
  markdown: docRel
};
payload.verificationCommands = [
  'node --check tools/check-round352-teacher-student-status-summary.mjs',
  'node tools/check-round352-teacher-student-status-summary.mjs --write --json'
];

if (args.write) {
  const body = `${JSON.stringify(payload, null, 2)}\n`;
  writeText(jsonRel, body);
  writeBuffer(gzipRel, zlib.gzipSync(body, { level: 9 }));
  writeText(docRel, renderMarkdown(payload));
}

if (args.json) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
else {
  console.log(`${payload.ok ? 'PASS' : 'FAIL'} ${version}: checks=${payload.checks.filter(item => item.pass).length}/${payload.checks.length}`);
  for (const item of payload.checks.filter(check => !check.pass)) console.log(`- ${item.id}`);
}
process.exitCode = payload.ok ? 0 : 1;

function buildChecks() {
  return [
    check('round352-version-sources-align', payload.summary.siteUpdatesVersion === version
      && payload.summary.roadmapVersion === version
      && payload.summary.edgeHomeVersion === version
      && payload.summary.currentRound === 352, payload.summary),
    check('roadmap-round352-active-round351-done', round351.status === 'done'
      && round352.status === 'active'
      && /teacher-workflow|学生状态汇总|check-round352-teacher-student-status-summary\.mjs/.test(JSON.stringify(round352)), {
      round351: round351.status,
      round352: round352.status
    }),
    check('root-teacher-panel-round352-summary-visible', allNeedles(text.rootTeacherPanel, [
      'data-round352-teacher-student-status-summary="round352-teacher-student-status-summary-20260615"',
      'id="round352TeacherStudentStatusSummary"',
      'role="status"',
      'aria-live="polite"',
      'renderRound352TeacherStudentStatusSummary',
      'getRound352TeacherStudentStatus',
      'ACCESS_POLICY',
      '181103 全 HTML',
      '历年真题拆题',
      'FM_PRIVATE_MEDIA R2 binding',
      '真实账号 QA',
      '不把缺 FM_PRIVATE_MEDIA 的生产恢复说成已完成'
    ]), files.rootTeacherPanel),
    check('module-teacher-panel-round352-summary-visible', allNeedles(text.moduleTeacherPanel, [
      'Round352 · 学生状态汇总',
      'id="round352StudentStatusSummary"',
      'role="status"',
      'aria-live="polite"',
      'renderRound352StudentStatusSummary',
      'getRound352StudentStatus',
      '本设备 localStorage',
      '181103 全 HTML',
      '历年真题拆题',
      'FM_PRIVATE_MEDIA R2 binding'
    ]), files.moduleTeacherPanel),
    check('private-video-r2-boundary-not-overclaimed', allNeedles(text.rootTeacherPanel, [
      '上传/发布、真正改授权、下架和完整存储清理仍需 FM_PRIVATE_MEDIA R2 binding 与真实账号 QA 同时通过',
      '删除 dry-run 和受限删除会明确显示',
      '缺 FM_PRIVATE_MEDIA 时不宣称生产上传、改授权或下架恢复',
      'R2 边界'
    ]) && allNeedles(text.resources, [
      '当前账号暂未分配',
      '上传发布仍看 FM_PRIVATE_MEDIA R2 blocker'
    ]) && /id:\s*'upload-publish'[\s\S]{0,120}state:\s*r2Available\s*\?\s*metadataWriteState\s*:\s*'blocked'/.test(text.middleware)
      && /id:\s*'change-access'[\s\S]{0,120}state:\s*r2Available\s*\?\s*metadataWriteState\s*:\s*'blocked'/.test(text.middleware)
      && /id:\s*'archive-course'[\s\S]{0,120}state:\s*r2Available\s*\?\s*metadataWriteState\s*:\s*'blocked'/.test(text.middleware), {
      root: files.rootTeacherPanel,
      resources: files.resources,
      middleware: files.middleware
    }),
    check('source-search-181103-direct-html-38-of-38', source181103Rows.length === 38
      && source181103DirectRows.length === 38
      && json.sourceSearch.supplemental181103DirectHtmlEntries === 38, {
      source181103Rows: source181103Rows.length,
      directHtmlRows: source181103DirectRows.length
    }),
    check('home-search-has-181103-review-intent', homeReviewRows.length >= 1
      && json.homeSearch.currentEntryVersion === version, {
      homeReviewIntentRows: homeReviewRows.length,
      currentEntryVersion: json.homeSearch.currentEntryVersion
    }),
    check('real-exam-browser-gate-locks-2019-five-items', allNeedles(text.realExamBrowser, [
      `DEFAULT_EXPECTED_VERSION = '${version}'`,
      '2019 five term/concept sub-questions',
      "firstQuestionId: 'ocean-2019-01-01'",
      "lastQuestionId: 'ocean-2019-01-05'",
      'parent audit queue is missing 2019 five-part term/concept parent row',
      'source-subquestion expansion ledger is missing 2019 five-subquestion row'
    ]), files.realExamBrowser)
  ];
}

function check(id, pass, details) {
  return { id, pass: !!pass, details };
}

function allNeedles(source, needles) {
  return needles.every(needle => source.includes(needle));
}

function edgeVersion(source) {
  return (source.match(/EDGE_HOME_VERSION\s*=\s*['"]([^'"]+)['"]/) || [])[1] || null;
}

function readText(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function writeText(rel, body) {
  fs.mkdirSync(path.dirname(path.join(repoRoot, rel)), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, rel), body);
}

function writeBuffer(rel, body) {
  fs.mkdirSync(path.dirname(path.join(repoRoot, rel)), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, rel), body);
}

function readExistingGeneratedAt() {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(repoRoot, jsonRel), 'utf8'));
    return parsed.generatedAt;
  } catch {
    return null;
  }
}

function renderMarkdown(data) {
  const passCount = data.checks.filter(item => item.pass).length;
  const failRows = data.checks.filter(item => !item.pass).map(item => `- ${item.id}`).join('\n') || '- 无';
  return `# Round352 Teacher Student Status Summary\n\n- Version: ${data.version}\n- Generated: ${data.generatedAt}\n- Result: ${data.ok ? 'PASS' : 'FAIL'} (${passCount}/${data.checks.length})\n- Source-search 181103 HTML: ${data.summary.source181103DirectRows}/${data.summary.source181103Rows}\n- Home review intents: ${data.summary.homeReviewIntentRows}\n- Private video recovery claimed: false\n\n## Failed Checks\n\n${failRows}\n\n## Boundary\n\nRound352 is a teacher-workflow release. It does not claim private-video production recovery until FM_PRIVATE_MEDIA R2 binding and real-account QA pass.\n`;
}

function parseArgs(argv) {
  const parsed = {};
  for (const item of argv) {
    if (item === '--write') parsed.write = true;
    if (item === '--json') parsed.json = true;
  }
  return parsed;
}
