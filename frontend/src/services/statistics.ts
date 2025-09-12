import {
  Summary,
  Period,
  DateRange,
  ActivityStatistics,
  DetailedActivityStatistics,
  WeeklyTrendResponse,
} from "../types";
import { useApi } from "./api";

export const useStatistics = () => {
  const api = useApi();

  return {
    // 獲取統計摘要（簡化版 - 預設當前週）
    getSummary: () => {
      return api.get<Summary>("/api/statistics/summary");
    },

    // 獲取統計摘要（指定參數）
    getSummaryByPeriod: (period: Period) => {
      return api.get<Summary>(
        `/api/statistics/summary/period?period=${period}`
      );
    },

    // 獲取統計摘要（指定日期範圍）
    getSummaryByDateRange: (dateRange: DateRange) => {
      return api.get<Summary>(
        `/api/statistics/summary/period?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
    },

    // 獲取特定活動的統計數據（簡化）
    getActivityStatistics: (activityId: string) => {
      return api.get<ActivityStatistics>(
        `/api/statistics/activities/${activityId}`
      );
    },

    // 獲取特定活動的詳細統計
    getDetailedActivityStatistics: (activityId: string, period: Period) => {
      return api.get<DetailedActivityStatistics>(
        `/api/statistics/activities/${activityId}/detailed?period=${period}`
      );
    },

    // 獲取週趨勢數據（最近 8 週）
    getWeeklyTrend: (activityId?: string) => {
      const endpoint = activityId
        ? `/api/statistics/weekly-trend?activityId=${activityId}`
        : "/api/statistics/weekly-trend";
      return api.get<WeeklyTrendResponse>(endpoint);
    },
  };
};
