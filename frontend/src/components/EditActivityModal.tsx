import React, { useState, useEffect } from "react";
import { Activity } from "../types";
import {
  ACTIVITY_ICONS,
  ActivityIconType,
  getAvailableIconCodes,
} from "../constants/emoji";

interface EditActivityModalProps {
  isOpen: boolean;
  activity: Activity | null;
  onClose: () => void;
  onSubmit: (id: string, activity: Partial<Activity>) => void;
}

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#8b5cf6", // purple
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
];

const PRESET_ICONS = getAvailableIconCodes();

const EditActivityModal: React.FC<EditActivityModalProps> = ({
  isOpen,
  activity,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [targetTime, setTargetTime] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState<ActivityIconType>(
    PRESET_ICONS[0]
  );

  // 當活動變更時，更新表單狀態
  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setTargetTime(activity.targetTime.toString());
      setSelectedColor(activity.color);
      setSelectedIcon(activity.icon);
    }
  }, [activity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activity) return;

    const updatedFields: Partial<Activity> = {
      name,
      targetTime: parseInt(targetTime),
      color: selectedColor,
      icon: selectedIcon,
    };

    onSubmit(activity.id, updatedFields);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !activity) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">編輯活動</h2>

        <form onSubmit={handleSubmit}>
          {/* 活動名稱 */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              活動名稱
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 每週目標時間 */}
          <div className="mb-4">
            <label
              htmlFor="targetTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              每週目標時間（分鐘）
            </label>
            <input
              type="number"
              id="targetTime"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* 顏色選擇 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇顏色
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color
                      ? "border-gray-900"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          {/* 圖示選擇 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              選擇圖示
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_ICONS.map((iconCode) => (
                <button
                  key={iconCode}
                  type="button"
                  className={`w-10 h-10 text-xl flex items-center justify-center rounded-lg border-2 ${
                    selectedIcon === iconCode
                      ? "border-gray-900 bg-gray-100"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedIcon(iconCode)}
                >
                  {ACTIVITY_ICONS[iconCode]}
                </button>
              ))}
            </div>
          </div>

          {/* 按鈕 */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              更新
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditActivityModal;
