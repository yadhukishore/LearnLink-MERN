import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const TutorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-teal-500 via-blue-600 to-indigo-800">
      {/* Left side with logo and welcome message */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-8">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/indian-cleaning-man-with-namaste-hand-gesture-illustration-download-in-svg-png-gif-file-formats--welcoming-pack-people-illustrations-2209997.png" alt="Logo" className="h-64 mb-8" />
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          Welcome back, Tutor!
        </h1>
        <p className="text-xl text-white text-center max-w-md">
          "The mediocre teacher tells. The good teacher explains. The superior teacher demonstrates. The great teacher inspires." - William Arthur Ward
        </p>
      </div>

      {/* Right side with login form */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Tutor Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-300 hover:text-blue-200">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-white">
            Not registered yet?{' '}
            <Link to="/tutorRegister" className="font-medium text-blue-300 hover:text-blue-200">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorLogin;