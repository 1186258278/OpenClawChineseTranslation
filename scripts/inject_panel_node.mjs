#!/usr/bin/env node
/**
 * OpenClaw 功能面板注入脚本 (Node.js 版)
 * 将 feature-panel.js/css 注入到 Dashboard 构建产物中
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const PANEL_DIR = path.join(ROOT_DIR, 'translations', 'panel');

// 从命令行参数获取目标目录
const targetDir = process.argv[2];
if (!targetDir) {
  console.error('用法: node inject_panel_node.mjs <openclaw-dir>');
  console.error('例如: node inject_panel_node.mjs D:\\Data\\PC\\openclaw-upstream');
  process.exit(1);
}

const controlUiDir = path.join(targetDir, 'dist', 'control-ui');
const assetsDir = path.join(controlUiDir, 'assets');

console.log('🦞 OpenClaw 功能面板注入');
console.log('═'.repeat(50));

// 检查目录
if (!fs.existsSync(assetsDir)) {
  console.error(`❌ 找不到 Dashboard 资源目录: ${assetsDir}`);
  process.exit(1);
}

console.log(`📁 目标目录: ${controlUiDir}`);

// 读取面板资源
let panelJs = fs.readFileSync(path.join(PANEL_DIR, 'feature-panel.js'), 'utf-8');
const panelCss = fs.readFileSync(path.join(PANEL_DIR, 'feature-panel.css'), 'utf-8');

// 注入面板数据
const panelDataPath = path.join(PANEL_DIR, 'panel-data.json');
if (fs.existsSync(panelDataPath)) {
  const panelData = JSON.parse(fs.readFileSync(panelDataPath, 'utf-8'));
  const panelDataJs = JSON.stringify(panelData);
  panelJs = panelJs.replace(
    /\/\*PANEL_DATA_PLACEHOLDER\*\/\{[\s\S]*?\}\/\*END_PANEL_DATA\*\//,
    panelDataJs
  );
  console.log('✅ 已注入面板数据');
}

console.log(`✅ feature-panel.js (${panelJs.length} bytes)`);
console.log(`✅ feature-panel.css (${panelCss.length} bytes)`);

const INJECT_MARKER = '/* === OpenClaw 功能面板 === */';
const CSS_MARKER = '/* === OpenClaw 功能面板样式 === */';

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function upsertMarkedBlock(content, marker, blockContent) {
  const block = `${marker}\n${blockContent}`;
  if (content.includes(marker)) {
    const pattern = new RegExp(`${escapeRegex(marker)}[\\s\\S]*$`);
    return {
      content: content.replace(pattern, block),
      replaced: true,
    };
  }
  return {
    content: `${content.replace(/\s*$/, '')}\n\n${block}\n`,
    replaced: false,
  };
}

// 注入 CSS
const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'));
let cssInjected = false;
for (const cssFile of cssFiles) {
  const cssPath = path.join(assetsDir, cssFile);
  const content = fs.readFileSync(cssPath, 'utf-8');
  const next = upsertMarkedBlock(content, CSS_MARKER, panelCss);
  if (next.content !== content) {
    fs.writeFileSync(cssPath, next.content);
    console.log(next.replaced ? `♻️ CSS 已更新: ${cssFile}` : `✅ CSS 已注入: ${cssFile}`);
  } else {
    console.log(`⏭️ CSS 已是最新: ${cssFile}`);
  }
  cssInjected = true;
}

// 注入 JS
const jsFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js') && !f.endsWith('.map'));
let jsInjected = false;

// 如果没有 CSS 文件，将 CSS 内嵌到 JS
let jsToInject = panelJs;
if (!cssInjected) {
  const cssInjectCode = `(function(){var s=document.createElement('style');s.textContent=${JSON.stringify(panelCss)};document.head.appendChild(s);})();`;
  jsToInject = cssInjectCode + '\n' + panelJs;
  console.log('📝 CSS 将内嵌到 JS 中');
}

// 找主 bundle
const mainPatterns = ['index-', 'index.js', '.bundle.js', 'main'];
for (const jsFile of jsFiles) {
  const isMain = mainPatterns.some(p => jsFile.includes(p));
  if (isMain) {
    const jsPath = path.join(assetsDir, jsFile);
    let content = fs.readFileSync(jsPath, 'utf-8');

    // 修复上游 i18n bug：loadLocale() 检测到非英文 locale 但不自动加载翻译文件
    // 问题：constructor 调用 loadLocale() 设置 this.locale="zh-CN"，但翻译文件只在 setLocale() 中异步加载
    //        而 setLocale() 有 guard `if(this.locale!==t)` 导致同 locale 不触发加载
    // 修复：检测到非英文 locale 且翻译未加载时，临时重置为 "en" 再调用 setLocale
    const i18nBugPattern = 'this.loadLocale()}loadLocale()';
    if (content.includes(i18nBugPattern)) {
      content = content.replace(
        i18nBugPattern,
        'this.loadLocale();if(this.locale!=="en"&&!this.translations[this.locale]){const _l=this.locale;this.locale="en";this.setLocale(_l)}}loadLocale()'
      );
      console.log('✅ i18n 自动加载修复已注入');
    }

    const next = upsertMarkedBlock(content, INJECT_MARKER, jsToInject);
    if (next.content !== content) {
      fs.writeFileSync(jsPath, next.content);
      console.log(
        next.replaced
          ? `♻️ JS 已更新: ${jsFile} (${next.content.length} bytes)`
          : `✅ JS 已注入: ${jsFile} (${next.content.length} bytes)`
      );
    } else {
      console.log(`⏭️ JS 已是最新: ${jsFile}`);
    }
    jsInjected = true;
    break;
  }
}

console.log('\n' + '═'.repeat(50));
if (jsInjected) {
  console.log('✅ 功能面板注入完成！刷新浏览器即可看到效果。');
} else {
  console.log('❌ 注入失败：未找到主 JS 文件');
  process.exit(1);
}
