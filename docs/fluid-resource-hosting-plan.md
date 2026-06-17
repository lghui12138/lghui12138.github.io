# Fluid Resource Hosting Plan

Date: 2026-05-24

This plan covers resource and private-media files that are present locally but intentionally left out of normal Cloudflare Pages staging. It does not require credentials, uploads, route changes, DNS changes, proxy changes, or VPN changes.

## Current staging boundary

Normal staging is prepared with:

```sh
node tools/prepare-fluid-pages-deploy.mjs
```

The staging script reads `.assetsignore`. A dry run on this workspace reported:

- included: 448 files, 33,981,255 bytes
- ignored: 985 files, 475,928,918 bytes
- missing required control files: none

The ignored set includes local-only docs/tools/tests/output, generated large data packs, all `private-media/**`, and binary originals such as `*.pptx` and `*.docx`. The resource-restoration subset is tracked in `data/resource-manifest-large-assets.json`: 4 groups, 719 files, 408,385,466 bytes.

## Restoration map

| Group | Local footprint | Default Pages status | Preferred restore |
|---|---:|---|---|
| `private-media/qi-meeting-01` | 705 files, 369,204,139 bytes | excluded | R2 private object at `private/qi/meeting_01.mp4`, served through `/api/private-videos/qi-meeting-01/stream` |
| `resources/fluid-sources` PPT/DOCX originals | 8 files, 21,755,180 bytes | excluded | R2 protected source objects plus authenticated download route; keep derived Markdown/JSON in Pages |
| `resources/physical-oceanography/ppt` PPT originals | 5 files, 17,382,397 bytes | excluded | derived HTML/Markdown first; protected R2 download route only if originals must be downloadable |
| `resources/fluid-mechanics/exam-archives` DOCX original | 1 file, 43,750 bytes | excluded | keep derived Markdown public; store original in source repo or protected object storage |

## Private media

`qi-meeting-01` currently has a static fallback manifest and 704 local chunk files. Those files should stay out of normal Pages uploads.

Preferred restoration:

1. Put the original MP4 in `FM_PRIVATE_MEDIA` R2 at `private/qi/meeting_01.mp4`.
2. Keep metadata and access decisions in `FM_AUDIT`.
3. Verify with an authenticated `GET /api/private-videos/qi-meeting-01/status`; healthy restore means `sources.r2=true` or, for a KV fallback, `sources.kv=true`.

The teacher/admin upload flow uses a separate chunked R2 shape: `private/videos/<id>/chunks/chunk-0000.bin`. Use that path for newly uploaded private courses, not for the built-in `qi-meeting-01` single-object restore unless middleware is changed in a separate scoped change.

Emergency static fallback is possible only by deliberately including `private-media/qi-meeting-01` in a one-off staging package. That should be treated as temporary and removed from the next normal deploy package.

## Source documents

The site already has derived learning artifacts for the fluid source originals:

- `resources/fluid-sources/fluid-notes-current.md`
- `data/fluid-source-materials.json`
- `data/fluid-chapter-source-packs.json`
- `data/fluid-question-source-packs.json`
- `data/fluid-section-source-packs.json`

Those derived artifacts are the preferred public learning surface. PPT/DOCX originals should remain source-only unless there is an explicit need for student downloads.

If originals are restored for download, use protected object storage and a Pages Functions route that preserves the current source-download auth and audit behavior for `/resources/fluid-sources/`. Suggested R2 key pattern:

```text
protected-sources/fluid-sources/<filename>
```

Do not host source originals as default Pages static assets unless the files are intentionally public and audit is not required.

## Static-hosting exceptions

Static Pages hosting can be acceptable for derived HTML, Markdown, JSON, and small public resources. It is not the default for private video, PPTX, DOCX, PDF, ZIP, or downloaded media.

Before any exception:

1. Record the exact file paths and why static hosting is acceptable.
2. Narrow the `.assetsignore` exception to those files only.
3. Run `node tools/prepare-fluid-pages-deploy.mjs --dry-run --json` and confirm the added bytes are expected.
4. Restore the ignore rule after any one-off deploy that should not become the normal package.

## Verification commands

Read-only local checks:

```sh
node --check tools/audit-fluid-resource-hosting.mjs
node tools/audit-fluid-resource-hosting.mjs --check-manifest --json
jq empty data/resource-manifest-large-assets.json
node tools/prepare-fluid-pages-deploy.mjs --dry-run --json
```

Future post-restore checks, run only after a deliberate upload or route change:

```sh
curl -I --cookie '<authenticated session>' https://lghui.top/api/private-videos/qi-meeting-01/stream
curl --cookie '<authenticated session>' https://lghui.top/api/private-videos/qi-meeting-01/status
```

No credential value belongs in this plan, the manifest, or QA output.
