import api from '../api/axios';

export const usersService = {
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/v1/users/update/${id}`, data);
    return response.data;
  }
};
