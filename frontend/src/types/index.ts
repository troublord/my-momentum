import { ActivityIconType } from "../constants/emoji";

export interface Activity {
  id: string;
  name: string;
  totalTime: number; // 分鐘
  weeklyTime: number; // 分鐘
  targetTime: number; // 每週目標分鐘
  color: string;
  icon: ActivityIconType;
}

export interface Summary {
  weeklyTotalTime: number;
  mostFrequentActivity: string;
  completionRate: number;
}

export interface RecordEntry {
  activityId: string;
  duration: number; // 分鐘
  date: string;
  type: "realtime" | "manual";
}
