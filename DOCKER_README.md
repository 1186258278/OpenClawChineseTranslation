# OpenClaw 汉化发行版 - Docker 镜像

> OpenClaw (Clawdbot/Moltbot) 中文汉化版，CLI 和 Dashboard 均已深度汉化，每小时自动同步上游官方更新。

## 快速启动

```bash
# 访问令牌留在本机环境，不要提交到仓库
export OPENCLAW_GATEWAY_TOKEN="$(openssl rand -hex 32)"

# 初始化配置
docker run --rm -v openclaw-data:/root/.openclaw \
  1186258278/openclaw-zh:latest openclaw setup

docker run --rm -v openclaw-data:/root/.openclaw \
  1186258278/openclaw-zh:latest openclaw config set gateway.mode local

docker run --rm -v openclaw-data:/root/.openclaw \
  1186258278/openclaw-zh:latest openclaw config set gateway.controlUi.allowedOrigins \
  '["http://localhost:18789", "http://127.0.0.1:18789"]'

# 默认命令会启动 gateway；本机访问仅发布到宿主机回环地址
docker run -d --name openclaw -p 127.0.0.1:18789:18789 \
  -v openclaw-data:/root/.openclaw \
  -e OPENCLAW_GATEWAY_TOKEN \
  --restart unless-stopped \
  1186258278/openclaw-zh:latest
```

访问: `http://localhost:18789`

## 可用标签

| 标签 | 说明 |
|------|------|
| `latest` | 稳定版，经过测试推荐使用 |
| `nightly` | 每小时同步上游最新代码 |

## Docker Compose

```yaml
services:
  openclaw:
    image: 1186258278/openclaw-zh:latest
    container_name: openclaw
    ports:
      - "127.0.0.1:18789:18789"
    volumes:
      - openclaw-data:/root/.openclaw
    restart: unless-stopped
    environment:
      OPENCLAW_GATEWAY_TOKEN: ${OPENCLAW_GATEWAY_TOKEN:?Set OPENCLAW_GATEWAY_TOKEN}
    command: ["openclaw", "gateway", "run", "--allow-unconfigured", "--bind", "lan"]

volumes:
  openclaw-data:
```

启动前先完成上面的配置初始化。远程访问时，将实际的 HTTPS 域名加入
`gateway.controlUi.allowedOrigins`，保留 Token/设备认证，并根据部署方式调整
宿主机端口或反向代理；不要用关闭认证或通配来源解决连接问题。

## 更新与检查

```bash
# 保留原数据卷和 .env，不执行 down -v
docker compose pull
docker compose up -d --force-recreate
docker compose ps
docker compose exec openclaw curl -fsS http://127.0.0.1:18789/healthz
docker compose exec openclaw openclaw --version
```

历史镜像中的 `Cannot find module`、`node-gyp-build: not found`、`workspace:*`
错误属于镜像打包问题；新版发布流程会在 amd64/arm64 分别安装依赖并验证真实启动，
验证通过后才更新两个镜像仓库的标签。不需要在运行中的容器手工补装零散模块。

## 镜像地址

| 镜像源 | 地址 | 适用场景 |
|--------|------|----------|
| **Docker Hub** | `1186258278/openclaw-zh` | 国内用户推荐 |
| **ghcr.io** | `ghcr.io/1186258278/openclaw-zh` | 海外用户 |

## 相关链接

- [汉化官网](https://openclaw.qt.cool/)
- [GitHub 仓库](https://github.com/1186258278/OpenClawChineseTranslation)
- [完整 Docker 部署指南](https://github.com/1186258278/OpenClawChineseTranslation/blob/main/docs/DOCKER_GUIDE.md)
- [npm 包](https://www.npmjs.com/package/@qingchencloud/openclaw-zh)

---

**武汉晴辰天下网络科技有限公司** | [qingchencloud.com](https://qingchencloud.com/)
