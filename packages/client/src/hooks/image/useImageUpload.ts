import React, { useState, useCallback } from 'react';
import { useImageValidation, ImageValidationOptions } from './useImageValidation';
import { useImageProcessing, ImageProcessingOptions } from './useImageProcessing';

export interface ImageUploadState {
  imageFile: File | null;
  imagePreview: string | null;
  uploadProgress: number;
  isUploading: boolean;
  error: string | null;
}

export interface ImageUploadOptions extends ImageValidationOptions, ImageProcessingOptions {}

export const useImageUpload = (options: ImageUploadOptions = {}) => {
  const [state, setState] = useState<ImageUploadState>({
    imageFile: null,
    imagePreview: null,
    uploadProgress: 0,
    isUploading: false,
    error: null,
  });

  const { validateFile } = useImageValidation(options);
  const { resizeImage, createPreview } = useImageProcessing(options);

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
      const preview = await createPreview(processedFile);

      setState(prev => ({
        ...prev,
        imageFile: processedFile,
        imagePreview: preview,
        isUploading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to process image',
        isUploading: false,
      }));
    }
  }, [validateFile, resizeImage, createPreview]);

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