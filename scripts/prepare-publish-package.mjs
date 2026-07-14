import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const PUBLISHED_PACKAGE_NAME = '@qingchencloud/openclaw-zh'
const RUNTIME_DEPENDENCY_FIELDS = ['dependencies', 'optionalDependencies', 'peerDependencies']
const SUPPORTED_WORKSPACE_DEPENDENCIES = new Set(['@openclaw/ai'])

function publishedWorkspaceVersion(specifier, upstreamVersion) {
  const workspaceRange = specifier.slice('workspace:'.length)
  if (workspaceRange === '*' || workspaceRange === '') return upstreamVersion
  if (workspaceRange === '^') return `^${upstreamVersion}`
  if (workspaceRange === '~') return `~${upstreamVersion}`
  throw new Error(`不支持的 workspace 版本范围: ${specifier}`)
}

export function preparePublishManifest(
  source,
  { releaseVersion, upstreamVersion, versionType },
) {
  if (!releaseVersion || !upstreamVersion) {
    throw new Error('发布版本和上游版本不能为空')
  }
  if (versionType === 'stable' && !releaseVersion.startsWith(`${upstreamVersion}-zh.`)) {
    throw new Error(`稳定版与上游版本不匹配: ${releaseVersion} / ${upstreamVersion}`)
  }

  const prepared = structuredClone(source)
  prepared.name = PUBLISHED_PACKAGE_NAME
  prepared.version = releaseVersion
  prepared.description =
    versionType === 'nightly'
      ? 'OpenClaw 汉化发行版 (Nightly) - 武汉晴辰天下网络科技有限公司'
      : 'OpenClaw 汉化发行版（稳定版）- 武汉晴辰天下网络科技有限公司'

  for (const field of RUNTIME_DEPENDENCY_FIELDS) {
    const dependencies = prepared[field]
    if (!dependencies) continue

    for (const [name, specifier] of Object.entries(dependencies)) {
      if (typeof specifier !== 'string' || !specifier.startsWith('workspace:')) continue
      if (!SUPPORTED_WORKSPACE_DEPENDENCIES.has(name)) {
        throw new Error(`不支持的 workspace 运行时依赖: ${field}.${name}=${specifier}`)
      }
      dependencies[name] = publishedWorkspaceVersion(specifier, upstreamVersion)
    }
  }

  for (const field of RUNTIME_DEPENDENCY_FIELDS) {
    for (const [name, specifier] of Object.entries(prepared[field] ?? {})) {
      if (typeof specifier === 'string' && specifier.startsWith('workspace:')) {
        throw new Error(`发布清单仍包含 workspace 运行时依赖: ${field}.${name}=${specifier}`)
      }
    }
  }

  return prepared
}

async function main() {
  const [manifestPath, releaseVersion, upstreamVersion, versionType] = process.argv.slice(2)
  if (!manifestPath || !releaseVersion || !upstreamVersion || !versionType) {
    throw new Error(
      '用法: node scripts/prepare-publish-package.mjs <package.json> <release-version> <upstream-version> <stable|nightly>',
    )
  }

  const source = JSON.parse(await readFile(manifestPath, 'utf8'))
  const prepared = preparePublishManifest(source, {
    releaseVersion,
    upstreamVersion,
    versionType,
  })
  await writeFile(manifestPath, `${JSON.stringify(prepared, null, 2)}\n`)
  console.log(
    `发布清单已准备: ${prepared.name}@${prepared.version}, @openclaw/ai=${prepared.dependencies?.['@openclaw/ai'] ?? '未使用'}`,
  )
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main()
}
