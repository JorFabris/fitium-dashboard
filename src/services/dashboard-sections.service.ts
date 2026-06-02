import api from '../api/axios';

export const dashboardSectionsService = {
  getPaginated: async (page: number, limit: number) => {
    const response = await api.get('/api/v1/dashboard-sections/paginate', {
      params: { page, limit }
    });
    return response.data.data;
  },
  getAll: async () => {
    const response = await api.get('/api/v1/dashboard-sections/all');
    return response.data.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/v1/dashboard-sections/create', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/v1/dashboard-sections/update/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/v1/dashboard-sections/delete/${id}`);
    return response.data;
  }
};
