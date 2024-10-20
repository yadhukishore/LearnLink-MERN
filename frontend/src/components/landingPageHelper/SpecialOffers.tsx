import React, { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SpecialOffer {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface SpecialOffersSectionProps {
  specialOffers: SpecialOffer[];
  currentOfferIndex: number;
  nextOffer: () => void;
  prevOffer: () => void;
  isDarkTheme: boolean;
}

const SpecialOffersSection: React.FC<SpecialOffersSectionProps> = ({
  specialOffers,
  currentOfferIndex,
  nextOffer,
  prevOffer,
  isDarkTheme
}) => {
  const autoSlide = useCallback(() => {
    nextOffer();
  }, [nextOffer]);

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
        <h3 className="text-2xl font-bold mb-4">Special Offers</h3>
        {specialOffers.length > 0 ? (
          <div className="relative">
            <motion.img
              key={currentOfferIndex}
              src={specialOffers[currentOfferIndex].imageUrl}
              alt={specialOffers[currentOfferIndex].title}
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
              <h4 className="text-xl font-bold">{specialOffers[currentOfferIndex].title}</h4>
              <p>{specialOffers[currentOfferIndex].description}</p>
            </motion.div>
            <button
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              onClick={prevOffer}
            >
              <FaChevronLeft />
            </button>
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              onClick={nextOffer}
            >
              <FaChevronRight />
            </button>
          </div>
        ) : (
          <p>No special offers available at the moment.</p>
        )}
      </div>
    </motion.div>
  );
};

export default SpecialOffersSection;