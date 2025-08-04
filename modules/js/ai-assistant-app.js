const { createApp } = Vue;

// 添加调试信息
console.log('Vue版本:', Vue.version);
console.log('Vue对象:', Vue);
console.log('createApp函数:', createApp);

// 检查DOM元素
const appElement = document.getElementById('app');
console.log('Vue挂载元素:', appElement);

if (!appElement) {
    console.error('❌ 找不到Vue挂载元素 #app');
    // 创建挂载元素
    const newAppElement = document.createElement('div');
    newAppElement.id = 'app';
    document.body.appendChild(newAppElement);
    console.log('✅ 已创建Vue挂载元素');
}

createApp({
    data() {
        return {
            loading: true,
            isFullscreen: false,
            isTyping: false,
            currentMessage: '',
            networkStatus: {
                show: false,
                message: '',
                icon: 'fas fa-wifi',
                type: 'warning'
            },
            notification: {
                show: false,
                message: '',
                type: 'info'
            },
            messages: [
                {
                    id: 1,
                    sender: 'ai',
                    content: '👋 你好！我是你的流体力学学习助手。我可以帮助你解答流体力学相关的问题，提供学习建议，解释复杂概念。请随时向我提问！',
                    timestamp: new Date()
                }
            ],
            suggestions: [
                '伯努利方程的物理意义是什么？',
                '如何区分层流和湍流？',
                '雷诺数的计算公式和应用',
                '边界层理论的基本概念',
                '流体静力学的基本方程',
                '粘性力和惯性力的区别',
                '连续性方程的推导过程',
                '流体机械的工作原理'
            ]
        }
    },
    methods: {
        // 网络状态检测
        checkNetworkStatus() {
            if (!navigator.onLine) {
                this.showNetworkStatus('网络连接已断开', 'fas fa-wifi-slash', 'error');
            } else {
                this.hideNetworkStatus();
            }
        },

        showNetworkStatus(message, icon = 'fas fa-wifi', type = 'warning') {
            this.networkStatus = {
                show: true,
                message,
                icon,
                type
            };
        },

        hideNetworkStatus() {
            this.networkStatus.show = false;
        },

        // 资源加载错误处理
        handleResourceError(error) {
            console.warn('资源加载失败:', error);
            this.showNetworkStatus('部分资源加载失败，功能可能受限', 'fas fa-exclamation-triangle', 'warning');
        },

        // 显示通知
        showNotification(message, type = 'info') {
            this.notification = { show: true, message, type };
            setTimeout(() => {
                this.notification.show = false;
            }, 3000);
        },

        // 全屏功能
        toggleFullscreen() {
            if (!this.isFullscreen) {
                this.enterFullscreen();
            } else {
                this.exitFullscreen();
            }
        },

        enterFullscreen() {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
            this.isFullscreen = true;
        },

        exitFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.isFullscreen = false;
        },

        // 消息处理
        sendMessage() {
            if (!this.currentMessage.trim()) return;
            
            const userMessage = {
                id: Date.now(),
                sender: 'user',
                content: this.currentMessage,
                timestamp: new Date()
            };
            
            this.messages.push(userMessage);
            this.currentMessage = '';
            
            // 模拟AI回复
            this.isTyping = true;
            setTimeout(() => {
                this.generateAIResponse(userMessage.content);
            }, 1000 + Math.random() * 2000);
        },

        generateAIResponse(userMessage) {
            let response = this.getResponseForMessage(userMessage);
            
            const aiMessage = {
                id: Date.now(),
                sender: 'ai',
                content: response,
                timestamp: new Date()
            };
            
            this.messages.push(aiMessage);
            this.isTyping = false;
            
            // 延迟渲染数学公式
            this.$nextTick(() => {
                setTimeout(() => {
                    this.renderAIResponseMath();
                }, 500);
            });
        },

        getResponseForMessage(message) {
            const msg = message.toLowerCase();
            
            if (msg.includes('伯努利') || msg.includes('bernoulli')) {
                return `
**伯努利方程**是流体力学的基本方程之一，表达了理想流体沿流线的机械能守恒定律。

**数学表达式：**

$$\\frac{v^2}{2} + \\frac{p}{\\rho} + gz = 常数$$

**物理意义：**
- **$\\frac{v^2}{2}$**：动能项，代表流体的动能
- **$\\frac{p}{\\rho}$**：压能项，代表流体的压力能
- **$gz$**：位能项，代表流体的位置势能

**应用条件：**
1. 理想流体（无粘性）
2. 定常流动
3. 不可压缩流体
4. 沿同一流线

**实际应用：**
- 文丘里管测流量
- 机翼升力原理
- 孔板流量计

你还想了解伯努利方程的推导过程吗？
                `;
            } else if (msg.includes('雷诺数') || msg.includes('reynolds')) {
                return `
**雷诺数（Reynolds Number）**是判断流动状态的重要无量纲参数。

**定义公式：**

$$Re = \\frac{\\rho V L}{\\mu} = \\frac{V L}{\\nu}$$

**参数含义：**
- **$\\rho$**：流体密度
- **$V$**：特征速度
- **$L$**：特征长度
- **$\\mu$**：动力粘度
- **$\\nu$**：运动粘度

**物理意义：**
雷诺数表示惯性力与粘性力的比值：

$$Re = \\frac{惯性力}{粘性力} = \\frac{\\rho V^2}{\\mu V/L}$$

**临界值：**
- **圆管流动**：
  - $Re < 2300$：层流
  - $Re > 4000$：湍流
  - $2300 < Re < 4000$：过渡区

- **平板流动**：
  - $Re_{cr} ≈ 5 × 10^5$

**工程应用：**
相同雷诺数的流动具有相似性，用于模型试验和放大设计。
                `;
            } else if (msg.includes('层流') || msg.includes('湍流') || msg.includes('turbulent') || msg.includes('laminar')) {
                return `
**层流与湍流的区别**

**层流（Laminar Flow）特征：**
- 流体质点有序运动，轨迹线平滑
- 流层之间不相互混合
- 粘性力起主导作用
- 阻力较小，传热传质较差

**湍流（Turbulent Flow）特征：**
- 流体质点无序运动，有涡旋
- 流层之间强烈混合
- 惯性力起主导作用
- 阻力较大，传热传质较好

**判断准则：**
通过雷诺数判断：

$$Re = \\frac{\\rho V D}{\\mu}$$

**圆管中：**
- $Re < 2300$：层流
- $Re > 4000$：湍流

**可视化区别：**
- **层流**：如蜂蜜的流动，平滑有序
- **湍流**：如急流的水，混沌不规则

**工程意义：**
- 层流：精密设备、微流体
- 湍流：强化传热、混合过程
                `;
            } else if (msg.includes('navier') || msg.includes('ns方程') || msg.includes('粘性')) {
                return `
**Navier-Stokes方程**是描述粘性流体运动的基本方程。

**矢量形式：**

$$\\rho\\frac{D\\vec{v}}{Dt} = -\\nabla p + \\rho\\vec{g} + \\mu\\nabla^2\\vec{v}$$

**物理意义：**
- **$\\rho\\frac{D\\vec{v}}{Dt}$**：惯性力项
- **$-\\nabla p$**：压力梯度力
- **$\\rho\\vec{g}$**：体积力（重力）
- **$\\mu\\nabla^2\\vec{v}$**：粘性力

**分量形式（直角坐标系）：**

**x方向：**
$$\\rho\\left(\\frac{\\partial u}{\\partial t} + u\\frac{\\partial u}{\\partial x} + v\\frac{\\partial u}{\\partial y} + w\\frac{\\partial u}{\\partial z}\\right) = -\\frac{\\partial p}{\\partial x} + \\rho g_x + \\mu\\nabla^2 u$$

**连续性方程：**
$$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho\\vec{v}) = 0$$

**应用范围：**
- 层流和湍流
- 可压缩和不可压缩流动
- 牛顿流体

这是流体力学的"圣杯方程"，描述了几乎所有流体现象！
                `;
            } else if (msg.includes('连续性方程') || msg.includes('continuity')) {
                return `
**连续性方程**表达了质量守恒定律在流体力学中的应用。

**微分形式：**

$$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho\\vec{v}) = 0$$

**物理意义：**
单位时间内流入控制体的质量 = 单位时间内流出的质量

**对于不可压缩流体** ($\\rho$ = 常数)：

$$\\nabla \\cdot \\vec{v} = 0$$

**直角坐标系：**
$$\\frac{\\partial u}{\\partial x} + \\frac{\\partial v}{\\partial y} + \\frac{\\partial w}{\\partial z} = 0$$

**一维稳定流：**
$$\\rho_1 A_1 V_1 = \\rho_2 A_2 V_2$$

对于不可压缩流体：
$$A_1 V_1 = A_2 V_2 = Q$$

**工程应用：**
- 管道流量计算
- 喷嘴设计
- 泵和风机选型

连续性方程是流体力学的基础，必须与动量方程联合求解！
                `;
            } else if (msg.includes('边界层') || msg.includes('boundary layer')) {
                return `
**边界层理论**是普朗特提出的重要概念，简化了粘性流体分析。

**基本概念：**
边界层是靠近固体壁面的薄层区域，在此区域内粘性力不可忽略。

**边界层厚度定义：**
速度达到外流速度99%处的距离：

$$\\delta: u(\\delta) = 0.99U$$

**边界层方程（二维稳定）：**

**连续性方程：**
$$\\frac{\\partial u}{\\partial x} + \\frac{\\partial v}{\\partial y} = 0$$

**动量方程：**
$$u\\frac{\\partial u}{\\partial x} + v\\frac{\\partial u}{\\partial y} = U\\frac{dU}{dx} + \\nu\\frac{\\partial^2 u}{\\partial y^2}$$

**层流边界层厚度：**
$$\\delta ≈ \\frac{5x}{\\sqrt{Re_x}}$$

其中 $Re_x = \\frac{Ux}{\\nu}$

**边界层分离：**
当压力梯度为正时可能发生分离：
$$\\frac{dp}{dx} > 0$$

**工程意义：**
- 阻力计算
- 传热分析
- 分离控制
                `;
            } else if (msg.includes('你好') || msg.includes('hello') || msg.includes('hi')) {
                return '你好！我是你的流体力学学习助手。我可以帮你解答关于流体力学的各种问题，包括基本概念、方程推导、实际应用等。请告诉我你想了解什么？';
            } else {
                return `感谢你的问题！这是一个很有趣的流体力学问题。

我建议你可以从以下几个方面来思考：

1. **基本概念**：确定涉及的物理量和基本定律
2. **数学建模**：建立相应的微分方程
3. **边界条件**：明确问题的约束条件
4. **求解方法**：选择合适的数值或解析方法

如果你能提供更具体的问题描述，我可以给出更详细的解答。比如：
- 伯努利方程的应用
- 雷诺数的计算
- Navier-Stokes方程的推导
- 边界层理论
- 湍流模型

请告诉我你最感兴趣的具体问题！`;
            }
        },

        useSuggestion(suggestion) {
            this.currentMessage = suggestion;
            this.sendMessage();
        },

        clearChat() {
            this.messages = [
                {
                    id: 1,
                    sender: 'ai',
                    content: '👋 你好！我是你的流体力学学习助手。请随时向我提问！',
                    timestamp: new Date()
                }
            ];
            this.showNotification('对话已清空', 'info');
        },

        formatTime(date) {
            return new Intl.DateTimeFormat('zh-CN', {
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        },

        navigateHome() {
            window.location.href = '../index.html';
        },

        // 强制重新渲染所有数学公式
        forceRenderAllMath() {
            console.log('开始强制渲染所有数学公式...');
            
            if (!window.MathJax || !window.MathJax.typesetPromise) {
                console.log('MathJax未加载，延迟重试...');
                setTimeout(() => {
                    this.forceRenderAllMath();
                }, 1000);
                return;
            }

            // 使用全局渲染函数
            if (window.renderAllMathFormulas) {
                window.renderAllMathFormulas();
            } else {
                // 备用方案
                MathJax.typesetPromise().then(() => {
                    console.log('✅ 所有数学公式渲染完成');
                }).catch((error) => {
                    console.error('❌ 数学公式渲染失败:', error);
                });
            }
        },

        // 测试MathJax是否正常工作
        testMathJax() {
            console.log('测试MathJax状态...');
            console.log('MathJax对象:', window.MathJax);
            console.log('MathJax.typesetPromise:', window.MathJax?.typesetPromise);
            
            // 检查页面中的公式
            const formulas = document.querySelectorAll('.math-formula');
            console.log('找到的公式元素数量:', formulas.length);
            formulas.forEach((el, index) => {
                console.log(`公式${index + 1}:`, el.innerHTML);
            });
            
            // 调用全局测试函数
            if (window.testMathJaxSimple) {
                window.testMathJaxSimple();
            }
        },

        // 强制重新渲染所有公式（更直接的方法）
        forceRenderMathDirect() {
            console.log('开始直接强制渲染...');
            
            // 检查MathJax是否可用
            if (!window.MathJax || !window.MathJax.typesetPromise) {
                console.error('MathJax不可用');
                return;
            }
            
            // 查找所有包含$$的元素
            const mathElements = document.querySelectorAll('.math-formula');
            console.log('找到数学公式元素:', mathElements.length);
            
            // 对每个元素进行渲染
            mathElements.forEach((el, index) => {
                console.log(`渲染公式${index + 1}:`, el.innerHTML);
                MathJax.typesetPromise([el]).then(() => {
                    console.log(`✅ 公式${index + 1}渲染成功`);
                }).catch(error => {
                    console.error(`❌ 公式${index + 1}渲染失败:`, error);
                });
            });
        },

        // 专门渲染AI回复中的公式
        renderAIResponseMath() {
            console.log('开始渲染AI回复中的公式...');
            
            if (!window.MathJax || !window.MathJax.typesetPromise) {
                console.log('MathJax未加载，延迟重试...');
                setTimeout(() => {
                    this.renderAIResponseMath();
                }, 1000);
                return;
            }
            
            // 查找所有AI消息
            const aiMessages = document.querySelectorAll('.message.ai');
            console.log('找到AI消息数量:', aiMessages.length);
            
            aiMessages.forEach((messageEl, index) => {
                const contentEl = messageEl.querySelector('.message-content');
                if (contentEl) {
                    const hasMath = contentEl.innerHTML.includes('$$') || 
                                   contentEl.innerHTML.includes('\\[') ||
                                   contentEl.innerHTML.includes('\\(');
                    
                    if (hasMath) {
                        console.log(`AI消息${index + 1}包含公式，开始渲染...`);
                        console.log('公式内容预览:', contentEl.innerHTML.substring(0, 300));
                        
                        // 先清除该元素中现有的MathJax元素
                        contentEl.querySelectorAll('.MathJax').forEach(el => {
                            el.remove();
                        });
                        
                        MathJax.typesetPromise([contentEl]).then(() => {
                            console.log(`✅ AI消息${index + 1}公式渲染完成`);
                            // 确保渲染后的公式可见
                            contentEl.querySelectorAll('.MathJax').forEach(el => {
                                el.style.display = 'block !important';
                                el.style.visibility = 'visible !important';
                            });
                        }).catch(error => {
                            console.error(`❌ AI消息${index + 1}公式渲染失败:`, error);
                            // 如果渲染失败，延迟重试
                            setTimeout(() => {
                                this.renderAIResponseMath();
                            }, 2000);
                        });
                    } else {
                        console.log(`AI消息${index + 1}不包含公式`);
                    }
                }
            });
        },

        // 键盘事件处理
        handleKeyboard(event) {
            switch(event.key) {
                case 'F11':
                    event.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    if (this.isFullscreen) {
                        event.preventDefault();
                        this.exitFullscreen();
                    } else {
                        window.location.href = '../index.html';
                    }
                    break;
                case 'l':
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.clearChat();
                    }
                    break;
            }
        }
    },

    mounted() {
        console.log('🤖 AI学习助手启动！');
        
        // 网络状态检测
        this.checkNetworkStatus();
        window.addEventListener('online', () => {
            this.hideNetworkStatus();
            this.showNotification('网络连接已恢复', 'success');
        });
        window.addEventListener('offline', () => {
            this.showNetworkStatus('网络连接已断开', 'fas fa-wifi-slash', 'error');
        });
        
        // 资源加载错误监听
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
                this.handleResourceError(e.target.src || e.target.href);
            }
        });
        
        // 初始化
        setTimeout(() => {
            this.loading = false;
            this.showNotification('AI助手已准备就绪，按F11进入全屏模式', 'info');
        }, 1500);

        // 绑定键盘事件
        document.addEventListener('keydown', this.handleKeyboard);

        // 监听全屏状态变化
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
        });
        
        // 延迟渲染数学公式
        setTimeout(() => {
            this.forceRenderAllMath();
        }, 3000);
    },

    beforeUnmount() {
        document.removeEventListener('keydown', this.handleKeyboard);
    }
});

