const fs = require('fs');

// 读取数据文件
const dataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate.json';
const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('验证合并后的题目内容...\n');

// 检查2006年的题目
const year2006Questions = questions.filter(q => q.year === 2006);
console.log(`2006年题目数: ${year2006Questions.length}`);

// 检查是否有包含子问题的题目
const questionsWithSubs = year2006Questions.filter(q => q.subQuestions && q.subQuestions.length > 0);
console.log(`包含子问题的题目数: ${questionsWithSubs.length}`);

questionsWithSubs.forEach((q, index) => {
    console.log(`\n题目 ${index + 1}: ${q.id}`);
    console.log(`主题目: ${q.title.substring(0, 100)}...`);
    console.log(`子问题数: ${q.subQuestions.length}`);
    q.subQuestions.forEach((sub, subIndex) => {
        console.log(`  子问题 ${subIndex + 1}: ${sub.substring(0, 80)}...`);
    });
});

// 检查所有题目的内容长度
const contentLengths = questions.map(q => ({
    id: q.id,
    year: q.year,
    titleLength: q.title.length,
    hasSubQuestions: q.subQuestions && q.subQuestions.length > 0,
    subQuestionsCount: q.subQuestions ? q.subQuestions.length : 0
}));

// 找出内容最长的题目
const longestQuestions = contentLengths
    .sort((a, b) => b.titleLength - a.titleLength)
    .slice(0, 10);

console.log(`\n内容最长的10个题目:`);
longestQuestions.forEach((q, index) => {
    console.log(`${index + 1}. ${q.id} (${q.year}年): ${q.titleLength}字符`);
    if (q.hasSubQuestions) {
        console.log(`   包含 ${q.subQuestionsCount} 个子问题`);
    }
});

// 检查是否有题目内容过短
const shortQuestions = contentLengths.filter(q => q.titleLength < 20);
console.log(`\n内容过短的题目数: ${shortQuestions.length}`);
if (shortQuestions.length > 0) {
    console.log('内容过短的题目:');
    shortQuestions.forEach(q => {
        console.log(`  ${q.id} (${q.year}年): ${q.titleLength}字符`);
    });
}

// 统计总体情况
const totalQuestions = questions.length;
const questionsWithSubsTotal = questions.filter(q => q.subQuestions && q.subQuestions.length > 0).length;
const totalSubQuestions = questions.reduce((sum, q) => sum + (q.subQuestions ? q.subQuestions.length : 0), 0);

console.log(`\n总体统计:`);
console.log(`总题目数: ${totalQuestions}`);
console.log(`包含子问题的题目数: ${questionsWithSubsTotal}`);
console.log(`总子问题数: ${totalSubQuestions}`);
console.log(`平均每题目内容长度: ${Math.round(questions.reduce((sum, q) => sum + q.title.length, 0) / totalQuestions)}字符`);

console.log('\n验证完成！'); 