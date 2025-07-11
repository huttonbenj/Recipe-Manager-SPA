import { useCallback, useMemo } from 'react';

export interface ImageValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

const defaultValidationOptions: ImageValidationOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

export const useImageValidation = (options: ImageValidationOptions = {}) => {
  const config = useMemo(() => ({ ...defaultValidationOptions, ...options }), [options]);

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

  // Check if file type is allowed
  const isFileTypeAllowed = useCallback((file: File): boolean => {
    return config.allowedTypes!.includes(file.type);
  }, [config]);

  // Check if file size is within limits
  const isFileSizeValid = useCallback((file: File): boolean => {
    return file.size <= config.maxSize!;
  }, [config]);

  return {
    validateFile,
    isFileTypeAllowed,
    isFileSizeValid,
    maxSize: config.maxSize,
    allowedTypes: config.allowedTypes,
  };
}; 