import { api } from './http';

export const dockerApi = {
  listImages: async () => {
    const response = await api.get('/docker/images');
    return response.data;
  },
  
  pullImage: async (imageName) => {
    const response = await api.post('/docker/images/pull', { imageName });
    return response.data;
  },
  
  buildImage: async (tag, path) => {
    const response = await api.post('/docker/images/build', { tag, path });
    return response.data;
  },
  
  pushImage: async (imageName) => {
    const response = await api.post('/docker/images/push', { imageName });
    return response.data;
  },
  
  deleteImage: async (imageId) => {
    const response = await api.delete(`/docker/images/${imageId}`);
    return response.data;
  }
};
