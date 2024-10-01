// FeedsPageUser.tsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth'; 
import Header from './HeaderUser';
import Body from './BodyFeedsUser';
import CreateFeed from './CreateFeed';

const FeedsPageUser: React.FC = () => {
  const isAuthenticated = useAuth();

  const [refreshFeeds, setRefreshFeeds] = useState(false);

 

  const handleFeedCreated = () => {
    setRefreshFeeds(!refreshFeeds);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071A2B] to-[#0A1E32] text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <CreateFeed onFeedCreated={handleFeedCreated} />
        <Body key={refreshFeeds.toString()} />
      </div>
    </div>
  );
};

export default FeedsPageUser;