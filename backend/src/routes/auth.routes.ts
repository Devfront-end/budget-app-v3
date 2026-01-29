import { Router, IRouter } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { authenticateJWT } from '../middleware/auth';

const router: IRouter = Router();

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window (dev friendly)
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many attempts. Please try again in 15 minutes.',
    },
  },
});

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', AuthController.refreshToken);
router.get('/verify-email', AuthController.verifyEmail);

// 2FA Routes (Protected)
router.post('/2fa/enable', authenticateJWT, AuthController.enable2FA);
router.post('/2fa/verify', authenticateJWT, AuthController.verify2FA);
router.post('/2fa/disable', authenticateJWT, AuthController.disable2FA);

router.post('/forgot-password', authLimiter, AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export default router;
