import { Request, Response } from 'express';
import { aiService } from '../services/ai.service';
import { logger } from '../utils/logger';

export class AIController {
    static async chat(req: Request, res: Response) {
        try {
            const { user } = req as any;
            const { message } = req.body;

            if (!message) {
                return res.status(400).json({ success: false, error: 'Message is required' });
            }

            const response = await aiService.analyzeFinances(user.id, message);

            res.json({
                success: true,
                data: {
                    response: response
                }
            });
        } catch (error) {
            logger.error('AI Chat Error:', error);
            res.status(500).json({
                success: false,
                error: { message: 'Failed to process AI request' }
            });
        }
    }

    static async categorize(req: Request, res: Response) {
        try {
            const { description, amount } = req.body;

            if (!description) {
                return res.status(400).json({ success: false, error: 'Description is required' });
            }

            const result = await aiService.categorizeTransaction(description, parseFloat(amount));

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            logger.error('AI Categorize Error:', error);
            res.status(500).json({
                success: false,
                error: { message: 'Failed to categorize' }
            });
        }
    }
}
