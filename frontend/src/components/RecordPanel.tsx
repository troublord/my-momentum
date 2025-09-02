import React, { useState, useEffect, useRef } from "react";
import { Activity } from "../types";
import { getEmojiByCode } from "../constants/emoji";
import { useRecords } from "../services/records";
import { useError } from "../contexts/ErrorContext";

interface RecordPanelProps {
  activities: Activity[];
  onCreated?: () => void;
}

const RecordPanel: React.FC<RecordPanelProps> = ({ activities, onCreated }) => {
  const { createLiveRecord, finishLiveRecord, createManualRecord } = useRecords();
  const { addError } = useError();

  // UI State
  const [selectedActivity, setSelectedActivity] = useState<string>("");
  const [recordType, setRecordType] = useState<"realtime" | "manual">("realtime");
  const [loading, setLoading] = useState(false);

  // LIVE recording state
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Manual recording state
  const [manualDuration, setManualDuration] = useState(30);
  const [manualDate, setManualDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [manualTime, setManualTime] = useState("");

  const isRecording = currentRecordId !== null;

  // Timer management
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedSec(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedSec(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const buildExecutedAtISO = (date: string, time: string = ""): string => {
    const dateObj = new Date(date);
    
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      dateObj.setHours(hours, minutes, 0, 0);
    } else {
      dateObj.setHours(0, 0, 0, 0);
    }
    
    return dateObj.toISOString();
  };

  const handleStartRecording = async () => {
    if (!selectedActivity || loading) return;

    setLoading(true);
    try {
      const executedAtISO = new Date().toISOString();
      const record = await createLiveRecord(selectedActivity, executedAtISO);
      
      if (record) {
        setCurrentRecordId(record.id);
        addError({
          type: 'info',
          title: '開始紀錄',
          message: '即時紀錄已開始',
          autoHide: true,
          autoHideDelay: 3000,
        });
      }
    } catch (error) {
      console.error("Failed to start recording:", error);
      
      // Special handling for 409 - already running
      if (error instanceof Error && error.message.includes('409')) {
        addError({
          type: 'warning',
          title: '無法開始紀錄',
          message: '此活動已有進行中的即時紀錄',
          autoHide: true,
          autoHideDelay: 5000,
        });
      } else {
        addError({
          type: 'error',
          title: '開始紀錄失敗',
          message: '無法開始即時紀錄，請稍後再試',
          autoHide: true,
          autoHideDelay: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStopRecording = async () => {
    if (!currentRecordId || loading) return;

    setLoading(true);
    try {
      const endAtISO = new Date().toISOString();
      const record = await finishLiveRecord(currentRecordId, endAtISO);
      
      if (record) {
        // Calculate duration in minutes for display
        const durationMinutes = record.duration ? Math.round(record.duration / 60) : 0;
        
        setCurrentRecordId(null);
        addError({
          type: 'info',
          title: '紀錄完成',
          message: `已記錄 ${durationMinutes} 分鐘`,
          autoHide: true,
          autoHideDelay: 3000,
        });
        
        // Notify parent to refresh
        onCreated?.();
      }
    } catch (error) {
      console.error("Failed to stop recording:", error);
      
      // Special handling for 409 - not a LIVE record
      if (error instanceof Error && error.message.includes('409')) {
        addError({
          type: 'warning',
          title: '無法停止紀錄',
          message: '只能停止進行中的即時紀錄',
          autoHide: true,
          autoHideDelay: 5000,
        });
      } else {
        addError({
          type: 'error',
          title: '停止紀錄失敗',
          message: '無法停止即時紀錄，請稍後再試',
          autoHide: true,
          autoHideDelay: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveManualRecord = async () => {
    if (!selectedActivity || loading) return;

    setLoading(true);
    try {
      const executedAtISO = buildExecutedAtISO(manualDate, manualTime);
      const record = await createManualRecord(selectedActivity, manualDuration, executedAtISO);
      
      if (record) {
        addError({
          type: 'info',
          title: '紀錄已儲存',
          message: `已記錄 ${manualDuration} 分鐘`,
          autoHide: true,
          autoHideDelay: 3000,
        });
        
        // Reset form
        setManualDuration(30);
        setManualDate(new Date().toISOString().split("T")[0]);
        setManualTime("");
        
        // Notify parent to refresh
        onCreated?.();
      }
    } catch (error) {
      console.error("Failed to save manual record:", error);
      addError({
        type: 'error',
        title: '儲存失敗',
        message: '無法儲存手動紀錄，請稍後再試',
        autoHide: true,
        autoHideDelay: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-80">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">紀錄活動</h3>

      {/* 紀錄類型切換 */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setRecordType("realtime")}
          disabled={isRecording}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            recordType === "realtime"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          } ${isRecording ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          即時紀錄
        </button>
        <button
          onClick={() => setRecordType("manual")}
          disabled={isRecording}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            recordType === "manual"
              ? "bg-white text-primary-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          } ${isRecording ? "opacity-50 cursor-not-allowed" : ""}`}
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
          disabled={isRecording || loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">請選擇活動</option>
          {activities.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {getEmojiByCode(activity.icon)} {activity.name}
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
              disabled={!selectedActivity || loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "開始中..." : "開始紀錄"}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 font-mono">
                  {formatTime(elapsedSec)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  正在紀錄:{" "}
                  {activities.find((a) => a.id === selectedActivity)?.name}
                </div>
              </div>
              <button
                onClick={handleStopRecording}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "停止中..." : "停止紀錄"}
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
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
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
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              時間 (可選，預設 00:00)
            </label>
            <input
              type="time"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50"
            />
          </div>

          <button
            onClick={handleSaveManualRecord}
            disabled={!selectedActivity || loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "儲存中..." : "儲存紀錄"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordPanel;