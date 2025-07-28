// 流体力学学习工具集
class StudyToolsManager {
    constructor() {
        this.formulas = this.initFormulas();
        this.calculator = new FormulaCalculator();
        this.converter = new UnitConverter();
        this.planner = new StudyPlanner();
        this.analyzer = new ProgressAnalyzer();
    }

    initFormulas() {
        return {
            density: { formula: "ρ = m/V", vars: ["ρ", "m", "V"] },
            pressure: { formula: "p = ρgh", vars: ["p", "ρ", "g", "h"] },
            bernoulli: { formula: "p₁/ρ + v₁²/2 + gz₁ = p₂/ρ + v₂²/2 + gz₂", vars: ["p₁", "p₂", "v₁", "v₂", "z₁", "z₂", "ρ", "g"] },
            continuity: { formula: "ρ₁A₁v₁ = ρ₂A₂v₂", vars: ["ρ₁", "ρ₂", "A₁", "A₂", "v₁", "v₂"] },
            reynolds: { formula: "Re = ρvL/μ", vars: ["Re", "ρ", "v", "L", "μ"] },
            momentum: { formula: "F = ρQ(v₂ - v₁)", vars: ["F", "ρ", "Q", "v₁", "v₂"] }
        };
    }
}

class FormulaCalculator {
    calculate(type, params) {
        switch(type) {
            case 'density': return params.m / params.V;
            case 'pressure': return params.rho * (params.g || 9.81) * params.h;
            case 'reynolds': return (params.rho * params.v * params.L) / params.mu;
            case 'momentum': return params.rho * params.Q * (params.v2 - params.v1);
            case 'bernoulli_pressure': 
                return params.p1 + params.rho * ((params.v1*params.v1 - params.v2*params.v2)/2 + (params.g || 9.81) * (params.z1 - params.z2));
            default: return null;
        }
    }

    validateInputs(type, params) {
        const required = {
            'density': ['m', 'V'],
            'pressure': ['rho', 'h'],
            'reynolds': ['rho', 'v', 'L', 'mu'],
            'momentum': ['rho', 'Q', 'v1', 'v2'],
            'bernoulli_pressure': ['p1', 'rho', 'v1', 'v2', 'z1', 'z2']
        };

        const req = required[type] || [];
        return req.every(param => params[param] !== undefined && params[param] !== null);
    }
}

class UnitConverter {
    constructor() {
        this.units = {
            pressure: { Pa: 1, kPa: 1000, MPa: 1000000, bar: 100000, atm: 101325, mmHg: 133.322, psi: 6894.76 },
            length: { m: 1, cm: 0.01, mm: 0.001, km: 1000, in: 0.0254, ft: 0.3048 },
            velocity: { "m/s": 1, "km/h": 0.277778, "ft/s": 0.3048, "mph": 0.44704 },
            density: { "kg/m³": 1, "g/cm³": 1000, "lb/ft³": 16.0185 },
            viscosity: { "Pa·s": 1, "cP": 0.001, "P": 0.1 },
            flow: { "m³/s": 1, "L/s": 0.001, "L/min": 0.000016667, "gpm": 0.00006309 }
        };
    }

    convert(value, fromUnit, toUnit, category) {
        const units = this.units[category];
        if (!units || !units[fromUnit] || !units[toUnit]) return null;
        
        const baseValue = value * units[fromUnit];
        return baseValue / units[toUnit];
    }

    getSupportedUnits(category) {
        return Object.keys(this.units[category] || {});
    }
}

class StudyPlanner {
    constructor() {
        this.plans = JSON.parse(localStorage.getItem('studyPlans') || '[]');
        this.currentPlan = null;
    }

    createPlan(config) {
        const plan = {
            id: Date.now(),
            name: config.name || "新学习计划",
            startDate: config.startDate || new Date(),
            endDate: config.endDate,
            dailyHours: config.dailyHours || 2,
            subjects: config.subjects || ["基础概念", "流体静力学", "流体动力学", "伯努利方程"],
            difficulty: config.difficulty || "中级",
            progress: 0,
            tasks: this.generateTasks(config.subjects),
            created: Date.now()
        };

        this.plans.push(plan);
        this.savePlans();
        return plan;
    }

    generateTasks(subjects) {
        const tasks = [];
        subjects.forEach((subject, index) => {
            tasks.push({
                id: `video_${index}`,
                subject: subject,
                type: "视频学习",
                description: `观看${subject}相关视频`,
                estimatedTime: 60,
                status: "pending",
                week: Math.floor(index / 2) + 1
            });

            tasks.push({
                id: `quiz_${index}`,
                subject: subject,
                type: "练习题",
                description: `完成${subject}练习题`,
                estimatedTime: 45,
                status: "pending",
                week: Math.floor(index / 2) + 1
            });
        });
        return tasks;
    }

    updateProgress(planId, taskId, status) {
        const plan = this.plans.find(p => p.id === planId);
        if (!plan) return false;

        const task = plan.tasks.find(t => t.id === taskId);
        if (!task) return false;

        task.status = status;
        task.completedAt = status === "completed" ? Date.now() : null;

        const completedTasks = plan.tasks.filter(t => t.status === "completed").length;
        plan.progress = Math.round((completedTasks / plan.tasks.length) * 100);

        this.savePlans();
        return true;
    }

