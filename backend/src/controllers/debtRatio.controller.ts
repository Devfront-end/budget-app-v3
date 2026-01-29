import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';

export class DebtRatioController {
    // Get latest calc
    static async getLatest(req: Request, res: Response) {
        try {
            const { user } = req as any;
            const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

            const debtRatio = await prisma.debtRatio.findUnique({
                where: {
                    userId_month: {
                        userId: user.id,
                        month: currentMonth
                    }
                }
            });

            res.json({ success: true, data: debtRatio });
        } catch (error) {
            logger.error('Error fetching latest debt ratio:', error);
            res.status(500).json({ success: false, error: { message: 'Failed to fetch data' } });
        }
    }

    // Get history
    static async getHistory(req: Request, res: Response) {
        try {
            const { user } = req as any;

            const history = await prisma.debtRatio.findMany({
                where: { userId: user.id },
                orderBy: { month: 'desc' },
                take: 6
            });

            res.json({ success: true, data: history });
        } catch (error) {
            logger.error('Error fetching debt ratio history:', error);
            res.status(500).json({ success: false, error: { message: 'Failed to fetch history' } });
        }
    }

    // Create or Update
    static async update(req: Request, res: Response) {
        try {
            const { user } = req as any;
            const { monthlyIncome, monthlyDebts } = req.body;
            const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

            const income = Number(monthlyIncome);
            const debts = Number(monthlyDebts);

            if (isNaN(income) || isNaN(debts)) {
                return res.status(400).json({ success: false, error: { message: 'Invalid numbers' } });
            }

            let ratio = 0;
            if (income > 0) {
                ratio = (debts / income) * 100;
            }

            let status: 'GOOD' | 'ACCEPTABLE' | 'RISKY' = 'GOOD';
            if (ratio > 50) status = 'RISKY';
            else if (ratio > 33) status = 'ACCEPTABLE';

            const result = await prisma.debtRatio.upsert({
                where: {
                    userId_month: {
                        userId: user.id,
                        month: currentMonth
                    }
                },
                update: {
                    monthlyIncome: income,
                    monthlyDebts: debts,
                    ratio,
                    status
                },
                create: {
                    userId: user.id,
                    month: currentMonth,
                    monthlyIncome: income,
                    monthlyDebts: debts,
                    ratio,
                    status
                }
            });

            res.json({ success: true, data: result });
        } catch (error) {
            logger.error('Error updating debt ratio:', error);
            res.status(500).json({ success: false, error: { message: 'Failed to update data' } });
        }
    }
}
