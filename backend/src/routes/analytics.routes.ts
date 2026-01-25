import { Router, IRouter } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticateJWT } from '../middleware/auth';

const router: IRouter = Router();

router.use(authenticateJWT);

router.get('/overview', AnalyticsController.getOverview);
router.get('/trends', AnalyticsController.getTrends);
router.get('/categories', AnalyticsController.getCategoryBreakdown);
router.get('/predictions', AnalyticsController.getPredictions);

export default router;
