import api from './api';

export const categoryService = {
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  async getCategoryById(id: string) {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  async createCategory(data: any) {
    const response = await api.post('/categories', data);
    return response.data;
  },

  async updateCategory(id: string, data: any) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: string) {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  async initDefaults() {
    const response = await api.post('/categories/init-defaults', {});
    return response.data;
  },
};