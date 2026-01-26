import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class BankAccountController {
  static async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const accounts = await prisma.bankAccount.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      });

      res.json({
        success: true,
        data: { accounts },
      });
    } catch (error: any) {
      logger.error('Get bank accounts error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch bank accounts' },
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, type, bankName, accountNumber, balance, currency } = req.body;

      const account = await prisma.bankAccount.create({
        data: {
          userId: userId!,
          name,
          type,
          bankName,
          accountNumber: accountNumber || 'xxxx', // Should be encrypted
          balance: parseFloat(balance),
          currency: currency || 'EUR',
        },
      });

      res.status(201).json({
        success: true,
        data: { account },
      });
    } catch (error: any) {
      logger.error('Create bank account error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to create bank account' },
      });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const account = await prisma.bankAccount.findFirst({
        where: { id, userId },
      });

      if (!account) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Bank account not found' },
        });
      }

      res.json({
        success: true,
        data: { account },
      });
    } catch (error: any) {
      logger.error('Get bank account error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch bank account' },
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { name, type, bankName, balance } = req.body;

      const account = await prisma.bankAccount.updateMany({
        where: { id, userId },
        data: {
          ...(name && { name }),
          ...(type && { type }),
          ...(bankName && { bankName }),
          ...(balance && { balance: parseFloat(balance) }),
        },
      });

      if (account.count === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Bank account not found' },
        });
      }

      res.json({
        success: true,
        message: 'Bank account updated successfully',
      });
    } catch (error: any) {
      logger.error('Update bank account error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to update bank account' },
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const deleted = await prisma.bankAccount.deleteMany({
        where: { id, userId },
      });

      if (deleted.count === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Bank account not found' },
        });
      }

      res.json({
        success: true,
        message: 'Bank account deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete bank account error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to delete bank account' },
      });
    }
  }

  static async sync(req: Request, res: Response) {
    res.status(501).json({ // Keep fake sync as it requires external API
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Sync bank account not implemented yet (requires external API)' },
    });
  }
}
