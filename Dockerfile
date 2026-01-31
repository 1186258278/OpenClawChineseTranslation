# ============================================================
# OpenClaw 汉化发行版 - Docker 镜像
# 武汉晴辰天下网络科技有限公司 | https://qingchencloud.com/
# ============================================================
#
# 注意：此 Dockerfile 假设代码已在 GitHub Actions 中构建完成
# 构建上下文应包含 dist/ 目录和 node_modules/
#
# ============================================================

FROM node:22-slim

LABEL org.opencontainers.image.source="https://github.com/1186258278/OpenClawChineseTranslation"
LABEL org.opencontainers.image.description="OpenClaw 汉化发行版 - 开源个人 AI 助手中文版"
LABEL org.opencontainers.image.licenses="MIT"
LABEL maintainer="武汉晴辰天下网络科技有限公司 <contact@qingchencloud.com>"

# 安装运行时依赖
RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# 设置 Chromium 环境变量（用于浏览器自动化）
ENV CHROME_BIN=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 设置工作目录
WORKDIR /app

# 复制构建好的代码（包括 dist/ 和 node_modules/）
COPY package.json ./
COPY openclaw.mjs ./
COPY dist/ ./dist/
COPY node_modules/ ./node_modules/

# 全局链接
RUN npm link

# 创建配置目录
RUN mkdir -p /root/.openclaw

# 暴露端口
EXPOSE 18789

# 数据持久化目录
VOLUME ["/root/.openclaw"]

# 默认启动命令
CMD ["openclaw"]
