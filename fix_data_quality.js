const fs = require('fs');

// 读取数据文件
const dataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate.json';
const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('修复数据质量问题...\n');

// 1. 为没有标签的题目添加标签
const questionsWithTags = questions.map(q => {
    if (!q.tags || q.tags.length === 0) {
        // 根据题目内容自动添加标签
        const title = q.title.toLowerCase();
        const newTags = [];
        
        if (title.includes('粘性') || title.includes('粘度')) {
            newTags.push('粘性');
        }
        if (title.includes('管道') || title.includes('圆管')) {
            newTags.push('管道流动');
        }
        if (title.includes('流线') || title.includes('轨迹')) {
            newTags.push('流线轨迹');
        }
        if (title.includes('势流') || title.includes('速度势')) {
            newTags.push('势流');
        }
        if (title.includes('湍流') || title.includes('层流')) {
            newTags.push('湍流');
        }
        if (title.includes('边界层')) {
            newTags.push('边界层');
        }
        if (title.includes('压力') || title.includes('压强')) {
            newTags.push('压力');
        }
        if (title.includes('涡度') || title.includes('涡旋')) {
            newTags.push('涡度');
        }
        if (title.includes('雷诺数') || title.includes('reynolds')) {
            newTags.push('雷诺数');
        }
        if (title.includes('能量') || title.includes('伯努利')) {
            newTags.push('能量方程');
        }
        if (title.includes('自由面') || title.includes('水面')) {
            newTags.push('自由面');
        }
        if (title.includes('实验') || title.includes('量纲')) {
            newTags.push('实验与量纲');
        }
        if (title.includes('密度') || title.includes('不可压缩')) {
            newTags.push('流体性质');
        }
        if (title.includes('动量') || title.includes('冲量')) {
            newTags.push('动量方程');
        }
        
        // 如果没有找到特定标签，添加基础标签
        if (newTags.length === 0) {
            newTags.push('流体力学基础');
        }
        
        return {
            ...q,
            tags: newTags
        };
    }
    return q;
});

console.log(`为 ${questionsWithTags.length - questions.filter(q => q.tags && q.tags.length > 0).length} 个题目添加了标签`);

// 2. 去重处理
const uniqueQuestions = [];
const seenTitles = new Set();

questionsWithTags.forEach(q => {
    const normalizedTitle = q.title.trim().toLowerCase();
    if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueQuestions.push(q);
    }
});

console.log(`去重后题目数: ${uniqueQuestions.length} (删除了 ${questionsWithTags.length - uniqueQuestions.length} 个重复题目)`);

// 3. 检查2024年题目
const year2024Questions = uniqueQuestions.filter(q => q.year === 2024);
console.log(`\n2024年题目检查:`);
console.log(`2024年题目数: ${year2024Questions.length}`);
year2024Questions.forEach(q => {
    console.log(`  ${q.id}: ${q.title.substring(0, 50)}...`);
});

// 4. 重新排序
uniqueQuestions.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.id.localeCompare(b.id);
});

// 保存修复后的数据
const outputFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate_fixed.json';
fs.writeFileSync(outputFile, JSON.stringify(uniqueQuestions, null, 2), 'utf8');
console.log(`\n修复后的数据已保存到: ${outputFile}`);

// 统计修复后的数据
const yearStats = {};
uniqueQuestions.forEach(q => {
    yearStats[q.year] = (yearStats[q.year] || 0) + 1;
});

console.log('\n修复后的年份分布:');
Object.keys(yearStats).sort().forEach(year => {
    console.log(`  ${year}年: ${yearStats[year]}题`);
});

// 检查标签覆盖率
const questionsWithTagsCount = uniqueQuestions.filter(q => q.tags && q.tags.length > 0).length;
console.log(`\n标签覆盖率: ${questionsWithTagsCount}/${uniqueQuestions.length} (${(questionsWithTagsCount/uniqueQuestions.length*100).toFixed(1)}%)`);

console.log('\n数据质量修复完成！'); 