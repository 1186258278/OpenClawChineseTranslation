# 翻译规范

<p align="center">
  <a href="../README.md">🏠 首页</a> ·
  <a href="INSTALL_GUIDE.md">📦 安装指南</a> ·
  <a href="DOCKER_GUIDE.md">🐳 Docker 部署</a> ·
  <a href="FAQ.md">❓ 常见问题</a> ·
  <a href="CONTRIBUTING.md">🤝 贡献指南</a> ·
  <b>📝 翻译规范</b>
</p>

## 术语表

保持以下术语的一致性：

| 英文 | 中文 |
|------|------|
| Gateway | 网关 |
| Workspace | 工作区 |
| Channel | 频道 |
| Skill | 技能 |
| Agent | 代理 |
| Token | 令牌 |
| Onboarding | 初始化/引导 |
| Credential | 凭证 |
| Session | 会话 |
| Config | 配置 |
| Sandbox | 沙箱 |

## 翻译原则

### 1. 保持变量占位符

```json
// ✓ 正确
"`Gateway port: ${port}`": "`网关端口: ${port}`"

// ✗ 错误 - 不要翻译变量
"`Gateway port: ${port}`": "`网关端口: ${端口}`"
```

### 2. 保持代码结构

```json
// ✓ 正确 - 保持原有格式
"{ value: \"keep\", label: \"Use existing values\" }": "{ value: \"keep\", label: \"使用现有值\" }"

// ✗ 错误 - 改变了结构
"label: \"Use existing values\"": "标签：\"使用现有值\""
```

### 3. 注意引号类型

源码中可能有不同类型的引号：
- 直引号: `"` `'`
- 弯引号: `"` `'` `'`

翻译配置中要精确匹配原文的引号类型。

### 4. 保持技术术语

```json
// ✓ 正确 - 保留技术命令
"run `openclaw doctor`": "运行 `openclaw doctor`"

// ✗ 错误 - 不要翻译命令
"run `openclaw doctor`": "运行 `开爪医生`"
```

## 风格指南

### 标点符号

- 使用中文标点（。，！？）
- 冒号使用中文冒号（：）
- 括号可用英文或中文，保持一致

### 语气

- 保持友好但专业
- 适当保留原文的幽默感
- 错误提示要清晰明确

### 长度

- 尽量保持与原文相近的长度
- UI 文本尤其注意不要过长

## 常见问题

### Q: 找不到要翻译的字符串？

A: 可能是因为：
1. 字符串在源码中有特殊字符（如换行、转义）
2. 引号类型不匹配
3. 字符串被拆分在多行

### Q: 翻译后验证失败？

A: 检查：
1. JSON 格式是否正确
2. 转义字符是否正确（`\"` 表示引号）
3. 原文是否精确匹配源码
