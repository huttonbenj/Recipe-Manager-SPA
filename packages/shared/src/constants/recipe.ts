// Recipe-specific configuration constants to avoid circular dependencies
export const RECIPE_CONFIG = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  INSTRUCTIONS: {
    MAX_LENGTH: 5000,
  },
  DIFFICULTY_LEVELS: ['Easy', 'Medium', 'Hard'] as const,
  CATEGORY: {
    MAX_LENGTH: 50,
  },
} as const; 