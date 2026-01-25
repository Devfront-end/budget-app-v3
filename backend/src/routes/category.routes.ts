import { Router, IRouter } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { authenticateJWT } from '../middleware/auth';

const router: IRouter = Router();

router.use(authenticateJWT);

router.post('/init-defaults', CategoryController.createDefaultCategories);
router.get('/', CategoryController.getAll);
router.post('/', CategoryController.create);

export default router;
