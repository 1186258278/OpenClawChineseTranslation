# Docker 部署（官方）

> 本文档来源于 [官方文档](https://docs.openclaw.ai/zh-CN/install/docker)，已针对汉化版进行本地化。
> 汉化版的详细 Docker 部署教程请参考 [Docker 部署指南](../DOCKER_GUIDE.md)。

---

## 汉化版 Docker 镜像

```bash
# Docker Hub（国内推荐）
docker pull 1186258278/openclaw-zh:latest

# GitHub Container Registry
docker pull ghcr.io/1186258278/openclaw-zh:latest
```

## 快速部署

```bash
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/root/.openclaw \
  --restart unless-stopped \
  1186258278/openclaw-zh:latest \
  openclaw gateway run
```

## 初始化

```bash
# 进入容器执行初始化
docker exec -it openclaw openclaw setup

# 设置网关模式
docker exec openclaw openclaw config set gateway.mode local

# 设置局域网访问
docker exec openclaw openclaw config set gateway.bind lan

# 设置访问密码
docker exec openclaw openclaw config set gateway.auth.token 你的密码

# 重启生效
docker restart openclaw
```

## Docker Compose

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

## 更新

```bash
docker pull 1186258278/openclaw-zh:latest
docker stop openclaw && docker rm openclaw
docker run -d --name openclaw -p 18789:18789 \
  -v openclaw-data:/root/.openclaw --restart unless-stopped \
  1186258278/openclaw-zh:latest openclaw gateway run
```

> 数据在 named volume 中不会丢失。

## 国内镜像加速

如果拉取 `ghcr.io` 很慢，使用 Docker Hub 镜像：

```bash
docker pull 1186258278/openclaw-zh:latest
```

或配置 Docker 镜像加速器：

```json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://hub-mirror.c.163.com"
  ]
}
```

---

> 汉化版详细部署教程：[Docker 部署指南](../DOCKER_GUIDE.md) | NAS 部署：[NAS 部署详解](../guides/nas-deploy.md) | [返回文档首页](../doc-hub.html)
