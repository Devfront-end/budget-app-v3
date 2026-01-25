import { Router, IRouter } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateJWT } from '../middleware/auth';

const router: IRouter = Router();

router.use(authenticateJWT);

router.get('/summary', DashboardController.getSummary);
router.get('/stats', DashboardController.getStats);
router.get('/recent-transactions', DashboardController.getRecentTransactions);

export default router;
