package com.ramble.mymomentum.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        
        // Configure Caffeine cache with TTL
        cacheManager.setCaffeine(Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)     // 寫入後 5 分鐘過期
            .expireAfterAccess(3, TimeUnit.MINUTES)    // 最後訪問後 3 分鐘過期
            .maximumSize(1000)                         // 最大 1000 個條目
            .recordStats());                           // 啟用統計功能
        
        // Configure cache names for statistics
        cacheManager.setCacheNames(java.util.List.of(
            "activityDistribution",
            "activityTrend", 
            "activityKPIs"
        ));
        
        return cacheManager;
    }
}
