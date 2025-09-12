import React from "react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: number; // Percentage change (e.g., 0.18 for +18%)
  icon?: React.ReactNode;
  loading?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  icon,
  loading = false,
}) => {
  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return "↗";
    if (change < 0) return "↘";
    return "→";
  };

  const formatChange = (change: number) => {
    const percentage = Math.abs(change * 100).toFixed(1);
    return `${change >= 0 ? "+" : "-"}${percentage}%`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 rounded mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="mb-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>

      {change !== undefined && (
        <div className={`text-xs font-medium ${getChangeColor(change)}`}>
          <span className="mr-1">{getChangeIcon(change)}</span>
          {formatChange(change)}
        </div>
      )}
    </div>
  );
};

export default KpiCard;
