# Round332 181103 HTML / 题库可见性门禁

- version: round332-181103-html-question-visibility-20260615
- resource entry: `/resources.html#round323ResourceFinder`
- HTML index: `/resources/fluid-181103-html/index.html`
- question bank: `/modules/question-bank.html?focus=181103-material-extracted#questionBanksList`
- HTML material entrypoints: 38/38
- direct HTML material pages: 38/38
- material questions: 522/522
- question-bank entry count: 522
- PDF/download/viewer bare links: 0
- local path / iframe/embed/object hits: 0 / 0
- public digest: `1e73793f98689645aa0628be59db70a8d33bd87f664e0e1a620846eda75eaeab`

## Boundary

Round332 is a repeatable visibility gate. It does not rebuild the 181103 materials, does not modify real-exam or private-video scripts, and does not treat material-derived questions as original real-exam answer evidence.

The gate reads the current resource center, 181103 HTML index, 38 material pages, and question-bank entry. It also inherits the accepted Round325/Round326 ledgers so this proof stays tied to the current online-authority baseline and the downloads/question ledger.

## Proof Surface

| Surface | Evidence |
| --- | ---: |
| Resource page links to 181103 HTML index | 7 |
| Resource page links to 522-question bank | 6 |
| HTML material cards in index | 38 |
| Unique material entry links in index | 38 |
| Material pages passing direct-HTML checks | 38 |
| Questions in 181103 material bank | 522 |
| Questions with in-site HTML anchors | 522 |
| Questions whose HTML files exist | 522 |
| Questions whose source anchors exist | 522 |
| PDF/download/viewer bare links | 0 |

## Checks

| Check | Result |
| --- | --- |
| round325-and-round326-source-ledgers-still-pass | PASS |
| resources-page-exposes-html-index-and-522-bank | PASS |
| source-index-exposes-38-of-38-html-material-entrypoints | PASS |
| all-38-material-entrypoints-are-direct-html-not-viewer-download | PASS |
| question-bank-entry-exposes-522-material-questions | PASS |
| all-522-material-questions-anchor-to-existing-in-site-html | PASS |
| zero-pdf-download-viewer-bare-links-on-181103-surfaces | PASS |

## Gate

```bash
node tools/check-round332-181103-html-question-visibility.mjs --write --json
node tools/check-round332-181103-html-question-visibility.mjs --check-only --json
```
