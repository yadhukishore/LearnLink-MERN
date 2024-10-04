import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  isAuthenticated: boolean;
  isRegistered: boolean;
  user: { id: string; name: string; email: string; profilePicture?: string } | null;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isRegistered: false,
  user: null,
  error: null,
  token: localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: { id: string; name: string; email: string; profilePicture?: string } }>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    registerSuccess(state) {
      state.isRegistered = true;
    },
    checkAuthStatus(state) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        try {
          const decodedToken: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            state.isAuthenticated = true;
            state.token = token;
            state.user = JSON.parse(user);
          } else {
            // Token has expired
            console.log('Token expired, logging out');
            authSlice.caseReducers.logout(state);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          authSlice.caseReducers.logout(state);
        }
      }
    },
  },
});

export const { loginSuccess, logout, setError, registerSuccess, checkAuthStatus } = authSlice.actions;
export default authSlice.reducer;