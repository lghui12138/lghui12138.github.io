const fs = require('fs');

// 读取原始真题数据
const rawData = JSON.parse(fs.readFileSync('./question-banks/真题_中国海洋大学_2000-2021.json', 'utf8'));

// 保守的合并策略 - 只合并明显被拆分的题目
function conservativeMerge(data) {
    const processedQuestions = [];
    let i = 0;
    
    while (i < data.length) {
        const currentItem = data[i];
        let title = currentItem.title.trim();
        
        // 跳过明显无意义的条目
        if (shouldSkip(title)) {
            i++;
            continue;
        }
        
        // 检查是否需要与下一个条目合并
        if (i + 1 < data.length) {
            const nextItem = data[i + 1];
            const nextTitle = nextItem.title.trim();
            
            // 只在非常明确的情况下才合并
            if (shouldMergeWithNext(currentItem, nextItem)) {
                // 合并两个条目
                const mergedTitle = title + ' ' + nextTitle;
                const mergedItem = {
                    ...currentItem,
                    title: cleanTitle(mergedTitle),
                    tags: [...new Set([...currentItem.tags, ...nextItem.tags])],
                    score: currentItem.score || nextItem.score
                };
                
                if (isValidQuestion(mergedItem.title)) {
                    processedQuestions.push(mergedItem);
                }
                
                i += 2; // 跳过下一个条目，因为已经合并了
                continue;
            }
        }
        
        // 不需要合并，直接处理单个条目
        if (isValidQuestion(title)) {
            processedQuestions.push({
                ...currentItem,
                title: cleanTitle(title)
            });
        }
        
        i++;
    }
    
    return processedQuestions;
}

// 检查是否应该跳过这个条目
function shouldSkip(title) {
    const skipPatterns = [
        /^科目代码[:：]/,
        /^科目名称[:：]/,
        /^[A-D]\.?\s*会引起/,
        /^[A-D]\.?\s*不会引起/,
        /^[A-D]\.?\s*引起/,
        /^[A-D]\.?\s*$/,
        /^述\s*$/,
        /^[（）\(\)]+$/,
        /^[，。、；：！？""''（）【】\s]+$/,
        /^\s*$|^$|^null$/
    ];
    
    return skipPatterns.some(pattern => pattern.test(title)) || title.length < 5;
}

// 检查是否应该与下一个条目合并
function shouldMergeWithNext(currentItem, nextItem) {
    const currentTitle = currentItem.title.trim();
    const nextTitle = nextItem.title.trim();
    
    // 必须是同一年份
    if (currentItem.year !== nextItem.year) {
        return false;
    }
    
    // 跳过无意义的下一个条目
    if (shouldSkip(nextTitle)) {
        return false;
    }
    
    // 明确的拆分模式
    const splitPatterns = [
        // 当前条目以不完整方式结尾，下一个条目是延续
        {
            current: /距离$/,
            next: /^成反比/
        },
        {
            current: /若在原$/,
            next: /^地将此/
        },
        {
            current: /轴的距离$/,
            next: /^成反比/
        },
        {
            current: /有一半径为r 的铅直的均匀旋涡，若在原$/,
            next: /^地将此旋涡拉长/
        },
        // 题目编号连续且内容相关
        {
            current: /^3\.\s.*距离$/,
            next: /^成反比.*求/
        },
        {
            current: /^4\.\s.*若在原$/,
            next: /^地将此.*求/
        }
    ];
    
    return splitPatterns.some(pattern => 
        pattern.current.test(currentTitle) && pattern.next.test(nextTitle)
    );
}

