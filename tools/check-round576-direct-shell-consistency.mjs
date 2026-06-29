#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { round576, round576CurrentSurfaceFiles, round576DirectShellFiles } from './round576-direct-shell-data.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const qaDir = path.join(repoRoot, 'output/qa');
const outJson = path.join(qaDir, 'round576-direct-shell-consistency-local-gate.json');

if (repoRoot.startsWith('/Volumes/mac_2T') || process.cwd().startsWith('/Volumes/mac_2T')) {
  throw new Error('Refusing to run Round576 QA from /Volumes/mac_2T during lifs isolation.');
}

fs.mkdirSync(qaDir, { recursive: true });

function abs(rel) {
  return path.join(repoRoot, rel);
}

function readText(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function readJson(rel) {
  return JSON.parse(readText(rel));
}

function gzipMatchesJson(rel) {
  const json = readText(rel);
  const gz = zlib.gunzipSync(fs.readFileSync(abs(`${rel}.gz`))).toString('utf8');
  return json === gz;
}

function walkHtml(dir = repoRoot, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'output', 'node_modules', 'vendor'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(path.relative(repoRoot, full));
  }
  return out;
}

const checks = [];
function check(name, pass, detail = {}) {
  checks.push({ name, pass: Boolean(pass), detail });
}

const ledger = readJson('data/fluid-round576-direct-shell-consistency-ledger.json');
const siteUpdates = readJson('site-updates.json');
const roadmap = readJson('data/fluid-upgrade-roadmap-100.json');
const middleware = readText('functions/_middleware.js');
const home = readText('question-bank-home.html');
const index = readText('index.html');
const realExam = readText('modules/real-exams-dynamic.html');

check('Round576 ledger is non-deleting and preserves answer/proof counts', ledger.ok === true
  && ledger.version === round576.version
  && ledger.previousVersion === round576.previousVersion
  && ledger.previousPublicShellVersion === round576.previousPublicShellVersion
  && ledger.nonDeletingUpgrade === true
  && ledger.publicShellAndAliasOnly === true
  && ledger.changedAnswerContent === false
  && ledger.changedProofDepthContent === false
  && ledger.metrics?.referencePracticeRows181103 === 400
  && ledger.metrics?.sourceClueOnlyRows181103 === 122
  && ledger.metrics?.proofDepthRows181103 === 422
  && ledger.metrics?.proofDepthRewriteRows181103 === 6
  && ledger.metrics?.realExamAnswerDepthRows === 145
  && ledger.metrics?.strictAnswerPdfProofRows === 0
  && Array.isArray(ledger.directShellFiles)
  && ledger.directShellFiles.length === round576DirectShellFiles.length, ledger.metrics || {});

check('ledger/site-updates/roadmap gzip sidecars match JSON',
  gzipMatchesJson('data/fluid-round576-direct-shell-consistency-ledger.json')
  && gzipMatchesJson('site-updates.json')
  && gzipMatchesJson('data/fluid-upgrade-roadmap-100.json'), {});

check('site-updates top entry is Round576', siteUpdates[0]?.version === round576.version
  && siteUpdates[0]?.previousVersion === round576.previousVersion
  && siteUpdates[0]?.metrics?.referencePracticeRows === 400
  && siteUpdates[0]?.metrics?.sourceClueOnlyRows === 122
  && siteUpdates[0]?.metrics?.proofDepthRows === 422
  && siteUpdates[0]?.metrics?.realExamAnswerDepthRows === 145
  && siteUpdates[0]?.metrics?.strictAnswerPdfProof === 0
  && siteUpdates[0]?.boundary?.publicShellAndAliasOnly === true
  && siteUpdates[0]?.boundary?.strictAnswerPdfProof === 'separate', siteUpdates[0] || {});

const gateCommands = roadmap.releaseGate?.commands || [];
check('roadmap and release gate point to Round576', roadmap.version === round576.version
  && roadmap.currentVersion === round576.version
  && roadmap.currentReleaseVersion === round576.version
  && roadmap.currentRound === 576
  && roadmap.lastIntegratedRound === 576
  && roadmap.releaseGate?.currentVersion === round576.version
  && roadmap.releaseGate?.expectedVersion === round576.version
  && roadmap.releaseGate?.currentRound === 576
  && roadmap.round576DirectShellConsistency === true
  && gateCommands.some((command) => command.includes('apply-round576-direct-shell-consistency.mjs'))
  && gateCommands.some((command) => command.includes('check-round576-direct-shell-consistency.mjs'))
  && gateCommands.some((command) => command.includes('check-round576-direct-shell-visual.mjs'))
  && gateCommands.some((command) => command.includes(`--expected-version ${round576.version}`)), {
  currentRound: roadmap.currentRound,
  commands: gateCommands.slice(0, 8)
});

