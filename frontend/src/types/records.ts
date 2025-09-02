export type UUID = string;

export type RecordSource = "LIVE" | "MANUAL";

export interface ActivityRecord {
  id: UUID;
  activityId: UUID;
  source: RecordSource;
  duration: number | null;       // seconds
  executedAt: string;            // ISO8601
  createdAt: string;             // ISO8601
  updatedAt: string;             // ISO8601
}

export interface PageResponse<T> {
  data: T[];
  page: number;
  size: number;
  total: number;
}

export interface CreateRecordReq {
  activityId: UUID;
  source: RecordSource;
  duration: number | null;
  executedAt: string;
}

export interface FinishLiveReq {
  endAt: string; // ISO8601
}

export interface UpdateRecordReq {
  activityId: UUID;
  source: RecordSource;
  duration: number | null;
  executedAt: string;
}

export interface ListRecordQuery {
  activityId?: UUID;
  from?: string; // ISO8601
  to?: string;   // ISO8601
  source?: RecordSource;
  running?: boolean;
  page?: number;
  size?: number;
}
