// TutorCreateCourse.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import CourseInformation from './CourseInformation';
import CourseOptions from './CourseOptions';
import CourseContent from './CourseContent';
import CoursePreview from './CoursePreview';
import StepIndicator from '../../helpers/StepIndicator';
import Swal from 'sweetalert2';
import TutorHeader from './TutorHeader';

const TutorCreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.tutor.token);
  const tutorId = useSelector((state: RootState) => state.tutor.tutor?.id);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ['Course Information', 'Course Options', 'Course Content', 'Course Preview'];

  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    price: 0,
    estimatedPrice: 0,
    tags: '',
    level: '',
    demoUrl: '',
    thumbnailFile: null as File | null,
    benefits: [{ title: '' }],
    prerequisites: [{ title: '' }],
    courseId: '',
    category: '',
    videos: [] as {
      file: File | null;
      title: string;
      description: string;
      previewUrl: string | null;
    }[], 
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCourseData(prevState => ({
      ...prevState,
      thumbnailFile: file
    }));
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      handleNextStep();
    }
  };

  const confirmSubmit = async () => {
    try {
      if (!token || !tutorId) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      Object.entries(courseData).forEach(([key, value]) => {
        if (key === 'thumbnailFile' && value instanceof File) {
          formData.append('thumbnailFile', value);
        } else if (key === 'videos' && Array.isArray(value)) {
          value.forEach((video, index) => {
            if (video.file instanceof File) {
              formData.append(`videos`, video.file);
            }
          });
        } else if (key === 'benefits' || key === 'prerequisites') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      });

      formData.append('tutorId', tutorId);
      console.log("FormDataz:",formData)

      const response = await axios.post('http://localhost:8000/api/tutor/tutorCreateCourse', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        Swal.fire('Success', 'Course created successfully!', 'success');
        navigate('/tutorHome');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      throw error; 
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CourseInformation
            courseData={courseData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
          />
        );
      case 1:
        return <CourseOptions 
          courseData={courseData} 
          handleInputChange={handleInputChange}
          setCourseData={setCourseData}
        />;
      case 2:
        return <CourseContent 
          courseData={courseData} 
          setCourseData={setCourseData} 
          onNextStep={handleNextStep}
        />;
        case 3:
          return <CoursePreview courseData={courseData} onConfirmSubmit={confirmSubmit} />;
        default:
          return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071A2B] to-[#1A3A5A] text-white flex flex-col">
     <TutorHeader/>
      <main className="flex-grow max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
            Create a New Course
          </span>
        </motion.h2>
        
        <StepIndicator steps={steps} currentStep={currentStep} />
        
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8 bg-gray-800 bg-opacity-50 p-6 rounded-md shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xl font-semibold mb-4">{steps[currentStep]}</div>
          {renderStepContent()}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <motion.button
                type="button"
                onClick={handlePrevStep}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-gray-700 rounded-md shadow-md hover:bg-gray-600"
              >
                Previous
              </motion.button>
            )}
            {currentStep < steps.length - 1 && (
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-blue-600 rounded-md shadow-md hover:bg-blue-500"
              >
                Next
              </motion.button>
            )}
          </div>
        </motion.form>
      </main>
    </div>
  );
};


export default TutorCreateCourse;