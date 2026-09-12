# Test only extracted functions with a Docker mock. Never execute deployment Main.
$ErrorActionPreference = 'Stop'
$source = Join-Path $PSScriptRoot '../../docker-deploy.ps1'
$parseErrors = $null
$ast = [System.Management.Automation.Language.Parser]::ParseFile(
    $source, [ref]$null, [ref]$parseErrors)
if ($parseErrors) { throw 'Deployment script syntax errors' }
foreach ($fn in $ast.FindAll({
    param($node)
    $node -is [System.Management.Automation.Language.FunctionDefinitionAst] -and
        $node.Name -in @('Start-OpenClawContainer', 'Wait-ForReady')
}, $true)) {
    . ([scriptblock]::Create($fn.Extent.Text))
}
$script:mockCalls = [System.Collections.Generic.List[object]]::new()
function docker {
    $script:mockCalls.Add(@($args))
    $global:LASTEXITCODE = 0
    'fixture-container'
}
$LocalOnly = $true
$Port = '18888'
$Name = 'fixture'
$VolumeName = 'fixture-volume'
$Token = ''
$Image = 'fixture:image'
Start-OpenClawContainer
$call = $script:mockCalls[0]
if ($call -notcontains '127.0.0.1:18888:18789' -or
    $call -notcontains 'gateway' -or $call[-1] -ne 'lan') {
    throw 'local-only gateway argument regression'
}
Write-Output 'PASS: local-only gateway arguments'

function docker { $global:LASTEXITCODE = 0; 'false' }
try {
    Wait-ForReady
    throw 'TEST_EXPECTED_FAILURE'
} catch {
    if ($_.Exception.Message -notlike '*容器已退出*') { throw }
}
Write-Output 'PASS: stopped container fails deployment'

function Start-Sleep { }
function docker {
    if ($args[0] -eq 'inspect') { $global:LASTEXITCODE = 0; 'true' }
    else { $global:LASTEXITCODE = 1 }
}
try {
    Wait-ForReady
    throw 'TEST_EXPECTED_FAILURE'
} catch {
    if ($_.Exception.Message -notlike '*等待超时*') { throw }
}
Write-Output 'PASS: unhealthy gateway fails deployment'
# The last mocked curl deliberately failed; do not leak its exit status to CI.
$global:LASTEXITCODE = 0
