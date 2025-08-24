import React from "react";
import Header from "./components/Header";
import SummarySection from "./components/SummarySection";
import ActivityGrid from "./components/ActivityGrid";
import RecordPanel from "./components/RecordPanel";
import { mockActivities, mockSummary } from "./data/mockData";
import { Activity } from "./types";
import IntroPage from "./components/IntroPage";
import { useAuth } from "./contexts/AuthContext";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const handleActivityClick = (activity: Activity) => {
    console.log("點擊活動:", activity.name);
    // 這裡可以導向活動詳細頁
  };

  const handleAddActivity = () => {
    console.log("新增活動");
    // 這裡可以開啟新增活動的 modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <IntroPage />
      ) : (
        <>
          <Header />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
              <div className="flex-1">
                <SummarySection summary={mockSummary} />
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    我的活動
                  </h2>
                  <ActivityGrid
                    activities={mockActivities}
                    onActivityClick={handleActivityClick}
                    onAddActivity={handleAddActivity}
                  />
                </div>
              </div>
              <div className="hidden lg:block">
                <RecordPanel activities={mockActivities} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
