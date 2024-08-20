import React from 'react';

const TutorProfileShimmer: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="min-h-screen bg-[#071A2B] text-white">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="h-10 bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-24 bg-gray-700 rounded mb-4"></div>
            </div>
            <div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfileShimmer;
