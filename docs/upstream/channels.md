# 聊天渠道

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/channels)，已针对汉化版进行本地化。

---

## 支持的渠道

### 内置渠道

| 渠道 | 说明 | 配置方式 |
|------|------|---------|
| **WhatsApp** | 最受欢迎；使用 Baileys，需要二维码配对 | `openclaw channels login` |
| **Telegram** | 通过 grammY 使用 Bot API；支持群组 | 需要 Bot Token |
| **Discord** | Bot API + Gateway；支持服务器、频道和私信 | 需要 Bot Token |
| **Slack** | Bolt SDK；工作区应用 | Socket 模式 |
| **Signal** | signal-cli；注重隐私 | 需要 signal-cli |
| **Google Chat** | 通过 HTTP webhook 的 Google Chat API | webhook 配置 |
| **BlueBubbles** | 推荐用于 iMessage；功能完整 | 需要 BlueBubbles macOS 服务器 |
| **iMessage（旧版）** | 通过 imsg CLI 的旧版 macOS 集成 | 已弃用，推荐 BlueBubbles |
| **WebChat** | 基于 WebSocket 的 Gateway WebChat 界面 | 内置 |

### 插件渠道（需单独安装）

| 渠道 | 说明 |
|------|------|
| **飞书** | 飞书（Lark）机器人 |
| **LINE** | LINE Messaging API 机器人 |
| **Matrix** | Matrix 协议 |
| **Mattermost** | Bot API + WebSocket |
| **Microsoft Teams** | Bot Framework；企业支持 |
| **Nextcloud Talk** | 通过 Nextcloud Talk 的自托管聊天 |
| **Nostr** | 通过 NIP-04 的去中心化私信 |
| **Tlon** | 基于 Urbit 的消息应用 |
| **Twitch** | 通过 IRC 连接的 Twitch 聊天 |
| **Zalo** | Zalo Bot API（越南流行） |
| **Zalo Personal** | 通过二维码登录的 Zalo 个人账号 |

## 快速配置

### WhatsApp

```bash
openclaw channels login
# 扫描终端中显示的二维码
```

### Telegram

```bash
# 在 @BotFather 中创建机器人，获取 Token
openclaw onboard
# 选择 Telegram，输入 Bot Token
```

### Discord

```bash
# 在 Discord Developer Portal 创建应用，获取 Bot Token
openclaw onboard
# 选择 Discord，输入 Bot Token
```

### 飞书

```bash
# 安装飞书插件
openclaw onboard
# 选择安装飞书插件
```

> 飞书详细配置请参考 [飞书渠道配置](../guides/feishu.md)

## 渠道状态检查

```bash
# 查看所有渠道状态
openclaw channels status --probe

# 查看特定渠道
openclaw channels status whatsapp
```

## 注意事项

- 每个渠道都有独立的配置部分，在 `openclaw.json` 的 `channels` 下
- 私信安全通过配对审批机制控制
- 群组消息可以通过提及门控（`mentionPatterns`）控制
- 多账号支持：每个渠道可以配置多个账号

---

> 各渠道详细文档：[官方渠道文档](https://docs.openclaw.ai/zh-CN/channels) | [返回文档首页](../doc-hub.html)
