#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(import.meta.dirname, '..');
const version = 'round355-private-video-storage-readiness-20260615';
const jsonRel = 'data/fluid-round355-private-video-storage-readiness.json';
const docRel = 'docs/round355/private-video-storage-readiness.md';

const sourceFiles = {
  round347BoundaryProof: 'data/fluid-round347-private-video-boundary-proof.json',
  round340UiActions: 'data/fluid-round340-private-video-ui-actions.json',
  round334ManagementActions: 'data/fluid-round334-private-video-management-actions.json',
  round325R2Remediation: 'data/fluid-round325-private-video-r2-remediation.json',
  round305RealAccountQa: 'data/fluid-round305-real-account-qa-readiness.json',
  round304ProductionBlockers: 'data/fluid-round304-private-video-production-blockers.json',
  bindingChecker: 'tools/check-cloudflare-pages-private-video-bindings.mjs',
  browserGate: 'tools/check-private-video-management-browser.mjs',
  runbook: 'docs/private-video-management-runbook.md'
};

const actionOrder = [
  'list',
  'same-access-save',
  'delete-dry-run',
  'delete-course',
  'upload-publish',
  'change-access',
  'archive-course'
];

const actionLabels = {
  list: '列表刷新',
  'same-access-save': '重复保存当前授权',
  'delete-dry-run': '删除 dry-run 预检',
  'delete-course': '永久删除专属课',
  'upload-publish': '上传/发布专属课',
  'change-access': '改授权学生',
  'archive-course': '下架专属课'
};

function parseArgs(argv) {
  const out = { json: false, write: false };
  for (const raw of argv) {
    if (raw === '--json') out.json = true;
    else if (raw === '--write') out.write = true;
    else if (raw === '--no-write') out.write = false;
    else throw new Error(`Unknown argument: ${raw}`);
  }
  return out;
}

function relPath(rel) {
  return path.join(repoRoot, rel);
}

function existsRel(rel) {
  return fs.existsSync(relPath(rel));
}

function readTextMaybe(rel) {
  const file = relPath(rel);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function readJsonArtifact(rel) {
  const plain = relPath(rel);
  const gzip = `${plain}.gz`;
  if (fs.existsSync(plain)) return JSON.parse(fs.readFileSync(plain, 'utf8'));
  if (fs.existsSync(gzip)) return JSON.parse(zlib.gunzipSync(fs.readFileSync(gzip)).toString('utf8'));
  return null;
}

function readExistingGeneratedAt() {
  const file = relPath(jsonRel);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')).generatedAt || null;
  } catch {
    return null;
  }
}

function parseJsonLoose(text) {
  const value = String(text || '').trim();
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {}
  const first = value.indexOf('{');
  const last = value.lastIndexOf('}');
  if (first >= 0 && last > first) {
    try {
      return JSON.parse(value.slice(first, last + 1));
    } catch {}
  }
  return null;
}

function safePreview(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (/^\s*[\[{]/.test(text)) return '<json>';
  return text
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '<redacted-email>')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer <redacted>')
    .replace(/(password|token|secret)\s*[:=]\s*[^,\n\r;]+/gi, '$1=<redacted>')
    .slice(0, 600);
}

function runBindingChecker() {
  if (!existsRel(sourceFiles.bindingChecker)) {
    return {
      command: `node ${sourceFiles.bindingChecker} --json`,
      exitCode: null,
      signal: null,
      parsed: null,
      stdoutPreview: '',
      stderrPreview: 'tool not found'
    };
  }
  const result = spawnSync(process.execPath, [sourceFiles.bindingChecker, '--json'], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {
      ...process.env,
      PYTHONHOME: '',
      PYTHONPATH: '',
      npm_config_python: ''
    },
    timeout: 120000
  });
  return {
    command: `node ${sourceFiles.bindingChecker} --json`,
    exitCode: result.status,
    signal: result.signal || null,
    parsed: parseJsonLoose(result.stdout) || parseJsonLoose(result.stderr),
    stdoutPreview: safePreview(result.stdout),
    stderrPreview: safePreview(result.stderr)
  };
}

function firstBoolean(values) {
  for (const value of values) {
    if (value === true || value === false) return value;
  }
  return null;
}

function firstArray(values) {
  for (const value of values) {
    if (Array.isArray(value)) return value;
  }
  return [];
}

