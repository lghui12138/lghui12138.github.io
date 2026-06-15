#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const repoRoot = path.resolve(new URL('../', import.meta.url).pathname);
const version = 'round324-181103-question-discovery-20260615';
const outputRelPath = 'data/fluid-round324-181103-question-discovery.json';
const docRelPath = 'docs/round324/181103-question-discovery.md';
const expected = {
  totalQuestions: 411,
  defaultPracticeQuestions: 119,
  ocrReviewQuestions: 268,
  hiddenReviewQuestions: 24,
  chapterPendingQuestions: 181,
  sourceHtmlAnchors: 411,
  defaultPracticeGarbleQuestions: 0,
  ocrFormulaReviewQuestionsMin: 149
};

function parseArgs(argv) {
  const args = { json: false, write: false, checkOnly: false };
  for (const arg of argv) {
    if (arg === '--json') args.json = true;
    else if (arg === '--write') args.write = true;
    else if (arg === '--check-only') args.checkOnly = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function fromRoot(relPath) {
  return path.join(repoRoot, relPath);
}

function readText(relPath) {
  return fs.readFileSync(fromRoot(relPath), 'utf8');
}

function readJson(relPath) {
  return JSON.parse(readText(relPath));
}

function writeText(relPath, text) {
  const absPath = fromRoot(relPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, text);
}

function writeJsonAndGzip(relPath, payload) {
  const text = `${JSON.stringify(payload, null, 2)}\n`;
  writeText(relPath, text);
  fs.writeFileSync(fromRoot(`${relPath}.gz`), zlib.gzipSync(text, { level: 9 }));
}

function readExistingGeneratedAt() {
  const file = fromRoot(outputRelPath);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')).generatedAt || null;
  } catch {
    return null;
  }
}

function relFromHref(href) {
  return String(href || '').split('#')[0].split('?')[0].replace(/^\/+/, '');
}

function hashFromHref(href) {
  return String(href || '').split('#')[1] || '';
}

function htmlHasId(html, id) {
  if (!id) return false;
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`\\bid=(["'])${escaped}\\1|\\bid=${escaped}(?=[\\s>])`).test(html);
}

function countMatches(text, regex) {
  return (String(text || '').match(regex) || []).length;
}

function classifyBucket(question) {
  if (question.qualityTier === 'show' && question.defaultVisible === true && question.defaultHidden === false) {
    return 'default-practice';
  }
  if (question.qualityTier === 'ocr-review' && question.defaultVisible === false && question.defaultHidden === false) {
    return 'ocr-review';
  }
  if (question.qualityTier === 'hide' && question.defaultVisible === false && question.defaultHidden === true) {
    return 'hidden-review';
  }
  return 'bucket-needs-audit';
}

function chapterStatus(question) {
  const flags = Array.isArray(question.qualityFlags) ? question.qualityFlags : [];
  const tags = Array.isArray(question.tags) ? question.tags : [];
  return flags.includes('chapter-pending')
    || tags.includes('章节待复核')
    || String(question.knowledge || '').includes('章节待复核')
    ? 'chapter-pending'
    : 'chapter-classified';
}

function ocrGarbleReasons(question) {
  const flags = Array.isArray(question.qualityFlags) ? question.qualityFlags.join(' ') : '';
  const reviewReason = Array.isArray(question.ocrReviewReason) ? question.ocrReviewReason.join(' ') : '';
  const text = [
    question.question,
    question.title,
    question.answer,
    question.explanation,
    flags,
    reviewReason
  ].filter(Boolean).join('\n');
  const reasons = [];
  if (/round356-default-practice-blocked|low-ocr-score/i.test(text) || Number(question.ocrQualityScore) < 70) reasons.push('low-ocr-score');
  if (/EMBED\s+Equation(?:\.[A-Za-z0-9]+)?|DSMT4|embedded-equation-placeholder/i.test(text)) reasons.push('embedded-equation-placeholder');
  if (/high-resolution\s+ja\s+JP|501\s+501\s+\d{4,}|CIDFont|FontName|FontBBox|FontMatrix|font-table-noise/i.test(text)) reasons.push('font-table-noise');
  if (/latin-symbol-noise/i.test(text)) reasons.push('latin-symbol-noise');
  if (/[�□■]/.test(text) || /\?{2,}/.test(text) || /broken-symbols/i.test(text)) reasons.push('broken-symbols');
  return [...new Set(reasons)];
}

