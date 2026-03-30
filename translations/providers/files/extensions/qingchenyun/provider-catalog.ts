import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-models";

export const QTCOOL_BASE_URL = "https://gpt.qt.cool/v1";

export function buildQtcoolProvider(): ModelProviderConfig {
  return {
    baseUrl: QTCOOL_BASE_URL,
    api: "openai-completions",
    models: [
      {
        id: "auto",
        name: "Auto（自动选择最优）",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "MiniMax-M2.7",
        name: "MiniMax M2.7",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "kimi-k2.5",
        name: "Kimi K2.5",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "glm-5.1",
        name: "GLM-5.1",
        contextWindow: 128000,
        maxTokens: 8192,
      },
      {
        id: "glm-5-turbo",
        name: "GLM-5 Turbo",
        contextWindow: 128000,
        maxTokens: 8192,
      },
      {
        id: "glm-5",
        name: "GLM-5",
        contextWindow: 128000,
        maxTokens: 8192,
      },
      {
        id: "MiniMax-M2.5",
        name: "MiniMax M2.5",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-5.4",
        name: "GPT-5.4",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-5.3-codex",
        name: "GPT-5.3 Codex",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-5.2-codex",
        name: "GPT-5.2 Codex",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-5.2",
        name: "GPT-5.2",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-5.1-codex-mini",
        name: "GPT-5.1 Codex Mini",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-5.1-codex-max",
        name: "GPT-5.1 Codex Max",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-5.1-codex",
        name: "GPT-5.1 Codex",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-5.1",
        name: "GPT-5.1",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-5-codex",
        name: "GPT-5 Codex",
        contextWindow: 128000,
        maxTokens: 16384,
      },
      {
        id: "gpt-5",
        name: "GPT-5",
        contextWindow: 128000,
        maxTokens: 16384,
      },
    ],
  };
}
