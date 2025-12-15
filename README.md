# 🔬🧬 MoleculeInsight – AI Agent Research Platform

![MoleculeInsight Logo](./public/MoleculeInsight-logo.png)

**MoleculeInsight** is an advanced AI-powered platform designed for comprehensive molecular research. By orchestrating a team of specialized AI agents, it aggregates and analyzes data from clinical trials, patents, global trade, market intelligence, and web sources. Using Retrieval-Augmented Generation (RAG), it also leverages internal knowledge bases to provide research-grade insights for pharmaceutical and biotech decision-making.

---

## 🌟 Key Features

- **🤖 Multi-Agent Orchestration** – A coordinated system of specialized agents running in parallel to gather diverse data points.
- **🧠 RAG-Powered Knowledge** – Integrated Retrieval-Augmented Generation (RAG) system that synthesizes internal JSON/PDF documents for context-aware answers.
- **🧬 3D Molecule Visualization** – Interactive 3D molecular structure viewer powered by PubChem API and 3Dmol.js:
  - Automatic CID (Compound ID) retrieval from molecule names
  - Real-time 3D structure rendering in SDF format
  - Interactive controls (drag to rotate, scroll to zoom)
  - Auto-rotation for enhanced visualization
- **📚 Wikipedia Integration** – Contextual molecule information using LangChain:
  - Comprehensive overview and background
  - Discovery history and scientific context
  - Seamlessly integrated with chemical properties
- **⚡ Real-time Analysis** – Live monitoring of agent activities and progress updates via WebSockets/polling.
- **📊 Comprehensive Data Sources**:
  - **Clinical Trials**: ClinicalTrials.gov data analysis.
  - **Patents**: Patent landscape from PatentsView.
  - **Trade Data**: Import/Export trends via UN Comtrade.
  - **Market Intel**: IQVIA and industry insights.
  - **Web Intelligence**: Real-time news and web search aggregation.
  - **Wikipedia**: Contextual information and molecule background.
  - **PubChem**: Chemical properties and 3D structures.
- **📈 Interactive Dashboard** – Rich visualizations using Recharts and Shadcn UI.
- **📝 Automated Reporting** – Generates detailed markdown and PDF reports of the analysis.

---

## �️ System Architecture

### Frontend (Next.js)
Built with modern web technologies for a responsive and premium experience:
- **Framework**: Next.js 16 (App Router)
- **UI Architecture**: React 19, Tailwind CSS
- **Components**: Shadcn UI, Radix Primitives
- **Visualization**: Recharts, Framer Motion

### Backend (Python/FastAPI)
A robust agentic backend powered by:
- **API**: FastAPI
- **AI Core**: Google Gemini AI (GenAI)
- **Orchestration**: Python `concurrent.futures` and `asyncio` for parallel agent execution.
- **RAG Engine**: ChromaDB for vector storage, supporting JSON/PDF ingestion.

### �️ Agent Workers
Located in `agents/Agent-workers/`, these specialized agents perform distinct tasks:
1. **Clinical Trials Agent**: Searches registry for trial phases and status.
2. **Patent Agent**: Analyzes IP landscape and patent filings.
3. **EXIM Trade Agent**: Tracks global trade flows (HS Codes).
4. **IQVIA Agent**: Simulates market intelligence gathering.
5. **Web Intelligence Agent**: Scrapes and summarizes latest web news.
6. **Internal Knowledge Agent**: Queries the local RAG system for proprietary data.
7. **Wikipedia Agent**: Fetches comprehensive molecule information and context from Wikipedia using LangChain.
8. **Innovation Strategy Agent**: Synthesizes all gathered data to propose strategic opportunities.

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js**: v18 or higher (using `pnpm`)
- **Python**: v3.9 or higher
- **API Keys**: Google Gemini, UN Comtrade, NewsAPI

### 1. Clone the Repository
```bash
git clone https://github.com/BikramMondal5/MoleculeInsight.git
cd MoleculeInsight
```

### 2. Backend Setup
The backend handles all AI agents and RAG logic.

