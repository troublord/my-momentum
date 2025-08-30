export const ACTIVITY_ICONS = {
  book: "📚",
  running: "🏃‍♂️",
  computer: "💻",
  meditation: "🧘‍♀️",
  writing: "✍️",
  art: "🎨",
  music: "🎵",
  speaking: "🗣️",
  brain: "🧠",
  target: "🎯",
} as const;

export type ActivityIconType = keyof typeof ACTIVITY_ICONS;

// 輔助函數：根據代碼獲取表情符號
export const getEmojiByCode = (code: ActivityIconType): string => {
  return ACTIVITY_ICONS[code];
};

// 輔助函數：獲取所有可用的圖標代碼
export const getAvailableIconCodes = (): ActivityIconType[] => {
  return Object.keys(ACTIVITY_ICONS) as ActivityIconType[];
};

