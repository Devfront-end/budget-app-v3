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
      let startDate;
      let endDate;

      // Previous period date range
      let prevStartDate;
      let prevEndDate;

      if (period === 'month') {
        startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        // End of current month
        endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
        endDate.setHours(23, 59, 59, 999);

        // Previous month
        prevStartDate = new Date(targetDate.getFullYear(), targetDate.getMonth() - 1, 1);
        prevEndDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
        prevEndDate.setHours(23, 59, 59, 999);
      } else {
        // Default to last 30 days
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date();

        prevEndDate = new Date(startDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        prevEndDate.setHours(23, 59, 59, 999);

        prevStartDate = new Date(prevEndDate);
        prevStartDate.setDate(prevStartDate.getDate() - 30);
        prevStartDate.setHours(0, 0, 0, 0);
      }

      // Aggregate transactions for current and previous period
      const [currentIncome, currentExpense, currentCount, prevIncome, prevExpense, prevCount] = await Promise.all([
        // Current Period
        prisma.transaction.aggregate({
          where: { userId, type: 'INCOME', date: { gte: startDate, lte: endDate } },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: { userId, type: 'EXPENSE', date: { gte: startDate, lte: endDate } },
          _sum: { amount: true },
        }),
        prisma.transaction.count({
          where: { userId, date: { gte: startDate, lte: endDate } },
        }),
        // Previous Period
        prisma.transaction.aggregate({
          where: { userId, type: 'INCOME', date: { gte: prevStartDate, lte: prevEndDate } },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: { userId, type: 'EXPENSE', date: { gte: prevStartDate, lte: prevEndDate } },
          _sum: { amount: true },
        }),
        prisma.transaction.count({
          where: { userId, date: { gte: prevStartDate, lte: prevEndDate } },
        }),
      ]);

      const totalIncome = Number(currentIncome._sum.amount || 0);
      const totalExpense = Number(currentExpense._sum.amount || 0);
      const balance = totalIncome - totalExpense;

      const prevTotalIncome = Number(prevIncome._sum.amount || 0);
      const prevTotalExpense = Number(prevExpense._sum.amount || 0);
      const prevBalance = prevTotalIncome - prevTotalExpense;

      const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current === 0 ? 0 : 100; // If prev was 0 and now we have something, it's 100% increase (or technically infinite, but 100 shows growth)
        return ((current - previous) / Math.abs(previous)) * 100;
      };

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
            transactionCount: currentCount,
            changes: {
              income: calculateChange(totalIncome, prevTotalIncome),
              expense: calculateChange(totalExpense, prevTotalExpense),
              balance: calculateChange(balance, prevBalance),
            },
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
