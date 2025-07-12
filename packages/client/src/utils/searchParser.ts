export interface ParsedSearchQuery {
  searchTerm: string;
  category?: string;
  difficulty?: string;
  cookTime?: string;
  filters: {
    [key: string]: string;
  };
}

// Keywords for different filter types
const DIFFICULTY_KEYWORDS = {
  easy: ['easy', 'simple', 'beginner', 'quick', 'basic', 'effortless', 'straightforward'],
  medium: ['medium', 'moderate', 'intermediate', 'average', 'standard'],
  hard: ['hard', 'difficult', 'advanced', 'complex', 'challenging', 'expert', 'professional']
};

const CATEGORY_KEYWORDS = {
  'Main Course': ['main', 'dinner', 'entree', 'lunch', 'main course', 'main dish', 'entrée'],
  'Dessert': ['dessert', 'sweet', 'cake', 'cookie', 'pie', 'candy', 'chocolate', 'ice cream', 'pudding', 'tart'],
  'Salad': ['salad', 'greens', 'fresh', 'raw', 'lettuce', 'spinach'],
  'Breakfast': ['breakfast', 'morning', 'brunch', 'cereal', 'pancake', 'waffle', 'toast', 'eggs'],
  'Appetizer': ['appetizer', 'starter', 'snack', 'finger food', 'hors d\'oeuvre', 'canapé'],
  'Soup': ['soup', 'broth', 'stew', 'chowder', 'bisque', 'consommé'],
  'Beverage': ['drink', 'beverage', 'smoothie', 'juice', 'cocktail', 'tea', 'coffee', 'shake'],
  'Healthy': ['healthy', 'diet', 'low-fat', 'keto', 'vegan', 'vegetarian', 'gluten-free', 'organic', 'clean eating']
};

const COOK_TIME_KEYWORDS = {
  '15': ['quick', 'fast', '15 min', 'fifteen minutes', 'super quick', 'instant', 'rapid'],
  '30': ['30 min', 'thirty minutes', 'half hour', 'quick meal', 'weeknight'],
  '45': ['45 min', 'forty-five minutes', 'under an hour'],
  '60': ['1 hour', 'one hour', '60 min', 'hour'],
  '90': ['1.5 hours', 'hour and half', '90 min'],
  '120': ['2 hours', 'two hours', '120 min', 'slow cook', 'long cook']
};

// Additional ingredient-based category hints
const INGREDIENT_CATEGORY_HINTS = {
  'Main Course': ['chicken', 'beef', 'pork', 'fish', 'salmon', 'pasta', 'rice', 'steak', 'lamb'],
  'Dessert': ['sugar', 'flour', 'butter', 'chocolate', 'vanilla', 'cream', 'frosting'],
  'Salad': ['lettuce', 'tomato', 'cucumber', 'dressing', 'vinaigrette'],
  'Breakfast': ['egg', 'milk', 'syrup', 'bacon', 'sausage', 'oats'],
  'Soup': ['stock', 'broth', 'onion', 'carrot', 'celery'],
  'Beverage': ['water', 'milk', 'fruit', 'ice', 'blend']
};

