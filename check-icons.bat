@echo off
echo 🎨 Spark-X PWA Icon Replacement Tool
echo =====================================
echo.

set ICONS_DIR=%~dp0icons

echo Checking icons directory: %ICONS_DIR%
if not exist "%ICONS_DIR%" (
    echo ❌ Icons directory not found!
    pause
    exit /b 1
)

echo.
echo 📋 Current icon files:
dir "%ICONS_DIR%\*.png" /b 2>nul
if errorlevel 1 (
    echo ❌ No PNG files found in icons directory
    echo.
    echo 💡 Instructions:
    echo 1. Open: icon-generator-tool.html in your browser
    echo 2. Download all generated PNG files
    echo 3. Move them to the icons\ folder
    echo 4. Run this script again
    pause
    exit /b 1
)

echo.
echo 🔍 Checking for real PNG files vs text placeholders...

set "REAL_ICONS=0"
set "TEXT_PLACEHOLDERS=0"

for %%f in ("%ICONS_DIR%\*.png") do (
    find "Placeholder" "%%f" >nul 2>&1
    if not errorlevel 1 (
        echo ⚠️  Text placeholder found: %%~nxf
        set /a TEXT_PLACEHOLDERS+=1
    ) else (
        echo ✅ Real PNG file: %%~nxf
        set /a REAL_ICONS+=1
    )
)

echo.
echo 📊 Summary:
echo Real PNG icons: %REAL_ICONS%
echo Text placeholders: %TEXT_PLACEHOLDERS%

if %TEXT_PLACEHOLDERS% GTR 0 (
    echo.
    echo ⚠️  You still have text placeholder files!
    echo 💡 Please download real PNG icons from the generator tool
    echo.
    pause
    exit /b 1
)

if %REAL_ICONS% GEQ 8 (
    echo.
    echo 🎉 All icons are real PNG files!
    echo ✅ Your PWA should now show the install prompt
    echo.
    echo 🚀 Next steps:
    echo 1. Test your PWA on mobile device
    echo 2. Check for install prompt
    echo 3. Deploy to GitHub Pages
) else (
    echo.
    echo ⚠️  You need at least 8 icon sizes for full PWA compliance
    echo 💡 Make sure you have all these sizes:
    echo    - 72x72, 96x96, 128x128, 144x144
    echo    - 152x152, 192x192, 384x384, 512x512
)

echo.
echo Press any key to exit...
pause >nul
