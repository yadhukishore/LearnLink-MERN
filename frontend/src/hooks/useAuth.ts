import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../features/auth/authSlice';
import { RootState } from '../components/store/store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return isAuthenticated;
};