# 安全性 🔒

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/gateway/security)，已针对汉化版进行本地化。

---

## 快速检查

```bash
openclaw security audit
openclaw security audit --deep
openclaw security audit --fix    # 自动修复常见安全问题
```

`--fix` 会自动执行以下修复：
- 将 `groupPolicy="open"` 收紧为 `groupPolicy="allowlist"`
- 将 `logging.redactSensitive="off"` 恢复为 `"tools"`
- 收紧本地权限（`~/.openclaw` → 700，配置文件 → 600）

## 安全审计清单

1. **任何"开放" + 启用工具的情况**：首先锁定私信/群组（配对/白名单），然后收紧工具策略/沙箱隔离
2. **公共网络暴露**（局域网绑定、缺少认证）：立即修复
3. **浏览器控制远程暴露**：将其视为操作员访问权限（仅限 tailnet、有意配对节点）
4. **权限**：确保状态/配置/凭证文件不是组/全局可读的
5. **插件/扩展**：只加载你明确信任的内容
6. **模型选择**：对于带工具的机器人，优先使用经过指令强化的模型

## 核心概念：访问控制优先于智能

1. **身份优先**：决定谁可以与机器人交谈（私信配对/白名单/显式"开放"）
2. **范围其次**：决定机器人被允许在哪里执行操作（群组白名单 + 提及门控、工具、沙箱）
3. **模型最后**：假设模型可以被操纵；设计时让操纵的影响范围有限

## 凭证存储映射

| 凭证类型 | 存储路径 |
|---------|---------|
| WhatsApp | `~/.openclaw/credentials/whatsapp/<accountId>/creds.json` |
| Telegram 机器人令牌 | 配置/环境变量或 `channels.telegram.tokenFile` |
| Discord 机器人令牌 | 配置/环境变量 |
| Slack 令牌 | 配置/环境变量（`channels.slack.*`） |
| 配对白名单 | `~/.openclaw/credentials/<channel>-allowFrom.json` |
| 模型认证配置 | `~/.openclaw/agents/<agentId>/agent/auth-profiles.json` |

## 通过 HTTP 访问控制 UI

- `gateway.controlUi.allowInsecureAuth` — 允许非 HTTPS 访问（仅限 `127.0.0.1`）
- `gateway.controlUi.dangerouslyDisableDeviceAuth` — 危险：禁用设备认证

> 使用 `openclaw security audit` 检查当前安全配置。

## 反向代理配置

```json
{
  "gateway": {
    "trustedProxies": ["127.0.0.1"],
    "auth": {
      "mode": "password",
      "password": "${OPENCLAW_GATEWAY_PASSWORD}"
    }
  }
}
```

> 必须设置 `trustedProxies` 才能正确处理 `X-Forwarded-For` 和 `X-Real-IP` 头。

## 威胁模型

AI 智能体可能：
- 执行任意 shell 命令
- 读写文件
- 访问网络服务
- 向任何人发送消息（如果给了 WhatsApp 访问权限）
- 试图欺骗你的 AI 做坏事（提示词注入）
- 社会工程获取你的数据访问权限

## 节点执行（system.run）

- 需要节点配对（批准 + 令牌）
- 在 Mac 上通过设置 → Exec 批准控制（安全 + 询问 + 白名单）
- 不想要远程执行？将安全设置为拒绝并移除节点配对

## 事件响应（如果你怀疑被入侵）

1. **遏制**：停止 Gateway、断开网络
2. **轮换**：如果秘密泄露则假设被入侵，轮换所有 API 密钥
3. **审计**：检查日志、会话记录
4. **报告**：收集相关信息

---

> 完整安全文档：[docs.openclaw.ai/zh-CN/gateway/security](https://docs.openclaw.ai/zh-CN/gateway/security) | [返回文档首页](../doc-hub.html)
