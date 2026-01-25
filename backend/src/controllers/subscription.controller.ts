import { Request, Response } from 'express';

export class SubscriptionController {
  static async getAll(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Get subscriptions not implemented yet' },
    });
  }

  static async create(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Create subscription not implemented yet' },
    });
  }

  static async getUpcoming(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Get upcoming subscriptions not implemented yet' },
    });
  }

  static async getStats(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Get subscription stats not implemented yet' },
    });
  }

  static async update(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Update subscription not implemented yet' },
    });
  }

  static async delete(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Delete subscription not implemented yet' },
    });
  }
}
