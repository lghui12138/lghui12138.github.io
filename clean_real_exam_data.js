const fs = require('fs');
const path = require('path');

// 读取原始真题数据
const rawData = JSON.parse(fs.readFileSync('./question-banks/真题_中国海洋大学_2000-2021.json', 'utf8'));

// 清理和合并题目数据
function cleanRealExamData(data) {
    const cleanedData = [];
    let currentQuestion = null;
    let questionBuffer = [];
    
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const title = item.title.trim();
        
        // 检查是否是新的题目开始
        const isNewQuestion = /^[0-9]+\.|^[一二三四五六七八九十]+、|^[0-9]+分/.test(title);
        
        // 检查是否是选项
        const isOption = /^[A-D]\.|^[A-D]\s/.test(title);
        
        // 检查是否是题目的一部分（不完整的句子）
        const isIncomplete = title.length < 20 && !isOption && !isNewQuestion;
        
        if (isNewQuestion) {
            // 保存之前的题目
            if (currentQuestion && questionBuffer.length > 0) {
                currentQuestion.title = questionBuffer.join(' ');
                cleanedData.push(currentQuestion);
            }
            
            // 开始新题目
            currentQuestion = { ...item };
            questionBuffer = [title];
        } else if (isOption) {
            // 选项，添加到当前题目
            if (currentQuestion) {
                if (!currentQuestion.options) currentQuestion.options = [];
                currentQuestion.options.push(title);
            }
        } else if (isIncomplete && currentQuestion) {
            // 不完整的句子，可能是题目的一部分
            questionBuffer.push(title);
        } else {
            // 完整的独立题目
            if (currentQuestion && questionBuffer.length > 0) {
                currentQuestion.title = questionBuffer.join(' ');
                cleanedData.push(currentQuestion);
            }
            
            // 检查这个题目是否有意义
            if (title.length > 10 && !/^[A-D]\.|^[A-D]\s/.test(title)) {
                cleanedData.push(item);
            }
            
            currentQuestion = null;
            questionBuffer = [];
        }
    }
    
    // 保存最后一个题目
    if (currentQuestion && questionBuffer.length > 0) {
        currentQuestion.title = questionBuffer.join(' ');
        cleanedData.push(currentQuestion);
    }
    
    return cleanedData;
}

// 进一步清理数据
function furtherCleanData(data) {
    return data.filter(item => {
        const title = item.title.trim();
        
        // 过滤掉只有序号或数字的题目
        if (title.length < 15) return false;
        
        // 过滤掉只有选项的题目
        if (/^[A-D]\.|^[A-D]\s/.test(title)) return false;
        
        // 过滤掉只有标点符号的题目
        if (/^[，。、；：！？""''（）【】]+$/.test(title)) return false;
        
        // 过滤掉只有单个字符的题目
        if (title.length === 1) return false;
        
        return true;
    }).map(item => {
        // 清理题目文本
        let cleanTitle = item.title
            .replace(/\s+/g, ' ') // 合并多个空格
            .replace(/^\s+|\s+$/g, '') // 去除首尾空格
            .replace(/[，。、；：！？""''（）【】]+$/, '') // 去除末尾标点
            .replace(/^[，。、；：！？""''（）【】]+/, ''); // 去除开头标点
        
        return {
            ...item,
            title: cleanTitle
        };
    });
}

// 执行清理
console.log('开始清理真题数据...');
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
console.log('\n示例题目:');
finalData.slice(0, 5).forEach((item, index) => {
    console.log(`${index + 1}. ${item.title.substring(0, 100)}...`);
}); 