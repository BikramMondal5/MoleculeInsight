# MoleculeInsight

An AI-powered Agent platform for molecular research. MoleculeInsight uses specialized AI agents to explore market data, clinical trials, patents, trade signals, and web intelligence—giving you instant, research-grade insights for pharmaceutical and biotech opportunities.

## 🚀 Features

- **Multi-Agent Architecture**: Coordinated AI agents working in parallel
- **Real-time Analysis**: Live agent status updates and progress tracking
- **Comprehensive Data Sources**: 
  - IQVIA market insights
  - ClinicalTrials.gov data
  - PatentsView patent landscape
  - UN Comtrade export/import trends
  - NewsAPI web intelligence
- **Interactive Dashboard**: Beautiful visualizations and markdown reports
- **Export Capabilities**: Download PDF reports and archive analyses

## 📋 Quick Start

### Prerequisites
- Node.js 18+ with pnpm
- Python 3.9+
- API Keys (Gemini, Comtrade, NewsAPI)

### Installation

1. **Clone and install dependencies:**
```bash
pnpm install
cd agents
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
```

2. **Configure environment variables:**
```bash
# Copy example files
cd agents
copy .env.example .env
cd ..
copy .env.local.example .env.local

# Edit agents/.env with your API keys
```

3. **Start the application:**
```bash
# Easy way (Windows):
.\start.ps1

# Manual way:
# Terminal 1 - Backend
cd agents
.\venv\Scripts\Activate.ps1
python main.py

# Terminal 2 - Frontend
pnpm dev
```

4. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 📖 Usage

1. Navigate to `/analysis` page
2. Enter your molecule query (e.g., "Analyze Aspirin for cardiovascular applications")
3. Optionally specify molecule name and geography
4. Click "Run Agentic Analysis"
5. Watch agents work in real-time
6. Review comprehensive results in the dashboard

## 🏗️ Architecture

```
┌─────────────────┐
│   Next.js UI    │ ← User Interface
└────────┬────────┘
         │
┌────────▼────────┐
│  API Route      │ ← Next.js API Route
└────────┬────────┘
         │
┌────────▼────────┐
│  FastAPI Server │ ← Python Backend
└────────┬────────┘
         │
┌────────▼────────────────────────┐
│      Agent Orchestrator         │
└─┬─────┬─────┬─────┬─────┬──────┘
  │     │     │     │     │
  ▼     ▼     ▼     ▼     ▼
IQVIA Clinical Patent EXIM Web
Agent  Trials  Agent Agent Agent
      Agent
```

## 🔑 API Keys Required

- **Gemini API**: https://makersuite.google.com/app/apikey
- **UN Comtrade**: https://comtradeplus.un.org/
- **NewsAPI**: https://newsapi.org/

## 📚 Documentation

See [SETUP.md](SETUP.md) for detailed setup instructions and troubleshooting.

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Recharts

**Backend:**
- FastAPI
- Python 3.9+
- LangChain
- Google Gemini AI

## 📄 License

See LICENSE file for details.
