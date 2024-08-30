import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TutorHeader from './TutorHeader';

interface BookedUser {
  _id: string;
  name: string;
  email: string;
}

const CallUserList: React.FC = () => {
  const [bookedUsers, setBookedUsers] = useState<BookedUser[]>([]);
  const { timeId } = useParams<{ timeId: string }>();

  useEffect(() => {
    const fetchBookedUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tutor/booked-user-details/${timeId}`);
        setBookedUsers(response.data.bookedUsers);
      } catch (error) {
        console.error('Error fetching booked user details:', error);
      }
    };

    fetchBookedUserDetails();
  }, [timeId]);

  const handleStartCall = (user: BookedUser) => {
    // Implement call functionality here
    console.log('Starting call with user:', user.name);
  };

  return (
    <div className="min-h-screen bg-[#071A2B] text-white">
      <TutorHeader />
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-6">Booked Users List</h2>
        {bookedUsers.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookedUsers.map((user) => (
              <div key={user._id} className="bg-gray-800 rounded-lg shadow-lg p-6">
                <p className="mb-2"><strong>Name:</strong> {user.name}</p>
                <p className="mb-4"><strong>Email:</strong> {user.email}</p>
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