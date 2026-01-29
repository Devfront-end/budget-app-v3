import { Router } from 'express';
import { DebtRatioController } from '../controllers/debtRatio.controller';
import { authenticateJWT } from '../middleware/auth';

const router: Router = Router();

router.use(authenticateJWT); // Protect all routes

router.get('/latest', DebtRatioController.getLatest);
router.get('/history', DebtRatioController.getHistory);
router.post('/', DebtRatioController.update);

export default router;
