import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { tutorLoginSuccess,setTutorError, checkTutorAuthStatus } from '../../../features/tutor/tutorSlice'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { apiService } from '../../../services/api';
// import { RootState } from '../../store/store';
interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  tutor: {
    id: string;
    name: string;
    email: string;
  };
}

const TutorLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const tutor = useSelector((state: RootState) => state.tutor);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await dispatch(checkTutorAuthStatus());
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };
    checkAuthStatus();
  }, [dispatch]);

  const validateForm = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (password.trim() === '') {
      toast.error('Password cannot be empty');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await apiService.post<LoginResponse>('/tutor/tutorLogin', {
        email,
        password
      });


      if (response.success) {
        dispatch(tutorLoginSuccess(response));
        toast.success('Login successful');
        navigate('/');
      } else {
        console.error('Login failed:', response.message);
        dispatch(setTutorError(response.message));
        toast.error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Error during login:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      dispatch(setTutorError(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-row justify-center items-center bg-gradient-to-br from-indigo-800 via-violet-700 to-fuchsia-900">
      <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
      
      <div className="flex w-full max-w-7xl relative z-10">
        <div className="w-1/2 hidden md:flex items-center justify-center p-8">
          <img src="/PinkHat.png" alt="Logo" className="w-full h-auto rounded-lg shadow-2xl" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white bg-opacity-20 backdrop-filter shadow-xl backdrop-blur-lg py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-50"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </button>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm">
                      <Link to="/forgot-password" className="font-medium text-indigo-200 hover:text-indigo-100">
                        Forgot your password?
                      </Link>
                    </div>
                    <div className="text-sm text-right">
                      <Link to="/tutorRegister" className="font-medium text-indigo-200 hover:text-indigo-100">
                        New Tutor?
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default TutorLogin;
