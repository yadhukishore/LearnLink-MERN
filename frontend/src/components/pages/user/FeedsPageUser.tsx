import React from 'react'
import { useDispatch } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

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
    <div>
      <div>FeedsPageUser</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default FeedsPageUser