import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../api/axiosConfig';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface ReportedCourse {
  _id: string;
  name: string;
  reportedBy: Array<{ _id: string, name: string, email: string, reason?: string }>; 
}


const CourseReport: React.FC = () => {
  const [reportedCourses, setReportedCourses] = useState<ReportedCourse[]>([]);

  useEffect(() => {
    const fetchReportedCourses = async () => {
      const token = localStorage.getItem('adminToken');
      console.log("Admin Token:", token); 
      
      try {
        const response = await axiosInstance.get('/admin/adminReportedCourses');
        setReportedCourses(response.data); 
      } catch (error) {
        console.error('Error fetching reported courses:', error);
      }
    };

    fetchReportedCourses();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <div className="p-8">
          {reportedCourses.length === 0 ? (
            <p className="text-lg text-gray-500">No courses have been reported yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-lg rounded-xl border border-gray-200">
                <thead className="bg-purple-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Course Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Reported By (Users)</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reportedCourses.map((course) => (
                    <tr key={course._id} className="hover:bg-indigo-50 transition duration-150">
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        {course.name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        {course.reportedBy.map((user) => (
                          <div key={user._id} className="mb-4">
                            <p className="text-gray-700">
                              {user.name} <span className="text-blue-600">( {user.email} )</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Reason: {user.reason ? user.reason : "other"}
                            </p>
                          </div>
                        ))}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-sm">
                        <Link
                          to={`/adminCourseDetails/${course._id}`}
                          className="text-purple-600 font-bold hover:bg-white rounded-xl p-2"
                        >
                          View Course
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseReport;
