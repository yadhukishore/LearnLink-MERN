import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { apiService } from '../../../services/api';
import { RootState } from '../../store/store';

interface ReportCourseButtonProps {
  courseId: string;
}

const ReportCourseButton: React.FC<ReportCourseButtonProps> = ({ courseId }) => {
  const [isReported, setIsReported] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?.id);


  useEffect(() => {
    const fetchCourseStatus = async () => {
      if (!userId) return;

      try {
        const response = await apiService.get<{ isReported: boolean }>(`/user/course-status/${courseId}`, {
          params: { userId }
        });
        setIsReported(response.isReported);
      } catch (error) {
        console.error('Error fetching course status:', error);
      }
    };

    fetchCourseStatus();
  }, [courseId, userId]);

  const handleReportCourse = async () => {
    if (!userId) {
      Swal.fire('Error', 'You must be logged in to report a course', 'error');
      return;
    }

    const result = await Swal.fire({
      title: 'Do you have issues with this course?',
      text: "You're about to report this course.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, report it!'
    });

    if (result.isConfirmed) {
      try {
        await apiService.post(`/user/report-course/${courseId}`, { userId });
        setIsReported(true);
        Swal.fire('Reported!', 'The course has been reported.', 'success');
      } catch (error) {
        console.error('Error reporting course:', error);
        Swal.fire('Error', 'Failed to report the course. Please try again.', 'error');
      }
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <button
      className={`mt-4 py-2 px-4 rounded-lg ${
        isReported
          ? 'bg-gray-500 cursor-not-allowed' 
          : 'bg-red-600 hover:bg-red-700'
      } text-white`}
      onClick={handleReportCourse}
      disabled={isReported}
    >
      {isReported ? 'You Reported This Course' : 'Report this Course'}
    </button>
  );
};

export default ReportCourseButton;
