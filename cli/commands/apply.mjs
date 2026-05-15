/**
 * apply 命令 - 应用汉化补丁
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { 
  loadMainConfig, 
  loadAllTranslations, 
  applyTranslation,
  applyCopyFiles,
  printStats,
  ROOT_DIR 
} from '../utils/i18n-engine.mjs';
import { log, colors } from '../utils/logger.mjs';

/**
 * 查找 OpenClaw 目录
 */
async function findOpenClawDir() {
  const candidates = [
    path.resolve(ROOT_DIR, 'openclaw'),
    path.resolve(ROOT_DIR, 'upstream'),
  ];
  
  // 尝试从 npm 找到全局安装位置
  try {
    const npmRoot = execSync('npm root -g', { encoding: 'utf-8' }).trim();
    candidates.push(path.join(npmRoot, 'openclaw'));
    candidates.push(path.join(npmRoot, 'openclaw-zh'));
  } catch {}
  
  for (const dir of candidates) {
    try {
      const pkgPath = path.join(dir, 'package.json');
      const content = await fs.readFile(pkgPath, 'utf-8');
      const pkg = JSON.parse(content);
      if (pkg.name === 'openclaw' || pkg.name === 'openclaw-zh') {
        return dir;
      }
    } catch {}
  }
  
  return null;
}

export async function applyCommand(args) {
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose') || args.includes('-v');
  const verify = args.includes('--verify');
  const targetArg = args.find(a => a.startsWith('--target='));
  
  console.log(`\n🦞 ${colors.bold}OpenClaw 汉化工具${colors.reset}\n`);
  
  if (dryRun) {
    log.warn('模式: 预览 (--dry-run)');
  } else if (verify) {
    log.warn('模式: 验证 (--verify)');
  } else {
    log.success('模式: 应用');
  }
  
  // 确定目标目录（支持 Windows 绝对路径）
  let targetDir = targetArg ? path.resolve(targetArg.split('=')[1]) : null;
  
  if (!targetDir) {
    targetDir = await findOpenClawDir();
  }
  
  if (!targetDir) {
    log.error('找不到 OpenClaw 目录');
    console.log(`请使用 ${colors.cyan}--target=/path/to/openclaw${colors.reset} 指定目录`);
    console.log(`或将 OpenClaw 克隆到 ${colors.dim}../openclaw${colors.reset}`);
    process.exit(1);
  }
  
  // 检查目标目录
  try {
    await fs.access(targetDir);
  } catch {
    log.error(`目标目录不存在: ${targetDir}`);
    process.exit(1);
  }
  
  log.info(`目标目录: ${targetDir}`);
  
  // 加载配置
  const mainConfig = await loadMainConfig();
  const translations = await loadAllTranslations(mainConfig, verbose);
  
  log.info(`已加载 ${translations.length} 个翻译配置`);
  
  // 应用翻译
  const allStats = [];
  for (const translation of translations) {
    // 区分 copyFiles 类型和 replacements 类型
    if (translation.copyFiles && Array.isArray(translation.copyFiles)) {
      const stats = await applyCopyFiles(translation, targetDir, {
        dryRun,
        verify,
        verbose
      });
      allStats.push(stats);
    } else if (translation.replacements) {
      const stats = await applyTranslation(translation, targetDir, {
        dryRun,
        verify,
        verbose
      });
      allStats.push(stats);
    }
  }
  
  // 打印统计
  printStats(allStats, { dryRun, verify });

  // 重新生成 schema.base.generated.ts / bundled-channel-config-metadata.generated.ts
  // 这两个 generated 文件含有 inline title/description（来自 schema.labels.ts/schema.help.ts），
  // 是 Dashboard 配置页 UI label 的真正来源。apply 翻译后必须重新生成才能让汉化生效。
  if (!dryRun && !verify) {
    await regenerateSchemaArtifacts(targetDir);
  }
}

/**
 * 重新生成依赖 schema.labels.ts/schema.help.ts 的 generated 文件
 */
async function regenerateSchemaArtifacts(targetDir) {
  const generators = [
    {
      script: 'scripts/generate-base-config-schema.ts',
      label: 'schema.base.generated.ts',
    },
    {
      script: 'scripts/generate-bundled-channel-config-metadata.ts',
      label: 'bundled-channel-config-metadata.generated.ts',
    },
  ];

  console.log('');
  log.info('🔄 重新生成 schema 派生文件（让汉化的 labels/help 进入 Dashboard）');

  // 写一个临时 mjs 调用 module API（避免 tsx 入口判定不触发 main 块的问题）
  const runnerPath = path.join(targetDir, '.openclaw-zh-regen-runner.mjs');
  const runnerSource = `
const base = await import("./scripts/generate-base-config-schema.ts");
const bundled = await import("./scripts/generate-bundled-channel-config-metadata.ts");
if (typeof base.writeBaseConfigSchemaModule === "function") {
  const r1 = base.writeBaseConfigSchemaModule();
  console.log("base:" + (r1?.changed ?? "?"));
} else if (typeof base.checkBaseConfigSchema === "function") {
  base.checkBaseConfigSchema();
  console.log("base:runtime");
} else {
  console.log("base:?");
}
const r2 = await bundled.writeBundledChannelConfigMetadataModule();
console.log("bundled:" + (r2?.changed ?? "?"));
`;

  try {
    await fs.writeFile(runnerPath, runnerSource, 'utf-8');
  } catch (err) {
    log.warn(`  无法写入 runner: ${err.message}`);
    return;
  }

  try {
    const out = execSync(`node --import tsx ".openclaw-zh-regen-runner.mjs"`, {
      cwd: targetDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    for (const line of out.split('\n')) {
      const m = line.match(/^(base|bundled):(.+)$/);
      if (!m) continue;
      const [, kind, status] = m;
      const fileLabel =
        kind === 'base'
          ? 'schema.base.generated.ts'
          : 'bundled-channel-config-metadata.generated.ts';
      const normalizedStatus = status.trim();
      if (normalizedStatus === 'true') {
        log.success(`  ${fileLabel} 已更新`);
      } else if (normalizedStatus === 'runtime') {
        log.dim(`  ${fileLabel} 运行时计算，无需生成`);
      } else {
        log.dim(`  ${fileLabel} 无变化`);
      }
    }
  } catch (err) {
    log.warn(`  重新生成失败: ${err.message?.split('\n')[0] ?? err}`);
  } finally {
    await fs.unlink(runnerPath).catch(() => {});
  }
}
