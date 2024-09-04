import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

interface AcceptCallButtonProps {
  userId: string;
  courseId: string;
}

const AcceptCallButton: React.FC<AcceptCallButtonProps> = ({ userId, courseId }) => {
  const [callLink, setCallLink] = useState<string | null>(null);
  const [isCallEnded, setIsCallEnded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkForCallLink = async () => {
      try {
        const response = await apiService.get<{ callLink: string; isEnd: boolean }>(
          `/user/check-call-link/${userId}/${courseId}`
        );
        if (response.callLink) {
          console.log("Received call link:", response.callLink);
          setCallLink(response.callLink);
          setIsCallEnded(response.isEnd);
        } else {
          setCallLink(null);
          setIsCallEnded(false);
        }
      } catch (error) {
        console.error('Error checking for call link:', error);
      }
    };

    const interval = setInterval(checkForCallLink, 5000);

    return () => clearInterval(interval);
  }, [userId, courseId]);

  const handleAcceptCall = () => {
    if (callLink) {
      navigate(callLink);
    }
  };

  if (!callLink) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center animate-pulse z-50">
      <button
        onClick={handleAcceptCall}
        className="relative bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg flex items-center"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <svg
          className="w-6 h-6 mr-2 animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10l4.28 4.28a2 2 0 01-2.82 2.82L12 14.83l-4.28 4.27a2 2 0 01-2.82-2.82L9 12.17V5a2 2 0 012-2h2a2 2 0 012 2v5z"
          ></path>
        </svg>
        Accept Call
      </button>
    </div>
  );
};

export default AcceptCallButton;
