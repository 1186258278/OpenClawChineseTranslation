import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(new URL("../../.github/workflows/build-core.yml", import.meta.url), "utf8");
// Upstream ce0e84d drops Node 22 and requires >=24.16.0 <25 || >=26.1.0.
// Pin the same supported runtime for building, publishing, and Docker installs.
const expectedNodeVersion = "24.16.0";

for (const filename of ["build-core.yml", "nightly.yml", "sync-and-release.yml"]) {
  test(`${filename} configures the supported release runtime`, () => {
    const source = readFileSync(new URL(`../../.github/workflows/${filename}`, import.meta.url), "utf8");
    const configuredVersion = source.match(/^  NODE_VERSION: '([^']+)'$/m)?.[1];

    assert.equal(configuredVersion, expectedNodeVersion);
    assert.match(source, /node-version: \$\{\{ env\.NODE_VERSION \}\}/);
  });
}

test("Docker uses the same supported Node runtime as CI", () => {
  const dockerfile = readFileSync(new URL("../../Dockerfile", import.meta.url), "utf8");
  const configuredVersion = dockerfile.match(/^FROM node:([^\s]+)-slim$/m)?.[1];

  assert.equal(configuredVersion, expectedNodeVersion);
});

test("build-core runs runtime regression checks before cloning upstream", () => {
  const testCommand = "node --test tests/node/build-core-workflow.test.mjs tests/node/prepare-publish-package.test.mjs";
  const testIndex = workflow.indexOf(testCommand);
  const cloneIndex = workflow.indexOf("- name: 克隆上游代码");

  assert.ok(testIndex !== -1, "core build must run both workflow and package regression tests");
  assert.ok(cloneIndex > testIndex, "runtime regression checks must run before cloning upstream");
});

test("build-core supports current upstream .mts build scripts", () => {
  assert.match(workflow, /run_optional_script scripts\/tsdown-build true/);
  assert.match(workflow, /node --import tsx "\$\{base\}\.mts"/);
  assert.match(workflow, /run_optional_script scripts\/build-stamp false/);
  assert.match(workflow, /run_optional_script scripts\/runtime-postbuild-stamp false/);
});

test("build-core no longer hard-codes removed .mjs build entrypoints", () => {
  assert.doesNotMatch(workflow, /^\s*node scripts\/tsdown-build\.mjs\s*$/m);
  assert.doesNotMatch(workflow, /^\s*node scripts\/build-stamp\.mjs \|\| true\s*$/m);
});
