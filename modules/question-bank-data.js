/**
 * 题库数据管理模块
 * 负责题库数据的加载、筛选、搜索等功能
 */
window.QuestionBankData = (function() {
    // 私有变量
    let questionBanks = [];
    let filteredBanks = [];
    let currentFilters = {
        search: '',
        difficulty: '',
        tag: '',
        count: '',
        sort: 'default'
    };
    let currentPage = 1;
    let itemsPerPage = 6;
    
    // 题库数据源配置
    const DATA_SOURCES = {
        local: '../question-banks/',
        index: '../question-banks/index.json'
    };

    let practiceModulePromise = null;

    function notify(message, type, duration) {
        if (typeof showNotification === 'function') {
            showNotification(message, type, duration);
        }
    }

    function fetchWithTimeout(url, options = {}, timeoutMs = 3500) {
        if (typeof AbortController === 'undefined') {
            return fetch(url, options);
        }
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        return fetch(url, { ...options, signal: controller.signal })
            .finally(() => clearTimeout(timer));
    }

    function removeFailedPracticeScripts() {
        document.querySelectorAll('script[data-question-bank-practice-module],script[src$="question-bank-practice.js"]').forEach(script => {
            if (script.dataset.questionBankPracticeLoaded === 'true') return;
            if (script.parentNode) script.parentNode.removeChild(script);
        });
    }

    function ensurePracticeModule(options = {}) {
        if (window.QuestionBankPractice) {
            return Promise.resolve(window.QuestionBankPractice);
        }

        if (practiceModulePromise) {
            return practiceModulePromise;
        }

        if (!options.silent) {
            notify('正在加载练习模块...', 'info', 1800);
        }

        practiceModulePromise = new Promise((resolve, reject) => {
            let settled = false;
            const finish = () => {
                if (settled) return;
                if (window.QuestionBankPractice) {
                    settled = true;
                    resolve(window.QuestionBankPractice);
                } else {
                    fail();
                }
            };
            const fail = (script) => {
                if (settled) return;
                settled = true;
                if (script) {
                    script.dataset.questionBankPracticeFailed = 'true';
                    if (script.parentNode) script.parentNode.removeChild(script);
                }
                reject(new Error('练习模块脚本加载失败'));
            };
            let existing = document.querySelector('script[data-question-bank-practice-module],script[src$="question-bank-practice.js"]');

            if (existing) {
                if (existing.dataset.questionBankPracticeFailed === 'true') {
                    existing.parentNode && existing.parentNode.removeChild(existing);
                    existing = null;
                }
            }

            if (existing) {
                existing.addEventListener('load', finish, { once: true });
                existing.addEventListener('error', () => fail(existing), { once: true });
                setTimeout(() => {
                    if (!window.QuestionBankPractice) fail(existing);
                }, 8000);
                return;
            }

            const script = document.createElement('script');
            script.src = 'question-bank-practice.js';
            script.async = true;
            script.dataset.questionBankPracticeModule = 'true';
            script.onload = () => {
                script.dataset.questionBankPracticeLoaded = 'true';
                finish();
            };
            script.onerror = () => fail(script);
            document.head.appendChild(script);
        }).catch((error) => {
            practiceModulePromise = null;
            removeFailedPracticeScripts();
            console.error('练习模块加载失败:', error);
            notify('练习模块加载失败，请稍后重试', 'error', 4200);
            throw error;
        });

        return practiceModulePromise;
    }

    async function startPracticeSession(fullBank) {
        try {
            const practice = await ensurePracticeModule();
            if (practice && typeof practice.startPractice === 'function') {
                practice.startPractice(fullBank);
                return true;
            }
            notify('练习模块暂不可用', 'warning');
            return false;
        } catch (_) {
            return false;
        }
    }
    
    function normalizeTags(tags, category) {
        if (Array.isArray(tags) && tags.length) {
            return [...new Set(tags.map(tag => String(tag || '').trim()).filter(Boolean))];
        }
        if (category) {
            return [String(category).trim()];
        }
        return ['流体力学'];
    }

    function expandDiscoveryAliases(bank, tags) {
        const haystack = [
            bank.id,
            bank.name,
            bank.filename,
            bank.category,
            bank.description,
            tags.join(' ')
        ].filter(Boolean).join(' ');
        if (!/181103|资料内题目|181103-material-extracted/i.test(haystack)) {
            return tags;
        }
        return [...new Set([
            ...tags,
            '181103资料题',
            '181103讲义题',
            '181103习题',
            '181103例题',
            '181103答案线索',
            '181103自测',
            '讲义题',
            '资料题',
            '答案线索'
        ])];
    }

    function normalizeQuestionBankEntry(bank = {}) {
        const file = String(bank.filename || bank.file || '').trim();
        const category = String(bank.category || '').trim();
        const difficultyMap = {
            easy: 'easy',
            medium: 'medium',
            hard: 'hard',
            简单: 'easy',
            中等: 'medium',
            困难: 'hard'
        };
        const normalizedDifficulty = difficultyMap[String(bank.difficulty || '').trim()] || 'medium';
        const questionCount = Number(bank.questionCount || bank.count || bank.totalQuestions || (Array.isArray(bank.questions) ? bank.questions.length : 0) || 0);
        const fallbackName = file.replace(/^分类_/, '').replace(/^真题_/, '').replace(/\.json$/i, '') || category || '未命名题库';

        return {
            ...bank,
            filename: file,
            file: file || String(bank.file || '').trim(),
            id: String(bank.id || '').trim() || fallbackName.replace(/\s+/g, '-').toLowerCase(),
            name: String(bank.name || '').trim() || fallbackName,
            description: String(bank.description || bank.intro || '').trim() || category || '暂无简介',
            category: category || (file.includes('真题') ? '真题' : file.includes('易错') ? '易错题' : '流体力学'),
            difficulty: normalizedDifficulty,
            tags: expandDiscoveryAliases(bank, normalizeTags(bank.tags, category)),
            questionCount,
            count: questionCount,
            color: bank.color || null,
            lastUpdated: bank.lastUpdated || new Date().toISOString().split('T')[0]
        };
    }

    function getFilenameStem(value) {
        return String(value || '').trim().replace(/\.json$/i, '');
    }

    function getBankAliases(bank = {}) {
        const aliases = new Set();
        const id = String(bank.id || '').trim();
        const filename = String(bank.filename || bank.file || '').trim();
        const filenameStem = getFilenameStem(filename);

        if (id) aliases.add(id);
        if (filename) aliases.add(filename);
        if (filenameStem) aliases.add(filenameStem);

        return [...aliases];
    }

    function resolveBankId(bankId) {
        const target = String(bankId || '').trim();
        if (!target) {
            return '';
        }
        const matchedBank = questionBanks.find(bank => getBankAliases(bank).includes(target));
        return matchedBank ? matchedBank.id : target;
    }

    function favoriteMatchesBank(favoriteId, bank) {
        const normalizedFavoriteId = String(favoriteId || '').trim();
        return normalizedFavoriteId ? getBankAliases(bank).includes(normalizedFavoriteId) : false;
    }

    function normalizeFavoriteIds(favoriteIds = []) {
        const normalized = favoriteIds
            .map(item => resolveBankId(item))
            .filter(Boolean);
        return [...new Set(normalized)];
    }

    // 默认题库数据（作为备用）
    const DEFAULT_QUESTION_BANKS = [
        {
            id: 'fluid-basics',
            name: '流体力学基础',
            description: '流体的基本性质和概念',
            difficulty: 'easy',
            tags: ['基础', '概念'],
            questionCount: 25,
            color: '#4facfe',
            lastUpdated: '2024-01-15'
        },
        {
            id: 'momentum-equation',
            name: '动量方程',
            description: '流体动量方程的应用',
            difficulty: 'medium',
            tags: ['动量', '方程'],
            questionCount: 30,
            color: '#ff6b6b',
            lastUpdated: '2024-01-10'
        },
        {
            id: 'viscous-flow',
            name: '粘性流动',
            description: '粘性流体的运动规律',
            difficulty: 'hard',
            tags: ['粘性', '流动'],
            questionCount: 33,
            color: '#4ecdc4',
            lastUpdated: '2024-01-12'
        }
    ];

    const FLUID_CHAPTER_PRACTICE_BANKS = [
        { chapter: 1, title: '流体的物理性质', count: 10, tags: ['流体物性', '连续介质', '粘性'], color: '#0d9488' },
        { chapter: 2, title: '理想流体流动', count: 168, tags: ['Euler', 'Bernoulli', '理想流体'], color: '#2563eb' },
        { chapter: 3, title: '流体运动的基本方程组', count: 20, tags: ['连续方程', '动量方程', '守恒律'], color: '#7c3aed' },
        { chapter: 5, title: '流体的涡旋运动', count: 18, tags: ['涡量', '环量', 'Kelvin'], color: '#db2777' },
        { chapter: 6, title: '理想不可压缩流体无旋运动', count: 36, tags: ['势流', '流函数', '复势'], color: '#ea580c' },
        { chapter: 8, title: '粘性不可压缩流动', count: 97, tags: ['N-S', 'Re', '边界层'], color: '#0f766e' }
    ].map(item => ({
        id: `fluid-chapter-${item.chapter}-real-practice`,
        name: `第 ${item.chapter} 章 · ${item.title}`,
        description: `${item.count} 道映射真题，题卡回链知识点、公式条件和错因回查。`,
        difficulty: 'medium',
        tags: ['六章真题', '章节练习', ...item.tags],
        questionCount: item.count,
        count: item.count,
        color: item.color,
        category: '六章真题练习',
        lastUpdated: '2026-05-25',
        practiceUrl: `/modules/practice-dynamic.html?type=real&chapter=${item.chapter}&mode=normal&from=question-bank`,
        realExamUrl: `/modules/real-exams-dynamic.html?chapter=${item.chapter}&from=question-bank`,
        knowledgeUrl: `/modules/knowledge-detail.html?chapter=${item.chapter}`
    }));
    
    // 公有方法
    return {
        // 初始化模块
        init: function() {
            console.log('初始化题库数据模块...');
            this.loadQuestionBanks();
            this.bindEvents();
            return this;
        },
        
        // 加载题库数据
        loadQuestionBanks: async function() {
            try {
                console.log('开始加载题库数据...');

                let cachedData = null;
                const cachedIndex = localStorage.getItem('questionBankIndex');
                if (cachedIndex) {
                    try {
                        cachedData = JSON.parse(cachedIndex);
                        if (cachedData.questionBanks && cachedData.questionBanks.length > 0) {
                            questionBanks = cachedData.questionBanks
                                .map(normalizeQuestionBankEntry)
                                .filter(item => item.filename && !item.archived);
                            console.log(`从缓存加载了 ${questionBanks.length} 个题库`);
                        }
                    } catch (e) {
                        console.warn('缓存数据解析失败:', e);
                    }
                }

                const indexData = await this.loadFromIndex();
                if (indexData && indexData.questionBanks && indexData.questionBanks.length > 0) {
                    const fetchedUpdatedAt = indexData.updatedAt || indexData.lastUpdated || '';
                    const cachedUpdatedAt = cachedData?.updatedAt || cachedData?.lastUpdated || '';
                    const fetchedCount = indexData.statistics?.totalQuestions || 0;
                    const cachedCount = cachedData?.statistics?.totalQuestions || 0;
                    const shouldUseFetched = !cachedData
                        || !cachedData.questionBanks
                        || cachedData.questionBanks.length === 0
                        || fetchedUpdatedAt > cachedUpdatedAt
                        || fetchedCount !== cachedCount;

                    if (shouldUseFetched) {
                        questionBanks = indexData.questionBanks
                            .map(normalizeQuestionBankEntry)
                            .filter(item => item.filename && !item.archived);
                        localStorage.setItem('questionBankIndex', JSON.stringify(indexData));
                        console.log(`从索引文件刷新了 ${questionBanks.length} 个题库`);
                    }
                }

                if (questionBanks.length === 0) {
                    const localData = await this.loadFromLocal();
                    if (localData && localData.length > 0) {
                        questionBanks = localData;
                        console.log(`从本地文件加载了 ${questionBanks.length} 个题库`);
                    } else {
                        questionBanks = DEFAULT_QUESTION_BANKS;
                        console.log('使用默认题库数据');
                    }
                }
                
                this.processQuestionBanks();
                this.updateTagFilter();
                this.applyFilters();
                this.updateStats();
                this.applyUrlFocus();
                
            } catch (error) {
                console.error('加载题库数据失败:', error);
                if ([401, 402, 403, 404].includes(Number(error.status || 0))) {
                    questionBanks = [...FLUID_CHAPTER_PRACTICE_BANKS];
                    this.processQuestionBanks();
                    this.applyFilters();
                    showNotification(`题库索引不可用（HTTP ${error.status}），已保留六章章节练习入口`, 'error');
                    return;
                }
                questionBanks = DEFAULT_QUESTION_BANKS;
                this.processQuestionBanks();
                this.applyFilters();
                showNotification('题库数据加载失败，使用默认数据', 'warning');
            }
        },
        
        // 从索引文件加载
        loadFromIndex: async function() {
            try {
                const response = await fetchWithTimeout(`${DATA_SOURCES.index}?ts=${Date.now()}`, { cache: 'no-store' }, 3500);
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}`);
                    error.status = response.status;
                    throw error;
                }
                const data = await response.json();
                console.log('索引文件数据:', data);
                
                // 检查新格式的索引文件
                if (data.questionBanks && Array.isArray(data.questionBanks)) {
                    return {
                        ...data,
                        questionBanks: data.questionBanks
                            .map(normalizeQuestionBankEntry)
                            .filter(item => item.filename && !item.archived)
                    };
                }
                
                // 兼容旧格式
                if (Array.isArray(data)) {
                    return {
                        questionBanks: data
                            .map(normalizeQuestionBankEntry)
                            .filter(item => item.filename && !item.archived)
                    };
                }
                
                // 兼容其他格式
                if (data.real || data.chapter) {
                    const banks = [];
                    if (data.real) {
                        data.real.forEach(item => {
                            banks.push(normalizeQuestionBankEntry({
                                id: item.file.replace('.json', ''),
                                name: item.intro.split('，')[0],
                                description: item.intro,
                                difficulty: 'medium',
                                tags: ['真题', '考试'],
                                questionCount: 329,
                                color: '#4facfe',
                                lastUpdated: new Date().toISOString().split('T')[0],
                                filename: item.file,
                                category: '真题'
                            }));
                        });
                    }
                    if (data.chapter) {
                        data.chapter.forEach(item => {
                            banks.push(normalizeQuestionBankEntry({
                                id: item.file.replace('.json', ''),
                                name: item.intro.split('专题')[0] + '专题',
                                description: item.intro,
                                difficulty: 'medium',
                                tags: ['专题', '分类'],
                                questionCount: 30,
                                color: this.getRandomColor(),
                                lastUpdated: new Date().toISOString().split('T')[0],
                                filename: item.file,
                                category: '分类题库'
                            }));
                        });
                    }
                    return { questionBanks: banks };
                }
                
                return null;
            } catch (error) {
                console.log('索引文件加载失败:', error.message);
                return null;
            }
        },
        
        // 从本地文件加载
        loadFromLocal: async function() {
            const bankFiles = [
                '分类_流体力学基础.json',
                '分类_动量方程.json',
                '分类_粘性.json',
                '分类_压力.json',
                '分类_能量方程.json',
                '真题_中国海洋大学_2000-2024_fixed.json'
            ];
            
            const banks = [];
            for (const file of bankFiles) {
                try {
                    const response = await fetchWithTimeout(DATA_SOURCES.local + file, {}, 2500);
                    if (response.ok) {
                        const data = await response.json();
                        const bankInfo = this.extractBankInfo(file, data);
                        if (bankInfo) {
                            banks.push(bankInfo);
                        }
                    }
                } catch (error) {
                    console.log(`加载文件 ${file} 失败:`, error.message);
                }
            }
            return banks;
        },
        
        // 提取题库信息
        extractBankInfo: function(filename, data) {
            try {
                const questions = Array.isArray(data) ? data : data.questions || [];
                if (questions.length === 0) return null;
                
                const nameMatch = filename.match(/分类_(.+)\.json|真题_(.+)\.json/);
                const name = nameMatch ? (nameMatch[1] || nameMatch[2]) : filename;
                
                // 分析题目难度
                const difficulties = questions.map(q => q.difficulty || 'medium');
                const difficultyCount = difficulties.reduce((acc, d) => {
                    acc[d] = (acc[d] || 0) + 1;
                    return acc;
                }, {});
                
                const majorityDifficulty = Object.keys(difficultyCount)
                    .reduce((a, b) => difficultyCount[a] > difficultyCount[b] ? a : b);
                
                // 提取标签
                const tags = [...new Set(questions.flatMap(q => {
                    if (Array.isArray(q.tags) && q.tags.length) {
                        return q.tags;
                    }
                    if (q.category) {
                        return [q.category];
                    }
                    return ['流体力学'];
                }))];
                
                return {
                    id: filename.replace('.json', ''),
                    name: name,
                    description: `包含 ${questions.length} 道题目的题库`,
                    difficulty: majorityDifficulty,
                    tags: tags.slice(0, 3),
                    questionCount: questions.length,
                    color: this.getRandomColor(),
                    lastUpdated: new Date().toISOString().split('T')[0],
                    filename: filename,
                    questions: questions
                };
            } catch (error) {
                console.error('提取题库信息失败:', error);
                return null;
            }
        },
        
        // 处理题库数据
        processQuestionBanks: function() {
            questionBanks = questionBanks.map(bank => {
                const normalizedBank = normalizeQuestionBankEntry(bank);
                normalizedBank.color = normalizedBank.color || this.getRandomColor();
                return normalizedBank;
            });

            const existingIds = new Set(questionBanks.map(bank => bank.id));
            const chapterBanks = FLUID_CHAPTER_PRACTICE_BANKS
                .filter(bank => !existingIds.has(bank.id))
                .map(bank => normalizeQuestionBankEntry(bank));
            questionBanks = [...chapterBanks, ...questionBanks];
            
            filteredBanks = [...questionBanks];
        },
        
        // 获取随机颜色
        getRandomColor: function() {
            const colors = ['#4facfe', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
            return colors[Math.floor(Math.random() * colors.length)];
        },
        
        // 绑定事件
        bindEvents: function() {
            // 搜索框事件
            const searchInput = document.getElementById('questionBankSearch');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    currentFilters.search = e.target.value;
                    this.applyFilters();
                });
            }
            
            // 筛选器事件
            ['difficultyFilter', 'tagFilter', 'countFilter'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('change', () => {
                        this.updateFiltersFromUI();
                        this.applyFilters();
                    });
                }
            });
            
            // 清除筛选按钮
            const clearButton = document.getElementById('clearFilters');
            if (clearButton) {
                clearButton.addEventListener('click', () => {
                    this.clearFilters();
                });
            }
            
            // 功能按钮
            this.bindFunctionButtons();
            this.bind181103DiscoveryFilters();
        },

        bind181103DiscoveryFilters: function() {
            document.querySelectorAll('[data-round350-181103-discovery-filter]').forEach(button => {
                button.addEventListener('click', () => {
                    const search = String(button.dataset.search || button.textContent || '181103资料题').trim();
                    currentFilters.search = search;
                    currentFilters.difficulty = '';
                    currentFilters.tag = '';
                    currentFilters.count = '';
                    const searchInput = document.getElementById('questionBankSearch');
                    if (searchInput) searchInput.value = search;
                    ['difficultyFilter', 'tagFilter', 'countFilter'].forEach(id => {
                        const element = document.getElementById(id);
                        if (element) element.value = '';
                    });
                    this.applyFilters();
                    const list = document.getElementById('questionBanksList');
                    if (list) {
                        try { list.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) {}
                    }
                    notify(`已筛选「${search}」对应的 181103 资料题库`, 'success', 3000);
                });
            });
        },
        
        // 绑定功能按钮事件
        bindFunctionButtons: function() {
            const buttons = {
                'showAll': () => this.showAllBanks(),
                'showFavorites': () => this.showFavorites(),
                'showWrongQuestions': () => this.showWrongQuestions(),
                'manageFavorites': () => this.manageFavorites(),
                'showHelp': () => this.showHelp()
            };
            
            Object.entries(buttons).forEach(([id, handler]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('click', handler);
                }
            });
        },
        
        // 更新筛选器状态
        updateFiltersFromUI: function() {
            const elements = {
                'difficultyFilter': 'difficulty',
                'tagFilter': 'tag',
                'countFilter': 'count'
            };
            
            Object.entries(elements).forEach(([elementId, filterKey]) => {
                const element = document.getElementById(elementId);
                if (element) {
                    currentFilters[filterKey] = element.value;
                }
            });
        },
        
        // 更新标签筛选器
        updateTagFilter: function() {
            const tagFilter = document.getElementById('tagFilter');
            if (!tagFilter) return;
            
            // 收集所有标签
            const allTags = new Set();
            questionBanks.forEach(bank => {
                bank.tags.forEach(tag => allTags.add(tag));
            });
            
            // 清空并重新填充选项
            tagFilter.innerHTML = '<option value="">全部分类</option>';
            [...allTags].sort().forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                tagFilter.appendChild(option);
            });
        },

        // 渲染当前筛选摘要，帮助移动端用户确认自己正在看哪一组题库
        renderFilterSummary: function() {
            const summary = document.getElementById('filterSummary');
            if (!summary) return;

            const difficultyText = {
                easy: '简单',
                medium: '中等',
                hard: '困难'
            };
            const countText = {
                '0-10': '0-10题',
                '1-10': '1-10题',
                '10-50': '10-50题',
                '11-50': '11-50题',
                '50-100': '50-100题',
                '51-100': '51-100题',
                '100+': '100题以上'
            };
            const activeFilters = [];
            const keyword = String(currentFilters.search || '').trim();

            if (keyword) activeFilters.push(`关键词：${keyword}`);
            if (currentFilters.difficulty) activeFilters.push(`难度：${difficultyText[currentFilters.difficulty] || currentFilters.difficulty}`);
            if (currentFilters.tag) activeFilters.push(`分类：${currentFilters.tag}`);
            if (currentFilters.count) activeFilters.push(`题量：${countText[currentFilters.count] || currentFilters.count}`);

            const totalQuestions = filteredBanks.reduce((sum, bank) => sum + (Number(bank.questionCount) || 0), 0);
            summary.textContent = '';

            const main = document.createElement('div');
            main.className = 'filter-summary__main';

            const title = document.createElement('strong');
            title.textContent = `命中 ${filteredBanks.length}/${questionBanks.length} 个题库`;
            main.appendChild(title);

            const chips = document.createElement('span');
            chips.className = 'filter-summary__chips';
            (activeFilters.length ? activeFilters : ['全部题库']).forEach(label => {
                const chip = document.createElement('span');
                chip.className = 'filter-summary__chip';
                chip.textContent = label;
                chips.appendChild(chip);
            });
            main.appendChild(chips);

            const hint = document.createElement('span');
            hint.className = 'filter-summary__hint';
            hint.textContent = totalQuestions
                ? `约 ${totalQuestions} 道题；进入练习前先按题型、公式条件和易错点做一次预判。`
                : '没有命中题目时，先放宽关键词或题量筛选。';
            main.appendChild(hint);
            summary.appendChild(main);

            if (activeFilters.length) {
                const reset = document.createElement('button');
                reset.type = 'button';
                reset.className = 'filter-summary__reset';
                reset.textContent = '清空当前筛选';
                reset.addEventListener('click', () => this.clearFilters(), { once: true });
                summary.appendChild(reset);
            }
        },
        
        // 应用筛选
        applyFilters: function() {
            filteredBanks = questionBanks.filter(bank => {
                // 搜索筛选
                if (currentFilters.search) {
                    const searchTerm = currentFilters.search.toLowerCase().replace(/\s+/g, '');
                    const searchable = `${bank.id} ${bank.filename || bank.file || ''} ${bank.name} ${bank.description} ${bank.category} ${bank.tags.join(' ')}`.toLowerCase().replace(/\s+/g, '');
                    if (!searchable.includes(searchTerm)) {
                        return false;
                    }
                }
                
                // 难度筛选
                if (currentFilters.difficulty && bank.difficulty !== currentFilters.difficulty) {
                    return false;
                }
                
                // 标签筛选
                if (currentFilters.tag && !bank.tags.includes(currentFilters.tag)) {
                    return false;
                }
                
                // 题目数量筛选
                if (currentFilters.count) {
                    const count = bank.questionCount;
                    switch (currentFilters.count) {
                        case '0-10':
                        case '1-10':
                            if (count < 0 || count > 10) return false;
                            break;
                        case '10-50':
                        case '11-50':
                            if (count < 10 || count > 50) return false;
                            break;
                        case '50-100':
                        case '51-100':
                            if (count < 50 || count > 100) return false;
                            break;
                        case '100+':
                            if (count <= 100) return false;
                            break;
                    }
                }
                
                return true;
            });
            
            // 重置到第一页
            currentPage = 1;
            
            // 更新显示
            this.renderQuestionBanks();
            this.updatePagination();
            this.renderFilterSummary();
        },
        
        // 清除筛选
        clearFilters: function() {
            currentFilters = {
                search: '',
                difficulty: '',
                tag: '',
                count: '',
                sort: 'default'
            };
            
            // 清空UI
            ['questionBankSearch', 'difficultyFilter', 'tagFilter', 'countFilter'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.value = '';
                }
            });
            
            this.applyFilters();
            showNotification('已清除所有筛选条件', 'info');
        },

        applyUrlFocus: function() {
            let focusId = '';
            try {
                focusId = new URLSearchParams(location.search).get('focus') || '';
            } catch (_) {}
            if (!focusId) return false;

            const targetBank = questionBanks.find(bank => favoriteMatchesBank(focusId, bank) || bank.id === focusId);
            if (!targetBank) return false;

            filteredBanks = [targetBank];
            currentPage = 1;
            currentFilters.search = '181103';
            const searchInput = document.getElementById('questionBankSearch');
            if (searchInput) searchInput.value = '181103';
            this.renderQuestionBanks();
            this.updatePagination();
            this.renderFilterSummary();

            setTimeout(() => {
                const bankCard = document.querySelector(`[data-bank-id="${targetBank.id}"]`) || document.getElementById('questionBanksList');
                if (bankCard) {
                    try { bankCard.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
                }
            }, 120);
            if (typeof showNotification === 'function') {
                showNotification(`已定位到「${targetBank.name}」`, 'success', 3600);
            }
            return true;
        },
        
        // 渲染题库列表
        renderQuestionBanks: function() {
            const container = document.getElementById('questionBanksList');
            if (!container) return;
            
            if (filteredBanks.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; color: white; padding: 40px;">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                        <h3>没有找到匹配的题库</h3>
                        <p style="margin-top: 10px;">请尝试调整筛选条件或搜索关键词</p>
                    </div>
                `;
                return;
            }
            
            // 分页计算
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageData = filteredBanks.slice(startIndex, endIndex);
            
            // 生成HTML
            const banksHTML = pageData.map(bank => this.generateBankCard(bank)).join('');
            
            container.innerHTML = `
                <div class="qb-group">
                    ${banksHTML}
                </div>
            `;
        },
        
        // 生成题库卡片HTML
        generateBankCard: function(bank) {
            const difficultyText = {
                'easy': '简单',
                'medium': '中等',
                'hard': '困难'
            };
            
            const difficultyColor = {
                'easy': '#28a745',
                'medium': '#ffc107',
                'hard': '#dc3545'
            };
            
            const isFavorite = this.isFavorite(bank.id);
            const favoriteIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart';
            const favoriteColor = isFavorite ? '#ff6b6b' : '#ccc';
            const primaryAction = bank.practiceUrl
                ? `<a class="btn btn-primary" href="${bank.practiceUrl}"><i class="fas fa-play"></i> 章节练习</a>`
                : `<button class="btn btn-primary" onclick="QuestionBankData.startPractice('${bank.id}')"><i class="fas fa-play"></i> 开始练习</button>`;
            const secondaryAction = bank.sourceHtmlIndexUrl
                ? `<a class="btn btn-info" href="${bank.sourceHtmlIndexUrl}"><i class="fas fa-file-alt"></i> HTML资料</a>`
                : bank.realExamUrl
                ? `<a class="btn btn-info" href="${bank.realExamUrl}"><i class="fas fa-file-alt"></i> 真题包</a>`
                : `<button class="btn btn-info" onclick="QuestionBankData.previewBank('${bank.id}')"><i class="fas fa-eye"></i> 预览</button>`;
            const thirdAction = bank.knowledgeUrl
                ? `<a class="btn btn-success" href="${bank.knowledgeUrl}"><i class="fas fa-book-open"></i> 知识点</a>`
                : `<button class="btn btn-success" onclick="QuestionBankData.quickTest('${bank.id}')"><i class="fas fa-rocket"></i> 快速测试</button>`;
            const defaultPracticeCount = Number(bank.defaultPracticeQuestionCount ?? bank.questionCount ?? bank.qualityShowCount ?? 0);
            const sourceFirstCount = Number(bank.sourceFirstReviewQuestionCount ?? bank.questionCount ?? 0);
            const htmlQuestionCount = Number(bank.htmlQuestionFieldCount ?? bank.htmlQuestionCardCount ?? bank.materialHtmlQuestionCardCount ?? defaultPracticeCount);
            const highConfidenceCount = Number(bank.round371HighConfidenceQuestionCount ?? 0);
            const lowConfidenceCount = Number(bank.round371LowConfidenceQuestionCount ?? 0);
            const placeholderCount = Number(bank.unreadablePracticeQuestionCount ?? 0);
            const qualitySummary = bank.id === '181103-material-extracted'
                ? `<div class="qb-quality-ledger" data-181103-quality-ledger="1" style="margin-bottom:12px;display:flex;gap:6px;flex-wrap:wrap;font-size:.82em;">
                    <span style="background:#dcfce7;color:#166534;padding:3px 8px;border-radius:999px;">可刷题 ${defaultPracticeCount}</span>
                    <span style="background:#e0f2fe;color:#075985;padding:3px 8px;border-radius:999px;">HTML题面 ${htmlQuestionCount}</span>
                    <span style="background:#dcfce7;color:#166534;padding:3px 8px;border-radius:999px;">高置信 ${highConfidenceCount}</span>
                    <span style="background:#fee2e2;color:#991b1b;padding:3px 8px;border-radius:999px;">低置信 ${lowConfidenceCount}</span>
                    <span style="background:#fef3c7;color:#92400e;padding:3px 8px;border-radius:999px;">来源证据 ${sourceFirstCount}</span>
                    <span style="background:#e0f2fe;color:#075985;padding:3px 8px;border-radius:999px;">纯占位 ${placeholderCount}</span>
                    <span style="background:#ede9fe;color:#5b21b6;padding:3px 8px;border-radius:999px;">重复簇 ${bank.duplicateGroupCount || 0}</span>
                  </div>`
                : '';
            
            return `
                <div class="qb-card" data-bank-id="${bank.id}">
                    <div class="qb-card-header" style="background: linear-gradient(135deg, ${bank.color}, ${this.adjustColor(bank.color, -20)});">
                        ${bank.name}
                        <i class="${favoriteIcon}" 
                           style="position: absolute; top: 15px; right: 15px; color: ${favoriteColor}; cursor: pointer;"
                           onclick="QuestionBankData.toggleFavorite('${bank.id}')"
                           title="${isFavorite ? '取消收藏' : '添加收藏'}"></i>
                    </div>
                    <div class="qb-card-content">
                        <div class="qb-card-meta">
                            <span style="color: ${difficultyColor[bank.difficulty]}; font-weight: bold;">
                                ${difficultyText[bank.difficulty] || bank.difficulty}
                            </span>
                            <span>${bank.questionCount} 题</span>
                        </div>
                        <p style="margin-bottom: 15px; line-height: 1.4;">${bank.description}</p>
                        ${qualitySummary}
                        <div style="margin-bottom: 15px;">
                            ${bank.tags.map(tag => 
                                `<span style="background: #e9ecef; color: #495057; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 5px;">${tag}</span>`
                            ).join('')}
                        </div>
                        <div class="qb-card-actions">
                            ${primaryAction}
                            ${secondaryAction}
                            ${thirdAction}
                        </div>
                    </div>
                </div>
            `;
        },
        
        // 调整颜色亮度
        adjustColor: function(color, amount) {
            const usePound = color[0] === '#';
            const col = usePound ? color.slice(1) : color;
            const num = parseInt(col, 16);
            let r = (num >> 16) + amount;
            let g = (num >> 8 & 0x00FF) + amount;
            let b = (num & 0x0000FF) + amount;
            
            r = r > 255 ? 255 : r < 0 ? 0 : r;
            g = g > 255 ? 255 : g < 0 ? 0 : g;
            b = b > 255 ? 255 : b < 0 ? 0 : b;
            
            return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
        },
        
        // 更新分页
        updatePagination: function() {
            const container = document.getElementById('paginationControls');
            if (!container) return;
            
            const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);
            
            if (totalPages <= 1) {
                container.innerHTML = '';
                return;
            }
            
            let paginationHTML = '';
            
            // 上一页
            if (currentPage > 1) {
                paginationHTML += `
                    <button class="btn btn-info" onclick="QuestionBankData.goToPage(${currentPage - 1})" style="margin: 0 5px;">
                        <i class="fas fa-chevron-left"></i> 上一页
                    </button>
                `;
            }
            
            // 页码
            for (let i = 1; i <= totalPages; i++) {
                if (i === currentPage) {
                    paginationHTML += `
                        <button class="btn btn-primary" style="margin: 0 2px;">${i}</button>
                    `;
                } else {
                    paginationHTML += `
                        <button class="btn btn-info" onclick="QuestionBankData.goToPage(${i})" style="margin: 0 2px;">${i}</button>
                    `;
                }
            }
            
            // 下一页
            if (currentPage < totalPages) {
                paginationHTML += `
                    <button class="btn btn-info" onclick="QuestionBankData.goToPage(${currentPage + 1})" style="margin: 0 5px;">
                        下一页 <i class="fas fa-chevron-right"></i>
                    </button>
                `;
            }
            
            container.innerHTML = paginationHTML;
        },
        
        // 跳转页面
        goToPage: function(page) {
            currentPage = page;
            this.renderQuestionBanks();
            this.updatePagination();
        },
        
        // 更新统计信息
        updateStats: function() {
            const totalQuestions = questionBanks.reduce((sum, bank) => sum + bank.questionCount, 0);
            const totalBanks = questionBanks.length;
            
            const statsElements = {
                totalQuestions: ['totalQuestions', 'detailedTotalQuestions'],
                totalBanks: ['totalBanks'],
                favoriteCount: ['favoriteCount']
            };

            const statsValues = {
                totalQuestions,
                totalBanks,
                favoriteCount: this.getFavoriteCount()
            };
            
            Object.entries(statsElements).forEach(([key, ids]) => {
                ids.forEach((id) => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.textContent = statsValues[key];
                    }
                });
            });
        },
        
        // 功能方法
        showAllBanks: function() {
            this.clearFilters();
            showNotification('显示全部题库', 'info');
        },
        
        showFavorites: function() {
            const favoriteIds = this.getFavoriteIds();
            if (favoriteIds.length === 0) {
                showNotification('您还没有收藏任何题库', 'info');
                return;
            }

            const favoriteBanks = questionBanks.filter(bank => favoriteIds.includes(bank.id));
            if (favoriteBanks.length === 0) {
                showNotification('收藏的题库不存在或已被删除', 'warning');
                return;
            }

            filteredBanks = favoriteBanks;
            currentPage = 1;
            this.renderQuestionBanks();
            this.updatePagination();
            showNotification(`已切换到收藏题库，共 ${favoriteBanks.length} 个`, 'info');
        },
        
        showWrongQuestions: function() {
            // 这里应该调用用户模块的错题功能
            if (typeof QuestionBankUser !== 'undefined') {
                QuestionBankUser.showWrongQuestions();
            } else {
                showNotification('错题本功能模块未加载', 'warning');
            }
        },
        
        manageFavorites: function() {
            const favoriteIds = this.getFavoriteIds();
            const favoriteBanks = questionBanks.filter(bank => favoriteIds.includes(bank.id));

            const existingModal = document.getElementById('favoriteManagerModal');
            if (existingModal) {
                existingModal.remove();
            }

            const modal = document.createElement('div');
            modal.id = 'favoriteManagerModal';
            modal.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.72);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
                padding: 20px;
            `;

            const emptyState = `
                <div style="text-align:center;color:#666;padding:24px 0;">
                    <div style="font-size:2rem;margin-bottom:12px;">⭐</div>
                    <div>当前还没有收藏题库</div>
                </div>
            `;

            const listHtml = favoriteBanks.map(bank => `
                <div style="border:1px solid #e5e7eb;border-radius:12px;padding:14px 16px;margin-bottom:12px;background:#f8fbff;">
                    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
                        <div>
                            <div style="font-weight:700;color:#0f172a;margin-bottom:6px;">${bank.name}</div>
                            <div style="font-size:0.92rem;color:#475569;line-height:1.5;">${bank.description || `${bank.questionCount} 道题`}</div>
                            <div style="font-size:0.85rem;color:#64748b;margin-top:8px;">${bank.questionCount} 题 · ${bank.tags.join(' / ')}</div>
                        </div>
                        <div style="display:flex;gap:8px;flex-shrink:0;">
                            <button class="btn btn-info" onclick="QuestionBankData.focusFavoriteBank('${bank.id}')">定位题库</button>
                            <button class="btn btn-danger" onclick="QuestionBankData.removeFavoriteAndRefresh('${bank.id}')">取消收藏</button>
                        </div>
                    </div>
                </div>
            `).join('');

            modal.innerHTML = `
                <div style="width:min(760px, 100%);max-height:80vh;overflow:auto;background:#fff;border-radius:18px;padding:24px;box-shadow:0 20px 60px rgba(15,23,42,.35);">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:18px;">
                        <div>
                            <h3 style="margin:0;color:#0f172a;">📋 收藏管理</h3>
                            <p style="margin:8px 0 0;color:#64748b;">可直接定位到收藏题库，或在这里取消收藏。</p>
                        </div>
                        <button class="btn btn-warning" onclick="QuestionBankData.closeFavoriteManager()">关闭</button>
                    </div>
                    ${favoriteBanks.length ? listHtml : emptyState}
                </div>
            `;

            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.remove();
                }
            });

            document.body.appendChild(modal);
        },
        
        showHelp: function() {
            const helpContent = `
                <div style="text-align: left;">
                    <h4>🔍 搜索功能</h4>
                    <p>• 支持题库名称、描述、标签搜索</p>
                    <p>• 支持模糊匹配</p>
                    
                    <h4>⚙️ 筛选功能</h4>
                    <p>• 按难度筛选：简单、中等、困难</p>
                    <p>• 按分类筛选：不同知识点分类</p>
                    <p>• 按题目数量筛选</p>
                    
                    <h4>⭐ 收藏功能</h4>
                    <p>• 点击心形图标收藏题库</p>
                    <p>• 查看我的收藏列表</p>
                    
                    <h4>🎯 练习模式</h4>
                    <p>• 开始练习：完整练习模式</p>
                    <p>• 预览：查看题库详情</p>
                    <p>• 快速测试：随机选题测试</p>
                </div>
            `;
            
            showNotification(helpContent, 'info', 8000);
        },
        
        // 收藏相关方法
        getFavoriteIds: function() {
            let favorites = [];

            if (typeof QuestionBankUser !== 'undefined' && typeof QuestionBankUser.getFavorites === 'function') {
                favorites = QuestionBankUser.getFavorites();
            } else {
                try {
                    const storedFavorites = JSON.parse(localStorage.getItem('favoriteBanks') || '[]');
                    if (Array.isArray(storedFavorites)) {
                        favorites = storedFavorites.map(item => typeof item === 'string' ? item : item?.id).filter(Boolean);
                    }
                } catch (error) {
                    console.warn('读取收藏数据失败:', error);
                    return [];
                }
            }

            const normalizedFavorites = normalizeFavoriteIds(favorites);
            if (questionBanks.length > 0
                && normalizedFavorites.length > 0
                && typeof QuestionBankUser !== 'undefined'
                && typeof QuestionBankUser.replaceFavorites === 'function'
                && JSON.stringify(normalizedFavorites) !== JSON.stringify(favorites)) {
                QuestionBankUser.replaceFavorites(normalizedFavorites, { silent: true });
            }

            return normalizedFavorites;
        },
        
        isFavorite: function(bankId) {
            const resolvedBankId = resolveBankId(bankId);
            return this.getFavoriteIds().includes(resolvedBankId);
        },
        
        toggleFavorite: function(bankId) {
            const resolvedBankId = resolveBankId(bankId);
            if (typeof QuestionBankUser !== 'undefined' && typeof QuestionBankUser.toggleFavorite === 'function') {
                QuestionBankUser.toggleFavorite(resolvedBankId);
            } else {
                const favorites = this.getFavoriteIds();
                const index = favorites.indexOf(resolvedBankId);
                
                if (index > -1) {
                    favorites.splice(index, 1);
                    showNotification('已取消收藏', 'info');
                } else {
                    favorites.push(resolvedBankId);
                    showNotification('已添加收藏', 'success');
                }
                
                localStorage.setItem('favoriteBanks', JSON.stringify(favorites));
            }
            
            this.renderQuestionBanks(); // 重新渲染以更新心形图标
            this.updateStats();
            if (typeof QuestionBankStats !== 'undefined' && typeof QuestionBankStats.updateStats === 'function') {
                QuestionBankStats.updateStats();
            }
        },
        
        getFavoriteCount: function() {
            if (typeof QuestionBankUser !== 'undefined' && typeof QuestionBankUser.getFavoriteCount === 'function') {
                return QuestionBankUser.getFavoriteCount();
            }
            return this.getFavoriteIds().length;
        },

        closeFavoriteManager: function() {
            const modal = document.getElementById('favoriteManagerModal');
            if (modal) {
                modal.remove();
            }
        },

        focusFavoriteBank: function(bankId) {
            this.closeFavoriteManager();
            const resolvedBankId = resolveBankId(bankId);
            const targetBank = questionBanks.find(bank => favoriteMatchesBank(resolvedBankId, bank));
            if (!targetBank) {
                showNotification('收藏题库不存在或已被删除', 'warning');
                return;
            }

            filteredBanks = [targetBank];
            currentPage = 1;
            this.renderQuestionBanks();
            this.updatePagination();

            const searchInput = document.getElementById('questionBankSearch');
            if (searchInput) {
                searchInput.value = '';
            }

            const bankCard = document.querySelector(`[data-bank-id="${targetBank.id}"]`);
            if (bankCard) {
                bankCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            showNotification(`已定位到收藏题库「${targetBank.name}」`, 'success');
        },

        removeFavoriteAndRefresh: function(bankId) {
            this.toggleFavorite(bankId);
            if (this.isFavorite(bankId)) {
                return;
            }
            this.manageFavorites();
        },
        
        // 题库操作方法
        startPractice: async function(bankId) {
            const resolvedBankId = resolveBankId(bankId);
            const bank = questionBanks.find(b => favoriteMatchesBank(resolvedBankId, b));
            if (!bank) {
                showNotification('题库不存在', 'error');
                return;
            }
            if (bank.practiceUrl) {
                location.href = bank.practiceUrl;
                return;
            }
            
            // 显示选择模式对话框
            this.showPracticeOptions(bank);
        },
        
        // 显示练习选项
        showPracticeOptions: async function(bank) {
            try {
                showNotification('正在加载题库数据...', 'info');
                
                // 加载题库的具体题目数据
                const questions = await this.loadBankQuestions(bank);
                if (!questions || questions.length === 0) {
                    showNotification('该题库没有可用的题目', 'warning');
                    return;
                }
                
                // 获取年份列表
                const years = this.getBankYears(questions);
                const isMaterial181103 = bank.id === '181103-material-extracted';
                const defaultPracticeQuestions = this.getDefaultPracticeQuestions(questions);
                const reviewCount = isMaterial181103
                    ? questions.filter(q => q && q.sourceFirstReview === true).length
                    : questions.filter(q => q && q.defaultVisible !== true).length;
                const htmlQuestionCount = isMaterial181103
                    ? questions.filter(q => q && (q.questionHtml || q.promptHtml)).length
                    : 0;
                const highConfidenceCount = isMaterial181103
                    ? questions.filter(q => q && q.questionTextConfidence === 'high').length
                    : 0;
                const lowConfidenceCount = isMaterial181103
                    ? questions.filter(q => q && q.questionTextConfidence === 'low').length
                    : 0;
                const placeholderCount = isMaterial181103
                    ? questions.filter(q => q && !(q.questionHtml || q.promptHtml)).length
                    : 0;
                const defaultButtonStyle = defaultPracticeQuestions.length
                    ? 'width: 100%; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;'
                    : 'width: 100%; padding: 10px; background: #9ca3af; color: white; border: none; border-radius: 5px; cursor: not-allowed; margin-bottom: 10px;';
                const defaultButtonDisabled = defaultPracticeQuestions.length === 0 ? 'disabled aria-disabled="true"' : '';
                
                // 创建选择对话框
                const dialog = document.createElement('div');
                dialog.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                `;
                
                const content = document.createElement('div');
                content.style.cssText = `
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                `;
                
                content.innerHTML = `
                    <h3 style="margin: 0 0 20px 0; color: #333;">选择练习模式</h3>
                    <p style="margin: 0 0 20px 0; color: #666;">题库: ${bank.name} (共${questions.length}题)</p>
                    ${isMaterial181103 ? `
                    <div data-181103-practice-quality-panel="1" style="margin:0 0 18px 0;padding:12px 14px;border:1px solid #fde68a;background:#fffbeb;color:#78350f;border-radius:10px;line-height:1.55;">
                        181103 资料内 ${questions.length} 题已生成 ${htmlQuestionCount} 条 HTML 题面；${highConfidenceCount} 题为高置信文本，${lowConfidenceCount} 题仍需逐题核对，来源 HTML/页图只作证据，非题面替代；无 HTML 题面占位 ${placeholderCount} 题。
                    </div>` : ''}

                    <div style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">📚 完整练习</h4>
                        <button onclick="QuestionBankData.startFullPractice('${bank.id}')" ${defaultButtonDisabled}
                                style="${defaultButtonStyle}">
                            ${isMaterial181103 ? `练习 181103 全部 ${defaultPracticeQuestions.length || questions.length} 题` : `练习全部 ${questions.length} 题`}
                        </button>
                        ${isMaterial181103 ? `<button data-181103-practice-all="1" onclick="QuestionBankData.startAllMaterialPractice('${bank.id}')"
                                style="width: 100%; padding: 10px; background: #7c3aed; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            HTML题面刷全部 ${questions.length} 题
                        </button>` : ''}
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">🎲 随机练习</h4>
                        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                            <input type="number" id="randomCount" value="5" min="1" max="${questions.length}" 
                                   style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
                            <button onclick="QuestionBankData.startRandomPractice('${bank.id}')" 
                                    style="flex: 1; padding: 8px; background: #2196F3; color: white; border: none; border-radius: 3px; cursor: pointer;">
                                随机练习
                            </button>
                        </div>
                    </div>
                    
                    ${years.length > 0 ? `
                    <div style="margin-bottom: 20px;">
                        <h4 style="margin: 0 0 10px 0; color: #333;">📅 按年份练习</h4>
                        <select id="yearSelect" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; margin-bottom: 10px;">
                            <option value="">选择年份</option>
                            ${years.map(year => `<option value="${year}">${year}年</option>`).join('')}
                        </select>
                        <button onclick="QuestionBankData.startYearPractice('${bank.id}')" 
                                style="width: 100%; padding: 8px; background: #FF9800; color: white; border: none; border-radius: 3px; cursor: pointer;">
                            按年份练习
                        </button>
                    </div>
                    ` : ''}
                    
                    <button onclick="this.closest('.practice-dialog').remove()" 
                            style="width: 100%; padding: 10px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        取消
                    </button>
                `;
                
                dialog.appendChild(content);
                dialog.className = 'practice-dialog';
                document.body.appendChild(dialog);
                
                // 存储题库数据供后续使用
                window.currentBankData = {
                    bank: bank,
                    questions: questions,
                    defaultPracticeQuestions: defaultPracticeQuestions,
                    years: years
                };
                
            } catch (error) {
                console.error('加载题库数据失败:', error);
                showNotification('加载题库数据失败', 'error');
            }
        },
        
        // 开始完整练习
        startFullPractice: async function(bankId) {
            const bankData = window.currentBankData;
            if (!bankData) {
                showNotification('题库数据未加载', 'error');
                return;
            }
            
            const fullBank = {
                ...bankData.bank,
                questions: bankData.defaultPracticeQuestions && bankData.defaultPracticeQuestions.length
                    ? bankData.defaultPracticeQuestions
                    : bankData.questions
            };
            if (bankData.bank && bankData.bank.id === '181103-material-extracted' && (!bankData.defaultPracticeQuestions || bankData.defaultPracticeQuestions.length === 0)) {
                fullBank.questions = bankData.questions;
                fullBank.practiceIncludesOcrReview = true;
            }
            
            // 移除对话框
            document.querySelector('.practice-dialog')?.remove();
            
            await startPracticeSession(fullBank);
        },

        startAllMaterialPractice: async function(bankId) {
            const bankData = window.currentBankData;
            if (!bankData) {
                showNotification('题库数据未加载', 'error');
                return;
            }
            const fullBank = {
                ...bankData.bank,
                questions: bankData.questions,
                practiceIncludesOcrReview: true
            };
            document.querySelector('.practice-dialog')?.remove();
            await startPracticeSession(fullBank);
        },
        
        // 开始随机练习
        startRandomPractice: async function(bankId) {
            const bankData = window.currentBankData;
            if (!bankData) {
                showNotification('题库数据未加载', 'error');
                return;
            }
            
            const count = parseInt(document.getElementById('randomCount').value) || 5;
            const pool = bankData.defaultPracticeQuestions && bankData.defaultPracticeQuestions.length
                ? bankData.defaultPracticeQuestions
                : bankData.questions;
            if (bankData.bank && bankData.bank.id === '181103-material-extracted' && (!bankData.defaultPracticeQuestions || bankData.defaultPracticeQuestions.length === 0)) {
                showNotification('181103 随机练习使用 522 题 HTML 题面；来源页仅作核对证据。', 'info');
            }
            const randomQuestions = this.getRandomQuestions(pool, count);
            
            const fullBank = {
                ...bankData.bank,
                questions: randomQuestions
            };
            
            // 移除对话框
            document.querySelector('.practice-dialog')?.remove();
            
            await startPracticeSession(fullBank);
        },
        
        // 开始按年份练习
        startYearPractice: async function(bankId) {
            const bankData = window.currentBankData;
            if (!bankData) {
                showNotification('题库数据未加载', 'error');
                return;
            }
            
            const selectedYear = document.getElementById('yearSelect').value;
            if (!selectedYear) {
                showNotification('请选择年份', 'warning');
                return;
            }
            
            const yearQuestions = this.filterQuestionsByYear(bankData.questions, selectedYear);
            if (yearQuestions.length === 0) {
                showNotification(`${selectedYear}年没有题目`, 'warning');
                return;
            }
            
            const fullBank = {
                ...bankData.bank,
                questions: yearQuestions
            };
            
            // 移除对话框
            document.querySelector('.practice-dialog')?.remove();
            
            await startPracticeSession(fullBank);
        },
        
        // 加载题库题目数据
        loadBankQuestions: async function(bank) {
            if (!bank.filename) {
                console.error('题库缺少文件名:', bank);
                return [];
            }
            const isMaterial181103Bank = bank.id === '181103-material-extracted' || bank.filename === '181103-material-extracted.json';
            const localQuestionBankTimeoutMs = isMaterial181103Bank ? 30000 : 2500;
            const remoteQuestionBankTimeoutMs = isMaterial181103Bank ? 20000 : 3500;
            
            try {
                // 获取保存的GitHub配置
                const savedConfig = localStorage.getItem('github_api_config');
                const GITHUB_CONFIG = savedConfig ? JSON.parse(savedConfig) : {
                    owner: 'lghui12138',
                    repo: 'lghui12138.github.io',
                    branch: 'main',
                    rawBaseUrl: 'https://raw.githubusercontent.com/lghui12138/lghui12138.github.io/main'
                };
                // 优先从同源本地文件系统加载，避免 raw.githubusercontent.com 慢请求导致页面长时间空白。
                console.log(`📁 从本地文件系统加载题库: ${bank.filename}`);
                let response;
                const paths = [
                    `/question-banks/${bank.filename}`,
                    `../question-banks/${bank.filename}`,
                    `../../question-banks/${bank.filename}`,
                    `question-banks/${bank.filename}`
                ];
                
                for (const path of paths) {
                    try {
                        response = await fetchWithTimeout(path, { cache: isMaterial181103Bank ? 'no-store' : 'default' }, localQuestionBankTimeoutMs);
                        if (response.ok) {
                            console.log(`✅ 成功从路径加载: ${path}`);
                            break;
                        }
                    } catch (e) {
                        console.log(`路径 ${path} 失败:`, e.message);
                    }
                }
                
                if (!response || !response.ok) {
                    try {
                        console.log(`🌐 尝试从GitHub直接访问题库: ${bank.filename}`);
                        const githubUrl = `${GITHUB_CONFIG.rawBaseUrl}/question-banks/${bank.filename}`;
                        response = await fetchWithTimeout(githubUrl, {}, remoteQuestionBankTimeoutMs);
                        if (response.ok) {
                            console.log(`✅ 从GitHub成功加载题库: ${bank.name}`);
                        } else {
                            console.warn(`⚠️ GitHub文件不存在: ${bank.filename}`);
                        }
                    } catch (githubError) {
                        console.warn(`⚠️ 从GitHub加载题库失败: ${bank.filename}`, githubError.message);
                    }
                }

                if (!response || !response.ok) {
                    throw new Error(`无法加载文件: ${bank.filename}`);
                }
                
                const data = await response.json();
                console.log(`加载题库 ${bank.name} 数据:`, data);
                console.log(`数据类型:`, typeof data);
                console.log(`是否为数组:`, Array.isArray(data));
                console.log(`数据长度:`, Array.isArray(data) ? data.length : 'N/A');
                
                // 处理不同格式的数据
                if (Array.isArray(data)) {
                    console.log(`返回数组数据，长度: ${data.length}`);
                    return data;
                } else if (data.questions && Array.isArray(data.questions)) {
                    console.log(`返回questions数组，长度: ${data.questions.length}`);
                    return data.questions;
                } else {
                    console.warn('题库数据格式未知:', data);
                    console.warn('数据键:', Object.keys(data || {}));
                    return [];
                }
                
            } catch (error) {
                console.error(`加载题库 ${bank.name} 失败:`, error);
                return [];
            }
        },

        hasMaterialOcrGarble: function(question) {
            if (!question || typeof question !== 'object') return false;
            const is181103Material = question.extractedFromMaterial === true
                && /\/resources\/fluid-181103-html\/materials\//.test(String(question.sourceHtmlUrl || ''));
            const flags = Array.isArray(question.qualityFlags) ? question.qualityFlags.join(' ') : '';
            const reviewReason = Array.isArray(question.ocrReviewReason) ? question.ocrReviewReason.join(' ') : '';
            const text = [
                question.question,
                question.title,
                question.answer,
                question.explanation,
                flags,
                reviewReason
            ].filter(Boolean).join('\n');
            return is181103Material && (
                question.qualityTier === 'ocr-review'
                || question.qualityTier === 'hide'
                || question.defaultHidden === true
                || /round356-default-practice-blocked|embedded-equation-placeholder|font-table-noise|low-ocr-score|latin-symbol-noise|EMBED\s+Equation|DSMT4|high-resolution\s+ja\s+JP|501\s+501\s+\d{4,}|[�□■]|\?{2,}/i.test(text)
            );
        },

        getDefaultPracticeQuestions: function(questions) {
            if (!Array.isArray(questions)) return [];
            const has181103Material = questions.some(question => question && question.extractedFromMaterial === true
                && /\/resources\/fluid-181103-html\/materials\//.test(String(question.sourceHtmlUrl || '')));
            if (has181103Material) {
                return questions.filter(question => question && typeof question === 'object' && (question.questionHtml || question.promptHtml));
            }
            const visible = questions.filter(question => {
                if (!question || typeof question !== 'object') return false;
                if (question.defaultVisible === false || question.defaultHidden === true) return false;
                if (question.qualityTier === 'ocr-review') return false;
                if (question.qualityTier === 'hide') return false;
                if (question.duplicatePrimary === false) return false;
                if (this.hasMaterialOcrGarble(question)) return false;
                return true;
            });
            return visible.length ? visible : questions;
        },
        
        // 按年份筛选题目
        filterQuestionsByYear: function(questions, year) {
            if (!year) return questions;
            return questions.filter(q => q.year === parseInt(year));
        },
        
        // 随机选择题目
        getRandomQuestions: function(questions, count) {
            if (!questions || questions.length === 0) return [];
            if (count >= questions.length) return questions;
            
            const shuffled = [...questions].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        },
        
        // 获取题库年份列表
        getBankYears: function(questions) {
            if (!questions || questions.length === 0) return [];
            
            const years = [...new Set(questions.map(q => q.year).filter(y => y))];
            return years.sort((a, b) => a - b);
        },
        
        previewBank: async function(bankId) {
            const bank = questionBanks.find(b => b.id === bankId);
            if (!bank) {
                showNotification('题库不存在', 'error');
                return;
            }
            if (bank.realExamUrl) {
                location.href = bank.realExamUrl;
                return;
            }
            
            try {
                const questions = await this.loadBankQuestions(bank);
                const previewCount = Math.min(3, questions.length);
                const previewQuestions = questions.slice(0, previewCount);
                
                let previewContent = `题库: ${bank.name}\n题目数量: ${questions.length}题\n\n预览题目:\n\n`;
                
                previewQuestions.forEach((q, index) => {
                    previewContent += `${index + 1}. ${q.title}\n`;
                    if (q.options && q.options.length > 0) {
                        previewContent += `选项: ${q.options.join(', ')}\n`;
                    }
                    previewContent += '\n';
                });
                
                showNotification(previewContent, 'info', 10000);
                
            } catch (error) {
                console.error('预览题库失败:', error);
                showNotification('预览题库失败', 'error');
            }
        },
        
        quickTest: async function(bankId) {
            const bank = questionBanks.find(b => b.id === bankId);
            if (!bank) {
                showNotification('题库不存在', 'error');
                return;
            }
            if (bank.practiceUrl) {
                location.href = bank.practiceUrl.replace('mode=normal', 'mode=random');
                return;
            }
            
            try {
                const questions = await this.loadBankQuestions(bank);
                if (!questions || questions.length === 0) {
                    showNotification('该题库没有可用的题目', 'warning');
                    return;
                }
                
                const practicePool = bank.id === '181103-material-extracted'
                    ? this.getDefaultPracticeQuestions(questions)
                    : questions;
                if (!practicePool || practicePool.length === 0) {
                    showNotification('该题库没有可用的题目', 'warning');
                    return;
                }

                // 随机选择5道题进行快速测试
                const shuffled = [...practicePool].sort(() => 0.5 - Math.random());
                const quickQuestions = shuffled.slice(0, 5);
                
                const fullBank = {
                    ...bank,
                    questions: quickQuestions
                };
                
                await startPracticeSession(fullBank);
                
            } catch (error) {
                console.error('快速测试失败:', error);
                showNotification('快速测试失败', 'error');
            }
        },
        
        // 获取题库数据
        ensurePracticeModule: ensurePracticeModule,

        getBankById: function(bankId) {
            const resolvedBankId = resolveBankId(bankId);
            return questionBanks.find(b => favoriteMatchesBank(resolvedBankId, b));
        },
        
        getAllBanks: function() {
            return [...questionBanks];
        },
        
        getFilteredBanks: function() {
            return [...filteredBanks];
        }
    };
})(); 
