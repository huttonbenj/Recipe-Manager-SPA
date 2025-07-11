import { ValidationResult } from './errors';
import { RECIPE_CONFIG } from '../constants/index';

// Recipe validation
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
    } else if (title.length > RECIPE_CONFIG.TITLE.MAX_LENGTH) {
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
    if (typeof recipeData.difficulty !== 'string' || 
        !RECIPE_CONFIG.DIFFICULTY_LEVELS.includes(recipeData.difficulty as any)) {
      errors.push('difficulty');
      isValid = false;
    }
  }

  if (recipeData.category !== undefined) {
    if (typeof recipeData.category !== 'string' || 
        recipeData.category.length > RECIPE_CONFIG.CATEGORY.MAX_LENGTH) {
      errors.push('category');
      isValid = false;
    }
  }

  if (recipeData.image_url !== undefined) {
    if (typeof recipeData.image_url !== 'string' || 
        !isValidUrl(recipeData.image_url)) {
      errors.push('imageUrl');
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

// Recipe create validation
export function validateRecipeCreate(recipe: unknown): ValidationResult {
  return validateRecipe(recipe);
}

// Recipe update validation (allows partial updates)
export function validateRecipeUpdate(recipe: unknown): ValidationResult {
  if (!recipe || typeof recipe !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid recipe data'],
      message: 'Recipe data must be an object'
    };
  }

  const recipeData = recipe as Record<string, unknown>;
  const errors: string[] = [];
  let isValid = true;

  // Only validate fields that are present
  if (recipeData.title !== undefined) {
    if (typeof recipeData.title !== 'string' || recipeData.title.trim().length === 0) {
      errors.push('title');
      isValid = false;
    }
  }

  if (recipeData.ingredients !== undefined) {
    if (typeof recipeData.ingredients !== 'string') {
      errors.push('ingredients');
      isValid = false;
    } else {
      try {
        const ingredients = JSON.parse(recipeData.ingredients);
        if (!Array.isArray(ingredients)) {
          errors.push('ingredients');
          isValid = false;
        }
      } catch {
        errors.push('ingredients');
        isValid = false;
      }
    }
  }

  if (recipeData.instructions !== undefined) {
    if (typeof recipeData.instructions !== 'string' || recipeData.instructions.trim().length === 0) {
      errors.push('instructions');
      isValid = false;
    }
  }

  return {
    isValid,
    errors,
    message: isValid ? '' : 'Recipe update validation failed'
  };
}

// Helper function to validate URLs
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
} 