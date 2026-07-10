import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const css = readFileSync(resolve(root, 'public-shell/assets/edge-shell.css'), 'utf8').trim();
const script = readFileSync(resolve(root, 'public-shell/assets/edge-shell.js'), 'utf8').trim();

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
