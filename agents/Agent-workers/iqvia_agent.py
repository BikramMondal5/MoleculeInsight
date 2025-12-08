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
                years[year] = years.get(year, 0) + 1

        return years
    except:
        return {}

def generate_final_report(molecule):
    competitors = get_competitors(molecule)
    trends = get_clinical_trial_trends(molecule)
    trade_value = get_trade_data()
    financials = get_company_financials(competitors)
    research_trend = get_research_trend(molecule)

    prompt = f"""
You are the IQVIA Market Insights Agent.

Here is REAL collected data for molecule: {molecule}

COMPETITORS:
{competitors}

CLINICAL TRIAL TREND TABLE (Year vs Trials):
{trends}

IMPORT/EXPORT TRADE VALUE:
{trade_value}

FINANCIAL SIGNALS (Yahoo Finance):
{financials}

RESEARCH ACTIVITY TREND (Semantic Scholar):
{research_trend}

Using ALL the above REAL data, generate:

1. **Top Competitors**  
2. **Market Drivers & Barriers**  
3. **Final Summary**

Make the output clean, structured, and factual based on patterns — do not hallucinate numbers not derivable from the data.
"""

    response = llm.invoke(prompt)
    return response.content



if __name__ == "__main__":
    print("Running IQVIA Agent...\n")
    result = generate_final_report("Atorvastatin")
    print(result)