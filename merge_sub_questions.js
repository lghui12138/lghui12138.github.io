const fs = require('fs');

// 读取数据文件
const dataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate.json';
const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('合并被错误拆分的子问题...\n');

// 找出可能的子问题模式
const subQuestionPatterns = [
    /^[0-9]+\)/,  // 1) 2) 3) 等
    /^\([0-9]+\)/, // (1) (2) (3) 等
    /^[一二三四五六七八九十]+、/, // 一、二、三、等
    /^[①②③④⑤⑥⑦⑧⑨⑩]/, // ① ② ③ 等
    /^[a-zA-Z]\)/, // a) b) c) 等
    /^[A-Z]\./, // A. B. C. 等
    /^[0-9]+\s*[．。]/, // 1. 2. 3. 等
];

// 找出所有可能的子问题
const subQuestions = questions.filter(q => {
    const title = q.title.trim();
    return subQuestionPatterns.some(pattern => pattern.test(title));
});

console.log(`发现 ${subQuestions.length} 个可能的子问题：\n`);

subQuestions.forEach((q, index) => {
    console.log(`${index + 1}. ID: ${q.id}, 年份: ${q.year}`);
    console.log(`   标题: ${q.title.substring(0, 80)}...`);
    console.log('   ---');
});

// 按年份分组，找出同一年份中可能相关的题目
const questionsByYear = {};
questions.forEach(q => {
    if (!questionsByYear[q.year]) {
        questionsByYear[q.year] = [];
    }
    questionsByYear[q.year].push(q);
});

// 合并策略：找出同一年份中可能相关的题目
const mergedQuestions = [];
const processedIds = new Set();

Object.keys(questionsByYear).forEach(year => {
    const yearQuestions = questionsByYear[year];
    const mainQuestions = [];
    const subQuestionsInYear = [];
    
    // 分离主题目和子问题
    yearQuestions.forEach(q => {
        const title = q.title.trim();
        const isSubQuestion = subQuestionPatterns.some(pattern => pattern.test(title));
        
        if (isSubQuestion) {
            subQuestionsInYear.push(q);
        } else {
            mainQuestions.push(q);
        }
    });
    
    console.log(`\n${year}年：`);
    console.log(`  主题目数: ${mainQuestions.length}`);
    console.log(`  子问题数: ${subQuestionsInYear.length}`);
    
    // 尝试将子问题合并到相关的主题目中
    mainQuestions.forEach(mainQ => {
        const mainTitle = mainQ.title.toLowerCase();
        const relatedSubs = [];
        
        // 查找可能相关的子问题
        subQuestionsInYear.forEach(subQ => {
            const subTitle = subQ.title.toLowerCase();
            
            // 检查是否有共同的关键词
            const mainKeywords = mainTitle.split(/[\s，。、；：！？""''（）【】]+/);
            const subKeywords = subTitle.split(/[\s，。、；：！？""''（）【】]+/);
            
            const commonKeywords = mainKeywords.filter(keyword => 
                keyword.length > 2 && subKeywords.includes(keyword)
            );
            
            // 如果有关键词匹配，认为是相关的
            if (commonKeywords.length > 0) {
                relatedSubs.push(subQ);
                processedIds.add(subQ.id);
            }
        });
        
        if (relatedSubs.length > 0) {
            // 合并题目
            const mergedTitle = mainQ.title + ' ' + relatedSubs.map(sub => sub.title).join(' ');
            const mergedTags = [...new Set([...mainQ.tags, ...relatedSubs.flatMap(sub => sub.tags)])];
            
            const mergedQuestion = {
                ...mainQ,
                title: mergedTitle,
                tags: mergedTags,
                subQuestions: relatedSubs.map(sub => sub.title)
            };
            
            mergedQuestions.push(mergedQuestion);
            processedIds.add(mainQ.id);
            
            console.log(`  合并: ${mainQ.id} + ${relatedSubs.length}个子问题`);
        } else {
            // 没有相关子问题的主题目
            mergedQuestions.push(mainQ);
            processedIds.add(mainQ.id);
        }
    });
    
    // 添加未处理的子问题（可能是独立的）
    subQuestionsInYear.forEach(subQ => {
        if (!processedIds.has(subQ.id)) {
            mergedQuestions.push(subQ);
            processedIds.add(subQ.id);
        }
    });
});

// 添加其他未处理的题目
questions.forEach(q => {
    if (!processedIds.has(q.id)) {
        mergedQuestions.push(q);
    }
});

console.log(`\n合并结果:`);
console.log(`原始题目数: ${questions.length}`);
console.log(`合并后题目数: ${mergedQuestions.length}`);
console.log(`减少了 ${questions.length - mergedQuestions.length} 个题目`);

// 重新排序
mergedQuestions.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.id.localeCompare(b.id);
});

// 保存合并后的数据
const outputFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate_merged.json';
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

console.log('\n合并完成！'); 