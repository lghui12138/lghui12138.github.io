// 修复智能练习功能的核心问题

console.log('🔧 开始修复智能练习功能...');

// 问题1: 选择年份后没有练习按钮
// 解决方案: 确保 canStartPractice 计算属性正确工作

// 问题2: 选择2001年时加载全部题目
// 解决方案: 修复 smartLoadQuestions 中的年份筛选逻辑

// 问题3: 知识点和答案补全
// 解决方案: 确保生成函数正确调用

const fixes = {
    // 修复1: 智能练习按钮显示条件
    canStartPractice: `
    canStartPractice() {
        // 当选择了具体年份或分类时显示练习按钮
        const hasYear = this.filters.year && this.filters.year !== '' && this.filters.year !== '全部年份';
        const hasCategory = this.filters.category && this.filters.category !== '' && this.filters.category !== '全部类型';
        return hasYear || hasCategory;
    }`,
    
    // 修复2: 智能加载逻辑
    smartLoadQuestions: `
    async smartLoadQuestions() {
        if (!this.autoLoadEnabled) return;
        
        const category = this.filters.category;
        const year = this.filters.year;
        
        // 检查是否需要重新加载
        if (category === this.lastLoadedCategory && year === this.lastLoadedYear) {
            return;
        }
        
        this.loading = true;
        this.loadingText = '正在智能加载题目...';
        
        try {
            // 优先处理年份筛选 - 只加载指定年份的题目
            if (year && year !== '全部年份' && year !== 'all' && year !== '') {
                console.log('🎯 加载指定年份:', year);
                await this.loadRealExamQuestions(year);
            } else if (category === '历年真题') {
                console.log('🎯 加载历年真题');
                await this.loadRealExamQuestions('all');
            } else if (category === '易错题集') {
                console.log('🎯 加载易错题集');
                await this.loadErrorProneQuestions();
            } else if (category === '计算题集') {
                console.log('🎯 加载计算题集');
                await this.loadCalculationQuestions();
            } else if (category === '综合题集') {
                console.log('🎯 加载综合题集');
                await this.loadComprehensiveQuestions();
            } else {
                // 默认不自动加载
                this.questions = [];
                this.totalQuestions = 0;
                console.log('🎯 清空题目，等待用户选择');
            }
            
            this.lastLoadedCategory = category;
            this.lastLoadedYear = year;
            
        } catch (error) {
            console.error('智能加载失败:', error);
            this.showNotification('智能加载失败: ' + error.message, 'error');
        } finally {
            this.loading = false;
        }
    }`,
    
    // 修复3: 年份真题加载
    loadRealExamQuestions: `
    async loadRealExamQuestions(year = 'all') {
        console.log('📖 开始加载真题:', year);
        this.loading = true;
        this.loadingText = \`正在加载\${year === 'all' ? '历年' : year + '年'}真题...\`;
        
        try {
            const response = await fetch('../question-banks/真题_中国海洋大学_2000-2021_cleaned.json');
            if (!response.ok) {
                throw new Error('真题文件加载失败');
            }
            
            let questions = await response.json();
            console.log('📚 原始题目数量:', questions.length);
            
            // 关键修复: 根据年份筛选
            if (year && year !== 'all' && year !== '全部年份') {
                const selectedYear = parseInt(year);
                const beforeFilter = questions.length;
                questions = questions.filter(q => q.year === selectedYear);
                console.log(\`📅 筛选\${selectedYear}年真题: \${beforeFilter} -> \${questions.length}\`);
            }
            
            if (questions.length === 0) {
                throw new Error(\`未找到\${year === 'all' ? '' : year + '年'}的真题数据\`);
            }
            
            // 处理题目数据并补全信息
            this.questions = questions.map((q, index) => ({
                ...q,
                bankId: 'real-exam',
                bank: '历年真题',
                bankName: \`\${q.year}年真题\`,
                category: '历年真题',
                difficulty: this.getDifficultyByScore(q.score),
                
                // 补全选项
                options: q.options && q.options.length > 0 ? q.options : this.generateOptions(q),
                
                // 补全答案
                answer: q.answer || this.generateAnswer(q),
                
                // 补全解析
                explanation: q.explanation || this.generateExplanation(q),
                
                // 补全知识点
                knowledgePoints: q.tags || this.generateKnowledgePoints(q),
                
                // 添加题目序号
                questionNumber: index + 1
            }));
            
            this.totalQuestions = this.questions.length;
            console.log(\`✅ 成功加载: \${this.questions.length}题\`);
            
        } finally {
            this.loading = false;
        }
    }`
};

console.log('✅ 修复方案已准备完成！');
console.log('主要修复内容:');
console.log('1. 智能练习按钮显示条件');
console.log('2. 年份精确筛选逻辑');
console.log('3. 知识点和答案自动补全');

// 输出修复建议
console.log('\n📋 修复建议:');
console.log('1. 确保选择年份后立即显示练习按钮');
console.log('2. 选择2001年时只加载2001年的题目');
console.log('3. 自动补全缺失的知识点和答案信息'); 