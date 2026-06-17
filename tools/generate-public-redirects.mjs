import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const sourceRepoRoot = process.env.FLUID_SOURCE_REPO || '/Users/kili/Documents/Codex/lghui-source-private-video-work';
const targetOrigin = 'https://lghui-fluid-learning.pages.dev';
const sourceSiteUpdates = readJsonArray(path.join(sourceRepoRoot, 'site-updates.json'));
if (!sourceSiteUpdates[0]?.version && !process.env.FLUID_PUBLIC_EDGE_REFRESH) {
  throw new Error(`Missing latest source site-updates.json version in ${sourceRepoRoot}`);
}
const edgeRefresh = process.env.FLUID_PUBLIC_EDGE_REFRESH || sourceSiteUpdates[0].version;
const previousSiteUpdates = readJsonArray(path.join(repoRoot, 'site-updates.json'));

const routes = [
  '/knowledge.html',
  '/knowledge',
  '/_edge-login',
  '/_edge-fast-login',
  '/_edge-bridge',
  '/_edge-register',
  '/_edge-forgot-password',
  '/_edge-reset',
  '/_edge-logout',
  '/_edge-status',
  '/modules/knowledge-upgrade-2026.html',
  '/modules/real-exams-dynamic.html',
  '/real-exams.html',
  '/real-exams',
  '/modules/simulated-exams-dynamic.html',
  '/modules/simulated-exams-dynamic',
  '/simulated-exams.html',
  '/simulated-exams',
  '/modules/knowledge-detail.html',
  '/modules/knowledge-detail',
  '/modules/teacher-panel.html',
  '/modules/teacher-panel',
  '/modules/fluid-intensive-training.html',
  '/modules/wu-wangyi-fluid-reading.html',
  '/modules/wu-wangyi-fluid-reading',
  '/modules/wang-hongwei-fluid-reading.html',
  '/modules/wang-hongwei-fluid-reading',
  '/modules/physical-oceanography-home.html',
  '/modules/physical-oceanography-knowledge.html',
  '/modules/ai-assistant-dynamic.html',
  '/modules/progress-module.html',
  '/modules/question-bank.html',
  '/modules/question-bank-module.html',
  '/modules/practice-dynamic.html',
  '/modules/boundary-layer-dynamic.html',
  '/modules/energy-equation-dynamic.html',
  '/modules/experiment-dimension-dynamic.html',
  '/modules/flow-stability-dynamic.html',
  '/modules/fluid-dynamics-dynamic.html',
  '/modules/fluid-statics-dynamic.html',
  '/modules/free-surface-dynamic.html',
  '/modules/measurement-experiment-dynamic.html',
  '/modules/numerical-methods-dynamic.html',
  '/modules/pipe-flow-dynamic.html',
  '/modules/potential-flow-dynamic.html',
  '/modules/turbulent-flow-dynamic.html',
  '/modules/viscous-flow-dynamic.html',
  '/modules/vorticity-theory-dynamic.html',
  '/resources/fluid-original-animations.html',
  '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html',
  '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt',
  '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html',
  '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt',
  '/ultimate-beautiful-formulas.html',
  '/question-bank.html',
  '/question-bank-home.html',
  '/practice.html',
  '/practice-dynamic.html',
  '/resources.html',
  '/private-video.html',
  '/teacher-panel.html',
  '/teacher-panel'
];

const targetRouteOverrides = new Map([
  ['/', '/index-complete?full=1'],
  ['/index.html', '/index-complete?full=1'],
  ['/index-complete', '/index-complete?full=1'],
  ['/index-complete.html', '/index-complete?full=1'],
  ['/404.html', '/index-complete?full=1'],
  ['/offline.html', '/index-complete?full=1'],
  ['/knowledge.html', '/modules/knowledge-detail'],
  ['/knowledge', '/modules/knowledge-detail'],
  ['/modules/knowledge-detail.html', '/modules/knowledge-detail'],
  ['/modules/knowledge-detail', '/modules/knowledge-detail'],
  ['/modules/teacher-panel.html', '/teacher-panel?view=resources#private-videos'],
  ['/modules/teacher-panel', '/teacher-panel?view=resources#private-videos'],
  ['/modules/simulated-exams-dynamic.html', '/modules/simulated-exams-dynamic.html'],
  ['/modules/simulated-exams-dynamic', '/modules/simulated-exams-dynamic.html'],
  ['/real-exams.html', '/modules/real-exams-dynamic.html'],
  ['/real-exams', '/modules/real-exams-dynamic.html'],
  ['/simulated-exams.html', '/modules/simulated-exams-dynamic.html'],
  ['/simulated-exams', '/modules/simulated-exams-dynamic.html'],
  ['/modules/wu-wangyi-fluid-reading.html', '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt'],
  ['/modules/wu-wangyi-fluid-reading', '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt'],
  ['/modules/wang-hongwei-fluid-reading.html', '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt'],
  ['/modules/wang-hongwei-fluid-reading', '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt'],
  ['/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt.html', '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt'],
  ['/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt', '/resources/fluid-textbooks/authored/wu-wangyi-second-rebuilt'],
  ['/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt.html', '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt'],
  ['/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt', '/resources/fluid-textbooks/authored/wang-hongwei-understanding-rebuilt'],
  ['/practice-dynamic.html', '/modules/practice-dynamic.html'],
  ['/question-bank.html', '/modules/question-bank.html'],
  ['/question-bank-home.html', '/modules/question-bank.html'],
  ['/_edge-login', '/_edge-login'],
  ['/_edge-fast-login', '/_edge-fast-login'],
  ['/_edge-bridge', '/_edge-login'],
  ['/_edge-register', '/_edge-register'],
  ['/_edge-forgot-password', '/_edge-forgot-password'],
  ['/_edge-reset', '/_edge-reset'],
  ['/_edge-logout', '/_edge-logout'],
  ['/_edge-status', '/_edge-status'],
  ['/teacher-panel.html', '/teacher-panel?view=resources#private-videos'],
  ['/teacher-panel', '/teacher-panel?view=resources#private-videos']
]);

