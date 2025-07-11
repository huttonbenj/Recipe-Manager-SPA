/**
 * String formatting utilities
 */

/**
 * Capitalize the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert a string to title case
 * @param str - String to convert
 * @returns Title case string
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str.split(/([\s\-_]+)/).map(part => {
    if (/^[a-zA-Z0-9]/.test(part)) {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    }
    return part;
  }).join('');
};

/**
 * Convert a string to kebab-case
 * @param str - String to convert
 * @returns Kebab case string
 */
export const toKebabCase = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
};

/**
 * Convert a string to camelCase
 * @param str - String to convert
 * @returns Camel case string
 */
export const toCamelCase = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
};

/**
 * Truncate a string to a maximum length
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated
 * @returns Truncated string
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (!str || str.length <= maxLength) return str;
  const truncatedLength = Math.max(0, maxLength - suffix.length);
  return str.substring(0, truncatedLength) + suffix;
};

/**
 * Generate a slug from a string
 * @param str - String to convert to slug
 * @returns URL-friendly slug
 */
export const slugify = (str: string): string => {
  if (!str) return '';
  return str
    .toString()
    .normalize('NFD') // Normalize accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '-') // Replace all non-word characters with -
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
};

/**
 * Extract initials from a name
 * @param name - Full name
 * @returns Initials (up to 3 characters)
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 3)
    .join('');
};

/**
 * Format a number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
}; 