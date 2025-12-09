# 🔬🧬 MoleculeInsight – AI Agent Research Platform

![Preview Image](./public/MoleculeInsight-logo.png)

An AI-powered Agent platform for molecular research. MoleculeInsight uses specialized AI agents to explore market data, clinical trials, patents, trade signals, and web intelligence—giving you instant, research-grade insights for pharmaceutical and biotech opportunities. Let AI agents ⚡ work while you focus on strategic decisions.

## 🌟 Features

- 🤖 **Multi-Agent Architecture** – Coordinated AI agents working in parallel for faster insights
- ⚡ **Real-time Analysis** – Live agent status updates and progress tracking  
- 📊 **Comprehensive Data Sources** – IQVIA market data, ClinicalTrials.gov, PatentsView, UN Comtrade, and NewsAPI
- 📈 **Interactive Dashboard** – Beautiful visualizations and markdown reports at your fingertips
- 🎯 **Advanced Query Engine** – Powerful molecule-centric search and analysis
- 📥 **Export Capabilities** – Download PDF reports and archive analyses for future reference
- 🔗 **API-First Design** – Seamless integration with your existing workflows
- 🌍 **Global Coverage** – Access international pharmaceutical and biotech data

## 🛠️ Technologies Used

**Frontend:**
- Next.js 16 – Modern React framework
- React 19 – UI library
- TypeScript – Type-safe development
- Tailwind CSS – Responsive styling
- Shadcn UI – Beautiful component library
- Recharts – Data visualization

**Backend:**
- FastAPI – High-performance Python framework
- Python 3.9+ – Core language
- LangChain – AI agent framework
- Google Gemini AI – Advanced language model
- Multi-Agent Orchestrator – Parallel processing engine

## ⚙️ Installation

### Prerequisites
- Node.js 18+ with pnpm
- Python 3.9+
- API Keys: Gemini, UN Comtrade, NewsAPI

### Step-by-Step Setup

1. **Clone the repository:**
```bash
git clone https://github.com/BikramMondal5/MoleculeInsight.git
cd MoleculeInsight
```

2. **Install dependencies:**
```bash
pnpm install
cd agents
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
```

3. **Configure environment variables:**
```bash
create a .env file

# Gemini API: https://aistudio.google.com/api-keys
# UN Comtrade: https://comtradeplus.un.org/
# NewsAPI: https://newsapi.org/
```

4. **Start the application:**
```bash
# Terminal 1 - Backend
cd agents
.\venv\Scripts\Activate.ps1
python main.py

# Terminal 2 - Frontend
pnpm dev
```

5. **Access the application:**
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:8000

## 🚀 How to Use

1. ✨ **Navigate** to the `/analysis` page
2. 🔍 **Enter** your molecule query (e.g., "Analyze Aspirin for cardiovascular applications")
3. 📍 **Specify** optional molecule name and geography filters
4. ⚙️ **Click** "Run Agentic Analysis" to start the agents
5. 👀 **Watch** agents work in real-time with live progress updates
6. 📊 **Review** comprehensive results, insights, and visualizations in the dashboard
7. 💾 **Export** your analysis as PDF or archive for future reference

### Example Queries
- "What are the latest clinical trials for diabetes treatments in the US?"
- "Analyze patent landscape for gene therapy solutions"
- "Show trade trends and market opportunities for immunotherapy drugs"

## 🤝 Contribution

**Have ideas? Found a bug? 🐞 Want to contribute?**

We love contributions! Here's how to get started:

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
