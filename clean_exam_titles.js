const fs = require('fs');

// 读取数据文件
const dataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate.json';
const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('清理考试标题...\n');

// 定义需要删除的考试标题模式
const examTitlePatterns = [
    /中国海洋大学\d{4}年硕士研究生招生考试试题/,
    /中国海洋大学\d{4}年硕士研究生招生考试试息/,
    /中国海洋大学\d{4}年硕士研究生招生考试/,
    /中国海洋大学\d{4}年.*考试试题/,
    /中国海洋大学\d{4}年.*招生考试/,
    /中国海洋大学\d{4}年硕士研究生招生者试试题/,
    /科目代码.*科目名称/,
    /科目代码.*流体力学/,
    /科目名称.*流体力学/,
    /招生考试试题/,
    /招生考试试息/,
    /招生者试试题/,
    /考试试题/,
    /招生考试/,
    /注：本试题中/
];

// 找出需要删除的考试标题
const examTitles = questions.filter(q => {
    const title = q.title || '';
    return examTitlePatterns.some(pattern => pattern.test(title));
});

console.log(`发现 ${examTitles.length} 个考试标题：\n`);

examTitles.forEach((q, index) => {
    console.log(`${index + 1}. ID: ${q.id}`);
    console.log(`   年份: ${q.year}`);
    console.log(`   标题: ${q.title}`);
    console.log('   ---');
});

// 清理考试标题
const cleanedQuestions = questions.filter(q => {
    const title = q.title || '';
    return !examTitlePatterns.some(pattern => pattern.test(title));
});

console.log(`\n清理结果:`);
console.log(`清理前题目数: ${questions.length}`);
console.log(`清理后题目数: ${cleanedQuestions.length}`);
console.log(`删除了 ${questions.length - cleanedQuestions.length} 个考试标题`);

// 保存清理后的数据
const outputFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate_cleaned_titles.json';
fs.writeFileSync(outputFile, JSON.stringify(cleanedQuestions, null, 2), 'utf8');
console.log(`\n清理后的数据已保存到: ${outputFile}`);

// 统计清理后的年份分布
const yearStats = {};
cleanedQuestions.forEach(q => {
    yearStats[q.year] = (yearStats[q.year] || 0) + 1;
});

console.log('\n清理后的年份分布:');
Object.keys(yearStats).sort().forEach(year => {
    console.log(`  ${year}年: ${yearStats[year]}题`);
});

// 检查是否还有其他类似的标题
const remainingExamTitles = cleanedQuestions.filter(q => {
    const title = q.title || '';
    return title.includes('考试') || title.includes('招生') || title.includes('试题') || title.includes('注：');
});

if (remainingExamTitles.length > 0) {
    console.log(`\n还有 ${remainingExamTitles.length} 个可能相关的标题：`);
    remainingExamTitles.forEach((q, index) => {
        console.log(`${index + 1}. ${q.id}: ${q.title.substring(0, 60)}...`);
    });
}

console.log('\n清理完成！'); 