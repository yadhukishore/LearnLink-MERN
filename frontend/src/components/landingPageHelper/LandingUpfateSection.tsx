import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface LatestUpdate {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

interface LatestUpdatesSectionProps {
  latestUpdates: LatestUpdate[];
  currentUpdateIndex: number;
  nextUpdate: () => void;
  prevUpdate: () => void;
  isDarkTheme: boolean;
}

const LatestUpdatesSection: React.FC<LatestUpdatesSectionProps> = ({ 
  latestUpdates, 
  currentUpdateIndex, 
  nextUpdate, 
  prevUpdate, 
  isDarkTheme 
}) => {
  const autoSlide = useCallback(() => {
    nextUpdate();
  }, [nextUpdate]);

  useEffect(() => {
    const intervalId = setInterval(autoSlide, 2500);
    return () => clearInterval(intervalId);
  }, [autoSlide]);

  return (
    <motion.div 
      className="grid grid-cols-1 mt-16" 
      initial={{ y: 50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      transition={{ duration: 0.8 }}
    >
      <div className={`p-6 rounded-lg shadow-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-white bg-opacity-10'}`}>
        <h3 className="text-2xl font-bold mb-4">Latest Updates</h3>
        {latestUpdates.length > 0 ? (
          <div className="relative">
            <motion.img 
              key={currentUpdateIndex}
              src={latestUpdates[currentUpdateIndex].imageUrl} 
              alt={latestUpdates[currentUpdateIndex].title} 
              className="w-full h-64 object-cover rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-xl font-bold">{latestUpdates[currentUpdateIndex].title}</h4>
              <p>{latestUpdates[currentUpdateIndex].description}</p>
            </motion.div>
            <button 
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full" 
              onClick={prevUpdate}
            >
              <FaChevronLeft />
            </button>
            <button 
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full" 
              onClick={nextUpdate}
            >
              <FaChevronRight />
            </button>
          </div>
        ) : (
          <p>No latest updates available at the moment.</p>
        )}
      </div>
    </motion.div>
  );
};

export default LatestUpdatesSection;