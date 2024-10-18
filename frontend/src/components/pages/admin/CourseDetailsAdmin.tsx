// src/components/admin/CourseDetails.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Sidebar from './Sidebar';
import Header from './Header';
import { FaBook, FaCalendarAlt, FaUserTie, FaUsers, FaDollarSign, FaStar, FaGraduationCap } from 'react-icons/fa';

interface CourseDetails {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    url: string;
  };
  createdAt: string;
  tutorId: {
    name: string;
  };
  price: number;
  ratings: number;
  purchased: number;
  isDelete: boolean;
}

interface EnrolledStudent {
  _id: string;
  name: string;
  email: string;
}

interface EnrollmentData {
  enrolledStudents: EnrolledStudent[];
  totalEnrollmentCount: number;
  financialAidApprovedCount: number;
  paidCount: number;
  paidStudents: EnrolledStudent[];
  financialAidStudents: EnrolledStudent[];
}

const CourseDetails: React.FC = () => {
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>({
    enrolledStudents: [],
    totalEnrollmentCount: 0,
    financialAidApprovedCount: 0,
    paidCount: 0,
    paidStudents: [],
    financialAidStudents: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin-login');
    } else if (courseId) {
      fetchCourseDetails();
      fetchEnrolledStudents();
    }
  }, [isAuthenticated, navigate, courseId]);

  const fetchCourseDetails = async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const data = await apiService.get<CourseDetails>(`/admin/adminCourseDetails/${courseId}`);
      console.log('Course Details:', data);
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to fetch course details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrolledStudents = async () => {
    if (!courseId) return;
    try {
      const data = await apiService.get<EnrollmentData>(`/admin/adminEnrolledStudents/${courseId}`);
      console.log('Enrollment Data:', data);
      setEnrollmentData({
        enrolledStudents: data.enrolledStudents || [],
        totalEnrollmentCount: data.totalEnrollmentCount || 0,
        financialAidApprovedCount: data.financialAidApprovedCount || 0,
        paidCount: data.paidCount || 0,
        paidStudents: data.paidStudents || [],
        financialAidStudents: data.financialAidStudents || [],
      });
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      setError('Failed to fetch enrolled students. Please try again.');
    }
  };

  const handleToggleSuspension = async () => {
    try {
      await apiService.put(`/admin/adminToggleCourseSuspension/${courseId}`);
      fetchCourseDetails();
    } catch (error) {
      setError('Failed to toggle course suspension. Please try again.');
      console.error('Error toggling course suspension:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen">
        No course data available.
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={course.thumbnail.url}
              alt={course.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-4 text-gray-800">{course.name}</h1>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaUserTie className="mr-2" />
                  <p>Tutor: {course.tutorId?.name || 'N/A'}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaDollarSign className="mr-2" />
                  <p>Price: ₹{course.price}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaUsers className="mr-2" />
                  <p>Total Enrollment: {enrollmentData.totalEnrollmentCount}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaGraduationCap className="mr-2" />
                  <p>Financial Aid Approved: {enrollmentData.financialAidApprovedCount}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaDollarSign className="mr-2" />
                  <p>Paid Enrollments: {enrollmentData.paidCount}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaStar className="mr-2" />
                  <p>Rating: {course.ratings.toFixed(1)}</p>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaBook className="mr-2" />
                  <p>Status: {course.isDelete ? 'Suspended' : 'Active'}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">{course.description}</p>
              <button
                onClick={handleToggleSuspension}
                className={`px-4 py-2 rounded ${
                  course.isDelete
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                } text-white`}
              >
                {course.isDelete ? 'Activate Course' : 'Suspend Course'}
              </button>
            </div>
          </div>

          {/* Paid Enrolled Students */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Paid Enrolled Students</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {enrollmentData.paidStudents.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {enrollmentData.paidStudents.length === 0 && (
                <p className="text-center py-4 text-gray-500">No paid students enrolled yet.</p>
              )}
            </div>
          </div>

          {/* Financial Aid Students */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Financial Aid Students</h2>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {enrollmentData.financialAidStudents.map((student) => (
                    <tr key={student._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {enrollmentData.financialAidStudents.length === 0 && (
                <p className="text-center py-4 text-gray-500">No financial aid students enrolled yet.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetails;