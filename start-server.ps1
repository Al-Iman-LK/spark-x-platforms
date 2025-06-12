# PowerShell script to start Spark-X Platforms development server

Write-Host "🚀 Starting Spark-X Platforms Development Server..." -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Try Python first
if (Test-Command "python") {
    Write-Host "✅ Found Python - Starting HTTP Server on http://localhost:8000" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Open your browser and navigate to: http://localhost:8000" -ForegroundColor Yellow
    Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Red
    Write-Host ""
    
    try {
        python -m http.server 8000
    }
    catch {
        Write-Host "❌ Failed to start Python server" -ForegroundColor Red
    }
}
# Try Node.js as fallback
elseif (Test-Command "node") {
    Write-Host "🔍 Python not found, checking Node.js..." -ForegroundColor Yellow
    
    if (Test-Command "npm") {
        Write-Host "✅ Found Node.js and npm" -ForegroundColor Green
        
        # Check if http-server is installed globally
        $httpServerInstalled = $false
        try {
            npm list -g http-server 2>$null | Out-Null
            $httpServerInstalled = $true
        }
        catch {
            Write-Host "📦 Installing http-server globally..." -ForegroundColor Yellow
            npm install -g http-server
            $httpServerInstalled = $true
        }
        
        if ($httpServerInstalled) {
            Write-Host "✅ Starting Node.js HTTP Server on http://localhost:8000" -ForegroundColor Green
            Write-Host ""
            Write-Host "🌐 Open your browser and navigate to: http://localhost:8000" -ForegroundColor Yellow
            Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Red
            Write-Host ""
            
            try {
                http-server -p 8000 -c-1
            }
            catch {
                Write-Host "❌ Failed to start Node.js server" -ForegroundColor Red
            }
        }
    }
    else {
        Write-Host "❌ Node.js found but npm is not available" -ForegroundColor Red
    }
}
# No suitable server found
else {
    Write-Host "❌ Neither Python nor Node.js found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install one of the following:" -ForegroundColor Yellow
    Write-Host "  • Python 3.x (recommended)" -ForegroundColor White
    Write-Host "  • Node.js with npm" -ForegroundColor White
    Write-Host ""
    Write-Host "Alternative options:" -ForegroundColor Cyan
    Write-Host "  • Use Visual Studio Code with Live Server extension" -ForegroundColor White
    Write-Host "  • Use any other local web server" -ForegroundColor White
    Write-Host "  • Deploy to a hosting service for testing" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Note: Opening index.html directly in browser will work" -ForegroundColor Yellow
    Write-Host "   but some PWA features may not function properly" -ForegroundColor Yellow
    Write-Host ""
    
    # Ask if user wants to open the file directly
    $choice = Read-Host "Would you like to open index.html in your default browser? (y/n)"
    if ($choice -eq "y" -or $choice -eq "Y" -or $choice -eq "yes") {
        $indexPath = Join-Path $PSScriptRoot "index.html"
        if (Test-Path $indexPath) {
            Write-Host "📂 Opening index.html in default browser..." -ForegroundColor Green
            Start-Process $indexPath
        }
        else {
            Write-Host "❌ index.html not found in current directory" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
