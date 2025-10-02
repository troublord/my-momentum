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
  dateRange: string; // 新增日期區間選項
}

const ActivityDetailCharts: React.FC<ActivityDetailChartsProps> = ({
  activityId,
}) => {
  const { getDistribution, getTrend, getKpis } = useActivityStats();
  const { addError } = useError();

  // Helper function to get date ranges
  const getDateRange = (range: string): { fromDate: string; toDate: string } => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case 'last7days':
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 6); // 包含今天，所以是7天
        return {
          fromDate: last7Days.toISOString().split('T')[0],
          toDate: today.toISOString().split('T')[0]
        };
      
      case 'last30days':
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 29); // 包含今天，所以是30天
        return {
          fromDate: last30Days.toISOString().split('T')[0],
          toDate: today.toISOString().split('T')[0]
        };
      
      case 'currentMonth':
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        return {
          fromDate: firstDay.toISOString().split('T')[0],
          toDate: lastDay.toISOString().split('T')[0]
        };
      
      case 'last3months':
        const last3Months = new Date(today);
        last3Months.setMonth(today.getMonth() - 3);
        return {
          fromDate: last3Months.toISOString().split('T')[0],
          toDate: today.toISOString().split('T')[0]
        };
      
      case 'custom':
      default:
        return {
          fromDate: controls?.fromDate || today.toISOString().split('T')[0],
          toDate: controls?.toDate || today.toISOString().split('T')[0]
        };
    }
  };

  // State for controls
  const [controls, setControls] = useState<ChartControls>(() => {
    const { fromDate, toDate }: { fromDate: string; toDate: string } = getDateRange('last30days');
    return {
      metric: "duration",
      grain: "day",
      fromDate,
      toDate,
      dateRange: "last30days",
    };
  });

  // State for data
  const [distributionData, setDistributionData] = useState<DistributionPoint[]>(
    []
  );
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [kpisData, setKpisData] = useState<ActivityKpis | null>(null);
  
  // State for validation
  const [isDateRangeValid, setIsDateRangeValid] = useState(true);

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
        grain: controls.grain
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
  }, [activityId, controls.fromDate, controls.toDate, controls.grain, addError]);

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

  // Align date to appropriate period start based on grain
  const alignDateToPeriodStart = (date: string, grain: Grain): string => {
    const dateObj = new Date(date);
    
    switch (grain) {
      case 'week':
        // Align to Monday of the week
        const dayOfWeek = dateObj.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0, Monday = 1
        const monday = new Date(dateObj);
        monday.setDate(dateObj.getDate() + mondayOffset);
        return monday.toISOString().split('T')[0];
      
      case 'month':
        // Align to first day of the month
        const firstDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
        return firstDay.toISOString().split('T')[0];
      
      case 'day':
      default:
        // No alignment needed for day grain
        return date;
    }
  };

  // Validate date range based on grain
  const validateDateRange = (fromDate: string, toDate: string, grain: Grain): boolean => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    // Check if dates are valid
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return false;
    }
    
    // Check if from date is before to date
    if (from > to) {
      return false;
    }
    
    // Calculate days difference
    const timeDiff = to.getTime() - from.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Check limits based on grain
    switch (grain) {
      case 'day':
        return daysDiff <= 90;
      case 'week':
        return daysDiff <= 365;
      case 'month':
        return daysDiff <= 1095; // 3 years
      default:
        return true;
    }
  };

  // Handle date range change
  const handleDateRangeChange = (newRange: string) => {
    if (newRange === 'custom') {
      setControls(prev => ({ ...prev, dateRange: newRange }));
      setIsDateRangeValid(true); // Reset validation when switching to custom
    } else {
      const { fromDate, toDate } = getDateRange(newRange);
      
      // Align fromDate to current grain period start
      const alignedFromDate = alignDateToPeriodStart(fromDate, controls.grain);
      const wasAligned = alignedFromDate !== fromDate;
      
      // Show info message if date was aligned
      if (wasAligned) {
        const grainText = controls.grain === 'week' ? '週' : controls.grain === 'month' ? '月' : '天';
        addError({
          type: "info",
          title: "日期已調整",
          message: `開始日期已調整到${grainText}的開始點，以確保資料完整性`,
          autoHide: true,
          autoHideDelay: 3000,
        });
      }
      
      setControls(prev => ({
        ...prev,
        dateRange: newRange,
        fromDate: alignedFromDate,
        toDate,
      }));
      setIsDateRangeValid(true); // Preset ranges are always valid
    }
  };

  // Handle manual date change
  const handleDateChange = (field: 'fromDate' | 'toDate', value: string) => {
    const newFromDate = field === 'fromDate' ? value : controls.fromDate;
    const newToDate = field === 'toDate' ? value : controls.toDate;
    
    // Align fromDate to period start if needed
    const alignedFromDate = alignDateToPeriodStart(newFromDate, controls.grain);
    const wasAligned = alignedFromDate !== newFromDate;
    
    const isValid = validateDateRange(alignedFromDate, newToDate, controls.grain);
    
    if (!isValid) {
      setIsDateRangeValid(false);
      addError({
        type: "error",
        title: "日期範圍無效",
        message: `根據當前時間粒度，日期範圍限制為：天(90天)、週(365天)、月(3年)`,
        autoHide: true,
        autoHideDelay: 5000,
      });
      return;
    }
    
    // Show info message if date was aligned
    if (wasAligned) {
      const grainText = controls.grain === 'week' ? '週' : controls.grain === 'month' ? '月' : '天';
      addError({
        type: "info",
        title: "日期已調整",
        message: `開始日期已調整到${grainText}的開始點，以確保資料完整性`,
        autoHide: true,
        autoHideDelay: 3000,
      });
    }
    
    setIsDateRangeValid(true);
    setControls(prev => ({
      ...prev,
      fromDate: alignedFromDate,
      [field]: field === 'fromDate' ? alignedFromDate : value,
    }));
  };

  // Fetch all data when controls change
  useEffect(() => {
    // Only fetch data if date range is valid
    if (isDateRangeValid) {
      fetchDistribution();
      fetchTrend();
      fetchKpis();
    } else {
      // Clear data when invalid
      setDistributionData([]);
      setTrendData([]);
      setKpisData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityId, controls.fromDate, controls.toDate, controls.grain, isDateRangeValid]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Date Range Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              時間範圍
            </label>
            <select
              value={controls.dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="last7days">最近7天</option>
              <option value="last30days">最近30天</option>
              <option value="currentMonth">當月</option>
              <option value="last3months">最近3個月</option>
              <option value="custom">自定義</option>
            </select>
          </div>

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
              onChange={(e) => {
                const newGrain = e.target.value as Grain;
                
                // Align fromDate to new grain period start if custom range
                if (controls.dateRange === 'custom') {
                  const alignedFromDate = alignDateToPeriodStart(controls.fromDate, newGrain);
                  const wasAligned = alignedFromDate !== controls.fromDate;
                  
                  const isValid = validateDateRange(alignedFromDate, controls.toDate, newGrain);
                  
                  if (!isValid) {
                    setIsDateRangeValid(false);
                    addError({
                      type: "error",
                      title: "日期範圍無效",
                      message: `根據當前時間粒度，日期範圍限制為：天(90天)、週(365天)、月(3年)`,
                      autoHide: true,
                      autoHideDelay: 5000,
                    });
                    return;
                  }
                  
                  // Show info message if date was aligned
                  if (wasAligned) {
                    const grainText = newGrain === 'week' ? '週' : newGrain === 'month' ? '月' : '天';
                    addError({
                      type: "info",
                      title: "日期已調整",
                      message: `開始日期已調整到${grainText}的開始點，以確保資料完整性`,
                      autoHide: true,
                      autoHideDelay: 3000,
                    });
                  }
                  
                  setControls((prev) => ({
                    ...prev,
                    grain: newGrain,
                    fromDate: alignedFromDate,
                  }));
                  setIsDateRangeValid(true);
                } else {
                  setControls((prev) => ({
                    ...prev,
                    grain: newGrain,
                  }));
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="day">天</option>
              <option value="week">週</option>
              <option value="month">月</option>
            </select>
          </div>

          {/* From Date - Only show when custom is selected */}
          {controls.dateRange === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                開始日期
              </label>
              <input
                type="date"
                value={controls.fromDate}
                onChange={(e) => handleDateChange('fromDate', e.target.value)}
                className={`w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isDateRangeValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
            </div>
          )}

          {/* To Date - Only show when custom is selected */}
          {controls.dateRange === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                結束日期
              </label>
              <input
                type="date"
                value={controls.toDate}
                onChange={(e) => handleDateChange('toDate', e.target.value)}
                className={`w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !isDateRangeValid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
            </div>
          )}
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
