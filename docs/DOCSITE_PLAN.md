# OpenClaw 汉化版文档站规划

## 目标
建设 `openclaw.qt.cool` 成为最全的 OpenClaw 中文文档站，覆盖官方所有文档 + 国内特色内容。

## 技术选型
- **框架**: VitePress（Vite 驱动，Markdown 原生支持，内置搜索）
- **部署**: GitHub Pages（通过 GitHub Actions 自动构建部署）
- **域名**: `openclaw.qt.cool`（已有，需从单页切换到 VitePress）

## 内容规划

### 第一阶段：基础框架 + 现有内容迁移
- [ ] VitePress 项目初始化（在 `docs-site/` 目录或独立仓库）
- [ ] 迁移现有 6 篇文档：INSTALL_GUIDE, DOCKER_GUIDE, FAQ, CONTRIBUTING, TRANSLATION_GUIDE, MAINTENANCE
- [ ] 设计导航结构和首页
- [ ] 配置 GitHub Actions 自动部署

### 第二阶段：官方文档镜像
从 `docs.openclaw.ai/zh-CN` 抓取并本地化以下分类（约 50+ 页）：

**入门指南**
- [ ] 快速开始 (quickstart)
- [ ] 入门指南 (getting-started)
- [ ] 新手引导 (wizard, onboarding)
- [ ] 安装配置 (setup)

**渠道配置**
- [ ] WhatsApp, Telegram, Slack, Discord
- [ ] Signal, iMessage, Nostr, Mattermost
- [ ] WebChat, Webhooks

**网关运维**
- [ ] 配置 (configuration, configuration-examples)
- [ ] 远程访问 (remote, tailscale)
- [ ] 安全 (security)
- [ ] 健康检查 (health, doctor)
- [ ] 日志 (logging)
- [ ] 故障排除 (troubleshooting)

**工具**
- [ ] 网页搜索 (web-search)
- [ ] 命令执行 (exec)
- [ ] 浏览器自动化 (browser)
- [ ] 记忆搜索 (memory)

**代理**
- [ ] 多代理路由 (multi-agent)
- [ ] 技能 (skills)
- [ ] 子代理 (subagents)

**模型提供商**
- [ ] 模型目录 (models)
- [ ] 各提供商配置

### 第三阶段：国内特色内容（差异化核心）
- [ ] **国产模型配置指南**: 胜算云、通义千问 (Qwen)、Kimi (Moonshot)、MiniMax、智谱 (GLM/Z.AI)、阿里云百炼 (ModelStudio)
- [ ] **NAS 部署详解**: 飞牛 NAS、群晖 (Synology)、iStoreOS、威联通 (QNAP)
- [ ] **飞书渠道配置**: 完整的飞书集成教程
- [ ] **国内网络问题排查**: 镜像源、代理、DNS 配置
- [ ] **Docker 国内加速**: 镜像加速器配置、离线安装包

### 第四阶段：SEO + 引流
- [ ] 结构化数据 (JSON-LD)
- [ ] sitemap 自动生成
- [ ] 百度搜索引擎收录
- [ ] 微信/QQ 社群入口
- [ ] 首页 showcase / 用户案例

## 本地化原则
1. 官方文档中的 `openclaw` 安装命令替换为 `@qingchencloud/openclaw-zh`
2. GitHub 链接保留但补充国内镜像说明
3. npm 命令补充 `--registry=https://registry.npmmirror.com` 选项
4. Docker 镜像补充国内加速地址
5. 外部服务链接检查国内可访问性
