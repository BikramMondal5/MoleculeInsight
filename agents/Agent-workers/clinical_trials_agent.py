import os
import sys
import requests
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# Add parent directory to import cache manager
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, parent_dir)

try:
    from cache_manager import cache_manager
    from data_processor import summarize_clinical_trials
    CACHE_ENABLED = True
except ImportError:
    print("[Warning] Cache manager not found, running without cache")
    CACHE_ENABLED = False

# LLM INITIALIZATION
os.environ["GOOGLE_API_KEY"] = os.getenv("KANKAANNAA_GEMINI_API_KEY1")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)


def fetch_trials(molecule):
    """Fetch trials using ClinicalTrials.gov API v2"""
    url = "https://clinicaltrials.gov/api/v2/studies"
    params = {
        "query.term": molecule,
        "pageSize": 500,  # max 1000
        "format": "json"
    }

    try:
        print(f"[Clinical Trials] Calling API v2 for '{molecule}'...")
        res = requests.get(url, params=params, timeout=30)
        res.raise_for_status()
        
        data = res.json()
        
        # New API structure
        if "studies" not in data:
            print(f"[Clinical Trials] ✗ Unexpected API response structure")
            print(f"[Clinical Trials] Response keys: {data.keys()}")
            return []
        
        # Convert new API format to match expected structure
        trials = []
        for study in data["studies"]:
            protocol = study.get("protocolSection", {})
            identification = protocol.get("identificationModule", {})
            status = protocol.get("statusModule", {})
            design = protocol.get("designModule", {})
            sponsor = protocol.get("sponsorCollaboratorsModule", {})
            locations = protocol.get("contactsLocationsModule", {})
            
            # Safely extract phases
            phases = design.get("phases", [])
            phase_value = phases[0] if phases else "Unknown"
            
            # Safely extract enrollment count
            enrollment_info = design.get("enrollmentInfo", {})
            enrollment_count = enrollment_info.get("count", 0)
            
            # Safely extract start date
            start_date_struct = status.get("startDateStruct", {})
            start_date = start_date_struct.get("date", "Unknown")
            
            trial = {
                "Phase": [phase_value],
                "OverallStatus": [status.get("overallStatus", "Unknown")],
                "StartDate": [start_date],
                "LeadSponsorName": [sponsor.get("leadSponsor", {}).get("name", "Unknown")],
                "EnrollmentCount": [str(enrollment_count)],
                "LocationCountry": []
            }
            
            # Extract countries
            if "locations" in locations:
                countries = set()
                for loc in locations["locations"]:
                    if "country" in loc:
                        countries.add(loc["country"])
                trial["LocationCountry"] = list(countries)
            
            trials.append(trial)
        
        print(f"[Clinical Trials] ✓ Found {len(trials)} trials")
        return trials
        
    except requests.exceptions.Timeout:
        print(f"[Clinical Trials] ✗ API timeout after 30 seconds")
        return []
    except requests.exceptions.RequestException as e:
        print(f"[Clinical Trials] ✗ API request failed: {e}")
        return []
    except (KeyError, ValueError, json.JSONDecodeError) as e:
        print(f"[Clinical Trials] ✗ Error parsing response: {e}")
        return []
    except Exception as e:
        print(f"[Clinical Trials] ✗ Unexpected error: {type(e).__name__}: {e}")
        return []


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


def run_clinical_trials_agent(molecule):
    """
    Main function with caching and data reduction
    """
    print(f"[Clinical Trials Agent] Analyzing {molecule}...")
    
    # Try to get from cache first
    if CACHE_ENABLED:
        cached_report = cache_manager.get("clinical_trials", molecule)
        if cached_report:
            print(f"[Clinical Trials Agent] Using cached report")
            return cached_report
    
    # Fetch fresh data
    print(f"[Clinical Trials Agent] Fetching data from ClinicalTrials.gov...")
    trials = fetch_trials(molecule)
    
    if not trials:
        return "No clinical trials data found for this molecule."
    
    # Save raw data to cache for reference
    if CACHE_ENABLED:
        cache_manager.set("clinical_trials_raw", molecule, trials)
        print(f"[Clinical Trials Agent] Raw data cached ({len(trials)} trials)")
    
    # Process data to reduce size (80-90% reduction)
    print(f"[Clinical Trials Agent] Processing data (reducing token usage)...")
    # Always use analyze_trials for consistent data structure
    analyzed_data = analyze_trials(trials)

    original_size = len(json.dumps(trials))
    processed_size = len(json.dumps(analyzed_data))
    print(f"[Clinical Trials Agent] Data reduced: {original_size} -> {processed_size} bytes ({round((1-processed_size/original_size)*100, 1)}% reduction)")

    # Generate report using processed data
    print(f"[Clinical Trials Agent] Generating insights with Gemini...")
    report = generate_clinical_report(molecule, analyzed_data)
    
    # Cache the final report
    if CACHE_ENABLED:
        cache_manager.set("clinical_trials", molecule, report)
    
    print(f"[Clinical Trials Agent] ✓ Complete")
    return report

