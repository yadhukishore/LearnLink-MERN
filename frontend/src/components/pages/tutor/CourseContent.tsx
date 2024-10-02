import React, { useState } from 'react';
import Swal from 'sweetalert2';
interface VideoData {
  file: File | null;
  title: string;
  description: string;
  previewUrl: string | null;
}

interface CourseContentProps {
  courseData: {
    videos: VideoData[];
  };
  setCourseData: React.Dispatch<React.SetStateAction<any>>;
  onNextStep: () => void;
}

const CourseContent: React.FC<CourseContentProps> = ({ courseData, setCourseData, onNextStep }) => {
  const [videos, setVideos] = useState<VideoData[]>(courseData.videos.length > 0 ? courseData.videos : [
    { file: null, title: '', description: '', previewUrl: null },
  ]);
  
  const handleVideoUpload = (index: number, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], file, previewUrl };
    setVideos(newVideos);
    setCourseData((prevData: any) => ({ ...prevData, videos: newVideos }));
  };

  const handleInputChange = (index: number, field: keyof VideoData, value: string) => {
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setVideos(newVideos);
    setCourseData((prevData: any) => ({ ...prevData, videos: newVideos }));
  };

  const addVideoContainer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    const lastVideo = videos[videos.length - 1];
    if (lastVideo.file && lastVideo.title && lastVideo.description) {
      setVideos([...videos, { file: null, title: '', description: '', previewUrl: null }]);
    } else {
      Swal.fire({
        title: 'Incomplete Video',
        text: 'Please fill in all fields for the current video before adding a new one.',
        icon: 'warning',
        confirmButtonText: 'Ok'
      });
    }
  };

  const removeVideoContainer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (videos.length > 1) {
      setVideos(videos.slice(0, -1));
    }
  };

  const canProceed = videos.every(video => video.file && video.title && video.description);

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (canProceed) {
      console.log('Videos data:', videos);
      onNextStep();
    } else {
      Swal.fire({
        title: 'Incomplete Data',
        text: 'Please fill in all fields for all videos before proceeding.',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
    }
  };
  return (
    <div>
      {videos.map((video, index) => (
        <div key={index} className="video-container border p-4 mb-4">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => e.target.files && handleVideoUpload(index, e.target.files[0])}
          />
          {video.previewUrl && (
            <video width="320" height="240" controls>
              <source src={video.previewUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          <input
            type="text"
            placeholder="Video Title"
            value={video.title}
            onChange={(e) => handleInputChange(index, 'title', e.target.value)}
            className="block mt-2 p-2 border text-black"
          />
          <textarea
            placeholder="Video Description"
            value={video.description}
            onChange={(e) => handleInputChange(index, 'description', e.target.value)}
            className="block mt-2 p-2 border text-blue-600"
          ></textarea>
          {/* Display saved video information */}
          <div className="mt-4 p-2 border">
            <strong>Saved Video Info:</strong>
            <p><strong>Title:</strong> {video.title}</p>
            <p><strong>Description:</strong> {video.description}</p>
            {video.previewUrl && (
              <p><strong>Preview URL:</strong> <a href={video.previewUrl} target="_blank" rel="noopener noreferrer">View Video</a></p>
            )}
          </div>
        </div>
      ))}

      <div className="mt-4">
        <button onClick={addVideoContainer} className="mr-2 p-2 bg-blue-500 text-white rounded">
          Add Another Video
        </button>
        <button onClick={removeVideoContainer} className="p-2 bg-red-500 text-white rounded">
          Remove Last Video
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={handleSubmit}
          disabled={!canProceed}
          className={`p-2 rounded ${canProceed ? 'bg-green-500 text-white' : 'bg-gray-400 text-gray-700'}`}
        >
          Proceed to Next Step
        </button>
      </div>
    </div>
  );
};

export default CourseContent;
