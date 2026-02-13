import type { ModelApi, ModelDefinitionConfig } from "../config/types.js";

export const SHENGSUANYUN_BASE_URL = "https://router.shengsuanyun.com/api/v1";
export const SHENGSUANYUN_MODALITIES_BASE_URL = `${SHENGSUANYUN_BASE_URL}/models/multimodal`;

// 胜算云按积分计费，成本在网关侧统一按 0 占位
export const SHENGSUANYUN_DEFAULT_COST = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
};

export const SHENGSUANYUN_LLM_FALLBACK_MODELS: ModelDefinitionConfig[] = [
  {
    id: "openai/gpt-4.1-nano",
    name: "GPT-4.1 Nano",
    reasoning: false,
    api: "openai-completions",
    input: ["text", "image"],
    cost: SHENGSUANYUN_DEFAULT_COST,
    contextWindow: 1047576,
    maxTokens: 32768,
  },
  {
    id: "openai/o4-mini",
    name: "O4 Mini",
    reasoning: true,
    api: "openai-completions",
    input: ["text", "image"],
    cost: SHENGSUANYUN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 100000,
  },
  {
    id: "deepseek/deepseek-v3.2",
    name: "DeepSeek V3.2",
    reasoning: false,
    api: "openai-completions",
    input: ["text"],
    cost: SHENGSUANYUN_DEFAULT_COST,
    contextWindow: 128000,
    maxTokens: 64000,
  },
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    reasoning: false,
    api: "openai-completions",
    input: ["text", "image"],
    cost: SHENGSUANYUN_DEFAULT_COST,
    contextWindow: 200000,
    maxTokens: 64000,
  },
];

export interface ShengSuanYunModel {
  id: string;
  company?: string;
  name?: string;
  api_name?: string;
  description?: string;
  max_tokens?: number;
  context_window?: number;
  support_apis?: string[];
  architecture?: {
    input?: string;
    output?: string;
    tokenizer?: string;
  };
}

interface ShengSuanYunModelsResponse {
  data?: ShengSuanYunModel[];
  object?: string;
  success?: boolean;
}

export interface ShengSuanYunMultimodalModel {
  id: string;
  api_name?: string;
  company?: string;
  company_name?: string;
  name?: string;
  model_name?: string;
  description?: string;
  desc?: string;
  class_names?: string[];
  input_schema?: string;
  output_schema?: string;
  support_apis?: string[];
  sync?: boolean;
  async?: boolean;
  architecture?: {
    input?: string;
    output?: string;
    tokenizer?: string;
  };
}

interface ShengSuanYunMultimodalResponse {
  data?: ShengSuanYunMultimodalModel[];
  object?: string;
  success?: boolean;
}

export type MModel = ShengSuanYunMultimodalModel;

