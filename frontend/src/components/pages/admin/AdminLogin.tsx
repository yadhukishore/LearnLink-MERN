import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLoginSuccess, setAdminError } from '../../../features/admin/adminSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../../store/store';
import { apiService } from '../../../services/api';

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    username: string;
  };
}

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.admin.isAuthenticated);
 
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/adminDashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    if (username.trim() === '') {
      toast.error('Username cannot be empty');
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
      const response = await apiService.post<LoginResponse>('/admin/admin-login', {
        username,
        password
      });

      const { token, admin } = response;
           
      dispatch(adminLoginSuccess({ token, admin }));

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(admin));

      // Instead of setting the header directly, we store the token in localStorage
      // The apiService will use this token for future requests
      localStorage.setItem('accessToken', token);

      toast.success('Login successful');
      navigate('/adminDashboard');
    } catch (error) {
      console.error('Error during login:', error);
      if (error instanceof Error) {
        dispatch(setAdminError(error.message || 'An error occurred during login'));
        toast.error(error.message || 'Invalid credentials');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-violet-700 to-fuchsia-900">
      <div className="absolute inset-0 backdrop-blur-sm z-0"></div>

      <div className="flex w-full max-w-7xl relative z-10">
        {/* Login form container */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Admin Sign In
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white bg-opacity-20 backdrop-filter shadow-xl backdrop-blur-lg py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-white">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
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
                </div>
              </form>
            </div>
          </div>
          <ToastContainer />
        </div>
        {/* Logo container */}
        <div className="hidden md:flex w-1/2 justify-center items-center relative">
          <img src="/PinkHat.png" alt="Logo" className="w-3/4 h-auto rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
