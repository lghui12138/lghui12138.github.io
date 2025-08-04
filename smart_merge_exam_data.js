const fs = require('fs');

// 读取原始真题数据
const rawData = JSON.parse(fs.readFileSync('./question-banks/真题_中国海洋大学_2000-2021.json', 'utf8'));

// 智能合并被拆分的题目
function smartMergeQuestions(data) {
    const mergedQuestions = [];
    let i = 0;
    
    while (i < data.length) {
        const currentItem = data[i];
        let title = currentItem.title.trim();
        
        // 跳过明显无意义的题目
        if (isInvalidTitle(title)) {
            i++;
            continue;
        }
        
        // 检查是否是题目的开始
        if (isQuestionStart(title)) {
            // 这是一个新题目的开始
            let completeTitle = title;
            let j = i + 1;
            let questionData = { ...currentItem };
            
            // 向后查找并合并属于同一题目的片段
            while (j < data.length) {
                const nextItem = data[j];
                const nextTitle = nextItem.title.trim();
                
                // 如果遇到下一个题目开始或者不同年份，停止合并
                if (isQuestionStart(nextTitle) || nextItem.year !== currentItem.year) {
                    break;
                }
                
                // 如果是无意义的内容，跳过
                if (isInvalidTitle(nextTitle)) {
                    j++;
                    continue;
                }
                
                // 如果是题目的延续部分，合并
                if (isContinuation(completeTitle, nextTitle)) {
                    completeTitle += ' ' + nextTitle;
                    
                    // 合并标签
                    if (nextItem.tags && nextItem.tags.length > 0) {
                        questionData.tags = [...new Set([...questionData.tags, ...nextItem.tags])];
                    }
                    
                    // 如果找到了分数信息，更新
                    if (nextTitle.includes('分)') && !questionData.score) {
                        const scoreMatch = nextTitle.match(/\((\d+)\s*分\)/);
                        if (scoreMatch) {
                            questionData.score = parseInt(scoreMatch[1]);
                        }
                    }
                    
                    j++;
                } else {
                    // 不是延续部分，停止合并
                    break;
                }
                
                // 如果题目已经很长或者看起来完整了，停止合并
                if (completeTitle.length > 300 || hasCompleteEnding(completeTitle)) {
                    break;
                }
            }
            
            // 清理并保存合并后的题目
            if (completeTitle.length > 20 && isValidQuestion(completeTitle)) {
                questionData.title = cleanTitle(completeTitle);
                mergedQuestions.push(questionData);
            }
            
            i = j;
        } else {
            // 不是题目开始，可能是孤立的片段，跳过
            i++;
        }
    }
    
    return mergedQuestions;
}

// 检查是否是无意义的标题
function isInvalidTitle(title) {
    const invalidPatterns = [
        /^科目代码[:：]/,
        /^科目名称[:：]/,
        /^[A-D]\.?\s*[^。]*$/,
        /^[A-D]\.?\s*$/,
        /^[（）\(\)]+$/,
        /^[，。、；：！？""''（）【】\s]+$/,
        /^述\s*$/,
        /^[0-9]+\s*$/,
        /^\s*$|^$|^null$/,
        /^会引起.*的海水/,
        /^不会引起.*相对流动/,
        /^引起的相对流动方向/
    ];
    
    return invalidPatterns.some(pattern => pattern.test(title)) || title.length < 3;
}

// 检查是否是题目的开始
function isQuestionStart(title) {
    const startPatterns = [
        /^[0-9]+\.\s/,                    // 1. 2. 3.
        /^[一二三四五六七八九十]+、/,      // 一、二、三、
        /^第[一二三四五六七八九十]+题/,    // 第一题
        /^\([0-9]+\)/,                    // (1) (2)
        /^[0-9]+\s*[．。]/,              // 1． 1。
    ];
    
    return startPatterns.some(pattern => pattern.test(title));
}

