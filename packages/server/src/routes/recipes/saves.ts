import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { HTTP_STATUS } from '@recipe-manager/shared';
import { prisma } from '../../config/database';

const router = Router({ mergeParams: true }); // merge params to access :id from parent

// POST /api/recipes/:id/save - Save a recipe
router.post(
  '/save',
  authenticate,
  asyncHandler(async (req, res) => {
    const recipeId = req.params.id;
    const userId = (req as AuthenticatedRequest).user.userId;

    if (!recipeId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Recipe ID is required' });
      return;
    }

    try {
      const prismaAny = prisma as any;
      await prismaAny.recipeSave.create({
        data: {
          user_id: userId,
          recipe_id: recipeId,
        },
      });
      res.status(HTTP_STATUS.OK).json({ success: true });
    } catch (error: any) {
      console.error('Save error:', error);
      if (error.code === 'P2002') {
        // Unique constraint violation -> already saved
        res.status(HTTP_STATUS.OK).json({ success: true });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Failed to save recipe' });
      }
    }
  })
);

// DELETE /api/recipes/:id/save - Unsave a recipe
router.delete(
  '/save',
  authenticate,
  asyncHandler(async (req, res) => {
    const recipeId = req.params.id;
    const userId = (req as AuthenticatedRequest).user.userId;

    if (!recipeId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Recipe ID is required' });
      return;
    }

    try {
      const prismaAny2 = prisma as any;
      await prismaAny2.recipeSave.delete({
        where: {
          user_id_recipe_id: {
            user_id: userId,
            recipe_id: recipeId,
          },
        },
      });
    } catch (error) {
      console.error('Unsave error:', error);
      // Ignore errors if the save doesn't exist
    }

    res.json({ success: true });
  })
);

export default router; 