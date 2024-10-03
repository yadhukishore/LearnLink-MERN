// TutorCourseDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store'; 
import TutorHeader from './TutorHeader';

interface ICourse {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    url: string;
  };
  price: number;
  estimatedPrice?:number;
  level: string;
  videos: Array<{
    title: string;
    description: string;
    videoUrl: string;
  }>;
  // Add other properties as needed
}

const TutorCourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.tutor.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tutor/tutorCourseDetail/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourse(response.data.course);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to fetch course details: ' + err);
        setLoading(false);
      }
    };
  
    if (token && id) {
      fetchCourse();
    }
  }, [token, id]);

  const handleEdit = () => {
    navigate(`/tutorEditCourse/${id}`);
  };

  const handleCreateQuiz = () => {
    navigate(`/tutorCreateQuiz/${id}`);
  };


  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:8000/api/tutor/deleteCourse/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate('/tutorHome');
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  if (loading) return <div>Loading course details...</div>;
  if (error) return <div>{error}</div>;
  if (!course) return <div>Course not found</div>;

  const discount = course.estimatedPrice 
  ? Math.round(((course.estimatedPrice - course.price) / course.estimatedPrice) * 100)
  : 0;


  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
    <TutorHeader />
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">{course.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Course Videos</h2>
            {course.videos.map((video, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-xl font-semibold">{video.title}</h3>
                <p className="text-gray-300 mb-2">{video.description}</p>
                <video controls className="w-full">
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
        <div>
          <img src={course.thumbnail.url} alt={course.name} className="w-1/2 rounded-lg mb-6" />
          <p className="text-lg mb-4">{course.description}</p>
          <p className="text-lg font-semibold mb-2">
            {course.estimatedPrice && (
              <span className="text-gray-500 line-through">₹ {course.estimatedPrice.toFixed(2)}</span>
            )}
          </p>
          <p className="text-xl font-semibold mb-2">Price: ₹{course.price.toFixed(2)}</p>
          {discount > 0 && (
            <p className="text-lg font-semibold text-red-400 mb-4">{discount}% OFF</p>
          )}
          <p className="text-lg mb-4">Level: {course.level}</p>
          <div className="flex space-x-4">
            <button
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Edit Course
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Delete Course
            </button>
            <button
              onClick={handleCreateQuiz}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Create Quiz
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
  
  );
};

export default TutorCourseDetail;