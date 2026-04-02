#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OpenClaw 汉化版 - 功能面板注入脚本
武汉晴辰天下网络科技有限公司 | https://qingchencloud.com/

在构建后将功能面板 JS/CSS 注入到 Dashboard 构建产物中。
支持同时注入到多个 Dashboard 目录（新版 A2UI + 旧版 control-ui）。
"""

import os
import sys
import glob
import json
import re

# 路径配置
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(SCRIPT_DIR)
PANEL_DIR = os.path.join(ROOT_DIR, 'translations', 'panel')

# Dashboard 目录配置（按优先级排序，会尝试注入到所有存在的目录）
DASHBOARD_DIRS = [
    # control-ui（Dashboard 主界面，优先注入）
    ('control-ui', [
        os.path.join(ROOT_DIR, 'openclaw', 'dist', 'control-ui'),
        'openclaw/dist/control-ui',
    ]),
    # canvas-host/a2ui（嵌入式 Canvas 界面）
    ('canvas-host/a2ui', [
        os.path.join(ROOT_DIR, 'openclaw', 'dist', 'canvas-host', 'a2ui'),
        'openclaw/dist/canvas-host/a2ui',
    ]),
    # 其他可能的目录
    ('web', [
        os.path.join(ROOT_DIR, 'openclaw', 'dist', 'web'),
        'openclaw/dist/web',
    ]),
]

def is_dashboard_dir(path):
    """检查是否是 Dashboard 目录（包含 index.html）"""
    index_html = os.path.join(path, 'index.html')
    return os.path.isfile(index_html)

def find_all_dashboard_dirs():
    """查找所有存在的 Dashboard 目录"""
    found_dirs = []
    
    for name, paths in DASHBOARD_DIRS:
        for path in paths:
            if os.path.exists(path) and is_dashboard_dir(path):
                found_dirs.append((name, path))
                break  # 每个类型只取第一个存在的路径
    
    return found_dirs

def read_file(path):
    """读取文件内容"""
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    """写入文件内容"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def upsert_marked_block(content, marker, block_content):
    """插入或更新带 marker 的注入块"""
    start_marker = marker
    end_marker = f"{marker} [END]"
    block = f"{start_marker}\n{block_content}\n{end_marker}"

    has_start = start_marker in content
    has_end = end_marker in content

    if has_start or has_end:
        if not (has_start and has_end):
            raise ValueError(f"检测到不完整注入块边界: {start_marker}")

        start_idx = content.find(start_marker)
        end_idx = content.find(end_marker, start_idx)
        if start_idx == -1 or end_idx == -1 or end_idx < start_idx:
            raise ValueError(f"检测到无效注入块边界: {start_marker}")

        pattern = re.compile(re.escape(start_marker) + r"[\s\S]*?" + re.escape(end_marker), re.MULTILINE)
        return pattern.sub(block, content, count=1), True

    return content.rstrip() + "\n\n" + block + "\n", False

def inject_to_directory(name, build_dir, panel_js, panel_css, inject_marker):
    """注入功能面板到指定目录"""
    print(f"\n{'─' * 50}")
    print(f"📁 注入到: {name}")
    print(f"   路径: {os.path.abspath(build_dir)}")
    
    # 查找 assets 目录或直接使用构建目录
    assets_dir = os.path.join(build_dir, 'assets')
    if not os.path.exists(assets_dir):
        # 没有 assets 目录，直接使用构建目录
        assets_dir = build_dir
    
    # 列出目录内容
    print(f"   内容: {', '.join(os.listdir(assets_dir)[:5])}...")
    
    js_injected = False
    css_injected = False
    
    # 注入 CSS
    css_files = glob.glob(os.path.join(assets_dir, '*.css'))
    css_marker = '/* === OpenClaw 功能面板样式 === */'
    
    for css_file in css_files:
        content = read_file(css_file)
        new_content, replaced = upsert_marked_block(content, css_marker, panel_css)
        if new_content != content:
            write_file(css_file, new_content)
            if replaced:
                print(f"   ♻️ CSS 已更新: {os.path.basename(css_file)}")
            else:
                print(f"   ✅ CSS 已注入: {os.path.basename(css_file)}")
        else:
            print(f"   ⏭️ CSS 已是最新: {os.path.basename(css_file)}")
        css_injected = True
    
    # 注入 JS
    js_files = glob.glob(os.path.join(assets_dir, '*.js'))
    js_files = [f for f in js_files if not f.endswith('.map')]
    
    # 主 bundle 文件名模式（按优先级排序）
    main_bundle_patterns = [
        'a2ui.bundle.js',  # 新版 A2UI
        'index-',          # 旧版 control-ui
        'index.js',
        '.bundle.js',
        'main',
    ]
    
    # 如果没有 CSS 文件，将 CSS 内嵌到 JS 中
    js_to_inject = panel_js
    if not css_injected:
        css_inject_code = f"""
(function() {{
  var style = document.createElement('style');
  style.textContent = {json.dumps(panel_css)};
  document.head.appendChild(style);
}})();
"""
        js_to_inject = css_inject_code + '\n' + panel_js
        print(f"   📝 CSS 将内嵌到 JS 中")
    
    for js_file in js_files:
        filename = os.path.basename(js_file)
        is_main_bundle = any(pattern in filename for pattern in main_bundle_patterns)
        if is_main_bundle:
            content = read_file(js_file)

            # 修复上游 i18n bug：loadLocale() 检测到非英文 locale 但不自动加载翻译文件
            # 问题：constructor 调用 loadLocale() 设置 this.locale="zh-CN"，但翻译文件只在 setLocale() 中异步加载
            #        而 setLocale() 有 guard `if(this.locale!==t)` 导致同 locale 不触发加载
            # 修复：检测到非英文 locale 且翻译未加载时，临时重置为 "en" 再调用 setLocale
            i18n_bug_pattern = 'this.loadLocale()}loadLocale()'
            if i18n_bug_pattern in content:
                content = content.replace(
                    i18n_bug_pattern,
                    'this.loadLocale();if(this.locale!=="en"&&!this.translations[this.locale]){const _l=this.locale;this.locale="en";this.setLocale(_l)}}loadLocale()'
                )
                print(f"   ✅ i18n 自动加载修复已注入")

            new_content, replaced = upsert_marked_block(content, inject_marker, js_to_inject)
            if new_content != content:
                write_file(js_file, new_content)
                if replaced:
                    print(f"   ♻️ JS 已更新: {filename} ({len(new_content)} bytes)")
                else:
                    print(f"   ✅ JS 已注入: {filename} ({len(new_content)} bytes)")
            else:
                print(f"   ⏭️ JS 已是最新: {filename}")
            js_injected = True
            break
    
    # 如果没找到主 bundle，尝试任意 JS 文件
    if not js_injected and js_files:
        js_file = js_files[0]
        filename = os.path.basename(js_file)
        content = read_file(js_file)
        new_content, replaced = upsert_marked_block(content, inject_marker, js_to_inject)
        if new_content != content:
            write_file(js_file, new_content)
            if replaced:
                print(f"   ♻️ JS 已更新 (备选): {filename}")
            else:
                print(f"   ✅ JS 已注入 (备选): {filename}")
        else:
            print(f"   ⏭️ JS 已是最新 (备选): {filename}")
        js_injected = True
    
    if not js_injected:
        print(f"   ❌ 未找到可注入的 JS 文件")
        return False
    
    return True


