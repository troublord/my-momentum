package com.ramble.mymomentum.repository;

import com.ramble.mymomentum.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    
    /**
     * Find all activities by user ID
     */
    List<Activity> findByUserId(Long userId);
    
    /**
     * Check if activity exists by user ID and name
     */
    boolean existsByUserIdAndName(Long userId, String name);
    
    /**
     * Calculate sum of weekly target time (in minutes) for all user activities
     */
    @Query("SELECT COALESCE(SUM(a.targetTime), 0) / 60 FROM Activity a WHERE a.userId = :userId")
    Integer getWeeklyTargetSumInMinutes(@Param("userId") Long userId);
} 