function sourceAudit(question) {
  const sourceHtmlUrl = String(question.sourceHtmlUrl || '');
  const sourceRelPath = relFromHref(sourceHtmlUrl);
  const sourceHash = hashFromHref(sourceHtmlUrl);
  const sourcePathAllowed = /^resources\/fluid-181103-html\/materials\/[^/]+\/index\.html$/.test(sourceRelPath);
  const exists = sourceRelPath ? fs.existsSync(fromRoot(sourceRelPath)) : false;
  const html = exists ? readText(sourceRelPath) : '';
  const anchorFound = exists && htmlHasId(html, sourceHash);
  return {
    sourceHtmlUrl,
    sourceRelPath,
    sourceHash,
    sourcePathAllowed,
    sourceHtmlExists: exists,
    sourceAnchorFound: anchorFound
  };
}

function reduceCount(rows, key) {
  return rows.reduce((out, row) => {
    const value = row[key] || 'unknown';
    out[value] = (out[value] || 0) + 1;
    return out;
  }, {});
}

function sampleRows(rows, predicate, limit = 8) {
  return rows
    .filter(predicate)
    .slice(0, limit)
    .map((row) => ({
      id: row.id,
      title: row.title,
      sourceMaterialId: row.sourceMaterialId,
      sourcePage: row.sourcePage,
      qualityTier: row.qualityTier,
      bucket: row.bucket,
      chapterStatus: row.chapterStatus,
      questionBankPath: row.discoveryPaths.questionBankEntry,
      sourceHtmlUrl: row.discoveryPaths.sourceHtml
    }));
}

function hasLocalOrSecretLeak(payload) {
  const text = JSON.stringify(payload);
  return /\/Volumes\/mac_2T|\/Users\/kili|file:\/\/|[A-Za-z]:\\|(?:api[_-]?key|authorization|bearer|password|private[_-]?key|secret|token)\b/i.test(text);
}

function gzipMatches(relPath) {
  if (!fs.existsSync(fromRoot(relPath)) || !fs.existsSync(fromRoot(`${relPath}.gz`))) return false;
  const plain = fs.readFileSync(fromRoot(relPath));
  const inflated = zlib.gunzipSync(fs.readFileSync(fromRoot(`${relPath}.gz`)));
  return Buffer.compare(plain, inflated) === 0;
}

