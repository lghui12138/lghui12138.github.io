# lghui private video management fix notes

Date: 2026-06-12
Agent: Codex

## Current blocker

The latest source checkout is expected at:

- `/Volumes/mac_2T/work/github/lghui12138.github.io`

During this continuation `/Volumes/mac_2T` was not mounted. `diskutil list`, `df`, and
`mount` only showed the internal disk, so the current Worker source and release
verification scripts were not available.

Do not patch or push the GitHub `main` checkout at
`/Users/kili/Documents/Codex/lghui-private-video-fix`: that checkout is the
public shell only and does not contain `functions/_middleware.js`.

Old local source candidates were found but are stale and must not be used for
production:

- `/Users/kili/.openclaw/workspace/lghui-fluid-learning-private`
- `/Users/kili/.openclaw/workspace/lghui-fluid-round121-work`

## Diagnosed issue

From the latest source snippets read before the mount disappeared:

- `functions/_middleware.js` already has backend course-level private video
  operations:
  - `coursePublishMatch`
  - `courseArchiveMatch`
  - `courseAccessMatch`
  - `courseDeleteMatch`
  - `deleteUploadedPrivateVideoStorage`
  - audit events such as `private_video_course_delete`
- `handleAdminPrivateVideos` exposes `videos`, `courses`, `staticVideos`, and
  `staticCourses` from `/api/admin/private-videos`.
- The `/_edge-admin` inline UI loads `/api/admin/private-videos`, but
  `drawPrivateVideoRows()` renders a read-only table from
  `(data.staticVideos || []).concat(data.videos || [])`.

Likely user-visible bug: the backend can delete/archive/reassign a teacher
uploaded private course, but the teacher monitor page has no usable management
buttons. It also presents individual videos rather than the course summary,
which makes multi-part private lessons hard to manage.

## Intended source patch

Patch `functions/_middleware.js` in the latest source checkout.

UI table in `renderAdmin()`:

- Change the private video table headers from five read-only columns to six
  course-management columns:
  - course
  - status / segments
  - assigned student
  - storage
  - updated time
  - actions
- Add `#privateVideoActionStatus`.
- Add CSS for `.rowactions` and `button.danger`.

Inline JS:

- Add `let privateCourses = [];`.
- In `loadPrivateVideos()` call:
  - `/api/admin/private-videos?includeArchived=1&refresh=1`
  - set `privateVideos = (data.staticVideos || []).concat(data.videos || [])`
  - set `privateCourses = (data.staticCourses || []).concat(data.courses || [])`
- Rework `drawPrivateVideoRows()` to prefer `privateCourses` and render:
  - course id/title/description
  - `segmentIds`
  - `uploadedSegments / segmentCount`
  - `publishedSegments`
  - `missingSegments`
  - `assignedUsers`
  - storage and uploaded bytes
  - actions
- For static qi course, show "内置静态课，只能看日志" and no destructive buttons.
- For uploaded courses, render buttons:
  - `data-pv-publish-course`
  - `data-pv-access-course`
  - `data-pv-archive-course`
  - `data-pv-delete-course`

Add JS helpers:

- `async function submitPrivateVideoAction(courseId, action, options = {})`
  - publish: `POST /api/admin/private-videos/course/:id/publish`
  - archive: `POST /api/admin/private-videos/course/:id/archive`
  - access: `POST /api/admin/private-videos/course/:id/access`
  - delete: `POST /api/admin/private-videos/course/:id/delete`
  - use `readJsonOrThrow`
  - refresh list and monitor summary after success
- `async function updatePrivateVideoCourseAccess(courseId)`
  - prompt for one student account, defaulting to current assigned user.
  - send `assignedUsers`.
- `async function deletePrivateVideoCourse(courseId)`
  - require confirm text including the course id/title.
  - call the delete endpoint.

Event delegation:

- Add one click listener on `#privateVideoRows` that handles the four
  `data-pv-*` buttons.

Security constraints:

- Do not add any client-side credential handling.
- Keep all mutation endpoints under existing `handleAdminPrivateVideos`
  `isAdmin(session, env)` and `crossOriginMutationError(request)` checks.
- Do not expose static private media paths.
- Do not allow deleting the static qi course from UI.

## Gates to add/run after mount returns

Update at least one static gate so this regression cannot return:

- `tests/edge-fluid-upgrade-check.js`
  - assert `renderAdmin` contains `privateVideoActionStatus`.
  - assert `loadPrivateVideos()` requests `includeArchived=1` and `refresh=1`.
  - assert `drawPrivateVideoRows()` uses `privateCourses`.
  - assert buttons: `data-pv-delete-course`, `data-pv-access-course`,
    `data-pv-archive-course`, `data-pv-publish-course`.
  - assert JS helper names for delete/access.
- `tools/validate-site-content.mjs`
  - extend existing private-video teacher-panel/backend checks if needed.

Run:

```sh
node --check functions/_middleware.js
node tests/edge-fluid-upgrade-check.js
node tools/validate-site-content.mjs
node tools/verify-fluid-release-gate.mjs
```

Deploy with the project wrapper, not plain wrangler:

```sh
/Users/kili/.local/bin/wrangler-lghui pages deploy ...
```

Production verification:

- Use the existing real QA browser chain.
- Verify `lghui.top` public shell routes into the production app.
- Verify teacher account can see the private video management buttons.
- Non-destructive API proof: as teacher, `POST` or `DELETE` a missing course id
  should return `404` and JSON, not HTML or a silent success.
- Do not delete real production media unless the user identifies a target video
  or a disposable test upload is created and then removed.
