import os
import requests
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# Gemini API Key
os.environ["GOOGLE_API_KEY"] = os.getenv("BIKRAM_GEMINI_API_KEY2")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)


def fetch_patents(molecule):
    url = "https://api.patentsview.org/patents/query"

    query = {
        "q": {
            "_text_any": {
                "patent_title": molecule
            }
        },
        "f": [
            "patent_title",
            "patent_date",
            "cpcs.cpc_subsection_id",
            "assignees.assignee_organization",
            "assignees.assignee_country",
            "inventors.inventor_country",
            "patent_id"
        ],
        "o": {"per_page": 200}
    }

    try:
        response = requests.post(url, json=query).json()
        return response.get("patents", [])
    except:
        return []


def analyze_patents(patents):
    assignee_count = {}
    country_count = {}
    cpc_count = {}
    year_count = {}

    titles = []

    for p in patents:
        # -------- Titles --------
        if "patent_title" in p:
            titles.append(p["patent_title"])

        # -------- Filing Year --------
        if "patent_date" in p:
            year = p["patent_date"].split("-")[0]
            year_count[year] = year_count.get(year, 0) + 1

        # -------- Assignees --------
        if "assignees" in p:
            for a in p["assignees"]:
                org = a.get("assignee_organization", "Unknown")
                assignee_count[org] = assignee_count.get(org, 0) + 1

                country = a.get("assignee_country", "Unknown")
                country_count[country] = country_count.get(country, 0) + 1

        # -------- CPC Codes --------
        if "cpcs" in p:
            for c in p["cpcs"]:
                code = c.get("cpc_subsection_id", "Unknown")
                cpc_count[code] = cpc_count.get(code, 0) + 1

    return {
        "total_patents": len(patents),
        "assignee_count": assignee_count,
        "country_count": country_count,
        "cpc_count": cpc_count,
        "year_count": year_count,
        "titles": titles[:10],   # top 10 titles
    }


def generate_patent_report(molecule, data):
    prompt = f"""
You are the Patent Intelligence Agent.

Below is real patent data for molecule: {molecule}

=== TOTAL PATENTS ===
{data['total_patents']}

=== TOP ASSIGNEES ===
{data['assignee_count']}

=== COUNTRY DISTRIBUTION ===
{data['country_count']}

=== CPC TECHNOLOGY CLASSES ===
{data['cpc_count']}

=== YEARWISE PATENT TREND ===
{data['year_count']}

=== SAMPLE TITLES ===
{data['titles']}

Generate a structured Patent Intelligence Report including:

1. Total patent count
2. Top assignees + short interpretation
3. Top 5 inventor countries
4. CPC classification: which technologies dominate
5. A markdown table of “Year vs Patents”
6. Insights into filing trends (rising or falling)
7. 80–120 word Patent Landscape Summary

Use only the provided data. Do NOT hallucinate missing numbers.
"""

    return llm.invoke(prompt).content


def run_patent_agent(molecule):
    print(f"Fetching patents for {molecule}...")
    patents = fetch_patents(molecule)
    analyzed = analyze_patents(patents)
    report = generate_patent_report(molecule, analyzed)
    return report

