# 新手引导向导（CLI）

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/start/wizard)，已针对汉化版进行本地化。

---

## 快速开始

```bash
openclaw onboard --install-daemon
```

## 快速开始 vs 高级模式

**快速开始默认值：**
- 本地 Gateway 网关（loopback）
- 默认工作区（或现有工作区）
- Gateway 网关端口 18789
- Gateway 网关认证 Token（自动生成）
- Tailscale 暴露关闭
- Telegram + WhatsApp 私信默认使用允许列表

## 向导做了什么

1. **模型/认证** — OpenAI Codex OAuth、Anthropic API 密钥（推荐）或 setup-token，以及 MiniMax/GLM/Moonshot/AI Gateway 等选项
2. **工作区位置** + 引导文件
3. **Gateway 网关设置** — 端口/绑定/认证/Tailscale
4. **提供商** — Telegram、WhatsApp、Discord、Google Chat、Mattermost、Signal
5. **守护进程安装** — LaunchAgent / systemd 用户单元
6. **健康检查**
7. **Skills**（推荐）

## 流程详情（本地模式）

### 1. 现有配置检测

- 如果 `~/.openclaw/openclaw.json` 存在，选择保留 / 修改 / 重置
- 重新运行向导不会清除任何内容，除非你明确选择重置（或传递 `--reset`）
- 如果配置无效，向导会要求先运行 `openclaw doctor`
- 重置使用 trash（永不使用 rm）并提供范围选项：
  - 仅配置
  - 配置 + 凭证 + 会话
  - 完全重置（同时删除工作区）

### 2. 模型/认证

汉化版支持以下认证方式（含国产模型）：

| 方式 | 说明 |
|------|------|
| **Anthropic API 密钥**（推荐） | 使用 `ANTHROPIC_API_KEY` 或提示输入 |
| **Anthropic OAuth** | Claude Code CLI 凭证复用 |
| **Anthropic 令牌** | `claude setup-token` 粘贴 |
| **OpenAI Codex OAuth** | 浏览器流程 |
| **OpenAI API 密钥** | 使用 `OPENAI_API_KEY` 或提示输入 |
| **OpenCode Zen** | 多模型代理，提示输入 API Key |
| **OpenCode Go** | Kimi/GLM/MiniMax Go 目录 |
| **胜算云** | 国产模型聚合平台 |
| **阿里云百炼** | ModelStudio Coding Plan |
| **MiniMax** | M2.5 系列 |
| **Moonshot (Kimi)** | Kimi K2.5 + Kimi Coding |
| **智谱 Z.AI** | GLM Coding Plan |
| **Ollama** | 本地开源模型 |

### 3. Gateway 网关设置

- 端口：默认 18789
- 绑定：loopback（默认）、lan、tailnet、custom
- 认证：自动生成 Token
- Tailscale：可选暴露

### 4. 提供商配置

向导引导配置各聊天渠道（WhatsApp 二维码、Telegram Bot Token 等）。

### 5. 守护进程安装

- macOS：LaunchAgent
- Linux：systemd 用户单元
- Windows：需手动启动或使用计划任务

## 非交互模式

```bash
openclaw onboard --non-interactive \
  --auth-choice apiKey \
  --accept-risk
```

### 胜算云非交互模式

```bash
openclaw onboard --non-interactive \
  --auth-choice shengsuanyun-api-key \
  --shengsuanyun-api-key sk-你的密钥 \
  --accept-risk
```

## 添加另一个智能体

```bash
openclaw agents add <name>
```

## 向导写入的内容

| 文件 | 内容 |
|------|------|
| `~/.openclaw/openclaw.json` | 主配置文件 |
| `~/.openclaw/.env` | API 密钥环境变量 |
| `~/.openclaw/agents/<id>/agent/` | 智能体工作区 |
| `~/.openclaw/credentials/` | 渠道凭证 |

---

> 返回 [文档首页](../doc-hub.html) | [入门指南](getting-started.md) | [安装指南](../INSTALL_GUIDE.md)
