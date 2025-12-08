"""
Cache Manager for MoleculeInsight
Handles caching of API responses to reduce redundant calls and API quota usage
"""

import os
import json
import hashlib
from datetime import datetime, timedelta
from pathlib import Path

class CacheManager:
    """Manages caching of API responses with expiry"""
    
    def __init__(self, cache_dir="cache", default_expiry_hours=24):
        """
        Initialize cache manager
        
        Args:
            cache_dir: Directory to store cache files
            default_expiry_hours: Default cache expiry time in hours
        """
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(exist_ok=True)
        self.default_expiry = timedelta(hours=default_expiry_hours)
    
    def _get_cache_key(self, agent_name, molecule, **params):
        """Generate unique cache key based on parameters"""
        # Create a string from all parameters
        param_str = f"{agent_name}_{molecule}_" + "_".join(f"{k}={v}" for k, v in sorted(params.items()))
        # Hash it for consistent filename
        return hashlib.md5(param_str.encode()).hexdigest()
    
    def _get_cache_path(self, cache_key):
        """Get full path to cache file"""
        return self.cache_dir / f"{cache_key}.json"
    
    def get(self, agent_name, molecule, **params):
        """
        Get cached data if available and not expired
        
        Args:
            agent_name: Name of the agent
            molecule: Molecule name
            **params: Additional parameters for cache key
            
        Returns:
            Cached data or None if not found/expired
        """
        cache_key = self._get_cache_key(agent_name, molecule, **params)
        cache_path = self._get_cache_path(cache_key)
        
        if not cache_path.exists():
            return None
        
        try:
            with open(cache_path, 'r', encoding='utf-8') as f:
                cache_data = json.load(f)
            
            # Check expiry
            cached_time = datetime.fromisoformat(cache_data['timestamp'])
            if datetime.now() - cached_time > self.default_expiry:
                print(f"[Cache] Expired cache for {agent_name} - {molecule}")
                return None
            
            print(f"[Cache] Hit for {agent_name} - {molecule}")
            return cache_data['data']
            
        except Exception as e:
            print(f"[Cache] Error reading cache: {e}")
            return None
    
    def set(self, agent_name, molecule, data, **params):
        """
        Store data in cache
        
        Args:
            agent_name: Name of the agent
            molecule: Molecule name
            data: Data to cache
            **params: Additional parameters for cache key
        """
        cache_key = self._get_cache_key(agent_name, molecule, **params)
        cache_path = self._get_cache_path(cache_key)
        
        cache_data = {
            'timestamp': datetime.now().isoformat(),
            'agent': agent_name,
            'molecule': molecule,
            'params': params,
            'data': data
        }
        
        try:
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, indent=2)
            print(f"[Cache] Stored for {agent_name} - {molecule}")
        except Exception as e:
            print(f"[Cache] Error writing cache: {e}")
    
    def clear_expired(self):
        """Remove all expired cache files"""
        count = 0
        for cache_file in self.cache_dir.glob("*.json"):
            try:
                with open(cache_file, 'r') as f:
                    cache_data = json.load(f)
                cached_time = datetime.fromisoformat(cache_data['timestamp'])
                if datetime.now() - cached_time > self.default_expiry:
                    cache_file.unlink()
                    count += 1
            except Exception:
                pass
        print(f"[Cache] Cleared {count} expired files")
        return count
    
    def clear_all(self):
        """Clear all cache files"""
        count = 0
        for cache_file in self.cache_dir.glob("*.json"):
            cache_file.unlink()
            count += 1
        print(f"[Cache] Cleared {count} files")
        return count
    
    def get_cache_info(self):
        """Get information about cached data"""
        info = []
        for cache_file in self.cache_dir.glob("*.json"):
            try:
                with open(cache_file, 'r') as f:
                    cache_data = json.load(f)
                cached_time = datetime.fromisoformat(cache_data['timestamp'])
                age = datetime.now() - cached_time
                info.append({
                    'agent': cache_data.get('agent'),
                    'molecule': cache_data.get('molecule'),
                    'age_hours': age.total_seconds() / 3600,
                    'expired': age > self.default_expiry
                })
            except Exception:
                pass
        return info


# Global cache instance
cache_manager = CacheManager(
    cache_dir=os.path.join(os.path.dirname(__file__), "cache"),
    default_expiry_hours=24  
)
