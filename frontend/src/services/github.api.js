import { publicApi } from './http';

const unwrap = (response) => response.data.data;

export const githubApi = {
  saveToken: (token) => publicApi.post('/github/token', { token }).then(unwrap),
  getRepositories: () => publicApi.get('/github/repositories').then(unwrap),
  getBranches: (repo) => publicApi.get('/github/branches', { params: { repo } }).then(unwrap),
  getCommits: (repo, branch) => publicApi.get('/github/commits', { params: { repo, branch } }).then(unwrap),
};
