import { Router, IRouter } from 'express';
import { PaymentPlanController } from '../controllers/paymentPlan.controller';
import { authenticateJWT } from '../middleware/auth';

const router: IRouter = Router();

router.use(authenticateJWT);

router.get('/', PaymentPlanController.getAll);
router.post('/', PaymentPlanController.create);
router.put('/:id', PaymentPlanController.update);
router.delete('/:id', PaymentPlanController.delete);
router.post('/:id/record-payment', PaymentPlanController.recordPayment);

export default router;
