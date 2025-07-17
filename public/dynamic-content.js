// 动态加载API内容
export async function initDynamicContent() {
  try {
      // 动态获取API数据
      const response = await fetch('/api/data.json');
      const data = await response.json();

      // 渲染动态内容
      document.getElementById('dynamic-content').innerHTML = `
          <div class="dynamic-card">
              <h2>${data.title}</h2>
              <p>${data.description}</p>
              <p>最后更新: <span class="live-timestamp">${new Date().toLocaleString()}</span></p>
              <button onclick="updateTimestamp()">刷新时间</button>
          </div>
      `;

      // 实时更新时间
      setInterval(() => {
          document.querySelector('.live-timestamp').textContent = new Date().toLocaleString();
      }, 1000);
  } catch (error) {
      console.error('动态内容加载失败:', error);
  }
}

// 动态更新函数（按钮点击事件）
window.updateTimestamp = () => {
  document.querySelector('.live-timestamp').textContent = new Date().toLocaleString();
};