const runtimeCopies = [
  ['site-updates.json', 'site-updates.json'],
  ['site-announcement.json', 'site-announcement.json'],
  ['data/fluid-upgrade-roadmap-100.json', 'data/fluid-upgrade-roadmap-100.json'],
  ['data/fluid-upgrade-roadmap-100.json.gz', 'data/fluid-upgrade-roadmap-100.json.gz'],
  ['data/fluid-round278-pdf-web-year-compare.json', 'data/fluid-round278-pdf-web-year-compare.json'],
  ['data/fluid-round278-pdf-web-year-compare.json.gz', 'data/fluid-round278-pdf-web-year-compare.json.gz'],
  ['data/fluid-round374-181103-reference-answer-display.json', 'data/fluid-round374-181103-reference-answer-display.json'],
  ['data/fluid-round374-181103-reference-answer-display.json.gz', 'data/fluid-round374-181103-reference-answer-display.json.gz'],
  ['data/fluid-round355-181103-html-public-quality.json', 'data/fluid-round355-181103-html-public-quality.json'],
  ['data/fluid-round355-181103-html-public-quality.json.gz', 'data/fluid-round355-181103-html-public-quality.json.gz'],
  ['data/fluid-round357-181103-auth-workflow.json', 'data/fluid-round357-181103-auth-workflow.json'],
  ['data/fluid-round357-181103-auth-workflow.json.gz', 'data/fluid-round357-181103-auth-workflow.json.gz'],
  ['data/fluid-round375-181103-all-question-web-parity.json', 'data/fluid-round375-181103-all-question-web-parity.json'],
  ['data/fluid-round375-181103-all-question-web-parity.json.gz', 'data/fluid-round375-181103-all-question-web-parity.json.gz'],
  ['data/fluid-round376-181103-visible-522-all-question-proof.json', 'data/fluid-round376-181103-visible-522-all-question-proof.json'],
  ['data/fluid-round376-181103-visible-522-all-question-proof.json.gz', 'data/fluid-round376-181103-visible-522-all-question-proof.json.gz'],
  ['data/fluid-round378-181103-question-answer-website-verification.json', 'data/fluid-round378-181103-question-answer-website-verification.json'],
  ['data/fluid-round378-181103-question-answer-website-verification.json.gz', 'data/fluid-round378-181103-question-answer-website-verification.json.gz'],
  ['data/fluid-round373-181103-live-browser-all-questions.json', 'data/fluid-round373-181103-live-browser-all-questions.json'],
  ['data/fluid-round373-181103-live-browser-all-questions.json.gz', 'data/fluid-round373-181103-live-browser-all-questions.json.gz'],
  ['data/fluid-real-exam-source-granularity-audit.json', 'data/fluid-real-exam-source-granularity-audit.json'],
  ['data/fluid-real-exam-source-granularity-audit.json.gz', 'data/fluid-real-exam-source-granularity-audit.json.gz'],
  ['data/fluid-round280-real-exam-integrity-board.json', 'data/fluid-round280-real-exam-integrity-board.json'],
  ['data/fluid-round280-real-exam-integrity-board.json.gz', 'data/fluid-round280-real-exam-integrity-board.json.gz'],
  ['data/fluid-round282-real-exam-year-count-ledger.json', 'data/fluid-round282-real-exam-year-count-ledger.json'],
  ['data/fluid-round282-real-exam-year-count-ledger.json.gz', 'data/fluid-round282-real-exam-year-count-ledger.json.gz'],
  ['data/fluid-round283-real-exam-type-sequence-ledger.json', 'data/fluid-round283-real-exam-type-sequence-ledger.json'],
  ['data/fluid-round283-real-exam-type-sequence-ledger.json.gz', 'data/fluid-round283-real-exam-type-sequence-ledger.json.gz'],
  ['data/fluid-round284-real-exam-review-navigator.json', 'data/fluid-round284-real-exam-review-navigator.json'],
  ['data/fluid-round284-real-exam-review-navigator.json.gz', 'data/fluid-round284-real-exam-review-navigator.json.gz'],
  ['data/fluid-round287-real-exam-source-section-ledger.json', 'data/fluid-round287-real-exam-source-section-ledger.json'],
  ['data/fluid-round287-real-exam-source-section-ledger.json.gz', 'data/fluid-round287-real-exam-source-section-ledger.json.gz'],
  ['data/fluid-round290-real-exam-source-expansion-ledger.json', 'data/fluid-round290-real-exam-source-expansion-ledger.json'],
  ['data/fluid-round290-real-exam-source-expansion-ledger.json.gz', 'data/fluid-round290-real-exam-source-expansion-ledger.json.gz'],
  ['data/fluid-round291-two-textbook-pdf-coverage-ledger.json', 'data/fluid-round291-two-textbook-pdf-coverage-ledger.json'],
  ['data/fluid-round291-two-textbook-pdf-coverage-ledger.json.gz', 'data/fluid-round291-two-textbook-pdf-coverage-ledger.json.gz'],
  ['data/fluid-evidence-matrix-audit.json', 'data/fluid-evidence-matrix-audit.json'],
  ['data/fluid-evidence-matrix-audit.json.gz', 'data/fluid-evidence-matrix-audit.json.gz'],
  ['data/fluid-round298-auth-facet-proof.json', 'data/fluid-round298-auth-facet-proof.json'],
  ['data/fluid-round298-auth-facet-proof.json.gz', 'data/fluid-round298-auth-facet-proof.json.gz'],
  ['data/fluid-round298-release-claim-boundary.json', 'data/fluid-round298-release-claim-boundary.json'],
  ['data/fluid-round298-release-claim-boundary.json.gz', 'data/fluid-round298-release-claim-boundary.json.gz'],
  ['data/fluid-round298-real-exam-answer-count-boundary.json', 'data/fluid-round298-real-exam-answer-count-boundary.json'],
  ['data/fluid-round298-real-exam-answer-count-boundary.json.gz', 'data/fluid-round298-real-exam-answer-count-boundary.json.gz'],
  ['data/fluid-round298-181103-source-coverage.json', 'data/fluid-round298-181103-source-coverage.json'],
  ['data/fluid-round298-181103-source-coverage.json.gz', 'data/fluid-round298-181103-source-coverage.json.gz'],
  ['data/fluid-round298-optimization-lessons.json', 'data/fluid-round298-optimization-lessons.json'],
  ['data/fluid-round298-optimization-lessons.json.gz', 'data/fluid-round298-optimization-lessons.json.gz'],
  ['data/fluid-real-exam-answer-evidence-boundary.json', 'data/fluid-real-exam-answer-evidence-boundary.json'],
  ['data/fluid-real-exam-answer-evidence-boundary.json.gz', 'data/fluid-real-exam-answer-evidence-boundary.json.gz'],
  ['data/fluid-181103-question-review-queue.json', 'data/fluid-181103-question-review-queue.json'],
  ['data/fluid-181103-question-review-queue.json.gz', 'data/fluid-181103-question-review-queue.json.gz'],
  ['data/fluid-181103-full-material-audit.json', 'data/fluid-181103-full-material-audit.json'],
  ['data/fluid-181103-full-material-audit.json.gz', 'data/fluid-181103-full-material-audit.json.gz'],
  ['data/fluid-textbook-full-compare-audit.json', 'data/fluid-textbook-full-compare-audit.json'],
  ['data/fluid-textbook-full-compare-audit.json.gz', 'data/fluid-textbook-full-compare-audit.json.gz'],
  ['data/fluid-textbook-formula-match-audit.json', 'data/fluid-textbook-formula-match-audit.json'],
  ['data/fluid-textbook-formula-match-audit.json.gz', 'data/fluid-textbook-formula-match-audit.json.gz'],
  ['data/fluid-round303-source-production-sync.json', 'data/fluid-round303-source-production-sync.json'],
  ['data/fluid-round303-source-production-sync.json.gz', 'data/fluid-round303-source-production-sync.json.gz'],
  ['data/fluid-round303-real-exam-no-merge-evidence.json', 'data/fluid-round303-real-exam-no-merge-evidence.json'],
  ['data/fluid-round303-real-exam-no-merge-evidence.json.gz', 'data/fluid-round303-real-exam-no-merge-evidence.json.gz'],
  ['data/fluid-round303-answer-textbook-boundary.json', 'data/fluid-round303-answer-textbook-boundary.json'],
  ['data/fluid-round303-answer-textbook-boundary.json.gz', 'data/fluid-round303-answer-textbook-boundary.json.gz'],
  ['data/fluid-round303-181103-targeted-study-routes.json', 'data/fluid-round303-181103-targeted-study-routes.json'],
  ['data/fluid-round303-181103-targeted-study-routes.json.gz', 'data/fluid-round303-181103-targeted-study-routes.json.gz'],
  ['data/fluid-round303-private-video-delete-contract.json', 'data/fluid-round303-private-video-delete-contract.json'],
  ['data/fluid-round303-private-video-delete-contract.json.gz', 'data/fluid-round303-private-video-delete-contract.json.gz'],
  ['data/fluid-round303-student-ui-a11y.json', 'data/fluid-round303-student-ui-a11y.json'],
  ['data/fluid-round303-student-ui-a11y.json.gz', 'data/fluid-round303-student-ui-a11y.json.gz'],
  ['data/fluid-round303-release-readiness.json', 'data/fluid-round303-release-readiness.json'],
  ['data/fluid-round303-release-readiness.json.gz', 'data/fluid-round303-release-readiness.json.gz'],
  ['data/fluid-round304-real-exam-original-text-expansion.json', 'data/fluid-round304-real-exam-original-text-expansion.json'],
  ['data/fluid-round304-real-exam-original-text-expansion.json.gz', 'data/fluid-round304-real-exam-original-text-expansion.json.gz'],
  ['data/fluid-round304-answer-original-pdf-boundary.json', 'data/fluid-round304-answer-original-pdf-boundary.json'],
  ['data/fluid-round304-answer-original-pdf-boundary.json.gz', 'data/fluid-round304-answer-original-pdf-boundary.json.gz'],
  ['data/fluid-round304-181103-source-study-index.json', 'data/fluid-round304-181103-source-study-index.json'],
  ['data/fluid-round304-181103-source-study-index.json.gz', 'data/fluid-round304-181103-source-study-index.json.gz'],
  ['data/fluid-round304-private-video-production-blockers.json', 'data/fluid-round304-private-video-production-blockers.json'],
  ['data/fluid-round304-private-video-production-blockers.json.gz', 'data/fluid-round304-private-video-production-blockers.json.gz'],
  ['data/fluid-round304-student-real-exam-ui-a11y.json', 'data/fluid-round304-student-real-exam-ui-a11y.json'],
  ['data/fluid-round304-student-real-exam-ui-a11y.json.gz', 'data/fluid-round304-student-real-exam-ui-a11y.json.gz'],
  ['data/fluid-round304-release-readiness.json', 'data/fluid-round304-release-readiness.json'],
  ['data/fluid-round304-release-readiness.json.gz', 'data/fluid-round304-release-readiness.json.gz'],
  ['data/fluid-round310-181103-html-content.json', 'data/fluid-round310-181103-html-content.json'],
  ['data/fluid-round310-181103-html-content.json.gz', 'data/fluid-round310-181103-html-content.json.gz'],
  ['data/fluid-round312-181103-html-quality-ledger.json', 'data/fluid-round312-181103-html-quality-ledger.json'],
  ['data/fluid-round312-181103-html-quality-ledger.json.gz', 'data/fluid-round312-181103-html-quality-ledger.json.gz'],
  ['data/fluid-round313-181103-all-html-contract.json', 'data/fluid-round313-181103-all-html-contract.json'],
  ['data/fluid-round313-181103-all-html-contract.json.gz', 'data/fluid-round313-181103-all-html-contract.json.gz'],
  ['data/fluid-round314-answer-source-layering.json', 'data/fluid-round314-answer-source-layering.json'],
  ['data/fluid-round314-answer-source-layering.json.gz', 'data/fluid-round314-answer-source-layering.json.gz'],
  ['data/fluid-round315-181103-all-html-direct-pages.json', 'data/fluid-round315-181103-all-html-direct-pages.json'],
  ['data/fluid-round315-181103-all-html-direct-pages.json.gz', 'data/fluid-round315-181103-all-html-direct-pages.json.gz'],
  ['data/fluid-round316-181103-reader-polish.json', 'data/fluid-round316-181103-reader-polish.json'],
  ['data/fluid-round316-181103-reader-polish.json.gz', 'data/fluid-round316-181103-reader-polish.json.gz'],
  ['data/fluid-round307-real-exam-source-row-year-count-lock.json', 'data/fluid-round307-real-exam-source-row-year-count-lock.json'],
  ['data/fluid-round307-real-exam-source-row-year-count-lock.json.gz', 'data/fluid-round307-real-exam-source-row-year-count-lock.json.gz'],
  ['data/fluid-round317-real-exam-source-cardinality.json', 'data/fluid-round317-real-exam-source-cardinality.json'],
  ['data/fluid-round317-real-exam-source-cardinality.json.gz', 'data/fluid-round317-real-exam-source-cardinality.json.gz'],
  ['data/fluid-round317-181103-live-html-depth.json', 'data/fluid-round317-181103-live-html-depth.json'],
  ['data/fluid-round317-181103-live-html-depth.json.gz', 'data/fluid-round317-181103-live-html-depth.json.gz'],
  ['data/fluid-round318-chapter-practice-shortcuts.json', 'data/fluid-round318-chapter-practice-shortcuts.json'],
  ['data/fluid-round318-chapter-practice-shortcuts.json.gz', 'data/fluid-round318-chapter-practice-shortcuts.json.gz'],
  ['data/fluid-round318-real-exam-chapter-practice.json', 'data/fluid-round318-real-exam-chapter-practice.json'],
  ['data/fluid-round318-real-exam-chapter-practice.json.gz', 'data/fluid-round318-real-exam-chapter-practice.json.gz'],
  ['data/fluid-round318-181103-practice-bridge.json', 'data/fluid-round318-181103-practice-bridge.json'],
  ['data/fluid-round318-181103-practice-bridge.json.gz', 'data/fluid-round318-181103-practice-bridge.json.gz'],
  ['data/fluid-round319-resources-video-practice-chain.json', 'data/fluid-round319-resources-video-practice-chain.json'],
  ['data/fluid-round319-resources-video-practice-chain.json.gz', 'data/fluid-round319-resources-video-practice-chain.json.gz'],
  ['data/fluid-round321-181103-extracted-material-bank.json', 'data/fluid-round321-181103-extracted-material-bank.json'],
  ['data/fluid-round321-181103-extracted-material-bank.json.gz', 'data/fluid-round321-181103-extracted-material-bank.json.gz'],
  ['docs/round313/181103-all-html-contract.md', 'docs/round313/181103-all-html-contract.md'],
  ['docs/round314/answer-source-layering.md', 'docs/round314/answer-source-layering.md'],
  ['docs/round315/181103-all-html-direct-pages.md', 'docs/round315/181103-all-html-direct-pages.md'],
  ['docs/round316/181103-reader-polish.md', 'docs/round316/181103-reader-polish.md'],
  ['docs/round317/real-exam-cardinality.md', 'docs/round317/real-exam-cardinality.md'],
  ['docs/round317/181103-html-depth.md', 'docs/round317/181103-html-depth.md'],
  ['docs/round317/release-freshness.md', 'docs/round317/release-freshness.md'],
  ['docs/round318/chapter-practice-shortcuts.md', 'docs/round318/chapter-practice-shortcuts.md'],
  ['docs/round318/real-exam-chapter-practice-shortcuts.md', 'docs/round318/real-exam-chapter-practice-shortcuts.md'],
  ['docs/round318/181103-practice-bridge.md', 'docs/round318/181103-practice-bridge.md'],
  ['docs/round318/private-video-production-boundary.md', 'docs/round318/private-video-production-boundary.md'],
  ['docs/round318/mobile-a11y.md', 'docs/round318/mobile-a11y.md'],
  ['docs/round318/optimization-experience.md', 'docs/round318/optimization-experience.md'],
  ['docs/round318/release-proof.md', 'docs/round318/release-proof.md'],
  ['docs/round319/resources-video-practice-chain.md', 'docs/round319/resources-video-practice-chain.md'],
  ['docs/round321/181103-extracted-material-bank.md', 'docs/round321/181103-extracted-material-bank.md'],
  ['tools/check-round313-181103-all-html-contract.mjs', 'tools/check-round313-181103-all-html-contract.mjs'],
  ['tools/check-round314-answer-source-layering.mjs', 'tools/check-round314-answer-source-layering.mjs'],
  ['tools/check-round315-181103-all-html-direct-pages.mjs', 'tools/check-round315-181103-all-html-direct-pages.mjs'],
  ['tools/check-round316-181103-reader-polish.mjs', 'tools/check-round316-181103-reader-polish.mjs'],
  ['tools/check-round317-real-exam-source-cardinality.mjs', 'tools/check-round317-real-exam-source-cardinality.mjs'],
  ['tools/check-round317-181103-live-html-depth.mjs', 'tools/check-round317-181103-live-html-depth.mjs'],
  ['tools/check-round318-chapter-practice-shortcuts.mjs', 'tools/check-round318-chapter-practice-shortcuts.mjs'],
  ['tools/check-round318-real-exam-chapter-practice.mjs', 'tools/check-round318-real-exam-chapter-practice.mjs'],
  ['tools/check-round318-181103-practice-bridge.mjs', 'tools/check-round318-181103-practice-bridge.mjs'],
  ['tools/check-round318-private-video-boundary.mjs', 'tools/check-round318-private-video-boundary.mjs'],
  ['tools/check-round319-resources-video-practice-chain.mjs', 'tools/check-round319-resources-video-practice-chain.mjs'],
  ['question-banks/真题_中国海洋大学_2000-2024_fixed.json', 'question-banks/真题_中国海洋大学_2000-2024_fixed.json'],
  ['data/fluid-knowledge-upgrade-2026.json', 'data/fluid-knowledge-upgrade-2026.json'],
  ['data/fluid-knowledge-upgrade-2026.json.gz', 'data/fluid-knowledge-upgrade-2026.json.gz'],
  ['data/fluid-knowledge-upgrade.json', 'data/fluid-knowledge-upgrade.json'],
  ['data/fluid-knowledge-upgrade.json.gz', 'data/fluid-knowledge-upgrade.json.gz'],
  ['data/fluid-learning-upgrade.json', 'data/fluid-learning-upgrade.json'],
  ['data/fluid-learning-upgrade.json.gz', 'data/fluid-learning-upgrade.json.gz'],
  ['data/fluid-knowledge-points-upgrade.json', 'data/fluid-knowledge-points-upgrade.json'],
  ['data/fluid-knowledge-points-upgrade.json.gz', 'data/fluid-knowledge-points-upgrade.json.gz'],
  ['js/core/local-mathjax.js', 'js/core/local-mathjax.js'],
  ['js/core/local-mathjax.js', 'local-mathjax.js'],
  ['js/core/local-mathjax.js', 'modules/local-mathjax.js'],
  ['js/core/local-mathjax.js', 'modules/js/core/local-mathjax.js'],
  ['js/formula-lite.js', 'js/formula-lite.js'],
  ['js/formula-lite.js', 'formula-lite.js'],
  ['js/formula-lite.js', 'modules/formula-lite.js'],
  ['js/formula-lite.js', 'modules/js/formula-lite.js'],
  ['js/edge-fluid-performance.js', 'js/edge-fluid-performance.js'],
  ['safari-compatibility.js', 'safari-compatibility.js'],
  ['js/edge-fluid-learning-upgrade.js', 'js/edge-fluid-learning-upgrade.js'],
  ['lib/fm-core.js', 'lib/fm-core.js'],
  ['modules/js/practice-components.js', 'modules/js/practice-components.js'],
  ['modules/js/teacher-main.js', 'modules/js/teacher-main.js'],
  ['modules/question-bank-ai.js', 'modules/question-bank-ai.js'],
  ['modules/question-bank-data.js', 'modules/question-bank-data.js'],
  ['modules/question-bank-practice.js', 'modules/question-bank-practice.js'],
  ['modules/question-bank-stats.js', 'modules/question-bank-stats.js'],
  ['modules/question-bank-ui.js', 'modules/question-bank-ui.js'],
  ['modules/question-bank-user.js', 'modules/question-bank-user.js'],
  ['styles/edge-fluid-upgrade.css', 'styles/edge-fluid-upgrade.css'],
  ['modules/styles/practice-animations.css', 'modules/styles/practice-animations.css'],
  ['vendor/mathjax/es5/tex-chtml-full.js', 'vendor/mathjax/es5/tex-chtml-full.js'],
  ['vendor/mathjax/es5/output/chtml/fonts/tex.js', 'vendor/mathjax/es5/output/chtml/fonts/tex.js']
];

