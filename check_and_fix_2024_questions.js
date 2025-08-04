const fs = require('fs');

// 读取最新的数据文件
const dataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate.json';
const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('检查2024年题目标注问题...\n');

// 查找可能被错误标注的题目
const suspicious2024Questions = questions.filter(q => {
    if (q.year === 2024) {
        // 检查题目内容是否包含2024年以后的年份信息
        const title = q.title || '';
        const hasLaterYear = /202[5-9]|203[0-9]/.test(title);
        const hasExamTitle = /202[5-9]年.*考试试题|203[0-9]年.*考试试题/.test(title);
        const hasYearMention = /202[5-9]年|203[0-9]年/.test(title);
        
        return hasLaterYear || hasExamTitle || hasYearMention;
    }
    return false;
});

console.log(`发现 ${suspicious2024Questions.length} 个可能被错误标注为2024年的题目：\n`);

suspicious2024Questions.forEach((q, index) => {
    console.log(`${index + 1}. ID: ${q.id}`);
    console.log(`   年份: ${q.year}`);
    console.log(`   标题: ${q.title.substring(0, 100)}...`);
    console.log(`   类型: ${q.type}`);
    console.log('   ---');
});

// 检查所有包含年份信息的题目
console.log('\n检查所有包含年份信息的题目：\n');

const allYearMentions = questions.filter(q => {
    const title = q.title || '';
    return /202[0-9]年/.test(title);
});

allYearMentions.forEach(q => {
    const title = q.title || '';
    const yearMatches = title.match(/202[0-9]年/g);
    if (yearMatches) {
        console.log(`ID: ${q.id}, 标注年份: ${q.year}, 题目中提到的年份: ${yearMatches.join(', ')}`);
        console.log(`标题: ${title.substring(0, 80)}...`);
        console.log('---');
    }
});

// 检查是否有2024年以后的题目被错误标注
console.log('\n检查是否有2024年以后的题目被错误标注：\n');

const questionsWithLaterYears = questions.filter(q => {
    const title = q.title || '';
    const laterYearMatches = title.match(/202[5-9]年|203[0-9]年/g);
    return laterYearMatches && q.year !== parseInt(laterYearMatches[0]);
});

questionsWithLaterYears.forEach(q => {
    const title = q.title || '';
    const laterYearMatches = title.match(/202[5-9]年|203[0-9]年/g);
    console.log(`ID: ${q.id}`);
    console.log(`当前标注年份: ${q.year}`);
    console.log(`题目中提到的年份: ${laterYearMatches.join(', ')}`);
    console.log(`标题: ${title.substring(0, 100)}...`);
    console.log('---');
});

// 生成修复建议
console.log('\n修复建议：\n');

if (suspicious2024Questions.length > 0 || questionsWithLaterYears.length > 0) {
    console.log('发现以下问题需要修复：');
    
    if (suspicious2024Questions.length > 0) {
        console.log(`1. ${suspicious2024Questions.length} 个题目可能被错误标注为2024年`);
    }
    
    if (questionsWithLaterYears.length > 0) {
        console.log(`2. ${questionsWithLaterYears.length} 个题目包含2024年以后的年份信息但标注错误`);
    }
    
    console.log('\n建议修复步骤：');
    console.log('1. 检查原始数据源，确认2024年以后的题目');
    console.log('2. 更新数据处理脚本，正确处理2024年以后的年份');
    console.log('3. 重新生成数据文件');
} else {
    console.log('未发现明显的年份标注错误。');
}

console.log('\n检查完成！'); 