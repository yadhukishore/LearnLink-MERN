// src/components/admin/Header.tsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../../../features/admin/adminSlice';
import { RootState } from '../../store/store';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state:RootState)=> state.admin.admin);

  const routeTitles: Record<string, string> = {
    '/adminDashboard': 'Admin Dashboard',
    '/admin/books': 'Books List',
    '/admin/orders': 'Order Detail',
    '/adminStudentsList': 'Students',
    '/admin/courses': 'Courses',
    '/admin/feed': 'Feed Control',
    '/admin/financial-aids': 'Financial Aids',
    '/adminApprove-tutor': 'Approve Tutor',
    '/admin/tutors': 'Tutors',
    '/admin/events-offers': 'Events/Offers',
    '/admin/chat': 'Chat',
    '/admin/wallet': 'Wallet',
  };
  const currentPath = location.pathname;
  const title = routeTitles[currentPath] || 'Admin Dashboard';

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/admin-login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900 hover:text-purple-600">{title}</h1>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
          >
              <span className="mr-2">{admin?.username || 'Admin'}</span>
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hover:bg-black">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;