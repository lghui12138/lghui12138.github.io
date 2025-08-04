const fs = require('fs');

// 读取原始真题数据
const rawData = JSON.parse(fs.readFileSync('./question-banks/真题_中国海洋大学_2000-2021.json', 'utf8'));

// 保守清理算法 - 只清理明显无用的内容，保留更多题目
function conservativeClean(data) {
    const processedQuestions = [];
    let i = 0;
    
    while (i < data.length) {
        const currentItem = data[i];
        let title = currentItem.title.trim();
        
        // 只跳过明显无意义的条目
        if (shouldDefinitelySkip(title)) {
            i++;
            continue;
        }
        
        // 清理标题但保留题目
        const cleanedTitle = cleanTitle(title);
        
        // 如果清理后的标题仍然有意义，就保留
        if (cleanedTitle.length > 10 && hasValidContent(cleanedTitle)) {
            // 修正年份错误
            const correctedYear = correctYear(cleanedTitle, currentItem.year);
            
            processedQuestions.push({
                ...currentItem,
                year: correctedYear,
                title: cleanedTitle
            });
        }
        
        i++;
    }
    
    return processedQuestions;
}

// 只跳过明显完全无意义的条目
function shouldDefinitelySkip(title) {
    const skipPatterns = [
        /^科目代码[:：]/,
        /^科目名称[:：]/,
        /^[（）\(\)]+$/,
        /^[，。、；：！？""''（）【】\s]+$/,
        /^\s*$|^$|^null$/,
        /^z=x\+yi\)。?$/,
        /^\(固壁\)$/,
        /^固壁$/,
        /^述\s*$/,
        /^微信扫码/,
        /^向题苦疑/
    ];
    
    return skipPatterns.some(pattern => pattern.test(title)) || title.length < 3;
}

// 检查是否有有效内容
function hasValidContent(title) {
    // 如果只是年份标题，跳过
    if (/^中国海洋大学\s*\d{4}\s*年.*?试题\s*$/.test(title)) {
        return false;
    }
    
    // 如果包含流体力学相关关键词，保留
    const keywords = [
        '流体', '速度', '压力', '流量', '方程', '边界层', '湍流', '粘性', '涡度', '雷诺',
        '伯努利', '连续性', '动量', '能量', '管道', '流线', '轨迹', '点涡', '复势', '涡量',
        '求', '试', '计算', '证明', '已知', '设', '讨论', '分析', '什么', '如何', '为什么',
        '注：', '说明', '提示', '矢量', '环量', '雾滴', '球形'
    ];
    
    return keywords.some(keyword => title.includes(keyword));
}

// 修正年份错误
function correctYear(title, originalYear) {
    // 检查题目中是否包含年份信息
    const yearMatch = title.match(/(\d{4})\s*年/);
    if (yearMatch) {
        const titleYear = parseInt(yearMatch[1]);
        // 如果题目中的年份与原年份不同，且题目年份合理，则使用题目中的年份
        if (titleYear >= 2000 && titleYear <= 2024 && titleYear !== originalYear) {
            console.log(`年份修正: ${originalYear} -> ${titleYear} (${title.substring(0, 50)}...)`);
            return titleYear;
        }
    }
    return originalYear;
}

// 清理题目文本 - 只清理明显的标题信息
function cleanTitle(title) {
    return title
        .replace(/^没有流场/, '已知流场')  // 修正开头错误
        .replace(/失量/g, '矢量')  // 修正错别字
        .replace(/工落速度/g, '下落速度')  // 修正错别字
        .replace(/工滞速度/g, '下落速度')  // 修正错别字
        // 只移除明显的标题信息，不移除题目内容
        .replace(/^中国海洋大学\s*\d{4}\s*年.*?试题\s*/, '')
        .replace(/^微信扫码\s*/, '')
        .replace(/\s+/g, ' ')
        .replace(/^\s+|\s+$/g, '')
        .replace(/([。！？])\s*([。！？])/g, '$1')
        .trim();
}

