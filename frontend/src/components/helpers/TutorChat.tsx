import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface Message {
  sender: {
    _id: string;
    name: string;
  };
  content: string;
  timestamp: string;
}

interface RootState {
  tutor: {
    tutor: {
      id: string;
      name: string;
    } | null;
  };
}

const TutorChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userId } = useParams<{ userId: string }>();
  const tutor = useSelector((state: RootState) => state.tutor.tutor);

  useEffect(() => {
    const newSocket = io('http://localhost:8000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && tutor) {
      const roomId = `${userId}_${tutor.id}`;
      socket.emit('join_room', roomId);

      socket.on('receive_message', (message: Message) => {
        console.log('Message received from server:', message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      fetchChatHistory(roomId);
    }
  }, [socket, tutor, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async (roomId: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chat/history/${roomId}`);
      setMessages(response.data.chat.messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = () => {
    if (socket && tutor && inputMessage.trim() !== '') {
      const roomId = `${userId}_${tutor.id}`;
      socket.emit('send_message', { roomId, senderId: tutor.id, content: inputMessage });
      setInputMessage('');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender._id === tutor?.id ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender._id === tutor?.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-800'
              }`}
            >
              <p className="font-bold">{message.sender.name}</p>
              <p>{message.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-white p-4">
        <div className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mr-2 p-2 border rounded"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorChat;