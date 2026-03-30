import {
  createModelCatalogPresetAppliers,
  type OpenClawConfig,
} from "openclaw/plugin-sdk/provider-onboard";
import { buildQtcoolProvider, QTCOOL_BASE_URL } from "./provider-catalog.js";

export const QTCOOL_DEFAULT_MODEL_REF = "qtcool/auto";

const qtcoolPresetAppliers = createModelCatalogPresetAppliers({
  primaryModelRef: QTCOOL_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: OpenClawConfig) => ({
    providerId: "qtcool",
    api: "openai-completions" as const,
    baseUrl: QTCOOL_BASE_URL,
    catalogModels: buildQtcoolProvider().models,
    aliases: [{ modelRef: QTCOOL_DEFAULT_MODEL_REF, alias: "晴辰云" }],
  }),
});

export function applyQtcoolProviderConfig(cfg: OpenClawConfig): OpenClawConfig {
  return qtcoolPresetAppliers.applyProviderConfig(cfg);
}

export function applyQtcoolConfig(cfg: OpenClawConfig): OpenClawConfig {
  return qtcoolPresetAppliers.applyConfig(cfg);
}
