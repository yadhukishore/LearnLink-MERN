// Header.tsx
import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../features/auth/authSlice'; 
import { RootState } from '../../store/store';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state:RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-[#071A2B] bg-opacity-80 backdrop-blur-md py-4 px-6 flex justify-between items-center">
      {/* Logo and Title */}
      <div className="flex items-center">
        <img 
          src="/Navi.png" 
          alt="Logo" 
          className="h-8 w-auto sm:h-10 md:h-12"
        />
        <span className="ml-2 text-lg sm:text-xl md:text-2xl font-bold text-white">LearnLink</span>
      </div>
        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4">
        <Link to="/" className="text-white hover:text-gray-300 transition duration-300">Home</Link>
        <Link to="/courses" className="text-white hover:text-gray-300 transition duration-300">Courses</Link>
      </nav>

  {/* Username and Dropdown */}
  {user && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Hello, {user.name}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <Link 
                to="/userWishlist"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Wishlist
              </Link>
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

export default Header;