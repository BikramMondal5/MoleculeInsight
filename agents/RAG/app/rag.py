import google.generativeai as genai
from app.utils.embeddings import embed_query
from app.utils.vectorstore import query_vectorstore

# Initialize specific model for generation
# Global model removed to support per-request keys
# model = genai.GenerativeModel('gemini-2.5-flash')

def rag_query(query: str, api_key: str = None):
    """
    Performs RAG:
    1. Embed query
    2. Retrieve context
    3. Generate answer
    
    Args:
        query: potentially complex user query
        api_key: specific gemini api key for this agent
    """
    
    # Configure GENAI if key provided (Warning: Global effect in thread)
    if api_key:
        genai.configure(api_key=api_key)
    
    # 1. Embed Query
    # embed_query will use the currently configured global key
    query_emb = embed_query(query)
    
    # 2. Retrieve top 5 chunks
    results = query_vectorstore(query_emb, n_results=5)
    
    # Flatten results
    retrieved_chunks = results['documents'][0] if (results and results['documents']) else []
    
    if not retrieved_chunks:
        return {"answer": "I couldn't find any relevant information in the documents."}
        
    context_str = "\n\n".join(retrieved_chunks)
    
    # 3. Construct Prompt
    prompt = f"""
    Use ONLY the context below to answer the question.

    Context:
    {context_str}

    Query:
    {query}

    Answer:
    """
    
    # 4. Call Gemini
    try:
        # Instantiate model fresh each time or rely on configured default
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        answer_text = response.text
        return {"answer": answer_text}
    except Exception as e:
        print(f"Error generating answer: {e}")
        return {"error": str(e)}
