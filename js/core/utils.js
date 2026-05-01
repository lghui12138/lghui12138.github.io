// ===== 工具函数集合 =====
window.Utils = {
    
    // ===== DOM操作工具 =====
    dom: {
        // 获取元素
        get(selector) {
            return document.querySelector(selector);
        },
        
        // 获取所有匹配元素
        getAll(selector) {
            return document.querySelectorAll(selector);
        },
        
        // 创建元素
        create(tag, attributes = {}, content = '') {
            const element = document.createElement(tag);
            
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else if (key.startsWith('data-')) {
                    element.setAttribute(key, value);
                } else {
                    element[key] = value;
                }
            });
            
            if (content) {
                element.textContent = content;
            }
            
            return element;
        },
        
        // 添加类名
        addClass(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            element?.classList.add(className);
        },
        
        // 移除类名
        removeClass(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            element?.classList.remove(className);
        },
        
        // 切换类名
        toggleClass(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            element?.classList.toggle(className);
        },
        
        // 显示元素
        show(element) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) {
                element.style.display = '';
                element.classList.remove('hidden');
            }
        },
        
        // 隐藏元素
        hide(element) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (element) {
                element.classList.add('hidden');
            }
        },
        
        // 淡入效果
        fadeIn(element, duration = 300) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (!element) return;
            
            element.style.opacity = '0';
            element.style.display = '';
            element.classList.remove('hidden');
            
            let start = null;
            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                element.style.opacity = progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }
            requestAnimationFrame(animate);
        },
        
        // 淡出效果
        fadeOut(element, duration = 300) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            if (!element) return;
            
            let start = null;
            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                element.style.opacity = 1 - progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    element.classList.add('hidden');
                }
            }
            requestAnimationFrame(animate);
        }
    },
    
    // ===== 数据验证工具 =====
    validation: {
        // 验证邮箱
        isEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        // 验证用户名
        isUsername(username) {
            const config = AppConfig.security.validation.username;
            if (username.length < config.minLength || username.length > config.maxLength) {
                return false;
            }
            return config.allowedPattern.test(username);
        },
        
        // 验证密码强度
        validatePassword(password) {
            const config = AppConfig.security.validation.password;
            const result = {
                valid: true,
                strength: 0,
                errors: []
            };
            
            if (password.length < config.minLength) {
                result.valid = false;
                result.errors.push(`密码长度至少${config.minLength}位`);
            } else {
                result.strength += 1;
            }
            
            if (config.requireUppercase && !/[A-Z]/.test(password)) {
                result.valid = false;
                result.errors.push('密码需包含大写字母');
            } else if (config.requireUppercase) {
                result.strength += 1;
            }
            
            if (config.requireNumbers && !/\d/.test(password)) {
                result.valid = false;
                result.errors.push('密码需包含数字');
            } else if (config.requireNumbers) {
                result.strength += 1;
            }
            
            if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                result.valid = false;
                result.errors.push('密码需包含特殊字符');
            } else if (config.requireSpecialChars) {
                result.strength += 1;
            }
            
            // 计算强度等级
            if (result.strength >= 4) result.level = 'very-strong';
            else if (result.strength >= 3) result.level = 'strong';
            else if (result.strength >= 2) result.level = 'medium';
            else result.level = 'weak';
            
            return result;
        },
        
        // 验证手机号
        isPhone(phone) {
            const phoneRegex = /^1[3-9]\d{9}$/;
            return phoneRegex.test(phone);
        },
        
        // 验证URL
        isUrl(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        }
    },
    
    // ===== 格式化工具 =====
    format: {
        // 格式化数字
        number(num, decimals = 2) {
            return new Intl.NumberFormat('zh-CN', {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            }).format(num);
        },
        
        // 格式化百分比
        percentage(num, decimals = 1) {
            return `${(num * 100).toFixed(decimals)}%`;
        },
        
        // 格式化文件大小
        fileSize(bytes) {
            const units = ['B', 'KB', 'MB', 'GB', 'TB'];
            let size = bytes;
            let unitIndex = 0;
            
            while (size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024;
                unitIndex++;
            }
            
            return `${size.toFixed(1)} ${units[unitIndex]}`;
        },
        
        // 格式化时间
        time(date, format = 'YYYY-MM-DD HH:mm:ss') {
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            
            const pad = (num) => num.toString().padStart(2, '0');
            
            return format
                .replace('YYYY', date.getFullYear())
                .replace('MM', pad(date.getMonth() + 1))
                .replace('DD', pad(date.getDate()))
                .replace('HH', pad(date.getHours()))
                .replace('mm', pad(date.getMinutes()))
                .replace('ss', pad(date.getSeconds()));
        },
        
        // 格式化相对时间
        relativeTime(date) {
            const now = new Date();
            const diff = now - new Date(date);
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `${days}天前`;
            if (hours > 0) return `${hours}小时前`;
            if (minutes > 0) return `${minutes}分钟前`;
            return '刚刚';
        },
        
        // 格式化持续时间
        duration(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            
            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    },
    
    // ===== 本地存储工具 =====
    storage: {
        // 设置数据
        set(key, value, expiry = null) {
            const data = {
                value,
                timestamp: Date.now(),
                expiry: expiry ? Date.now() + expiry : null
            };
            
            const storageKey = ConfigUtils.getStorageKey(key);
            localStorage.setItem(storageKey, JSON.stringify(data));
        },
        
        // 获取数据
        get(key, defaultValue = null) {
            const storageKey = ConfigUtils.getStorageKey(key);
            const item = localStorage.getItem(storageKey);
            
            if (!item) return defaultValue;
            
            try {
                const data = JSON.parse(item);
                
                // 检查是否过期
                if (data.expiry && Date.now() > data.expiry) {
                    this.remove(key);
                    return defaultValue;
                }
                
                return data.value;
            } catch {
                return defaultValue;
            }
        },
        
        // 移除数据
        remove(key) {
            const storageKey = ConfigUtils.getStorageKey(key);
            localStorage.removeItem(storageKey);
        },
        
        // 清空所有数据
        clear() {
            const prefix = AppConfig.storage.prefix;
            const keys = Object.keys(localStorage).filter(key => key.startsWith(prefix));
            keys.forEach(key => localStorage.removeItem(key));
        },
        
        // 获取存储大小
        getSize() {
            const prefix = AppConfig.storage.prefix;
            let size = 0;
            
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(prefix)) {
                    size += localStorage.getItem(key).length;
                }
            });
            
            return size;
        }
    },
    
    // ===== 异步工具 =====
    async: {
        // 延迟执行
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        
        // 防抖函数
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // 节流函数
        throttle(func, limit) {
            let inThrottle;
            return function executedFunction(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // 重试函数
        async retry(fn, maxRetries = 3, delay = 1000) {
            for (let i = 0; i < maxRetries; i++) {
                try {
                    return await fn();
                } catch (error) {
                    if (i === maxRetries - 1) throw error;
                    await this.delay(delay * Math.pow(2, i)); // 指数退避
                }
            }
        },
        
        // 超时控制
        timeout(promise, ms) {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('操作超时')), ms);
            });
            
            return Promise.race([promise, timeoutPromise]);
        }
    },
    
    // ===== 数学工具 =====
    math: {
        // 限制数值范围
        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },
        
        // 线性插值
        lerp(start, end, factor) {
            return start + (end - start) * factor;
        },
        
        // 生成随机数
        random(min = 0, max = 1) {
            return Math.random() * (max - min) + min;
        },
        
        // 生成随机整数
        randomInt(min, max) {
            return Math.floor(this.random(min, max + 1));
        },
        
        // 角度转弧度
        toRadians(degrees) {
            return degrees * Math.PI / 180;
        },
        
        // 弧度转角度
        toDegrees(radians) {
            return radians * 180 / Math.PI;
        }
    },
    
    // ===== 颜色工具 =====
    color: {
        // 十六进制转RGB
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        
        // RGB转十六进制
        rgbToHex(r, g, b) {
            return "#" + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            }).join("");
        },
        
        // 生成随机颜色
        random() {
            return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        }
    },
    
    // ===== 设备检测 =====
    device: {
        // 检测移动设备
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        
        // 检测触摸设备
        isTouchDevice() {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        },
        
        // 获取屏幕信息
        getScreenInfo() {
            return {
                width: window.screen.width,
                height: window.screen.height,
                availWidth: window.screen.availWidth,
                availHeight: window.screen.availHeight,
                pixelRatio: window.devicePixelRatio || 1
            };
        },
        
        // 获取浏览器信息
        getBrowserInfo() {
            const ua = navigator.userAgent;
            let browser = 'Unknown';
            
            if (ua.includes('Chrome')) browser = 'Chrome';
            else if (ua.includes('Firefox')) browser = 'Firefox';
            else if (ua.includes('Safari')) browser = 'Safari';
            else if (ua.includes('Edge')) browser = 'Edge';
            
            return {
                name: browser,
                userAgent: ua,
                language: navigator.language,
                platform: navigator.platform
            };
        }
    }
};

console.log('🛠️ 工具函数已加载'); 