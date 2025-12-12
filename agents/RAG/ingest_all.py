
import os
import sys

# Ensure we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import app.config  # Initialize configuration
from app.ingest import ingest_json

def main():
    kb_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "KnowledgeBase")
    files = [
        "clinicaltrials.json",
        "FDAAPI.json",
        "newsAPI.json",
        "PatentSearchResponse.json",
        "semanticScholar.json"
    ]

    for f in files:
        path = os.path.join(kb_dir, f)
        if os.path.exists(path):
            print(f"Ingesting {f}...")
            ingest_json(path)
        else:
            print(f"File not found: {f}")

if __name__ == "__main__":
    main()