// 检查是否是有效的题目
function isValidQuestion(title) {
    // 长度检查
    if (title.length < 15) return false;
    
    // 必须包含一些有意义的关键词
    const keywords = [
        '求', '试', '计算', '证明', '已知', '设', '讨论', '分析', '什么', '如何', '为什么',
        '流体', '速度', '压力', '流量', '方程', '边界层', '湍流', '粘性', '涡度', '雷诺',
        '伯努利', '连续性', '动量', '能量', '管道', '流线', '轨迹'
    ];
    
    const hasKeyword = keywords.some(keyword => title.includes(keyword));
    
    // 或者是明确的题目格式
    const questionFormats = [
        /^[0-9]+\./,                    // 1. 2. 3.
        /^[一二三四五六七八九十]+、/,      // 一、二、三、
        /^\([0-9]+\)/,                  // (1) (2)
        /[？。！]$/,                    // 以问号、句号、感叹号结尾
        /\([0-9]+\s*分\)$/              // 以分数结尾
    ];
    
    const hasQuestionFormat = questionFormats.some(pattern => pattern.test(title));
    
    return hasKeyword || hasQuestionFormat;
}

// 清理题目文本
function cleanTitle(title) {
    return title
        .replace(/\s+/g, ' ')           // 合并多个空格
        .replace(/^\s+|\s+$/g, '')      // 去除首尾空格
        .trim();
}

// 按年份去重相似题目
function deduplicateSimilar(questions) {
    const yearGroups = {};
    
    // 按年份分组
    questions.forEach(q => {
        if (!yearGroups[q.year]) {
            yearGroups[q.year] = [];
        }
        yearGroups[q.year].push(q);
    });
    
    // 每年内部去重
    Object.keys(yearGroups).forEach(year => {
        const yearQuestions = yearGroups[year];
        const deduped = [];
        
        yearQuestions.forEach(q => {
            // 检查是否与已有题目过于相似
            const tooSimilar = deduped.find(existing => {
                const similarity = calculateSimilarity(q.title, existing.title);
                return similarity > 0.85; // 相似度超过85%认为是重复
            });
            
            if (!tooSimilar) {
                deduped.push(q);
            } else {
                console.log(`去重: ${q.title.substring(0, 50)}... (与已有题目相似度${(calculateSimilarity(q.title, tooSimilar.title) * 100).toFixed(1)}%)`);
            }
        });
        
        yearGroups[year] = deduped;
    });
    
    return Object.values(yearGroups).flat();
}

// 计算文本相似度
function calculateSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const maxLen = Math.max(len1, len2);
    
    if (maxLen === 0) return 1;
    
    // 简单的字符重叠计算
    let overlap = 0;
    const minLen = Math.min(len1, len2);
    
    for (let i = 0; i < minLen; i++) {
        if (str1[i] === str2[i]) {
            overlap++;
        }
    }
    
    return overlap / maxLen;
}

// 执行保守合并
console.log('开始保守合并真题数据...');
console.log(`原始数据量: ${rawData.length}`);

const mergedQuestions = conservativeMerge(rawData);
console.log(`合并后数据量: ${mergedQuestions.length}`);

const finalQuestions = deduplicateSimilar(mergedQuestions);
console.log(`去重后数据量: ${finalQuestions.length}`);

// 按年份和ID排序
finalQuestions.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.id.localeCompare(b.id);
});

// 保存结果
fs.writeFileSync(
    './question-banks/真题_中国海洋大学_2000-2021_conservative.json',
    JSON.stringify(finalQuestions, null, 2),
    'utf8'
);

console.log('保守合并完成！数据已保存到: 真题_中国海洋大学_2000-2021_conservative.json');

// 详细统计
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

console.log('\n保守合并后的题目示例:');
finalQuestions.slice(0, 15).forEach((item, index) => {
    console.log(`${index + 1}. [${item.year}年-${item.type}] ${item.title.substring(0, 70)}...`);
});

// 检查年份分布是否合理
console.log('\n年份分布分析:');
const years = Object.keys(yearStats).sort();
const counts = years.map(year => yearStats[year]);
const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length;
console.log(`平均每年题目数: ${avgCount.toFixed(1)}`);
console.log(`最多题目年份: ${years[counts.indexOf(Math.max(...counts))]}年 (${Math.max(...counts)}题)`);
console.log(`最少题目年份: ${years[counts.indexOf(Math.min(...counts))]}年 (${Math.min(...counts)}题)`); 