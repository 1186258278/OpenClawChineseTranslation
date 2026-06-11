#!/usr/bin/env bats
# ============================================================
# install.sh 测试
# 使用 Bats (Bash Automated Testing System)
# ============================================================

# 加载测试辅助函数
load 'helpers/mocks'

# 测试脚本路径
SCRIPT_PATH="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)/install.sh"

# ============================================================
# 语法测试
# ============================================================

@test "install.sh 语法正确" {
    run bash -n "$SCRIPT_PATH"
    [ "$status" -eq 0 ]
}

# ============================================================
# 帮助信息测试
# ============================================================

@test "--help 显示帮助信息并退出" {
    run bash "$SCRIPT_PATH" --help
    [ "$status" -eq 0 ]
    [[ "$output" == *"OpenClaw 汉化版安装脚本"* ]]
    [[ "$output" == *"--nightly"* ]]
}

@test "-h 显示帮助信息并退出" {
    run bash "$SCRIPT_PATH" -h
    [ "$status" -eq 0 ]
    [[ "$output" == *"OpenClaw 汉化版安装脚本"* ]]
}

# ============================================================
# 参数解析测试
# ============================================================

@test "未知参数报错" {
    run bash "$SCRIPT_PATH" --unknown-param
    [ "$status" -ne 0 ]
    [[ "$output" == *"未知参数"* ]]
}

# ============================================================
# 函数单元测试 (source 脚本获取函数定义)
# ============================================================

@test "check_command 检测已存在的命令" {
    # source 脚本获取函数（脚本修改后不会自动执行 main）
    source "$SCRIPT_PATH"
    
    run check_command bash
    [ "$status" -eq 0 ]
}

@test "check_command 检测不存在的命令" {
    source "$SCRIPT_PATH"
    
    run check_command nonexistent_command_12345
    [ "$status" -ne 0 ]
}

# ============================================================
# Node.js 版本检查测试 (使用 mock)
# ============================================================

@test "check_node_version 接受 Node.js 22.19+" {
    # 先设置 mock
    node() {
        echo "v22.19.0"
    }
    export -f node
    
    # 然后 source 脚本
    source "$SCRIPT_PATH"
    
    run check_node_version
    [ "$status" -eq 0 ]
    [[ "$output" == *"Node.js 版本"* ]] || [[ "$output" == *"v22"* ]]
}

@test "check_node_version 拒绝 Node.js 22.18" {
    node() {
        echo "v22.18.0"
    }
    export -f node
    
    source "$SCRIPT_PATH"
    
    run check_node_version
    [ "$status" -ne 0 ]
    [[ "$output" == *"版本过低"* ]]
}

@test "check_node_version 拒绝 Node.js 21" {
    node() {
        echo "v21.0.0"
    }
    export -f node
    
    source "$SCRIPT_PATH"
    
    run check_node_version
    [ "$status" -ne 0 ]
    [[ "$output" == *"版本过低"* ]]
}

@test "check_node_version 检测缺失的 Node.js" {
    # 通过重定义 check_command 来模拟 node 不存在
    source "$SCRIPT_PATH"
    
    # 覆盖 check_command 使其对 node 返回失败
    check_command() {
        if [ "$1" = "node" ]; then
            return 1
        fi
        command -v "$1" &> /dev/null
    }
    
    run check_node_version
    [ "$status" -ne 0 ]
    [[ "$output" == *"未检测到 Node.js"* ]]
}

# ============================================================
# npm 检查测试 (使用 mock)
# ============================================================

@test "check_npm 检测已安装的 npm" {
    npm() {
        echo "10.2.0"
    }
    export -f npm
    
    source "$SCRIPT_PATH"
    
    run check_npm
    [ "$status" -eq 0 ]
    [[ "$output" == *"npm 版本"* ]] || [[ "$output" == *"10.2.0"* ]]
}

@test "check_npm 检测缺失的 npm" {
    source "$SCRIPT_PATH"
    
    # 覆盖 check_command 使其对 npm 返回失败
    check_command() {
        if [ "$1" = "npm" ]; then
            return 1
        fi
        command -v "$1" &> /dev/null
    }
    
    run check_npm
    [ "$status" -ne 0 ]
    [[ "$output" == *"未检测到 npm"* ]]
}

# ============================================================
# 安装流程测试 (使用 mock)
# ============================================================

@test "install_chinese 调用正确的 npm 命令 (稳定版)" {
    # 捕获 npm install 命令
    npm() {
        echo "npm $*"
        return 0
    }
    export -f npm
    
    source "$SCRIPT_PATH"
    NPM_TAG="latest"
    
    run install_chinese
    [ "$status" -eq 0 ]
    [[ "$output" == *"@qingchencloud/openclaw-zh@latest"* ]]
}

@test "install_chinese 调用正确的 npm 命令 (nightly)" {
    npm() {
        echo "npm $*"
        return 0
    }
    export -f npm
    
    source "$SCRIPT_PATH"
    NPM_TAG="nightly"
    
    run install_chinese
    [ "$status" -eq 0 ]
    [[ "$output" == *"@qingchencloud/openclaw-zh@nightly"* ]]
}

# ============================================================
# 卸载原版测试 (使用 mock)
# ============================================================

@test "uninstall_original 检测并卸载原版" {
    # Mock npm list 返回成功（原版已安装）
    npm() {
        case "$1" in
            "list")
                echo "openclaw@1.0.0"
                return 0
                ;;
            "uninstall")
                echo "uninstalling $*"
                return 0
                ;;
        esac
    }
    export -f npm
    
    source "$SCRIPT_PATH"
    
    run uninstall_original
    [ "$status" -eq 0 ]
    [[ "$output" == *"检测到原版"* ]] || [[ "$output" == *"原版已卸载"* ]]
}

@test "uninstall_original 原版不存在时跳过" {
    # Mock npm list 返回失败（原版未安装）
    npm() {
        case "$1" in
            "list")
                return 1
                ;;
        esac
    }
    export -f npm
    
    source "$SCRIPT_PATH"
    
    run uninstall_original
    [ "$status" -eq 0 ]
}

# ============================================================
# 自动初始化测试
# ============================================================

@test "run_setup_if_needed CI 环境跳过" {
    export CI="true"
    
    source "$SCRIPT_PATH"
    
    run run_setup_if_needed
    [ "$status" -eq 0 ]
    [[ "$output" == *"CI 环境"* ]]
    
    unset CI
}

@test "run_setup_if_needed OPENCLAW_SKIP_SETUP=1 跳过" {
    # 必须先清除 CI 变量，否则函数会优先匹配 CI 分支
    local saved_ci="${CI:-}"
    unset CI
    export OPENCLAW_SKIP_SETUP="1"
    
    source "$SCRIPT_PATH"
    
    run run_setup_if_needed
    [ "$status" -eq 0 ]
    # 剥离 ANSI 转义码后匹配
    local clean_output
    clean_output=$(echo "$output" | sed $'s/\033\\[[0-9;]*m//g')
    [[ "$clean_output" == *"OPENCLAW_SKIP_SETUP"* ]]
    
    unset OPENCLAW_SKIP_SETUP
    # 恢复 CI 变量
    if [ -n "$saved_ci" ]; then
        export CI="$saved_ci"
    fi
}
