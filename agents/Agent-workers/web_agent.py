import os
import sys
import requests
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# Load keys
os.environ["GOOGLE_API_KEY"] = os.getenv("KANKAANNAA_GEMINI_API_KEY3")
NEWS_API_KEY = os.getenv("NEWS_API_KEY") 

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)

# ----------------------------------------
# 1️⃣ Fetch news articles via NewsAPI
# ----------------------------------------
def fetch_news_articles(query: str, page_size: int = 20, language: str = "en"):
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "pageSize": page_size,
        "sortBy": "publishedAt",
        "language": language,
        "apiKey": NEWS_API_KEY
    }
    try:
        resp = requests.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()
        return data.get("articles", [])
    except Exception as e:
        print(f"[WARN] Error fetching news for query '{query}': {e}")
        return []

# ----------------------------------------
# 2️⃣ Generate report via LLM
# ----------------------------------------
def generate_news_report(target: str, articles: list[dict]):
    # Simplify article list for LLM prompt
    simplified = []
    for a in articles:
        simplified.append({
            "title": a.get("title"),
            "source": a.get("source", {}).get("name"),
            "publishedAt": a.get("publishedAt"),
            "url": a.get("url")
        })
    prompt = f"""
You are the Web Intelligence Agent.

You gathered the following recent news items related to: "{target}"

Here are the top {len(simplified)} items:
{simplified}

Please produce:

1. A 5-point “Recent News Highlights” — each with headline + 1-line summary  
2. A 100-150 word summary of what recent developments around this target mean (market, research, regulatory, competitors, etc.)  
3. A “Potential Impacts” section — what these news items could imply for market, patents, trials, demand, supply, or investor interest  

Output everything in clean markdown.
"""
    return llm.invoke(prompt).content

# ----------------------------------------
# 3️⃣ Main function
# ----------------------------------------
# Add RAG module to path
rag_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "RAG")
sys.path.append(rag_path)

try:
    from app.rag import rag_query
    # RAG module handles configuration per request
except ImportError as e:
    print(f"[Error] Could not import RAG system: {e}")

def run_web_intel_agent(target: str, page_size: int = 20, query: str = ""):
    print(f"Fetching web intelligence for: {target} using RAG...")
    
    agent_key = os.getenv("KANKAANNAA_GEMINI_API_KEY3")
    
    rag_q = f"""
    Generate a Web Intelligence report for {target} using the knowledge base.
    
    User Query Context: "{query}" (Address this specifically if relevant)
    
    Focus on recent news, developments, and articles.
    Include:
    1. Recent News Highlights (Headlines + Summaries)
    2. Strategic implications (Market, Regulatory, Competitors)
    3. Potential Impacts (Demand/Supply, Investors)
    """
    
    try:
        response = rag_query(rag_q, api_key=agent_key)
        report = response.get("answer", "No answer.")
    except Exception as e:
        print(f"RAG Error: {e}")
        report = "Error retrieving web intelligence."
        
    return report

# ----------------------------------------
# Quick test
if __name__ == "__main__":
    target = "Pembrolizumab"
    report = run_web_intel_agent(target, page_size=20)
    print(report)
