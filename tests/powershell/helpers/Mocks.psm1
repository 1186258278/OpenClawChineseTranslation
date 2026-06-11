# ============================================================
# PowerShell 测试辅助模块 - Mock 函数
# 用于模拟 node, npm, docker 等外部命令
# ============================================================

# ============================================================
# Node.js Mock 函数
# ============================================================

<#
.SYNOPSIS
    模拟 Node.js 命令返回指定版本
.PARAMETER Version
    要模拟的 Node.js 版本
#>
function Set-MockNode {
    param(
        [string]$Version = "v22.19.0"
    )
    
    $script:MockNodeVersion = $Version
    
    # 在 Pester 中使用 Mock
    # Mock -CommandName node -MockWith { $script:MockNodeVersion }
}

<#
.SYNOPSIS
    模拟 Node.js 不存在
#>
function Set-MockNodeNotFound {
    $script:MockNodeNotFound = $true
    
    # 在 Pester 中使用:
    # Mock -CommandName node -MockWith { throw "command not found" }
}

# ============================================================
# npm Mock 函数
# ============================================================

<#
.SYNOPSIS
    模拟 npm 命令返回指定版本
.PARAMETER Version
    要模拟的 npm 版本
#>
function Set-MockNpm {
    param(
        [string]$Version = "10.2.0"
    )
    
    $script:MockNpmVersion = $Version
}

<#
.SYNOPSIS
    模拟 npm 不存在
#>
function Set-MockNpmNotFound {
    $script:MockNpmNotFound = $true
}

# ============================================================
# Docker Mock 函数
# ============================================================

<#
.SYNOPSIS
    模拟 Docker 可用
#>
function Set-MockDockerAvailable {
    $script:MockDockerAvailable = $true
    $script:MockDockerRunning = $true
}

<#
.SYNOPSIS
    模拟 Docker 未安装
#>
function Set-MockDockerNotFound {
    $script:MockDockerAvailable = $false
}

<#
.SYNOPSIS
    模拟 Docker 未运行
#>
function Set-MockDockerNotRunning {
    $script:MockDockerAvailable = $true
    $script:MockDockerRunning = $false
}

<#
.SYNOPSIS
    模拟容器已存在
.PARAMETER ContainerName
    容器名称
#>
function Set-MockContainerExists {
    param(
        [string]$ContainerName = "openclaw"
    )
    
    $script:MockContainerName = $ContainerName
    $script:MockContainerExists = $true
}

# ============================================================
# OpenClaw Mock 函数
# ============================================================

<#
.SYNOPSIS
    模拟 OpenClaw 命令
#>
function Set-MockOpenClaw {
    $script:MockOpenClawAvailable = $true
}

# ============================================================
# 工具函数
# ============================================================

<#
.SYNOPSIS
    重置所有 Mock 状态
#>
function Reset-AllMocks {
    $script:MockNodeVersion = $null
    $script:MockNodeNotFound = $false
    $script:MockNpmVersion = $null
    $script:MockNpmNotFound = $false
    $script:MockDockerAvailable = $false
    $script:MockDockerRunning = $false
    $script:MockContainerName = $null
    $script:MockContainerExists = $false
    $script:MockOpenClawAvailable = $false
}

<#
.SYNOPSIS
    设置完整的测试环境 Mock
#>
function Set-FullMockEnvironment {
    Set-MockNode -Version "v22.19.0"
    Set-MockNpm -Version "10.2.0"
    Set-MockDockerAvailable
    Set-MockOpenClaw
}

<#
.SYNOPSIS
    获取 Docker Mock 配置
    用于在 Pester 测试中配置 Mock
#>
function Get-DockerMockScript {
    return {
        param($cmd, $args)
        
        switch ($cmd) {
            "--version" { return "Docker version 24.0.0, build 123abc" }
            "info" { 
                if ($script:MockDockerRunning) {
                    return "Containers: 5`nImages: 10"
                } else {
                    throw "Cannot connect to Docker daemon"
                }
            }
            "ps" { 
                if ($script:MockContainerExists) {
                    return $script:MockContainerName
                }
                return ""
            }
            "pull" { return "Pulling image: $($args[0])" }
            "run" { return "Running container" }
            "volume" { return "Volume operation" }
            default { return $null }
        }
    }
}

<#
.SYNOPSIS
    获取 npm Mock 配置
    用于在 Pester 测试中配置 Mock
#>
function Get-NpmMockScript {
    return {
        param($cmd, $args)
        
        switch ($cmd) {
            "-v" { return $script:MockNpmVersion }
            "--version" { return $script:MockNpmVersion }
            "list" { 
                $global:LASTEXITCODE = 1
                return $null 
            }
            "install" { return "Installing package" }
            "uninstall" { return "Uninstalling package" }
            default { return $null }
        }
    }
}

<#
.SYNOPSIS
    获取 Node Mock 配置
    用于在 Pester 测试中配置 Mock
#>
function Get-NodeMockScript {
    return {
        param($cmd)
        
        if ($script:MockNodeNotFound) {
            throw "node: command not found"
        }
        
        switch ($cmd) {
            "-v" { return $script:MockNodeVersion }
            "--version" { return $script:MockNodeVersion }
            default { return $null }
        }
    }
}

# ============================================================
# 导出函数
# ============================================================

Export-ModuleMember -Function @(
    'Set-MockNode',
    'Set-MockNodeNotFound',
    'Set-MockNpm',
    'Set-MockNpmNotFound',
    'Set-MockDockerAvailable',
    'Set-MockDockerNotFound',
    'Set-MockDockerNotRunning',
    'Set-MockContainerExists',
    'Set-MockOpenClaw',
    'Reset-AllMocks',
    'Set-FullMockEnvironment',
    'Get-DockerMockScript',
    'Get-NpmMockScript',
    'Get-NodeMockScript'
)
