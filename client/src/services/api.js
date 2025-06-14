import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include token if available
api.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Modify response interceptor to prevent infinite 401 retries
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any cached auth state
      localStorage.removeItem('authState');
      // Don't redirect here - let the component handle it
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;