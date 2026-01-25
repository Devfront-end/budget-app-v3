import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class TransactionController {
  static async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { type, categoryId, bankAccountId, startDate, endDate, page = 1, limit = 50 } = req.query;

      const where: any = { userId };
      if (type) where.type = type;
      if (categoryId) where.categoryId = categoryId;
      if (bankAccountId) where.bankAccountId = bankAccountId;
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate as string);
        if (endDate) where.date.lte = new Date(endDate as string);
      }

      const skip = (Number(page) - 1) * Number(limit);
      const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { date: 'desc' },
          include: { category: true, bankAccount: true },
        }),
        prisma.transaction.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error: any) {
      logger.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch transactions' },
      });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const transaction = await prisma.transaction.findFirst({
        where: { id, userId },
        include: { category: true, bankAccount: true },
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Transaction not found' },
        });
      }

      res.json({
        success: true,
        data: { transaction },
      });
    } catch (error: any) {
      logger.error('Get transaction error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch transaction' },
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { amount, type, categoryId, bankAccountId, description, date } = req.body;

      const transaction = await prisma.transaction.create({
        data: {
          userId: userId!,
          amount: parseFloat(amount),
          type,
          categoryId,
          bankAccountId,
          description,
          date: date ? new Date(date) : new Date(),
        },
        include: { category: true, bankAccount: true },
      });

      logger.info(`Transaction created: ${transaction.id} by user ${userId}`);

      res.status(201).json({
        success: true,
        data: { transaction },
        message: 'Transaction created successfully',
      });
    } catch (error: any) {
      logger.error('Create transaction error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to create transaction' },
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { amount, type, categoryId, bankAccountId, description, date } = req.body;

      const existing = await prisma.transaction.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Transaction not found' },
        });
      }

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          ...(amount && { amount: parseFloat(amount) }),
          ...(type && { type }),
          ...(categoryId && { categoryId }),
          ...(bankAccountId && { bankAccountId }),
          ...(description !== undefined && { description }),
          ...(date && { date: new Date(date) }),
        },
        include: { category: true, bankAccount: true },
      });

      logger.info(`Transaction updated: ${id} by user ${userId}`);

      res.json({
        success: true,
        data: { transaction },
        message: 'Transaction updated successfully',
      });
    } catch (error: any) {
      logger.error('Update transaction error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to update transaction' },
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const existing = await prisma.transaction.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Transaction not found' },
        });
      }

      await prisma.transaction.delete({ where: { id } });

      logger.info(`Transaction deleted: ${id} by user ${userId}`);

      res.json({
        success: true,
        message: 'Transaction deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete transaction error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to delete transaction' },
      });
    }
  }
}

export default TransactionController;
