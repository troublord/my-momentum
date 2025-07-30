import React from "react";

interface AddActivityCardProps {
  onClick?: () => void;
}

const AddActivityCard: React.FC<AddActivityCardProps> = ({ onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className="card cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center min-h-[200px]"
      onClick={handleClick}
    >
      <div className="text-center">
        <div className="text-4xl text-gray-400 mb-2">+</div>
        <div className="text-gray-600 font-medium">新增活動</div>
      </div>
    </div>
  );
};

export default AddActivityCard;
