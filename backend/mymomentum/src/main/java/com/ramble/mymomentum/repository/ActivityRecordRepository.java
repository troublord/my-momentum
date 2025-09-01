package com.ramble.mymomentum.repository;

import com.ramble.mymomentum.entity.ActivityRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ActivityRecordRepository extends JpaRepository<ActivityRecord, UUID> {
    
    /**
     * Find all records for a specific activity
     */
    List<ActivityRecord> findByActivityId(UUID activityId);
    
    /**
     * Find all records for a specific activity within a date range
     */
    List<ActivityRecord> findByActivityIdAndExecutedAtBetween(UUID activityId, Instant start, Instant end);
    
    /**
     * Find all records for a user within a date range
     */
    List<ActivityRecord> findByUserIdAndExecutedAtBetween(Long userId, Instant start, Instant end);
    
    /**
     * Calculate total time spent on an activity (in seconds)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) FROM ActivityRecord ar WHERE ar.activity.id = :activityId")
    Integer getTotalTimeByActivityId(@Param("activityId") UUID activityId);
    
    /**
     * Calculate weekly time spent on an activity (in seconds)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) FROM ActivityRecord ar WHERE ar.activity.id = :activityId AND ar.executedAt >= :weekStart")
    Integer getWeeklyTimeByActivityId(@Param("activityId") UUID activityId, @Param("weekStart") Instant weekStart);
    
    /**
     * Calculate total duration in minutes for a user within a date range (only completed records)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) / 60 FROM ActivityRecord ar WHERE ar.userId = :userId AND ar.executedAt >= :start AND ar.executedAt < :end AND ar.duration IS NOT NULL")
    Integer getTotalMinutesInRange(@Param("userId") Long userId, @Param("start") Instant start, @Param("end") Instant end);
    
    /**
     * Calculate total duration in minutes for a specific activity within a date range (only completed records)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) / 60 FROM ActivityRecord ar WHERE ar.activity.id = :activityId AND ar.executedAt >= :start AND ar.executedAt < :end AND ar.duration IS NOT NULL")
    Integer getActivityMinutesInRange(@Param("activityId") UUID activityId, @Param("start") Instant start, @Param("end") Instant end);
    
    /**
     * Find the activity with the most total duration in a date range for a user
     * Returns the activity ID, or null if no records found
     */
    @Query("SELECT ar.activity.id FROM ActivityRecord ar WHERE ar.userId = :userId AND ar.executedAt >= :start AND ar.executedAt < :end AND ar.duration IS NOT NULL GROUP BY ar.activity.id ORDER BY SUM(ar.duration) DESC, MAX(ar.executedAt) DESC LIMIT 1")
    UUID findTopActivityByDuration(@Param("userId") Long userId, @Param("start") Instant start, @Param("end") Instant end);
    
    /**
     * Get weekly trend data for all activities of a user
     * Returns list of [weekStart, totalMinutes] for the given week starts
     */
    @Query("""
        SELECT 
            FUNCTION('DATE_FORMAT', ar.executedAt, '%Y-%m-%d') as weekStart,
            COALESCE(SUM(ar.duration), 0) / 60 as totalMinutes
        FROM ActivityRecord ar 
        WHERE ar.userId = :userId 
            AND ar.duration IS NOT NULL
            AND ar.executedAt >= :earliestWeekStart
        GROUP BY FUNCTION('YEARWEEK', ar.executedAt, 1)
        ORDER BY weekStart
        """)
    List<Object[]> getWeeklyTrendForUser(@Param("userId") Long userId, @Param("earliestWeekStart") Instant earliestWeekStart);
    
    /**
     * Get weekly trend data for a specific activity
     * Returns list of [weekStart, totalMinutes] for the given week starts
     */
    @Query("""
        SELECT 
            FUNCTION('DATE_FORMAT', ar.executedAt, '%Y-%m-%d') as weekStart,
            COALESCE(SUM(ar.duration), 0) / 60 as totalMinutes
        FROM ActivityRecord ar 
        WHERE ar.activity.id = :activityId 
            AND ar.duration IS NOT NULL
            AND ar.executedAt >= :earliestWeekStart
        GROUP BY FUNCTION('YEARWEEK', ar.executedAt, 1)
        ORDER BY weekStart
        """)
    List<Object[]> getWeeklyTrendForActivity(@Param("activityId") UUID activityId, @Param("earliestWeekStart") Instant earliestWeekStart);
}
