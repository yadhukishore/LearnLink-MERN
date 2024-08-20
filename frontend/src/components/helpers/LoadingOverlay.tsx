import React from 'react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="border-4 border-blue-500 border-t-transparent rounded-full w-16 h-16 animate-spin"></div>
        <p className="mt-4 text-gray-700">Uploading post...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;