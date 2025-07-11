import { describe, it, expect } from 'vitest';
import {
  removeDuplicates,
  groupBy,
  sortBy,
  shuffle,
  chunk,
  union,
  intersection,
  difference,
  findLast,
  isEmpty,
  getRandomItem,
  moveItem,
  flatten,
  countOccurrences
} from '../../utils/array';

describe('Array Utilities', () => {
  describe('removeDuplicates', () => {
    it('should remove duplicate values', () => {
      expect(removeDuplicates([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(removeDuplicates(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty array', () => {
      expect(removeDuplicates([])).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
      expect(removeDuplicates([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should handle array with all duplicates', () => {
      expect(removeDuplicates([1, 1, 1, 1])).toEqual([1]);
    });

    it('should handle mixed data types', () => {
      expect(removeDuplicates([1, '1', 2, '2', 1])).toEqual([1, '1', 2, '2']);
    });
  });

  describe('groupBy', () => {
    it('should group objects by key', () => {
      const items = [
        { id: 1, category: 'A' },
        { id: 2, category: 'B' },
        { id: 3, category: 'A' },
        { id: 4, category: 'C' }
      ];

      const result = groupBy(items, 'category');
      expect(result).toEqual({
        A: [{ id: 1, category: 'A' }, { id: 3, category: 'A' }],
        B: [{ id: 2, category: 'B' }],
        C: [{ id: 4, category: 'C' }]
      });
    });

    it('should handle empty array', () => {
      expect(groupBy([], 'category')).toEqual({});
    });

    it('should handle single item', () => {
      const items = [{ id: 1, category: 'A' }];
      const result = groupBy(items, 'category');
      expect(result).toEqual({ A: [{ id: 1, category: 'A' }] });
    });

    it('should handle numeric keys', () => {
      const items = [
        { id: 1, score: 100 },
        { id: 2, score: 200 },
        { id: 3, score: 100 }
      ];

      const result = groupBy(items, 'score');
      expect(result).toEqual({
        '100': [{ id: 1, score: 100 }, { id: 3, score: 100 }],
        '200': [{ id: 2, score: 200 }]
      });
    });
  });

  describe('sortBy', () => {
    it('should sort by key in ascending order', () => {
      const items = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ];

      const result = sortBy(items, 'name');
      expect(result).toEqual([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ]);
    });

    it('should sort by key in descending order', () => {
      const items = [
        { id: 1, score: 100 },
        { id: 2, score: 300 },
        { id: 3, score: 200 }
      ];

      const result = sortBy(items, 'score', 'desc');
      expect(result).toEqual([
        { id: 2, score: 300 },
        { id: 3, score: 200 },
        { id: 1, score: 100 }
      ]);
    });

    it('should handle empty array', () => {
      expect(sortBy([], 'name')).toEqual([]);
    });

    it('should not mutate original array', () => {
      const items = [{ id: 2, name: 'Bob' }, { id: 1, name: 'Alice' }];
      const original = [...items];
      sortBy(items, 'name');
      expect(items).toEqual(original);
    });
  });

  describe('shuffle', () => {
    it('should return array with same elements', () => {
      const items = [1, 2, 3, 4, 5];
      const shuffled = shuffle(items);
      expect(shuffled).toHaveLength(items.length);
      expect(shuffled.sort()).toEqual(items.sort());
    });

    it('should not mutate original array', () => {
      const items = [1, 2, 3, 4, 5];
      const original = [...items];
      shuffle(items);
      expect(items).toEqual(original);
    });

    it('should handle empty array', () => {
      expect(shuffle([])).toEqual([]);
    });

    it('should handle single item', () => {
      expect(shuffle([1])).toEqual([1]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(chunk([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should handle chunk size larger than array', () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    it('should handle empty array', () => {
      expect(chunk([], 2)).toEqual([]);
    });

    it('should handle chunk size of 1', () => {
      expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
    });
  });

  describe('union', () => {
    it('should return unique values from multiple arrays', () => {
      expect(union([1, 2], [2, 3], [3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty arrays', () => {
      expect(union([], [1, 2], [])).toEqual([1, 2]);
    });

    it('should handle single array', () => {
      expect(union([1, 2, 3])).toEqual([1, 2, 3]);
    });

    it('should handle no arrays', () => {
      expect(union()).toEqual([]);
    });
  });

  describe('intersection', () => {
    it('should return common elements', () => {
      expect(intersection([1, 2, 3], [2, 3, 4], [3, 4, 5])).toEqual([3]);
      expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    });

    it('should handle no common elements', () => {
      expect(intersection([1, 2], [3, 4])).toEqual([]);
    });

    it('should handle empty arrays', () => {
      expect(intersection([], [1, 2])).toEqual([]);
      expect(intersection()).toEqual([]);
    });

    it('should handle single array', () => {
      expect(intersection([1, 2, 3])).toEqual([1, 2, 3]);
    });
  });

  describe('difference', () => {
    it('should return elements in first array but not second', () => {
      expect(difference([1, 2, 3, 4], [2, 4])).toEqual([1, 3]);
    });

    it('should handle no differences', () => {
      expect(difference([1, 2, 3], [1, 2, 3, 4])).toEqual([]);
    });

    it('should handle empty arrays', () => {
      expect(difference([], [1, 2])).toEqual([]);
      expect(difference([1, 2], [])).toEqual([1, 2]);
    });
  });

  describe('findLast', () => {
    it('should find last matching element', () => {
      const items = [1, 2, 3, 2, 4];
      expect(findLast(items, x => x === 2)).toBe(2);
      expect(findLast(items, x => x > 2)).toBe(4);
    });

    it('should return undefined if no match', () => {
      const items = [1, 2, 3];
      expect(findLast(items, x => x > 10)).toBeUndefined();
    });

    it('should handle empty array', () => {
      expect(findLast([], x => x === 1)).toBeUndefined();
    });

    it('should work with complex objects', () => {
      const items = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true }
      ];
      expect(findLast(items, x => x.active)).toEqual({ id: 3, active: true });
    });
  });

  describe('isEmpty', () => {
    it('should identify empty arrays', () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should identify non-empty arrays', () => {
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty([0])).toBe(false);
      expect(isEmpty([null])).toBe(false);
    });
  });

  describe('getRandomItem', () => {
    it('should return item from array', () => {
      const items = [1, 2, 3, 4, 5];
      const result = getRandomItem(items);
      expect(items).toContain(result);
    });

    it('should return undefined for empty array', () => {
      expect(getRandomItem([])).toBeUndefined();
    });

    it('should return single item from single-item array', () => {
      expect(getRandomItem([42])).toBe(42);
    });
  });

  describe('moveItem', () => {
    it('should move item to new position', () => {
      const items = [1, 2, 3, 4, 5];
      expect(moveItem(items, 0, 2)).toEqual([2, 3, 1, 4, 5]);
      expect(moveItem(items, 4, 1)).toEqual([1, 5, 2, 3, 4]);
    });

    it('should handle invalid indices', () => {
      const items = [1, 2, 3];
      expect(moveItem(items, 10, 1)).toEqual([1, 2, 3]);
      expect(moveItem(items, 1, 10)).toEqual([1, 3, 2]);
    });

    it('should not mutate original array', () => {
      const items = [1, 2, 3];
      const original = [...items];
      moveItem(items, 0, 1);
      expect(items).toEqual(original);
    });

    it('should handle empty array', () => {
      expect(moveItem([], 0, 1)).toEqual([]);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      expect(flatten([1, [2, 3], [4, [5, 6]]])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle already flat arrays', () => {
      expect(flatten([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('should handle empty arrays', () => {
      expect(flatten([])).toEqual([]);
      expect(flatten([[], [], []])).toEqual([]);
    });

    it('should handle deeply nested arrays', () => {
      expect(flatten([1, [2, [3, [4, 5]]]])).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('countOccurrences', () => {
    it('should count occurrences of each item', () => {
      expect(countOccurrences([1, 2, 2, 3, 3, 3])).toEqual({
        '1': 1,
        '2': 2,
        '3': 3
      });
    });

    it('should handle strings', () => {
      expect(countOccurrences(['a', 'b', 'a', 'c', 'b', 'a'])).toEqual({
        'a': 3,
        'b': 2,
        'c': 1
      });
    });

    it('should handle empty array', () => {
      expect(countOccurrences([])).toEqual({});
    });

    it('should handle single item', () => {
      expect(countOccurrences([1])).toEqual({ '1': 1 });
    });

    it('should handle mixed types', () => {
      expect(countOccurrences([1, '1', 2, '2', 1])).toEqual({
        '1': 2,
        '2': 1
      });
    });
  });
}); 