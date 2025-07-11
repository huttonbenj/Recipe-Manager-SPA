import { AxiosResponse } from 'axios';
import { axiosInstance, BaseService } from '../base';
import { API_ENDPOINTS } from '@recipe-manager/shared';
import type { ApiResponse } from '@recipe-manager/shared';

export interface UploadResponse {
  url: string;
  filename: string;
}

export class UploadService extends BaseService {
  // Upload image file
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response: AxiosResponse<ApiResponse<UploadResponse>> = await axiosInstance.post(
      API_ENDPOINTS.UPLOAD.IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to upload image');
  }

  // Upload image with progress callback
  async uploadImageWithProgress(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response: AxiosResponse<ApiResponse<UploadResponse>> = await axiosInstance.post(
      API_ENDPOINTS.UPLOAD.IMAGE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      }
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to upload image');
  }

  // Delete uploaded image
  async deleteImage(filename: string): Promise<void> {
    const response: AxiosResponse<ApiResponse<void>> = await axiosInstance.delete(
      `${API_ENDPOINTS.UPLOAD.IMAGE}/${filename}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete image');
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService(); 