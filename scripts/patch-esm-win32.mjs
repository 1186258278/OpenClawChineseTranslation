#!/usr/bin/env node
/**
 * 修复上游 jiti tryNative 在 Windows 上的 ESM URL 错误
 *
 * 上游 bug 1: 多个 dist 文件中的 tryNative 逻辑使用
 *   shouldPreferNativeJiti(modulePath) || modulePath.includes(`${path.sep}dist${path.sep}`)
 *   在 Windows 上 || 后面的 dist 路径检查绕过了 win32 保护。
 *
 * 上游 bug 2: buildPluginLoaderJitiOptions 中硬编码 tryNative: true，
 *   被 doctor-contract-registry 和 setup-registry 等直接使用。
 *
 * 两者都导致 jiti 尝试用原生 ESM import() 加载 C:\... 路径，
 * 触发 ERR_UNSUPPORTED_ESM_URL_SCHEME。
 *
 * 用法: node scripts/patch-esm-win32.mjs <openclaw-dir>
 */
import fs from 'node:fs';
import path from 'node:path';

const targetDir = process.argv[2];
if (!targetDir) {
  console.error('用法: node scripts/patch-esm-win32.mjs <openclaw-dir>');
  process.exit(1);
}

const distDir = path.join(targetDir, 'dist');
if (!fs.existsSync(distDir)) {
  console.error(`❌ dist 目录不存在: ${distDir}`);
  process.exit(1);
}

const files = fs.readdirSync(distDir).filter(f => f.endsWith('.js'));
let patched = 0;

// Bug 1: shouldPreferNativeJiti(modulePath) || modulePath.includes(`${path.sep}dist${path.sep}`)
// 匹配完整表达式（含 includes 的闭合括号），确保替换后括号平衡
const BUG1 = /shouldPreferNativeJiti\(modulePath\) \|\| modulePath\.includes\(`\$\{path\.sep\}dist\$\{path\.sep\}`\)/g;
const FIX1 = 'shouldPreferNativeJiti(modulePath) || (process.platform !== "win32" && modulePath.includes(`${path.sep}dist${path.sep}`))';

for (const file of files) {
  const filePath = path.join(distDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  if (BUG1.test(content)) {
    BUG1.lastIndex = 0;
    const fixed = content.replace(BUG1, FIX1);
    fs.writeFileSync(filePath, fixed, 'utf8');
    patched++;
    console.log(`  ✅ ${file} (tryNative || dist路径)`);
  }
}

// Bug 2: buildPluginLoaderJitiOptions 中 tryNative: true 硬编码
for (const file of files) {
  const filePath = path.join(distDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const fnIdx = content.indexOf('buildPluginLoaderJitiOptions');
  if (fnIdx === -1) continue;
  const chunk = content.substring(fnIdx, Math.min(content.length, fnIdx + 500));
  const target = 'tryNative: true,';
  const tIdx = chunk.indexOf(target);
  if (tIdx === -1) continue;
  const absIdx = fnIdx + tIdx;
  const fixed = content.substring(0, absIdx)
    + 'tryNative: process.platform !== "win32",'
    + content.substring(absIdx + target.length);
  fs.writeFileSync(filePath, fixed, 'utf8');
  patched++;
  console.log(`  ✅ ${file} (tryNative: true 硬编码)`);
}

if (patched > 0) {
  console.log(`🔧 ESM Win32 patch: ${patched} 处已修复`);
} else {
  console.log('ℹ️  ESM Win32 patch: 无需修复（上游可能已修复）');
}
