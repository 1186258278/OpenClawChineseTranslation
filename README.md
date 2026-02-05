# OpenClaw 汉化发行版

[![Release](https://img.shields.io/github/v/release/1186258278/OpenClawChineseTranslation?label=稳定版)](https://github.com/1186258278/OpenClawChineseTranslation/releases)
[![npm](https://img.shields.io/npm/v/@qingchencloud/openclaw-zh?label=npm)](https://www.npmjs.com/package/@qingchencloud/openclaw-zh)
[![Nightly Build](https://github.com/1186258278/OpenClawChineseTranslation/actions/workflows/nightly.yml/badge.svg)](https://github.com/1186258278/OpenClawChineseTranslation/actions/workflows/nightly.yml)
[![Test Scripts](https://github.com/1186258278/OpenClawChineseTranslation/actions/workflows/test-scripts.yml/badge.svg)](https://github.com/1186258278/OpenClawChineseTranslation/actions/workflows/test-scripts.yml)
[![Platform](https://img.shields.io/badge/平台-Windows%20|%20macOS%20|%20Linux-blue)](https://github.com/1186258278/OpenClawChineseTranslation/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

<table>
<tr>
<td>

### 🔄 实时同步官方更新

| 特性 | 说明 |
|:---:|:---|
| ⏰ **每小时同步** | CI/CD 自动从上游 [OpenClaw](https://github.com/openclaw/openclaw) 拉取最新代码 |
| 🚀 **自动构建发布** | 同步后立即构建 npm 包 + Docker 镜像，无需等待 |
| 📦 **双版本可选** | `nightly`（最新功能）/ `stable`（稳定版） |

> 💡 **延迟 < 1 小时**：官方发布新功能后，汉化版最快 1 小时内可用！

</td>
</tr>
</table>

<p align="center">
  <a href="https://openclaw.qt.cool/"><img src="https://img.shields.io/badge/🔥_官方网站-openclaw.qt.cool-dc2626?style=for-the-badge" alt="官方网站"></a>
  &nbsp;&nbsp;
  <a href="https://1186258278.github.io/OpenClawChineseTranslation/"><img src="https://img.shields.io/badge/📦_GitHub_Pages-备用入口-333?style=for-the-badge" alt="GitHub Pages"></a>
</p>

---

<a id="nav"></a>
## 📑 快速导航

| 🚀 快速上手 | 📦 部署方式 | 🔧 使用维护 | 🔌 插件扩展 | 💡 帮助 |
|:---:|:---:|:---:|:---:|:---:|
| [什么是 OpenClaw](#intro) | [一键安装](#install) | [快速开始](#start) | [插件市场](#plugins) | [常见问题](#faq) |
| [汉化效果预览](#preview) | [npm 安装](#npm) | [更新升级](#upgrade) | [安装插件](#plugin-install) | [参与贡献](#contribute) |
| [汉化内容](#content) | [Docker 部署](#docker) | [手动汉化安装](#manual) | [可用插件](#plugin-list) | [关于我们](#about) |

---

<a id="intro"></a>
## 🦞 什么是 OpenClaw？ <sub>[↑ 返回目录](#nav)</sub>

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

<a id="preview"></a>
## 📸 汉化效果预览 <sub>[↑ 返回目录](#nav)</sub>

<p align="center">
  <img src="docs/image/5.png" alt="概览仪表板" width="100%">
  <br>
  <em>📊 概览仪表板 - 网关状态、实例监控、快捷操作一目了然</em>
</p>

<details>
<summary><b>🖼️ 查看更多截图</b></summary>

<p align="center">
  <img src="docs/image/1.png" alt="对话界面" width="100%">
  <br>
  <em>💬 对话界面 - 与 AI 助手实时交互</em>
</p>

<p align="center">
  <img src="docs/image/4.png" alt="渠道管理" width="100%">
  <br>
  <em>📱 渠道管理 - WhatsApp、Telegram、Discord 等全平台支持</em>
</p>

<p align="center">
  <img src="docs/image/2.png" alt="配置中心" width="100%">
  <br>
  <em>⚙️ 配置中心 - 30+ 配置项完整汉化</em>
</p>

<p align="center">
  <img src="docs/image/3.png" alt="节点配置" width="100%">
  <br>
  <em>🖥️ 节点配置 - 执行审批、安全策略管理</em>
</p>

<p align="center">
  <img src="docs/image/6.png" alt="技能插件" width="100%">
  <br>
  <em>🔌 技能插件 - 1Password、Apple Notes 等丰富扩展</em>
</p>

</details>

---

<a id="install"></a>
## ⚡ 一键安装汉化版 <sub>[↑ 返回目录](#nav)</sub>

### Windows (PowerShell)

```powershell
# 下载并执行安装脚本（注意：需要 UTF-8 编码）
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/install.ps1" -OutFile "install.ps1" -Encoding UTF8; powershell -ExecutionPolicy Bypass -File ".\install.ps1"
```

> **如果遇到中文乱码问题**，请使用以下命令：
> ```powershell
> # 方法1：直接通过 npm 安装（推荐）
> npm install -g @qingchencloud/openclaw-zh@latest
> 
> # 方法2：使用 PowerShell 7+（支持 UTF-8）
> pwsh -Command "irm https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/install.ps1 | iex"
> ```

### Linux / macOS

```bash
# 下载并执行安装脚本
curl -fsSL -o install.sh https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/install.sh && bash install.sh
```

> 💡 使用 jsDelivr CDN 加速 | 🔒 [查看脚本源码](https://github.com/1186258278/OpenClawChineseTranslation/blob/main/install.sh)

---

<a id="npm"></a>
## 📦 其他安装方式 <sub>[↑ 返回目录](#nav)</sub>

### 版本选择

我们提供两个版本源，根据需求选择：

| 版本 | npm 标签 | 更新频率 | 适用场景 |
|------|----------|----------|----------|
| **稳定版** | `@latest` | 手动发布 | 生产环境，经过测试，推荐使用 |
| **最新版** | `@nightly` | 每小时自动 | 测试新功能，追踪上游最新代码 |

### 方式 1: npm / pnpm / yarn 安装

```bash
# npm 安装（推荐）
npm install -g @qingchencloud/openclaw-zh@latest      # 稳定版
npm install -g @qingchencloud/openclaw-zh@nightly     # 最新版

# pnpm 安装
pnpm add -g @qingchencloud/openclaw-zh@latest         # 稳定版
pnpm add -g @qingchencloud/openclaw-zh@nightly        # 最新版

# yarn 安装
yarn global add @qingchencloud/openclaw-zh@latest     # 稳定版
yarn global add @qingchencloud/openclaw-zh@nightly    # 最新版
```

> 💡 我们发布的是标准 npm 包，**npm / pnpm / yarn 都可以安装**，选择你习惯的包管理器即可。

### 方式 2: 手动下载

访问 [Releases 页面](https://github.com/1186258278/OpenClawChineseTranslation/releases) 下载最新版本。

### 方式 3: Docker 部署

```bash
# 1. 初始化配置（首次运行）
docker run --rm -v openclaw-data:/root/.openclaw ghcr.io/1186258278/openclaw-zh:nightly openclaw setup
docker run --rm -v openclaw-data:/root/.openclaw ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.mode local

# 2. 启动容器
docker run -d --name openclaw -p 18789:18789 -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw gateway run

# 访问 Dashboard: http://localhost:18789
```

> 📖 详细 Docker 配置请参考下方 [Docker 部署指南](#-docker-部署指南)

---

<a id="start"></a>
## 🚀 快速开始 <sub>[↑ 返回目录](#nav)</sub>

安装完成后：

> 💡 **自动初始化**: 使用一键安装脚本时，安装完成后会自动尝试运行初始化配置。
> 如需跳过，设置环境变量 `OPENCLAW_SKIP_SETUP=1` 即可。

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

<a id="upgrade"></a>
## 🔄 更新升级 <sub>[↑ 返回目录](#nav)</sub>

已安装的 OpenClaw 汉化版如何升级？根据你的安装方式选择对应方法：

### npm 安装用户

```bash
# 升级到最新稳定版
npm update -g @qingchencloud/openclaw-zh

# 或者重新安装指定版本
npm install -g @qingchencloud/openclaw-zh@latest    # 稳定版
npm install -g @qingchencloud/openclaw-zh@nightly   # 最新版
```

> 💡 **查看当前版本**: `openclaw --version`

### Docker 用户

```bash
# 1. 拉取最新镜像
docker pull ghcr.io/1186258278/openclaw-zh:nightly   # 最新版
# 或
docker pull ghcr.io/1186258278/openclaw-zh:latest    # 稳定版

# 2. 停止并删除旧容器
docker stop openclaw && docker rm openclaw

# 3. 用新镜像启动（配置会自动保留，因为存储在数据卷中）
docker run -d --name openclaw -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw gateway run
```

> 💡 **数据不会丢失**: 配置和数据存储在 `openclaw-data` 卷中，升级镜像不会影响。

### Docker Compose 用户

```bash
# 1. 拉取最新镜像
docker compose pull

# 2. 重新创建容器
docker compose up -d
```

### 一键安装脚本用户

直接重新运行安装脚本即可，会自动升级到最新版：

```bash
# Linux/macOS
curl -fsSL https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/install.sh | bash

# Windows PowerShell
npm install -g @qingchencloud/openclaw-zh@latest
```

### 版本对比

| 版本类型 | npm 标签 | Docker 标签 | 更新频率 | 推荐场景 |
|----------|----------|-------------|----------|----------|
| **稳定版** | `@latest` | `:latest` | 手动发布 | 生产环境 |
| **最新版** | `@nightly` | `:nightly` | 每小时自动 | 体验新功能 |

---

<a id="content"></a>
## ✨ 汉化内容 <sub>[↑ 返回目录](#nav)</sub>

我们提供了**深度汉化**，覆盖 **CLI 命令行** + **Dashboard 网页控制台** 两大核心界面。

### 📊 汉化统计

| 指标 | 数量 |
|------|------|
| 📁 翻译文件 | **35+** 个 |
| 📝 翻译规则 | **970+** 条 |
| 🎯 覆盖模块 | **45+** 个 |

### 🖥️ CLI 命令行 (14 个模块)

| 分类 | 模块 | 说明 |
|------|------|------|
| **CLI** | 启动横幅 | 标题、版本信息、有趣的标语口号 |
| **CLI** | 帮助信息 | 命令说明、参数提示、汉化官网链接 |
| **向导** | 初始化引导 | 完整的 onboard 流程 |
| **向导** | 安全警告 | 权限警告、风险确认对话框 |
| **向导** | 完成提示 | 汉化版官网引导 |
| **TUI** | 等待动画 | 有趣的中文等待短语（如"神游八方中"） |
| **TUI** | 斜杠命令 | /help, /status 等命令说明 |
| **命令** | status | 状态概览、安全审计、通道、会话 |
| **命令** | update | 更新进度、结果显示 |
| **命令** | skills | 技能列表、详情、安装选项 |
| **命令** | channels | 聊天通道、认证提供商列表 |
| **命令** | doctor | 诊断命令、安全审计警告 |
| **命令** | uninstall | 卸载提示、清理选项 |
| **命令** | 认证配置 | API 密钥、模型选择提示 |

### 🌐 Dashboard 网页控制台 (31 个模块)

| 分类 | 模块 | 说明 |
|------|------|------|
| **主布局** | 顶栏/侧栏 | 品牌标识、健康状态、导航菜单 |
| **主布局** | 资源链接 | **汉化官网**、GitHub 仓库链接 |
| **导航** | 顶部标签页 | 对话、概览、渠道、实例、会话等 |
| **对话** | 聊天界面 | 消息输入、发送按钮、工具卡片 |
| **概览** | 系统状态 | 运行时间、活跃会话、模型列表 |
| **会话** | 会话管理 | 会话列表、详情、存档操作 |
| **渠道** | 消息渠道 | WhatsApp、Telegram、Discord 等全部渠道卡片 |
| **技能** | 技能管理 | 已安装、可用技能、详情页 |
| **节点** | 节点管理 | 本地/远程节点、浏览器配置、审批策略 |
| **配置** | 配置页面 | **31 个配置分区**完整翻译 |
| **配置** | 表单元素 | 所有字段标签、帮助文本、占位符 |
| **配置** | 动态标签 | 300+ 动态生成的标签翻译映射 |
| **定时任务** | 调度器 | 任务列表、运行状态、操作按钮 |
| **日志** | 日志查看 | 筛选、搜索、导出功能 |
| **调试** | 调试工具 | 快照、手动 RPC、事件日志 |
| **实例** | 实例管理 | 已连接实例、存在信标 |

### 📋 配置页面完整翻译 (31 个分区)

| 分区 | 中文名 | 分区 | 中文名 |
|------|--------|------|--------|
| env | 环境 | update | 更新 |
| agents | 代理 | auth | 身份验证 |
| channels | 渠道 | messages | 消息 |
| commands | 命令 | hooks | 钩子 |
| skills | 技能 | tools | 工具 |
| gateway | 网关 | wizard | 设置向导 |
| meta | 元数据 | diagnostics | 诊断 |
| logging | 日志 | browser | 浏览器 |
| ui | 界面 | models | 模型 |
| nodeHost | 节点主机 | bindings | 绑定 |
| broadcast | 广播 | audio | 音频 |
| media | 媒体 | approvals | 审批 |
| session | 会话 | cron | 定时任务 |
| web | 网页 | discovery | 发现 |
| canvasHost | 画布主机 | talk | 语音 |
| plugins | 插件 | | |

**注意**：与 AI 的对话内容取决于你使用的模型，不在汉化范围内。

---

<a id="sync"></a>
## 🔄 自动同步更新 <sub>[↑ 返回目录](#nav)</sub>

- **每小时** 检测 OpenClaw 官方仓库更新
- **自动** 应用汉化、构建、测试
- **同时发布** npm 包 + GitHub Releases

版本格式：`{官方版本}-zh.{日期}`，如 `2026.1.29-zh.20260130`

---

<a id="plugins"></a>
## 🔌 插件扩展 <sub>[↑ 返回目录](#nav)</sub>

OpenClaw 汉化版支持通过 npm 插件扩展功能。我们提供了官方插件，让你的 AI 助手更加强大！

### 插件市场

访问我们的插件市场查看所有可用插件：

<p align="center">
  <a href="https://openclaw.qt.cool/"><img src="https://img.shields.io/badge/🛒_插件市场-openclaw.qt.cool-dc2626?style=for-the-badge" alt="插件市场"></a>
</p>

<a id="plugin-install"></a>
### 如何安装插件

```bash
# 全局安装插件
npm install -g @qingchencloud/插件包名

# 例如安装更新检测插件
npm install -g @qingchencloud/openclaw-updater
```

安装后重启 OpenClaw 即可使用插件提供的功能。

<a id="plugin-list"></a>
### 可用插件列表

| 插件 | 功能 | 安装命令 |
|------|------|----------|
| **更新检测** | 自动检测汉化版更新，一键升级 | `npm i -g @qingchencloud/openclaw-updater` |

> 💡 更多插件正在开发中，敬请期待！访问 [插件市场](https://openclaw.qt.cool/) 获取最新插件。

### 更新检测插件

安装后，插件会：
- 启动时自动检测是否有新版本
- 提供 `/update` 命令手动检查更新
- 提供 `/version` 命令查看当前版本

```bash
# 安装
npm install -g @qingchencloud/openclaw-updater

# 使用
# 启动 OpenClaw 后，插件会自动检测更新
# 或使用命令 /update 手动检查
```

---

<a id="docker"></a>
## 🐳 Docker 部署指南 <sub>[↑ 返回目录](#nav)</sub>

### 方式 1：一键部署脚本（推荐）

自动完成初始化、配置远程访问、启动容器：

```bash
# Linux / macOS
curl -fsSL https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/docker-deploy.sh | bash

# Windows PowerShell
irm https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/docker-deploy.ps1 | iex
```

### 方式 2：快速启动（本地访问）

适用于在本机运行并通过 `localhost` 访问：

```bash
# 1. 初始化配置（首次运行）
docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw setup

docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.mode local

# 2. 启动容器
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly \
  openclaw gateway run
```

访问：`http://localhost:18789`

### 方式 3：服务器部署（远程访问）

部署到服务器并从其他设备访问时，需要额外配置。

**手动配置步骤：**

```bash
# 1. 创建数据卷
docker volume create openclaw-data

# 2. 初始化配置
docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw setup

# 3. 配置远程访问参数
docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.mode local

docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.bind lan

# 4. 设置访问令牌（推荐）
docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.auth.token your-secure-token

# 5. 启动容器
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  --restart unless-stopped \
  ghcr.io/1186258278/openclaw-zh:nightly \
  openclaw gateway run
```

访问：`http://服务器IP:18789` → 在 Dashboard 输入 token 连接

### 远程访问注意事项 ⚠️ 重要

通过 HTTP 从非 localhost 访问时，浏览器会阻止设备身份验证（Web Crypto API 需要 secure context）。

**✅ 推荐解决方案：设置 Token 认证**

```bash
# 1. 设置访问令牌（在服务器上执行）
docker exec openclaw openclaw config set gateway.auth.token YOUR_TOKEN
docker restart openclaw

# 2. 在浏览器访问远程地址
http://服务器IP:18789/overview

# 3. 在「网关令牌」输入框填入 YOUR_TOKEN，点击「连接」
```

> **💡 说明**：设置 `gateway.auth.token` 后，即使通过远程 HTTP 访问，只要在 Dashboard 输入正确的 token 就能连接成功。

**其他解决方案对比：**

| 方案 | 说明 | 适用场景 |
|------|------|----------|
| **设置 Token** ⭐ | 设置 `gateway.auth.token`，Dashboard 输入 token | 内网（最简单） |
| **SSH 端口转发** | `ssh -L 18789:127.0.0.1:18789 user@server` | 更安全 |
| **Tailscale Serve** | 自动 HTTPS 访问 | 跨网络访问 |
| **Nginx + HTTPS** | 配置 SSL 证书反向代理 | 生产环境 |

> **⚠️ 注意**：`gateway.controlUi.allowInsecureAuth: true` 配置存在已知上游 Bug（[#1679](https://github.com/clawdbot/clawdbot/issues/1679)），单独使用不起作用，必须配合 `gateway.auth.token` 使用。

### 反向代理配置（Nginx + HTTPS）

如果使用 Nginx 等反向代理，需要额外配置 `gateway.trustedProxies`，否则会提示 `Proxy headers detected from untrusted address`。

**1. 配置 OpenClaw 信任代理地址**

```bash
# Docker 环境
docker exec openclaw openclaw config set gateway.trustedProxies '["127.0.0.1", "::1"]'
docker restart openclaw

# npm 安装环境
openclaw config set gateway.trustedProxies '["127.0.0.1", "::1"]'
openclaw gateway restart
```

> 💡 如果 Nginx 和 OpenClaw 在不同服务器，将 `127.0.0.1` 替换为 Nginx 服务器的 IP 地址。

**2. Nginx 配置示例**

```nginx
# /etc/nginx/sites-available/openclaw
server {
    listen 443 ssl http2;
    server_name oc.example.com;
    
    # SSL 证书配置（推荐使用 Let's Encrypt）
    ssl_certificate /etc/letsencrypt/live/oc.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/oc.example.com/privkey.pem;
    
    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;
        
        # WebSocket 支持（必须）
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 转发真实客户端信息
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时配置
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name oc.example.com;
    return 301 https://$server_name$request_uri;
}
```

**3. 启用配置**

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/openclaw /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

### Docker 常见错误排查

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| `Gateway auth is set to token, but no token is configured` | Gateway 检测到需要 token 认证但未配置 | 设置 token：`docker exec openclaw openclaw config set gateway.auth.token YOUR_TOKEN` |
| `Missing config. Run openclaw setup` | 未初始化配置 | 运行初始化：`docker exec openclaw openclaw setup` |
| `control ui requires HTTPS or localhost` | HTTP 远程访问被浏览器安全策略阻止 | 使用 Token 认证或配置 HTTPS 反向代理 |
| `Proxy headers detected from untrusted address` | 反向代理地址未添加到信任列表 | 设置信任代理：`docker exec openclaw openclaw config set gateway.trustedProxies '["127.0.0.1"]'` |
| `pairing required` | 新设备需要配对授权 | 运行 `docker exec openclaw openclaw devices list` 然后 `devices approve <id>` |
| 容器启动后立即退出 | 缺少必要配置 | 查看日志 `docker logs openclaw`，按提示初始化配置 |
| `EACCES: permission denied` | 数据卷权限问题 | 确保使用 named volume 而非 bind mount |

### 使用 Docker Compose

项目提供了开箱即用的 `docker-compose.yml`：

```bash
# 下载配置文件
curl -fsSL https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/docker-compose.yml -o docker-compose.yml

# 启动（首次会自动初始化）
docker-compose up -d
```

或手动创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  openclaw:
    image: ghcr.io/1186258278/openclaw-zh:nightly
    container_name: openclaw
    ports:
      - "18789:18789"
    volumes:
      - openclaw-data:/root/.openclaw
    environment:
      - OPENCLAW_GATEWAY_TOKEN=your-secure-token  # 设置访问令牌
    restart: unless-stopped
    # 远程访问时使用以下命令（需先手动初始化配置）
    # command: openclaw gateway run

volumes:
  openclaw-data:
```

### 自行构建 Docker 镜像

如果需要自定义或使用最新代码：

```bash
# 1. 克隆汉化项目
git clone https://github.com/1186258278/OpenClawChineseTranslation.git
cd OpenClawChineseTranslation

# 2. 克隆上游源码
git clone https://github.com/openclaw/openclaw.git openclaw

# 3. 应用汉化
npm run cli -- apply

# 4. 构建 Docker 镜像
cd openclaw
docker build -t openclaw-zh:local .

# 5. 运行
docker run -d --name openclaw -p 18789:18789 -v openclaw-data:/root/.openclaw openclaw-zh:local
```

### 常用 Docker 命令

```bash
# 查看日志
docker logs -f openclaw

# 停止容器
docker stop openclaw

# 重启容器
docker restart openclaw

# 进入容器
docker exec -it openclaw sh

# 删除容器
docker stop openclaw && docker rm openclaw

# 查看配置
docker run --rm -v openclaw-data:/root/.openclaw alpine cat /root/.openclaw/openclaw.json
```

### Docker 空间清理

Docker 镜像和容器会占用大量磁盘空间，建议定期清理：

```bash
# 查看 Docker 空间占用
docker system df

# 清理已停止的容器
docker container prune -f

# 清理未使用的镜像
docker image prune -f

# 清理构建缓存
docker builder prune -f

# 一键清理所有未使用资源（镜像、容器、网络、缓存）
docker system prune -a

# 连同未使用的数据卷一起清理（⚠️ 会删除数据，谨慎使用）
docker system prune -a --volumes
```

> 💡 **提示**：OpenClaw 镜像约 4GB，如果有多个旧版本镜像堆积，建议用 `docker image prune -a` 清理。

---

<a id="manual"></a>
## 🔧 手动汉化安装 <sub>[↑ 返回目录](#nav)</sub>

适用于想要自定义翻译、测试最新代码或参与贡献的用户。

### 完整流程

```bash
# 1. 克隆汉化项目
git clone https://github.com/1186258278/OpenClawChineseTranslation.git
cd OpenClawChineseTranslation

# 2. 克隆上游 OpenClaw 源码
git clone https://github.com/openclaw/openclaw.git openclaw

# 3. 查看汉化状态
npm run cli -- status

# 4. 应用汉化补丁
npm run cli -- apply

# 5. 验证汉化结果
npm run cli -- verify

# 6. 构建 OpenClaw
cd openclaw
pnpm install
pnpm run build

# 7. 全局安装
npm install -g .

# 8. 验证安装
openclaw --version
openclaw --help
```

### 汉化 CLI 完整命令

| 命令 | 说明 |
|------|------|
| `npm run cli -- status` | 查看当前汉化状态 |
| `npm run cli -- apply` | 应用汉化补丁 |
| `npm run cli -- apply --dry-run` | 预览汉化（不实际修改） |
| `npm run cli -- apply --verbose` | 详细输出汉化过程 |
| `npm run cli -- verify` | 验证汉化结果 |
| `npm run cli -- restore` | 恢复原版（使用 git checkout） |

### 自定义翻译

1. **找到目标文件**：确定需要翻译的源文件位置

2. **创建翻译规则**：在 `translations/` 对应目录创建 JSON 文件
   ```json
   {
     "file": "src/path/to/file.ts",
     "description": "文件说明",
     "replacements": {
       "\"English Text\"": "\"中文翻译\""
     }
   }
   ```

3. **注册翻译文件**：在 `translations/config.json` 中添加

4. **测试**：
   ```bash
   npm run cli -- apply --dry-run --verbose
   npm run cli -- apply
   npm run cli -- verify
   ```

5. **提交 PR**：欢迎贡献你的翻译！

---

<a id="dev"></a>
## 🛠️ 开发者 / 贡献者指南 <sub>[↑ 返回目录](#nav)</sub>

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
│   └── utils/              # 工具函数（i18n 引擎）
├── translations/           # 翻译配置（JSON 格式）
│   ├── config.json         # 主配置（加载所有翻译文件）
│   ├── cli/                # CLI 界面翻译
│   │   ├── banner.json     # 启动横幅
│   │   ├── tagline.json    # 有趣标语
│   │   └── help.json       # 帮助信息
│   ├── wizard/             # 向导翻译
│   │   ├── onboarding.json # 初始化向导
│   │   ├── security.json   # 安全警告
│   │   └── finalize.json   # 完成提示
│   ├── tui/                # TUI 界面翻译
│   │   ├── waiting.json    # 等待动画
│   │   └── commands.json   # 斜杠命令
│   ├── commands/           # 命令翻译
│   │   ├── status.json     # status 命令
│   │   ├── update.json     # update 命令
│   │   ├── skills.json     # skills 命令
│   │   └── ...             # 更多命令
│   └── dashboard/          # Dashboard UI 翻译 (20+ 文件)
│       ├── navigation.json # 导航菜单
│       ├── app-render.json # 主布局
│       ├── chat.json       # 聊天界面
│       ├── config.json     # 配置页面
│       ├── schema.json     # 配置 schema
│       ├── config-form-*.json  # 表单元素
│       ├── channels-*.json # 各渠道翻译
│       └── ...             # 更多模块
├── docs/                   # 文档
├── .github/workflows/      # 自动化工作流
├── install.sh              # Linux/macOS 安装脚本
└── install.ps1             # Windows 安装脚本
```

### 添加新翻译

1. 在 `translations/` 目录下创建或编辑 JSON 文件
2. 在 `translations/config.json` 中注册新文件
3. 运行 `npm run cli -- apply --dry-run` 预览
4. 运行 `npm run cli -- verify` 验证
5. 提交 PR

详见 [贡献指南](docs/CONTRIBUTING.md) 和 [翻译规范](docs/TRANSLATION_GUIDE.md)

---

<a id="faq"></a>
## ❓ 常见问题 <sub>[↑ 返回目录](#nav)</sub>

> [!WARNING]
> **遇到连接问题？** 如果 Dashboard 显示红色错误提示（如 `gateway token mismatch` 或 `disconnected`），请先查看 [Token 认证问题](#q-dashboard-显示-gateway-token-mismatch-怎么办) 和 [设备配对问题](#q-dashboard-连接显示-pairing-required-怎么办)。

### 常见问题速查

| 问题 | 快速解决 |
|------|----------|
| Dashboard 显示 `token mismatch` | 运行 `openclaw dashboard` 自动打开带 token 的 URL |
| Dashboard 显示 `pairing required` | 运行 `openclaw devices list` 然后 `devices approve <id>` |
| 远程访问连不上 | 设置 `openclaw config set gateway.auth.token 你的密码` |
| 图标不显示 | 更新到最新版: `npm update -g @qingchencloud/openclaw-zh` |

---

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

### Q: 如何彻底卸载？

**Windows (PowerShell):**
```powershell
# 卸载汉化版
npm uninstall -g @qingchencloud/openclaw-zh

# 卸载原版（如果也安装了）
npm uninstall -g openclaw

# 清理配置文件（可选，会删除所有数据）
Remove-Item -Recurse -Force "$env:USERPROFILE\.openclaw"

# 验证卸载
openclaw --version  # 应提示命令不存在
```

**Linux / macOS:**
```bash
# 卸载汉化版
npm uninstall -g @qingchencloud/openclaw-zh

# 卸载原版（如果也安装了）
npm uninstall -g openclaw

# 清理配置文件（可选，会删除所有数据）
rm -rf ~/.openclaw

# 验证卸载
openclaw --version  # 应提示命令不存在
```

> ⚠️ **注意**：`npm uninstall openclaw` 不会卸载汉化版，必须使用完整包名 `@qingchencloud/openclaw-zh`

### Q: Dashboard 如何访问？

启动 OpenClaw 后，访问 `http://localhost:18789` 即可打开网页控制台（全中文界面）。

### Q: Dashboard 显示 `gateway token mismatch` 怎么办？

这是 Token 认证失败。你需要使用 **带 token 的 URL** 访问 Dashboard。

**解决方法（推荐）：**

```bash
# 使用命令自动打开带 token 的 Dashboard
openclaw dashboard

# Docker 环境下，先获取 token URL
docker exec openclaw openclaw dashboard --print-url
# 输出类似：http://localhost:18789?token=abc123...
# 复制这个 URL 到浏览器打开
```

**手动方法：**

1. 查看你的 gateway token：
   ```bash
   openclaw config get gateway.token
   # 或 Docker 环境
   docker exec openclaw openclaw config get gateway.token
   ```

2. 在浏览器 URL 后添加 `?token=你的token`：
   ```
   http://localhost:18789?token=你的token值
   ```

> 💡 **提示**：直接访问 `http://localhost:18789` 不带 token 会导致此错误。推荐始终使用 `openclaw dashboard` 命令打开。

### Q: Dashboard 连接显示 `pairing required` 怎么办？

这是 OpenClaw 的**设备配对安全机制**。每个浏览器首次连接 Gateway 时，需要管理员批准配对请求。

**解决步骤：**

```bash
# 1. 查看待配对的设备列表
docker exec openclaw openclaw devices list --password '你的网关密码'
# 会显示 Pending (待批准) 和 Paired (已配对) 两个表格

# 2. 复制 Pending 表格中的 Request ID，批准配对
docker exec openclaw openclaw devices approve <Request-ID>

# 3. 在 Dashboard 页面点击"连接"按钮，即可成功连接
```

**示例：**

```bash
# 查看设备列表
$ docker exec openclaw openclaw devices list --password 'mytoken123'
Pending (1)
┌──────────────────────────────────────┬─────────────┬──────────┐
│ Request                              │ Device      │ Role     │
├──────────────────────────────────────┼─────────────┼──────────┤
│ 693d5641-e67f-4fa5-a096-25551ac5fe4b │ f1e3aa21... │ operator │
└──────────────────────────────────────┴─────────────┴──────────┘

# 批准配对请求
$ docker exec openclaw openclaw devices approve 693d5641-e67f-4fa5-a096-25551ac5fe4b
Approved f1e3aa21...
```

> 💡 **提示**：刷新页面、换浏览器、清除缓存或使用无痕模式都会产生新的设备 ID，需要重新批准配对。

### Q: Docker 拉取镜像提示 denied？

清理 Docker 登录缓存后重试：

```bash
docker logout ghcr.io
docker pull ghcr.io/1186258278/openclaw-zh:nightly
```

### Q: Docker 容器一直重启？

通常是没有初始化配置。先查看日志：

```bash
docker logs openclaw
```

如果提示 `Missing config` 或 `gateway.mode`，按以下步骤重新配置：

```bash
# 停止并删除容器
docker stop openclaw && docker rm openclaw

# 初始化配置
docker run --rm -v openclaw-data:/root/.openclaw ghcr.io/1186258278/openclaw-zh:nightly openclaw setup
docker run --rm -v openclaw-data:/root/.openclaw ghcr.io/1186258278/openclaw-zh:nightly openclaw config set gateway.mode local

# 重新启动
docker run -d --name openclaw -p 18789:18789 -v openclaw-data:/root/.openclaw --restart unless-stopped ghcr.io/1186258278/openclaw-zh:nightly openclaw gateway run
```

### Q: 远程访问 Dashboard 连不上？

通过 HTTP 远程访问时，需要设置 Token 认证：

```bash
# 在服务器上设置 token
docker exec openclaw openclaw config set gateway.auth.token YOUR_TOKEN
docker restart openclaw
```

然后打开 `http://服务器IP:18789`，在「网关令牌」输入框填入 token，点击「连接」即可。

### Q: npm 安装后内网其他电脑无法访问？

**问题**：在服务器上用 npm 安装 OpenClaw，内网其他电脑访问 `http://服务器IP:18789` 失败。

**原因**：默认情况下 Gateway 只监听 `127.0.0.1`（本机），需要配置为监听所有网络接口。

**解决步骤：**

```bash
# 1. 配置 Gateway 绑定到局域网
openclaw config set gateway.bind lan

# 2. 设置访问令牌（必须，否则内网访问会被拒绝）
openclaw config set gateway.auth.token '你的密码'

# 3. 安装后台守护进程（可选，让 OpenClaw 开机自启）
openclaw onboard --install-daemon

# 4. 重启 Gateway 生效
openclaw gateway restart
```

**访问方式**：`http://服务器IP:18789`，在「网关令牌」输入你设置的密码。

> 💡 **提示**：如果还是无法访问，检查服务器防火墙是否放行 18789 端口：
> ```bash
> # Ubuntu/Debian
> sudo ufw allow 18789
> 
> # CentOS/RHEL
> sudo firewall-cmd --add-port=18789/tcp --permanent
> sudo firewall-cmd --reload
> ```

### Q: Dashboard 显示 `Proxy headers detected from untrusted address`？

这是使用 Nginx 等反向代理时的常见错误，需要配置 OpenClaw 信任代理服务器地址。

**解决方法：**

```bash
# Docker 环境
docker exec openclaw openclaw config set gateway.trustedProxies '["127.0.0.1", "::1"]'
docker restart openclaw

# npm 安装环境
openclaw config set gateway.trustedProxies '["127.0.0.1", "::1"]'
openclaw gateway restart
```

> 💡 详细的 Nginx + HTTPS 反向代理配置，请参考 [Docker 部署指南](#docker) 中的「反向代理配置」章节。

### Q: Dashboard 显示 `control ui requires HTTPS or localhost`？

这是浏览器安全策略限制，Web Crypto API 需要 secure context（HTTPS 或 localhost）。

**解决方案（任选一种）：**

1. **设置 Token 认证**（推荐）
   ```bash
   docker exec openclaw openclaw config set gateway.auth.token YOUR_TOKEN
   docker restart openclaw
   # 然后在 Dashboard 输入 token 连接
   ```

2. **使用 SSH 端口转发**
   ```bash
   ssh -L 18789:127.0.0.1:18789 user@server
   # 然后访问 http://localhost:18789
   ```

3. **配置 HTTPS 反向代理**（生产环境推荐）
   - 参考 [Docker 部署指南](#docker) 中的 Nginx 配置示例

---

<a id="links"></a>
## 🔗 相关链接 <sub>[↑ 返回目录](#nav)</sub>

### 汉化版入口

| 链接 | 说明 |
|------|------|
| 🔥 [openclaw.qt.cool](https://openclaw.qt.cool/) | **汉化版官网**（推荐） |
| 📦 [GitHub Pages](https://1186258278.github.io/OpenClawChineseTranslation/) | 备用下载页 |
| 📚 [npm 包](https://www.npmjs.com/package/@qingchencloud/openclaw-zh) | npm 安装源 |
| 💻 [GitHub 仓库](https://github.com/1186258278/OpenClawChineseTranslation) | 源代码 |

### 上游项目

| 链接 | 说明 |
|------|------|
| [OpenClaw 官网](https://openclaw.ai/) | 原版官方网站 |
| [OpenClaw GitHub](https://github.com/openclaw/openclaw) | 上游仓库 |
| [OpenClaw Discord](https://discord.gg/openclaw) | 官方社区 |
| [ClawHub](https://clawhub.dev/) | 技能市场 |

---

<a id="contribute"></a>
## 🤝 参与贡献 <sub>[↑ 返回目录](#nav)</sub>

我们欢迎各种形式的贡献：

- 🐛 [报告问题](https://github.com/1186258278/OpenClawChineseTranslation/issues)
- 💡 [提交建议](https://github.com/1186258278/OpenClawChineseTranslation/issues)
- 📝 [改进翻译](docs/CONTRIBUTING.md)
- ⭐ 给项目点个 Star

---

<a id="license"></a>
## 📜 许可证 <sub>[↑ 返回目录](#nav)</sub>

本项目基于 [MIT License](LICENSE) 开源。

OpenClaw 原项目由 [Peter Steinberger](https://twitter.com/steipete) 创建，版权归原作者所有。

---

<a id="about"></a>
## 🏢 关于我们 <sub>[↑ 返回目录](#nav)</sub>

**武汉晴辰天下网络科技有限公司** 出品

| | |
|---|---|
| 🌐 官网 | https://qingchencloud.com/ |
| 🔗 导航 | https://qt.cool/ |
| 📧 联系 | 通过官网联系我们 |

主营业务：程序定制、软件开发等

© 武汉晴辰天下网络科技有限公司 | [鄂ICP备2025164966号](https://beian.miit.gov.cn/)
