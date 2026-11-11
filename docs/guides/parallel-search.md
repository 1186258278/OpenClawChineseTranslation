# 使用 Parallel Search MCP 搜索与抓取网页

[Parallel Search MCP](https://docs.parallel.ai/integrations/mcp/search-mcp) 提供免费的网页搜索和内容抓取，无需注册账号或配置 Parallel API Key。匿名搜索使用 Fast 模式，适合探索和轻量使用，有速率限制。

OpenClaw 的 [mcporter 技能](https://github.com/openclaw/openclaw/blob/cce7888a7c73e3b5aa26f4470ec81649e23d8327/skills/mcporter/SKILL.md) 支持通过 CLI 配置、发现和调用 HTTP MCP 工具。下面的独立示例使用同一 CLI，在终端执行搜索与抓取。它采用示例目录内的配置，保留 OpenClaw 内置 `web_search` 的现有设置。

## 安装示例

需要 **Node.js >= 24** 和 npm（本示例的 mcporter 依赖要求比 OpenClaw 本身更高）。

```bash
git clone https://github.com/1186258278/OpenClawChineseTranslation.git
cd OpenClawChineseTranslation/examples/parallel-search
npm ci --ignore-scripts
```

后续命令均在这个目录中运行。示例固定使用 mcporter 0.14.2，通过 Streamable HTTP 连接 `https://search.parallel.ai/mcp`，无需 `Authorization` 头或登录。`mcporter.json` 中的 `imports: []` 关闭此示例对其他客户端 MCP 配置的自动导入。

## 发现工具

```bash
npm run mcp -- list parallel-search --schema
```

应看到两个工具及其参数：

- `web_search`：`objective` 指定搜索目标，`search_queries` 提供至少一条关键词查询。
- `web_fetch`：`urls` 指定要抓取的网页，单次最多 20 个 URL；可用 `objective` 聚焦内容。

## 搜索网页

```bash
npm run mcp -- call parallel-search.web_search --args '{"objective":"Find the official OpenClaw getting started documentation","search_queries":["OpenClaw official getting started"]}' --output json
```

结果包含来源 URL 和内容摘录，可继续抓取相关页面。

## 抓取网页

```bash
npm run mcp -- call parallel-search.web_fetch --args '{"urls":["https://docs.openclaw.ai/start/getting-started"],"objective":"OpenClaw installation and onboarding commands"}' --output json
```

结果包含页面摘录。优先使用摘录模式；需要完整 Markdown 时，可在参数中添加 `"full_content": true`，但输出会更大。

这些步骤验证的是终端直接调用。通过 OpenClaw 对话自动调用还需要代理能够使用 mcporter 技能并获得相应的命令执行权限；本示例不配置代理或模型。

## 常见问题

- **找不到 mcporter**：确认已在示例目录运行 `npm ci --ignore-scripts`，并通过 `npm run mcp -- ...` 使用本地依赖。
- **连接失败**：检查本机是否可以访问 `https://search.parallel.ai/mcp`，以及网络代理设置。
- **速率限制**：根据服务返回的重试提示稍后再试。免费访问适合轻量使用，不代表无限调用。
- **参数错误**：先运行工具发现命令，以服务当前返回的 schema 为准。

[返回工具文档](../upstream/tools.md)
