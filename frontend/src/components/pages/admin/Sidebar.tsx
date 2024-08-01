// Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/adminDashboard' },
    { name: 'Books List', path: '/admin/books' },
    { name: 'Order Detail', path: '/admin/orders' },
    { name: 'Students', path: '/adminStudentsList' },
    { name: 'Courses', path: '/admin/courses' },
    { name: 'Feed Control', path: '/admin/feed' },
    { name: 'Financial aids', path: '/admin/financial-aids' },
    { name: 'Approve Tutor', path: '/admin/approve-tutor' },
    { name: 'Tutors', path: '/admin/tutors' },
    { name: 'Events/Offers', path: '/admin/events-offers' },
    { name: 'Chat', path: '/admin/chat' },
    { name: 'Wallet', path: '/admin/wallet' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-64 bg-purple-800 h-screen flex flex-col">
      <div className="p-4">
        <img src="/PinkHat.png" alt="LearnLink Logo" className="w-full h-auto" />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full text-left py-2 px-4 rounded transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-500 text-white'
                    : 'text-white hover:bg-purple-700'
                }`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;