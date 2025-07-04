import React from 'react';
import { Outlet } from 'react-router-dom';

// MainLayout provides a consistent two-column layout for protected routes
const MainLayout = () => {
  return (
    <div className="flex flex-grow w-full bg-gray-50 dark:bg-gray-900">
      {/* Main content area with proper spacing and responsive design */}
      <main className="flex-grow w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 