// 尝试挂载Vue应用
try {
    const app = createApp({
        data() {
            return {
                loading: true,
                isFullscreen: false,
                isTyping: false,
                currentMessage: '',
                networkStatus: {
                    show: false,
                    message: '',
                    icon: 'fas fa-wifi',
                    type: 'warning'
                },
                notification: {
                    show: false,
                    message: '',
                    type: 'info'
                },
                messages: [
                    {
                        id: 1,
                        sender: 'ai',
                        content: '👋 你好！我是你的流体力学学习助手。我可以帮助你解答流体力学相关的问题，提供学习建议，解释复杂概念。请随时向我提问！',
                        timestamp: new Date()
                    }
                ],
                suggestions: [
                    '伯努利方程的物理意义是什么？',
                    '如何区分层流和湍流？',
                    '雷诺数的计算公式和应用',
                    '边界层理论的基本概念',
                    '流体静力学的基本方程',
                    '粘性力和惯性力的区别',
                    '连续性方程的推导过程',
                    '流体机械的工作原理'
                ]
            }
        },
        methods: {
            // 网络状态检测
            checkNetworkStatus() {
                if (!navigator.onLine) {
                    this.showNetworkStatus('网络连接已断开', 'fas fa-wifi-slash', 'error');
                } else {
                    this.hideNetworkStatus();
                }
            },

            showNetworkStatus(message, icon = 'fas fa-wifi', type = 'warning') {
                this.networkStatus = {
                    show: true,
                    message,
                    icon,
                    type
                };
            },

            hideNetworkStatus() {
                this.networkStatus.show = false;
            },

            // 资源加载错误处理
            handleResourceError(error) {
                console.warn('资源加载失败:', error);
                this.showNetworkStatus('部分资源加载失败，功能可能受限', 'fas fa-exclamation-triangle', 'warning');
            },

            // 显示通知
            showNotification(message, type = 'info') {
                this.notification = { show: true, message, type };
                setTimeout(() => {
                    this.notification.show = false;
                }, 3000);
            },

            // 全屏功能
            toggleFullscreen() {
                if (!this.isFullscreen) {
                    this.enterFullscreen();
                } else {
                    this.exitFullscreen();
                }
            },

            enterFullscreen() {
                const element = document.documentElement;
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
                this.isFullscreen = true;
            },

            exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                this.isFullscreen = false;
            },

            // 消息处理
            sendMessage() {
                if (!this.currentMessage.trim()) return;
                
                const userMessage = {
                    id: Date.now(),
                    sender: 'user',
                    content: this.currentMessage,
                    timestamp: new Date()
                };
                
                this.messages.push(userMessage);
                this.currentMessage = '';
                
                // 模拟AI回复
                this.isTyping = true;
                setTimeout(() => {
                    this.generateAIResponse(userMessage.content);
                }, 1000 + Math.random() * 2000);
            },

            generateAIResponse(userMessage) {
                let response = this.getResponseForMessage(userMessage);
                
                const aiMessage = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    content: response,
                    timestamp: new Date()
                };
                
                this.messages.push(aiMessage);
                this.isTyping = false;
                this.scrollToBottom();
                
                // 延迟渲染数学公式
                setTimeout(() => {
                    this.renderAIResponseMath();
                }, 500);
            },

            getResponseForMessage(message) {
                const lowerMessage = message.toLowerCase();
                
                // 伯努利方程相关
                if (lowerMessage.includes('伯努利') || lowerMessage.includes('bernoulli')) {
                    return `**伯努利方程**是流体力学中的基本方程之一，描述了理想流体沿流线的机械能守恒。

**物理意义：**
- 动能项：$\\frac{v^2}{2g}$ - 单位重量流体的动能
- 压力项：$\\frac{p}{\\rho g}$ - 单位重量流体的压力能
- 位能项：$z$ - 单位重量流体的位能

**数学表达式：**
$$\\frac{v^2}{2g} + \\frac{p}{\\rho g} + z = H$$

其中 $H$ 是总水头，沿流线保持常数。

**应用场景：**
- 文丘里管流量测量
- 机翼升力计算
- 管道流动分析
- 水泵扬程计算`;
                }
                
                // 雷诺数相关
                if (lowerMessage.includes('雷诺') || lowerMessage.includes('reynolds') || lowerMessage.includes('re')) {
                    return `**雷诺数**是判断流体流动状态的重要无量纲参数。

**定义：**
$$Re = \\frac{\\rho V L}{\\mu} = \\frac{V L}{\\nu}$$

其中：
- $\\rho$ - 流体密度 (kg/m³)
- $V$ - 特征速度 (m/s)
- $L$ - 特征长度 (m)
- $\\mu$ - 动力粘度 (Pa·s)
- $\\nu$ - 运动粘度 (m²/s)

**物理意义：**
雷诺数表示惯性力与粘性力的比值：
$$Re = \\frac{\\text{惯性力}}{\\text{粘性力}} = \\frac{\\rho V^2 L^2}{\\mu V L} = \\frac{\\rho V L}{\\mu}$$

**流动状态判断：**
- $Re < 2300$：层流
- $Re > 4000$：湍流
- $2300 < Re < 4000$：过渡流

**应用：**
- 管道流动分析
- 相似性分析
- 流动状态预测`;
                }
                
                // 层流湍流相关
                if (lowerMessage.includes('层流') || lowerMessage.includes('湍流') || lowerMessage.includes('laminar') || lowerMessage.includes('turbulent')) {
                    return `**层流与湍流的区别：**

**层流 (Laminar Flow)：**
- 流体质点沿平行流线运动
- 速度分布呈抛物线形
- 能量损失较小
- 雷诺数 $Re < 2300$

**湍流 (Turbulent Flow)：**
- 流体质点做不规则运动
- 速度分布较均匀
- 能量损失较大
- 雷诺数 $Re > 4000$

**速度分布对比：**
层流：$u(r) = \\frac{R^2}{4\\mu}(-\\frac{dp}{dx})(1 - \\frac{r^2}{R^2})$
湍流：$u(r) = V_{max}(1 - \\frac{r}{R})^{1/7}$

**能量损失：**
层流：$h_f = \\frac{32\\mu L V}{\\rho g D^2}$
湍流：$h_f = f \\frac{L}{D} \\frac{V^2}{2g}$`;
                }
                
                // 边界层相关
                if (lowerMessage.includes('边界层') || lowerMessage.includes('boundary layer')) {
                    return `**边界层理论**是流体力学中的重要概念。

**定义：**
边界层是靠近固体壁面的薄层流体，其中粘性效应显著。

**边界层厚度：**
$$\\delta = 5\\sqrt{\\frac{\\nu x}{U_\\infty}}$$

其中：
- $\\delta$ - 边界层厚度
- $\\nu$ - 运动粘度
- $x$ - 距离前缘的距离
- $U_\\infty$ - 来流速度

**边界层方程：**
$$u\\frac{\\partial u}{\\partial x} + v\\frac{\\partial u}{\\partial y} = U_\\infty\\frac{dU_\\infty}{dx} + \\nu\\frac{\\partial^2 u}{\\partial y^2}$$

**边界层分离：**
当压力梯度为正时，边界层可能发生分离，导致流动失稳。`;
                }
                
                // 流体静力学相关
                if (lowerMessage.includes('静力学') || lowerMessage.includes('静压') || lowerMessage.includes('hydrostatics')) {
                    return `**流体静力学**研究静止流体的力学性质。

**基本方程：**
$$\\nabla p = \\rho \\vec{g}$$

在重力场中：
$$\\frac{dp}{dz} = -\\rho g$$

**静水压强分布：**
$$p = p_0 + \\rho g h$$

其中：
- $p$ - 压强
- $p_0$ - 表面压强
- $\\rho$ - 流体密度
- $g$ - 重力加速度
- $h$ - 深度

**阿基米德原理：**
浸入流体中的物体受到向上的浮力，大小等于排开流体的重量：
$$F_b = \\rho g V$$

**应用：**
- 水坝设计
- 浮力计算
- 压力测量`;
                }
                
                // 粘性力相关
                if (lowerMessage.includes('粘性') || lowerMessage.includes('viscous') || lowerMessage.includes('viscosity')) {
                    return `**粘性力与惯性力的区别：**

**粘性力 (Viscous Force)：**
- 由流体内部摩擦产生
- 与速度梯度成正比
- 数学表达式：$F_v = \\mu A \\frac{du}{dy}$
- 单位：N

**惯性力 (Inertial Force)：**
- 由流体加速度产生
- 与密度和速度平方成正比
- 数学表达式：$F_i = \\rho A V^2$
- 单位：N

**牛顿粘性定律：**
$$\\tau = \\mu \\frac{du}{dy}$$

其中：
- $\\tau$ - 剪切应力
- $\\mu$ - 动力粘度
- $\\frac{du}{dy}$ - 速度梯度

**雷诺数意义：**
$$Re = \\frac{\\text{惯性力}}{\\text{粘性力}} = \\frac{\\rho V L}{\\mu}$$`;
                }
                
                // 连续性方程相关
                if (lowerMessage.includes('连续性') || lowerMessage.includes('continuity')) {
                    return `**连续性方程**是质量守恒定律在流体力学中的体现。

**一般形式：**
$$\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\vec{v}) = 0$$

**不可压缩流体：**
$$\\nabla \\cdot \\vec{v} = 0$$

**一维定常流动：**
$$\\rho_1 A_1 V_1 = \\rho_2 A_2 V_2$$

对于不可压缩流体：
$$A_1 V_1 = A_2 V_2$$

**物理意义：**
- 流入控制体的质量 = 流出控制体的质量
- 体积流量守恒（不可压缩流体）

**应用：**
- 管道流动分析
- 流量计算
- 速度分布确定`;
                }
                
                // 流体机械相关
                if (lowerMessage.includes('机械') || lowerMessage.includes('泵') || lowerMessage.includes('涡轮') || lowerMessage.includes('turbine') || lowerMessage.includes('pump')) {
                    return `**流体机械**是利用流体能量转换的机械设备。

**主要类型：**
1. **泵 (Pump)** - 将机械能转换为流体能
2. **涡轮 (Turbine)** - 将流体能转换为机械能
3. **压缩机 (Compressor)** - 提高气体压力
4. **风机 (Fan)** - 输送气体

**基本方程：**
**欧拉涡轮方程：**
$$H = \\frac{u_2 V_{u2} - u_1 V_{u1}}{g}$$

其中：
- $H$ - 理论扬程
- $u$ - 叶轮圆周速度
- $V_u$ - 绝对速度的圆周分量

**功率计算：**
$$P = \\rho g Q H$$

其中：
- $P$ - 功率
- $Q$ - 流量
- $H$ - 扬程`;
                }
                
                // 默认回复
                return `感谢您的提问！我是专业的流体力学学习助手，可以帮您解答：

**常见问题：**
- 伯努利方程的物理意义和应用
- 雷诺数的计算和流动状态判断
- 层流与湍流的区别
- 边界层理论的基本概念
- 流体静力学的基本方程
- 粘性力与惯性力的区别
- 连续性方程的推导过程
- 流体机械的工作原理

**智能功能：**
- 自动公式推导
- 步骤分解解释
- 错误检测和纠正
- 交互式练习

请告诉我您想了解哪个方面，我会为您提供详细的解答！`;
            },

            // 使用建议
            useSuggestion(suggestion) {
                this.currentMessage = suggestion;
                this.sendMessage();
            },

            // 清空聊天
            clearChat() {
                this.messages = [{
                    id: 1,
                    sender: 'ai',
                    content: '👋 你好！我是你的流体力学学习助手。我可以帮助你解答流体力学相关的问题，提供学习建议，解释复杂概念。请随时向我提问！',
                    timestamp: new Date()
                }];
                this.showNotification('聊天记录已清空', 'info');
            },

            // 时间格式化
            formatTime(date) {
                return new Date(date).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
            },

            // 返回主页
            navigateHome() {
                window.location.href = '../index.html';
            },

            // 强制渲染所有数学公式
            forceRenderAllMath() {
                console.log('开始强制渲染所有数学公式...');
                
                if (window.MathJax && window.MathJax.typesetPromise) {
                    // 先清除所有现有的MathJax元素
                    document.querySelectorAll('.MathJax').forEach(el => {
                        el.remove();
                    });
                    
                    // 重新渲染所有公式
                    MathJax.typesetPromise().then(() => {
                        console.log('✅ 所有数学公式渲染完成');
                        // 确保所有公式元素可见
                        document.querySelectorAll('.MathJax').forEach(el => {
                            el.style.display = 'block !important';
                            el.style.visibility = 'visible !important';
                        });
                    }).catch((error) => {
                        console.error('❌ 数学公式渲染失败:', error);
                        // 如果失败，延迟重试
                        setTimeout(() => {
                            this.forceRenderAllMath();
                        }, 2000);
                    });
                } else {
                    console.log('MathJax未加载，延迟重试...');
                    setTimeout(() => {
                        this.forceRenderAllMath();
                    }, 1000);
                }
            },

            // 测试MathJax
            testMathJax() {
                console.log('测试MathJax功能...');
                
                // 创建一个测试元素
                const testElement = document.createElement('div');
                testElement.innerHTML = '测试公式：$$E = mc^2$$';
                testElement.style.position = 'absolute';
                testElement.style.left = '-9999px';
                document.body.appendChild(testElement);
                
                MathJax.typesetPromise([testElement]).then(() => {
                    console.log('✅ MathJax测试成功');
                    document.body.removeChild(testElement);
                }).catch((error) => {
                    console.error('❌ MathJax测试失败:', error);
                    document.body.removeChild(testElement);
                });
            },

            // 强制直接渲染数学公式
            forceRenderMathDirect() {
                console.log('开始直接渲染数学公式...');
                
                // 查找所有包含数学公式的元素
                const mathElements = document.querySelectorAll('.message-content');
                
                mathElements.forEach((element, index) => {
                    const content = element.innerHTML;
                    if (content.includes('$$') || content.includes('\\[') || content.includes('\\(')) {
                        console.log(`处理元素 ${index + 1}，包含公式`);
                        
                        // 先清除该元素中现有的MathJax元素
                        element.querySelectorAll('.MathJax').forEach(el => {
                            el.remove();
                        });
                        
                        // 直接渲染该元素
                        MathJax.typesetPromise([element]).then(() => {
                            console.log(`✅ 元素 ${index + 1} 公式渲染完成`);
                            // 确保渲染后的公式可见
                            element.querySelectorAll('.MathJax').forEach(el => {
                                el.style.display = 'block !important';
                                el.style.visibility = 'visible !important';
                            });
                        }).catch(error => {
                            console.error(`❌ 元素 ${index + 1} 公式渲染失败:`, error);
                        });
                    }
                });
            },

            // 渲染AI回复中的数学公式
            renderAIResponseMath() {
                console.log('开始渲染AI回复中的数学公式...');
                
                if (!window.MathJax || !window.MathJax.typesetPromise) {
                    console.log('MathJax未加载，延迟重试...');
                    setTimeout(() => {
                        this.renderAIResponseMath();
                    }, 1000);
                    return;
                }
                
                // 查找所有AI消息
                const aiMessages = document.querySelectorAll('.message.ai');
                console.log('找到AI消息数量:', aiMessages.length);
                
                aiMessages.forEach((messageEl, index) => {
                    const contentEl = messageEl.querySelector('.message-content');
                    if (contentEl) {
                        const hasMath = contentEl.innerHTML.includes('$$') || 
                                       contentEl.innerHTML.includes('\\[') ||
                                       contentEl.innerHTML.includes('\\(');
                        
                        if (hasMath) {
                            console.log(`AI消息${index + 1}包含公式，开始渲染...`);
                            console.log('公式内容预览:', contentEl.innerHTML.substring(0, 300));
                            
                            // 先清除该元素中现有的MathJax元素
                            contentEl.querySelectorAll('.MathJax').forEach(el => {
                                el.remove();
                            });
                            
                            MathJax.typesetPromise([contentEl]).then(() => {
                                console.log(`✅ AI消息${index + 1}公式渲染完成`);
                                // 确保渲染后的公式可见
                                contentEl.querySelectorAll('.MathJax').forEach(el => {
                                    el.style.display = 'block !important';
                                    el.style.visibility = 'visible !important';
                                });
                            }).catch(error => {
                                console.error(`❌ AI消息${index + 1}公式渲染失败:`, error);
                                // 如果渲染失败，延迟重试
                                setTimeout(() => {
                                    this.renderAIResponseMath();
                                }, 2000);
                            });
                        } else {
                            console.log(`AI消息${index + 1}不包含公式`);
                        }
                    }
                });
            },

            // 键盘事件处理
            handleKeyboard(event) {
                switch(event.key) {
                    case 'F11':
                        event.preventDefault();
                        this.toggleFullscreen();
                        break;
                    case 'Escape':
                        if (this.isFullscreen) {
                            event.preventDefault();
                            this.exitFullscreen();
                        } else {
                            window.location.href = '../index.html';
                        }
                        break;
                    case 'l':
                        if (event.ctrlKey) {
                            event.preventDefault();
                            this.clearChat();
                        }
                        break;
                }
            }
        },

        mounted() {
            console.log('🤖 AI学习助手启动！');
            
            // 网络状态检测
            this.checkNetworkStatus();
            window.addEventListener('online', () => {
                this.hideNetworkStatus();
                this.showNotification('网络连接已恢复', 'success');
            });
            window.addEventListener('offline', () => {
                this.showNetworkStatus('网络连接已断开', 'fas fa-wifi-slash', 'error');
            });
            
            // 资源加载错误监听
            window.addEventListener('error', (e) => {
                if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
                    this.handleResourceError(e.target.src || e.target.href);
                }
            });
            
            // 初始化
            setTimeout(() => {
                this.loading = false;
                this.showNotification('AI助手已准备就绪，按F11进入全屏模式', 'info');
            }, 1500);

            // 绑定键盘事件
            document.addEventListener('keydown', this.handleKeyboard);

            // 监听全屏状态变化
            document.addEventListener('fullscreenchange', () => {
                this.isFullscreen = !!document.fullscreenElement;
            });
            
            // 延迟渲染数学公式
            setTimeout(() => {
                this.forceRenderAllMath();
            }, 3000);
        },

        beforeUnmount() {
            document.removeEventListener('keydown', this.handleKeyboard);
        }
    });

    app.mount('#app');
    console.log('✅ Vue应用挂载成功');
} catch (error) {
    console.error('❌ Vue应用挂载失败:', error);
    // 显示错误信息给用户
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 107, 107, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 10000;
    `;
    errorDiv.innerHTML = `
        <h3>❌ 应用加载失败</h3>
        <p>Vue应用无法正常启动，请刷新页面重试。</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; border: none; border-radius: 5px; background: white; color: #ff6b6b; cursor: pointer;">刷新页面</button>
    `;
    document.body.appendChild(errorDiv);
} 