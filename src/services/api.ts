import axios from 'axios';

// API Configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
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

// Auth Services
export const login = (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const register = (email: string, password: string, name: string) => {
  return api.post('/auth/register', { email, password, name });
};

// User Services
export const fetchUserProfile = () => {
  return api.get('/users/profile');
};

export default api;
