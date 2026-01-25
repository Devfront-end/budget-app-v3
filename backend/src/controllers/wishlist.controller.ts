import { Request, Response } from 'express';

export class WishlistController {
  static async getAll(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Get wishlist items not implemented yet' },
    });
  }

  static async create(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Create wishlist item not implemented yet' },
    });
  }

  static async update(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Update wishlist item not implemented yet' },
    });
  }

  static async delete(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Delete wishlist item not implemented yet' },
    });
  }

  static async addSavings(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Add savings not implemented yet' },
    });
  }

  static async getSavingsHistory(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Get savings history not implemented yet' },
    });
  }
}
