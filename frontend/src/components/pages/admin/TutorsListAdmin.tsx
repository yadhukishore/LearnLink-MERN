// src/components/admin/TutorList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Header from './Header';
import Swal from 'sweetalert2';
import { Pagination } from 'flowbite-react'; 

interface Tutor {
  _id: string;
  name: string;
  email: string;
  isBanned: boolean;
  createdAt: string;
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTutors(currentPage);
  }, [currentPage]);

  const fetchTutors = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/admin/adminTutorsList', {
        params: {
          page,
          limit: 6, 
        },
      });
      setTutors(response.data.tutors);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

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
        const response = await axios.put(`http://localhost:8000/api/admin/toggleTutorBanStatus/${tutorId}`);
        const updatedTutor = response.data.tutor;
  
        Swal.fire(
          'Updated!',
          `Tutor has been ${updatedTutor.isBanned ? 'banned' : 'activated'}.`,
          'success'
        );
  
        setTutors((prevTutors) =>
          prevTutors.map((tutor) =>
            tutor._id === tutorId ? { ...tutor, isBanned: updatedTutor.isBanned } : tutor
          )
        );
      }
    } catch (error: any) {
      Swal.fire('Error!', 'There was an error updating the tutor status.', 'error');
      setError(error.message);
    }
  };
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="py-8">
            <h2 className="text-2xl font-semibold leading-tight">Tutors</h2>
            <div className="overflow-x-auto bg-white shadow-md rounded">
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
                    <tr key={tutor._id}>
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
                          className={`px-4 py-2 rounded ${
                            tutor.isBanned
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {tutor.isBanned ? 'Banned' : 'Active'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-4"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorList;
