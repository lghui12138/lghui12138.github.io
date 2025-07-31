// 🔒 网站安全保护模块
// 防止复制、截屏、爬虫，保护内容安全

window.SecurityProtection = {
    // 当前用户权限级别
    userLevel: 'student', // 'admin', 'teacher', 'student'
    
    // 特权用户列表（您和教师账号）
    privilegedUsers: ['admin', 'teacher'],
    
    // 初始化安全保护
    init() {
        console.log('🔒 启动安全保护系统...');
        
        // 获取用户权限
        this.checkUserPrivileges();
        
        // 如果不是特权用户，启用保护措施
        if (!this.privilegedUsers.includes(this.userLevel)) {
            this.enableContentProtection();
            this.preventScreenshot();
            this.blockCopyPaste();
            this.preventRightClick();
            this.blockDevTools();
            this.antiCrawler();
            this.protectImages();
            this.addWatermark();
        }
        
        // 保持高清显示
        this.ensureHighQuality();
        
        console.log(`✅ 安全保护已启用 (用户级别: ${this.userLevel})`);
    },
    
    // 检查用户权限
    checkUserPrivileges() {
        // 从localStorage或sessionStorage获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const isTeacher = localStorage.getItem('isTeacher') === 'true';
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        
        if (isAdmin || userInfo.role === 'admin' || userInfo.username === 'admin' || userInfo.securityLevel === 'maximum') {
            this.userLevel = 'admin';
        } else if (isTeacher || userInfo.role === 'teacher') {
            this.userLevel = 'teacher';
        } else {
            this.userLevel = 'student';
        }
        
        console.log(`🔐 用户权限检查完成: ${this.userLevel}`);
    },
    
    // 启用内容保护
    enableContentProtection() {
        // 禁用文本选择
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
        
        // 禁用拖拽
        document.body.style.webkitUserDrag = 'none';
        document.body.style.userDrag = 'none';
        
        // 添加CSS保护
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-user-drag: none !important;
                user-drag: none !important;
            }
            
            /* 防止通过CSS伪元素复制内容 */
            *::before, *::after {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                user-select: none !important;
            }
            
            /* 保护图片 */
            img {
                -webkit-user-drag: none !important;
                user-drag: none !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(style);
    },
    
    // 防止截屏
    preventScreenshot() {
        // 添加防截屏样式
        const antiScreenshotStyle = document.createElement('style');
        antiScreenshotStyle.textContent = `
            @media print {
                body { display: none !important; }
            }
            
            /* 在可能的截屏时显示警告 */
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: transparent;
                z-index: -1;
                pointer-events: none;
            }
        `;
        document.head.appendChild(antiScreenshotStyle);
        
        // 监听可能的截屏行为
        document.addEventListener('keydown', (e) => {
            // 禁用截屏快捷键
            if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                this.showWarning('打印功能已被禁用');
                return false;
            }
            
            // 禁用其他截屏相关快捷键
            if (e.key === 'PrintScreen' || 
                (e.altKey && e.key === 'PrintScreen') ||
                (e.ctrlKey && e.shiftKey && e.key === 'S')) {
                e.preventDefault();
                this.showWarning('截屏功能已被禁用');
                return false;
            }
        });
        
        // 监听窗口失焦（可能在截屏）
        let blurTimeout;
        window.addEventListener('blur', () => {
            blurTimeout = setTimeout(() => {
                document.body.style.filter = 'blur(10px)';
            }, 100);
        });
        
        window.addEventListener('focus', () => {
            clearTimeout(blurTimeout);
            document.body.style.filter = 'none';
        });
    },
    
    // 阻止复制粘贴
    blockCopyPaste() {
        // 禁用复制快捷键
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || 
                e.key === 'a' || e.key === 'A' || e.key === 'x' || e.key === 'X' ||
                e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                this.showWarning('复制功能已被禁用');
                return false;
            }
        });
        
        // 禁用复制事件
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            e.clipboardData.setData('text/plain', '');
            this.showWarning('内容受到保护，无法复制');
            return false;
        });
        
        // 禁用选择事件
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });
    },
    
    // 阻止右键菜单
    preventRightClick() {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showWarning('右键菜单已被禁用');
            return false;
        });
        
        // 阻止长按（移动端）
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        });
    },
    
    // 阻止开发者工具
    blockDevTools() {
        // 监听F12和其他开发者工具快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                this.showWarning('开发者工具已被禁用');
                return false;
            }
        });
        
        // 检测控制台打开
        let devtools = {
            open: false,
            orientation: null
        };
        
        const threshold = 160;
        setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    this.handleDevToolsOpen();
                }
            } else {
                devtools.open = false;
            }
        }, 500);
    },
    
    // 处理开发者工具打开
    handleDevToolsOpen() {
        // 模糊页面内容
        document.body.style.filter = 'blur(20px)';
        document.body.style.pointerEvents = 'none';
        
        // 显示警告
        this.showPersistentWarning('检测到开发者工具，请关闭后继续浏览');
        
        // 定期检查是否关闭
        const checkInterval = setInterval(() => {
            if (window.outerHeight - window.innerHeight <= 160 && 
                window.outerWidth - window.innerWidth <= 160) {
                document.body.style.filter = 'none';
                document.body.style.pointerEvents = 'auto';
                this.hidePersistentWarning();
                clearInterval(checkInterval);
            }
        }, 1000);
    },
    
    // 反爬虫措施
    antiCrawler() {
        // 检测爬虫特征
        const userAgent = navigator.userAgent.toLowerCase();
        const crawlerPatterns = [
            'bot', 'crawl', 'spider', 'scrape', 'curl', 'wget', 'python', 'java',
            'phantom', 'selenium', 'headless', 'chrome-lighthouse'
        ];
        
        if (crawlerPatterns.some(pattern => userAgent.includes(pattern))) {
            this.blockAccess('检测到爬虫行为');
            return;
        }
        
        // 检测自动化工具
        if (window.navigator.webdriver || 
            window.phantom || 
            window._phantom || 
            window.callPhantom) {
            this.blockAccess('检测到自动化工具');
            return;
        }
        
        // 检测异常快速的页面访问
        let pageLoadTime = Date.now();
        let clickCount = 0;
        let lastClickTime = 0;
        
        document.addEventListener('click', () => {
            const now = Date.now();
            if (now - lastClickTime < 100) {
                clickCount++;
                if (clickCount > 10) {
                    this.blockAccess('检测到异常访问行为');
                }
            } else {
                clickCount = 0;
            }
            lastClickTime = now;
        });
        
        // 添加隐藏的诱饵链接
        const trapLink = document.createElement('a');
        trapLink.href = '/honeypot';
        trapLink.style.display = 'none';
        trapLink.innerHTML = 'crawler trap';
        document.body.appendChild(trapLink);
        
        trapLink.addEventListener('click', () => {
            this.blockAccess('触发了反爬虫陷阱');
        });
    },
    
    // 保护图片
    protectImages() {
        // 禁用图片拖拽和右键
        document.addEventListener('DOMContentLoaded', () => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.addEventListener('dragstart', (e) => {
                    e.preventDefault();
                    return false;
                });
                
                img.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    return false;
                });
                
                // 添加透明覆盖层
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    z-index: 10;
                    pointer-events: all;
                `;
                
                if (img.parentNode.style.position !== 'relative' && 
                    img.parentNode.style.position !== 'absolute') {
                    img.parentNode.style.position = 'relative';
                }
                
                img.parentNode.appendChild(overlay);
            });
        });
    },
    
    // 添加水印
    addWatermark() {
        const watermark = document.createElement('div');
        watermark.innerHTML = '© 流体力学学习平台 - 内容受保护';
        watermark.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            color: rgba(255, 255, 255, 0.3);
            font-size: 12px;
            z-index: 9999;
            pointer-events: none;
            user-select: none;
            font-family: Arial, sans-serif;
        `;
        document.body.appendChild(watermark);
        
        // 添加背景水印
        const bgWatermark = document.createElement('div');
        bgWatermark.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                rgba(255,255,255,0.02) 100px,
                rgba(255,255,255,0.02) 200px
            );
            pointer-events: none;
            z-index: 1;
        `;
        document.body.appendChild(bgWatermark);
    },
    
    // 确保高清显示
    ensureHighQuality() {
        // 设置高DPI支持
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }
        
        // 优化图片显示
        const style = document.createElement('style');
        style.textContent = `
            img, canvas, video {
                image-rendering: -webkit-optimize-contrast;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
                image-rendering: pixelated;
                max-width: 100%;
                height: auto;
            }
            
            canvas {
                image-rendering: -moz-crisp-edges;
                image-rendering: -webkit-crisp-edges;
                image-rendering: crisp-edges;
                image-rendering: pixelated;
            }
            
            /* 确保文本清晰 */
            * {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-rendering: optimizeLegibility;
            }
        `;
        document.head.appendChild(style);
    },
    
    // 阻止访问
    blockAccess(reason) {
        document.body.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #ff4757;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
                z-index: 99999;
            ">
                <h1>🚫 访问被阻止</h1>
                <p>原因: ${reason}</p>
                <p>如需访问，请联系管理员</p>
            </div>
        `;
        
        // 阻止进一步操作
        setTimeout(() => {
            window.location.href = 'about:blank';
        }, 3000);
    },
    
    // 显示警告
    showWarning(message) {
        // 移除现有警告
        const existingWarning = document.querySelector('.security-warning');
        if (existingWarning) {
            existingWarning.remove();
        }
        
        const warning = document.createElement('div');
        warning.className = 'security-warning';
        warning.innerHTML = `
            <i class="fas fa-shield-alt"></i>
            ${message}
        `;
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 99999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(warning);
        
        // 自动移除
        setTimeout(() => {
            warning.remove();
        }, 3000);
    },
    
    // 显示持久警告
    showPersistentWarning(message) {
        const warning = document.createElement('div');
        warning.id = 'persistent-warning';
        warning.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 71, 87, 0.95);
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
                z-index: 999999;
                font-size: 18px;
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h2>${message}</h2>
                <p>请关闭开发者工具后继续浏览</p>
            </div>
        `;
        document.body.appendChild(warning);
    },
    
    // 隐藏持久警告
    hidePersistentWarning() {
        const warning = document.getElementById('persistent-warning');
        if (warning) {
            warning.remove();
        }
    }
};

// 添加动画样式
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(animationStyle);

// 页面加载时自动启动安全保护
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        SecurityProtection.init();
    });
} else {
    SecurityProtection.init();
}

console.log('🔒 安全保护模块已加载'); 