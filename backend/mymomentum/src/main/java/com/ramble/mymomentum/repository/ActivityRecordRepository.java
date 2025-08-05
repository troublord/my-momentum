package com.ramble.mymomentum.repository;

import com.ramble.mymomentum.entity.ActivityRecord;
import com.ramble.mymomentum.enums.RecordSource;
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
     * Find all records by user ID
     */
    List<ActivityRecord> findByUserId(UUID userId);
    
    /**
     * Find all records by activity ID
     */
    List<ActivityRecord> findByActivityId(UUID activityId);
    
    /**
     * Find all records by user ID and activity ID
     */
    List<ActivityRecord> findByUserIdAndActivityId(UUID userId, UUID activityId);
    
    /**
     * Find records by user ID and source
     */
    List<ActivityRecord> findByUserIdAndSource(UUID userId, RecordSource source);
    
    /**
     * Find records by user ID within a date range
     */
    List<ActivityRecord> findByUserIdAndExecutedAtBetween(UUID userId, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find records by activity ID within a date range
     */
    List<ActivityRecord> findByActivityIdAndExecutedAtBetween(UUID activityId, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find records by user ID and activity ID within a date range
     */
    List<ActivityRecord> findByUserIdAndActivityIdAndExecutedAtBetween(
            UUID userId, UUID activityId, LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Calculate total duration for a user within a date range
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) FROM ActivityRecord ar WHERE ar.userId = :userId AND ar.executedAt BETWEEN :startDate AND :endDate")
    Integer sumDurationByUserIdAndDateRange(@Param("userId") UUID userId, 
                                           @Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    /**
     * Calculate total duration for an activity within a date range
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) FROM ActivityRecord ar WHERE ar.activityId = :activityId AND ar.executedAt BETWEEN :startDate AND :endDate")
    Integer sumDurationByActivityIdAndDateRange(@Param("activityId") UUID activityId, 
                                               @Param("startDate") LocalDateTime startDate, 
                                               @Param("endDate") LocalDateTime endDate);
    
    /**
     * Delete all records by user ID
     */
    void deleteByUserId(UUID userId);
    
    /**
     * Delete all records by activity ID
     */
    void deleteByActivityId(UUID activityId);
} 