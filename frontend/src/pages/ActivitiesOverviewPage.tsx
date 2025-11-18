import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ActivityLogItem,
  ActivityShareItem,
  OverviewKpis,
  OverviewTrendPoint,
  Paginated,
} from "../types";
import { useOverviewStats } from "../services/overviewStats";
import { useError } from "../contexts/ErrorContext";
import { useAuth } from "../contexts/AuthContext";
import IntroPage from "../components/IntroPage";
import Header from "../components/Header";
import KpiCard from "../components/activity/KpiCard";
import ChartCard from "../components/activity/ChartCard";
import ErrorContainer from "../components/ErrorContainer";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  ACTIVITY_ICONS,
  ActivityIconType,
  getEmojiByCode,
} from "../constants/emoji";

type OverviewDateRange = "week" | "last30days";

interface FormattedTrendPoint {
  dateLabel: string;
  minutes: number;
  count: number;
}

interface DonutChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F97316",
  "#6366F1",
  "#EF4444",
  "#06B6D4",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
];

const formatDuration = (seconds: number): string => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} 分`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} 小時`;
  }
  return `${hours} 小時 ${remainingMinutes} 分`;
};

const getDateRange = (
  range: OverviewDateRange
): { from: string; to: string } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (range === "last30days") {
    const last30Days = new Date(today);
    last30Days.setDate(today.getDate() - 29);
    return {
      from: formatDate(last30Days),
      to: formatDate(today),
    };
  }

  // Default: current calendar week (Mon-Sun)
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    from: formatDate(monday),
    to: formatDate(sunday),
  };
};

const ActivitiesOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addError } = useError();
  const { getOverviewKpis, getOverviewDistribution, getOverviewTrend, getOverviewLogs } =
    useOverviewStats();

  const [dateRange, setDateRange] = useState<OverviewDateRange>("week");
  const [{ from, to }, setRange] = useState<{ from: string; to: string }>(
    () => getDateRange("week")
  );

  const [kpis, setKpis] = useState<OverviewKpis | null>(null);
  const [distribution, setDistribution] = useState<ActivityShareItem[]>([]);
  const [trend, setTrend] = useState<OverviewTrendPoint[]>([]);
  const [logsPage, setLogsPage] = useState<Paginated<ActivityLogItem> | null>(
    null
  );

  const [loadingKpis, setLoadingKpis] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    const nextRange = getDateRange(dateRange);
    setRange(nextRange);
  }, [dateRange]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchAllData = async () => {
      setLoadingKpis(true);
      setLoadingCharts(true);
      setLoadingLogs(true);
      try {
        const [kpiData, distData, trendData, logsData] = await Promise.all([
          getOverviewKpis({ from, to }),
          getOverviewDistribution({ from, to }),
          getOverviewTrend({ from, to, grain: "day" }),
          getOverviewLogs({ from, to, page: 0, pageSize: 50 }),
        ]);

        if (kpiData) {
          setKpis(kpiData);
        } else {
          setKpis(null);
        }

        setDistribution(distData ?? []);
        setTrend(trendData ?? []);
        setLogsPage(logsData);
      } catch (error) {
        console.error("Failed to load overview data:", error);
        addError({
          type: "error",
          title: "載入報表失敗",
          message: "無法載入全部活動報表資料，請稍後再試",
          autoHide: true,
          autoHideDelay: 5000,
        });
      } finally {
        setLoadingKpis(false);
        setLoadingCharts(false);
        setLoadingLogs(false);
      }
    };

    fetchAllData();
    // Functions from hooks are stable enough for this use case; avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, isAuthenticated]);

  const handleChangeDateRange = (range: OverviewDateRange) => {
    setDateRange(range);
  };

  const handleChangeLogsPage = async (page: number) => {
    setLoadingLogs(true);
    try {
      const logsData = await getOverviewLogs({
        from,
        to,
        page,
        pageSize: 50,
      });
      setLogsPage(logsData);
    } catch (error) {
      console.error("Failed to load logs page:", error);
      addError({
        type: "error",
        title: "載入紀錄列表失敗",
        message: "無法載入活動紀錄列表，請稍後再試",
        autoHide: true,
        autoHideDelay: 5000,
      });
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const formattedTrendData: FormattedTrendPoint[] = useMemo(() => {
    return trend.map((point) => {
      const date = new Date(point.date);
      const label = date.toLocaleDateString("zh-TW", {
        month: "short",
        day: "numeric",
      });
      return {
        dateLabel: label,
        minutes: Math.round(point.totalDurationSec / 60),
        count: point.totalCount,
      };
    });
  }, [trend]);

  const totalDurationForDistribution = useMemo(() => {
    return distribution.reduce((sum, item) => sum + item.totalDurationSec, 0);
  }, [distribution]);

  const donutData: DonutChartData[] = useMemo(() => {
    if (totalDurationForDistribution === 0) {
      return [];
    }
    return distribution.map((item, index) => ({
      name: item.activityName,
      value: item.totalDurationSec,
      percentage: item.totalDurationSec / totalDurationForDistribution,
      color: COLORS[index % COLORS.length],
    }));
  }, [distribution, totalDurationForDistribution]);

  const donutTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as DonutChartData;
      const percentageText = `${(data.percentage * 100).toFixed(1)}%`;
      const formattedValue = formatDuration(data.value);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-700 text-sm font-medium">{data.name}</p>
          <p className="text-blue-600 text-sm">
            {formattedValue}（{percentageText}）
          </p>
        </div>
      );
    }
    return null;
  };

  const barTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as FormattedTrendPoint;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-blue-600 text-sm">{data.minutes} 分</p>
          <p className="text-gray-500 text-xs">{data.count} 次</p>
        </div>
      );
    }
    return null;
  };

  const formatDateTime = (iso: string): { date: string; time: string; weekday: string } => {
    const date = new Date(iso);
    return {
      date: date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: date.toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      weekday: date.toLocaleDateString("zh-TW", {
        weekday: "short",
      }),
    };
  };

  const resolveActivityIcon = (
    icon: ActivityIconType | string | undefined
  ): string => {
    if (!icon) {
      return "🧩";
    }

    if (icon in ACTIVITY_ICONS) {
      return getEmojiByCode(icon as ActivityIconType);
    }

    return icon;
  };

  if (!isAuthenticated) {
    return <IntroPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title + Date Range Toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <div className="flex items-center mb-1">
              <button
                type="button"
                onClick={handleGoBack}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="返回首頁"
              >
                ←
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                全部活動報表
              </h1>
            </div>
            <p className="text-sm text-gray-600">
              查看指定期間內所有活動的紀錄分佈與趨勢
            </p>
            <p className="text-xs text-gray-500 mt-1">
              範圍：{from} ~ {to}
            </p>
          </div>

          <div className="inline-flex rounded-full bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => handleChangeDateRange("week")}
              className={`px-4 py-2 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dateRange === "week"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              本週
            </button>
            <button
              type="button"
              onClick={() => handleChangeDateRange("last30days")}
              className={`px-4 py-2 text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                dateRange === "last30days"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              最近 30 天
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <KpiCard
            title="總紀錄次數"
            value={kpis ? `${kpis.totalCount} 次` : "--"}
            loading={loadingKpis}
            icon="🧾"
          />
          <KpiCard
            title="總紀錄時間"
            value={kpis ? formatDuration(kpis.totalDurationSec) : "--"}
            loading={loadingKpis}
            icon="⏱️"
          />
          <KpiCard
            title="活躍天數"
            value={kpis ? `${kpis.activeDays} 天` : "--"}
            loading={loadingKpis}
            icon="📅"
          />
          <KpiCard
            title="平均每日時間"
            value={
              kpis ? formatDuration(kpis.avgDurationPerDaySec) : "--"
            }
            loading={loadingKpis}
            icon="📊"
          />
          <KpiCard
            title="相較於前一周"
            value={
              kpis
                ? `${(kpis.weekOverWeekChangePct * 100).toFixed(1)}%`
                : "--"
            }
            change={kpis?.weekOverWeekChangePct}
            loading={loadingKpis}
            icon="📈"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Donut Chart */}
          <ChartCard
            title="活動佔比（依紀錄次數）"
            loading={loadingCharts}
            isEmpty={!loadingCharts && donutData.length === 0}
            emptyMessage="這段期間內尚未有活動紀錄"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={donutTooltip} />
                <Legend />
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Bar Chart */}
          <ChartCard
            title="每日總紀錄時間"
            loading={loadingCharts}
            isEmpty={!loadingCharts && formattedTrendData.length === 0}
            emptyMessage="這段期間內尚未有紀錄"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={barTooltip} />
                <Legend />
                <Bar dataKey="minutes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Activity Logs List */}
        <section className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              活動紀錄列表
            </h2>
            {logsPage && logsPage.total > 0 && (
              <p className="text-xs text-gray-500">
                共 {logsPage.total} 筆紀錄
              </p>
            )}
          </div>

          {loadingLogs ? (
            <div className="py-10 flex items-center justify-center">
              <div className="animate-pulse text-gray-400">載入中...</div>
            </div>
          ) : !logsPage || logsPage.total === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>這段期間內尚未有活動紀錄</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        日期
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        時間
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        活動
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        時長
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        來源
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {logsPage.data.map((item) => {
                      const { date, time, weekday } = formatDateTime(
                        item.executedAt
                      );
                      return (
                        <tr key={item.recordId}>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-800">
                            <span className="block">{date}</span>
                            <span className="text-xs text-gray-500">
                              {weekday}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-800">
                            {time}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-800">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {resolveActivityIcon(item.icon)}
                              </span>
                              <span>{item.activityName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-800">
                            {formatDuration(item.durationSec)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-600">
                            {item.source === "LIVE" ? "即時" : "手動"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  第 {logsPage.page + 1} 頁，共{" "}
                  {Math.max(1, Math.ceil(logsPage.total / logsPage.size))} 頁
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleChangeLogsPage(logsPage.page - 1)}
                    disabled={logsPage.page === 0 || loadingLogs}
                    className={`px-3 py-1 rounded-md text-sm border ${
                      logsPage.page === 0 || loadingLogs
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    上一頁
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeLogsPage(logsPage.page + 1)}
                    disabled={
                      loadingLogs ||
                      (logsPage.page + 1) *
                        logsPage.size >=
                        logsPage.total
                    }
                    className={`px-3 py-1 rounded-md text-sm border ${
                      loadingLogs ||
                      (logsPage.page + 1) * logsPage.size >= logsPage.total
                        ? "text-gray-400 border-gray-200 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    下一頁
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <ErrorContainer />
    </div>
  );
};

export default ActivitiesOverviewPage;


