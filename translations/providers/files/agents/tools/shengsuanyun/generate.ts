import { Type, type TSchema } from "@sinclair/typebox";
import type { OpenClawConfig } from "../../../config/config.ts";
import type { AnyAgentTool } from "../common.ts";
import { loadConfig } from "../../../config/config.ts";
import { resolveApiKeyForProvider } from "../../model-auth.ts";
import {
  getShengSuanYunModalityModels,
  SHENGSUANYUN_BASE_URL,
} from "../../shengsuanyun-models.ts";
import { readStringParam, readStringArrayParam, readNumberParam } from "../common.ts";
import { createGemini3ProImageTool } from "./gemini3pro-image-preview.ts";
import { createZImageTurboTool } from "./zimage-turbo.ts";

export const APP_HEADERS: Record<string, string> = {
  "HTTP-Referer": "https://openclaw.ai",
  "X-Title": "OpenClaw",
  "Content-Type": "application/json",
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readResponsePayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }
  if (!isObject(payload)) {
    return fallback;
  }
  const nestedError = isObject(payload.error) ? payload.error : undefined;
  const candidates = [
    payload.message,
    payload.msg,
    nestedError?.message,
    nestedError?.code,
    payload.code,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }
  return fallback;
}

function collectMediaUrls(payload: unknown): string[] {
  const urls = new Set<string>();

  const visit = (value: unknown, depth: number) => {
    if (depth > 8 || value == null) {
      return;
    }
    if (typeof value === "string") {
      if (/^https?:\/\//i.test(value)) {
        urls.add(value);
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1));
      return;
    }
    if (isObject(value)) {
      for (const nested of Object.values(value)) {
        visit(nested, depth + 1);
      }
    }
  };

  visit(payload, 0);
  return Array.from(urls);
}

function getTaskStatus(payload: unknown): string {
  if (!isObject(payload)) {
    return "";
  }
  if (isObject(payload.data) && typeof payload.data.status === "string") {
    return payload.data.status.toUpperCase();
  }
  if (typeof payload.status === "string") {
    return payload.status.toUpperCase();
  }
  return "";
}

function getTaskProgress(payload: unknown): number | undefined {
  if (!isObject(payload)) {
    return undefined;
  }
  const candidates: unknown[] = [];
  if (isObject(payload.data)) {
    candidates.push(payload.data.progress);
    if (isObject(payload.data.data)) {
      candidates.push(payload.data.data.progress);
    }
  }
  candidates.push(payload.progress);

  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
    if (typeof candidate === "string") {
      const value = Number(candidate);
      if (Number.isFinite(value)) {
        return value;
      }
    }
  }
  return undefined;
}

function getRequestId(payload: unknown): string | undefined {
  if (!isObject(payload)) {
    return undefined;
  }
  if (isObject(payload.data) && typeof payload.data.request_id === "string") {
    return payload.data.request_id;
  }
  if (typeof payload.request_id === "string") {
    return payload.request_id;
  }
  return undefined;
}

function getTaskFailureReason(payload: unknown): string {
  if (!isObject(payload)) {
    return "任务失败";
  }
  const candidates: unknown[] = [];
  if (isObject(payload.data)) {
    candidates.push(payload.data.fail_reason);
    if (isObject(payload.data.data)) {
      candidates.push(payload.data.data.error);
    }
  }
  candidates.push(payload.message);
  candidates.push(payload.code);
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }
  return "任务失败";
}

function taskFailed(status: string): boolean {
  return ["FAILED", "FAIL", "ERROR", "CANCELLED", "CANCELED"].includes(status);
}

function taskFinished(status: string, progress: number | undefined, urls: string[]): boolean {
  if (["SUCCESS", "SUCCEEDED", "COMPLETED", "DONE", "FINISHED"].includes(status)) {
    return true;
  }
  if (typeof progress === "number" && progress >= 100) {
    return true;
  }
  return urls.length > 0 && !["", "PENDING", "RUNNING", "PROCESSING", "QUEUED"].includes(status);
}

