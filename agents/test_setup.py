"""
Quick test script to verify agent functionality
Run this to test if your API keys and agents are working
"""

import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all agent modules can be imported"""
    print("Testing imports...")
    try:
        import importlib.util
        
        agents_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Agent-workers")
        
        # Helper function to load modules
        def load_module(file_name):
            file_path = os.path.join(agents_dir, file_name)
            spec = importlib.util.spec_from_file_location(file_name.replace('.py', ''), file_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return module
        
        # Test loading each module
        load_module("clinical_trials_agent.py")
        load_module("exim_trade_agent.py")
        load_module("iqvia_agent.py")
        load_module("patent_agent.py")
        load_module("web_agent.py")
        
        print("✓ All agent modules imported successfully")
        return True
    except Exception as e:
        print(f"✗ Import error: {e}")
        return False

def test_env_variables():
    """Test if required environment variables are set"""
    print("\nTesting environment variables...")
    from dotenv import load_dotenv
    load_dotenv()
    
    required_vars = ["GEMINI_API_KEY"]
    optional_vars = ["COMTRADE_API_KEY", "NEWS_API_KEY"]
    
    all_set = True
    for var in required_vars:
        if os.getenv(var):
            print(f"✓ {var} is set")
        else:
            print(f"✗ {var} is NOT set (required)")
            all_set = False
    
    for var in optional_vars:
        if os.getenv(var):
            print(f"✓ {var} is set")
        else:
            print(f"⚠ {var} is NOT set (optional, some features may not work)")
    
    return all_set

def test_simple_agent():
    """Test a simple agent call"""
    print("\nTesting IQVIA agent with a simple query...")
    try:
        import importlib.util
        
        agents_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Agent-workers")
        file_path = os.path.join(agents_dir, "iqvia_agent.py")
        
        spec = importlib.util.spec_from_file_location("iqvia_agent", file_path)
        iqvia_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(iqvia_module)
        
        result = iqvia_module.generate_final_report("Aspirin")
        if result and len(result) > 100:
            print("✓ IQVIA agent returned a response")
            print(f"  Response length: {len(result)} characters")
            return True
        else:
            print("✗ IQVIA agent returned empty or invalid response")
            return False
    except Exception as e:
        print(f"✗ IQVIA agent test failed: {e}")
        return False

def main():
    print("="*60)
    print("MoleculeInsight Agent Test Suite")
    print("="*60)
    
    results = []
    
    # Test 1: Imports
    results.append(("Imports", test_imports()))
    
    # Test 2: Environment Variables
    results.append(("Environment Variables", test_env_variables()))
    
    # Test 3: Simple Agent Call
    if results[1][1]:  # Only if env vars are set
        results.append(("Agent Functionality", test_simple_agent()))
    else:
        print("\nSkipping agent test due to missing API keys")
        print("Please configure agents/.env with your API keys")
    
    # Summary
    print("\n" + "="*60)
    print("Test Summary:")
    print("="*60)
    for name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status} - {name}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n✓ All tests passed! Your setup is ready.")
        print("\nYou can now start the servers:")
        print("  1. Backend: python main.py")
        print("  2. Frontend: pnpm dev (from project root)")
    else:
        print("\n✗ Some tests failed. Please fix the issues above.")
        print("\nCommon fixes:")
        print("  - Install dependencies: pip install -r requirements.txt")
        print("  - Configure .env file with API keys")
        print("  - Check internet connection")

if __name__ == "__main__":
    main()
