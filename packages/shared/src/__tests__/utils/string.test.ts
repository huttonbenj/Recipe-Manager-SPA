import { describe, it, expect } from 'vitest';
import {
  capitalize,
  toTitleCase,
  toKebabCase,
  toCamelCase,
  truncate,
  stripHtml,
  slugify,
  getInitials,
  isValidEmail,
  formatNumber,
  generateRandomString,
  isWhitespace,
  countWords,
  escapeHtml
} from '../../utils/string';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
      expect(capitalize('Z')).toBe('Z');
    });

    it('should only capitalize first letter', () => {
      expect(capitalize('hello world')).toBe('Hello world');
      expect(capitalize('HELLO WORLD')).toBe('HELLO WORLD');
    });

    it('should handle special characters', () => {
      expect(capitalize('123abc')).toBe('123abc');
      expect(capitalize('!hello')).toBe('!hello');
    });
  });

  describe('toTitleCase', () => {
    it('should convert to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
      expect(toTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');
    });

    it('should handle single word', () => {
      expect(toTitleCase('hello')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(toTitleCase('')).toBe('');
    });

    it('should handle mixed case', () => {
      expect(toTitleCase('hELLo wORLD')).toBe('Hello World');
    });

    it('should handle special characters', () => {
      expect(toTitleCase('hello-world')).toBe('Hello-World');
      expect(toTitleCase('hello_world')).toBe('Hello_World');
    });
  });

  describe('toKebabCase', () => {
    it('should convert to kebab case', () => {
      expect(toKebabCase('Hello World')).toBe('hello-world');
      expect(toKebabCase('The Quick Brown Fox')).toBe('the-quick-brown-fox');
    });

    it('should handle camelCase', () => {
      expect(toKebabCase('camelCase')).toBe('camel-case');
      expect(toKebabCase('myVariableName')).toBe('my-variable-name');
    });

    it('should handle underscores', () => {
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(toKebabCase('hello  world')).toBe('hello-world');
    });

    it('should handle empty string', () => {
      expect(toKebabCase('')).toBe('');
    });
  });

  describe('toCamelCase', () => {
    it('should convert to camel case', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('the quick brown fox')).toBe('theQuickBrownFox');
    });

    it('should handle kebab case', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('my-variable-name')).toBe('myVariableName');
    });

    it('should handle underscores', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });

    it('should handle mixed separators', () => {
      expect(toCamelCase('hello-world_test case')).toBe('helloWorldTestCase');
    });

    it('should handle empty string', () => {
      expect(toCamelCase('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('This is a very long string', 10)).toBe('This is...');
      expect(truncate('Short', 10)).toBe('Short');
    });

    it('should handle custom suffix', () => {
      expect(truncate('This is a very long string', 10, '…')).toBe('This is a…');
    });

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('');
    });

    it('should handle zero length', () => {
      expect(truncate('Hello', 0)).toBe('...');
    });

    it('should handle negative length', () => {
      expect(truncate('Hello', -1)).toBe('...');
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello</p>')).toBe('Hello');
      expect(stripHtml('<div><span>Hello</span> World</div>')).toBe('Hello World');
    });

    it('should handle self-closing tags', () => {
      expect(stripHtml('Hello<br/>World')).toBe('HelloWorld');
      expect(stripHtml('Hello<img src="test.jpg"/>World')).toBe('HelloWorld');
    });

    it('should handle nested tags', () => {
      expect(stripHtml('<div><p><strong>Hello</strong></p></div>')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(stripHtml('')).toBe('');
    });

    it('should handle text without HTML', () => {
      expect(stripHtml('Hello World')).toBe('Hello World');
    });
  });

  describe('slugify', () => {
    it('should create valid slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('The Quick Brown Fox')).toBe('the-quick-brown-fox');
    });

    it('should handle special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
      expect(slugify('Hello & World')).toBe('hello-world');
    });

    it('should handle accented characters', () => {
      expect(slugify('Café & Résumé')).toBe('cafe-resume');
    });

    it('should handle numbers', () => {
      expect(slugify('Version 1.2.3')).toBe('version-1-2-3');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('should handle multiple spaces and dashes', () => {
      expect(slugify('hello  --  world')).toBe('hello-world');
    });
  });

  describe('getInitials', () => {
    it('should get initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Mary Smith')).toBe('JMS');
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('should handle empty string', () => {
      expect(getInitials('')).toBe('');
    });

    it('should handle extra spaces', () => {
      expect(getInitials('  John   Doe  ')).toBe('JD');
    });

    it('should handle lowercase names', () => {
      expect(getInitials('john doe')).toBe('JD');
    });

    it('should limit to 3 initials maximum', () => {
      expect(getInitials('John Mary Jane Doe')).toBe('JMJ');
      expect(getInitials('John Mary Jane Doe Smith')).toBe('JMJ'); // Only takes first 3
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.email@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user..name@domain.com')).toBe(false);
    });

    it('should handle empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(isValidEmail('   ')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with commas', () => {
      expect(formatNumber(1234)).toBe('1,234');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('should handle decimal numbers', () => {
      expect(formatNumber(1234.56)).toBe('1,234.56');
    });

    it('should handle negative numbers', () => {
      expect(formatNumber(-1234)).toBe('-1,234');
    });

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    it('should handle small numbers', () => {
      expect(formatNumber(123)).toBe('123');
    });
  });

  describe('generateRandomString', () => {
    it('should generate string of specified length', () => {
      expect(generateRandomString(10)).toHaveLength(10);
      expect(generateRandomString(20)).toHaveLength(20);
    });

    it('should generate different strings', () => {
      const str1 = generateRandomString(10);
      const str2 = generateRandomString(10);
      expect(str1).not.toBe(str2);
    });

    it('should handle zero length', () => {
      expect(generateRandomString(0)).toBe('');
    });

    it('should only contain valid characters', () => {
      const str = generateRandomString(100);
      expect(str).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });

  describe('isWhitespace', () => {
    it('should identify whitespace strings', () => {
      expect(isWhitespace('   ')).toBe(true);
      expect(isWhitespace('\t\n\r')).toBe(true);
      expect(isWhitespace('')).toBe(true);
    });

    it('should identify non-whitespace strings', () => {
      expect(isWhitespace('hello')).toBe(false);
      expect(isWhitespace('  hello  ')).toBe(false);
      expect(isWhitespace('a')).toBe(false);
    });
  });

  describe('countWords', () => {
    it('should count words correctly', () => {
      expect(countWords('hello world')).toBe(2);
      expect(countWords('the quick brown fox')).toBe(4);
    });

    it('should handle single word', () => {
      expect(countWords('hello')).toBe(1);
    });

    it('should handle empty string', () => {
      expect(countWords('')).toBe(0);
    });

    it('should handle multiple spaces', () => {
      expect(countWords('hello    world')).toBe(2);
    });

    it('should handle leading/trailing spaces', () => {
      expect(countWords('  hello world  ')).toBe(2);
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(escapeHtml('<div>Hello</div>')).toBe('&lt;div&gt;Hello&lt;/div&gt;');
      expect(escapeHtml('Hello & World')).toBe('Hello &amp; World');
    });

    it('should handle quotes', () => {
      expect(escapeHtml('Hello "World"')).toBe('Hello &quot;World&quot;');
      expect(escapeHtml("Hello 'World'")).toBe('Hello &#39;World&#39;');
    });

    it('should handle empty string', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle text without HTML', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });

    it('should handle multiple entities', () => {
      expect(escapeHtml('<p>Hello & "World"</p>')).toBe('&lt;p&gt;Hello &amp; &quot;World&quot;&lt;/p&gt;');
    });
  });
}); 