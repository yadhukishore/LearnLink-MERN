// src/components/LandingPage.tsx
import React from 'react';
import InfoCard from './InfoCard';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 min-h-screen">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">Join, learn and create communities you love</h1>
        
        <button className="bg-teal-400 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-full text-xl mb-16">
          Get Started
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <InfoCard 
            title="Latest Updates" 
            content="Stay tuned for the latest features and improvements. We're constantly working to enhance your experience!"
          />
          <InfoCard 
            title="Special Offers" 
            content="It will be updated soon! The Website is undeconstruction..! "
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;