import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This navigates to the previous page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-700 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-gray-400 p-10 rounded-xl shadow-2xl flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8">
        
        {/* Left Side - Text and Button */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Oops! Page Not Found
          </h2>
          <p className="mt-2 text-white">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="mt-6">
            <button
              onClick={goBack}
              className="w-full lg:w-auto py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go back to previous page
            </button>
          </div>
        </div>

        {/* Right Side - Image (Hidden on small screens) */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <img 
            src="https://miro.medium.com/v2/resize:fit:828/format:webp/1*mUClow2WD0I2FIL_Iuzxfw.gif"
            alt="404 Illustration" 
            className="hidden lg:block w-full h-auto" 
          />
        </div>
        
      </div>
    </div>
  );
};

export default ErrorPage;
