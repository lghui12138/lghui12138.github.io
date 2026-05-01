# 站点内容补全交接

更新时间：2026-05-01 23:59 Asia/Shanghai

## 内容来源

- 笔记母本：中国海洋大学流体力学笔记_逐页校录_当前最新版.md
- 真题母本：latest-exam.md
- 主站仓库：/Users/kili/.openclaw/workspace/lghui12138.github.io

## 已整理进站点的内容

- 知识点：生成 data/fluid-knowledge-points.json，共 124 页，来源为 round46 逐页校录笔记。
- 知识点页面：重建 modules/knowledge-detail.html，支持分类、搜索、公式渲染。
- 真题主库：修补 question-banks/真题_中国海洋大学_2000-2024_fixed.json，主库现为 289 题，残留占位 0 条。
- 年份缺口：补入 2008 年 4 组原题；2017 年按源稿说明保留为“原始资料未检出完整页”，未伪造题面。
- 真题入口：modules/real-exams-dynamic.html 只加载推荐主库，避免 cleaned/comprehensive/fixed 多库重复混入。
- 索引：question-banks/index.json 已同步 count/recommended，并补上旧页面需要的 real/chapter/wrong 数组。

## 复跑方式

    cd /Users/kili/.openclaw/workspace/lghui12138.github.io
    node tools/build-site-content.mjs
    node tools/validate-site-content.mjs

若换机器，设置这两个环境变量即可替换源文件位置：

    export FLUID_NOTES_MD=/path/to/中国海洋大学流体力学笔记_逐页校录_当前最新版.md
    export FLUID_EXAM_MD=/path/to/latest-exam.md

## 推送

当前变更可以直接提交并推送到 GitHub Pages 仓库：

    git add .
    git commit -m "Restore and refresh fluid mechanics study content"
    git push origin main
