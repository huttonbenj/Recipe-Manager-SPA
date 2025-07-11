/**
 * String validation and utility functions
 */

/**
 * Check if a string is a valid email
 * @param email - Email string to validate
 * @returns True if valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Check for consecutive dots
  if (email.includes('..')) return false;
  return emailRegex.test(email);
};

/**
 * Check if a string contains only whitespace
 * @param str - String to check
 * @returns True if string is empty or only whitespace
 */
export const isWhitespace = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Count words in a string
 * @param str - String to count words in
 * @returns Number of words
 */
export const countWords = (str: string): number => {
  if (!str) return 0;
  return str.trim().split(/\s+/).length;
};

/**
 * Remove HTML tags from a string
 * @param str - String with HTML tags
 * @returns String without HTML tags
 */
export const stripHtml = (str: string): string => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '');
};

/**
 * Escape HTML special characters
 * @param str - String to escape
 * @returns Escaped string
 */
export const escapeHtml = (str: string): string => {
  if (!str) return '';
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (match) => htmlEscapes[match] || match);
};

/**
 * Generate a random string of specified length
 * @param length - Length of random string
 * @returns Random string
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}; 