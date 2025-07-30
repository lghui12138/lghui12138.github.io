/**
 * 题库功能验证脚本
 * 用于测试题库模块的完整功能
 */

// 验证题库数据加载
async function verifyQuestionBankData() {
    console.log('🔍 开始验证题库数据加载...');
    
    try {
        // 1. 检查索引文件
        const indexResponse = await fetch('question-banks/index.json');
        if (!indexResponse.ok) {
            throw new Error('题库索引文件不存在');
        }
        
        const indexData = await indexResponse.json();
        console.log('✅ 索引文件加载成功:', indexData);
        
        // 2. 验证索引文件格式
        if (!indexData.questionBanks || !Array.isArray(indexData.questionBanks)) {
            throw new Error('索引文件格式不正确');
        }
        
        console.log(`✅ 找到 ${indexData.questionBanks.length} 个题库`);
        
        // 3. 测试题库数据文件
        for (const bank of indexData.questionBanks.slice(0, 3)) { // 只测试前3个
            if (bank.filename) {
                const bankResponse = await fetch(`question-banks/${bank.filename}`);
                if (!bankResponse.ok) {
                    console.warn(`⚠️ 题库文件 ${bank.filename} 不存在`);
                    continue;
                }
                
                const bankData = await bankResponse.json();
                console.log(`✅ 题库 ${bank.name} 数据加载成功，包含 ${Array.isArray(bankData) ? bankData.length : '未知'} 道题目`);
            }
        }
        
        return { success: true, message: '题库数据验证通过' };
        
    } catch (error) {
        console.error('❌ 题库数据验证失败:', error);
        return { success: false, message: error.message };
    }
}

// 验证题库模块加载
async function verifyQuestionBankModules() {
    console.log('🔍 开始验证题库模块加载...');
    
    const requiredModules = [
        'modules/question-bank.html',
        'modules/question-bank-styles.css',
        'modules/question-bank-data.js',
        'modules/question-bank-ui.js',
        'modules/question-bank-user.js',
        'modules/question-bank-stats.js',
        'modules/question-bank-practice.js',
        'modules/question-bank-ai.js'
    ];
    
    const results = [];
    
    for (const module of requiredModules) {
        try {
            const response = await fetch(module, { method: 'HEAD' });
            if (response.ok) {
                results.push(`✅ ${module}`);
            } else {
                results.push(`❌ ${module} (404)`);
            }
        } catch (error) {
            results.push(`❌ ${module} (错误: ${error.message})`);
        }
    }
    
    const allExist = results.every(result => result.startsWith('✅'));
    console.log('模块检查结果:', results);
    
    return {
        success: allExist,
        message: allExist ? '所有题库模块文件存在' : '部分模块文件缺失',
        details: results
    };
}

// 验证主界面集成
async function verifyMainPageIntegration() {
    console.log('🔍 开始验证主界面集成...');
    
    try {
        // 检查主页面
        const mainPageResponse = await fetch('index-modular.html');
        if (!mainPageResponse.ok) {
            throw new Error('主页面不存在');
        }
        
        const mainPageText = await mainPageResponse.text();
        
        // 检查题库模块链接
        if (!mainPageText.includes('question-bank')) {
            throw new Error('主页面中未找到题库模块链接');
        }
        
        // 检查预加载函数
        if (!mainPageText.includes('preloadQuestionBankData')) {
            throw new Error('主页面中未找到题库预加载函数');
        }
        
        console.log('✅ 主界面集成验证通过');
        return { success: true, message: '主界面集成验证通过' };
        
    } catch (error) {
        console.error('❌ 主界面集成验证失败:', error);
        return { success: false, message: error.message };
    }
}

