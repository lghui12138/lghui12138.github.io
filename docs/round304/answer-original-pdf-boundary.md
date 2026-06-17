# Round304 Answer Original-PDF Boundary

Version: `round304-answer-original-pdf-boundary-20260614`

This ledger separates derived answer text, strict original answer-PDF proof, two-textbook support, and safe supplement targets. It reuses the existing evidence matrix, PDF fidelity audit, Round303 answer/textbook boundary, and two-textbook coverage ledger as source of truth.

## Counts

- Aligned source-atomic questions: 316
- Derived or unproven answer rows: 316/316
- Strict original answer-PDF proof rows: 0
- Strict answer evidence rows in evidence matrix: 0
- Improper original-answer claims: 0
- Original question-PDF provable rows: 316/316
- Two-textbook OCR pages: 916/916
- Two-textbook sections matched: 232/232
- Strong two-book support: 270/316 (85.4%)
- Wang supplement target from Wu-only rows: 35
- Weak two-book strengthening target: 11
- Formula supplement queue: 65

## Acceptance

| gate | status | detail |
|---|---|---|
| source-counts-agree | pass | rows=316, round303=316, answerBoundary=316, evidenceMatrix=316 |
| strict-original-answer-pdf-proof-remains-zero | pass | round304Strict=0, answerBoundaryStrict=0, matrixStrict=0, originalFlags=0 |
| derived-answers-not-renamed-original | pass | derived=316/316, pdfDerived=344, missingAnswers=0 |
| textbook-support-present-but-separated | pass | textbookOrNotes=316, answerEvidence=316, notes=316, Wu=316, missing=0 |
| two-textbook-ledger-reusable | pass | books=2, pages=916/916, sections=232/232, weak=0, pending=0 |
| next-supplement-targets-are-explicit | pass | Wang=281, both=281, strongBoth=270, WuOnly=35, weakBoth=11, formulaQueue=65 |

## Claim Layers

| layer | count | allowed claim | forbidden claim |
|---|---:|---|---|
| derived-answer-text | 316 | reference/study answer derived from site explanations, notes, or textbook support | original answer PDF text |
| strict-original-answer-pdf-proof | 0 | none in current artifacts | using textbook or notes support as answer-PDF proof |
| two-textbook-support | 281 | learning provenance and review support across Wu Wangyi and Wang Hongwei textbooks | answer-PDF provenance |
| original-question-pdf-fidelity | 316 | question stem/source alignment proof | answer text proof |

## Year Ledger

| year | aligned | derived/unproven | strict answer-PDF proof | strong two-book | weak two-book | Wu only |
|---:|---:|---:|---:|---:|---:|---:|
| 2000 | 16 | 16 | 0 | 14 | 0 | 2 |
| 2001 | 8 | 8 | 0 | 6 | 1 | 1 |
| 2002 | 9 | 9 | 0 | 6 | 2 | 1 |
| 2003 | 9 | 9 | 0 | 7 | 0 | 2 |
| 2004 | 18 | 18 | 0 | 16 | 0 | 2 |
| 2005 | 16 | 16 | 0 | 14 | 0 | 2 |
| 2006 | 14 | 14 | 0 | 14 | 0 | 0 |
| 2007 | 22 | 22 | 0 | 21 | 0 | 1 |
| 2008 | 9 | 9 | 0 | 8 | 0 | 1 |
| 2009 | 8 | 8 | 0 | 8 | 0 | 0 |
| 2010 | 21 | 21 | 0 | 18 | 3 | 0 |
| 2011 | 18 | 18 | 0 | 17 | 0 | 1 |
| 2012 | 16 | 16 | 0 | 13 | 0 | 3 |
| 2013 | 10 | 10 | 0 | 6 | 1 | 3 |
| 2014 | 13 | 13 | 0 | 13 | 0 | 0 |
| 2015 | 14 | 14 | 0 | 14 | 0 | 0 |
| 2016 | 9 | 9 | 0 | 7 | 0 | 2 |
| 2018 | 14 | 14 | 0 | 11 | 0 | 3 |
| 2019 | 13 | 13 | 0 | 13 | 0 | 0 |
| 2020 | 17 | 17 | 0 | 11 | 0 | 6 |
| 2021 | 12 | 12 | 0 | 10 | 1 | 1 |
| 2022 | 10 | 10 | 0 | 9 | 0 | 1 |
| 2023 | 10 | 10 | 0 | 7 | 2 | 1 |
| 2024 | 10 | 10 | 0 | 7 | 1 | 2 |

## Next Supplement Targets

| priority | id | count | action | boundary |
|---|---|---:|---|---|
| P0 | strict-original-answer-pdf-proof | 0 | Do not promote any current answer to original answer-PDF proof until a future artifact provides explicit page/span/verbatim/hash evidence. | This queue intentionally stays at zero with the current source artifacts. |
| P1 | wang-book-support-for-wu-only-rows | 35 | Add Wang Hongwei-side chapter/section/formula pointers where the two-textbook OCR ledger supports them. | Second-book support is study provenance, not original answer-PDF proof. |
| P1 | strengthen-weak-two-book-rows | 11 | Raise weak two-book rows with exact chapter, section, formula, or page-lineage anchors. | Use references and paraphrase; do not publish raw textbook body text. |
| P2 | restore-missing-textbook-links | 0 | Any positive count means the answer support bridge regressed and must be restored before release. | A zero count is expected. |
| P1 | formula-card-supplement-queue | 65 | Continue filling formula cards with textbook chapter/section/page pointers and rewritten explanations. | Formula/textbook cards supplement learning routes; they do not establish original answer-PDF text. |

## Non-Claim

The current site may use the answer text as study/reference explanation backed by notes and textbook links. This artifact does not prove that any current answer is copied from, or verbatim supported by, an original answer PDF.
