const fs = require('fs');

// 读取数据文件
const dataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate.json';
const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('合并肥皂泡相关的题目...\n');

// 获取2006年的所有题目
const year2006Questions = questions.filter(q => q.year === 2006);
console.log(`2006年总题目数: ${year2006Questions.length}`);

// 查找肥皂泡相关的题目
const soapBubbleQuestions = year2006Questions.filter(q => 
    q.title.includes('肥皂泡') || 
    q.title.includes('球状肥皂泡') ||
    q.title.includes('表面压强')
);

console.log(`\n发现 ${soapBubbleQuestions.length} 个肥皂泡相关题目：`);
soapBubbleQuestions.forEach((q, index) => {
    console.log(`${index + 1}. ${q.id}: ${q.title}`);
});

// 查找其他可能相关的题目
const relatedQuestions = year2006Questions.filter(q => 
    q.title.includes('膨胀') || 
    q.title.includes('收缩') ||
    q.title.includes('压强') ||
    q.title.includes('不可压')
);

console.log(`\n发现 ${relatedQuestions.length} 个可能相关的题目：`);
relatedQuestions.forEach((q, index) => {
    console.log(`${index + 1}. ${q.id}: ${q.title.substring(0, 60)}...`);
});

// 合并策略：找出所有相关的题目
const allRelatedQuestions = [...soapBubbleQuestions, ...relatedQuestions];
const uniqueRelatedQuestions = [];
const seenIds = new Set();

allRelatedQuestions.forEach(q => {
    if (!seenIds.has(q.id)) {
        uniqueRelatedQuestions.push(q);
        seenIds.add(q.id);
    }
});

console.log(`\n去重后相关题目数: ${uniqueRelatedQuestions.length}`);

// 如果找到相关题目，进行合并
if (uniqueRelatedQuestions.length > 1) {
    // 选择第一个作为主题目
    const mainQuestion = uniqueRelatedQuestions[0];
    const subQuestions = uniqueRelatedQuestions.slice(1);
    
    // 合并标题
    const mergedTitle = mainQuestion.title + ' ' + subQuestions.map(sub => sub.title).join(' ');
    
    // 合并标签
    const mergedTags = [...new Set([...mainQuestion.tags, ...subQuestions.flatMap(sub => sub.tags)])];
    
    // 创建合并后的题目
    const mergedQuestion = {
        ...mainQuestion,
        title: mergedTitle,
        tags: mergedTags,
        subQuestions: subQuestions.map(sub => sub.title)
    };
    
    console.log(`\n合并结果:`);
    console.log(`主题目: ${mainQuestion.title}`);
    console.log(`子问题数: ${subQuestions.length}`);
    subQuestions.forEach((sub, index) => {
        console.log(`  ${index + 1}. ${sub.title}`);
    });
    
    // 创建新的题目列表
    const mergedQuestions = [];
    const processedIds = new Set();
    
    // 添加合并后的题目
    mergedQuestions.push(mergedQuestion);
    processedIds.add(mainQuestion.id);
    subQuestions.forEach(sub => processedIds.add(sub.id));
    
    // 添加其他未处理的题目
    questions.forEach(q => {
        if (!processedIds.has(q.id)) {
            mergedQuestions.push(q);
        }
    });
    
    // 重新排序
    mergedQuestions.sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.id.localeCompare(b.id);
    });
    
    // 保存合并后的数据
    const outputFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate_soap_merged.json';
    fs.writeFileSync(outputFile, JSON.stringify(mergedQuestions, null, 2), 'utf8');
    console.log(`\n合并后的数据已保存到: ${outputFile}`);
    
    // 统计合并后的年份分布
    const yearStats = {};
    mergedQuestions.forEach(q => {
        yearStats[q.year] = (yearStats[q.year] || 0) + 1;
    });
    
    console.log('\n合并后的年份分布:');
    Object.keys(yearStats).sort().forEach(year => {
        console.log(`  ${year}年: ${yearStats[year]}题`);
    });
    
    console.log(`\n合并结果:`);
    console.log(`原始题目数: ${questions.length}`);
    console.log(`合并后题目数: ${mergedQuestions.length}`);
    console.log(`减少了 ${questions.length - mergedQuestions.length} 个题目`);
    
} else {
    console.log('没有找到足够的相关题目进行合并');
}

console.log('\n合并完成！'); 