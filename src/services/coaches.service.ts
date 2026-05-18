import api from '../api/axios';

export const coachesService = {
  getPaginated: async (page: number, limit: number) => {
    // The endpoint is /users/paginate but we might want to filter by role=coach if supported.
    // For now we just hit the requested endpoint
    const response = await api.get('/api/v1/users/coaches/paginate', {
      params: { page, limit }
    });
    return response.data;
  },
  create: async (data: any) => {
    // If password is not provided, generate a random one to satisfy the backend requirement
    const payload = { 
      ...data, 
      role: 'coach',
      password: data.password || Math.random().toString(36).slice(-8) + 'A1!'
    };
    const response = await api.post('/api/v1/users/create', payload);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/v1/users/update/${id}`, data);
    return response.data;
  }
};
