import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authenticateJWT } from '../middleware/auth';

const router: Router = Router();

router.use(authenticateJWT); // Protected

router.post('/chat', AIController.chat);
router.post('/categorize', AIController.categorize);

export default router;
