#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const args = parseArgs(process.argv.slice(2));
const version = 'round318-private-video-production-boundary-20260614';

const files = {
  doc: 'docs/round318/private-video-production-boundary.md',
  runbook: 'docs/private-video-management-runbook.md',
  middleware: 'functions/_middleware.js',
  r2HardStop: 'data/fluid-round305-r2-binding-hard-stop.json',
  productionBlockers: 'data/fluid-round304-private-video-production-blockers.json',
  round307Tool: 'tools/check-round307-private-video-management.mjs'
};

const doc = read(files.doc);
const runbook = read(files.runbook);
const middleware = read(files.middleware);
const round307Tool = read(files.round307Tool);
const r2HardStop = readJson(files.r2HardStop);
const productionBlockers = readJson(files.productionBlockers);

const checks = [
  textCheck('round318-doc-version', files.doc, doc, [
    /round318-private-video-production-boundary-20260614/,
    /Production recovery eligible: no/,
    /Production recovery claim allowed: false/,
    /Local\/source gate is production proof: false/,
    /FM_PRIVATE_MEDIA production R2 proven by current artifact: no/,
    /Real teacher\/student browser QA credential\/browser gate may be ready; it is not enough without FM_PRIVATE_MEDIA R2\./,
    /Production-ready private-video recovery actions: 0 while FM_PRIVATE_MEDIA R2 is missing\./
  ]),
  textCheck('round318-claim-rules', files.doc, doc, [
    /Allowed wording:/,
    /Disallowed wording until both hard blockers pass:/,
    /production recovery remains blocked by FM_PRIVATE_MEDIA R2 and real account QA/,
    /private-video production recovery is complete/,
    /A passing Round318 result means the site is protected against overclaiming; it does not authorize a production recovery statement\./
  ]),
  textCheck('round318-safety-scope', files.doc, doc, [
    /No credentials, cookies, tokens, or account values are stored here\./,
    /No destructive Cloudflare action is required by this gate\./,
    /No VPN\/proxy state change is part of this gate\./,
    /No `\/Volumes\/mac_2T` path, cwd, Python, lxml, or external-volume scan is required\./
  ]),
  jsonCheck('r2-hard-stop-currently-blocked', files.r2HardStop, [
    ['bindingAudit.production.hasAuditKv', true],
    ['bindingAudit.production.hasPrivateMediaR2', false],
    ['hardStop.productionPrivateVideoRecovery', false],
    ['hardStop.localMockIsProductionProof', false],
    ['hardStop.productionReadyBlocker', 'missing-FM_PRIVATE_MEDIA-production-R2-binding']
  ], r2HardStop),
  arrayIncludesCheck('r2-hard-stop-blocked-actions', files.r2HardStop, r2HardStop?.hardStop?.blockedActions, [
    'upload',
    'publish',
    'access-change',
    'archive',
    'delete-dynamic-course'
  ]),
  jsonCheck('real-account-qa-and-r2-boundary', files.productionBlockers, [
    ['productionRecoveryEligible', false],
    ['productionRecoveryClaimAllowed', false],
    ['summary.cloudflarePrivateMediaR2Ready', false],
    ['authReadiness.credentialValuesPrinted', false],
    ['authReadiness.authenticatedAccountQa.claimAllowed', true],
    ['authReadiness.privateVideoAccountQa.claimAllowed', true]
  ], productionBlockers),
  textCheck('runbook-minimum-conditions-present', files.runbook, runbook, [
    /生产恢复的最低条件必须同时满足/,
    /FM_PRIVATE_MEDIA` R2 binding/,
    /真实教师账号能打开教师后台并完成私有视频管理浏览器 gate/,
    /不能写成真实账号已验证/
  ]),
  textCheck('middleware-production-blocker-copy-present', files.middleware, middleware, [
    /生产 blocker：Cloudflare Pages 缺少 FM_PRIVATE_MEDIA R2 binding/,
    /生产恢复还必须使用真实教师账号完成浏览器验收/,
    /productionBlocker/,
    /productionAcceptance/,
    /上传、发布、真正改授权、下架和存储清理不能声明生产恢复/
  ]),
  textCheck('round307-gate-still-blocks-recovery-claims', files.round307Tool, round307Tool, [
    /productionActionsReady:\s*false/,
    /productionRecoveryClaimAllowed:\s*false/,
    /FM_PRIVATE_MEDIA R2 and real teacher-account browser QA/
  ])
];

const forbiddenClaims = [
  /Production recovery eligible:\s*yes/i,
  /Production recovery claim allowed:\s*true/i,
  /FM_PRIVATE_MEDIA production R2 proven by current artifact:\s*yes/i,
  /Production-ready private-video recovery actions:\s*[1-9]\d*/i
];

const forbidden = forbiddenClaims
  .filter((pattern) => pattern.test(doc))
  .map((pattern) => pattern.toString());

const ok = checks.every((check) => check.pass) && forbidden.length === 0;
const payload = {
  ok,
  version,
  generatedAt: new Date().toISOString(),
  targetRound: 318,
  gate: 'private-video-production-boundary',
  productionRecoveryEligible: false,
  productionRecoveryClaimAllowed: false,
  productionReadyActions: 0,
  blockers: [
    'FM_PRIVATE_MEDIA-production-R2-binding',
    'real-teacher-student-browser-QA',
    'production-action-eligibility'
  ],
  filesChecked: Object.values(files),
  checks,
  forbiddenClaims: {
    pass: forbidden.length === 0,
    missing: forbidden
  },
  acceptance: {
    pass: ok,
    meaning: 'Round318 proves the production boundary is protected against recovery overclaims; it does not prove private-video production recovery.'
  }
};

assertSafe(payload);

if (args.json) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
else {
  console.log(`${ok ? 'PASS' : 'FAIL'} ${version}: recovery=false productionReadyActions=0 checks=${checks.filter((row) => row.pass).length}/${checks.length}`);
  for (const row of checks) {
    if (!row.pass) console.log(`- ${row.id}: ${row.missing.join(', ')}`);
  }
  if (forbidden.length) console.log(`- forbidden-claims: ${forbidden.join(', ')}`);
}

process.exitCode = ok ? 0 : 1;

function parseArgs(argv) {
  const out = { json: false };
  for (const arg of argv) {
    if (arg === '--json') out.json = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return out;
}

function read(relPath) {
  return fs.readFileSync(path.join(repoRoot, relPath), 'utf8');
}

function readJson(relPath) {
  return JSON.parse(read(relPath));
}

function textCheck(id, file, text, patterns) {
  const missing = patterns.filter((pattern) => !pattern.test(text || '')).map(String);
  return { id, file, pass: missing.length === 0, missing };
}

function jsonCheck(id, file, expectations, value) {
  const missing = expectations
    .filter(([key, expected]) => getPath(value, key) !== expected)
    .map(([key, expected]) => `${key}=${JSON.stringify(expected)}`);
  return { id, file, pass: missing.length === 0, missing };
}

function arrayIncludesCheck(id, file, value, expectedItems) {
  const items = Array.isArray(value) ? value : [];
  const missing = expectedItems.filter((item) => !items.includes(item));
  return { id, file, pass: missing.length === 0, missing };
}

function getPath(value, dottedPath) {
  return dottedPath.split('.').reduce((current, key) => (current == null ? undefined : current[key]), value);
}

function assertSafe(payload) {
  const text = JSON.stringify(payload);
  if (/(password|cookie|bearer|authorization|tokenValue|secretValue)/i.test(text)) {
    throw new Error('unsafe credential-like output detected');
  }
}
