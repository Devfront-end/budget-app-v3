import { Router, IRouter } from 'express';
import { WishlistController } from '../controllers/wishlist.controller';
import { authenticateJWT } from '../middleware/auth';

const router: IRouter = Router();

router.use(authenticateJWT);

router.get('/', WishlistController.getAll);
router.post('/', WishlistController.create);
router.put('/:id', WishlistController.update);
router.delete('/:id', WishlistController.delete);
router.post('/:id/add-savings', WishlistController.addSavings);
router.get('/:id/savings-history', WishlistController.getSavingsHistory);

export default router;
