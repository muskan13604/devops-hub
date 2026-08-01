import { api } from './http';

export const monitoringApi = {
  getMetrics: async () => {
    const response = await api.get('/monitoring/metrics');
    return response.data;
  }
};
