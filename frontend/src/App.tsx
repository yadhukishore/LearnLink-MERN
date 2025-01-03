
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
import AdminDashboard from './components/pages/admin/adminDashboard/AdminDashboard.tsx';
import TutorFeeds from './components/pages/tutor/TutorFeeds.tsx';
import AdminStudentList from './components/pages/admin/AdminStudentList.tsx';
import TutorProofs from './components/pages/tutor/TutorProofs.tsx';
import WaitingForApproval from './components/pages/tutor/WaitingForApproval.tsx';
import ApproveTutor from './components/pages/admin/ApproveTutor.tsx';
import TutorDetails from './components/pages/admin/TutorDetails.tsx';
import TutorHome from './components/pages/tutor/TutorHome.tsx';
// import { checkAdminAuthStatus } from './features/admin/adminSlice.ts';
// import { checkTutorAuthStatus } from './features/tutor/tutorSlice';
import TutorCreateCourse from './components/pages/tutor/TutorCreateCourse.tsx';
import TutorCourseDetail from './components/pages/tutor/TutorCourseDetail.tsx';
import UserCourseList from './components/pages/user/UserCourseList.tsx';
import UserCourseDetail from './components/pages/user/UserCourseDetail.tsx';
import ApplyFinancialAid from './components/pages/user/FinancialAidApply.tsx';
import FinancialAidApplications from './components/pages/admin/FinancialAidApplications.tsx';
import FinancialAidApplicationDetails from './components/pages/admin/FinancialAidDetail.tsx';
import CourseVideos from './components/pages/user/CourseVideos.tsx';
import TutorEditCourse from './components/pages/tutor/TutorEditCourse.tsx';
import CoursesList from './components/pages/admin/AdminCourseList.tsx';
import CourseDetails from './components/pages/admin/CourseDetailsAdmin.tsx';
import TutorProfile from './components/pages/tutor/TutorProfile.tsx';
import TutorList from './components/pages/admin/TutorsListAdmin.tsx';
import FeedControl from './components/pages/admin/FeedsControlAdmin.tsx';
import AdminCategory from './components/pages/admin/CategoryAdmin.tsx';
// import FinancialAidApplicationList from './components/pages/tutor/FinacialAidListTutor.tsx';
import FinancialAidListTutor from './components/pages/tutor/FinacialAidListTutor.tsx';
import FinancialAidDetailsTutor from './components/pages/tutor/FinacialAidDetailsTutor.tsx';
import CheckoutCourse from './components/pages/user/CheckoutCourse.tsx';
import ScheduledCalls from './components/pages/tutor/ScheduledCalls.tsx';
import CallUserList from './components/pages/tutor/CallUserList.tsx';
import RoomPage from './components/pages/RoomPage.tsx';
import TutorWallet from './components/pages/tutor/WalletTutor.tsx';
import UserWishlist from './components/pages/user/UserWishlist.tsx';
import SearchCourses from './components/pages/user/SearchCourses.tsx';
// import UserChatWithTutor from './components/pages/user/UserChatWithTutor.tsx';
// import TutorChatWithUser from './components/pages/tutor/TutorChatWithUser.tsx';
// import TutorChat from './components/pages/tutor/TutorChatWithUser.tsx';
import TutorQuiz from './components/pages/tutor/TutorQuiz.tsx';
import UserQuizPage from './components/pages/user/UserQuizPage.tsx';
import GetCertificatePage from './components/pages/user/GetCertificatePage.tsx';
import UserChatWithTutor from './components/pages/user/UserChatWithTutor.tsx';
import TutorChatWithUser from './components/pages/tutor/TutorChatWithUser.tsx';
import Chat from './components/helpers/Chat.tsx';
import TutorChatList from './components/pages/tutor/TutorChatList.tsx';
import TutorChat from './components/helpers/TutorChat.tsx';
import ChatListTutor from './components/pages/tutor/ChatListTutor.tsx';
import CourseReport from './components/pages/admin/CourseReport.tsx';
import ErrorPage from './components/pages/Error/ErrorPage.tsx';
import UserProfile from './components/pages/user/UserProfile.tsx';
import AdminShowEvents from './components/pages/admin/AdminShowEvents.tsx';

  const AppRoutes = () => {
    const isAuthenticated = useAuth();
    const isRegistered = useSelector((state: RootState) => state.auth.isRegistered);
    // const adminState = useSelector((state: RootState)=> state.admin);
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
      <Route 
        path="/courses" 
        element={isAuthenticated ? <UserCourseList /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/courses/:courseId" 
        element={isAuthenticated ? <UserCourseDetail /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/apply-financial-aid/:courseId" 
        element={<ApplyFinancialAid />} 
      />
      <Route path="/checkoutUserCourse/:courseId" element={<CheckoutCourse />} />

      <Route 
        path="/course-videos/:courseId" 
        element={isAuthenticated ? <CourseVideos /> : <Navigate to="/login" />} 
      />
      <Route path='/userWishlist'element={<UserWishlist/>} />
      <Route path="/userProfile" element={<UserProfile />} />
      <Route path='/searchCourse'element={<SearchCourses/>} />
      <Route path="/quiz/:courseId" element={<UserQuizPage />} />
      <Route path="/get-certificate/:courseId" element={<GetCertificatePage />} />
      <Route path="/userChatWithTutor/:tutorId" element={<UserChatWithTutor/>} />
      <Route path="/chat/:roomId" element={<Chat/>} />
      <Route path="/tutor-chats" element={<TutorChatList />} />
        <Route path="/tutorChat/:roomId" element={<TutorChat />} />


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
      {/* <Route path='/userChatWithTutor/:tutorId' element={<UserChatWithTutor/>} />
      <Route path='/TutorChatWithUser/:userId' element={<TutorChatWithUser/>} />
      <Route path="/tutorChat" element={<TutorChat />} /> */}
      <Route path="/tutorCreateQuiz/:courseId" element={<TutorQuiz />} />
      <Route path="/tutorChat" element={<ChatListTutor />} />
<Route path="/tutorHome" element={<TutorHome />} />
<Route path="/tutorCreateCourse" element={ <TutorCreateCourse />} />
<Route path="/tutorCourseDetail/:id" element={<TutorCourseDetail />} />
<Route path="/tutorEditCourse/:id" element={<TutorEditCourse />} />
<Route path='/waiting-for-approval' element={<WaitingForApproval/>}/>
<Route path="/tutorProfile" element={<TutorProfile />} />
<Route path="/tutorFinacial-aids" element={<FinancialAidListTutor/>}/>
<Route path='/FinacialapplyDetail/:id' element={<FinancialAidDetailsTutor/>} />
<Route path='/scheduled-calls/:tutorId' element={<ScheduledCalls/>} />
<Route path="/callUserList/:timeId" element={<CallUserList />} />
<Route path="/room/:roomId" element={<RoomPage />} />
<Route path="/tutorWallet" element={< TutorWallet />} />
<Route path="/tutorChatWithUser/:userId" element={<TutorChatWithUser/>} />

<Route path="/admin-login" element={<AdminLogin />} />
<Route path="/adminDashboard" element={<AdminDashboard />} />
<Route path="/adminStudentsList" element={<AdminStudentList/>}/>
<Route path="/adminApprove-tutor" element={<ApproveTutor/>}/>
<Route path='/tutor-details/:tutorId' element={<TutorDetails/>}/>
<Route path='/tutorCourseDetail/:courseId' element={<TutorCourseDetail/>}/>
<Route path="/adminFinancial-aids" element={<FinancialAidApplications/>} />
<Route path="/application/:id" element={<FinancialAidApplicationDetails />} />
<Route path="/adminCoursesList" element={<CoursesList/>}/>
<Route path='/adminCourseDetails/:courseId' element={<CourseDetails/>} />
<Route path="/adminTutorsList" element={<TutorList />} />
<Route path="/adminFeedControl" element={<FeedControl />} />
<Route path="/adminCoursesCategory" element={<AdminCategory />}/>
<Route path="/adminCourseReports" element={<CourseReport />} />
<Route path="/adminEvents-offers" element={<AdminShowEvents />} />
<Route path="*" element={<ErrorPage />} />
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