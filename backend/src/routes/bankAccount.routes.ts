import { Router, IRouter } from 'express';
import { BankAccountController } from '../controllers/bankAccount.controller';
import { authenticateJWT } from '../middleware/auth';

const router: IRouter = Router();

router.use(authenticateJWT);

router.get('/', BankAccountController.getAll);
router.post('/', BankAccountController.create);
router.get('/:id', BankAccountController.getById);
router.put('/:id', BankAccountController.update);
router.delete('/:id', BankAccountController.delete);
router.post('/:id/sync', BankAccountController.sync);

export default router;
