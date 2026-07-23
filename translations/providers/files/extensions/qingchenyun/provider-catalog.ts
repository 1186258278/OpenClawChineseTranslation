import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-models";

export const CIYAPI_BASE_URL = "https://ciyapi.79tian.com/v1";
export const CIYAPI_SPONSOR_NOTE = "第三方赞助推广，具体规则以词元 API 页面为准。";

export function buildCiyapiProvider(): ModelProviderConfig {
  return {
    baseUrl: CIYAPI_BASE_URL,
    api: "openai-completions",
    models: [
      {
        id: "auto",
        name: "Auto（自动选择最优）",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-4o",
        name: "GPT-4o",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "claude-sonnet-4",
        name: "Claude Sonnet 4",
        contextWindow: 200000,
        maxTokens: 16384,
      },
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        contextWindow: 1048576,
        maxTokens: 8192,
      },
      {
        id: "grok-4",
        name: "Grok 4",
        contextWindow: 128000,
        maxTokens: 8192,
      },
      {
        id: "kimi-k2",
        name: "Kimi K2",
        contextWindow: 128000,
        maxTokens: 8192,
      },
    ],
  };
}
