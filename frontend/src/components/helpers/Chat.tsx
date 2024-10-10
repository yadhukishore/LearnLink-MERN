import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { checkTutorAuthStatus } from '../../features/tutor/tutorSlice';
import { RootState } from '../store/store';
import { apiService } from '../../services/api';

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  senderRole: 'Student' | 'Tutor';
  content: string;
  timestamp: string;
}
interface ChatHistoryResponse {
  chat: {
    messages: Message[];
  };
  userName: string;
  tutorName: string;
}


const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const { roomId } = useParams<{ roomId: string }>();
  const [userName, setUserName] = useState<string | null>(null);
  const [tutorName, setTutorName] = useState<string | null>(null);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.auth.user);
  const tutor = useSelector((state: RootState) => state.tutor.tutor);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(checkTutorAuthStatus());
  }, [dispatch]);

  const getUserRole = () => {
    if (!roomId) return 'Unknown';
    const [studentId, tutorId] = roomId.split('_');
    if (user?.id === studentId) return 'Student';
    if (tutor?.id === tutorId) return 'Tutor';
    return 'Unknown';
  };

  const userRole = getUserRole();
  const participant = userRole === 'Student' ? user : userRole === 'Tutor' ? tutor : null;

  useEffect(() => {
    const socketServerUrl = import.meta.env.VITE_BASE_URL; 
    const newSocket = io(socketServerUrl, {
      withCredentials: true,
    transports: ['websocket']
    }); 
    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && roomId && participant) {
      socket.emit('join_room', roomId);
      console.log(`Joined room: ${roomId}`);
      
      socket.on('receive_message', (message: Message) => {
        console.log('Received message:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      fetchChatHistory(roomId);
    } else {
      console.log('Socket or participant is missing');
    }
  }, [socket, roomId, participant]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async (roomId: string) => {
    try {
      const response = await apiService.get<ChatHistoryResponse>(`/chat/history/${roomId}`);
      setMessages(response.chat.messages);
      setUserName(response.userName);
      setTutorName(response.tutorName);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = () => {
    if (socket && inputMessage.trim() !== '' && participant) {
      const messageData = { 
        roomId, 
        senderId: participant.id, 
        content: inputMessage,
        senderRole: userRole  
      };
      
      setInputMessage('');
  
      console.log('Sending message:', messageData);
      socket.emit('send_message', messageData, (error: any) => {
        if (error) {
          console.error('Error sending message:', error);
          setInputMessage(inputMessage);
        }
      });
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white p-4 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Chat: {userName || 'Send a message to connect with the Tutor'} &ndash; {tutorName || 'Wait...'}
        </h1>
        <p className="text-sm">Logged in as: {participant?.name || 'Unknown'} ({userRole})</p>
        <p className="text-sm">Chatting with: {userRole === "Student"? tutorName:userName}</p>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.sender._id === participant?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg shadow-md ${
                message.sender._id === participant?.id
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm font-semibold">
                {message.sender.name} ({message.senderRole})
              </p>
              <p className="mt-1">{message.content}</p>
              <p className="text-xs mt-2 text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t shadow-md">
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