function summarizeStorageBinding({ bindingRun, round347, round340, round334, round325, round304 }) {
  const production = bindingRun.parsed?.production || {};
  const currentHasAuditKv = production.hasAuditKv === true;
  const currentHasPrivateMediaR2 = bindingRun.exitCode === 0 && production.hasPrivateMediaR2 === true;
  const priorHasAuditKv = firstBoolean([
    round347?.r2Boundary?.hasAuditKv,
    round340?.r2Boundary?.hasAuditKv,
    round334?.r2Boundary?.hasAuditKv,
    round325?.r2Boundary?.hasAuditKv,
    round304?.summary?.cloudflareAuditKvReady
  ]);
  const priorHasPrivateMediaR2 = firstBoolean([
    round347?.r2Boundary?.hasPrivateMediaR2,
    round340?.r2Boundary?.hasPrivateMediaR2,
    round334?.r2Boundary?.hasPrivateMediaR2,
    round325?.r2Boundary?.hasPrivateMediaR2,
    round304?.summary?.cloudflarePrivateMediaR2Ready
  ]);
  const hasAuditKv = currentHasAuditKv || priorHasAuditKv === true;
  const hasPrivateMediaR2 = currentHasPrivateMediaR2 ? true : false;
  const currentAuditUsable = bindingRun.parsed && typeof bindingRun.parsed === 'object' && bindingRun.parsed.production;
  return {
    status: hasPrivateMediaR2 ? 'fm-private-media-r2-present-reverify-required' : 'blocked-missing-fm-private-media-r2',
    hasAuditKv,
    hasPrivateMediaR2,
    currentAuditUsable: Boolean(currentAuditUsable),
    currentBindingExitCode: bindingRun.exitCode,
    currentBindingMessage: bindingRun.parsed?.message || null,
    priorHasAuditKv,
    priorHasPrivateMediaR2,
    productionKvBindings: firstArray([
      production.kvBindings,
      round347?.r2Boundary?.productionKvBindings,
      round334?.r2Boundary?.productionKvBindings,
      round325?.r2Boundary?.productionKvBindings
    ]),
    productionR2Bindings: firstArray([
      production.r2Bindings,
      round347?.r2Boundary?.productionR2Bindings,
      round334?.r2Boundary?.productionR2Bindings,
      round325?.r2Boundary?.productionR2Bindings
    ]),
    blocker: hasPrivateMediaR2
      ? 'FM_PRIVATE_MEDIA R2 is present in the current read-only audit; do not claim recovery until the real private-video browser gate is rerun after the binding change.'
      : 'FM_PRIVATE_MEDIA R2 is absent in the current/available proof; upload/publish, true access change, archive, and storage-backed cleanup remain blocked.'
  };
}

function sourceActionState(id, sources) {
  const rows = [
    ...(Array.isArray(sources.round347?.actionProof) ? sources.round347.actionProof : []),
    ...(Array.isArray(sources.round340?.actionMatrix) ? sources.round340.actionMatrix : []),
    ...(Array.isArray(sources.round334?.realTeacherManagementActions) ? sources.round334.realTeacherManagementActions : []),
    ...(Array.isArray(sources.round325?.actionMatrix) ? sources.round325.actionMatrix : [])
  ];
  return rows.find((row) => row.id === id)?.state || null;
}

function actionReason(id, storageBinding) {
  if (id === 'list') return 'Ready: list/refresh is read-only and does not need FM_PRIVATE_MEDIA writes.';
  if (id === 'same-access-save') return 'Ready: saving the same assigned student is an idempotent no-op, not a storage recovery claim.';
  if (id === 'delete-dry-run') return 'Ready: dry-run/preflight reads readiness and cleanup plan without deleting data.';
  if (id === 'delete-course') return 'Limited: the destructive path requires dry-run, exact course-id confirmation, and post-binding re-verification; this artifact performs no delete.';
  if (!storageBinding.hasPrivateMediaR2) return `${actionLabels[id]} is blocked until FM_PRIVATE_MEDIA R2 is bound in production and verified.`;
  return `${actionLabels[id]} remains blocked for this artifact until real teacher/student browser QA is rerun after the storage binding proof.`;
}

function buildActionReadiness(sources, storageBinding) {
  return actionOrder.map((id) => {
    let state = 'blocked';
    if (['list', 'same-access-save', 'delete-dry-run'].includes(id)) state = 'ready';
    else if (id === 'delete-course') state = 'limited';
    return {
      id,
      label: actionLabels[id],
      state,
      sourceState: sourceActionState(id, sources),
      fmAuditRequired: true,
      fmPrivateMediaRequired: ['upload-publish', 'change-access', 'archive-course', 'delete-course'].includes(id),
      cloudflareMutationAttemptedHere: false,
      privateVideoMutationAttemptedHere: false,
      productionRecoveryClaimAllowed: false,
      reason: actionReason(id, storageBinding)
    };
  });
}

