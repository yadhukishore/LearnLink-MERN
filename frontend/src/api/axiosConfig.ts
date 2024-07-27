// src/api/axiosConfig.ts

import axios from 'axios';
import store from '../components/store/store';
import { tokenExpired } from '../features/auth/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      store.dispatch(tokenExpired());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