const authGuardAliases = [
  'js/security/auth-guard.js',
  'auth-guard.js',
  'modules/auth-guard.js',
  'modules/js/security/auth-guard.js'
];

const jsonFallbacks = new Map([
  ['/api/auth/me', {
    ok: false,
    authenticated: false,
    error: 'public_shell_static_origin',
    message: 'lghui.top is a static migration shell. Open the Cloudflare learning origin to sign in.',
    sourceOrigin: targetOrigin,
    edgeRefresh
  }]
]);

function readJsonArray(filePath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function updateKey(item) {
  try {
    return JSON.stringify(item || null);
  } catch (_) {
    return String(item || '');
  }
}

function updateStamp(item) {
  if (item && item.updatedAt) return String(item.updatedAt);
  return `${item?.date || '0000-00-00'}T${item?.time || '00:00'}:00+08:00`;
}

function recordText(item) {
  try {
    return JSON.stringify(item || {});
  } catch (_) {
    return '';
  }
}

function shouldReplaceExistingSiteUpdate(existing, candidate) {
  const version = String(candidate?.version || '');
  const candidateText = recordText(candidate);
  const existingText = recordText(existing);
  if (version === 'round272-home-math-security-polish-20260531') {
    const hasPasswordFallback = /MailChannels|繁忙|兜底/.test(candidateText)
      && /忘记密码|重置密码|验证码/.test(candidateText);
    const existingHasPasswordFallback = /MailChannels|繁忙|兜底/.test(existingText)
      && /忘记密码|重置密码|验证码/.test(existingText);
    return hasPasswordFallback && !existingHasPasswordFallback;
  }
  return false;
}

function preservePreviousSiteUpdates(previousRecords) {
  const filePath = path.join(repoRoot, 'site-updates.json');
  const sourceRecords = readJsonArray(filePath);
  if (!sourceRecords.length) return;
  const seenRecords = new Set();
  const seenVersions = new Set();
  const indexByVersion = new Map();
  const merged = [];
  function addRecord(item) {
    if (!item) return;
    const version = item?.version ? String(item.version) : '';
    const key = updateKey(item);
    if (!key || key === 'null') return;
    if (version) {
      if (seenVersions.has(version)) {
        const existingIndex = indexByVersion.get(version);
        const existing = merged[existingIndex];
        if (Number.isInteger(existingIndex) && shouldReplaceExistingSiteUpdate(existing, item)) {
          const oldKey = updateKey(existing);
          if (oldKey) seenRecords.delete(oldKey);
          merged[existingIndex] = item;
          seenRecords.add(key);
        }
        return;
      }
      seenVersions.add(version);
      indexByVersion.set(version, merged.length);
    } else if (seenRecords.has(key)) {
      return;
    }
    seenRecords.add(key);
    merged.push(item);
  }
  for (const item of sourceRecords) addRecord(item);
  for (const item of previousRecords) addRecord(item);
  const current = merged.find((item) => item?.version === edgeRefresh) || merged[0];
  const history = merged
    .filter((item) => item !== current)
    .sort((a, b) => updateStamp(b).localeCompare(updateStamp(a)));
  fs.writeFileSync(filePath, `${JSON.stringify([current, ...history], null, 2)}\n`);
}

function targetRouteFor(route) {
  return targetRouteOverrides.get(route) || route;
}

function targetHrefForRoute(route) {
  const targetRoute = targetRouteFor(route);
  const target = new URL(targetRoute, targetOrigin);
  target.searchParams.set('edge_refresh', edgeRefresh);
  return {
    href: target.toString(),
    pathname: target.pathname,
    search: target.search
  };
}

function htmlFor(route) {
  const targetInfo = targetHrefForRoute(route);
  const target = targetInfo.href;
  const stableFallback = [
    '/modules/physical-oceanography-home.html',
    '/knowledge.html',
    '/knowledge',
    '/modules/knowledge-detail.html',
    '/modules/knowledge-detail',
    '/resources.html',
    '/modules/potential-flow-dynamic.html',
    '/real-exams.html',
    '/real-exams',
    '/simulated-exams.html',
    '/simulated-exams',
    '/question-bank.html',
    '/question-bank-home.html',
    '/modules/question-bank.html',
    '/modules/question-bank-module.html'
  ].includes(route);
  const actionStyles = stableFallback
    ? '\n    .actions{display:flex;flex-wrap:wrap;gap:12px}\n    .secondary{background:#155eef}\n    .route-cards{display:grid;gap:10px;margin:16px 0}.route-card{display:block;background:#fff;color:#0f172a;border:1px solid rgba(15,23,42,.12);border-radius:8px;padding:12px 14px;text-decoration:none;font-weight:700}.route-card span{display:block;margin-top:4px;color:#475569;font-size:14px;font-weight:500;line-height:1.5}'
    : '';
  const actionMarkup = stableFallback
    ? `<div class="actions">
      <a id="targetLink" href="${target}">立即打开</a>
      <a id="stableLink" class="secondary" href="https://lghui.top/index-complete.html?full=1">打开稳定入口</a>
    </div>`
    : `<p><a id="targetLink" href="${target}">立即打开</a></p>`;
  const routeSpecificMarkup = route === '/resources.html'
    ? `<div class="route-cards" aria-label="181103 资料直达入口">
      <a class="route-card" href="/resources/fluid-181103-html/index.html">181103 全资料 HTML 总表<span>38/38 个资料页已写成站内 HTML 正文，不走下载或 viewer 壳。</span></a>
      <a class="route-card" href="${targetOrigin}/modules/question-bank.html?focus=181103-material-extracted&edge_refresh=${edgeRefresh}#questionBanksList">181103 资料内题目全集<span>522 个资料内习题、例题、名词解释、证明计算题已入题库；03 练习册新增 111 题。</span></a>
      <a class="route-card" href="${targetOrigin}/modules/question-bank.html?focus=181103-material-review&edge_refresh=${edgeRefresh}#questionBanksList">181103 真题复核题<span>68 个真题复核题保留独立边界，不冒充原卷答案 PDF 证据。</span></a>
    </div>`
    : '';
  const stableScript = stableFallback
    ? "\n    const stableUrl = new URL('https://lghui.top/index-complete.html');\n    const stableParams = new URLSearchParams(location.search);\n    stableParams.set('full', '1');\n    stableUrl.search = stableParams.toString();\n    stableUrl.hash = location.hash;\n    document.getElementById('stableLink').href = stableUrl.toString();"
    : '';
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta http-equiv="cache-control" content="no-store">
  <link rel="canonical" href="${target}">
  <title>正在进入流体力学主站</title>
  <style>
    :root{color-scheme:light dark;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f7fbff;color:#07111f}
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,#f7fbff,#eef7f8)}
    main{width:min(560px,100%);border:1px solid rgba(7,17,31,.12);border-radius:8px;background:rgba(255,255,255,.88);padding:28px;box-shadow:0 18px 50px rgba(7,17,31,.12)}
    h1{margin:0 0 10px;font-size:28px;letter-spacing:0}
    p{margin:0 0 14px;color:#425466;line-height:1.7}
    a{display:inline-flex;align-items:center;min-height:42px;border-radius:8px;background:#0f766e;color:#fff;padding:0 16px;text-decoration:none;font-weight:800}${actionStyles}
    code{word-break:break-all}
  </style>
</head>
<body>
  <main>
    <h1>正在进入主站</h1>
    <p>这个公开路径已迁移到 Cloudflare 源站，正在自动打开完整主站。若浏览器拦截自动跳转，请点击按钮进入。</p>
    <p>当前入口版本是 ${edgeRefresh}。跳转会保留当前路径并把旧 edge_refresh 统一改到当前入口版本，主站会继续显示完整内容、公式和练习。</p>
    <p>181103 资料当前已写成 HTML 正文：38 份资料、30 条学习路线、68 个真题复核任务和 522 张资料来源卡；381 道独立题进入刷题，141 条参考答案页、父卡、源文/答案续页/讲义正文只作线索展示；公开壳不提供原始文件下载。</p>
    <p><code>${route}</code></p>
    ${routeSpecificMarkup}
    ${actionMarkup}
  </main>
  <script>
    const TARGET_ORIGIN = '${targetOrigin}';
    const ROUTE = '${targetInfo.pathname}';
    const BASE_SEARCH = '${targetInfo.search}';
    const EDGE_REFRESH = '${edgeRefresh}';
    function timeout(ms){
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async function clearOldPublicState(){
      try{
        if('serviceWorker' in navigator){
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map((registration)=>registration.unregister()));
        }
        if(window.caches){
          const keys = await caches.keys();
          await Promise.all(keys.map((key)=>caches.delete(key)));
        }
      }catch(_){}
    }
    const searchParams = new URLSearchParams(BASE_SEARCH);
    for (const [key, value] of new URLSearchParams(location.search)) searchParams.set(key, value);
    searchParams.delete('go');
    searchParams.set('edge_refresh', EDGE_REFRESH);
    const target = TARGET_ORIGIN + ROUTE + '?' + searchParams.toString() + location.hash;
    document.getElementById('targetLink').href = target;${stableScript}
    let entering = false;
    function enterTarget(){
      if (entering || location.href === target) return;
      entering = true;
      location.replace(target);
    }
    requestAnimationFrame(enterTarget);
    setTimeout(enterTarget, 250);
    Promise.race([clearOldPublicState(), timeout(600)]).finally(enterTarget);
  </script>
</body>
</html>
`;
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyRuntimeAsset(sourceRelative, destRelative) {
  const sourcePath = path.join(sourceRepoRoot, sourceRelative);
  const destPath = path.join(repoRoot, destRelative);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source runtime asset: ${sourcePath}`);
  }
  ensureParent(destPath);
  fs.copyFileSync(sourcePath, destPath);
}

function copyRuntimeTree(sourceRelative, destRelative) {
  const sourcePath = path.join(sourceRepoRoot, sourceRelative);
  const destPath = path.join(repoRoot, destRelative);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source runtime directory: ${sourcePath}`);
  }
  fs.mkdirSync(destPath, { recursive: true });
  for (const entry of fs.readdirSync(sourcePath, { withFileTypes: true })) {
    if (entry.name.startsWith('._') || entry.name === '.DS_Store') continue;
    const sourceChild = path.join(sourceRelative, entry.name);
    const destChild = path.join(destRelative, entry.name);
    if (entry.isDirectory()) {
      copyRuntimeTree(sourceChild, destChild);
    } else if (entry.isFile()) {
      copyRuntimeAsset(sourceChild, destChild);
    }
  }
}

function authGuardShim() {
  return `(() => {
  const TARGET_ORIGIN = '${targetOrigin}';
  const EDGE_REFRESH = '${edgeRefresh}';
  const SESSION_KEYS = ['fm_session_v2', 'fm_auth_session_v2', 'fluidMechanicsUser', 'currentUser'];

  function sourceUrl(pathname = location.pathname) {
    const route = pathname && pathname !== '/' ? pathname : '/index-complete';
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('go');
    searchParams.set('edge_refresh', EDGE_REFRESH);
    return TARGET_ORIGIN + route + '?' + searchParams.toString() + location.hash;
  }

  function clearPending() {
    try { document.documentElement.removeAttribute('data-auth-pending'); } catch (_) {}
  }

  function clearSession() {
    try { SESSION_KEYS.forEach((key) => localStorage.removeItem(key)); } catch (_) {}
  }

  function goSource(pathname) {
    clearPending();
    const target = sourceUrl(pathname);
    if (location.href !== target) location.replace(target);
    return false;
  }

  window.__FM_PUBLIC_SHELL_AUTH_GUARD__ = true;
  window.FMSecurity = {
    AUTH_SESSION_KEY: 'fm_auth_session_v2',
    clearSession,
    getCurrentUser() { return null; },
    async guardPage(options = {}) {
      clearPending();
      if (options.teacherOnly || /teacher-panel/i.test(location.pathname)) return goSource(location.pathname);
      return false;
    },
    logout() { location.href = TARGET_ORIGIN + '/_edge-logout'; }
  };

  clearPending();
  const pendingGuard = window.__FM_AUTH_GUARD__;
  if (pendingGuard?.teacherOnly || /teacher-panel/i.test(location.pathname)) {
    goSource(location.pathname);
  }
})();\n`;
}

function serviceWorkerKillSwitch() {
  return `/*
 * Public-shell service worker kill switch.
 * Keeps lghui.top from serving stale cached HTML/JS after the Cloudflare origin migration.
 */
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.allSettled(keys.map((key) => caches.delete(key)));
    } catch (_) {}
    try {
      if (self.clients?.claim) await self.clients.claim();
    } catch (_) {}
    try {
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        try { client.navigate(client.url); } catch (_) {}
      }
    } catch (_) {}
    try {
      await self.registration.unregister();
    } catch (_) {}
  })());
});

