from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import uvicorn

from app.ingest import ingest_json
from app.rag import rag_query

app = FastAPI(title="Gemini RAG System")

class IngestRequest(BaseModel):
    json_path: str

class QueryRequest(BaseModel):
    question: str

@app.post("/ingest")
async def ingest_endpoint(payload: IngestRequest):
    """
    Endpoint to ingest a JSON file.
    Payload example: { "json_path": "KnowledgeBase/sample.json" }
    """
    if not os.path.exists(payload.json_path):
        raise HTTPException(status_code=404, detail=f"File not found: {payload.json_path}")
    
    try:
        count = ingest_json(payload.json_path)
        return {"status": "indexed", "chunks": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ask")
async def ask_endpoint(payload: QueryRequest):
    """
    Endpoint to ask a question.
    Payload example: { "question": "What is the summary?" }
    """
    try:
        response = rag_query(payload.question)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
