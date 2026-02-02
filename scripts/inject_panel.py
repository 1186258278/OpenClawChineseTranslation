#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
OpenClaw 汉化版 - 功能面板注入脚本
武汉晴辰天下网络科技有限公司 | https://qingchencloud.com/

在构建后将功能面板 JS/CSS 注入到 Dashboard 构建产物中。
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

# 尝试多个可能的构建目录路径
POSSIBLE_BUILD_DIRS = [
    os.path.join(ROOT_DIR, 'openclaw', 'dist', 'control-ui'),  # 旧版标准路径
    os.path.join(ROOT_DIR, 'openclaw', 'dist', 'canvas-host', 'a2ui'),  # 新版路径
    os.path.join(ROOT_DIR, 'openclaw', 'dist', 'gateway', 'control-ui'),  # 备选路径1
    os.path.join(ROOT_DIR, 'openclaw', 'dist', 'web'),  # 备选路径2
    os.path.join(ROOT_DIR, 'dist', 'control-ui'),              # 备选路径
    'openclaw/dist/control-ui',                                  # 相对路径
    'openclaw/dist/canvas-host/a2ui',                            # 新版相对路径
    'openclaw/dist/gateway/control-ui',                          # 相对路径新
    'openclaw/dist/web',                                          # 相对路径新
    'dist/control-ui',                                           # 相对路径备选
]

def is_dashboard_dir(path):
    """检查是否是 Dashboard 目录（包含 index.html，assets 可选）"""
    index_html = os.path.join(path, 'index.html')
    # 新版可能没有 assets 目录，只检查 index.html
    return os.path.isfile(index_html)

