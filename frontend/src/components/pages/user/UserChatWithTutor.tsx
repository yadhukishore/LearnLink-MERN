import React from 'react';
import Header from './HeaderUser';
import Chat from '../../helpers/Chat';

const UserChatWithTutor: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Chat with Tutor</h1>
        <Chat />
      </main>
    </div>
  );
};

export default UserChatWithTutor;