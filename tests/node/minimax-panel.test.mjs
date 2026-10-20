import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";
import { buildCiyapiProvider } from "../../translations/providers/files/extensions/qingchenyun/provider-catalog.ts";
import { buildShengsuanyunProvider } from "../../translations/providers/files/extensions/shengsuanyun/provider-catalog.ts";

const source = await readFile(new URL("../../translations/panel/feature-panel.js", import.meta.url), "utf8");
const decode = value => value.replaceAll("&quot;", '"').replaceAll("&#39;", "'")
  .replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");

class Element {
  value = "";
  textContent = "";
  style = {};
  options = [];
  html = "";
  set innerHTML(value) {
    this.html = value;
    this.options = [...value.matchAll(/<option value="([^"]*)"/g)].map(match => decode(match[1]));
    if (this.options.length) this.value = this.options[0];
  }
  get innerHTML() { return this.html; }
}

async function panel(models, selected = "auto") {
  const elements = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  element("ciyapi-api-key").value = "offline-fixture";
  element("ssy-api-key").value = "offline-fixture";
  element("ciyapi-model-select").value = selected;
  const requests = [];
  const storage = new Map();
  const context = vm.createContext({
    window: {},
    document: {
      readyState: "loading", body: {}, addEventListener() {},
      getElementById: element,
      createElement() {
        return {
          textContent: "",
          get innerHTML() {
            return this.textContent.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
          },
        };
      },
    },
    MutationObserver: class { observe() {} },
    localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
    fetch: async (url, options = {}) => {
      requests.push({ url, ...options });
      const payload = options.method === "POST"
        ? { choices: [{ message: { content: "ok" } }] }
        : { data: models };
      return { ok: true, json: async () => payload, text: async () => JSON.stringify(payload) };
    },
  });
  // Execute the shipped IIFE and expose its real handlers only in this VM.
  vm.runInContext(source.replace(/\}\)\(\);\s*$/, `
    globalThis.handlers = { fetchCiyapiModels, testCiyapiModel, fetchSsyLlmModels,
      renderQuickModelOptions, ssyTestModel, generateConfigCommands, ssyModelState };
  })();`), context);
  return { ...context.handlers, element, requests, context };
}

const ciyapiModels = [
  "MiniMax-M2.7", "MiniMax-M3", "other-model", "MiniMax-M3.1-Flash",
  "MiniMax-M2.5-highspeed", "abab6.5-chat", "minimax/speech-2.8-hd",
].map(id => ({ id }));

test("CiyAPI refresh offers advertised current models in order and serializes the default", async () => {
  const app = await panel(ciyapiModels);
  await app.fetchCiyapiModels();
  const select = app.element("ciyapi-model-select");
  assert.deepEqual(select.options.filter(id => id.startsWith("MiniMax")), ["MiniMax-M3.1-Flash", "MiniMax-M3"]);
  assert.ok(select.options.includes("other-model"));
  assert.ok(select.options.includes("minimax/speech-2.8-hd"));
  assert.ok(!select.options.includes("abab6.5-chat"));
  assert.equal(select.value, "auto");
  assert.match(app.element("ciyapi-cmd-text").textContent, /"ciyapi\/auto"/);
  await app.testCiyapiModel();
  const request = app.requests.at(-1);
  assert.equal(request.url, "https://ciyapi.79tian.com/v1/chat/completions");
  assert.equal(request.headers.Authorization, "Bearer offline-fixture");
  assert.equal(JSON.parse(request.body).model, "auto");
});

for (const selected of ["MiniMax-M3.1-Flash", "MiniMax-M3", "MiniMax-M2.7", "custom-private-model"]) {
  test(`CiyAPI preserves ${selected} across refresh and at the HTTP boundary`, async () => {
    const app = await panel(ciyapiModels, selected);
    await app.fetchCiyapiModels();
    assert.equal(app.element("ciyapi-model-select").value, selected);
    assert.ok(app.element("ciyapi-model-select").options.includes(selected));
    assert.ok(app.element("ciyapi-cmd-text").textContent.includes(`"ciyapi/${selected}"`));
    await app.testCiyapiModel();
    const payload = JSON.parse(app.requests.at(-1).body);
    assert.equal(payload.model, selected);
    assert.equal(payload.max_tokens, 64);
    assert.equal(payload.messages[0].role, "user");
    for (const field of ["thinking", "reasoning_effort", "service_tier", "reasoning_split"]) {
      assert.equal(field in payload, false);
    }
  });
}

