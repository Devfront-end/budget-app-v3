import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class SubscriptionController {
  static async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const subscriptions = await prisma.subscription.findMany({
        where: { userId },
        orderBy: { nextRenewal: 'asc' },
      });

      res.json({
        success: true,
        data: { subscriptions },
      });
    } catch (error: any) {
      logger.error('Get subscriptions error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch subscriptions' },
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, amount, frequency, nextRenewal, category } = req.body;

      // Calculate next renewal date logic could be advanced (e.g. handle monthly rollover)
      // For MVP we trust the frontend or basic Date

      const subscription = await prisma.subscription.create({
        data: {
          userId: userId!,
          name,
          amount: parseFloat(amount),
          frequency,
          category: category || 'Default',
          nextRenewal: new Date(nextRenewal),
          isActive: true,
        },
      });

      res.status(201).json({
        success: true,
        data: { subscription },
      });
    } catch (error: any) {
      logger.error('Create subscription error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to create subscription' },
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { name, amount, frequency, nextRenewal, isActive } = req.body;

      const subscription = await prisma.subscription.updateMany({
        where: { id, userId },
        data: {
          ...(name && { name }),
          ...(amount && { amount: parseFloat(amount) }),
          ...(frequency && { frequency }),
          ...(nextRenewal && { nextRenewal: new Date(nextRenewal) }),
          ...(isActive !== undefined && { isActive }),
        },
      });

      if (subscription.count === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Subscription not found' },
        });
      }

      res.json({
        success: true,
        message: 'Subscription updated successfully',
      });
    } catch (error: any) {
      logger.error('Update subscription error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to update subscription' },
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const deleted = await prisma.subscription.deleteMany({
        where: { id, userId },
      });

      if (deleted.count === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Subscription not found' },
        });
      }

      res.json({
        success: true,
        message: 'Subscription deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete subscription error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to delete subscription' },
      });
    }
  }

  static async getUpcoming(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);

      const subscriptions = await prisma.subscription.findMany({
        where: {
          userId,
          isActive: true,
          nextRenewal: {
            gte: today,
            lte: nextMonth,
          },
        },
        orderBy: { nextRenewal: 'asc' },
      });

      res.json({
        success: true,
        data: { subscriptions },
      });
    } catch (error: any) {
      logger.error('Get upcoming subscriptions error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch upcoming subscriptions' },
      });
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const result = await prisma.subscription.aggregate({
        where: { userId, isActive: true },
        _sum: { amount: true },
        _count: { id: true }
      });

      res.json({
        success: true,
        data: {
          totalMonthly: Number(result._sum.amount || 0), // Assuming all are normalised to monthly for MVP simplicity or just raw sum
          activeCount: result._count.id
        }
      });
    } catch (error: any) {
      logger.error('Get subscription stats error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch subscription stats' },
      });
    }
  }
}
