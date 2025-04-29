console.log('低端影视浏览记录插件已加载');

// 创建悬浮按钮
const historyButton = document.createElement('button');
historyButton.classList.add('ddys-history-button');
// 使用图标代替文字
const iconUrl = chrome.runtime.getURL('icons/btn.svg');
const iconImg = document.createElement('img');
iconImg.src = iconUrl;
iconImg.style.width = '24px'; // 设置图标大小
iconImg.style.height = '24px';
historyButton.appendChild(iconImg);
document.body.appendChild(historyButton);

// 创建历史记录弹窗
const historyPopup = document.createElement('div');
historyPopup.classList.add('ddys-history-popup');
historyPopup.innerHTML = `
  <div class="ddys-popup-header">
    <h4>浏览记录</h4>
    <button class="ddys-clear-history-button">清除记录</button>
  </div>
  <ul>
    <!-- 历史记录将在这里动态添加 -->
    <li>暂无记录</li>
  </ul>
`;
document.body.appendChild(historyPopup);

// 获取清除按钮并添加事件监听器
const clearHistoryButton = historyPopup.querySelector('.ddys-clear-history-button');
clearHistoryButton.addEventListener('click', () => {
  // 清除存储中的历史记录
  chrome.storage.local.set({ videoHistory: [] }, () => {
    console.log('浏览记录已清除');
    // 更新弹窗中的列表显示
    const historyList = historyPopup.querySelector('ul');
    historyList.innerHTML = '<li>暂无记录</li>';
    // 可以选择性地短暂显示提示信息
  });
});

let hidePopupTimeout;

// 鼠标悬浮在按钮上时显示弹窗
historyButton.addEventListener('mouseenter', () => {
  clearTimeout(hidePopupTimeout); // 清除可能存在的隐藏计时器
  // TODO: 加载并显示历史记录
  loadAndShowHistory();
  historyPopup.classList.add('show');
});

// 鼠标离开按钮时，延迟隐藏弹窗
historyButton.addEventListener('mouseleave', () => {
  hidePopupTimeout = setTimeout(() => {
    historyPopup.classList.remove('show');
  }, 300); // 延迟 300 毫秒
});

// 鼠标进入弹窗时，保持显示
historyPopup.addEventListener('mouseenter', () => {
  clearTimeout(hidePopupTimeout);
});

// 鼠标离开弹窗时，隐藏弹窗
historyPopup.addEventListener('mouseleave', () => {
  historyPopup.classList.remove('show');
});

// 加载并显示历史记录的函数
function loadAndShowHistory() {
  console.log('加载历史记录...');
  chrome.storage.local.get(['videoHistory'], (result) => {
    const history = result.videoHistory || [];
    const historyList = historyPopup.querySelector('ul');
    historyList.innerHTML = ''; // 清空现有列表

    if (history.length === 0) {
      historyList.innerHTML = '<li>暂无记录</li>';
    } else {
      history.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.title;
        a.title = item.title; // 添加 title 属性以便悬停时完整显示
        // 阻止默认跳转，通过编程方式跳转以确保在新标签页或当前标签页打开（根据需要）
        a.addEventListener('click', (e) => {
          e.preventDefault();
          // 在当前标签页跳转
          window.location.href = item.url;
          // 如果需要在新标签页打开，可以使用：
          // window.open(item.url, '_blank');
        });
        li.appendChild(a);
        historyList.appendChild(li);
      });
    }
  });
}

// 保存当前视频到历史记录的函数
function saveCurrentVideoHistory() {
  const currentUrl = window.location.href;
  
  // 判断是否为 ddys.pro 的视频详情页（非主页）
  if (currentUrl.startsWith('https://ddys.pro/') && currentUrl !== 'https://ddys.pro/') {
    // 页面标题就是视频标题
    const currentTitle = document.title;
    console.log('检测到视频页面:', currentTitle, currentUrl);
    const newItem = { title: currentTitle, url: currentUrl };

    chrome.storage.local.get(['videoHistory'], (result) => {
      let history = result.videoHistory || [];

      // 检查是否已存在相同的 URL，如果存在则移到最前面
      history = history.filter(item => item.url !== currentUrl);

      // 将新记录添加到开头
      history.unshift(newItem);

      // 只保留最近 10 条记录
      if (history.length > 10) {
        history = history.slice(0, 10);
      }

      // 保存更新后的历史记录
      chrome.storage.local.set({ videoHistory: history }, () => {
        console.log('历史记录已保存:', history);
      });
    });
  }
}

// 页面加载完成后尝试保存一次历史记录
saveCurrentVideoHistory();