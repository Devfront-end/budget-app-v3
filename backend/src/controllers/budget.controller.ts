import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class BudgetController {
  static async getBudgets(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { month } = req.query;

      const where: any = { userId };
      if (month) {
        where.month = month;
      }

      const budgets = await prisma.budget.findMany({
        where,
        orderBy: { month: 'desc' },
      });

      res.json({
        success: true,
        data: { budgets },
      });
    } catch (error: any) {
      logger.error('Get budgets error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_BUDGETS_ERROR',
          message: 'Failed to get budgets',
        },
      });
    }
  }

  static async getBudget(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const budget = await prisma.budget.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!budget) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BUDGET_NOT_FOUND',
            message: 'Budget not found',
          },
        });
      }

      res.json({
        success: true,
        data: { budget },
      });
    } catch (error: any) {
      logger.error('Get budget error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_BUDGET_ERROR',
          message: 'Failed to get budget',
        },
      });
    }
  }

  static async createBudget(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { month, totalIncome, totalExpense, categories } = req.body;

      // Validate required fields
      if (!month || !totalIncome || !totalExpense) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Month, totalIncome, and totalExpense are required',
          },
        });
      }

      // Check if budget already exists for this month
      const existingBudget = await prisma.budget.findUnique({
        where: {
          userId_month: {
            userId,
            month,
          },
        },
      });

      if (existingBudget) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'BUDGET_EXISTS',
            message: 'Budget already exists for this month',
          },
        });
      }

      const budget = await prisma.budget.create({
        data: {
          userId,
          month,
          totalIncome: parseFloat(totalIncome),
          totalExpense: parseFloat(totalExpense),
          categories: categories || {},
        },
      });

      logger.info(`Budget created for user ${userId}, month ${month}`);

      res.status(201).json({
        success: true,
        data: { budget },
        message: 'Budget created successfully',
      });
    } catch (error: any) {
      logger.error('Create budget error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_BUDGET_ERROR',
          message: 'Failed to create budget',
        },
      });
    }
  }

  static async updateBudget(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { totalIncome, totalExpense, categories } = req.body;

      const budget = await prisma.budget.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!budget) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BUDGET_NOT_FOUND',
            message: 'Budget not found',
          },
        });
      }

      const updatedBudget = await prisma.budget.update({
        where: { id },
        data: {
          ...(totalIncome && { totalIncome: parseFloat(totalIncome) }),
          ...(totalExpense && { totalExpense: parseFloat(totalExpense) }),
          ...(categories && { categories }),
        },
      });

      logger.info(`Budget updated for user ${userId}, id ${id}`);

      res.json({
        success: true,
        data: { budget: updatedBudget },
        message: 'Budget updated successfully',
      });
    } catch (error: any) {
      logger.error('Update budget error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_BUDGET_ERROR',
          message: 'Failed to update budget',
        },
      });
    }
  }

  static async deleteBudget(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const budget = await prisma.budget.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!budget) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BUDGET_NOT_FOUND',
            message: 'Budget not found',
          },
        });
      }

      await prisma.budget.delete({
        where: { id },
      });

      logger.info(`Budget deleted for user ${userId}, id ${id}`);

      res.json({
        success: true,
        message: 'Budget deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete budget error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_BUDGET_ERROR',
          message: 'Failed to delete budget',
        },
      });
    }
  }

  static async getBudgetProgress(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { month } = req.params;

      // Get budget for the month
      const budget = await prisma.budget.findFirst({
        where: {
          userId,
          month,
        },
      });

      if (!budget) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'BUDGET_NOT_FOUND',
            message: 'No budget found for this month',
          },
        });
      }

      // Get actual expenses by category for the month
      const startOfMonth = new Date(`${month}-01`);
      const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);

      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          type: 'EXPENSE',
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        include: {
          category: true,
        },
      });

      // Calculate actual spending by category
      const actualSpending: { [key: string]: number } = {};
      transactions.forEach(transaction => {
        const categoryId = transaction.categoryId || 'uncategorized';
        actualSpending[categoryId] = (actualSpending[categoryId] || 0) + Number(transaction.amount);
      });

      // Calculate progress for each category
      const progress = Object.entries(budget.categories as any).map(([categoryId, budgetedAmount]) => {
        const actual = actualSpending[categoryId] || 0;
        const budgeted = Number(budgetedAmount);
        const percentage = budgeted > 0 ? (actual / budgeted) * 100 : 0;

        return {
          categoryId,
          budgeted,
          actual,
          remaining: budgeted - actual,
          percentage: Math.round(percentage * 100) / 100,
          status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good',
        };
      });

      res.json({
        success: true,
        data: {
          budget,
          progress,
          totalBudgeted: Number(budget.totalExpense),
          totalActual: Object.values(actualSpending).reduce((sum, amount) => sum + amount, 0),
        },
      });
    } catch (error: any) {
      logger.error('Get budget progress error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GET_BUDGET_PROGRESS_ERROR',
          message: 'Failed to get budget progress',
        },
      });
    }
  }
}