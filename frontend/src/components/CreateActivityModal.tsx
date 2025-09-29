import React, { useState } from "react";
import { Activity } from "../types";
import {
  ACTIVITY_ICONS,
  ActivityIconType,
  getAvailableIconCodes,
} from "../constants/emoji";

interface CreateActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (activity: Omit<Activity, "id">) => void;
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

const CreateActivityModal: React.FC<CreateActivityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState("");
  const [hours, setHours] = useState<number | "other">(0);
  const [customHours, setCustomHours] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState<ActivityIconType>(
    PRESET_ICONS[0]
  );

  // 計算總分鐘數
  const getTotalMinutes = (): number => {
    const hoursValue = hours === "other" ? parseInt(customHours) || 0 : hours;
    return hoursValue * 60 + minutes;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalMinutes = getTotalMinutes();
    
    // 驗證總時間至少1分鐘
    if (totalMinutes < 1) {
      alert("每週目標時間至少需要1分鐘");
      return;
    }

    const newActivity: Omit<Activity, "id"> = {
      name,
      targetTime: totalMinutes,
      totalTime: 0,
      weeklyTime: 0,
      color: selectedColor,
      icon: selectedIcon,
    };

    onSubmit(newActivity);
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setHours(0);
    setCustomHours("");
    setMinutes(0);
    setSelectedColor(PRESET_COLORS[0]);
    setSelectedIcon(PRESET_ICONS[0]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">新增活動</h2>

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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              每週目標時間
            </label>
            
            <div className="flex gap-4">
              {/* 小時選擇 */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">小時</label>
                <select
                  value={hours}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "other") {
                      setHours("other");
                    } else {
                      setHours(parseInt(value));
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>0</option>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
                  <option value="other">其他</option>
                </select>
                
                {/* 自訂小時輸入欄位 */}
                {hours === "other" && (
                  <input
                    type="number"
                    value={customHours}
                    onChange={(e) => setCustomHours(e.target.value)}
                    min="0"
                    placeholder="輸入小時數"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
              
              {/* 分鐘選擇 */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">
                  分鐘: {minutes}
                </label>
                <input
                  type="range"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>30</span>
                  <span>59</span>
                </div>
              </div>
            </div>
            
            {/* 總計顯示 */}
            <div className="mt-2 text-sm text-gray-600">
              總計：{getTotalMinutes()} 分鐘
            </div>
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
              新增
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateActivityModal;
