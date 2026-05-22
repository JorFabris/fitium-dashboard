import api from '../api/axios';

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/api/v1/dashboard/summary');
    return response.data.data;
  }
};
