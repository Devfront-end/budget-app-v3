import { Request, Response } from 'express';

export class DashboardController {
  static async getSummary(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Dashboard summary not implemented yet' },
    });
  }

  static async getStats(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Dashboard stats not implemented yet' },
    });
  }

  static async getRecentTransactions(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Recent transactions not implemented yet' },
    });
  }
}
