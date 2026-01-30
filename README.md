# OpenClaw 汉化发行版

[![Release](https://img.shields.io/github/v/release/1186258278/OpenClawChineseTranslation?label=稳定版)](https://github.com/1186258278/OpenClawChineseTranslation/releases)
[![npm](https://img.shields.io/npm/v/@qingchencloud/openclaw-zh?label=npm)](https://www.npmjs.com/package/@qingchencloud/openclaw-zh)
[![Platform](https://img.shields.io/badge/平台-Windows%20|%20macOS%20|%20Linux-blue)](https://github.com/1186258278/OpenClawChineseTranslation/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> 🦞 **OpenClaw 汉化发行版** | ⚡️ **每小时自动同步官方更新** | 全自动构建发布
>
> 🔥 **访问官方网站**：https://openclaw.qt.cool/

---

## 🦞 什么是 OpenClaw？

[OpenClaw](https://openclaw.ai/) 是由 Peter Steinberger ([@steipete](https://twitter.com/steipete)) 创建的**开源个人 AI 助手平台**，在 GitHub 上拥有超过 **100,000+ Stars**。

### 核心特性

| 特性 | 说明 |
|------|------|
| 🖥️ **运行在你的机器上** | Mac、Windows 或 Linux，数据始终在本地，隐私优先 |
| 💬 **任意聊天应用** | WhatsApp、Telegram、Discord、Slack、Signal、iMessage 都能用 |
| 🧠 **持久记忆** | 记住你的偏好、上下文，成为专属于你的 AI |
| 🌐 **浏览器控制** | 自动浏览网页、填写表单、提取数据 |
| ⚡ **完整系统访问** | 读写文件、运行脚本、执行命令 |
| 🔌 **技能插件系统** | 社区技能扩展，甚至可以自己编写新技能 |

### 它能做什么？

> *"清理你的收件箱、发送邮件、管理日历、办理航班值机……全部通过你常用的聊天应用完成。"*

正如用户评价：

- *"这是我第一次感觉自己活在未来。"* — @davemorin
- *"一切 Siri 本该成为的样子，而且远不止如此。"* — @crossiBuilds
- *"它正在运行我的公司。"* — @therno
- *"开源构建了一个比 Apple（3.6万亿美元公司）睡了多年的 Siri 更好的版本。"* — @Hesamation

---

## ⚡ 一键安装汉化版

### Windows (PowerShell)

```powershell
powershell -c "irm https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/install.ps1 | iex"
```

### Linux / macOS

```bash
curl -fsSL https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/install.sh | bash
```

> 💡 使用 jsDelivr CDN 加速，解决国内网络问题

---

## 📦 其他安装方式

### 方式 1: npm 安装

```bash
npm install -g @qingchencloud/openclaw-zh@latest
```

### 方式 2: 手动下载

访问 [Releases 页面](https://github.com/1186258278/OpenClawChineseTranslation/releases) 下载最新版本。

---

## 🚀 快速开始

安装完成后：

```bash
# 启动初始化向导（全中文界面）
openclaw onboard

# 安装后台守护进程
openclaw onboard --install-daemon
```

首次运行会引导你完成：
1. 选择 AI 模型提供商（Claude、GPT、本地模型等）
2. 配置 API 密钥
3. 设置聊天通道（WhatsApp、Telegram 等）
4. 创建你的 AI 助手人格

### 常用命令

```bash
openclaw                    # 启动 OpenClaw
openclaw onboard            # 初始化向导
openclaw config             # 查看/修改配置
openclaw skills             # 管理技能
openclaw --help             # 查看帮助
```

---

## ✨ 汉化内容

我们汉化了 OpenClaw 的核心交互界面：

| 模块 | 说明 | 状态 |
|------|------|------|
| CLI 横幅 | 启动画面、标语 | ✅ |
| 初始化向导 | 完整的 onboard 流程 | ✅ |
| 安全提示 | 权限警告、确认对话框 | ✅ |
| 认证配置 | API 密钥、模型选择提示 | ✅ |
| 帮助信息 | 命令帮助、错误提示 | ✅ |

**注意**：与 AI 的对话内容取决于你使用的模型，不在汉化范围内。

---

## 🔄 自动同步更新

- **每小时** 检测 OpenClaw 官方仓库更新
- **自动** 应用汉化、构建、测试
- **同时发布** npm 包 + GitHub Releases

版本格式：`{官方版本}-zh.{日期}`，如 `2026.1.29-zh.20260130`

---

## 🛠️ 开发者 / 贡献者指南

如果你想参与翻译或本地开发：

```bash
# 1. 克隆本项目
git clone https://github.com/1186258278/OpenClawChineseTranslation.git
cd OpenClawChineseTranslation

# 2. 克隆上游 OpenClaw 源码
git clone https://github.com/openclaw/openclaw.git openclaw

# 3. 使用汉化 CLI 工具
npm run cli -- status           # 查看状态
npm run cli -- apply --dry-run  # 预览汉化（不修改）
npm run cli -- apply            # 应用汉化
npm run cli -- verify           # 验证结果
npm run cli -- restore          # 恢复原版
```

### 项目结构

```
OpenClawChineseTranslation/
├── cli/                    # 汉化 CLI 工具
│   ├── index.mjs           # 入口
│   ├── commands/           # 命令实现
│   └── utils/              # 工具函数
├── translations/           # 翻译配置（JSON 格式）
│   ├── config.json         # 主配置
│   ├── cli/                # CLI 界面翻译
│   ├── wizard/             # 向导翻译
│   └── commands/           # 命令翻译
├── docs/                   # 文档
├── .github/workflows/      # 自动化工作流
├── install.sh              # Linux/macOS 安装脚本
└── install.ps1             # Windows 安装脚本
```

### 添加新翻译

1. 在 `translations/` 目录下创建或编辑 JSON 文件
2. 运行 `npm run cli -- apply --dry-run` 预览
3. 运行 `npm run cli -- verify` 验证
4. 提交 PR

详见 [贡献指南](docs/CONTRIBUTING.md) 和 [翻译规范](docs/TRANSLATION_GUIDE.md)

---

## ❓ 常见问题

### Q: 安装后运行还是英文？

先卸载原版，再安装汉化版：

```bash
npm uninstall -g openclaw
npm install -g @qingchencloud/openclaw-zh@latest
```

### Q: 如何更新到最新版？

```bash
npm update -g @qingchencloud/openclaw-zh
```

### Q: 需要什么环境？

- Node.js >= 22.12.0
- 网络连接（用于 API 调用）

### Q: 与 AI 对话是中文吗？

对话语言取决于你使用的 AI 模型，与本汉化项目无关。Claude、GPT 等模型都支持中文对话。

### Q: 如何切换回原版？

```bash
npm uninstall -g @qingchencloud/openclaw-zh
npm install -g openclaw
```

---

## 🔗 相关链接

| 链接 | 说明 |
|------|------|
| [OpenClaw 官网](https://openclaw.ai/) | 官方网站 |
| [OpenClaw GitHub](https://github.com/openclaw/openclaw) | 上游仓库 |
| [OpenClaw Discord](https://discord.gg/openclaw) | 官方社区 |
| [ClawHub](https://clawhub.dev/) | 技能市场 |

---

## 🤝 参与贡献

我们欢迎各种形式的贡献：

- 🐛 [报告问题](https://github.com/1186258278/OpenClawChineseTranslation/issues)
- 💡 [提交建议](https://github.com/1186258278/OpenClawChineseTranslation/issues)
- 📝 [改进翻译](docs/CONTRIBUTING.md)
- ⭐ 给项目点个 Star

---

## 📜 许可证

本项目基于 [MIT License](LICENSE) 开源。

OpenClaw 原项目由 [Peter Steinberger](https://twitter.com/steipete) 创建，版权归原作者所有。

---

## 🏢 关于我们

**武汉晴辰天下网络科技有限公司** 出品

| | |
|---|---|
| 🌐 官网 | https://qingchencloud.com/ |
| 🔗 导航 | https://qt.cool/ |
| 📧 联系 | 通过官网联系我们 |

主营业务：程序定制、软件开发等

© 武汉晴辰天下网络科技有限公司 | [鄂ICP备2025164966号](https://beian.miit.gov.cn/)
