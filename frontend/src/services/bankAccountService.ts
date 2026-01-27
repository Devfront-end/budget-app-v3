import api from './api';

export const bankAccountService = {
    async getAccounts() {
        const response = await api.get('/bank-accounts');
        return response.data;
    },

    async getAccountById(id: string) {
        const response = await api.get(`/bank-accounts/${id}`);
        return response.data;
    },

    async create(data: any) {
        const response = await api.post('/bank-accounts', data);
        return response.data;
    },

    async update(id: string, data: any) {
        const response = await api.put(`/bank-accounts/${id}`, data);
        return response.data;
    },

    async delete(id: string) {
        const response = await api.delete(`/bank-accounts/${id}`);
        return response.data;
    },

    // Alias for backward compatibility if needed
    async getAll() {
        return this.getAccounts();
    }
};
