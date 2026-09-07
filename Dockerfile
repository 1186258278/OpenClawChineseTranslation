# ============================================================
# OpenClaw 汉化发行版 - Docker 镜像
# 武汉晴辰天下网络科技有限公司 | https://qingchencloud.com/
# ============================================================
#
# 注意：此 Dockerfile 假设代码已在 GitHub Actions 中构建完成
# 构建上下文应包含 dist/ 目录和 node_modules/
#
# 优化策略：
# 1. 层顺序优化 - 不常变的层放前面
# 2. cache-mounts - 缓存 apt/npm 下载
# 3. 最小化镜像体积
#
# ============================================================

# syntax=docker/dockerfile:1.4
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
    chromium \
    && rm -rf /tmp/*

# 设置工作目录
WORKDIR /app

# 先复制 package.json（用于判断依赖是否变化）
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# 复制所有构建好的代码
COPY . .

# 重新安装原生依赖以匹配当前架构（使用 cache-mount 加速 npm）
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm rebuild || true && \
    npm install --prefer-offline --no-audit --omit=dev || true

# 全局安装
RUN npm install -g . --omit=dev

# 创建配置目录
RUN mkdir -p /root/.openclaw

# 暴露端口
EXPOSE 18789

# 数据持久化目录
VOLUME ["/root/.openclaw"]

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:18789/health || exit 1

# 默认启动命令
CMD ["openclaw"]
