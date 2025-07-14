/**
 * Upload Controller
 * Handles file upload requests
 */

import { Request, Response } from 'express'
import uploadService from '../services/uploadService'

export class UploadController {
  /**
   * Upload image file
   * POST /api/upload/image
   */
  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      // Check if file was provided
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'No image file provided'
        })
        return
      }

      // Validate the uploaded file
      const validationErrors = uploadService.validateImageFile(req.file)
      if (validationErrors.length > 0) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: validationErrors[0]
        })
        return
      }

      // Get user ID from authenticated user (optional)
      const userId = req.user?.userId

      // Process the image
      const processedImage = await uploadService.processImage(req.file, userId)

      // Return response in the format expected by frontend
      res.status(200).json({
        success: true,
        data: {
          url: processedImage.webpUrl, // Use the optimized webp version
          filename: processedImage.webpUrl.split('/').pop() || '',
          size: processedImage.metadata.size,
          mimetype: 'image/webp',
          // Also include other versions for potential future use
          originalUrl: processedImage.originalUrl,
          thumbnailUrl: processedImage.thumbnailUrl,
          webpUrl: processedImage.webpUrl
        },
        message: 'Image uploaded and processed successfully'
      })
    } catch (error) {
      console.error('Upload image error:', error)
      
      if (error instanceof Error) {
        // Handle specific errors
        if (error.message.includes('Invalid file type')) {
          res.status(400).json({
            success: false,
            error: 'Invalid file type',
            message: error.message
          })
          return
        }
        
        if (error.message.includes('File too large')) {
          res.status(400).json({
            success: false,
            error: 'File too large',
            message: error.message
          })
          return
        }
        
        if (error.message.includes('Failed to process image')) {
          res.status(422).json({
            success: false,
            error: 'Processing error',
            message: 'Unable to process the uploaded image'
          })
          return
        }
      }

      // Generic error
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to process image upload'
      })
    }
  }

  /**
   * Delete image file
   * DELETE /api/upload/image
   */
  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { imageUrl } = req.body

      if (!imageUrl) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Image URL is required'
        })
        return
      }

      // Delete the image
      const success = await uploadService.deleteImage(imageUrl)

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'Not found',
          message: 'Image not found or already deleted'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: null,
        message: 'Image deleted successfully'
      })
    } catch (error) {
      console.error('Delete image error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete image'
      })
    }
  }

  /**
   * Get image information
   * GET /api/upload/image/info
   */
  async getImageInfo(req: Request, res: Response): Promise<void> {
    try {
      const { imageUrl } = req.query

      if (!imageUrl || typeof imageUrl !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'Image URL is required'
        })
        return
      }

      // Get image info
      const imageInfo = await uploadService.getImageInfo(imageUrl)

      if (!imageInfo.exists) {
        res.status(404).json({
          success: false,
          error: 'Not found',
          message: 'Image not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: {
          imageInfo
        },
        message: 'Image information retrieved successfully'
      })
    } catch (error) {
      console.error('Get image info error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to get image information'
      })
    }
  }

  /**
   * Get upload statistics (admin only)
   * GET /api/upload/stats
   */
  async getUploadStats(req: Request, res: Response): Promise<void> {
    try {
      // Get upload statistics
      const stats = await uploadService.getUploadStats()

      res.status(200).json({
        success: true,
        data: {
          stats
        },
        message: 'Upload statistics retrieved successfully'
      })
    } catch (error) {
      console.error('Get upload stats error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to get upload statistics'
      })
    }
  }

  /**
   * Clean up old images (admin only)
   * POST /api/upload/cleanup
   */
  async cleanupOldImages(req: Request, res: Response): Promise<void> {
    try {
      const { olderThanDays = 30 } = req.body

      if (olderThanDays < 1) {
        res.status(400).json({
          success: false,
          error: 'Validation error',
          message: 'olderThanDays must be at least 1'
        })
        return
      }

      // Clean up old images
      const deletedCount = await uploadService.cleanupOldImages(olderThanDays)

      res.status(200).json({
        success: true,
        data: {
          deletedCount
        },
        message: `Cleanup completed. ${deletedCount} images deleted.`
      })
    } catch (error) {
      console.error('Cleanup old images error:', error)
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to cleanup old images'
      })
    }
  }
}

export default new UploadController() 