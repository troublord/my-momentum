package com.ramble.mymomentum.repository;

import com.ramble.mymomentum.entity.ActivityRecord;
import com.ramble.mymomentum.enums.RecordSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ActivityRecordRepository extends JpaRepository<ActivityRecord, UUID> {
    
    /**
     * Find record by ID and user ID for ownership verification
     */
    Optional<ActivityRecord> findByIdAndUserId(UUID id, Long userId);
    
    /**
     * Check if a running LIVE record exists for user and activity
     */
    boolean existsByUserIdAndActivityIdAndSourceAndDurationIsNull(Long userId, UUID activityId, RecordSource source);
    
    /**
     * Find running LIVE records for a user 
     */
    Page<ActivityRecord> findByUserIdAndSourceAndDurationIsNull(Long userId, RecordSource source, Pageable pageable);
    
    /**
     * Find records by user ID only (for when no filters are applied)
     */
    Page<ActivityRecord> findByUserId(Long userId, Pageable pageable);
    
    /**
     * Find records by user ID and activity ID only
     */
    Page<ActivityRecord> findByUserIdAndActivityId(Long userId, UUID activityId, Pageable pageable);
    
    /**
     * Find records by user ID and source only
     */
    Page<ActivityRecord> findByUserIdAndSource(Long userId, RecordSource source, Pageable pageable);
    
    /**
     * Find records by user ID, activity ID, and source
     */
    Page<ActivityRecord> findByUserIdAndActivityIdAndSource(Long userId, UUID activityId, RecordSource source, Pageable pageable);
    
    /**
     * Find records by user ID, activity ID, source, and time range
     * @deprecated Use findByUserIdAndActivityIdAndSourceAndExecutedAtRange instead for half-open interval [from, to)
     */
    @Deprecated
    Page<ActivityRecord> findByUserIdAndActivityIdAndSourceAndExecutedAtBetween(Long userId, UUID activityId, RecordSource source, Instant from, Instant to, Pageable pageable);
    
    /**
     * Find running LIVE records by user ID and activity ID
     */
    Page<ActivityRecord> findByUserIdAndActivityIdAndSourceAndDurationIsNull(Long userId, UUID activityId, RecordSource source, Pageable pageable);
    
    // ===== RANGE METHODS (Half-open interval [from, to)) =====
    
    /**
     * Find records by user ID with time range [from, to)
     */
    @Query("""
        FROM ActivityRecord ar
        WHERE ar.userId = :userId
          AND ar.executedAt >= :from AND ar.executedAt < :to
        """)
    Page<ActivityRecord> findByUserIdAndExecutedAtRange(@Param("userId") Long userId,
                                                        @Param("from") Instant from,
                                                        @Param("to") Instant to,
                                                        Pageable pageable);
    
    /**
     * Find records by user ID and activity ID with time range [from, to)
     */
    @Query("""
        FROM ActivityRecord ar
        WHERE ar.userId = :userId
          AND ar.activityId = :activityId
          AND ar.executedAt >= :from AND ar.executedAt < :to
        """)
    Page<ActivityRecord> findByUserIdAndActivityIdAndExecutedAtRange(@Param("userId") Long userId,
                                                                     @Param("activityId") UUID activityId,
                                                                     @Param("from") Instant from,
                                                                     @Param("to") Instant to,
                                                                     Pageable pageable);
    
    /**
     * Find records by user ID and source with time range [from, to)
     */
    @Query("""
        FROM ActivityRecord ar
        WHERE ar.userId = :userId
          AND ar.source = :source
          AND ar.executedAt >= :from AND ar.executedAt < :to
        """)
    Page<ActivityRecord> findByUserIdAndSourceAndExecutedAtRange(@Param("userId") Long userId,
                                                                 @Param("source") RecordSource source,
                                                                 @Param("from") Instant from,
                                                                 @Param("to") Instant to,
                                                                 Pageable pageable);
    
    /**
     * Find records by user ID, activity ID and source with time range [from, to)
     */
    @Query("""
        FROM ActivityRecord ar
        WHERE ar.userId = :userId
          AND ar.activityId = :activityId
          AND ar.source = :source
          AND ar.executedAt >= :from AND ar.executedAt < :to
        """)
    Page<ActivityRecord> findByUserIdAndActivityIdAndSourceAndExecutedAtRange(@Param("userId") Long userId,
                                                                              @Param("activityId") UUID activityId,
                                                                              @Param("source") RecordSource source,
                                                                              @Param("from") Instant from,
                                                                              @Param("to") Instant to,
                                                                              Pageable pageable);

    
    /**
     * Calculate total time spent on an activity (in seconds)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) FROM ActivityRecord ar WHERE ar.activityId = :activityId")
    Long getTotalTimeByActivityId(@Param("activityId") UUID activityId);
    
    /**
     * Calculate weekly time spent on an activity (in seconds)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) FROM ActivityRecord ar WHERE ar.activityId = :activityId AND ar.executedAt >= :weekStart")
    Long getWeeklyTimeByActivityId(@Param("activityId") UUID activityId, @Param("weekStart") Instant weekStart);
    
    /**
     * Calculate total duration in minutes for a user within a date range (only completed records)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) / 60 FROM ActivityRecord ar WHERE ar.userId = :userId AND ar.executedAt >= :start AND ar.executedAt < :end AND ar.duration IS NOT NULL")
    Long getTotalMinutesInRange(@Param("userId") Long userId, @Param("start") Instant start, @Param("end") Instant end);
    
    /**
     * Calculate total duration in minutes for a specific activity within a date range (only completed records)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) / 60 FROM ActivityRecord ar WHERE ar.activityId = :activityId AND ar.executedAt >= :start AND ar.executedAt < :end AND ar.duration IS NOT NULL")
    Long getActivityMinutesInRange(@Param("activityId") UUID activityId, @Param("start") Instant start, @Param("end") Instant end);
    
    /**
     * Find the activity with the most total duration in a date range for a user
     * Returns list of activity IDs ordered by duration (use Pageable to limit results)
     */
    @Query("""
        SELECT ar.activityId
        FROM ActivityRecord ar
        WHERE ar.userId = :userId
          AND ar.executedAt >= :start AND ar.executedAt < :end
          AND ar.duration IS NOT NULL
        GROUP BY ar.activityId
        ORDER BY SUM(ar.duration) DESC, MAX(ar.executedAt) DESC
        """)
    List<UUID> findTopActivityByDurationIds(@Param("userId") Long userId,
                                           @Param("start") Instant start,
                                           @Param("end") Instant end,
                                           Pageable pageable);
    
    /**
     * Get weekly trend data for all activities of a user
     * Returns list of [weekStart, totalMinutes] for the given week starts
     */
    @Query("""
        SELECT 
            FUNCTION('DATE_TRUNC', 'week', ar.executedAt) as weekStart,
            COALESCE(SUM(ar.duration), 0) / 60 as totalMinutes
        FROM ActivityRecord ar 
        WHERE ar.userId = :userId 
            AND ar.duration IS NOT NULL
            AND ar.executedAt >= :earliestWeekStart
        GROUP BY FUNCTION('DATE_TRUNC', 'week', ar.executedAt)
        ORDER BY weekStart
        """)
    List<Object[]> getWeeklyTrendForUser(@Param("userId") Long userId, @Param("earliestWeekStart") Instant earliestWeekStart);
    
    /**
     * Get weekly trend data for a specific activity
     * Returns list of [weekStart, totalMinutes] for the given week starts
     */
    @Query("""
        SELECT 
            FUNCTION('DATE_TRUNC', 'week', ar.executedAt) as weekStart,
            COALESCE(SUM(ar.duration), 0) / 60 as totalMinutes
        FROM ActivityRecord ar 
        WHERE ar.activityId = :activityId 
            AND ar.duration IS NOT NULL
            AND ar.executedAt >= :earliestWeekStart
        GROUP BY FUNCTION('DATE_TRUNC', 'week', ar.executedAt)
        ORDER BY weekStart
        """)
    List<Object[]> getWeeklyTrendForActivity(@Param("activityId") UUID activityId, @Param("earliestWeekStart") Instant earliestWeekStart);
}
