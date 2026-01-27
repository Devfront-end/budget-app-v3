import { api } from './api';

export interface Subscription {
    id: string;
    name: string;
    amount: number;
    frequency: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    category: string;
    nextRenewal: string;
    isActive: boolean;
    icon?: string;
    logo?: string;
}

export type CreateSubscriptionData = Omit<Subscription, 'id' | 'isActive'>;

export const subscriptionService = {
    getAll: async () => {
        const response = await api.get<{ success: boolean; data: { subscriptions: Subscription[] } }>(
            '/subscriptions'
        );
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/subscriptions', data);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.put(`/subscriptions/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/subscriptions/${id}`);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get<{ success: boolean; data: { totalMonthly: number; activeCount: number } }>(
            '/subscriptions/stats'
        );
        return response.data;
    },
};
