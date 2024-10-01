import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { RootState } from '../../store/store';
import Header from './HeaderUser';
import { FaPlay, FaLock, FaCalendarAlt } from 'react-icons/fa';
import AvailableTimes from './AvailableTimes';
import AcceptCallButton from './AcceptCallButton';
import { apiService } from '../../../services/api';
import ReportCourseButton from './ReportCourseButton';

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: {
    public_id: string;
    url: string;
  };
}

interface AvailableTime {
  _id: string;
  startTime: string;
  endTime: string;
}

const CourseVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [isPassed, setIsPassed] = useState(false);
  
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchCourseVideos = async () => {
      try {
        const response = await apiService.get<{ hasAccess: boolean; videos: Video[] }>(
          `/user/course-videos/${courseId}`, 
          { params: { userId: user?.id } }
        );
        if (response.hasAccess) {
          setVideos(response.videos);
          setCurrentVideo(response.videos[0]);
        } else {
          navigate('/courses');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course videos:', error);
        navigate('/courses');
        setLoading(false);
      }
    };


    const fetchAvailableTimes = async () => {
      try {
        const response = await apiService.get<{ availableTimes: AvailableTime[] }>(
          `/user/available-times/${courseId}`
        );
        setAvailableTimes(response.availableTimes);
      } catch (error) {
        console.error('Error fetching available times:', error);
      }
    };

    fetchCourseVideos();
    fetchAvailableTimes();

    const fetchQuizResult = async () => {
      try {
        const response = await apiService.get<{ isPassed: boolean }>(
          `/user/quiz-result/${courseId}`,
          { params: { userId: user?.id } }
        );
        setIsPassed(response.isPassed);
      } catch (error) {
        console.error('Error fetching quiz result:', error);
      }
    };

    fetchQuizResult();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const forbiddenKeys = ['PrintScreen', 'p', 'P', 's', 'S', 'F12', 'F11'];
      if (forbiddenKeys.includes(event.key) || (event.ctrlKey && event.key === 'p')) {
        event.preventDefault();
        Swal.fire({
          icon: 'warning',
          title: 'Action Not Allowed',
          text: 'Screenshots and printing are not allowed.',
        });
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [courseId, user?.id, navigate]);

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
  };

  const handleStartTest = () => {
    navigate(`/quiz/${courseId}`);
  };
  const handleGetCertificate = () => {
    navigate(`/get-certificate/${courseId}`);
  };

  const handleScheduleCall = async (timeId: string) => {
    try {
      await apiService.post(`/user/schedule-call/${courseId}`, {
        userId: user?.id,
        timeId: timeId
      });
      Swal.fire({
        icon: 'success',
        title: 'Call Scheduled!',
        text: 'Your call has been scheduled successfully.',
      });
      const response = await apiService.get<{ availableTimes: AvailableTime[] }>(
        `/user/available-times/${courseId}`
      );
      setAvailableTimes(response.availableTimes);
    } catch (error) {
      console.error('Error scheduling call:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to schedule call. Please try again.',
      });
    }
  };

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
      <main className="container mx-auto py-8 px-4">
      <AcceptCallButton userId={user?.id} courseId={courseId!} />
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video Player */}
          <div className="lg:w-3/4">
            {currentVideo && (
              <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={currentVideo.videoUrl}
                  poster={currentVideo.videoThumbnail.url}
                  controls
                  className="w-full aspect-video"
                  onContextMenu={(e) => e.preventDefault()}
                  controlsList="nodownload"
                >
                  Your browser does not support the video tag.
                </video>
                <div className="p-4">
                  <h2 className="text-2xl font-bold mb-2">{currentVideo.title}</h2>
                  <p className="text-gray-400">{currentVideo.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Video List and Available Times */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-gray-800 rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-bold mb-4">Course Content</h3>
              <ul className="space-y-2">
                {videos.map((video, index) => (
                  <li 
                    key={video._id} 
                    className={`p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                      currentVideo?._id === video._id ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <div className="flex items-center">
                      <div className="mr-2">
                        {currentVideo?._id === video._id ? (
                          <FaPlay className="text-white" />
                        ) : (
                          <FaLock className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{`${index + 1}. ${video.title}`}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Available Times */}
            <AvailableTimes courseId={courseId} userId={user?.id} />
            {/* Start the Test Button */}
              <div className="mt-4 pt-8">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                onClick={handleStartTest}
              >
                Start the Test
              </button>
            </div>
              {/* Get Certificate Button */}
              {isPassed && (
              <div className="mt-4">
                <button
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  onClick={handleGetCertificate}
                >
                  Get Certificate
                </button>
              </div>
            )}
          </div>
        </div>
                     {/* Report Course Button */}
                     <div className="mt-8">
          <ReportCourseButton courseId={courseId!} />
        </div>
      </main>
    </div>
  );
};

export default CourseVideos;
