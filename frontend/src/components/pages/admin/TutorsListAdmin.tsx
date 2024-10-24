// src/components/admin/TutorList.tsx
import React, { useEffect, useState } from 'react';
import { apiService } from '../../../services/api';
import Sidebar from './Sidebar';
import Header from './Header';
import Swal from 'sweetalert2';
import { Pagination } from 'flowbite-react';
import { motion } from 'framer-motion';

interface Tutor {
  _id: string;
  name: string;
  email: string;
  isBanned: boolean;
  createdAt: string;
}

interface TutorsResponse {
  tutors: Tutor[];
  totalPages: number;
}

interface TutorsResponse {
  tutor: Tutor;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const TutorList: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchTutors = async (page: number) => {
    setLoading(true);
    try {
      const response = await apiService.get<TutorsResponse>('/admin/adminTutorsList', {
        params: { page, limit: 6 },
      });
      setTutors(response.tutors);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors(currentPage);
  }, [currentPage]);

  const toggleTutorBanStatus = async (tutorId: string, currentStatus: boolean) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to ${currentStatus ? 'activate' : 'ban'} this tutor?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!'
      });

      if (result.isConfirmed) {
        await apiService.put(`/admin/toggleTutorBanStatus/${tutorId}`);
        await Swal.fire('Updated!', `Tutor has been ${currentStatus ? 'activated' : 'banned'}.`, 'success');
        fetchTutors(currentPage);
      }
    } catch (error: any) {
      Swal.fire('Error!', 'There was an error updating the tutor status.', 'error');
      setError(error.message);
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
                <h2 className="text-3xl font-bold">Tutors</h2>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center">{error}</div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full leading-normal">
                        <thead>
                          <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Join Date
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {tutors.map((tutor) => (
                            <motion.tr
                              key={tutor._id}
                              whileHover={{ backgroundColor: '#f7fafc' }}
                            >
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{tutor.name}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{tutor.email}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p className="text-gray-900 whitespace-no-wrap">{formatDate(tutor.createdAt)}</p>
                              </td>
                              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <button
                                  onClick={() => toggleTutorBanStatus(tutor._id, tutor.isBanned)}
                                  className={`px-4 py-2 rounded transition-colors ${
                                    tutor.isBanned
                                      ? 'bg-red-500 hover:bg-red-600 text-white'
                                      : 'bg-green-500 hover:bg-green-600 text-white'
                                  }`}
                                >
                                  {tutor.isBanned ? 'Banned' : 'Active'}
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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

export default TutorList;
