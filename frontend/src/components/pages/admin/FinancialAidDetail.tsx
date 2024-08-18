import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

interface ApplicationDetails {
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
  reason: string;
  description: string;
  academicEmail?: string;
  careerGoals: string;
  status: string;
  createdAt: string;
}

const FinancialAidApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchApplicationDetails(id);
    }
  }, [id]);

  const fetchApplicationDetails = async (applicationId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/financial-aid-details/${applicationId}`);
      setApplication(response.data);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  const updateApplicationStatus = async (status: 'approved' | 'rejected') => {
    if (!application) return;
    try {
      await axios.put(`http://localhost:8000/api/admin/financial-aid-status/${application._id}`, { status });
      navigate('/adminFinancial-aids');
    } catch (error) {
      console.error('Error updating application status:', error);
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
                <h1 className="text-3xl font-bold">Application Details</h1>
              </div>
              {application ? (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 font-semibold">Student Name</p>
                      <p className="text-gray-800">{application.userId.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Email</p>
                      <p className="text-gray-800">{application.userId.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Course</p>
                      <p className="text-gray-800">{application.courseId.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 font-semibold">Status</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(application.status)}`}>
                        {application.status}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Reason</p>
                    <p className="text-gray-800">{application.reason}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Description</p>
                    <p className="text-gray-800">{application.description}</p>
                  </div>
                  {application.academicEmail && (
                    <div>
                      <p className="text-gray-600 font-semibold">Academic Email</p>
                      <p className="text-gray-800">{application.academicEmail}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-600 font-semibold">Career Goals</p>
                    <p className="text-gray-800">{application.careerGoals}</p>
                  </div>
                  <div className="mt-6 space-x-4">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200 ease-in-out"
                      onClick={() => updateApplicationStatus('approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200 ease-in-out"
                      onClick={() => updateApplicationStatus('rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <p className="text-gray-600">Loading...</p>
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinancialAidApplicationDetails;