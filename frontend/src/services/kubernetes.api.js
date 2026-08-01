import { api } from './http';

export const kubernetesApi = {
  getPods: async (namespace = 'default') => {
    const response = await api.get(`/kubernetes/pods?namespace=${namespace}`);
    return response.data;
  },
  
  getDeployments: async (namespace = 'default') => {
    const response = await api.get(`/kubernetes/deployments?namespace=${namespace}`);
    return response.data;
  },
  
  getServices: async (namespace = 'default') => {
    const response = await api.get(`/kubernetes/services?namespace=${namespace}`);
    return response.data;
  },
  
  getNamespaces: async () => {
    const response = await api.get('/kubernetes/namespaces');
    return response.data;
  },
  
  deployApp: async (data) => {
    const response = await api.post('/kubernetes/deployments/deploy', data);
    return response.data;
  },
  
  scaleDeployment: async (namespace, name, replicas) => {
    const response = await api.post('/kubernetes/deployments/scale', { namespace, name, replicas });
    return response.data;
  },
  
  restartDeployment: async (namespace, name) => {
    const response = await api.post('/kubernetes/deployments/restart', { namespace, name });
    return response.data;
  },
  
  deleteDeployment: async (namespace, name) => {
    const response = await api.delete('/kubernetes/deployments/delete', { data: { namespace, name } });
    return response.data;
  }
};
