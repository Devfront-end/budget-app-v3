import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class DashboardController {
  static async getSummary(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { period = 'month', date = new Date().toISOString() } = req.query;

      // Define date range based on period
      const targetDate = new Date(date as string);
      let startDate, endDate;

      if (period === 'month') {
        startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
      } else {
        // Default to last 30 days if not month specific
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        endDate = new Date();
      }

      // Aggregate transactions
      const [income, expense, transactionCount] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            userId,
            type: 'INCOME',
            date: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            userId,
            type: 'EXPENSE',
            date: { gte: startDate, lte: endDate },
          },
          _sum: { amount: true },
        }),
        prisma.transaction.count({
          where: { userId, date: { gte: startDate, lte: endDate } },
        }),
      ]);

      const totalIncome = Number(income._sum.amount || 0);
      const totalExpense = Number(expense._sum.amount || 0);
      const balance = totalIncome - totalExpense;

      res.json({
        success: true,
        data: {
          period,
          startDate,
          endDate,
          summary: {
            totalIncome,
            totalExpense,
            balance,
            transactionCount,
          },
        },
      });
    } catch (error: any) {
      logger.error('Dashboard summary error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch dashboard summary' },
      });
    }
  }

  static async getRecentTransactions(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const limit = Number(req.query.limit) || 5;

      const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: limit,
        include: { category: true },
      });

      res.json({
        success: true,
        data: { transactions },
      });
    } catch (error: any) {
      logger.error('Dashboard recent transactions error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch recent transactions' },
      });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      // Group expenses by category
      const expensesByCategory = await prisma.transaction.groupBy({
        by: ['categoryId'],
        where: {
          userId,
          type: 'EXPENSE',
        },
        _sum: {
          amount: true,
        },
      });

      // Resolve category names
      const stats = await Promise.all(expensesByCategory.map(async (item) => {
        const category = item.categoryId
          ? await prisma.category.findUnique({ where: { id: item.categoryId } })
          : null;
        return {
          category: category ? category.name : 'Uncategorized',
          color: category ? category.color : '#cbd5e1',
          amount: Number(item._sum.amount || 0),
        };
      }));

      res.json({
        success: true,
        data: { stats },
      });

    } catch (error: any) {
      logger.error('Dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch dashboard stats' },
      });
    }
  }
}

export default DashboardController;
