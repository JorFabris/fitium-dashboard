import api from '../api/axios';

export const studentsService = {
  getPaginated: async (page: number, limit: number) => {
    const response = await api.get('/api/v1/students/paginate', {
      params: { page, limit }
    });
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/v1/students/create', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/v1/students/update/${id}`, data);
    return response.data;
  }
};
