import { publicApi } from './http';

const unwrap = (response) => response.data.data;
export const authApi = {
  register: (credentials) => publicApi.post('/auth/register', credentials).then(unwrap),
  login: (credentials) => publicApi.post('/auth/login', credentials).then(unwrap),
  refresh: () => publicApi.post('/auth/refresh').then(unwrap),
  logout: () => publicApi.post('/auth/logout'),
};
