const fs = require('fs');

// 读取原始真题数据
const rawData = JSON.parse(fs.readFileSync('./question-banks/真题_中国海洋大学_2000-2021.json', 'utf8'));

// 改进的合并算法 - 正确处理多小问题目
function improvedMerge(data) {
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
        
        // 检查是否是题目开始（主题目描述）
        if (isMainQuestion(title)) {
            let completeQuestion = {
                ...currentItem,
                title: title,
                subQuestions: []
            };
            
            let j = i + 1;
            
            // 向后查找所有相关的小问
            while (j < data.length) {
                const nextItem = data[j];
                const nextTitle = nextItem.title.trim();
                
                // 如果不是同一年份，停止查找
                if (nextItem.year !== currentItem.year) {
                    break;
                }
                
                // 如果是无意义内容，跳过
                if (shouldSkip(nextTitle)) {
                    j++;
                    continue;
                }
                
                // 如果是新的主题目开始，停止查找
                if (isMainQuestion(nextTitle)) {
                    break;
                }
                
                // 如果是小问，添加到当前题目
                if (isSubQuestion(nextTitle)) {
                    completeQuestion.subQuestions.push(nextTitle);
                    
                    // 合并标签
                    if (nextItem.tags && nextItem.tags.length > 0) {
                        completeQuestion.tags = [...new Set([...completeQuestion.tags, ...nextItem.tags])];
                    }
                    
                    j++;
                } else if (isContinuation(completeQuestion.title, nextTitle)) {
                    // 如果是主题目的延续部分，合并到主题目
                    completeQuestion.title += ' ' + nextTitle;
                    j++;
                } else {
                    // 不相关的内容，停止查找
                    break;
                }
            }
            
            // 构建完整的题目文本
            let fullTitle = completeQuestion.title;
            if (completeQuestion.subQuestions.length > 0) {
                fullTitle += ' ' + completeQuestion.subQuestions.join(' ');
            }
            
            // 如果是有效题目，添加到结果
            if (isValidCompleteQuestion(fullTitle)) {
                processedQuestions.push({
                    ...completeQuestion,
                    title: cleanTitle(fullTitle)
                });
            }
            
            i = j;
        } else {
            // 不是主题目开始，可能是独立的小题目
            if (isValidQuestion(title)) {
                processedQuestions.push({
                    ...currentItem,
                    title: cleanTitle(title)
                });
            }
            i++;
        }
    }
    
    return processedQuestions;
}

// 检查是否应该跳过
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
        /^\s*$|^$|^null$/,
        /^z=x\+yi\)。?$/  // 这种残留的公式片段
    ];
    
    return skipPatterns.some(pattern => pattern.test(title)) || title.length < 5;
}

// 检查是否是主题目（题目描述部分）
function isMainQuestion(title) {
    const mainQuestionPatterns = [
        // 以数字开头的题目
        /^[0-9]+\.\s/,
        /^[0-9]+\s*[．。]/,
        // 以中文数字开头的题目
        /^[一二三四五六七八九十]+、/,
        // 以括号数字开头的题目
        /^\([0-9]+\)/,
        // 包含完整描述但没有明确问题的题目
        /设.*流体.*，.*流速度/,
        /已知.*流场/,
        /有.*点涡.*位于/,
        /在.*平板.*间/,
        /流体质点.*绕.*轴/,
        // 题目描述性开头
        /强度.*的点涡位于/,
        /两无限长水平平行平板间/,
        /不可压流体从.*流出/
    ];
    
    return mainQuestionPatterns.some(pattern => pattern.test(title));
}

// 检查是否是小问
function isSubQuestion(title) {
    const subQuestionPatterns = [
        /^\([0-9]+\)/,           // (1) (2) (3)
        /^[0-9]+\)/,             // 1) 2) 3)
        /^\([0-9]+\).*[？。]/,   // (1)求... (2)计算...
        /^[0-9]+\).*[？。]/,     // 1)求... 2)计算...
        /^\([0-9]+\).*求/,       // (1)求...
        /^[0-9]+\).*求/,         // 1)求...
        /^\([0-9]+\).*试/,       // (1)试...
        /^[0-9]+\).*试/,         // 1)试...
        /^\([0-9]+\).*计算/,     // (1)计算...
        /^[0-9]+\).*计算/,       // 1)计算...
        /^\([0-9]+\).*写出/,     // (1)写出...
        /^[0-9]+\).*写出/,       // 1)写出...
        /^\([0-9]+\).*在.*时/,   // (1)在...时...
        /^[0-9]+\).*在.*时/      // 1)在...时...
    ];
    
    return subQuestionPatterns.some(pattern => pattern.test(title));
}