```bash
cd agents
# Create a virtual environment
python -m venv venv

# Activate Virtual Environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
You need to configure environment variables for both the backend and frontend.

#### Backend (RAG system)
Create a `.env` file in `agents/RAG/.env` (yes, inside the RAG directory):

```env
GOOGLE_API_KEY=your_gemini_api_key_here
# Add other keys if required by specific agents (e.g., NEWS_API_KEY, COMTRADE_KEY)
```

#### Frontend (Next.js)
Create or update the `.env` file in the project root:

```env
NEXTAUTH_URL=http://localhost:3000
```
For production deployments (e.g., Vercel), set `NEXTAUTH_URL` to your deployed URL, e.g.:

```env
NEXTAUTH_URL=https://molecule-insight.vercel.app
```
Make sure to set this variable in your Vercel dashboard under Project Settings → Environment Variables.

### 4. RAG Knowledge Ingestion (Optional)
To populate the vector database with your internal JSON/PDF documents:
```bash
# Ensure you are still in the agents directory with venv activated
python RAG/ingest_all.py
```
This will process documents in `agents/RAG/KnowledgeBase/` and store embeddings in `agents/RAG/db/`.

### 5. Frontend Setup
Open a new terminal in the project root:

```bash
# Install dependencies
pnpm install
```

---

## 🚀 Running the Application

### Start the Backend
In your backend terminal (`agents/` directory):
```bash
python main.py
```
> The API will start at `http://localhost:8000`

### Start the Frontend
In your frontend terminal (root directory):
```bash
pnpm dev
```
> The web app will be available at `http://localhost:3000`

---

## 🚀 Deployment

For production deployment (e.g., Vercel), ensure you set all required environment variables in the Vercel dashboard, especially:

- `NEXTAUTH_URL=https://molecule-insight.vercel.app`

This ensures authentication and OAuth redirects work correctly in production.

## 🧭 How to Use

1. **Dashboard**: Navigate to `http://localhost:3000/analysis`.
2. **Search**: Enter a molecule name (e.g., "Aspirin", "Atorvastatin", "Pembrolizumab") or a research query.
3. **Filters**: Optionally specify geography or specific focus areas.
4. **Run Analysis**: Click "Run Agentic Analysis".
   - You will see cards for each agent lighting up as they work.
   - Real-time logs will appear in the "Live Agent Status" panel.
5. **Results**: Once complete, explore the tabbed reports for Clinical, Patents, Market, and more.
6. **Executive Summary**: Click the "Summary" button to view:
   - **Interactive 3D Molecule Viewer**: Rotate and zoom the molecular structure
   - **Wikipedia Context**: Comprehensive background and discovery information
   - **Chemical Properties**: Molecular formula, weight, and IUPAC name from PubChem
   - **Data Visualizations**: Charts showing agent accuracy and data coverage
7. **Export**: Download the comprehensive report as a PDF.

---

## 🎯 Executive Summary Features

The Executive Summary modal provides a comprehensive overview of the analyzed molecule with cutting-edge visualizations:

### 3D Molecular Visualization
- **PubChem Integration**: Automatically fetches 3D structures using the PubChem REST API
- **Interactive Viewer**: Built with 3Dmol.js for professional molecular rendering
- **Controls**: 
  - Drag to rotate the molecule
  - Scroll to zoom in/out
  - Auto-rotation for dynamic presentation
- **Format**: Renders SDF (Structure Data File) format with stick and sphere styles

### Wikipedia Context
- **LangChain Integration**: Uses WikipediaAPIWrapper for reliable data retrieval
- **Rich Content**: Displays comprehensive molecule overview and background
- **Markdown Rendering**: Properly formatted with ReactMarkdown for professional display
- **Smart Extraction**: Automatically fetches relevant information based on molecule name

### Chemical Properties (PubChem)
- **Molecular Formula**: Chemical composition
- **Molecular Weight**: Precise mass in g/mol
- **IUPAC Name**: Systematic chemical nomenclature

### Data Visualizations
- **Agent Accuracy Chart**: Donut chart showing data richness by source
- **Coverage Comparison**: Bar chart comparing data coverage across agents
- **Agent Status**: Real-time success/failure indicators for each agent

---

## 🤝 Contributing

Contributions are welcome! Please feel free to verify the `agents/Agent-workers` logic or add new data sources to the RAG pipeline.

---

## 📜 License

This project is licensed under the MIT License.