function countStates(actions) {
  return actions.reduce((acc, action) => {
    acc[action.state] = (acc[action.state] || 0) + 1;
    return acc;
  }, { ready: 0, limited: 0, blocked: 0 });
}

function operatorNextSteps(storageBinding) {
  return [
    {
      id: 'confirm-readiness-artifact',
      owner: 'operator',
      requiredBeforeRecoveryClaim: true,
      command: 'node tools/check-round355-private-video-storage-readiness.mjs --write --json',
      expected: 'ok=true with FM_AUDIT present and FM_PRIVATE_MEDIA blocker visible.'
    },
    {
      id: 'bind-fm-private-media-r2',
      owner: 'Cloudflare dashboard operator',
      requiredBeforeRecoveryClaim: true,
      action: 'Cloudflare dashboard -> Workers & Pages -> Pages project lghui-fluid-learning -> Settings -> Bindings -> Production -> Add R2 bucket binding -> Variable name FM_PRIVATE_MEDIA -> select the production private-media bucket -> Save.',
      operatorAccessNote: '使用已授权的后台操作身份完成 Cloudflare 绑定；不要把私人登录材料写入仓库产物或对话。'
    },
    {
      id: 'redeploy-after-binding',
      owner: 'release operator',
      requiredAfterBinding: true,
      command: 'npx wrangler pages deploy <OUTPUT_DIR> --project-name=lghui-fluid-learning',
      note: 'Run only after the dashboard binding is saved and the intended output directory is selected by the release operator.'
    },
    {
      id: 'verify-production-binding',
      owner: 'release operator',
      requiredAfterBinding: true,
      command: 'node tools/check-cloudflare-pages-private-video-bindings.mjs --json',
      expected: 'production.hasAuditKv=true and production.hasPrivateMediaR2=true.'
    },
    {
      id: 'rerun-real-private-video-browser-gate',
      owner: 'release operator',
      requiredAfterBinding: true,
      command: 'NODE_PATH=<codex primary runtime node_modules> node tools/check-private-video-management-browser.mjs --production --json',
      expected: '真实教师/学生账号 QA 证明存储链路，不输出私人登录材料。'
    },
    {
      id: 'only-then-reclassify-storage-actions',
      owner: 'release reviewer',
      requiredAfterBinding: true,
      action: 'Only after the binding audit and real browser gate both pass, revisit upload-publish/change-access/archive/delete cleanup readiness. Until then, keep productionRecoveryAllowed=false.',
      currentBlocker: storageBinding.blocker
    }
  ];
}

function forbiddenSensitiveValues(text) {
  const patterns = [
    /CLOUDFLARE_API_TOKEN\s*[:=]/i,
    /Authorization:\s*Bearer\s+[A-Za-z0-9._-]+/i,
    /(?:password|token|secret)\s*[:=]\s*["'][^"']{8,}["']/i,
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/
  ];
  return patterns.filter((pattern) => pattern.test(text)).map(String);
}

