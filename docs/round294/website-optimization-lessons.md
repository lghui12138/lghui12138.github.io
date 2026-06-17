# Round294 Website Optimization Lessons

Version target: `round294-targeted-management-exam-workbench-20260613`

This note records the reusable rules learned from the Round287-Round293 release chain. It is an engineering memory for future site rounds, not a claim that the full 100-round objective is complete.

## Public Release Proof

- Treat `lghui.top` as the visible public shell and `lghui-fluid-learning.pages.dev` as the protected production app. They must be verified separately.
- A local green gate is not enough. A release is current only when `site-updates.json`, `EDGE_HOME_VERSION`, public shell `edge_refresh`, browser entry checks, and the public monitor all point to the same version.
- Keep `http://lghui.top/ -> https://lghui.top/` in browser checks. It catches CDN and public-shell drift that HTTPS-only checks can miss.
- The public shell can expose a safe audit JSON, but protected source-side data must still return JSON `401 authentication_required` when unauthenticated.

## Real Exam Fidelity

- Use source atomic question count as the source of truth. Consumer pages, practice cards, and review queues must follow the source count, not convenient grouped rows.
- Lock four- and five-part families explicitly. Years with multiple short-answer or conceptual items must stay split even when the scanned source presents them under one heading.
- Keep answer evidence separate from textbook or lecture-note explanations. A standard answer, teacher note, or derivation is not an original PDF-answer proof unless the evidence explicitly says it is from the answer PDF.
- Every new real-exam data surface needs a no-merge gate and a visible user-facing ledger, not only hidden JSON.

## 181103 Material Handling

- Index all protected materials by safe metadata: kind, group, chapter clue, study goal, and review task. Do not expose local paths, raw filenames when unnecessary, file URLs, or download routes.
- Pair every public workbench summary with a privacy boundary statement. The site may guide study order without publishing the private source package.
- Route 181103 materials back into site-native learning: knowledge lookup, formula conditions, real-exam review, textbook support, and animation aids.
- Record processing queues as honest next actions. Do not imply the protected packet has become a public textbook or answer source.

## Private Video Management

- UI hardening and mock gates are useful, but production recovery needs both real teacher credentials and `FM_PRIVATE_MEDIA` R2 binding.
- Delete must remain a three-step destructive flow: readiness check, dry-run preview, typed course-id confirmation.
- When storage is blocked, disable or limit the action with a visible reason. Hidden JSON is not enough for teacher-facing management.
- Unauthenticated mutations must keep returning JSON `401 authentication_required`; do not test recovery by searching for other credentials.

## Frontend Quality

- The first viewport should be a working study surface, not a marketing page. Show the real current counts and next routes.
- Compact panels need compact type. Avoid large hero typography inside dashboards, sidebars, and cards.
- Use stable layout constraints for counters, toolbars, cards, and route chips so dynamic counts do not resize the page.
- Every upgraded page needs a 390px mobile overflow check, focus-visible state, and link/button labels that still make sense from a screen reader.

## Gate Design

- Prefer gates that prove the user-visible contract: version, count, route, privacy, auth boundary, and browser rendering.
- Do not weaken a gate to make a round pass. If a new correct behavior changes the gate shape, update the assertion to the new source of truth and keep the old regression blocked.
- Separate anonymous public proof from authenticated account proof. The final report must say which one was actually run.
- Keep blocked claims explicit in machine-readable output so future rounds cannot accidentally turn a blocker into a pass.
