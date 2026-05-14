import api from '../api/axios';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/v1/users/login', {
      email,
      password
    });
    return response.data;
  }
};
