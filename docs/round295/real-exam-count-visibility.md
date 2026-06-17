# Round295 Real-Exam Count Visibility

Version: `round295-real-exam-count-visibility-20260614`

This read-only gate makes the count-lock requirement explicit: some real-exam years have five short-answer-family items, and those five items must remain five independent question IDs. Subquestions are not allowed to collapse into one merged parent.

## Gate Summary

- Source atomic questions: 325/325
- Web atomic questions: 325/325
- Grouped sections split: 68/68
- Five-item count locks visible: 5/5
- Failed five-item count locks: 0
- Stale 308/56 signatures: 0

## Five-Item Count Locks

| year | key | label | independent question IDs | status |
|---:|---|---|---|---|
| 2010 | 2010-02 | 2010 二、简答题×5 | ocean-2010-02-01<br>ocean-2010-02-02<br>ocean-2010-02-03<br>ocean-2010-02-04<br>ocean-2010-02-05 | locked |
| 2015 | 2015-01 | 2015 一、简答题×5 | ocean-2015-01-01<br>ocean-2015-01-02<br>ocean-2015-01-03<br>ocean-2015-01-04<br>ocean-2015-01-05 | locked |
| 2018 | 2018-01 | 2018 一、简答题×5 | ocean-2018-01-01<br>ocean-2018-01-02<br>ocean-2018-01-03<br>ocean-2018-01-04<br>ocean-2018-01-05 | locked |
| 2019 | 2019-01 | 2019 一、名词解释×5 | ocean-2019-01-01<br>ocean-2019-01-02<br>ocean-2019-01-03<br>ocean-2019-01-04<br>ocean-2019-01-05 | locked |
| 2020 | 2020-01 | 2020 一、概念与简答题×5 | ocean-2020-01-01<br>ocean-2020-01-02<br>ocean-2020-01-03<br>ocean-2020-01-04<br>ocean-2020-01-05 | locked |

## Boundary

This gate only proves machine-readable and Markdown real-exam count visibility. It does not edit UI, public shell, question text, answer text, deploy state, or answer-PDF provenance.
