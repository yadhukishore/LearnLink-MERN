import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import HomePage from "./components/pages/user/HomePage";
import Login from './components/pages/user/Login';
import Register from './components/pages/user/Register';
import VerifyOtp from './components/pages/user/VerifyOtp';
import FeedsPageUser from './components/pages/user/FeedsPageUser.tsx';
import store, { RootState } from './components/store/store';
import { useAuth } from './hooks/useAuth.ts';
import ForgotPassword from './components/pages/user/ForgotPassword.tsx';
import ResetPassword from './components/pages/user/ResetPassword.tsx';
import VerifyOtpPassword from './components/pages/user/VerifyOtpPassword.tsx';

// Create a wrapper component that uses Redux hooks

  const AppRoutes = () => {
    const isAuthenticated = useAuth();
    const isRegistered = useSelector((state: RootState) => state.auth.isRegistered);
  
    return (
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/feeds" /> : <HomePage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/feeds" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isRegistered ? <Navigate to="/login" /> : <Register />} 
        />
        <Route 
          path="/verify-otp" 
          element={isRegistered ? <Navigate to="/login" /> : <VerifyOtp />} 
        />
        <Route 
          path="/feeds" 
          element={isAuthenticated ? <FeedsPageUser /> : <Navigate to="/login" />} 
        />
        <Route path='/verify-otp-password' element={<VerifyOtpPassword/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    );
  };

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;