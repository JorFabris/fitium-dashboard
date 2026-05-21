import api from '../api/axios';

export const routinesService = {
  getPaginated: async (page: number, limit: number) => {
    const response = await api.get('/api/v1/routines/paginate', {
      params: { page, limit }
    });
    return response.data.data; // backend wraps it in { ok: true, data: { data, total, page, limit, totalPages } }
  },
  create: async (data: any) => {
    const response = await api.post('/api/v1/routines/create', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/v1/routines/update/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/v1/routines/delete/${id}`);
    return response.data;
  }
};
