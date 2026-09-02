# App2Store OTA publisher — 2get
# Builds the 2get web bundle, zips it, stages it under ota/2get/, updates
# latest.json, and deploys the app2store site (which serves the OTA files).
# Usage: .\publish-2get.ps1 -Version 1.0.1
param(
    [Parameter(Mandatory = $true)][string]$Version,
    # "" = the frozen channel for binaries built before Firebase (versionCode 1-2).
    # "v2" = binaries from versionCode 3 up, the only ones that can run push code.
    [string]$Channel = "v2"
)

# NOTE: keep Continue — native tools (npm/vercel) write warnings to stderr,
# and Stop turns those into fatal errors under PowerShell 5.1.
$ErrorActionPreference = "Continue"
$appRepo = "C:\New Project\2get"
$otaDir = if ($Channel) { "C:\New Project\app2store\ota\2get\$Channel" } else { "C:\New Project\app2store\ota\2get" }
$bundleName = "bundle-$Version.zip"

# 1. Build the mobile web bundle
Push-Location $appRepo
$env:CAP_BUILD = "1"
$env:LOVABLE_API_KEY = "local-prerender-dummy"
npm run build
if ($LASTEXITCODE -ne 0) { throw "build failed" }
Pop-Location

# 2. Zip dist/client (contents at zip root).
# NOT Compress-Archive — it writes backslash entry names, which the Capgo
# updater rejects on-device ("Windows path not supported"). Forward slashes
# are required by the zip spec, so build entries by hand via .NET.
New-Item -ItemType Directory -Force $otaDir | Out-Null
$zipPath = Join-Path $otaDir $bundleName
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$srcDir = "$appRepo\dist\client"
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    Get-ChildItem $srcDir -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($srcDir.Length + 1) -replace "\\", "/"
        [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $zip, $_.FullName, $rel,
            [System.IO.Compression.CompressionLevel]::Optimal)
    }
} finally {
    $zip.Dispose()
}

# 3. Manifest (BOM-less UTF8 — Out-File utf8 adds a BOM in PS 5.1)
$urlBase = if ($Channel) { "https://app2store.co.il/ota/2get/$Channel" } else { "https://app2store.co.il/ota/2get" }
$manifestJson = @{ version = $Version; url = "$urlBase/$bundleName" } | ConvertTo-Json -Compress
[System.IO.File]::WriteAllText((Join-Path $otaDir "latest.json"), $manifestJson)

# 4. Keep only the new bundle and the previous one (rollback), then persist to
#    git. The OTA files MUST be tracked: a site deploy made from a fresh clone
#    silently drops anything untracked (this wiped the endpoint on 2026-08-25).
Get-ChildItem $otaDir -Filter "bundle-*.zip" |
    Sort-Object LastWriteTime -Descending |
    Select-Object -Skip 2 |
    Remove-Item -Force

Push-Location "C:\New Project\app2store"
git add -A ota/2get
git commit -m "OTA 2get $Version"
git push origin main
if ($LASTEXITCODE -ne 0) { throw "git push failed - fix before deploying, or the next clone deploy wipes OTA again" }

# 5. Deploy the site (serves /ota/2get/*)
npx vercel deploy --prod --yes
Pop-Location

Write-Host "OTA $Version published: $urlBase/latest.json"
