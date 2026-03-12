# 国内网络问题排查

本文针对中国大陆用户在安装和使用 OpenClaw 时常见的网络问题提供解决方案。

---

## npm 安装慢 / 卡住

### 方案1：使用淘宝镜像源（推荐）

```bash
# 临时使用（推荐，不影响全局配置）
npm install -g @qingchencloud/openclaw-zh@latest --registry=https://registry.npmmirror.com

# 永久切换（影响所有 npm 操作）
npm config set registry https://registry.npmmirror.com
npm install -g @qingchencloud/openclaw-zh@latest
```

### 方案2：使用汉化版安装脚本

汉化版安装脚本会自动检测中国大陆环境并使用淘宝镜像：

```bash
# Linux / macOS
curl -fsSL https://openclaw.qt.cool/install.sh | bash

# Windows (PowerShell)
irm https://openclaw.qt.cool/install.ps1 | iex
```

### 方案3：配置代理

```bash
# HTTP 代理
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890

# SOCKS5 代理
npm config set proxy socks5://127.0.0.1:1080
npm config set https-proxy socks5://127.0.0.1:1080

# 取消代理
npm config delete proxy
npm config delete https-proxy
```

---

## Node.js 安装慢

### 使用淘宝 Node.js 镜像

```bash
# NVM 用户
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
nvm install 22

# 直接下载
# 访问 https://npmmirror.com/mirrors/node/ 下载对应系统的安装包
```

### Windows 用户

直接从 [nodejs.org](https://nodejs.org/) 下载 LTS 安装包，国内通常可以正常访问。

---

## Docker 镜像拉取慢

### 使用 Docker Hub 镜像（推荐）

```bash
# Docker Hub（国内加速更好）
docker pull 1186258278/openclaw-zh:latest

# 而不是 ghcr.io（国内访问慢）
# docker pull ghcr.io/1186258278/openclaw-zh:latest
```

### 配置 Docker 镜像加速器

编辑 `/etc/docker/daemon.json`：

```json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://hub-mirror.c.163.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

```bash
# 重启 Docker
sudo systemctl restart docker
```

### NAS 用户

各 NAS 品牌的 Docker 镜像加速配置方式不同：
- **群晖**：Container Manager → 注册表 → 设置 → 添加镜像加速地址
- **飞牛**：Docker → 设置 → 镜像加速 → 添加镜像地址
- **威联通**：Container Station → 首选项 → Registry

---

## GitHub 访问问题

### git clone 超时

```bash
# 方案1：使用 git 代理
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 方案2：使用 GitHub 镜像（如 ghproxy）
git clone https://ghproxy.com/https://github.com/openclaw/openclaw.git

# 方案3：SSH 转 HTTPS
git config --global url."https://github.com/".insteadOf ssh://git@github.com/
```

### npm 安装时 git 报错 Permission denied

```bash
# 让 git 把 SSH 地址自动转成 HTTPS
git config --global url."https://github.com/".insteadOf ssh://git@github.com/
```

---

## API 调用问题

### 国际 AI 模型 API 无法访问

部分国际 AI 模型的 API（如 OpenAI、Anthropic）在国内可能无法直接访问。解决方案：

1. **使用国产模型**（推荐）：
   - 胜算云（聚合平台，国内直连）
   - 通义千问、Kimi、MiniMax、智谱等
   - 参考 [国产模型配置指南](models-cn.md)

2. **使用 API 中转服务**：
   ```bash
   openclaw config set auth.openai.baseURL https://你的中转站地址/v1
   openclaw config set auth.openai.apiKey sk-你的中转站密钥
   ```

3. **使用 Ollama 本地模型**：
   ```bash
   ollama pull qwen2.5:14b
   openclaw config set agents.defaults.model openai/qwen2.5:14b
   openclaw config set auth.openai.baseURL http://localhost:11434/v1
   openclaw config set auth.openai.apiKey ollama
   ```

---

## DNS 问题

如果遇到域名解析失败：

```bash
# 临时使用公共 DNS
echo "nameserver 223.5.5.5" | sudo tee /etc/resolv.conf    # 阿里 DNS
echo "nameserver 119.29.29.29" | sudo tee -a /etc/resolv.conf  # 腾讯 DNS
```

Windows 用户在网络设置中将 DNS 改为 `223.5.5.5`（阿里）或 `119.29.29.29`（腾讯）。

---

## 网络诊断命令

```bash
# 测试 npm registry 连通性
curl -I https://registry.npmmirror.com/@qingchencloud/openclaw-zh/latest

# 测试 Docker Hub
curl -I https://hub.docker.com/v2/repositories/1186258278/openclaw-zh/tags/latest

# 测试 GitHub API
curl -I https://api.github.com

# 测试 OpenClaw 官网
curl -I https://openclaw.qt.cool
```

---

> 返回 [文档首页](../doc-hub.html) | [安装指南](../INSTALL_GUIDE.md) | [常见问题](../FAQ.md)
