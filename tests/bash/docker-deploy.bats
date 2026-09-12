#!/usr/bin/env bats
# ============================================================
# docker-deploy.sh 测试
# 使用 Bats (Bash Automated Testing System)
# ============================================================

# 测试脚本路径
SCRIPT_PATH="$(cd "$(dirname "$BATS_TEST_FILENAME")/../.." && pwd)/docker-deploy.sh"

# ============================================================
# 语法测试
# ============================================================

@test "local-only binds the host loopback but starts the container gateway on lan" {
    source "$SCRIPT_PATH"
    docker() { printf '%s\n' "$@"; }
    LOCAL_ONLY=true
    PORT=18888
    GATEWAY_TOKEN='fixture-value'
    run start_container
    [ "$status" -eq 0 ]
    [[ "$output" == *"127.0.0.1:18888:18789"* ]]
    [[ "$output" == *$'openclaw\ngateway\nrun\n--allow-unconfigured\n--bind\nlan'* ]]
}

@test "startup failure returns nonzero instead of reporting deployment success" {
    source "$SCRIPT_PATH"
    docker() { echo false; }
    run wait_for_ready
    [ "$status" -ne 0 ]
}

@test "gateway health timeout returns nonzero" {
    source "$SCRIPT_PATH"
    docker() {
        if [ "$1" = inspect ]; then echo true; return 0; fi
        return 1
    }
    sleep() { :; }
    run wait_for_ready
    [ "$status" -ne 0 ]
    [[ "$output" == *"等待超时"* ]]
}

@test "docker-deploy.sh 语法正确" {
    run bash -n "$SCRIPT_PATH"
    [ "$status" -eq 0 ]
}

# ============================================================
# 帮助信息测试
# ============================================================

@test "--help 显示帮助信息并退出" {
    run bash "$SCRIPT_PATH" --help
    [ "$status" -eq 0 ]
    [[ "$output" == *"OpenClaw Docker 一键部署脚本"* ]]
    [[ "$output" == *"--token"* ]]
    [[ "$output" == *"--port"* ]]
}

@test "-h 显示帮助信息并退出" {
    run bash "$SCRIPT_PATH" -h
    [ "$status" -eq 0 ]
    [[ "$output" == *"OpenClaw Docker 一键部署脚本"* ]]
}

# ============================================================
# 参数解析测试
# ============================================================

@test "未知参数报错" {
    run bash "$SCRIPT_PATH" --unknown-param
    [ "$status" -ne 0 ]
    [[ "$output" == *"未知参数"* ]]
}

@test "--token 参数在帮助中说明" {
    run bash "$SCRIPT_PATH" --help
    [[ "$output" == *"--token"* ]]
    [[ "$output" == *"访问令牌"* ]] || [[ "$output" == *"Token"* ]]
}

@test "--port 参数在帮助中说明" {
    run bash "$SCRIPT_PATH" --help
    [[ "$output" == *"--port"* ]]
    [[ "$output" == *"端口"* ]]
}

@test "--local-only 参数在帮助中说明" {
    run bash "$SCRIPT_PATH" --help
    [[ "$output" == *"--local-only"* ]]
    [[ "$output" == *"本地"* ]] || [[ "$output" == *"localhost"* ]]
}

@test "--skip-init 参数在帮助中说明" {
    run bash "$SCRIPT_PATH" --help
    [[ "$output" == *"--skip-init"* ]]
}

# ============================================================
# 函数单元测试 (source 脚本获取函数定义)
# ============================================================

@test "check_docker 检测已安装的 Docker" {
    # Mock docker 命令
    docker() {
        case "$1" in
            "--version")
                echo "Docker version 24.0.0, build 123abc"
                return 0
                ;;
            "info")
                echo "Containers: 5"
                return 0
                ;;
        esac
    }
    export -f docker
    
    source "$SCRIPT_PATH"
    
    run check_docker
    [ "$status" -eq 0 ]
}

