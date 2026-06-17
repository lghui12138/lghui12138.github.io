# Round350 Release Proof Matrix

- Version: round350-release-proof-matrix-20260615
- Generated: 2026-06-15T13:50:00+08:00
- Expected public version: round358-181103-522-html-practice-release-20260616
- Acceptance: PASS

## Locked Counts

- 181103 HTML materials: 38/38
- 181103 question anchors: 522
- 181103 question bank rows: 522
- Real-exam atomic questions: 325
- Real-exam five-item atoms: 25

## Production Proof Boundary

- Teacher QA account verified: true
- Student QA account verified: true
- Authenticated browser proof: true
- FM_PRIVATE_MEDIA R2 present: false
- Production recovery claimed: false
- Production ready: false
- Blocker: private-video-storage-or-FM_PRIVATE_MEDIA-r2-binding

## Checks

- PASS 181103-direct-html-and-bank-locked: materials=38, direct=38, anchors=522, bank=522
- PASS 181103-no-viewer-download-regression: bare=0, viewer=0, download=0
- PASS 181103-production-html-proof-present: productionRoutes=4/4
- PASS real-exam-source-cardinality-no-merge: source=325, web=325, sections=68, groupedWeb=217
- PASS real-exam-five-item-and-answer-boundary-locked: fiveItem=5/5, atoms=25, answerPdf=0
- PASS lghui-top-real-account-proof-current: expected=round358-181103-522-html-practice-release-20260616, proof=round358-181103-522-html-practice-release-20260616, top=round358-181103-522-html-practice-release-20260616, edge=round358-181103-522-html-practice-release-20260616, teacher=true, student=true
- PASS private-video-action-matrix-still-limited-by-r2: actions=3/1/3
- PASS r2-blocker-not-misreported-as-production-complete: hasAuditKv=true, hasPrivateMediaR2=false, productionRecoveryClaimed=false

## Commands

```bash
node --check tools/check-round350-release-proof-matrix.mjs
node tools/check-round350-release-proof-matrix.mjs --write --json --expected-version round358-181103-522-html-practice-release-20260616
```
