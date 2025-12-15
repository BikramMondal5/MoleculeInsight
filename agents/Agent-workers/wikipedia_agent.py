"""
Wikipedia Agent - Fetches comprehensive molecule information from Wikipedia
Uses LangChain's WikipediaAPIWrapper for reliable data retrieval
"""

from langchain_community.utilities import WikipediaAPIWrapper

def run_wikipedia_agent(molecule_name: str, query: str = "") -> str:
    """
    Fetch molecule information from Wikipedia using LangChain
    
    Args:
        molecule_name: Name of the molecule to search
        query: Optional query context (not used currently)
        
    Returns:
        Formatted string with molecule information or error message
    """
    try:
        print(f"[Wikipedia Agent] Fetching information for: {molecule_name}")
        
        # Initialize Wikipedia wrapper
        wikipedia = WikipediaAPIWrapper(
            top_k_results=1,
            doc_content_chars_max=4000  # Limit content length
        )
        
        # Search for the molecule
        try:
            result = wikipedia.run(molecule_name)
        except Exception as search_error:
            print(f"[Wikipedia Agent] Search error: {str(search_error)}")
            return format_no_data_response(molecule_name)
        
        if not result or result.lower().startswith("no good wikipedia"):
            print(f"[Wikipedia Agent] No Wikipedia page found for {molecule_name}")
            return format_no_data_response(molecule_name)
        
        # Extract and format key information
        formatted_info = extract_molecule_info(result, molecule_name)
        
        print(f"[Wikipedia Agent] Successfully fetched information for {molecule_name}")
        return formatted_info
        
    except Exception as e:
        print(f"[Wikipedia Agent] Error: {str(e)}")
        return format_error_response(molecule_name, str(e))


def extract_molecule_info(wiki_text: str, molecule_name: str) -> str:
    """
    Extract and format key information from Wikipedia text
    
    Args:
        wiki_text: Raw Wikipedia content
        molecule_name: Name of the molecule
        
    Returns:
        Formatted string with structured information
    """
    # Clean up the text
    text = wiki_text.strip()
    
    # Extract first few paragraphs (usually contains overview)
    paragraphs = text.split('\n\n')
    # Take first 2-3 paragraphs for better context
    overview = '\n\n'.join(paragraphs[:3]) if len(paragraphs) >= 3 else text[:1000]
    
    # Build formatted response - just overview and source
    response = f"## {molecule_name} - Wikipedia Overview\n\n"
    response += f"{overview}\n\n"
    
    # Add source attribution
    response += f"---\n*Source: Wikipedia - Information retrieved for {molecule_name}*\n"
    
    return response


def format_no_data_response(molecule_name: str) -> str:
    """Format response when no Wikipedia data is found"""
    return f"""## {molecule_name} - Wikipedia Information

### Overview
No Wikipedia page found for "{molecule_name}". This could mean:
- The molecule name might need to be more specific
- The compound may not have a dedicated Wikipedia page
- Try searching with alternative names (IUPAC name, brand name, etc.)

### Suggestion
You can try searching for this molecule using:
- Generic/Brand names
- Chemical compound name
- IUPAC systematic name

---
*Source: Wikipedia - No data available*
"""


def format_error_response(molecule_name: str, error: str) -> str:
    """Format response when an error occurs"""
    return f"""## {molecule_name} - Wikipedia Information

### Error
Unable to fetch Wikipedia information for "{molecule_name}".

**Error Details:** {error}

### Note
This error is temporary and doesn't affect other analysis components.

---
*Source: Wikipedia - Error occurred during retrieval*
"""


if __name__ == "__main__":
    # Test the agent
    test_molecules = ["Atorvastatin", "Aspirin", "Ibuprofen"]
    
    for molecule in test_molecules:
        print(f"\n{'='*60}")
        print(f"Testing: {molecule}")
        print('='*60)
        result = run_wikipedia_agent(molecule, "")
        print(result)
        print()
