import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../../services/api';
import { FaUserCircle } from 'react-icons/fa';
import TutorHeader from './TutorHeader';
import TutorLoginPrompt from '../../notAuthenticatedPages/TutorLoginPrompt';
import { checkTutorAuthStatus } from '../../../features/tutor/tutorSlice';

interface ChatRoom {
  roomId: string;
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender: string;
  isLastMessageRead: boolean; 
}

interface ApiResponse {
  chatRooms: ChatRoom[]; 
}
const ChatListTutor: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const tutor = useSelector((state: RootState) => state.tutor.tutor);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(checkTutorAuthStatus());
        setLoading(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (tutor?.id) {
        try {
          const response = await apiService.get<ApiResponse>(`/chat/tutorChat/${tutor.id}`);
          setChatRooms(response.chatRooms);
        } catch (error) {
          console.error('Error fetching chat rooms:', error);
        }
      }
    };

    if (!loading) {
      fetchChatRooms();
    }
  }, [tutor, loading]);

  const handleChatRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>;
  }
  
  if(!tutor){
    return <TutorLoginPrompt/>
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
        <TutorHeader/>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-600">Chatz</h1>
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
                        <p className={`text-sm ${room.isLastMessageRead ? 'text-gray-500' : 'text-gray-900 font-bold'}`}>
                        {room.lastMessageSender || 'Unknown'}: {room.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 py-2">{new Date(room.lastMessageTime).toLocaleString()}</p>
                    {!room.isLastMessageRead && (
                      <p className="text-xs font-semibold bg-green-200 text-center rounded-lg mx-6 p-1" >New Message</p>
                    )}                 
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
