/**
 * Array manipulation utilities
 */

/**
 * Remove duplicates from an array
 * @param arr - Array to remove duplicates from
 * @returns Array without duplicates
 */
export const removeDuplicates = <T>(arr: T[]): T[] => {
  return [...new Set(arr)];
};

/**
 * Group array items by a key
 * @param arr - Array to group
 * @param key - Key to group by
 * @returns Object with grouped items
 */
export const groupBy = <T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => {
  return arr.reduce((groups, item) => {
    const group = String(item[key]);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

/**
 * Sort array by a key
 * @param arr - Array to sort
 * @param key - Key to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export const sortBy = <T, K extends keyof T>(
  arr: T[], 
  key: K, 
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) {
      return order === 'asc' ? -1 : 1;
    }
    if (aVal > bVal) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Shuffle an array
 * @param arr - Array to shuffle
 * @returns Shuffled array
 */
export const shuffle = <T>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Safe to use non-null assertion since we know indices are within bounds
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
};

/**
 * Chunk an array into smaller arrays
 * @param arr - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Get unique values from multiple arrays
 * @param arrays - Arrays to get unique values from
 * @returns Array of unique values
 */
export const union = <T>(...arrays: T[][]): T[] => {
  return removeDuplicates(arrays.flat());
};

/**
 * Get intersection of multiple arrays
 * @param arrays - Arrays to intersect
 * @returns Array of intersected values
 */
export const intersection = <T>(...arrays: T[][]): T[] => {
  if (arrays.length === 0) return [];
  if (arrays.length === 1) return arrays[0] || [];
  
  return arrays.reduce((acc, arr) => 
    acc.filter(item => arr.includes(item))
  );
};

/**
 * Get difference between two arrays
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Array of items in arr1 but not in arr2
 */
export const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  return arr1.filter(item => !arr2.includes(item));
};

/**
 * Find the last item in an array that matches a condition
 * @param arr - Array to search
 * @param predicate - Condition function
 * @returns Last matching item or undefined
 */
export const findLast = <T>(arr: T[], predicate: (item: T) => boolean): T | undefined => {
  for (let i = arr.length - 1; i >= 0; i--) {
    // Safe to use non-null assertion since we know index is within bounds
    const item = arr[i]!;
    if (predicate(item)) {
      return item;
    }
  }
  return undefined;
};

/**
 * Check if an array is empty
 * @param arr - Array to check
 * @returns True if array is empty or undefined
 */
export const isEmpty = <T>(arr: T[] | undefined | null): boolean => {
  return !arr || arr.length === 0;
};

/**
 * Get a random item from an array
 * @param arr - Array to get random item from
 * @returns Random item or undefined if array is empty
 */
export const getRandomItem = <T>(arr: T[]): T | undefined => {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Move an item in an array from one index to another
 * @param arr - Array to modify
 * @param fromIndex - Source index
 * @param toIndex - Target index
 * @returns New array with item moved
 */
export const moveItem = <T>(arr: T[], fromIndex: number, toIndex: number): T[] => {
  const result = [...arr];
  const removed = result.splice(fromIndex, 1)[0];
  if (removed !== undefined) {
    result.splice(toIndex, 0, removed);
  }
  return result;
};

/**
 * Flatten a nested array
 * @param arr - Array to flatten
 * @returns Flattened array
 */
export const flatten = <T>(arr: (T | T[])[]): T[] => {
  return arr.reduce<T[]>((acc, item) => {
    if (Array.isArray(item)) {
      return acc.concat(flatten(item));
    }
    return acc.concat(item);
  }, []);
};

/**
 * Count occurrences of each item in an array
 * @param arr - Array to count items in
 * @returns Object with item counts
 */
export const countOccurrences = <T>(arr: T[]): Record<string, number> => {
  return arr.reduce((counts, item) => {
    const key = String(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
}; 