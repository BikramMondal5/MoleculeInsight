from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Import agent modules
import sys
import os
import importlib.util

# Add current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import cache manager
from cache_manager import CacheManager

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
internal_agent = load_agent_module("internal_knowledge_agent", "internal_knowledge_agent.py")
innovation_agent = load_agent_module("innovation_strategy_agent", "innovation_strategy_agent.py")

# Extract functions
run_clinical_trials_agent = clinical_agent.run_clinical_trials_agent
run_exim_agent = exim_agent.run_exim_agent
run_iqvia_agent = iqvia_agent.generate_final_report
run_patent_agent = patent_agent.run_patent_agent
run_web_intel_agent = web_agent.run_web_intel_agent
run_internal_knowledge_agent = internal_agent.run_internal_knowledge_agent
run_innovation_strategy_agent = innovation_agent.run_innovation_strategy_agent

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

# Initialize cache manager
cache_manager = CacheManager(
    cache_dir=os.path.join(current_dir, "cache"),
    default_expiry_hours=168  # 7 days
)

def safe_run_agent(agent_func, *args, **kwargs):
    """Wrapper to safely run agent and handle errors"""
    try:
        result = agent_func(*args, **kwargs)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e), "data": None}

def safe_run_agent_with_cache(agent_name, agent_func, molecule, query, *args, **kwargs):
    """Wrapper to run agent with caching support"""
    # Try to get from cache
    cache_key_params = {"query": query}
    if args:
        cache_key_params["args"] = str(args)
    if kwargs:
        cache_key_params["kwargs"] = str(kwargs)
    
    cached_data = cache_manager.get(agent_name, molecule, **cache_key_params)
    
    if cached_data is not None:
        print(f"[{agent_name}] Using cached response for {molecule}")
        return {"success": True, "data": cached_data, "cached": True}
    
    # Cache miss - run the agent
    print(f"[{agent_name}] Cache miss - running agent for {molecule}")
    try:
        result = agent_func(*args, **kwargs)
        # Store in cache
        cache_manager.set(agent_name, molecule, result, **cache_key_params)
        return {"success": True, "data": result, "cached": False}
    except Exception as e:
        return {"success": False, "error": str(e), "data": None, "cached": False}

