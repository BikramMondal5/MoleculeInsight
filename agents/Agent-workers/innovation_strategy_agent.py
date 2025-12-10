import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.getenv("ARIJIT_GEMINI_API_KEY2")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3,
)

def run_innovation_strategy_agent(
    molecule: str,
    market_data: str = None,
    clinical_data: str = None,
    patent_data: str = None,
    trade_data: str = None,
    web_data: str = None,
    internal_data: str = None
):
    """
    Innovation Strategy Agent - synthesizes all data to generate strategic opportunities
    """
    
    # Build context from all available data
    context_parts = []
    if market_data:
        context_parts.append(f"**Market Insights:**\n{market_data[:500]}...")
    if clinical_data:
        context_parts.append(f"**Clinical Trials:**\n{clinical_data[:500]}...")
    if patent_data:
        context_parts.append(f"**Patent Landscape:**\n{patent_data[:500]}...")
    if trade_data:
        context_parts.append(f"**Trade Data:**\n{trade_data[:500]}...")
    if web_data:
        context_parts.append(f"**Web Intelligence:**\n{web_data[:500]}...")
    if internal_data:
        context_parts.append(f"**Internal Knowledge:**\n{internal_data[:500]}...")
    
    context = "\n\n".join(context_parts) if context_parts else "Limited data available"
    
    prompt = f"""
You are the Innovation Strategy Agent. Based on comprehensive analysis of {molecule}, generate strategic innovation opportunities.

Available Intelligence:
{context}

Generate exactly 4-6 specific, actionable innovation opportunities. For EACH opportunity provide:
- **Title**: A clear, compelling opportunity name (4-8 words)
- **Description**: A concise 2-3 sentence explanation of the opportunity, backed by data insights

Format your response as a JSON array of opportunities:
```json
[
  {{
    "title": "Market Opportunity Title",
    "description": "Detailed description with specific insights from the data..."
  }},
  ...
]
```

Focus on:
1. Market gaps and unmet needs
2. Clinical trial opportunities (indications, phases, geographies)
3. Patent expiration opportunities or white spaces
4. Geographic expansion based on trade data
5. Emerging trends from web intelligence
6. Strategic positioning recommendations

Be specific, data-driven, and actionable. Only output the JSON array, nothing else.
"""
    
    try:
        response = llm.invoke(prompt)
        content = response.content.strip()
        
        # Extract JSON from markdown code blocks if present
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        # VALIDATE that it's actual JSON before returning
        import json
        parsed = json.loads(content)  # This will throw if invalid
        print(f"[Innovation Strategy Agent] ✓ Generated {len(parsed)} opportunities")
        
        return content  # Return the JSON string (your code expects string)
    except json.JSONDecodeError as je:
        print(f"[Innovation Strategy Agent] ✗ JSON Parse Error: {je}")
        print(f"[Innovation Strategy Agent] Raw content: {content}")
        return "[]"
    except Exception as e:
        print(f"[Innovation Strategy Agent] ✗ Error: {e}")
        return "[]"