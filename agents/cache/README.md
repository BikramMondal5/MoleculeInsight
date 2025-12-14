# Agent Response Cache

This directory contains cached responses from various agents to improve performance and reduce API calls.

## Cache Structure

Each cache file is named using an MD5 hash of:
- Agent name
- Molecule name
- Query parameters

## Cache Contents

Each cache file contains:
```json
{
  "timestamp": "2025-12-14T10:30:00",
  "agent": "IQVIA",
  "molecule": "Aspirin",
  "params": {"query": "..."},
  "data": "... agent response ..."
}
```

## Cache Expiry

- **Default Expiry**: 7 days (168 hours)
- Expired cache entries are automatically ignored
- Cache files can be manually cleared via API endpoints

## Cache Management API Endpoints

### Get Cache Info
```
GET /api/cache/info
```
Returns information about all cached data including age and expiry status.

### Clear All Cache
```
POST /api/cache/clear
```
Removes all cache files.

### Clear Expired Cache
```
POST /api/cache/clear-expired
```
Removes only expired cache files.

## Benefits

1. **Faster Response Times**: Cached responses are returned instantly
2. **Reduced API Costs**: No redundant API calls for same queries
3. **Offline Capability**: Previously queried data available even if APIs are down
4. **Consistent Results**: Same query returns same results within cache period

## Cache Hit Behavior

When a cache hit occurs:
- Response is returned immediately from cache
- Console logs: `[AgentName] Using cached response for MoleculeName`
- No API call is made to external services

## Cache Miss Behavior

When a cache miss occurs:
- Console logs: `[AgentName] Cache miss - running agent for MoleculeName`
- Agent executes normally and fetches fresh data
- Response is automatically stored in cache for future use
