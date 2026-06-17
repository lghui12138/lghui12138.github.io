# Round297 Upgrade Bundle

Version: `round297-real-qa-account-readiness-ledger-20260614`

Round297 sediments the optimization lessons from the previous release rounds into a small integration bundle. It does not claim production release by itself: it preserves the Round296 truth locks, records the auth/public-proof boundary, and leaves missing sibling ledgers as pending for the main thread rerun.

## Preserved Truths

- Real exams: 316/316 source/web atoms and 61/61 grouped sections remain non-waivable.
- 181103 protected materials: 38 materials, 30 study routes, and 61 review tasks stay path-safe.
- Private video: production recovery remains blocked until real teacher/student browser QA and `FM_PRIVATE_MEDIA` R2 both pass.

## Round297 Integration State

- Sibling ledgers present: 5; pending: 0.
- Pending sibling ledgers do not fail this worker bundle, but any present sibling ledger must be valid and path/sensitive-value safe.
- Release integration checks may remain pending until `site-updates`, edge versions, public shell, and browser gates are bound to Round297.

## Boundaries

- `lghui.top` public proof and `pages.dev` authenticated proof are separate facets.
- Missing QA credentials mean `blocked/not-run`, not a pass.
- JSON growth stays within the 250KB per-round budget or must be lazy-loaded with gzip sidecars.
