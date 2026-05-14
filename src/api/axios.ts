import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // Use VITE_API_URL if defined, otherwise fallback to local backend port
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to inject the Authorization token
api.interceptors.request.use(
  (config) => {
    // Assuming the token is stored in localStorage with the key 'token'
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (optional) - useful for handling global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // You can implement your global logout logic here if the token expires
      // e.g., localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
