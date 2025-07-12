import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { asyncHandler } from '../../utils/asyncHandler';
import { HTTP_STATUS } from '@recipe-manager/shared';
import { prisma } from '../../config/database';

const router = Router({ mergeParams: true }); // merge params to access :id from parent

// POST /api/recipes/:id/like - Like a recipe
router.post(
  '/like',
  authenticate,
  asyncHandler(async (req, res) => {
    const recipeId = req.params.id;
    const userId = (req as AuthenticatedRequest).user.userId;

    if (!recipeId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Recipe ID is required' });
      return;
    }

    try {
      await prisma.recipeLike.create({
        data: {
          user_id: userId,
          recipe_id: recipeId,
        },
      });
      res.status(HTTP_STATUS.OK).json({ success: true });
    } catch (error: any) {
      console.error('Like error:', error);
      if (error.code === 'P2002') {
        // Unique constraint violation -> already liked
        res.status(HTTP_STATUS.OK).json({ success: true });
      } else {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: 'Failed to like recipe' });
      }
    }
  })
);

// DELETE /api/recipes/:id/like - Unlike a recipe
router.delete(
  '/like',
  authenticate,
  asyncHandler(async (req, res) => {
    const recipeId = req.params.id;
    const userId = (req as AuthenticatedRequest).user.userId;

    if (!recipeId) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'Recipe ID is required' });
      return;
    }

    try {
      await prisma.recipeLike.delete({
        where: {
          user_id_recipe_id: {
            user_id: userId,
            recipe_id: recipeId,
          },
        },
      });
    } catch (error) {
      console.error('Unlike error:', error);
      // Ignore errors if the like doesn't exist
    }

    res.json({ success: true });
  })
);

export default router; 