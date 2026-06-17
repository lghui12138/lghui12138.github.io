# 智能体 4：边缘入口、性能与缓存升级说明

日期：2026-05-13

## 审阅结论

- `wrangler.toml` 当前是 Cloudflare Pages 项目 `lghui-fluid-learning`，输出目录为仓库根目录，并绑定 `FM_AUDIT` KV。新增脚本复用已有 `/api/track`，不需要新增 KV 或 Worker 配置。
- `functions/_middleware.js` 已有边缘门禁、`/_edge-status`、`/_edge-monitor.js`、`/api/track`、HTML 注入、资源审计和按路径区分的 `Cache-Control`。当前源码里的 `EDGE_HOME_VERSION` 仍是 `round121-final-20260506-0315`。
- `sw.js` 是保护模式 kill switch：激活后删除旧缓存并注销自身，fetch 不接管请求。新增脚本不注册 Service Worker，不做离线缓存，只提示当前页面和已预热资源在浏览器缓存中可能可用。
- `index-complete.html` 已加载 `formula-lite.js`、`local-mathjax.js`、`fm-core.js`，并已有 Service Worker 注销逻辑、离线条、更新记录读取和多个 IntersectionObserver。新增脚本采用幂等增强，避免接管既有主流程。

## 新增脚本

文件：`/js/edge-fluid-performance.js`

能力：

- 资源提示：自动为 `fm-core`、公式轻量脚本、MathJax 本地脚本、知识点、真题、练习、题库、资源中心等入口添加 `preload/prefetch`。
- 关键 JSON 预热：空闲时以低优先级预热 `site-updates.json`、题库索引、真题索引、知识点、公式索引、首页搜索、资源索引等 JSON。会根据 `Save-Data` 和网络类型自动缩小预热数量。
- 离线提示：复用页面已有 `.off-bar`，没有时创建 `#fm-edge-offline-hint`。文案明确说明“已打开页面、学习记录和已预热资料可继续查看；新题库、AI 与教师接口需要联网”。
- 图片懒加载观察器：为图片补 `decoding="async"`，对折下图片补 `loading="lazy"`/`fetchpriority="low"`，并支持 `data-src`、`data-srcset`、`data-bg`、`data-background`、`data-lazy-bg`。
- 公式观察器：观察 `.box`、`.fcard`、`.formula`、`.math`、`[data-math]`、`[data-tex]` 等含公式节点，进入视口附近后调用 `FMFormulaLite`、`FMQueueMath` 或 MathJax 刷新。
- 性能指标记录：采集导航耗时、LCP、CLS、FID、INP、长任务、慢资源和预热结果，使用现有 `/api/track` 上报为 `edge_performance_metrics` 与 `edge_json_warmup`。
- 边缘版本展示：读取 `/_edge-status`，左下角显示当前 `edgeHomeVersion`。若本地记录和线上版本不同，显示刷新按钮并带 `edge_refresh=<version>` 重新进入当前页面。

## 主线 HTML 接入

建议在真实源仓的受保护主页面中加入：

```html
<script defer src="/js/edge-fluid-performance.js"></script>
```

推荐位置：

- `index-complete.html`：放在已有 `/lib/fm-core.js` 后，或放在 `</body>` 前最后一个主脚本之后。脚本不强依赖 `fm-core`，但放在主页面脚本后更利于复用已有 toast、公式队列和离线条。
- 需要同样增强的重页面也可引用，例如 `modules/knowledge-detail.html`、`modules/real-exams-dynamic.html`、`resources.html`。如果只先灰度，先接 `index-complete.html` 即可。

可选配置示例：

```html
<script
  defer
  src="/js/edge-fluid-performance.js"
  data-max-warmup="12"
  data-critical-json="/site-updates.json,/question-banks/index.json,/question-banks/real-exams-index.json,/data/fluid-knowledge-points.json"
  data-warm-json="/data/fluid-formula-index.json,/data/fluid-home-search-index.json,/resources.json">
</script>
```

## 版本号建议

建议主线在接入脚本时更新 `functions/_middleware.js` 的 `EDGE_HOME_VERSION`，因为这是用户可见的边缘体验变更，也会触发脚本的新版刷新提示。

建议命名：

```js
const EDGE_HOME_VERSION = 'round237-edge-performance-cache-20260513-HHMM';
```

如果主线还有其他智能体的内容升级一起合并，可以把版本名改成总版本，例如：

```js
const EDGE_HOME_VERSION = 'round237-fluid-site-upgrade-20260513-HHMM';
```

本智能体按写入范围限制没有直接修改 `functions/_middleware.js`、`sw.js` 或 HTML。主线接入时只需添加脚本引用并更新边缘版本号。
