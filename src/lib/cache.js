// Simple In-Memory Cache (lives inside Railway RAM)

  const cache = {
    data: new Map(), 
    ttl: 1000 * 60 * 60 * 6, // 6 hours
  };
  
  export function setCache(key, value) {
    cache.data.set(key, {
      value,
      expiry: Date.now() + cache.ttl,
    });
  }
  
  export function getCache(key) {
    const entry = cache.data.get(key);
    if (!entry) return null;
  
    if (Date.now() > entry.expiry) {
      cache.data.delete( );
      return null;
    }
  
    return entry.value;
  }
  
  export function deleteCache(key) {
    cache.data.delete(key);
  }
  
  export function clearAllCache() {
    cache.data.clear();
  }
  