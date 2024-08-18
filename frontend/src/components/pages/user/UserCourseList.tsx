// src/components/user/UserCourseList.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from './HeaderUser';
import CurrentLearningCourses from './CurrentLearningCourses';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface Course {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    url: string;
  };
  price: number;
  estimatedPrice:number;
  level: string;
  category:string;
}

interface CurrentCourse extends Course {
  progress: number;
}

const UserCourseList: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourses, setCurrentCourses] = useState<CurrentCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [allCoursesResponse, currentCoursesResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/user/courses'),
          axios.get(`http://localhost:8000/api/user/current-courses?userId=${user?.id}`)
        ]);
        console.log('All Courses:', allCoursesResponse.data.courses);
        console.log('Current Courses:', currentCoursesResponse.data.currentCourses);

        setCourses(allCoursesResponse.data.courses);
        setCurrentCourses(currentCoursesResponse.data.currentCourses);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchCourses();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071A2B] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <CurrentLearningCourses courses={currentCourses} />
        <h1 className="text-4xl font-bold mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            Explore Our Courses
          </span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => {
            const discount = course.estimatedPrice
              ? Math.round(((course.estimatedPrice - course.price) / course.estimatedPrice) * 100)
              : 0;

            return (
              <motion.div
                key={course._id}
                className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-gray-900 p-4 rounded-lg h-full flex flex-col">
                  <img src={course.thumbnail.url} alt={course.name} className="w-full h-48 object-cover rounded-md mb-4" />
                  <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
                  <p className="text-sm text-gray-300 mb-4 flex-grow">{course.category}</p>
                  <div className="flex justify-start items-center mb-4">
                    <span className="text-lg font-bold text-yellow-400">₹{course.price.toFixed(2)}</span>
                    {course.estimatedPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">₹{course.estimatedPrice.toFixed(2)}</span>
                    )}
                    {discount > 0 && (
                      <span className="text-sm font-semibold text-red-400 ml-4">{discount}% Off</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <Link 
                      to={`/courses/${course._id}`} 
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default UserCourseList;