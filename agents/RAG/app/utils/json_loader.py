import json

def extract_json_text(path: str) -> str:
    """
    Extracts text from a JSON file.
    
    If the file contains a list of objects or a single object, it converts 
    the structure to a formatted string.
    """
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # We can implement smarter extraction here (e.g. only values),
        # but for a general RAG, a string dump of the JSON structure is often a good start
        # so the LLM knows keys and values.
        text = json.dumps(data, indent=2, ensure_ascii=False)
        return text
    except Exception as e:
        print(f"Error reading JSON {path}: {e}")
        return ""
