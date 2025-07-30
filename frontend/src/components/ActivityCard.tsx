import React, { useState } from "react";
import { Activity } from "../types";

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const completionRate = Math.min(
    (activity.weeklyTime / activity.targetTime) * 100,
    100
  );
  const circumference = 2 * Math.PI * 20; // r=20
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (completionRate / 100) * circumference;

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="card cursor-pointer group relative"
      onClick={handleCardClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 活動圖示和名稱 */}
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-3">{activity.icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {activity.name}
        </h3>
      </div>

      {/* 時間統計 */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">累積總時間</span>
          <span className="font-medium">{formatTime(activity.totalTime)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">本週時間</span>
          <span className="font-medium">{formatTime(activity.weeklyTime)}</span>
        </div>
      </div>

      {/* 進度圓圈 */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
            {/* 背景圓圈 */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#e5e7eb"
              strokeWidth="4"
              fill="none"
            />
            {/* 進度圓圈 */}
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke={activity.color}
              strokeWidth="4"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700">
              {Math.round(completionRate)}%
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">目標</div>
          <div className="text-sm font-medium">
            {formatTime(activity.targetTime)}
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10">
          <div>目標: {formatTime(activity.targetTime)}</div>
          <div>完成率: {Math.round(completionRate)}%</div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
