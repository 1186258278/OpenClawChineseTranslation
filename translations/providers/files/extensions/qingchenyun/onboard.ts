import {
  createModelCatalogPresetAppliers,
  type OpenClawConfig,
} from "openclaw/plugin-sdk/provider-onboard";
import { buildCiyapiProvider, CIYAPI_BASE_URL } from "./provider-catalog.js";

export const CIYAPI_DEFAULT_MODEL_REF = "ciyapi/auto";

const ciyapiPresetAppliers = createModelCatalogPresetAppliers({
  primaryModelRef: CIYAPI_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: OpenClawConfig) => ({
    providerId: "ciyapi",
    api: "openai-completions" as const,
    baseUrl: CIYAPI_BASE_URL,
    catalogModels: buildCiyapiProvider().models,
    aliases: [
      { modelRef: CIYAPI_DEFAULT_MODEL_REF, alias: "词元 API" },
      { modelRef: CIYAPI_DEFAULT_MODEL_REF, alias: "CiyAPI" },
    ],
  }),
});

export function applyCiyapiProviderConfig(cfg: OpenClawConfig): OpenClawConfig {
  return ciyapiPresetAppliers.applyProviderConfig(cfg);
}

export function applyCiyapiConfig(cfg: OpenClawConfig): OpenClawConfig {
  return ciyapiPresetAppliers.applyConfig(cfg);
}