// 验证题库页面功能
async function verifyQuestionBankPage() {
    console.log('🔍 开始验证题库页面功能...');
    
    try {
        // 检查题库页面
        const pageResponse = await fetch('modules/question-bank.html');
        if (!pageResponse.ok) {
            throw new Error('题库页面不存在');
        }
        
        const pageText = await pageResponse.text();
        
        // 检查必要的模块引用
        const requiredScripts = [
            'question-bank-data.js',
            'question-bank-ui.js',
            'question-bank-user.js',
            'question-bank-stats.js',
            'question-bank-practice.js',
            'question-bank-ai.js'
        ];
        
        for (const script of requiredScripts) {
            if (!pageText.includes(script)) {
                throw new Error(`题库页面缺少脚本引用: ${script}`);
            }
        }
        
        // 检查样式文件
        if (!pageText.includes('question-bank-styles.css')) {
            throw new Error('题库页面缺少样式文件引用');
        }
        
        console.log('✅ 题库页面功能验证通过');
        return { success: true, message: '题库页面功能验证通过' };
        
    } catch (error) {
        console.error('❌ 题库页面功能验证失败:', error);
        return { success: false, message: error.message };
    }
}

// 验证缓存机制
function verifyCacheMechanism() {
    console.log('🔍 开始验证缓存机制...');
    
    try {
        // 检查localStorage中的缓存
        const cachedData = localStorage.getItem('questionBankIndex');
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (parsedData.questionBanks && Array.isArray(parsedData.questionBanks)) {
                console.log(`✅ 缓存机制正常，缓存了 ${parsedData.questionBanks.length} 个题库`);
                return { success: true, message: '缓存机制验证通过' };
            } else {
                throw new Error('缓存数据格式不正确');
            }
        } else {
            console.log('ℹ️ 暂无缓存数据，这是正常的');
            return { success: true, message: '缓存机制可用（暂无缓存）' };
        }
        
    } catch (error) {
        console.error('❌ 缓存机制验证失败:', error);
        return { success: false, message: error.message };
    }
}

// 运行完整验证
async function runCompleteVerification() {
    console.log('🚀 开始运行完整题库验证...\n');
    
    const results = [];
    
    // 1. 验证题库数据
    console.log('1️⃣ 验证题库数据加载...');
    const dataResult = await verifyQuestionBankData();
    results.push({ name: '题库数据', ...dataResult });
    
    // 2. 验证模块文件
    console.log('\n2️⃣ 验证题库模块文件...');
    const moduleResult = await verifyQuestionBankModules();
    results.push({ name: '模块文件', ...moduleResult });
    
    // 3. 验证主界面集成
    console.log('\n3️⃣ 验证主界面集成...');
    const integrationResult = await verifyMainPageIntegration();
    results.push({ name: '主界面集成', ...integrationResult });
    
    // 4. 验证题库页面
    console.log('\n4️⃣ 验证题库页面功能...');
    const pageResult = await verifyQuestionBankPage();
    results.push({ name: '题库页面', ...pageResult });
    
    // 5. 验证缓存机制
    console.log('\n5️⃣ 验证缓存机制...');
    const cacheResult = verifyCacheMechanism();
    results.push({ name: '缓存机制', ...cacheResult });
    
    // 汇总结果
    console.log('\n📊 验证结果汇总:');
    console.log('='.repeat(50));
    
    const passedCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    results.forEach((result, index) => {
        const status = result.success ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${result.name}: ${result.message}`);
        if (result.details) {
            result.details.forEach(detail => console.log(`   ${detail}`));
        }
    });
    
    console.log('='.repeat(50));
    console.log(`通过率: ${passedCount}/${totalCount} (${Math.round(passedCount/totalCount*100)}%)`);
    
    if (passedCount === totalCount) {
        console.log('🎉 所有验证项目通过！题库模块已成功集成。');
        return true;
    } else {
        console.log('⚠️ 部分验证项目失败，请检查相关配置。');
        return false;
    }
}

// 导出函数供外部使用
window.QuestionBankVerifier = {
    verifyQuestionBankData,
    verifyQuestionBankModules,
    verifyMainPageIntegration,
    verifyQuestionBankPage,
    verifyCacheMechanism,
    runCompleteVerification
};

// 如果直接运行此脚本，自动执行完整验证
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        console.log('题库验证脚本已加载');
        // 可以在这里自动运行验证
        // runCompleteVerification();
    });
} 