// 提取搜索过滤逻辑
function filterKnowledgeData(keyword) {
    return knowledgeData.filter(item => 
        item.title.toLowerCase().includes(keyword.toLowerCase()) || 
        item.content.toLowerCase().includes(keyword.toLowerCase())
    );
}

// 返回主页（增强版）
function goBack() {
    const homePage = document.getElementById('homePage');
    const detailPage = document.getElementById('detailPage');
    // 强制显示主页
    homePage.style.display = 'grid';
    detailPage.style.display = 'none';
    // 添加淡入动画
    homePage.style.opacity = '0';
    homePage.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
        homePage.style.opacity = '1';
    }, 10);
    // 平滑滚动到顶部
    window.scrollTo({
        top: 0,
        behavior:'smooth'
    });
    // 移动端兼容处理
    if ('ontouchstart' in window) {
        window.scrollTo(0, 0); 
    }
}

// 增强搜索功能
function search(keyword) {
    const resultsContainer = document.getElementById('searchResults');
    if (!keyword) {
        resultsContainer.style.display = 'none';
        return;
    }
    const filtered = filterKnowledgeData(keyword);
    renderSearchResults(filtered);
}

// 渲染搜索结果
function renderSearchResults(results) {
    const container = document.getElementById('searchResults');
    container.innerHTML = results.map(item => `
        <div class="search-item" onclick="jumpToNode(${item.id})">
            <div class="title">${highlightKeyword(item.title, keyword)}</div>
            <div class="path">${renderPathTags(item.path)}</div>
        </div>
    `).join('');
    container.style.display = results.length? 'block' : 'none';
}

// 高亮关键词
function highlightKeyword(text, keyword) {
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
}

// 生成路径标签
function renderPathTags(pathArray) {
    return pathArray.map((path, index) => `
        <span class="path-tag" 
              onclick="navigatePath('${path}', ${index})">
            ${path}
        </span>
    `).join(' › ');
}

// 跳转到具体知识节点
function jumpToNode(id) {
    const item = knowledgeData.find(i => i.id === id);
    showDetail(id);
    document.getElementById('searchResults').style.display = 'none';
}

// 根据路径筛选
function navigatePath(path, level) {
    const filtered = knowledgeData.filter(item => 
        item.path[level] === path
    );
    renderResults(filtered);
    document.getElementById('searchResults').style.display = 'none';
}

// 新增搜索功能逻辑
let searchTimer;
// 输入处理（带防抖）
function handleInput(event) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        const keyword = event.target.value;
        if (keyword) {
            performSearch();
        } else {
            document.getElementById('searchResults').style.display = 'none';
        }
    }, 300);
    // 回车键触发搜索
    if (event.key === 'Enter') {
        performSearch();
    }
}

// 执行搜索
function performSearch() {
    const keyword = document.getElementById('searchInput').value;
    const resultsContainer = document.getElementById('searchResults');
    // 显示加载状态
    resultsContainer.innerHTML = '<div class="loading">搜索中...</div>';
    resultsContainer.style.display = 'block';
    // 实际搜索逻辑
    setTimeout(() => {
        const filtered = filterKnowledgeData(keyword);
        if (filtered.length === 0) {
            resultsContainer.innerHTML = '<div class="loading">未找到相关结果</div>';
        } else {
            renderSearchResults(filtered);
        }
    }, 200);
}

// 点击外部关闭结果
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        document.getElementById('searchResults').style.display = 'none';
    }
});