import { Router, IRouter } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authenticateJWT } from '../middleware/auth';

const router: IRouter = Router();

router.use(authenticateJWT);

router.get('/', SubscriptionController.getAll);
router.post('/', SubscriptionController.create);
router.get('/upcoming', SubscriptionController.getUpcoming);
router.get('/stats', SubscriptionController.getStats);
router.put('/:id', SubscriptionController.update);
router.delete('/:id', SubscriptionController.delete);

export default router;