export interface TaskRes {
  code?: string;
  message?: string;
  error?: {
    message?: string;
    code?: string;
    type?: string;
  };
  data?: {
    request_id?: string;
    status?: string;
    fail_reason?: string;
    progress?: number | string;
    data?: {
      image_urls?: string[];
      video_urls?: string[];
      audio_urls?: string[];
      audio_url?: string;
      progress?: number | string;
      error?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

function toStringArray(input: unknown): string[] {
  return Array.isArray(input) ? input.filter((item): item is string => typeof item === "string") : [];
}

function isReasoningModel(model: ShengSuanYunModel): boolean {
  const joined = `${model.name ?? ""} ${model.id ?? ""} ${model.description ?? ""}`.toLowerCase();
  return (
    joined.includes("thinking") ||
    joined.includes("reasoning") ||
    joined.includes("reason") ||
    joined.includes("r1")
  );
}

function supportsVision(model: ShengSuanYunModel): boolean {
  const modality = String(model.architecture?.input ?? "").toLowerCase();
  return modality.includes("image") || modality.includes("vision") || modality.includes("text+image");
}

function hasSupportedApi(supportApis: string[]): boolean {
  return (
    supportApis.includes("/v1/chat/completions") ||
    supportApis.includes("/v1/messages") ||
    supportApis.includes("/v1/responses")
  );
}

// 优先使用 chat/completions，messages 次之，responses-only 走 openai-responses
function determineApiType(supportApis: string[]): ModelApi {
  if (supportApis.includes("/v1/chat/completions")) {
    return "openai-completions";
  }
  if (supportApis.includes("/v1/messages")) {
    return "anthropic-messages";
  }
  if (supportApis.includes("/v1/responses")) {
    return "openai-responses";
  }
  return "openai-completions";
}

function toSchemaString(schema: unknown): string {
  if (typeof schema === "string") {
    return schema;
  }
  if (schema && typeof schema === "object") {
    try {
      return JSON.stringify(schema);
    } catch {
      return "{}";
    }
  }
  return "{}";
}

export async function getShengSuanYunModels(): Promise<ModelDefinitionConfig[]> {
  // 测试环境返回稳定兜底
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    return SHENGSUANYUN_LLM_FALLBACK_MODELS;
  }

  try {
    const res = await fetch(`${SHENGSUANYUN_BASE_URL}/models`, {
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      return SHENGSUANYUN_LLM_FALLBACK_MODELS;
    }
    const payload = (await res.json()) as ShengSuanYunModelsResponse;
    const list = Array.isArray(payload.data) ? payload.data : [];
    if (payload.success === false || list.length === 0) {
      return SHENGSUANYUN_LLM_FALLBACK_MODELS;
    }

    const models: ModelDefinitionConfig[] = [];
    for (const raw of list) {
      const supportApis = toStringArray(raw.support_apis);
      if (!raw.id || !hasSupportedApi(supportApis)) {
        continue;
      }
      models.push({
        id: raw.id,
        name: raw.name || raw.id,
        reasoning: isReasoningModel(raw),
        api: determineApiType(supportApis),
        input: supportsVision(raw) ? ["text", "image"] : ["text"],
        cost: SHENGSUANYUN_DEFAULT_COST,
        contextWindow: raw.context_window || 128000,
        maxTokens: raw.max_tokens || 8192,
      });
    }

    return models.length > 0 ? models : SHENGSUANYUN_LLM_FALLBACK_MODELS;
  } catch (error) {
    console.warn(`[shengsuanyun-models] 加载语言模型失败: ${String(error)}`);
    return SHENGSUANYUN_LLM_FALLBACK_MODELS;
  }
}

export async function getShengSuanYunModalityModels(): Promise<MModel[]> {
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    return [];
  }

  try {
    const res = await fetch(SHENGSUANYUN_MODALITIES_BASE_URL, {
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      console.warn(
        `[shengsuanyun-models] 多模态模型列表请求失败: ${res.status} ${res.statusText}`,
      );
      return [];
    }

    const payload = (await res.json()) as ShengSuanYunMultimodalResponse;
    const list = Array.isArray(payload.data) ? payload.data : [];
    if (payload.success === false || list.length === 0) {
      return [];
    }

    const normalized: MModel[] = [];
    for (const raw of list) {
      const id = String(raw.id ?? raw.api_name ?? "").trim();
      if (!id) {
        continue;
      }
      normalized.push({
        ...raw,
        id,
        api_name: String(raw.api_name ?? id),
        company_name: String(raw.company_name ?? raw.company ?? ""),
        model_name: String(raw.model_name ?? raw.name ?? id),
        description: String(raw.description ?? raw.desc ?? ""),
        desc: String(raw.desc ?? raw.description ?? ""),
        class_names: toStringArray(raw.class_names),
        support_apis: toStringArray(raw.support_apis),
        input_schema: toSchemaString(raw.input_schema),
        output_schema: toSchemaString(raw.output_schema),
        sync: raw.sync === true,
        async: raw.async === true,
      });
    }

    return normalized;
  } catch (error) {
    console.warn(`[shengsuanyun-models] 加载多模态模型失败: ${String(error)}`);
    return [];
  }
}
