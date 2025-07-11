import { describe, it, expect } from 'vitest';
import { cn } from '../../../utils/cn';

describe('cn utility', () => {
  describe('Basic functionality', () => {
    it('should join string classes', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('should handle single class', () => {
      expect(cn('single')).toBe('single');
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle multiple string classes', () => {
      expect(cn('a', 'b', 'c', 'd')).toBe('a b c d');
    });
  });

  describe('Falsy values', () => {
    it('should filter out undefined values', () => {
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
    });

    it('should filter out null values', () => {
      expect(cn('class1', null, 'class2')).toBe('class1 class2');
    });

    it('should filter out false values', () => {
      expect(cn('class1', false, 'class2')).toBe('class1 class2');
    });

    it('should filter out empty strings', () => {
      expect(cn('class1', '', 'class2')).toBe('class1 class2');
    });

    it('should handle all falsy values', () => {
      expect(cn(undefined, null, false, '', 0)).toBe('');
    });
  });

  describe('Number values', () => {
    it('should convert numbers to strings', () => {
      expect(cn('class1', 123, 'class2')).toBe('class1 123 class2');
    });

    it('should handle zero as falsy', () => {
      expect(cn('class1', 0, 'class2')).toBe('class1 class2');
    });

    it('should handle negative numbers', () => {
      expect(cn('class1', -5, 'class2')).toBe('class1 -5 class2');
    });
  });

  describe('Array values', () => {
    it('should handle nested arrays', () => {
      expect(cn('class1', ['class2', 'class3'], 'class4')).toBe('class1 class2 class3 class4');
    });

    it('should handle empty arrays', () => {
      expect(cn('class1', [], 'class2')).toBe('class1 class2');
    });

    it('should handle deeply nested arrays', () => {
      expect(cn('class1', ['class2', ['class3', 'class4']], 'class5')).toBe('class1 class2 class3 class4 class5');
    });

    it('should handle arrays with falsy values', () => {
      expect(cn('class1', ['class2', null, undefined, 'class3'], 'class4')).toBe('class1 class2 class3 class4');
    });

    it('should handle arrays with numbers', () => {
      expect(cn('class1', ['class2', 123, 'class3'], 'class4')).toBe('class1 class2 123 class3 class4');
    });
  });

  describe('Mixed types', () => {
    it('should handle mixed strings, numbers, and arrays', () => {
      expect(cn('class1', 42, ['class2', 'class3'], 'class4')).toBe('class1 42 class2 class3 class4');
    });

    it('should handle complex nested structure', () => {
      expect(cn(
        'base',
        true && 'conditional',
        false && 'hidden',
        ['array1', 'array2'],
        123,
        null,
        undefined,
        ['nested', ['deep', 'deeper']]
      )).toBe('base conditional array1 array2 123 nested deep deeper');
    });
  });

  describe('Edge cases', () => {
    it('should join classes with whitespace', () => {
      expect(cn('  class1  ', '  class2  ')).toBe('class1     class2');
    });

    it('should handle boolean true values', () => {
      expect(cn('class1', true, 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const condition = true;
      expect(cn('base', condition && 'active')).toBe('base active');
    });

    it('should handle conditional classes that are false', () => {
      const condition = false;
      expect(cn('base', condition && 'active')).toBe('base');
    });
  });
}); 