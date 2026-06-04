Write-Host "Starting post-build script..." -ForegroundColor Green

# Copy the types file to the dist folder
$srcFiles = @("./src/types.ts", "./src/global.d.ts")
$destFiles = @("index.d.ts", "global.d.ts")
$destFolder = "dist"
if (!(Test-Path -Path $destFolder)) {
    New-Item -ItemType Directory -Path $destFolder | Out-Null
}
for ($i = 0; $i -lt $srcFiles.Length; $i++) {
    $srcFile = $srcFiles[$i]
    $destFile = $destFiles[$i]
    Write-Host "Copying $srcFile to $destFolder/$destFile..." -ForegroundColor Yellow
    Copy-Item -Path $srcFile -Destination "$destFolder/$destFile" -Force
}
Write-Host "Copied successfully" -ForegroundColor Green
Write-Host "Post-build script completed." -ForegroundColor Green
