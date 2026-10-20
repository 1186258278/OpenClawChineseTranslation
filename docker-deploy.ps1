# ============================================================
# OpenClaw 汉化发行版 - Docker 一键部署脚本 (Windows)
# 
# 自动完成：环境检测、初始化配置、远程访问设置、启动容器
#
# 官方网站: https://openclaw.ai/
# 汉化项目: https://openclaw.qt.cool/
#
# 武汉晴辰天下网络科技有限公司 | https://qingchencloud.com/
#
# 用法:
#   irm https://xxx/docker-deploy.ps1 | iex
#   & ([scriptblock]::Create((irm https://xxx/docker-deploy.ps1))) -Token "mytoken"
# ============================================================

param(
    [string]$Token = "",
    [string]$Port = "18789",
    [string]$Name = "openclaw",
    [switch]$LocalOnly,
    [switch]$SkipInit,
    [switch]$China,
    [switch]$Help
)

$ErrorActionPreference = "Stop"

# 默认配置
$VolumeName = "openclaw-data"
if ($China) {
    $Image = "1186258278/openclaw-zh:nightly"
    Write-Host "✓ 使用 Docker Hub 国内加速源: $Image" -ForegroundColor Green
} else {
    $Image = "ghcr.io/1186258278/openclaw-zh:nightly"
}

# 帮助信息
if ($Help) {
    Write-Host "OpenClaw Docker 一键部署脚本" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "用法:"
    Write-Host "  irm https://xxx/docker-deploy.ps1 | iex"
    Write-Host "  & ([scriptblock]::Create((irm https://xxx/docker-deploy.ps1))) -Token 'mytoken'"
    Write-Host ""
    Write-Host "选项:"
    Write-Host "  -Token <token>   设置访问令牌（推荐）"
    Write-Host "  -Port <port>     设置端口（默认: 18789）"
    Write-Host "  -Name <name>     设置容器名（默认: openclaw）"
    Write-Host "  -LocalOnly       仅本地访问（不配置远程访问）"
    Write-Host "  -SkipInit        跳过初始化（容器已存在时）"
    Write-Host "  -China           使用 Docker Hub 国内加速源"
    Write-Host "  -Help            显示帮助信息"
    Write-Host ""
    Write-Host "示例:"
    Write-Host "  # 远程访问模式（自动配置 token 认证）"
    Write-Host "  & ([scriptblock]::Create((irm .../docker-deploy.ps1))) -Token 'mytoken123'"
    Write-Host ""
    Write-Host "  # 仅本地访问"
    Write-Host "  & ([scriptblock]::Create((irm .../docker-deploy.ps1))) -LocalOnly"
    exit 0
}

# Logo
function Show-Banner {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "║     🦞 OpenClaw 汉化发行版 - Docker 部署                  ║" -ForegroundColor Cyan
    Write-Host "║        开源个人 AI 助手平台                              ║" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "║     武汉晴辰天下网络科技有限公司                          ║" -ForegroundColor Cyan
    Write-Host "║     https://openclaw.qt.cool/                             ║" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

# 检查 Docker
function Test-Docker {
    try {
        $dockerVersion = docker --version 2>$null
        if (-not $dockerVersion) {
            throw "Docker not found"
        }
        
        # 检查 Docker 是否运行
        $dockerInfo = docker info 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Docker 未运行" -ForegroundColor Red
            Write-Host ""
            Write-Host "请启动 Docker Desktop 后重试" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "✓ $dockerVersion" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ 未检测到 Docker" -ForegroundColor Red
        Write-Host ""
        Write-Host "请先安装 Docker Desktop：" -ForegroundColor Yellow
        Write-Host "  https://docs.docker.com/desktop/install/windows-install/" -ForegroundColor White
        Write-Host ""
        exit 1
    }
}

# 获取本机 IP
function Get-LocalIP {
    try {
        $ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch "Loopback" -and $_.IPAddress -notmatch "^169\." } | Select-Object -First 1).IPAddress
        if ($ip) { return $ip }
    }
    catch {}
    return "localhost"
}

# 生成随机 Token
function New-RandomToken {
    $bytes = New-Object byte[] 16
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    return [System.BitConverter]::ToString($bytes).Replace("-", "").ToLower()
}

