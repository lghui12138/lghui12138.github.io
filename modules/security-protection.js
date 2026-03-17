// 🔒 网站安全保护模块
// 防止复制、截屏、爬虫，保护内容安全

window.SecurityProtection = {
    // 当前用户权限级别
    userLevel: 'student', // 'owner', 'restricted'
    
    // 网站所有者与教师账号
    ownerAccount: 'liuguanghui6330156',
    teacherAccounts: ['liuguanghui6330156', 'lgh', 'lgh6330156'],
    
    // 当前登录用户
    currentUser: null,
    
    // 初始化安全保护
    init() {
        // 防止重复初始化
        if (window.securityProtectionInitialized) {
            console.log('🔒 安全保护系统已初始化，跳过重复初始化');
            return;
        }
        
        console.log('🔒 启动安全保护系统...');
        
        // 获取用户权限
        this.checkUserPrivileges();
        
        // 检测移动设备
        const isMobile = this.detectMobileDevice();
        
        // 移动端需要先登录
        if (isMobile && !this.currentUser) {
            console.log('📱 移动设备检测到，需要先登录');
            this.showMobileLoginPrompt();
            return;
        }
        
        // 桌面端也需要登录
        if (!isMobile && !this.currentUser) {
            console.log('🖥️ 桌面设备检测到，需要先登录');
            this.showDesktopLoginPrompt();
            return;
        }
        
        // 移动端教师权限检查
        if (isMobile && this.currentUser === this.ownerAccount) {
            console.log('📱 移动端教师权限已确认');
        }
        
        // 根据用户级别启用不同的保护措施
        if (this.userLevel === 'owner') {
            // 网站所有者：完全访问权限
            this.showOwnerWelcome();
        } else if (this.userLevel === 'teacher') {
            // 教师：允许开发者工具和复制，但禁止录频
            this.enableContentProtection();
            this.preventScreenshot();
            // 教师不阻止右键菜单，允许开发者工具
            this.antiCrawler();
            this.protectImages();
            this.addWatermark();
            this.showTeacherWelcome();
        } else {
            // 学生和其他用户：严格保护
            this.enableContentProtection();
            this.preventScreenshot();
            this.blockCopyPaste();
            this.preventRightClick();
            
            // 移动设备不检测开发者工具
            const isMobile = this.detectMobileDevice();
            if (!isMobile) {
                this.blockDevTools();
            } else {
                console.log('📱 移动设备，跳过开发者工具检测');
            }
            
            this.antiCrawler();
            this.protectImages();
            this.addWatermark();
            // 显示受限用户欢迎信息
            this.showRestrictedWelcome(this.currentUser || '用户');
        }
        
        // 保持高清显示
        this.ensureHighQuality();
        
        // 标记已初始化
        window.securityProtectionInitialized = true;
        
        console.log(`✅ 安全保护已启用 (用户级别: ${this.userLevel})`);
    },
    
    // 检查用户权限
    checkUserPrivileges() {
        // 从localStorage获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const storedUsername = localStorage.getItem('currentUsername');
        const sessionUsername = sessionStorage.getItem('currentUsername');
        
        // 检查所有可能的用户名来源
        this.currentUser = userInfo.username || storedUsername || sessionUsername || null;
        
        // 检测设备类型和开发者模式
        const isMobile = this.detectMobileDevice();
        const isDeveloperMode = this.detectDeveloperMode();
        
        console.log(`📱 设备检测: ${isMobile ? '移动设备' : '桌面设备'}`);
        console.log(`🔧 开发者模式: ${isDeveloperMode ? '已启用' : '未启用'}`);
        
        // 检测用户角色
        const isTeacher = this.detectTeacherRole(userInfo);
        
        console.log(`👨‍🏫 教师角色: ${isTeacher ? '是' : '否'}`);
        
        // 权限判断逻辑
        if (this.currentUser === this.ownerAccount) {
            this.userLevel = 'owner';
            console.log(`👑 网站所有者已登录: ${this.currentUser}`);
        } else if (this.currentUser && (isTeacher || this.teacherAccounts.includes(this.currentUser))) {
            // 已登录的教师：允许开发者工具和复制
            this.userLevel = 'teacher';
            console.log(`👨‍🏫 教师用户: ${this.currentUser}`);
        } else {
            // 未登录用户或学生：严格限制
            this.userLevel = 'restricted';
            console.log(`🔒 受限用户: ${this.currentUser || '未登录'}`);
        }
        
        // 特殊处理：所有教师账号都保留教师权限
        if (this.currentUser && this.teacherAccounts.includes(this.currentUser)) {
            console.log(`👨‍🏫 ${this.currentUser} 具有教师权限`);
        }
        
        // 调试信息
        console.log(`🔍 调试信息:`);
        console.log(`  - 当前用户: ${this.currentUser}`);
        console.log(`  - 所有者账号: ${this.ownerAccount}`);
        console.log(`  - 是否匹配: ${this.currentUser === this.ownerAccount}`);
        console.log(`  - 教师检测: ${isTeacher}`);
        console.log(`  - 最终级别: ${this.userLevel}`);
        
        console.log(`🔐 用户权限检查完成: ${this.userLevel}`);
    },
    
    // 检测教师角色
    detectTeacherRole(userInfo) {
        // 检查用户信息中的角色
        if (userInfo.role === 'teacher') {
            return true;
        }
        
        // 检查localStorage中的教师标识
        if (localStorage.getItem('isTeacher') === 'true') {
            return true;
        }
        
        // 检查用户名是否包含教师关键词
        const teacherKeywords = ['teacher', 'professor', 'instructor', 'admin', 'liuguanghui', 'lgh6330156', 'lgh'];
        const username = (userInfo.username || '').toLowerCase();
        
        if (teacherKeywords.some(keyword => username.includes(keyword))) {
            return true;
        }
        
        // 特殊处理：显式教师账号名单
        if (this.currentUser && this.teacherAccounts.includes(this.currentUser)) {
            return true;
        }
        
        return false;
    },
    
    // 检测移动设备
    detectMobileDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = [
            'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
            'windows phone', 'mobile', 'tablet'
        ];
        
        return mobileKeywords.some(keyword => userAgent.includes(keyword));
    },
    
    // 检测开发者模式
    detectDeveloperMode() {
        // 检测开发者工具是否打开
        let devtools = false;
        
        // 方法1: 检测窗口大小变化
        const threshold = 160;
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
            devtools = true;
        }
        
        // 方法2: 检测控制台是否打开
        const devtoolsOpen = /./;
        devtoolsOpen.toString = function() {
            devtools = true;
        };
        console.log('%c', devtoolsOpen);
        
        // 方法3: 检测Firebug
        if (window.console && (window.console.firebug || window.console.exception)) {
            devtools = true;
        }
        
        // 方法4: 检测Chrome开发者工具
        if (window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) {
            devtools = true;
        }
        
        // 方法5: 检测Safari开发者工具
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            devtools = true;
        }
        
        return devtools;
    },
    
    // 启用内容保护
    enableContentProtection() {
        // 根据用户级别决定保护强度
        if (this.userLevel === 'owner' || this.userLevel === 'teacher') {
            // 网站所有者或教师：轻度保护
            console.log('🔓 启用轻度内容保护');
            this.enableLightProtection();
        } else {
            // 学生和其他用户：严格保护
            console.log('🔒 启用严格内容保护');
            this.enableStrictProtection();
        }
    },
    
    // 轻度保护（允许基本操作）
    enableLightProtection() {
        // 禁用拖拽
        document.body.style.webkitUserDrag = 'none';
        document.body.style.userDrag = 'none';
        
        // 添加轻度CSS保护
        const style = document.createElement('style');
        style.textContent = `
            /* 保护图片 */
            img {
                -webkit-user-drag: none !important;
                user-drag: none !important;
            }
            
            /* 允许文本选择，但限制复制 */
            * {
                -webkit-user-select: auto;
                -moz-user-select: auto;
                -ms-user-select: auto;
                user-select: auto;
            }
            
            /* 输入框正常功能 */
            input, textarea, [contenteditable] {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                pointer-events: auto !important;
            }
        `;
        document.head.appendChild(style);
    },
    
    // 严格保护（禁止所有复制操作）
    enableStrictProtection() {
        // 禁用文本选择
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.mozUserSelect = 'none';
        document.body.style.msUserSelect = 'none';
        
        // 禁用拖拽
        document.body.style.webkitUserDrag = 'none';
        document.body.style.userDrag = 'none';
        
        // 添加严格CSS保护
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
            
            /* 允许输入框正常输入和选择（但复制仍被阻止） */
            input, textarea, [contenteditable] {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                pointer-events: auto !important;
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
        // 根据用户级别决定是否阻止复制
        if (this.userLevel === 'owner' || this.userLevel === 'teacher') {
            // 网站所有者或教师：允许复制
            console.log('🔓 允许复制粘贴操作');
            return;
        }
        
        // 禁用复制快捷键（允许输入但不允许复制）
        document.addEventListener('keydown', (e) => {
            // 检查是否在输入框中
            const target = e.target;
            const isInputElement = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true';
            
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || 
                e.key === 'a' || e.key === 'A' || e.key === 'x' || e.key === 'X' ||
                e.key === 's' || e.key === 'S')) {
                
                // 如果是在输入框中，只允许全选（Ctrl+A），禁止复制
                if (isInputElement && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X')) {
                    e.preventDefault();
                    this.showWarning('复制功能已被禁用');
                    return false;
                }
                // 如果不在输入框中，禁止所有操作
                else if (!isInputElement) {
                    e.preventDefault();
                    this.showWarning('复制功能已被禁用');
                    return false;
                }
            }
        });
        
        // 禁用所有复制事件
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            e.clipboardData.setData('text/plain', '');
            this.showWarning('内容受到保护，无法复制');
            return false;
        });
        
        // 禁用选择事件（但允许在输入框中使用）
        document.addEventListener('selectstart', (e) => {
            const target = e.target;
            const isInputElement = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true';
            
            if (!isInputElement) {
                e.preventDefault();
                return false;
            }
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
        // 检测移动设备
        const isMobile = this.detectMobileDevice();
        
        // 移动设备不检测开发者工具
        if (isMobile) {
            console.log('📱 移动设备，跳过开发者工具检测');
            return;
        }
        
        // 根据用户级别决定是否阻止开发者工具
        if (this.userLevel === 'owner' || this.userLevel === 'teacher') {
            // 所有者或教师：允许开发者工具
            console.log('🔓 允许开发者工具访问');
            return;
        }
        
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
            // 检查用户级别，教师和所有者不受开发者工具检测影响
            if (this.userLevel === 'owner' || this.userLevel === 'teacher') {
                return;
            }
            
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
        // 检测移动设备
        const isMobile = this.detectMobileDevice();
        
        // 移动设备不受开发者工具检测影响
        if (isMobile) {
            console.log('📱 移动设备，开发者工具检测已忽略');
            return;
        }
        
        // 检查用户级别，教师和所有者不受影响
        if (this.userLevel === 'owner' || this.userLevel === 'teacher') {
            console.log('🔓 教师/所有者用户，开发者工具检测已忽略');
            return;
        }
        
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
    },
    
    // 添加用户身份识别
    addUserIdentification() {
        // 创建用户识别输入框
        const loginPrompt = document.createElement('div');
        loginPrompt.id = 'user-identification';
        loginPrompt.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `;
        
        loginPrompt.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 15px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <h2 style="color: #333; margin-bottom: 20px;">
                    🔐 用户身份验证
                </h2>
                <p style="color: #666; margin-bottom: 30px;">
                    请输入您的用户名以访问内容
                </p>
                <input 
                    type="text" 
                    id="username-input" 
                    placeholder="请输入用户名"
                    style="
                        width: 100%;
                        padding: 12px;
                        border: 2px solid #ddd;
                        border-radius: 8px;
                        font-size: 16px;
                        margin-bottom: 20px;
                        box-sizing: border-box;
                    "
                    autofocus
                />
                <div>
                    <button onclick="SecurityProtection.verifyUser()" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                        margin-right: 10px;
                    ">确认</button>
                    <button onclick="SecurityProtection.guestAccess()" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                    ">访客浏览</button>
                </div>
                <p style="font-size: 12px; color: #999; margin-top: 20px;">
                    访客模式将启用内容保护功能
                </p>
            </div>
        `;
        
        document.body.appendChild(loginPrompt);
        
        // 回车键确认
        document.getElementById('username-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.verifyUser();
            }
        });
    },
    
    // 验证用户
    verifyUser() {
        const username = document.getElementById('username-input').value.trim();
        
        if (!username) {
            alert('请输入用户名');
            return;
        }
        
        // 保存用户名
        localStorage.setItem('currentUsername', username);
        sessionStorage.setItem('currentUsername', username);
        localStorage.setItem('userInfo', JSON.stringify({
            username: username,
            loginTime: new Date().toISOString()
        }));
        
        // 重新检查权限
        this.currentUser = username;
        
        if (username === this.ownerAccount) {
            this.userLevel = 'owner';
            this.removeUserIdentification();
            this.showOwnerWelcome();
            console.log(`👑 网站所有者已验证: ${username}`);
        } else {
            this.userLevel = 'restricted';
            this.removeUserIdentification();
            this.showRestrictedWelcome(username);
            console.log(`🔒 受限用户已登录: ${username}`);
        }
    },
    
    // 访客访问
    guestAccess() {
        this.currentUser = 'guest';
        this.userLevel = 'restricted';
        localStorage.setItem('currentUsername', 'guest');
        sessionStorage.setItem('currentUsername', 'guest');
        
        // 移除登录提示
        const loginPrompt = document.querySelector('[style*="z-index: 99999"]');
        if (loginPrompt) {
            loginPrompt.remove();
        }
        
        // 恢复页面滚动
        document.body.style.overflow = '';
        
        this.removeUserIdentification();
        this.showGuestWelcome();
        
        // 重新初始化安全保护
        this.init();
        
        console.log('👥 访客模式已启用');
    },
    
    // 移除用户识别界面
    removeUserIdentification() {
        const loginPrompt = document.getElementById('user-identification');
        if (loginPrompt) {
            loginPrompt.remove();
        }
    },
    
    // 显示所有者欢迎信息
    showOwnerWelcome() {
        const welcome = document.createElement('div');
        welcome.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 99998;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        welcome.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-crown"></i>
                <div>
                    <div style="font-weight: bold;">欢迎回来，所有者！</div>
                    <div style="font-size: 12px; opacity: 0.9;">所有功能已解锁</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(welcome);
        
        setTimeout(() => {
            welcome.remove();
        }, 5000);
    },
    
    // 显示教师欢迎信息
    showTeacherWelcome() {
        const welcome = document.createElement('div');
        welcome.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 99998;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        welcome.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-chalkboard-teacher"></i>
                <div>
                    <div style="font-weight: bold;">教师模式</div>
                    <div style="font-size: 12px; opacity: 0.9;">开发者工具和复制功能已启用</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(welcome);
        
        setTimeout(() => {
            welcome.remove();
        }, 4000);
    },
    
    // 显示移动端登录提示
    showMobileLoginPrompt() {
        const loginPrompt = document.createElement('div');
        loginPrompt.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `;
        
        loginPrompt.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                max-width: 90%;
                width: 400px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <div style="font-size: 3em; margin-bottom: 20px;">📱</div>
                <h2 style="margin-bottom: 20px; color: #333;">移动端访问</h2>
                <p style="margin-bottom: 30px; color: #666; line-height: 1.6;">
                    移动设备需要先登录才能访问网站。<br>
                    请选择登录方式继续访问。
                </p>
                <div style="display: flex; flex-direction: column; gap: 15px; justify-content: center;">
                    <button onclick="window.SecurityProtection.showLoginForm()" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 15px 24px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-size: 1em;
                        font-weight: bold;
                    ">登录账号</button>
                    <button onclick="window.location.reload()" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 10px;
                        cursor: pointer;
                        font-size: 1em;
                    ">刷新页面</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(loginPrompt);
        
        // 阻止页面滚动
        document.body.style.overflow = 'hidden';
        
        console.log('📱 移动端登录提示已显示');
    },
    
    // 显示受限用户欢迎信息
    showRestrictedWelcome(username) {
        const welcome = document.createElement('div');
        welcome.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 99998;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        welcome.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-shield-alt"></i>
                <div>
                    <div style="font-weight: bold;">欢迎，${username}</div>
                    <div style="font-size: 12px; opacity: 0.9;">内容保护已启用</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(welcome);
        
        setTimeout(() => {
            welcome.remove();
        }, 4000);
    },
    
    // 显示桌面端登录提示
    showDesktopLoginPrompt() {
        const loginPrompt = document.createElement('div');
        loginPrompt.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `;
        
        loginPrompt.innerHTML = `
            <div style="
                background: white;
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 90%;
                width: 500px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <div style="font-size: 4em; margin-bottom: 20px;">🔐</div>
                <h2 style="margin-bottom: 20px; color: #333;">网站访问</h2>
                <p style="margin-bottom: 30px; color: #666; line-height: 1.6;">
                    本网站需要登录才能访问。<br>
                    请输入您的账号和密码。
                </p>
                <form id="desktopLoginForm" style="text-align: left;">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">用户名</label>
                        <input type="text" id="desktopUsername" placeholder="请输入用户名" style="
                            width: 100%;
                            padding: 12px;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 1em;
                            box-sizing: border-box;
                        " required>
                    </div>
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">密码</label>
                        <input type="password" id="desktopPassword" placeholder="请输入密码" style="
                            width: 100%;
                            padding: 12px;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 1em;
                            box-sizing: border-box;
                        " required>
                    </div>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button type="submit" style="
                            background: #007bff;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 10px;
                            cursor: pointer;
                            font-size: 1em;
                            font-weight: bold;
                        ">登录</button>
                        <button type="button" onclick="window.location.reload()" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 10px;
                            cursor: pointer;
                            font-size: 1em;
                        ">刷新页面</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(loginPrompt);
        
        // 阻止页面滚动
        document.body.style.overflow = 'hidden';
        
        // 添加表单提交事件
        document.getElementById('desktopLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDesktopLogin();
        });
        
        console.log('🖥️ 桌面端登录提示已显示');
    },
    
    // 处理桌面端登录
    handleDesktopLogin() {
        const username = document.getElementById('desktopUsername').value;
        const password = document.getElementById('desktopPassword').value;
        
        // 简单的登录验证
        const teacherPasswords = { 'liuguanghui6330156': 'Ll700306', 'lgh': 'Ll700306', 'lgh6330156': 'Ll700306' };
        if (teacherPasswords[username] && password === teacherPasswords[username]) {
            // 登录成功
            this.currentUser = username;
            this.userLevel = 'teacher';
            
            // 保存到localStorage
            localStorage.setItem('currentUsername', username);
            localStorage.setItem('userInfo', JSON.stringify({
                username: username,
                role: 'teacher'
            }));
            
            // 移除登录表单
            const loginForm = document.querySelector('[style*="z-index: 99999"]');
            if (loginForm) {
                loginForm.remove();
            }
            
            // 恢复页面滚动
            document.body.style.overflow = '';
            
            // 重新初始化安全保护
            this.init();
            
            console.log('✅ 桌面端登录成功');
        } else {
            // 登录失败
            alert('用户名或密码错误，请重试');
        }
    },
    
    // 显示登录表单
    showLoginForm() {
        // 移除现有的登录提示
        const existingPrompt = document.querySelector('[style*="z-index: 99999"]');
        if (existingPrompt) {
            existingPrompt.remove();
        }
        
        const loginForm = document.createElement('div');
        loginForm.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
        `;
        
        loginForm.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 20px;
                text-align: center;
                max-width: 90%;
                width: 400px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <div style="font-size: 3em; margin-bottom: 20px;">🔐</div>
                <h2 style="margin-bottom: 20px; color: #333;">登录账号</h2>
                <form id="mobileLoginForm" style="text-align: left;">
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">用户名</label>
                        <input type="text" id="mobileUsername" placeholder="请输入用户名" style="
                            width: 100%;
                            padding: 12px;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 1em;
                            box-sizing: border-box;
                        " required>
                    </div>
                    <div style="margin-bottom: 30px;">
                        <label style="display: block; margin-bottom: 8px; color: #333; font-weight: bold;">密码</label>
                        <input type="password" id="mobilePassword" placeholder="请输入密码" style="
                            width: 100%;
                            padding: 12px;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 1em;
                            box-sizing: border-box;
                        " required>
                    </div>
                    <div style="display: flex; gap: 15px; justify-content: center;">
                        <button type="submit" style="
                            background: #007bff;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 10px;
                            cursor: pointer;
                            font-size: 1em;
                            font-weight: bold;
                        ">登录</button>
                        <button type="button" onclick="window.SecurityProtection.showMobileLoginPrompt()" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 10px;
                            cursor: pointer;
                            font-size: 1em;
                        ">返回</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(loginForm);
        
        // 添加表单提交事件
        document.getElementById('mobileLoginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleMobileLogin();
        });
        
        console.log('📱 移动端登录表单已显示');
    },
    
    // 处理移动端登录
    handleMobileLogin() {
        const username = document.getElementById('mobileUsername').value;
        const password = document.getElementById('mobilePassword').value;
        
        // 简单的登录验证
        const teacherPasswords = { 'liuguanghui6330156': 'Ll700306', 'lgh': 'Ll700306', 'lgh6330156': 'Ll700306' };
        if (teacherPasswords[username] && password === teacherPasswords[username]) {
            // 登录成功
            this.currentUser = username;
            this.userLevel = 'teacher';
            
            // 保存到localStorage
            localStorage.setItem('currentUsername', username);
            localStorage.setItem('userInfo', JSON.stringify({
                username: username,
                role: 'teacher'
            }));
            
            // 移除登录表单
            const loginForm = document.querySelector('[style*="z-index: 99999"]');
            if (loginForm) {
                loginForm.remove();
            }
            
            // 恢复页面滚动
            document.body.style.overflow = '';
            
            // 重新初始化安全保护
            this.init();
            
            console.log('✅ 移动端登录成功');
        } else {
            // 登录失败
            alert('用户名或密码错误，请重试');
        }
    },
    
    // 静默设置访客模式
    setGuestMode() {
        this.currentUser = 'guest';
        this.userLevel = 'restricted';
        localStorage.setItem('currentUsername', 'guest');
        sessionStorage.setItem('currentUsername', 'guest');
        console.log('👥 访客模式已启用（静默）');
    },
    
    // 显示访客欢迎信息
    showGuestWelcome() {
        const welcome = document.createElement('div');
        welcome.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6c757d, #495057);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 99998;
            font-family: Arial, sans-serif;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        welcome.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-user"></i>
                <div>
                    <div style="font-weight: bold;">访客模式</div>
                    <div style="font-size: 12px; opacity: 0.9;">内容保护已启用</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(welcome);
        
        setTimeout(() => {
            welcome.remove();
        }, 4000);
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