function buildDoc(payload) {
  const s = payload.summary;
  const route = payload.replayRoutes;
  const command = 'node tools/check-round324-181103-question-discovery.mjs --write --json';
  return `# Round324 181103 题库可发现性审计

- 版本：${payload.version}
- 生成命令：\`${command}\`
- 题库总数：${s.totalQuestions}
- 资源入口可发现：${s.resourceEntryQuestionCount}/${s.totalQuestions}
- 题库入口可发现：${s.questionBankEntryQuestionCount}/${s.totalQuestions}
- 来源 HTML 锚点可发现：${s.sourceAnchorFoundQuestionCount}/${s.totalQuestions}
- 默认可练 / OCR 复核 / 隐藏复核 / 章节待复核：${s.defaultPracticeQuestions} / ${s.ocrReviewQuestions} / ${s.hiddenReviewQuestions} / ${s.chapterPendingQuestions}
- 默认练习 OCR/公式乱码：${s.defaultPracticeGarbleQuestionCount}；已挡出默认练习的 OCR/公式复核题：${s.round356DefaultPracticeBlockedCount}
- 缺失来源 HTML / 缺失锚点 / 桶异常：${s.missingSourceHtmlQuestionCount} / ${s.sourceAnchorNeedsAuditQuestionCount} / ${s.bucketNeedsAuditQuestions}

## 三层入口

1. 资源入口：\`${route.resourceEntry.url}\`，对应 \`${route.resourceEntry.file}\` 中的 Round323 finder 与 181103 返回路径。
2. 题库入口：\`${route.questionBankEntry.url}\`，对应 \`${route.questionBankEntry.file}\` 和 \`question-banks/index.json\` 的 \`181103-material-extracted\` 条目。
3. 来源 HTML：每题使用 \`sourceHtmlUrl\` 回到 \`/resources/fluid-181103-html/materials/*/index.html#page-*\`；本轮 ${s.sourceAnchorFoundQuestionCount} 个锚点全部存在。

## 可复盘路径

- default：从 \`${route.defaultPractice.entryUrl}\` 进入，点击默认练习；默认集合 ${s.defaultPracticeQuestions} 题，且高风险 OCR/公式乱码 ${s.defaultPracticeGarbleQuestionCount} 题。
- OCR：从同一题库入口进入“查看/练习全部 411 题（含 OCR 复核）”，再按题卡的“打开来源 HTML 页”回查；OCR 复核 ${s.ocrReviewQuestions} 题。
- hidden：隐藏复核题不进默认练习，但保留在全部 411 模式和来源 HTML 锚点中；隐藏复核 ${s.hiddenReviewQuestions} 题。
- chapter pending：章节待复核是叠加标记，仍有题库入口和来源 HTML；章节待复核 ${s.chapterPendingQuestions} 题。

## 边界

- 本账本只证明 411 个 181103 资料内题可从资源入口、题库入口、来源 HTML 发现。
- 它不把资料题冒充历年真题原卷，也不提供 PDF/PPT/DOC/ZIP 原件下载证明。
- Round324 未修改 \`resources.html\`；现有 Round323 resource finder 已满足发现性审计。

## 产物

- \`${outputRelPath}\`
- \`${outputRelPath}.gz\`
- \`${docRelPath}\`
`;
}