# 清理现有容器
function Remove-ExistingContainer {
    $existing = docker ps -a --format "{{.Names}}" 2>$null | Where-Object { $_ -eq $Name }
    if ($existing) {
        Write-Host "⚠ 检测到现有容器 $Name，正在停止并删除..." -ForegroundColor Yellow
        docker stop $Name 2>$null | Out-Null
        docker rm $Name 2>$null | Out-Null
        Write-Host "✓ 已清理旧容器" -ForegroundColor Green
    }
}

# 拉取镜像
function Get-DockerImage {
    Write-Host ""
    Write-Host "📦 拉取 Docker 镜像..." -ForegroundColor Blue
    docker pull $Image
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 镜像拉取失败" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ 镜像拉取完成" -ForegroundColor Green
}

# 创建数据卷
function New-DataVolume {
    $volumes = docker volume ls --format "{{.Name}}" 2>$null
    if ($volumes -notcontains $VolumeName) {
        Write-Host "📁 创建数据卷 $VolumeName..." -ForegroundColor Blue
        docker volume create $VolumeName | Out-Null
        Write-Host "✓ 数据卷创建完成" -ForegroundColor Green
    }
    else {
        Write-Host "✓ 数据卷 $VolumeName 已存在" -ForegroundColor Green
    }
}

# 初始化配置
function Initialize-Config {
    if ($SkipInit) {
        Write-Host "⚠ 跳过初始化（-SkipInit）" -ForegroundColor Yellow
        return
    }
    
    Write-Host ""
    Write-Host "⚙️  初始化 OpenClaw 配置..." -ForegroundColor Blue
    
    # 执行 setup
    docker run --rm -v "${VolumeName}:/root/.openclaw" $Image openclaw setup
    Write-Host "✓ 基础配置完成" -ForegroundColor Green
    
    # 设置 gateway.mode
    docker run --rm -v "${VolumeName}:/root/.openclaw" $Image openclaw config set gateway.mode local
    Write-Host "✓ 设置 gateway.mode = local" -ForegroundColor Green
    
    $origins = @("http://localhost:${Port}", "http://127.0.0.1:${Port}")
    if (-not $LocalOnly) { $origins += "http://$(Get-LocalIP):${Port}" }
    $originsJson = ConvertTo-Json -InputObject $origins -Compress
    docker run --rm -v "${VolumeName}:/root/.openclaw" $Image openclaw config get gateway.controlUi.allowedOrigins --json 2>$null | Out-Null
    if ($LASTEXITCODE -ne 0) {
        docker run --rm -v "${VolumeName}:/root/.openclaw" $Image openclaw config set gateway.controlUi.allowedOrigins $originsJson
        if ($LASTEXITCODE -ne 0) { throw 'Dashboard 来源配置失败' }
    }

    # 远程访问配置
    if (-not $LocalOnly) {
        Write-Host ""
        Write-Host "🌐 配置远程访问..." -ForegroundColor Blue
        
        # 设置 bind 模式
        docker run --rm -v "${VolumeName}:/root/.openclaw" $Image openclaw config set gateway.bind lan
        Write-Host "✓ 设置 gateway.bind = lan" -ForegroundColor Green
        
        # 设置访问令牌（用于 Dashboard 认证）
        if ($Token) {
            docker run --rm -v "${VolumeName}:/root/.openclaw" $Image openclaw config set gateway.auth.token $Token
            Write-Host "✓ 设置 gateway.auth.token" -ForegroundColor Green
        }
    }
}

# 启动容器
function Start-OpenClawContainer {
    Write-Host ""
    Write-Host "🚀 启动 OpenClaw 容器..." -ForegroundColor Blue
    
    $publish = if ($LocalOnly) { "127.0.0.1:${Port}:18789" } else { "${Port}:18789" }
    $dockerArgs = @(
        "run", "-d",
        "--name", $Name,
        "-p", $publish,
        "-v", "${VolumeName}:/root/.openclaw"
    )
    
    # 添加 Token 环境变量
    if ($Token) {
        $dockerArgs += "-e"
        $dockerArgs += "OPENCLAW_GATEWAY_TOKEN=$Token"
    }
    
    $dockerArgs += "--restart"
    $dockerArgs += "unless-stopped"
    $dockerArgs += $Image
    
    $dockerArgs += @("openclaw", "gateway", "run", "--allow-unconfigured", "--bind", "lan")
    
    & docker @dockerArgs | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 容器启动失败" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✓ 容器启动完成" -ForegroundColor Green
}

