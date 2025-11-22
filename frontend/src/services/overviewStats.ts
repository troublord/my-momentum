import {
  ActivityLogItem,
  ActivityShareItem,
  OverviewKpis,
  OverviewTrendPoint,
  Paginated,
} from "../types";
import { useApi } from "./api";

export interface OverviewRangeQuery {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export interface OverviewTrendQuery extends OverviewRangeQuery {
  grain?: "day";
}

export interface OverviewLogsQuery extends OverviewRangeQuery {
  page: number;
  pageSize: number;
}

export const useOverviewStats = () => {
  const api = useApi();

  const buildRangeParams = (query: OverviewRangeQuery): string => {
    const params = new URLSearchParams({
      startDate: query.from,
      endDate: query.to,
    });
    return params.toString();
  };

  return {
    getOverviewKpis: async (
      query: OverviewRangeQuery
    ): Promise<OverviewKpis | null> => {
      const params = buildRangeParams(query);
      const endpoint = `/api/statistics/overview/kpis?${params}`;
      return api.get<OverviewKpis>(endpoint);
    },

    getOverviewDistribution: async (
      query: OverviewRangeQuery
    ): Promise<ActivityShareItem[] | null> => {
      const params = buildRangeParams(query);
      const endpoint = `/api/statistics/overview/distribution?${params}`;
      return api.get<ActivityShareItem[]>(endpoint);
    },

    getOverviewTrend: async (
      query: OverviewTrendQuery
    ): Promise<OverviewTrendPoint[] | null> => {
      const params = new URLSearchParams({
        startDate: query.from,
        endDate: query.to,
        grain: query.grain ?? "day",
      });
      const endpoint = `/api/statistics/overview/trend?${params.toString()}`;
      return api.get<OverviewTrendPoint[]>(endpoint);
    },

    getOverviewLogs: async (
      query: OverviewLogsQuery
    ): Promise<Paginated<ActivityLogItem> | null> => {
      const params = new URLSearchParams({
        startDate: query.from,
        endDate: query.to,
        page: String(query.page),
        pageSize: String(query.pageSize),
      });
      const endpoint = `/api/statistics/overview/logs?${params.toString()}`;
      return api.get<Paginated<ActivityLogItem>>(endpoint);
    },
  };
};



