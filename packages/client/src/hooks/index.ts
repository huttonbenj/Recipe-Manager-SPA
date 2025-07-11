// Re-export all hooks from their organized domain directories
export { useAuth } from './useAuth';

// Form hooks
export * from './form';

// Image hooks
export * from './image';

// Recipe hooks
export * from './recipe';

// UI hooks  
export * from './ui';

// User hooks
export * from './user';

// Maintained for backward compatibility
export { useImageUpload, useImageValidation, useImageProcessing } from './useImageUpload';
export type { ImageUploadState, ImageUploadOptions, ImageValidationOptions, ImageProcessingOptions } from './useImageUpload'; 