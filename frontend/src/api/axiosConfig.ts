// axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log("TOKKEN: ",token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request headers:", config.headers); // Log the headers being sent
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