test("CiyAPI never synthesizes gateway models absent from the response", async () => {
  const app = await panel([{ id: "MiniMax-M2.7" }, { id: "other-model" }]);
  await app.fetchCiyapiModels();
  assert.deepEqual(app.element("ciyapi-model-select").options.filter(id => id.startsWith("MiniMax")), []);
  assert.equal(app.element("ciyapi-model-select").value, "auto");
});

test("CiyAPI preserves selection when the model list request fails", async () => {
  const app = await panel([], "MiniMax-M2.7");
  app.context.fetch = async () => { throw new Error("offline"); };
  await app.fetchCiyapiModels();
  assert.equal(app.element("ciyapi-model-select").value, "MiniMax-M2.7");
  assert.match(app.element("ciyapi-cmd-text").textContent, /ciyapi\/MiniMax-M2.7/);
});

const ssyModel = (id, api = "/v1/chat/completions") => ({
  id, name: id, support_apis: [api], architecture: { input: "text+image+video", output: "text" },
});

for (const [api, suffix] of [["/v1/chat/completions", "/chat/completions"], ["/v1/messages", "/messages"], ["/v1/responses", "/responses"]]) {
  test(`Gateway picker preserves explicit legacy model and ${api} request protocol`, async () => {
    const legacy = "minimax/minimax-m2.7";
    const app = await panel([
      ssyModel(legacy, api), ssyModel("minimax/minimax-m3"),
      ssyModel("minimax/minimax-m3.1-flash"), ssyModel("other-model"),
    ]);
    app.ssyModelState.llmModels = await app.fetchSsyLlmModels("offline-fixture");
    app.renderQuickModelOptions(legacy);
    assert.deepEqual(app.element("ssy-model-select").options.filter(id => id.startsWith("minimax/")), [
      "minimax/minimax-m3.1-flash", "minimax/minimax-m3",
    ]);
    assert.equal(app.element("ssy-model-select").value, "__custom__");
    assert.equal(app.element("ssy-custom-model").value, legacy);
    assert.ok(app.ssyModelState.llmModels.some(model => model.id === legacy));
    app.generateConfigCommands();
    assert.ok(app.element("ssy-config-cmd-text").textContent.includes(`shengsuanyun/${legacy}`));
    await app.ssyTestModel();
    const request = app.requests.at(-1);
    assert.equal(request.url, `https://router.shengsuanyun.com/api/v1${suffix}`);
    const payload = JSON.parse(request.body);
    assert.equal(payload.model, legacy);
    assert.equal(payload.max_tokens || payload.max_output_tokens, 64);
  });
}

for (const selected of ["minimax/minimax-m3", "custom-private-model", "openai/gpt-4.1-nano"]) {
  test(`Gateway sends the selected ${selected} without replacement`, async () => {
    const app = await panel([ssyModel("minimax/minimax-m3"), ssyModel("openai/gpt-4.1-nano")]);
    app.ssyModelState.llmModels = await app.fetchSsyLlmModels("offline-fixture");
    app.renderQuickModelOptions(selected);
    assert.ok(!app.element("ssy-model-select").options.includes("minimax/minimax-m3.1-flash"));
    await app.ssyTestModel();
    assert.equal(JSON.parse(app.requests.at(-1).body).model, selected);
  });
}

test("Bundled catalogs avoid unverified routes and use gateway M3 limits", () => {
  assert.equal(buildCiyapiProvider().models.some(model => /minimax/i.test(model.id)), false);
  const models = buildShengsuanyunProvider().models;
  assert.deepEqual(models.filter(model => /minimax/i.test(model.id)), [{
    id: "minimax/minimax-m3", name: "MiniMax M3", contextWindow: 1000000, maxTokens: 81920,
  }]);
});