def inject_panel():
    """注入功能面板到所有 Dashboard 构建产物"""
    print("🦞 OpenClaw 功能面板注入")
    print("=" * 50)
    print(f"📍 当前工作目录: {os.getcwd()}")
    
    # 查找所有 Dashboard 目录
    dashboard_dirs = find_all_dashboard_dirs()
    
    if not dashboard_dirs:
        print("\n❌ 找不到任何 Dashboard 目录！")
        print(f"   脚本目录: {SCRIPT_DIR}")
        print(f"   ROOT_DIR: {ROOT_DIR}")
        
        # 列出目录结构帮助调试
        if os.path.exists('openclaw/dist'):
            print("\n📁 openclaw/dist/ 目录内容:")
            for item in os.listdir('openclaw/dist'):
                print(f"   {item}/") if os.path.isdir(os.path.join('openclaw/dist', item)) else print(f"   {item}")
        
        sys.exit(1)
    
    print(f"\n🔍 找到 {len(dashboard_dirs)} 个 Dashboard 目录:")
    for name, path in dashboard_dirs:
        print(f"   • {name}: {path}")
    
    # 读取面板资源
    print("\n📦 读取面板资源...")
    
    panel_js_path = os.path.join(PANEL_DIR, 'feature-panel.js')
    panel_css_path = os.path.join(PANEL_DIR, 'feature-panel.css')
    panel_data_path = os.path.join(PANEL_DIR, 'panel-data.json')
    
    if not os.path.exists(panel_js_path):
        print(f"❌ 找不到 feature-panel.js: {panel_js_path}")
        sys.exit(1)
    
    panel_js = read_file(panel_js_path)
    panel_css = read_file(panel_css_path) if os.path.exists(panel_css_path) else ''
    
    # 读取并注入面板数据
    if os.path.exists(panel_data_path):
        with open(panel_data_path, 'r', encoding='utf-8') as f:
            panel_data_obj = json.load(f)
        panel_data_js = json.dumps(panel_data_obj, ensure_ascii=False)
        panel_js = re.sub(
            r'/\*PANEL_DATA_PLACEHOLDER\*/\{[\s\S]*?\}/\*END_PANEL_DATA\*/',
            lambda m: panel_data_js,
            panel_js
        )
        print(f"   ✅ 已注入面板数据")
    
    print(f"   ✅ feature-panel.js ({len(panel_js)} bytes)")
    print(f"   ✅ feature-panel.css ({len(panel_css)} bytes)")
    
    inject_marker = '/* === OpenClaw 功能面板 === */'
    success_count = 0
    
    # 遍历所有 Dashboard 目录进行注入
    for name, path in dashboard_dirs:
        if inject_to_directory(name, path, panel_js, panel_css, inject_marker):
            success_count += 1
    
    print("\n" + "=" * 50)
    if success_count == len(dashboard_dirs):
        print(f"✅ 功能面板注入完成！成功注入 {success_count}/{len(dashboard_dirs)} 个目录")
    elif success_count > 0:
        print(f"⚠️ 功能面板部分注入！成功 {success_count}/{len(dashboard_dirs)} 个目录")
    else:
        print(f"❌ 功能面板注入失败！")
        sys.exit(1)
    print("=" * 50)

if __name__ == '__main__':
    inject_panel()
