import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './HeaderUser';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface CourseDetail {
  _id: string;
  name: string;
  thumbnail: {
    url: string;
  };
}

const ApplyFinancialAid: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [academicEmail, setAcademicEmail] = useState('');
  const [careerGoals, setCareerGoals] = useState('');
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/courses/apply-financial-aid/${courseId}`);
        setCourse(response.data.course);
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  useEffect(() => {
    const isReasonValid = reason.trim().length > 0;
    const isDescriptionValid = wordCount(description) >= 50;
    const isCareerGoalsValid = wordCount(careerGoals) >= 50;

    // Enable the submit button if all conditions are met
    setIsSubmitEnabled(isReasonValid && isDescriptionValid && isCareerGoalsValid);
  }, [reason, description, careerGoals]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = user?.id;

    const confirmation = await MySwal.fire({
        title: 'Are you sure?',
        text: 'Do you want to submit the Financial Aid application?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
    });

    if (confirmation.isConfirmed) {
        try {
            const response = await axios.post(`http://localhost:8000/api/user/apply-financial-aid/${courseId}`, {
                userId, // Make sure this is passed
                reason,
                description,
                academicEmail,
                careerGoals,
            });

            MySwal.fire('Success!', 'Your application has been submitted.', 'success');
            navigate('/courses'); 
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                MySwal.fire('Info', error.response.data.message, 'info'); // Show existing application message
            } else {
                MySwal.fire('Error!', 'Something went wrong. Please try again later.', 'error');
            }
            console.error('Error submitting application:', error);
        }
    }
};


  const wordCount = (text: string) => {
    const trimmedText = text.trim();
    return trimmedText === '' ? 0 : trimmedText.split(/\s+/).length;
  };

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <Header />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 rounded-lg shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold mb-6">Apply for Financial Aid</h1>
          {course && (
            <div className="mb-6 flex items-center">
              <img src={course.thumbnail.url} alt={course.name} className="w-16 h-16 object-cover rounded-lg mr-4" />
              <h2 className="text-xl font-semibold">{course.name}</h2>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-1">
                Reason for Financial Aid *
              </label>
              <input
                type="text"
                id="reason"
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Write a brief description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
              {wordCount(description) < 50 && (
                <p className="text-yellow-500 text-sm mt-1">
                  Please write at least 50 words. Current word count: {wordCount(description)}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="academicEmail" className="block text-sm font-medium text-gray-300 mb-1">
                Academic Email (optional, for students)
              </label>
              <input
                type="email"
                id="academicEmail"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={academicEmail}
                onChange={(e) => setAcademicEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="careerGoals" className="block text-sm font-medium text-gray-300 mb-1">
                How will taking this course help you achieve your career goals? *
              </label>
              <textarea
                id="careerGoals"
                required
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
              ></textarea>
              {wordCount(careerGoals) < 50 && (
                <p className="text-yellow-500 text-sm mt-1">
                  Please write at least 50 words. Current word count: {wordCount(careerGoals)}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition duration-300 ease-in-out ${
                  isSubmitEnabled ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!isSubmitEnabled}
              >
                Submit Application
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default ApplyFinancialAid;
