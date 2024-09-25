// src/pages/TutorChatWithUser.tsx
import React from 'react';
import TutorChat from '../../helpers/TutorChat';
import TutorHeader from './TutorHeader';

const TutorChatWithUser: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <TutorHeader/>
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Chat with Student</h1>
        <TutorChat />
      </main>
    </div>
  );
};

export default TutorChatWithUser;