// 检查是否是题目的延续部分
function isContinuation(mainTitle, nextTitle) {
    // 如果主题目以不完整的方式结尾
    const incompleteEndings = [
        /[，、]$/,
        /距离$/,
        /成$/,
        /的$/,
        /为$/,
        /有$/,
        /在$/,
        /与$/,
        /及$/,
        /和$/,
        /或$/,
        /则$/,
        /其$/,
        /若$/,
        /设$/
    ];
    
    const hasIncompleteEnding = incompleteEndings.some(pattern => pattern.test(mainTitle));
    
    // 下一部分的延续特征
    const continuationStarts = [
        /^成反比/,
        /^反比/,
        /^地将此/,
        /^拉长/,
        /^倍/,
        /^度ρ和粘性系数/,
        /^流体/,
        /^不可压缩/
    ];
    
    return hasIncompleteEnding && continuationStarts.some(pattern => pattern.test(nextTitle));
}

// 检查是否是有效的完整题目
function isValidCompleteQuestion(title) {
    // 长度检查
    if (title.length < 20) return false;
    
    // 必须包含关键词
    const keywords = [
        '求', '试', '计算', '证明', '已知', '设', '讨论', '分析', '什么', '如何', '为什么',
        '流体', '速度', '压力', '流量', '方程', '边界层', '湍流', '粘性', '涡度', '雷诺',
        '伯努利', '连续性', '动量', '能量', '管道', '流线', '轨迹', '点涡', '复势'
    ];
    
    const hasKeyword = keywords.some(keyword => title.includes(keyword));
    
    // 或者包含问号、分数标记
    const hasQuestionMark = title.includes('？') || title.includes('?');
    const hasScore = /\([0-9]+\s*分\)/.test(title);
    
    return hasKeyword || hasQuestionMark || hasScore;
}

// 检查是否是有效题目（用于独立题目）
function isValidQuestion(title) {
    return isValidCompleteQuestion(title);
}

// 清理题目文本
function cleanTitle(title) {
    return title
        .replace(/\s+/g, ' ')           // 合并多个空格
        .replace(/^\s+|\s+$/g, '')      // 去除首尾空格
        .replace(/([。！？])\s*([。！？])/g, '$1') // 去除重复标点
        .trim();
}

// 按年份去重
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
            // 检查是否与已有题目过于相似
            const tooSimilar = deduped.find(existing => {
                const similarity = calculateSimilarity(q.title, existing.title);
                return similarity > 0.75; // 降低相似度阈值，避免误删
            });
            
            if (!tooSimilar) {
                deduped.push(q);
            } else {
                console.log(`去重: ${q.title.substring(0, 40)}... (相似度${(calculateSimilarity(q.title, tooSimilar.title) * 100).toFixed(1)}%)`);
            }
        });
        
        yearGroups[year] = deduped;
    });
    
    return Object.values(yearGroups).flat();
}

// 计算文本相似度
function calculateSimilarity(str1, str2) {
    const shorter = str1.length < str2.length ? str1 : str2;
    const longer = str1.length >= str2.length ? str1 : str2;
    
    if (longer.length === 0) return 1;
    
    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
        if (shorter[i] === longer[i]) {
            matches++;
        }
    }
    
    return matches / longer.length;
}

// 执行改进的合并
console.log('开始改进的题目合并...');
console.log(`原始数据量: ${rawData.length}`);

const mergedQuestions = improvedMerge(rawData);
console.log(`合并后数据量: ${mergedQuestions.length}`);

const finalQuestions = deduplicateByYear(mergedQuestions);
console.log(`去重后数据量: ${finalQuestions.length}`);

// 按年份和ID排序
finalQuestions.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.id.localeCompare(b.id);
});

// 保存结果
fs.writeFileSync(
    './question-banks/真题_中国海洋大学_2000-2021_improved.json',
    JSON.stringify(finalQuestions, null, 2),
    'utf8'
);

console.log('改进合并完成！数据已保存到: 真题_中国海洋大学_2000-2021_improved.json');

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

console.log('\n改进合并后的题目示例:');
finalQuestions.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. [${item.year}年] ${item.title.substring(0, 100)}...`);
});

// 检查多小问题目的合并效果
console.log('\n多小问题目检查:');
const multiPartQuestions = finalQuestions.filter(q => 
    (q.title.includes('(1)') || q.title.includes('1)')) && 
    (q.title.includes('(2)') || q.title.includes('2)'))
);
console.log(`包含多小问的题目数量: ${multiPartQuestions.length}`);
multiPartQuestions.slice(0, 3).forEach((item, index) => {
    console.log(`${index + 1}. ${item.title.substring(0, 120)}...`);
}); 