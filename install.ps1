# ============================================================
# OpenClaw 汉化发行版 - Windows 一键安装脚本
# 
# OpenClaw: 开源个人 AI 助手平台
# 官方网站: https://openclaw.ai/
# 汉化项目: https://openclaw.qt.cool/
#
# 武汉晴辰天下网络科技有限公司 | https://qingchencloud.com/
#
# 用法:
#   irm https://xxx/install.ps1 | iex                    # 安装稳定版
#   & ([scriptblock]::Create((irm https://xxx/install.ps1))) -Nightly  # 安装最新版
# ============================================================

param(
    [switch]$Nightly,
    [string]$ShengsuanyunKey,
    [switch]$Help
)

$ErrorActionPreference = "Stop"

# 版本设置
if ($Nightly) {
    $NpmTag = "nightly"
    $VersionName = "最新版 (Nightly)"
} else {
    $NpmTag = "latest"
    $VersionName = "稳定版"
}

# 帮助信息
if ($Help) {
    Write-Host "OpenClaw 汉化版安装脚本" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "用法:"
    Write-Host "  irm https://xxx/install.ps1 | iex                              # 安装稳定版"
    Write-Host "  iex ""& { `$(irm https://xxx/install.ps1) } -Nightly""          # 安装最新版"
    Write-Host "  .\install.ps1 -ShengsuanyunKey sk-xxx                           # 安装并配置胜算云"
    Write-Host ""
    Write-Host "选项:"
    Write-Host "  -Nightly            安装最新版（每小时自动构建，追踪上游最新代码）"
    Write-Host "  -ShengsuanyunKey    安装后自动配置胜算云 API（跳过交互式初始化）"
    Write-Host "  -Help               显示帮助信息"
    Write-Host ""
    Write-Host "版本说明:"
    Write-Host "  稳定版 (@latest)   手动发布，经过测试，推荐生产使用"
    Write-Host "  最新版 (@nightly)  每小时自动构建，追踪上游，适合测试"
    Write-Host ""
    Write-Host "胜算云快速配置:"
    Write-Host "  获取 API 密钥: https://shengsuanyun.com"
    Write-Host "  新用户福利: 注册送 10 元体验金！"
    exit 0
}

# Logo
function Show-Banner {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "║     🦞 OpenClaw 汉化发行版                                ║" -ForegroundColor Cyan
    Write-Host "║        开源个人 AI 助手平台                              ║" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "║     武汉晴辰天下网络科技有限公司                          ║" -ForegroundColor Cyan
    Write-Host "║     https://openclaw.qt.cool/                             ║" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

# 检查 Node.js
function Test-NodeVersion {
    try {
        $nodeVersion = node -v 2>$null
        if (-not $nodeVersion) {
            throw "Node.js not found"
        }
        
        $versionNum = $nodeVersion -replace 'v', ''
        $majorVersion = [int]($versionNum.Split('.')[0])
        
        if ($majorVersion -lt 22) {
            Write-Host "❌ Node.js 版本过低: $nodeVersion" -ForegroundColor Red
            Write-Host ""
            Write-Host "OpenClaw 需要 Node.js >= 22.12.0" -ForegroundColor Yellow
            Write-Host "请访问 https://nodejs.org/ 下载最新版本" -ForegroundColor Yellow
            Write-Host ""
            exit 1
        }
        
        Write-Host "✓ Node.js 版本: $nodeVersion" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ 未检测到 Node.js" -ForegroundColor Red
        Write-Host ""
        Write-Host "请先安装 Node.js 22.12.0 或更高版本：" -ForegroundColor Yellow
        Write-Host "  官网: https://nodejs.org/" -ForegroundColor White
        Write-Host ""
        exit 1
    }
}

# 检查 npm
function Test-Npm {
    try {
        $npmVersion = npm -v 2>$null
        Write-Host "✓ npm 版本: v$npmVersion" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ 未检测到 npm" -ForegroundColor Red
        exit 1
    }
}

# 卸载原版
function Remove-OriginalOpenClaw {
    $installed = npm list -g openclaw 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "⚠ 检测到原版 OpenClaw，正在卸载..." -ForegroundColor Yellow
        npm uninstall -g openclaw 2>$null
        Write-Host "✓ 原版已卸载" -ForegroundColor Green
    }
}

# 检测是否在中国大陆（用于自动选择镜像源）
function Test-ChinaEnvironment {
    # 检查时区
    try {
        $tz = (Get-TimeZone).Id
        if ($tz -match "China|Shanghai|Beijing") { return $true }
    } catch {}
    # 检查系统语言
    $culture = [System.Globalization.CultureInfo]::CurrentCulture.Name
    if ($culture -match "zh-CN|zh-TW|zh-HK") { return $true }
    return $false
}

# 安装汉化版
function Install-ChineseVersion {
    Write-Host ""
    Write-Host "📦 正在安装 OpenClaw 汉化版 [$VersionName]..." -ForegroundColor Blue
    Write-Host ""
    
    $registryArg = @()
    if (Test-ChinaEnvironment) {
        Write-Host "🇨🇳 检测到中国大陆环境，自动使用淘宝镜像源加速" -ForegroundColor Cyan
        $registryArg = @("--registry=https://registry.npmmirror.com")
    }
    
    npm install -g "@qingchencloud/openclaw-zh@$NpmTag" @registryArg
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 安装失败，请检查网络连接" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "✓ 安装完成！" -ForegroundColor Green
}

