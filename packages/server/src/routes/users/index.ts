import { Router } from 'express';
import profileRoutes from './profile';
import recipesRoutes from './recipes';
import statsRoutes from './stats';
import accountRoutes from './account';

const router = Router();

// Mount all user route modules
router.use('/', profileRoutes);
router.use('/', recipesRoutes);
router.use('/', statsRoutes);
router.use('/', accountRoutes);

export default router; 