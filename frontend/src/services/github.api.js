import { api } from './http';

const unwrap = (response) => response.data.data;

export const githubApi = {
  saveToken: (token) => api.post('/github/token', { token }).then(unwrap),
  getRepositories: () => api.get('/github/repositories').then(unwrap),
  getBranches: (repo) => api.get('/github/branches', { params: { repo } }).then(unwrap),
  getCommits: (repo, branch) => api.get('/github/commits', { params: { repo, branch } }).then(unwrap),
};
