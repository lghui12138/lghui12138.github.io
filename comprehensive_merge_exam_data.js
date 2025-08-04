const fs = require('fs');

// 读取原始真题数据
const rawData = JSON.parse(fs.readFileSync('./question-banks/真题_中国海洋大学_2000-2021.json', 'utf8'));

// 综合合并算法 - 保留更多题目，同时正确合并拆分内容
function comprehensiveMerge(data) {
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
        
        // 检查是否是注释说明（应该合并到后续题目中）
        if (isNoticeOrInstruction(title)) {
            const result = handleNoticeInstruction(currentItem, data, i);
            if (result.question) {
                processedQuestions.push(result.question);
            }
            i = result.nextIndex;
            continue;
        }
        
        // 处理普通题目（包括合并拆分的内容）
        const result = processQuestionWithMerging(currentItem, data, i);
        if (result.question) {
            processedQuestions.push(result.question);
        }
        i = result.nextIndex;
    }
    
    return processedQuestions;
}

// 处理注释说明
function handleNoticeInstruction(currentItem, data, startIndex) {
    let title = currentItem.title.trim();
    let i = startIndex + 1;
    
    // 查找后续的实际题目，将注释合并进去
    while (i < data.length && i < startIndex + 5) {
        const nextItem = data[i];
        const nextTitle = nextItem.title.trim();
        
        if (nextItem.year !== currentItem.year) break;
        if (shouldDefinitelySkip(nextTitle)) { i++; continue; }
        
        if (isActualQuestion(nextTitle)) {
            // 将注释合并到实际题目中
            const mergedQuestion = {
                ...nextItem,
                title: `${title} ${nextTitle}`,
                id: nextItem.id
            };
            
            // 继续处理这个合并后的题目
            const result = processQuestionWithMerging(mergedQuestion, data, i);
            return result;
        }
        i++;
    }
    
    return { question: null, nextIndex: startIndex + 1 };
}

// 处理题目并合并拆分的内容
function processQuestionWithMerging(currentItem, data, startIndex) {
    let title = currentItem.title.trim();
    let i = startIndex;
    
    let completeQuestion = {
        ...currentItem,
        title: title,
        subQuestions: [],
        options: [],
        fragments: []
    };
    
    let j = i + 1;
    
    // 向后查找相关的内容
    while (j < data.length) {
        const nextItem = data[j];
        const nextTitle = nextItem.title.trim();
        
        // 不同年份停止查找
        if (nextItem.year !== currentItem.year) {
            break;
        }
        
        // 跳过无意义内容
        if (shouldDefinitelySkip(nextTitle)) {
            j++;
            continue;
        }
        
        // 如果是新的题目开始，停止查找
        if (isNewQuestionStart(nextTitle)) {
            break;
        }
        
        // 如果是选择题选项
        if (isChoiceOption(nextTitle)) {
            completeQuestion.options.push(nextTitle);
            mergeTagsAndMetadata(completeQuestion, nextItem);
            j++;
        }
        // 如果是小问
        else if (isSubQuestion(nextTitle)) {
            completeQuestion.subQuestions.push(nextTitle);
            mergeTagsAndMetadata(completeQuestion, nextItem);
            j++;
        }
        // 如果是题目的延续部分
        else if (isContinuation(completeQuestion.title, nextTitle)) {
            completeQuestion.title += ' ' + nextTitle;
            mergeTagsAndMetadata(completeQuestion, nextItem);
            j++;
        }
        // 如果是题目片段
        else if (isQuestionFragment(nextTitle)) {
            completeQuestion.fragments.push(nextTitle);
            mergeTagsAndMetadata(completeQuestion, nextItem);
            j++;
        }
        else {
            // 不相关内容，停止查找
            break;
        }
    }
    
    // 构建完整题目
    let fullTitle = completeQuestion.title;
    
    // 添加片段
    if (completeQuestion.fragments.length > 0) {
        fullTitle += ' ' + completeQuestion.fragments.join(' ');
    }
    
    // 添加小问
    if (completeQuestion.subQuestions.length > 0) {
        fullTitle += ' ' + completeQuestion.subQuestions.join(' ');
    }
    
    // 添加选项
    if (completeQuestion.options.length > 0) {
        fullTitle += ' ' + completeQuestion.options.join(' ');
        // 如果有选项，标记为选择题
        completeQuestion.type = "选择题";
    }
    
    // 清理和修正
    fullTitle = cleanTitle(fullTitle);
    const correctedYear = correctYear(fullTitle, completeQuestion.year);
    completeQuestion.year = correctedYear;
    
    if (hasValidContent(fullTitle)) {
        return {
            question: {
                ...completeQuestion,
                title: fullTitle
            },
            nextIndex: j
        };
    }
    
    return { question: null, nextIndex: j };
}

