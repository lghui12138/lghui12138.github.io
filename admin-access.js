// 🔑 管理员权限设置脚本
// 为网站所有者提供完全访问权限

console.log('🔑 管理员权限脚本启动...');

// 设置所有者权限
function setOwnerAccess() {
    const ownerAccount = 'liuguanghui6330156';
    
    // 设置所有者标识
    localStorage.setItem('currentUsername', ownerAccount);
    sessionStorage.setItem('currentUsername', ownerAccount);
    localStorage.setItem('userInfo', JSON.stringify({
        username: ownerAccount,
        role: 'owner',
        permissions: ['all'],
        securityLevel: 'maximum',
        loginTime: new Date().toISOString()
    }));
    
    // 显示权限确认
    const ownerNotice = document.createElement('div');
    ownerNotice.innerHTML = `
        <div style="
            position: fixed;
            top: 10px;
            left: 10px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
            👑 所有者模式已激活
        </div>
    `;
    document.body.appendChild(ownerNotice);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        ownerNotice.remove();
    }, 3000);
    
    // 移除用户身份验证界面（如果存在）
    const userIdentification = document.getElementById('user-identification');
    if (userIdentification) {
        userIdentification.remove();
    }
    
    console.log('✅ 所有者权限已设置');
}

// 检查是否是所有者环境
function checkOwnerEnvironment() {
    // 检查特定的所有者标识
    const urlParams = new URLSearchParams(window.location.search);
    const ownerKey = urlParams.get('owner_key');
    const storedUsername = localStorage.getItem('currentUsername');
    
    // 如果有所有者密钥或已设置所有者权限
    if (ownerKey === 'liuguanghui6330156_owner_2024' || storedUsername === 'liuguanghui6330156') {
        setOwnerAccess();
        return true;
    }
    
    return false;
}

// 添加快捷键激活所有者模式
let keySequence = [];
const ownerSequence = ['Control', 'Shift', 'O', 'W', 'N', 'E', 'R'];

document.addEventListener('keydown', (e) => {
    keySequence.push(e.key);
    
    // 只保留最后7个按键
    if (keySequence.length > ownerSequence.length) {
        keySequence.shift();
    }
    
    // 检查是否匹配所有者序列
    if (keySequence.length === ownerSequence.length && 
        keySequence.every((key, index) => key === ownerSequence[index])) {
        setOwnerAccess();
        keySequence = []; // 重置序列
    }
});

// 页面加载时检查
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkOwnerEnvironment);
} else {
    checkOwnerEnvironment();
}

console.log('🔑 所有者权限脚本已加载 - 使用 Ctrl+Shift+O+W+N+E+R 或 ?owner_key=liuguanghui6330156_owner_2024 激活'); 