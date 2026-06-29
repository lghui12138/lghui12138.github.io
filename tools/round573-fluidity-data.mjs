export const round573 = {
  round: 573,
  date: '2026-06-29',
  version: 'round573-fluidity-polish-navigation-20260629',
  previousVersion: 'round572-answer-depth-tenth-pass-proof-ui-refresh-20260629',
  realExamAnswerDepthRows: 145,
  realExamRoundUpgradeRows: 0,
  realExamNewUniqueRows: 0,
  proofDepthRows181103: 422,
  proofDepthRewriteRows181103: 0,
  round572ProofDepthRewriteRows181103: 6,
  referencePracticeRows181103: 400,
  sourceClueOnlyRows181103: 122,
  strictAnswerPdfProofRows: 0,
  materialHtmlPages181103: 38,
  sourceHtmlCards181103: 522,
  realExamOriginalAtomicRows: 325,
  realExamSourceSections: 68,
  groupedRealExamRows: 217,
  scope: 'non-deleting UI fluidity polish, route clarity, stale label cleanup, and release-gate refresh'
};

export const round573FlowRail = [
  {
    id: '181103-practice',
    label: '181103',
    value: '400 可参考',
    meta: '122 线索分层展示',
    href: './modules/question-bank.html?focus=181103-material-extracted&answer_status=current#questionBanksList',
    level: 100
  },
  {
    id: 'proof-depth',
    label: '证明',
    value: '422 深修',
    meta: 'Round572 重证 6 道',
    href: './data/fluid-round572-181103-proof-depth-rewrite.json',
    level: 94
  },
  {
    id: 'real-exam',
    label: '真题',
    value: '145 深补',
    meta: '325 原文小题',
    href: './modules/real-exams-dynamic.html#sourceGranularityNote',
    level: 72
  },
  {
    id: 'materials',
    label: '资料',
    value: '38 HTML',
    meta: '522 来源卡核对',
    href: './resources/fluid-181103-html/index.html',
    level: 100
  }
];
