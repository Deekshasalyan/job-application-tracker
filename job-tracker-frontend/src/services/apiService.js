import axios from 'axios';

// Get the backend API URL from the .env file
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. Create a custom Axios instance with the base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Set up a Request Interceptor to automatically attach the JWT token
// This runs for EVERY request made using the 'api' instance
api.interceptors.request.use((config) => {
  // Get token from local storage
  const token = localStorage.getItem('token'); 
  
  if (token) {
    // If a token exists, add it to the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Set up a Response Interceptor to handle automatic logout on 401 errors
api.interceptors.response.use(
  (response) => response, // Pass successful responses through
  (error) => {
    // If the error status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear token and reload/redirect to login
      localStorage.removeItem('token');
      // Note: We don't want to use window.location here, so we will handle
      // the redirect inside the AuthContext or the component.
    }
    return Promise.reject(error);
  }
);

export default api;
