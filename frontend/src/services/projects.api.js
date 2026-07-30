import { publicApi } from './http';

const unwrap = (response) => response.data.data;
const unwrapWithMeta = (response) => response.data; // Keep meta for pagination

export const projectsApi = {
  create: (data) => publicApi.post('/projects', data).then(unwrap),
  list: (params) => publicApi.get('/projects', { params }).then(unwrapWithMeta),
  get: (id) => publicApi.get(`/projects/${id}`).then(unwrap),
  update: ({ id, data }) => publicApi.put(`/projects/${id}`, data).then(unwrap),
  delete: (id) => publicApi.delete(`/projects/${id}`),
};
