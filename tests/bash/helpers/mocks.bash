#!/usr/bin/env bash
# ============================================================
# Bash 测试辅助函数 - Mock 模块
# 用于模拟 node, npm, docker 等外部命令
# ============================================================

# ============================================================
# Node.js Mock 函数
# ============================================================

# 模拟 node 命令返回指定版本
mock_node() {
    local version="${1:-v22.19.0}"
    
    node() {
        case "$1" in
            "-v"|"--version")
                echo "$version"
                return 0
                ;;
            *)
                return 0
                ;;
        esac
    }
    export -f node
    export MOCK_NODE_VERSION="$version"
}

# 模拟 node 命令不存在
mock_node_not_found() {
    node() {
        return 127
    }
    export -f node
}

# ============================================================
# npm Mock 函数
# ============================================================

# 模拟 npm 命令返回指定版本
mock_npm() {
    local version="${1:-10.2.0}"
    
    npm() {
        case "$1" in
            "-v"|"--version")
                echo "$version"
                return 0
                ;;
            "list")
                # 默认返回未安装
                return 1
                ;;
            "install")
                echo "Installing $*"
                return 0
                ;;
            "uninstall")
                echo "Uninstalling $*"
                return 0
                ;;
            *)
                return 0
                ;;
        esac
    }
    export -f npm
    export MOCK_NPM_VERSION="$version"
}

# 模拟 npm 命令不存在
mock_npm_not_found() {
    npm() {
        return 127
    }
    export -f npm
}

# ============================================================
# Docker Mock 函数
# ============================================================

# 模拟 Docker 可用
mock_docker_available() {
    docker() {
        case "$1" in
            "--version")
                echo "Docker version 24.0.0, build 123abc"
                return 0
                ;;
            "info")
                echo "Containers: 5"
                echo "Images: 10"
                return 0
                ;;
            "ps")
                shift
                # 检查是否有 -a 参数
                if [[ "$*" == *"-a"* ]]; then
                    echo "CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES"
                else
                    echo "CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES"
                fi
                return 0
                ;;
            "pull")
                echo "Pulling image: $2"
                return 0
                ;;
            "run")
                echo "Running container with args: $*"
                return 0
                ;;
            "volume")
                echo "Volume operation: $*"
                return 0
                ;;
            "stop"|"rm"|"restart")
                echo "Container $1: $2"
                return 0
                ;;
            *)
                return 0
                ;;
        esac
    }
    export -f docker
}

# 模拟 Docker 未安装
mock_docker_not_found() {
    docker() {
        echo "docker: command not found" >&2
        return 127
    }
    export -f docker
}

# 模拟 Docker 未运行
mock_docker_not_running() {
    docker() {
        case "$1" in
            "--version")
                echo "Docker version 24.0.0, build 123abc"
                return 0
                ;;
            "info")
                echo "Cannot connect to the Docker daemon" >&2
                return 1
                ;;
            *)
                echo "Cannot connect to the Docker daemon" >&2
                return 1
                ;;
        esac
    }
    export -f docker
}

# 模拟容器已存在
mock_docker_container_exists() {
    local container_name="${1:-openclaw}"
    
    docker() {
        case "$1" in
            "ps")
                if [[ "$*" == *"$container_name"* ]] || [[ "$*" == *"-a"* ]]; then
                    echo "$container_name"
                fi
                return 0
                ;;
            *)
                return 0
                ;;
        esac
    }
    export -f docker
}

# ============================================================
# OpenClaw Mock 函数
# ============================================================

# 模拟 openclaw 命令
mock_openclaw() {
    openclaw() {
        case "$1" in
            "--version")
                echo "2026.1.31-zh.1"
                return 0
                ;;
            "setup")
                echo "Running setup..."
                return 0
                ;;
            "config")
                echo "Config: $*"
                return 0
                ;;
            *)
                return 0
                ;;
        esac
    }
    export -f openclaw
}

# ============================================================
# 工具函数
# ============================================================

# 重置所有 mock
reset_mocks() {
    unset -f node npm docker openclaw 2>/dev/null || true
    unset MOCK_NODE_VERSION MOCK_NPM_VERSION 2>/dev/null || true
}

# 设置完整的测试环境 mock
setup_full_mock_environment() {
    mock_node "v22.19.0"
    mock_npm "10.2.0"
    mock_docker_available
    mock_openclaw
}
