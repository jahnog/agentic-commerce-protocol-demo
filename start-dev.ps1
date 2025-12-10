# Cleanup function
function Cleanup {
    Write-Host ""
    Write-Host "Shutting down..."

    # Stop all background jobs
    Get-Job | Stop-Job
    Get-Job | Remove-Job

    # Kill node processes
    Get-Process | Where-Object { $_.ProcessName -match "node" } | Stop-Process -Force -ErrorAction SilentlyContinue

    # Stop docker containers
    docker compose down 2>$null

    exit 0
}

# Register cleanup on Ctrl+C
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup }
try {
    # Copy .env.example to .env if .env doesn't exist
    Write-Host "Checking environment files..."
    
    if (-not (Test-Path "demo/merchant/.env")) {
        Write-Host "Creating demo/merchant/.env from demo/merchant/.env.example"
        Copy-Item "demo/merchant/.env.example" "demo/merchant/.env"
    }

    if (-not (Test-Path "demo/psp/.env")) {
        Write-Host "Creating demo/psp/.env from demo/psp/.env.example"
        Copy-Item "demo/psp/.env.example" "demo/psp/.env"
    }

    if (-not (Test-Path "demo/mcp-ui-server/.env")) {
        Write-Host "Creating demo/mcp-ui-server/.env from demo/mcp-ui-server/.env.example"
        Copy-Item "demo/mcp-ui-server/.env.example" "demo/mcp-ui-server/.env"
    }

    # Clean up and start containers
    Write-Host "Starting Docker containers..."
    docker compose down -v
    docker compose up -d --wait

    # Install dependencies if needed
    Write-Host "Checking dependencies..."
    
    # Start all services using concurrently
    Write-Host "Starting services with concurrently..."
    npx concurrently -n "MCP,MERCHANT,PSP" -c "cyan,green,yellow" `
        "cd demo/mcp-ui-server && npm run dev-windows" `
        "cd demo/merchant && npm run seed && npm run dev-windows" `
        "cd demo/psp && npm run dev-windows"
}
finally {
    Cleanup
}
