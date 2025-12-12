import os
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


def get_competitors(molecule):
    url = "https://api.fda.gov/drug/ndc.json"
    params = {"search": f"active_ingredients.name:{molecule}", "limit": 50}

    try:
        res = requests.get(url, params=params).json()
        results = res.get("results", [])
        companies = {item.get("labeler_name") for item in results if "labeler_name" in item}

        return list(companies)[:5]  # return top 5 competitors
    except:
        return []


def get_clinical_trial_trends(molecule):
    url = "https://clinicaltrials.gov/api/query/study_fields"
    params = {
        "expr": molecule,
        "fields": "StartDate",
        "min_rnk": 1,
        "max_rnk": 500,
        "fmt": "json",
    }

    try:
        res = requests.get(url, params=params).json()
        studies = res["StudyFieldsResponse"]["StudyFields"]

        year_count = {}

        for s in studies:
            if "StartDate" in s and s["StartDate"]:
                date_str = s["StartDate"][0]
                year = date_str.split("-")[0]
                year_count[year] = year_count.get(year, 0) + 1

        # Make sorted trend table
        trend_table = [{"year": y, "trials": year_count[y]} for y in sorted(year_count)]
        return trend_table
    except:
        return []


def get_trade_data():
    # HS code 300490 = medicine exports (generic)
    url = "https://comtrade.un.org/api/get"
    params = {
        "max": 50,
        "type": "C",
        "freq": "A",
        "px": "HS",
        "ps": "2022",
        "r": "all",
        "p": "0",
        "rg": "2",
        "cc": "300490",
    }

    try:
        res = requests.get(url, params=params).json()
        if "dataset" in res:
            total_trade = sum(item.get("TradeValue", 0) for item in res["dataset"])
            return total_trade
        return 0
    except:
        return 0


def get_company_financials(companies):
    financials = {}

    for company in companies:
        try:
            ticker = yf.Ticker(company)
            revenue = ticker.fast_info.get("last_price")
            financials[company] = revenue
        except:
            financials[company] = None

    return financials


def get_research_trend(molecule):
    url = f"https://api.semanticscholar.org/graph/v1/paper/search"
    params = {"query": molecule, "limit": 100}

    try:
        res = requests.get(url, params=params).json()
        papers = res.get("data", [])
        years = {}

        for p in papers:
            year = p.get("year")
            if year:
import os
import requests
import yfinance as yf
from datetime import datetime
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
import sys

load_dotenv()

# GEMINI API KEY
os.environ["GOOGLE_API_KEY"] = os.getenv("BIKRAM_GEMINI_API_KEY1")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)


def get_competitors(molecule):
    url = "https://api.fda.gov/drug/ndc.json"
    params = {"search": f"active_ingredients.name:{molecule}", "limit": 50}

    try:
        res = requests.get(url, params=params).json()
        results = res.get("results", [])
        companies = {item.get("labeler_name") for item in results if "labeler_name" in item}

        return list(companies)[:5]  # return top 5 competitors
    except:
        return []


def get_clinical_trial_trends(molecule):
    url = "https://clinicaltrials.gov/api/query/study_fields"
    params = {
        "expr": molecule,
        "fields": "StartDate",
        "min_rnk": 1,
        "max_rnk": 500,
        "fmt": "json",
    }

    try:
        res = requests.get(url, params=params).json()
        studies = res["StudyFieldsResponse"]["StudyFields"]

        year_count = {}

        for s in studies:
            if "StartDate" in s and s["StartDate"]:
                date_str = s["StartDate"][0]
                year = date_str.split("-")[0]
                year_count[year] = year_count.get(year, 0) + 1

        # Make sorted trend table
        trend_table = [{"year": y, "trials": year_count[y]} for y in sorted(year_count)]
        return trend_table
    except:
        return []


def get_trade_data():
    # HS code 300490 = medicine exports (generic)
    url = "https://comtrade.un.org/api/get"
    params = {
        "max": 50,
        "type": "C",
        "freq": "A",
        "px": "HS",
        "ps": "2022",
        "r": "all",
        "p": "0",
        "rg": "2",
        "cc": "300490",
    }

    try:
        res = requests.get(url, params=params).json()
        if "dataset" in res:
            total_trade = sum(item.get("TradeValue", 0) for item in res["dataset"])
            return total_trade
        return 0
    except:
        return 0


def get_company_financials(companies):
    financials = {}

    for company in companies:
        try:
            ticker = yf.Ticker(company)
            revenue = ticker.fast_info.get("last_price")
            financials[company] = revenue
        except:
            financials[company] = None

    return financials


def get_research_trend(molecule):
    url = f"https://api.semanticscholar.org/graph/v1/paper/search"
    params = {"query": molecule, "limit": 100}

    try:
        res = requests.get(url, params=params).json()
        papers = res.get("data", [])
        years = {}

        for p in papers:
            year = p.get("year")
            if year:
                years[year] = years.get(year, 0) + 1

        return years
    except:
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

def generate_final_report(molecule):
    print(f"Generating IQVIA Market Insights for {molecule} using RAG...")
    
    query = f"""
    Generate an IQVIA Market Insights report for {molecule} using the knowledge base.
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
        response = rag_query(query)
        report = response.get("answer", "No answer.")
    except Exception as e:
        print(f"RAG Error: {e}")
        report = "Error retrieving market insights."
        
    return report



if __name__ == "__main__":
    print("Running IQVIA Agent...\n")
    result = generate_final_report("Atorvastatin")
    print(result)