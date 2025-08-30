import { RecordEntry } from "../types";
import { useApi } from "./api";

export const useRecords = () => {
  const api = useApi();

  return {
    // 獲取所有記錄
    getRecords: (activityId?: string) => {
      const endpoint = activityId
        ? `/api/records?activityId=${activityId}`
        : "/api/records";
      return api.get<RecordEntry[]>(endpoint);
    },

    // 獲取特定時間範圍的記錄
    getRecordsByDateRange: (
      startDate: string,
      endDate: string,
      activityId?: string
    ) => {
      const endpoint = `/api/records?startDate=${startDate}&endDate=${endDate}${
        activityId ? `&activityId=${activityId}` : ""
      }`;
      return api.get<RecordEntry[]>(endpoint);
    },

    // 創建新記錄
    createRecord: (record: Omit<RecordEntry, "id">) => {
      return api.post<RecordEntry>("/api/records", record);
    },

    // 更新記錄
    updateRecord: (id: string, record: Partial<RecordEntry>) => {
      return api.put<RecordEntry>(`/api/records/${id}`, record);
    },

    // 刪除記錄
    deleteRecord: (id: string) => {
      return api.delete<void>(`/api/records/${id}`);
    },

    // 開始即時記錄
    startRealTimeRecord: (activityId: string) => {
      return api.post<{ recordId: string }>(`/api/records/${activityId}/start`);
    },

    // 結束即時記錄
    stopRealTimeRecord: (recordId: string) => {
      return api.post<RecordEntry>(`/api/records/${recordId}/stop`);
    },
  };
};

