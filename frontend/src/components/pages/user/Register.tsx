import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setError } from '../../../features/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateForm = () => {
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error('Password must contain at least one number');
      return false;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      toast.error('Password must contain at least one special character (@, #, $, etc.)');
      return false;
    }
    if(!/^\S/.test(password)){
      toast.error('Dont add spaces in your password!');
      return false;
    }
 
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('Submitting registration with:', { name, email, password });

      const response = await axios.post('http://localhost:8000/api/auth/register', {
        name,
        email,
        password
      });

      if (response.status === 200) {
        console.log('Registration successful:', response.data);
        navigate('/verify-otp', { state: { email, name, password } });
      }
       else {
        console.error('Registration failed:', response.data.message);
        dispatch(setError(response.data.message));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Axios error response:', error.response.data);
        if (error.response.status === 400 && error.response.data.message === 'User already exists') {
          toast.error('User already exists');
        } else {
          dispatch(setError(error.response.data.message || 'An error occurred during registration'));
        }
      } else {
        console.error('Unknown error:', error);
        dispatch(setError('An error occurred during registration'));
      }
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
              Create a new account
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white bg-opacity-20 backdrop-filter shadow-lg backdrop-blur-lg py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-50"
                    />
                  </div>
                </div>

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
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-white"
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Signing up...(Wait)' : 'Sign up'}
                  </button>
                </div>
                <div className="text-sm text-right">
                      <Link to="/login" className="font-medium text-indigo-200 hover:text-indigo-100">
                        Already have an account?
                      </Link>
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

export default Register;
