package com.ramble.mymomentum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityStatistics {
    private String activityId;
    private String period;              // "week" | "month" | "year"
    private String periodStart;         // ISO 8601 with timezone, e.g., "2025-09-01T00:00:00+08:00"
    private String periodEnd;           // ISO 8601 with timezone, e.g., "2025-09-08T00:00:00+08:00"
    private Integer totalTime;          // Minutes in the selected period, duration NOT NULL
    private Integer weeklyTarget;       // Minutes/week from activity.target_time
    private Double scale;               // week=1.0; month/year = daysInPeriod/7.0
    private Double completionRate;      // totalTime / (weeklyTarget * scale), 0 if denom=0
    private List<WeeklyTrendItem> weeklyTrend; // Last 8 full weeks up to current week
}
