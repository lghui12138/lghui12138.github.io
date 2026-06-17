# Knowledge Upgrade 2026 Page Notes

## Scope

- New page: `/modules/knowledge-upgrade-2026.html`
- Reserved root: `#edge-fluid-upgrade-root`
- No existing navigation or knowledge pages were edited.

## Data Used

The page reads existing site data at runtime:

- `/data/fluid-chapter-sections.json`
- `/data/fluid-formula-index.json`
- `/data/fluid-exam-topic-map.json`
- `/data/fluid-mistake-diagnostics.json`
- `/data/fluid-review-plan.json`
- `/data/fluid-source-materials.json`

It also keeps static fallback content for the main formula overview and scenario sections so the page remains useful if one data bundle is temporarily unavailable at the Cloudflare edge.

## Entry Suggestions

Recommended first integration points:

1. Add a "知识升级版" link in the homepage knowledge area to `/modules/knowledge-upgrade-2026.html`.
2. Add a secondary link in `/modules/knowledge-detail.html` top navigation after the current "知识全库" link.
3. Add a resource-center shortcut near the protected fluid mechanics materials so students can move from courseware to the upgraded knowledge path.

Hold off replacing `/knowledge.html` until other agents finish homepage/navigation edits and the Cloudflare Pages deployment has been checked on `https://lghui.top/`.
