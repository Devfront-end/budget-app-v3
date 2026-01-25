import api from './api';

export const transactionService = {
  async getAll(params?: any) {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  async create(data: any) {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  async update(id: string, data: any) {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  async importCSV(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/transactions/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async exportData(format: 'csv' | 'pdf') {
    const response = await api.get(`/transactions/export?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
