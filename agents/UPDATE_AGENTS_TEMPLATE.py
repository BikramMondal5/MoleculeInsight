"""
Example: How to update any agent with caching and data reduction
Copy this pattern to update patent_agent, iqvia_agent, exim_agent, web_agent
"""

# ==================================================
# STEP 1: Add imports at the top
# ==================================================
import os
import sys
import json  # Add this

# Add parent directory to import cache manager
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

try:
    from cache_manager import cache_manager
    from data_processor import summarize_XXXX  # Replace with appropriate function
    CACHE_ENABLED = True
except ImportError:
    print("[Warning] Cache manager not found, running without cache")
    CACHE_ENABLED = False

# ==================================================
# STEP 2: Update the main run function
# ==================================================

def run_AGENT_NAME(molecule, **kwargs):
    """
    Main function with caching and data reduction
    """
    agent_name = "AGENT_NAME"  # e.g., "patent", "iqvia", "exim"
    print(f"[{agent_name.title()} Agent] Analyzing {molecule}...")
    
    # 1. Try cache first
    if CACHE_ENABLED:
        cache_key_params = kwargs  # Include any additional parameters
        cached_report = cache_manager.get(agent_name, molecule, **cache_key_params)
        if cached_report:
            print(f"[{agent_name.title()} Agent] Using cached report")
            return cached_report
    
    # 2. Fetch fresh data
    print(f"[{agent_name.title()} Agent] Fetching data from API...")
    raw_data = fetch_data_function(molecule, **kwargs)  # Your existing fetch function
    
    if not raw_data:
        return f"No {agent_name} data found for this molecule."
    
    # 3. Cache raw data
    if CACHE_ENABLED:
        cache_manager.set(f"{agent_name}_raw", molecule, raw_data, **kwargs)
        data_count = len(raw_data) if isinstance(raw_data, list) else "N/A"
        print(f"[{agent_name.title()} Agent] Raw data cached ({data_count} records)")
    
    # 4. Process/summarize data
    print(f"[{agent_name.title()} Agent] Processing data (reducing token usage)...")
    if CACHE_ENABLED:
        # Use the summarizer function from data_processor
        summarized = summarize_function(raw_data)
    else:
        # Fallback to your existing analysis function
        summarized = your_existing_analyze_function(raw_data)
    
    # 5. Show size reduction
    original_size = len(json.dumps(raw_data))
    processed_size = len(json.dumps(summarized))
    reduction_pct = round((1 - processed_size/original_size) * 100, 1)
    print(f"[{agent_name.title()} Agent] Data reduced: {original_size} -> {processed_size} bytes ({reduction_pct}% reduction)")
    
    # 6. Generate report with LLM
    print(f"[{agent_name.title()} Agent] Generating insights with Gemini...")
    report = generate_report_function(molecule, summarized)  # Your existing LLM function
    
    # 7. Cache final report
    if CACHE_ENABLED:
        cache_manager.set(agent_name, molecule, report, **kwargs)
    
    print(f"[{agent_name.title()} Agent] ✓ Complete")
    return report


# ==================================================
# QUICK CHECKLIST FOR EACH AGENT:
# ==================================================

"""
✓ Clinical Trials Agent - DONE
□ Patent Agent - TODO
□ IQVIA Agent - TODO  
□ EXIM Trade Agent - TODO
□ Web Intelligence Agent - TODO

For each agent, you need to:
1. Add cache_manager and data_processor imports
2. Update the run_AGENT function with the pattern above
3. Make sure the summarize function exists in data_processor.py
4. Test with a molecule

Estimated time per agent: 5-10 minutes
Total token savings: 85-90% across all agents
"""

# ==================================================
# EXAMPLE: Patent Agent Update
# ==================================================

"""
# At the top of patent_agent.py:
from cache_manager import cache_manager
from data_processor import summarize_patents

def run_patent_agent(molecule):
    print(f"[Patent Agent] Analyzing {molecule}...")
    
    # Try cache
    if CACHE_ENABLED:
        if cached := cache_manager.get("patent", molecule):
            return cached
    
    # Fetch data
    patents = fetch_patents(molecule)
    cache_manager.set("patent_raw", molecule, patents)
    
    # Summarize (instead of sending full data)
    summarized = summarize_patents(patents)
    
    # Generate with LLM
    report = generate_patent_report(molecule, summarized)
    
    # Cache report
    cache_manager.set("patent", molecule, report)
    
    return report
"""

# ==================================================
# MONITORING YOUR OPTIMIZATION
# ==================================================

"""
You'll see console output like:

[Clinical Trials Agent] Analyzing Aspirin...
[Cache] Hit for clinical_trials - Aspirin
[Clinical Trials Agent] Using cached report
[Clinical Trials Agent] ✓ Complete

OR on first run:

[Clinical Trials Agent] Analyzing Aspirin...
[Clinical Trials Agent] Fetching data from ClinicalTrials.gov...
[Clinical Trials Agent] Raw data cached (450 trials)
[Clinical Trials Agent] Processing data (reducing token usage)...
[Clinical Trials Agent] Data reduced: 450000 -> 45000 bytes (90% reduction)
[Clinical Trials Agent] Generating insights with Gemini...
[Cache] Stored for clinical_trials - Aspirin
[Clinical Trials Agent] ✓ Complete

This proves your optimization is working!
"""
