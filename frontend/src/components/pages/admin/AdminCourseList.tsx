import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { checkAdminAuthStatus } from '../../../features/admin/adminSlice';
import { RootState } from '../../store/store';
import Sidebar from './Sidebar';
import Header from './Header';
import { FaBook, FaCalendarAlt, FaUserTie } from 'react-icons/fa';
import { Pagination } from 'flowbite-react';

interface Course {
  _id: string;
  name: string;
  thumbnail: {
    url: string;
  };
  createdAt: string;
  tutorId: {
    name: string;
  } | null;
}

interface ApiResponse {
  courses: Course[];
  totalPages: number;
  currentPage: number;
}

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
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
    } else {
      fetchCourses(currentPage);
    }
  }, [isAuthenticated, navigate, currentPage]);

  const fetchCourses = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await apiService.get<ApiResponse>(
        '/admin/adminCoursesList', 
        { params: { page, limit: 6 } }
      );
      // console.log('API Response:', response); 
      setCourses(response.courses);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Error fetching courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/adminCourseDetails/${courseId}`);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return null; // Later i will add a loading spinner
  }

  // console.log('Render - Courses:', courses); 

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Courses List</h1>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : courses.length === 0 ? (
            <div className="text-center text-gray-500">No courses found.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
                    onClick={() => handleCourseClick(course._id)}
                  >
                    <img
                      src={course.thumbnail?.url || '/placeholder-image.jpg'}
                      alt={course.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.name}</h2>
                      <div className="flex items-center text-gray-600 mb-2">
                        <FaCalendarAlt className="mr-2" />
                        <p>Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaUserTie className="mr-2" />
                        <p>Tutor: {course.tutorId?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="bg-purple-500 text-white py-2 px-4 flex items-center justify-center">
                      <FaBook className="mr-2" />
                      <span>View Details</span>
                    </div>
                  </div>
                ))}
              </div>
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
        </main>
      </div>
    </div>
  );
};

export default CoursesList;