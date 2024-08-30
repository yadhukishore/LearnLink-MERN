import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import TutorHeader from './TutorHeader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

interface Course {
  _id: string;
  name: string;
}

interface ScheduledTime {
  _id: string;
  courseId: {
    _id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

const TutorTimeScheduling: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [scheduledTimes, setScheduledTimes] = useState<ScheduledTime[]>([]);
  const tutorId = useSelector((state: RootState) => state.tutor.tutor?.id);
  const navigate = useNavigate();
  useEffect(() => {
    if (tutorId) {
      fetchTutorCourses();
      fetchNonExpiredScheduledTimes();
    }
  }, [tutorId]);

  const fetchTutorCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/tutor/takeTheCourses/${tutorId}`);
      setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching tutor courses:', error);
    }
  };

  const fetchNonExpiredScheduledTimes = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/tutor/non-expired-available-times/${tutorId}`);
      setScheduledTimes(response.data.availableTimes);
    } catch (error) {
      console.error('Error fetching non-expired scheduled times:', error);
    }
  };

  const handleScheduleTime = async () => {
    if (!selectedCourse) {
      Swal.fire({
        icon: 'error',
        title: 'Course Required',
        text: 'Please select a course.',
      });
      return;
    }
  
    if (!startTime || !endTime) {
      Swal.fire({
        icon: 'error',
        title: 'Time Selection Required',
        text: 'Please select both start and end times.',
      });
      return;
    }
  
    if (endTime <= startTime) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Time Selection',
        text: 'End time must be after start time.',
      });
      return;
    }
  
    try {
      await axios.post(`http://localhost:8000/api/tutor/create-available-time`, {
        tutorId,
        courseId: selectedCourse,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Time scheduled successfully!',
      });
      setStartTime(null);
      setEndTime(null);
      setSelectedCourse('');
      fetchNonExpiredScheduledTimes();
    } catch (error) {
      console.error('Error scheduling time:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to schedule time. Please try again.',
      });
    }
  };

  const handleDeleteScheduledTime = async (timeId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/tutor/delete-available-time/${timeId}`);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your scheduled time has been deleted.',
        });
        fetchNonExpiredScheduledTimes();
      } catch (error) {
        console.error('Error deleting scheduled time:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to delete scheduled time. Please try again.',
        });
      }
    }
  };

  const handleViewBookedUser = (timeId: string) => {
    navigate(`/callUserList/${timeId}`);
  };

  const isTimeExpired = (endTime: string) => {
    return new Date(endTime) < new Date();
  };

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <TutorHeader />
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-6">Schedule Available Times</h2>

        {/* All Scheduled Times List */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Available Times</h3>
          {scheduledTimes.length === 0 ? (
            <p>No available times.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scheduledTimes.map((time) => (
                <div key={time._id} className={`bg-gray-800 rounded-lg p-4 shadow-md ${isTimeExpired(time.endTime) ? 'opacity-50' : ''}`}>
                  <p className='text-yellow-300' >Course: {time.courseId.name}</p>
                  <p>Start: {new Date(time.startTime).toLocaleString()}</p>
                  <p className='font-bold' >End: {new Date(time.endTime).toLocaleString()}</p>
                  <p>Status: {time.isBooked ? 'Booked' : 'Available'}</p>
                  {!isTimeExpired(time.endTime) && !time.isBooked && (
                    <button
                      onClick={() => handleDeleteScheduledTime(time._id)}
                      className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                    >
                      Delete
                    </button>
                  )}
                  {time.isBooked && (
                    <button
                      onClick={() => handleViewBookedUser(time._id)}
                      className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm ml-2"
                    >
                      View
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Scheduling Form */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-11">
          <div className="mb-4">
            <label className="block mb-2">Select Course:</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>{course.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Start Time:</label>
            <DatePicker
              selected={startTime}
              onChange={(date) => setStartTime(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">End Time:</label>
            <DatePicker
              selected={endTime}
              onChange={(date) => setEndTime(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={startTime || new Date()}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          <button
            onClick={handleScheduleTime}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Schedule Time
          </button>
        </div>
      </main>
    </div>
  );
};

export default TutorTimeScheduling;