check('middleware edge versions are Round576', middleware.includes(`const EDGE_HOME_VERSION = '${round576.version}';`)
  && middleware.includes(`const EDGE_RUNTIME_JS_VERSION = '${round576.version}';`)
  && middleware.includes('Round576: direct public shell and alias-route cache-bust consistency'), {});

check('main visible entrances show Round576 while keeping Round575/Round572 content boundaries', home.includes('<b>Round576</b>')
  && home.includes(round576.version)
  && home.includes('data-round576-direct-shell-consistency="1"')
  && home.includes('fluid-round576-direct-shell-consistency-ledger.json')
  && index.includes(`当前发布：Round576 · ${round576.version}`)
  && realExam.includes(`当前版本：Round576 · ${round576.version}`)
  && home.includes('400/122')
  && home.includes('422/6')
  && home.includes('真 <strong>145</strong> / PDF <strong>0</strong>')
  && home.includes('strictAnswerPdfProof 仍为 0'), {});

const currentSurfaceScan = round576CurrentSurfaceFiles
  .filter((rel) => fs.existsSync(abs(rel)))
  .map((rel) => {
    const text = readText(rel);
    return {
      rel,
      hasRound576: text.includes(round576.version),
      previousVersionHits: text.split(round576.previousVersion).length - 1,
      previousPublicHits: text.split(round576.previousPublicShellVersion).length - 1
    };
  });
check('current surfaces use Round576 rather than Round575/Round574 current cache-bust',
  currentSurfaceScan.every((row) => row.hasRound576 && row.previousVersionHits === 0 && row.previousPublicHits === 0), {
  rows: currentSurfaceScan.filter((row) => !row.hasRound576 || row.previousVersionHits !== 0 || row.previousPublicHits !== 0)
});

const directShellScan = round576DirectShellFiles
  .filter((rel) => fs.existsSync(abs(rel)))
  .map((rel) => {
    const text = readText(rel);
    return {
      rel,
      hasRound576: text.includes(round576.version),
      oldRuntimeEdgeRefresh: /edge_refresh=round574-public-shell-freshness-flow-20260629|target\.searchParams\.set\('edge_refresh','round574-public-shell-freshness-flow-20260629'\)/.test(text),
      oldVisibleCurrent: /当前公开壳版本(?:是|为)[^。<]*round574-public-shell-freshness-flow-20260629/.test(text),
      routeLinksRound576: !text.includes('data-round574-route=') && !text.includes('data-round574-public-shell="1"')
    };
  });
check('direct shells and alias routes no longer carry Round574 runtime redirects', directShellScan.length === round576DirectShellFiles.length
  && directShellScan.every((row) => row.hasRound576 && !row.oldRuntimeEdgeRefresh && !row.oldVisibleCurrent && row.routeLinksRound576), {
  failures: directShellScan.filter((row) => !row.hasRound576 || row.oldRuntimeEdgeRefresh || row.oldVisibleCurrent || !row.routeLinksRound576)
});

const remainingRound574Html = walkHtml().filter((rel) => readText(rel).includes(round576.previousPublicShellVersion)).sort();
check('no HTML file outside historical JSON/update logs still references Round574 public shell version', remainingRound574Html.length === 0, {
  remainingRound574Html
});

const staleCurrentCounts = round576CurrentSurfaceFiles.flatMap((rel) => {
  if (!fs.existsSync(abs(rel))) return [];
  const text = readText(rel);
  return /381\+0 answers|381 道默认练习|141 leads|390 道默认练习题|132 条源文线索/.test(text) ? [rel] : [];
});
check('current surfaces have no stale 381/141 or 390/132 count copy', staleCurrentCounts.length === 0, { staleCurrentCounts });

const report = {
  ok: checks.every((row) => row.pass),
  version: round576.version,
  generatedAt: new Date().toISOString(),
  checks
};

fs.writeFileSync(outJson, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
