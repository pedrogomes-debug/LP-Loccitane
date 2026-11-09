# Gera a régua CRM usando só o disco E: (temporários, cache e saídas).
# Uso, no PowerShell: powershell -ExecutionPolicy Bypass -File E:\LP-Loccitane\emails\gerar-crm.ps1

$ErrorActionPreference = "Stop"
$tmp = "E:\tmp"
New-Item -ItemType Directory -Force $tmp, "$tmp\appdata", "$tmp\localappdata" | Out-Null

$env:TEMP = $tmp
$env:TMP = $tmp
$env:APPDATA = "$tmp\appdata"
$env:LOCALAPPDATA = "$tmp\localappdata"
$env:npm_config_cache = "$tmp\npm-cache"
# Sem puppeteer: o Chrome dele fica no C:. Os títulos saem em 24px.
$env:SEM_MEDIDOR = "1"

$log = "$tmp\gerar-crm.log"
Set-Location E:\LP-Loccitane

"== Imagens ==" | Out-File $log -Encoding utf8
node emails/preparar-imagens-crm.mjs *>> $log
if ($LASTEXITCODE -ne 0) { "Falhou nas imagens (ver $log)"; exit 1 }

"== Build ==" | Out-File $log -Append -Encoding utf8
node emails/build-crm.mjs *>> $log
if ($LASTEXITCODE -ne 0) { "Falhou no build (ver $log)"; exit 1 }

Get-Content $log
"Pronto. Aprovação: E:\LP-Loccitane\emails\dist\preview\crm\index.html"
