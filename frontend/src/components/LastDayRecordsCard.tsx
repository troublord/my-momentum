import React from "react";
import { LastDayRecordsResponse } from "../types";

interface LastDayRecordsCardProps {
  data: LastDayRecordsResponse | null;
  loading: boolean;
  error: boolean;
}

const LastDayRecordsCard: React.FC<LastDayRecordsCardProps> = ({
  data,
  loading,
  error,
}) => {
  // 格式化日期顯示 (YYYY-MM-DD -> YYYY/MM/DD)
  const formatDate = (dateString: string): string => {
    return dateString.replace(/-/g, "/");
  };

  // 格式化來源顯示
  const formatSource = (source: "LIVE" | "MANUAL"): string => {
    return source === "LIVE" ? "即時" : "手動";
  };

  // 將秒數轉換為分鐘（四捨五入）
  const secondsToMinutes = (seconds: number): number => {
    return Math.round(seconds / 60);
  };

  // 將分鐘轉換為小時分鐘格式
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} 分鐘`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} 小時`;
    } else {
      return `${hours} 小時${remainingMinutes} 分鐘`;
    }
  };

  // 計算比較文字（輸入為秒數）
  const getComparisonText = (todaySeconds: number, lastDaySeconds: number): string => {
    const todayMinutes = secondsToMinutes(todaySeconds);
    const lastDayMinutes = secondsToMinutes(lastDaySeconds);
    
    if (todayMinutes === lastDayMinutes) {
      return "與上次相同";
    } else if (todayMinutes > lastDayMinutes) {
      const diff = todayMinutes - lastDayMinutes;
      return `比上次多 ${diff} 分鐘`;
    } else {
      const diff = lastDayMinutes - todayMinutes;
      return `比上次少 ${diff} 分鐘`;
    }
  };

  // 獲取比較顏色（輸入為秒數）
  const getComparisonColor = (todaySeconds: number, lastDaySeconds: number): string => {
    const todayMinutes = secondsToMinutes(todaySeconds);
    const lastDayMinutes = secondsToMinutes(lastDaySeconds);
    
    if (todayMinutes === lastDayMinutes) {
      return "text-gray-600";
    } else if (todayMinutes > lastDayMinutes) {
      return "text-green-600";
    } else {
      return "text-orange-600";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null; // 錯誤時隱藏整個區塊
  }

  // 如果沒有上次活動日資料，顯示空狀態
  if (!data.lastDate || data.records.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">上次活動日</h3>
        <div className="text-center py-12 text-gray-500">
          <div className="text-5xl mb-3">📅</div>
          <div className="text-lg font-medium mb-2">尚無上次活動紀錄</div>
          <div className="text-sm">開始記錄您的第一個活動吧！</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* 標題 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">上次活動日</h3>

      {/* 日期 */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">日期</div>
        <div className="text-lg font-medium text-gray-900">
          {formatDate(data.lastDate)}
        </div>
      </div>

      {/* 活動紀錄清單 */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-3">活動紀錄</div>
        {data.records.length > 0 ? (
          <div className="space-y-3">
            {data.records.map((record, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {record.activityName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {record.recordTime} • {formatSource(record.source)}
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDuration(secondsToMinutes(record.duration))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <div>暫無上次紀錄</div>
          </div>
        )}
      </div>

      {/* 總結資訊 */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">上次活動日總時長</div>
            <div className="text-xl font-semibold text-gray-900">
              {formatDuration(secondsToMinutes(data.lastDateDuration))}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">今日總時長</div>
            <div className="text-xl font-semibold text-gray-900">
              {formatDuration(secondsToMinutes(data.todayDuration))}
            </div>
          </div>
        </div>

        {/* 比較資訊 */}
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">比較</div>
          <div
            className={`text-sm font-medium ${getComparisonColor(
              data.todayDuration,
              data.lastDateDuration
            )}`}
          >
            {getComparisonText(data.todayDuration, data.lastDateDuration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastDayRecordsCard;
