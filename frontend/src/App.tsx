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
import TutorRegister from './components/pages/tutor/TutorRegister.tsx';
import TutorLogin from './components/pages/tutor/TutorLogin.tsx';
import AdminLogin from './components/pages/admin/AdminLogin.tsx';
import AdminDashboard from './components/pages/admin/AdminDashboard.tsx';
import TutorFeeds from './components/pages/tutor/TutorFeeds.tsx';
import AdminStudentList from './components/pages/admin/AdminStudentList.tsx';
import TutorProofs from './components/pages/tutor/TutorProofs.tsx';
import WaitingForApproval from './components/pages/tutor/WaitingForApproval.tsx';
import ApproveTutor from './components/pages/admin/ApproveTutor.tsx';
import TutorDetails from './components/pages/admin/TutorDetails.tsx';
import TutorHome from './components/pages/tutor/TutorHome.tsx';
// import { checkAdminAuthStatus } from './features/admin/adminSlice.ts';
import { checkTutorAuthStatus } from './features/tutor/tutorSlice';
import TutorCreateCourse from './components/pages/tutor/TutorCreateCourse.tsx';
import TutorCourseDetail from './components/pages/tutor/TutorCourseDetail.tsx';
import UserCourseList from './components/pages/user/UserCourseList.tsx';
import UserCourseDetail from './components/pages/user/UserCourseDetail.tsx';
import ApplyFinancialAid from './components/pages/user/FinancialAidApply.tsx';

  const AppRoutes = () => {
    const isAuthenticated = useAuth();
    const isRegistered = useSelector((state: RootState) => state.auth.isRegistered);
    const adminState = useSelector((state: RootState)=> state.admin);
    const tutorState = useSelector((state:RootState)=> state.tutor);
  
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
          <Route path="/courses" element={<UserCourseList/>} />
          <Route path="/courses/:courseId" element={<UserCourseDetail />} />
          <Route path="/apply-financial-aid/:courseId" element={<ApplyFinancialAid />} />
          <Route 
        path='/tutorRegister' 
        element={tutorState.isAuthenticated ? <Navigate to="/tutor" /> : <TutorRegister />} 
      />
      <Route 
        path='/tutorLogin' 
        element={tutorState.isAuthenticated ? <Navigate to="/tutorHome" /> : <TutorLogin />} 
      />
      <Route 
        path='/tutor' 
        element={tutorState.isAuthenticated ? <TutorFeeds /> : <Navigate to="/tutorRegister" />} 
      />
<Route 
        path='/submit-tutor-proofs/:tutorId' 
        element={<TutorProofs />} 
      />

<Route path="/tutorHome" element={tutorState.isAuthenticated ? <TutorHome /> : <Navigate to="/tutorLogin" />} />
<Route path="/tutorCreateCourse" element={tutorState.isAuthenticated ? <TutorCreateCourse /> : <Navigate to="/tutorLogin" />} />
<Route path="/tutorCourseDetail/:id" element={<TutorCourseDetail />} />
<Route path='/waiting-for-approval' element={<WaitingForApproval/>}/>

<Route path="/admin-login" element={<AdminLogin />} />
<Route path="/adminDashboard" element={<AdminDashboard />} />
<Route path="/adminStudentsList" element={<AdminStudentList/>}/>
<Route path="/adminApprove-tutor" element={<ApproveTutor/>}/>
<Route path='/tutorCourseDetail/:courseId' element={<TutorCourseDetail/>}/>
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