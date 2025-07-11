import { Router } from 'express';
import loginRoutes from './login';
import profileRoutes from './profile';
import statsRoutes from './stats';

const router = Router();

// Mount authentication routes
router.use('/', loginRoutes);
router.use('/', profileRoutes);
router.use('/', statsRoutes);

export default router; 