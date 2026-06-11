# ============================================================
# install.ps1 测试
# 使用 Pester (PowerShell 测试框架)
# 兼容 Pester 5.x
# ============================================================

$script:ScriptPath = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) "install.ps1"

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
        if ($errors.Count -ne 0) { throw "PowerShell parser reported $($errors.Count) errors" }
    }
    
    It "脚本可以加载" {
        try { . $ScriptPath -Help } catch { throw "Help load threw: $_" }
    }
}

# ============================================================
# 帮助信息测试
# ============================================================

Describe "帮助信息" {
    It "-Help 正常退出不抛出错误" {
        # Write-Host 输出不能被捕获，只验证正常退出
        try { & $ScriptPath -Help } catch { throw "Help execution threw: $_" }
    }
}

# ============================================================
# 参数解析测试
# ============================================================

Describe "参数解析" {
    It "接受 -Nightly 参数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch "param") { throw "Missing param block" }
        if ($scriptContent -notmatch "Nightly") { throw "Missing Nightly parameter" }
    }
    
    It "接受 -Help 参数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch "Help") { throw "Missing Help parameter" }
    }
}

# ============================================================
# 脚本结构测试
# ============================================================

Describe "脚本结构" {
    It "脚本包含 Show-Banner 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch "function Show-Banner") { throw "Missing Show-Banner function" }
    }
    
    It "脚本包含 Test-NodeVersion 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch "function Test-NodeVersion") { throw "Missing Test-NodeVersion function" }
    }
    
    It "脚本包含 Test-Npm 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch "function Test-Npm") { throw "Missing Test-Npm function" }
    }
    
    It "脚本包含 Install-ChineseVersion 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch "function Install-ChineseVersion") { throw "Missing Install-ChineseVersion function" }
    }
    
    It "脚本包含 Show-Success 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch "function Show-Success") { throw "Missing Show-Success function" }
    }
    
    It "脚本包含 Invoke-SetupIfNeeded 函数" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch "function Invoke-SetupIfNeeded") { throw "Missing Invoke-SetupIfNeeded function" }
    }
}

# ============================================================
# 配置测试
# ============================================================

Describe "脚本配置" {
    It "脚本设置 ErrorActionPreference" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch 'ErrorActionPreference.*Stop') { throw "Missing ErrorActionPreference Stop setting" }
    }
    
    It "脚本定义版本变量" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch 'NpmTag') { throw "Missing NpmTag variable" }
        if ($scriptContent -notmatch 'VersionName') { throw "Missing VersionName variable" }
    }
    
    It "脚本使用正确的包名" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch '@qingchencloud/openclaw-zh') { throw "Missing package name" }
    }

    It "脚本要求 Node.js 22.19.0 或更高版本" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch '22\.19\.0') { throw "Missing Node.js 22.19.0 requirement" }
        if ($scriptContent -notmatch 'minorVersion -lt 19') { throw "Missing Node.js minor version gate" }
    }
}

# ============================================================
# 安全测试
# ============================================================

Describe "安全性检查" {
    It "脚本不包含硬编码的密码" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -match 'password\s*=\s*[''"][^''\"]+[''"]') { throw "Found hardcoded password pattern" }
    }
    
    It "脚本不包含硬编码的 API Key" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -match 'api_key\s*=\s*[''"][^''\"]+[''"]') { throw "Found hardcoded API key pattern" }
    }
}

# ============================================================
# 自动初始化测试
# ============================================================

Describe "自动初始化功能" {
    It "脚本支持 OPENCLAW_SKIP_SETUP 环境变量" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch 'OPENCLAW_SKIP_SETUP') { throw "Missing OPENCLAW_SKIP_SETUP support" }
    }
    
    It "脚本检测 CI 环境" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch '\$env:CI') { throw "Missing CI detection" }
    }
    
    It "脚本检查配置文件存在" {
        $scriptContent = Get-Content $ScriptPath -Raw
        if ($scriptContent -notmatch 'openclaw\.json') { throw "Missing openclaw.json check" }
    }
}
