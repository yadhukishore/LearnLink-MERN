import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

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
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/financial-aid-applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
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
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinancialAidApplicationList;