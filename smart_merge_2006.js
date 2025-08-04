const fs = require('fs');

// 读取数据文件
const dataFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate.json';
const questions = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

console.log('智能合并2006年的子问题...\n');

// 获取2006年的所有题目
const year2006Questions = questions.filter(q => q.year === 2006);
console.log(`2006年总题目数: ${year2006Questions.length}`);

// 按题目内容分组，找出相关的子问题
const questionGroups = [];

// 查找包含"用Euler观点写出下列情况下流体密度的数学表达式"的题目
const eulerQuestion = year2006Questions.find(q => 
    q.title.includes('用Euler观点写出下列情况下流体密度的数学表达式')
);

if (eulerQuestion) {
    const relatedSubs = year2006Questions.filter(q => 
        q.title.includes('均质流体') || 
        q.title.includes('不可压缩均质流体') || 
        q.title.includes('定常运动')
    );
    
    if (relatedSubs.length > 0) {
        questionGroups.push({
            main: eulerQuestion,
            subs: relatedSubs,
            description: 'Euler观点流体密度表达式'
        });
    }
}

// 查找包含"一维收缩管内的不可压缩流动"的题目
const pipeQuestion = year2006Questions.find(q => 
    q.title.includes('一维收缩管内的不可压缩流动')
);

if (pipeQuestion) {
    const relatedSubs = year2006Questions.filter(q => 
        q.title.includes('t=0 时刻位于x=xo 点的质点的运动方程') ||
        q.title.includes('拉格朗日表述的加速度')
    );
    
    if (relatedSubs.length > 0) {
        questionGroups.push({
            main: pipeQuestion,
            subs: relatedSubs,
            description: '一维收缩管流动'
        });
    }
}

// 查找选择题组
const choiceQuestions = year2006Questions.filter(q => 
    q.title.match(/^[A-D]\./) || 
    q.title.includes('体积流量') ||
    q.title.includes('质量流量')
);

if (choiceQuestions.length >= 4) {
    // 将选择题合并为一组
    const mainChoice = choiceQuestions[0];
    const subChoices = choiceQuestions.slice(1);
    
    questionGroups.push({
        main: mainChoice,
        subs: subChoices,
        description: '选择题组'
    });
}

// 查找其他可能的子问题组合
const otherSubs = year2006Questions.filter(q => 
    q.title.match(/^[0-9]+\)/) ||
    q.title.match(/^\([0-9]+\)/) ||
    q.title.includes('边界上的速度分布') ||
    q.title.includes('流体作用在上平板上的切应力') ||
    q.title.includes('拖动单位面积上平板外力做功功率')
);

if (otherSubs.length > 0) {
    // 尝试找到相关的主题目
    const mainForOthers = year2006Questions.find(q => 
        !q.title.match(/^[0-9]+\)/) &&
        !q.title.match(/^\([0-9]+\)/) &&
        !q.title.includes('均质流体') &&
        !q.title.includes('一维收缩管') &&
        !q.title.match(/^[A-D]\./)
    );
    
    if (mainForOthers) {
        questionGroups.push({
            main: mainForOthers,
            subs: otherSubs,
            description: '其他子问题组合'
        });
    }
}

console.log(`\n找到 ${questionGroups.length} 个题目组合：`);

questionGroups.forEach((group, index) => {
    console.log(`\n组合 ${index + 1}: ${group.description}`);
    console.log(`  主题目: ${group.main.title.substring(0, 60)}...`);
    console.log(`  子问题数: ${group.subs.length}`);
    group.subs.forEach((sub, subIndex) => {
        console.log(`    ${subIndex + 1}. ${sub.title.substring(0, 50)}...`);
    });
});

// 执行合并
const mergedQuestions = [];
const processedIds = new Set();

// 处理2006年的合并
questionGroups.forEach(group => {
    const mergedTitle = group.main.title + ' ' + group.subs.map(sub => sub.title).join(' ');
    const mergedTags = [...new Set([...group.main.tags, ...group.subs.flatMap(sub => sub.tags)])];
    
    const mergedQuestion = {
        ...group.main,
        title: mergedTitle,
        tags: mergedTags,
        subQuestions: group.subs.map(sub => sub.title)
    };
    
    mergedQuestions.push(mergedQuestion);
    processedIds.add(group.main.id);
    group.subs.forEach(sub => processedIds.add(sub.id));
});

// 添加其他未处理的2006年题目
year2006Questions.forEach(q => {
    if (!processedIds.has(q.id)) {
        mergedQuestions.push(q);
        processedIds.add(q.id);
    }
});

// 添加其他年份的题目
questions.forEach(q => {
    if (q.year !== 2006 && !processedIds.has(q.id)) {
        mergedQuestions.push(q);
    }
});

console.log(`\n合并结果:`);
console.log(`原始题目数: ${questions.length}`);
console.log(`合并后题目数: ${mergedQuestions.length}`);
console.log(`减少了 ${questions.length - mergedQuestions.length} 个题目`);

// 重新排序
mergedQuestions.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.id.localeCompare(b.id);
});

// 保存合并后的数据
const outputFile = './question-banks/真题_中国海洋大学_2000-2024_ultimate_smart_merged.json';
fs.writeFileSync(outputFile, JSON.stringify(mergedQuestions, null, 2), 'utf8');
console.log(`\n合并后的数据已保存到: ${outputFile}`);

// 统计2006年的题目
const year2006Merged = mergedQuestions.filter(q => q.year === 2006);
console.log(`\n2006年合并后题目数: ${year2006Merged.length}`);

// 统计合并后的年份分布
const yearStats = {};
mergedQuestions.forEach(q => {
    yearStats[q.year] = (yearStats[q.year] || 0) + 1;
});

console.log('\n合并后的年份分布:');
Object.keys(yearStats).sort().forEach(year => {
    console.log(`  ${year}年: ${yearStats[year]}题`);
});

console.log('\n智能合并完成！'); 