import os
import sys
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

# Set key specifically for running direct LLM if needed, though we use RAG mostly now.
os.environ["GOOGLE_API_KEY"] = os.getenv("ARIJIT_GEMINI_API_KEY2")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)

# Add RAG module to path
rag_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "RAG")
sys.path.append(rag_path)

try:
    from app.rag import rag_query
    # RAG module handles configuration per request
except ImportError as e:
    print(f"[Error] Could not import RAG system: {e}")

def run_internal_knowledge_agent(molecule: str, query: str = ""):
    """
    Internal Knowledge Agent - generates insights based on internal knowledge base
    """
    print(f"[Internal Knowledge Agent] Analyzing {molecule} using RAG...")
    
    agent_key = os.getenv("ARIJIT_GEMINI_API_KEY2")
    
    rag_q = f"""
    Internal Knowledge Query:
    Molecule: {molecule}
    Context: {query if query else "General Overview"}
    
    Using the knowledge base, provide:
    1. Molecular properties
    2. Therapeutic applications
    3. Competitive positioning
    4. Strategic insights
    5. Risks
    """
    
    try:
        response = rag_query(rag_q, api_key=agent_key)
        print(f"[Internal Knowledge Agent] ✓ Complete")
        return response.get("answer", "No answer.")
    except Exception as e:
        print(f"[Internal Knowledge Agent] ✗ Error: {e}")
        return f"Error retrieving internal knowledge: {str(e)}"


if __name__ == "__main__":
    report = run_internal_knowledge_agent("Ibuprofen", "Anti-inflammatory properties")
    print(report)