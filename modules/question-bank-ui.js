/**
 * 题库UI组件管理模块
 * 负责界面交互、通知、模态框等UI功能
 */
window.QuestionBankUI = (function() {
    // 私有变量
    let activeModals = [];
    let notificationQueue = [];
    let isProcessingNotifications = false;
    
    // 配置
    const config = {
        notificationDuration: 3000,
        animationDuration: 300,
        maxNotifications: 5
    };
    
    // 公有方法
    return {
        // 初始化模块
        init: function() {
            console.log('初始化UI组件模块...');
            this.createNotificationContainer();
            this.bindGlobalEvents();
            this.initializeTooltips();
            return this;
        },
        
        // 创建通知容器
        createNotificationContainer: function() {
            let container = document.getElementById('notification-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'notification-container';
                container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    pointer-events: none;
                `;
                document.body.appendChild(container);
            }
        },
        
        // 显示通知
        showNotification: function(message, type = 'info', duration = config.notificationDuration) {
            const notification = {
                id: Date.now() + Math.random(),
                message,
                type,
                duration
            };
            
            notificationQueue.push(notification);
            
            if (!isProcessingNotifications) {
                this.processNotificationQueue();
            }
        },
        
        // 处理通知队列
        processNotificationQueue: function() {
            if (notificationQueue.length === 0) {
                isProcessingNotifications = false;
                return;
            }
            
            isProcessingNotifications = true;
            const notification = notificationQueue.shift();
            this.displayNotification(notification);
            
            // 处理下一个通知
            setTimeout(() => {
                this.processNotificationQueue();
            }, 100);
        },
        
        // 显示单个通知
        displayNotification: function(notification) {
            const container = document.getElementById('notification-container');
            if (!container) return;
            
            // 限制同时显示的通知数量
            const existingNotifications = container.querySelectorAll('.notification');
            if (existingNotifications.length >= config.maxNotifications) {
                existingNotifications[0].remove();
            }
            
            const notificationElement = document.createElement('div');
            notificationElement.className = `notification ${notification.type}`;
            notificationElement.style.cssText = `
                background: ${this.getNotificationColor(notification.type)};
                color: white;
                padding: 15px 20px;
                margin-bottom: 10px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                font-weight: 500;
                max-width: 400px;
                word-wrap: break-word;
                pointer-events: auto;
                cursor: pointer;
                animation: slideIn 0.3s ease;
                position: relative;
                overflow: hidden;
            `;
            
            // 添加图标
            const icon = this.getNotificationIcon(notification.type);
            notificationElement.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i class="${icon}" style="font-size: 1.2em;"></i>
                    <div style="flex: 1;">${notification.message}</div>
                    <i class="fas fa-times" style="cursor: pointer; opacity: 0.7; font-size: 0.9em;" onclick="this.parentElement.parentElement.remove()"></i>
                </div>
            `;
            
            container.appendChild(notificationElement);
            
            // 自动移除
            if (notification.duration > 0) {
                setTimeout(() => {
                    if (notificationElement.parentNode) {
                        notificationElement.style.animation = 'slideOut 0.3s ease';
                        setTimeout(() => {
                            if (notificationElement.parentNode) {
                                notificationElement.remove();
                            }
                        }, config.animationDuration);
                    }
                }, notification.duration);
            }
            
            // 点击移除
            notificationElement.addEventListener('click', (e) => {
                if (e.target.classList.contains('fa-times')) return;
                notificationElement.remove();
            });
        },
        
        // 获取通知颜色
        getNotificationColor: function(type) {
            const colors = {
                'success': '#28a745',
                'error': '#dc3545',
                'warning': '#ffc107',
                'info': '#007bff'
            };
            return colors[type] || colors.info;
        },
        
        // 获取通知图标
        getNotificationIcon: function(type) {
            const icons = {
                'success': 'fas fa-check-circle',
                'error': 'fas fa-exclamation-circle',
                'warning': 'fas fa-exclamation-triangle',
                'info': 'fas fa-info-circle'
            };
            return icons[type] || icons.info;
        },
        
        // 创建模态框
        createModal: function(options = {}) {
            const modal = {
                id: Date.now() + Math.random(),
                title: options.title || '提示',
                content: options.content || '',
                size: options.size || 'medium', // small, medium, large
                closable: options.closable !== false,
                backdrop: options.backdrop !== false,
                onShow: options.onShow || null,
                onHide: options.onHide || null,
                onConfirm: options.onConfirm || null,
                onCancel: options.onCancel || null
            };
            
            const modalElement = this.createModalElement(modal);
            document.body.appendChild(modalElement);
            activeModals.push(modal);
            
            // 显示动画
            setTimeout(() => {
                modalElement.classList.add('show');
            }, 10);
            
            // 触发显示回调
            if (modal.onShow) {
                modal.onShow(modal);
            }
            
            return modal;
        },
        
        // 创建模态框元素
        createModalElement: function(modal) {
            const modalElement = document.createElement('div');
            modalElement.className = 'modal-overlay';
            modalElement.dataset.modalId = modal.id;
            
            const sizeClasses = {
                small: 'modal-sm',
                medium: 'modal-md',
                large: 'modal-lg'
            };
            
            modalElement.innerHTML = `
                <div class="modal-backdrop" ${modal.backdrop ? 'onclick="QuestionBankUI.hideModal(' + modal.id + ')"' : ''}></div>
                <div class="modal-dialog ${sizeClasses[modal.size]}">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">${modal.title}</h4>
                            ${modal.closable ? '<button class="modal-close" onclick="QuestionBankUI.hideModal(' + modal.id + ')">&times;</button>' : ''}
                        </div>
                        <div class="modal-body">
                            ${modal.content}
                        </div>
                        <div class="modal-footer">
                            ${modal.onCancel ? '<button class="btn btn-secondary" onclick="QuestionBankUI.modalCancel(' + modal.id + ')">取消</button>' : ''}
                            ${modal.onConfirm ? '<button class="btn btn-primary" onclick="QuestionBankUI.modalConfirm(' + modal.id + ')">确定</button>' : ''}
                        </div>
                    </div>
                </div>
            `;
            
            // 添加样式
            modalElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity ${config.animationDuration}ms ease;
            `;
            
            return modalElement;
        },
        
        // 隐藏模态框
        hideModal: function(modalId) {
            const modalIndex = activeModals.findIndex(m => m.id === modalId);
            if (modalIndex === -1) return;
            
            const modal = activeModals[modalIndex];
            const modalElement = document.querySelector(`[data-modal-id="${modalId}"]`);
            
            if (modalElement) {
                modalElement.classList.remove('show');
                setTimeout(() => {
                    if (modalElement.parentNode) {
                        modalElement.remove();
                    }
                }, config.animationDuration);
            }
            
            activeModals.splice(modalIndex, 1);
            
            // 触发隐藏回调
            if (modal.onHide) {
                modal.onHide(modal);
            }
        },
        
        // 模态框确认
        modalConfirm: function(modalId) {
            const modal = activeModals.find(m => m.id === modalId);
            if (modal && modal.onConfirm) {
                const result = modal.onConfirm(modal);
                if (result !== false) {
                    this.hideModal(modalId);
                }
            } else {
                this.hideModal(modalId);
            }
        },
        
        // 模态框取消
        modalCancel: function(modalId) {
            const modal = activeModals.find(m => m.id === modalId);
            if (modal && modal.onCancel) {
                modal.onCancel(modal);
            }
            this.hideModal(modalId);
        },
        
        // 确认对话框
        confirm: function(message, title = '确认', options = {}) {
            return new Promise((resolve) => {
                this.createModal({
                    title: title,
                    content: `<p>${message}</p>`,
                    size: options.size || 'small',
                    onConfirm: () => resolve(true),
                    onCancel: () => resolve(false),
                    onHide: () => resolve(false)
                });
            });
        },
        
        // 警告对话框
        alert: function(message, title = '提示', options = {}) {
            return new Promise((resolve) => {
                this.createModal({
                    title: title,
                    content: `<p>${message}</p>`,
                    size: options.size || 'small',
                    onConfirm: () => resolve(true),
                    onHide: () => resolve(true)
                });
            });
        },
        
        // 输入对话框
        prompt: function(message, defaultValue = '', title = '输入', options = {}) {
            const inputId = 'prompt-input-' + Date.now();
            return new Promise((resolve) => {
                this.createModal({
                    title: title,
                    content: `
                        <div>
                            <p>${message}</p>
                            <input type="text" id="${inputId}" value="${defaultValue}" 
                                   style="width: 100%; padding: 8px; margin-top: 10px; border: 1px solid #ccc; border-radius: 4px;">
                        </div>
                    `,
                    size: options.size || 'small',
                    onShow: () => {
                        const input = document.getElementById(inputId);
                        if (input) {
                            input.focus();
                            input.select();
                        }
                    },
                    onConfirm: () => {
                        const input = document.getElementById(inputId);
                        resolve(input ? input.value : null);
                    },
                    onCancel: () => resolve(null),
                    onHide: () => resolve(null)
                });
            });
        },
        
        // 加载提示
        showLoading: function(message = '加载中...') {
            const loadingId = 'loading-' + Date.now();
            const loadingElement = document.createElement('div');
            loadingElement.id = loadingId;
            loadingElement.className = 'loading-overlay';
            loadingElement.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <p>${message}</p>
                </div>
            `;
            
            loadingElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
                color: white;
                text-align: center;
            `;
            
            document.body.appendChild(loadingElement);
            return loadingId;
        },
        
        // 隐藏加载提示
        hideLoading: function(loadingId) {
            const loadingElement = document.getElementById(loadingId);
            if (loadingElement) {
                loadingElement.remove();
            }
        },
        
        // 绑定全局事件
        bindGlobalEvents: function() {
            // ESC键关闭模态框
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && activeModals.length > 0) {
                    const lastModal = activeModals[activeModals.length - 1];
                    if (lastModal.closable) {
                        this.hideModal(lastModal.id);
                    }
                }
            });
            
            // 防止背景滚动
            document.addEventListener('wheel', (e) => {
                if (activeModals.length > 0) {
                    e.preventDefault();
                }
            }, { passive: false });
        },
        
        // 初始化工具提示
        initializeTooltips: function() {
            // 为所有带有title属性的元素添加工具提示
            document.addEventListener('mouseover', (e) => {
                const element = e.target;
                if (element.title && !element.dataset.tooltipAdded) {
                    this.addTooltip(element);
                    element.dataset.tooltipAdded = 'true';
                }
            });
        },
        
        // 添加工具提示
        addTooltip: function(element) {
            const title = element.title;
            element.title = ''; // 移除原生tooltip
            
            let tooltip = null;
            
            element.addEventListener('mouseenter', () => {
                tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = title;
                tooltip.style.cssText = `
                    position: absolute;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    z-index: 10003;
                    pointer-events: none;
                    white-space: nowrap;
                `;
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            });
            
            element.addEventListener('mouseleave', () => {
                if (tooltip) {
                    tooltip.remove();
                    tooltip = null;
                }
            });
        },
        
        // 动画工具方法
        fadeIn: function(element, duration = config.animationDuration) {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease`;
            
            setTimeout(() => {
                element.style.opacity = '1';
            }, 10);
        },
        
        fadeOut: function(element, duration = config.animationDuration) {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.remove();
                }
            }, duration);
        },
        
        slideUp: function(element, duration = config.animationDuration) {
            const height = element.offsetHeight;
            element.style.transition = `height ${duration}ms ease, opacity ${duration}ms ease`;
            element.style.height = height + 'px';
            element.style.overflow = 'hidden';
            
            setTimeout(() => {
                element.style.height = '0';
                element.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.remove();
                }
            }, duration);
        },
        
        slideDown: function(element, duration = config.animationDuration) {
            element.style.height = '0';
            element.style.overflow = 'hidden';
            element.style.transition = `height ${duration}ms ease, opacity ${duration}ms ease`;
            element.style.opacity = '0';
            
            const targetHeight = element.scrollHeight;
            
            setTimeout(() => {
                element.style.height = targetHeight + 'px';
                element.style.opacity = '1';
            }, 10);
            
            setTimeout(() => {
                element.style.height = 'auto';
                element.style.overflow = 'visible';
            }, duration);
        },
        
        // 工具方法
        debounce: function(func, wait) {
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
        
        throttle: function(func, limit) {
            let inThrottle;
            return function executedFunction(...args) {
                if (!inThrottle) {
                    func(...args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // 获取当前活动的模态框
        getActiveModals: function() {
            return [...activeModals];
        },
        
        // 关闭所有模态框
        closeAllModals: function() {
            [...activeModals].forEach(modal => {
                this.hideModal(modal.id);
            });
        }
    };
})();

// 将通知函数设为全局可用
window.showNotification = function(message, type, duration) {
    if (window.QuestionBankUI) {
        window.QuestionBankUI.showNotification(message, type, duration);
    } else {
        console.log(`[${type}] ${message}`);
    }
};

// 添加必要的CSS样式
const uiStyles = document.createElement('style');
uiStyles.textContent = `
    .modal-overlay.show {
        opacity: 1 !important;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
    }
    
    .modal-dialog {
        position: relative;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-height: 90vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    
    .modal-sm { width: 300px; }
    .modal-md { width: 500px; }
    .modal-lg { width: 700px; }
    
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
    }
    
    .modal-title {
        margin: 0;
        color: #333;
        font-size: 1.2em;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #999;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-close:hover {
        color: #333;
    }
    
    .modal-body {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
        color: #333;
    }
    
    .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        background: #f8f9fa;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 15px;
    }
    
    .custom-tooltip {
        animation: fadeIn 0.2s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @media (max-width: 768px) {
        .modal-sm, .modal-md, .modal-lg {
            width: 90vw;
            max-width: 400px;
        }
        
        .modal-header, .modal-body, .modal-footer {
            padding: 15px;
        }
    }
`;

document.head.appendChild(uiStyles); 