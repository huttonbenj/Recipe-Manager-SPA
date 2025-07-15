/**
 * Upload Service
 * Handles file uploads with image optimization using Sharp
 */

import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { Request } from 'express'
import { config } from '../config'
import type { FileFilterCallback } from 'multer'

interface ProcessedImage {
  originalUrl: string
  thumbnailUrl: string
  webpUrl: string
  metadata: {
    width: number
    height: number
    size: number
    format: string
  }
}

export class UploadService {
  private readonly uploadDir = path.resolve(config.upload.uploadPath)
  private readonly maxFileSize = isNaN(config.upload.maxFileSize) ? 10 * 1024 * 1024 : config.upload.maxFileSize
  private readonly allowedMimeTypes = config.upload.allowedFileTypes

  constructor() {
    this.ensureUploadDirectory()
    // Run cleanup on startup (remove files older than 30 days)
    this.cleanupOldImages(30).catch(error => {
      console.error('Failed to cleanup old images on startup:', error)
    })
  }

  /**
   * Configure Multer for file uploads
   */
  getMulterConfig() {
    const storage = multer.memoryStorage()

    return multer({
      storage,
      limits: {
        fileSize: this.maxFileSize
      },
      fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        // Check file type
        if (!this.allowedMimeTypes.includes(file.mimetype)) {
          return cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'))
        }

        // Check file size (additional check)
        if (file.size && file.size > this.maxFileSize) {
          return cb(new Error('File too large. Maximum size is 10MB.'))
        }

        cb(null, true)
      }
    })
  }

  /**
   * Process and optimize uploaded image
   */
  async processImage(file: Express.Multer.File, userId?: string): Promise<ProcessedImage> {
    try {
      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const baseFilename = `${userId || 'anonymous'}_${timestamp}_${randomString}`

      // Create Sharp instance
      const sharpInstance = sharp(file.buffer)
      const metadata = await sharpInstance.metadata()

      if (!metadata.width || !metadata.height) {
        throw new Error('Invalid image metadata')
      }

      // Define file paths
      const originalPath = path.join(this.uploadDir, `${baseFilename}_original.webp`)
      const thumbnailPath = path.join(this.uploadDir, `${baseFilename}_thumb.webp`)
      const webpPath = path.join(this.uploadDir, `${baseFilename}_optimized.webp`)

      // Process images in parallel
      await Promise.all([
        // Original (resized if too large, but maintain aspect ratio)
        sharpInstance
          .resize(1200, 1200, { 
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 90 })
          .toFile(originalPath),

        // Thumbnail
        sharpInstance
          .resize(300, 300, { 
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 80 })
          .toFile(thumbnailPath),

        // Optimized version
        sharpInstance
          .resize(800, 800, { 
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 85 })
          .toFile(webpPath)
      ])

      // Generate URLs for frontend consumption
      // Use environment-aware base URL construction
      const protocol = config.server.nodeEnv === 'production' ? 'https' : 'http'
      const hostname = config.server.nodeEnv === 'production' 
        ? config.server.backendHost
        : 'localhost'
      const baseUrl = `${protocol}://${hostname}:${config.server.port}`
      
      const originalUrl = `${baseUrl}/uploads/${path.basename(originalPath)}`
      const thumbnailUrl = `${baseUrl}/uploads/${path.basename(thumbnailPath)}`
      const webpUrl = `${baseUrl}/uploads/${path.basename(webpPath)}`

      return {
        originalUrl,
        thumbnailUrl,
        webpUrl,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          size: file.size,
          format: metadata.format || 'unknown'
        }
      }
    } catch (error) {
      // Log detailed error information
      console.error('Image processing error:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        fileInfo: {
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype
        }
      })
      
      // Throw more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Input buffer contains unsupported image format')) {
          throw new Error('Unsupported image format. Please upload a valid JPEG, PNG, or WebP image.')
        }
        if (error.message.includes('ENOSPC')) {
          throw new Error('Insufficient disk space for image processing.')
        }
        if (error.message.includes('ENOMEM')) {
          throw new Error('Image too large to process. Please upload a smaller image.')
        }
      }
      
      throw new Error('Failed to process image. Please try again with a different image.')
    }
  }

  /**
   * Delete image files
   */
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extract filename from URL
      const filename = path.basename(imageUrl)
      const baseFilename = filename.replace(/_(original|thumb|optimized)\.webp$/, '')

      // Delete all versions
      const filesToDelete = [
        `${baseFilename}_original.webp`,
        `${baseFilename}_thumb.webp`,
        `${baseFilename}_optimized.webp`
      ]

      await Promise.all(
        filesToDelete.map(async (filename) => {
          const filePath = path.join(this.uploadDir, filename)
          try {
            await fs.access(filePath)
            await fs.unlink(filePath)
          } catch (error) {
            // File doesn't exist, ignore
          }
        })
      )

      return true
    } catch (error) {
      console.error('Delete image error:', error)
      return false
    }
  }

  /**
   * Validate uploaded image file
   */
  validateImageFile(file: Express.Multer.File): string[] {
    const errors: string[] = []

    // Check file type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      errors.push('Invalid file type. Only JPEG, PNG, and WebP images are allowed.')
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push('File too large. Maximum size is 10MB.')
    }

    // Check if file buffer exists
    if (!file.buffer || file.buffer.length === 0) {
      errors.push('Invalid file data.')
    }

    return errors
  }

  /**
   * Get image info
   */
  async getImageInfo(imageUrl: string): Promise<{
    exists: boolean
    size?: number
    metadata?: sharp.Metadata
  }> {
    try {
      const filename = path.basename(imageUrl)
      const filePath = path.join(this.uploadDir, filename)

      // Check if file exists
      await fs.access(filePath)

      // Get file stats
      const stats = await fs.stat(filePath)
      
      // Get image metadata
      const metadata = await sharp(filePath).metadata()

      return {
        exists: true,
        size: stats.size,
        metadata
      }
    } catch (error) {
      return {
        exists: false
      }
    }
  }

  /**
   * Clean up old images (utility method for maintenance)
   */
  async cleanupOldImages(olderThanDays: number = 30): Promise<number> {
    try {
      const files = await fs.readdir(this.uploadDir)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

      let deletedCount = 0

      for (const file of files) {
        const filePath = path.join(this.uploadDir, file)
        const stats = await fs.stat(filePath)

        if (stats.mtime < cutoffDate) {
          await fs.unlink(filePath)
          deletedCount++
        }
      }

      return deletedCount
    } catch (error) {
      console.error('Cleanup error:', error)
      return 0
    }
  }

  /**
   * Ensure upload directory exists
   */
  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadDir)
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(this.uploadDir, { recursive: true })
      console.log(`Created upload directory: ${this.uploadDir}`)
    }
  }

  /**
   * Get upload statistics
   */
  async getUploadStats(): Promise<{
    totalFiles: number
    totalSize: number
    averageSize: number
  }> {
    try {
      const files = await fs.readdir(this.uploadDir)
      let totalSize = 0

      for (const file of files) {
        const filePath = path.join(this.uploadDir, file)
        const stats = await fs.stat(filePath)
        totalSize += stats.size
      }

      return {
        totalFiles: files.length,
        totalSize,
        averageSize: files.length > 0 ? Math.round(totalSize / files.length) : 0
      }
    } catch (error) {
      console.error('Upload stats error:', error)
      return {
        totalFiles: 0,
        totalSize: 0,
        averageSize: 0
      }
    }
  }
}

export default new UploadService() 