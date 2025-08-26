import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import SummarySection from "./components/SummarySection";
import ActivityGrid from "./components/ActivityGrid";
import RecordPanel from "./components/RecordPanel";
import CreateActivityModal from "./components/CreateActivityModal";
import { Activity, Summary } from "./types";
import IntroPage from "./components/IntroPage";
import { useAuth } from "./contexts/AuthContext";
import { useActivities } from "./services/activities";
import { useStatistics } from "./services/statistics";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { getActivities, createActivity } = useActivities();
  const { getSummary } = useStatistics();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const [activitiesData, summaryData] = await Promise.all([
            getActivities(),
            getSummary(),
          ]);

          if (activitiesData) setActivities(activitiesData);
          if (summaryData) setSummary(summaryData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated, getActivities, getSummary]);

  const handleActivityClick = (activity: Activity) => {
    console.log("點擊活動:", activity.name);
    // 這裡可以導向活動詳細頁
  };

  const handleAddActivity = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateActivity = async (newActivity: Omit<Activity, "id">) => {
    try {
      const createdActivity = await createActivity(newActivity);
      if (createdActivity) {
        setActivities([...activities, createdActivity]);
      }
    } catch (error) {
      console.error("Failed to create activity:", error);
      // TODO: 添加錯誤提示
    }
  };

  if (!isAuthenticated) {
    return <IntroPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1">
            {summary && <SummarySection summary={summary} />}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                我的活動
              </h2>
              <ActivityGrid
                activities={activities}
                onActivityClick={handleActivityClick}
                onAddActivity={handleAddActivity}
              />
            </div>
          </div>
          <div className="hidden lg:block">
            <RecordPanel activities={activities} />
          </div>
        </div>
      </div>
      <CreateActivityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateActivity}
      />
    </div>
  );
};

export default App;
