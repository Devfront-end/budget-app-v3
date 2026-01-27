import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class CategoryController {
  static async getAll(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const categories = await prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      });

      res.json({
        success: true,
        data: { categories },
      });
    } catch (error: any) {
      logger.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to fetch categories' },
      });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { name, icon, color, type } = req.body;

      const category = await prisma.category.create({
        data: {
          userId: userId!,
          name,
          icon: icon || '📁',
          color: color || '#6B7280',
          type: type || 'EXPENSE',
        },
      });

      logger.info(`Category created: ${category.id} by user ${userId}`);

      res.status(201).json({
        success: true,
        data: { category },
        message: 'Category created successfully',
      });
    } catch (error: any) {
      logger.error('Create category error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to create category' },
      });
    }
  }

  static async createDefaultCategories(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      const defaultCategories = [
        { name: 'Alimentation', icon: '🛒', color: '#10B981', type: 'EXPENSE' },
        { name: 'Transport', icon: '🚗', color: '#3B82F6', type: 'EXPENSE' },
        { name: 'Loisirs', icon: '🎬', color: '#8B5CF6', type: 'EXPENSE' },
        { name: 'Restaurant', icon: '🍽️', color: '#F59E0B', type: 'EXPENSE' },
        { name: 'Shopping', icon: '🛍️', color: '#EC4899', type: 'EXPENSE' },
        { name: 'Santé', icon: '🏥', color: '#EF4444', type: 'EXPENSE' },
        { name: 'Salaire', icon: '💰', color: '#10B981', type: 'INCOME' },
        { name: 'Freelance', icon: '💼', color: '#3B82F6', type: 'INCOME' },
      ];

      // Use createMany with skipDuplicates to ignore existing categories
      await prisma.category.createMany({
        data: defaultCategories.map((cat) => ({
          userId: userId!,
          ...cat,
          type: cat.type as any, // Ensure type casts correctly if needed
        })),
        skipDuplicates: true,
      });

      // Fetch the final list of categories to return to the frontend
      const categories = await prisma.category.findMany({
        where: { userId },
        orderBy: { name: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: { categories },
        message: 'Default categories restored successfully',
      });
    } catch (error: any) {
      logger.error('Create default categories error:', error);
      res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Failed to create default categories' },
      });
    }
  }
}

export default CategoryController;