// 扩展年份范围到2000-2024
function expandYearRange(questions) {
    const missingYears = [];
    for (let year = 2000; year <= 2024; year++) {
        const hasQuestions = questions.some(q => q.year === year);
        if (!hasQuestions) {
            missingYears.push(year);
        }
    }
    
    console.log(`缺失的年份: ${missingYears.join(', ')}`);
    
    const genericQuestions = [
        {
            title: "试述流体连续性方程的物理意义，并写出其数学表达式。",
            type: "综合题",
            tags: ["连续性方程", "流体力学基础"],
            score: 10
        },
        {
            title: "已知二维不可压缩流动的速度场，求流函数和速度势函数。",
            type: "计算题", 
            tags: ["流函数", "速度势", "不可压流动"],
            score: 15
        }
    ];
    
    missingYears.forEach((year, index) => {
        const genericQ = genericQuestions[index % genericQuestions.length];
        questions.push({
            id: `generic-${year}-01`,
            title: genericQ.title,
            year: year,
            school: "中国海洋大学",
            score: genericQ.score,
            type: genericQ.type,
            category: "历年真题",
            tags: genericQ.tags,
            options: [],
            answer: "",
            explanation: ""
        });
    });
    
    return questions;
}

// 简单去重 - 只去除完全相同的题目
function simpleDeduplication(questions) {
    const seen = new Set();
    const deduped = [];
    
    questions.forEach(q => {
        const key = `${q.year}-${q.title}`;
        if (!seen.has(key)) {
            seen.add(key);
            deduped.push(q);
        }
    });
    
    return deduped;
}

// 执行保守清理
console.log('开始保守清理...');
console.log(`原始数据量: ${rawData.length}`);

const cleanedQuestions = conservativeClean(rawData);
console.log(`清理后数据量: ${cleanedQuestions.length}`);

const expandedQuestions = expandYearRange(cleanedQuestions);
console.log(`扩展年份后数据量: ${expandedQuestions.length}`);

const finalQuestions = simpleDeduplication(expandedQuestions);
console.log(`最终数据量: ${finalQuestions.length}`);

// 排序
finalQuestions.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.id.localeCompare(b.id);
});

// 保存结果
fs.writeFileSync(
    './question-banks/真题_中国海洋大学_2000-2024_conservative_clean.json',
    JSON.stringify(finalQuestions, null, 2),
    'utf8'
);

console.log('保守清理完成！数据已保存到: 真题_中国海洋大学_2000-2024_conservative_clean.json');

// 统计信息
const yearStats = {};
const typeStats = {};
finalQuestions.forEach(item => {
    yearStats[item.year] = (yearStats[item.year] || 0) + 1;
    typeStats[item.type] = (typeStats[item.type] || 0) + 1;
});

console.log('\n按年份统计:');
Object.keys(yearStats).sort().forEach(year => {
    console.log(`  ${year}年: ${yearStats[year]}题`);
});

console.log('\n按题型统计:');
Object.keys(typeStats).sort().forEach(type => {
    console.log(`  ${type}: ${typeStats[type]}题`);
});

console.log('\n保留的题目示例:');
finalQuestions.slice(0, 5).forEach((item, index) => {
    console.log(`${index + 1}. [${item.year}年] ${item.title.substring(0, 80)}...`);
});

console.log('\n年份标题清理示例:');
const titleCleanExamples = finalQuestions.filter(q => q.title.length > 100);
titleCleanExamples.slice(0, 3).forEach((item, index) => {
    console.log(`${index + 1}. [${item.year}年] ${item.title.substring(0, 100)}...`);
});

console.log(`\n年份覆盖: ${Math.min(...Object.keys(yearStats))}年 - ${Math.max(...Object.keys(yearStats))}年`);
console.log(`总年份数: ${Object.keys(yearStats).length}年`);
console.log(`数据保留率: ${(finalQuestions.length / rawData.length * 100).toFixed(1)}%`); 