# 等待服务就绪
function Wait-ForReady {
    Write-Host ""
    Write-Host "⏳ 等待服务启动..." -ForegroundColor Blue
    
    for ($i = 1; $i -le 90; $i++) {
        $running = docker inspect -f '{{.State.Running}}' $Name
        if ($LASTEXITCODE -ne 0 -or $running -ne 'true') {
            throw "容器已退出，请检查日志: docker logs $Name"
        }
        docker exec $Name curl --fail --silent --show-error http://127.0.0.1:18789/healthz 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ 服务已就绪" -ForegroundColor Green
            return
        }
        Start-Sleep -Seconds 2
    }
    throw "等待超时，请检查日志: docker logs $Name"
}

# 打印成功信息
function Show-Success {
    $localIP = Get-LocalIP
    
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                           ║" -ForegroundColor Green
    Write-Host "║     ✅ OpenClaw Docker 部署成功！                         ║" -ForegroundColor Green
    Write-Host "║                                                           ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "📊 部署信息：" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   容器名称: $Name"
    Write-Host "   数据卷:   $VolumeName"
    Write-Host "   端口:     $Port"
    
    if ($Token) {
        Write-Host "   Token:    $Token"
    }
    Write-Host ""
    
    Write-Host "🌐 访问地址：" -ForegroundColor Cyan
    Write-Host ""
    
    if ($LocalOnly) {
        Write-Host "   本地访问: http://localhost:${Port}"
    }
    else {
        Write-Host "   本地访问: http://localhost:${Port}"
        if ($Token) {
            Write-Host "   远程访问: http://${localIP}:${Port}?token=${Token}"
        }
        else {
            Write-Host "   远程访问: http://${localIP}:${Port}"
        }
    }
    Write-Host ""
    
    Write-Host "📝 常用命令：" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   docker logs -f $Name    # 查看日志"
    Write-Host "   docker restart $Name    # 重启服务"
    Write-Host "   docker stop $Name       # 停止服务"
    Write-Host ""
    
    if (-not $LocalOnly) {
        Write-Host "⚠  远程访问提示：" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   当前配置允许通过 HTTP 远程访问（仅 Token 认证）。"
        Write-Host "   生产环境建议使用 HTTPS（Tailscale Serve 或 Nginx 反向代理）。"
        Write-Host ""
    }
    
    Write-Host "❓ 如果遇到 'gateway token mismatch' 错误：" -ForegroundColor Red
    Write-Host ""
    Write-Host "   1. 确保使用上面显示的完整 URL（包含 ?token=xxx）"
    Write-Host "   2. 或在 Dashboard 的「网关令牌」输入框中填入 Token"
    Write-Host "   3. 点击「连接」按钮"
    Write-Host ""
    if ($Token) {
        Write-Host "   复制此 URL 直接访问：" -ForegroundColor Green
        Write-Host "   http://${localIP}:${Port}?token=${Token}" -ForegroundColor Cyan
        Write-Host ""
    }
    
    Write-Host "📚 更多信息：" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   汉化官网: https://openclaw.qt.cool/"
    Write-Host "   文档:     https://docs.openclaw.ai/"
    Write-Host "   GitHub:   https://github.com/1186258278/OpenClawChineseTranslation"
    Write-Host ""
}

# 主流程
function Main {
    Show-Banner
    
    Write-Host "🔍 环境检查..." -ForegroundColor Blue
    Write-Host ""
    
    Test-Docker
    
    # 如果没有指定 Token，生成一个
    if (-not $Token) {
        $script:Token = New-RandomToken
        Write-Host "✓ 自动生成 Token: $Token" -ForegroundColor Green
    }
    
    Remove-ExistingContainer
    Get-DockerImage
    New-DataVolume
    Initialize-Config
    Start-OpenClawContainer
    Wait-ForReady
    Show-Success
}

# 执行
Main
