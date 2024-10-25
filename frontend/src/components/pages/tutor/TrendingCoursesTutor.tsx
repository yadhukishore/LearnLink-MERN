import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { apiService } from '../../../services/api';
import { RootState } from '../../../components/store/store';
import { checkTutorAuthStatus } from '../../../features/tutor/tutorSlice';

interface TrendingCourse {
  _id: string;
  name: string; 
  averageRating: number;
  studentCount: number;
  level: string; 
}

const TrendingCourseTutor: React.FC = () => {
  const [trendingCourses, setTrendingCourses] = useState<TrendingCourse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const tutorFromRedux = useSelector((state: RootState) => state.tutor.tutor);

  useEffect(() => {
    const fetchTrendingCourses = async () => {
      try {
        // First check auth status
        await dispatch(checkTutorAuthStatus());

        if (tutorFromRedux?.id) {
          const response = await apiService.get<TrendingCourse[]>('/tutor/trending-courses', {
            headers: { 'Tutor-Id': tutorFromRedux.id }
          }); 
          setTrendingCourses(response);
          setError(null);
        } else {
          setError('Authentication required');
        }
      } catch (error) {
        console.error('Error fetching trending courses:', error);
        setError('Failed to fetch trending courses');
      }
    };

    fetchTrendingCourses();
  }, [dispatch, tutorFromRedux?.id]);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  // Sort by averageRating and limit to the top 3 courses
  const topCourses = trendingCourses
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 3);

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold mb-6 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500 animate-pulse">
          Trending Courses
        </span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topCourses.map((course, index) => (
          <motion.div
            key={course._id}
            className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-1000 transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-gray-900 p-4 rounded-lg h-full">
              <h4 className="text-lg font-semibold mb-2">{course.name}</h4>
              <p className="text-sm text-gray-300">Top Three Level Course</p>
              <div className="mt-4 flex items-center">
                <span className="text-yellow-400">{'★'.repeat(Math.floor(course.averageRating))}</span>
                <span className="text-sm text-gray-400">({course.averageRating.toFixed(1)})</span>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-400">{course.level} level</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingCourseTutor;