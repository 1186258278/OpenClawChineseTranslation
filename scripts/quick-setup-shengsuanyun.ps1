# ============================================================
# OpenClaw 汉化版 - 胜算云快速配置脚本 (Windows)
#
# 用法:
#   # 方式1: 交互式（引导输入 API Key）
#   .\quick-setup-shengsuanyun.ps1
#
#   # 方式2: 直接传入 API Key
#   .\quick-setup-shengsuanyun.ps1 -Key sk-xxxxx
#
#   # 方式3: 环境变量
#   $env:SHENGSUANYUN_API_KEY="sk-xxxxx"; .\quick-setup-shengsuanyun.ps1
#
#   # 方式4: 完整非交互式 onboard（首次安装推荐）
#   .\quick-setup-shengsuanyun.ps1 -Key sk-xxxxx -Onboard
#
# 武汉晴辰天下网络科技有限公司 | https://qingchencloud.com/
# ============================================================

param(
    [string]$Key,
    [switch]$Onboard,
    [switch]$InstallDaemon,
    [switch]$Help
)

$ErrorActionPreference = "Stop"

if ($Help) {
    Write-Host "OpenClaw 汉化版 - 胜算云快速配置" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "用法:"
    Write-Host "  .\quick-setup-shengsuanyun.ps1                        # 交互式"
    Write-Host "  .\quick-setup-shengsuanyun.ps1 -Key sk-xxxxx          # 直接配置"
    Write-Host "  .\quick-setup-shengsuanyun.ps1 -Key sk-xxxxx -Onboard # 完整初始化"
    Write-Host ""
    Write-Host "参数:"
    Write-Host "  -Key <string>        胜算云 API 密钥"
    Write-Host "  -Onboard             同时执行完整的非交互式 onboard 初始化"
    Write-Host "  -InstallDaemon       安装后台守护进程"
    Write-Host "  -Help                显示帮助信息"
    Write-Host ""
    Write-Host "环境变量:"
    Write-Host "  SHENGSUANYUN_API_KEY   如果未通过 -Key 指定，将使用此环境变量"
    Write-Host ""
    Write-Host "获取 API 密钥: https://shengsuanyun.com"
    Write-Host "OpenClaw 汉化版用户专属福利: 新注册送 10 元体验金！"
    exit 0
}

# 检查 openclaw 是否安装
try {
    $null = Get-Command openclaw -ErrorAction Stop
} catch {
    Write-Host "❌ 未检测到 OpenClaw" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先安装 OpenClaw 汉化版："
    Write-Host '  irm https://openclaw.qt.cool/install.ps1 | iex'
    exit 1
}

# 获取 API Key
$ApiKey = $Key
if (-not $ApiKey) {
    $ApiKey = $env:SHENGSUANYUN_API_KEY
}

if (-not $ApiKey) {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "║     🦞 胜算云 API 快速配置                                ║" -ForegroundColor Cyan
    Write-Host "║        国内 API 聚合平台，支持多种 AI 模型               ║" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "║     获取密钥: https://shengsuanyun.com                    ║" -ForegroundColor Cyan
    Write-Host "║     新用户福利: 注册送 10 元体验金！                      ║" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    $ApiKey = Read-Host "请输入胜算云 API 密钥"
    
    if (-not $ApiKey) {
        Write-Host "❌ API 密钥不能为空" -ForegroundColor Red
        exit 1
    }
}

# 验证 Key 格式
if ($ApiKey.Length -lt 8) {
    Write-Host "❌ API 密钥格式不正确（长度太短）" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 正在配置胜算云..." -ForegroundColor Blue
Write-Host ""

if ($Onboard) {
    # 完整非交互式 onboard
    Write-Host "▶ 执行完整 onboard 初始化（胜算云模式）..." -ForegroundColor Cyan
    
    $OnboardArgs = @(
        "onboard",
        "--non-interactive",
        "--auth-choice", "shengsuanyun-api-key",
        "--shengsuanyun-api-key", $ApiKey,
        "--accept-risk"
    )
    
    if ($InstallDaemon) {
        $OnboardArgs += "--install-daemon"
    }
    
    & openclaw @OnboardArgs
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ onboard 初始化失败" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                           ║" -ForegroundColor Green
    Write-Host "║     ✅ 胜算云配置完成！已完成完整初始化。                 ║" -ForegroundColor Green
    Write-Host "║                                                           ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
} else {
    # 仅配置认证
    Write-Host "▶ 配置胜算云认证信息..." -ForegroundColor Cyan
    
    # 使用环境变量 + 非交互式 onboard 方式配置
    $env:SHENGSUANYUN_API_KEY = $ApiKey
    
    try {
        & openclaw onboard --non-interactive --auth-choice shengsuanyun-api-key --accept-risk 2>$null
        if ($LASTEXITCODE -ne 0) {
            throw "onboard failed"
        }
    } catch {
        Write-Host "⚠ 非交互式配置失败，请手动运行: openclaw configure" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                                                           ║" -ForegroundColor Green
    Write-Host "║     ✅ 胜算云认证配置完成！                               ║" -ForegroundColor Green
    Write-Host "║                                                           ║" -ForegroundColor Green
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 快速开始：" -ForegroundColor Cyan
Write-Host ""
Write-Host "   openclaw                  # 启动 OpenClaw（使用胜算云模型）"
Write-Host "   openclaw dashboard        # 打开 Dashboard 管理面板"
Write-Host "   openclaw configure        # 修改配置"
Write-Host ""
Write-Host "💡 可用模型（通过胜算云）：" -ForegroundColor Cyan
Write-Host ""
Write-Host "   GPT-4.1 / GPT-4.1-nano / GPT-4.1-mini"
Write-Host "   Claude Sonnet 4 / Claude Haiku"
Write-Host "   DeepSeek V3 / DeepSeek R1"
Write-Host "   Qwen3 / GLM-4 / 通义千问"
Write-Host "   更多模型请访问 https://shengsuanyun.com"
Write-Host ""
