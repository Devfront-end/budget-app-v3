import { api } from './api';

export interface DashboardSummary {
    period: string;
    startDate: string;
    endDate: string;
    summary: {
        totalIncome: number;
        totalExpense: number;
        balance: number;
        transactionCount: number;
    };
}

export interface DashboardStats {
    stats: {
        category: string;
        color: string;
        amount: number;
    }[];
}

export const dashboardService = {
    getSummary: async (period: 'month' | 'year' = 'month') => {
        const response = await api.get<{ success: boolean; data: DashboardSummary }>(
            `/dashboard/summary?period=${period}`
        );
        return response.data;
    },

    getStats: async () => {
        const response = await api.get<{ success: boolean; data: DashboardStats }>(
            '/dashboard/stats'
        );
        return response.data;
    },

    getRecentTransactions: async (limit: number = 5) => {
        const response = await api.get<{ success: boolean; data: { transactions: any[] } }>(
            `/dashboard/recent-transactions?limit=${limit}`
        );
        return response.data;
    },
};
