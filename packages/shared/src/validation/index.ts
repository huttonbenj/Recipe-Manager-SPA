import { z } from 'zod';
import { ErrorResponseSchema } from '../types/api';
import { UserSchema, UserCredentialsSchema, UserRegistrationSchema } from '../types/user';
import { RecipeSchema, RecipeCreateSchema, RecipeUpdateSchema } from '../types/recipe';
import { RECIPE_CONFIG } from '../constants/index';

// Validation Error Class
export class ValidationError extends Error {
  constructor(
    public readonly errors: z.ZodError,
    message = 'Validation failed'
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  toApiError(): z.infer<typeof ErrorResponseSchema> {
    return {
      success: false,
      error: this.message,
      details: this.errors.issues?.map(err => ({
        path: err.path.join('.'),
        message: err.message
      })) || []
    };
  }
}

// Generic validation functions
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}

export function validateArray<T>(schema: z.ZodSchema<T>, data: unknown): T[] {
  const arraySchema = z.array(schema);
  try {
    return arraySchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(error);
    }
    throw error;
  }
}

// Safe validation functions that return results instead of throwing
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  message?: string;
}

export interface ValidationResultWithData<T> extends ValidationResult {
  sanitized?: T;
}

export function safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult & { data?: T } {
  try {
    const result = schema.parse(data);
    return {
      isValid: true,
      errors: [],
      data: result
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: string[] = [];
      error.issues?.forEach(issue => {
        const fieldName = issue.path.join('.');
        // Add field name to errors for test compatibility
        if (fieldName) {
          errors.push(fieldName);
        }
        // Also add the full error message
        errors.push(fieldName + ': ' + issue.message);
      });
      
      return {
        isValid: false,
        errors: errors,
        message: error.issues?.[0]?.message || 'Validation failed'
      };
    }
    return {
      isValid: false,
      errors: ['unknown'],
      message: 'Unknown validation error'
    };
  }
}

// Specific validation functions using Zod schemas
export function validateEmail(email: string): boolean {
  const emailSchema = z.string().email();
  try {
    emailSchema.parse(email.trim());
    return true;
  } catch {
    return false;
  }
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  // Check minimum length
  if (password.length < 8) {
    errors.push('minLength');
    isValid = false;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('uppercase');
    isValid = false;
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('lowercase');
    isValid = false;
  }

  // Check for number
  if (!/\d/.test(password)) {
    errors.push('number');
    isValid = false;
  }

  // Check for special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('specialChar');
    isValid = false;
  }

  return {
    isValid,
    errors,
    message: isValid ? '' : 'Password does not meet requirements'
  };
}

export function validateUser(user: unknown): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  if (!user || typeof user !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid user data'],
      message: 'User data must be an object'
    };
  }

  const userData = user as Record<string, unknown>;

  // Check required fields
  if (!userData.email || typeof userData.email !== 'string') {
    errors.push('email');
    isValid = false;
  } else if (!validateEmail(userData.email)) {
    errors.push('email');
    isValid = false;
  }

  if (!userData.name || typeof userData.name !== 'string' || userData.name.trim().length === 0) {
    errors.push('name');
    isValid = false;
  }

  // Check password if present (for registration validation)
  if (userData.password !== undefined) {
    if (!userData.password || typeof userData.password !== 'string') {
      errors.push('password');
      isValid = false;
    } else {
      const passwordResult = validatePassword(userData.password);
      if (!passwordResult.isValid) {
        errors.push('password');
        isValid = false;
      }
    }
  }

  return {
    isValid,
    errors,
    message: isValid ? '' : 'User validation failed'
  };
}

export function validateUserCredentials(credentials: unknown): ValidationResult {
  return safeValidate(UserCredentialsSchema, credentials);
}

export function validateUserRegistration(registration: unknown): ValidationResult {
  return safeValidate(UserRegistrationSchema, registration);
}

export function validateRecipe(recipe: unknown): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  if (!recipe || typeof recipe !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid recipe data'],
      message: 'Recipe data must be an object'
    };
  }

  const recipeData = recipe as Record<string, unknown>;

  // Check required fields
  if (!recipeData.title || typeof recipeData.title !== 'string') {
    errors.push('title');
    isValid = false;
  } else {
    const title = recipeData.title.trim();
    if (title.length === 0) {
      errors.push('title');
      isValid = false;
    } else if (title.length < 3) {
      errors.push('titleLength');
      isValid = false;
    } else if (title.length > 200) {
      errors.push('titleLength');
      isValid = false;
    }
  }

  if (!recipeData.ingredients || typeof recipeData.ingredients !== 'string') {
    errors.push('ingredients');
    isValid = false;
  } else {
    try {
      const ingredients = JSON.parse(recipeData.ingredients);
      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        errors.push('ingredients');
        isValid = false;
      }
    } catch {
      errors.push('ingredients');
      isValid = false;
    }
  }

  if (!recipeData.instructions || typeof recipeData.instructions !== 'string' || recipeData.instructions.trim().length === 0) {
    errors.push('instructions');
    isValid = false;
  }

  // Check optional fields with validation
  if (recipeData.cook_time !== undefined) {
    if (typeof recipeData.cook_time !== 'number' || recipeData.cook_time <= 0) {
      errors.push('cookTime');
      isValid = false;
    }
  }

  if (recipeData.servings !== undefined) {
    if (typeof recipeData.servings !== 'number' || recipeData.servings <= 0) {
      errors.push('servings');
      isValid = false;
    }
  }

  if (recipeData.difficulty !== undefined) {
    if (typeof recipeData.difficulty !== 'string' || !RECIPE_CONFIG.DIFFICULTY_LEVELS.includes(recipeData.difficulty as typeof RECIPE_CONFIG.DIFFICULTY_LEVELS[number])) {
      errors.push('difficulty');
      isValid = false;
    }
  }

  if (recipeData.tags !== undefined) {
    if (typeof recipeData.tags !== 'string') {
      errors.push('tags');
      isValid = false;
    } else {
      try {
        const tags = JSON.parse(recipeData.tags);
        if (!Array.isArray(tags)) {
          errors.push('tags');
          isValid = false;
        }
      } catch {
        errors.push('tags');
        isValid = false;
      }
    }
  }

  return {
    isValid,
    errors,
    message: isValid ? '' : 'Recipe validation failed'
  };
}

export function validateRecipeCreate(recipe: unknown): ValidationResult {
  return safeValidate(RecipeCreateSchema, recipe);
}

export function validateRecipeUpdate(recipe: unknown): ValidationResult {
  return safeValidate(RecipeUpdateSchema, recipe);
}

// Sanitization function
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

// Re-export schemas for direct use
export {
  UserSchema,
  UserCredentialsSchema,
  UserRegistrationSchema,
  RecipeSchema,
  RecipeCreateSchema,
  RecipeUpdateSchema
}; 