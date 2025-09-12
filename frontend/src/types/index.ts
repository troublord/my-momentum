import { ActivityIconType } from "../constants/emoji";

export interface Activity {
  id: string;
  name: string;
  totalTime: number; // 分鐘
  weeklyTime: number; // 分鐘
  targetTime: number; // 每週目標分鐘
  color: string;
  icon: ActivityIconType;
}

export interface Summary {
  weeklyTotalTime: number;
  mostFrequentActivity: string;
  completionRate: number;
}

// Activity Statistics Types
export type Metric = "duration" | "count"; // duration in seconds or record count
export type Grain = "day" | "week" | "month";

export interface DistributionPoint {
  date: string; // ISO date (e.g., "2025-09-01")
  durationSec: number; // total seconds in that day/week/month (for this activity)
  count: number; // total records in that day/week/month (for this activity)
}

export interface TrendPoint {
  periodStart: string; // ISO date of period start (week/month)
  totalDurationSec: number;
  totalCount: number;
}

export interface ActivityKpis {
  avgDurationSec: number;
  maxSingleDurationSec: number;
  weekOverWeekChangePct: number; // -0.2 ~ +0.2 (relative change vs previous week)
}

// Statistics Service Types
export type Period = "week" | "month" | "year";

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export interface ActivityStatistics {
  activityId: string;
  activityName: string;
  totalTime: number; // minutes
  totalRecords: number;
  averageTime: number; // minutes per record
  lastRecordDate: string; // ISO date
}

export interface DetailedActivityStatistics extends ActivityStatistics {
  weeklyBreakdown: {
    week: string; // ISO date (start of week)
    totalTime: number; // minutes
    recordCount: number;
  }[];
  dailyAverage: number; // minutes per day
  peakDay: string; // day of week with most activity
  consistency: number; // 0-1 score
}

export interface WeeklyTrendResponse {
  weeks: {
    weekStart: string; // ISO date
    totalTime: number; // minutes
    totalRecords: number;
    activities: {
      activityId: string;
      activityName: string;
      time: number; // minutes
      records: number;
    }[];
  }[];
}
