// Base services
export * from './base';

// Domain-specific services
export * from './auth';
export * from './recipes';
export * from './upload';

// Service instances for easy access
export { authService } from './auth';
export { recipeService } from './recipes';
export { uploadService } from './upload'; 