# MoleculeInsight Startup Script for Windows PowerShell

Write-Host "Starting MoleculeInsight Platform..." -ForegroundColor Green

# Check if Python virtual environment exists
if (-Not (Test-Path ".\agents\venv")) {
    Write-Host "Virtual environment not found. Creating..." -ForegroundColor Yellow
    cd agents
    python -m venv venv
    cd ..
}

# Start FastAPI Backend
Write-Host "`nStarting FastAPI Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\agents'; .\venv\Scripts\Activate.ps1; python main.py"

# Wait for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start Next.js Frontend
Write-Host "`nStarting Next.js Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; pnpm dev"

Write-Host "`n✓ Both services started!" -ForegroundColor Green
Write-Host "`nFastAPI Backend: http://localhost:8000" -ForegroundColor Magenta
Write-Host "Next.js Frontend: http://localhost:3000" -ForegroundColor Magenta
Write-Host "`nPress Ctrl+C in each window to stop the services.`n" -ForegroundColor Yellow
