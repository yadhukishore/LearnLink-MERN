// axiosInstance.ts
import axios from 'axios';

const getToken = () => {
  const userType = localStorage.getItem('userType'); 
  switch (userType) {
    case 'user':
      return localStorage.getItem('userToken');
    case 'tutor':
      return localStorage.getItem('tutorToken');
    case 'admin':
      return localStorage.getItem('adminToken');
    default:
      return null;
  }
};

const axiosInstance = axios.create({
  baseURL: 'https://learnlink.themedihub.shop/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
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
