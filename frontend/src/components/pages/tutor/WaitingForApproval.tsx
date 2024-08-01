import React from 'react';

const WaitingForApproval: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-900">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-2">Please wait...</h1>
            <p className="text-lg">Your application is being reviewed by the admin.</p>
            <p className="text-sm mt-2">You will be notified once you are accepted as a tutor.</p>
          </div>
        </div>
        <div className="w-96 h-96 border-t-4 border-b-4 border-white rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-80 h-80 border-4 border-gray-200 shadow-2xl rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForApproval;
