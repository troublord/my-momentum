package com.ramble.mymomentum.repository;

import com.ramble.mymomentum.entity.ActivityRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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
    List<ActivityRecord> findByActivityIdAndExecutedAtBetween(UUID activityId, LocalDateTime start, LocalDateTime end);
    
    /**
     * Find all records for a user within a date range
     */
    List<ActivityRecord> findByUserIdAndExecutedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
    
    /**
     * Calculate total time spent on an activity (in seconds)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) FROM ActivityRecord ar WHERE ar.activity.id = :activityId")
    Integer getTotalTimeByActivityId(@Param("activityId") UUID activityId);
    
    /**
     * Calculate weekly time spent on an activity (in seconds)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) FROM ActivityRecord ar WHERE ar.activity.id = :activityId AND ar.executedAt >= :weekStart")
    Integer getWeeklyTimeByActivityId(@Param("activityId") UUID activityId, @Param("weekStart") LocalDateTime weekStart);
}
