import React, { useState } from "react";
import { Activity } from "../types";
import { getEmojiByCode } from "../constants/emoji";

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
  onEdit?: (activity: Activity) => void;
  onDelete?: (activity: Activity) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onClick, onEdit, onDelete }) => {
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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止觸發卡片點擊事件
    if (onEdit) {
      onEdit(activity);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止觸發卡片點擊事件
    if (onDelete) {
      onDelete(activity);
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center min-w-0 flex-1">
          <div className="text-2xl mr-3">{getEmojiByCode(activity.icon)}</div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {activity.name}
          </h3>
        </div>
        
        {/* 操作按鈕 */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="編輯活動"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="刪除活動"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
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
