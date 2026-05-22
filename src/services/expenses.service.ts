import api from '../api/axios';

export const expensesService = {
  getPaginated: async (page: number, limit: number) => {
    const response = await api.get('/api/v1/expenses/paginate', {
      params: { page, limit }
    });
    return response.data.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/v1/expenses/create', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/v1/expenses/update/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/v1/expenses/delete/${id}`);
    return response.data;
  }
};
