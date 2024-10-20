import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  openModal: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ openModal }) => {
  return (
    <motion.div
      className="container mx-auto px-4 py-16 text-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-5xl font-extrabold mb-6">
        Joinz, Learn, and Create Communities You Love
      </h1>
      <motion.div
        className="flex justify-center space-x-4 mb-16"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Link to="/register" className="bg-teal-400 text-white font-bold py-3 px-8 rounded-full text-xl hover:bg-green-600 transform transition hover:scale-110 shadow-lg">
          Get Started
        </Link>
        <button
          onClick={openModal}
          className="bg-indigo-500 text-white font-bold py-3 px-8 rounded-full text-xl hover:bg-indigo-600 transform transition hover:scale-110 shadow-lg"
        >
          Start as Tutor
        </button>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
