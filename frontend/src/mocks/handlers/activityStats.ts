import { http, HttpResponse } from "msw";
import { DistributionPoint, TrendPoint, ActivityKpis } from "../../types";

// Mock data generators
const generateDistributionData = (
  from: string,
  to: string,
  grain: string
): DistributionPoint[] => {
  const startDate = new Date(from);
  const endDate = new Date(to);
  const data: DistributionPoint[] = [];

  let current = new Date(startDate);
  while (current <= endDate) {
    const dateStr = current.toISOString().split("T")[0];

    // Generate some realistic mock data
    const hasActivity = Math.random() > 0.3; // 70% chance of having activity
    const durationSec = hasActivity
      ? Math.floor(Math.random() * 3600) + 600
      : 0; // 10min to 1hr
    const count = hasActivity ? Math.floor(Math.random() * 3) + 1 : 0; // 1-3 records

    data.push({
      date: dateStr,
      durationSec,
      count,
    });

    // Increment date based on grain
    if (grain === "day") {
      current.setDate(current.getDate() + 1);
    } else if (grain === "week") {
      current.setDate(current.getDate() + 7);
    } else if (grain === "month") {
      current.setMonth(current.getMonth() + 1);
    }
  }

  return data;
};

const generateTrendData = (
  from: string,
  to: string,
  grain: string
): TrendPoint[] => {
  const data: TrendPoint[] = [];
  const startDate = new Date(from);
  const endDate = new Date(to);

  let current = new Date(startDate);
  while (current <= endDate) {
    const periodStart = current.toISOString().split("T")[0];

    // Generate trend data with some growth pattern
    const weekNumber = Math.floor(
      (current.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    const baseTime = 3600 + weekNumber * 200; // Gradual increase
    const variation = Math.random() * 1800; // Random variation

    data.push({
      periodStart,
      totalDurationSec: Math.floor(baseTime + variation),
      totalCount: Math.floor((baseTime + variation) / 900), // Roughly 15min per record
    });

    // Increment based on grain
    if (grain === "week") {
      current.setDate(current.getDate() + 7);
    } else if (grain === "month") {
      current.setMonth(current.getMonth() + 1);
    }
  }

  return data;
};

const generateKpisData = (): ActivityKpis => {
  return {
    avgDurationSec: 1550,
    maxSingleDurationSec: 4800,
    weekOverWeekChangePct: 0.18,
  };
};

// MSW handlers
export const activityStatsHandlers = [
  // Distribution endpoint
  http.get(
    "http://localhost:8080/api/activities/:id/distribution",
    ({ params, request }) => {
      const url = new URL(request.url);
      const from = url.searchParams.get("from") || "2025-09-01";
      const to = url.searchParams.get("to") || "2025-09-30";
      const grain = url.searchParams.get("grain") || "day";

      const data = generateDistributionData(from, to, grain);
      return HttpResponse.json(data);
    }
  ),

  // Trend endpoint
  http.get(
    "http://localhost:8080/api/activities/:id/trend",
    ({ params, request }) => {
      const url = new URL(request.url);
      const from = url.searchParams.get("from") || "2025-06-01";
      const to = url.searchParams.get("to") || "2025-09-30";
      const grain = url.searchParams.get("grain") || "week";

      const data = generateTrendData(from, to, grain);
      return HttpResponse.json(data);
    }
  ),

  // KPIs endpoint
  http.get(
    "http://localhost:8080/api/activities/:id/kpis",
    ({ params, request }) => {
      const data = generateKpisData();
      return HttpResponse.json(data);
    }
  ),
];
