import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchButton: React.FC = () => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipOpacity, setTooltipOpacity] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const showTooltip = () => {
      setTooltipVisible(true);
      setTimeout(() => setTooltipOpacity(1), 50); 
      setTimeout(() => {
        setTooltipOpacity(0); 
        setTimeout(() => setTooltipVisible(false), 300); 
      }, 1000);
    };

    const intervalId = setInterval(showTooltip, 2000);
    return () => clearInterval(intervalId);
  }, []);

  const handleClick = () => {
    navigate('/searchCourse');
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition duration-300 transform hover:scale-110"
        aria-label="Search Courses"
      >
        <FaSearch size={24} />
      </button>
      {tooltipVisible && (
        <div 
          className="absolute left-full ml-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg shadow-lg transition-opacity duration-300 whitespace-nowrap"
          style={{ opacity: tooltipOpacity }}
        >
          Find more courses
        </div>
      )}
    </div>
  );
};

export default SearchButton;