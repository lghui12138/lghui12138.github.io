const fs = require('fs');

// 读取原始数据文件
const dataFile = './question-banks/真题_中国海洋大学_2000-2021_cleaned.json';
const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('修复2024年题目标注问题...\n');

// 找到包含"2024年"或"2 0 2 4 年"信息的题目
const examTitleQuestion = questions.find(q => 
    q.title && (q.title.includes('2024年') || q.title.includes('2 0 2 4 年'))
);

if (examTitleQuestion) {
    console.log(`找到包含2024年信息的题目: ID=${examTitleQuestion.id}, 当前年份=${examTitleQuestion.year}`);
    console.log(`标题: ${examTitleQuestion.title}`);
    
    // 找到这个题目在数组中的位置
    const examTitleIndex = questions.findIndex(q => q.id === examTitleQuestion.id);
    console.log(`题目位置: ${examTitleIndex}`);
    
    // 从这个题目开始，将所有后续题目改为2024年
    const fixedQuestions = [...questions];
    let fixedCount = 0;
    
    for (let i = examTitleIndex; i < fixedQuestions.length; i++) {
        const question = fixedQuestions[i];
        
        // 跳过广告信息题目
        if (question.title && (
            question.title.includes('微信公众号') || 
            question.title.includes('淘宝店铺') ||
            question.title.includes('QQ:')
        )) {
            continue;
        }
        
        // 如果题目不是2024年，则改为2024年
        if (question.year !== 2024) {
            const oldYear = question.year;
            question.year = 2024;
            question.id = question.id.replace(`-${oldYear}-`, '-2024-');
            fixedCount++;
            console.log(`修复题目: ${question.id}, 年份: ${oldYear} -> 2024`);
        }
    }
    
    console.log(`\n总共修复了 ${fixedCount} 个题目的年份标注`);
    
    // 保存修复后的数据
    const outputFile = './question-banks/真题_中国海洋大学_2000-2024_fixed_from_original.json';
    fs.writeFileSync(outputFile, JSON.stringify(fixedQuestions, null, 2), 'utf8');
    console.log(`修复后的数据已保存到: ${outputFile}`);
    
    // 统计修复后的年份分布
    const yearStats = {};
    fixedQuestions.forEach(q => {
        yearStats[q.year] = (yearStats[q.year] || 0) + 1;
    });
    
    console.log('\n修复后的年份分布:');
    Object.keys(yearStats).sort().forEach(year => {
        console.log(`  ${year}年: ${yearStats[year]}题`);
    });
    
} else {
    console.log('未找到包含"2024年"信息的题目');
    
    // 检查是否有其他年份标注错误
    const questionsWithYearMismatch = questions.filter(q => {
        const title = q.title || '';
        const yearMatches = title.match(/202[0-9]年/g);
        if (yearMatches) {
            const titleYear = parseInt(yearMatches[0]);
            return titleYear !== q.year;
        }
        return false;
    });
    
    if (questionsWithYearMismatch.length > 0) {
        console.log(`\n发现 ${questionsWithYearMismatch.length} 个年份不匹配的题目:`);
        questionsWithYearMismatch.forEach(q => {
            const title = q.title || '';
            const yearMatches = title.match(/202[0-9]年/g);
            console.log(`ID: ${q.id}, 标注年份: ${q.year}, 题目中提到的年份: ${yearMatches.join(', ')}`);
        });
    }
}

console.log('\n修复完成！'); 