function renderMarkdown(payload) {
  const rows = payload.actionReadiness.map((row) => (
    `| \`${row.id}\` | ${row.label} | \`${row.state}\` | ${row.fmPrivateMediaRequired ? 'yes' : 'no'} | ${row.productionRecoveryClaimAllowed ? 'yes' : 'no'} |`
  )).join('\n');
  const steps = payload.operatorNextSteps.map((step) => {
    const action = step.command ? `command: \`${step.command}\`` : `action: ${step.action}`;
    const punctuation = /[.。]$/.test(action) ? '' : '.';
    const expected = step.expected ? ` Expected: ${step.expected}` : '';
    const note = step.note ? ` ${step.note}` : '';
    const currentBlocker = step.currentBlocker ? ` Current blocker: ${step.currentBlocker}` : '';
    return `- \`${step.id}\` (${step.owner}): ${action}${punctuation}${expected}${note}${currentBlocker}`;
  }).join('\n');
  return `# Round355 Private-Video Storage Readiness

Version: \`${payload.version}\`

Generated at: \`${payload.generatedAt}\`

This Task D artifact is guidance and a read-only check. It does not mutate Cloudflare resources, bind R2, upload or publish media, change access, archive courses, delete courses, or claim production storage recovery.

## Binding State

- FM_AUDIT present: \`${payload.storageBinding.hasAuditKv}\`
- FM_PRIVATE_MEDIA present: \`${payload.storageBinding.hasPrivateMediaR2}\`
- status: \`${payload.storageBinding.status}\`
- binding audit exit code: \`${payload.storageBinding.currentBindingExitCode}\`
- blocker: ${payload.storageBinding.blocker}
- productionRecoveryAllowed: \`${payload.claims.productionRecoveryAllowed}\`

## Action Readiness

| Action | Label | State | Needs FM_PRIVATE_MEDIA | Production recovery claim |
| --- | --- | --- | --- | --- |
${rows}

## Operator Next Steps

${steps}

## Boundary Assertions

- \`FM_AUDIT\` must stay present before any private-video storage work proceeds.
- \`FM_PRIVATE_MEDIA\` is treated as absent unless the current read-only production binding audit proves it is bound.
- \`list\`, \`same-access-save\`, and \`delete-dry-run\` are ready only because they are read-only, no-op, or preflight paths.
- \`delete-course\` is limited and destructive; this artifact performs no delete and does not promote storage cleanup.
- \`upload-publish\`, \`change-access\`, and \`archive-course\` are blocked until the production R2 binding and real browser gate both pass.
`;
}

function writeArtifacts(payload) {
  const jsonPath = relPath(jsonRel);
  const docPath = relPath(docRel);
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.mkdirSync(path.dirname(docPath), { recursive: true });
  const jsonText = `${JSON.stringify(payload, null, 2)}\n`;
  fs.writeFileSync(jsonPath, jsonText);
  fs.writeFileSync(`${jsonPath}.gz`, zlib.gzipSync(jsonText, { level: 9 }));
  fs.writeFileSync(docPath, renderMarkdown(payload));
}

