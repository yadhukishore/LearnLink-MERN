// tutorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface TutorState {
  isAuthenticated: boolean;
  isRegistered: boolean;
  tutor: { id: string; name: string; email: string } | null;
  error: string | null;
  token: string | null;
}

const initialState: TutorState = {
  isAuthenticated: false,
  isRegistered: false,
  tutor: null,
  error: null,
  token: localStorage.getItem('tutorToken'),
};

const tutorSlice = createSlice({
  name: 'tutor',
  initialState,
  reducers: {
    tutorLoginSuccess(state, action: PayloadAction<{ token: string; tutor: { id: string; name: string; email: string } }>) {
      state.isAuthenticated = true;
      state.tutor = action.payload.tutor;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('tutorToken', action.payload.token);
      localStorage.setItem('tutor', JSON.stringify(action.payload.tutor));
    },
    tutorLogout(state) {
      state.isAuthenticated = false;
      state.tutor = null;
      state.error = null;
      state.token = null;
      localStorage.removeItem('tutorToken');
      localStorage.removeItem('tutor');
    },
    setTutorError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    tutorRegisterSuccess(state) {
      state.isRegistered = true;
    },
       checkTutorAuthStatus(state) {
      const token = localStorage.getItem('tutorToken');
      const tutor = localStorage.getItem('tutor');
      if (token && tutor) {
        try {
          const decodedToken: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            state.isAuthenticated = true;
            state.token = token;
            state.tutor = JSON.parse(tutor);
          } else {
            console.log('Token expired, logging out');
            tutorSlice.caseReducers.tutorLogout(state);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          tutorSlice.caseReducers.tutorLogout(state);
        }
      } else {
        console.log('No token found, logging out');
        tutorSlice.caseReducers.tutorLogout(state);
      }
    },
  },
});

export const { tutorLoginSuccess, tutorLogout, setTutorError, tutorRegisterSuccess, checkTutorAuthStatus } = tutorSlice.actions;
export default tutorSlice.reducer;