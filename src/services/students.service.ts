import api from '../api/axios';

export const studentsService = {
  getPaginated: async (page: number, limit: number) => {
    const response = await api.get('/api/v1/students/paginate', {
      params: { page, limit }
    });
    return response.data;
  }
};
