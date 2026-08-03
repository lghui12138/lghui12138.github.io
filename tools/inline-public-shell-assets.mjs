import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const css = readFileSync(resolve(root, 'public-shell/assets/edge-shell.css'), 'utf8').trim();
const script = readFileSync(resolve(root, 'public-shell/assets/edge-shell.js'), 'utf8').trim();
const updatesSource = readFileSync(resolve(root, 'public-shell/site-updates.json'), 'utf8');

const refreshMatch = script.match(/const EDGE_REFRESH = '([^']+)'/);
if (!refreshMatch) throw new Error('Public-shell EDGE_REFRESH is missing');

if (Buffer.byteLength(updatesSource) > 64 * 1024) {
  throw new Error('Public site-updates.json exceeds the 64 KiB release-ledger limit');
}

const updates = JSON.parse(updatesSource);
const allowedUpdateKeys = new Set([
  'version',
  'previousVersion',
  'date',
  'title',
  'summary',
  'links'
]);
if (!Array.isArray(updates) || updates.length === 0 || updates.length > 16) {
  throw new Error('Public site-updates.json must contain 1-16 compact release records');
}
if (updates[0]?.version !== refreshMatch[1]) {
  throw new Error('Public site-updates.json and EDGE_REFRESH are not on the same release');
}
for (const [index, update] of updates.entries()) {
  const unexpectedKeys = Object.keys(update || {}).filter((key) => !allowedUpdateKeys.has(key));
  if (unexpectedKeys.length > 0) {
    throw new Error(`Public release record ${index} exposes unsupported keys: ${unexpectedKeys.join(', ')}`);
  }
}
if (/\/Users\/|\/Volumes\/|source-materials\/|(?:^|\s)qa\/|tools\/|\.github\//m.test(updatesSource)) {
  throw new Error('Public site-updates.json exposes internal paths or QA metadata');
}

if (css.includes('</style>') || script.includes('</script>')) {
  throw new Error('Public-shell assets contain an unsafe inline closing tag');
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  throw new Error('Pass at least one staged HTML file to inline');
}

for (const target of targets) {
  const absolute = resolve(root, target);
  let html = readFileSync(absolute, 'utf8');
  const cssLink = /\s*<link rel="stylesheet" href="\/assets\/edge-shell\.css\?v=[^"]+">/;
  const scriptTag = /\s*<script defer src="\/assets\/edge-shell\.js\?v=[^"]+"><\/script>/;

  if (!cssLink.test(html) || !scriptTag.test(html)) {
    throw new Error(`${target}: public-shell asset tags are missing`);
  }

  html = html.replace(cssLink, `\n  <style data-edge-shell-critical>\n${css}\n  </style>`);
  html = html.replace(scriptTag, '');
  html = html.replace(
    '</body>',
    `  <script data-edge-shell-inline>\n${script}\n  </script>\n</body>`
  );

  if (html.includes('/assets/edge-shell.css') || html.includes('/assets/edge-shell.js')) {
    throw new Error(`${target}: an external critical asset reference remains`);
  }

  writeFileSync(absolute, html);
  console.log(`${target}: inlined ${Buffer.byteLength(css) + Buffer.byteLength(script)} bytes`);
}
