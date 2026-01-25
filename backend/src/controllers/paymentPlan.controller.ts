import { Request, Response } from 'express';

export class PaymentPlanController {
  static async getAll(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Get payment plans not implemented yet' },
    });
  }

  static async create(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Create payment plan not implemented yet' },
    });
  }

  static async update(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Update payment plan not implemented yet' },
    });
  }

  static async delete(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Delete payment plan not implemented yet' },
    });
  }

  static async recordPayment(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Record payment not implemented yet' },
    });
  }
}
