import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { checkAdminAuthStatus } from '../../../../features/admin/adminSlice';
import { RootState } from '../../../store/store';
import Sidebar from '../Sidebar';
import Header from '../Header';
import UserLoginGraph from './UserLoginGraph';
import TutorLoginGraph from './TutorLoginGraph';
import CategoryCoursePie from './CategoryCoursePie';
import StudentsEnrollments from './StudentsEnrollments';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);

  useEffect(() => {
    dispatch(checkAdminAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            <UserLoginGraph />
            <TutorLoginGraph />
            <CategoryCoursePie/>
            <StudentsEnrollments/>
            
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;