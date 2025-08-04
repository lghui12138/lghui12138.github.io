const fs = require('fs');

// 读取数据文件
const dataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate.json';
const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('检查数据质量...\n');

// 检查空标题
const emptyTitles = questions.filter(q => !q.title || q.title.trim() === '');
console.log(`空标题题目数: ${emptyTitles.length}`);

// 检查标题过短的题目
const shortTitles = questions.filter(q => q.title && q.title.length < 10);
console.log(`标题过短题目数: ${shortTitles.length}`);

// 检查没有标签的题目
const noTags = questions.filter(q => !q.tags || q.tags.length === 0);
console.log(`没有标签题目数: ${noTags.length}`);

// 检查没有题型的题目
const noType = questions.filter(q => !q.type || q.type.trim() === '');
console.log(`没有题型题目数: ${noType.length}`);

// 检查年份分布
const yearStats = {};
questions.forEach(q => {
    yearStats[q.year] = (yearStats[q.year] || 0) + 1;
});

console.log('\n年份分布:');
Object.keys(yearStats).sort().forEach(year => {
    console.log(`  ${year}年: ${yearStats[year]}题`);
});

// 检查题型分布
const typeStats = {};
questions.forEach(q => {
    if (q.type) {
        typeStats[q.type] = (typeStats[q.type] || 0) + 1;
    }
});

console.log('\n题型分布:');
Object.keys(typeStats).sort().forEach(type => {
    console.log(`  ${type}: ${typeStats[type]}题`);
});

// 检查标签分布
const tagStats = {};
questions.forEach(q => {
    if (q.tags) {
        q.tags.forEach(tag => {
            tagStats[tag] = (tagStats[tag] || 0) + 1;
        });
    }
});

console.log('\n标签分布 (前10个):');
Object.entries(tagStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .forEach(([tag, count]) => {
        console.log(`  ${tag}: ${count}题`);
    });

// 检查数据完整性
console.log('\n数据完整性检查:');
console.log(`总题目数: ${questions.length}`);
console.log(`有标题的题目: ${questions.filter(q => q.title && q.title.trim() !== '').length}`);
console.log(`有题型的题目: ${questions.filter(q => q.type && q.type.trim() !== '').length}`);
console.log(`有标签的题目: ${questions.filter(q => q.tags && q.tags.length > 0).length}`);
console.log(`有年份的题目: ${questions.filter(q => q.year).length}`);

// 检查是否有重复题目
const titles = questions.map(q => q.title).filter(t => t);
const uniqueTitles = new Set(titles);
console.log(`\n重复题目检查:`);
console.log(`总标题数: ${titles.length}`);
console.log(`唯一标题数: ${uniqueTitles.size}`);
console.log(`重复标题数: ${titles.length - uniqueTitles.size}`);

console.log('\n数据质量检查完成！'); 