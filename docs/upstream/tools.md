# 工具（OpenClaw）

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/tools)，已针对汉化版进行本地化。

---

## 工具清单

| 工具 | 说明 | 配置项 |
|------|------|--------|
| **apply_patch** | 应用代码补丁 | `tools.exec.applyPatch.enabled` |
| **exec** | 执行 Shell 命令 | `tools.exec` |
| **process** | 管理后台进程（轮询/日志/终止） | 与 exec 关联 |
| **web_search** | 网页搜索（需要 Brave API） | `tools.web.search` |
| **web_fetch** | 抓取网页内容 | `tools.web.fetch` |
| **browser** | 浏览器自动化（CDP） | `browser` |
| **canvas** | Canvas 画布（需要节点） | 需要 iOS/macOS 节点 |
| **nodes** | 节点操作 | 需要配对的节点 |
| **image** | 图片生成/处理 | 需要模型支持 |
| **message** | 发送消息到渠道 | 内置 |
| **cron** | 定时任务 | `cron` |
| **gateway** | Gateway 网关操作 | 内置 |
| **sessions** | 会话管理 | 内置 |

## exec 命令执行

```bash
# 配置执行安全级别
openclaw config set tools.exec.security full     # 完全访问
openclaw config set tools.exec.security allowlist # 白名单模式
openclaw config set tools.exec.security deny      # 禁止执行
```

参数说明：
- **command**（必需）— 要执行的命令
- **yieldMs** — 超时后自动后台运行（默认 10000ms）
- **background** — 立即后台运行
- **timeout** — 超时秒数（默认 1800）
- **elevated** — 提升权限（仅沙箱模式有效）
- **host** — 执行位置（sandbox / gateway / node）
- **security** — 安全级别（deny / allowlist / full）

## web_search 网页搜索

需要 Brave Search API 密钥：

```bash
# 配置方式1：通过向导
openclaw configure --section web

# 配置方式2：手动设置
openclaw config set tools.web.search.enabled true
openclaw config set tools.web.search.apiKey 你的BraveAPIKey

# 或通过环境变量
export BRAVE_API_KEY=你的BraveAPIKey
```

## web_fetch 网页抓取

```bash
openclaw config set tools.web.fetch.enabled true
```

> 对于 JS 密集型网站，推荐使用 browser 工具代替 web_fetch。

## 禁用工具

```json
{
  "agents": {
    "defaults": {
      "tools": {
        "exec": { "enabled": false },
        "web": { "search": { "enabled": false } }
      }
    }
  }
}
```

## 工具安全性

- exec 工具受 `tools.exec.security` 和 `tools.elevated` 双重门控
- 后台进程按智能体作用域隔离
- Gateway/节点审批可通过 Dashboard 的执行审批面板管理

---

> 完整工具文档：[docs.openclaw.ai/zh-CN/tools](https://docs.openclaw.ai/zh-CN/tools) | [返回文档首页](../doc-hub.html)
