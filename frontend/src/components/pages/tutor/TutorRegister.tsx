import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { apiService } from '../../../services/api';

interface TutorData {
  name: string;
  email: string;
  password: string;
}

interface TutorRegisterResponse {
  message: string;
  tutorId: string;
}

const TutorRegister: React.FC = () => {
  const [tutorData, setTutorData] = useState<TutorData>({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTutorData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!tutorData.name || !tutorData.email || !tutorData.password) {
      toast.error('All fields are required');
      return;
    }
    try {
      const response = await apiService.post<TutorRegisterResponse>('/tutor/tutorRegister', tutorData);
      const tutorId = response.tutorId;
      localStorage.setItem('tutorId', tutorId);
      navigate(`/submit-tutor-proofs/${tutorId}`);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400 && error.response.data.message === 'Tutor with this email already exists') {
          toast.error('A tutor with this email already exists');
        } else {
          toast.error(error.response.data.message || 'Registration failed');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
      console.error('Registration failed:', error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800">
       <ToastContainer position="top-right" autoClose={5000} />
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8">
        <img src="/PinkHat.png" alt="Logo" className="w-100 h-64 mb-8 rounded-xl" />
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          Let's begin your career from here!
        </h1>
        <p className="text-xl text-white text-center">
          Join our community of tutors and start making a difference.
        </p>
      </div>

      {/* Right side with registration form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Tutor Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={tutorData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-20 border border-white rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={tutorData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-20 border border-white rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
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
                  required
                  value={tutorData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 bg-white bg-opacity-20 border border-white rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-white" />
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register as Tutor
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-white">
            Already have an account?{' '}
            <Link to="/tutorLogin" className="font-medium text-blue-300 hover:text-blue-200">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorRegister;