// src/hooks/useTokenExpiration.ts
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { logout } from '../features/auth/authSlice';
import { RootState } from '../components/store/store';

export const useTokenExpiration = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const expirationTime = decodedToken.exp * 1000; 

        const checkExpiration = setInterval(() => {
          if (Date.now() >= expirationTime) {
            console.log('Token expired, logging out');
            dispatch(logout());
            clearInterval(checkExpiration);
          }
        }, 60000); 

        return () => clearInterval(checkExpiration);
      } catch (error) {
        console.error('Error decoding token:', error);
        dispatch(logout());
      }
    }
  }, [token, dispatch]);
};