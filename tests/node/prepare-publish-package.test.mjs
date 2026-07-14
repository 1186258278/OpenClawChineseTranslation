import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { preparePublishManifest } from '../../scripts/prepare-publish-package.mjs'

test('稳定版发布清单固定内部运行时依赖版本', () => {
  const source = {
    name: 'openclaw',
    version: '2026.7.1',
    description: 'OpenClaw',
    dependencies: {
      '@openclaw/ai': 'workspace:*',
      chalk: '5.6.2',
    },
  }

  const prepared = preparePublishManifest(source, {
    releaseVersion: '2026.7.1-zh.2',
    upstreamVersion: '2026.7.1',
    versionType: 'stable',
  })

  assert.equal(prepared.name, '@qingchencloud/openclaw-zh')
  assert.equal(prepared.version, '2026.7.1-zh.2')
  assert.equal(prepared.dependencies['@openclaw/ai'], '2026.7.1')
  assert.equal(source.dependencies['@openclaw/ai'], 'workspace:*')
})

test('未知 workspace 运行时依赖会阻断发布', () => {
  assert.throws(
    () =>
      preparePublishManifest(
        {
          name: 'openclaw',
          version: '2026.7.1',
          dependencies: { '@openclaw/unknown': 'workspace:*' },
        },
        {
          releaseVersion: '2026.7.1-zh.2',
          upstreamVersion: '2026.7.1',
          versionType: 'stable',
        },
      ),
    /不支持的 workspace 运行时依赖/,
  )
})

test('稳定版版本号与上游版本不一致时阻断发布', () => {
  assert.throws(
    () =>
      preparePublishManifest(
        { name: 'openclaw', version: '2026.7.2', dependencies: {} },
        {
          releaseVersion: '2026.7.1-zh.2',
          upstreamVersion: '2026.7.2',
          versionType: 'stable',
        },
      ),
    /与上游版本不匹配/,
  )
})

test('稳定版工作流从汉化版本反推上游版本而不是跟随 latest', () => {
  const workflow = readFileSync(
    new URL('../../.github/workflows/sync-and-release.yml', import.meta.url),
    'utf8',
  )
  assert.match(workflow, /UPSTREAM_VERSION="\$\{RELEASE_VERSION%%-zh\.\*\}"/)
  assert.match(workflow, /npm view "openclaw@\$\{UPSTREAM_VERSION\}" version/)
  assert.doesNotMatch(workflow, /registry\.npmjs\.org\/openclaw\/latest/)
})
