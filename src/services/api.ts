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

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 403 || error.response.status === 401)) {
      localStorage.removeItem('token');
      // Show notification instead of redirecting
      const notificationEvent = new CustomEvent('showNotification', {
        detail: {
          message: 'You do not have permission to access this resource.',
          type: 'error',
        },
      });
      window.dispatchEvent(notificationEvent);
    }
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
  return api.get('/users/me');
};

export const fetchUsers = () => {
  return api.get('/protected/users');
};

// Location Services
export const fetchProvinces = () => {
  return axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
};

export const fetchCities = (provinceId: string) => {
  return axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
};

// Schedule Services
export const createSchedule = (scheduleData: any) => {
  return api.post('/schedule', scheduleData);
};

export const fetchSchedules = () => {
  return api.get('/schedule');
};

export const updateScheduleStatus = (id: string, status: string) => {
  return api.patch(`/schedule/${id}/status`, { status });
};

export const cancelSchedule = (id: string) => {
  return api.patch(`/schedule/${id}/status`, { status: 'CANCELED' });
};

export default api;
