import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkTutorAuthStatus, tutorLogout } from '../../../features/tutor/tutorSlice';
import { RootState } from '../../store/store';

const TutorHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tutor } = useSelector((state: RootState) => state.tutor);
  console.log("Tutor:", tutor);

  useEffect(() => {
    dispatch(checkTutorAuthStatus());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(tutorLogout());
    navigate('/tutorLogin');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-[#071A2B] bg-opacity-80 backdrop-blur-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/Navi.png" alt="Logo" className="h-8 w-auto sm:h-10 md:h-12" />
        <span className="ml-2 text-lg sm:text-xl md:text-2xl font-bold text-white">LearnLink Tutor</span>
      </div>
      {tutor && (
        <div className="relative">
          <button onClick={handleDropdownToggle} className="text-white hover:text-gray-300 transition duration-300">
            Hello, {tutor.name}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={() => {
                  handleLogout();
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default TutorHeader;
