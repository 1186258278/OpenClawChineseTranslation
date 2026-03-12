# 快速开始

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/start/quickstart)，已针对汉化版进行本地化。

---

## 安装

```bash
# 汉化版安装（推荐）
npm install -g @qingchencloud/openclaw-zh@latest

# 国内用户加速
npm install -g @qingchencloud/openclaw-zh@latest --registry=https://registry.npmmirror.com
```

## 新手引导并运行 Gateway 网关

```bash
# 新手引导并安装服务
openclaw onboard --install-daemon

# 配对 WhatsApp
openclaw channels login

# 启动 Gateway 网关
openclaw gateway --port 18789
```

```bash
# 检查状态
openclaw doctor
```

## 从源码安装（开发）

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install
pnpm ui:build   # 首次运行时会自动安装 UI 依赖
pnpm build
openclaw onboard --install-daemon
```

开发模式下使用 `pnpm openclaw ...` 代替 `openclaw ...`。

## 多实例快速开始（可选）

```bash
OPENCLAW_CONFIG_PATH=~/.openclaw/a.json \
OPENCLAW_STATE_DIR=~/.openclaw-a \
openclaw gateway --port 19001
```

## 发送测试消息

```bash
openclaw message send --target +15555550123 --message "Hello from OpenClaw"
```

---

> 更多详情请参考 [完整入门指南](getting-started.md) | [返回文档首页](../doc-hub.html)
