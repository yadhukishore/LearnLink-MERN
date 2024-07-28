import React, { useState } from 'react';
import InfoCard from './InfoCard';
import { Link } from 'react-router-dom';
import TutorModal from './pages/TutorModal';

const LandingPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 min-h-screen">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">Join, learn and create communities you love</h1>
        
        <div className="flex justify-center space-x-4 mb-16">
          <Link to='/register' className="bg-teal-400 text-white font-bold py-3 px-8 rounded-full text-xl hover:bg-green-600 transform transition duration-300 hover:scale-105">
            Get Started
          </Link>
          
          <button
            onClick={openModal}
            className="bg-indigo-500 text-white font-bold py-3 px-8 rounded-full text-xl hover:bg-indigo-600 transform transition duration-300 hover:scale-105"
          >
            Start as Tutor
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <InfoCard 
            title="Latest Updates" 
            content="Stay tuned for the latest features and improvements. We're constantly working to enhance your experience!"
          />
          <InfoCard 
            title="Special Offers" 
            content="It will be updated soon! The Website is under construction..!" 
          />
        </div>
      </div>

      <TutorModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default LandingPage;