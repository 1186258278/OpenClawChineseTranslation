# 更新日志

## [2026.3.11-zh.2] - 2026-03-12

### 🐛 问题修复 (#54)
- **TUI `/reasoning` 翻译修正**: 「开关推理模式」→「开关思维链显示」（`/think` 才是思考控制，`/reasoning` 控制思维链显示）

### ✨ WebUI 翻译补全 (+125 条，10 个新页面)
- **用量统计**: 概览（排行/排序/过滤）、详情（令牌/对话/工具/模型组合）、图表（时间活动/星期）
- **代理面板**: 状态面板（上下文/渠道/调度器/核心文件）、工具函数
- **其他页面**: 技能分组、概览文档链接、网关 URL 确认、Markdown 侧边栏、Nostr 资料编辑表单

## [2026.3.11-zh.1] - 2026-03-12

### 🔄 同步更新
- 同步上游 OpenClaw 代码至 **v2026.3.11** 版本（87 个翻译目标文件变更）

### ✨ 新增翻译 (+36 条)
- **新提供商**: Ollama、阿里云百炼 ModelStudio（国内/国际）、OpenCode Go 目录
- **Telegram 执行审批**: 6 个 schema labels + 1 个 help 描述
- **内存搜索多模态**: 4 个 labels + outputDimensionality
- **补充遗漏**: Z.AI 端点选择、LiteLLM API 密钥提示

### 🐛 锚点修复 (7 条)
- `wizard/onboarding-finalize.json` — Gateway restart 从内联属性改为变量赋值
- `commands/auth-choice-options.json` — OpenCode Zen 重命名 + MiniMax hint 变更
- `commands/auth-choice-providers.json` — OpenCode 统一密钥 + Zen 目录化
- `providers/shengsuanyun-tools-registry.json` — createWebFetchTool 新增 runtimeFirecrawl 参数

### 📊 统计
- 翻译文件: 121 个 | 翻译条目: 2405 条 | 匹配率: 100%

## [2026.2.9-zh.1] - 2026-02-10

### ✨ 汉化更新
- **CLI 命令行**: 汉化了 `openclaw --help` 中的大部分子命令说明（如 `acp`, `gateway`, `tui` 等 25 个命令）。

### 🐛 问题修复
- **构建修复**: 修复了上游 v2026.2.9 代码中存在的 TypeScript 类型错误 (`ChatType` vs `"dm"`)，确保稳定版能正常构建。

## [2026.2.9] - 2026-02-10

### 🔄 同步更新
- 同步上游 OpenClaw 代码至 **v2026.2.9** 版本。
- 确保所有核心功能与官方最新版保持一致。

### ✨ 新增翻译
- **语音通话 (Voice Call)**: 新增扩展及其 CLI 命令的完整汉化。
- **飞书 (Feishu)**:
    - 适配新版插件架构，迁移并更新了飞书集成翻译。
    - 新增飞书多维表格 (Bitable) 和入职流程 (Onboarding) 的汉化。
- **向导 (Wizard)**:
    - 完成初始化向导中网关配置 (Gateway Config) 的翻译。
    - 更新入职流程相关命令。
- **CLI 命令行**:
    - 新增模型管理 (Models CLI) 的汉化。
    - 更新认证提供商 (Auth Providers) 选择界面的汉化。

### 🐛 问题修复
- **仪表盘 (Dashboard)**: 修复了“用量统计” (Usage) 页面翻译丢失/错误的问题，现在可正常显示。

### 🐳 Docker 镜像
- Nightly 构建已包含上述所有更新。
- 推荐使用标签: `1186258278/openclaw-zh:nightly` (或等待稳定版发布)。
