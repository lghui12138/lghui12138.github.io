# Round295 Answer/PDF Evidence Boundary

Version: `round295-answer-pdf-evidence-boundary-20260614`

This is a read-only derived gate for Worker D. It keeps original-question PDF fidelity, derived or unproven answer text, and textbook support in separate ledgers. It does not edit UI, public shell, question text, or answer text.

## Counts

- Aligned real-exam questions: 316
- Original-question PDF comparable/provable stems: 316/316 (100.0%)
- Strict original answer-PDF proof: 0
- Derived or unproven answer rows: 316/316
- Textbook or notes supported rows: 316/316
- Wu book support: 316/316
- Wang book support: 281/316
- Strong two-book support: 270/316
- Textbook OCR pages: 916/916
- Textbook sections matched: 232/232

## Gates

| gate | status | detail |
|---|---|---|
| original-question-pdf-fidelity-separated | pass | questionStem=316/316, comparable=316, nonQuestionPdfRows=0 |
| answer-pdf-proof-remains-zero | pass | answerPdfProvable=0, strictAnswerEvidence=0, improperOriginal=0 |
| derived-answer-text-not-renamed-original | pass | derivedOrUnproven=316/316, pdfMissingAnswers=0 |
| textbook-support-kept-separate | pass | textbookOrNotes=316/316, answerEvidence=316, noteSupport=316 |
| two-textbook-ledger-available | pass | books=2, pages=916/916, sections=232/232 |
| textbook-question-support-thresholds | pass | Wu=316, Wang=281, both=281, strongBoth=270 |

## Layer Ledger

| layer | count | allowed claim | forbidden claim |
|---|---:|---|---|
| original-question-pdf-fidelity | 316 | question stem/source text is backed by original-question PDF/OCR/source index | answer text is original answer-PDF text |
| strict-answer-pdf-proof | 0 | none in current data | derived explanations are original answer-PDF proof |
| derived-or-unproven-answer-text | 316 | reference answer/explanation for study and review | verbatim original answer |
| textbook-or-notes-support | 316 | textbook/notes/site support for reasoning | textbook support is answer-PDF provenance |

## Boundary

- Question-stem fidelity can be cited as original-question PDF/OCR/source-index support for the aligned 316 rows.
- Current answer text must remain reference, explanation, textbook, notes, or site-derived support. It is not strict original answer-PDF proof.
- Textbook support is a learning and review bridge. It must not be renamed into original answer text or original answer-PDF provenance.
- This gate does not claim deploy, browser proof, public-shell state, private-video state, or production R2 readiness.
