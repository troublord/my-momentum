package com.ramble.mymomentum.service;

import com.github.benmanes.caffeine.cache.Cache;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentMap;

/**
 * Service for precise cache eviction based on activityId or userId
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CacheEvictionService {

    private final CacheManager cacheManager;

    /**
     * Evict all cache entries for a specific activity across all cache types
     * 
     * @param activityId The activity ID to evict caches for
     */
    public void evictByActivityId(UUID activityId) {
        if (activityId == null) {
            log.warn("Cannot evict cache: activityId is null");
            return;
        }

        String activityIdStr = activityId.toString();
        String[] cacheNames = {"activityDistribution", "activityTrend", "activityKPIs"};
        
        int totalEvicted = 0;
        for (String cacheName : cacheNames) {
            int evicted = evictCacheByPattern(cacheName, activityIdStr);
            totalEvicted += evicted;
        }
        
        log.info("Evicted {} cache entries for activity: {}", totalEvicted, activityId);
    }

    /**
     * Evict all cache entries for a specific user across all cache types
     * 
     * @param userId The user ID to evict caches for
     */
    public void evictByUserId(Long userId) {
        if (userId == null) {
            log.warn("Cannot evict cache: userId is null");
            return;
        }

        String userIdStr = userId.toString();
        String[] cacheNames = {"activityDistribution", "activityTrend", "activityKPIs"};
        
        int totalEvicted = 0;
        for (String cacheName : cacheNames) {
            int evicted = evictCacheByPattern(cacheName, userIdStr);
            totalEvicted += evicted;
        }
        
        log.info("Evicted {} cache entries for user: {}", totalEvicted, userId);
    }

    /**
     * Evict cache entries that contain the specified pattern in their key
     * 
     * @param cacheName The name of the cache
     * @param pattern The pattern to match in cache keys
     * @return Number of entries evicted
     */
    private int evictCacheByPattern(String cacheName, String pattern) {
        org.springframework.cache.Cache cache = cacheManager.getCache(cacheName);
        if (cache == null) {
            log.warn("Cache not found: {}", cacheName);
            return 0;
        }

        Object nativeCache = cache.getNativeCache();
        if (!(nativeCache instanceof Cache)) {
            log.warn("Cache {} is not a Caffeine cache, cannot evict by pattern", cacheName);
            return 0;
        }

        @SuppressWarnings("unchecked")
        Cache<Object, Object> caffeineCache = (Cache<Object, Object>) nativeCache;
        ConcurrentMap<Object, Object> map = caffeineCache.asMap();

        // Find all keys that contain the activityId pattern
        // For activityDistribution & activityTrend: activityId is at the start
        // For activityKPIs: activityId is in the middle (userId_activityId_...)
        int evicted = 0;
        for (Object key : map.keySet()) {
            String keyStr = key.toString();
            // Match activityId: either at start followed by underscore, or after underscore
            if (keyStr.startsWith(pattern + "_") || keyStr.contains("_" + pattern + "_")) {
                caffeineCache.invalidate(key);
                evicted++;
            }
        }

        if (evicted > 0) {
            log.debug("Evicted {} entries from cache '{}' with pattern: {}", evicted, cacheName, pattern);
        }

        return evicted;
    }

    /**
     * Clear all entries from all caches (use with caution)
     */
    public void clearAllCaches() {
        String[] cacheNames = {"activityDistribution", "activityTrend", "activityKPIs"};
        
        for (String cacheName : cacheNames) {
            org.springframework.cache.Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
                log.info("Cleared all entries from cache: {}", cacheName);
            }
        }
    }
}
