import { api } from './http';

const unwrap = (response) => response.data.data;
const unwrapWithMeta = (response) => response.data; // Keep meta for pagination

export const projectsApi = {
  create: (data) => api.post('/projects', data).then(unwrap),
  list: (params) => api.get('/projects', { params }).then(unwrapWithMeta),
  get: (id) => api.get(`/projects/${id}`).then(unwrap),
  update: ({ id, data }) => api.put(`/projects/${id}`, data).then(unwrap),
  delete: (id) => api.delete(`/projects/${id}`),
};
