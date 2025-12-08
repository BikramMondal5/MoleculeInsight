import os
import json
from datetime import datetime
from typing import Dict, Any, Optional

# Optional: install markdownify or similar if you want to convert HTML -> Markdown, or just save as .md
# pip install markdownify

REPORTS_DIR = "reports"

def ensure_reports_dir():
    if not os.path.exists(REPORTS_DIR):
        os.makedirs(REPORTS_DIR)

def aggregate_data(
    molecule_name: str,
    market_data: Optional[Dict[str, Any]] = None,
    clinical_data: Optional[Dict[str, Any]] = None,
    patent_data: Optional[Dict[str, Any]] = None,
    trade_data: Optional[Dict[str, Any]] = None,
    news_data: Optional[Dict[str, Any]] = None,
    internal_data: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Combine data from different agents into one unified dictionary.
    """
    aggregated = {
        "molecule": molecule_name,
        "generated_at": datetime.utcnow().isoformat(),
        "market": market_data,
        "clinical_trials": clinical_data,
        "patents": patent_data,
        "trade": trade_data,
        "news": news_data,
        "internal": internal_data
    }
    return aggregated

def build_markdown_report(agg: Dict[str, Any]) -> str:
    """
    Build a markdown-formatted report combining all available sections.
    """
    lines = []
    lines.append(f"# Molecule Report — {agg.get('molecule', 'UNKNOWN')}  ")
    lines.append(f"*Generated at:* {agg.get('generated_at')}  ")
    lines.append("\n---\n")

    # Market Data Section
    if agg.get("market"):
        lines.append("## Market Insights  ")
        lines.append("```json")
        lines.append(json.dumps(agg["market"], indent=2))
        lines.append("```")
        lines.append("\n")

    # Clinical Trials Section
    if agg.get("clinical_trials"):
        lines.append("## Clinical Trials Overview  ")
        lines.append("```json")
        lines.append(json.dumps(agg["clinical_trials"], indent=2))
        lines.append("```")
        lines.append("\n")

    # Patents Section
    if agg.get("patents"):
        lines.append("## Patent Landscape  ")
        lines.append("```json")
        lines.append(json.dumps(agg["patents"], indent=2))
        lines.append("```")
        lines.append("\n")

    # Trade / EXIM Section
    if agg.get("trade"):
        lines.append("## Trade & Market-Access / Export-Import Signals  ")
        lines.append("```json")
        lines.append(json.dumps(agg["trade"], indent=2))
        lines.append("```")
        lines.append("\n")

    # News Section
    if agg.get("news"):
        lines.append("## Recent News & Web Signals  ")
        lines.append("```json")
        lines.append(json.dumps(agg["news"], indent=2))
        lines.append("```")
        lines.append("\n")

    # Internal Knowledge / Additional Data Section
    if agg.get("internal"):
        lines.append("## Internal / Custom Insights  ")
        lines.append("```json")
        lines.append(json.dumps(agg["internal"], indent=2))
        lines.append("```")
        lines.append("\n")

    # Footer
    lines.append("---  ")
    lines.append("_End of report_")

    return "\n".join(lines)

def save_report_md(content: str, molecule_name: str):
    ensure_reports_dir()
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    filename = f"{REPORTS_DIR}/{molecule_name}_{timestamp}.md"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Report saved to: {filename}")

def run_report_generator(
    molecule_name: str,
    market_data: Optional[Dict[str, Any]],
    clinical_data: Optional[Dict[str, Any]],
    patent_data: Optional[Dict[str, Any]],
    trade_data: Optional[Dict[str, Any]],
    news_data: Optional[Dict[str, Any]],
    internal_data: Optional[Dict[str, Any]]
) -> str:
    """
    Aggregates inputs, builds report, prints to terminal and saves markdown.
    Returns the markdown string.
    """
    agg = aggregate_data(
        molecule_name,
        market_data,
        clinical_data,
        patent_data,
        trade_data,
        news_data,
        internal_data
    )
    md = build_markdown_report(agg)
    print(md)
    save_report_md(md, molecule_name)
    return md

# ======= Example usage =======
if __name__ == "__main__":
    # Example: you would get these dicts from your other agents:
    market = {"market_size_usd": "2.5B", "CAGR": "5%"}  # replace with real agent output
    clinical = {"total_trials": 123, "phase_breakdown": {"Phase 3": 40, "Phase 2": 50}}
    patent = {"total_patents": 12, "top_assignees": {"CompanyA": 5, "CompanyB": 3}}
    trade = {"yearly_trade": {2022: {"import": 1000000, "export": 500000}}}
    news = {"latest_headlines": ["Drug approved in EU", "New trial begins"]}
    internal = {"notes": "Confidential lab results summary"}

    run_report_generator(
        molecule_name="SampleDrug",
        market_data=market,
        clinical_data=clinical,
        patent_data=patent,
        trade_data=trade,
        news_data=news,
        internal_data=internal
    )
