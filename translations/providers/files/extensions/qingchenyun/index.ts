import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { applyQtcoolConfig, QTCOOL_DEFAULT_MODEL_REF } from "./onboard.js";
import { buildQtcoolProvider } from "./provider-catalog.js";

const PROVIDER_ID = "qtcool";

export default defineSingleProviderPluginEntry({
  id: PROVIDER_ID,
  name: "QingChenYun Provider",
  description: "晴辰云项目方每日免费模型站 provider plugin (gpt.qt.cool)",
  provider: {
    label: "晴辰云",
    docsPath: "/providers/qtcool",
    auth: [
      {
        methodId: "api-key",
        label: "晴辰云 API 密钥",
        hint: "项目方每日免费模型站 — 在 https://gpt.qt.cool/user 获取密钥，签到领每日免费额度",
        optionKey: "qtcoolApiKey",
        flagName: "--qtcool-api-key",
        envVar: "QTCOOL_API_KEY",
        promptMessage: "输入晴辰云 API 密钥（https://gpt.qt.cool/user 获取）",
        defaultModel: QTCOOL_DEFAULT_MODEL_REF,
        applyConfig: (cfg) => applyQtcoolConfig(cfg),
        wizard: {
          groupLabel: "晴辰云",
          groupHint: "项目方每日免费模型站 — 签到领额度 (gpt.qt.cool)",
        },
      },
    ],
    catalog: {
      buildProvider: buildQtcoolProvider,
    },
  },
});
