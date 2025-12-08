from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor
import json

# Import agent modules
import sys
import os
import importlib.util

# Add current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import agents from Agent-workers directory (handle hyphen in folder name)
agents_dir = os.path.join(current_dir, "Agent-workers")

# Helper function to load modules from hyphenated directory
def load_agent_module(module_name, file_name):
    file_path = os.path.join(agents_dir, file_name)
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module

# Load agent modules
clinical_agent = load_agent_module("clinical_trials_agent", "clinical_trials_agent.py")
exim_agent = load_agent_module("exim_trade_agent", "exim_trade_agent.py")
iqvia_agent = load_agent_module("iqvia_agent", "iqvia_agent.py")
patent_agent = load_agent_module("patent_agent", "patent_agent.py")
web_agent = load_agent_module("web_agent", "web_agent.py")

# Extract functions
run_clinical_trials_agent = clinical_agent.run_clinical_trials_agent
run_exim_agent = exim_agent.run_exim_agent
run_iqvia_agent = iqvia_agent.generate_final_report
run_patent_agent = patent_agent.run_patent_agent
run_web_intel_agent = web_agent.run_web_intel_agent

app = FastAPI(title="MoleculeInsight API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    query: str
    molecule: Optional[str] = None
    geography: Optional[str] = "Global"

class AgentUpdate(BaseModel):
    agent: str
    status: str
    message: str
    data: Optional[dict] = None

class AnalysisResponse(BaseModel):
    success: bool
    molecule: str
    results: dict
    updates: list

# Thread pool for running agents concurrently
executor = ThreadPoolExecutor(max_workers=6)

def safe_run_agent(agent_func, *args, **kwargs):
    """Wrapper to safely run agent and handle errors"""
    try:
        result = agent_func(*args, **kwargs)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e), "data": None}

@app.get("/")
async def root():
    return {"message": "MoleculeInsight API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_molecule(request: AnalysisRequest):
    """
    Main endpoint to analyze a molecule using all agents
    """
    molecule = request.molecule or extract_molecule_from_query(request.query)
    
    if not molecule:
        raise HTTPException(status_code=400, detail="Please provide a molecule name")
    
    updates = []
    
    # Step 1: Master Agent - Query Processing
    updates.append({
        "agent": "Master Agent",
        "status": "running",
        "message": f"Analyzing query for molecule: {molecule}",
        "data": None
    })
    
    # Run all agents concurrently
    loop = asyncio.get_event_loop()
    
    # IQVIA Agent
    updates.append({
        "agent": "IQVIA Insights Agent",
        "status": "running",
        "message": "Fetching market data and insights...",
        "data": None
    })
    iqvia_future = loop.run_in_executor(executor, safe_run_agent, run_iqvia_agent, molecule)
    
    # Clinical Trials Agent
    updates.append({
        "agent": "Clinical Trials Agent",
        "status": "running",
        "message": "Searching clinical trials database...",
        "data": None
    })
    clinical_future = loop.run_in_executor(executor, safe_run_agent, run_clinical_trials_agent, molecule)
    
    # Patent Agent
    updates.append({
        "agent": "Patent Agent",
        "status": "running",
        "message": "Analyzing patent landscape...",
        "data": None
    })
    patent_future = loop.run_in_executor(executor, safe_run_agent, run_patent_agent, molecule)
    
    # EXIM Trade Agent
    updates.append({
        "agent": "EXIM Agent",
        "status": "running",
        "message": "Checking export/import opportunities...",
        "data": None
    })
    # HS code 300490 for medicaments - you can make this configurable
    exim_future = loop.run_in_executor(
        executor, 
        safe_run_agent, 
        run_exim_agent, 
        molecule, 
        "300490", 
        [2020, 2021, 2022, 2023]
    )
    
    # Web Intelligence Agent
    updates.append({
        "agent": "Web Intelligence Agent",
        "status": "running",
        "message": "Gathering web insights and news...",
        "data": None
    })
    web_future = loop.run_in_executor(executor, safe_run_agent, run_web_intel_agent, molecule, 20)
    
    # Wait for all agents to complete
    iqvia_result = await iqvia_future
    clinical_result = await clinical_future
    patent_result = await patent_future
    exim_result = await exim_future
    web_result = await web_future
    
    # Update statuses
    updates.append({
        "agent": "Master Agent",
        "status": "completed",
        "message": "All agents completed analysis",
        "data": None
    })
    
    # Compile results
    results = {
        "molecule": molecule,
        "geography": request.geography,
        "iqvia": {
            "success": iqvia_result["success"],
            "report": iqvia_result["data"] if iqvia_result["success"] else None,
            "error": iqvia_result.get("error")
        },
        "clinical_trials": {
            "success": clinical_result["success"],
            "report": clinical_result["data"] if clinical_result["success"] else None,
            "error": clinical_result.get("error")
        },
        "patents": {
            "success": patent_result["success"],
            "report": patent_result["data"] if patent_result["success"] else None,
            "error": patent_result.get("error")
        },
        "exim": {
            "success": exim_result["success"],
            "report": exim_result["data"] if exim_result["success"] else None,
            "error": exim_result.get("error")
        },
        "web_intel": {
            "success": web_result["success"],
            "report": web_result["data"] if web_result["success"] else None,
            "error": web_result.get("error")
        }
    }
    
    updates.append({
        "agent": "Report Generator Agent",
        "status": "completed",
        "message": "Analysis complete. Dashboard updated with insights.",
        "data": None
    })
    
    return AnalysisResponse(
        success=True,
        molecule=molecule,
        results=results,
        updates=updates
    )

def extract_molecule_from_query(query: str) -> str:
    """
    Simple extraction of molecule name from query
    In production, you could use NER or LLM for better extraction
    """
    # Look for common patterns
    keywords = ["molecule", "drug", "compound", "for"]
    query_lower = query.lower()
    
    # Try to extract molecule name after keywords
    for keyword in keywords:
        if keyword in query_lower:
            parts = query_lower.split(keyword)
            if len(parts) > 1:
                # Take first word after keyword
                potential_molecule = parts[1].strip().split()[0] if parts[1].strip() else ""
                if potential_molecule:
                    return potential_molecule.capitalize()
    
    # If no pattern found, return first capitalized word
    words = query.split()
    for word in words:
        if word[0].isupper() and len(word) > 3:
            return word
    
    return ""

if __name__ == "__main__":
    import uvicorn
    print("Starting MoleculeInsight FastAPI Server...")
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
