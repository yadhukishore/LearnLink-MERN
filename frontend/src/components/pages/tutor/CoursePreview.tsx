// CoursePreview.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

interface CoursePreviewProps {
  courseData: {
    name: string;
    description: string;
    price: number;
    estimatedPrice: number;
    tags: string;
    level: string;
    demoUrl: string;
    thumbnailFile: File | null;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    category: string;
    videos: { file: File | null; title: string; description: string; previewUrl: string | null }[];
  };
  onConfirmSubmit: () => void;
}
const CoursePreview: React.FC<CoursePreviewProps> = ({ courseData, onConfirmSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You're about to submit your course. This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);
      try {
        await onConfirmSubmit();
        Swal.fire('Success', 'Course submitted successfully!', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to submit course. Please try again.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };



  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-6">Course Preview</h2>
      
      <motion.div whileHover={{ scale: 1.01 }} className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">{courseData.name}</h3>
        <p className="text-gray-300 mb-6">{courseData.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <strong>Price:</strong> ₹{courseData.price}
          </div>
          <div>
            <strong>Estimated Price:</strong> ${courseData.estimatedPrice}
          </div>
          <div>
            <strong>Level:</strong> {courseData.level}
          </div>
          <div>
            <strong>Category:</strong> {courseData.category}
          </div>
          <div>
            <strong>Tags:</strong> {courseData.tags}
          </div>
          <div>
            <strong>Demo URL:</strong> <a href={courseData.demoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{courseData.demoUrl}</a>
          </div>
        </div>
        
        <div className="mb-6">
          <strong className="block mb-2">Thumbnail:</strong>
          {courseData.thumbnailFile && (
            <img src={URL.createObjectURL(courseData.thumbnailFile)} alt="Course Thumbnail" className="w-64 h-auto object-cover rounded" />
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <strong className="block mb-2">Benefits:</strong>
            <ul className="list-disc list-inside">
              {courseData.benefits.map((benefit, index) => (
                <li key={index}>{benefit.title}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <strong className="block mb-2">Prerequisites:</strong>
            <ul className="list-disc list-inside">
              {courseData.prerequisites.map((prerequisite, index) => (
                <li key={index}>{prerequisite.title}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
  <strong className="block text-xl mb-4">Course Content:</strong>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {courseData.videos.map((video, index) => (
      <div key={index} className="bg-gray-700 rounded-lg overflow-hidden">
        {video.previewUrl && (
          <video className="w-full h-48 object-cover" controls>
            <source src={video.previewUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="p-4">
          <h4 className="font-semibold text-lg mb-2">{video.title}</h4>
          <p className="text-sm text-gray-300">{video.description}</p>
        </div>
      </div>
    ))}
  </div>
</div>
      </motion.div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full px-6 py-4 ${
          isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-500'
        } text-white text-lg font-semibold rounded-md shadow-md transition duration-300`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Course'}
      </motion.button>
    </div>
  );
};

export default CoursePreview;