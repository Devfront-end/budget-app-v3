import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class AnalyticsController {
  static async getOverview(req: Request, res: Response) {
    try {
      // Simple Overview: Income vs Expense Trend
      const userId = req.user?.id;

      // Mocking sophisticated analytics for MVP with simple aggregation
      const income = await prisma.transaction.aggregate({
        where: { userId, type: 'INCOME' },
        _sum: { amount: true }
      });

      const expense = await prisma.transaction.aggregate({
        where: { userId, type: 'EXPENSE' },
        _sum: { amount: true }
      });

      res.json({
        success: true,
        data: {
          totalIncome: income._sum.amount || 0,
          totalExpense: expense._sum.amount || 0,
          savingsRate: 0 // advanced calculation needed
        },
      });
    } catch (error: any) {
      logger.error('Analytics overview error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch analytics' },
      });
    }
  }

  static async getTrends(req: Request, res: Response) {
    // Return empty for now as it usually requires complex time-series queries
    res.json({ success: true, data: { daily: [], monthly: [] } });
  }

  static async getCategoryBreakdown(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const breakdown = await prisma.transaction.groupBy({
        by: ['categoryId'],
        where: { userId, type: 'EXPENSE' },
        _sum: { amount: true }
      });
      res.json({ success: true, data: { breakdown } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'SERVER_ERROR' } });
    }
  }

  static async getPredictions(req: Request, res: Response) {
    res.status(200).json({
      success: true,
      data: { message: "AI Predictions coming soon" }
    });
  }
}
