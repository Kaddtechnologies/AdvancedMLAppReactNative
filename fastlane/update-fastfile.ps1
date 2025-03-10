# PowerShell script to update Fastfile with patched version
Write-Host "Updating Fastfile with patched version..." -ForegroundColor Green

# Get the directory where the script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Change to the script directory
Set-Location $scriptDir

# Create a backup of the original Fastfile
Copy-Item -Path "Fastfile" -Destination "Fastfile.backup" -Force
Write-Host "Created backup of original Fastfile as Fastfile.backup" -ForegroundColor Cyan

# Replace the Fastfile with the patched version
Copy-Item -Path "Fastfile.patched" -Destination "Fastfile" -Force
Write-Host "Replaced Fastfile with patched version" -ForegroundColor Cyan

Write-Host "`nFastfile has been updated successfully!" -ForegroundColor Green
Write-Host "A backup of the original file has been saved as Fastfile.backup" -ForegroundColor Green