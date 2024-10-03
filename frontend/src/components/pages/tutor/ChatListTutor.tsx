import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { FaUserCircle } from 'react-icons/fa';
import TutorHeader from './TutorHeader';

interface ChatRoom {
  roomId: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender: string;
}

interface ApiResponse {
  chatRooms: ChatRoom[]; 
}
const ChatListTutor: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const tutor = useSelector((state: RootState) => state.tutor.tutor);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (tutor) {
        try {
          const response = await apiService.get<ApiResponse>(`/chat/tutorChat/${tutor.id}`);
          setChatRooms(response.chatRooms);
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
    <div className="min-h-screen bg-gray-50">
        <TutorHeader/>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-600">Chats</h1>
        {chatRooms.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No students connected yet.</p>
        ) : (
          <ul className="space-y-4">
            {chatRooms.map((room) => (
              <li
                key={room.roomId}
                className="p-6 bg-white shadow-lg rounded-lg hover:bg-indigo-50 transition duration-300 ease-in-out cursor-pointer"
                onClick={() => handleChatRoomClick(room.roomId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FaUserCircle className="text-4xl text-gray-400" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {room.userName || 'Unknown Student'}
                      </p>
                      <p className="text-sm text-gray-500">
                         {room.lastMessageSender || 'Unknown'}: {room.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{new Date(room.lastMessageTime).toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Room ID: {room.roomId}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatListTutor;
