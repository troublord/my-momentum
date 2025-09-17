import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DistributionPoint,
  TrendPoint,
  ActivityKpis,
  Metric,
  Grain,
} from "../../types";
import { useActivityStats } from "../../services/activityStats";
import { useError } from "../../contexts/ErrorContext";
import ChartCard from "./ChartCard";
import KpiCard from "./KpiCard";

interface ActivityDetailChartsProps {
  activityId: string;
}

interface ChartControls {
  metric: Metric;
  grain: Grain;
  fromDate: string;
  toDate: string;
}

const ActivityDetailCharts: React.FC<ActivityDetailChartsProps> = ({
  activityId,
}) => {
  const { getDistribution, getTrend, getKpis } = useActivityStats();
  const { addError } = useError();

  // State for controls
  const [controls, setControls] = useState<ChartControls>({
    metric: "duration",
    grain: "day",
    fromDate: "2025-09-01",
    toDate: "2025-09-30",
  });

  // State for data
  const [distributionData, setDistributionData] = useState<DistributionPoint[]>(
    []
  );
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [kpisData, setKpisData] = useState<ActivityKpis | null>(null);

  // Loading states
  const [distributionLoading, setDistributionLoading] = useState(false);
  const [trendLoading, setTrendLoading] = useState(false);
  const [kpisLoading, setKpisLoading] = useState(false);

  // Fetch distribution data
  const fetchDistribution = useCallback(async () => {
    setDistributionLoading(true);
    try {
      const data = await getDistribution(activityId, {
        from: controls.fromDate,
        to: controls.toDate,
        grain: controls.grain,
      });
      setDistributionData(data || []);
    } catch (error) {
      console.error("Failed to fetch distribution data:", error);
      setDistributionData([]);
      addError({
        type: "error",
        title: "載入分佈數據失敗",
        message: "無法載入活動分佈數據，請稍後再試",
        autoHide: true,
        autoHideDelay: 5000,
      });
    } finally {
      setDistributionLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activityId,
    controls.fromDate,
    controls.toDate,
    controls.grain,
    addError,
  ]);

  // Fetch trend data
  const fetchTrend = useCallback(async () => {
    setTrendLoading(true);
    try {
      const data = await getTrend(activityId, {
        from: controls.fromDate,
        to: controls.toDate,
        grain: "week", // Default to week for trend
      });
      setTrendData(data || []);
    } catch (error) {
      console.error("Failed to fetch trend data:", error);
      setTrendData([]);
      addError({
        type: "error",
        title: "載入趨勢數據失敗",
        message: "無法載入活動趨勢數據，請稍後再試",
        autoHide: true,
        autoHideDelay: 5000,
      });
    } finally {
      setTrendLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId, controls.fromDate, controls.toDate, addError]);

  // Fetch KPIs data
  const fetchKpis = useCallback(async () => {
    setKpisLoading(true);
    try {
      console.log("🔍 獲取 KPI 數據...", {
        activityId,
        from: controls.fromDate,
        to: controls.toDate,
      });
      const data = await getKpis(activityId, {
        from: controls.fromDate,
        to: controls.toDate,
      });
      console.log("✅ KPI 數據獲取成功:", data);
      setKpisData(data);
    } catch (error) {
      console.error("❌ 獲取 KPI 數據失敗:", error);
      setKpisData(null);
      addError({
        type: "error",
        title: "載入 KPI 數據失敗",
        message: "無法載入活動 KPI 數據，請稍後再試",
        autoHide: true,
        autoHideDelay: 5000,
      });
    } finally {
      setKpisLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId, controls.fromDate, controls.toDate, addError]);

  // Fetch all data when controls change
  useEffect(() => {
    fetchDistribution();
    fetchTrend();
    fetchKpis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId, controls.fromDate, controls.toDate, controls.grain]);

  // Format data for charts
  const formatDistributionData = () => {
    return distributionData.map((point) => ({
      date: formatDateLabel(point.date),
      minutes: Math.round(point.durationSec / 60),
      count: point.count,
      originalDate: point.date,
    }));
  };

  const formatTrendData = () => {
    return trendData.map((point) => ({
      period: formatDateLabel(point.periodStart),
      minutes: Math.round(point.totalDurationSec / 60),
      count: point.totalCount,
      originalDate: point.periodStart,
    }));
  };

  // Format date labels based on grain
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);

    switch (controls.grain) {
      case "day":
        return date.toLocaleDateString("zh-TW", {
          month: "short",
          day: "numeric",
        });
      case "week":
        // 顯示週的開始日期
        const weekStart = new Date(date);
        const dayOfWeek = weekStart.getDay();
        const diff =
          weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // 週一為開始
        weekStart.setDate(diff);
        return `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      case "month":
        return date.toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "short",
        });
      default:
        return date.toLocaleDateString("zh-TW", {
          month: "short",
          day: "numeric",
        });
    }
  };

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} 分`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} 小時 ${remainingMinutes} 分`;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{label}</p>
          {controls.metric === "duration" ? (
            <p className="text-blue-600 font-medium">{data.minutes} 分</p>
          ) : (
            <p className="text-blue-600 font-medium">{data.count} 次</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric Switch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              指標
            </label>
            <select
              value={controls.metric}
              onChange={(e) =>
                setControls((prev) => ({
                  ...prev,
                  metric: e.target.value as Metric,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="duration">時間 (分鐘)</option>
              <option value="count">次數</option>
            </select>
          </div>

          {/* Grain Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              時間粒度
            </label>
            <select
              value={controls.grain}
              onChange={(e) =>
                setControls((prev) => ({
                  ...prev,
                  grain: e.target.value as Grain,
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="day">天</option>
              <option value="week">週</option>
              <option value="month">月</option>
            </select>
          </div>

          {/* From Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              開始日期
            </label>
            <input
              type="date"
              value={controls.fromDate}
              onChange={(e) =>
                setControls((prev) => ({ ...prev, fromDate: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* To Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              結束日期
            </label>
            <input
              type="date"
              value={controls.toDate}
              onChange={(e) =>
                setControls((prev) => ({ ...prev, toDate: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="平均每次時長"
          value={kpisData ? formatDuration(kpisData.avgDurationSec) : "--"}
          loading={kpisLoading}
          icon="⏱️"
        />
        <KpiCard
          title="最長單次時長"
          value={
            kpisData ? formatDuration(kpisData.maxSingleDurationSec) : "--"
          }
          loading={kpisLoading}
          icon="🏆"
        />
        <KpiCard
          title="週環比變化"
          value={
            kpisData
              ? `${(kpisData.weekOverWeekChangePct * 100).toFixed(1)}%`
              : "--"
          }
          change={kpisData?.weekOverWeekChangePct}
          loading={kpisLoading}
          icon="📈"
        />
      </div>

      {/* Distribution Chart */}
      <ChartCard
        title="活動分佈"
        loading={distributionLoading}
        isEmpty={distributionData.length === 0}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatDistributionData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey={controls.metric === "duration" ? "minutes" : "count"}
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Trend Chart */}
      <ChartCard
        title="趨勢分析"
        loading={trendLoading}
        isEmpty={trendData.length === 0}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatTrendData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={controls.metric === "duration" ? "minutes" : "count"}
              stroke="#3B82F6"
              strokeWidth={3}
              dot={false}
              name={controls.metric === "duration" ? "時間 (分鐘)" : "次數"}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default ActivityDetailCharts;
