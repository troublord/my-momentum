import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Activity } from "../types";
import { useActivities } from "../services/activities";
import { useRecords } from "../services/records";
import { useAuth } from "../contexts/AuthContext";
import ActivityDetailCharts from "../components/activity/ActivityDetailCharts";
import ErrorContainer from "../components/ErrorContainer";

const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getActivity } = useActivities();
  const { listRecords } = useRecords();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityData = useCallback(async () => {
    if (!id) {
      navigate("/");
      return;
    }

    // 只有在已認證時才執行 API 請求
    if (!isAuthenticated) {
      console.log("🔐 Not authenticated yet, skipping API calls");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Fetching activity data...");
      // Fetch activity details
      const activityData = await getActivity(id);
      if (!activityData) {
        setError("活動不存在");
        return;
      }
      setActivity(activityData);

      // Fetch total records count
      const recordsData = await listRecords({
        activityId: id,
        page: 1,
        size: 1, // We only need the total count
      });
      if (recordsData) {
        setTotalRecords(recordsData.total);
      }
    } catch (err) {
      console.error("Failed to fetch activity data:", err);
      setError("載入活動資料失敗");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, isAuthenticated]);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} 分鐘`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} 小時`;
    return `${hours} 小時 ${remainingMinutes} 分鐘`;
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">載入中...</div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            {error || "活動不存在"}
          </div>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={handleGoBack}
              className="mr-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="返回"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-gray-900">活動詳情</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Activity Header Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: activity.color + "20" }}
              >
                {activity.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activity.name}
                </h2>
                <p className="text-gray-600">活動統計與分析</p>
              </div>
            </div>

            <div className="text-left lg:text-right">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-500">累計時間</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatDuration(activity.totalTime)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">總記錄數</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalRecords} 次
                  </div>
                </div>
              </div>

              {/* Goal Progress Placeholder */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">週目標進度</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (activity.weeklyTime / activity.targetTime) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">
                    {Math.round(
                      (activity.weeklyTime / activity.targetTime) * 100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <ActivityDetailCharts activityId={activity.id} />
      </div>
      <ErrorContainer />
    </div>
  );
};

export default ActivityDetailPage;
