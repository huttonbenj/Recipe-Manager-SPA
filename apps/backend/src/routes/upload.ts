/**
 * Upload routes
 * Handles file upload endpoints
 */

import { Router } from 'express'
import uploadController from '../controllers/uploadController'
import uploadService from '../services/uploadService'
import { authenticateToken, optionalAuth } from '../middleware/auth'
import { uploadRateLimit } from '../middleware/security'

const router = Router()

// Configure Multer middleware
const upload = uploadService.getMulterConfig()

// POST /api/upload/image - Upload image (optional auth)
router.post('/image', uploadRateLimit, optionalAuth, upload.single('image'), uploadController.uploadImage)

// DELETE /api/upload/image - Delete image (protected)
router.delete('/image', authenticateToken, uploadController.deleteImage)

// GET /api/upload/image/info - Get image info (public)
router.get('/image/info', uploadController.getImageInfo)

// GET /api/upload/stats - Get upload stats (protected)
router.get('/stats', authenticateToken, uploadController.getUploadStats)

// POST /api/upload/cleanup - Cleanup old images (protected)
router.post('/cleanup', authenticateToken, uploadController.cleanupOldImages)

export default router