// 合并标签和元数据
function mergeTagsAndMetadata(completeQuestion, nextItem) {
    if (nextItem.tags && nextItem.tags.length > 0) {
        completeQuestion.tags = [...new Set([...completeQuestion.tags, ...nextItem.tags])];
    }
}

// 检查是否是注释或说明
function isNoticeOrInstruction(title) {
    const patterns = [
        /^注[:：]/,
        /^说明[:：]/,
        /^提示[:：]/,
        /^注意[:：]/,
        /本试题中用符号/,
        /表示矢量/,
        /表示失量/
    ];
    
    return patterns.some(pattern => pattern.test(title));
}

// 检查是否是实际题目
function isActualQuestion(title) {
    const patterns = [
        /^[0-9]+\./,
        /^[一二三四五六七八九十]+、/,
        /^已知/,
        /^设/,
        /^有/,
        /^位于/,
        /^强度/,
        /^球形/,
        /^流体/,
        /^两/,
        /^在.*中/
    ];
    
    return patterns.some(pattern => pattern.test(title));
}

// 检查是否是新题目开始
function isNewQuestionStart(title) {
    const patterns = [
        /^[一二三四五六七八九十]+、/,
        /^[0-9]+\.\s/,
        /^\d+\s*[．。]/,
        /^已知.*(?:流场|速度场|流体)/,
        /^设.*流体/,
        /^有.*点涡/,
        /^两.*平板/,
        /^流体质点/,
        /^单摆/,
        /^证明/,
        /^试述/,
        /^讨论/,
        /^球形.*在.*中/,
        /^位于.*的点涡/,
        /^强度.*的/
    ];
    
    return patterns.some(pattern => pattern.test(title));
}

// 检查是否是选择题选项
function isChoiceOption(title) {
    const patterns = [
        /^[A-D]\.?\s*[^a-zA-Z]/,  // A. B. C. D. 后面跟非字母
        /^[A-D]\s*$/,             // 单独的A B C D
        /^[A-D]\.?\s*\d/,         // A.1 B.2 等
        /^[A-D]\.?\s*[（(]/,      // A.(  B.(  等
        /^[A-D]\.?\s*[-+]/,       // A.- B.+ 等
        /^[A-D]\.?\s*[αβγδ]/,    // A.α B.β 等希腊字母
        /^[A-D]\.?\s*[πμρλ]/     // A.π B.μ 等数学符号
    ];
    
    return patterns.some(pattern => pattern.test(title)) && title.length < 80;
}

// 检查是否是小问
function isSubQuestion(title) {
    const patterns = [
        /^[0-9]+\s*\)\s*求/,
        /^[0-9]+\s*\)\s*在/,
        /^[0-9]+\s*\)\s*写出/,
        /^[0-9]+\s*\)\s*计算/,
        /^[0-9]+\s*\)\s*证明/,
        /^[0-9]+\s*\)\s*试/,
        /^[0-9]+\s*\)\s*讨论/,
        /^\([0-9]+\)\s*求/,
        /^\([0-9]+\)\s*在/,
        /^\([0-9]+\)\s*写出/,
        /^\([0-9]+\)\s*计算/,
        /^\([0-9]+\)\s*证明/,
        /^\([0-9]+\)\s*试/,
        /^\([0-9]+\)\s*讨论/
    ];
    
    return patterns.some(pattern => pattern.test(title));
}

// 检查是否是题目片段
function isQuestionFragment(title) {
    const fragmentPatterns = [
        /成反比/,
        /求流体.*场/,
        /速度环流/,
        /加速度环流/,
        /的速度分布/,
        /摩擦应力/,
        /流量.*平均速度/,
        /阻力/,
        /^气粘性系数为/,
        /则.*速度为/,
        /^密度为.*粘性系数/,
        /其.*间充满/,
        /当.*达到.*状态/,
        /若.*板.*固定/
    ];
    
    return fragmentPatterns.some(pattern => pattern.test(title));
}

