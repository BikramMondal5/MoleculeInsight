# MoleculeInsight - Quick Command Reference

## Installation Commands

### Frontend Setup
```powershell
# Install dependencies
pnpm install

# Install specific package
pnpm add <package-name>
```

### Backend Setup
```powershell
# Navigate to agents directory
cd agents

# Create virtual environment
python -m venv venv

# Activate virtual environment (PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Install specific package
pip install <package-name>
```

## Running the Application

### Quick Start (Both Services)
```powershell
# From project root
.\start.ps1
```

### Start Backend Only
```powershell
cd agents
.\venv\Scripts\Activate.ps1
python main.py
```

### Start Frontend Only
```powershell
pnpm dev
```

### Production Build
```powershell
pnpm build
pnpm start
```

## Testing Commands

### Test Backend Setup
```powershell
cd agents
.\venv\Scripts\Activate.ps1
python test_setup.py
```

### Test Specific Agent
```powershell
cd agents
.\venv\Scripts\Activate.ps1

# Test IQVIA agent
python -m Agent_workers.iqvia_agent

# Test Clinical Trials agent
python -m Agent_workers.clinical_trials_agent

# Test Patent agent
python -m Agent_workers.patent_agent
```

### Test Orchestrator
```powershell
cd agents
.\venv\Scripts\Activate.ps1
cd Agent-orchestrates
python agent-orchestrates.py Aspirin --geography "Global"
```

### Frontend Linting
```powershell
pnpm lint
```

## API Testing

### Test FastAPI Endpoints
```powershell
# Health check
curl http://localhost:8000/health

# Analyze molecule
curl -X POST http://localhost:8000/api/analyze `
  -H "Content-Type: application/json" `
  -d '{"query": "Analyze Aspirin", "molecule": "Aspirin", "geography": "Global"}'
```

### Test Next.js API
```powershell
# Status check
curl http://localhost:3000/api/process

# Analyze via proxy
curl -X POST http://localhost:3000/api/process `
  -H "Content-Type: application/json" `
  -d '{"query": "Analyze Aspirin", "molecule": "Aspirin"}'
```

## Development Commands

### Backend Development
```powershell
# Run with auto-reload
cd agents
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### View FastAPI Docs
```
http://localhost:8000/docs
```

### Frontend Development
```powershell
# Development mode with turbo
pnpm dev --turbo

# Development on different port
pnpm dev -p 3001
```

## Maintenance Commands

### Update Dependencies

**Frontend:**
```powershell
pnpm update
pnpm outdated  # Check for outdated packages
```

**Backend:**
```powershell
cd agents
.\venv\Scripts\Activate.ps1
pip list --outdated
pip install --upgrade <package-name>
```

### Clear Cache

**Frontend:**
```powershell
# Clear Next.js cache
rm -r .next

# Clear pnpm cache
pnpm store prune
```

**Backend:**
```powershell
# Clear Python cache
Get-ChildItem -Recurse -Filter "__pycache__" | Remove-Item -Recurse -Force
Get-ChildItem -Recurse -Filter "*.pyc" | Remove-Item -Force
```

## Troubleshooting Commands

### Check Ports
```powershell
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process on port
Stop-Process -Id <PID> -Force
```

### View Logs
```powershell
# Backend logs (if running in background)
Get-Content -Path "agents/logs/app.log" -Tail 50 -Wait

# Frontend logs are in the terminal
```

### Environment Variables
```powershell
# View environment variables
Get-ChildItem Env:

# Check specific variable
echo $env:FASTAPI_URL

# Set temporary variable
$env:FASTAPI_URL = "http://localhost:8000"
```

## Git Commands

### Common Workflow
```powershell
# Check status
git status

# Add changes
git add .

# Commit (excluding sensitive files)
git commit -m "Your message"

# Push to branch
git push origin Bikram
```

### Useful Git Commands
```powershell
# View changes
git diff

# View commit history
git log --oneline

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout Bikram
```

## Database/Storage Commands

### View Generated Reports
```powershell
# Navigate to reports directory
cd agents/reports

# List all reports
Get-ChildItem *.md

# View latest report
Get-Content (Get-ChildItem *.md | Sort-Object LastWriteTime -Descending | Select-Object -First 1)
```

## Performance Monitoring

### Monitor Backend
```powershell
# Install psutil if needed
pip install psutil

# Monitor FastAPI performance
# (Add monitoring code in main.py if needed)
```

### Monitor Frontend
```powershell
# Next.js build analysis
pnpm build
# Check .next/analyze output
```

## Quick Fixes

### Reset Everything
```powershell
# Stop all services (Ctrl+C in terminals)

# Clear caches
rm -r .next
rm -r agents/__pycache__
rm -r agents/Agent-workers/__pycache__

# Restart
.\start.ps1
```

### Reinstall Dependencies
```powershell
# Frontend
rm -r node_modules
rm pnpm-lock.yaml
pnpm install

# Backend
cd agents
rm -r venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Useful Aliases (Add to PowerShell Profile)

```powershell
# Edit PowerShell profile
notepad $PROFILE

# Add these aliases:
function Start-MoleculeInsight { & "$PWD\start.ps1" }
function Test-Backend { cd agents; .\venv\Scripts\Activate.ps1; python test_setup.py }
function Dev-Frontend { pnpm dev }
function Dev-Backend { cd agents; .\venv\Scripts\Activate.ps1; python main.py }

# Usage after reloading profile:
Start-MoleculeInsight
Test-Backend
Dev-Frontend
Dev-Backend
```

## Keyboard Shortcuts

- **Stop Server**: `Ctrl+C`
- **Clear Terminal**: `cls` or `clear`
- **Exit Python**: `exit()` or `Ctrl+Z` then `Enter`
- **Deactivate venv**: `deactivate`
