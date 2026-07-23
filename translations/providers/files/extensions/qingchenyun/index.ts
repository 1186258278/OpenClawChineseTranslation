import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { applyCiyapiConfig, CIYAPI_DEFAULT_MODEL_REF } from "./onboard.js";
import { buildCiyapiProvider, CIYAPI_SPONSOR_NOTE } from "./provider-catalog.js";

const PROVIDER_ID = "ciyapi";

export default defineSingleProviderPluginEntry({
  id: PROVIDER_ID,
  name: "CiyAPI Provider",
  description: `词元 API / CiyAPI sponsored OpenAI Compatible provider plugin. ${CIYAPI_SPONSOR_NOTE}`,
  provider: {
    label: "词元 API",
    docsPath: "/providers/ciyapi",
    auth: [
      {
        methodId: "api-key",
        label: "词元 API 密钥",
        hint: `Sponsored: 支持 GPT、Claude、Gemini、Grok、Kimi 等主流前沿模型；充值 ¥1 到账 $1 平台额度，部分线路按折扣计费。密钥：https://ciyapi.79tian.com/keys/。${CIYAPI_SPONSOR_NOTE}`,
        optionKey: "ciyapiApiKey",
        flagName: "--ciyapi-api-key",
        envVar: "CIYAPI_API_KEY",
        promptMessage: "输入词元 API 密钥（https://ciyapi.79tian.com/keys/ 获取）",
        defaultModel: CIYAPI_DEFAULT_MODEL_REF,
        applyConfig: (cfg) => applyCiyapiConfig(cfg),
        wizard: {
          groupLabel: "词元 API",
          groupHint: `Sponsored: OpenAI Compatible，模型与价格见 https://ciyapi.79tian.com/pricing/。${CIYAPI_SPONSOR_NOTE}`,
        },
      },
    ],
    catalog: {
      buildProvider: buildCiyapiProvider,
    },
  },
});
