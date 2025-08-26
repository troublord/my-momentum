import { Activity } from "../types";
import { useApi } from "./api";

export const useActivities = () => {
  const api = useApi();

  return {
    // 獲取所有活動
    getActivities: () => {
      return api.get<Activity[]>("/api/activities");
    },

    // 獲取單個活動
    getActivity: (id: string) => {
      return api.get<Activity>(`/api/activities/${id}`);
    },

    // 創建新活動
    createActivity: (activity: Omit<Activity, "id">) => {
      return api.post<Activity>("/api/activities", activity);
    },

    // 更新活動
    updateActivity: (id: string, activity: Partial<Activity>) => {
      return api.put<Activity>(`/api/activities/${id}`, activity);
    },

    // 刪除活動
    deleteActivity: (id: string) => {
      return api.delete<void>(`/api/activities/${id}`);
    },
  };
};
