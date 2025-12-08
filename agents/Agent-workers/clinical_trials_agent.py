import os
import requests
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# LLM INITIALIZATION
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)

# ====================================
# 1️⃣ Fetch clinical trials from API
# ====================================

def fetch_trials(molecule):
    url = "https://clinicaltrials.gov/api/query/study_fields"
    params = {
        "expr": molecule,
        "fields": "Phase,OverallStatus,StartDate,LocationCountry,LeadSponsorName,EnrollmentCount",
        "min_rnk": 1,
        "max_rnk": 500,   # retrieve up to 500 trials
        "fmt": "json",
    }

    try:
        res = requests.get(url, params=params).json()
        return res["StudyFieldsResponse"]["StudyFields"]
    except:
        return []


# ====================================
# 2️⃣ Process trials into categories
# ====================================

def analyze_trials(trials):
    phase_count = {}
    status_count = {}
    sponsor_count = {}
    year_count = {}
    country_count = {}
    enrollment_total = 0

    for t in trials:

        # ----- Phase -----
        phase = t.get("Phase", ["Unknown"])[0]
        phase_count[phase] = phase_count.get(phase, 0) + 1

        # ----- Status -----
        status = t.get("OverallStatus", ["Unknown"])[0]
        status_count[status] = status_count.get(status, 0) + 1

        # ----- Sponsor -----
        sponsor = t.get("LeadSponsorName", ["Unknown"])[0]
        sponsor_count[sponsor] = sponsor_count.get(sponsor, 0) + 1

        # ----- Start Date → Year -----
        if "StartDate" in t and t["StartDate"]:
            date_str = t["StartDate"][0]
            year = date_str.split("-")[0]
            year_count[year] = year_count.get(year, 0) + 1

        # ----- Country -----
        if "LocationCountry" in t:
            for country in t["LocationCountry"]:
                country_count[country] = country_count.get(country, 0) + 1

        # ----- Enrollment -----
        if "EnrollmentCount" in t:
            if t["EnrollmentCount"]:
                try:
                    enrollment_total += int(t["EnrollmentCount"][0])
                except:
                    pass

    return {
        "phase_count": phase_count,
        "status_count": status_count,
        "sponsor_count": sponsor_count,
        "year_count": year_count,
        "country_count": country_count,
        "enrollment_total": enrollment_total,
        "total_trials": len(trials),
    }


# ====================================
# 3️⃣ Generate Summary via Gemini
# ====================================

def generate_clinical_report(molecule, data):
    prompt = f"""
You are the Clinical Trials Intelligence Agent.

Below is REAL clinical trial data for molecule: **{molecule}**

=== TRIAL PHASE BREAKDOWN ===
{data['phase_count']}

=== TRIAL STATUS BREAKDOWN ===
{data['status_count']}

=== TOP SPONSORS ===
{data['sponsor_count']}

=== YEARWISE TREND (Start Dates) ===
{data['year_count']}

=== COUNTRY DISTRIBUTION ===
{data['country_count']}

=== TOTAL ENROLLMENT ===
{data['enrollment_total']}

=== TOTAL TRIALS ===
{data['total_trials']}

Using the real data above, generate a structured, factual Clinical Trials Report including:

1. Total trials
2. Phase distribution (Phase 1,2,3,4)
3. Status distribution (Recruiting, Completed etc.)
4. Top 5 sponsors + why they matter
5. A markdown Trend Table (Year vs Number of Trials)
6. Top countries conducting trials
7. Enrollment analysis
8. Clinical landscape summary (80–120 words)

DO NOT hallucinate numbers beyond the provided dataset.
"""

    response = llm.invoke(prompt)
    return response.content


# ====================================
# 4️⃣ Main function
# ====================================

def run_clinical_trials_agent(molecule):
    print(f"Fetching trials for {molecule}...")

    trials = fetch_trials(molecule)
    analyzed = analyze_trials(trials)
    report = generate_clinical_report(molecule, analyzed)

    return report


# ====================================
# 5️⃣ Test the agent
# ====================================

if __name__ == "__main__":
    result = run_clinical_trials_agent("Metformin")
    print(result)
