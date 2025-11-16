/**
 * Template Cache
 *
 * @description In-memory cache for template data with TTL
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class TemplateCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Set cache entry with TTL
   */
  set<T = unknown>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  /**
   * Get cache entry if not expired
   */
  get<T = unknown>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    this.cleanup();
    return this.cache.size;
  }
}

export const templateCache = new TemplateCache();

// Cleanup expired entries every minute
setInterval(() => {
  templateCache.cleanup();
}, 60 * 1000);
