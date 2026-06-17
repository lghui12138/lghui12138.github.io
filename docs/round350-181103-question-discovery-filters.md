# Round350 181103 Question Discovery Filters

- version: `round350-181103-question-discovery-filters-20260615`
- bank: `181103-material-extracted`
- questions: 522/522
- visible filter buttons: 5/5
- exact search aliases: 5/5
- loose search aliases: 6/6

## Exact Student Aliases

| alias | status | expected route hits |
|---|---|---:|
| 181103资料题 | PASS | 2 |
| 181103讲义题 | PASS | 2 |
| 181103习题 | PASS | 2 |
| 181103例题 | PASS | 2 |
| 181103答案线索 | PASS | 2 |

## Loose Student Aliases

| alias | status | expected route hits |
|---|---|---:|
| 讲义题 | PASS | 2 |
| 资料题 | PASS | 2 |
| 习题 | PASS | 2 |
| 例题 | PASS | 2 |
| 答案线索 | PASS | 2 |
| 自测 | PASS | 2 |

## Checks

| check | status |
|---|---|
| round350-required-inputs-readable | PASS |
| round350-extracted-bank-still-has-522-questions | PASS |
| round350-round345-anchor-ledger-still-complete | PASS |
| round350-question-bank-index-carries-student-alias-tags | PASS |
| round350-question-bank-page-exposes-filter-panel | PASS |
| round350-question-bank-page-exposes-alias-route-card | PASS |
| round350-question-bank-data-binds-alias-buttons | PASS |
| round350-search-builder-emits-student-aliases | PASS |
| round350-search-index-routes-aliases-to-question-bank | PASS |
| round350-no-unsafe-search-targets-for-aliases | PASS |

## Acceptance

PASS: Round350 proves students can discover the 181103 522-question material bank by visible filters and search aliases such as 资料题、讲义题、习题、例题、答案线索.
