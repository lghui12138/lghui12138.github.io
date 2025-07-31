// 检查真题数据中的年份分布
const fs = require('fs');

try {
    const data = fs.readFileSync('question-banks/真题_中国海洋大学_2000-2021_cleaned.json', 'utf8');
    const questions = JSON.parse(data);
    
    // 统计年份分布
    const yearCount = {};
    questions.forEach(q => {
        const year = q.year;
        yearCount[year] = (yearCount[year] || 0) + 1;
    });
    
    // 按年份排序
    const sortedYears = Object.keys(yearCount).sort((a, b) => parseInt(a) - parseInt(b));
    
    console.log('📊 真题年份分布统计:');
    console.log('总题目数:', questions.length);
    console.log('年份范围:', sortedYears[0] + '-' + sortedYears[sortedYears.length - 1]);
    console.log('年份数量:', sortedYears.length);
    console.log('\n详细分布:');
    
    sortedYears.forEach(year => {
        console.log(`${year}年: ${yearCount[year]}题`);
    });
    
    // 检查是否有2000-2024年的完整数据
    const expectedYears = [];
    for (let year = 2000; year <= 2024; year++) {
        expectedYears.push(year);
    }
    
    console.log('\n🔍 检查2000-2024年完整性:');
    const missingYears = expectedYears.filter(year => !yearCount[year]);
    const existingYears = expectedYears.filter(year => yearCount[year]);
    
    console.log('存在的年份:', existingYears);
    console.log('缺失的年份:', missingYears);
    console.log('完整度:', Math.round((existingYears.length / expectedYears.length) * 100) + '%');
    
} catch (error) {
    console.error('❌ 检查失败:', error.message);
} 