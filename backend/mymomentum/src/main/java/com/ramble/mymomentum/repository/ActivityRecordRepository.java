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
     * Find running LIVE records for a user (without pagination)
     */
    List<ActivityRecord> findByUserIdAndSourceAndDurationIsNull(Long userId, RecordSource source);
    
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
        WHERE ar.userId = ?1
          AND ar.activityId = ?2
          AND ar.executedAt >= ?3 AND ar.executedAt < ?4
        """)
    Page<ActivityRecord> findByUserIdAndActivityIdAndExecutedAtRange(Long userId,
                                                                     UUID activityId,
                                                                     Instant from,
                                                                     Instant to,
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
        WHERE ar.userId = ?1
          AND ar.activityId = ?2
          AND ar.source = ?3
          AND ar.executedAt >= ?4 AND ar.executedAt < ?5
        """)
    Page<ActivityRecord> findByUserIdAndActivityIdAndSourceAndExecutedAtRange(Long userId,
                                                                              UUID activityId,
                                                                              RecordSource source,
                                                                              Instant from,
                                                                              Instant to,
                                                                              Pageable pageable);

    
    /**
     * Calculate total time spent on an activity (in seconds)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) FROM ActivityRecord ar WHERE ar.activityId = ?1")
    Long getTotalTimeByActivityId(UUID activityId);
    
    /**
     * Calculate weekly time spent on an activity (in seconds)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) FROM ActivityRecord ar WHERE ar.activityId = ?1 AND ar.executedAt >= ?2")
    Long getWeeklyTimeByActivityId(UUID activityId, Instant weekStart);
    
    /**
     * Calculate total duration in minutes for a user within a date range (only completed records)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) / 60 FROM ActivityRecord ar WHERE ar.userId = :userId AND ar.executedAt >= :start AND ar.executedAt < :end AND ar.duration IS NOT NULL")
    Long getTotalMinutesInRange(@Param("userId") Long userId, @Param("start") Instant start, @Param("end") Instant end);
    
    /**
     * Calculate total duration in minutes for a specific activity within a date range (only completed records)
     */
    @Query("SELECT COALESCE(SUM(ar.duration), 0) / 60 FROM ActivityRecord ar WHERE ar.activityId = ?1 AND ar.executedAt >= ?2 AND ar.executedAt < ?3 AND ar.duration IS NOT NULL")
    Long getActivityMinutesInRange(UUID activityId, Instant start, Instant end);
    
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
        WHERE ar.activityId = ?1 
            AND ar.duration IS NOT NULL
            AND ar.executedAt >= ?2
        GROUP BY FUNCTION('DATE_TRUNC', 'week', ar.executedAt)
        ORDER BY weekStart
        """)
    List<Object[]> getWeeklyTrendForActivity(UUID activityId, Instant earliestWeekStart);
    
    // ===== NEW STATISTICS METHODS FOR FRONTEND APIs =====
    
    /**
     * Get activity distribution data by date/week/month grain
     * Returns list of [date, duration_sec, recordCount]
     */
    @Query(value = """
        WITH date_series AS (
            SELECT CAST(generate_series(
                CAST(:fromDate AS date), 
                CAST(:toDate AS date), 
                CASE 
                    WHEN :grain = 'day' THEN CAST('1 day' AS interval)
                    WHEN :grain = 'week' THEN CAST('1 week' AS interval)
                    WHEN :grain = 'month' THEN CAST('1 month' AS interval)
                END
            ) AS date) as date
        ),
        activity_data AS (
            SELECT 
                CASE 
                    WHEN :grain = 'day' THEN DATE(executed_at AT TIME ZONE 'Asia/Taipei')
                    WHEN :grain = 'week' THEN DATE(DATE_TRUNC('week', executed_at AT TIME ZONE 'Asia/Taipei'))
                    WHEN :grain = 'month' THEN DATE(DATE_TRUNC('month', executed_at AT TIME ZONE 'Asia/Taipei'))
                END as record_date,
                SUM(duration) as duration_sec,
                COUNT(*) as record_count
            FROM activity_records 
            WHERE activity_id = CAST(:activityId AS uuid)
                AND executed_at >= :fromInstant 
                AND executed_at < :toInstant
                AND duration IS NOT NULL
            GROUP BY 1
        )
        SELECT 
            TO_CHAR(ds.date, 'YYYY-MM-DD') as date,
            COALESCE(ad.duration_sec, 0) as duration_sec,
            COALESCE(ad.record_count, 0) as count
        FROM date_series ds
        LEFT JOIN activity_data ad ON ds.date = ad.record_date
        ORDER BY 1
        """, nativeQuery = true)
    List<Object[]> getActivityDistribution(@Param("activityId") UUID activityId, 
                                         @Param("fromDate") String fromDate,
                                         @Param("toDate") String toDate,
                                         @Param("fromInstant") Instant fromInstant,
                                         @Param("toInstant") Instant toInstant,
                                         @Param("grain") String grain);
    
    /**
     * Get activity trend data by week/month grain for custom date range
     * Returns list of [periodStart, duration_sec, totalCount]
     */
    @Query(value = """
        WITH base AS (
            SELECT
                CASE
                    WHEN :grain = 'day' THEN DATE_TRUNC('day', executed_at AT TIME ZONE :tz)
                    WHEN :grain = 'week' THEN DATE_TRUNC('week', executed_at AT TIME ZONE :tz)
                    WHEN :grain = 'month' THEN DATE_TRUNC('month', executed_at AT TIME ZONE :tz)
                END AS bucket_start,
                duration
            FROM activity_records
            WHERE user_id = CAST(:userId AS bigint)
                AND activity_id = CAST(:activityId AS uuid)
                AND executed_at >= :fromInstant
                AND executed_at < :toInstant
                AND duration IS NOT NULL
        )
        SELECT
            TO_CHAR(bucket_start, 'YYYY-MM-DD') AS period_start,
            SUM(duration) AS duration_sec,
            COUNT(*) AS total_count
        FROM base
        GROUP BY bucket_start
        ORDER BY bucket_start
        """, nativeQuery = true)
    List<Object[]> getActivityTrend(@Param("userId") Long userId,
                                  @Param("activityId") UUID activityId,
                                  @Param("fromInstant") Instant fromInstant,
                                  @Param("toInstant") Instant toInstant,
                                  @Param("grain") String grain,
                                  @Param("tz") String tz);
    
    // Note: getActivityKPIs method removed - now using simpler approach in StatisticsService
    
    /**
     * Find the last date when user has activity records (based on executedAt)
     * Excludes today's date, returns the date as string in YYYY-MM-DD format
     */
    @Query(value = """
        SELECT TO_CHAR(MAX(DATE(executed_at AT TIME ZONE :timezone)), 'YYYY-MM-DD') as last_date
        FROM activity_records 
        WHERE user_id = :userId
          AND DATE(executed_at AT TIME ZONE :timezone) < CURRENT_DATE
        """, nativeQuery = true)
    String findLastRecordDateByUserId(@Param("userId") Long userId, @Param("timezone") String timezone);
    
    /**
     * Find all records for a user on a specific date (based on executedAt)
     * Returns records ordered by createdAt ASC
     */
    @Query(value = """
        SELECT ar.*, a.name as activity_name
        FROM activity_records ar
        JOIN activities a ON ar.activity_id = a.id
        WHERE ar.user_id = :userId
          AND DATE(ar.executed_at AT TIME ZONE :timezone) = CAST(:date AS date)
          AND ar.duration IS NOT NULL
        ORDER BY ar.created_at ASC
        """, nativeQuery = true)
    List<Object[]> findRecordsByUserIdAndDate(@Param("userId") Long userId, 
                                            @Param("date") String date, 
                                            @Param("timezone") String timezone);
    
    /**
     * Calculate total duration for a user on a specific date
     * Returns total duration in seconds
     */
    @Query(value = """
        SELECT COALESCE(SUM(duration), 0)
        FROM activity_records 
        WHERE user_id = :userId
          AND DATE(executed_at AT TIME ZONE :timezone) = CAST(:date AS date)
          AND duration IS NOT NULL
        """, nativeQuery = true)
    Long getTotalDurationByUserIdAndDate(@Param("userId") Long userId, 
                                       @Param("date") String date, 
                                       @Param("timezone") String timezone);
    
    /**
     * Calculate total duration for a user today
     * Returns total duration in seconds
     */
    @Query(value = """
        SELECT COALESCE(SUM(duration), 0)
        FROM activity_records 
        WHERE user_id = :userId
          AND DATE(executed_at AT TIME ZONE :timezone) = CURRENT_DATE
          AND duration IS NOT NULL
        """, nativeQuery = true)
    Long getTodayTotalDurationByUserId(@Param("userId") Long userId, @Param("timezone") String timezone);
}
