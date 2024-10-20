import React from 'react';
import { motion } from 'framer-motion';
import { CgDarkMode } from 'react-icons/cg';

interface ThemeToggleButtonProps {
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ toggleTheme }) => {
  return (
    <motion.div
      className="fixed bottom-10 right-10 bg-gray-800 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-600 z-50"
      drag
      whileHover={{ scale: 1.1 }}
      onClick={toggleTheme}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <CgDarkMode size={28} />
    </motion.div>
  );
};

export default ThemeToggleButton;
