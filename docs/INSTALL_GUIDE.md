# 详细安装指南

<p align="center">
  <a href="../README.md">🏠 首页</a> ·
  <b>📦 安装指南</b> ·
  <a href="DOCKER_GUIDE.md">🐳 Docker 部署</a> ·
  <a href="FAQ.md">❓ 常见问题</a> ·
  <a href="CONTRIBUTING.md">🤝 贡献指南</a> ·
  <a href="TRANSLATION_GUIDE.md">📝 翻译规范</a>
</p>

从零开始，一步步安装和配置 OpenClaw 汉化版。

---

## 目录

- [前提条件](#前提条件)
- [第一阶段：安装](#第一阶段安装)
- [第二阶段：初始化配置](#第二阶段初始化配置)
- [第三阶段：验证运行](#第三阶段验证运行)
- [第四阶段：进阶配置（可选）](#第四阶段进阶配置可选)
- [模型配置指南](#模型配置指南)
- [配置文件说明](#配置文件说明)
- [守护进程管理](#守护进程管理)
- [常用命令速查](#常用命令速查)

---

## 前提条件

### 1. 安装 Node.js

OpenClaw 要求 **Node.js >= 22.12.0**。

**检查是否已安装**：
```bash
node -v
# 应输出 v22.x.x 或更高
```

**如果没有安装或版本过低**：

| 系统 | 推荐安装方式 |
|------|-------------|
| **Windows** | 访问 [nodejs.org](https://nodejs.org/) 下载 LTS 版本安装包 |
| **macOS** | `brew install node@22` 或访问 [nodejs.org](https://nodejs.org/) |
| **Ubuntu / Debian** | 见下方命令 |
| **CentOS / RHEL** | 见下方命令 |

**Ubuntu / Debian 安装 Node.js 22**：
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS / RHEL 安装 Node.js 22**：
```bash
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs
```

**使用 nvm 安装（适用于所有系统）**：
```bash
# 安装 nvm（如果还没有）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 安装并使用 Node.js 22
nvm install 22
nvm use 22
```

### 2. 验证环境

```bash
node -v    # 应显示 v22.x.x
npm -v     # 应显示 10.x.x
```

---

## 第一阶段：安装

### 安装汉化版

```bash
npm install -g @qingchencloud/openclaw-zh@latest
```

> 如果下载慢，加上淘宝镜像源：
> ```bash
> npm install -g @qingchencloud/openclaw-zh@latest --registry=https://registry.npmmirror.com
> ```

### 验证安装

```bash
openclaw --version
# 应输出类似：2026.2.4-zh.1

openclaw --help
# 应显示中文帮助信息
```

> 如果提示 `openclaw: command not found`，需要将 npm 全局路径加入 PATH：
> ```bash
> # 查看 npm 全局路径
> npm prefix -g
>
> # 将输出的路径/bin 加入你的 shell 配置文件（~/.bashrc 或 ~/.zshrc）
> export PATH="$(npm prefix -g)/bin:$PATH"
> ```

---

## 第二阶段：初始化配置

### 方式 A：交互式向导（推荐新手）

```bash
openclaw onboard
```

向导会引导你完成以下配置：

```
步骤1  ─→  安全风险确认（输入 y 确认）
步骤2  ─→  选择 AI 模型提供商
            ├─ Anthropic Claude（推荐）
            ├─ OpenAI GPT
            ├─ 本地模型（Ollama 等）
            └─ 其他（Moonshot、智谱等）
步骤3  ─→  输入 API Key
步骤4  ─→  选择默认模型
步骤5  ─→  配置网关（端口、认证方式）
步骤6  ─→  配置聊天通道（可跳过）
            ├─ WhatsApp
            ├─ Telegram
            ├─ Discord
            └─ ...
步骤7  ─→  安装技能（可跳过）
步骤8  ─→  完成！
```

> 向导中大部分选项直接按回车用默认值即可。

### 方式 B：快速非交互式初始化

如果你已经有 API Key，想跳过向导直接配置：

```bash
# 第1步：创建基础配置
openclaw setup

# 第2步：设置网关模式
openclaw config set gateway.mode local

# 第3步：设置 AI 模型和 API Key（以 Claude 为例）
openclaw config set agents.defaults.model anthropic/claude-sonnet-4-20250514
openclaw config set auth.anthropic.apiKey sk-ant-你的API密钥

# 第4步：设置网关认证（推荐）
openclaw config set gateway.auth.token 你设定的密码
```

详细的模型配置请参考下方 [模型配置指南](#模型配置指南)。

快速示例（Claude）：
```bash
openclaw config set agents.defaults.model anthropic/claude-sonnet-4-20250514
openclaw config set auth.anthropic.apiKey sk-ant-你的API密钥
```

---

## 第三阶段：验证运行

### 启动网关

```bash
# 方式1：前台运行（可以看到实时日志，按 Ctrl+C 停止）
openclaw

# 方式2：安装为守护进程（后台运行，开机自启）
openclaw onboard --install-daemon
```

### 打开控制台

```bash
openclaw dashboard
```

这会自动在浏览器中打开带 Token 的 Dashboard 页面。

如果浏览器没有自动打开，手动访问：`http://localhost:18789`

### 检查运行状态

```bash
# 查看网关状态
openclaw status

# 运行诊断（检查配置是否正确）
openclaw doctor
```

---

## 第四阶段：进阶配置（可选）

### 开启内网访问

默认情况下只能在本机通过 `localhost` 访问。如果想让内网其他设备也能访问：

```bash
# 绑定到局域网
openclaw config set gateway.bind lan

# 设置访问密码（必须）
openclaw config set gateway.auth.token 你的密码

# 重启生效
openclaw gateway restart
```

然后在其他设备上访问 `http://你的IP:18789`，在「网关令牌」输入框填入密码。

### 配置聊天通道

```bash
# 添加 Telegram
openclaw channels add telegram
# 按提示输入 Bot Token

# 添加 WhatsApp
openclaw channels add whatsapp
# 扫描二维码连接

# 查看已配置的通道
openclaw channels list
```

### 安装技能

```bash
# 查看可用技能
openclaw skills list

# 安装技能
openclaw skills install
```

---

## 模型配置指南

OpenClaw 支持几乎所有主流 AI 模型，包括国际服务、国产模型和本地模型。只要是兼容 OpenAI 接口的服务都可以接入。

### 模型名格式

模型名使用 `提供商/模型ID` 格式，例如：`openai/gpt-4o`、`anthropic/claude-sonnet-4-20250514`

### 国际主流模型

#### Anthropic Claude（推荐）

```bash
openclaw config set agents.defaults.model anthropic/claude-sonnet-4-20250514
openclaw config set auth.anthropic.apiKey sk-ant-你的API密钥
```

获取 API Key：[console.anthropic.com](https://console.anthropic.com/)

#### OpenAI GPT

```bash
openclaw config set agents.defaults.model openai/gpt-4o
openclaw config set auth.openai.apiKey sk-你的API密钥
```

获取 API Key：[platform.openai.com](https://platform.openai.com/)

#### Google Gemini

```bash
openclaw config set agents.defaults.model google/gemini-3-pro-preview
openclaw config set auth.google.apiKey 你的API密钥
```

获取 API Key：[aistudio.google.com](https://aistudio.google.com/)

环境变量方式：`export GEMINI_API_KEY=你的API密钥`

#### OpenRouter（聚合多模型）

一个 Key 可以调用几百种模型，非常方便：

```bash
openclaw config set agents.defaults.model openrouter/auto
openclaw config set auth.openrouter.apiKey sk-or-你的API密钥
```

获取 API Key：[openrouter.ai](https://openrouter.ai/)

> `openrouter/auto` 会自动选择最佳模型。也可以指定具体模型，如 `openrouter/anthropic/claude-3.5-sonnet`

---

### 国产模型

#### 月之暗面 Moonshot（Kimi）

```bash
# 国际版
openclaw config set agents.defaults.model moonshot/kimi-k2.5
openclaw config set auth.moonshot.apiKey 你的API密钥

# 中国大陆版（自动使用 .cn 域名，更快）
# 在 onboard 向导中选择 "Moonshot (.cn)" 即可
```

获取 API Key：[platform.moonshot.cn](https://platform.moonshot.cn/)

环境变量方式：`export MOONSHOT_API_KEY=你的API密钥`

#### 智谱 Z.AI（GLM）

```bash
openclaw config set agents.defaults.model zai/glm-4.7
openclaw config set auth.zai.apiKey 你的API密钥
```

获取 API Key：[open.bigmodel.cn](https://open.bigmodel.cn/)

环境变量方式：`export ZAI_API_KEY=你的API密钥`

#### MiniMax

```bash
openclaw config set agents.defaults.model minimax/MiniMax-M2.1
openclaw config set auth.minimax.apiKey 你的API密钥
```

获取 API Key：[platform.minimaxi.com](https://platform.minimaxi.com/)

环境变量方式：`export MINIMAX_API_KEY=你的API密钥`

#### 小米 MiMo

```bash
openclaw config set agents.defaults.model xiaomi/mimo-v2-flash
openclaw config set auth.xiaomi.apiKey 你的API密钥
```

获取 API Key：[platform.xiaomi.cn](https://platform.xiaomi.cn/)

环境变量方式：`export XIAOMI_API_KEY=你的API密钥`

#### 胜算云（API 聚合平台）

胜算云是国内知名的 AI API 聚合平台，整合了 Kimi、DeepSeek、Qwen、Llama 等热门模型，一个 Key 就能调用几百种模型。

**🎁 新春活动（截至 2025年3月3日）**：
| 阶梯 | 春节消耗 | 奖励 |
|------|---------|------|
| 尝鲜礼 | ≥50元 | 5元 模力券 |
| 极客礼 | ≥100元 | 10元 模力券 + Kimi K2.5 七折卡(7天) |
| 大神礼 | ≥500元 | 50元 模力券 + Kimi K2.5 七折卡(7天) |

[查看活动详情 →](https://www.shengsuanyun.com/activity/4184b48a6be4443cbe13e86e091e43b4?from=CH_4BVI0BM2)

```bash
# 在 onboard 向导中选择 "胜算云 (国产模型)" 即可自动配置
# 或手动配置：
openclaw config set agents.defaults.model shengsuanyun/openai/gpt-4.1-nano
openclaw config set auth.shengsuanyun.apiKey 你的胜算云API密钥
```

获取 API Key：[胜算云官网](https://www.shengsuanyun.com/?from=CH_4BVI0BM2)

#### Venice AI

```bash
openclaw config set agents.defaults.model venice/llama-3.3-70b
openclaw config set auth.venice.apiKey 你的API密钥
```

---

### 本地模型

#### Ollama（推荐）

先安装 Ollama 并下载模型：[ollama.com](https://ollama.com/)

```bash
# 确保 Ollama 正在运行
ollama serve

# 下载模型（以 llama3.2 为例）
ollama pull llama3.2
```

在 OpenClaw 中配置：

```bash
openclaw config set agents.defaults.model ollama/llama3.2
openclaw config set auth.openai.apiKey ollama
openclaw config set auth.openai.baseURL http://localhost:11434/v1
```

> **Docker 用户注意**：容器中 `localhost` 指容器自身。如果 Ollama 在宿主机运行，使用：
> ```bash
> docker exec openclaw openclaw config set auth.openai.baseURL http://host.docker.internal:11434/v1
> ```

#### LM Studio

```bash
# LM Studio 默认监听 http://localhost:1234
openclaw config set agents.defaults.model openai/你加载的模型名
openclaw config set auth.openai.apiKey lm-studio
openclaw config set auth.openai.baseURL http://localhost:1234/v1
```

---

### 自定义 OpenAI 兼容接口

适用于：OneAPI、New API、各种中转站、企业私有部署、自建代理等。只要接口兼容 OpenAI 格式就能用。

#### 方式 A：通过 config 命令（简单）

```bash
# 设置自定义 API 地址
openclaw config set auth.openai.baseURL https://你的接口地址/v1

# 设置 API Key
openclaw config set auth.openai.apiKey sk-你的密钥

# 设置模型名（按你的接口实际支持的模型填写）
openclaw config set agents.defaults.model openai/gpt-4o
```

**常见中转站示例**：

```bash
# OneAPI / New API
openclaw config set auth.openai.baseURL https://your-oneapi.example.com/v1
openclaw config set auth.openai.apiKey sk-你的密钥
openclaw config set agents.defaults.model openai/gpt-4o

# 某中转站
openclaw config set auth.openai.baseURL https://api.example.com/v1
openclaw config set auth.openai.apiKey sk-你的密钥
openclaw config set agents.defaults.model openai/claude-3-5-sonnet
```

> `baseURL` 末尾通常需要 `/v1`，但取决于你的接口。如果不确定，两种都试试。

#### 方式 B：通过配置文件（高级，支持自定义模型列表）

编辑 `~/.openclaw/openclaw.json`，添加自定义提供商：

```json
{
  "models": {
    "providers": {
      "my-provider": {
        "baseUrl": "https://你的接口地址/v1",
        "api": "openai-completions",
        "apiKey": "sk-你的密钥",
        "models": [
          {
            "id": "gpt-4o",
            "name": "GPT-4o",
            "reasoning": false,
            "input": ["text", "image"],
            "contextWindow": 128000,
            "maxTokens": 16384
          },
          {
            "id": "claude-3-5-sonnet",
            "name": "Claude 3.5 Sonnet",
            "reasoning": true,
            "input": ["text", "image"],
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "my-provider/gpt-4o"
      }
    }
  }
}
```

**`api` 字段选择**：

| 值 | 说明 | 适用于 |
|----|------|--------|
| `openai-completions` | OpenAI Chat Completions 格式 | 大多数兼容接口、Ollama、OneAPI |
| `anthropic-messages` | Anthropic Messages 格式 | Anthropic 代理、Cloudflare AI Gateway |

#### 方式 C：通过环境变量

```bash
# 设置 API Key
export OPENAI_API_KEY=sk-你的密钥

# 启动 OpenClaw（会自动检测环境变量）
openclaw
```

支持的环境变量：

| 环境变量 | 对应提供商 |
|----------|-----------|
| `ANTHROPIC_API_KEY` | Anthropic Claude |
| `OPENAI_API_KEY` | OpenAI |
| `OPENROUTER_API_KEY` | OpenRouter |
| `GEMINI_API_KEY` | Google Gemini |
| `MOONSHOT_API_KEY` | Moonshot Kimi |
| `ZAI_API_KEY` | 智谱 GLM |
| `MINIMAX_API_KEY` | MiniMax |
| `XIAOMI_API_KEY` | 小米 MiMo |
| `SHENGSUANYUN_API_KEY` | 胜算云（聚合平台） |

---

### Cloudflare AI Gateway

通过 Cloudflare 网关代理调用 AI 模型，可以实现缓存、限速、监控等功能：

```bash
# 在 onboard 向导中选择 "Cloudflare AI Gateway"
# 或手动配置：
openclaw config set agents.defaults.model cloudflare-ai-gateway/claude-sonnet-4-5
```

需要提供：Cloudflare Account ID + Gateway ID + API Key

---

### 配置后备模型

设置多个模型作为后备，主模型不可用时自动切换：

```bash
# 通过配置文件设置（编辑 ~/.openclaw/openclaw.json）
```

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4-20250514",
        "fallbacks": ["openai/gpt-4o", "openrouter/auto"]
      }
    }
  }
}
```

---

### 模型配置排查

如果模型调用没有响应：

```bash
# 1. 检查当前配置的模型
openclaw config get agents.defaults.model

# 2. 检查 API Key 是否配置
openclaw config get auth

# 3. 运行诊断
openclaw doctor

# 4. 查看实时日志（前台启动）
openclaw
```

更多模型问题排查请参考 [FAQ - 模型和对话](FAQ.md#五模型和对话)

---

## 配置文件说明

所有配置存储在 `~/.openclaw/` 目录下：

```
~/.openclaw/
├── openclaw.json          # 主配置文件
├── workspace/             # 工作区（AI 的文件空间）
├── sessions/              # 会话历史记录
├── credentials/           # OAuth 凭证
└── logs/                  # 日志文件
```

**Windows 路径**：`%USERPROFILE%\.openclaw\`

### 查看和修改配置

```bash
# 查看所有配置
openclaw config get

# 查看某个配置项
openclaw config get gateway.mode
openclaw config get agents.defaults.model

# 修改配置
openclaw config set gateway.mode local
openclaw config set gateway.port 18789
```

---

## 守护进程管理

安装守护进程后，OpenClaw 会在后台自动运行，开机自启。

### 安装守护进程

```bash
openclaw onboard --install-daemon
```

### 查看状态

```bash
openclaw gateway status
```

### 管理命令

| 操作 | macOS | Linux |
|------|-------|-------|
| **查看状态** | `launchctl list \| grep openclaw` | `systemctl --user status openclaw-gateway` |
| **停止** | `launchctl bootout gui/$UID/ai.openclaw.gateway` | `systemctl --user stop openclaw-gateway` |
| **启动** | `launchctl bootstrap gui/$UID ~/Library/LaunchAgents/ai.openclaw.gateway.plist` | `systemctl --user start openclaw-gateway` |
| **重启** | 先停止再启动 | `systemctl --user restart openclaw-gateway` |
| **查看日志** | `cat /tmp/openclaw/*.log` | `journalctl --user -u openclaw-gateway` |

**Linux 保持后台运行**（SSH 退出后不停止）：
```bash
sudo loginctl enable-linger $USER
```

---

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `openclaw` | 启动 OpenClaw（前台模式） |
| `openclaw onboard` | 运行初始化向导 |
| `openclaw onboard --install-daemon` | 初始化 + 安装守护进程 |
| `openclaw dashboard` | 打开网页控制台 |
| `openclaw status` | 查看运行状态 |
| `openclaw doctor` | 诊断检查 |
| `openclaw config get` | 查看配置 |
| `openclaw config set KEY VALUE` | 修改配置 |
| `openclaw gateway start` | 启动网关 |
| `openclaw gateway stop` | 停止网关 |
| `openclaw gateway restart` | 重启网关 |
| `openclaw channels list` | 查看通道列表 |
| `openclaw skills list` | 查看技能列表 |
| `openclaw --help` | 查看帮助 |
| `openclaw --version` | 查看版本 |

---

> 遇到问题？查看 [常见问题排查手册](FAQ.md)
>
> Docker 部署？查看 [Docker 部署指南](DOCKER_GUIDE.md)
>
> 返回 [README](../README.md)