# 运行安装后自动初始化 (条件性)
function Invoke-SetupIfNeeded {
    $ConfigPath = Join-Path $env:USERPROFILE ".openclaw\openclaw.json"
    
    # CI 环境跳过
    if ($env:CI -eq "true") {
        Write-Host "⚠ 检测到 CI 环境，跳过自动初始化" -ForegroundColor Yellow
        return
    }
    
    # 用户明确跳过
    if ($env:OPENCLAW_SKIP_SETUP -eq "1") {
        Write-Host "⚠ OPENCLAW_SKIP_SETUP=1，跳过自动初始化" -ForegroundColor Yellow
        return
    }
    
    # 如果提供了胜算云 Key，执行胜算云专属非交互式 onboard
    if ($ShengsuanyunKey) {
        Write-Host ""
        Write-Host "🔧 正在配置胜算云..." -ForegroundColor Blue
        Write-Host ""
        
        try {
            & openclaw onboard --non-interactive `
                --auth-choice shengsuanyun-api-key `
                --shengsuanyun-api-key $ShengsuanyunKey `
                --accept-risk 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ 胜算云配置完成！" -ForegroundColor Green
            } else {
                throw "onboard failed"
            }
        } catch {
            # 降级：设置环境变量后重试
            $env:SHENGSUANYUN_API_KEY = $ShengsuanyunKey
            try {
                & openclaw onboard --non-interactive `
                    --auth-choice shengsuanyun-api-key `
                    --accept-risk 2>$null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✓ 胜算云配置完成（环境变量模式）！" -ForegroundColor Green
                } else {
                    throw "retry failed"
                }
            } catch {
                Write-Host "⚠ 胜算云自动配置失败，请手动运行:" -ForegroundColor Yellow
                Write-Host "   openclaw onboard"
                Write-Host "   然后在认证选项中选择 '胜算云 API 密钥'"
            }
        }
        return
    }
    
    # 已有配置则跳过
    if (Test-Path $ConfigPath) {
        Write-Host "⚠ 检测到已有配置 ($ConfigPath)，跳过自动初始化" -ForegroundColor Yellow
        return
    }
    
    Write-Host ""
    Write-Host "🔧 正在运行初始化配置..." -ForegroundColor Blue
    Write-Host "   (设置环境变量 OPENCLAW_SKIP_SETUP=1 可跳过此步骤)" -ForegroundColor Yellow
    Write-Host ""
    
    # 尝试运行非交互式 setup
    try {
        $null = openclaw setup --non-interactive 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ 自动初始化完成" -ForegroundColor Green
        } else {
            Write-Host "⚠ 自动初始化跳过（可能需要交互），请手动运行: openclaw onboard" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "⚠ 自动初始化跳过（可能需要交互），请手动运行: openclaw onboard" -ForegroundColor Yellow
    }
}

# 成功信息
function Show-Success {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                           ║" -ForegroundColor Green
    Write-Host "║     ✅ OpenClaw 汉化版安装成功！                          ║" -ForegroundColor Green
    Write-Host "║                                                           ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "📦 已安装版本：$VersionName (@$NpmTag)" -ForegroundColor Cyan
    Write-Host ""
    if ($Nightly) {
        Write-Host "⚠  提示：您安装的是最新版，追踪上游最新代码，可能不够稳定。" -ForegroundColor Yellow
        Write-Host "   切换到稳定版：npm install -g @qingchencloud/openclaw-zh@latest" -ForegroundColor Yellow
        Write-Host ""
    }
    Write-Host "🚀 快速开始：" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   openclaw onboard          # 启动初始化向导（首次必须运行）"
    Write-Host "   openclaw onboard --install-daemon  # 安装后台守护进程"
    Write-Host "   openclaw                  # 启动 OpenClaw"
    Write-Host "   openclaw --help           # 查看帮助"
    Write-Host ""
    Write-Host "💡 OpenClaw 是什么？" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   开源个人 AI 助手平台，可通过 WhatsApp/Telegram/Discord 等"
    Write-Host "   聊天应用与你的 AI 助手交互，管理邮件、日历、文件等一切事务。"
    Write-Host ""
    Write-Host "⚠️  远程访问常见问题：" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   如果 Dashboard 显示 'gateway token mismatch' 错误:"
    Write-Host ""
    Write-Host "   方法1: " -ForegroundColor Cyan -NoNewline
    Write-Host "使用命令自动打开带 token 的 Dashboard"
    Write-Host "          openclaw dashboard"
    Write-Host ""
    Write-Host "   方法2: " -ForegroundColor Cyan -NoNewline
    Write-Host "手动设置 token 后访问"
    Write-Host "          openclaw config set gateway.auth.token 你的密码"
    Write-Host "          然后在浏览器 URL 后加 ?token=你的密码"
    Write-Host ""
    Write-Host "📚 更多信息：" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   汉化官网: https://openclaw.qt.cool/"
    Write-Host "   原版官网: https://openclaw.ai/"
    Write-Host "   GitHub:   https://github.com/1186258278/OpenClawChineseTranslation"
    Write-Host ""
}

# 主流程
function Main {
    Show-Banner
    
    Write-Host "🔍 环境检查..." -ForegroundColor Blue
    Write-Host ""
    
    Test-NodeVersion
    Test-Npm
    
    Write-Host ""
    Remove-OriginalOpenClaw
    Install-ChineseVersion
    Invoke-SetupIfNeeded
    Show-Success
}

# 执行
Main
