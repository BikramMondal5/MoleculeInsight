import os
import requests
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# Load Gemini API key (for LLM)
os.environ["GOOGLE_API_KEY"] = os.getenv("KANKAANNAA_GEMINI_API_KEY2")
# Load UN Comtrade public-v1 subscription key
COMTRADE_KEY = os.getenv("COMTRADE_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)

def fetch_trade_data(hs_code: str, years: list[int], reporter: str = "all", partner: str = "0"):
    """
    hs_code: HS commodity code (string), e.g. "300490"
    years: list of years (e.g. [2020, 2021, 2022, 2023])
    reporter: reporter country code or "all"
    partner: partner country code or "0" for world
    Returns list of trade data entries (dicts)
    """
    all_data = []
    headers = {}
    if COMTRADE_KEY:
        headers["Ocp-Apim-Subscription-Key"] = COMTRADE_KEY

    for year in years:
        url = "https://comtrade.un.org/api/get"
        params = {
            "type": "C",
            "freq": "A",
            "px": "HS",
            "ps": year,
            "r": reporter,
            "p": partner,
            "rg": "1,2",       # 1 = Import, 2 = Export
            "cc": hs_code,
            "fmt": "json"
        }
        try:
            resp = requests.get(url, params=params, headers=headers)
            resp.raise_for_status()
            data = resp.json().get("dataset", [])
            all_data.extend(data)
        except Exception as e:
            print(f"[WARN] Error fetching data for year {year}: {e}")

    return all_data

# ----------------------------------------
# 2️⃣ Analyze trade data
# ----------------------------------------
def analyze_trade(trades):
    yearly = {}
    exporters = {}
    importers = {}
    total_value = 0.0

    for d in trades:
        year = d.get("yr")
        trade_value = d.get("TradeValue", 0)
        flow = d.get("rgDesc", "").lower()  # “Import” or “Export”
        reporter = d.get("rtTitle", "Unknown")
        # partner = d.get("ptTitle", "Unknown")  # not used currently

        if year not in yearly:
            yearly[year] = {"import": 0.0, "export": 0.0}

        if flow == "import":
            yearly[year]["import"] += trade_value
            importers[reporter] = importers.get(reporter, 0.0) + trade_value
        elif flow == "export":
            yearly[year]["export"] += trade_value
            exporters[reporter] = exporters.get(reporter, 0.0) + trade_value

        total_value += trade_value

    return {
        "yearly_trade": yearly,
        "top_exporters": exporters,
        "top_importers": importers,
        "total_trade_value": total_value
    }

# ----------------------------------------
# 3️⃣ Generate human-friendly trade report via LLM
# ----------------------------------------
def generate_trade_report(hs_code: str, molecule_name: str, trade_data):
    prompt = f"""
You are the EXIM Trade Intelligence Agent.

Molecule / Drug (or class): **{molecule_name}**  
HS Code used for query: **{hs_code}**

Here is the real trade data fetched from UN Comtrade (import/export values in USD):

Year-wise trade data (Import & Export):
{trade_data['yearly_trade']}

Top exporting countries:
{trade_data['top_exporters']}

Top importing countries:
{trade_data['top_importers']}

Total trade value across selected years: {trade_data['total_trade_value']}

Based on this data, provide:

1. A summary of global demand and supply signals for this drug (or drug class).  
2. Top 5 potential import-market countries (demand hotspots).  
3. Top 5 major exporting countries (supply sources).  
4. Trend analysis: is trade growing, declining, or stable over time?  
5. Risk or opportunity flags (e.g. heavy reliance on one exporter, volatile import growth).  
6. Present results in clean markdown format.

Do not hallucinate — only use the provided data.
"""
    return llm.invoke(prompt).content

# ----------------------------------------
# 4️⃣ Main function
# ----------------------------------------
def run_exim_agent(molecule: str, hs_code: str, years: list[int]):
    print(f"Fetching trade data for HS code {hs_code} (Molecule/Drug: {molecule}) ...")
    trades = fetch_trade_data(hs_code, years)
    analysis = analyze_trade(trades)
    report = generate_trade_report(hs_code, molecule, analysis)
    return report

# ----------------------------------------
# Example usage / test
if __name__ == "__main__":
    # Example: HS code 300490 (medicaments under HS-3004)
    print(run_exim_agent("Medicaments (HS 300490)", "300490", [2020, 2021, 2022, 2023]))
