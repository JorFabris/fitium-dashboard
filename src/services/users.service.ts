import api from '../api/axios';

export const usersService = {
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/v1/users/update/${id}`, data);
    return response.data;
  },
  recoverPassword: async (email: string) => {
    const response = await api.post('/api/v1/users/recover-password', { email });
    return response.data;
  },
  verifyRecoveryCode: async (email: string, code: string) => {
    const response = await api.post('/api/v1/users/verify-recovery-code', { email, code });
    return response.data;
  },
  resetPassword: async (email: string, code: string, newPassword: string) => {
    const response = await api.post('/api/v1/users/reset-password', { email, code, newPassword });
    return response.data;
  }
};
