"""
Agent Orchestrator
Coordinates all worker agents and returns structured results
"""
import sys
import os
from typing import Dict, Any, Optional

# Add the parent directory to the path to import agent workers
import importlib.util

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
agents_dir = os.path.join(parent_dir, "Agent-workers")

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
report_agent = load_agent_module("report_generator_agent", "report_generator_agent.py")

# Extract functions
run_clinical_trials_agent = clinical_agent.run_clinical_trials_agent
run_exim_agent = exim_agent.run_exim_agent
run_iqvia_agent = iqvia_agent.generate_final_report
run_patent_agent = patent_agent.run_patent_agent
run_web_intel_agent = web_agent.run_web_intel_agent
run_report_generator = report_agent.run_report_generator


class AgentOrchestrator:
    """
    Orchestrates multiple agents to analyze a molecule
    """
    
    def __init__(self):
        self.agents_status = {}
    
    def run_analysis(
        self, 
        molecule: str, 
        query: str = "", 
        geography: str = "Global"
    ) -> Dict[str, Any]:
        """
        Run complete analysis using all agents
        
        Args:
            molecule: Name of the molecule to analyze
            query: User's query
            geography: Geographic region of interest
            
        Returns:
            Dictionary containing all agent results
        """
        
        results = {
            "molecule": molecule,
            "query": query,
            "geography": geography,
            "agents": {}
        }
        
        print(f"\n{'='*60}")
        print(f"Starting analysis for: {molecule}")
        print(f"{'='*60}\n")
        
        # 1. IQVIA Market Insights Agent
        print("[1/5] Running IQVIA Market Insights Agent...")
        try:
            iqvia_report = run_iqvia_agent(molecule)
            results["agents"]["iqvia"] = {
                "status": "success",
                "report": iqvia_report
            }
            print("✓ IQVIA Agent completed successfully")
        except Exception as e:
            print(f"✗ IQVIA Agent failed: {str(e)}")
            results["agents"]["iqvia"] = {
                "status": "error",
                "error": str(e)
            }
        
        # 2. Clinical Trials Agent
        print("\n[2/5] Running Clinical Trials Agent...")
        try:
            clinical_report = run_clinical_trials_agent(molecule)
            results["agents"]["clinical_trials"] = {
                "status": "success",
                "report": clinical_report
            }
            print("✓ Clinical Trials Agent completed successfully")
        except Exception as e:
            print(f"✗ Clinical Trials Agent failed: {str(e)}")
            results["agents"]["clinical_trials"] = {
                "status": "error",
                "error": str(e)
            }
        
        # 3. Patent Agent
        print("\n[3/5] Running Patent Intelligence Agent...")
        try:
            patent_report = run_patent_agent(molecule)
            results["agents"]["patents"] = {
                "status": "success",
                "report": patent_report
            }
            print("✓ Patent Agent completed successfully")
        except Exception as e:
            print(f"✗ Patent Agent failed: {str(e)}")
            results["agents"]["patents"] = {
                "status": "error",
                "error": str(e)
            }
        
        # 4. EXIM Trade Agent
        print("\n[4/5] Running EXIM Trade Agent...")
        try:
            # Using HS code 300490 for medicaments
            exim_report = run_exim_agent(
                molecule=molecule,
                hs_code="300490",
                years=[2020, 2021, 2022, 2023]
            )
            results["agents"]["exim"] = {
                "status": "success",
                "report": exim_report
            }
            print("✓ EXIM Trade Agent completed successfully")
        except Exception as e:
            print(f"✗ EXIM Trade Agent failed: {str(e)}")
            results["agents"]["exim"] = {
                "status": "error",
                "error": str(e)
            }
        
        # 5. Web Intelligence Agent
        print("\n[5/5] Running Web Intelligence Agent...")
        try:
            web_report = run_web_intel_agent(molecule, page_size=20)
            results["agents"]["web_intel"] = {
                "status": "success",
                "report": web_report
            }
            print("✓ Web Intelligence Agent completed successfully")
        except Exception as e:
            print(f"✗ Web Intelligence Agent failed: {str(e)}")
            results["agents"]["web_intel"] = {
                "status": "error",
                "error": str(e)
            }
        
        # 6. Generate Final Report
        print("\n[6/6] Generating consolidated report...")
        try:
            # Extract data for report generator
            market_data = results["agents"].get("iqvia", {}).get("report")
            clinical_data = results["agents"].get("clinical_trials", {}).get("report")
            patent_data = results["agents"].get("patents", {}).get("report")
            trade_data = results["agents"].get("exim", {}).get("report")
            news_data = results["agents"].get("web_intel", {}).get("report")
            
            final_report = run_report_generator(
                molecule_name=molecule,
                market_data={"report": market_data} if market_data else None,
                clinical_data={"report": clinical_data} if clinical_data else None,
                patent_data={"report": patent_data} if patent_data else None,
                trade_data={"report": trade_data} if trade_data else None,
                news_data={"report": news_data} if news_data else None,
                internal_data={"geography": geography, "query": query}
            )
            
            results["final_report"] = final_report
            print("✓ Report generation completed")
        except Exception as e:
            print(f"✗ Report generation failed: {str(e)}")
            results["final_report_error"] = str(e)
        
        print(f"\n{'='*60}")
        print("Analysis complete!")
        print(f"{'='*60}\n")
        
        return results


def main():
    """
    CLI interface for testing the orchestrator
    """
    import argparse
    
    parser = argparse.ArgumentParser(description="Run molecular analysis")
    parser.add_argument("molecule", type=str, help="Name of the molecule to analyze")
    parser.add_argument("--query", type=str, default="", help="User query")
    parser.add_argument("--geography", type=str, default="Global", help="Geography")
    
    args = parser.parse_args()
    
    orchestrator = AgentOrchestrator()
    results = orchestrator.run_analysis(
        molecule=args.molecule,
        query=args.query,
        geography=args.geography
    )
    
    # Print summary
    print("\n=== ANALYSIS SUMMARY ===")
    for agent_name, agent_data in results["agents"].items():
        status = agent_data.get("status", "unknown")
        print(f"{agent_name}: {status}")


if __name__ == "__main__":
    main()
