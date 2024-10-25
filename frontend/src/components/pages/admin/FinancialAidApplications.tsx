import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';
import { Pagination } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { checkAdminAuthStatus } from '../../../features/admin/adminSlice';

interface Application {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  courseId: {
    _id: string;
    name: string;
  };
  status: string;
  createdAt: string;
}

const FinancialAidApplicationList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
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
    fetchApplications(currentPage);
  }, [currentPage]);

  const fetchApplications = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await apiService.get<{ applications: Application[]; totalPages: number }>(
        '/admin/financial-aid-applications', 
        { params: { page, limit: 5 } }
      );
      setApplications(response.applications);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Error fetching applications');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              <div className="p-6 bg-purple-800 text-white">
                <h1 className="text-3xl font-bold">Financial Aid Applications</h1>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center">{error}</div>
                ) : (
                  <>
                    <ul className="space-y-4">
                      {applications.map((app) => (
                        <motion.li
                          key={app._id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="cursor-pointer bg-gray-100 hover:bg-gray-200 p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out"
                          onClick={() => navigate(`/application/${app._id}`)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-lg text-gray-800">{app.userId.name}</p>
                              <p className="text-sm text-gray-600">{app.courseId.name}</p>
                              <p className="text-xs text-gray-500">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(app.status)}`}>
                              {app.status}
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                    {/* Pagination Component */}
                    <div className="flex justify-center mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinancialAidApplicationList;