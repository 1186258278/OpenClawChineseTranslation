# OpenClaw 汉化发行版

[![Release](https://img.shields.io/github/v/release/1186258278/OpenClawChineseTranslation?label=稳定版)](https://github.com/1186258278/OpenClawChineseTranslation/releases)
[![npm](https://img.shields.io/npm/v/@qingchencloud/openclaw-zh?label=npm)](https://www.npmjs.com/package/@qingchencloud/openclaw-zh)
[![Nightly Build](https://github.com/1186258278/OpenClawChineseTranslation/actions/workflows/nightly.yml/badge.svg)](https://github.com/1186258278/OpenClawChineseTranslation/actions/workflows/nightly.yml)
[![Platform](https://img.shields.io/badge/平台-Windows%20|%20macOS%20|%20Linux-blue)](https://github.com/1186258278/OpenClawChineseTranslation/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> **每小时自动同步** [OpenClaw](https://github.com/openclaw/openclaw) 官方更新，汉化版延迟 < 1 小时！

<p align="center">
  <a href="https://openclaw.qt.cool/"><img src="https://img.shields.io/badge/🔥_汉化官网-openclaw.qt.cool-dc2626?style=for-the-badge" alt="汉化官网"></a>
</p>

---

## 什么是 OpenClaw？

[OpenClaw](https://openclaw.ai/) 是 GitHub 100,000+ Stars 的**开源个人 AI 助手平台**。它运行在你的电脑上，通过 WhatsApp、Telegram、Discord 等聊天应用与你的 AI 助手交互，帮你处理邮件、日历、文件等日常事务。

**本项目 = OpenClaw + 全中文界面**，CLI 命令行和 Dashboard 网页控制台均已深度汉化。

---

## 3 步上手

> **前提条件**：需要 **Node.js >= 22**（[下载 Node.js](https://nodejs.org/)）
>
> 检查版本：`node -v`

### 第 1 步：安装

```bash
npm install -g @qingchencloud/openclaw-zh@latest
```

### 第 2 步：初始化

```bash
openclaw onboard
```

初始化向导会引导你完成：选择 AI 模型 → 配置 API 密钥 → 设置聊天通道

### 第 3 步：打开控制台

```bash
openclaw dashboard
```

浏览器会自动打开全中文的 Dashboard 控制台。完成！

> 想了解每一步的详细说明？查看 **[详细安装指南](docs/INSTALL_GUIDE.md)**（包含 Node.js 安装、模型配置、守护进程、内网访问等）

---

## 汉化效果预览

<p align="center">
  <img src="docs/image/5.png" alt="概览仪表板" width="100%">
  <br>
  <em>概览仪表板 - 网关状态、实例监控、快捷操作一目了然</em>
</p>

<details>
<summary><b>查看更多截图</b></summary>

<p align="center">
  <img src="docs/image/1.png" alt="对话界面" width="100%">
  <br>
  <em>对话界面 - 与 AI 助手实时交互</em>
</p>

<p align="center">
  <img src="docs/image/4.png" alt="渠道管理" width="100%">
  <br>
  <em>渠道管理 - WhatsApp、Telegram、Discord 等全平台支持</em>
</p>

<p align="center">
  <img src="docs/image/2.png" alt="配置中心" width="100%">
  <br>
  <em>配置中心 - 完整汉化</em>
</p>

<p align="center">
  <img src="docs/image/3.png" alt="节点配置" width="100%">
  <br>
  <em>节点配置 - 执行审批、安全策略管理</em>
</p>

<p align="center">
  <img src="docs/image/6.png" alt="技能插件" width="100%">
  <br>
  <em>技能插件 - 1Password、Apple Notes 等丰富扩展</em>
</p>

</details>

---

## 常用命令

```bash
openclaw                    # 启动 OpenClaw
openclaw onboard            # 初始化向导
openclaw dashboard          # 打开网页控制台
openclaw config             # 查看/修改配置
openclaw skills             # 管理技能
openclaw --help             # 查看帮助
```

---

## 更新升级

```bash
npm update -g @qingchencloud/openclaw-zh
```

> 查看当前版本：`openclaw --version`

| 版本 | 安装命令 | 说明 |
|------|----------|------|
| **稳定版** | `npm install -g @qingchencloud/openclaw-zh@latest` | 经过测试，推荐使用 |
| **最新版** | `npm install -g @qingchencloud/openclaw-zh@nightly` | 每小时同步上游，体验新功能 |

---

## 其他安装方式

> 完整的手动安装教程（含 Node.js 安装、各系统配置、守护进程管理）请查看 **[详细安装指南](docs/INSTALL_GUIDE.md)**

<details>
<summary><b>一键安装脚本</b></summary>

**Linux / macOS：**
```bash
curl -fsSL -o install.sh https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/install.sh && bash install.sh
```

**Windows PowerShell：**
```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/gh/1186258278/OpenClawChineseTranslation@main/install.ps1" -OutFile "install.ps1" -Encoding UTF8; powershell -ExecutionPolicy Bypass -File ".\install.ps1"
```

> 如遇中文乱码，直接用 npm 安装：`npm install -g @qingchencloud/openclaw-zh@latest`

</details>

<details>
<summary><b>Docker 部署</b></summary>

**快速启动：**
```bash
# 初始化配置
docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:latest openclaw setup

docker run --rm -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:latest openclaw config set gateway.mode local

# 启动容器
docker run -d --name openclaw -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  ghcr.io/1186258278/openclaw-zh:latest openclaw gateway run
```

访问：`http://localhost:18789`

> 完整 Docker 指南（远程部署、Nginx 反代、Docker Compose 等）请查看 **[Docker 部署指南](docs/DOCKER_GUIDE.md)**

</details>

<details>
<summary><b>pnpm / yarn 安装</b></summary>

```bash
# pnpm
pnpm add -g @qingchencloud/openclaw-zh@latest

# yarn
yarn global add @qingchencloud/openclaw-zh@latest
```

</details>

---

## 常见问题

| 问题 | 快速解决 | 详细说明 |
|------|----------|----------|
| **安装卡住 / 下载慢** | 加镜像源：`npm install -g @qingchencloud/openclaw-zh@latest --registry=https://registry.npmmirror.com` | [查看](docs/FAQ.md#安装卡住不动--下载很慢) |
| **安装后还是英文** | 先卸载原版：`npm uninstall -g openclaw && npm install -g @qingchencloud/openclaw-zh@latest` | [查看](docs/FAQ.md#安装后运行还是英文) |
| **`token mismatch`** | 运行 `openclaw dashboard` 自动打开带 Token 的 URL | [查看](docs/FAQ.md#gateway-token-mismatch--unauthorized) |
| **`pairing required`** | `openclaw devices list` 然后 `openclaw devices approve <ID>` | [查看](docs/FAQ.md#pairing-required--设备配对) |
| **远程 / 内网访问不了** | `openclaw config set gateway.bind lan` + 设置 Token + 重启 | [查看](docs/FAQ.md#npm-安装后内网其他电脑无法访问) |
| **`Missing config`** | 运行 `openclaw onboard` 初始化 | [查看](docs/FAQ.md#missing-config-run-openclaw-setup) |
| **Ollama 无响应** | 检查 baseURL 配置是否为 `http://localhost:11434/v1` | [查看](docs/FAQ.md#本地-ollama-模型调用无响应) |

> **[完整排查手册 (25+ 个问题)](docs/FAQ.md)** | [Docker 问题排查](docs/DOCKER_GUIDE.md#常见错误排查)

---

## 插件扩展

```bash
# 安装更新检测插件
npm install -g @qingchencloud/openclaw-updater
```

访问 [插件市场](https://openclaw.qt.cool/) 获取更多插件。

---

## 微信交流群

<p align="center">
  <img src="docs/image/wx_01.png" alt="微信交流群" width="200px">
  <br>
  <em>欢迎入群交流，碰到问题也可以直接在群内反馈</em>
</p>

---

## 相关链接

| 汉化版 | 上游项目 |
|--------|----------|
| [汉化官网](https://openclaw.qt.cool/) | [OpenClaw 官网](https://openclaw.ai/) |
| [npm 包](https://www.npmjs.com/package/@qingchencloud/openclaw-zh) | [OpenClaw GitHub](https://github.com/openclaw/openclaw) |
| [GitHub 仓库](https://github.com/1186258278/OpenClawChineseTranslation) | [ClawHub 技能市场](https://clawhub.dev/) |
| [GitHub Pages](https://1186258278.github.io/OpenClawChineseTranslation/) | [Discord 社区](https://discord.gg/openclaw) |

---

## 参与贡献

- [报告问题](https://github.com/1186258278/OpenClawChineseTranslation/issues) | [改进翻译](docs/CONTRIBUTING.md) | [翻译规范](docs/TRANSLATION_GUIDE.md) | 给项目点个 Star

---

## 关于

**武汉晴辰天下网络科技有限公司** 出品 | [qingchencloud.com](https://qingchencloud.com/) | [MIT License](LICENSE)

© 武汉晴辰天下网络科技有限公司 | [鄂ICP备2025164966号](https://beian.miit.gov.cn/)


<!-- AI Translation Tools: Claude, ChatGPT, Copilot, Gemini, Codex -->