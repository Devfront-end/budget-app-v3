import { Request, Response } from 'express';

export class BankAccountController {
  static async getAll(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Get bank accounts not implemented yet' },
    });
  }

  static async create(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Create bank account not implemented yet' },
    });
  }

  static async getById(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Get bank account not implemented yet' },
    });
  }

  static async update(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Update bank account not implemented yet' },
    });
  }

  static async delete(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Delete bank account not implemented yet' },
    });
  }

  static async sync(req: Request, res: Response) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Sync bank account not implemented yet' },
    });
  }
}
