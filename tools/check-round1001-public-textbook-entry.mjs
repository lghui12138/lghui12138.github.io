#!/usr/bin/env node
// Public-shell-only gate for the protected three-textbook entry.
import fs from 'node:fs';
import path from 'node:path';

const repo = path.resolve(import.meta.dirname, '..');
const VERSION = 'round1001-public-textbook-entry-current-20260821';
const read = (relative) => fs.readFileSync(path.join(repo, relative), 'utf8');
const updates = JSON.parse(read('public-shell/site-updates.json'));
const edgeShell = read('public-shell/assets/edge-shell.js');
const home = read('public-shell/index-complete.html');
const workflow = read('.github/workflows/deploy-github-pages.yml');
const checks = [];
const check = (id, ok) => checks.push({ id, ok: Boolean(ok) });

check('ledger-version', updates.length === 16 && updates[0]?.version === VERSION && updates[0]?.previousVersion === 'round1000-textbook-library-progress-dashboard-current-20260821');
check('edge-refresh', edgeShell.includes(`const EDGE_REFRESH = '${VERSION}'`));
check('home-entry', home.includes('data-source-path="/resources/fluid-textbooks/converted/index.html"') && home.includes('>三本资料<'));
check('route-map', edgeShell.includes("['/resources/fluid-textbooks/converted/index.html', '/resources/fluid-textbooks/converted/index']") && edgeShell.includes("['/resources/fluid-textbooks/converted/index', '/resources/fluid-textbooks/converted/index']") && edgeShell.includes("['/resources/fluid-textbooks/converted', '/resources/fluid-textbooks/converted/index']"));
check('pages-routes', workflow.includes('resources/fluid-textbooks/converted/index.html') && workflow.includes('resources/fluid-textbooks/converted/index/index.html'));
check('no-private-textbook-content', !home.includes('data-fth-library-book') && !home.includes('source-pdfs') && !home.includes('question-banks'));

const failures = checks.filter((item) => !item.ok);
console.log(JSON.stringify({ ok: failures.length === 0, VERSION, checks, failures }, null, 2));
if (failures.length) process.exitCode = 1;
