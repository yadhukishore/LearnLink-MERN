import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { checkTutorAuthStatus } from '../../features/tutor/tutorSlice';
import { RootState } from '../store/store';

interface Message {
  _id: string;
  sender: { _id: string; name: string };
  senderRole: 'Student' | 'Tutor';
  content: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const { roomId } = useParams<{ roomId: string }>();
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
    const newSocket = io('http://localhost:8000');
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
      const response = await axios.get(`http://localhost:8000/api/chat/history/${roomId}`);
      console.log('Chat History:', response.data.chat.messages);
      setMessages(response.data.chat.messages);
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
      socket.emit('send_message', messageData);
      setInputMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">Chat Room: {roomId}</h1>
        <p>Logged in as: {participant?.name || 'Unknown'} ({userRole})</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-4 ${
              message.sender._id === participant?.id ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender._id === participant?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-black'
              }`}
            >
              <p className="font-bold">{message.sender.name} ({message.senderRole})</p>
              <p>{message.content}</p>
              <p className="text-xs mt-1">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 border rounded-l-lg p-2"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;