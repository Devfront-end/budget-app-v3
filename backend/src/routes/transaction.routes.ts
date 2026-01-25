import { Router, IRouter } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { authenticateJWT } from '../middleware/auth';

const router: IRouter = Router();

router.use(authenticateJWT);

router.get('/', TransactionController.getAll);
router.post('/', TransactionController.create);
router.get('/:id', TransactionController.getOne);
router.put('/:id', TransactionController.update);
router.delete('/:id', TransactionController.delete);

export default router;
