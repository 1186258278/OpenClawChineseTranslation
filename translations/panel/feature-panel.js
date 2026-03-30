/* ============================================================
 * OpenClaw 汉化版 - 功能面板
 * 武汉晴辰天下网络科技有限公司 | https://qingchencloud.com/
 * ============================================================ */

(function() {
  'use strict';

  // 面板数据（构建时会被替换为实际数据）
  const PANEL_DATA = /*PANEL_DATA_PLACEHOLDER*/{
    faq: [],
    plugins: [],
    about: {
      project: "OpenClaw 汉化发行版",
      company: "武汉晴辰天下网络科技有限公司",
      website: "https://openclaw.qt.cool/",
      github: "https://github.com/1186258278/OpenClawChineseTranslation",
      npm: "https://www.npmjs.com/package/@qingchencloud/openclaw-zh",
      companyWebsite: "https://qingchencloud.com/",
      qqGroup: "https://qt.cool/c/OpenClaw",
      wechatGroup: "https://qt.cool/c/OpenClawWx",
      license: "MIT License"
    }
  }/*END_PANEL_DATA*/;

  // 图标 SVG
  const ICONS = {
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>',
    undo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>',
    wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
    package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    lobster: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="none"/><g fill="#3a0a0d"><rect x="1" y="5" width="1" height="3"/><rect x="2" y="4" width="1" height="1"/><rect x="2" y="8" width="1" height="1"/><rect x="3" y="3" width="1" height="1"/><rect x="3" y="9" width="1" height="1"/><rect x="4" y="2" width="1" height="1"/><rect x="4" y="10" width="1" height="1"/><rect x="5" y="2" width="6" height="1"/><rect x="11" y="2" width="1" height="1"/><rect x="12" y="3" width="1" height="1"/><rect x="12" y="9" width="1" height="1"/><rect x="13" y="4" width="1" height="1"/><rect x="13" y="8" width="1" height="1"/><rect x="14" y="5" width="1" height="3"/><rect x="5" y="11" width="6" height="1"/><rect x="4" y="12" width="1" height="1"/><rect x="11" y="12" width="1" height="1"/><rect x="3" y="13" width="1" height="1"/><rect x="12" y="13" width="1" height="1"/><rect x="5" y="14" width="6" height="1"/></g><g fill="#ff4f40"><rect x="5" y="3" width="6" height="1"/><rect x="4" y="4" width="8" height="1"/><rect x="3" y="5" width="10" height="1"/><rect x="3" y="6" width="10" height="1"/><rect x="3" y="7" width="10" height="1"/><rect x="4" y="8" width="8" height="1"/><rect x="5" y="9" width="6" height="1"/><rect x="5" y="12" width="6" height="1"/><rect x="6" y="13" width="4" height="1"/></g><g fill="#ff775f"><rect x="1" y="6" width="2" height="1"/><rect x="2" y="5" width="1" height="1"/><rect x="2" y="7" width="1" height="1"/><rect x="13" y="6" width="2" height="1"/><rect x="13" y="5" width="1" height="1"/><rect x="13" y="7" width="1" height="1"/></g><g fill="#081016"><rect x="6" y="5" width="1" height="1"/><rect x="9" y="5" width="1" height="1"/></g><g fill="#f5fbff"><rect x="6" y="4" width="1" height="1"/><rect x="9" y="4" width="1" height="1"/></g></svg>',
    gitCommit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 3v6"/><path d="M12 15v6"/></svg>',
    lightbulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>'
  };

  // API 配置
  const API_BASE = 'https://qt.cool/api/v1';
  const PROJECT_SLUG = 'openclawchinesetranslation';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 分钟缓存

  // 缓存对象
  const apiCache = {
    plugins: { data: null, timestamp: 0 },
    changelog: { data: null, timestamp: 0 }
  };

  // 从 API 获取插件列表
  async function fetchPluginsFromAPI() {
    const now = Date.now();
    // 检查缓存
    if (apiCache.plugins.data && (now - apiCache.plugins.timestamp) < CACHE_DURATION) {
      return apiCache.plugins.data;
    }
    
    try {
      const response = await fetch(`${API_BASE}/project/${PROJECT_SLUG}/plugins`);
      const data = await response.json();
      if (data.success && data.plugins) {
        // 转换 API 数据格式为本地格式
        const plugins = data.plugins.map(p => ({
          id: p.slug || p.id,
          name: p.name,
          description: p.description,
          version: p.version,
          status: p.is_active ? 'available' : 'coming-soon',
          install: p.install_command || `npm install -g ${p.slug}`,
          aiPrompt: `请帮我安装 ${p.slug || p.name} 插件`,
          icon: p.icon_url,
          downloads: p.downloads,
          rating: p.rating
        }));
        // 更新缓存
        apiCache.plugins.data = plugins;
        apiCache.plugins.timestamp = now;
        return plugins;
      }
      throw new Error(data.error || '获取插件列表失败');
    } catch (err) {
      console.warn('[功能面板] API 请求失败，使用本地数据:', err.message);
      // 返回 null 表示需要 fallback
      return null;
    }
  }

  // 从 API 获取更新日志
  async function fetchChangelogFromAPI() {
    const now = Date.now();
    // 检查缓存（更新日志缓存 30 分钟）
    if (apiCache.changelog.data && (now - apiCache.changelog.timestamp) < 30 * 60 * 1000) {
      return apiCache.changelog.data;
    }
    
    try {
      const response = await fetch(`${API_BASE}/project/${PROJECT_SLUG}/changelog`);
      const data = await response.json();
      if (data.success && data.data) {
        // 更新缓存
        apiCache.changelog.data = data.data;
        apiCache.changelog.timestamp = now;
        return data.data;
      }
      throw new Error(data.error || '获取更新日志失败');
    } catch (err) {
      console.warn('[功能面板] 更新日志 API 请求失败:', err.message);
      return null;
    }
  }

  // 当前激活的 Tab
  let activeTab = 'help';

  // 创建面板 HTML
  function createPanelHTML() {
    return `
      <div class="feature-panel-overlay" id="feature-panel-overlay">
        <div class="feature-panel">
          <header class="panel-header">
            <h2>🦞 功能面板</h2>
            <button class="panel-close" id="panel-close">&times;</button>
          </header>
          <nav class="panel-tabs">
<button class="panel-tab active" data-tab="help">帮助文档</button>
            <button class="panel-tab" data-tab="commands">快捷指令</button>
            <button class="panel-tab" data-tab="ai-studio"><span class="fire-icon">🔥</span>AI 创作<span class="hot-badge">HOT</span></button>
            <button class="panel-tab" data-tab="plugins">插件列表</button>
            <button class="panel-tab" data-tab="changelog">更新日志</button>
            <button class="panel-tab" data-tab="about">关于我们</button>
          </nav>
          <main class="panel-content" id="panel-content">
            ${renderTabContent('help')}
          </main>
        </div>
      </div>
    `;
  }

  // 渲染 Tab 内容
  function renderTabContent(tab) {
    switch (tab) {
      case 'help':
        return renderHelpTab();
      case 'commands':
        return renderCommandsTab();
      case 'ai-studio':
        return renderAiStudioTab();
      case 'plugins':
        return renderPluginsTab();
      case 'changelog':
        return renderChangelogTab();
      case 'about':
        return renderAboutTab();
      default:
        return '';
    }
  }

  // 渲染帮助文档 Tab
  function renderHelpTab() {
    const faqItems = PANEL_DATA.faq.map(item => `
      <div class="faq-item" data-id="${item.id}">
        <button class="faq-question">
          <span>${item.question}</span>
          ${ICONS.chevronDown}
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">${formatAnswer(item.answer)}</div>
        </div>
      </div>
    `).join('');

    return `
      <div class="help-tab">
        ${faqItems || '<p style="color: var(--text-muted); text-align: center;">暂无 FAQ 内容</p>'}
      </div>
    `;
  }

  // 格式化答案（处理代码块和换行）
  function formatAnswer(text) {
    // 先处理多行代码块 ```code```
    let result = text.replace(/```\n?([\s\S]*?)\n?```/g, (match, code) => {
      // 去除代码首尾的换行
      const trimmedCode = code.trim();
      return `__CODE_BLOCK__${trimmedCode}__END_CODE__`;
    });
    
    // 处理行内代码 `code`
    result = result.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // 替换普通换行为 <br>
    result = result.replace(/\n/g, '<br>');
    
    // 清理代码块前后的 <br>
    result = result.replace(/<br>__CODE_BLOCK__/g, '<pre><code>');
    result = result.replace(/__CODE_BLOCK__/g, '<pre><code>');
    result = result.replace(/__END_CODE__<br>/g, '</code></pre>');
    result = result.replace(/__END_CODE__/g, '</code></pre>');
    
    // 清理连续的 <br>
    result = result.replace(/(<br>){3,}/g, '<br><br>');
    
    return result;
  }

  // 渲染快捷指令 Tab
  function renderCommandsTab() {
    const savedQtcoolKey = localStorage.getItem('qtcool_api_key') || '';
    const keyPreview = savedQtcoolKey ? savedQtcoolKey.slice(0, 8) + '...' + savedQtcoolKey.slice(-4) : '';
    return `
      <div class="commands-grid">
        <button class="command-btn" data-action="restart">
          ${ICONS.refresh}
          <span>重启网关</span>
          <span class="command-desc">重启 OpenClaw Gateway</span>
        </button>
        <button class="command-btn" data-action="clear-cache">
          ${ICONS.trash}
          <span>清理缓存</span>
          <span class="command-desc">清理临时文件和缓存</span>
        </button>
        <button class="command-btn" data-action="check-update">
          ${ICONS.download}
          <span>检测更新</span>
          <span class="command-desc">检查是否有新版本</span>
        </button>
        <button class="command-btn" data-action="restore-original">
          ${ICONS.undo}
          <span>恢复原版</span>
          <span class="command-desc">切换回原版 OpenClaw</span>
        </button>
        <button class="command-btn" data-action="fix-common" style="grid-column: span 2;">
          ${ICONS.wrench}
          <span>一键修复常见问题</span>
          <span class="command-desc">复制 doctor --fix 命令到剪贴板，粘贴到终端执行</span>
        </button>
      </div>

      <div class="qtcool-setup">
        <div class="qtcool-setup-header">
          <span class="qtcool-setup-logo">⚡</span>
          <div>
            <h3 class="qtcool-setup-title">晴辰云快速配置</h3>
            <p class="qtcool-setup-sub">输入 API 密钥 → 获取模型列表 → 一键生成配置命令</p>
          </div>
          <a href="https://gpt.qt.cool/user" target="_blank" class="qtcool-get-key-link">🎁 免费获取密钥</a>
        </div>

        <div class="qtcool-key-row">
          <input type="password" id="qtcool-api-key" class="ssy-input"
                 placeholder="输入晴辰云 API 密钥 (sk-...)"
                 value="${savedQtcoolKey}" />
          <button class="ssy-btn ssy-btn-test" id="qtcool-fetch-btn">🔍 获取模型列表</button>
        </div>
        ${savedQtcoolKey
          ? `<p class="ssy-key-hint">✅ 已保存：${keyPreview} &nbsp;·&nbsp; <a href="https://gpt.qt.cool/user" target="_blank">重新获取密钥</a></p>`
          : `<p class="ssy-key-hint">📎 每天在 <a href="https://gpt.qt.cool/user" target="_blank">gpt.qt.cool/user</a> 签到可免费领取额度</p>`
        }
        <div id="qtcool-model-status" class="ssy-test-loading" style="display:none;"></div>

        <div id="qtcool-model-section" style="display:none;">
          <div class="qtcool-model-row">
            <label class="ssy-label">🤖 默认模型</label>
            <select id="qtcool-model-select" class="ssy-select ssy-model-select">
              <option value="auto">Auto（自动选择最优）</option>
            </select>
          </div>
          <div class="ssy-config-commands">
            <div class="ssy-config-cmd-block">
              <span class="ssy-config-cmd-label">📋 复制以下命令到终端执行：</span>
              <pre class="ssy-config-cmd" id="qtcool-cmd-text"></pre>
              <div class="ssy-config-actions">
                <button class="ssy-btn ssy-btn-copy" id="qtcool-copy-cmd">📋 复制命令</button>
                <button class="ssy-btn ssy-btn-test-model" id="qtcool-test-model">🧪 测试连通</button>
              </div>
            </div>
          </div>
          <div id="qtcool-test-result"></div>
        </div>
      </div>
    `;
  }

  // ============================================================
  // 晴辰云快速配置逻辑
  // ============================================================
  const QTCOOL_API_BASE = 'https://gpt.qt.cool/v1';
  const QTCOOL_STORAGE_KEY = 'qtcool_api_key';

  function getQtcoolApiKey() {
    return document.getElementById('qtcool-api-key')?.value?.trim()
      || localStorage.getItem(QTCOOL_STORAGE_KEY) || '';
  }

  function generateQtcoolCommands() {
    const apiKey = getQtcoolApiKey();
    const select = document.getElementById('qtcool-model-select');
    const modelId = select?.value?.trim() || 'auto';
    const cmdEl = document.getElementById('qtcool-cmd-text');
    if (!cmdEl) return;

    const lines = [];
    lines.push('# 步骤 1: 写入晴辰云 API 密钥（适用于所有版本）');
    if (apiKey) {
      const safeKey = apiKey.replace(/"/g, '\\"');
      lines.push(`openclaw config set models.providers.qtcool.apiKey "${safeKey}"`);
    } else {
      lines.push('openclaw config set models.providers.qtcool.apiKey "你的密钥（从 gpt.qt.cool/user 获取）"');
    }
    lines.push('');
    lines.push('# 步骤 2: 配置 provider 端点和接口类型');
    lines.push(`openclaw config set models.providers.qtcool.baseUrl "${QTCOOL_API_BASE}"`);
    lines.push(`openclaw config set models.providers.qtcool.api "openai-completions"`);
    lines.push('');
    lines.push(`# 步骤 3: 设置默认模型`);
    lines.push(`openclaw config set agents.defaults.model.primary "qtcool/${modelId}"`);

    cmdEl.textContent = lines.join('\n');
  }

  async function fetchQtcoolModels() {
    const apiKey = getQtcoolApiKey();
    const statusEl = document.getElementById('qtcool-model-status');
    const sectionEl = document.getElementById('qtcool-model-section');
    const selectEl = document.getElementById('qtcool-model-select');
    if (!statusEl || !sectionEl || !selectEl) return;

    if (apiKey) {
      localStorage.setItem(QTCOOL_STORAGE_KEY, apiKey);
    }

    statusEl.style.display = '';
    statusEl.className = 'ssy-test-loading';
    statusEl.textContent = '⏳ 正在获取模型列表...';

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
      const resp = await fetch(`${QTCOOL_API_BASE}/models`, { headers });
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data?.error?.message || data?.message || `请求失败 (${resp.status})`);
      }

      const models = (Array.isArray(data.data) ? data.data : [])
        .map(m => ({ id: String(m.id || '').trim(), name: String(m.id || m.name || '').trim() }))
        .filter(m => m.id);

      const builtins = [
        { id: 'auto', name: 'Auto（自动选择最优）' },
        { id: 'MiniMax-M2.7', name: 'MiniMax M2.7' },
        { id: 'kimi-k2.5', name: 'Kimi K2.5' },
        { id: 'glm-5.1', name: 'GLM-5.1' },
        { id: 'gpt-5.4', name: 'GPT-5.4' },
      ];
      const dynamicIds = new Set(models.map(m => m.id));
      const builtinFiltered = builtins.filter(m => !dynamicIds.has(m.id) || m.id === 'auto');

      let html = '<optgroup label="📌 推荐">';
      html += builtinFiltered.map(m => `<option value="${m.id}">${escapeHtml(m.name)}</option>`).join('');
      html += '</optgroup>';
      if (models.length > 0) {
        html += `<optgroup label="🌐 平台模型 (${models.length})">`;
        html += models.map(m => `<option value="${m.id}">${escapeHtml(m.name)}</option>`).join('');
        html += '</optgroup>';
      }
      selectEl.innerHTML = html;
      selectEl.value = 'auto';

      statusEl.className = 'ssy-test-ok';
      statusEl.textContent = `✅ 共 ${models.length} 个模型已加载`;
      sectionEl.style.display = '';
      generateQtcoolCommands();
    } catch (err) {
      statusEl.className = 'ssy-test-fail';
      statusEl.textContent = `❌ ${err?.message || '获取模型失败，请检查密钥或网络'}`;
      sectionEl.style.display = '';
      generateQtcoolCommands();
    }
  }

  async function testQtcoolModel() {
    const apiKey = getQtcoolApiKey();
    if (!apiKey) { showToast('请先输入 API 密钥', 'error'); return; }
    const select = document.getElementById('qtcool-model-select');
    const modelId = select?.value?.trim() || 'auto';
    const resultEl = document.getElementById('qtcool-test-result');
    if (resultEl) resultEl.innerHTML = `<p class="ssy-test-loading">⏳ 测试模型 ${escapeHtml(modelId)}...</p>`;

    try {
      const resp = await fetch(`${QTCOOL_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: '你好，请用一句话回复。' }],
          max_tokens: 64,
        }),
      });
      const data = await resp.json();
      if (resp.ok) {
        const reply = data?.choices?.[0]?.message?.content || '（已响应）';
        const truncated = reply.length > 100 ? reply.slice(0, 100) + '...' : reply;
        if (resultEl) resultEl.innerHTML = `<div class="ssy-test-ok"><p>✅ <strong>${escapeHtml(modelId)}</strong> 可用</p><p class="ssy-model-reply">"${escapeHtml(truncated)}"</p></div>`;
      } else {
        const msg = data?.error?.message || `错误 (${resp.status})`;
        if (resultEl) resultEl.innerHTML = `<p class="ssy-test-fail">❌ ${escapeHtml(msg)}</p>`;
      }
    } catch (err) {
      if (resultEl) resultEl.innerHTML = '<p class="ssy-test-fail">⚠️ 网络错误，无法连接服务器</p>';
    }
  }

  function bindQtcoolSetupEvents() {
    const fetchBtn = document.getElementById('qtcool-fetch-btn');
    if (fetchBtn) fetchBtn.addEventListener('click', fetchQtcoolModels);

    const selectEl = document.getElementById('qtcool-model-select');
    if (selectEl) selectEl.addEventListener('change', generateQtcoolCommands);

    const keyInput = document.getElementById('qtcool-api-key');
    if (keyInput) keyInput.addEventListener('input', generateQtcoolCommands);

    const copyBtn = document.getElementById('qtcool-copy-cmd');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const cmdEl = document.getElementById('qtcool-cmd-text');
        if (cmdEl) {
          const cmds = cmdEl.textContent.split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).join('\n');
          copyToClipboard(cmds);
        }
      });
    }

    const testBtn = document.getElementById('qtcool-test-model');
    if (testBtn) testBtn.addEventListener('click', testQtcoolModel);

    // 如果已有密钥，自动拉取模型
    if (localStorage.getItem(QTCOOL_STORAGE_KEY)) {
      fetchQtcoolModels();
    }
  }

  // ============================================================
  // 胜算云 AI 创作工具 (由胜算云提供 API 服务)
  // 所有链接/文案从 PANEL_DATA.provider 读取，修改时只改 panel-data.json
  // ============================================================
  const SSY_PROVIDER = PANEL_DATA.provider || {};
  const SSY_API_BASE = SSY_PROVIDER.apiBase || 'https://router.shengsuanyun.com/api/v1';
  const SSY_MODELS_API = SSY_PROVIDER.modelsApi || 'https://router.shengsuanyun.com/api/v1/models';
  const SSY_MULTIMODAL_API = SSY_PROVIDER.multimodalApi || 'https://router.shengsuanyun.com/api/v1/models/multimodal';
  const SSY_WEBSITE = SSY_PROVIDER.website || 'https://www.shengsuanyun.com';
  const SSY_API_KEY_URL = SSY_PROVIDER.apiKeyUrl || 'https://shengsuanyun.com/?from=CH_4BVI0BM2';
  const SSY_AFFILIATE_PARAM = SSY_PROVIDER.affiliateParam || 'from=CH_4BVI0BM2';
  const SSY_PROMO_TEXT = SSY_PROVIDER.promoText || '🎁 新用户送10元';
  const SSY_PROMO_NOTE = SSY_PROVIDER.promoNote || '';
  const SSY_GET_KEY_TEXT = SSY_PROVIDER.getKeyText || '点此获取 API Key';
  const SSY_FOOTER_TEXT = SSY_PROVIDER.footerText || '生成的内容仅供参考 · API 费用由胜算云收取';
  const SSY_FOOTER_LINK = SSY_PROVIDER.footerLink || '了解更多';
  const SSY_NAME = SSY_PROVIDER.name || '胜算云';
  const SSY_DESC = SSY_PROVIDER.description || '国内 API 聚合平台，支持多种 AI 模型';
  const SSY_DEFAULT_LLM_MODEL = SSY_PROVIDER.defaultLlmModel || 'openai/gpt-4.1-nano';
  const SSY_DEFAULT_IMAGE_MODEL = SSY_PROVIDER.defaultImageModel || 'ali/z-image-turbo';
  const SSY_DEFAULT_VIDEO_MODEL = SSY_PROVIDER.defaultVideoModel || 'google/veo3.1-fast-preview';
  const SSY_DEFAULT_AUDIO_MODEL = SSY_PROVIDER.defaultAudioModel || 'runway/eleven_multilingual_v2';
  const SSY_PREFERRED_LLM_MODELS = Array.isArray(SSY_PROVIDER.preferredLlmModels)
    ? SSY_PROVIDER.preferredLlmModels.filter(item => typeof item === 'string' && item.trim())
    : [];
  const SSY_MODEL_CACHE_TTL =
    typeof SSY_PROVIDER.modelCacheTtlMs === 'number' && SSY_PROVIDER.modelCacheTtlMs > 0
      ? SSY_PROVIDER.modelCacheTtlMs
      : 5 * 60 * 1000;
  const SSY_MULTIMODAL_ENABLED = SSY_PROVIDER.multimodalEnabled !== false;
  const SSY_MULTIMODAL_BADGE_TEXT =
    typeof SSY_PROVIDER.multimodalBadgeText === 'string' ? SSY_PROVIDER.multimodalBadgeText.trim() : '';
  const SSY_COOP_LINK = SSY_PROVIDER.cooperationLink || '';
  const SSY_COOP_TEXT = SSY_PROVIDER.cooperationText || '商务合作';
  const SSY_STORAGE_KEY = 'shengsuanyun_api_key';

  const ssyModelState = {
    llmModels: [],
    multimodalModels: [],
    timestamp: 0,
    loadingPromise: null,
  };

  // 生成带推广参数的胜算云链接
  function getSSYUrl(path) {
    const base = SSY_WEBSITE;
    const param = SSY_AFFILIATE_PARAM;
    if (!path) {
      // 主页链接
      const sep = base.includes('?') ? '&' : '?';
      return `${base}${sep}${param}`;
    }
    // 子路径链接（如 /user/keys）
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}?${param}`;
  }

  function getSSYApiKey() {
    return localStorage.getItem(SSY_STORAGE_KEY) || '';
  }
  function setSSYApiKey(key) {
    localStorage.setItem(SSY_STORAGE_KEY, key.trim());
  }

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function toStringList(value) {
    if (!Array.isArray(value)) return [];
    return value
      .filter(item => typeof item === 'string')
      .map(item => item.trim())
      .filter(Boolean);
  }

  function buildSSYHeaders(apiKey, includeJson) {
    const headers = {};
    if (includeJson) {
      headers['Content-Type'] = 'application/json';
    }
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    return headers;
  }

  async function readJsonSafely(response) {
    const text = await response.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch {
      return { message: text };
    }
  }

  function extractSSYError(payload, fallback) {
    if (!payload || typeof payload !== 'object') return fallback;
    const nested = payload.error && typeof payload.error === 'object' ? payload.error : {};
    const candidates = [
      payload.message,
      payload.msg,
      nested.message,
      nested.code,
      payload.code,
    ];
    for (const item of candidates) {
      if (typeof item === 'string' && item.trim()) {
        return item;
      }
    }
    return fallback;
  }

  function determineSsyApiType(supportApis) {
    const apis = toStringList(supportApis);
    if (apis.includes('/v1/chat/completions')) return 'openai-completions';
    if (apis.includes('/v1/messages')) return 'anthropic-messages';
    if (apis.includes('/v1/responses')) return 'openai-responses';
    return 'openai-completions';
  }

  function normalizeLlmModel(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const id = String(raw.id || raw.api_name || '').trim();
    if (!id) return null;
    const supportApis = toStringList(raw.support_apis);
    if (supportApis.length === 0) return null;
    const inputHint = String(raw.architecture?.input || '').toLowerCase();
    return {
      id,
      name: String(raw.name || id),
      supportApis,
      apiType: determineSsyApiType(supportApis),
      supportsImage: /image|vision/.test(inputHint),
    };
  }

  function parseSchemaObject(schema) {
    if (!schema) return null;
    if (typeof schema === 'object') return schema;
    if (typeof schema === 'string') {
      try {
        return JSON.parse(schema);
      } catch {
        return null;
      }
    }
    return null;
  }

  function normalizeMultimodalModel(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const id = String(raw.id || raw.api_name || '').trim();
    if (!id) return null;
    const classNames = toStringList(raw.class_names);
    const supportApis = toStringList(raw.support_apis);
    const outputHint = String(raw.architecture?.output || '').toLowerCase();
    return {
      id,
      apiName: String(raw.api_name || id),
      name: String(raw.name || raw.model_name || id),
      description: String(raw.description || raw.desc || ''),
      classNames,
      supportApis,
      outputHint,
      inputSchema: parseSchemaObject(raw.input_schema),
    };
  }

  function getMultimodalKind(model) {
    const text = `${model.id} ${model.name} ${model.classNames.join(' ')}`.toLowerCase();
    if (model.outputHint.includes('image')) return 'image';
    if (model.outputHint.includes('video')) return 'video';
    if (model.outputHint.includes('audio')) return 'audio';
    if (model.supportApis.includes('/v1/images/generations') || model.supportApis.includes('/v1/images/edits')) {
      return 'image';
    }
    if (text.includes('video') || text.includes('veo') || text.includes('wan') || text.includes('kling')) {
      return 'video';
    }
    if (text.includes('audio') || text.includes('speech') || text.includes('voice') || text.includes('sound') || text.includes('tts') || text.includes('fish') || text.includes('eleven')) {
      return 'audio';
    }
    return '';
  }

  function getModelCategory(modelId, modelName, classNames) {
    const text = `${modelId} ${modelName} ${(classNames || []).join(' ')}`.toLowerCase();
    
    if (/i2v|图生视频|image.*video/.test(text)) return { type: 'video', subType: 'i2v', label: '图生视频', icon: '🖼️→🎬' };
    if (/kf2v|首尾帧|first.*tail/.test(text)) return { type: 'video', subType: 'kf2v', label: '首尾帧', icon: '🎞️' };
    if (/t2v|文生视频|text.*video/.test(text)) return { type: 'video', subType: 't2v', label: '文生视频', icon: '📝→🎬' };
    if (/s2v|数字人|avatar/.test(text)) return { type: 'video', subType: 's2v', label: '数字人', icon: '👤' };
    if (/animate|动作|motion/.test(text)) return { type: 'video', subType: 'animate', label: '动作生成', icon: '🏃' };
    if (/lipsync|口型|lip/.test(text)) return { type: 'video', subType: 'lipsync', label: '口型同步', icon: '👄' };
    if (/video|veo|kling|vidu|sora|gen3|gen4/.test(text)) return { type: 'video', subType: 't2v', label: '视频生成', icon: '🎬' };
    
    if (/i2i|图生图|image.*edit|edit.*image/.test(text)) return { type: 'image', subType: 'i2i', label: '图生图', icon: '🖼️→🖼️' };
    if (/t2i|文生图|text.*image/.test(text)) return { type: 'image', subType: 't2i', label: '文生图', icon: '📝→🖼️' };
    if (/upscale|放大|enhance|增强|super/.test(text)) return { type: 'image', subType: 'edit', label: '图像处理', icon: '🔍' };
    if (/image|flux|dalle|stablediffusion|sd|imagen|z-image/.test(text)) return { type: 'image', subType: 't2i', label: '图像生成', icon: '🎨' };
    
    if (/tts|speech|语音|voice|multilingual/.test(text)) return { type: 'audio', subType: 'tts', label: '语音合成', icon: '🗣️' };
    if (/sound|音效|music|音乐|sfx/.test(text)) return { type: 'audio', subType: 'sound', label: '音效生成', icon: '🎵' };
    if (/audio|eleven/.test(text)) return { type: 'audio', subType: 'tts', label: '音频生成', icon: '🎵' };
    
    return { type: 'unknown', subType: 'unknown', label: '其他', icon: '❓' };
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function renderDynamicFormControl(key, prop, isRequired, currentValue) {
    const label = prop.title || prop.description || key;
    const requiredMark = isRequired ? '<span class="ssy-required">*</span>' : '';
    const format = prop.format || '';
    const inputId = `ssy-dyn-${key}`;
    
    if (format === 'image') {
      const preview = currentValue ? `<div class="ssy-file-preview-img"><img src="${currentValue}" alt="预览"/></div>` : '';
      return `
        <div class="ssy-form-group ssy-form-file" data-key="${key}" data-format="image">
          <label class="ssy-form-label">${label}${requiredMark}</label>
          <div class="ssy-file-upload-wrap">
            <input type="file" accept="image/*" class="ssy-file-input" id="${inputId}-file" />
            <label for="${inputId}-file" class="ssy-file-btn">📁 选择图片</label>
            <input type="hidden" id="${inputId}" value="${escapeAttr(currentValue || '')}" />
            <div class="ssy-file-preview" id="${inputId}-preview">${preview}</div>
          </div>
        </div>`;
    }
    
    if (format === 'video') {
      const preview = currentValue ? `<div class="ssy-file-preview-video"><video src="${currentValue}" controls></video></div>` : '';
      return `
        <div class="ssy-form-group ssy-form-file" data-key="${key}" data-format="video">
          <label class="ssy-form-label">${label}${requiredMark}</label>
          <div class="ssy-file-upload-wrap">
            <input type="file" accept="video/*" class="ssy-file-input" id="${inputId}-file" />
            <label for="${inputId}-file" class="ssy-file-btn">📁 选择视频</label>
            <input type="hidden" id="${inputId}" value="${escapeAttr(currentValue || '')}" />
            <div class="ssy-file-preview" id="${inputId}-preview">${preview}</div>
          </div>
        </div>`;
    }
    
    if (format === 'audio') {
      const preview = currentValue ? `<div class="ssy-file-preview-audio"><audio src="${currentValue}" controls></audio></div>` : '';
      return `
        <div class="ssy-form-group ssy-form-file" data-key="${key}" data-format="audio">
          <label class="ssy-form-label">${label}${requiredMark}</label>
          <div class="ssy-file-upload-wrap">
            <input type="file" accept="audio/*" class="ssy-file-input" id="${inputId}-file" />
            <label for="${inputId}-file" class="ssy-file-btn">📁 选择音频</label>
            <input type="hidden" id="${inputId}" value="${escapeAttr(currentValue || '')}" />
            <div class="ssy-file-preview" id="${inputId}-preview">${preview}</div>
          </div>
        </div>`;
    }
    
    if (prop.enum && Array.isArray(prop.enum) && prop.enum.length > 0) {
      const options = prop.enum.map(v => 
        `<option value="${escapeAttr(v)}" ${currentValue === v ? 'selected' : ''}>${escapeHtml(String(v))}</option>`
      ).join('');
      return `
        <div class="ssy-form-group" data-key="${key}">
          <label class="ssy-form-label">${label}${requiredMark}</label>
          <select class="ssy-select ssy-dyn-select" id="${inputId}">${options}</select>
        </div>`;
    }
    
    if (prop.type === 'boolean') {
      return `
        <div class="ssy-form-group ssy-form-checkbox" data-key="${key}">
          <label class="ssy-checkbox-label">
            <input type="checkbox" class="ssy-dyn-checkbox" id="${inputId}" ${currentValue === true || currentValue === 'true' ? 'checked' : ''} />
            <span>${label}</span>
          </label>
        </div>`;
    }
    
    if (prop.type === 'number' || prop.type === 'integer') {
      const min = prop.minimum !== undefined ? prop.minimum : '';
      const max = prop.maximum !== undefined ? prop.maximum : '';
      const step = prop.type === 'integer' ? '1' : 'any';
      return `
        <div class="ssy-form-group" data-key="${key}">
          <label class="ssy-form-label">${label}${requiredMark}</label>
          <input type="number" class="ssy-input ssy-dyn-number" id="${inputId}" 
                 value="${escapeAttr(currentValue || prop.default || '')}" 
                 ${min !== '' ? `min="${min}"` : ''} 
                 ${max !== '' ? `max="${max}"` : ''} 
                 step="${step}" />
        </div>`;
    }
    
    if (prop.type === 'string' && (key.toLowerCase().includes('prompt') || key.toLowerCase().includes('text') || prop.description?.length > 50)) {
      return `
        <div class="ssy-form-group" data-key="${key}">
          <label class="ssy-form-label">${label}${requiredMark}</label>
          <textarea class="ssy-textarea ssy-dyn-textarea" id="${inputId}" rows="3" placeholder="请输入${label}...">${escapeHtml(currentValue || '')}</textarea>
        </div>`;
    }
    
    return `
      <div class="ssy-form-group" data-key="${key}">
        <label class="ssy-form-label">${label}${requiredMark}</label>
        <input type="text" class="ssy-input ssy-dyn-text" id="${inputId}" value="${escapeAttr(currentValue || prop.default || '')}" placeholder="请输入${label}..." />
      </div>`;
  }

  function renderDynamicForm(schema, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!schema || !schema.properties || Object.keys(schema.properties).length === 0) {
      container.innerHTML = '<p class="ssy-hint">此模型无需额外参数，直接点击生成即可。</p>';
      return;
    }
    
    const props = schema.properties;
    const required = new Set(schema.required || []);
    
    const orderedKeys = Object.keys(props).sort((a, b) => {
      const aReq = required.has(a);
      const bReq = required.has(b);
      if (aReq && !bReq) return -1;
      if (!aReq && bReq) return 1;
      const priorityKeys = ['prompt', 'prompttext', 'text', 'input', 'image', 'video', 'audio'];
      const aPriority = priorityKeys.findIndex(k => a.toLowerCase().includes(k));
      const bPriority = priorityKeys.findIndex(k => b.toLowerCase().includes(k));
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.localeCompare(b);
    });
    
    let html = '<div class="ssy-dynamic-form-inner">';
    for (const key of orderedKeys) {
      html += renderDynamicFormControl(key, props[key], required.has(key), null);
    }
    html += '</div>';
    container.innerHTML = html;
    
    container.querySelectorAll('.ssy-file-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const wrap = input.closest('.ssy-file-upload-wrap');
        const previewEl = wrap.querySelector('.ssy-file-preview');
        const hiddenInput = wrap.querySelector('input[type="hidden"]');
        
        try {
          const base64 = await fileToBase64(file);
          hiddenInput.value = base64;
          
          if (file.type.startsWith('image/')) {
            previewEl.innerHTML = `<div class="ssy-file-preview-img"><img src="${base64}" alt="预览"/><button class="ssy-file-clear" title="清除">×</button></div>`;
          } else if (file.type.startsWith('video/')) {
            previewEl.innerHTML = `<div class="ssy-file-preview-video"><video src="${base64}" controls></video><button class="ssy-file-clear" title="清除">×</button></div>`;
          } else if (file.type.startsWith('audio/')) {
            previewEl.innerHTML = `<div class="ssy-file-preview-audio"><audio src="${base64}" controls></audio><button class="ssy-file-clear" title="清除">×</button></div>`;
          }
        } catch (err) {
          showToast('文件读取失败', 'error');
        }
      });
    });
    
    container.querySelectorAll('.ssy-file-clear').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const previewEl = btn.closest('.ssy-file-preview');
        const wrap = btn.closest('.ssy-file-upload-wrap');
        const hiddenInput = wrap.querySelector('input[type="hidden"]');
        const fileInput = wrap.querySelector('.ssy-file-input');
        hiddenInput.value = '';
        fileInput.value = '';
        previewEl.innerHTML = '';
      });
    });
  }

  function collectDynamicFormData(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return {};
    
    const data = {};
    container.querySelectorAll('.ssy-form-group[data-key]').forEach(group => {
      const key = group.dataset.key;
      const format = group.dataset.format;
      
      if (format === 'image' || format === 'video' || format === 'audio') {
        const hiddenInput = group.querySelector('input[type="hidden"]');
        if (hiddenInput && hiddenInput.value) {
          data[key] = hiddenInput.value;
        }
      } else {
        const select = group.querySelector('.ssy-dyn-select');
        const checkbox = group.querySelector('.ssy-dyn-checkbox');
        const number = group.querySelector('.ssy-dyn-number');
        const textarea = group.querySelector('.ssy-dyn-textarea');
        const text = group.querySelector('.ssy-dyn-text');
        
        if (select) {
          data[key] = select.value;
        } else if (checkbox) {
          data[key] = checkbox.checked;
        } else if (number) {
          const val = parseFloat(number.value);
          if (!isNaN(val)) data[key] = val;
        } else if (textarea) {
          data[key] = textarea.value;
        } else if (text) {
          data[key] = text.value;
        }
      }
    });
    return data;
  }

  function getLlmModelById(modelId) {
    return ssyModelState.llmModels.find(model => model.id === modelId) || null;
  }

  function getMultimodalModelById(modelId) {
    return ssyModelState.multimodalModels.find(model => model.id === modelId) || null;
  }

  function getMultimodalModelsByKind(kind) {
    return ssyModelState.multimodalModels.filter(model => getMultimodalKind(model) === kind);
  }

  async function fetchWithOptionalAuth(url, apiKey) {
    const token = typeof apiKey === 'string' ? apiKey.trim() : '';
    let response = await fetch(url, {
      method: 'GET',
      headers: buildSSYHeaders(token, false),
    });
    if (!response.ok && token) {
      response = await fetch(url, { method: 'GET' });
    }
    return response;
  }

  async function fetchSsyLlmModels(apiKey) {
    const response = await fetchWithOptionalAuth(SSY_MODELS_API, apiKey);
    const payload = await readJsonSafely(response);
    if (!response.ok) {
      throw new Error(extractSSYError(payload, `获取模型列表失败 (${response.status})`));
    }
    const list = Array.isArray(payload.data) ? payload.data : [];
    return list
      .map(normalizeLlmModel)
      .filter(Boolean)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  async function fetchSsyMultimodalModels(apiKey) {
    const response = await fetchWithOptionalAuth(SSY_MULTIMODAL_API, apiKey);
    const payload = await readJsonSafely(response);
    if (!response.ok) {
      throw new Error(extractSSYError(payload, `获取多模态模型失败 (${response.status})`));
    }
    const list = Array.isArray(payload.data) ? payload.data : [];
    return list
      .map(normalizeMultimodalModel)
      .filter(Boolean)
      .sort((a, b) => a.id.localeCompare(b.id));
  }

  async function ensureSsyModelCatalog(options = {}) {
    const now = Date.now();
    const force = options.force === true;
    const hasCache = ssyModelState.llmModels.length > 0 || ssyModelState.multimodalModels.length > 0;
    const cacheValid = hasCache && now - ssyModelState.timestamp < SSY_MODEL_CACHE_TTL;
    if (!force && cacheValid) {
      return {
        llmModels: ssyModelState.llmModels,
        multimodalModels: ssyModelState.multimodalModels,
      };
    }
    if (!force && ssyModelState.loadingPromise) {
      return ssyModelState.loadingPromise;
    }

    const apiKey = options.apiKey || getSSYApiKey();
    ssyModelState.loadingPromise = (async () => {
      const [llmResult, multimodalResult] = await Promise.allSettled([
        fetchSsyLlmModels(apiKey),
        fetchSsyMultimodalModels(apiKey),
      ]);
      const llmModels = llmResult.status === 'fulfilled' ? llmResult.value : [];
      const multimodalModels = multimodalResult.status === 'fulfilled' ? multimodalResult.value : [];
      if (llmModels.length === 0 && multimodalModels.length === 0) {
        const reason = llmResult.status === 'rejected'
          ? llmResult.reason
          : multimodalResult.status === 'rejected'
            ? multimodalResult.reason
            : new Error('模型列表为空');
        throw reason;
      }
      ssyModelState.llmModels = llmModels;
      ssyModelState.multimodalModels = multimodalModels;
      ssyModelState.timestamp = Date.now();
      return { llmModels, multimodalModels };
    })();

    try {
      return await ssyModelState.loadingPromise;
    } finally {
      ssyModelState.loadingPromise = null;
    }
  }

  function setModelLoadStatus(text, type = 'loading') {
    const el = document.getElementById('ssy-model-load-status');
    if (!el) return;
    el.className =
      type === 'success'
        ? 'ssy-test-ok'
        : type === 'error'
          ? 'ssy-test-fail'
          : 'ssy-test-loading';
    el.textContent = text;
  }

  function buildLlmOptionLabel(model) {
    const tags = [];
    if (model.apiType === 'openai-responses') tags.push('Responses');
    if (model.apiType === 'anthropic-messages') tags.push('Messages');
    if (model.supportsImage) tags.push('图像');
    return tags.length > 0
      ? `${model.name} [${model.id}] (${tags.join(' / ')})`
      : `${model.name} [${model.id}]`;
  }

  function renderQuickModelOptions(preferredModelId) {
    const select = document.getElementById('ssy-model-select');
    const customInput = document.getElementById('ssy-custom-model');
    if (!select) return;

    const currentSelected = preferredModelId || getSelectedModelId() || SSY_DEFAULT_LLM_MODEL;
    const allModels = ssyModelState.llmModels;
    const preferSet = new Set([...SSY_PREFERRED_LLM_MODELS, SSY_DEFAULT_LLM_MODEL]);
    const recommended = [];
    const others = [];
    allModels.forEach(model => {
      if (preferSet.has(model.id)) {
        recommended.push(model);
      } else {
        others.push(model);
      }
    });

    const optionHtml = model =>
      `<option value="${escapeAttr(model.id)}">${escapeHtml(buildLlmOptionLabel(model))}</option>`;

    const htmlParts = [];
    if (recommended.length > 0) {
      htmlParts.push('<optgroup label="⭐ 推荐模型">');
      htmlParts.push(recommended.map(optionHtml).join(''));
      htmlParts.push('</optgroup>');
    }
    if (others.length > 0) {
      htmlParts.push(`<optgroup label="📚 动态模型 (${allModels.length})">`);
      htmlParts.push(others.map(optionHtml).join(''));
      htmlParts.push('</optgroup>');
    }
    htmlParts.push('<optgroup label="✏️ 自定义">');
    htmlParts.push('<option value="__custom__">手动输入模型 ID...</option>');
    htmlParts.push('</optgroup>');

    select.innerHTML = htmlParts.join('');

    const hasCurrent = allModels.some(model => model.id === currentSelected);
    if (hasCurrent) {
      select.value = currentSelected;
      if (customInput) {
        customInput.style.display = 'none';
      }
    } else {
      select.value = '__custom__';
      if (customInput) {
        customInput.style.display = 'block';
        customInput.value = currentSelected || '';
      }
    }
  }

  function renderMultimodalOptions(selectId, customInputId, defaultCheckboxId, dynamicFormId, models, defaultModelId, fallbackText) {
    const select = document.getElementById(selectId);
    const customInput = document.getElementById(customInputId);
    const defaultCheckbox = document.getElementById(defaultCheckboxId);
    const dynamicForm = document.getElementById(dynamicFormId);
    if (!select) return;

    const current = select.value === '__custom__' ? '__custom__' : String(select.value || '').trim();
    const customValue = customInput?.value?.trim() || '';

    if (!Array.isArray(models) || models.length === 0) {
      select.innerHTML = `<option value="">${escapeHtml(fallbackText)}</option>`;
      if (customInput) customInput.style.display = 'none';
      if (dynamicForm) dynamicForm.innerHTML = '';
      return;
    }

    const grouped = {};
    const otherModels = [];
    models.forEach(model => {
      const cat = getModelCategory(model.id, model.name, model.classNames);
      if (cat.subType === 'unknown') {
        otherModels.push(model);
      } else {
        const key = `${cat.type}_${cat.subType}`;
        if (!grouped[key]) {
          grouped[key] = { category: cat, models: [] };
        }
        grouped[key].models.push(model);
      }
    });

    const sortedGroups = Object.values(grouped).sort((a, b) => {
      const order = { t2v: 1, i2v: 2, kf2v: 3, t2i: 10, i2i: 11, edit: 12, tts: 20, sound: 21 };
      const aOrder = order[a.category.subType] || 99;
      const bOrder = order[b.category.subType] || 99;
      return aOrder - bOrder;
    });

    let html = '';
    sortedGroups.forEach(group => {
      const cat = group.category;
      html += `<optgroup label="${cat.icon} ${cat.label}">`;
      group.models.forEach(model => {
        html += `<option value="${escapeAttr(model.id)}">${escapeHtml(model.name)}</option>`;
      });
      html += '</optgroup>';
    });

    if (otherModels.length > 0) {
      html += '<optgroup label="📋 其他模型">';
      otherModels.forEach(model => {
        html += `<option value="${escapeAttr(model.id)}">${escapeHtml(model.name)}</option>`;
      });
      html += '</optgroup>';
    }

    html += '<option value="__custom__">✏️ 自定义模型...</option>';
    select.innerHTML = html;

    const modelIds = new Set(models.map(m => m.id));
    let target = '';
    if (current === '__custom__' && customValue) {
      target = '__custom__';
      if (customInput) {
        customInput.style.display = 'block';
        customInput.value = customValue;
      }
    } else if (current && modelIds.has(current)) {
      target = current;
      if (customInput) customInput.style.display = 'none';
    } else if (defaultModelId && modelIds.has(defaultModelId)) {
      target = defaultModelId;
      if (customInput) customInput.style.display = 'none';
    } else if (models.length > 0) {
      const firstGroup = sortedGroups[0];
      if (firstGroup && firstGroup.models.length > 0) {
        target = firstGroup.models[0].id;
      } else {
        target = otherModels[0]?.id || '';
      }
      if (customInput) customInput.style.display = 'none';
    }

    if (target && target !== '__custom__') {
      select.value = target;
      if (defaultCheckbox) {
        defaultCheckbox.checked = (target === defaultModelId);
      }
      const selectedModel = models.find(m => m.id === target);
      if (dynamicForm && selectedModel) {
        renderDynamicForm(selectedModel.inputSchema, dynamicFormId);
      }
    } else if (target === '__custom__') {
      select.value = '__custom__';
      if (defaultCheckbox) defaultCheckbox.checked = false;
      if (dynamicForm) dynamicForm.innerHTML = '<p class="ssy-hint">请输入自定义模型ID后选择</p>';
    }
  }

  function getMultimodalModelId(selectId, customInputId) {
    const select = document.getElementById(selectId);
    const customInput = document.getElementById(customInputId);
    if (!select) return '';

    if (select.value === '__custom__' && customInput) {
      return customInput.value?.trim() || '';
    }
    return String(select.value || '').trim();
  }

  async function refreshSsyModelOptions(force) {
    setModelLoadStatus('⏳ 正在加载模型列表...');
    try {
      await ensureSsyModelCatalog({ force: force === true, apiKey: getSSYApiKey() });
      renderQuickModelOptions();
      const savedImageModel = localStorage.getItem('ssy_default_image_model') || SSY_DEFAULT_IMAGE_MODEL;
      const savedVideoModel = localStorage.getItem('ssy_default_video_model') || SSY_DEFAULT_VIDEO_MODEL;
      const savedAudioModel = localStorage.getItem('ssy_default_audio_model') || SSY_DEFAULT_AUDIO_MODEL;
      renderMultimodalOptions('ssy-t2i-model', 'ssy-t2i-custom-model', 'ssy-t2i-default', 'ssy-t2i-dynamic-form', getMultimodalModelsByKind('image'), savedImageModel, '暂无可用图像模型');
      renderMultimodalOptions('ssy-t2v-model', 'ssy-t2v-custom-model', 'ssy-t2v-default', 'ssy-t2v-dynamic-form', getMultimodalModelsByKind('video'), savedVideoModel, '暂无可用视频模型');
      renderMultimodalOptions('ssy-tts-model', 'ssy-tts-custom-model', 'ssy-tts-default', 'ssy-tts-dynamic-form', getMultimodalModelsByKind('audio'), savedAudioModel, '暂无可用音频模型');
      setModelLoadStatus(`✅ 模型已加载：语言 ${ssyModelState.llmModels.length} 个，多模态 ${ssyModelState.multimodalModels.length} 个`, 'success');
      generateConfigCommands();
    } catch (err) {
      console.warn('[功能面板] 胜算云模型加载失败:', err);
      setModelLoadStatus(`❌ 模型加载失败：${err?.message || '未知错误'}`, 'error');
    }
  }

  // 渲染 AI 创作 Tab
  function renderAiStudioTab() {
    const savedKey = getSSYApiKey();
    const keyPreview = savedKey ? savedKey.slice(0, 8) + '...' + savedKey.slice(-4) : '';
    const brandUrl = getSSYUrl();
    const promoUrl = getSSYUrl();
    const keyUrl = SSY_API_KEY_URL;
    const multimodalCardClass = SSY_MULTIMODAL_ENABLED ? 'ssy-tool-card' : 'ssy-tool-card ssy-tool-disabled';
    const multimodalBadge = !SSY_MULTIMODAL_ENABLED
      ? ' <span class="ssy-coming-soon">即将上线</span>'
      : SSY_MULTIMODAL_BADGE_TEXT
        ? ` <span class="ssy-beta-badge">${escapeHtml(SSY_MULTIMODAL_BADGE_TEXT)}</span>`
        : '';

    return `
      <div class="ai-studio-tab">
        <div class="ssy-header">
          <div class="ssy-brand">
            <span class="ssy-logo">⚡</span>
            <div>
              <h3>AI 创作工具</h3>
              <p class="ssy-subtitle">由 <a href="${brandUrl}" target="_blank">${SSY_NAME}</a> 提供 API 服务</p>
            </div>
          </div>
          <a href="${promoUrl}" target="_blank" class="ssy-promo-badge">${SSY_PROMO_TEXT}</a>
        </div>
        ${SSY_PROMO_NOTE ? `<p class="ssy-promo-note">${SSY_PROMO_NOTE}</p>` : ''}

        <div class="ssy-key-section">
          <label class="ssy-label">🔑 API Key 配置</label>
          <div class="ssy-key-row">
            <input type="password" id="ssy-api-key" class="ssy-input" 
                   placeholder="输入${SSY_NAME} API Key..." 
                   value="${savedKey}" />
            <button class="ssy-btn ssy-btn-test" id="ssy-test-key" title="测试连接">🔗 测试</button>
            <button class="ssy-btn ssy-btn-save" id="ssy-save-key">保存</button>
          </div>
          <div id="ssy-test-result"></div>
          ${savedKey ? '<p class="ssy-key-hint">✅ 已配置: ' + keyPreview + '</p>' : '<p class="ssy-key-hint">📎 <a href="' + keyUrl + '" target="_blank">' + SSY_GET_KEY_TEXT + '</a></p>'}
        </div>

        <div class="ssy-quick-config">
          <label class="ssy-label">🚀 快速配置渠道</label>
          <p class="ssy-config-desc">选择模型后复制命令到终端执行，即可完成对接。</p>
          <div class="ssy-config-row">
            <select id="ssy-model-select" class="ssy-select ssy-model-select">
              <option value="">正在加载模型列表...</option>
            </select>
            <input type="text" id="ssy-custom-model" class="ssy-input ssy-custom-model-input" placeholder="输入模型 ID，如 openai/gpt-4o" style="display:none;" />
          </div>
          <div id="ssy-model-load-status" class="ssy-test-loading">⏳ 正在加载模型列表...</div>
          <div class="ssy-config-commands" id="ssy-config-commands">
            <div class="ssy-config-cmd-block">
              <span class="ssy-config-cmd-label">📋 复制以下命令到终端执行：</span>
              <pre class="ssy-config-cmd" id="ssy-config-cmd-text"></pre>
              <div class="ssy-config-actions">
                <button class="ssy-btn ssy-btn-copy" id="ssy-copy-config">📋 复制命令</button>
                <button class="ssy-btn ssy-btn-test-model" id="ssy-test-model">🧪 测试模型</button>
                <button class="ssy-btn ssy-btn-test-model" id="ssy-refresh-models">🔄 刷新模型</button>
              </div>
            </div>
          </div>
          <div id="ssy-model-test-result"></div>
        </div>

        <div class="ssy-tools">
          <div class="${multimodalCardClass}" data-tool="text2img">
            <div class="ssy-tool-icon">🎨</div>
            <div class="ssy-tool-info">
              <h4>图像生成${multimodalBadge}</h4>
              <p>文生图、图生图、图像编辑等多种图像生成能力</p>
            </div>
          </div>
          <div class="ssy-tool-panel" id="ssy-text2img-panel">
            <div class="ssy-model-section">
              <label class="ssy-label">📦 选择模型</label>
              <div class="ssy-model-select-row">
                <select id="ssy-t2i-model" class="ssy-select ssy-model-select-full">
                  <option value="">正在加载图像模型...</option>
                </select>
                <input type="text" id="ssy-t2i-custom-model" class="ssy-input ssy-custom-model" placeholder="自定义模型ID" style="display:none;" />
              </div>
            </div>
            <div id="ssy-t2i-dynamic-form" class="ssy-dynamic-form"></div>
            <div class="ssy-tool-actions">
              <label class="ssy-default-model-label"><input type="checkbox" id="ssy-t2i-default" /> 设为默认</label>
              <button class="ssy-btn ssy-btn-primary" id="ssy-t2i-generate">✨ 生成</button>
            </div>
            <div id="ssy-t2i-result" class="ssy-result"></div>
          </div>

          <div class="${multimodalCardClass}" data-tool="text2video">
            <div class="ssy-tool-icon">🎬</div>
            <div class="ssy-tool-info">
              <h4>视频生成${multimodalBadge}</h4>
              <p>文生视频、图生视频、首尾帧等多种视频生成能力</p>
            </div>
          </div>
          <div class="ssy-tool-panel" id="ssy-text2video-panel">
            <div class="ssy-model-section">
              <label class="ssy-label">📦 选择模型</label>
              <div class="ssy-model-select-row">
                <select id="ssy-t2v-model" class="ssy-select ssy-model-select-full">
                  <option value="">正在加载视频模型...</option>
                </select>
                <input type="text" id="ssy-t2v-custom-model" class="ssy-input ssy-custom-model" placeholder="自定义模型ID" style="display:none;" />
              </div>
            </div>
            <div id="ssy-t2v-dynamic-form" class="ssy-dynamic-form"></div>
            <div class="ssy-tool-actions">
              <label class="ssy-default-model-label"><input type="checkbox" id="ssy-t2v-default" /> 设为默认</label>
              <button class="ssy-btn ssy-btn-primary" id="ssy-t2v-generate">🎬 生成</button>
            </div>
            <div id="ssy-t2v-result" class="ssy-result"></div>
          </div>

          <div class="${multimodalCardClass}" data-tool="tts">
            <div class="ssy-tool-icon">🎵</div>
            <div class="ssy-tool-info">
              <h4>音频生成${multimodalBadge}</h4>
              <p>语音合成、音效生成等多种音频生成能力</p>
            </div>
          </div>
          <div class="ssy-tool-panel" id="ssy-tts-panel">
            <div class="ssy-model-section">
              <label class="ssy-label">📦 选择模型</label>
              <div class="ssy-model-select-row">
                <select id="ssy-tts-model" class="ssy-select ssy-model-select-full">
                  <option value="">正在加载音频模型...</option>
                </select>
                <input type="text" id="ssy-tts-custom-model" class="ssy-input ssy-custom-model" placeholder="自定义模型ID" style="display:none;" />
              </div>
            </div>
            <div id="ssy-tts-dynamic-form" class="ssy-dynamic-form"></div>
            <div class="ssy-tool-actions">
              <label class="ssy-default-model-label"><input type="checkbox" id="ssy-tts-default" /> 设为默认</label>
              <button class="ssy-btn ssy-btn-primary" id="ssy-tts-generate">🎵 合成</button>
            </div>
            <div id="ssy-tts-result" class="ssy-result"></div>
          </div>
        </div>

        <div class="ssy-footer">
          <p>💡 ${SSY_FOOTER_TEXT} · <a href="${getSSYUrl()}" target="_blank">${SSY_FOOTER_LINK}</a></p>
        </div>
      </div>
    `;
  }

  function collectMediaUrls(payload) {
    const urls = new Set();

    const knownFields = ['audio_urls', 'image_urls', 'video_urls', 'media_urls', 'urls', 'url', 'output_url', 'result_url'];
    if (payload && typeof payload === 'object') {
      const data = payload.data?.data || payload.data || payload;
      if (data && typeof data === 'object') {
        for (const field of knownFields) {
          const val = data[field];
          if (Array.isArray(val)) {
            val.forEach(item => {
              if (typeof item === 'string' && /^https?:\/\//i.test(item)) {
                urls.add(item);
              }
            });
          } else if (typeof val === 'string' && /^https?:\/\//i.test(val)) {
            urls.add(val);
          }
        }
      }
    }

    const visit = (value, depth) => {
      if (depth > 8 || value == null) return;
      if (typeof value === 'string') {
        if (/^https?:\/\//i.test(value)) {
          urls.add(value);
        }
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(item => visit(item, depth + 1));
        return;
      }
      if (typeof value === 'object') {
        Object.values(value).forEach(item => visit(item, depth + 1));
      }
    };

    visit(payload, 0);
    return Array.from(urls);
  }

  function getTaskRequestId(payload) {
    if (!payload || typeof payload !== 'object') return '';
    return String(payload.data?.request_id || payload.request_id || '');
  }

  function getTaskStatus(payload) {
    if (!payload || typeof payload !== 'object') return '';
    return String(payload.data?.status || payload.status || '').toUpperCase();
  }

  function getTaskProgress(payload) {
    if (!payload || typeof payload !== 'object') return undefined;
    const candidates = [payload.data?.data?.progress, payload.data?.progress, payload.progress];
    for (const candidate of candidates) {
      if (typeof candidate === 'number' && Number.isFinite(candidate)) {
        return candidate;
      }
      if (typeof candidate === 'string' && candidate.trim()) {
        const value = Number(candidate);
        if (Number.isFinite(value)) return value;
      }
    }
    return undefined;
  }

  function getTaskFailReason(payload) {
    if (!payload || typeof payload !== 'object') return '任务执行失败';
    return String(payload.data?.fail_reason || payload.data?.data?.error || payload.message || '任务执行失败');
  }

  function isTaskFailure(status) {
    return ['FAILED', 'FAIL', 'ERROR', 'CANCELLED', 'CANCELED'].includes(status);
  }

  function isTaskFinished(status, progress, urls) {
    if (['SUCCESS', 'SUCCEEDED', 'COMPLETED', 'DONE', 'FINISHED'].includes(status)) return true;
    if (typeof progress === 'number' && progress >= 100) return true;
    return urls.length > 0 && !['', 'PENDING', 'RUNNING', 'PROCESSING', 'QUEUED'].includes(status);
  }

  function detectMediaType(url, fallbackType) {
    if (fallbackType) return fallbackType;
    if (/\.(png|jpg|jpeg|webp|gif|bmp|svg)(\?|$)/i.test(url)) return 'image';
    if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(url)) return 'video';
    if (/\.(mp3|wav|ogg|m4a|aac|flac)(\?|$)/i.test(url)) return 'audio';
    return 'file';
  }

  function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || '';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  window.ssyDownloadFile = downloadFile;

  function generateTimestampFilename(ext) {
    const now = new Date();
    const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
    return `ssy_${ts}.${ext}`;
  }

  function renderMediaResults(resultDiv, urls, fallbackType) {
    if (!urls || urls.length === 0) {
      resultDiv.innerHTML = '<p class="ssy-error">❌ 未返回可用结果</p>';
      return;
    }

    const html = urls.map((url, idx) => {
      const safeUrl = escapeAttr(url);
      const mediaType = detectMediaType(url, fallbackType);
      const ext = mediaType === 'image' ? 'png' : mediaType === 'video' ? 'mp4' : mediaType === 'audio' ? 'mp3' : 'bin';
      const filename = generateTimestampFilename(ext);

      if (mediaType === 'image') {
        return `
          <div class="ssy-media-result ssy-img-wrap">
            <img src="${safeUrl}" alt="AI 生成" class="ssy-generated-img" onclick="window.open('${safeUrl}', '_blank')" />
            <div class="ssy-media-actions">
              <button class="ssy-action-btn" onclick="window.open('${safeUrl}', '_blank')" title="预览大图">🔍 预览</button>
              <button class="ssy-action-btn" onclick="window.ssyDownloadFile('${safeUrl}', '${filename}')" title="下载图片">📥 下载</button>
              <button class="ssy-action-btn ssy-copy-url-btn" data-url="${safeUrl}" title="复制链接">📋 复制</button>
            </div>
          </div>`;
      }
      if (mediaType === 'video') {
        return `
          <div class="ssy-media-result ssy-video-wrap">
            <video src="${safeUrl}" controls class="ssy-generated-video"></video>
            <div class="ssy-media-actions">
              <button class="ssy-action-btn" onclick="window.open('${safeUrl}', '_blank')" title="新窗口播放">🔍 播放</button>
              <button class="ssy-action-btn" onclick="window.ssyDownloadFile('${safeUrl}', '${filename}')" title="下载视频">📥 下载</button>
              <button class="ssy-action-btn ssy-copy-url-btn" data-url="${safeUrl}" title="复制链接">📋 复制</button>
            </div>
          </div>`;
      }
      if (mediaType === 'audio') {
        return `
          <div class="ssy-media-result ssy-audio-wrap">
            <audio src="${safeUrl}" controls class="ssy-generated-audio"></audio>
            <div class="ssy-media-actions">
              <button class="ssy-action-btn" onclick="window.open('${safeUrl}', '_blank')" title="新窗口播放">🔍 播放</button>
              <button class="ssy-action-btn" onclick="window.ssyDownloadFile('${safeUrl}', '${filename}')" title="下载音频">📥 下载</button>
              <button class="ssy-action-btn ssy-copy-url-btn" data-url="${safeUrl}" title="复制链接">📋 复制</button>
            </div>
          </div>`;
      }
      return `
        <div class="ssy-media-result ssy-file-wrap">
          <a href="${safeUrl}" target="_blank" class="ssy-file-link">📎 打开结果文件</a>
          <div class="ssy-media-actions">
            <button class="ssy-action-btn" onclick="window.ssyDownloadFile('${safeUrl}', '${filename}')" title="下载文件">📥 下载</button>
            <button class="ssy-action-btn ssy-copy-url-btn" data-url="${safeUrl}" title="复制链接">📋 复制</button>
          </div>
        </div>`;
    }).join('');
    resultDiv.innerHTML = html;

    resultDiv.querySelectorAll('.ssy-copy-url-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.url;
        if (url) {
          copyToClipboard(url);
          showToast('链接已复制', 'success');
        }
      });
    });
  }

  async function requestSsyTask(apiKey, payload, resultDiv, loadingText) {
    const submitRes = await fetch(`${SSY_API_BASE}/tasks/generations`, {
      method: 'POST',
      headers: buildSSYHeaders(apiKey, true),
      body: JSON.stringify(payload),
    });
    const submitPayload = await readJsonSafely(submitRes);
    if (!submitRes.ok) {
      throw new Error(extractSSYError(submitPayload, `提交任务失败 (${submitRes.status})`));
    }

    const directUrls = collectMediaUrls(submitPayload);
    if (directUrls.length > 0) {
      return directUrls;
    }

    const requestId = getTaskRequestId(submitPayload);
    if (!requestId) {
      throw new Error(extractSSYError(submitPayload, '任务提交成功但未返回 request_id'));
    }

    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 6000));

      const pollRes = await fetch(`${SSY_API_BASE}/tasks/generations/${requestId}`, {
        method: 'GET',
        headers: buildSSYHeaders(apiKey, false),
      });
      if (!pollRes.ok) {
        continue;
      }

      const pollPayload = await readJsonSafely(pollRes);
      const status = getTaskStatus(pollPayload);
      if (isTaskFailure(status)) {
        throw new Error(getTaskFailReason(pollPayload));
      }

      const urls = collectMediaUrls(pollPayload);
      const progress = getTaskProgress(pollPayload);
      if (isTaskFinished(status, progress, urls)) {
        if (urls.length > 0) {
          return urls;
        }
        throw new Error(extractSSYError(pollPayload, '任务完成但未返回结果地址'));
      }

      if (resultDiv) {
        const progressText = typeof progress === 'number' ? `${Math.max(0, Math.min(100, progress))}%` : `${(i + 1) * 6}s`;
        resultDiv.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div><p>${loadingText}（${progressText}）</p></div>`;
      }
    }

    throw new Error('任务执行超时（约 3 分钟），请稍后重试');
  }

  async function requestSsyImage(apiKey, payload) {
    const response = await fetch(`${SSY_API_BASE}/images/generations`, {
      method: 'POST',
      headers: buildSSYHeaders(apiKey, true),
      body: JSON.stringify(payload),
    });
    const body = await readJsonSafely(response);
    if (!response.ok) {
      throw new Error(extractSSYError(body, `图片生成失败 (${response.status})`));
    }
    const urls = collectMediaUrls(body);
    if (urls.length === 0) {
      throw new Error(extractSSYError(body, '图片生成未返回可用地址'));
    }
    return urls;
  }

  function normalizeSsySize(value) {
    if (typeof value !== 'string') return value;
    return value.replace(/[xX×]/g, '*');
  }

  function createMultimodalPayload(model, prompt, extras = {}) {
    const payload = { model: model?.apiName || model?.id };
    const schema = model?.inputSchema;
    const properties =
      schema && typeof schema === 'object' && schema.properties && typeof schema.properties === 'object'
        ? schema.properties
        : null;
    const propertyKeys = properties ? new Set(Object.keys(properties)) : null;

    const addPromptFields = () => {
      if (!propertyKeys) {
        payload.prompt = prompt;
        return;
      }
      const hasPrompt = propertyKeys.has('prompt');
      const hasPromptText = propertyKeys.has('promptText');
      if (hasPrompt) payload.prompt = prompt;
      if (hasPromptText) payload.promptText = prompt;
      if (!hasPrompt && !hasPromptText) {
        payload.prompt = prompt;
      }
    };

    addPromptFields();

    for (const [key, value] of Object.entries(extras)) {
      if (value == null || value === '') {
        continue;
      }
      if (key === 'duration' || key === 'seconds') {
        if (!propertyKeys || (propertyKeys.has('duration') || propertyKeys.has('seconds'))) {
          payload[key] = value;
        }
        continue;
      }
      if (key === 'voice_preset' || key === 'voice' || key === 'voice_id') {
        if (!propertyKeys || propertyKeys.has(key)) {
          payload[key] = value;
        }
        continue;
      }
      if (!propertyKeys || propertyKeys.has(key)) {
        if (key === 'size' || key === 'image_size' || key === 'resolution') {
          payload[key] = normalizeSsySize(value);
        } else {
          payload[key] = value;
        }
      }
    }

    if (schema && typeof schema === 'object' && schema.properties && typeof schema.properties === 'object') {
      if ('seconds' in schema.properties && payload.seconds == null && payload.duration != null) {
        payload.seconds = String(payload.duration);
      }
      if ('duration' in schema.properties && payload.duration == null && payload.seconds != null) {
        payload.duration = Number(payload.seconds) || 4;
      }
      if ('size' in schema.properties && payload.size == null && payload.resolution != null) {
        payload.size = normalizeSsySize(payload.resolution);
      }
      if ('resolution' in schema.properties && payload.resolution == null && payload.size != null) {
        payload.resolution = normalizeSsySize(payload.size);
      }
    }

    if (payload.size) payload.size = normalizeSsySize(payload.size);
    if (payload.image_size) payload.image_size = normalizeSsySize(payload.image_size);
    if (payload.resolution) payload.resolution = normalizeSsySize(payload.resolution);

    return payload;
  }

  function buildPayloadFromSchema(model, formData) {
    const payload = { model: model?.apiName || model?.id };
    const schema = model?.inputSchema;
    const properties = schema?.properties || {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (value == null || value === '') continue;
      
      const prop = properties[key];
      if (!prop) {
        payload[key] = value;
        continue;
      }
      
      if (prop.format === 'image' || prop.format === 'video' || prop.format === 'audio') {
        payload[key] = value;
      } else if (key === 'size' || key === 'image_size' || key === 'resolution') {
        payload[key] = normalizeSsySize(value);
      } else {
        payload[key] = value;
      }
    }
    
    return payload;
  }

  function validateFormData(formData, schema) {
    if (!schema || !schema.required) return { valid: true, errors: [] };
    
    const errors = [];
    for (const key of schema.required) {
      const value = formData[key];
      if (value === undefined || value === null || value === '') {
        const prop = schema.properties?.[key];
        const label = prop?.title || prop?.description || key;
        errors.push(`缺少必填项：${label}`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  // 胜算云 API 调用：图像生成（动态表单版本）
  async function ssyGenerateImage() {
    const btn = document.getElementById('ssy-t2i-generate');
    if (btn?.disabled) return;

    const apiKey = getSSYApiKey();
    if (!apiKey) { showToast('请先配置胜算云 API Key', 'error'); return; }

    const modelId = getMultimodalModelId('ssy-t2i-model', 'ssy-t2i-custom-model');
    if (!modelId) { showToast('请先选择图像模型', 'error'); return; }

    const model = getMultimodalModelById(modelId);
    const formData = collectDynamicFormData('ssy-t2i-dynamic-form');
    
    const validation = validateFormData(formData, model?.inputSchema);
    if (!validation.valid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    const supportApis = model?.supportApis || [];
    const resultDiv = document.getElementById('ssy-t2i-result');
    if (!resultDiv) return;

    setButtonLoading(btn, true, '生成中...');
    resultDiv.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p>正在生成图片，请稍候...</p></div>';

    try {
      const payload = buildPayloadFromSchema(model || { id: modelId, apiName: modelId }, formData);

      let urls = [];
      if (supportApis.includes('/v1/images/generations')) {
        try {
          urls = await requestSsyImage(apiKey, payload);
        } catch (syncError) {
          if (!supportApis.includes('/v1/tasks/generations')) {
            throw syncError;
          }
        }
      }

      if (urls.length === 0) {
        if (supportApis.length > 0 && !supportApis.includes('/v1/tasks/generations')) {
          throw new Error('当前图像模型不支持任务生成接口，请切换模型后重试');
        }
        urls = await requestSsyTask(apiKey, payload, resultDiv, '图片生成中');
      }

      renderMediaResults(resultDiv, urls, 'image');
    } catch (err) {
      resultDiv.innerHTML = `<p class="ssy-error">❌ ${escapeHtml(err?.message || '生成失败')}</p>`;
    } finally {
      setButtonLoading(btn, false);
    }
  }

  // 胜算云 API 调用：视频生成（动态表单版本）
  async function ssyGenerateVideo() {
    const btn = document.getElementById('ssy-t2v-generate');
    if (btn?.disabled) return;

    const apiKey = getSSYApiKey();
    if (!apiKey) { showToast('请先配置胜算云 API Key', 'error'); return; }

    const modelId = getMultimodalModelId('ssy-t2v-model', 'ssy-t2v-custom-model');
    if (!modelId) { showToast('请先选择视频模型', 'error'); return; }

    const model = getMultimodalModelById(modelId);
    const formData = collectDynamicFormData('ssy-t2v-dynamic-form');
    
    const validation = validateFormData(formData, model?.inputSchema);
    if (!validation.valid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    const resultDiv = document.getElementById('ssy-t2v-result');
    if (!resultDiv) return;

    setButtonLoading(btn, true, '生成中...');
    resultDiv.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p>正在生成视频，这可能需要 1-3 分钟...</p></div>';

    try {
      const payload = buildPayloadFromSchema(model || { id: modelId, apiName: modelId }, formData);
      const urls = await requestSsyTask(apiKey, payload, resultDiv, '视频生成中');
      renderMediaResults(resultDiv, urls, 'video');
    } catch (err) {
      resultDiv.innerHTML = `<p class="ssy-error">❌ ${escapeHtml(err?.message || '生成失败')}</p>`;
    } finally {
      setButtonLoading(btn, false);
    }
  }

  function setButtonLoading(btn, loading, loadingText) {
    if (!btn) return;
    if (loading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<span class="ssy-btn-spinner"></span> ${loadingText || '处理中...'}`;
      btn.classList.add('ssy-btn-loading');
    } else {
      btn.disabled = false;
      btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
      btn.classList.remove('ssy-btn-loading');
    }
  }

  function getTtsVoicePreset(modelId, schema) {
    const properties = schema && typeof schema === 'object' && schema.properties;
    if (!properties) return null;

    if ('voice_preset' in properties || 'voice' in properties || 'voice_id' in properties) {
      const key = 'voice_preset' in properties ? 'voice_preset' : 'voice' in properties ? 'voice' : 'voice_id';
      const prop = properties[key];
      if (prop && prop.enum && prop.enum.length > 0) {
        return prop.enum[0];
      }
      if (prop && prop.default) {
        return prop.default;
      }
      return null;
    }
    return null;
  }

  // 胜算云 API 调用：音频生成（动态表单版本）
  async function ssyGenerateTTS() {
    const btn = document.getElementById('ssy-tts-generate');
    if (btn?.disabled) return;

    const apiKey = getSSYApiKey();
    if (!apiKey) { showToast('请先配置胜算云 API Key', 'error'); return; }

    const modelId = getMultimodalModelId('ssy-tts-model', 'ssy-tts-custom-model');
    if (!modelId) { showToast('请先选择音频模型', 'error'); return; }

    const model = getMultimodalModelById(modelId);
    const formData = collectDynamicFormData('ssy-tts-dynamic-form');
    
    const validation = validateFormData(formData, model?.inputSchema);
    if (!validation.valid) {
      showToast(validation.errors[0], 'error');
      return;
    }

    const resultDiv = document.getElementById('ssy-tts-result');
    if (!resultDiv) return;

    setButtonLoading(btn, true, '合成中...');
    resultDiv.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p>正在合成音频...</p></div>';

    try {
      const payload = buildPayloadFromSchema(model || { id: modelId, apiName: modelId }, formData);
      const urls = await requestSsyTask(apiKey, payload, resultDiv, '音频合成中');
      renderMediaResults(resultDiv, urls, 'audio');
    } catch (err) {
      resultDiv.innerHTML = `<p class="ssy-error">❌ ${escapeHtml(err?.message || '合成失败')}</p>`;
    } finally {
      setButtonLoading(btn, false);
    }
  }

  // 测试 API Key 连接
  async function ssyTestConnection() {
    const input = document.getElementById('ssy-api-key');
    const key = input?.value?.trim();
    if (!key) { showToast('请先输入 API Key', 'error'); return; }

    const resultDiv = document.getElementById('ssy-test-result');
    if (resultDiv) {
      resultDiv.innerHTML = '<p class="ssy-test-loading">⏳ 正在测试连接...</p>';
    }

    try {
      const res = await fetch(SSY_MODELS_API, {
        method: 'GET',
        headers: buildSSYHeaders(key, false),
      });
      const payload = await readJsonSafely(res);

      if (res.ok) {
        if (resultDiv) resultDiv.innerHTML = '<p class="ssy-test-ok">✅ 连接成功！API Key 有效</p>';
        showToast('API Key 验证通过', 'success');
        await refreshSsyModelOptions(true);
      } else if (res.status === 401 || res.status === 403) {
        if (resultDiv) resultDiv.innerHTML = '<p class="ssy-test-fail">❌ API Key 无效或已过期</p>';
        showToast('API Key 无效', 'error');
      } else {
        const errText = extractSSYError(payload, `服务端返回 ${res.status}`);
        if (resultDiv) resultDiv.innerHTML = `<p class="ssy-test-fail">⚠️ ${escapeHtml(errText)}</p>`;
      }
    } catch (err) {
      if (resultDiv) resultDiv.innerHTML = '<p class="ssy-test-fail">⚠️ 网络错误，无法连接服务器</p>';
      showToast('网络错误', 'error');
    }
  }

  // 获取当前选择的模型 ID
  function getSelectedModelId() {
    const select = document.getElementById('ssy-model-select');
    if (!select) return '';
    if (select.value === '__custom__') {
      const custom = document.getElementById('ssy-custom-model');
      return custom?.value?.trim() || '';
    }
    return String(select.value || '').trim();
  }

  function getSelectedLlmModelMeta() {
    const modelId = getSelectedModelId();
    return getLlmModelById(modelId);
  }

  // 生成配置命令
  function generateConfigCommands() {
    const selectedModelId = getSelectedModelId();
    const modelId = selectedModelId || SSY_DEFAULT_LLM_MODEL;
    const modelMeta = getLlmModelById(modelId);
    const providerApi = modelMeta?.apiType || 'openai-completions';
    const apiKey = document.getElementById('ssy-api-key')?.value?.trim() || getSSYApiKey();
    const cmdText = document.getElementById('ssy-config-cmd-text');
    if (!cmdText) return;

    const lines = [];
    const safeModelId = modelId.replace(/"/g, '\\"');
    if (apiKey) {
      const safeKey = apiKey.replace(/"/g, '\\"');
      lines.push('# 步骤 1: 非交互配置胜算云认证（跳过 daemon 安装，适合内测）');
      lines.push(`openclaw onboard --non-interactive --accept-risk --auth-choice shengsuanyun-api-key --shengsuanyun-api-key "${safeKey}" --no-install-daemon`);
    } else {
      lines.push('# 步骤 1: 非交互配置胜算云认证（请替换 API Key）');
      lines.push('openclaw onboard --non-interactive --accept-risk --auth-choice shengsuanyun-api-key --shengsuanyun-api-key "你的API密钥" --no-install-daemon');
    }
    lines.push('');
    lines.push(`# 步骤 2: 设置默认模型为 ${safeModelId}`);
    lines.push(`openclaw config set agents.defaults.model.primary "shengsuanyun/${safeModelId}"`);
    lines.push('');
    lines.push('# 步骤 3: 确认 provider 端点与接口类型');
    lines.push(`openclaw config set models.providers.shengsuanyun.baseUrl "${SSY_API_BASE}"`);
    lines.push(`openclaw config set models.providers.shengsuanyun.api "${providerApi}"`);

    cmdText.textContent = lines.join('\n');
  }

  function extractTestReply(payload, apiType) {
    if (!payload || typeof payload !== 'object') return '';
    if (apiType === 'openai-responses') {
      if (typeof payload.output_text === 'string') {
        return payload.output_text;
      }
      if (Array.isArray(payload.output)) {
        for (const item of payload.output) {
          if (item && typeof item === 'object' && Array.isArray(item.content)) {
            for (const part of item.content) {
              if (part?.text) return String(part.text);
            }
          }
        }
      }
      return '';
    }

    if (apiType === 'anthropic-messages') {
      if (Array.isArray(payload.content)) {
        const textPart = payload.content.find(part => part?.type === 'text' && typeof part.text === 'string');
        if (textPart) return String(textPart.text);
      }
      return '';
    }

    const content = payload.choices?.[0]?.message?.content;
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
      const textPart = content.find(part => part?.type === 'text' && typeof part.text === 'string');
      if (textPart) return String(textPart.text);
    }
    if (typeof payload.choices?.[0]?.text === 'string') return payload.choices[0].text;
    return '';
  }

  // 测试模型可用性
  async function ssyTestModel() {
    const apiKey = document.getElementById('ssy-api-key')?.value?.trim() || getSSYApiKey();
    if (!apiKey) { showToast('请先输入 API Key', 'error'); return; }

    const modelId = getSelectedModelId();
    if (!modelId) { showToast('请先选择模型', 'error'); return; }

    const modelMeta = getSelectedLlmModelMeta();
    const apiType = modelMeta?.apiType || 'openai-completions';
    const resultDiv = document.getElementById('ssy-model-test-result');
    if (resultDiv) {
      resultDiv.innerHTML = '<p class="ssy-test-loading">⏳ 正在测试模型 ' + escapeHtml(modelId) + ' ...</p>';
    }

    try {
      let endpoint = '/chat/completions';
      let payload = {
        model: modelId,
        messages: [{ role: 'user', content: '你好，请用一句话回复。' }],
        max_tokens: 64,
      };

      if (apiType === 'anthropic-messages') {
        endpoint = '/messages';
        payload = {
          model: modelId,
          max_tokens: 64,
          messages: [{ role: 'user', content: '你好，请用一句话回复。' }],
        };
      } else if (apiType === 'openai-responses') {
        endpoint = '/responses';
        payload = {
          model: modelId,
          input: '你好，请用一句话回复。',
          max_output_tokens: 64,
        };
      }

      const response = await fetch(`${SSY_API_BASE}${endpoint}`, {
        method: 'POST',
        headers: buildSSYHeaders(apiKey, true),
        body: JSON.stringify(payload),
      });
      const data = await readJsonSafely(response);

      if (response.ok) {
        const reply = extractTestReply(data, apiType) || '（模型已响应）';
        const truncated = reply.length > 120 ? `${reply.slice(0, 120)}...` : reply;
        if (resultDiv) {
          resultDiv.innerHTML = `<div class="ssy-test-ok">
            <p>✅ 模型 <strong>${escapeHtml(modelId)}</strong> 可用（${escapeHtml(apiType)}）</p>
            <p class="ssy-model-reply">AI 回复: "${escapeHtml(truncated)}"</p>
          </div>`;
        }
        showToast('模型测试通过！', 'success');
      } else if (response.status === 401 || response.status === 403) {
        if (resultDiv) resultDiv.innerHTML = '<p class="ssy-test-fail">❌ API Key 无效或无权限</p>';
      } else {
        const errText = extractSSYError(data, `模型测试失败 (${response.status})`);
        if (resultDiv) resultDiv.innerHTML = `<p class="ssy-test-fail">❌ ${escapeHtml(errText)}</p>`;
      }
    } catch (err) {
      if (resultDiv) resultDiv.innerHTML = '<p class="ssy-test-fail">⚠️ 网络错误，无法连接服务器</p>';
    }
  }

  // 绑定快速配置事件
  function bindQuickConfigEvents() {
    // 模型选择变更
    const modelSelect = document.getElementById('ssy-model-select');
    const customInput = document.getElementById('ssy-custom-model');
    if (modelSelect) {
      modelSelect.addEventListener('change', () => {
        if (customInput && modelSelect.value === '__custom__') {
          customInput.style.display = 'block';
          customInput.focus();
        } else if (customInput) {
          customInput.style.display = 'none';
        }
        generateConfigCommands();
      });
    }
    if (customInput) {
      customInput.addEventListener('input', generateConfigCommands);
    }

    // 复制命令
    const copyBtn = document.getElementById('ssy-copy-config');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const cmdText = document.getElementById('ssy-config-cmd-text');
        if (cmdText) {
          // 只复制实际命令，去掉注释行
          const commands = cmdText.textContent
            .split('\n')
            .filter(l => l.trim() && !l.trim().startsWith('#'))
            .join('\n');
          copyToClipboard(commands);
        }
      });
    }

    // 测试模型
    const testModelBtn = document.getElementById('ssy-test-model');
    if (testModelBtn) {
      testModelBtn.addEventListener('click', ssyTestModel);
    }

    // 刷新模型
    const refreshBtn = document.getElementById('ssy-refresh-models');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshSsyModelOptions(true).catch(err => {
          showToast(`刷新失败: ${err?.message || '未知错误'}`, 'error');
        });
      });
    }

    // 初始生成命令
    generateConfigCommands();
  }

  // 绑定 AI 创作相关事件
  function bindAiStudioEvents() {
    // 快速配置事件
    bindQuickConfigEvents();

    // 测试连接按钮
    const testBtn = document.getElementById('ssy-test-key');
    if (testBtn) {
      testBtn.addEventListener('click', ssyTestConnection);
    }

    // 保存 API Key（含二次确认：如果已有 Key 则提示覆盖）
    const saveBtn = document.getElementById('ssy-save-key');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const input = document.getElementById('ssy-api-key');
        const newKey = input?.value?.trim();
        if (!newKey) { showToast('请输入 API Key', 'error'); return; }

        const oldKey = getSSYApiKey();
        if (oldKey && oldKey !== newKey) {
          // 已有不同的 Key，二次确认
          if (!confirm('已存在一个 API Key，确定要覆盖吗？')) return;
        }
        setSSYApiKey(newKey);
        showToast('API Key 已保存', 'success');
        // 刷新显示
        switchTab('ai-studio');
      });
    }

    const keyInput = document.getElementById('ssy-api-key');
    if (keyInput) {
      keyInput.addEventListener('input', generateConfigCommands);
    }

    // 工具卡片折叠/展开
    document.querySelectorAll('.ssy-tool-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('ssy-tool-disabled')) {
          return;
        }
        const tool = card.dataset.tool;
        const panel = document.getElementById(`ssy-${tool}-panel`);
        if (panel) {
          card.classList.toggle('expanded');
          panel.classList.toggle('expanded');
        }
      });
    });

    // 图像生成
    const t2iBtn = document.getElementById('ssy-t2i-generate');
    if (t2iBtn) t2iBtn.addEventListener('click', ssyGenerateImage);

    const t2iSelect = document.getElementById('ssy-t2i-model');
    const t2iCustom = document.getElementById('ssy-t2i-custom-model');
    if (t2iSelect && t2iCustom) {
      t2iSelect.addEventListener('change', () => {
        const isCustom = t2iSelect.value === '__custom__';
        t2iCustom.style.display = isCustom ? 'block' : 'none';
        if (!isCustom && t2iSelect.value) {
          const model = getMultimodalModelById(t2iSelect.value);
          if (model) {
            renderDynamicForm(model.inputSchema, 'ssy-t2i-dynamic-form');
          }
        } else {
          document.getElementById('ssy-t2i-dynamic-form').innerHTML = '<p class="ssy-hint">请选择模型后配置参数</p>';
        }
      });
    }

    const t2iDefault = document.getElementById('ssy-t2i-default');
    if (t2iDefault) {
      t2iDefault.addEventListener('change', () => {
        if (t2iDefault.checked) {
          const modelId = getMultimodalModelId('ssy-t2i-model', 'ssy-t2i-custom-model');
          if (modelId) {
            localStorage.setItem('ssy_default_image_model', modelId);
            showToast('已设为默认图像模型', 'success');
          }
        } else {
          localStorage.removeItem('ssy_default_image_model');
        }
      });
    }

    // 视频生成
    const t2vBtn = document.getElementById('ssy-t2v-generate');
    if (t2vBtn) t2vBtn.addEventListener('click', ssyGenerateVideo);

    const t2vSelect = document.getElementById('ssy-t2v-model');
    const t2vCustom = document.getElementById('ssy-t2v-custom-model');
    if (t2vSelect && t2vCustom) {
      t2vSelect.addEventListener('change', () => {
        const isCustom = t2vSelect.value === '__custom__';
        t2vCustom.style.display = isCustom ? 'block' : 'none';
        if (!isCustom && t2vSelect.value) {
          const model = getMultimodalModelById(t2vSelect.value);
          if (model) {
            renderDynamicForm(model.inputSchema, 'ssy-t2v-dynamic-form');
          }
        } else {
          document.getElementById('ssy-t2v-dynamic-form').innerHTML = '<p class="ssy-hint">请选择模型后配置参数</p>';
        }
      });
    }

    const t2vDefault = document.getElementById('ssy-t2v-default');
    if (t2vDefault) {
      t2vDefault.addEventListener('change', () => {
        if (t2vDefault.checked) {
          const modelId = getMultimodalModelId('ssy-t2v-model', 'ssy-t2v-custom-model');
          if (modelId) {
            localStorage.setItem('ssy_default_video_model', modelId);
            showToast('已设为默认视频模型', 'success');
          }
        } else {
          localStorage.removeItem('ssy_default_video_model');
        }
      });
    }

    // 音频生成
    const ttsBtn = document.getElementById('ssy-tts-generate');
    if (ttsBtn) ttsBtn.addEventListener('click', ssyGenerateTTS);

    const ttsSelect = document.getElementById('ssy-tts-model');
    const ttsCustom = document.getElementById('ssy-tts-custom-model');
    if (ttsSelect && ttsCustom) {
      ttsSelect.addEventListener('change', () => {
        const isCustom = ttsSelect.value === '__custom__';
        ttsCustom.style.display = isCustom ? 'block' : 'none';
        if (!isCustom && ttsSelect.value) {
          const model = getMultimodalModelById(ttsSelect.value);
          if (model) {
            renderDynamicForm(model.inputSchema, 'ssy-tts-dynamic-form');
          }
        } else {
          document.getElementById('ssy-tts-dynamic-form').innerHTML = '<p class="ssy-hint">请选择模型后配置参数</p>';
        }
      });
    }

    const ttsDefault = document.getElementById('ssy-tts-default');
    if (ttsDefault) {
      ttsDefault.addEventListener('change', () => {
        if (ttsDefault.checked) {
          const modelId = getMultimodalModelId('ssy-tts-model', 'ssy-tts-custom-model');
          if (modelId) {
            localStorage.setItem('ssy_default_audio_model', modelId);
            showToast('已设为默认音频模型', 'success');
          }
        } else {
          localStorage.removeItem('ssy_default_audio_model');
        }
      });
    }

    refreshSsyModelOptions(false).catch(err => {
      console.warn('[功能面板] 初始化模型失败:', err);
    });
  }

  // 渲染单个插件项 - 折叠式
  function renderPluginItem(plugin, index) {
    const isAvailable = plugin.status === 'available';
    const iconHtml = plugin.icon 
      ? `<img src="${plugin.icon}" alt="" class="plugin-icon-img" onerror="this.parentElement.innerHTML='${ICONS.package}'">`
      : ICONS.package;
    
    return `
      <div class="plugin-item" data-plugin-id="${plugin.id || index}">
        <button class="plugin-header">
          <div class="plugin-icon">${iconHtml}</div>
          <div class="plugin-summary">
            <div class="plugin-name">
              ${plugin.name}
              ${plugin.version ? `<span class="plugin-version">v${plugin.version}</span>` : ''}
            </div>
            <div class="plugin-desc">${plugin.description}</div>
          </div>
          <span class="plugin-status ${plugin.status}">${isAvailable ? '可用' : '即将推出'}</span>
          <svg class="plugin-expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="plugin-details">
          <div class="plugin-details-inner">
            <p class="plugin-full-desc">${plugin.description}</p>
            ${isAvailable && plugin.install ? `
              <div class="plugin-install-section">
                <div class="plugin-install-method">
                  <span class="method-label">${ICONS.message} 对 AI 说：</span>
                  <div class="ai-prompt-box">
                    <span class="ai-prompt-text">${plugin.aiPrompt || '请帮我安装 ' + plugin.name}</span>
                    <button class="copy-btn" data-copy="${plugin.aiPrompt || '请帮我安装 ' + plugin.name}" title="复制到剪贴板">复制</button>
                  </div>
                </div>
                <div class="plugin-install-method">
                  <span class="method-label">${ICONS.terminal} 或手动安装：</span>
                  <code class="plugin-install-cmd" data-copy="${plugin.install}" title="点击复制">
                    ${plugin.install}
                  </code>
                </div>
              </div>
            ` : `
              <p class="plugin-full-desc" style="opacity: 0.6;">此插件正在开发中，敬请期待...</p>
            `}
          </div>
        </div>
      </div>
    `;
  }

  // 渲染插件列表 Tab（带 loading 状态）
  function renderPluginsTab() {
    return `
      <div class="plugins-tab">
        <div class="plugins-header">
          <div class="plugins-header-top">
            <p class="plugins-intro">${ICONS.lightbulb} <strong>安装方式：</strong>复制下方提示语发送给 AI，AI 会帮你自动安装插件。</p>
            <button class="refresh-btn" id="refresh-plugins" title="刷新插件列表">
              ${ICONS.refresh}
            </button>
          </div>
          <p class="plugins-note">${ICONS.warning} 需要先配置 AI 模型（查看「帮助文档」中的配置教程）</p>
        </div>
        <div class="plugins-list" id="plugins-list">
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>正在加载插件列表...</p>
          </div>
        </div>
      </div>
    `;
  }

  // 加载并渲染插件列表
  async function loadPluginsList() {
    const container = document.getElementById('plugins-list');
    if (!container) return;
    
    // 显示 loading
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载插件列表...</p>
      </div>
    `;
    
    // 尝试从 API 获取
    let plugins = await fetchPluginsFromAPI();
    
    // 如果 API 失败，使用本地数据
    if (!plugins || plugins.length === 0) {
      plugins = PANEL_DATA.plugins;
    }
    
    if (!plugins || plugins.length === 0) {
      container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">暂无插件</p>';
      return;
    }
    
    // 渲染插件列表
    container.innerHTML = plugins.map(renderPluginItem).join('');
    
    // 绑定事件
    bindPluginEvents();
  }

  // 绑定插件相关事件
  function bindPluginEvents() {
    // 折叠/展开插件详情
    document.querySelectorAll('.plugin-header').forEach(header => {
      header.addEventListener('click', (e) => {
        // 防止点击复制按钮时触发折叠
        if (e.target.closest('.copy-btn') || e.target.closest('.plugin-install-cmd')) {
          return;
        }
        const item = header.closest('.plugin-item');
        item.classList.toggle('expanded');
      });
    });
    
    // 复制安装命令
    document.querySelectorAll('.plugin-install-cmd').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        copyToClipboard(el.dataset.copy);
      });
    });
    
    // 复制 AI 提示语
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        copyToClipboard(btn.dataset.copy);
      });
    });
  }

  // 渲染更新日志 Tab（带 loading 状态）
  function renderChangelogTab() {
    return `
      <div class="changelog-tab">
        <div class="changelog-header">
          <h3>项目更新日志</h3>
          <button class="refresh-btn" id="refresh-changelog" title="刷新更新日志">
            ${ICONS.refresh}
          </button>
        </div>
        <div class="changelog-list" id="changelog-list">
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>正在加载更新日志...</p>
          </div>
        </div>
      </div>
    `;
  }

  // 格式化时间
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    
    // 小于 1 小时
    if (diff < 60 * 60 * 1000) {
      const mins = Math.floor(diff / 60000);
      return `${mins} 分钟前`;
    }
    // 小于 24 小时
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} 小时前`;
    }
    // 小于 7 天
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / 86400000);
      return `${days} 天前`;
    }
    // 其他
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  // 加载并渲染更新日志
  async function loadChangelogList() {
    const container = document.getElementById('changelog-list');
    if (!container) return;
    
    // 显示 loading
    container.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载更新日志...</p>
      </div>
    `;
    
    const data = await fetchChangelogFromAPI();
    
    if (!data || !data.commits || data.commits.length === 0) {
      container.innerHTML = `
        <div class="changelog-empty">
          <p>暂无更新日志</p>
          <p class="changelog-hint">请访问 <a href="https://github.com/1186258278/OpenClawChineseTranslation" target="_blank">GitHub 仓库</a> 查看完整提交历史</p>
        </div>
      `;
      return;
    }
    
    // 渲染提交列表
    const commitsHtml = data.commits.map(commit => `
      <div class="commit-item">
        <div class="commit-icon">${ICONS.gitCommit}</div>
        <div class="commit-content">
          <div class="commit-message">${escapeHtml(commit.message)}</div>
          <div class="commit-meta">
            ${commit.avatar_url ? `<img src="${commit.avatar_url}" alt="" class="commit-avatar">` : ''}
            <span class="commit-author">${escapeHtml(commit.author)}</span>
            <span class="commit-date">${formatDate(commit.date)}</span>
            ${commit.url && data.is_public ? `<a href="${commit.url}" target="_blank" class="commit-sha">${commit.short_sha}</a>` : `<span class="commit-sha">${commit.short_sha}</span>`}
          </div>
        </div>
      </div>
    `).join('');
    
    container.innerHTML = `
      ${commitsHtml}
      ${data.repo_url ? `
        <div class="changelog-footer">
          <a href="${data.repo_url}" target="_blank" class="view-all-link">
            ${ICONS.github}
            <span>在 GitHub 查看完整历史</span>
          </a>
        </div>
      ` : ''}
    `;
  }

  // HTML 转义
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 渲染关于我们 Tab
  function renderAboutTab() {
    const about = PANEL_DATA.about;
    return `
      <div class="about-section">
        <div class="about-logo">${ICONS.lobster}</div>
        <h3 class="about-title">${about.project}</h3>
        <p class="about-company">${about.company}</p>
        <div class="about-links">
          <a class="about-link" href="${about.website}" target="_blank" rel="noreferrer">
            ${ICONS.globe}
            <span>官网</span>
          </a>
          <a class="about-link" href="${about.github}" target="_blank" rel="noreferrer">
            ${ICONS.github}
            <span>GitHub</span>
          </a>
          <a class="about-link" href="${about.npm}" target="_blank" rel="noreferrer">
            ${ICONS.package}
            <span>npm</span>
          </a>
          <a class="about-link" href="${about.companyWebsite}" target="_blank" rel="noreferrer">
            ${ICONS.globe}
            <span>公司官网</span>
          </a>
          <a class="about-link" href="${about.qqGroup}" target="_blank" rel="noreferrer">
            ${ICONS.message}
            <span>QQ群</span>
          </a>
          <a class="about-link" href="${about.wechatGroup}" target="_blank" rel="noreferrer">
            ${ICONS.message}
            <span>微信群</span>
          </a>
        </div>
        <p class="about-copyright">© 2026 ${about.company} | ${about.license}</p>
      </div>
    `;
  }

  // 显示 Toast 通知
  function showToast(message, type = 'info') {
    let toast = document.querySelector('.panel-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'panel-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `panel-toast ${type}`;
    
    // 触发重排以重新播放动画
    toast.offsetHeight;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // 复制到剪贴板（支持 HTTP 环境的 fallback）
  async function copyToClipboard(text) {
    // 优先尝试现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        showToast('已复制到剪贴板', 'success');
        return;
      } catch (err) {
        // 继续尝试 fallback
      }
    }
    
    // Fallback: 使用 execCommand（支持 HTTP 环境）
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, 99999); // 移动端支持
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (success) {
        showToast('已复制到剪贴板', 'success');
      } else {
        throw new Error('execCommand failed');
      }
    } catch (err) {
      // 最后的 fallback：让用户手动复制
      showToast(`请手动复制: ${text}`, 'info');
    }
  }

  // 执行快捷指令
  async function executeCommand(action) {
    showToast('正在执行...', 'info');
    
    switch (action) {
      case 'restart':
        showToast('请在终端执行: openclaw gateway restart', 'info');
        break;
      case 'clear-cache':
        showToast('请在终端执行: rm -rf ~/.openclaw/cache', 'info');
        break;
      case 'check-update':
        copyToClipboard('npm view @qingchencloud/openclaw-zh version');
        showToast('已复制命令，请粘贴到终端执行:\nnpm view @qingchencloud/openclaw-zh version', 'info');
        break;
      case 'restore-original':
        showToast('请在终端执行:\nnpm uninstall -g @qingchencloud/openclaw-zh\nnpm install -g openclaw', 'info');
        break;
      case 'fix-common':
        copyToClipboard('openclaw doctor --fix --non-interactive --yes');
        showToast('已复制修复命令！请粘贴到终端执行：\nopenclaw doctor --fix --non-interactive --yes', 'success');
        break;
      default:
        showToast('未知操作', 'error');
    }
  }

  // 打开面板
  function openPanel() {
    const overlay = document.getElementById('feature-panel-overlay');
    if (overlay) {
      overlay.classList.add('active');
    }
  }

  // 关闭面板
  function closePanel() {
    const overlay = document.getElementById('feature-panel-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  // 切换 Tab
  function switchTab(tab) {
    activeTab = tab;
    
    // 更新 Tab 按钮状态
    document.querySelectorAll('.panel-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // 更新内容
    const content = document.getElementById('panel-content');
    if (content) {
      content.innerHTML = renderTabContent(tab);
      bindContentEvents();
      
      // 动态加载数据
      if (tab === 'plugins') {
        loadPluginsList();
      } else if (tab === 'changelog') {
        loadChangelogList();
      }
    }
  }

  // 切换 FAQ 展开状态
  function toggleFaq(item) {
    item.classList.toggle('expanded');
  }

  // 绑定内容区事件
  function bindContentEvents() {
    // FAQ 折叠
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleFaq(btn.closest('.faq-item'));
      });
    });

    // 快捷指令
    document.querySelectorAll('.command-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        executeCommand(btn.dataset.action);
      });
    });

    // 刷新插件列表按钮
    const refreshPluginsBtn = document.getElementById('refresh-plugins');
    if (refreshPluginsBtn) {
      refreshPluginsBtn.addEventListener('click', () => {
        // 清除缓存
        apiCache.plugins.timestamp = 0;
        loadPluginsList();
        showToast('正在刷新插件列表...', 'info');
      });
    }

    // 晴辰云快速配置事件
    bindQtcoolSetupEvents();

    // AI 创作工具事件
    bindAiStudioEvents();

    // 刷新更新日志按钮
    const refreshChangelogBtn = document.getElementById('refresh-changelog');
    if (refreshChangelogBtn) {
      refreshChangelogBtn.addEventListener('click', () => {
        // 清除缓存
        apiCache.changelog.timestamp = 0;
        loadChangelogList();
        showToast('正在刷新更新日志...', 'info');
      });
    }
  }

  // 初始化面板
  function initPanel() {
    // 检查是否已经初始化
    if (document.getElementById('feature-panel-overlay')) {
      return;
    }

    // 查找入口按钮位置（TopBar 健康状态旁边）
    const topbarStatus = document.querySelector('.topbar-status');
    if (!topbarStatus) {
      // 如果找不到，稍后重试
      setTimeout(initPanel, 1000);
      return;
    }

    // 创建入口按钮
    const trigger = document.createElement('button');
    trigger.className = 'panel-trigger';
    trigger.title = '功能面板';
    trigger.setAttribute('aria-label', '打开功能面板');
    trigger.innerHTML = ICONS.gear;
    trigger.addEventListener('click', openPanel);

    // 插入到 topbar-status 开头
    topbarStatus.insertBefore(trigger, topbarStatus.firstChild);

    // 创建面板
    const panelContainer = document.createElement('div');
    panelContainer.innerHTML = createPanelHTML();
    document.body.appendChild(panelContainer.firstElementChild);

    // 绑定事件
    document.getElementById('panel-close').addEventListener('click', closePanel);
    
    // 点击遮罩关闭
    document.getElementById('feature-panel-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'feature-panel-overlay') {
        closePanel();
      }
    });

    // ESC 键关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePanel();
      }
    });

    // Tab 切换
    document.querySelectorAll('.panel-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
      });
    });

    // 绑定内容区事件
    bindContentEvents();

    console.log('[OpenClaw 汉化版] 功能面板已加载');
  }

  // 全局标记，防止重复初始化
  let panelInitialized = false;
  let observer = null;

  // 带防抖的初始化包装器
  let initTimeout = null;
  function debouncedInit() {
    if (panelInitialized) return;
    if (initTimeout) clearTimeout(initTimeout);
    initTimeout = setTimeout(() => {
      if (!panelInitialized && !document.querySelector('.panel-trigger') && document.querySelector('.topbar-status')) {
        initPanel();
        panelInitialized = true;
        // 初始化成功后断开 observer
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    }, 100);
  }

  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debouncedInit);
  } else {
    // DOM 已加载，但可能 Dashboard 还没渲染完成
    setTimeout(debouncedInit, 500);
  }

  // 如果 Dashboard 是 SPA，监听路由变化后重新初始化
  // 只在未初始化时创建 observer
  if (!panelInitialized && !observer) {
    observer = new MutationObserver((mutations) => {
      debouncedInit();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

})();
