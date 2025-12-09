import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("ARIJIT_GEMINI_API_KEY2")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)

def run_internal_knowledge_agent(molecule: str, query: str = ""):
    """
    Internal Knowledge Agent - generates insights based on internal knowledge base
    """
    print(f"[Internal Knowledge Agent] Analyzing {molecule}...")
    
    prompt = f"""
You are the Internal Knowledge Agent with access to proprietary pharmaceutical knowledge.

Molecule: {molecule}
Query Context: {query if query else "General analysis"}

Based on internal pharmaceutical knowledge, provide:

1. **Molecular Properties Overview** (3-4 key properties)
2. **Known Therapeutic Applications** (primary and secondary uses)
3. **Competitive Landscape** (similar molecules and positioning)
4. **Strategic Insights** (manufacturing, formulation, or regulatory considerations)
5. **Risk Factors** (potential challenges or concerns)

Format your response in clean markdown with clear sections.
Keep it factual, concise, and actionable (200-300 words total).
"""
    
    try:
        response = llm.invoke(prompt)
        print(f"[Internal Knowledge Agent] ✓ Complete")
        return response.content
    except Exception as e:
        print(f"[Internal Knowledge Agent] ✗ Error: {e}")
        return f"Error generating internal knowledge report: {str(e)}"


if __name__ == "__main__":
    report = run_internal_knowledge_agent("Ibuprofen", "Anti-inflammatory properties")
    print(report)