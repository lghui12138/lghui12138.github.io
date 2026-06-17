# Round302 Student UI Notes

Round302 学生界面把真题题数、181103 材料关系和私有视频阻塞分开显示：`316/316` 原文原子题是学生练习数，`176/176` source-section 是来源行锁，`61 -> 201` 表示 61 个 grouped section 展开为 201 个小问，父题不另占学生题数。

## Worker D Surface

- File: `modules/real-exams-dynamic.html`
- Scope: real-exam / 181103 student UI polish only.
- Shared release/version tokens were not changed.

## Visible Panel

- Added a compact `Round302 学习 / 审计` panel near the top of the real-exams page.
- The panel separates the locked real-exam count from the 181103 task layer:
  - `316/316` original atomic questions stay the student practice count.
  - `176/176` source-section rows stay the original-row lock.
  - `61` grouped sections expand into `201` subquestions; parent grouped rows do not count as separate student questions.
  - 181103 stays a study-task relationship: `38` protected materials, `30` study routes, and `61` review tasks for chapter evidence.

## Implementation Notes

- CSS is kept in the existing page stylesheet with small `.round302-audit*` classes.
- Existing scripts are preserved; the panel starts with static fallback values and then syncs from existing source-granularity summaries after the current JSON loaders finish.
- Links point to the existing practice cards, source audit details, and 181103 workbench.
