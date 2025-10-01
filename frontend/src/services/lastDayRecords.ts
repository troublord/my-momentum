import { LastDayRecordsResponse } from "../types";
import { useApi } from "./api";

export const useLastDayRecords = () => {
  const api = useApi();

  // 獲取使用者時區
  const getUserTimezone = (): string => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.warn("無法獲取時區，使用預設值 Asia/Taipei:", error);
      return "Asia/Taipei";
    }
  };

  return {
    getLastDayRecords: async (): Promise<LastDayRecordsResponse | null> => {
      const timezone = getUserTimezone();
      const params = new URLSearchParams({ timezone });
      const endpoint = `/api/records/last-day?${params.toString()}`;
      
      console.log(`🌍 使用時區: ${timezone}`);
      return api.get<LastDayRecordsResponse>(endpoint);
    },
  };
};
