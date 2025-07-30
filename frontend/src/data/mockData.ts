import { Activity, Summary } from "../types";

export const mockActivities: Activity[] = [
  {
    id: "1",
    name: "閱讀",
    totalTime: 1200,
    weeklyTime: 180,
    targetTime: 300,
    color: "#3b82f6",
    icon: "📚",
  },
  {
    id: "2",
    name: "運動",
    totalTime: 800,
    weeklyTime: 120,
    targetTime: 150,
    color: "#22c55e",
    icon: "🏃‍♂️",
  },
  {
    id: "3",
    name: "程式設計",
    totalTime: 2400,
    weeklyTime: 360,
    targetTime: 400,
    color: "#8b5cf6",
    icon: "💻",
  },
  {
    id: "4",
    name: "冥想",
    totalTime: 600,
    weeklyTime: 90,
    targetTime: 100,
    color: "#f59e0b",
    icon: "🧘‍♀️",
  },
  {
    id: "5",
    name: "寫作",
    totalTime: 900,
    weeklyTime: 150,
    targetTime: 200,
    color: "#ef4444",
    icon: "✍️",
  },
  {
    id: "6",
    name: "學習語言",
    totalTime: 700,
    weeklyTime: 100,
    targetTime: 120,
    color: "#06b6d4",
    icon: "🗣️",
  },
];

export const mockSummary: Summary = {
  weeklyTotalTime: 1000,
  mostFrequentActivity: "程式設計",
  completionRate: 78,
};
