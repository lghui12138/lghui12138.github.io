const fs = require('fs');

// 读取原始数据文件
const originalDataFile = './question-banks/真题_中国海洋大学_2000-2021.json';
const originalData = JSON.parse(fs.readFileSync(originalDataFile, 'utf8'));

// 读取当前数据文件
const currentDataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate_fixed.json';
const currentData = JSON.parse(fs.readFileSync(currentDataFile, 'utf8'));

console.log('恢复缺失的2000年和2002年题目...\n');

// 统计原始数据中的年份分布
const originalYearStats = {};
originalData.forEach(q => {
    originalYearStats[q.year] = (originalYearStats[q.year] || 0) + 1;
});

console.log('原始数据年份分布:');
Object.keys(originalYearStats).sort().forEach(year => {
    console.log(`  ${year}年: ${originalYearStats[year]}题`);
});

// 统计当前数据中的年份分布
const currentYearStats = {};
currentData.forEach(q => {
    currentYearStats[q.year] = (currentYearStats[q.year] || 0) + 1;
});

console.log('\n当前数据年份分布:');
Object.keys(currentYearStats).sort().forEach(year => {
    console.log(`  ${year}年: ${currentYearStats[year]}题`);
});

// 找出缺失的题目
const missingQuestions = [];

// 检查2002年的题目
const original2002Questions = originalData.filter(q => q.year === 2002);
const current2002Questions = currentData.filter(q => q.year === 2002);

console.log(`\n原始数据中2002年题目数: ${original2002Questions.length}`);
console.log(`当前数据中2002年题目数: ${current2002Questions.length}`);

// 找出缺失的2002年题目
original2002Questions.forEach(originalQ => {
    const exists = current2002Questions.some(currentQ => 
        currentQ.title === originalQ.title || 
        currentQ.id === originalQ.id
    );
    
    if (!exists) {
        missingQuestions.push(originalQ);
        console.log(`缺失的2002年题目: ${originalQ.id} - ${originalQ.title.substring(0, 50)}...`);
    }
});

// 检查2000年的题目
const original2000Questions = originalData.filter(q => q.year === 2000);
const current2000Questions = currentData.filter(q => q.year === 2000);

console.log(`\n原始数据中2000年题目数: ${original2000Questions.length}`);
console.log(`当前数据中2000年题目数: ${current2000Questions.length}`);

if (original2000Questions.length > 0) {
    original2000Questions.forEach(originalQ => {
        const exists = current2000Questions.some(currentQ => 
            currentQ.title === originalQ.title || 
            currentQ.id === originalQ.id
        );
        
        if (!exists) {
            missingQuestions.push(originalQ);
            console.log(`缺失的2000年题目: ${originalQ.id} - ${originalQ.title.substring(0, 50)}...`);
        }
    });
}

console.log(`\n总共发现 ${missingQuestions.length} 个缺失的题目`);

// 恢复缺失的题目
if (missingQuestions.length > 0) {
    const restoredData = [...currentData, ...missingQuestions];
    
    // 重新排序
    restoredData.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.id.localeCompare(b.id);
    });
    
    // 保存恢复后的数据
    const outputFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate_restored.json';
    fs.writeFileSync(outputFile, JSON.stringify(restoredData, null, 2), 'utf8');
    console.log(`恢复后的数据已保存到: ${outputFile}`);
    
    // 统计恢复后的年份分布
    const restoredYearStats = {};
    restoredData.forEach(q => {
        restoredYearStats[q.year] = (restoredYearStats[q.year] || 0) + 1;
    });
    
    console.log('\n恢复后的年份分布:');
    Object.keys(restoredYearStats).sort().forEach(year => {
        console.log(`  ${year}年: ${restoredYearStats[year]}题`);
    });
} else {
    console.log('没有发现缺失的题目');
}

console.log('\n恢复完成！'); 