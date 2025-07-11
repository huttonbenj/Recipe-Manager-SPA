import React, { useState, useCallback, useMemo } from 'react';

export interface ImageUploadState {
  imageFile: File | null;
  imagePreview: string | null;
  uploadProgress: number;
  isUploading: boolean;
  error: string | null;
}

export interface ImageUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  quality?: number; // 0-1 for compression
  maxWidth?: number;
  maxHeight?: number;
}

const defaultOptions: ImageUploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  quality: 0.8,
  maxWidth: 1920,
  maxHeight: 1080,
};

export const useImageUpload = (options: ImageUploadOptions = {}) => {
  const [state, setState] = useState<ImageUploadState>({
    imageFile: null,
    imagePreview: null,
    uploadProgress: 0,
    isUploading: false,
    error: null,
  });

  const config = useMemo(() => ({ ...defaultOptions, ...options }), [options]);

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    if (!config.allowedTypes!.includes(file.type)) {
      return `File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes!.join(', ')}`;
    }

    if (file.size > config.maxSize!) {
      return `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(config.maxSize! / 1024 / 1024).toFixed(2)}MB)`;
    }

    return null;
  }, [config]);

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

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    setState(prev => ({
      ...prev,
      error: null,
      isUploading: true,
    }));

    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setState(prev => ({
          ...prev,
          error: validationError,
          isUploading: false,
        }));
        return;
      }

      // Resize if needed
      const processedFile = await resizeImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setState(prev => ({
          ...prev,
          imageFile: processedFile,
          imagePreview: e.target?.result as string,
          isUploading: false,
          error: null,
        }));
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to process image',
        isUploading: false,
      }));
    }
  }, [validateFile, resizeImage]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  // Remove image
  const removeImage = useCallback(() => {
    setState({
      imageFile: null,
      imagePreview: null,
      uploadProgress: 0,
      isUploading: false,
      error: null,
    });
  }, []);

  // Set existing image (for edit mode)
  const setExistingImage = useCallback((imageUrl: string) => {
    setState(prev => ({
      ...prev,
      imagePreview: imageUrl,
      imageFile: null,
      error: null,
    }));
  }, []);

  // Upload progress handler
  const setUploadProgress = useCallback((progress: number) => {
    setState(prev => ({
      ...prev,
      uploadProgress: progress,
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    ...state,
    handleInputChange,
    handleDrop,
    removeImage,
    setExistingImage,
    setUploadProgress,
    clearError,
    validateFile,
  };
}; 