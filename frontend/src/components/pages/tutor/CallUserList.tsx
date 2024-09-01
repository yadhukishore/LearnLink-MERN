import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import TutorHeader from './TutorHeader';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface BookedUser {
  _id: string;
  name: string;
  email: string;
  courseName: string;
  courseId: string;
}

const CallUserList: React.FC = () => {
  const [bookedUsers, setBookedUsers] = useState<BookedUser[]>([]);
  const [courseName, setCourseName] = useState<string>('');
  const { timeId } = useParams<{ timeId: string }>();
  const navigate = useNavigate();

  const tutorId = useSelector((state: RootState) => state.tutor.tutor?.id);

  useEffect(() => {
    const fetchBookedUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tutor/booked-user-details/${timeId}`);
        setBookedUsers(response.data.bookedUsers);
        setCourseName(response.data.courseName);
      } catch (error) {
        console.error('Error fetching booked user details:', error);
      }
    };
  
    fetchBookedUserDetails();
  }, [timeId]);

  const handleStartCall = useCallback(async (user: BookedUser) => {
    try {
      const roomId = `${timeId}-${user._id}-${Date.now()}`;
      const callLink = `/room/${roomId}`;
      
      await axios.post(`http://localhost:8000/api/tutor/send-call-link`, {
        userId: user._id,
        tutorId: tutorId,
        courseId: user.courseId,
        callLink,
      });

      navigate(callLink);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  }, [timeId, navigate, tutorId]);

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <TutorHeader />
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-6">Booked Users List</h2>
        {courseName && (
          <h3 className="text-2xl font-semibold mb-4">Course: {courseName}</h3>
        )}
        {bookedUsers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookedUsers.map((user) => (
              <div key={user._id} className="bg-gray-800 rounded-lg shadow-lg p-6">
                <p className="mb-2"><strong>Name:</strong> {user.name}</p>
                <p className="mb-4"><strong>Email:</strong> {user.email}</p>
                <p className="mb-4"><strong>Course ID:</strong> {user.courseId}</p>
                <button
                  onClick={() => handleStartCall(user)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Start Call
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No booked users found.</p>
        )}
      </main>
    </div>
  );
};

export default CallUserList;