@app.get("/")
async def root():
    return {"message": "MoleculeInsight API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_molecule(request: AnalysisRequest):
    """
    Main endpoint to analyze a molecule using all agents with caching support
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
    
    # IQVIA Agent - with caching
    updates.append({
        "agent": "IQVIA Insights Agent",
        "status": "running",
        "message": "Fetching market data and insights...",
        "data": None
    })
    iqvia_future = loop.run_in_executor(
        executor, 
        safe_run_agent_with_cache, 
        "IQVIA",
        run_iqvia_agent, 
        molecule, 
        request.query,
        molecule,
        request.query
    )
    
    # Clinical Trials Agent - with caching
    updates.append({
        "agent": "Clinical Trials Agent",
        "status": "running",
        "message": "Searching clinical trials database...",
        "data": None
    })
    clinical_future = loop.run_in_executor(
        executor, 
        safe_run_agent_with_cache,
        "ClinicalTrials",
        run_clinical_trials_agent, 
        molecule, 
        request.query,
        molecule,
        request.query
    )
    
    # Patent Agent - with caching
    updates.append({
        "agent": "Patent Agent",
        "status": "running",
        "message": "Analyzing patent landscape...",
        "data": None
    })
    patent_future = loop.run_in_executor(
        executor,
        safe_run_agent_with_cache,
        "Patent",
        run_patent_agent,
        molecule,
        request.query,
        molecule,
        request.query
    )
    
    # EXIM Trade Agent - with caching
    updates.append({
        "agent": "EXIM Agent",
        "status": "running",
        "message": "Checking export/import opportunities...",
        "data": None
    })
    exim_future = loop.run_in_executor(
        executor, 
        safe_run_agent_with_cache,
        "EXIM",
        run_exim_agent, 
        molecule,
        request.query,
        molecule, 
        "300490", 
        [2020, 2021, 2022, 2023],
        request.query
    )
    
    # Web Intelligence Agent - with caching
    updates.append({
        "agent": "Web Intelligence Agent",
        "status": "running",
        "message": "Gathering web insights and news...",
        "data": None
    })
    web_future = loop.run_in_executor(
        executor,
        safe_run_agent_with_cache,
        "WebIntelligence",
        run_web_intel_agent,
        molecule,
        request.query,
        molecule,
        20,
        request.query
    )

    # Internal Knowledge Agent - with caching
    updates.append({
        "agent": "Internal Knowledge Agent",
        "status": "running",
        "message": "Analyzing internal knowledge base...",
        "data": None
    })
    internal_future = loop.run_in_executor(
        executor, 
        safe_run_agent_with_cache,
        "InternalKnowledge",
        run_internal_knowledge_agent,
        molecule,
        request.query,
        molecule,
        request.query
    )
    
    # Wait for all agents to complete
    iqvia_result = await iqvia_future
    clinical_result = await clinical_future
    patent_result = await patent_future
    exim_result = await exim_future
    web_result = await web_future
    internal_result = await internal_future

    # Innovation Strategy Agent - with caching
    updates.append({
        "agent": "Innovation Strategy Agent",
        "status": "running",
        "message": "Generating strategic innovation opportunities...",
        "data": None
    })
    
    # Create cache key for innovation agent based on all input data
    innovation_cache_params = {
        "query": request.query,
        "has_iqvia": iqvia_result.get("success", False),
        "has_clinical": clinical_result.get("success", False),
        "has_patent": patent_result.get("success", False),
        "has_exim": exim_result.get("success", False),
        "has_web": web_result.get("success", False),
        "has_internal": internal_result.get("success", False)
    }
    
    # Check cache for innovation strategy
    cached_innovation = cache_manager.get("InnovationStrategy", molecule, **innovation_cache_params)
    
    if cached_innovation is not None:
        print(f"[InnovationStrategy] Using cached response for {molecule}")
        innovation_result = {"success": True, "data": cached_innovation, "cached": True}
    else:
        print(f"[InnovationStrategy] Cache miss - running agent for {molecule}")
        innovation_future = loop.run_in_executor(
            executor,
            lambda: safe_run_agent(
                run_innovation_strategy_agent,
                molecule=molecule,
                market_data=iqvia_result.get("data") if iqvia_result.get("success") else None,
                clinical_data=clinical_result.get("data") if clinical_result.get("success") else None,
                patent_data=patent_result.get("data") if patent_result.get("success") else None,
                trade_data=exim_result.get("data") if exim_result.get("success") else None,
                web_data=web_result.get("data") if web_result.get("success") else None,
                internal_data=internal_result.get("data") if internal_result.get("success") else None
            )
        )
        innovation_result = await innovation_future
        
        # Store in cache if successful
        if innovation_result.get("success"):
            cache_manager.set("InnovationStrategy", molecule, innovation_result.get("data"), **innovation_cache_params)
        
    updates.append({
        "agent": "Innovation Strategy Agent",
        "status": "completed" if innovation_result.get("success") else "error",
        "message": "Strategic opportunities identified" if innovation_result.get("success") else "Failed to generate opportunities",
        "data": None
    })
    
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
        },
        "internal_knowledge": { 
            "success": internal_result["success"],
            "report": internal_result["data"] if internal_result["success"] else None,
            "error": internal_result.get("error")
        },
        "innovation_opportunities": {
        "success": innovation_result["success"],
        "report": innovation_result["data"] if innovation_result["success"] else None,
        "error": innovation_result.get("error")
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
    Extract molecule/drug name from query using improved pattern matching
    """
    import re
    
    print(f"[Extraction] Processing query: {query}")
    
    # Define skip words (expanded to include common query verbs)
    skip_words = {'Evaluate', 'Analysis', 'Study', 'Research', 'Report', 
                  'Clinical', 'The', 'This', 'That', 'What', 'Which', 
                  'Type', 'Managing', 'Diabetes', 'Assess', 'Efficacy',
                  'Safety', 'Profile', 'Treatment', 'Therapy', 'Explain',
                  'Discuss', 'Describe', 'Analyze', 'Compare', 'Review',
                  'Investigate', 'Explore', 'Examine', 'Detail', 'Provide'}
    
    words = query.split()
    candidates = []
    
    # Strategy 1: Common drug suffixes (highest priority)
    drug_suffixes = ['mab', 'nib', 'ine', 'cin', 'zole', 'pril', 'sartan', 
                     'statin', 'mycin', 'cillin', 'formin', 'parin', 'tinib']
    
    for word in words:
        clean_word = re.sub(r'[^\w]', '', word)
        if clean_word and any(clean_word.lower().endswith(suffix) for suffix in drug_suffixes):
            if len(clean_word) > 4:
                print(f"[Extraction] Found by suffix: {clean_word}")
                return clean_word.capitalize()
    
    # Strategy 2: Look for capitalized words (but collect all candidates)
    for word in words:
        clean_word = re.sub(r'[^\w]', '', word)
        
        if clean_word and len(clean_word) > 4 and clean_word[0].isupper():
            if clean_word not in skip_words:
                candidates.append(clean_word)
    
    # Strategy 3: Prefer candidates that appear later in the query (likely the subject)
    # or candidates that are longer (more likely to be drug names)
    if candidates:
        # Sort by length (descending) - drug names tend to be longer
        candidates.sort(key=lambda x: len(x), reverse=True)
        molecule = candidates[0]
        print(f"[Extraction] Found molecule: {molecule}")
        return molecule
    
    # Strategy 4: Look after "of" keyword
    match = re.search(r'\bof\s+([A-Z][a-z]+)', query)
    if match:
        molecule = match.group(1)
        if len(molecule) > 4 and molecule not in skip_words:
            print(f"[Extraction] Found after 'of': {molecule}")
            return molecule
    
    print(f"[Extraction] ✗ Could not extract molecule")
    return ""

@app.get("/api/cache/info")
async def get_cache_info():
    """Get information about cached data"""
    try:
        info = cache_manager.get_cache_info()
        return {
            "success": True,
            "cache_count": len(info),
            "cache_items": info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching cache info: {str(e)}")

@app.post("/api/cache/clear")
async def clear_cache():
    """Clear all cache files"""
    try:
        count = cache_manager.clear_all()
        return {
            "success": True,
            "message": f"Cleared {count} cache files"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing cache: {str(e)}")

@app.post("/api/cache/clear-expired")
async def clear_expired_cache():
    """Clear only expired cache files"""
    try:
        count = cache_manager.clear_expired()
        return {
            "success": True,
            "message": f"Cleared {count} expired cache files"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing expired cache: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("Starting MoleculeInsight FastAPI Server...")
    print("API Documentation: http://localhost:8000/docs")
    print("Health Check: http://localhost:8000/health")
    print(f"Cache Directory: {cache_manager.cache_dir}")
    print(f"Cache Expiry: {cache_manager.default_expiry.days} days")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
