import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store'; 
import TutorHeader from './TutorHeader';
import { apiService } from '../../../services/api';
import Swal from 'sweetalert2';
import TutorLoginPrompt from '../../notAuthenticatedPages/TutorLoginPrompt';

interface ICourse {
  _id: string;
  name: string;
  description: string;
  thumbnail: {
    url: string;
  };
  price: number;
  estimatedPrice?: number;
  level: string;
  videos: Array<{
    title: string;
    description: string;
    videoUrl: string;
  }>;
}

interface CourseDetailResponse {
  success: boolean;
  course: ICourse;
}

interface DeleteCourseResponse {
  success: boolean;
  message: string;
}

const TutorCourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.tutor.token);
  const tutor = useSelector((state:RootState)=>state.tutor);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await apiService.get<CourseDetailResponse>(`/tutor/tutorCourseDetail/${id}`);
        setCourse(response.course);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to fetch course details: ' + (err as Error).message);
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await apiService.delete<DeleteCourseResponse>(`/tutor/deleteCourse/${id}`);
        if (response.success) {
          Swal.fire(
            'Deleted!',
            'Your course has been deleted.',
            'success'
          );
          navigate('/tutorHome');
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        Swal.fire(
          'Error!',
          `Failed to delete course: ${(err as Error).message}`,
          'error'
        );
      }
    }
  };
  if(!tutor){
    return <TutorLoginPrompt/>
  }

  if (loading) return <div><TutorLoginPrompt/></div>;
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