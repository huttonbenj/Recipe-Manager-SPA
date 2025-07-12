import { Router } from 'express';
import searchRoutes from './search';
import categoriesRoutes from './categories';
import crudRoutes from './crud';
import likesRoutes from './likes';
import savesRoutes from './saves';

const router = Router();

// Mount search routes first (order matters for /search vs /:id)
router.use('/', searchRoutes);

// Mount categories routes
router.use('/', categoriesRoutes);

// Mount CRUD routes (these should be last due to /:id parameter)
router.use('/:id', likesRoutes);
router.use('/:id', savesRoutes);
router.use('/', crudRoutes);

export default router; 