// TutorCourseList.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'flowbite-react';
import { apiService } from '../../services/api';

interface ICourse {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    url: string;
  };
  price: number;
  level: string;
  estimatedPrice?:number;
}
interface FetchCoursesResponse {
  success: boolean;
  courses: ICourse[];
  totalPages: number;
  currentPage: number;
}
const TutorCourseList: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const token = useSelector((state: RootState) => state.tutor.token);
  const tutorId = useSelector((state: RootState) => state.tutor.tutor?.id);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<FetchCoursesResponse>(`/tutor/getCourses/${tutorId}`, {
          params: { page: currentPage, limit: 6 },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.success) {
          setCourses(response.courses);
          setTotalPages(response.totalPages);
        } else {
          setError('Failed to fetch courses');
        }
      } catch (err) {
        setError('Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    if (token && tutorId) {
      fetchCourses();
    }
  }, [token, tutorId, currentPage]);
  const handleCourseClick = (courseId: string) => {
    navigate(`/tutorCourseDetail/${courseId}`);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };


  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => {
          const discount = course.estimatedPrice 
            ? Math.round(((course.estimatedPrice - course.price) / course.estimatedPrice) * 100) 
            : 0;

          return (
            <motion.div
              key={course._id}
              className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              whileHover={{ scale: 1.05 }}
              onClick={() => handleCourseClick(course._id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-gray-900 p-4 rounded-lg h-full">
                <img src={course.thumbnail.url} alt={course.name} className="w-full h-40 object-cover rounded-md mb-4" />
                <h4 className="text-lg font-semibold mb-2">{course.name}</h4>
                <p className="text-sm text-gray-300 mb-2">{course.description.substring(0, 100)}...</p>
                <p className="text-sm text-gray-400">Level: {course.level}</p>
                {course.estimatedPrice && (
                  <p className="text-sm text-gray-500 line-through">₹ {course.estimatedPrice.toFixed(2)}</p>
                )}
                <p className="text-sm font-semibold text-green-400 mt-2">₹ {course.price.toFixed(2)}</p>
                {discount > 0 && (
                  <p className="text-sm font-semibold text-red-400 mt-1">{discount}% OFF</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Component */}
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          showIcons
        />
      </div>
    </div>
  );
};


export default TutorCourseList;