function buildLedger(args) {
  if (process.cwd().startsWith('/Volumes/mac_2T') || repoRoot.startsWith('/Volumes/mac_2T')) {
    throw new Error('Refusing to run from or against /Volumes/mac_2T during lifs panic isolation.');
  }

  const questions = readJson('question-banks/181103-material-extracted.json');
  const index = readJson('question-banks/index.json');
  const round321 = readJson('data/fluid-round321-181103-extracted-material-bank.json');
  const round323QuestionLedger = readJson('data/fluid-round323-181103-question-ledger.json');
  const resourcesHtml = readText('resources.html');
  const questionBankHtml = readText('modules/question-bank.html');
  const questionBankDataJs = readText('modules/question-bank-data.js');
  const questionBankPracticeJs = readText('modules/question-bank-practice.js');
  const questionBankHomeHtml = readText('question-bank-home.html');
  const sourceIndexHtml = readText('resources/fluid-181103-html/index.html');

  const bankEntry = (index.questionBanks || []).find((item) => item.id === '181103-material-extracted') || {};
  const questionBankUrl = '/modules/question-bank.html?focus=181103-material-extracted#questionBanksList';
  const resourceUrl = '/resources.html#round323ResourceFinder';
  const sourceIndexUrl = '/resources/fluid-181103-html/index.html';

  const resourceEntryAudit = {
    file: 'resources.html',
    url: resourceUrl,
    round323FinderLinkCount: countMatches(resourcesHtml, /data-round323-entry=["']181103-411-bank["'][\s\S]{0,360}href=["']\/modules\/question-bank\.html\?focus=181103-material-extracted#questionBanksList["']/g),
    totalQuestionTextCount: countMatches(resourcesHtml, /411\s*(?:个)?资料内题|411\s*资料内题库/g),
    htmlIndexLinkCount: countMatches(resourcesHtml, /\/resources\/fluid-181103-html\/index\.html/g),
    questionBankLinkCount: countMatches(resourcesHtml, /\/modules\/question-bank\.html\?focus=181103-material-extracted#questionBanksList/g),
    hasNoDownloadBoundary: /不提供(?: PDF、PPT、DOC、ZIP )?原(?:件|始文件)下载|不提供原件下载/.test(resourcesHtml)
  };

  const questionBankEntryAudit = {
    indexFile: 'question-banks/index.json',
    pageFile: 'modules/question-bank.html',
    dataFile: 'modules/question-bank-data.js',
    practiceFile: 'modules/question-bank-practice.js',
    url: questionBankUrl,
    bankEntryFound: bankEntry.id === '181103-material-extracted',
    indexQuestionCount: Number(bankEntry.questionCount || 0),
    indexDefaultPracticeQuestionCount: Number(bankEntry.defaultPracticeQuestionCount || 0),
    indexOcrReviewQuestionCount: Number(bankEntry.qualityOcrReviewCount || 0),
    indexHiddenReviewQuestionCount: Number(bankEntry.qualityHideCount || 0),
    staticEntryLinkCount: countMatches(questionBankHtml, /\/modules\/question-bank\.html\?focus=181103-material-extracted#questionBanksList/g),
    homeEntryLinkCount: countMatches(questionBankHomeHtml, /modules\/question-bank\.html\?focus=181103-material-extracted#questionBanksList/g),
    qualityLedgerUiFound: /data-181103-quality-ledger/.test(questionBankDataJs),
    defaultPracticeFilterFound: /getDefaultPracticeQuestions/.test(questionBankDataJs),
    defaultPracticeOcrGateFound: /hasMaterialOcrGarble/.test(questionBankDataJs)
      && /公式\/OCR 噪声题不进入默认练习/.test(questionBankPracticeJs),
    allMaterialPracticeFound: /startAllMaterialPractice/.test(questionBankDataJs) && /查看\/练习全部/.test(questionBankDataJs),
    sourceHtmlButtonFound: /打开来源 HTML 页/.test(questionBankPracticeJs) && /sourceHtmlUrl/.test(questionBankPracticeJs)
  };

  const sourceHtmlIndexAudit = {
    file: 'resources/fluid-181103-html/index.html',
    url: sourceIndexUrl,
    materialCardCount: countMatches(sourceIndexHtml, /<article\b[^>]*data-round315-material-card/g),
    noDownloadNoticeFound: /不提供 PDF、PPT、DOC、ZIP 原件下载链接/.test(sourceIndexHtml),
    materialLinkCount: countMatches(sourceIndexHtml, /\/resources\/fluid-181103-html\/materials\/[^/]+\/index\.html/g)
  };

  const rows = questions.map((question) => {
    const source = sourceAudit(question);
    const bucket = classifyBucket(question);
    const chapter = chapterStatus(question);
    const garbleReasons = ocrGarbleReasons(question);
    return {
      id: question.id,
      title: question.title,
      sourceMaterialId: question.sourceMaterialId,
      sourceMaterialTitle: question.sourceMaterialTitle,
      sourcePage: question.sourcePage,
      qualityTier: question.qualityTier,
      ocrQualityScore: question.ocrQualityScore,
      defaultVisible: question.defaultVisible === true,
      defaultHidden: question.defaultHidden === true,
      reviewStatus: question.reviewStatus || '',
      bucket,
      chapterStatus: chapter,
      ocrGarbleReasons: garbleReasons,
      knowledge: question.knowledge || '',
      qualityFlags: Array.isArray(question.qualityFlags) ? question.qualityFlags : [],
      discoveryPaths: {
        resourceEntry: resourceUrl,
        questionBankEntry: questionBankUrl,
        sourceHtml: question.sourceHtmlUrl,
        sourceHtmlIndex: sourceIndexUrl
      },
      ...source
    };
  });

  const bucketCounts = reduceCount(rows, 'bucket');
  const summary = {
    totalQuestions: rows.length,
    defaultPracticeQuestions: bucketCounts['default-practice'] || 0,
    ocrReviewQuestions: bucketCounts['ocr-review'] || 0,
    hiddenReviewQuestions: bucketCounts['hidden-review'] || 0,
    chapterPendingQuestions: rows.filter((row) => row.chapterStatus === 'chapter-pending').length,
    bucketNeedsAuditQuestions: bucketCounts['bucket-needs-audit'] || 0,
    resourceEntryQuestionCount: rows.filter(() => resourceEntryAudit.questionBankLinkCount > 0 && resourceEntryAudit.totalQuestionTextCount > 0).length,
    questionBankEntryQuestionCount: rows.filter(() => questionBankEntryAudit.bankEntryFound && questionBankEntryAudit.staticEntryLinkCount > 0).length,
    sourceHtmlQuestionCount: rows.filter((row) => row.sourceHtmlExists).length,
    sourceAnchorFoundQuestionCount: rows.filter((row) => row.sourceAnchorFound).length,
    missingSourceHtmlQuestionCount: rows.filter((row) => !row.sourceHtmlExists).length,
    sourceAnchorNeedsAuditQuestionCount: rows.filter((row) => row.sourceHtmlExists && !row.sourceAnchorFound).length,
    defaultPracticeGarbleQuestionCount: rows.filter((row) => row.bucket === 'default-practice' && row.ocrGarbleReasons.length > 0).length,
    ocrFormulaReviewQuestionCount: rows.filter((row) => row.bucket === 'ocr-review' && row.ocrGarbleReasons.length > 0).length,
    round356DefaultPracticeBlockedCount: rows.filter((row) => row.qualityFlags.includes('round356-default-practice-blocked')).length,
    distinctSourceMaterialCount: new Set(rows.map((row) => row.sourceMaterialId).filter(Boolean)).size,
    distinctSourceHtmlPageCount: new Set(rows.map((row) => row.sourceRelPath).filter(Boolean)).size
  };

  const replayRoutes = {
    resourceEntry: {
      file: 'resources.html',
      url: resourceUrl,
      expectedVisibleText: '411 资料内题库'
    },
    questionBankEntry: {
      file: 'modules/question-bank.html',
      indexFile: 'question-banks/index.json',
      url: questionBankUrl,
      expectedBankId: '181103-material-extracted'
    },
    sourceHtml: {
      indexUrl: sourceIndexUrl,
      perQuestionField: 'sourceHtmlUrl',
      expectedPattern: '/resources/fluid-181103-html/materials/*/index.html#page-*'
    },
    defaultPractice: {
      entryUrl: questionBankUrl,
      mode: 'defaultVisible === true',
      sample: sampleRows(rows, (row) => row.bucket === 'default-practice', 6)
    },
    ocrReview: {
      entryUrl: questionBankUrl,
      mode: 'qualityTier === ocr-review; use all-411 mode plus source HTML link',
      sample: sampleRows(rows, (row) => row.bucket === 'ocr-review', 6)
    },
    hiddenReview: {
      entryUrl: questionBankUrl,
      mode: 'qualityTier === hide; excluded from default practice but retained in all-411 ledger',
      sample: sampleRows(rows, (row) => row.bucket === 'hidden-review', 6)
    },
    chapterPending: {
      entryUrl: questionBankUrl,
      mode: 'qualityFlags includes chapter-pending or knowledge is 章节待复核',
      sample: sampleRows(rows, (row) => row.chapterStatus === 'chapter-pending', 6)
    }
  };

  const checks = [
    {
      id: 'expected-411-counts-match',
      pass: summary.totalQuestions === expected.totalQuestions
        && summary.defaultPracticeQuestions === expected.defaultPracticeQuestions
        && summary.ocrReviewQuestions === expected.ocrReviewQuestions
        && summary.hiddenReviewQuestions === expected.hiddenReviewQuestions
        && summary.chapterPendingQuestions === expected.chapterPendingQuestions
        && summary.bucketNeedsAuditQuestions === 0
    },
    {
      id: 'resource-entry-discovers-all-411',
      pass: resourceEntryAudit.round323FinderLinkCount >= 1
        && resourceEntryAudit.questionBankLinkCount >= 2
        && resourceEntryAudit.totalQuestionTextCount >= 2
        && resourceEntryAudit.htmlIndexLinkCount >= 1
        && resourceEntryAudit.hasNoDownloadBoundary
        && summary.resourceEntryQuestionCount === expected.totalQuestions
    },
    {
      id: 'question-bank-entry-discovers-all-411',
      pass: questionBankEntryAudit.bankEntryFound
        && questionBankEntryAudit.indexQuestionCount === expected.totalQuestions
        && questionBankEntryAudit.indexDefaultPracticeQuestionCount === expected.defaultPracticeQuestions
        && questionBankEntryAudit.indexOcrReviewQuestionCount === expected.ocrReviewQuestions
        && questionBankEntryAudit.indexHiddenReviewQuestionCount === expected.hiddenReviewQuestions
        && questionBankEntryAudit.staticEntryLinkCount >= 1
        && questionBankEntryAudit.qualityLedgerUiFound
        && questionBankEntryAudit.defaultPracticeFilterFound
        && questionBankEntryAudit.defaultPracticeOcrGateFound
        && questionBankEntryAudit.allMaterialPracticeFound
        && questionBankEntryAudit.sourceHtmlButtonFound
        && summary.questionBankEntryQuestionCount === expected.totalQuestions
    },
    {
      id: 'source-html-anchors-discover-all-411',
      pass: summary.sourceHtmlQuestionCount === expected.sourceHtmlAnchors
        && summary.sourceAnchorFoundQuestionCount === expected.sourceHtmlAnchors
        && summary.missingSourceHtmlQuestionCount === 0
        && summary.sourceAnchorNeedsAuditQuestionCount === 0
        && rows.every((row) => row.sourcePathAllowed)
        && sourceHtmlIndexAudit.materialCardCount === 38
        && sourceHtmlIndexAudit.noDownloadNoticeFound
    },
    {
      id: 'round321-round323-ledgers-stay-in-sync',
      pass: round321.summary?.extractedQuestionCount === expected.totalQuestions
        && round321.summary?.qualityShowCount === expected.defaultPracticeQuestions
        && round321.summary?.qualityOcrReviewCount === expected.ocrReviewQuestions
        && round321.summary?.qualityHideCount === expected.hiddenReviewQuestions
        && round321.summary?.chapterPendingQuestionCount === expected.chapterPendingQuestions
        && round323QuestionLedger.summary?.sourceAnchorFoundQuestionCount === expected.sourceHtmlAnchors
    },
    {
      id: 'default-practice-excludes-ocr-formula-garble',
      pass: summary.defaultPracticeGarbleQuestionCount === expected.defaultPracticeGarbleQuestions
        && summary.ocrFormulaReviewQuestionCount >= expected.ocrFormulaReviewQuestionsMin
        && summary.round356DefaultPracticeBlockedCount >= expected.ocrFormulaReviewQuestionsMin
    },
    {
      id: 'default-ocr-hidden-chapter-routes-are-replayable',
      pass: replayRoutes.defaultPractice.sample.length > 0
        && replayRoutes.ocrReview.sample.length > 0
        && replayRoutes.hiddenReview.sample.length > 0
        && replayRoutes.chapterPending.sample.length > 0
        && rows.every((row) =>
          row.discoveryPaths.resourceEntry
          && row.discoveryPaths.questionBankEntry
          && row.discoveryPaths.sourceHtml
        )
    }
  ];

  const payload = {
    ok: checks.every((check) => check.pass),
    version,
    generatedAt: process.env.FLUID_ROUND324_181103_QUESTION_DISCOVERY_GENERATED_AT || readExistingGeneratedAt() || '2026-06-15T01:35:00+08:00',
    expected,
    summary,
    checks,
    failures: checks.filter((check) => !check.pass).map((check) => check.id),
    sourceFiles: {
      extractedQuestionBank: 'question-banks/181103-material-extracted.json',
      questionBankIndex: 'question-banks/index.json',
      resourcesHtml: 'resources.html',
      questionBankHtml: 'modules/question-bank.html',
      questionBankData: 'modules/question-bank-data.js',
      questionBankPractice: 'modules/question-bank-practice.js',
      sourceHtmlIndex: 'resources/fluid-181103-html/index.html',
      round321Ledger: 'data/fluid-round321-181103-extracted-material-bank.json',
      round323QuestionLedger: 'data/fluid-round323-181103-question-ledger.json'
    },
    audits: {
      resourceEntry: resourceEntryAudit,
      questionBankEntry: questionBankEntryAudit,
      sourceHtmlIndex: sourceHtmlIndexAudit
    },
    replayRoutes,
    questions: rows
  };

  const leakPayload = {
    summary: payload.summary,
    audits: payload.audits,
    replayRoutes: payload.replayRoutes,
    questions: payload.questions
  };
  const leakFree = !hasLocalOrSecretLeak(leakPayload);
  payload.checks.push({
    id: 'ledger-has-no-local-path-or-secret-leaks',
    pass: leakFree
  });
  payload.ok = payload.checks.every((check) => check.pass);
  payload.failures = payload.checks.filter((check) => !check.pass).map((check) => check.id);

  if (args.write && !args.checkOnly) {
    writeJsonAndGzip(outputRelPath, payload);
    writeText(docRelPath, buildDoc(payload));
    payload.artifacts = {
      json: outputRelPath,
      gzip: `${outputRelPath}.gz`,
      doc: docRelPath,
      gzipMatchesJson: gzipMatches(outputRelPath)
    };
  } else {
    payload.artifacts = {
      json: outputRelPath,
      gzip: `${outputRelPath}.gz`,
      doc: docRelPath,
      gzipMatchesJson: gzipMatches(outputRelPath)
    };
  }

  if (args.write && !args.checkOnly) {
    const gzipCheck = {
      id: 'written-gzip-matches-json',
      pass: payload.artifacts.gzipMatchesJson
    };
    payload.checks.push(gzipCheck);
    payload.ok = payload.checks.every((check) => check.pass);
    payload.failures = payload.checks.filter((check) => !check.pass).map((check) => check.id);
    writeJsonAndGzip(outputRelPath, payload);
    writeText(docRelPath, buildDoc(payload));
  }

  return payload;
}

const args = parseArgs(process.argv.slice(2));
const payload = buildLedger(args);

if (args.json) {
  console.log(JSON.stringify({
    ok: payload.ok,
    version: payload.version,
    summary: payload.summary,
    failures: payload.failures,
    artifacts: payload.artifacts
  }, null, 2));
} else {
  console.log(`${payload.ok ? 'PASS' : 'FAIL'} ${version}: resource ${payload.summary.resourceEntryQuestionCount}/411, bank ${payload.summary.questionBankEntryQuestionCount}/411, source anchors ${payload.summary.sourceAnchorFoundQuestionCount}/411, default/OCR/hidden/chapter ${payload.summary.defaultPracticeQuestions}/${payload.summary.ocrReviewQuestions}/${payload.summary.hiddenReviewQuestions}/${payload.summary.chapterPendingQuestions}`);
}

if (!payload.ok) process.exitCode = 1;
