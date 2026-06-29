export const round575 = {
  round: 575,
  date: '2026-06-29',
  version: 'round575-workbench-entrance-polish-20260629',
  previousVersion: 'round574-public-shell-freshness-flow-20260629',
  contentFrontierVersion: 'round574-public-shell-freshness-flow-20260629',
  answerContentFrontierVersion: 'round572-answer-depth-tenth-pass-proof-ui-refresh-20260629',
  materialHtmlPages181103: 38,
  sourceHtmlCards181103: 522,
  referencePracticeRows181103: 400,
  sourceClueOnlyRows181103: 122,
  proofDepthRows181103: 422,
  proofDepthRewriteRows181103: 6,
  realExamAnswerDepthRows: 145,
  realExamOriginalAtomicRows: 325,
  realExamSourceSections: 68,
  groupedRealExamRows: 217,
  strictAnswerPdfProofRows: 0,
  scope: 'pre-question-bank workbench entrance density, stale current-count cleanup, and authenticated browser pageHealth boundary clarity'
};

export const round575VisualTargets = [
  {
    id: 'topline-density',
    label: '首屏状态栏',
    required: ['Round575', '400', '422', '145', 'strict PDF 0', '122']
  },
  {
    id: 'hero-workbench',
    label: '题库入口工作台',
    required: ['题库与专题入口工作台', round575.version, 'proof-depth']
  },
  {
    id: 'count-boundary',
    label: '答案与来源边界',
    required: ['400 默认练习', '122 条源文线索', 'strictAnswerPdfProof']
  }
];
