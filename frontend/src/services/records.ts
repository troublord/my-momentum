import { 
  ActivityRecord, 
  PageResponse, 
  CreateRecordReq, 
  FinishLiveReq, 
  UpdateRecordReq, 
  ListRecordQuery,
  UUID 
} from "../types/records";
import { useApi } from "./api";

export const useRecords = () => {
  const api = useApi();

  return {
    // Helper functions for RecordPanel
    createLiveRecord: async (activityId: string, executedAtISO: string): Promise<ActivityRecord | null> => {
      const req: CreateRecordReq = {
        activityId,
        source: "LIVE",
        duration: null, // LIVE records must have null duration
        executedAt: executedAtISO,
      };
      return api.post<ActivityRecord>("/api/records", req);
    },

    finishLiveRecord: async (id: string, endAtISO: string): Promise<ActivityRecord | null> => {
      const req: FinishLiveReq = {
        endAt: endAtISO,
      };
      return api.patch<ActivityRecord>(`/api/records/${id}/finish`, req);
    },

    createManualRecord: async (
      activityId: string, 
      minutes: number, 
      executedAtISO: string
    ): Promise<ActivityRecord | null> => {
      const req: CreateRecordReq = {
        activityId,
        source: "MANUAL",
        duration: minutes * 60, // Convert minutes to seconds
        executedAt: executedAtISO,
      };
      return api.post<ActivityRecord>("/api/records", req);
    },

    // Full API methods
    createRecord: async (req: CreateRecordReq): Promise<ActivityRecord | null> => {
      return api.post<ActivityRecord>("/api/records", req);
    },

    finishRecord: async (id: UUID, req: FinishLiveReq): Promise<ActivityRecord | null> => {
      return api.patch<ActivityRecord>(`/api/records/${id}/finish`, req);
    },

    updateRecord: async (id: UUID, req: UpdateRecordReq): Promise<ActivityRecord | null> => {
      return api.put<ActivityRecord>(`/api/records/${id}`, req);
    },

    deleteRecord: async (id: UUID): Promise<void> => {
      await api.delete<void>(`/api/records/${id}`);
    },

    getRecord: async (id: UUID): Promise<ActivityRecord | null> => {
      return api.get<ActivityRecord>(`/api/records/${id}`);
    },

    listRecords: async (query?: ListRecordQuery): Promise<PageResponse<ActivityRecord> | null> => {
      const params = new URLSearchParams();
      
      if (query?.activityId) params.append('activityId', query.activityId);
      if (query?.from) params.append('from', query.from);
      if (query?.to) params.append('to', query.to);
      if (query?.source) params.append('source', query.source);
      if (query?.running !== undefined) params.append('running', query.running.toString());
      if (query?.page !== undefined) params.append('page', query.page.toString());
      if (query?.size !== undefined) params.append('size', query.size.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/api/records?${queryString}` : '/api/records';
      
      return api.get<PageResponse<ActivityRecord>>(endpoint);
    },

    getRunningRecords: async (query?: Pick<ListRecordQuery, 'activityId' | 'page' | 'size'>): Promise<PageResponse<ActivityRecord> | null> => {
      const params = new URLSearchParams();
      
      if (query?.activityId) params.append('activityId', query.activityId);
      if (query?.page !== undefined) params.append('page', query.page.toString());
      if (query?.size !== undefined) params.append('size', query.size.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/api/records/running?${queryString}` : '/api/records/running';
      
      return api.get<PageResponse<ActivityRecord>>(endpoint);
    },
  };
};