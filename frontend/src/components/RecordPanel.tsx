import React, { useState } from "react";
import { Activity } from "../types";

interface RecordPanelProps {
  activities: Activity[];
}

const RecordPanel: React.FC<RecordPanelProps> = ({ activities }) => {
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordType, setRecordType] = useState<"realtime" | "manual">(
    "realtime"
  );
  const [manualDuration, setManualDuration] = useState(30);
  const [manualDate, setManualDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleStartRecording = () => {
    if (!selectedActivity) return;
    setIsRecording(true);
    console.log("開始紀錄:", selectedActivity);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    console.log("停止紀錄");
  };

  const handleSaveManualRecord = () => {
    if (!selectedActivity) return;
    console.log("儲存手動紀錄:", {
      activity: selectedActivity,
      duration: manualDuration,
      date: manualDate,
    });
  };

  // removed unused formatTime to satisfy linter

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-80">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">紀錄活動</h3>

      {/* 紀錄類型切換 */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setRecordType("realtime")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            recordType === "realtime"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          即時紀錄
        </button>
        <button
          onClick={() => setRecordType("manual")}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            recordType === "manual"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          事後紀錄
        </button>
      </div>

      {/* 活動選擇 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          選擇活動
        </label>
        <select
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">請選擇活動</option>
          {activities.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {activity.icon} {activity.name}
            </option>
          ))}
        </select>
      </div>

      {recordType === "realtime" ? (
        /* 即時紀錄 */
        <div className="space-y-4">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={!selectedActivity}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              開始紀錄
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 animate-pulse-slow">
                  紀錄中...
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  正在紀錄:{" "}
                  {activities.find((a) => a.id === selectedActivity)?.name}
                </div>
              </div>
              <button
                onClick={handleStopRecording}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                停止紀錄
              </button>
            </div>
          )}
        </div>
      ) : (
        /* 事後紀錄 */
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              時間（分鐘）
            </label>
            <input
              type="number"
              value={manualDuration}
              onChange={(e) => setManualDuration(parseInt(e.target.value) || 0)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              日期
            </label>
            <input
              type="date"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <button
            onClick={handleSaveManualRecord}
            disabled={!selectedActivity}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            儲存紀錄
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordPanel;
