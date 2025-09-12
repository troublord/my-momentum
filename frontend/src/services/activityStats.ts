import { DistributionPoint, TrendPoint, ActivityKpis, Grain } from "../types";
import { useApi } from "./api";

export interface DistributionQuery {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  grain: Grain; // day | week | month
}

export interface TrendQuery {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  grain: "week" | "month"; // Only week or month for trend
}

export interface KpisQuery {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export const useActivityStats = () => {
  const api = useApi();

  return {
    // Get distribution data for bar chart
    getDistribution: async (
      activityId: string,
      query: DistributionQuery
    ): Promise<DistributionPoint[] | null> => {
      const params = new URLSearchParams({
        from: query.from,
        to: query.to,
        grain: query.grain,
      });

      const endpoint = `/api/activities/${activityId}/distribution?${params.toString()}`;
      return api.get<DistributionPoint[]>(endpoint);
    },

    // Get trend data for line chart
    getTrend: async (
      activityId: string,
      query: TrendQuery
    ): Promise<TrendPoint[] | null> => {
      const params = new URLSearchParams({
        from: query.from,
        to: query.to,
        grain: query.grain,
      });

      const endpoint = `/api/activities/${activityId}/trend?${params.toString()}`;
      return api.get<TrendPoint[]>(endpoint);
    },

    // Get KPI data
    getKpis: async (
      activityId: string,
      query: KpisQuery
    ): Promise<ActivityKpis | null> => {
      const params = new URLSearchParams({
        from: query.from,
        to: query.to,
      });

      const endpoint = `/api/activities/${activityId}/kpis?${params.toString()}`;
      return api.get<ActivityKpis>(endpoint);
    },
  };
};
