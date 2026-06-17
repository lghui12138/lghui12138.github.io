# Fluid Knowledge Upgrade 2026

本说明对应 `data/fluid-knowledge-upgrade-2026.json`，由智能体 1 生成，目标是把中国海洋大学 803 流体力学备考数据从“已有知识点/公式/真题”升级成“可执行知识体系”。

## 数据来源

- `data/fluid-knowledge-points.json`：202 页笔记知识点。
- `data/fluid-formula-index.json`：2183 条公式索引，含章节公式和真题链接。
- `data/fluid-chapter-sections.json`：6 个课件章节、182 个小节、学习卡和真题迁移。
- `data/fluid-review-plan.json`：4 阶段复习路径、15 个高频考点、480 个六章真题练习映射。
- `data/fluid-round263-exam-route-map.json`：题干条件到公式路线的选路图，作为复习计划进入真题前的先导。
- `data/fluid-round264-formula-condition-checklist.json`：公式适用条件、边界条件、单位方向、错因和真题/动画回链。

## 2026-05-25 一致性说明

- 当前入口版本仍是 `round265-redirect-loop-recovery-20260524`，负责入口恢复、旧缓存和加载稳定性。
- `round264-formula-condition-checklist-20260522` 是公式条件学习内容包日期，不是当前入口部署日期。
- `data/fluid-review-plan.json` 保留 2026-05-02 初始生成时间，另以 `updatedAt` 和 `consistencyNotes` 记录 2026-05-25 内容一致性审计。
- 推荐学习顺序统一为：先用 round263 题目选路图读题，再用 round264 公式条件卡核适用范围，最后回真题训练或自制动画复盘。

## JSON 结构

- `chapterUpgradeMap`：每章的核心概念、公式骨架、易错点、实验/工程场景、真题连接、学习路径。
- `crossChapterLearningPath`：按 803 备考节奏组织的四阶段学习路径。
- `questionRoutingRules`：题面关键词到章节、公式、答题入口的路由。
- `qualityGates`：公式条件、真题迁移、模型选择、控制体和跨章连接检查。
- `siteIntegrationHints`：给后续页面或 AI 助手接入时使用的字段建议。

## 章节主线

1. 第 1 章：连续介质、物性、欧拉/拉格朗日、物质导数、流线迹线、速度梯度和应力。
2. 第 2 章：理想流体、连续方程、Euler、Bernoulli、Lagrange。
3. 第 3 章：雷诺输运、积分动量、能量方程与控制体模板。
4. 第 5 章：涡量、环量、Kelvin 条件、涡管伸缩和位涡图像。
5. 第 6 章：势流、速度势、流函数、复势、镜像法、圆定理和圆柱绕流。
6. 第 8 章：N-S 简化、Couette/Poiseuille、Re 相似、边界层、湍流、低 Re 阻力。

## 后续集成建议

- 知识页总览可先读取 `chapterUpgradeMap[].coreConcepts` 和 `formulaSpine`。
- 搜索或 AI 解题入口可读取 `questionRoutingRules`。
- 每日复习卡可读取 `crossChapterLearningPath[].mustDoQuestions` 和 `qualityGates`。
- 真题详情页可反向显示 `examConnections[].howToUse`，提醒学生这道题训练的是哪条知识链。