// 检查是否是题目的延续
function isContinuation(currentTitle, nextTitle) {
    // 如果当前题目以不完整的方式结尾，下一部分可能是延续
    const incompleteEndings = [
        /[，、]$/,      // 以逗号结尾
        /距离$/,        // 以"距离"结尾
        /成$/,          // 以"成"结尾
        /的$/,          // 以"的"结尾
        /为$/,          // 以"为"结尾
        /有$/,          // 以"有"结尾
        /在$/,          // 以"在"结尾
        /与$/,          // 以"与"结尾
        /及$/,          // 以"及"结尾
        /和$/,          // 以"和"结尾
        /或$/,          // 以"或"结尾
        /则$/,          // 以"则"结尾
        /其$/,          // 以"其"结尾
        /若$/,          // 以"若"结尾
    ];
    
    const hasIncompleteEnding = incompleteEndings.some(pattern => pattern.test(currentTitle));
    
    // 如果当前题目不完整，且下一部分不是新题目开始，则可能是延续
    if (hasIncompleteEnding && !isQuestionStart(nextTitle)) {
        return true;
    }
    
    // 如果下一部分以小写字母或特定词汇开始，可能是延续
    const continuationStarts = [
        /^成反比/,
        /^反比/,
        /^地将此/,
        /^拉长/,
        /^倍/,
        /^求/,
        /^试/,
        /^计算/,
        /^证明/,
        /^分析/,
        /^讨论/,
    ];
    
    return continuationStarts.some(pattern => pattern.test(nextTitle));
}

// 检查题目是否有完整的结尾
function hasCompleteEnding(title) {
    return /[？。！]$/.test(title) || /\([0-9]+\s*分\)$/.test(title);
}

// 检查是否是有效的题目
function isValidQuestion(title) {
    // 必须包含一些关键词
    const keywords = [
        '求', '试', '计算', '证明', '已知', '设', '讨论', '分析', '什么', '如何', '为什么',
        '流体', '速度', '压力', '流量', '方程', '边界层', '湍流', '粘性', '涡度'
    ];
    
    return keywords.some(keyword => title.includes(keyword)) && title.length > 15;
}

// 清理题目文本
function cleanTitle(title) {
    return title
        .replace(/\s+/g, ' ')                    // 合并多个空格
        .replace(/^\s+|\s+$/g, '')               // 去除首尾空格
        .replace(/([。！？])\s*([。！？])/g, '$1') // 去除重复标点
        .replace(/\s*([。！？])\s*/g, '$1')      // 标点前后空格处理
        .trim();
}

// 按年份分组去重
function deduplicateByYear(questions) {
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
            const similar = deduped.find(existing => 
                similarity(q.title, existing.title) > 0.8
            );
            
            if (!similar) {
                deduped.push(q);
            }
        });
        
        yearGroups[year] = deduped;
    });
    
    // 合并所有年份
    return Object.values(yearGroups).flat();
}

// 计算文本相似度
function similarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
}

// 计算编辑距离
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// 执行智能合并
console.log('开始智能合并真题数据...');
console.log(`原始数据量: ${rawData.length}`);

const mergedQuestions = smartMergeQuestions(rawData);
console.log(`合并后数据量: ${mergedQuestions.length}`);

const deduplicatedQuestions = deduplicateByYear(mergedQuestions);
console.log(`去重后数据量: ${deduplicatedQuestions.length}`);

// 按年份和题目编号排序
deduplicatedQuestions.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.id.localeCompare(b.id);
});

// 保存结果
fs.writeFileSync(
    './question-banks/真题_中国海洋大学_2000-2021_merged.json',
    JSON.stringify(deduplicatedQuestions, null, 2),
    'utf8'
);

console.log('智能合并完成！数据已保存到: 真题_中国海洋大学_2000-2021_merged.json');

// 统计信息
const yearStats = {};
const typeStats = {};
deduplicatedQuestions.forEach(item => {
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

console.log('\n合并后的题目示例:');
deduplicatedQuestions.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. [${item.year}年] ${item.title.substring(0, 80)}...`);
}); 