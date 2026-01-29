import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Données invalides',
                    details: ((error as any).issues || (error as any).errors || []).map((e: any) => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                },
            });
        }
        next(error);
    }
};
