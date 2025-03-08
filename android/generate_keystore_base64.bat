@echo off
echo Generating base64-encoded keystore for GitHub Actions...

if not exist app\release.keystore (
    echo Error: release.keystore not found in app directory.
    echo Please run setup_fastlane.bat first to create the keystore.
    pause
    exit /b 1
)

echo Converting keystore to base64...
certutil -encode app\release.keystore temp.b64
findstr /v /c:- /c:BEGIN /c:END temp.b64 > keystore_base64.txt
del temp.b64

echo Base64-encoded keystore saved to keystore_base64.txt
echo.
echo Instructions:
echo 1. Open keystore_base64.txt
echo 2. Copy the entire content
echo 3. Add it as a GitHub secret named KEYSTORE_BASE64
echo.
echo For security, delete keystore_base64.txt after adding the secret to GitHub.
echo.
pause
