// FeedsPageUser.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import Header from './HeaderUser';
import Body from './BodyFeedsUser';

const FeedsPageUser = () => {
  const isAuthenticated = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071A2B] to-[#0A1E32] text-white">
      <Header handleLogout={handleLogout} />
      <Body />
    </div>
  );
};

export default FeedsPageUser;