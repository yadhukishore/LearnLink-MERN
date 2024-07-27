import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess, setError } from '../../../features/auth/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, name, password } = location.state as { email: string; name: string; password: string };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/auth/verify-otp', {
        email,
        otp,
        name,
        password,
      });

      if (response.status === 201) {
        dispatch(loginSuccess(response.data.user));
        navigate('/login', { state: { message: 'Registration successful. Please log in.' } });
      } else {
        dispatch(setError(response.data.message));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        dispatch(setError(error.response.data.message || 'An error occurred during OTP verification'));
        toast.error(error.response.data.message || 'An error occurred during OTP verification');
      } else {
        dispatch(setError('An error occurred during OTP verification'));
        toast.error('An error occurred during OTP verification');
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/resend-otp', { email });
      if (response.status === 200) {
        setTimer(600);
        setCanResend(false);
      }
    } catch (error) {
      dispatch(setError('Failed to resend OTP'));
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex flex-row justify-center items-center bg-gradient-to-br from-indigo-800 via-violet-700 to-fuchsia-900">
      <ToastContainer />
      <div className="absolute inset-0 backdrop-blur-sm z-0"></div>
      
      <div className="flex w-full max-w-7xl relative z-10">
        <div className="w-1/2 hidden md:flex items-center justify-center p-8">
          <img src="/PinkHat.png" alt="Logo" className="w-full h-auto rounded-lg shadow-2xl" />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Verify your email
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-white">
                    OTP
                  </label>
                  <div className="mt-1">
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      autoComplete="otp"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={otp.length !== 6}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      otp.length === 6
                        ? 'bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        : 'bg-indigo-400 cursor-not-allowed'
                    }`}
                  >
                    Verify OTP
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <p className="text-center text-sm text-white">
                  Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </p>
                {canResend && (
                  <button
                    onClick={handleResendOtp}
                    className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
