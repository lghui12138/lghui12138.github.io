const fs = require('fs');
const path = require('path');

// 读取原始真题数据
const rawData = JSON.parse(fs.readFileSync('./question-banks/真题_中国海洋大学_2000-2021.json', 'utf8'));

// 检查是否是无意义的题目
function isInvalidQuestion(title) {
    const invalidPatterns = [
        /^科目代码[:：]/,
        /^科目名称[:：]/,
        /^[A-D]\.?\s*[^。]*$/,  // 只有选项内容
        /^[A-D]\.?\s*$/,        // 只有选项字母
        /^[一二三四五六七八九十]+、?\s*$/,  // 只有中文数字
        /^[0-9]+\.?\s*$/,       // 只有阿拉伯数字
        /^[0-9]+分\s*$/,        // 只有分数
        /^第[一二三四五六七八九十]+题\s*$/,  // 只有题号
        /^[（）\(\)]+$/,        // 只有括号
        /^[，。、；：！？""''（）【】\s]+$/,  // 只有标点符号
        /^述\s*$/,              // 只有"述"字
        /^[0-9]+\s*$/,          // 只有数字
        /^\s*$|^$|^null$/,      // 空白或null
        /^[A-D]\.会引起/,       // 选项内容
        /^[A-D]\.不会引起/,
        /^[A-D]\.引起/,
    ];
    
    return invalidPatterns.some(pattern => pattern.test(title.trim()));
}

// 检查题目是否被截断
function isTruncatedQuestion(title) {
    const truncatedPatterns = [
        /[，、]$/,              // 以逗号结尾
        /距离$/,                // 以"距离"结尾
        /成$/,                  // 以"成"结尾
        /的$/,                  // 以"的"结尾
        /为$/,                  // 以"为"结尾
        /有$/,                  // 以"有"结尾
        /在$/,                  // 以"在"结尾
        /与$/,                  // 以"与"结尾
        /及$/,                  // 以"及"结尾
        /求$/,                  // 以"求"结尾但没有问号
        /已知.*[^？。]$/,       // 以"已知"开头但没有完整结尾
        /试.*[^？。]$/,         // 以"试"开头但没有完整结尾
    ];
    
    return truncatedPatterns.some(pattern => pattern.test(title.trim()));
}

// 检查是否是题目的开始
function isQuestionStart(title) {
    const startPatterns = [
        /^[0-9]+\./,            // 1. 2. 3.
        /^[一二三四五六七八九十]+、/,  // 一、二、三、
        /^第[一二三四五六七八九十]+题/,  // 第一题
        /^[0-9]+\s*[．。]/,     // 1． 1。
        /^\([0-9]+\)/,          // (1) (2)
        /^已知.*[？。]/,        // 完整的已知题目
        /^设.*[？。]/,          // 完整的设题目
        /^试.*[？。]/,          // 完整的试题目
        /^求.*[？。]/,          // 完整的求题目
        /^计算.*[？。]/,        // 完整的计算题目
        /^证明.*[？。]/,        // 完整的证明题目
        /^讨论.*[？。]/,        // 完整的讨论题目
        /^分析.*[？。]/,        // 完整的分析题目
        /^什么.*[？。]/,        // 完整的什么题目
        /^如何.*[？。]/,        // 完整的如何题目
        /^为什么.*[？。]/,      // 完整的为什么题目
    ];
    
    return startPatterns.some(pattern => pattern.test(title.trim()));
}

// 清理和合并题目数据
function cleanRealExamData(data) {
    const cleanedData = [];
    let i = 0;
    
    while (i < data.length) {
        const item = data[i];
        let title = item.title.trim();
        
        // 跳过无意义的题目
        if (isInvalidQuestion(title)) {
            i++;
            continue;
        }
        
        // 如果是被截断的题目，尝试与后面的内容合并
        if (isTruncatedQuestion(title)) {
            let combinedTitle = title;
            let j = i + 1;
            
            // 向后查找最多3个条目进行合并
            while (j < data.length && j < i + 4) {
                const nextItem = data[j];
                const nextTitle = nextItem.title.trim();
                
                // 如果下一个是无意义的，跳过
                if (isInvalidQuestion(nextTitle)) {
                    j++;
                    continue;
                }
                
                // 如果下一个是新题目的开始，停止合并
                if (isQuestionStart(nextTitle)) {
                    break;
                }
                
                // 合并内容
                combinedTitle += ' ' + nextTitle;
                
                // 如果合并后的内容看起来完整了，停止合并
                if (/[？。！]$/.test(combinedTitle) || combinedTitle.length > 200) {
                    j++;
                    break;
                }
                
                j++;
            }
            
            // 如果合并后的题目有意义，添加到结果中
            if (combinedTitle.length > 20 && !isInvalidQuestion(combinedTitle)) {
                cleanedData.push({
                    ...item,
                    title: combinedTitle
                });
            }
            
            i = j;
        } else if (title.length > 15) {
            // 完整的题目，直接添加
            cleanedData.push(item);
            i++;
        } else {
            // 太短的题目，跳过
            i++;
        }
    }
    
    return cleanedData;
}

// 进一步清理数据
function furtherCleanData(data) {
    return data.filter(item => {
        const title = item.title.trim();
        
        // 最终过滤
        if (title.length < 20) return false;
        if (isInvalidQuestion(title)) return false;
        
        // 过滤掉明显不完整的题目
        if (!title.includes('？') && !title.includes('。') && !title.includes('！') && title.length < 50) {
            return false;
        }
        
        return true;
    }).map(item => {
        // 清理题目文本
        let cleanTitle = item.title
            .replace(/\s+/g, ' ')                    // 合并多个空格
            .replace(/^\s+|\s+$/g, '')               // 去除首尾空格
            .replace(/([。！？])\s*([。！？])/g, '$1') // 去除重复标点
            .replace(/\s*([。！？])\s*/g, '$1 ')     // 标点后加空格
            .trim();
        
        // 确保标签数组不为空
        if (!item.tags || item.tags.length === 0) {
            item.tags = ['流体力学基础'];
        }
        
        return {
            ...item,
            title: cleanTitle
        };
    });
}

// 执行清理
console.log('开始改进的真题数据清理...');
console.log(`原始题目数量: ${rawData.length}`);

const cleanedData = cleanRealExamData(rawData);
console.log(`第一次清理后题目数量: ${cleanedData.length}`);

const finalData = furtherCleanData(cleanedData);
console.log(`最终清理后题目数量: ${finalData.length}`);

// 保存清理后的数据
fs.writeFileSync(
    './question-banks/真题_中国海洋大学_2000-2021_cleaned.json', 
    JSON.stringify(finalData, null, 2), 
    'utf8'
);

console.log('清理完成！数据已保存到: 真题_中国海洋大学_2000-2021_cleaned.json');

// 显示一些示例
console.log('\n清理后的示例题目:');
finalData.slice(0, 10).forEach((item, index) => {
    console.log(`${index + 1}. [${item.year}年] ${item.title.substring(0, 80)}...`);
});

// 统计信息
const yearStats = {};
finalData.forEach(item => {
    yearStats[item.year] = (yearStats[item.year] || 0) + 1;
});

console.log('\n按年份统计:');
Object.keys(yearStats).sort().forEach(year => {
    console.log(`${year}年: ${yearStats[year]}题`);
}); 