import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from './HeaderUser';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface CourseDetail {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    public_id: string;
    url: string;
  };
  price: number;
  estimatedPrice: number;
  level: string;
  category: string;
  tags: string;
  demoUrl: string;
  benefits: Array<{ title: string; _id: string }>;
  prerequisites: Array<{ title: string; _id: string }>;
  videoCount: number;
  tutorName: string;
  hasApprovedFinancialAid: boolean;
  hasAccess: boolean;
}

const UserCourseDetail: React.FC = () => {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("USERR>",user)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/courses/${courseId}`, {
          params: { userId: user?.id } // Send userId as a query parameter
        });
        setCourse(response.data.course);
        console.log("Full response:", response.data);
        console.log("Course data:", response.data.course);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course details:', error);
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071A2B] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#071A2B] text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">Course not found</h1>
      </div>
    );
  }

  // Extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/[?&]v=([^&]+)/) || url.match(/(?:youtu\.be\/|\/v\/|\/e\/|watch\?v=|&v=|\/embed\/|\/videos\/|embed\/|youtu\.be\/|\/shorts\/|^https:\/\/www\.youtube\.com\/embed\/|^https:\/\/www\.youtube\.com\/watch\?v=)([^#&?]*).*/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : url;
  };
  const handleGoToCourse = () => {
    navigate(`/course-videos/${course._id}`); 
  };


  const videoEmbedUrl = getYouTubeEmbedUrl(course.demoUrl);
  const handleFinancialAid = () => {
    const courseID = course._id
    navigate(`/apply-financial-aid/${courseID}`);
  };

  const handleEnrollNow = () => {
    navigate(`/checkoutUserCourse/${course._id}`);
  };


  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <Header />
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 rounded-lg shadow-lg p-8"
        >
          <h1 className="text-4xl font-bold mb-6">{course.name}</h1>
          <img src={course.thumbnail.url} alt={course.name} className="w-full h-64 object-cover rounded-lg mb-6" />
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Course Details</h2>
              <p className="text-gray-300 mb-4">{course.description}</p>
              <p className="text-xl font-bold text-yellow-400 mb-2">₹{course.price.toFixed(2)}</p>
              <p className="text-lg text-gray-500 line-through mb-4">₹{course.estimatedPrice.toFixed(2)}</p>
              <p className="text-lg mb-2">
                <span className="font-semibold">Level:</span> {course.level}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold">Category:</span> {course.category}
              </p>
              <p className="text-lg mb-4">
                <span className="font-semibold">Tags:</span> {course.tags.split(',').map(tag => tag.trim()).join(', ')}
              </p>
              <p className="text-lg mb-2 flex items-center">
                <span className="font-semibold text-yellow-400 text-xl mr-2">Tutor:</span>
                <span className="text-2xl font-bold text-blue-500 bg-gray-800 px-3 py-1 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
                  {course.tutorName}
                </span>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
              <p className="text-lg mb-4">
                <span className="font-semibold">Total Videos:</span> {course.videoCount}
              </p>

              <h3 className="text-xl font-semibold mb-2">Benefits:</h3>
              <ul className="list-disc list-inside mb-4">
                {course.benefits.map((benefit) => (
                  <li key={benefit._id} className="text-gray-300">{benefit.title}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-2">Prerequisites:</h3>
              <ul className="list-disc list-inside mb-4">
                {course.prerequisites.map((prerequisite) => (
                  <li key={prerequisite._id} className="text-gray-300">{prerequisite.title}</li>
                ))}
              </ul>

              {course.demoUrl && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Watch Demo:</h3>
                  <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                      src={videoEmbedUrl}
                      title="Course Demo"
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 flex space-x-4">
        {course.hasAccess ? (
          <button
            onClick={handleGoToCourse}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Go to Course
          </button>
        ) : (
          <>
            <button 
              onClick={handleEnrollNow}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            >
              Enroll Now
            </button>
            <button
              onClick={handleFinancialAid}
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-gradient-to-r from-green-600 to-blue-800 transition duration-300"
            >
              Apply for Financial Aid
            </button>
          </>
        )}
      </div>

        </motion.div>
      </main>
    </div>
  );
};

export default UserCourseDetail;
