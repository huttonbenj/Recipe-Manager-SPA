/**
 * Array set operations and search utilities
 */

/**
 * Get unique values from multiple arrays
 * @param arrays - Arrays to get unique values from
 * @returns Array of unique values
 */
export const union = <T>(...arrays: T[][]): T[] => {
  return [...new Set(arrays.flat())];
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