function buildPayload() {
  const missingEvidence = Object.values(sourceFiles).filter((rel) => !existsRel(rel));
  const sources = {
    round347: readJsonArtifact(sourceFiles.round347BoundaryProof),
    round340: readJsonArtifact(sourceFiles.round340UiActions),
    round334: readJsonArtifact(sourceFiles.round334ManagementActions),
    round325: readJsonArtifact(sourceFiles.round325R2Remediation),
    round305: readJsonArtifact(sourceFiles.round305RealAccountQa),
    round304: readJsonArtifact(sourceFiles.round304ProductionBlockers)
  };
  const bindingRun = runBindingChecker();
  const storageBinding = summarizeStorageBinding({ bindingRun, ...sources });
  const actionReadiness = buildActionReadiness(sources, storageBinding);
  const summary = countStates(actionReadiness);
  const browserGateText = readTextMaybe(sourceFiles.browserGate);
  const runbookText = readTextMaybe(sourceFiles.runbook);
  const operatorSteps = operatorNextSteps(storageBinding);
  const payload = {
    version,
    generatedAt: readExistingGeneratedAt() || new Date().toISOString(),
    scope: {
      task: 'Task D Round355 private-video storage readiness guidance',
      projectRoot: 'lghui-source-private-video-work',
      wroteOnly: [
        'tools/check-round355-private-video-storage-readiness.mjs',
        jsonRel,
        `${jsonRel}.gz`,
        docRel,
        'tests/edge-fluid-upgrade-check.js'
      ],
      cloudflareMutationAttempted: false,
      cloudflareConfigurationChanged: false,
      privateVideoCourseMutationAttempted: false,
      uploadAttempted: false,
      publishAttempted: false,
      accessChangeAttempted: false,
      archiveAttempted: false,
      realDeleteAttempted: false,
      pythonUsed: false,
      volumesMac2TTouched: false,
      vpnOrProxyTouched: false
    },
    artifacts: {
      tool: 'tools/check-round355-private-video-storage-readiness.mjs',
      json: jsonRel,
      gzip: `${jsonRel}.gz`,
      doc: docRel
    },
    sourceEvidence: {
      files: sourceFiles,
      missingEvidence,
      versions: Object.fromEntries(Object.entries(sources).map(([key, value]) => [key, value?.version || null])),
      currentBindingCommand: bindingRun.command,
      currentBindingExitCode: bindingRun.exitCode
    },
    diagnostics: {
      currentBindingRun: {
        command: bindingRun.command,
        exitCode: bindingRun.exitCode,
        signal: bindingRun.signal,
        parsed: bindingRun.parsed,
        stdoutPreview: bindingRun.stdoutPreview,
        stderrPreview: bindingRun.stderrPreview
      },
      browserGateMentionsPrivateVideoStorage: /private-video storage diagnostic snapshot|storageRepair|FM_PRIVATE_MEDIA/.test(browserGateText),
      runbookMentionsActionReadiness: /动作 readiness 矩阵|FM_PRIVATE_MEDIA/.test(runbookText)
    },
    storageBinding,
    actionReadiness,
    summary,
    operatorNextSteps: operatorSteps,
    claims: {
      fmAuditPresent: storageBinding.hasAuditKv === true,
      fmPrivateMediaAbsentUnlessCurrentAuditProvesBound: storageBinding.hasPrivateMediaR2 === false || bindingRun.exitCode === 0,
      listReady: actionReadiness.find((row) => row.id === 'list')?.state === 'ready',
      sameAccessReady: actionReadiness.find((row) => row.id === 'same-access-save')?.state === 'ready',
      deleteDryRunReady: actionReadiness.find((row) => row.id === 'delete-dry-run')?.state === 'ready',
      deleteCourseLimited: actionReadiness.find((row) => row.id === 'delete-course')?.state === 'limited',
      uploadPublishBlocked: actionReadiness.find((row) => row.id === 'upload-publish')?.state === 'blocked',
      changeAccessBlocked: actionReadiness.find((row) => row.id === 'change-access')?.state === 'blocked',
      archiveBlocked: actionReadiness.find((row) => row.id === 'archive-course')?.state === 'blocked',
      productionRecoveryAllowed: false,
      productionStorageRecoveryClaimed: false,
      r2RepairClaimed: false
    },
    verificationCommands: [
      'node --check tools/check-round355-private-video-storage-readiness.mjs',
      'node tools/check-round355-private-video-storage-readiness.mjs --write --json',
      'node tests/edge-fluid-upgrade-check.js'
    ],
    acceptance: {
      pass: missingEvidence.length === 0
        && storageBinding.hasAuditKv === true
        && storageBinding.hasPrivateMediaR2 === false
        && summary.ready === 3
        && summary.limited === 1
        && summary.blocked === 3
        && actionReadiness.every((row) => row.productionRecoveryClaimAllowed === false)
        && actionReadiness.find((row) => row.id === 'list')?.state === 'ready'
        && actionReadiness.find((row) => row.id === 'same-access-save')?.state === 'ready'
        && actionReadiness.find((row) => row.id === 'delete-course')?.state === 'limited'
        && ['upload-publish', 'change-access', 'archive-course'].every((id) => actionReadiness.find((row) => row.id === id)?.state === 'blocked')
        && operatorSteps.some((step) => /FM_PRIVATE_MEDIA/.test(`${step.action || ''} ${step.command || ''}`))
        && operatorSteps.some((step) => /check-cloudflare-pages-private-video-bindings\.mjs --json/.test(step.command || ''))
        && operatorSteps.some((step) => /check-private-video-management-browser\.mjs --production --json/.test(step.command || ''))
        && forbiddenSensitiveValues(JSON.stringify(operatorSteps)).length === 0,
      meaning: 'Round355 makes the missing FM_PRIVATE_MEDIA storage blocker explicit while preserving ready/limited/blocked action boundaries and avoiding production recovery claims.'
    },
    noSecretsPrinted: true
  };
  const forbidden = forbiddenSensitiveValues(JSON.stringify(payload));
  if (forbidden.length) throw new Error(`Round355 payload contains forbidden sensitive value patterns: ${forbidden.join(', ')}`);
  return payload;
}

const options = parseArgs(process.argv.slice(2));
const payload = buildPayload();
if (options.write) writeArtifacts(payload);

if (options.json) {
  console.log(JSON.stringify({
    ok: payload.acceptance.pass,
    version: payload.version,
    artifacts: payload.artifacts,
    summary: payload.summary,
    storageBinding: payload.storageBinding,
    claims: payload.claims,
    operatorNextSteps: payload.operatorNextSteps.map((step) => ({ id: step.id, owner: step.owner, command: step.command || null, action: step.action || null }))
  }, null, 2));
} else {
  console.log(`${payload.acceptance.pass ? 'PASS' : 'FAIL'} ${version}: ready=${payload.summary.ready} limited=${payload.summary.limited} blocked=${payload.summary.blocked} storage=${payload.storageBinding.status} productionRecoveryAllowed=${payload.claims.productionRecoveryAllowed}`);
}

process.exitCode = payload.acceptance.pass ? 0 : 2;
