import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AdminState {
  isAuthenticated: boolean;
  admin: { id: string; username: string } | null;
  error: string | null;
  token: string | null;
}

const initialState: AdminState = {
  isAuthenticated: false,
  admin: null,
  error: null,
  token: localStorage.getItem('adminToken'),
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminLoginSuccess(state, action: PayloadAction<{ token: string; admin: { id: string; username: string } }>) {
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('adminToken', action.payload.token);
      localStorage.setItem('adminUser', JSON.stringify(action.payload.admin));
    },
    adminLogout(state) {
      state.isAuthenticated = false;
      state.admin = null;
      state.error = null;
      state.token = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },
    setAdminError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    checkAdminAuthStatus(state) {
      const token = localStorage.getItem('adminToken');
      const admin = localStorage.getItem('adminUser');
      if (token && admin) {
        try {
          const decodedToken: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            state.isAuthenticated = true;
            state.token = token;
            state.admin = JSON.parse(admin);
          } else {

            console.log('Admin token expired, logging out');
            adminSlice.caseReducers.adminLogout(state);
          }
        } catch (error) {
          console.error('Error decoding admin token:', error);
          adminSlice.caseReducers.adminLogout(state);
        }
      }
    },
  },
});

export const { adminLoginSuccess, adminLogout, setAdminError, checkAdminAuthStatus } = adminSlice.actions;
export default adminSlice.reducer;