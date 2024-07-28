import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from '../../../app/firebase';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../../features/auth/authSlice';
import { toast } from 'react-toastify';

interface GoogleAuthBtnProps {
    isLoginPage: boolean;
}

const GoogleAuthBtn: React.FC<GoogleAuthBtnProps> = ({ isLoginPage }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
            console.log('Google sign-in result:', result);

            const res = await fetch('http://localhost:8000/api/auth/googleAuth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    googleId: result.user.uid,
                    loginPage:isLoginPage
                }),
            });
            console.log('Response from backend:', res);

            const data = await res.json();
            console.log('Response JSON data:', data);

            if (res.ok || (res.status === 409 && isLoginPage)) {
                dispatch(loginSuccess({
                    token: data.token,
                    user: {
                        id: data.user._id,
                        name: data.user.name,
                        email: data.user.email,
                    },
                }));
                navigate('/feeds');
            } else if (res.status === 409 && !isLoginPage) {
                toast.error('User already exists');
            } else {
                throw new Error(data.message || 'Google authentication failed');
            }
        } catch (error) {
            console.error('Google authentication error:', error);
        }
    };

    return (
        <button
            type='button'
            onClick={handleGoogleClick}
            className="bg-gray-700 mt-2 p-2 rounded-md text-center text-white flex items-center justify-center space-x-2 hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
            <FcGoogle className="text-xl hover:scale-x-50" />
            <span>Continue with Google</span>
        </button>
    );
};

export default GoogleAuthBtn;
