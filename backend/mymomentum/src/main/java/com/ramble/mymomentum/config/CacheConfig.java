package com.ramble.mymomentum.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        ConcurrentMapCacheManager cacheManager = new ConcurrentMapCacheManager();
        
        // Configure cache names for statistics
        cacheManager.setCacheNames(java.util.List.of(
            "activityDistribution",
            "activityTrend", 
            "activityKPIs"
        ));
        
        // Allow dynamic cache creation for other caches if needed
        cacheManager.setAllowNullValues(false);
        
        return cacheManager;
    }
}
