// 🔑 管理员权限设置脚本
// 为网站所有者提供完全访问权限

console.log('🔑 管理员权限脚本启动...');

// 设置管理员权限
function setAdminAccess() {
    // 设置管理员标识
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('userInfo', JSON.stringify({
        role: 'admin',
        username: 'admin',
        permissions: ['all'],
        securityLevel: 'maximum'
    }));
    
    // 显示权限确认
    const adminNotice = document.createElement('div');
    adminNotice.innerHTML = `
        <div style="
            position: fixed;
            top: 10px;
            left: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
            👑 管理员模式已激活
        </div>
    `;
    document.body.appendChild(adminNotice);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        adminNotice.remove();
    }, 3000);
    
    console.log('✅ 管理员权限已设置');
}

// 检查是否是管理员环境
function checkAdminEnvironment() {
    // 检查特定的管理员标识（可以是特殊的URL参数、本地存储等）
    const urlParams = new URLSearchParams(window.location.search);
    const adminKey = urlParams.get('admin_key');
    const storedAdmin = localStorage.getItem('isAdmin');
    
    // 如果有管理员密钥或已设置管理员权限
    if (adminKey === 'lghui12138_admin_2024' || storedAdmin === 'true') {
        setAdminAccess();
        return true;
    }
    
    return false;
}

// 添加快捷键激活管理员模式
let keySequence = [];
const adminSequence = ['Control', 'Shift', 'A', 'D', 'M', 'I', 'N'];

document.addEventListener('keydown', (e) => {
    keySequence.push(e.key);
    
    // 只保留最后7个按键
    if (keySequence.length > adminSequence.length) {
        keySequence.shift();
    }
    
    // 检查是否匹配管理员序列
    if (keySequence.length === adminSequence.length && 
        keySequence.every((key, index) => key === adminSequence[index])) {
        setAdminAccess();
        keySequence = []; // 重置序列
    }
});

// 页面加载时检查
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAdminEnvironment);
} else {
    checkAdminEnvironment();
}

console.log('🔑 管理员权限脚本已加载 - 使用 Ctrl+Shift+A+D+M+I+N 或 ?admin_key=lghui12138_admin_2024 激活'); 