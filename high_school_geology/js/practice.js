// 练习题交互功能
class PracticeManager {
    constructor() {
        this.stats = {
            totalQuestions: 0,
            answeredQuestions: 0,
            correctAnswers: 0
        };
        this.init();
    }

    init() {
        this.updateStats();
        this.bindEvents();
    }

    bindEvents() {
        // 监听选项选择
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio' || e.target.type === 'checkbox') {
                this.handleOptionChange(e.target);
            }
        });
    }

    handleOptionChange(input) {
        const questionCard = input.closest('.question-card');
        const questionNumber = questionCard.dataset.question;
        
        // 标记题目已作答
        questionCard.classList.add('answered');
        
        // 更新统计
        this.updateAnsweredCount();
    }

    updateAnsweredCount() {
        const answeredCards = document.querySelectorAll('.question-card.answered');
        this.stats.answeredQuestions = answeredCards.length;
        this.updateStatsDisplay();
    }

    updateStats() {
        const questionCards = document.querySelectorAll('.question-card');
        this.stats.totalQuestions = questionCards.length;
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        const totalElement = document.getElementById('total-questions');
        const answeredElement = document.getElementById('answered-questions');
        const correctElement = document.getElementById('correct-answers');
        const accuracyElement = document.getElementById('accuracy-rate');

        if (totalElement) totalElement.textContent = this.stats.totalQuestions;
        if (answeredElement) answeredElement.textContent = this.stats.answeredQuestions;
        if (correctElement) correctElement.textContent = this.stats.correctAnswers;
        
        const accuracy = this.stats.answeredQuestions > 0 
            ? Math.round((this.stats.correctAnswers / this.stats.answeredQuestions) * 100)
            : 0;
        if (accuracyElement) accuracyElement.textContent = accuracy + '%';
    }

    showResult(questionNumber, isCorrect, userAnswer, correctAnswer) {
        const questionCard = document.querySelector(`[data-question="${questionNumber}"]`);
        const resultDiv = questionCard.querySelector('.question-result');
        const button = questionCard.querySelector('.check-answer-btn');
        
        // 显示结果
        resultDiv.style.display = 'block';
        button.style.display = 'none';
        
        // 标记正确或错误
        questionCard.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // 更新统计
        if (isCorrect) {
            this.stats.correctAnswers++;
        }
        
        this.updateStatsDisplay();
        
        // 添加动画效果
        resultDiv.classList.add('fade-in');
    }
}

// 检查单选题答案
function checkAnswer(questionNumber, correctAnswer) {
    const questionCard = document.querySelector(`[data-question="${questionNumber}"]`);
    const selectedOption = questionCard.querySelector('input[type="radio"]:checked');
    
    if (!selectedOption) {
        alert('请先选择一个答案！');
        return;
    }
    
    const userAnswer = selectedOption.value;
    const isCorrect = userAnswer === correctAnswer;
    
    // 高亮显示选择的答案
    const options = questionCard.querySelectorAll('.option');
    options.forEach(option => {
        const input = option.querySelector('input');
        if (input.value === correctAnswer) {
            option.classList.add('correct-option');
        } else if (input.checked && input.value !== correctAnswer) {
            option.classList.add('incorrect-option');
        }
    });
    
    practiceManager.showResult(questionNumber, isCorrect, userAnswer, correctAnswer);
}

// 检查多选题答案
function checkMultipleAnswer(questionNumber, correctAnswers) {
    const questionCard = document.querySelector(`[data-question="${questionNumber}"]`);
    const selectedOptions = questionCard.querySelectorAll('input[type="checkbox"]:checked');
    
    if (selectedOptions.length === 0) {
        alert('请至少选择一个答案！');
        return;
    }
    
    const userAnswers = Array.from(selectedOptions).map(input => input.value).sort();
    const sortedCorrectAnswers = [...correctAnswers].sort();
    
    const isCorrect = JSON.stringify(userAnswers) === JSON.stringify(sortedCorrectAnswers);
    
    // 高亮显示答案
    const options = questionCard.querySelectorAll('.option');
    options.forEach(option => {
        const input = option.querySelector('input');
        if (correctAnswers.includes(input.value)) {
            option.classList.add('correct-option');
        } else if (input.checked) {
            option.classList.add('incorrect-option');
        }
    });
    
    practiceManager.showResult(questionNumber, isCorrect, userAnswers, correctAnswers);
}

// 显示综合题答案
function showComprehensiveAnswer(questionNumber) {
    const questionCard = document.querySelector(`[data-question="${questionNumber}"]`);
    const resultDiv = questionCard.querySelector('.question-result');
    const button = questionCard.querySelector('.check-answer-btn');
    
    resultDiv.style.display = 'block';
    button.style.display = 'none';
    
    // 标记为已查看答案
    questionCard.classList.add('answer-viewed');
    
    // 添加动画效果
    resultDiv.classList.add('fade-in');
}

// 重置练习
function resetPractice() {
    // 清除所有选择
    const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    inputs.forEach(input => {
        input.checked = false;
    });
    
    // 清除所有结果显示
    const results = document.querySelectorAll('.question-result');
    results.forEach(result => {
        result.style.display = 'none';
    });
    
    // 显示所有按钮
    const buttons = document.querySelectorAll('.check-answer-btn');
    buttons.forEach(button => {
        button.style.display = 'inline-block';
    });
    
    // 清除所有样式类
    const questionCards = document.querySelectorAll('.question-card');
    questionCards.forEach(card => {
        card.classList.remove('answered', 'correct', 'incorrect', 'answer-viewed');
    });
    
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('correct-option', 'incorrect-option');
    });
    
    // 清空文本框
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.value = '';
    });
    
    // 重置统计
    practiceManager.stats.answeredQuestions = 0;
    practiceManager.stats.correctAnswers = 0;
    practiceManager.updateStatsDisplay();
}

// 导出错题
function exportWrongQuestions() {
    const wrongQuestions = document.querySelectorAll('.question-card.incorrect');
    
    if (wrongQuestions.length === 0) {
        alert('没有错题需要导出！');
        return;
    }
    
    let exportContent = '错题集\n\n';
    
    wrongQuestions.forEach((card, index) => {
        const questionText = card.querySelector('.question-text').textContent;
        const correctAnswer = card.querySelector('.correct-answer').textContent;
        const explanation = card.querySelector('.explanation').textContent;
        
        exportContent += `${index + 1}. ${questionText}\n`;
        exportContent += `${correctAnswer}\n`;
        exportContent += `${explanation}\n\n`;
    });
    
    // 创建下载链接
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '错题集.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 初始化练习管理器
let practiceManager;

document.addEventListener('DOMContentLoaded', function() {
    practiceManager = new PracticeManager();
    
    // 添加重置按钮（如果存在）
    const resetBtn = document.getElementById('reset-practice');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetPractice);
    }
    
    // 添加导出按钮（如果存在）
    const exportBtn = document.getElementById('export-wrong');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportWrongQuestions);
    }
});

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .correct-option {
        background-color: #d4edda !important;
        border-color: #28a745 !important;
    }
    
    .incorrect-option {
        background-color: #f8d7da !important;
        border-color: #dc3545 !important;
    }
    
    .question-card.correct {
        border-left: 4px solid #28a745;
    }
    
    .question-card.incorrect {
        border-left: 4px solid #dc3545;
    }
    
    .question-card.answer-viewed {
        border-left: 4px solid #17a2b8;
    }
`;
document.head.appendChild(style);
