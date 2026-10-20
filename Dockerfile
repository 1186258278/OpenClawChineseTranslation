# syntax=docker/dockerfile:1
# ============================================================
# OpenClaw 汉化发行版 - Docker 镜像
# 武汉晴辰天下网络科技有限公司 | https://qingchencloud.com/
# ============================================================
#
# 注意：此 Dockerfile 假设代码已在 GitHub Actions 中构建完成
# 构建上下文只包含 npm pack --ignore-scripts 生成的 openclaw-runtime.tgz。
# 不复制 CI 的 node_modules，避免 pnpm 隐藏目录、软链接、权限和架构损坏。
#
# 优化策略：
# 1. 层顺序优化 - 不常变的层放前面
# 2. cache-mounts - 缓存 apt/npm 下载
# 3. 最小化镜像体积
#
# ============================================================

FROM node:24.16.0-slim

LABEL org.opencontainers.image.source="https://github.com/1186258278/OpenClawChineseTranslation"
LABEL org.opencontainers.image.description="OpenClaw 汉化发行版 - 开源个人 AI 助手中文版"
LABEL org.opencontainers.image.licenses="MIT"
LABEL maintainer="武汉晴辰天下网络科技有限公司 <contact@qingchencloud.com>"

# 设置环境变量（这一层很少变化，放最前面）
ENV CHROME_BIN=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

# 安装运行时依赖（使用 cache-mount 加速 apt）
# 这一层变化频率低，会被缓存
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    ca-certificates \
    chromium python3 make g++

# 设置工作目录
WORKDIR /app

# 在目标架构安装真正的发行包及依赖，保留原生依赖和内置插件的安装脚本。
COPY openclaw-runtime.tgz /tmp/openclaw-runtime.tgz
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm install --global --omit=dev --no-audit --no-fund /tmp/openclaw-runtime.tgz && \
    rm /tmp/openclaw-runtime.tgz && \
    openclaw --version && openclaw gateway --help >/dev/null

WORKDIR /usr/local/lib/node_modules/@qingchencloud/openclaw-zh

# 创建配置目录
RUN mkdir -p /root/.openclaw

# 暴露端口
EXPOSE 18789

# 数据持久化目录
VOLUME ["/root/.openclaw"]

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl --fail --silent --show-error http://127.0.0.1:18789/healthz || exit 1

# 默认启动命令
CMD ["openclaw", "gateway", "run", "--allow-unconfigured", "--bind", "lan"]
