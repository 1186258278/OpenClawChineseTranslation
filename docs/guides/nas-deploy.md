# NAS 部署详解

本文介绍如何在各品牌 NAS 设备上部署 OpenClaw 汉化版。

---

## 通用 Docker 部署步骤

所有支持 Docker 的 NAS 都可以使用以下方式部署：

### 1. 拉取镜像

```bash
# 推荐：Docker Hub（国内加速）
docker pull 1186258278/openclaw-zh:latest

# 备选：GitHub Container Registry
docker pull ghcr.io/1186258278/openclaw-zh:latest
```

### 2. 创建并启动容器

```bash
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  --restart unless-stopped \
  1186258278/openclaw-zh:latest \
  openclaw gateway run
```

### 3. 初始化配置

```bash
# 进入容器执行初始化
docker exec -it openclaw openclaw setup

# 设置网关模式
docker exec openclaw openclaw config set gateway.mode local

# 设置局域网访问
docker exec openclaw openclaw config set gateway.bind lan

# 设置访问密码（必须）
docker exec openclaw openclaw config set gateway.auth.token 你的密码

# 重启生效
docker restart openclaw
```

### 4. 访问 Dashboard

在浏览器中打开 `http://NAS的IP:18789`，在「网关令牌」输入框中填入你设置的密码。

---

## 飞牛 NAS (fnOS)

### 通过 Docker 管理界面

1. 打开 **Docker** 应用 → **仓库** → 搜索 `1186258278/openclaw-zh`
2. 点击**下载** → 选择 `latest` 标签
3. 下载完成后进入 **镜像** → 找到镜像 → 点击**创建容器**
4. 配置容器：
   - **容器名称**: `openclaw`
   - **端口映射**: 主机端口 `18789` → 容器端口 `18789`
   - **存储卷**: 创建新卷 `openclaw-data` 挂载到 `/root/.openclaw`
   - **命令**: `openclaw gateway run`
   - **重启策略**: 除非手动停止
5. 启动容器
6. 进入容器终端，执行初始化命令（参考上方第 3 步）

### 通过 SSH

```bash
# SSH 登录到飞牛 NAS
ssh root@NAS的IP

# 执行通用 Docker 部署步骤
docker pull 1186258278/openclaw-zh:latest
docker run -d --name openclaw -p 18789:18789 \
  -v openclaw-data:/root/.openclaw --restart unless-stopped \
  1186258278/openclaw-zh:latest openclaw gateway run

# 初始化
docker exec -it openclaw openclaw setup
docker exec openclaw openclaw config set gateway.mode local
docker exec openclaw openclaw config set gateway.bind lan
docker exec openclaw openclaw config set gateway.auth.token 你的密码
docker restart openclaw
```

---

## 群晖 (Synology)

### DSM 7.x Container Manager

1. 打开 **Container Manager** → **注册表** → 搜索 `1186258278/openclaw-zh`
2. 下载 `latest` 标签
3. 进入 **映像** → 选择镜像 → **运行**
4. 配置：
   - **端口设置**: 本地端口 `18789` → 容器端口 `18789`
   - **存储空间**: 新建文件夹 `/docker/openclaw` → 挂载到 `/root/.openclaw`
   - **执行命令**: `openclaw gateway run`
5. 启动后通过 SSH 进入容器初始化

### DSM 6.x Docker

操作类似，界面在 **Docker** 套件中。

### 权限问题处理

群晖默认以 root 运行 Docker 容器，如遇权限问题：

```bash
# 确保挂载目录权限正确
sudo chown -R 1000:1000 /volume1/docker/openclaw
```

---

## 威联通 (QNAP)

### Container Station

1. 打开 **Container Station** → **创建** → **搜索**
2. 搜索 `1186258278/openclaw-zh` → 选择 `latest`
3. 配置端口映射和存储卷（同通用步骤）
4. 启动后通过 SSH 初始化

---

## iStoreOS

iStoreOS 基于 OpenWrt，可通过 Docker 部署。

### 前提

确保已安装 Docker 插件：
1. 打开 **iStore** → 搜索 **Docker** → 安装
2. 或通过 SSH 安装：`opkg install docker`

### 部署

```bash
# SSH 登录路由器
ssh root@192.168.1.1

# 拉取镜像
docker pull 1186258278/openclaw-zh:latest

# 创建容器
docker run -d --name openclaw -p 18789:18789 \
  -v /opt/openclaw:/root/.openclaw --restart unless-stopped \
  1186258278/openclaw-zh:latest openclaw gateway run

# 初始化
docker exec -it openclaw openclaw setup
docker exec openclaw openclaw config set gateway.mode local
docker exec openclaw openclaw config set gateway.bind lan
docker exec openclaw openclaw config set gateway.auth.token 你的密码
docker restart openclaw
```

> **注意**: iStoreOS 路由器通常内存有限（1-4GB），运行 OpenClaw 可能需要至少 2GB 可用内存。

---

## Docker Compose 部署（所有 NAS 通用）

创建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  openclaw:
    image: 1186258278/openclaw-zh:latest
    container_name: openclaw
    ports:
      - "18789:18789"
    volumes:
      - openclaw-data:/root/.openclaw
    restart: unless-stopped
    command: openclaw gateway run
    environment:
      - NODE_OPTIONS=--max-old-space-size=2048

volumes:
  openclaw-data:
```

```bash
# 启动
docker-compose up -d

# 初始化
docker-compose exec openclaw openclaw setup
docker-compose exec openclaw openclaw config set gateway.mode local
docker-compose exec openclaw openclaw config set gateway.bind lan
docker-compose exec openclaw openclaw config set gateway.auth.token 你的密码
docker-compose restart openclaw
```

---

## 常见问题

### 镜像拉取失败

```bash
# 国内拉取 ghcr.io 可能很慢，用 Docker Hub 镜像
docker pull 1186258278/openclaw-zh:latest

# 或配置 Docker 镜像加速器
# 编辑 /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://hub-mirror.c.163.com"
  ]
}
# 重启 Docker
systemctl restart docker
```

### 容器内无法访问外网

NAS Docker 网络模式可能需要设置为 `bridge` 或 `host`。如果使用 `host` 模式：

```bash
docker run -d --name openclaw --network host \
  -v openclaw-data:/root/.openclaw --restart unless-stopped \
  1186258278/openclaw-zh:latest openclaw gateway run
```

### 更新到最新版

```bash
docker pull 1186258278/openclaw-zh:latest
docker stop openclaw && docker rm openclaw
# 重新创建容器（数据在 volume 中不会丢失）
docker run -d --name openclaw -p 18789:18789 \
  -v openclaw-data:/root/.openclaw --restart unless-stopped \
  1186258278/openclaw-zh:latest openclaw gateway run
```

---

> 返回 [文档首页](../doc-hub.html) | [Docker 部署指南](../DOCKER_GUIDE.md) | [常见问题](../FAQ.md)
