import { axiosInstance } from '../base';

export interface UploadResponse {
  success: boolean;
  data?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
  };
  error?: string;
}

// Image compression utility
const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress the image
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg', // Convert to JPEG for better compression
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file); // Fallback to original if compression fails
        }
      }, 'image/jpeg', quality);
    };
    
    img.onerror = () => {
      resolve(file); // Fallback to original if image loading fails
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export class UploadService {
  async uploadImage(file: File): Promise<UploadResponse> {
    try {
      // Compress image before upload if it's large
      const shouldCompress = file.size > 1024 * 1024; // 1MB threshold
      const fileToUpload = shouldCompress ? await compressImage(file) : file;
      
      console.log(`Image ${shouldCompress ? 'compressed' : 'original'}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
      
      const formData = new FormData();
      formData.append('image', fileToUpload);

      const response = await axiosInstance.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout for uploads
      });

      return response.data;
    } catch (error: any) {
      console.error('Upload error:', error);
      throw new Error(error.response?.data?.message || 'Upload failed');
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService(); 