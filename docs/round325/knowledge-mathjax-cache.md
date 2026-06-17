# Round325 Knowledge MathJax Cache Guard

Version: `round325-knowledge-mathjax-cache-20260615`

Round325 worker D statically checks the authenticated knowledge page source and the local MathJax loader. It verifies that both use the current successor cachebuster, that stale Round323 MathJax script/version references are absent, and that lazy/queued MathJax performance signals remain in place for mobile.

## Summary

- Static checks: 12/12 passed
- Current cachebuster: `round358-181103-522-html-practice-release-20260616`
- Knowledge-detail cachebuster: `round358-181103-522-html-practice-release-20260616`
- Local SCRIPT_VERSION: `round358-181103-522-html-practice-release-20260616`
- Stale Round323 MathJax references: 0
- Visible card limit: 18
- Queue batch: 4
- Performance signals: 6/6
- Document-wide sweep disabled on knowledge page: true
- Authenticated knowledge guard present: true

## Cachebuster

| Surface | Value | Line |
|---|---|---:|
| `js/core/local-mathjax.js` SCRIPT_VERSION | `round358-181103-522-html-practice-release-20260616` | 3 |
| `js/core/local-mathjax.js` SCRIPT_SRC | `const SCRIPT_SRC = `/vendor/mathjax/es5/tex-chtml-full.js?v=${SCRIPT_VERSION}`;` | 4 |
| `modules/knowledge-detail.html` local-mathjax src | `/js/core/local-mathjax.js?v=round358-181103-522-html-practice-release-20260616` | 22 |

## Lazy Queue Signals

| Signal | Status | Meaning | Missing patterns |
|---|---|---|---:|
| knowledgeViewportObserver | PASS | cards outside the near viewport stay deferred until IntersectionObserver enters a 900px margin | 0 |
| knowledgeIdleQueue | PASS | page-level MathJax work is deduplicated, batched, and drained during idle time | 0 |
| knowledgeDiagnostics | PASS | queue, late sweep, and forced learning sweep diagnostics remain inspectable | 0 |
| localMathjaxQueue | PASS | local loader keeps root compaction and requestIdleCallback queueing | 0 |
| localMathjaxSweepDisable | PASS | local loader skips document-wide sweeps when the knowledge page owns MathJax scheduling | 0 |
| localMathjaxWindowApi | PASS | page code can queue scoped rendering through FMQueueMath without direct loader internals | 0 |

## Stale Round323 MathJax References

| Location | Text |
|---|---|
| none | none |

## Checks

| Check | Status | Detail |
|---|---|---|
| knowledge-detail-loads-local-mathjax-with-current-Round325-cachebuster | PASS | {"knowledgeDetailLine":22,"knowledgeDetailScriptSrc":"/js/core/local-mathjax.js?v=round358-181103-522-html-practice-release-20260616","expectedCachebuster":"round358-181103-522-html-practice-release-20260616","actualCachebuster":"round358-181103-522-html-practice-release-20260616"} |
| local-mathjax-script-version-is-current-successor-cachebuster | PASS | {"currentCachebuster":"round358-181103-522-html-practice-release-20260616","localScriptVersion":"round358-181103-522-html-practice-release-20260616","localScriptVersionLine":3,"localScriptSrcLine":4,"localScriptSrcLineText":"const SCRIPT_SRC = `/vendor/mathjax/es5/tex-chtml-full.js?v=${SCRIPT_VERSION}`;","localScriptSrcTemplateIncludesVersion":true,"localVendorPathOk":true,"minimumCurrentRound":325} |
| local-mathjax-script-src-uses-versioned-vendor-mathjax-url | PASS | {"currentCachebuster":"round358-181103-522-html-practice-release-20260616","localScriptVersion":"round358-181103-522-html-practice-release-20260616","localScriptVersionLine":3,"localScriptSrcLine":4,"localScriptSrcLineText":"const SCRIPT_SRC = `/vendor/mathjax/es5/tex-chtml-full.js?v=${SCRIPT_VERSION}`;","localScriptSrcTemplateIncludesVersion":true,"localVendorPathOk":true} |
| authenticated-knowledge-sources-have-no-round323-mathjax-src-or-script-version | PASS | [] |
| knowledge-detail-disables-document-wide-math-sweep-for-page-owned-queue | PASS | {"disableFlagLine":21,"disableFlag":"window.__FM_DISABLE_DOCUMENT_MATH_SWEEP__=true"} |
| knowledge-detail-preserves-visible-card-and-small-batch-math-limits | PASS | {"visibleCardLimit":18,"queueBatch":4} |
| knowledge-detail-preserves-viewport-deferred-card-typesetting | PASS | {"meaning":"cards outside the near viewport stay deferred until IntersectionObserver enters a 900px margin","requiredSignals":5,"missing":[]} |
| knowledge-detail-preserves-idle-queued-math-batching | PASS | {"meaning":"page-level MathJax work is deduplicated, batched, and drained during idle time","requiredSignals":7,"missing":[]} |
| knowledge-detail-preserves-late-and-learning-math-sweep-diagnostics | PASS | {"meaning":"queue, late sweep, and forced learning sweep diagnostics remain inspectable","requiredSignals":5,"missing":[]} |
| local-mathjax-preserves-request-idle-queue-and-compact-roots | PASS | {"meaning":"local loader keeps root compaction and requestIdleCallback queueing","requiredSignals":7,"missing":[]} |
| local-mathjax-respects-knowledge-page-document-sweep-disable | PASS | {"meaning":"local loader skips document-wide sweeps when the knowledge page owns MathJax scheduling","requiredSignals":4,"missing":[]} |
| local-mathjax-exposes-fm-queue-api-for-page-owned-lazy-rendering | PASS | {"meaning":"page code can queue scoped rendering through FMQueueMath without direct loader internals","requiredSignals":4,"missing":[]} |

## Boundary

- This is a local static guard, not a browser performance trace or live production proof.
- It intentionally does not edit `site-updates`, roadmap, release gate, tests, public shell, or version constants.
- It treats Round325 as the minimum accepted cachebuster round because this historical gate guards the knowledge MathJax/cache behavior while current release authority may advance to successor rounds.
