import os
import requests
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# Load keys
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
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
def run_web_intel_agent(target: str, page_size: int = 20):
    print(f"Fetching news for: {target} …")
    articles = fetch_news_articles(target, page_size=page_size)
    if not articles:
        return f"No news articles found for \"{target}\"."
    report = generate_news_report(target, articles)
    return report

# ----------------------------------------
# Quick test
if __name__ == "__main__":
    target = "Pembrolizumab"
    report = run_web_intel_agent(target, page_size=20)
    print(report)