@test "check_docker 检测缺失的 Docker" {
    source "$SCRIPT_PATH"
    
    # 覆盖 check_command 使其对 docker 返回失败
    check_command() {
        if [ "$1" = "docker" ]; then
            return 1
        fi
        command -v "$1" &> /dev/null
    }
    
    run check_docker
    [ "$status" -ne 0 ]
    [[ "$output" == *"Docker"* ]]
}

@test "check_docker 检测未运行的 Docker" {
    docker() {
        case "$1" in
            "--version")
                echo "Docker version 24.0.0"
                return 0
                ;;
            "info")
                echo "Cannot connect to Docker daemon" >&2
                return 1
                ;;
        esac
    }
    export -f docker
    
    source "$SCRIPT_PATH"
    
    run check_docker
    [ "$status" -ne 0 ]
}

# ============================================================
# Token 生成测试
# ============================================================

@test "generate_token 生成非空 token" {
    source "$SCRIPT_PATH"
    
    if type generate_token &>/dev/null; then
        result=$(generate_token)
        [ -n "$result" ]
        # Token 应该有一定长度
        [ ${#result} -ge 16 ]
    else
        skip "generate_token 函数不存在"
    fi
}

@test "generate_token 每次生成不同的 token" {
    source "$SCRIPT_PATH"
    
    if type generate_token &>/dev/null; then
        token1=$(generate_token)
        token2=$(generate_token)
        [ "$token1" != "$token2" ]
    else
        skip "generate_token 函数不存在"
    fi
}

# ============================================================
# IP 检测测试
# ============================================================

@test "get_local_ip 函数存在" {
    source "$SCRIPT_PATH"
    
    # 只验证函数存在，不测试返回值（Docker 容器里网络工具有限）
    if type get_local_ip &>/dev/null; then
        # 函数存在即通过
        true
    else
        skip "get_local_ip 函数不存在"
    fi
}

# ============================================================
# 镜像拉取测试 (使用 mock)
# ============================================================

@test "pull_image 调用 docker pull" {
    docker() {
        echo "docker $*"
        return 0
    }
    export -f docker
    
    source "$SCRIPT_PATH"
    IMAGE="ghcr.io/test/image:latest"
    
    if type pull_image &>/dev/null; then
        run pull_image
        [[ "$output" == *"pull"* ]]
    else
        skip "pull_image 函数不存在"
    fi
}

# ============================================================
# 配置初始化测试 (使用 mock)
# ============================================================

@test "init_config 调用 docker exec" {
    docker() {
        echo "docker $*"
        return 0
    }
    export -f docker
    
    source "$SCRIPT_PATH"
    CONTAINER_NAME="test-container"
    
    if type init_config &>/dev/null; then
        run init_config
        [ "$status" -eq 0 ] || [[ "$output" == *"docker"* ]]
    else
        skip "init_config 函数不存在"
    fi
}

# ============================================================
# 容器启动测试 (使用 mock)
# ============================================================

@test "start_container 构建正确的 docker run 命令" {
    docker() {
        echo "docker $*"
        return 0
    }
    export -f docker
    
    source "$SCRIPT_PATH"
    CONTAINER_NAME="test-container"
    PORT="18789"
    VOLUME_NAME="test-volume"
    IMAGE="test-image"
    GATEWAY_TOKEN="test-token"
    
    if type start_container &>/dev/null; then
        run start_container
        [[ "$output" == *"run"* ]] || [[ "$output" == *"docker"* ]]
    else
        skip "start_container 函数不存在"
    fi
}

# ============================================================
# 脚本集成测试
# ============================================================

@test "脚本使用正确的镜像地址" {
    grep -q "ghcr.io/1186258278/openclaw-zh" "$SCRIPT_PATH"
}

@test "脚本定义默认端口" {
    grep -q "18789" "$SCRIPT_PATH"
}

@test "脚本定义默认容器名" {
    grep -q "openclaw" "$SCRIPT_PATH"
}
