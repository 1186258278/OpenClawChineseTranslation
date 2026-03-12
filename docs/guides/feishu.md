# 飞书渠道配置指南

飞书（Lark）是 OpenClaw 支持的插件渠道之一，本文介绍如何完整配置飞书机器人。

---

## 前提条件

- 已安装 OpenClaw 汉化版并完成初始化
- 拥有飞书管理员账号（用于创建应用）
- Gateway 网关正在运行

## 第一步：创建飞书应用

1. 访问 [飞书开放平台](https://open.feishu.cn/app) → 点击「创建企业自建应用」
2. 填写应用名称（如 "OpenClaw 助手"）和描述
3. 进入应用设置，记下以下信息：
   - **App ID**
   - **App Secret**

## 第二步：配置应用能力

### 启用机器人

1. 在应用管理页 → 「应用能力」→ 「机器人」→ 开启
2. 设置机器人名称和头像

### 配置事件订阅

1. 进入「事件订阅」页面
2. 设置请求地址（Webhook URL）：
   ```
   http://你的服务器IP:18789/webhooks/feishu
   ```
   > 飞书需要能访问到你的 Gateway 地址。如果是内网部署，需要通过 Nginx 反代或 Tailscale 暴露。

3. 添加以下事件：
   - `im.message.receive_v1`（接收消息）
   - `im.message.message_read_v1`（消息已读，可选）

### 配置权限

进入「权限管理」，添加以下权限：
- `im:message`（发送消息）
- `im:message:send_as_bot`（以机器人身份发送）
- `im:chat`（获取会话信息）
- `im:resource`（获取资源文件）

## 第三步：安装飞书插件

```bash
# 通过 onboard 安装（推荐）
openclaw onboard
# 在插件选择中勾选「飞书 (Feishu)」

# 或手动安装
openclaw plugins install feishu
```

> 安装时可能出现安全警告，这是正常的——插件需要访问环境变量和网络来与飞书 API 通信。

## 第四步：配置飞书凭证

```bash
# 设置飞书 App ID 和 App Secret
openclaw config set channels.feishu.appId 你的AppID
openclaw config set channels.feishu.appSecret 你的AppSecret

# 或通过环境变量
export FEISHU_APP_ID=你的AppID
export FEISHU_APP_SECRET=你的AppSecret
```

## 第五步：发布应用

1. 回到飞书开放平台 → 「版本管理」→ 「创建版本」
2. 填写更新说明 → 提交审核
3. 审核通过后，企业成员即可在飞书中搜索并使用机器人

## 第六步：验证

```bash
# 检查飞书渠道状态
openclaw channels status feishu

# 重启 Gateway 生效
openclaw gateway restart
```

在飞书中找到机器人，发送一条消息，应该能收到 AI 回复。

---

## 飞书多维表格（Bitable）

OpenClaw 的飞书插件还支持多维表格功能，可以让 AI 读写飞书多维表格。

### 启用

在 `openclaw.json` 中配置：
```json
{
  "plugins": {
    "feishu": {
      "bitable": {
        "enabled": true
      }
    }
  }
}
```

### 使用

在对话中告诉 AI：
- "帮我读取多维表格 xxx 的数据"
- "在多维表格中新增一行记录"
- "更新多维表格中的某个字段"

---

## 常见问题

### 插件安装后报 `Cannot find module 'lodash.identity'`

```bash
cd ~/.openclaw/extensions/feishu
npm install
```

### 飞书 Webhook 验证失败

确保：
1. Webhook URL 是飞书可以访问的公网地址
2. Gateway 已启动且端口开放
3. 如果在 Docker 中，确保端口映射正确

### 机器人收不到消息

检查：
1. 应用是否已发布（审核通过）
2. 事件订阅是否正确配置
3. 权限是否已全部授予
4. Gateway 日志：`openclaw logs --follow`

### Docker 环境配置

```bash
docker exec openclaw openclaw config set channels.feishu.appId 你的AppID
docker exec openclaw openclaw config set channels.feishu.appSecret 你的AppSecret
docker restart openclaw
```

---

> 官方飞书文档：[docs.openclaw.ai/zh-CN/channels/feishu](https://docs.openclaw.ai/zh-CN/channels/feishu) | [返回文档首页](../doc-hub.html)
