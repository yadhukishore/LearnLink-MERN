// frontend/src/components/TutorChatList.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';

interface ChatRoom {
  roomId: string;
  participants: string[];
}

const TutorChatList: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const tutor = useSelector((state: RootState) => state.tutor.tutor);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (tutor) {
        try {
          const response = await axios.get(`http://localhost:8000/api/chat/tutorChat/${tutor.id}`);
          setChatRooms(response.data.chatRooms);
        } catch (error) {
          console.error('Error fetching chat rooms:', error);
        }
      }
    };

    fetchChatRooms();
  }, [tutor]);

  const handleChatRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Studentsssss</h1>
        {chatRooms.length === 0 ? (
          <p>No students connected yet.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {chatRooms.map((room) => (
              <li
                key={room.roomId}
                className="p-4 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleChatRoomClick(room.roomId)}
              >
                <p className="text-lg font-semibold">Room ID: {room.roomId}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TutorChatList;
