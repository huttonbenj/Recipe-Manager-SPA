/**
 * File upload API service
 */

import { apiClient, createFormData } from './client'
import type { UploadResponse } from '@/types'

export const uploadApi = {
  /**
   * Upload image file
   */
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = createFormData({ image: file })
    
    // Remove Content-Type header to let browser set it correctly for FormData
    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': undefined, // Let browser set multipart/form-data
      },
    })
    
    // The API returns { success: true, data: { url, filename, size, mimetype, ... } }
    // We need to extract the data from the response
    return response.data.data
  },

  /**
   * Upload multiple images
   */
  async uploadImages(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData()
    files.forEach((file, _index) => {
      formData.append(`images`, file)
    })
    
    const response = await apiClient.post('/upload/images', formData, {
      headers: {
        'Content-Type': undefined, // Let browser set multipart/form-data
      },
    })
    
    // The API returns { success: true, data: [...] }
    return response.data.data
  },

  /**
   * Delete uploaded image
   */
  async deleteImage(filename: string): Promise<void> {
    await apiClient.delete(`/upload/image/${filename}`)
  },
}