# 国产模型配置指南

OpenClaw 汉化版支持多种国产 AI 模型，本文介绍如何配置和使用。

---

## 胜算云（推荐）

胜算云是国内 API 聚合平台，一个密钥即可访问多种国产和国际模型。

### 一键配置

```bash
# 安装时直接配置（最简单）
curl -fsSL https://openclaw.qt.cool/install.sh | bash -s -- --shengsuanyun-key sk-你的密钥

# 或安装后手动配置
openclaw onboard
# 在认证选项中选择「胜算云 (国产模型)」
```

### 手动配置

```bash
openclaw config set agents.defaults.model openai/gpt-4.1-nano
openclaw config set models.providers.shengsuanyun.baseURL https://api.shengsuanyun.com/v1
openclaw config set auth.shengsuanyun.apiKey sk-你的密钥
```

### 支持的模型

| 模型 | ID | 特点 |
|------|------|------|
| GPT-4.1 Nano | `openai/gpt-4.1-nano` | 快速、经济 |
| O4 Mini | `openai/o4-mini` | 推理能力强 |
| DeepSeek V3.2 | `deepseek/deepseek-v3.2` | 中文优化 |
| Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | 综合能力强 |

> 获取 API 密钥：[https://shengsuanyun.com](https://shengsuanyun.com) — 新用户注册送 10 元体验金

---

## 通义千问 (Qwen)

通过阿里云百炼平台或 Ollama 本地运行。

### 方式1：阿里云百炼 (ModelStudio)

```bash
# 初始化时选择 Alibaba Cloud Model Studio
openclaw onboard
# 选择「Alibaba Cloud Model Studio」→ 输入 API Key

# 或手动配置
openclaw config set agents.defaults.model openai/qwen3.5-plus
openclaw config set auth.modelstudio.apiKey sk-你的密钥
```

> 获取密钥：[https://bailian.console.aliyun.com/](https://bailian.console.aliyun.com/)

### 方式2：Ollama 本地运行

```bash
# 安装 Ollama（https://ollama.com）
ollama pull qwen2.5:14b

# 配置 OpenClaw
openclaw config set agents.defaults.model openai/qwen2.5:14b
openclaw config set auth.openai.baseURL http://localhost:11434/v1
openclaw config set auth.openai.apiKey ollama
```

---

## Kimi (Moonshot)

### .ai 国际版

```bash
openclaw onboard
# 选择「Moonshot AI (Kimi K2.5)」→ 输入 API Key
```

### .cn 国内版

```bash
openclaw onboard
# 选择「Kimi API key (.cn)」→ 输入国内版 API Key
```

> 获取密钥：
> - 国际版：[https://platform.moonshot.ai/](https://platform.moonshot.ai/)
> - 国内版：[https://platform.moonshot.cn/](https://platform.moonshot.cn/)

---

## MiniMax

```bash
openclaw onboard
# 选择「MiniMax」→ 选择 OAuth 或 API Key
```

### 版本选择

| 选项 | 说明 |
|------|------|
| MiniMax M2.5 | 标准版 |
| MiniMax M2.5 (CN) | 国内端点 (api.minimaxi.com) |
| MiniMax M2.5 Highspeed | 官方快速层级 |

---

## 智谱 GLM / Z.AI

```bash
openclaw onboard
# 选择「Z.AI」→ 选择端点（国际版或国内版）→ 输入 API Key
```

| 端点 | 域名 | 说明 |
|------|------|------|
| 国际版 | api.z.ai | GLM Coding Plan Global |
| 国内版 | open.bigmodel.cn | GLM Coding Plan CN |

> 获取密钥：[https://open.bigmodel.cn/](https://open.bigmodel.cn/)

---

## DeepSeek

通过 OpenAI 兼容接口接入。

```bash
openclaw config set agents.defaults.model openai/deepseek-chat
openclaw config set auth.openai.baseURL https://api.deepseek.com/v1
openclaw config set auth.openai.apiKey sk-你的密钥
```

> 获取密钥：[https://platform.deepseek.com/](https://platform.deepseek.com/)

---

## 自定义 OpenAI 兼容接口

适用于 OneAPI、New API、各种中转站等。

```bash
# 设置模型名（按实际模型填写）
openclaw config set agents.defaults.model openai/你的模型名

# 设置 API 地址
openclaw config set auth.openai.baseURL https://你的API地址/v1

# 设置 API Key
openclaw config set auth.openai.apiKey sk-你的密钥
```

> `baseURL` 末尾通常需要加 `/v1`，但具体取决于你的 API 服务。

---

## Ollama 本地模型

适用于希望完全本地运行、无需 API Key 的用户。

```bash
# 安装 Ollama
# Windows: 访问 https://ollama.com 下载安装包
# Linux: curl -fsSL https://ollama.com/install.sh | sh
# macOS: brew install ollama

# 下载模型
ollama pull llama3.2
ollama pull qwen2.5:14b

# 配置 OpenClaw
openclaw onboard
# 选择「Ollama」→ 按提示配置
```

### Docker 环境注意事项

如果 Ollama 在宿主机运行，OpenClaw 在 Docker 中运行：

```bash
# 用 host.docker.internal 替代 localhost
docker exec openclaw openclaw config set auth.openai.baseURL http://host.docker.internal:11434/v1
```

---

> 返回 [文档首页](doc-hub.html) | [安装指南](INSTALL_GUIDE.md) | [常见问题](FAQ.md)