    savePlans() {
        localStorage.setItem('studyPlans', JSON.stringify(this.plans));
    }

    getRecommendations(userStats) {
        const recommendations = [];

        if (userStats.accuracy < 0.7) {
            recommendations.push({
                type: "improvement",
                title: "加强基础练习",
                description: "建议多做基础概念题目，提高正确率"
            });
        }

        if (userStats.studyTime < 20) {
            recommendations.push({
                type: "time",
                title: "增加学习时间",
                description: "建议每天至少学习1小时"
            });
        }

        if (userStats.weakTopics.length > 0) {
            recommendations.push({
                type: "focus",
                title: "重点复习",
                description: `重点学习: ${userStats.weakTopics.join(", ")}`
            });
        }

        return recommendations;
    }
}

class ProgressAnalyzer {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('studyData') || '{}');
    }

    recordActivity(userId, activity) {
        if (!this.data[userId]) this.data[userId] = [];
        
        this.data[userId].push({
            ...activity,
            timestamp: Date.now()
        });

        // 限制数据量
        if (this.data[userId].length > 1000) {
            this.data[userId] = this.data[userId].slice(-500);
        }

        this.saveData();
    }

    getAnalysis(userId, timeRange = 30) {
        const userData = this.data[userId] || [];
        const cutoff = Date.now() - (timeRange * 24 * 60 * 60 * 1000);
        const recentData = userData.filter(d => d.timestamp >= cutoff);

        return {
            totalActivities: recentData.length,
            studyTime: this.calculateStudyTime(recentData),
            accuracy: this.calculateAccuracy(recentData),
            topicProgress: this.analyzeTopicProgress(recentData),
            weeklyTrend: this.getWeeklyTrend(recentData),
            strengths: this.identifyStrengths(recentData),
            weaknesses: this.identifyWeaknesses(recentData)
        };
    }

    calculateStudyTime(data) {
        return data
            .filter(d => d.type === 'study_session')
            .reduce((total, d) => total + (d.duration || 0), 0);
    }

    calculateAccuracy(data) {
        const quizData = data.filter(d => d.type === 'quiz_answer');
        if (quizData.length === 0) return 0;
        
        const correct = quizData.filter(d => d.correct).length;
        return Math.round((correct / quizData.length) * 100);
    }

    analyzeTopicProgress(data) {
        const topics = {};
        data.forEach(d => {
            if (d.topic) {
                if (!topics[d.topic]) topics[d.topic] = { total: 0, correct: 0 };
                topics[d.topic].total++;
                if (d.correct) topics[d.topic].correct++;
            }
        });

        return Object.entries(topics).map(([topic, stats]) => ({
            topic,
            accuracy: Math.round((stats.correct / stats.total) * 100),
            attempts: stats.total
        }));
    }

    getWeeklyTrend(data) {
        const weeks = {};
        data.forEach(d => {
            const week = Math.floor((Date.now() - d.timestamp) / (7 * 24 * 60 * 60 * 1000));
            if (!weeks[week]) weeks[week] = 0;
            weeks[week]++;
        });

        return Object.entries(weeks)
            .sort(([a], [b]) => a - b)
            .map(([week, count]) => ({ week: parseInt(week), activities: count }));
    }

    identifyStrengths(data) {
        const topicStats = this.analyzeTopicProgress(data);
        return topicStats
            .filter(t => t.accuracy >= 80 && t.attempts >= 5)
            .map(t => t.topic);
    }

    identifyWeaknesses(data) {
        const topicStats = this.analyzeTopicProgress(data);
        return topicStats
            .filter(t => t.accuracy < 60 && t.attempts >= 3)
            .map(t => t.topic);
    }

    saveData() {
        localStorage.setItem('studyData', JSON.stringify(this.data));
    }

    exportData(userId) {
        const userData = this.data[userId] || [];
        const analysis = this.getAnalysis(userId);
        
        const exportData = {
            userId,
            exportDate: new Date().toISOString(),
            totalRecords: userData.length,
            analysis,
            rawData: userData
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `学习分析_${userId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 实验模拟器
class ExperimentSimulator {
    constructor() {
        this.experiments = {
            viscosity: {
                name: "粘度测量实验",
                description: "使用落球法测量流体粘度",
                parameters: ["球半径", "球密度", "流体密度", "下落速度"],
                formula: "μ = 2gr²(ρs - ρf)/(9v)"
            },
            bernoulli: {
                name: "伯努利原理验证",
                description: "通过文丘里管验证伯努利方程",
                parameters: ["入口压力", "出口压力", "入口速度", "出口速度"],
                formula: "p₁/ρ + v₁²/2 = p₂/ρ + v₂²/2"
            },
            reynolds: {
                name: "雷诺数实验",
                description: "观察不同雷诺数下的流动状态",
                parameters: ["流速", "管径", "流体密度", "粘度"],
                formula: "Re = ρvD/μ"
            }
        };
    }

    runExperiment(type, params) {
        switch(type) {
            case 'viscosity':
                return this.simulateViscosity(params);
            case 'bernoulli':
                return this.simulateBernoulli(params);
            case 'reynolds':
                return this.simulateReynolds(params);
            default:
                return null;
        }
    }

    simulateViscosity(params) {
        const { radius, sphereDensity, fluidDensity, velocity, gravity = 9.81 } = params;
        const viscosity = (2 * gravity * Math.pow(radius, 2) * (sphereDensity - fluidDensity)) / (9 * velocity);
        
        return {
            viscosity: viscosity,
            units: "Pa·s",
            interpretation: viscosity > 0.01 ? "高粘度流体" : viscosity > 0.001 ? "中等粘度流体" : "低粘度流体"
        };
    }

    simulateBernoulli(params) {
        const { p1, v1, p2, v2, rho = 1000 } = params;
        const energy1 = p1/rho + v1*v1/2;
        const energy2 = p2/rho + v2*v2/2;
        const energyDiff = Math.abs(energy1 - energy2);
        
        return {
            energy1: energy1,
            energy2: energy2,
            energyDifference: energyDiff,
            verification: energyDiff < energy1 * 0.05 ? "验证成功" : "存在能量损失"
        };
    }

    simulateReynolds(params) {
        const { velocity, diameter, density = 1000, viscosity = 0.001 } = params;
        const reynolds = (density * velocity * diameter) / viscosity;
        
        let flowType;
        if (reynolds < 2300) flowType = "层流";
        else if (reynolds < 4000) flowType = "过渡流";
        else flowType = "湍流";
        
        return {
            reynolds: reynolds,
            flowType: flowType,
            critical: reynolds > 2300 ? "超过临界值" : "低于临界值"
        };
    }
}

// 知识图谱
class KnowledgeGraph {
    constructor() {
        this.concepts = {
            "流体": { level: 1, prerequisites: [], related: ["密度", "粘度", "压缩性"] },
            "密度": { level: 1, prerequisites: ["流体"], related: ["浮力", "静压力"] },
            "粘度": { level: 2, prerequisites: ["流体"], related: ["雷诺数", "层流", "湍流"] },
            "静压力": { level: 2, prerequisites: ["密度"], related: ["帕斯卡定律", "浮力"] },
            "伯努利方程": { level: 3, prerequisites: ["静压力", "连续性方程"], related: ["能量守恒", "流线"] },
            "雷诺数": { level: 3, prerequisites: ["粘度"], related: ["层流", "湍流", "流态"] },
            "边界层": { level: 4, prerequisites: ["雷诺数", "粘度"], related: ["流动分离", "阻力"] }
        };
    }

    getLearningPath(targetConcept) {
        const path = [];
        const visited = new Set();
        
        const buildPath = (concept) => {
            if (visited.has(concept)) return;
            visited.add(concept);
            
            const conceptInfo = this.concepts[concept];
            if (conceptInfo) {
                conceptInfo.prerequisites.forEach(prereq => buildPath(prereq));
                path.push(concept);
            }
        };
        
        buildPath(targetConcept);
        return path;
    }

    getRecommendedNext(completedConcepts) {
        const available = [];
        
        Object.entries(this.concepts).forEach(([concept, info]) => {
            if (!completedConcepts.includes(concept)) {
                const prereqsMet = info.prerequisites.every(prereq => completedConcepts.includes(prereq));
                if (prereqsMet) {
                    available.push({ concept, level: info.level });
                }
            }
        });
        
        return available.sort((a, b) => a.level - b.level);
    }
}

// 全局实例
window.StudyTools = new StudyToolsManager();
window.ExperimentSim = new ExperimentSimulator();
window.KnowledgeGraph = new KnowledgeGraph();

// 工具函数
window.FluidMechanicsUtils = {
    constants: {
        g: 9.81,
        rho_water: 1000,
        rho_air: 1.225,
        mu_water: 0.001,
        atm: 101325
    },

    formatNumber: (num, precision = 3) => {
        if (Math.abs(num) >= 1000 || Math.abs(num) < 0.001) {
            return num.toExponential(precision);
        }
        return num.toPrecision(precision);
    },

    showNotification: (message, type = 'info') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 100px; right: 20px; z-index: 9999;
            padding: 15px 20px; border-radius: 8px; color: white;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateX(300px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    generateQuizQuestion: (topic, difficulty = 'medium') => {
        const questions = {
            density: [
                {
                    question: "水的密度是1000kg/m³，体积为0.5m³的水的质量是多少？",
                    answer: 500,
                    unit: "kg",
                    explanation: "根据ρ = m/V，得m = ρV = 1000 × 0.5 = 500kg"
                }
            ],
            pressure: [
                {
                    question: "水深10m处的静压力是多少？(ρ=1000kg/m³, g=9.81m/s²)",
                    answer: 98100,
                    unit: "Pa",
                    explanation: "根据p = ρgh = 1000 × 9.81 × 10 = 98100Pa"
                }
            ]
        };

        const topicQuestions = questions[topic] || [];
        return topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
    }
};

console.log("🔧 流体力学学习工具集已加载完成");