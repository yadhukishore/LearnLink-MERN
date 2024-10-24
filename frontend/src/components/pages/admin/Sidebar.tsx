import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/adminDashboard' },
    { name: 'Reported Courses', path: '/adminCourseReports' },
    { name: 'Students', path: '/adminStudentsList' },
    { name: 'Courses', path: '/adminCoursesList' },
    { name: 'Course Category', path: '/adminCoursesCategory' },
    { name: 'Feed Control', path: '/adminFeedControl' },
    { name: 'Financial aids', path: '/adminFinancial-aids'},
    { name: 'Approve New Tutors', path: '/adminApprove-tutor' },
    { name: 'Tutors', path: '/adminTutorsList' },
    { name: 'Events/Offers', path: '/adminEvents-offers' },
    { name: 'Wallet', path: '/admin/wallet' }
  ];

  return (
    <aside className="w-64 bg-purple-800 h-screen flex flex-col">
      <div className="p-4">
        <img src="/PinkHat.png" alt="LearnLink Logo" className="w-full h-auto" />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`block w-full py-2 px-4 rounded transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-500 text-white'
                    : 'text-white hover:bg-purple-700'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;