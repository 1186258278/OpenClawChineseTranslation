# 贡献指南

<p align="center">
  <a href="../README.md">🏠 首页</a> ·
  <a href="INSTALL_GUIDE.md">📦 安装指南</a> ·
  <a href="DOCKER_GUIDE.md">🐳 Docker 部署</a> ·
  <a href="FAQ.md">❓ 常见问题</a> ·
  <b>🤝 贡献指南</b> ·
  <a href="TRANSLATION_GUIDE.md">📝 翻译规范</a>
</p>

感谢你对 **OpenClaw 汉化发行版** 的关注！

---

## 目录

- [环境准备](#环境准备)
- [项目结构](#项目结构)
- [汉化 CLI 工具](#汉化-cli-工具)
- [手动汉化安装](#手动汉化安装)
- [添加新翻译](#添加新翻译)
- [翻译规范](#翻译规范)
- [提交 PR](#提交-pr)

---

## 环境准备

```bash
# 1. 克隆汉化项目
git clone https://github.com/1186258278/OpenClawChineseTranslation.git
cd OpenClawChineseTranslation

# 2. 克隆上游 OpenClaw 源码
git clone https://github.com/openclaw/openclaw.git openclaw
```

---

## 项目结构

```
OpenClawChineseTranslation/
├── cli/                    # 汉化 CLI 工具
│   ├── index.mjs           # 入口
│   ├── commands/           # 命令实现（apply, restore, status）
│   └── utils/              # 工具函数（i18n 引擎）
├── translations/           # 翻译配置（JSON 格式）
│   ├── config.json         # 主配置（加载所有翻译文件）
│   ├── cli/                # CLI 界面翻译
│   │   ├── banner.json     # 启动横幅
│   │   ├── tagline.json    # 有趣标语
│   │   └── help.json       # 帮助信息
│   ├── wizard/             # 向导翻译
│   │   ├── onboarding.json # 初始化向导
│   │   ├── security.json   # 安全警告
│   │   └── finalize.json   # 完成提示
│   ├── tui/                # TUI 界面翻译
│   │   ├── waiting.json    # 等待动画
│   │   └── commands.json   # 斜杠命令
│   ├── commands/           # 命令翻译
│   │   ├── status.json     # status 命令
│   │   ├── update.json     # update 命令
│   │   ├── skills.json     # skills 命令
│   │   └── ...             # 更多命令
│   ├── dashboard/          # Dashboard UI 翻译 (20+ 文件)
│   │   ├── navigation.json # 导航菜单
│   │   ├── app-render.json # 主布局
│   │   ├── chat.json       # 聊天界面
│   │   ├── agents.json     # 代理管理
│   │   ├── config.json     # 配置页面
│   │   ├── schema.json     # 配置 schema (300+ 标签)
│   │   ├── channels-*.json # 各渠道翻译
│   │   └── ...             # 更多模块
│   └── panel/              # 功能面板（注入到 Dashboard）
│       ├── feature-panel.js
│       ├── feature-panel.css
│       └── panel-data.json
├── scripts/                # 构建脚本
│   ├── inject_panel.py     # 功能面板注入
│   └── inject_remote.py    # 远程注入
├── docs/                   # 文档
├── tests/                  # 测试
├── .github/workflows/      # CI/CD 工作流
├── install.sh              # Linux/macOS 安装脚本
├── install.ps1             # Windows 安装脚本
├── docker-deploy.sh        # Docker 一键部署
└── docker-deploy.ps1       # Docker 一键部署 (Windows)
```

---

## 汉化 CLI 工具

| 命令 | 说明 |
|------|------|
| `npm run cli -- status` | 查看当前汉化状态 |
| `npm run cli -- apply` | 应用汉化补丁 |
| `npm run cli -- apply --dry-run` | 预览汉化（不实际修改） |
| `npm run cli -- apply --verbose` | 详细输出汉化过程 |
| `npm run cli -- apply --target=../openclaw` | 指定目标目录 |
| `npm run cli -- verify` | 验证汉化结果 |
| `npm run cli -- restore` | 恢复原版（使用 git checkout） |

---

## 手动汉化安装

适用于想要自定义翻译、测试最新代码或参与贡献的用户：

```bash
# 1. 克隆汉化项目
git clone https://github.com/1186258278/OpenClawChineseTranslation.git
cd OpenClawChineseTranslation

# 2. 克隆上游 OpenClaw 源码
git clone https://github.com/openclaw/openclaw.git openclaw

# 3. 查看汉化状态
npm run cli -- status

# 4. 应用汉化补丁
npm run cli -- apply

# 5. 验证汉化结果
npm run cli -- verify

# 6. 构建 OpenClaw
cd openclaw
pnpm install
pnpm run build

# 7. 全局安装
npm install -g .

# 8. 验证安装
openclaw --version
openclaw --help
```

---

## 添加新翻译

### 1. 找到目标文件

确定需要翻译的源文件位置（在 `openclaw/` 目录中）。

### 2. 创建翻译规则

在 `translations/` 对应目录创建或编辑 JSON 文件：

```json
{
  "file": "src/path/to/file.ts",
  "description": "文件说明",
  "replacements": {
    "\"English Text\"": "\"中文翻译\"",
    "<div class=\"title\">Hello</div>": "<div class=\"title\">你好</div>"
  }
}
```

字段说明：
- `file`: 目标源文件路径（相对于 OpenClaw 根目录）
- `description`: 此翻译配置的说明
- `replacements`: 键值对，键为原始英文，值为翻译后的中文

### 3. 注册翻译文件

在 `translations/config.json` 中添加新文件的路径。

### 4. 测试

```bash
# 预览（不修改文件）
npm run cli -- apply --dry-run --verbose

# 应用
npm run cli -- apply

# 验证
npm run cli -- verify
```

### 5. 自定义翻译注意事项

- 替换键必须在源文件中**唯一匹配**，否则可能导致误替换
- 包含模板字符串（如 `${variable}`）时需要保持变量名不变
- Lit HTML 属性绑定（如 `?disabled=${...}`）不能被翻译
- 较长的匹配串比短的更安全（避免过于通用的词如 `"default"`）

---

## 翻译规范

详见 [TRANSLATION_GUIDE.md](TRANSLATION_GUIDE.md)

### 核心原则

1. **保持一致性** - 同一术语使用统一翻译
2. **保留技术术语** - API、CLI、Token、Gateway 等保持英文
3. **保持格式** - 不改变占位符、换行、空格
4. **简洁准确** - 避免冗长，符合中文习惯
5. **先长后短** - 较长的匹配串应排在较短的前面，避免部分匹配

### 常用术语对照

| 英文 | 中文 |
|------|------|
| Agent | 代理 |
| Channel | 渠道 |
| Gateway | 网关 |
| Skill | 技能 |
| Session | 会话 |
| Workspace | 工作区 |
| Dashboard | 控制台 |
| Cron Job | 定时任务 |
| Node | 节点 |
| Instance | 实例 |

---

## 提交 PR

1. Fork 本项目
2. 创建分支：`git checkout -b fix/typo-in-onboarding`
3. 修改翻译文件
4. 运行验证：`npm run cli -- apply --dry-run`
5. 提交更改
6. 创建 Pull Request

---

## 行为准则

- 尊重他人
- 接受建设性批评
- 专注于改进项目

---

## 联系我们

- GitHub Issues: [提交问题](https://github.com/1186258278/OpenClawChineseTranslation/issues)
- 官网: https://openclaw.qt.cool/
- 公司官网: https://qingchencloud.com/

感谢你的贡献！
