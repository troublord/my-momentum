package com.ramble.mymomentum.service;

import com.ramble.mymomentum.dto.ActivityStatistics;
import com.ramble.mymomentum.dto.ActivityStatsSimple;
import com.ramble.mymomentum.dto.Summary;
import com.ramble.mymomentum.dto.WeeklyTrendItem;
import org.springframework.data.domain.PageRequest;
import com.ramble.mymomentum.entity.Activity;
import com.ramble.mymomentum.repository.ActivityRepository;
import com.ramble.mymomentum.repository.ActivityRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StatisticsService {

    private final ActivityRecordRepository activityRecordRepository;
    private final ActivityRepository activityRepository;
    private static final ZoneId TAIPEI_ZONE = ZoneId.of("Asia/Taipei");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * Get summary statistics for a specific period (default: current week)
     */
    public Summary getSummary(Long userId, String period) {
        if (period == null) {
            period = "week";
        }
        
        PeriodInfo periodInfo = calculatePeriodBounds(period);
        return calculateSummary(userId, periodInfo);
    }

    /**
     * Get summary statistics for a custom date range
     */
    public Summary getSummaryByDateRange(Long userId, String startDate, String endDate) {
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            
            Instant startInstant = start.atStartOfDay(TAIPEI_ZONE).toInstant();
            Instant endInstant = end.plusDays(1).atStartOfDay(TAIPEI_ZONE).toInstant(); // End is exclusive
            
            long daysInRange = ChronoUnit.DAYS.between(start, end) + 1;
            double scale = daysInRange / 7.0;
            
            PeriodInfo periodInfo = new PeriodInfo(startInstant, endInstant, scale);
            return calculateSummary(userId, periodInfo);
        } catch (Exception e) {
            log.error("Error parsing date range: {} to {}", startDate, endDate, e);
            throw new IllegalArgumentException("Invalid date format. Use YYYY-MM-DD format.");
        }
    }

    /**
     * Get simple activity statistics (for frontend interface compatibility)
     */
    public ActivityStatsSimple getActivityStatistics(UUID activityId, Long userId) {
        // Verify activity belongs to user
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found: " + activityId));
        
        if (!activity.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Activity does not belong to user: " + userId);
        }

        // Calculate all-time total
        Long totalTimeSeconds = activityRecordRepository.getTotalTimeByActivityId(activityId);
        Long totalTimeMinutes = totalTimeSeconds / 60;

        // Calculate current week time
        PeriodInfo currentWeek = calculatePeriodBounds("week");
        Long weeklyTimeMinutes = activityRecordRepository.getActivityMinutesInRange(
                activityId, currentWeek.start(), currentWeek.end());

        // Calculate completion rate for current week
        Integer weeklyTarget = activity.getTargetTime() != null ? activity.getTargetTime() / 60 : 0;
        Double completionRate = weeklyTarget > 0 ? (double) weeklyTimeMinutes / weeklyTarget : 0.0;

        return new ActivityStatsSimple(totalTimeMinutes.intValue(), weeklyTimeMinutes.intValue(), completionRate);
    }

    /**
     * Get comprehensive activity statistics
     */
    public ActivityStatistics getActivityStatisticsDetailed(UUID activityId, Long userId, String period) {
        if (period == null) {
            period = "week";
        }

        // Verify activity belongs to user
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found: " + activityId));
        
        if (!activity.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Activity does not belong to user: " + userId);
        }

        PeriodInfo periodInfo = calculatePeriodBounds(period);
        
        // Calculate total time for the period
        Long totalTimeMinutes = activityRecordRepository.getActivityMinutesInRange(
                activityId, periodInfo.start(), periodInfo.end());

        // Get weekly target
        Integer weeklyTargetMinutes = activity.getTargetTime() != null ? activity.getTargetTime() / 60 : 0;

        // Calculate completion rate
        Double completionRate = 0.0;
        if (weeklyTargetMinutes > 0) {
            double scaledTarget = weeklyTargetMinutes * periodInfo.scale();
            completionRate = totalTimeMinutes / scaledTarget;
        }

        // Get weekly trend (last 8 weeks)
        List<WeeklyTrendItem> weeklyTrend = getWeeklyTrendForActivity(activityId);

        // Format period start/end
        ZonedDateTime startZoned = periodInfo.start().atZone(TAIPEI_ZONE);
        ZonedDateTime endZoned = periodInfo.end().atZone(TAIPEI_ZONE);
        String periodStart = startZoned.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        String periodEnd = endZoned.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

        return new ActivityStatistics(
                activityId.toString(),
                period,
                periodStart,
                periodEnd,
                totalTimeMinutes.intValue(),
                weeklyTargetMinutes,
                periodInfo.scale(),
                completionRate,
                weeklyTrend
        );
    }

    /**
     * Get weekly trend for all user activities
     */
    public List<WeeklyTrendItem> getWeeklyTrend(Long userId, UUID activityId) {
        if (activityId != null) {
            // Verify activity belongs to user
            Activity activity = activityRepository.findById(activityId)
                    .orElseThrow(() -> new IllegalArgumentException("Activity not found: " + activityId));
            
            if (!activity.getUserId().equals(userId)) {
                throw new IllegalArgumentException("Activity does not belong to user: " + userId);
            }
            
            return getWeeklyTrendForActivity(activityId);
        } else {
            return getWeeklyTrendForUser(userId);
        }
    }

    // Private helper methods

    private Summary calculateSummary(Long userId, PeriodInfo periodInfo) {
        // 1. Calculate total time
        Long totalMinutes = activityRecordRepository.getTotalMinutesInRange(
                userId, periodInfo.start(), periodInfo.end());

        // 2. Find most frequent activity
        String mostFrequentActivity = null;
        List<UUID> topActivityIds = activityRecordRepository.findTopActivityByDurationIds(
                userId, periodInfo.start(), periodInfo.end(), PageRequest.of(0, 1));
        UUID topActivityId = !topActivityIds.isEmpty() ? topActivityIds.get(0) : null;
        
        if (topActivityId != null) {
            Activity activity = activityRepository.findById(topActivityId).orElse(null);
            if (activity != null) {
                mostFrequentActivity = activity.getName();
            }
        }

        // 3. Calculate completion rate
        Integer weeklyTargetSum = activityRepository.getWeeklyTargetSumInMinutes(userId);
        Double completionRate = 0.0;
        
        if (weeklyTargetSum > 0) {
            double scaledTarget = weeklyTargetSum * periodInfo.scale();
            completionRate = totalMinutes / scaledTarget;
        }

        return new Summary(totalMinutes.intValue(), mostFrequentActivity, completionRate);
    }

    private PeriodInfo calculatePeriodBounds(String period) {
        ZonedDateTime now = ZonedDateTime.now(TAIPEI_ZONE);
        ZonedDateTime start;
        ZonedDateTime end;
        double scale;

        switch (period.toLowerCase()) {
            case "week" -> {
                start = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                          .truncatedTo(ChronoUnit.DAYS);
                end = start.plusWeeks(1);
                scale = 1.0;
            }
            case "month" -> {
                start = now.with(TemporalAdjusters.firstDayOfMonth())
                          .truncatedTo(ChronoUnit.DAYS);
                end = start.plusMonths(1);
                long daysInMonth = ChronoUnit.DAYS.between(start, end);
                scale = daysInMonth / 7.0;
            }
            case "year" -> {
                start = now.with(TemporalAdjusters.firstDayOfYear())
                          .truncatedTo(ChronoUnit.DAYS);
                end = start.plusYears(1);
                long daysInYear = ChronoUnit.DAYS.between(start, end);
                scale = daysInYear / 7.0;
            }
            default -> throw new IllegalArgumentException("Invalid period: " + period + ". Must be 'week', 'month', or 'year'.");
        }

        return new PeriodInfo(start.toInstant(), end.toInstant(), scale);
    }

    private List<WeeklyTrendItem> getWeeklyTrendForUser(Long userId) {
        // Calculate start of 8 weeks ago
        ZonedDateTime now = ZonedDateTime.now(TAIPEI_ZONE);
        ZonedDateTime earliestWeekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .truncatedTo(ChronoUnit.DAYS)
                .minusWeeks(7); // 8 weeks total including current week

        List<Object[]> results = activityRecordRepository.getWeeklyTrendForUser(
                userId, earliestWeekStart.toInstant());

        return processWeeklyTrendResults(results, earliestWeekStart);
    }

    private List<WeeklyTrendItem> getWeeklyTrendForActivity(UUID activityId) {
        // Calculate start of 8 weeks ago
        ZonedDateTime now = ZonedDateTime.now(TAIPEI_ZONE);
        ZonedDateTime earliestWeekStart = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .truncatedTo(ChronoUnit.DAYS)
                .minusWeeks(7); // 8 weeks total including current week

        List<Object[]> results = activityRecordRepository.getWeeklyTrendForActivity(
                activityId, earliestWeekStart.toInstant());

        return processWeeklyTrendResults(results, earliestWeekStart);
    }

    private List<WeeklyTrendItem> processWeeklyTrendResults(List<Object[]> results, ZonedDateTime earliestWeekStart) {
        // Convert results to map for easy lookup
        Map<String, Integer> weeklyData = results.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],  // weekStart
                        row -> ((Number) row[1]).intValue()  // totalMinutes
                ));

        // Generate all 8 weeks and fill with data or 0
        List<WeeklyTrendItem> trend = new ArrayList<>();
        ZonedDateTime currentWeek = earliestWeekStart;
        
        for (int i = 0; i < 8; i++) {
            String weekStartStr = currentWeek.format(DATE_FORMATTER);
            Integer minutes = weeklyData.getOrDefault(weekStartStr, 0);
            trend.add(new WeeklyTrendItem(weekStartStr, minutes));
            currentWeek = currentWeek.plusWeeks(1);
        }

        return trend;
    }

    // Helper record for period information
    private record PeriodInfo(Instant start, Instant end, double scale) {}
}
