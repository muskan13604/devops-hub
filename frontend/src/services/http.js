import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const publicApi = axios.create({ baseURL, withCredentials: true });
export const api = axios.create({ baseURL, withCredentials: true });

let getAccessToken = () => null;
let refreshAccessToken = async () => null;
let onSessionExpired = () => {};
let refreshPromise;

export function configureHttp({ getToken, refresh, onExpired }) {
  getAccessToken = getToken;
  refreshAccessToken = refresh;
  onSessionExpired = onExpired;
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (error.response?.status !== 401 || request?._retried) return Promise.reject(error);
    request._retried = true;
    try {
      refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = undefined; });
      const token = await refreshPromise;
      if (!token) throw error;
      request.headers.Authorization = `Bearer ${token}`;
      return api(request);
    } catch (refreshError) {
      onSessionExpired();
      return Promise.reject(refreshError);
    }
  },
);
