// src/components/user/CurrentLearningCourses.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface CurrentCourse {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    url: string;
  };
  category: string;
  progress: number;
}

interface CurrentLearningCoursesProps {
  courses: CurrentCourse[];
}

const CurrentLearningCourses: React.FC<CurrentLearningCoursesProps> = ({ courses }) => {
  if (courses.length === 0) return null;

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Current Learning
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <motion.div
            key={course._id}
            className="bg-gradient-to-br from-green-400 to-blue-500 p-1 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="bg-gray-900 p-4 rounded-lg h-full flex flex-col">
              <img src={course.thumbnail.url} alt={course.name} className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <p className="text-sm text-gray-300 mb-4 flex-grow">{course.category}</p>
              <div className="mt-auto">
    
              {/* Animated Moving Bar */}
              <div className="relative h-2.5 bg-gray-700 rounded-full mb-4 overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
                  animate={{ x: ['0%', '60%', '0%'] }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                  style={{ width: '50%' }}
                />
              </div>

                <Link 
                  to={`/course-videos/${course._id}`} 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 block text-center"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CurrentLearningCourses;