# 配置详解 🔧

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/gateway/configuration)，已针对汉化版进行本地化。
> 配置内容非常丰富，本文提供核心概览。完整配置项请参考 [官方配置文档](https://docs.openclaw.ai/zh-CN/gateway/configuration)。

---

## 配置文件位置

```
~/.openclaw/openclaw.json
```

环境变量覆盖：`OPENCLAW_CONFIG_PATH`

## 最小配置（推荐起点）

```json
{
  "gateway": {
    "mode": "local",
    "auth": {
      "token": "你的密码"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-sonnet-4"
    }
  }
}
```

## 常用配置项

### 网关配置

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `gateway.mode` | 网关模式（local/remote） | — |
| `gateway.port` | 监听端口 | 18789 |
| `gateway.bind` | 绑定模式（loopback/lan/tailnet/custom） | loopback |
| `gateway.auth.token` | 访问令牌 | 自动生成 |
| `gateway.trustedProxies` | 信任的代理 IP | — |
| `gateway.controlUi.allowedOrigins` | 控制面板允许的来源 | — |

### 智能体配置

| 配置项 | 说明 |
|--------|------|
| `agents.defaults.model` | 默认模型 |
| `agents.defaults.workspace` | 工作区路径 |
| `agents.defaults.identity.name` | 助手名称 |
| `agents.defaults.identity.emoji` | 助手 Emoji |

### 渠道配置

| 配置项 | 说明 |
|--------|------|
| `channels.whatsapp.dmPolicy` | WhatsApp 私信策略 |
| `channels.whatsapp.allowFrom` | WhatsApp 白名单 |
| `channels.telegram.accounts` | Telegram 账号配置 |
| `channels.discord.accounts` | Discord 账号配置 |

### 工具配置

| 配置项 | 说明 |
|--------|------|
| `tools.exec.security` | 命令执行安全级别（deny/allowlist/full） |
| `tools.web.search.enabled` | 启用网页搜索 |
| `tools.web.search.apiKey` | Brave Search API 密钥 |

### 认证配置

| 配置项 | 说明 |
|--------|------|
| `auth.openai.apiKey` | OpenAI API 密钥 |
| `auth.openai.baseURL` | OpenAI 兼容 API 地址 |

## 配置方法

```bash
# 命令行设置
openclaw config set gateway.mode local
openclaw config set agents.defaults.model openai/gpt-4o

# 查看配置
openclaw config get gateway.mode

# 通过向导配置
openclaw configure --section web
openclaw configure --section gateway
```

## 环境变量

支持在配置中使用环境变量替换：

```json
{
  "auth": {
    "openai": {
      "apiKey": "${OPENAI_API_KEY}"
    }
  }
}
```

## 配置热重载

```json
{
  "gateway": {
    "reload": {
      "enabled": true,
      "debounceMs": 2000
    }
  }
}
```

## 多实例隔离

```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/a.json \
OPENCLAW_STATE_DIR=~/.openclaw-a \
openclaw gateway --port 19001
```

## 严格配置验证

OpenClaw 使用严格的 JSON Schema 验证。未识别的键会导致启动失败。使用 `openclaw doctor` 修复旧配置。

---

> 完整配置文档（48 个配置章节）：[docs.openclaw.ai/zh-CN/gateway/configuration](https://docs.openclaw.ai/zh-CN/gateway/configuration) | [返回文档首页](../doc-hub.html)
