import React from "react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  loading = false,
  isEmpty = false,
  emptyMessage = "這段期間沒有紀錄",
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {loading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">載入中...</div>
        </div>
      ) : isEmpty ? (
        <div className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-2">📊</div>
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        </div>
      ) : (
        <div className="h-80">{children}</div>
      )}
    </div>
  );
};

export default ChartCard;
