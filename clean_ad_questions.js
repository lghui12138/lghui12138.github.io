const fs = require('fs');

// 读取数据文件
const dataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate.json';
const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('清理广告信息题目...\n');

// 定义需要删除的广告信息模式
const adPatterns = [
    /微信扫码/,
    /微信公众号/,
    /淘宝店铺/,
    /QQ:/,
    /小海QQ/,
    /小海考研人/,
    /科目代码/,
    /科目名称/,
    /招生考试试息/,
    /向题苦疑/
];

// 找出需要删除的广告题目
const adQuestions = questions.filter(q => {
    const title = q.title || '';
    return adPatterns.some(pattern => pattern.test(title));
});

console.log(`发现 ${adQuestions.length} 个广告信息题目：\n`);

adQuestions.forEach((q, index) => {
    console.log(`${index + 1}. ID: ${q.id}`);
    console.log(`   年份: ${q.year}`);
    console.log(`   标题: ${q.title}`);
    console.log('   ---');
});

// 清理广告题目
const cleanedQuestions = questions.filter(q => {
    const title = q.title || '';
    return !adPatterns.some(pattern => pattern.test(title));
});

console.log(`\n清理前题目总数: ${questions.length}`);
console.log(`清理后题目总数: ${cleanedQuestions.length}`);
console.log(`删除了 ${questions.length - cleanedQuestions.length} 个广告题目`);

// 保存清理后的数据
const outputFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate_cleaned.json';
fs.writeFileSync(outputFile, JSON.stringify(cleanedQuestions, null, 2), 'utf8');
console.log(`清理后的数据已保存到: ${outputFile}`);

// 统计清理后的年份分布
const yearStats = {};
cleanedQuestions.forEach(q => {
    yearStats[q.year] = (yearStats[q.year] || 0) + 1;
});

console.log('\n清理后的年份分布:');
Object.keys(yearStats).sort().forEach(year => {
    console.log(`  ${year}年: ${yearStats[year]}题`);
});

console.log('\n清理完成！'); 