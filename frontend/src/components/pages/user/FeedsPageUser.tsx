// FeedsPageUser.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/auth/authSlice'; 
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth'; 
import Header from './HeaderUser';
import Body from './BodyFeedsUser';
import CreateFeed from './CreateFeed';

const FeedsPageUser: React.FC = () => {
  const isAuthenticated = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshFeeds, setRefreshFeeds] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleFeedCreated = () => {
    setRefreshFeeds(!refreshFeeds);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071A2B] to-[#0A1E32] text-white">
      <Header handleLogout={handleLogout} />
      <div className="container mx-auto px-4 py-8">
        <CreateFeed onFeedCreated={handleFeedCreated} />
        <Body key={refreshFeeds.toString()} />
      </div>
    </div>
  );
};

export default FeedsPageUser;