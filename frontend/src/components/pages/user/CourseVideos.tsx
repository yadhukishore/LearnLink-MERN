import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Header from './HeaderUser';
import { FaPlay, FaLock } from 'react-icons/fa';

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

const CourseVideos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchCourseVideos = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/course-videos/${courseId}`, {
          params: { userId: user?.id }
        });
        if (response.data.hasAccess) {
          setVideos(response.data.videos);
          setCurrentVideo(response.data.videos[0]);
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

    fetchCourseVideos();

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
        alert("Screenshots and printing are not allowed.");
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

          {/* Video List */}
          <div className="lg:w-1/4">
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
                        <p className="text-sm text-gray-400">
                          {/* You can add video duration here if available */}
                          {/* {video.duration} */}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseVideos;