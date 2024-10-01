import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { apiService } from '../../../services/api';
import { RootState } from '../../store/store';
import { FaFlag, FaChevronDown } from 'react-icons/fa';

interface ReportCourseButtonProps {
  courseId: string;
}

const ReportCourseButton: React.FC<ReportCourseButtonProps> = ({ courseId }) => {
  const [isReported, setIsReported] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const reportingReasons = [
    'Inappropriate content',
    'Misleading information',
    'Poor quality',
    'Spam or ads',
    'Other',
  ];

  useEffect(() => {
    const fetchCourseStatus = async () => {
      if (!userId) return;

      try {
        const response = await apiService.get<{ isReported: boolean }>(`/user/course-status/${courseId}`, {
          params: { userId },
        });
        setIsReported(response.isReported);
      } catch (error) {
        console.error('Error fetching course status:', error);
      }
    };

    fetchCourseStatus();
  }, [courseId, userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleReportCourse = async (reason: string) => {
    if (!userId) {
      Swal.fire('Error', 'You must be logged in to report a course', 'error');
      return;
    }

    try {
      await apiService.post(`/user/report-course/${courseId}`, { userId, reason });
      setIsReported(true);
      setShowDropdown(false);
      Swal.fire('Reported!', 'The course has been reported.', 'success');
    } catch (error) {
      console.error('Error reporting course:', error);
      Swal.fire('Error', 'Failed to report the course. Please try again.', 'error');
    }
  };

  const handleReasonSelect = async (reason: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to report this course for "${reason}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, report it!',
    });

    if (result.isConfirmed) {
      handleReportCourse(reason);
    }
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        className={`inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 ${
          isReported ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isReported}
      >
        {isReported ? (
          'Course Reported'
        ) : (
          <>
            <FaFlag className="mr-2 h-5 w-5" aria-hidden="true" />
            Report Course
            <FaChevronDown className="ml-2 h-5 w-5" aria-hidden="true" />
          </>
        )}
      </button>

      {showDropdown && !isReported && (
        <div
          ref={dropdownRef}
          className="origin-top-right absolute right-0  mt-2 w-56  rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
          style={{
            bottom: 'calc(100% + 0.5rem)',
            right: 0,
          }}
        >
          <div className="py-1 px-3">
            {reportingReasons.map((reason) => (
              <button
                key={reason}
                className="text-gray-700 block w-full text-left ml-4 px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                onClick={() => handleReasonSelect(reason)}
              >
                {reason}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCourseButton;