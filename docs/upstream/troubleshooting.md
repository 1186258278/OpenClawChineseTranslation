# 故障排除 🔧

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/gateway/troubleshooting)，已针对汉化版进行本地化。
> 更多国内用户常见问题请参考 [常见问题 FAQ](../FAQ.md)。

---

## 状态与诊断

```bash
# 基本状态
openclaw status

# 完整状态
openclaw status --all

# 深度状态（连接 Gateway）
openclaw status --deep

# 网关探测
openclaw gateway probe

# 渠道状态
openclaw channels status --probe

# 网关状态
openclaw gateway status

# 实时日志
openclaw logs --follow
```

> 隐藏敏感信息：`OPENCLAW_SHOW_SECRETS=0`

## 常见问题

### No API key found for provider "anthropic"

API 密钥未配置。运行向导重新配置：

```bash
openclaw onboard
```

### OAuth token refresh failed（Anthropic Claude 订阅）

OAuth 令牌过期。重新认证：

```bash
openclaw onboard --auth-choice apiKey
```

### Control UI 在 HTTP 上失败（"device identity required"）

通过非 HTTPS 访问 Dashboard 时的安全限制。解决方案：

```bash
# 方案1：设置 Token 认证（最简单）
openclaw config set gateway.auth.token 你的密码

# 方案2：SSH 端口转发
ssh -L 18789:127.0.0.1:18789 user@服务器IP
# 然后访问 http://localhost:18789
```

### "Gateway start blocked: set gateway.mode=local"

网关模式未设置：

```bash
openclaw config set gateway.mode local
```

### 服务运行但端口未监听

检查绑定配置：

```bash
openclaw config get gateway.bind
# 如果需要局域网访问
openclaw config set gateway.bind lan
```

### 地址已被使用（端口 18789）

```bash
# 查找占用端口的进程
# Linux/macOS
lsof -i :18789
# Windows
netstat -ano | findstr 18789

# 使用不同端口
openclaw gateway --port 19000
```

### "Agent failed before reply: Unknown model"

模型名称错误或提供商未配置：

```bash
# 查看当前模型
openclaw config get agents.defaults.model

# 查看可用模型
openclaw models list
```

### 消息未触发

检查：
1. 渠道是否连接：`openclaw channels status --probe`
2. 配对是否完成：`openclaw pairing list whatsapp`
3. 白名单是否正确：检查 `channels.whatsapp.allowFrom`
4. 群组是否需要提及：检查 `messages.groupChat.mentionPatterns`

### 高内存使用

```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" openclaw gateway run
```

Docker 环境：
```yaml
environment:
  - NODE_OPTIONS=--max-old-space-size=4096
```

## 调试模式

```bash
# 详细日志
openclaw gateway --verbose

# 查看日志文件
cat ~/.openclaw/logs/gateway.log
```

## 日志位置

| 平台 | 路径 |
|------|------|
| Linux/macOS | `~/.openclaw/logs/` |
| Docker | `/root/.openclaw/logs/` |

## 健康检查

```bash
openclaw health
openclaw doctor
```

## 重置所有内容

```bash
# 备份后重置
cp -r ~/.openclaw ~/.openclaw.backup
rm -rf ~/.openclaw
openclaw onboard --install-daemon
```

## 获取帮助

- [汉化版常见问题 FAQ](../FAQ.md)（推荐，覆盖国内用户常见问题）
- [官方故障排除](https://docs.openclaw.ai/zh-CN/gateway/troubleshooting)
- [GitHub Issues](https://github.com/1186258278/OpenClawChineseTranslation/issues)

---

> 返回 [文档首页](../doc-hub.html) | [常见问题](../FAQ.md) | [安装指南](../INSTALL_GUIDE.md)
