const fs = require('fs');

// 读取修复后的原始数据
const fixedOriginalFile = './question-banks/真题_中国海洋大学_2000-2024_fixed_from_original.json';
const fixedOriginalData = JSON.parse(fs.readFileSync(fixedOriginalFile, 'utf8'));

// 读取最新的数据文件
const latestDataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate.json';
const latestData = JSON.parse(fs.readFileSync(latestDataFile, 'utf8'));

console.log('应用2024年修复到最新数据文件...\n');

// 找到需要修复的题目ID
const fixedQuestionIds = fixedOriginalData
    .filter(q => q.year === 2024 && q.id.startsWith('ocean-2024-'))
    .map(q => q.id.replace('ocean-2024-', 'ocean-2023-'));

console.log(`需要修复的题目ID: ${fixedQuestionIds.join(', ')}`);

// 在最新数据中应用修复
const updatedData = [...latestData];
let fixedCount = 0;

fixedQuestionIds.forEach(oldId => {
    const questionIndex = updatedData.findIndex(q => q.id === oldId);
    if (questionIndex !== -1) {
        const question = updatedData[questionIndex];
        const oldYear = question.year;
        question.year = 2024;
        question.id = question.id.replace(`-${oldYear}-`, '-2024-');
        fixedCount++;
        console.log(`修复题目: ${oldId} -> ${question.id}, 年份: ${oldYear} -> 2024`);
    }
});

// 同时修复后续的2023年题目
const examTitleIndex = updatedData.findIndex(q => 
    q.title && q.title.includes('2024年')
);

if (examTitleIndex !== -1) {
    console.log(`\n找到考试标题题目位置: ${examTitleIndex}`);
    
    for (let i = examTitleIndex + 1; i < updatedData.length; i++) {
        const question = updatedData[i];
        
        // 跳过广告信息题目和通用题目
        if (question.title && (
            question.title.includes('微信公众号') || 
            question.title.includes('淘宝店铺') ||
            question.title.includes('QQ:')
        ) || question.id.startsWith('generic-')) {
            continue;
        }
        
        // 如果题目是2023年，改为2024年
        if (question.year === 2023) {
            question.year = 2024;
            question.id = question.id.replace('-2023-', '-2024-');
            fixedCount++;
            console.log(`修复后续题目: ${question.id}, 年份: 2023 -> 2024`);
        }
    }
}

console.log(`\n总共修复了 ${fixedCount} 个题目的年份标注`);

// 保存修复后的数据
const outputFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate_fixed.json';
fs.writeFileSync(outputFile, JSON.stringify(updatedData, null, 2), 'utf8');
console.log(`修复后的数据已保存到: ${outputFile}`);

// 统计修复后的年份分布
const yearStats = {};
updatedData.forEach(q => {
    yearStats[q.year] = (yearStats[q.year] || 0) + 1;
});

console.log('\n修复后的年份分布:');
Object.keys(yearStats).sort().forEach(year => {
    console.log(`  ${year}年: ${yearStats[year]}题`);
});

console.log('\n修复完成！'); 