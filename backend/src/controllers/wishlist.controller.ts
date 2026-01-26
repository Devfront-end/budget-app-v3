import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class WishlistController {
  static async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const items = await prisma.wishlistItem.findMany({
        where: { userId },
        orderBy: { priority: 'desc' },
      });

      res.json({
        success: true,
        data: { items },
      });
    } catch (error: any) {
      logger.error('Get wishlist error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch wishlist items' },
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, targetAmount, category, priority, imageUrl, targetDate } = req.body;

      const item = await prisma.wishlistItem.create({
        data: {
          userId: userId!,
          name,
          targetAmount: parseFloat(targetAmount),
          category: category || 'General',
          priority: priority ? parseInt(priority, 10) : 0,
          imageUrl,
          targetDate: targetDate ? new Date(targetDate) : null,
        },
      });

      res.status(201).json({
        success: true,
        data: { item },
      });
    } catch (error: any) {
      logger.error('Create wishlist item error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to create wishlist item' },
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { name, targetAmount, currentSavings, isAchieved } = req.body;

      const item = await prisma.wishlistItem.updateMany({
        where: { id, userId },
        data: {
          ...(name && { name }),
          ...(targetAmount && { targetAmount: parseFloat(targetAmount) }),
          ...(currentSavings && { currentSavings: parseFloat(currentSavings) }),
          ...(isAchieved !== undefined && { isAchieved }),
        },
      });

      if (item.count === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Item not found' },
        });
      }

      res.json({
        success: true,
        message: 'Wishlist item updated successfully',
      });
    } catch (error: any) {
      logger.error('Update wishlist item error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to update wishlist item' },
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const deleted = await prisma.wishlistItem.deleteMany({
        where: { id, userId }
      });

      if (deleted.count === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Item not found' },
        });
      }

      res.json({
        success: true,
        message: 'Wishlist item deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete wishlist item error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to delete wishlist item' },
      });
    }
  }

  static async addSavings(req: Request, res: Response) {
    // Logic would involve creating a SavingsEntry and updating currentSavings
    // For MVP, simplistic update
    res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Add savings dedicated endpoint not implemented, use update' } });
  }

  static async getSavingsHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const history = await prisma.savingsEntry.findMany({
        where: { wishlistId: id },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ success: true, data: { history } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Failed to fetch history' } });
    }
  }
}
