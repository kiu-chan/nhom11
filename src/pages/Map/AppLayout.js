import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export const AppLayout = ({ 
  searchBar,
  sidebar,
  locationButton,
  map,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen w-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <div 
        className={`bg-white shadow-lg transition-all duration-300 flex
          ${isCollapsed ? 'w-0' : 'w-80'}`}
      >
        {/* Sidebar Content */}
        <div className={`flex-1 ${isCollapsed ? 'hidden' : 'block'}`}>
          <div className="p-4 border-b">
            {searchBar}
          </div>
          <div className="overflow-y-auto h-[calc(100vh-73px)]">
            {sidebar}
          </div>
        </div>

        {/* Collapse Button */}
        <div 
          className={`w-6 flex items-center cursor-pointer hover:bg-gray-100
            ${isCollapsed ? 'border-l' : 'border-l border-gray-200'}`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className={`w-4 h-4 text-gray-600 transition-transform
            ${isCollapsed ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <div className="absolute top-4 right-4 z-[400]">
          {locationButton}
        </div>
        {map}
      </div>
    </div>
  );
};