self.addEventListener('fetch', () => {});\n`;
}

function writeRuntimeAssets() {
  for (const [sourceRelative, destRelative] of runtimeCopies) {
    copyRuntimeAsset(sourceRelative, destRelative);
  }
  copyRuntimeTree('vendor/mathjax/es5/output/chtml/fonts/woff-v2', 'vendor/mathjax/es5/output/chtml/fonts/woff-v2');
  fs.rmSync(path.join(repoRoot, 'resources', 'fluid-181103-html'), { recursive: true, force: true });
  copyRuntimeTree('resources/fluid-181103-html', 'resources/fluid-181103-html');
  fs.rmSync(path.join(repoRoot, 'question-banks', 'real-exam-years'), { recursive: true, force: true });
  copyRuntimeTree('question-banks/real-exam-years', 'question-banks/real-exam-years');
	  copyRuntimeAsset('question-banks/index.json', 'question-banks/index.json');
	  copyRuntimeAsset('question-banks/index.json.gz', 'question-banks/index.json.gz');
	  copyRuntimeAsset('question-banks/181103-material-review.json', 'question-banks/181103-material-review.json');
	  copyRuntimeAsset('question-banks/181103-material-review.json.gz', 'question-banks/181103-material-review.json.gz');
	  copyRuntimeAsset('question-banks/181103-material-extracted.json', 'question-banks/181103-material-extracted.json');
	  copyRuntimeAsset('question-banks/181103-material-extracted.json.gz', 'question-banks/181103-material-extracted.json.gz');
  for (const destRelative of authGuardAliases) {
    const destPath = path.join(repoRoot, destRelative);
    ensureParent(destPath);
    fs.writeFileSync(destPath, authGuardShim());
  }
  for (const name of ['sw.js', 'sw-simple.js']) {
    fs.writeFileSync(path.join(repoRoot, name), serviceWorkerKillSwitch());
  }
}

function removeGeneratedAppleDoubleFiles(dir = repoRoot) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name.startsWith('._')) {
      fs.rmSync(fullPath, { force: true, recursive: true });
    } else if (entry.isDirectory()) {
      removeGeneratedAppleDoubleFiles(fullPath);
    }
  }
}

function writeJsonFallbacks() {
  for (const [route, payload] of jsonFallbacks) {
    const filePath = path.join(repoRoot, route.replace(/^\//, ''), 'index.html');
    ensureParent(filePath);
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
  }
}

function updateManifestEntry() {
  const filePath = path.join(repoRoot, 'manifest.json');
  if (!fs.existsSync(filePath)) return;
  const manifest = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  manifest.start_url = '/index-complete.html?full=1';
  for (const handler of manifest.protocol_handlers || []) {
    if (handler && handler.url === '/index-complete.html?action=%s') {
      handler.url = '/index-complete.html?full=1&action=%s';
    }
  }
  fs.writeFileSync(filePath, `${JSON.stringify(manifest, null, 2)}\n`);
}

for (const route of routes) {
  const routePath = route.replace(/^\//, '');
  const routeLeaf = path.basename(routePath);
  const routeIsExtensionless = !routeLeaf.includes('.');
  const staleExtensionlessFilePath = path.join(repoRoot, routePath);
  const filePath = routeIsExtensionless
    ? path.join(repoRoot, routePath, 'index.html')
    : staleExtensionlessFilePath;
  if (routeIsExtensionless && fs.existsSync(staleExtensionlessFilePath) && fs.statSync(staleExtensionlessFilePath).isFile()) {
    fs.unlinkSync(staleExtensionlessFilePath);
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, htmlFor(route));
}

for (const fileName of ['index.html', 'index-complete.html', 'offline.html', '404.html']) {
  fs.writeFileSync(path.join(repoRoot, fileName), htmlFor('/index-complete'));
}
fs.writeFileSync(path.join(repoRoot, '.nojekyll'), '');
updateManifestEntry();
writeRuntimeAssets();
preservePreviousSiteUpdates(previousSiteUpdates);
writeJsonFallbacks();
removeGeneratedAppleDoubleFiles(repoRoot);
fs.writeFileSync(path.join(repoRoot, '_headers'), `/*.html
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/*
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/sw.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
  Clear-Site-Data: "cache", "storage"

/sw-simple.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
  Clear-Site-Data: "cache", "storage"

/js/formula-lite.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/js/core/local-mathjax.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/formula-lite.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/local-mathjax.js
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/vendor/mathjax/es5/tex-chtml-full.js
  Cache-Control: no-cache, must-revalidate
  Content-Type: application/javascript; charset=utf-8

/api/auth/me/*
  Content-Type: application/json; charset=utf-8
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/api/auth/me
  Content-Type: application/json; charset=utf-8
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0

/vendor/mathjax/es5/output/chtml/fonts/*.js
  Content-Type: application/javascript; charset=utf-8
  Cache-Control: no-cache, must-revalidate

/vendor/mathjax/es5/output/chtml/fonts/woff-v2/*.woff
  Content-Type: font/woff
  X-Content-Type-Options: nosniff
  Cache-Control: public, max-age=31536000, immutable
`);
removeGeneratedAppleDoubleFiles(repoRoot);

console.log(JSON.stringify({
  generated: routes.length,
  runtimeAssets: runtimeCopies.length + authGuardAliases.length + 1,
  jsonFallbacks: jsonFallbacks.size,
  edgeRefresh
}, null, 2));
