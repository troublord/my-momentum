import { Summary } from "../types";
import { useApi } from "./api";

export const useStatistics = () => {
  const api = useApi();

  return {
    // 獲取總體統計數據
    getSummary: () => {
      return api.get<Summary>("/api/statistics/summary");
    },

    // 獲取特定時間範圍的統計數據
    getSummaryByDateRange: (startDate: string, endDate: string) => {
      return api.get<Summary>(
        `/api/statistics/summary?startDate=${startDate}&endDate=${endDate}`
      );
    },

    // 獲取特定活動的統計數據
    getActivityStatistics: (activityId: string) => {
      return api.get<{
        totalTime: number;
        weeklyTime: number;
        completionRate: number;
      }>(`/api/statistics/activities/${activityId}`);
    },

    // 獲取週趨勢數據
    getWeeklyTrend: (activityId?: string) => {
      const endpoint = activityId
        ? `/api/statistics/weekly-trend?activityId=${activityId}`
        : "/api/statistics/weekly-trend";
      return api.get<
        {
          date: string;
          totalTime: number;
        }[]
      >(endpoint);
    },
  };
};