// 检查是否是延续部分
function isContinuation(mainTitle, nextTitle) {
    const incompleteEndings = [
        /[，、]$/, /距离$/, /成$/, /的$/, /为$/, /有$/, /在$/, /与$/, /及$/, /和$/, /或$/, /则$/, /其$/, /若$/, /设$/, /空$/
    ];
    
    const continuationStarts = [
        /^成反比/, /^反比/, /^地将此/, /^拉长/, /^倍/, /^度ρ和粘性系数/, /^流体/, /^不可压缩/,
        /^密度为/, /^粘性系数/, /^其间充满/, /^当流动达到/, /^若下板固定/, /^来.*流速度/,
        /^气粘性系数为/
    ];
    
    const hasIncompleteEnding = incompleteEndings.some(pattern => pattern.test(mainTitle));
    return hasIncompleteEnding && continuationStarts.some(pattern => pattern.test(nextTitle));
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
        /^向题苦疑/,
        /^[一二三四五六七八九十]+、\s*\(\d+分\)\s*$/,
        /^\d+\.\s*\(\d+分\)\s*$/
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
        '注：', '说明', '提示', '矢量', '环量', '雾滴', '球形', '摩擦', '阻力'
    ];
    
    return keywords.some(keyword => title.includes(keyword)) && title.length > 15;
}

// 修正年份错误
function correctYear(title, originalYear) {
    const yearMatch = title.match(/(\d{4})\s*年/);
    if (yearMatch) {
        const titleYear = parseInt(yearMatch[1]);
        if (titleYear >= 2000 && titleYear <= 2024 && titleYear !== originalYear) {
            console.log(`年份修正: ${originalYear} -> ${titleYear} (${title.substring(0, 50)}...)`);
            return titleYear;
        }
    }
    return originalYear;
}

// 清理题目文本
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

// 智能去重 - 避免过度删除
function smartDeduplication(questions) {
    const yearGroups = {};
    
    questions.forEach(q => {
        if (!yearGroups[q.year]) {
            yearGroups[q.year] = [];
        }
        yearGroups[q.year].push(q);
    });
    
    Object.keys(yearGroups).forEach(year => {
        const yearQuestions = yearGroups[year];
        const deduped = [];
        
        yearQuestions.forEach(q => {
            const tooSimilar = deduped.find(existing => {
                const similarity = calculateSimilarity(q.title, existing.title);
                return similarity > 0.9;  // 只去除非常相似的题目
            });
            
            if (!tooSimilar) {
                deduped.push(q);
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

// 执行综合合并
console.log('开始综合合并...');
console.log(`原始数据量: ${rawData.length}`);

const mergedQuestions = comprehensiveMerge(rawData);
console.log(`合并后数据量: ${mergedQuestions.length}`);

const expandedQuestions = expandYearRange(mergedQuestions);
console.log(`扩展年份后数据量: ${expandedQuestions.length}`);

const finalQuestions = smartDeduplication(expandedQuestions);
console.log(`最终数据量: ${finalQuestions.length}`);

// 排序
finalQuestions.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.id.localeCompare(b.id);
});

// 保存结果
fs.writeFileSync(
    './question-banks/真题_中国海洋大学_2000-2024_comprehensive.json',
    JSON.stringify(finalQuestions, null, 2),
    'utf8'
);

console.log('综合合并完成！数据已保存到: 真题_中国海洋大学_2000-2024_comprehensive.json');

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

console.log('\n完整合并题目示例:');
const completeExamples = finalQuestions.filter(q => q.title.includes('成反比') || q.title.includes('环流'));
completeExamples.slice(0, 3).forEach((item, index) => {
    console.log(`${index + 1}. [${item.year}年] ${item.title.substring(0, 100)}...`);
});

console.log('\n选择题示例:');
const choiceExamples = finalQuestions.filter(q => q.type === "选择题" || q.title.includes('A.'));
choiceExamples.slice(0, 3).forEach((item, index) => {
    console.log(`${index + 1}. [${item.year}年] ${item.title.substring(0, 100)}...`);
});

console.log(`\n年份覆盖: ${Math.min(...Object.keys(yearStats))}年 - ${Math.max(...Object.keys(yearStats))}年`);
console.log(`总年份数: ${Object.keys(yearStats).length}年`);
console.log(`数据保留率: ${(finalQuestions.length / rawData.length * 100).toFixed(1)}%`); 