async function callImageGenerations(params: {
  apiKey: string;
  body: Record<string, unknown>;
}): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  const res = await fetch(`${SHENGSUANYUN_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      ...APP_HEADERS,
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify(params.body),
  });
  const payload = await readResponsePayload(res);
  if (!res.ok) {
    return {
      success: false,
      error: extractErrorMessage(payload, `图片生成请求失败 (${res.status})`),
    };
  }
  const urls = collectMediaUrls(payload);
  if (urls.length === 0) {
    return {
      success: false,
      error: extractErrorMessage(payload, "图片生成未返回可用地址"),
    };
  }
  return { success: true, urls };
}

async function callTaskGenerations(params: {
  apiKey: string;
  body: Record<string, unknown>;
}): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  const submitRes = await fetch(`${SHENGSUANYUN_BASE_URL}/tasks/generations`, {
    method: "POST",
    headers: {
      ...APP_HEADERS,
      Authorization: `Bearer ${params.apiKey}`,
    },
    body: JSON.stringify(params.body),
  });
  const submitPayload = await readResponsePayload(submitRes);
  if (!submitRes.ok) {
    return {
      success: false,
      error: extractErrorMessage(submitPayload, `任务提交失败 (${submitRes.status})`),
    };
  }

  const immediateUrls = collectMediaUrls(submitPayload);
  if (immediateUrls.length > 0) {
    return { success: true, urls: immediateUrls };
  }

  const requestId = getRequestId(submitPayload);
  if (!requestId) {
    return {
      success: false,
      error: extractErrorMessage(submitPayload, "任务提交成功但未返回 request_id"),
    };
  }

  for (let i = 0; i < 30; i++) {
    await delay(6000);

    const pollRes = await fetch(`${SHENGSUANYUN_BASE_URL}/tasks/generations/${requestId}`, {
      method: "GET",
      headers: {
        ...APP_HEADERS,
        Authorization: `Bearer ${params.apiKey}`,
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!pollRes.ok) {
      continue;
    }

    const pollPayload = await readResponsePayload(pollRes);
    const status = getTaskStatus(pollPayload);
    if (taskFailed(status)) {
      return {
        success: false,
        error: getTaskFailureReason(pollPayload),
      };
    }

    const urls = collectMediaUrls(pollPayload);
    const progress = getTaskProgress(pollPayload);
    if (taskFinished(status, progress, urls)) {
      if (urls.length > 0) {
        return { success: true, urls };
      }
      return {
        success: false,
        error: extractErrorMessage(pollPayload, "任务完成但未返回可用地址"),
      };
    }
  }

  return {
    success: false,
    error: "任务超时（约 3 分钟），请稍后重试",
  };
}

function normalizeSsySize(value: unknown): unknown {
  if (typeof value !== "string") return value;
  return value.replace(/[xX×]/g, "*");
}

async function generate(
  params: Record<string, unknown>,
): Promise<{ success: boolean; urls?: string[]; error?: string }> {
  try {
    const { apiKey, supportApis, ...rest } = params;
    const token = typeof apiKey === "string" ? apiKey.trim() : "";
    if (!token) {
      return { success: false, error: "ShengSuanYun API key not configured" };
    }

    const apis = Array.isArray(supportApis)
      ? supportApis.filter((item): item is string => typeof item === "string")
      : [];
    const hasTaskApi = apis.includes("/v1/tasks/generations");
    const hasImageApi = apis.includes("/v1/images/generations");

    if (!hasTaskApi && !hasImageApi) {
      return { success: false, error: "该模型未开放可调用的生成端点" };
    }

    for (const key of ["size", "image_size", "resolution"]) {
      if (key in rest) {
        rest[key] = normalizeSsySize(rest[key]);
      }
    }

    if (hasTaskApi) {
      return callTaskGenerations({ apiKey: token, body: rest });
    }

    return callImageGenerations({ apiKey: token, body: rest });
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

function sanitizeToolName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_.-]/g, "_").replace(/_+/g, "_");
}

async function loadShengSuanYunTools(opts?: { config?: OpenClawConfig }): Promise<AnyAgentTool[]> {
  const models = await getShengSuanYunModalityModels();
  const tools: AnyAgentTool[] = [];
  for (const model of models) {
    const displayName = String(model.name || model.model_name || model.id);
    const providerName = String(model.company || model.company_name || "ShengSuanYun");
    const label = `${providerName} ${displayName} Generate tool`;
    const name = sanitizeToolName(model.id || displayName);
    const description = `Generate content using ${providerName} ${displayName}. ${model.description || model.desc || ""}`;
    let inputSchema: JsonSchema = {};
    try {
      inputSchema = JSON.parse(model.input_schema || "{}") as JsonSchema;
    } catch (e) {
      console.log(`[shengsuanyun-generate] Parse input_schema error for ${model.id}:`, e);
      continue;
    }
    const parameters = generateTypebox(inputSchema);
    const supportApis = Array.isArray(model.support_apis)
      ? model.support_apis.filter((item): item is string => typeof item === "string")
      : [];

    tools.push({
      label,
      name,
      description,
      parameters,
      execute: async (_toolCallId, args) => {
        const cfg = opts?.config ?? loadConfig();
        const resolved = await resolveApiKeyForProvider({ provider: "shengsuanyun", cfg });
        if (!resolved.apiKey) {
          throw new Error("ShengSuanYun API key not configured");
        }
        const params = args as Record<string, unknown>;
        const apiParams: Record<string, unknown> = {
          model: model.api_name || model.id,
          supportApis,
        };

        const schemaToUse = pickSchema(inputSchema, params);
        const extractParams = (schema: JsonSchema) => {
          if (!schema.properties) {
            return;
          }
          for (const [key, prop] of Object.entries(
            schema.properties as Record<string, JsonSchema>,
          )) {
            const isRequired = schema.required?.includes(key);

            if (prop.type === "array") {
              const value = readStringArrayParam(params, key, { required: isRequired });
              if (value !== undefined) {
                apiParams[key] = value;
              }
            } else if (prop.type === "number" || prop.type === "integer") {
              const value = readNumberParam(params, key, { required: isRequired });
              if (value !== undefined) {
                apiParams[key] = value;
              }
            } else if (prop.type === "boolean") {
              const value = readBooleanParam(params, key, { required: isRequired });
              if (value !== undefined) {
                apiParams[key] = value;
              }
            } else if (prop.type === "object") {
              const value = readObjectParam(params, key, { required: isRequired });
              if (value !== undefined) {
                apiParams[key] = value;
              }
            } else {
              const value = readStringParam(params, key, { required: isRequired });
              if (value !== undefined) {
                apiParams[key] = value;
              }
            }
          }
        };

        extractParams(schemaToUse);

        const result = await generate({ ...apiParams, apiKey: resolved.apiKey });
        if (result.success && result.urls) {
          const lines: string[] = [];
          for (const url of result.urls) {
            lines.push(`MEDIA:${url}`);
          }
          return {
            content: [{ type: "text", text: lines.join("\n") }],
            details: {
              urls: result.urls,
              model: model.id,
              provider: "shengsuanyun",
            },
          };
        }
        return {
          content: [
            {
              type: "text",
              text: result.error ?? "Content generation failed",
            },
          ],
          details: { error: result.error },
        };
      },
    });
  }
  console.log(`[shengsuanyun-generate] Loaded ${tools.length} dynamic tools`);
  return tools;
}

interface JsonSchema {
  $schema?: string;
  type?: string;
  title?: string;
  description?: string;
  default?: unknown;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  anyOf?: JsonSchema[];
  enum?: Array<string | number>;
  format?: string;
  ssy?: string;
  [key: string]: unknown;
}

function pickSchema(schema: JsonSchema, params: Record<string, unknown>): JsonSchema {
  if (!Array.isArray(schema.anyOf) || schema.anyOf.length === 0) {
    return schema;
  }
  for (const candidate of schema.anyOf) {
    const required = Array.isArray(candidate.required) ? candidate.required : [];
    const matched = required.every((field) => {
      const value = params[field];
      if (value === undefined || value === null) {
        return false;
      }
      if (typeof value === "string") {
        return value.trim().length > 0;
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return true;
    });
    if (matched) {
      return candidate;
    }
  }
  return schema.anyOf[0];
}

function readBooleanParam(
  params: Record<string, unknown>,
  key: string,
  options?: { required?: boolean },
): boolean | undefined {
  const value = params[key];
  if (value === undefined || value === null || value === "") {
    if (options?.required) {
      throw new Error(`Missing required boolean param: ${key}`);
    }
    return undefined;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    return value !== 0;
  }
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    if (["true", "1", "yes", "y", "on"].includes(lowered)) {
      return true;
    }
    if (["false", "0", "no", "n", "off"].includes(lowered)) {
      return false;
    }
  }
  throw new Error(`Invalid boolean param: ${key}`);
}

function readObjectParam(
  params: Record<string, unknown>,
  key: string,
  options?: { required?: boolean },
): Record<string, unknown> | undefined {
  const value = params[key];
  if (value === undefined || value === null || value === "") {
    if (options?.required) {
      throw new Error(`Missing required object param: ${key}`);
    }
    return undefined;
  }
  if (isObject(value)) {
    return value;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (isObject(parsed)) {
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  throw new Error(`Invalid object param: ${key}`);
}

export function generateTypebox(schema: JsonSchema): TSchema {
  const getOptions = (s: JsonSchema): Record<string, unknown> => {
    const options: Record<string, unknown> = {};
    if (s.title) {
      options.title = s.title;
    }
    if (s.description) {
      options.description = s.description;
    }
    if (s.default !== undefined) {
      options.default = s.default;
    }
    return options;
  };

  const parse = (node: JsonSchema): TSchema => {
    const options = getOptions(node);

    // Handle anyOf as Union
    if (node.anyOf && Array.isArray(node.anyOf)) {
      const unions = node.anyOf.map((item: JsonSchema) => parse(item));
      return Type.Union(unions, Object.keys(options).length > 0 ? options : undefined);
    }

    // Handle enum as Union of Literals
    if (node.enum && Array.isArray(node.enum)) {
      const literals = node.enum.map((val: string | number) => Type.Literal(val));
      return Type.Union(literals, Object.keys(options).length > 0 ? options : undefined);
    }

    // Handle object type
    if (node.type === "object" || node.properties) {
      if (!node.properties) {
        return Type.Object({}, Object.keys(options).length > 0 ? options : undefined);
      }

      const props: Record<string, TSchema> = {};
      for (const [key, value] of Object.entries(node.properties as Record<string, JsonSchema>)) {
        const isRequired =
          node.required && Array.isArray(node.required) && node.required.includes(key);
        const propSchema = parse(value);
        props[key] = isRequired ? propSchema : Type.Optional(propSchema);
      }

      return Type.Object(props, Object.keys(options).length > 0 ? options : undefined);
    }

    // Handle array type
    if (node.type === "array") {
      const itemsSchema = node.items ? parse(node.items) : Type.Any();
      return Type.Array(itemsSchema, Object.keys(options).length > 0 ? options : undefined);
    }

    // Handle primitive types
    if (node.type === "string" || (!node.type && !node.anyOf && !node.enum)) {
      return Type.String(Object.keys(options).length > 0 ? options : undefined);
    }
    if (node.type === "number" || node.type === "integer") {
      return Type.Number(Object.keys(options).length > 0 ? options : undefined);
    }
    if (node.type === "boolean") {
      return Type.Boolean(Object.keys(options).length > 0 ? options : undefined);
    }

    return Type.Unknown();
  };

  return parse(schema);
}

// Fallback tools that are always available
let cachedTools: AnyAgentTool[] | null = null;
let loadPromise: Promise<AnyAgentTool[]> | null = null;

export async function preloadShengSuanYunTools(opts?: { config?: OpenClawConfig }): Promise<void> {
  if (cachedTools !== null) {
    return;
  }

  if (loadPromise !== null) {
    await loadPromise;
    return;
  }
  loadPromise = loadShengSuanYunTools(opts)
    .then((tools) => {
      const fallbackTools = [createZImageTurboTool(opts), createGemini3ProImageTool(opts)];
      cachedTools = [...tools, ...fallbackTools];
      return cachedTools;
    })
    .catch((err) => {
      console.error("[shengsuanyun-generate] Failed to load tools, using fallback only:", err);
      const fallbackTools = [createZImageTurboTool(opts), createGemini3ProImageTool(opts)];
      cachedTools = fallbackTools;
      return cachedTools;
    })
    .finally(() => {
      loadPromise = null;
    });
  await loadPromise;
}

export function createGenerateTools(opts?: { config?: OpenClawConfig }): AnyAgentTool[] {
  if (cachedTools !== null) {
    return cachedTools;
  }
  preloadShengSuanYunTools(opts).catch((err) => {
    console.error("[shengsuanyun-generate] Background preload failed:", err);
  });
  const fallbackTools = [createZImageTurboTool(opts), createGemini3ProImageTool(opts)];
  return fallbackTools;
}
