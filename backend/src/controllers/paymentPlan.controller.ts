import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class PaymentPlanController {
  static async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const plans = await prisma.paymentPlan.findMany({
        where: { userId },
        include: { payments: true },
        orderBy: { purchaseDate: 'desc' },
      });

      res.json({
        success: true,
        data: { plans },
      });
    } catch (error: any) {
      logger.error('Get payment plans error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch payment plans' },
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { merchantName, totalAmount, numberOfPayments, purchaseDate, paymentMethod } = req.body;

      const plan = await prisma.paymentPlan.create({
        data: {
          userId: userId!,
          merchantName,
          totalAmount: parseFloat(totalAmount),
          numberOfPayments: parseInt(numberOfPayments, 10),
          purchaseDate: new Date(purchaseDate),
          paymentMethod: paymentMethod || 'Card',
          nextPaymentDate: new Date(purchaseDate), // Simplified
        },
      });

      res.status(201).json({
        success: true,
        data: { plan },
      });
    } catch (error: any) {
      logger.error('Create payment plan error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to create payment plan' },
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { merchantName, totalAmount } = req.body;

      const plan = await prisma.paymentPlan.updateMany({
        where: { id, userId },
        data: {
          ...(merchantName && { merchantName }),
          ...(totalAmount && { totalAmount: parseFloat(totalAmount) })
        }
      });

      if (plan.count === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Plan not found' },
        });
      }

      res.json({ success: true, message: 'Plan updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed update' } });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      await prisma.paymentPlan.deleteMany({ where: { id, userId } });
      res.json({ success: true, message: 'Plan deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed delete' } });
    }
  }

  static async recordPayment(req: Request, res: Response) {
    // Logic to record an installment payment
    res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Record payment endpoint pending' } });
  }
}
