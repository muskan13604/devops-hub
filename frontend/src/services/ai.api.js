import { api } from './http';

export const aiApi = {
  chat: async (message) => {
    const response = await api.post('/ai/chat', { message });
    return response.data;
  },
  
  analyzeLogs: async (logs) => {
    const response = await api.post('/ai/analyze-logs', { logs });
    return response.data;
  },
  
  generateDockerfile: async (projectType) => {
    const response = await api.post('/ai/generate-dockerfile', { projectType });
    return response.data;
  }
};
