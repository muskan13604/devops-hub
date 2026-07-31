import api from './api';

export const monitoringApi = {
  getMetrics: async () => {
    const response = await api.get('/monitoring/metrics');
    return response.data;
  }
};
