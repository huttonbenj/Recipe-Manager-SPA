import { useCallback, useMemo } from 'react';

export interface ImageProcessingOptions {
  quality?: number; // 0-1 for compression
  maxWidth?: number;
  maxHeight?: number;
}

const defaultProcessingOptions: ImageProcessingOptions = {
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
};

export const useImageProcessing = (options: ImageProcessingOptions = {}) => {
  const config = useMemo(() => ({ ...defaultProcessingOptions, ...options }), [options]);

  // Resize image if needed
  const resizeImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { width, height } = img;
        let { maxWidth, maxHeight } = config;

        // Calculate new dimensions
        let newWidth = width;
        let newHeight = height;

        if (maxWidth && width > maxWidth) {
          newWidth = maxWidth;
          newHeight = (height * maxWidth) / width;
        }

        if (maxHeight && newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = (newWidth * maxHeight) / newHeight;
        }

        // Only resize if dimensions changed
        if (newWidth !== width || newHeight !== height) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx?.drawImage(img, 0, 0, newWidth, newHeight);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const resizedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(resizedFile);
              } else {
                resolve(file);
              }
            },
            file.type,
            config.quality
          );
        } else {
          resolve(file);
        }
      };

      img.src = URL.createObjectURL(file);
    });
  }, [config]);

  // Create image preview
  const createPreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = () => {
        reject(new Error('Failed to create image preview'));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Get image dimensions
  const getImageDimensions = useCallback((file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = URL.createObjectURL(file);
    });
  }, []);

  return {
    resizeImage,
    createPreview,
    getImageDimensions,
    maxWidth: config.maxWidth,
    maxHeight: config.maxHeight,
    quality: config.quality,
  };
}; 