/**
 * Parse a search query and extract filters
 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  const result: ParsedSearchQuery = {
    searchTerm: '',
    filters: {}
  };

  if (!query.trim()) {
    return result;
  }

  const words = query.toLowerCase().split(/\s+/);
  const usedWords = new Set<number>();

  // Extract difficulty
  for (const [difficulty, keywords] of Object.entries(DIFFICULTY_KEYWORDS)) {
    for (let i = 0; i < words.length; i++) {
      if (usedWords.has(i)) continue;
      
      if (words[i] && keywords.includes(words[i]!)) {
        const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        result.difficulty = capitalizedDifficulty;
        result.filters.difficulty = capitalizedDifficulty;
        usedWords.add(i);
        break;
      }
    }
    if (result.difficulty) break;
  }

  // Extract category
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (let i = 0; i < words.length; i++) {
      if (usedWords.has(i)) continue;
      
      // Check single words
      if (words[i] && keywords.includes(words[i]!)) {
        result.category = category;
        result.filters.category = category;
        usedWords.add(i);
        break;
      }
      
      // Check multi-word phrases
      if (i < words.length - 1) {
        const twoWords = `${words[i]} ${words[i + 1]}`;
        if (keywords.includes(twoWords)) {
          result.category = category;
          result.filters.category = category;
          usedWords.add(i);
          usedWords.add(i + 1);
          break;
        }
      }
    }
    if (result.category) break;
  }

  // Extract cook time
  for (const [time, keywords] of Object.entries(COOK_TIME_KEYWORDS)) {
    for (let i = 0; i < words.length; i++) {
      if (usedWords.has(i)) continue;
      
      if (keywords.some(keyword => {
        const keywordWords = keyword.split(' ');
        if (keywordWords.length === 1) {
          return words[i] === keyword;
        } else {
          // Multi-word keyword
          return keywordWords.every((kw, idx) => 
            i + idx < words.length && words[i + idx] === kw
          );
        }
      })) {
        result.cookTime = time;
        result.filters.cookTime = time;
        // Mark all used words
        const matchedKeyword = keywords.find(keyword => {
          const keywordWords = keyword.split(' ');
          return keywordWords.every((kw, idx) => 
            i + idx < words.length && words[i + idx] === kw
          );
        });
        if (matchedKeyword) {
          const keywordWords = matchedKeyword.split(' ');
          for (let j = 0; j < keywordWords.length; j++) {
            usedWords.add(i + j);
          }
        }
        break;
      }
    }
    if (result.cookTime) break;
  }

  // If no explicit category found, try to infer from ingredients
  if (!result.category) {
    const remainingWords = words.filter((_, index) => !usedWords.has(index));
    for (const [category, ingredients] of Object.entries(INGREDIENT_CATEGORY_HINTS)) {
      for (const ingredient of ingredients) {
        if (remainingWords.some(word => word.includes(ingredient) || ingredient.includes(word))) {
          result.category = category;
          result.filters.category = category;
          break;
        }
      }
      if (result.category) break;
    }
  }

  // Remaining words form the search term
  const remainingWords = words.filter((_, index) => !usedWords.has(index));
  result.searchTerm = remainingWords.join(' ').trim();

  return result;
}

/**
 * Convert parsed query back to a natural language description
 */
export function formatSearchDescription(parsed: ParsedSearchQuery): string {
  const parts: string[] = [];
  
  if (parsed.difficulty) {
    parts.push(`${parsed.difficulty} difficulty`);
  }
  
  if (parsed.category) {
    parts.push(parsed.category.toLowerCase());
  }
  
  if (parsed.cookTime) {
    parts.push(`under ${parsed.cookTime} minutes`);
  }
  
  if (parsed.searchTerm) {
    parts.push(`"${parsed.searchTerm}"`);
  }
  
  return parts.length > 0 ? parts.join(' • ') : 'All recipes';
}

/**
 * Get search suggestions based on partial query
 */
export function getSearchSuggestions(query: string): string[] {
  const suggestions: string[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Add difficulty suggestions
  Object.entries(DIFFICULTY_KEYWORDS).forEach(([_difficulty, keywords]) => {
    keywords.forEach(keyword => {
      if (keyword.includes(lowerQuery) && !suggestions.includes(`${keyword} recipes`)) {
        suggestions.push(`${keyword} recipes`);
      }
    });
  });
  
  // Add category suggestions
  Object.entries(CATEGORY_KEYWORDS).forEach(([_category, keywords]) => {
    keywords.forEach(keyword => {
      if (keyword.includes(lowerQuery) && !suggestions.includes(`${keyword} recipes`)) {
        suggestions.push(`${keyword} recipes`);
      }
    });
  });
  
  // Add cook time suggestions
  Object.entries(COOK_TIME_KEYWORDS).forEach(([_time, keywords]) => {
    keywords.forEach(keyword => {
      if (keyword.includes(lowerQuery) && !suggestions.includes(`${keyword} recipes`)) {
        suggestions.push(`${keyword} recipes`);
      }
    });
  });
  
  return suggestions.slice(0, 8);
}

/**
 * Generate smart search examples for UI
 */
export function getSearchExamples(): string[] {
  return [
    'easy chicken dinner',
    'quick dessert recipes',
    'healthy breakfast under 30 minutes',
    'vegetarian main course',
    'chocolate cake simple',
    'pasta dishes intermediate',
    'soup recipes winter',
    'salad fresh summer'
  ];
} 