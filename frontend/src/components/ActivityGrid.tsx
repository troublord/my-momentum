import React from "react";
import { Activity } from "../types";
import ActivityCard from "./ActivityCard";
import AddActivityCard from "./AddActivityCard";

interface ActivityGridProps {
  activities: Activity[];
  onActivityClick?: (activity: Activity) => void;
  onAddActivity?: () => void;
  onEditActivity?: (activity: Activity) => void;
  onDeleteActivity?: (activity: Activity) => void;
}

const ActivityGrid: React.FC<ActivityGridProps> = ({
  activities,
  onActivityClick,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
}) => {
  const handleActivityClick = (activity: Activity) => {
    if (onActivityClick) {
      onActivityClick(activity);
    }
  };

  const handleAddActivity = () => {
    if (onAddActivity) {
      onAddActivity();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onClick={() => handleActivityClick(activity)}
          onEdit={onEditActivity}
          onDelete={onDeleteActivity}
        />
      ))}
      <AddActivityCard onClick={handleAddActivity} />
    </div>
  );
};

export default ActivityGrid;
