import axios, { AxiosError } from 'axios';
import { emitToast } from './toastEvents';
import { config } from '../config';

const API_BASE_URL = config.apiBaseUrl;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('auth-storage');
    if (raw) {
      try {
        const authData = JSON.parse(raw) as { state?: { token?: string } };
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`;
        }
      } catch {
        // ignore malformed auth data
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      globalThis.location.href = '/login';
      return Promise.reject(error);
    }

    if (error.response?.status === 404) {
      return Promise.reject(error);
    }

    if (error.response?.status && error.response.status >= 500) {
      emitToast('Server error. Please try again later.', 'error');
    } else if (error.code === 'ECONNABORTED') {
      emitToast('Request timed out. Check your connection.', 'error');
    } else if (!error.response) {
      emitToast('Cannot connect to server. Is the backend running?', 'error');
    }

    return Promise.reject(error);
  }
);
