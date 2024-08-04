import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAdminAuthStatus } from '../../../features/admin/adminSlice';
import { RootState } from '../../store/store';
import Sidebar from './Sidebar';
import Header from './Header';

const ApproveTutor: React.FC = () => {
  const [tutors, setTutors] = useState([]);
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

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/adminApprove-tutor');
        setTutors(response.data);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };
    fetchTutors();
  }, []);

  const handleViewDetails = (tutorId: string) => {
    navigate(`/tutor-details/${tutorId}`);
  };

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Pending Tutor Requests</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <ul>
              {tutors.map((tutor) => (
                <li key={tutor._id} className="mb-4 border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">{tutor.name} - {tutor.email}</span>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                      onClick={() => handleViewDetails(tutor._id)}
                    >
                      View Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApproveTutor;