import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const ciyapiBaseUrl = "https://ciyapi.79tian.com/v1";
const oldDomain = ["gpt", "qt", "cool"].join(".");
const oldProviderKey = ["qt", "cool"].join("");
const oldStorageKey = [oldProviderKey, "api", "key"].join("_");

async function text(path) {
  return readFile(resolve(repoRoot, path), "utf8");
}

async function json(path) {
  return JSON.parse(await text(path));
}

test("CiyAPI provider uses an independent key and base URL", async () => {
  const panel = await text("translations/panel/feature-panel.js");
  const manifest = await json("translations/providers/files/extensions/qingchenyun/openclaw.plugin.json");
  const csp = await json("translations/gateway/control-ui-csp.json");
  const catalog = await text("translations/providers/files/extensions/qingchenyun/provider-catalog.ts");
  const onboard = await text("translations/providers/files/extensions/qingchenyun/onboard.ts");

  assert.equal(manifest.id, "ciyapi");
  assert.deepEqual(manifest.providers, ["ciyapi"]);
  assert.deepEqual(manifest.providerAuthEnvVars.ciyapi, ["CIYAPI_API_KEY"]);
  assert.equal(manifest.providerAuthChoices[0].provider, "ciyapi");
  assert.equal(manifest.providerAuthChoices[0].optionKey, "ciyapiApiKey");

  assert.match(panel, /models\.providers\.ciyapi\.apiKey/);
  assert.match(panel, /models\.providers\.ciyapi\.baseUrl/);
  assert.match(panel, /agents\.defaults\.model\.primary "ciyapi\/\$\{modelId\}"/);
  assert.match(panel, /CIYAPI_API_BASE = 'https:\/\/ciyapi\.79tian\.com\/v1'/);
  assert.match(catalog, /CIYAPI_BASE_URL = "https:\/\/ciyapi\.79tian\.com\/v1"/);
  assert.match(onboard, /providerId: "ciyapi"/);
  assert.match(Object.values(csp.replacements).join("\n"), /https:\/\/ciyapi\.79tian\.com/);
  assert.equal(Object.values(csp.replacements).join("\n").includes("https://*.qt.cool"), false);
  assert.equal(ciyapiBaseUrl, "https://ciyapi.79tian.com/v1");
});

test("Sponsored labels and CiyAPI links are present in docs and runtime UI", async () => {
  const readme = await text("README.md");
  const docs = await text("docs/index.html");
  const panel = await text("translations/panel/feature-panel.js");
  const dashboard = await text("translations/dashboard/app-render.json");

  for (const source of [readme, docs, panel, dashboard]) {
    assert.match(source, /Sponsored|赞助推广|词元 API/);
    assert.match(source, /ciyapi\.79tian\.com/);
  }

  assert.match(docs, /rel="sponsored noopener noreferrer"/);
  assert.match(dashboard, /rel=\\"sponsored noopener noreferrer\\"/);
});

test("README and current runtime no longer reference the old sponsor endpoint", async () => {
  const currentRuntimeFiles = [
    "README.md",
    "docs/index.html",
    "translations/panel/feature-panel.js",
    "translations/dashboard/app-render.json",
    "translations/gateway/control-ui-csp.json",
    "translations/providers/files/extensions/qingchenyun/index.ts",
    "translations/providers/files/extensions/qingchenyun/onboard.ts",
    "translations/providers/files/extensions/qingchenyun/provider-catalog.ts",
    "translations/providers/files/extensions/qingchenyun/openclaw.plugin.json",
  ];

  for (const file of currentRuntimeFiles) {
    assert.equal((await text(file)).includes(oldDomain), false, `${file} contains the old sponsor domain`);
  }
});

test("CiyAPI setup does not read or overwrite the old provider configuration", async () => {
  const panel = await text("translations/panel/feature-panel.js");
  const onboard = await text("translations/providers/files/extensions/qingchenyun/onboard.ts");

  assert.equal(panel.includes(`models.providers.${oldProviderKey}`), false);
  assert.equal(panel.includes(oldStorageKey), false);
  assert.equal(onboard.includes(`providerId: "${oldProviderKey}"`), false);
  assert.match(onboard, /createModelCatalogPresetAppliers/);
  assert.match(onboard, /applyProviderConfig/);
  assert.match(onboard, /applyConfig/);
});
