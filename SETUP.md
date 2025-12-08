# MoleculeInsight - AI-Powered Molecular Analysis Platform

## Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.9+
- Git

### Installation

#### 1. Clone and Install Frontend Dependencies
```bash
# Install Node.js dependencies
pnpm install
```

#### 2. Setup Python Backend

```bash
# Navigate to agents directory
cd agents

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
.\venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

#### 3. Configure Environment Variables

**Python Backend (.env):**
```bash
# Copy the example file
cd agents
copy .env.example .env

# Edit .env and add your API keys:
# - GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey
# - COMTRADE_API_KEY: Get from https://comtradeplus.un.org/
# - NEWS_API_KEY: Get from https://newsapi.org/
```

**Next.js Frontend (.env.local):**
```bash
# From project root
copy .env.local.example .env.local

# Edit .env.local if needed (default FastAPI URL is http://localhost:8000)
```

### Running the Application

#### Start the Backend (FastAPI)

```bash
# From the agents directory with venv activated
cd agents
python main.py
```

The FastAPI server will start on http://localhost:8000

#### Start the Frontend (Next.js)

```bash
# From project root in a new terminal
pnpm dev
```

The Next.js app will start on http://localhost:3000

### Usage

1. Navigate to http://localhost:3000/analysis
2. Enter your molecule query (e.g., "Analyze Aspirin for cardiovascular applications")
3. Optionally specify:
   - Molecule name
   - Geography (Global, US, India)
4. Click "Run Agentic Analysis"
5. Watch the agents work in real-time
6. Review comprehensive results in the dashboard

### API Endpoints

**FastAPI Backend:**
- `GET /` - Health check
- `GET /health` - Service status
- `POST /api/analyze` - Main analysis endpoint

**Next.js API Routes:**
- `GET /api/process` - Status check
- `POST /api/process` - Proxy to FastAPI backend

### Agent Architecture

The system uses multiple specialized agents:

1. **IQVIA Insights Agent** - Market analysis and competitor intelligence
2. **Clinical Trials Agent** - ClinicalTrials.gov data analysis
3. **Patent Agent** - Patent landscape via PatentsView API
4. **EXIM Trade Agent** - UN Comtrade export/import data
5. **Web Intelligence Agent** - News and web signals via NewsAPI
6. **Report Generator** - Consolidated markdown reports

### Troubleshooting

**FastAPI won't start:**
- Ensure Python virtual environment is activated
- Check all API keys are configured in `agents/.env`
- Verify port 8000 is not in use

**Next.js can't connect to backend:**
- Ensure FastAPI is running on http://localhost:8000
- Check FASTAPI_URL in `.env.local`
- Verify CORS is enabled in FastAPI (already configured)

**Agent errors:**
- Check API keys are valid and have sufficient quota
- Some APIs have rate limits - wait and retry
- Check console logs for specific error messages

### Development

**Running tests:**
```bash
# Frontend
pnpm test

# Backend
cd agents
pytest
```

**Code formatting:**
```bash
# Frontend
pnpm lint

# Backend
cd agents
black .
```

### Project Structure

```
MoleculeInsight/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── analysis/          # Analysis page
├── components/            # React components
│   ├── analysis/         # Analysis-specific components
│   └── ui/               # Reusable UI components
├── agents/               # Python backend
│   ├── Agent-workers/   # Individual agent modules
│   ├── main.py         # FastAPI server
│   └── requirements.txt
└── public/              # Static assets
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### License

See LICENSE file for details.

### Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@moleculeinsight.com
