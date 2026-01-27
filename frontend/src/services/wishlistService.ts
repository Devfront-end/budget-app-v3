import { api } from './api';

export interface WishlistItem {
    id: string;
    name: string;
    targetAmount: number;
    currentSavings: number;
    category: string;
    priority: number;
    imageUrl?: string;
    targetDate?: string;
    isAchieved: boolean;
    achievedAt?: string;
}

export type CreateWishlistItemData = Omit<WishlistItem, 'id' | 'currentSavings' | 'isAchieved' | 'achievedAt'>;

export const wishlistService = {
    getAll: async () => {
        const response = await api.get<{ success: boolean; data: { items: WishlistItem[] } }>(
            '/wishlist'
        );
        return response.data;
    },

    create: async (data: any) => {
        const response = await api.post('/wishlist', data);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.put(`/wishlist/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/wishlist/${id}`);
        return response.data;
    },

    // Placeholder for future implementation if backend supports it
    getHistory: async (id: string) => {
        const response = await api.get(`/wishlist/${id}/savings-history`);
        return response.data;
    }
};
