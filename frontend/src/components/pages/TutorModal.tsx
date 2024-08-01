// TutorModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TutorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorModal: React.FC<TutorModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleAgree = () => {
    navigate('/tutorRegister');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Become a Tutor</h2>
        <p className="mb-6">
          By agreeing to become a tutor, you commit to sharing your knowledge and helping others learn. Do you want to proceed?
        </p>
        <p>Also you are required to add you personal Details and proofs to get approved and 
        certified as a Tutor in this LearnLink Platform!</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleAgree}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorModal;