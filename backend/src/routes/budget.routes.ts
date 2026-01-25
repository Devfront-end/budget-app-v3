import { Router, IRouter } from 'express';
import { BudgetController } from '../controllers/budget.controller';
import { authenticateJWT } from '../middleware/auth';

const router: IRouter = Router();

// All budget routes require authentication
router.use(authenticateJWT);

router.get('/', BudgetController.getBudgets);
router.get('/:id', BudgetController.getBudget);
router.post('/', BudgetController.createBudget);
router.put('/:id', BudgetController.updateBudget);
router.delete('/:id', BudgetController.deleteBudget);

// Special route for budget progress
router.get('/:month/progress', BudgetController.getBudgetProgress);

export default router;