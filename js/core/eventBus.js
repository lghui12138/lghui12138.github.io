// ===== 事件总线系统 =====
window.EventBus = {
    // 事件监听器存储
    listeners: new Map(),
    
    // 事件历史记录
    history: [],
    
    // 最大历史记录数
    maxHistory: 100,
    
    // 订阅事件
    on(event, callback, options = {}) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        
        const listener = {
            callback,
            once: options.once || false,
            priority: options.priority || 0,
            id: this.generateId()
        };
        
        const listeners = this.listeners.get(event);
        listeners.push(listener);
        
        // 按优先级排序
        listeners.sort((a, b) => b.priority - a.priority);
        
        return listener.id;
    },
    
    // 订阅一次性事件
    once(event, callback, options = {}) {
        return this.on(event, callback, { ...options, once: true });
    },
    
    // 取消订阅
    off(event, listenerId) {
        if (!this.listeners.has(event)) return false;
        
        const listeners = this.listeners.get(event);
        const index = listeners.findIndex(listener => listener.id === listenerId);
        
        if (index !== -1) {
            listeners.splice(index, 1);
            if (listeners.length === 0) {
                this.listeners.delete(event);
            }
            return true;
        }
        
        return false;
    },
    
    // 发布事件
    emit(event, data = null, options = {}) {
        const eventData = {
            event,
            data,
            timestamp: Date.now(),
            source: options.source || 'unknown'
        };
        
        // 记录事件历史
        this.addToHistory(eventData);
        
        if (!this.listeners.has(event)) {
            if (AppConfig.app.debug) {
                console.log(`📡 事件发布: ${event} (无监听器)`, data);
            }
            return;
        }
        
        const listeners = [...this.listeners.get(event)];
        
        if (AppConfig.app.debug) {
            console.log(`📡 事件发布: ${event} -> ${listeners.length}个监听器`, data);
        }
        
        // 执行监听器
        listeners.forEach(listener => {
            try {
                listener.callback(data, eventData);
                
                // 如果是一次性监听器，执行后移除
                if (listener.once) {
                    this.off(event, listener.id);
                }
            } catch (error) {
                console.error(`❌ 事件监听器执行错误: ${event}`, error);
            }
        });
    },
    
    // 异步发布事件
    async emitAsync(event, data = null, options = {}) {
        const eventData = {
            event,
            data,
            timestamp: Date.now(),
            source: options.source || 'unknown'
        };
        
        this.addToHistory(eventData);
        
        if (!this.listeners.has(event)) {
            if (AppConfig.app.debug) {
                console.log(`📡 异步事件发布: ${event} (无监听器)`, data);
            }
            return [];
        }
        
        const listeners = [...this.listeners.get(event)];
        
        if (AppConfig.app.debug) {
            console.log(`📡 异步事件发布: ${event} -> ${listeners.length}个监听器`, data);
        }
        
        const results = [];
        
        for (const listener of listeners) {
            try {
                const result = await listener.callback(data, eventData);
                results.push(result);
                
                if (listener.once) {
                    this.off(event, listener.id);
                }
            } catch (error) {
                console.error(`❌ 异步事件监听器执行错误: ${event}`, error);
                results.push(null);
            }
        }
        
        return results;
    },
    
    // 移除所有监听器
    removeAllListeners(event = null) {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    },
    
    // 获取事件监听器数量
    getListenerCount(event) {
        return this.listeners.has(event) ? this.listeners.get(event).length : 0;
    },
    
    // 获取所有事件名称
    getEventNames() {
        return Array.from(this.listeners.keys());
    },
    
    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // 添加到历史记录
    addToHistory(eventData) {
        this.history.push(eventData);
        
        // 限制历史记录数量
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    },
    
    // 获取事件历史
    getHistory(event = null, limit = 50) {
        let history = this.history;
        
        if (event) {
            history = history.filter(item => item.event === event);
        }
        
        return history.slice(-limit);
    },
    
    // 清空历史记录
    clearHistory() {
        this.history = [];
    },
    
    // 事件统计
    getStats() {
        const stats = {
            totalEvents: this.listeners.size,
            totalListeners: 0,
            historyCount: this.history.length,
            events: {}
        };
        
        this.listeners.forEach((listeners, event) => {
            stats.totalListeners += listeners.length;
            stats.events[event] = {
                listenerCount: listeners.length,
                lastEmitted: this.getLastEmitTime(event)
            };
        });
        
        return stats;
    },
    
    // 获取事件最后发布时间
    getLastEmitTime(event) {
        const eventHistory = this.history.filter(item => item.event === event);
        return eventHistory.length > 0 ? eventHistory[eventHistory.length - 1].timestamp : null;
    }
};

// ===== 预定义的系统事件 =====
window.SystemEvents = {
    // 应用生命周期
    APP_INIT: 'app:init',
    APP_READY: 'app:ready',
    APP_ERROR: 'app:error',
    
    // 用户认证
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_SESSION_EXPIRED: 'user:session_expired',
    
    // 学习相关
    QUESTION_ANSWERED: 'learning:question_answered',
    PROGRESS_UPDATED: 'learning:progress_updated',
    ACHIEVEMENT_UNLOCKED: 'learning:achievement_unlocked',
    
    // UI交互
    MODAL_OPEN: 'ui:modal_open',
    MODAL_CLOSE: 'ui:modal_close',
    NOTIFICATION_SHOW: 'ui:notification_show',
    THEME_CHANGED: 'ui:theme_changed',
    
    // 数据同步
    DATA_SYNC_START: 'data:sync_start',
    DATA_SYNC_SUCCESS: 'data:sync_success',
    DATA_SYNC_ERROR: 'data:sync_error',
    
    // 性能监控
    PERFORMANCE_METRIC: 'performance:metric',
    ERROR_OCCURRED: 'error:occurred',
    
    // AI交互
    AI_REQUEST_START: 'ai:request_start',
    AI_REQUEST_SUCCESS: 'ai:request_success',
    AI_REQUEST_ERROR: 'ai:request_error'
};

// ===== 便捷方法 =====
window.addEventListener('beforeunload', () => {
    EventBus.emit(SystemEvents.APP_ERROR, { type: 'beforeunload' });
});

// 错误捕获
window.addEventListener('error', (event) => {
    EventBus.emit(SystemEvents.ERROR_OCCURRED, {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        error: event.error
    });
});

// Promise 错误捕获
window.addEventListener('unhandledrejection', (event) => {
    EventBus.emit(SystemEvents.ERROR_OCCURRED, {
        type: 'unhandledrejection',
        reason: event.reason
    });
});

console.log('📡 事件总线系统已加载'); 