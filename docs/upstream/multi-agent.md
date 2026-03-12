# 多智能体路由

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/concepts/multi-agent)，已针对汉化版进行本地化。

---

## 什么是"一个智能体"？

每个智能体包含：
- **工作区** — 文件、AGENTS.md/SOUL.md/USER.md、本地笔记、人设规则
- **状态目录**（agentDir）— 认证配置文件、模型注册表和每智能体配置
- **会话存储** — 聊天历史 + 路由状态（`~/.openclaw/agents/<agentId>/sessions`）

## 路径映射

| 项目 | 路径 | 环境变量 |
|------|------|---------|
| 配置 | `~/.openclaw/openclaw.json` | `OPENCLAW_CONFIG_PATH` |
| 状态目录 | `~/.openclaw` | `OPENCLAW_STATE_DIR` |
| 工作区 | `~/.openclaw/workspace` | — |
| 智能体目录 | `~/.openclaw/agents/<agentId>/agent` | `agents.list[].agentDir` |
| 会话 | `~/.openclaw/agents/<agentId>/sessions` | — |

## 添加智能体

```bash
openclaw agents add work
openclaw agents list --bindings
```

## 多个智能体 = 多个人、多种人格

每个智能体可以有：
- 不同的电话号码/账户（每渠道 accountId）
- 不同的人格（每智能体工作区文件如 AGENTS.md 和 SOUL.md）
- 独立的认证 + 会话

## 路由规则（消息如何选择智能体）

优先级从高到低：
1. **peer 匹配** — 精确私信/群组/频道 id
2. **guildId** — Discord 服务器
3. **teamId** — Slack 工作区
4. **accountId 匹配** — 渠道账户
5. **渠道级匹配** — `accountId: "*"`
6. **回退到默认** — `agents.list[].default`，否则列表中第一个（默认：main）

## 配置示例：一个 WhatsApp 号码，多个人

```json
{
  "agents": {
    "list": [
      { "id": "alex", "workspace": "~/.openclaw/workspace-alex" },
      { "id": "mia", "workspace": "~/.openclaw/workspace-mia" }
    ]
  },
  "bindings": [
    { "agentId": "alex", "match": { "channel": "whatsapp", "peer": { "kind": "dm", "id": "+15551230001" } } },
    { "agentId": "mia", "match": { "channel": "whatsapp", "peer": { "kind": "dm", "id": "+15551230002" } } }
  ],
  "channels": {
    "whatsapp": {
      "dmPolicy": "allowlist",
      "allowFrom": ["+15551230001", "+15551230002"]
    }
  }
}
```

## 核心概念

| 概念 | 说明 |
|------|------|
| **agentId** | 一个"大脑"（工作区、认证、会话存储） |
| **accountId** | 一个渠道账户实例（如 WhatsApp "personal" vs "biz"） |
| **binding** | 通过 (channel, accountId, peer) 将入站消息路由到 agentId |

---

> 完整文档：[docs.openclaw.ai/zh-CN/concepts/multi-agent](https://docs.openclaw.ai/zh-CN/concepts/multi-agent) | [返回文档首页](../doc-hub.html)
