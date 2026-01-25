import api from './api';

export interface Budget {
  id: string;
  userId: string;
  month: string;
  totalIncome: number;
  totalExpense: number;
  categories: { [key: string]: number };
  createdAt: string;
  updatedAt: string;
}

export interface BudgetProgress {
  categoryId: string;
  budgeted: number;
  actual: number;
  remaining: number;
  percentage: number;
  status: 'good' | 'warning' | 'over';
}

export interface BudgetProgressResponse {
  budget: Budget;
  progress: BudgetProgress[];
  totalBudgeted: number;
  totalActual: number;
}

export interface CreateBudgetData {
  month: string;
  totalIncome: number;
  totalExpense: number;
  categories: { [key: string]: number };
}

export const budgetService = {
  async getBudgets() {
    const response = await api.get('/budgets');
    return response.data;
  },

  async getBudget(id: string) {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  async createBudget(data: CreateBudgetData) {
    const response = await api.post('/budgets', data);
    return response.data;
  },

  async updateBudget(id: string, data: Partial<CreateBudgetData>) {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  async deleteBudget(id: string) {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },

  async getBudgetProgress(month: string) {
    const response = await api.get(`/budgets/${month}/progress`);
    return response.data;
  },
};