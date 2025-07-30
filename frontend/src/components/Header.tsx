import React from "react";

const Header: React.FC = () => {
  const handleNavigationClick = (section: string) => {
    console.log(`Navigate to: ${section}`);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">
                MyMomentum
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <button
              onClick={() => handleNavigationClick("all-activities")}
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              全部活動
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
