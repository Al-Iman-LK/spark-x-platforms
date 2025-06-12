@echo off
echo Starting Spark-X Platforms Development Server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python HTTP Server on http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
) else (
    REM Check if Node.js is available
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Python not found, checking for Node.js...
        npm --version >nul 2>&1
        if %errorlevel% == 0 (
            echo Installing http-server...
            npm install -g http-server
            echo.
            echo Using Node.js HTTP Server on http://localhost:8000
            echo.
            echo Press Ctrl+C to stop the server
            echo.
            http-server -p 8000
        ) else (
            echo Neither Python nor Node.js with npm found.
            echo Please install Python or Node.js to run the development server.
            pause
        )
    ) else (
        echo Neither Python nor Node.js found.
        echo Please install Python or Node.js to run the development server.
        echo.
        echo Alternative: Open index.html directly in your browser
        echo Note: Some PWA features may not work when opening files directly
        pause
    )
)
