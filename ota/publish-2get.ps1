# App2Store OTA publisher — 2get
# Builds the 2get web bundle, zips it, stages it under ota/2get/, updates
# latest.json, and deploys the app2store site (which serves the OTA files).
# Usage: .\publish-2get.ps1 -Version 1.0.1
param(
    [Parameter(Mandatory = $true)][string]$Version
)

$ErrorActionPreference = "Stop"
$appRepo = "C:\New Project\2get"
$otaDir = "C:\New Project\app2store\ota\2get"
$bundleName = "bundle-$Version.zip"

# 1. Build the mobile web bundle
Push-Location $appRepo
$env:CAP_BUILD = "1"
$env:LOVABLE_API_KEY = "local-prerender-dummy"
npm run build
if ($LASTEXITCODE -ne 0) { throw "build failed" }
Pop-Location

# 2. Zip dist/client (contents at zip root)
New-Item -ItemType Directory -Force $otaDir | Out-Null
$zipPath = Join-Path $otaDir $bundleName
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$appRepo\dist\client\*" -DestinationPath $zipPath

# 3. Manifest
@{ version = $Version; url = "https://app2store.co.il/ota/2get/$bundleName" } |
    ConvertTo-Json | Out-File -Encoding utf8 (Join-Path $otaDir "latest.json")

# 4. Deploy the site (serves /ota/2get/*)
Push-Location "C:\New Project\app2store"
npx vercel deploy --prod --yes
Pop-Location

Write-Host "OTA $Version published: https://app2store.co.il/ota/2get/latest.json"
