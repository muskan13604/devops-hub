import { api } from './http';

export const jenkinsApi = {
  saveConfig: async (data) => {
    const response = await api.post('/jenkins/config', data);
    return response.data;
  },
  
  triggerBuild: async (jobName, parameters = {}) => {
    const response = await api.post('/jenkins/trigger', { jobName, parameters });
    return response.data;
  },
  
  getHistory: async () => {
    const response = await api.get('/jenkins/history');
    return response.data;
  },
  
  getBuildStatus: async (jobName, buildId) => {
    const response = await api.get(`/jenkins/${jobName}/${buildId}/status`);
    return response.data;
  },
  
  getBuildLogs: async (jobName, buildId) => {
    const response = await api.get(`/jenkins/${jobName}/${buildId}/logs`);
    return response.data;
  },
  
  getPipelineStages: async (jobName, buildId) => {
    const response = await api.get(`/jenkins/${jobName}/${buildId}/stages`);
    return response.data;
  }
};
