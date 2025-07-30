import React from "react";
import { Summary } from "../types";

interface SummarySectionProps {
  summary: Summary;
}

const SummarySection: React.FC<SummarySectionProps> = ({ summary }) => {
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小時${mins}分鐘` : `${mins}分鐘`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">本週摘要</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 本週累積時間 */}
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {formatTime(summary.weeklyTotalTime)}
          </div>
          <div className="text-sm text-gray-600">本週累積時間</div>
        </div>

        {/* 最常做的活動 */}
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-2">
            {summary.mostFrequentActivity}
          </div>
          <div className="text-sm text-gray-600">最常做的活動</div>
        </div>

        {/* 進度完成率 */}
        <div className="text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">
            {summary.completionRate}%
          </div>
          <div className="text-sm text-gray-600">進度完成率</div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;
