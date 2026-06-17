# Round297 Public JSON Budget

Version: `round297-public-json-growth-budget-20260614`
Target release: `round297-real-qa-account-readiness-ledger-20260614`

This is a first public JSON growth budget ledger for later main-thread integration. It only scans public `data/*.json` files in this repo, excludes `.json.gz`, and keeps all paths repository-relative.

## Summary

- Public JSON files: 87
- Total public JSON size: 68.56 MiB
- Files with gzip sidecars: 67
- Round296/Round297 ledgers checked: 12
- Single new public JSON budget: 250.0 KiB
- Over-budget failures: 0
- Gzip sidecar failures: 0

## Round296/Round297 Ledger Budget

| File | JSON size | Gzip size | Status | Exemption |
|---|---:|---:|---|---|
| `data/fluid-round296-real-exam-route-locks.json` | 113.9 KiB | 15.3 KiB | pass |  |
| `data/fluid-round296-private-video-readiness-ledger.json` | 29.3 KiB | 4.7 KiB | pass |  |
| `data/fluid-round297-real-exam-visible-locks.json` | 19.4 KiB | 3.2 KiB | pass |  |
| `data/fluid-round297-dual-origin-proof.json` | 17.1 KiB | 2.2 KiB | pass |  |
| `data/fluid-round296-181103-downloads-inventory.json` | 15.2 KiB | 2.5 KiB | pass |  |
| `data/fluid-round297-public-json-budget.json` | 13.9 KiB | verified after write | pass |  |
| `data/fluid-round297-auth-readiness-ledger.json` | 9.5 KiB | 1.5 KiB | pass |  |
| `data/fluid-round297-upgrade-bundle.json` | 8.2 KiB | 2.2 KiB | pass |  |
| `data/fluid-round296-website-optimization-ledger.json` | 7.0 KiB | 2.3 KiB | pass |  |
| `data/fluid-round296-upgrade-bundle.json` | 5.5 KiB | 1.8 KiB | pass |  |
| `data/fluid-round297-resources-private-video-a11y.json` | 5.4 KiB | 1.2 KiB | pass |  |
| `data/fluid-round296-public-shell-freshness.json` | 4.9 KiB | 1.1 KiB | pass |  |

## Largest Public JSON Files

| Rank | File | JSON size | Gzip sidecar | Gzip ratio |
|---:|---|---:|---:|---:|
| 1 | `data/fluid-formula-applications.json` | 14.77 MiB | 358.2 KiB | 0.0237 |
| 2 | `data/fluid-source-search-index.json` | 5.62 MiB | 432.4 KiB | 0.0751 |
| 3 | `data/fluid-formula-drills.json` | 5.61 MiB | 186.9 KiB | 0.0325 |
| 4 | `data/fluid-chapter-sections.json` | 3.17 MiB | 181.9 KiB | 0.0561 |
| 5 | `data/fluid-formula-index.json` | 2.99 MiB | 135.5 KiB | 0.0443 |
| 6 | `data/fluid-question-remediation.json` | 2.61 MiB | 159.5 KiB | 0.0598 |
| 7 | `data/fluid-formula-applications-lite.json` | 2.59 MiB | 81.1 KiB | 0.0305 |
| 8 | `data/fluid-knowledge-links.json` | 2.57 MiB | 220.3 KiB | 0.0836 |
| 9 | `data/fluid-knowledge-card-packs.json` | 2.36 MiB | 195.6 KiB | 0.081 |
| 10 | `data/fluid-question-answer-checks.json` | 2.15 MiB | 177.7 KiB | 0.0805 |
| 11 | `data/fluid-question-source-packs.json` | 2.02 MiB | 144.4 KiB | 0.0699 |
| 12 | `data/fluid-knowledge-remediation.json` | 1.99 MiB | 123.4 KiB | 0.0606 |
| 13 | `data/fluid-exam-type-packs.json` | 1.98 MiB | 88.2 KiB | 0.0436 |
| 14 | `data/fluid-section-remediation.json` | 1.55 MiB | 46.6 KiB | 0.0294 |
| 15 | `data/fluid-chapter-exam-packs.json` | 1.41 MiB | 171.2 KiB | 0.1187 |

## Gzip Sidecar Checks

| File | Sidecar exists | Matches JSON | Gzip size |
|---|---|---|---:|
| `data/fluid-round296-real-exam-route-locks.json` | yes | yes | 15.3 KiB |
| `data/fluid-round296-private-video-readiness-ledger.json` | yes | yes | 4.7 KiB |
| `data/fluid-round297-real-exam-visible-locks.json` | yes | yes | 3.2 KiB |
| `data/fluid-round297-dual-origin-proof.json` | yes | yes | 2.2 KiB |
| `data/fluid-round296-181103-downloads-inventory.json` | yes | yes | 2.5 KiB |
| `data/fluid-round297-public-json-budget.json` | generated | verified-after-final-write | verified after write |
| `data/fluid-round297-auth-readiness-ledger.json` | yes | yes | 1.5 KiB |
| `data/fluid-round297-upgrade-bundle.json` | yes | yes | 2.2 KiB |
| `data/fluid-round296-website-optimization-ledger.json` | yes | yes | 2.3 KiB |
| `data/fluid-round296-upgrade-bundle.json` | yes | yes | 1.8 KiB |
| `data/fluid-round297-resources-private-video-a11y.json` | yes | yes | 1.2 KiB |
| `data/fluid-round296-public-shell-freshness.json` | yes | yes | 1.1 KiB |

## Failures

- none

## Main-Thread Integration Notes

- Keep new Round296/Round297 public JSON ledgers below 250 KiB unless the release report names a specific exemption.
- Keep heavy historical search/formula/question JSON off the critical boot path; this ledger is size evidence, not a boot-waterfall proof.
- Regenerate this report after adding any new public ledger so the gzip sidecar and top-file list stay current.
