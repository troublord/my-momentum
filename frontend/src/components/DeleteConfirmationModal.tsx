import React from "react";
import { Activity } from "../types";
import { getEmojiByCode } from "../constants/emoji";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  activity: Activity | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  activity,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !activity) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">刪除活動</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            確定要刪除以下活動嗎？此操作無法復原。
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 flex items-center">
            <div className="text-2xl mr-3">{getEmojiByCode(activity.icon)}</div>
            <div>
              <div className="font-medium text-gray-900">{activity.name}</div>
              <div className="text-sm text-gray-500">
                總時間: {Math.floor(activity.totalTime / 60)}h {activity.totalTime % 60}m
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
          >
            確定刪除
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
