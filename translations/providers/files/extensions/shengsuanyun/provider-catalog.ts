import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-models";

export const SHENGSUANYUN_BASE_URL = "https://router.shengsuanyun.com/api/v1";

export function buildShengsuanyunProvider(): ModelProviderConfig {
  return {
    baseUrl: SHENGSUANYUN_BASE_URL,
    api: "openai-completions",
    models: [
      {
        id: "minimax/minimax-m3",
        name: "MiniMax M3",
        contextWindow: 1000000,
        maxTokens: 81920,
      },
      {
        id: "openai/gpt-4.1-nano",
        name: "GPT-4.1 Nano",
        contextWindow: 1047576,
        maxTokens: 32768,
      },
      {
        id: "openai/o4-mini",
        name: "O4 Mini",
        contextWindow: 200000,
        maxTokens: 100000,
      },
      {
        id: "deepseek/deepseek-v3.2",
        name: "DeepSeek V3.2",
        contextWindow: 128000,
        maxTokens: 64000,
      },
      {
        id: "anthropic/claude-sonnet-4.5",
        name: "Claude Sonnet 4.5",
        contextWindow: 200000,
        maxTokens: 64000,
      },
    ],
  };
}
