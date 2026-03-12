# 入门指南

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/start/getting-started)，已针对汉化版进行本地化。

---

## 0) 前置条件

- **Node.js >= 22**
- pnpm（可选；如果从源代码构建则推荐）
- **推荐**：Brave Search API 密钥用于网页搜索。最简单的方式：`openclaw configure --section web`（存储 `tools.web.search.apiKey`）。参见 [Web 工具](https://docs.openclaw.ai/zh-CN/tools/web)。

> Windows 用户请参考 [Windows (WSL2) 指南](https://docs.openclaw.ai/zh-CN/platforms/windows)

## 1) 安装 CLI（推荐）

```bash
# 汉化版安装（推荐）
npm install -g @qingchencloud/openclaw-zh@latest

# 国内用户加速
npm install -g @qingchencloud/openclaw-zh@latest --registry=https://registry.npmmirror.com
```

> 更多安装方式参见 [安装指南](../INSTALL_GUIDE.md)

## 2) 运行新手引导向导（并安装服务）

```bash
openclaw onboard --install-daemon
```

向导将引导你完成：
- **本地 vs 远程** Gateway 网关
- **认证**：OpenAI Codex 订阅（OAuth）或 API 密钥。对于 Anthropic 推荐 API 密钥；也支持 `claude setup-token`。
- **提供商**：WhatsApp QR 登录、Telegram/Discord 机器人令牌等。
- **守护进程**：后台安装（launchd/systemd；WSL2 使用 systemd）

### 凭证：存储位置（重要）

| 凭证类型 | 存储路径 |
|---------|---------|
| OAuth 凭证（旧版导入） | `~/.openclaw/credentials/oauth.json` |
| 认证配置文件（OAuth + API 密钥） | `~/.openclaw/agents/<agentId>/agent/auth-profiles.json` |

## 3) 启动 Gateway 网关

```bash
# 检查状态
openclaw gateway status

# 启动（前台，带详细日志）
openclaw gateway --port 18789 --verbose
```

启动后访问 [http://127.0.0.1:18789/](http://127.0.0.1:18789/) 打开 Dashboard。

## 3.5) 快速验证（2 分钟）

```bash
openclaw status
openclaw health
openclaw security audit --deep
```

## 4) 配对 + 连接你的第一个聊天界面

### WhatsApp（QR 登录）

```bash
openclaw channels login
```

> 详细配置参见 [WhatsApp 渠道](https://docs.openclaw.ai/zh-CN/channels/whatsapp)

### Telegram / Discord / 其他

- [Telegram](https://docs.openclaw.ai/zh-CN/channels/telegram) — 需要 Bot Token
- [Discord](https://docs.openclaw.ai/zh-CN/channels/discord) — 需要 Bot Token
- [Mattermost](https://docs.openclaw.ai/zh-CN/channels/mattermost) — 插件模式

## 5) 私信安全（配对审批）

```bash
openclaw pairing list whatsapp
openclaw pairing approve whatsapp <code>
```

> 详细配对说明参见 [配对指南](https://docs.openclaw.ai/zh-CN/channels/pairing)

## 6) 从源代码安装（开发）

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build   # 首次运行时自动安装 UI 依赖
pnpm build
openclaw onboard --install-daemon
```

开发模式下使用 `pnpm openclaw ...` 代替 `openclaw ...`。

## 7) 验证端到端

```bash
# 发送测试消息
openclaw message send --target +15555550123 --message "Hello from OpenClaw"

# 检查健康状态
openclaw health
openclaw status --all
```

## 下一步（可选，但很棒）

- **macOS 菜单栏应用** + 语音唤醒：[macOS 应用](https://docs.openclaw.ai/zh-CN/platforms/macos)
- **iOS/Android 节点**（Canvas/相机/语音）：[节点](https://docs.openclaw.ai/zh-CN/nodes)
- **远程访问**（SSH 隧道 / Tailscale Serve）：[远程访问](https://docs.openclaw.ai/zh-CN/gateway/remote) 和 [Tailscale](https://docs.openclaw.ai/zh-CN/gateway/tailscale)
- **完整功能列表**：[功能](https://docs.openclaw.ai/zh-CN/concepts/features)

---

> 返回 [文档首页](../doc-hub.html) | [安装指南](../INSTALL_GUIDE.md) | [常见问题](../FAQ.md)
