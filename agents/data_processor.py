"""
Data Processor for MoleculeInsight
Pre-processes and summarizes API data to reduce LLM token usage
"""

def summarize_clinical_trials(trials_data):
    """
    Process clinical trials data to extract only essential information
    Reduces data size by 80-90% before sending to LLM
    """
    if not trials_data:
        return {}
    
    summary = {
        "total_trials": len(trials_data),
        "phase_distribution": {},
        "status_distribution": {},
        "top_sponsors": {},
        "countries": {},
        "yearly_trend": {},
        "sample_trials": []
    }
    
    for trial in trials_data:
        # Phase
        phase = trial.get("Phase", ["Unknown"])[0]
        summary["phase_distribution"][phase] = summary["phase_distribution"].get(phase, 0) + 1
        
        # Status
        status = trial.get("OverallStatus", ["Unknown"])[0]
        summary["status_distribution"][status] = summary["status_distribution"].get(status, 0) + 1
        
        # Sponsor
        sponsor = trial.get("LeadSponsorName", ["Unknown"])[0]
        summary["top_sponsors"][sponsor] = summary["top_sponsors"].get(sponsor, 0) + 1
        
        # Year
        if "StartDate" in trial and trial["StartDate"]:
            year = trial["StartDate"][0].split("-")[0]
            summary["yearly_trend"][year] = summary["yearly_trend"].get(year, 0) + 1
        
        # Countries
        if "LocationCountry" in trial:
            for country in trial["LocationCountry"]:
                summary["countries"][country] = summary["countries"].get(country, 0) + 1
    
    # Keep only top 10 sponsors
    summary["top_sponsors"] = dict(sorted(
        summary["top_sponsors"].items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:10])
    
    # Keep only top 20 countries
    summary["countries"] = dict(sorted(
        summary["countries"].items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:20])
    
    # Keep 5 sample trials for context
    summary["sample_trials"] = [
        {
            "Phase": t.get("Phase", ["N/A"])[0],
            "Status": t.get("OverallStatus", ["N/A"])[0],
            "Sponsor": t.get("LeadSponsorName", ["N/A"])[0],
            "StartDate": t.get("StartDate", ["N/A"])[0]
        }
        for t in trials_data[:5]
    ]
    
    return summary


def summarize_patents(patents_data):
    """
    Process patent data to extract only essential information
    """
    if not patents_data:
        return {}
    
    summary = {
        "total_patents": len(patents_data),
        "assignees": {},
        "countries": {},
        "cpc_codes": {},
        "yearly_trend": {},
        "sample_titles": []
    }
    
    for patent in patents_data:
        # Year
        if "patent_date" in patent:
            year = patent["patent_date"].split("-")[0]
            summary["yearly_trend"][year] = summary["yearly_trend"].get(year, 0) + 1
        
        # Assignees
        if "assignees" in patent:
            for assignee in patent["assignees"]:
                org = assignee.get("assignee_organization", "Unknown")
                summary["assignees"][org] = summary["assignees"].get(org, 0) + 1
                
                country = assignee.get("assignee_country", "Unknown")
                summary["countries"][country] = summary["countries"].get(country, 0) + 1
        
        # CPC codes
        if "cpcs" in patent:
            for cpc in patent["cpcs"]:
                code = cpc.get("cpc_subsection_id", "Unknown")
                summary["cpc_codes"][code] = summary["cpc_codes"].get(code, 0) + 1
        
        # Sample titles
        if "patent_title" in patent and len(summary["sample_titles"]) < 10:
            summary["sample_titles"].append(patent["patent_title"])
    
    # Keep only top 10 for each category
    summary["assignees"] = dict(sorted(
        summary["assignees"].items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:10])
    
    summary["countries"] = dict(sorted(
        summary["countries"].items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:10])
    
    summary["cpc_codes"] = dict(sorted(
        summary["cpc_codes"].items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:10])
    
    return summary


def summarize_trade_data(trade_data):
    """
    Process trade data to extract only essential information
    """
    if not trade_data:
        return {}
    
    summary = {
        "total_records": len(trade_data),
        "yearly_imports": {},
        "yearly_exports": {},
        "top_exporters": {},
        "top_importers": {},
        "total_value": 0
    }
    
    for record in trade_data:
        year = record.get("yr")
        value = record.get("TradeValue", 0)
        flow = record.get("rgDesc", "").lower()
        reporter = record.get("rtTitle", "Unknown")
        
        summary["total_value"] += value
        
        if flow == "import":
            summary["yearly_imports"][str(year)] = summary["yearly_imports"].get(str(year), 0) + value
            summary["top_importers"][reporter] = summary["top_importers"].get(reporter, 0) + value
        elif flow == "export":
            summary["yearly_exports"][str(year)] = summary["yearly_exports"].get(str(year), 0) + value
            summary["top_exporters"][reporter] = summary["top_exporters"].get(reporter, 0) + value
    
    # Keep top 10
    summary["top_exporters"] = dict(sorted(
        summary["top_exporters"].items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:10])
    
    summary["top_importers"] = dict(sorted(
        summary["top_importers"].items(), 
        key=lambda x: x[1], 
        reverse=True
    )[:10])
    
    return summary


def summarize_news_articles(articles):
    """
    Process news articles to extract only essential information
    """
    if not articles:
        return {}
    
    summary = {
        "total_articles": len(articles),
        "sources": {},
        "recent_headlines": [],
        "date_range": {"earliest": None, "latest": None}
    }
    
    dates = []
    
    for article in articles[:20]:  # Only process first 20
        # Source
        source = article.get("source", {}).get("name", "Unknown")
        summary["sources"][source] = summary["sources"].get(source, 0) + 1
        
        # Headlines
        if len(summary["recent_headlines"]) < 10:
            summary["recent_headlines"].append({
                "title": article.get("title", "No title"),
                "source": source,
                "published": article.get("publishedAt", "Unknown"),
                "url": article.get("url", "")
            })
        
        # Dates
        if article.get("publishedAt"):
            dates.append(article["publishedAt"])
    
    if dates:
        summary["date_range"]["earliest"] = min(dates)
        summary["date_range"]["latest"] = max(dates)
    
    return summary


def estimate_token_reduction(original_size, processed_size):
    """Calculate token reduction percentage"""
    if original_size == 0:
        return 0
    reduction = ((original_size - processed_size) / original_size) * 100
    return round(reduction, 2)
