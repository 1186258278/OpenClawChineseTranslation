# ============================================================
# install.ps1 测试
# 使用 Pester (PowerShell 测试框架)
# 兼容 Pester 5.x
# ============================================================

$script:ScriptPath = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) "install.ps1"

function Assert-Equal {
    param($Actual, $Expected)
    if ($Actual -ne $Expected) {
        throw "Expected '$Expected', got '$Actual'"
    }
}

function Assert-Matches {
    param([string]$Actual, [string]$Pattern)
    if ($Actual -notmatch $Pattern) {
        throw "Expected content to match pattern: $Pattern"
    }
}

function Assert-NotMatches {
    param([string]$Actual, [string]$Pattern)
    if ($Actual -match $Pattern) {
        throw "Expected content not to match pattern: $Pattern"
    }
}

function Assert-DoesNotThrow {
    param([scriptblock]$ScriptBlock)
    try {
        & $ScriptBlock
    }
    catch {
        throw "Expected script block not to throw, but got: $_"
    }
}

# ============================================================
# 语法测试
# ============================================================

Describe "install.ps1 语法验证" {
    It "脚本语法正确" {
        $errors = $null
        $null = [System.Management.Automation.PSParser]::Tokenize(
            (Get-Content $ScriptPath -Raw),
            [ref]$errors
        )
        Assert-Equal $errors.Count 0
    }
    
    It "脚本可以加载" {
        Assert-DoesNotThrow { . $ScriptPath -Help }
    }
}

# ============================================================
# 帮助信息测试
# ============================================================

Describe "帮助信息" {
    It "-Help 正常退出不抛出错误" {
        # Write-Host 输出不能被捕获，只验证正常退出
        Assert-DoesNotThrow { & $ScriptPath -Help }
    }
}

# ============================================================
# 参数解析测试
# ============================================================

Describe "参数解析" {
    It "接受 -Nightly 参数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent "param"
        Assert-Matches $scriptContent "Nightly"
    }
    
    It "接受 -Help 参数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent "Help"
    }
}

# ============================================================
# 脚本结构测试
# ============================================================

Describe "脚本结构" {
    It "脚本包含 Show-Banner 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent "function Show-Banner"
    }
    
    It "脚本包含 Test-NodeVersion 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent "function Test-NodeVersion"
    }
    
    It "脚本包含 Test-Npm 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent "function Test-Npm"
    }
    
    It "脚本包含 Install-ChineseVersion 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent "function Install-ChineseVersion"
    }
    
    It "脚本包含 Show-Success 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent "function Show-Success"
    }
    
    It "脚本包含 Invoke-SetupIfNeeded 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent "function Invoke-SetupIfNeeded"
    }
}

# ============================================================
# 配置测试
# ============================================================

Describe "脚本配置" {
    It "脚本设置 ErrorActionPreference" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent 'ErrorActionPreference.*Stop'
    }
    
    It "脚本定义版本变量" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent 'NpmTag'
        Assert-Matches $scriptContent 'VersionName'
    }
    
    It "脚本使用正确的包名" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent '@qingchencloud/openclaw-zh'
    }

    It "脚本要求 Node.js 22.19.0 或更高版本" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent '22\.19\.0'
        Assert-Matches $scriptContent 'minorVersion -lt 19'
    }
}

# ============================================================
# 安全测试
# ============================================================

Describe "安全性检查" {
    It "脚本不包含硬编码的密码" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-NotMatches $scriptContent 'password\s*=\s*[''"][^''\"]+[''"]'
    }
    
    It "脚本不包含硬编码的 API Key" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-NotMatches $scriptContent 'api_key\s*=\s*[''"][^''\"]+[''"]'
    }
}

# ============================================================
# 自动初始化测试
# ============================================================

Describe "自动初始化功能" {
    It "脚本支持 OPENCLAW_SKIP_SETUP 环境变量" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent 'OPENCLAW_SKIP_SETUP'
    }
    
    It "脚本检测 CI 环境" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent '\$env:CI'
    }
    
    It "脚本检查配置文件存在" {
        $scriptContent = Get-Content $ScriptPath -Raw
        Assert-Matches $scriptContent 'openclaw\.json'
    }
}
