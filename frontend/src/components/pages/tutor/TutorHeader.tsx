import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { checkTutorAuthStatus, tutorLogout } from '../../../features/tutor/tutorSlice';
import { RootState } from '../../store/store';
import { apiService } from '../../../services/api';

const TutorHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tutor } = useSelector((state: RootState) => state.tutor);

  useEffect(() => {
    dispatch(checkTutorAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (tutor && tutor.id) {
        try {
          const response = await apiService.get<{ success: boolean; hasUnreadMessages: boolean }>(
            `/chat/checkUnreadMessages/${tutor.id}`
          );
          setHasUnreadMessages(response.hasUnreadMessages);
        } catch (error) {
          console.error('Error fetching unread messages:', error);
        }
      }
    };

    if (tutor && tutor.id) {
      fetchUnreadMessages();
    }
  }, [tutor]);

  const handleLogout = () => {
    dispatch(tutorLogout());
    navigate('/tutorLogin');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-[#071A2B] bg-opacity-80 backdrop-blur-md py-4 px-6 flex justify-between items-center">
   <Link to="/tutorHome" className="flex items-center">
        <img src="/Navi.png" alt="Logo" className="h-8 w-auto sm:h-10 md:h-12" />
        <span className="ml-2 text-lg sm:text-xl md:text-2xl font-bold text-white">LearnLink Tutor</span>
      </Link>
      {tutor && (
        <div className="relative">
          <button onClick={handleDropdownToggle} className="text-white hover:text-gray-300 transition duration-300">
            Hello, {tutor.name}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-200 rounded-md shadow-lg py-1 z-10">
              <Link to="/tutorProfile" className="block px-4 py-2 text-sm text-black hover:bg-white" onClick={() => setIsDropdownOpen(false)}>
                Tutor Profile
              </Link>
              <Link to="/tutorFinacial-aids" className="block px-4 py-2 text-sm text-black hover:bg-white" onClick={() => setIsDropdownOpen(false)}>
                Financial-Aid Requests
              </Link>
              <Link to={`/scheduled-calls/${tutor.id}`} className="block px-4 py-2 text-sm text-black hover:bg-white" onClick={() => setIsDropdownOpen(false)}>
                Scheduled Calls
              </Link>
              <Link to={`/tutorWallet`} className="block px-4 py-2 text-sm text-black hover:bg-white" onClick={() => setIsDropdownOpen(false)}>
                Wallet
              </Link>
              <Link to={`/tutorChat`} className="block px-4 py-2 text-sm text-black hover:bg-white relative" onClick={() => setIsDropdownOpen(false)}>
                Chats
                {hasUnreadMessages && (
                  <span className="absolute top-0  w-4 h-4 bg-green-600 rounded-full animate-ping"></span>
                )}
              </Link>
              <button onClick={() => { handleLogout(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-white">
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
