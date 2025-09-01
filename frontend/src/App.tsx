import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import SummarySection from "./components/SummarySection";
import ActivityGrid from "./components/ActivityGrid";
import RecordPanel from "./components/RecordPanel";
import CreateActivityModal from "./components/CreateActivityModal";
import EditActivityModal from "./components/EditActivityModal";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import ErrorContainer from "./components/ErrorContainer";
import { Activity, Summary } from "./types";
import IntroPage from "./components/IntroPage";
import { useAuth } from "./contexts/AuthContext";
import { useActivities } from "./services/activities";
import { useStatistics } from "./services/statistics";
import { useError } from "./contexts/ErrorContext";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { getActivities, createActivity, updateActivity, deleteActivity } = useActivities();
  const { getSummary } = useStatistics();
  const { addError } = useError();

  const [activities, setActivities] = useState<Activity[]>([]);
  
  // Debug: Log activities whenever they change
  useEffect(() => {
    console.log('🔄 Activities State Updated:', activities);
  }, [activities]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const [activitiesData, summaryData] = await Promise.all([
            getActivities(),
            getSummary(),
          ]);

          if (activitiesData) {
            console.log('📊 Fetched Activities:', activitiesData);
            setActivities(activitiesData);
          }
          if (summaryData) {
            console.log('📈 Fetched Summary:', summaryData);
            setSummary(summaryData);
          }
        } catch (error) {
          console.error("Failed to fetch data:", error);
          addError({
            type: 'error',
            title: '載入資料失敗',
            message: '無法載入應用程式資料，請重新整理頁面再試',
            autoHide: true,
            autoHideDelay: 5000,
          });
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);

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
        console.log('✨ Created New Activity:', createdActivity);
        setActivities([...activities, createdActivity]);
      }
    } catch (error) {
      console.error("Failed to create activity:", error);
      addError({
        type: 'error',
        title: '創建活動失敗',
        message: '無法創建新活動，請稍後再試',
        autoHide: true,
        autoHideDelay: 5000,
      });
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsEditModalOpen(true);
  };

  const handleUpdateActivity = async (id: string, updatedFields: Partial<Activity>) => {
    try {
      const updatedActivity = await updateActivity(id, updatedFields);
      if (updatedActivity) {
        console.log('✏️ Updated Activity:', updatedActivity);
        setActivities(activities.map(activity => 
          activity.id === id ? updatedActivity : activity
        ));
      }
    } catch (error) {
      console.error("Failed to update activity:", error);
      addError({
        type: 'error',
        title: '更新活動失敗',
        message: '無法更新活動資訊，請稍後再試',
        autoHide: true,
        autoHideDelay: 5000,
      });
    }
  };

  const handleDeleteActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedActivity) return;
    
    try {
      await deleteActivity(selectedActivity.id);
      console.log('🗑️ Deleted Activity:', selectedActivity);
      setActivities(activities.filter(activity => activity.id !== selectedActivity.id));
    } catch (error) {
      console.error("Failed to delete activity:", error);
      addError({
        type: 'error',
        title: '刪除活動失敗',
        message: '無法刪除活動，請稍後再試',
        autoHide: true,
        autoHideDelay: 5000,
      });
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
                onEditActivity={handleEditActivity}
                onDeleteActivity={handleDeleteActivity}
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
      <EditActivityModal
        isOpen={isEditModalOpen}
        activity={selectedActivity}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateActivity}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        activity={selectedActivity}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      <ErrorContainer />
    </div>
  );
};

export default App;