def find_build_dir():
    """查找构建目录"""
    # 先尝试固定路径
    for path in POSSIBLE_BUILD_DIRS:
        if os.path.exists(path) and is_dashboard_dir(path):
            return path
    
    # 动态查找 control-ui 目录
    import subprocess
    try:
        result = subprocess.run(
            ['find', '.', '-name', 'control-ui', '-type', 'd'],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0 and result.stdout.strip():
            paths = result.stdout.strip().split('\n')
            for path in paths:
                # 排除 node_modules，确保是有效的 Dashboard 目录
                if 'dist' in path and 'node_modules' not in path and is_dashboard_dir(path):
                    return path
    except Exception as e:
        print(f"⚠️ find 命令失败: {e}")
    
    # 尝试查找任何包含 assets 和 index.html 的 dist 目录（排除 node_modules）
    for root, dirs, files in os.walk('.'):
        # 排除 node_modules
        if 'node_modules' in root:
            continue
        if 'assets' in dirs and 'dist' in root and is_dashboard_dir(root):
            return root
    
    return None

BUILD_DIR = find_build_dir()

def read_file(path):
    """读取文件内容"""
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    """写入文件内容"""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def inject_panel():
    """注入功能面板到构建产物"""
    global BUILD_DIR
    
    print("🦞 OpenClaw 功能面板注入")
    print("=" * 50)
    
    # 查找构建目录
    BUILD_DIR = find_build_dir()
    if BUILD_DIR is None:
        print("❌ 找不到构建目录，尝试过以下路径:")
        for path in POSSIBLE_BUILD_DIRS:
            abs_path = os.path.abspath(path)
            print(f"   - {abs_path} (存在: {os.path.exists(path)})")
        print(f"\n当前工作目录: {os.getcwd()}")
        print(f"脚本目录: {SCRIPT_DIR}")
        print(f"ROOT_DIR: {ROOT_DIR}")
        
        # 列出当前目录结构帮助调试
        print("\n📁 当前目录结构:")
        for item in os.listdir('.'):
            print(f"   {item}/") if os.path.isdir(item) else print(f"   {item}")
        
        if os.path.exists('openclaw'):
            print("\n📁 openclaw/ 目录结构:")
            for item in os.listdir('openclaw'):
                full_path = os.path.join('openclaw', item)
                print(f"   {item}/") if os.path.isdir(full_path) else print(f"   {item}")
        
        sys.exit(1)
    
    print(f"📁 构建目录: {os.path.abspath(BUILD_DIR)}")
    
    # 查找 assets 目录或直接使用构建目录
    assets_dir = os.path.join(BUILD_DIR, 'assets')
    if not os.path.exists(assets_dir):
        print(f"⚠️ assets 目录不存在: {assets_dir}")
        print(f"📁 尝试直接在构建目录中查找 JS 文件...")
        # 列出构建目录内容
        print(f"📁 构建目录内容:")
        for item in os.listdir(BUILD_DIR):
            print(f"   {item}")
        # 使用构建目录本身作为 assets 目录
        assets_dir = BUILD_DIR
    
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
        import json
        with open(panel_data_path, 'r', encoding='utf-8') as f:
            panel_data_obj = json.load(f)
        # 将 JSON 转换为 JS 对象字面量，确保换行符被正确转义
        panel_data_js = json.dumps(panel_data_obj, ensure_ascii=False)
        # 使用 lambda 避免 re.sub 对反斜杠的解释
        panel_js = re.sub(
            r'/\*PANEL_DATA_PLACEHOLDER\*/\{[\s\S]*?\}/\*END_PANEL_DATA\*/',
            lambda m: panel_data_js,
            panel_js
        )
        print(f"  ✅ 已注入面板数据")
    
    print(f"  ✅ feature-panel.js ({len(panel_js)} bytes)")
    print(f"  ✅ feature-panel.css ({len(panel_css)} bytes)")
    
    # 注入 CSS 到主 CSS 文件
    print("\n🎨 注入 CSS...")
    css_files = glob.glob(os.path.join(assets_dir, '*.css'))
    css_injected = False
    
    for css_file in css_files:
        content = read_file(css_file)
        # 追加 CSS 到文件末尾
        new_content = content + '\n\n/* === OpenClaw 功能面板样式 === */\n' + panel_css
        write_file(css_file, new_content)
        print(f"  ✅ CSS 已注入: {os.path.basename(css_file)}")
        css_injected = True
    
    if not css_injected:
        print("  ⚠️ 未找到 CSS 文件，将 CSS 内嵌到 JS 中")
        # 将 CSS 转换为 JS 注入
        css_inject_code = f"""
(function() {{
  var style = document.createElement('style');
  style.textContent = {json.dumps(panel_css)};
  document.head.appendChild(style);
}})();
"""
        panel_js = css_inject_code + '\n' + panel_js
    
    # 注入 JS 到主 JS 文件
    print("\n📜 注入 JS...")
    js_files = glob.glob(os.path.join(assets_dir, '*.js'))
    # 排除 .map 文件
    js_files = [f for f in js_files if not f.endswith('.map')]
    js_injected = False
    inject_marker = '/* === OpenClaw 功能面板 === */'
    
    # 主 bundle 文件名模式（按优先级排序）
    main_bundle_patterns = [
        'a2ui.bundle.js',  # 新版 canvas-host/a2ui 目录
        'index-',          # 旧版 control-ui/assets 目录
        'index.js',        # 备选
        '.bundle.js',      # 通用 bundle 模式
        'main',            # 通用 main 模式
    ]
    
    for js_file in js_files:
        filename = os.path.basename(js_file)
        # 寻找主 bundle
        is_main_bundle = any(pattern in filename for pattern in main_bundle_patterns)
        if is_main_bundle:
            content = read_file(js_file)
            
            # 检查是否已注入（防止重复）
            if inject_marker in content:
                print(f"  ⚠️ 已注入过，跳过: {filename}")
                js_injected = True
                break
            
            # 追加 JS 到文件末尾
            new_content = content + f'\n\n{inject_marker}\n' + panel_js
            write_file(js_file, new_content)
            print(f"  ✅ JS 已注入: {filename} ({len(new_content)} bytes)")
            js_injected = True
            break
    
    if not js_injected:
        # 如果没找到 index-*.js，尝试注入到任意 JS 文件
        for js_file in js_files:
            content = read_file(js_file)
            if inject_marker in content:
                print(f"  ⚠️ 已注入过，跳过: {os.path.basename(js_file)}")
                js_injected = True
                break
            new_content = content + f'\n\n{inject_marker}\n' + panel_js
            write_file(js_file, new_content)
            print(f"  ✅ JS 已注入: {os.path.basename(js_file)}")
            js_injected = True
            break
    
    if not js_injected:
        print("  ❌ 未找到可注入的 JS 文件")
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("✅ 功能面板注入完成！")
    print("=" * 50)

if __name__ == '__main__':
    inject_panel()
