import os
import sys
import requests
import yfinance as yf
from datetime import datetime
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# GEMINI API KEY
os.environ["GOOGLE_API_KEY"] = os.getenv("BIKRAM_GEMINI_API_KEY1")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)

# Helper functions for legacy/reference (optional, but keeping for safety if referenced elsewhere, though unlikely)
def get_competitors(molecule):
    return []

def get_clinical_trial_trends(molecule):
    return []

def get_trade_data():
    return 0

def get_company_financials(companies):
    return {}

def get_research_trend(molecule):
    return {}

# Add RAG module to path
rag_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "RAG")
sys.path.append(rag_path)

try:
    from app.rag import rag_query
    from app.config import GEMINI_API_KEY
    import google.generativeai as genai
    if GEMINI_API_KEY:
         genai.configure(api_key=GEMINI_API_KEY)
except ImportError as e:
    print(f"[Error] Could not import RAG system: {e}")

def generate_final_report(molecule, query: str = ""):
    print(f"Generating IQVIA Market Insights for {molecule} using RAG...")
    
    rag_q = f"""
    Generate an IQVIA Market Insights report for {molecule} using the knowledge base.
    
    User Query Context: "{query}" (Address this specifically if relevant)
    
    Integrate data from FDA mentions, Clinical Trials, Financial news, and Research papers.
    Include:
    1. Top Competitors (from FDA/news)
    2. Market Drivers & Barriers
    3. Clinical Trial Trends
    4. Financial Signals or Trade overview (if available)
    5. Research Activity Trend
    6. Final Strategic Summary
    """
    
    try:
        response = rag_query(rag_q)
        report = response.get("answer", "No answer.")
    except Exception as e:
        print(f"RAG Error: {e}")
        report = "Error retrieving market insights."
        
    return report

if __name__ == "__main__":
    print("Running IQVIA Agent...\n")
    result = generate_final_report("Atorvastatin")
    print(result)