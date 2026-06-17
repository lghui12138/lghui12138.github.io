# Round380 Public Shell 181103 Visibility

Date: 2026-06-17

Scope:
- Public shell only under `/Users/kili/Documents/Codex/lghui-private-video-fix`.
- Source repo `/Users/kili/Documents/Codex/lghui-source-private-video-work` was read-only context.
- `/Volumes/mac_2T` was not used.

What changed:
- Homepage and stable homepage now expose 181103 direct cards before redirect: 522 all-question check / 381 practice, 38 HTML materials, and resources workbench.
- Question-bank shell routes now expose the 181103 extracted bank, review-boundary bank, and HTML source table.
- Resources shell keeps the 181103 cards and labels Round380 as current while preserving Round379 as the 181103 content proof base.
- Generator `tools/generate-public-redirects.mjs` now owns the same homepage/question-bank/resources card contract.

Boundaries:
- No raw PDF/PPT/DOC/ZIP download link was added.
- Historical Round379/Round378 proof links remain historical evidence, not current labels.
- Private-video production recovery remains outside this shell fix.

Verification commands:

```bash
node --check tools/generate-public-redirects.mjs
node --check tools/check-round380-public-shell-181103.mjs
node tools/check-round380-public-shell-181103.mjs
rg -n "round264|当前入口版本是 (?!round380-server-progress-persistence-20260617)" index.html index-complete.html question-bank.html question-bank-home.html modules/question-bank.html resources.html
```

Observed local result:
- `node tools/check-round380-public-shell-181103.mjs`: pass, checked 8 surfaces, failures 0.
- Stale-label grep: no matches.
