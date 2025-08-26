import React from "react";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { logout } = useAuth();

  const handleNavigationClick = (section: string) => {
    console.log(`Navigate to: ${section}`);
  };

  const handleLogout = () => {
    logout();
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

          {/* Navigation & User Actions */}
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <button
                onClick={() => handleNavigationClick("all-activities")}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                全部活動
              </button>
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border border-gray-300 hover:border-gray-400"
              aria-label="登出"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
