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
    
    const response = await apiClient.post<UploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  },

  /**
   * Upload multiple images
   */
  async uploadImages(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData()
    files.forEach((file, _index) => {
      formData.append(`images`, file)
    })
    
    const response = await apiClient.post<UploadResponse[]>('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  },

  /**
   * Delete uploaded image
   */
  async deleteImage(filename: string): Promise<void> {
    await apiClient.delete(`/upload/image/${filename}`)
  },
}