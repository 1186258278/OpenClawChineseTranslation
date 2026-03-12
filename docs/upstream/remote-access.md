# 远程访问（SSH、隧道和 tailnet）

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/gateway/remote)，已针对汉化版进行本地化。

---

## 核心理念

- Gateway WebSocket 绑定到你配置端口的 loopback（默认为 18789）。
- 对于远程使用，你通过 SSH 转发该 loopback 端口（或使用 tailnet/VPN 减少隧道需求）。

## SSH 隧道（CLI + 工具）

```bash
ssh -N -L 18789:127.0.0.1:18789 user@host
```

- `openclaw health` 和 `openclaw status --deep` 现在通过 `ws://127.0.0.1:18789` 访问远程 Gateway 网关。
- `openclaw gateway {status,health,send,agent,call}` 在需要时也可以通过 `--url` 指定转发的 URL。

端口可通过以下方式自定义：
- 配置文件：`gateway.port`
- 命令行：`--port`
- 环境变量：`OPENCLAW_GATEWAY_PORT`

## CLI 远程默认值

```json
{
  "gateway": {
    "mode": "remote",
    "remote": {
      "url": "ws://127.0.0.1:18789",
      "token": "your-token"
    }
  }
}
```

## 通过 SSH 的聊天 UI

1. 通过 SSH 转发 18789（见上文）
2. 让客户端连接到 `ws://127.0.0.1:18789`
3. 在 macOS 上，优先使用应用的 "Remote over SSH" 模式，它会自动管理隧道

## 命令流（什么在哪里运行）

1. Telegram 消息到达 Gateway 网关
2. Gateway 网关运行智能体并决定是否调用节点工具
3. Gateway 网关通过 WebSocket 调用节点（`node.*` RPC）
4. 节点返回结果；Gateway 网关回复到 Telegram

> **注意**：节点不运行 Gateway 网关服务。除非你有意运行隔离的配置文件，否则每台主机只应运行一个 Gateway 网关。

## 安全规则（远程/VPN）

- **Loopback + SSH/Tailscale Serve** 是最安全的默认设置（无公开暴露）
- **非 loopback 绑定**（lan/tailnet/custom）必须使用身份验证令牌/密码
- `gateway.remote.token` 仅用于远程 CLI 调用——不启用本地身份验证
- `gateway.remote.tlsFingerprint` 在使用 `wss://` 时固定远程 TLS 证书
- 当 `gateway.auth.allowTailscale: true` 时，Tailscale Serve 可以通过身份标头进行身份验证
- 将浏览器控制视为操作员访问：仅限 tailnet + 有意的节点配对

---

> 更多信息：[安全配置](https://docs.openclaw.ai/zh-CN/gateway/security) | [远程 Gateway 设置](https://docs.openclaw.ai/zh-CN/gateway/remote-gateway-readme) | [返回文档首页](../doc-hub.html)
